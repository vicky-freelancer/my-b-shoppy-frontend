import { QueryClient } from '@tanstack/react-query';
import { STORE_CONFIG } from '../storeConfig';
import { ProductItem, SubcategoryItem } from '../types';
import { getSupabaseClient, mapProductRow } from './supabaseClient';
import { SortOption } from './catalogUtils';
import { mariaCatalogEnabled,apiListing,apiResolve,catalogRequest } from './catalogApi';
import { mediaUrl } from './api';

export const productQueryClient = new QueryClient({ defaultOptions: { queries: {
  staleTime: 30_000, gcTime: 5 * 60_000, retry: 1, refetchOnWindowFocus: true,
} } });
export const PRODUCT_PAGE_SIZE = 20;
export const PRODUCT_REFRESH_MS = 30_000;
// Apply only to mounted product-data views, never globally or to images.
export const productReadPolicy = {
  staleTime: PRODUCT_REFRESH_MS, refetchInterval: PRODUCT_REFRESH_MS,
  refetchIntervalInBackground: false, refetchOnWindowFocus: true, refetchOnReconnect: true,
} as const;
export const productImagePolicy = {
  staleTime: 30 * 60_000, gcTime: 5 * 60_000,
  refetchOnWindowFocus: false, refetchOnReconnect: false, refetchInterval: false,
} as const;
// Verified against the public product response. Exclude both large image columns.
export const PRODUCT_COLUMNS = 'id,slug,name,title,subtitle,price,sale_price,original_price,mrp,category_id,category,subcategory_id,subcategory,badge,badges,rating,reviews_count,material,stone,variants,description,in_stock,quantity,stock,status,created_at';
const INDEX_COLUMNS = 'id,slug,name,title,price,sale_price,category_id,category,subcategory_id,subcategory,badge,badges,rating,reviews_count,material,stone,created_at';
type IndexedProduct = { row: Record<string, any>; product: ProductItem };
export interface ProductPage { products: ProductItem[]; count: number }
export interface ListingOptions {
  page?: number; pageSize?: number; sort?: SortOption; categoryId?: string;
  subcategory?: SubcategoryItem; signal?: AbortSignal;
}

function table() {
  const client = getSupabaseClient();
  if (!client) throw new Error('Product service is unavailable');
  return client.from(STORE_CONFIG.supabase.productsTableName || 'products');
}
function mapped(row: Record<string, any>): ProductItem {
  return { ...mapProductRow(row), imageUrl: '', imageProductId: String(row.id) };
}
async function execute(query: any, signal?: AbortSignal) {
  const { data, error, status } = await (signal ? query.abortSignal(signal) : query);
  if (error) throw new ProductReadError(error.message, status);
  return (data || []) as Record<string, any>[];
}
class ProductReadError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}
function discardInactiveListingPages() {
  // When clamping to an earlier page after a mutation, do not resurrect an old
  // cached page with deleted products/counts. Never cancel the current fetch.
  productQueryClient.removeQueries({ queryKey: ['products', 'listing'], type: 'inactive',
    predicate: query => query.state.fetchStatus === 'idle' });
}

