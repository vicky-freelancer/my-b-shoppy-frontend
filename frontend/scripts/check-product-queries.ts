import assert from 'node:assert/strict';
import { QueryObserver, focusManager } from '@tanstack/react-query';
// @ts-ignore -- shared plain JS fixture also used by the browser suite.
import { products, respond, subcategories } from '../../scripts/product-fixtures.mjs';
import { getPaginatedProducts, getProductsByCategory, getProductsBySubcategory,
  getProductByIdOrSlug, getProductsByIds, getFeaturedProducts, getRelatedProducts,
  searchProducts, getProductImage, getProductIndex, invalidateProductQueries,
  productQueryClient, productImagePolicy } from '../src/lib/productQueries';
import { mapProductRow } from '../src/lib/supabaseClient';

const calls: URL[] = [];
let rows: any[] = products.map(row => ({ ...row }));
let rangeFailure = false;
let beforePayload: (() => void) | undefined;
let maxApiRows = 1000;
Object.assign(globalThis, { window: { fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = new URL(String(input));
  calls.push(url);
  if (init?.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  if (url.searchParams.get('select')?.includes('variants') && beforePayload) {
    const mutate = beforePayload; beforePayload = undefined; mutate();
  }
  if (rangeFailure && Number(url.searchParams.get('offset')) > 0) {
    return new Response(JSON.stringify({ message: 'Requested range not satisfiable' }), { status: 416 });
  }
  const limited = new URL(url);
  limited.searchParams.set('limit', String(Math.min(Number(url.searchParams.get('limit') || maxApiRows), maxApiRows)));
  const result = respond(limited.href, rows);
  return new Response(init?.method === 'HEAD' ? null : JSON.stringify(result.status === 416
    ? { message: 'Requested range not satisfiable' } : result.rows), { status: result.status, headers: result.headers });
} } });

const options = { queryKey: ['products', 'listing', 'test'], queryFn: ({ signal }: { signal: AbortSignal }) => getPaginatedProducts({ signal }) };
const [first, duplicate] = await Promise.all([productQueryClient.fetchQuery(options), productQueryClient.fetchQuery(options)]);
assert.equal(first, duplicate);
assert.equal(first.count, 47);
assert.equal(first.products.length, 20);
assert.equal(calls.length, 1, 'one deduplicated paginated listing request, no index');
assert.equal(first.products[0].id, 'fixture-47');
const countBeforeCache = calls.length;
await productQueryClient.fetchQuery(options);
assert.equal(calls.length, countBeforeCache, 'fresh listing must not refetch');
const second = await getPaginatedProducts({ page: 2 });
assert.equal(second.products.length, 20);
assert.equal(second.products[0].id, 'fixture-27');
assert.equal(new Set([...first.products, ...second.products].map(p => p.id)).size, 40);
assert.equal((await getPaginatedProducts({ page: 3 })).products.length, 7);
assert.equal((await getPaginatedProducts({ page: 9 })).products.length, 0);
rangeFailure = true;
assert.deepEqual(await getPaginatedProducts({ page: 9 }), { products: [], count: 47 });
rangeFailure = false;
assert.equal((await getProductsByCategory('ad-jewellery')).count, 35);
assert.equal((await getProductsBySubcategory('ad-jewellery', { ...subcategories[0], categoryId: 'ad-jewellery', featuredImage: '', isActive: true, sortOrder: 0 })).count, 11);
assert.equal((await getPaginatedProducts({ sort: 'price-asc' })).products[0].price, 10);
assert.equal((await getProductByIdOrSlug('fixture-1'))?.id, 'fixture-1');
assert.equal((await getProductByIdOrSlug('1'))?.id, 'fixture-1');
assert.equal(await getProductByIdOrSlug('missing'), null);
assert.deepEqual((await getProductsByIds(['fixture-3', 'fixture-1'])).map(p => p.id), ['fixture-3', 'fixture-1']);
assert.equal((await getProductsByIds([])).length, 0);
assert.equal((await getFeaturedProducts()).length, 4);
const detail = (await getProductByIdOrSlug('fixture-1'))!;
assert.deepEqual(detail.variants, ['Gold', 'Silver']);
assert.equal(detail.price, 10);
assert.equal((await getProductByIdOrSlug('fixture-2'))?.inStock, false);
assert.ok((await getRelatedProducts(detail)).every(p => p.id !== detail.id && p.categoryId === detail.categoryId));
assert.deepEqual((await searchProducts('unique description needle')).map(p => p.id), ['fixture-1']);
await searchProducts('Crystal');
assert.equal(calls.filter(url => url.searchParams.get('select') === 'id,description').length, 0,
  'search descriptions must be read together with current membership');
