import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductItem } from '../types';
import { getProductImage, productImagePolicy } from '../lib/productQueries';

type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  product: ProductItem; priority?: boolean;
};
export const ProductImage = React.memo(function ProductImage({ product, priority = false, ...props }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(entries => {
      setVisible(entries.some(entry => entry.isIntersecting));
    }, { rootMargin: '200px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [product.imageProductId]);
  const image = useQuery({ queryKey: ['products', 'image', product.imageProductId],
    ...productImagePolicy,
    queryFn: ({ signal }) => getProductImage(product.imageProductId!, signal),
    enabled: !product.imageUrl && !!product.imageProductId && visible,
  });
  // Inline images previously blocked the entire catalogue response. Now only
  // visible cards request one image column; offscreen cards retain lazy loading.
  return <img {...props} ref={ref} src={product.imageUrl || image.data || undefined}
    loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" />;
});
