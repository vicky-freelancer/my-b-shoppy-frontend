import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { getPaginatedProducts, ListingOptions, productReadPolicy } from './productQueries';

export function productListingKey(options: ListingOptions) {
  return ['products', 'listing', options.categoryId || '', options.subcategory
    ? [options.subcategory.id, options.subcategory.name, options.subcategory.slug] : null,
    options.sort || 'newest', options.page || 1, options.pageSize || 20] as const;
}

export function useProductListing(options: ListingOptions, enabled = true) {
  return useQuery({
    ...productReadPolicy,
    queryKey: productListingKey(options),
    queryFn: ({ signal }) => getPaginatedProducts({ ...options, signal }), enabled,
  });
}

export function useListingPageRecovery(options: ListingOptions, count: number | undefined, setPage: Dispatch<SetStateAction<number>>) {
  const client = useQueryClient();
  const page = options.page || 1;
  const destination = count === undefined ? page : Math.max(1, Math.ceil(count / (options.pageSize || 20)));
  const invalid = page > destination;
  useEffect(() => {
    if (!invalid) return;
    // Only the destination for this exact listing is known stale. Removing it
    // also cancels any in-flight fetch before the destination observer mounts.
    client.removeQueries({ queryKey: productListingKey({ ...options, page: destination }), exact: true });
    setPage(current => current === page ? destination : current);
  }, [client, invalid, page, destination, options.categoryId, options.subcategory?.id, options.subcategory?.name, options.subcategory?.slug, options.sort, options.pageSize, setPage]);
  return invalid;
}