assert.equal((await searchProducts('  ')).length, 0);
assert.equal((await getProductImage('1')).startsWith('data:'), true);
assert.ok(calls.every(url => url.searchParams.get('select') !== '*'), 'application reads must use explicit columns');
assert.ok(calls.filter(url => url.searchParams.get('select')?.includes('variants')).every(url => Number(url.searchParams.get('limit')) <= 100));
const controller = new AbortController(); controller.abort();
await assert.rejects(getPaginatedProducts({ signal: controller.signal }));

// Legacy effective prices, alias IDs, punctuation-insensitive collections,
// stock flags, variant formats, and ordering must retain old adapter semantics.
productQueryClient.clear();
rows = [
  { ...products[0], price: 0, sale_price: 777, category_id: 'rings', variants: '{Gold,Silver}' },
  { ...products[1], price: 5, sale_price: 5, category_id: 'artificial-jewels' },
];
const legacy = await getProductsByCategory('ad-jewellery', { sort: 'price-asc' });
assert.equal(legacy.count, 2);
assert.deepEqual(legacy.products.map(p => p.price), [5, 777]);
assert.deepEqual(legacy.products[1].variants, ['Gold', 'Silver']);
rows[0].created_at = null;
productQueryClient.clear();
assert.equal((await getFeaturedProducts())[0].id, 'fixture-1', 'legacy newest order retains PostgreSQL NULLS FIRST');
assert.equal(mapProductRow({ id: 1, stock: 0 }).inStock, false);
assert.deepEqual(mapProductRow({ id: 1, variants: '["Rose","Gold"]' }).variants, ['Rose', 'Gold']);

// Category/subcategory moves between reads must not reuse cached membership.
productQueryClient.clear();
rows = [{ ...products[0] }];
assert.equal((await getProductsByCategory('ad-jewellery')).count, 1);
rows[0].category_id = 'hair-accessories';
assert.deepEqual(await getProductsByCategory('ad-jewellery'), { products: [], count: 0 });
assert.equal((await getProductsByCategory('hair-accessories')).count, 1);
const collection = { ...subcategories[0], categoryId: 'ad-jewellery', featuredImage: '', isActive: true, sortOrder: 0 };
rows[0].category_id = 'ad-jewellery';
assert.equal((await getProductsBySubcategory('ad-jewellery', collection)).count, 1);
rows[0].subcategory_id = '22222222-2222-4222-8222-222222222222'; rows[0].subcategory = collection.name;
assert.equal((await getProductsBySubcategory('ad-jewellery', collection)).count, 0);
assert.equal((await getProductsBySubcategory('ad-jewellery', { ...collection, id: rows[0].subcategory_id, name: 'New collection', slug: 'new-collection' })).count, 1);
rows[0].subcategory_id = null;
assert.equal((await getProductsBySubcategory('ad-jewellery', collection)).count, 1, 'text-only legacy collections still match');
// A move between the metadata and payload HTTP requests gets a bounded retry.
rows = [{ ...products[0] }];
beforePayload = () => { rows[0].category_id = 'hair-accessories'; };
assert.deepEqual(await getProductsByCategory('ad-jewellery'), { products: [], count: 0 });

// Realistic HTTP 416 and short fallback pages after concurrent deletion.
for (const sort of ['newest', 'price-asc', 'price-desc', 'rating', 'popular'] as const) {
  rows = products.slice(0, 25).map(row => ({ ...row }));
  await getProductsByCategory('ad-jewellery', { sort });
  productQueryClient.setQueryData(['products', 'listing', 'old-page'], { products: rows, count: 25 });
  beforePayload = () => { rows = rows.slice(0, 10); };
  assert.deepEqual(await getProductsByCategory('ad-jewellery', { sort, page: 2 }), { products: [], count: 10 });
  assert.equal(productQueryClient.getQueryData(['products', 'listing', 'old-page']), undefined,
    'clamping must not restore an inactive cached page containing deleted products');
  assert.equal((await getProductsByCategory('ad-jewellery', { sort })).products.length, 10);
}
rows = products.slice(0, 25).map(row => ({ ...row, subcategory_id: collection.id }));
beforePayload = () => { rows = []; };
assert.deepEqual(await getProductsBySubcategory('ad-jewellery', collection, { page: 2 }), { products: [], count: 0 });
rows = products.slice(0, 25).map(row => ({ ...row, price: 0 }));
beforePayload = () => { rows = rows.slice(0, 10); };
assert.deepEqual(await getProductsByCategory('ad-jewellery', { sort: 'price-asc', page: 2 }), { products: [], count: 10 });

