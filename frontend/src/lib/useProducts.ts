import { useQuery } from '@tanstack/react-query';
import { getPaginatedProducts, ListingOptions, productReadPolicy } from './productQueries';

export function useProductListing(options: ListingOptions, enabled = true) {
  return useQuery({
    ...productReadPolicy,
    queryKey: ['products', 'listing', options.categoryId || '', options.subcategory
      ? [options.subcategory.id, options.subcategory.name, options.subcategory.slug] : null,
      options.sort || 'newest', options.page || 1, options.pageSize || 20],
    queryFn: ({ signal }) => getPaginatedProducts({ ...options, signal }), enabled,
  });
}
