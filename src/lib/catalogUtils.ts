import { ProductItem } from '../types';

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popular';

export function sortProducts(list: ProductItem[], sortBy: SortOption): ProductItem[] {
  const sorted = [...list];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'popular':
      return sorted.sort((a, b) => b.reviewsCount - a.reviewsCount);
    case 'newest':
    default:
      return sorted;
  }
}

export function paginate<T>(list: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  return list.slice(start, start + perPage);
}
