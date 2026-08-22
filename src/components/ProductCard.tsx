import React from 'react';
import { ProductItem } from '../types';
import { Heart, ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: ProductItem;
  currencySymbol: string;
  isWishlisted: boolean;
  onToggleWishlist: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem, variant?: string) => void;
  onQuickView: (product: ProductItem) => void;
  layoutView?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currencySymbol,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  layoutView = 'grid'
}) => {
  // Format price with thousands comma separator
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-IN');
  };

  if (layoutView === 'list') {
    return (
      <div className="group bg-[#141312] border border-[#272420] hover:border-[#4d4437] rounded-xl overflow-hidden p-4 flex flex-col sm:flex-row items-center gap-5 transition-all duration-300 shadow-md">
        {/* Product Image */}
        <div 
          onClick={() => onQuickView(product)}
          className="relative w-full sm:w-44 h-44 shrink-0 overflow-hidden rounded-lg bg-black cursor-pointer"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          {product.badge && (
            <span className="absolute top-2.5 left-2.5 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/80 text-[#d4af37] border border-[#d4af37]/60 backdrop-blur-xs">
              {product.badge}
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-2 text-left w-full">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#d4af37]">
              {product.category}
            </span>
          </div>

          <h3 
            onClick={() => onQuickView(product)}
            className="font-medium text-base text-slate-100 hover:text-[#d4af37] cursor-pointer transition-colors"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2">
            {product.subtitle || product.description}
          </p>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white font-mono">
                {currencySymbol}{formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-500 line-through font-mono">
                  {currencySymbol}{formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-2 rounded-lg border transition cursor-pointer ${
                  isWishlisted 
                    ? 'border-rose-500 text-rose-500 bg-rose-500/10' 
                    : 'border-[#38332c] text-slate-400 hover:text-white hover:bg-[#1f1d1a]'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                onClick={() => onAddToCart(product)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#d4af37] hover:bg-[#fae19c] text-black font-extrabold text-xs uppercase tracking-wider rounded-lg transition shadow-md cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-[#141312] border border-[#272420] hover:border-[#4d4437] rounded-xl overflow-hidden flex flex-col transition-all duration-300 shadow-md">
      
      {/* Product Image Frame */}
      <div className="relative w-full aspect-square bg-[#0b0a0a] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          onClick={() => onQuickView(product)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 cursor-pointer"
        />

        {/* Top Left Badge (from screenshot) */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/85 text-[#d4af37] border border-[#d4af37]/70 backdrop-blur-xs shadow-md">
              {product.badge}
            </span>
          </div>
        )}

        {/* Top Right Wishlist Button (from screenshot) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isWishlisted
              ? 'bg-rose-600 text-white shadow-lg scale-110'
              : 'bg-black/60 hover:bg-black text-slate-300 hover:text-white border border-[#38332c] hover:border-white/40'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Hover Quick View overlay button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="pointer-events-auto px-3.5 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-xs font-semibold tracking-wide border border-[#d4af37]/60 flex items-center gap-1.5 backdrop-blur-xs transform translate-y-2 group-hover:translate-y-0 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Floating Gold Cart Icon at Bottom Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-black/80 hover:bg-[#d4af37] border border-[#d4af37]/70 text-[#d4af37] hover:text-black flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer group/cart hover:scale-110"
          title="Quick Add to Cart"
        >
          <ShoppingCart className="w-4 h-4 group-hover/cart:rotate-[-6deg] transition-transform" />
        </button>
      </div>

      {/* Product Content Details (Below Image) */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between text-left space-y-1.5">
        
        {/* Title */}
        <h3
          onClick={() => onQuickView(product)}
          className="font-normal text-[14.5px] sm:text-[15px] text-[#f2efe6] hover:text-[#d4af37] cursor-pointer transition-colors truncate font-sans tracking-tight"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Price Box */}
        <div className="flex items-baseline space-x-2">
          <span className="text-[15px] sm:text-[16px] font-bold text-white font-mono tracking-tight">
            {currencySymbol}{formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-slate-500 line-through font-mono">
              {currencySymbol}{formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

      </div>

    </div>
  );
};