// Listing metadata excludes images, descriptions, variants and inventory; search
// opts into descriptions in the same read. Required
// for the existing slug/category aliases and effective-price fallback semantics.
// Read in bounded chunks so the PostgREST row cap cannot silently truncate it.
export async function getProductIndex(signal?: AbortSignal, descriptions = false): Promise<IndexedProduct[]> {
  const rows: Record<string, any>[] = [];
  for (let offset = 0; ;) {
    const query = table().select(INDEX_COLUMNS + (descriptions ? ',description' : ''), { count: 'exact' }).order('id').range(offset, offset + 499);
    const result = await (signal ? query.abortSignal(signal) : query);
    if (result.error) throw new ProductReadError(result.error.message, result.status);
    const batch = result.data || [];
    rows.push(...batch);
    if (result.count === null) throw new Error('Product count was not returned');
    if (rows.length >= result.count) break;
    if (!batch.length) throw new Error('Product catalog changed during loading. Please try again.');
    offset += batch.length;
  }
  if (new Set(rows.map(row => String(row.id))).size !== rows.length) {
    throw new CatalogChanged('Product catalog changed during loading. Please try again.');
  }
  return rows.map(row => ({ row, product: mapped(row) }));
}
function index(descriptions = false) {
  // A cached UI result may live for 30 seconds, but a new network read must not
  // combine older membership/sort metadata with newer product payloads. Keep
  // in-flight deduplication while revalidating metadata on every dependent read.
  return productQueryClient.fetchQuery({ queryKey: ['products', 'index', descriptions ? 'search' : 'catalog'],
    queryFn: ({ signal }) => getProductIndex(signal, descriptions), staleTime: 0 });
}
const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '');
export function matchesSubcategory(product: ProductItem, subcategory: SubcategoryItem): boolean {
  // A current foreign key wins over an old display label after an admin move.
  // Text-only legacy products still match ID/name/slug with old punctuation.
  if (product.subcategoryId) return product.subcategoryId === subcategory.id;
  return !!product.subcategory &&
    [subcategory.id, subcategory.name, subcategory.slug].some(value => normalize(product.subcategory!) === normalize(value));
}
function sorted(items: IndexedProduct[], sort: SortOption) {
  return [...items].sort((a, b) => {
    const x = a.product, y = b.product;
    const xTime = Date.parse(x.created_at || ''), yTime = Date.parse(y.created_at || '');
    // Match PostgreSQL's default DESC NULLS FIRST for the legacy newest order.
    const newest = !Number.isFinite(xTime) ? (!Number.isFinite(yTime) ? 0 : -1)
      : !Number.isFinite(yTime) ? 1 : yTime - xTime;
    const order = sort === 'price-asc' ? x.price - y.price : sort === 'price-desc' ? y.price - x.price
      : sort === 'rating' ? y.rating - x.rating : sort === 'popular' ? y.reviewsCount - x.reviewsCount
      : newest;
    const aId = String(a.row.id), bId = String(b.row.id);
    const tie = /^\d+$/.test(aId) && /^\d+$/.test(bId)
      ? (BigInt(aId) < BigInt(bId) ? 1 : BigInt(aId) > BigInt(bId) ? -1 : 0)
      : (aId < bId ? 1 : aId > bId ? -1 : 0);
    return order || tie;
  });
}

async function rowsByIds(ids: string[], signal?: AbortSignal): Promise<ProductItem[]> {
  const products: ProductItem[] = [];
  for (let offset = 0; offset < ids.length; offset += 100) {
    const chunk = ids.slice(offset, offset + 100);
    products.push(...(await execute(table().select(PRODUCT_COLUMNS).in('id', ids.slice(offset, offset + 100))
      .order('id').range(0, chunk.length - 1), signal)).map(mapped));
  }
  const positions = new Map(ids.map((id, i) => [id, i]));
  return products.sort((a, b) => positions.get(a.imageProductId!)! - positions.get(b.imageProductId!)!);
}

export async function getPaginatedProducts(options: ListingOptions = {}): Promise<ProductPage> {
  if(mariaCatalogEnabled())return apiListing({page:options.page,pageSize:options.pageSize,sort:options.sort,categoryId:options.categoryId,subcategoryId:options.subcategory?.id},options.signal);
  // Catalog edits can race the two compatibility reads. Retry once from fresh
  // metadata; never publish a page with incorrect membership or a short count.
  for (let attempt = 0; attempt < 2; attempt++) {
    try { return await readProductPage(options); }
    catch (error) {
      if (attempt || !(error instanceof CatalogChanged || error instanceof ProductReadError && error.status === 416)) throw error;
      discardInactiveListingPages();
      options.signal?.throwIfAborted();
    }
  }
  throw new Error('Product catalog changed during loading. Please try again.');
}
class CatalogChanged extends Error {}

