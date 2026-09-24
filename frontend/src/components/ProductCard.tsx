import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductItem } from '../types';
import { Heart, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: ProductItem;
  currencySymbol: string;
  isWishlisted: boolean;
  onToggleWishlist: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem, variant?: string) => void;
  onQuickView?: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currencySymbol,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) => {
  const [heartPulse, setHeartPulse] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);

  const formatPrice = (price: number) => price.toLocaleString('en-IN');

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist(product);
    setHeartPulse(true);
    window.setTimeout(() => setHeartPulse(false), 500);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
    setCartPulse(true);
    window.setTimeout(() => setCartPulse(false), 600);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex flex-col bg-[#FFFDF6] rounded-3xl border border-[#6B5945]/18 shadow-[0_12px_32px_-18px_rgba(90,62,20,0.32)] card-lift p-2.5 sm:p-3 focus-visible:outline-2 focus-visible:outline-[#D8A83E]"
    >
      {/* ------- Image area (~70% of card height) ------- */}
      <div className="relative aspect-[4/4.6] rounded-2xl overflow-hidden bg-[#F8ECD0] img-zoom">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center"
        />

        {/* soft bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#241A12]/12 to-transparent pointer-events-none"></div>

        {/* Badge */}
        {product.inStock === false ? (
          <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-rose-950/85 text-rose-200 border border-rose-400/50 backdrop-blur-sm">
            Sold Out
          </span>
        ) : (
          product.badge && (
            <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-[#111111]/85 text-[#F4D99B] border border-[#D8A83E]/50 backdrop-blur-sm">
              {product.badge}
            </span>
          )
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
            isWishlisted
              ? 'bg-[#D8A83E] text-[#111111] shadow-[0_8px_20px_-6px_rgba(216,168,62,0.7)]'
              : 'bg-white/90 backdrop-blur text-[#6B5945] hover:text-[#B8860B] shadow'
          } ${heartPulse ? 'animate-heartbeat' : ''}`}
        >
          <Heart className={`w-[18px] h-[18px] ${isWishlisted ? 'fill-[#111111]' : ''}`} />
        </button>

        {/* Cart button bottom-right */}
        {product.inStock === false ? (
          <span className="absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center bg-slate-900/80 text-slate-400 border border-slate-500/40 backdrop-blur-sm">
            <ShoppingBag className="w-4.5 h-4.5" />
          </span>
        ) : (
          <button
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg ${
              cartPulse ? 'animate-cart-bounce bg-[#B8860B] text-white' : 'bg-[#111111]/90 text-[#E8C875] hover:bg-[#241A12]'
            } backdrop-blur-sm`}
          >
            {cartPulse ? <Check className="w-4.5 h-4.5" /> : <ShoppingBag className="w-4.5 h-4.5" />}
          </button>
        )}
      </div>

      {/* ------- Details ------- */}
      <div className="px-2 pt-3 pb-2 flex-1 flex flex-col gap-1">
        <span className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-black/70">
          {product.category}
        </span>
        <h3 className="font-display text-[19px] leading-tight text-black group-hover:text-black/70 transition-colors">
          {product.name}
        </h3>
        <span className="flex items-baseline gap-2 mt-auto pt-1.5">
          <span className="text-[16px] font-bold text-black tracking-tight">
            {currencySymbol}{formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-black/60 line-through">
              {currencySymbol}{formatPrice(product.originalPrice)}
            </span>
          )}
        </span>
      </div>
    </Link>
  );
};