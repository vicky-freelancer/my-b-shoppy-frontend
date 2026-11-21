import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
          <div className="mb-8 flex justify-center sm:mb-10">
            <Link
              to="/shop"
              className="btn-arrow-cta group inline-flex items-center gap-2 text-base sm:text-lg font-bold uppercase tracking-[0.16em] text-black transition-colors duration-300 hover:text-[#6B4C08]"
            >
              Shop All Products
              <ArrowRight className="arrow h-5 w-5 text-[#B8860B]" aria-hidden="true" />
            </Link>
          </div>
          <SectionHeading
            eyebrow="Handpicked for you"
            titleBefore="This Season's"
            titleItalic="Icons"
            subtext="TRENDING PICKS • LOVED BY MANY • JUST FOR YOU"
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
