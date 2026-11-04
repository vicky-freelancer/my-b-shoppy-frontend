import type { SyntheticEvent } from 'react';
import type { ProductCategory } from '../types';
import { CATEGORIES_CATALOG } from '../storeConfig';

const fallbackImages = new Map(CATEGORIES_CATALOG.map((category) => [category.id, category.imageUrl]));

export function categoryImage(category: Pick<ProductCategory, 'id' | 'imageUrl'>) {
  return category.imageUrl || fallbackImages.get(category.id) || '';
}

export function onCategoryImageError(
  event: SyntheticEvent<HTMLImageElement>,
  category: Pick<ProductCategory, 'id' | 'imageUrl'>,
) {
  const image = event.currentTarget;
  const fallback = fallbackImages.get(category.id);
  if (!fallback || image.dataset.fallbackApplied === 'true') return;
  image.dataset.fallbackApplied = 'true';
  image.src = fallback;
}
