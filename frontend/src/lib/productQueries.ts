import { QueryClient } from '@tanstack/react-query';
import type { ProductItem, SubcategoryItem } from '../types';
import type { SortOption } from './catalogUtils';
import { apiListing, apiResolve, catalogRequest } from './catalogApi';
import { mediaUrl } from './api';

export const productQueryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, gcTime: 5 * 60_000, retry: 1, refetchOnWindowFocus: true } } });
// Retained for the legacy catalog measurement script.
export const PRODUCT_COLUMNS = 'id,slug,name,title,subtitle,price,sale_price,original_price,mrp,category_id,category,subcategory_id,subcategory,badge,badges,rating,reviews_count,material,stone,variants,description,in_stock,quantity,stock,status,created_at';
export const PRODUCT_PAGE_SIZE = 20;
export const PRODUCT_REFRESH_MS = 30_000;
export const productReadPolicy = { staleTime: PRODUCT_REFRESH_MS, refetchInterval: PRODUCT_REFRESH_MS, refetchIntervalInBackground: false, refetchOnWindowFocus: true, refetchOnReconnect: true } as const;
export const productImagePolicy = { staleTime: 30 * 60_000, gcTime: 5 * 60_000, refetchOnWindowFocus: false, refetchOnReconnect: false, refetchInterval: false } as const;
export interface ProductPage { products: ProductItem[]; count: number }
export interface ListingOptions { page?: number; pageSize?: number; sort?: SortOption; categoryId?: string; subcategory?: SubcategoryItem; signal?: AbortSignal }
export function getPaginatedProducts(options: ListingOptions = {}): Promise<ProductPage> {
  return apiListing({ page: options.page, pageSize: options.pageSize, sort: options.sort, categoryId: options.categoryId, subcategoryId: options.subcategory?.id }, options.signal);
}
export const getProductsByCategory = (categoryId: string, options: ListingOptions = {}) => getPaginatedProducts({ ...options, categoryId });
export const getProductsBySubcategory = (categoryId: string, subcategory: SubcategoryItem, options: ListingOptions = {}) => getPaginatedProducts({ ...options, categoryId, subcategory });
export const getProductsByIds = (ids: string[], signal?: AbortSignal) => apiResolve(ids, signal);
export async function getProductByIdOrSlug(id: string, signal?: AbortSignal) { return (await getProductsByIds([id], signal))[0] || null; }
export async function getFeaturedProducts(signal?: AbortSignal) {
  const featured = await apiListing({ featured: true, pageSize: 4 }, signal);
  if (featured.products.length >= 4) return featured.products.slice(0, 4);
  const latest = await apiListing({ pageSize: 8, sort: 'newest' }, signal);
  const merged = [...featured.products];
  for (const product of latest.products) {
    if (merged.length >= 4) break;
    if (!merged.some((item) => item.id === product.id)) merged.push(product);
  }
  return merged;
}
export async function getRelatedProducts(product: ProductItem, signal?: AbortSignal) {
  const page = await getPaginatedProducts({ categoryId: product.categoryId, pageSize: 5, signal });
  return page.products.filter(item => item.id !== product.id).slice(0, 4);
}
export async function searchProducts(text: string, signal?: AbortSignal) { return text.trim() ? (await apiListing({ q: text.trim(), pageSize: 100 }, signal)).products : []; }
export async function getProductImage(id: string, signal?: AbortSignal): Promise<string> { return mediaUrl((await catalogRequest('products/' + encodeURIComponent(id), signal)).product.image_url); }
export async function invalidateProductQueries() {
  await productQueryClient.cancelQueries({ queryKey: ['products'] });
  await productQueryClient.invalidateQueries({ queryKey: ['products'] });
}