// Search: additions, deletions, edits, and independently aged outer caches.
productQueryClient.clear();
rows = [{ ...products[0], description: 'old needle' }];
assert.equal((await searchProducts('old needle')).length, 1);
rows.push({ ...products[1], description: 'new unique needle' });
assert.deepEqual((await searchProducts('new unique needle')).map(p => p.id), ['fixture-2']);
rows[0].description = 'updated needle';
assert.equal((await searchProducts('old needle')).length, 0);
assert.equal((await searchProducts('updated needle')).length, 1);
const searchOptions = { queryKey: ['products', 'search', 'updated needle'], queryFn: () => searchProducts('updated needle') };
await productQueryClient.fetchQuery(searchOptions);
rows = rows.slice(1);
productQueryClient.getQueryCache().find({ queryKey: searchOptions.queryKey, exact: true })!
  .setState({ dataUpdatedAt: Date.now() - 31_000 });
assert.deepEqual(await productQueryClient.fetchQuery(searchOptions), []);
beforePayload = () => { rows[0].description = 'no longer matches'; };
assert.equal((await searchProducts('new unique needle')).length, 0);

// Active mutation invalidation refreshes membership and images. Image focus
// events never cause automatic refetches, even when a long-lived image is stale.
productQueryClient.clear();
rows = [{ ...products[0] }];
productQueryClient.mount();
const listingObserver = new QueryObserver(productQueryClient, {
  queryKey: ['products', 'listing', 'active-mutation'], queryFn: () => getProductsByCategory('ad-jewellery'),
});
const unsubscribeListing = listingObserver.subscribe(() => {});
await listingObserver.refetch();
assert.equal(listingObserver.getCurrentResult().data?.count, 1);
const imageObserver = new QueryObserver(productQueryClient, {
  ...productImagePolicy, queryKey: ['products', 'image', '1'], queryFn: ({ signal }) => getProductImage('1', signal),
});
const unsubscribeImage = imageObserver.subscribe(() => {});
await imageObserver.refetch();
const imageCalls = () => calls.filter(url => url.searchParams.get('select') === 'id,image_url').length;
const imageCallsBeforeFocus = imageCalls();
productQueryClient.getQueryCache().find({ queryKey: ['products', 'image', '1'], exact: true })!
  .setState({ dataUpdatedAt: Date.now() - 31 * 60_000 });
focusManager.setFocused(false); focusManager.setFocused(true);
await new Promise(resolve => setTimeout(resolve, 0));
assert.equal(imageCalls(), imageCallsBeforeFocus, 'even stale images must not refetch on focus');
rows[0].category_id = 'hair-accessories'; rows[0].image_url = 'data:image/jpeg;base64,new-fixture';
await invalidateProductQueries();
assert.equal(listingObserver.getCurrentResult().data?.count, 0);
assert.equal(imageObserver.getCurrentResult().data, rows[0].image_url);
assert.equal(imageCalls(), imageCallsBeforeFocus + 1);
unsubscribeListing(); unsubscribeImage(); productQueryClient.unmount(); focusManager.setFocused(undefined);

// More than the API cap: the index must read every chunk, preserving counts.
productQueryClient.clear();
rows = Array.from({ length: 1203 }, (_, i) => ({ ...products[0], id: i + 1, slug: `large-${i + 1}` }));
maxApiRows = 100;
assert.equal((await getProductIndex()).length, 1203);
await invalidateProductQueries();
assert.equal(productQueryClient.getQueryData(['products', 'index']), undefined);
productQueryClient.clear();
console.log('Product query regressions passed: pagination, counts, sorting, aliases, details, search, featured, related, wishlist IDs, variants, prices, stock, deduplication, freshness, cancellation and row caps.');