async function readProductPage(options: ListingOptions): Promise<ProductPage> {
  const { page = 1, pageSize = PRODUCT_PAGE_SIZE, sort = 'newest', categoryId, subcategory, signal } = options;
  const size = Math.max(1, Math.min(100, pageSize));
  const offset = (Math.max(1, page) - 1) * size;
  // The common shop entry point needs just one bounded request. Exact counts
  // travel in response headers and share the listing's 30-second cache.
  if (!categoryId && !subcategory && sort === 'newest') {
    const query = table().select(PRODUCT_COLUMNS, { count: 'exact' })
      .order('created_at', { ascending: false }).order('id', { ascending: false }).range(offset, offset + size - 1);
    const result = await (signal ? query.abortSignal(signal) : query);
    if (result.status === 416) {
      discardInactiveListingPages();
      const countQuery = table().select('id', { count: 'exact', head: true });
      const countResult = await (signal ? countQuery.abortSignal(signal) : countQuery);
      if (countResult.error) throw new Error(countResult.error.message);
      if (countResult.count === null) throw new Error('Product count was not returned');
      if (offset >= countResult.count) return { products: [], count: countResult.count };
      throw new CatalogChanged('Product catalog changed during loading. Please try again.');
    }
    if (result.error) throw new Error(result.error.message);
    if (result.count === null) throw new Error('Product count was not returned');
    return { products: (result.data || []).map(mapped), count: result.count };
  }
  const all = await index();
  signal?.throwIfAborted();
  const items = all.filter(({ product }) => (!categoryId || product.categoryId === categoryId) &&
    (!subcategory || matchesSubcategory(product, subcategory)));
  if (!items.length || offset >= items.length) {
    if (offset > 0) discardInactiveListingPages();
    return { products: [], count: items.length };
  }

  const column = sort.startsWith('price') ? 'price' : sort === 'rating' ? 'rating' : sort === 'popular' ? 'reviews_count' : 'created_at';
  // Use native database ordering when it equals the adapter's effective values.
  // Legacy rows can have price=0 with sale_price>0 or NULL ratings. Preserve
  // their old semantics via the small index, never by downloading full products.
  const native = column === 'created_at' || items.every(({ row, product }) =>
    row[column] != null && Number(row[column]) === (column === 'price' ? product.price : column === 'rating' ? product.rating : product.reviewsCount));
  const filtered = !!categoryId || !!subcategory;
  let products: ProductItem[];
  if (native && (!filtered || items.length <= 100)) {
    let query = table().select(PRODUCT_COLUMNS);
    if (filtered) query = query.in('id', items.map(item => String(item.row.id)));
    const rows = await execute(query.order(column, { ascending: sort === 'price-asc' })
      .order('id', { ascending: false }).range(offset, offset + size - 1), signal);
    products = rows.map(mapped);
  } else {
    const ids = sorted(items, sort).slice(offset, offset + size).map(item => String(item.row.id));
    products = await rowsByIds(ids, signal);
  }
  const source = new Map(items.map(item => [String(item.row.id), item.product]));
  if (products.length !== Math.min(size, items.length - offset) || products.some(product => {
    const previous = source.get(product.imageProductId!);
    return !previous || product.categoryId !== previous.categoryId || product.subcategoryId !== previous.subcategoryId ||
      product.subcategory !== previous.subcategory || product.price !== previous.price ||
      product.rating !== previous.rating || product.reviewsCount !== previous.reviewsCount || product.created_at !== previous.created_at;
  })) throw new CatalogChanged('Product catalog changed during loading. Please try again.');
  return { products, count: items.length };
}

export const getProductsByCategory = (categoryId: string, options: ListingOptions = {}) =>
  getPaginatedProducts({ ...options, categoryId });
export const getProductsBySubcategory = (categoryId: string, subcategory: SubcategoryItem, options: ListingOptions = {}) =>
  getPaginatedProducts({ ...options, categoryId, subcategory });

