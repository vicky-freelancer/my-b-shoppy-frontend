import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

interface ShopHeroProps {
  currentCategoryName?: string;
  totalProductsCount: number;
}

export const ShopHero: React.FC<ShopHeroProps> = ({
  currentCategoryName,
  totalProductsCount
}) => {
  return (
    <div className="relative bg-gradient-to-r from-[#121110] via-[#1a1816] to-[#141210] border-b border-[#292520] overflow-hidden py-10 sm:py-14">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Left: Typography Title & Breadcrumb */}
          <div className="space-y-3 z-10">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
              <span className="hover:text-white transition cursor-pointer">Home</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="hover:text-white transition cursor-pointer">Shop</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-[#d4af37] font-bold">
                {currentCategoryName ? currentCategoryName : 'All Products'}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#f3f0e6]">
              {currentCategoryName ? currentCategoryName : 'All Products'}
            </h1>

            <p className="text-slate-400 text-sm max-w-xl flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>Curated fine artificial jewelry, luxury hair adornments, accessories & gifts with Cash on Delivery</span>
            </p>
          </div>

          {/* Right: Featured Hammered Gold Banner Visual (from screenshot) */}
          <div className="relative md:w-80 lg:w-96 h-28 sm:h-36 rounded-2xl overflow-hidden border border-[#3b352b] shadow-2xl shrink-0 group">
            <img
              src="https://images.unsplash.com/photo-1611591475155-42e4fdb8885c?auto=format&fit=crop&w=800&q=80"
              alt="Hammered Gold Luxury Jewelry"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#121110] via-transparent to-black/60"></div>
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#fae19c] bg-[#121110]/80 px-2 py-0.5 rounded backdrop-blur-sm border border-[#4d4437]">
                Aura Gold Collection
              </span>
              <span className="text-slate-300 font-medium text-[11px] bg-black/60 px-2 py-0.5 rounded">
                {totalProductsCount} Items Available
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
