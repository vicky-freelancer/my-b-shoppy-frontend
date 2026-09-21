import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProductCategory } from '../types';

interface CategoryCardProps {
  category: ProductCategory;
  index?: number;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, index }) => {
  const itemCount = category.items.length || category.count || 0;

  return (
    <Link
      to={`/categories/${category.id}`}
      className={`group relative block rounded-3xl overflow-hidden border border-[#D8A83E]/45 shadow-[0_18px_44px_-22px_rgba(90,62,20,0.5)] img-zoom ${
        index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
      }`}
      style={{ aspectRatio: '4 / 4.9' }}
    >
      <img
        src={category.imageUrl}
        alt={category.name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />
      {/* dark gradient at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#241A12]/95 via-[#241A12]/25 to-transparent transition-opacity duration-500"></div>
      <div className="absolute inset-0 bg-[#241A12]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* gold border accent on hover */}
      <div className="absolute inset-3 rounded-2xl border border-[#E8C875]/0 group-hover:border-[#E8C875]/70 transition-all duration-500 pointer-events-none"></div>

      <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E8C875] opacity-90">
          {itemCount}+ pieces
        </span>
        <h3 className="mt-1.5 font-display text-[28px] sm:text-[32px] leading-tight text-[#FFF8E8] group-hover:text-[#F4D99B] group-hover:-translate-y-1 transition-all duration-500">
          {category.name}
        </h3>
        <span className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E8C875] transition-all duration-500">
          Explore
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
};