export async function getProductsByIds(ids: string[], signal?: AbortSignal) {
  if(mariaCatalogEnabled())return apiResolve(ids,signal);
  if (!ids.length) return [];
  const products: ProductItem[] = [];
  const unique = [...new Set(ids)];
  for (let offset = 0; offset < unique.length; offset += 100) {
    const chunk = unique.slice(offset, offset + 100);
    const bySlug = await execute(table().select(PRODUCT_COLUMNS).in('slug', chunk).order('id').range(0, 99), signal);
    const unresolved = chunk.filter(id => !bySlug.some(row => row.slug === id) &&
      (/^\d+$/.test(id) || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)));
    const byId = unresolved.length ? await execute(table().select(PRODUCT_COLUMNS).in('id', unresolved).order('id').range(0, 99), signal) : [];
    const rows = [...bySlug, ...byId];
    products.push(...chunk.flatMap(id => {
      const row = rows.find(row => row.slug === id) || rows.find(row => String(row.id) === id);
      return row ? [mapped(row)] : [];
    }));
  }
  return products;
}
export async function getProductByIdOrSlug(id: string, signal?: AbortSignal) {
  return (await getProductsByIds([id], signal))[0] || null;
}
export async function getFeaturedProducts(signal?: AbortSignal) {
  if(mariaCatalogEnabled()){const result=await apiListing({featured:true,pageSize:4},signal);return result.products.length?result.products:(await apiListing({pageSize:4},signal)).products;}
  const entries = sorted(await index(), 'newest');
  const featured = entries.filter(({ product }) => product.badge && ['BESTSELLER', 'NEW', 'EXCLUSIVE'].includes(product.badge));
  return rowsByIds((featured.length ? featured : entries).slice(0, 4).map(item => String(item.row.id)), signal);
}
export async function getRelatedProducts(product: ProductItem, signal?: AbortSignal) {
  const page = await getPaginatedProducts({ categoryId: product.categoryId, pageSize: 5, signal });
  return page.products.filter(item => item.id !== product.id).slice(0, 4);
}
export async function searchProducts(text: string, signal?: AbortSignal) {
  if(mariaCatalogEnabled())return text.trim()?(await apiListing({q:text.trim(),pageSize:100},signal)).products:[];
  const query = text.trim().toLowerCase();
  if (!query) return [];
  // Descriptions are read only when searching. Avoid interpolating user input
  // into PostgREST's filter grammar; retain literal substring semantics.
  // Membership, searchable fields and descriptions come from the same read.
  // There is no independently expiring description cache to omit new products.
  const entries = await index(true);
  signal?.throwIfAborted();
  const matches = (product: ProductItem) => [product.name, product.category, product.material, product.stone, product.description]
    .some(value => value?.toLowerCase().includes(query));
  const ids = sorted(entries, 'newest').filter(({ row, product }) => matches({ ...product, description: row.description || '' }))
    .map(item => String(item.row.id));
  // A deletion or description edit during payload loading must not produce
  // stale search matches. New additions are visible on the next bounded read.
  return (await rowsByIds(ids, signal)).filter(matches);
}

export async function getProductImage(id: string, signal?: AbortSignal): Promise<string> {
  if(mariaCatalogEnabled())return mediaUrl((await catalogRequest('products/'+encodeURIComponent(id),signal)).product.image_url);
  const rows = await execute(table().select('id,image_url').eq('id', id).limit(1), signal);
  if (!rows[0]) return '';
  if (rows[0].image_url) return rows[0].image_url;
  const fallback = await execute(table().select('cover_image').eq('id', id).limit(1), signal);
  return fallback[0]?.cover_image || mapProductRow({}).imageUrl;
}

export async function invalidateProductQueries() {
  // Cancel old reads before invalidating so late responses cannot repopulate
  // pre-update data. Catalog metadata must refresh before dependent listings.
  await productQueryClient.cancelQueries({ queryKey: ['products'] });
  await productQueryClient.invalidateQueries({ queryKey: ['products', 'index'], refetchType: 'none' });
  await productQueryClient.invalidateQueries({ queryKey: ['products'] });
}
