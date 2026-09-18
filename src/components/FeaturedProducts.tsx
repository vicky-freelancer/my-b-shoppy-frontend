import React from 'react';
import { ProductItem } from '../types';
import { SectionHeading } from './SectionHeading';
import { ProductCard } from './ProductCard';
import { Reveal } from './Reveal';

interface FeaturedProductsProps {
  products: ProductItem[];
  currencySymbol: string;
  wishlistIds: string[];
  onToggleWishlist: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  currencySymbol,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
}) => {
  if (products.length === 0) return null;

  return (
    <section className="relative py-16 sm:py-24 bg-[#d9a33f] overflow-hidden">
      {/* ambient glows */}
      <div className="absolute -top-24 right-[12%] w-96 h-96 rounded-full bg-white/50 blur-[110px] pointer-events-none"></div>
      <div className="absolute -bottom-32 left-[8%] w-80 h-80 rounded-full bg-[#E8C875]/40 blur-[100px] pointer-events-none"></div>

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <Reveal>
          <SectionHeading
            eyebrow="Handpicked for you"
            titleBefore="This Season's"
            titleItalic="Icons"
            subtext="TRENDING PICKS • LOVED BY MANY • JUST FOR YOU"
            linkLabel="Shop All Products"
            linkPath="/shop"
          />
        </Reveal>

        <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
          {products.slice(0, 4).map((product, i) => (
            <Reveal key={product.id} delay={i * 90}>
              <ProductCard
                product={product}
                currencySymbol={currencySymbol}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};