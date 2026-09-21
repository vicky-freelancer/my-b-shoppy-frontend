import React, { useState } from 'react';
import { ProductItem } from '../types';
import { X, Heart, ShoppingBag, ShieldCheck, Check, Plus, Minus, ArrowRight } from 'lucide-react';

interface QuickViewModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  currencySymbol: string;
  isWishlisted: boolean;
  onToggleWishlist: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem, variant: string, quantity: number) => void;
  onDirectOrder: (product: ProductItem, variant: string, quantity: number) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  currencySymbol,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onDirectOrder
}) => {
  if (!isOpen || !product) return null;

  const [selectedVariant, setSelectedVariant] = useState<string>(
    product.variants[0] || 'Standard'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    onClose();
    onDirectOrder(product, selectedVariant, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#111111]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-[#FFFDF6] border border-[#D8A83E]/50 rounded-[24px] shadow-2xl overflow-hidden text-[#241A12] my-8">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#FAF1DD]/90 hover:bg-[#E8C875] text-[#6B5945] hover:text-[#241A12] border border-[#D8A83E]/50 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* Left: Product Image & Badges */}
          <div className="relative aspect-square bg-[#F8ECD0] flex items-center justify-center overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain object-center"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#241A12]/85 text-[#E8C875] border border-[#E8C875]/70">
                {product.badge}
              </span>
            )}
          </div>

          {/* Right: Details, Variant Selector, Quantity, and Actions */}
          <div className="p-6 sm:p-8 space-y-5 flex flex-col justify-between">

            <div className="space-y-3 text-left">
              {/* Category */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#B8860B]">
                  {product.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-display text-2xl font-bold text-[#241A12]">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl font-bold text-[#241A12] font-mono">
                  {currencySymbol}{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-[#6B5945]/60 line-through font-mono">
                    {currencySymbol}{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  Convenient Checkout
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#6B5945] leading-relaxed">
                {product.description}
              </p>

              {/* Specs: Material & Stone */}
              {(product.material || product.stone) && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {product.material && (
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#FAF1DD] border border-[#D8A83E]/40 text-[#6B5945]">
                      Material: <strong className="text-[#241A12]">{product.material}</strong>
                    </span>
                  )}
                  {product.stone && (
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#FAF1DD] border border-[#D8A83E]/40 text-[#6B5945]">
                      Stone: <strong className="text-[#B8860B]">{product.stone}</strong>
                    </span>
                  )}
                </div>
              )}

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B5945]">
                    Select Option / Size:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                          selectedVariant === variant
                            ? 'bg-[#111111] text-[#F4D99B] shadow-md'
                            : 'bg-[#FAF1DD] text-[#6B5945] border border-[#6B5945]/30 hover:border-[#B8860B]'
                        }`}
                      >
                        {variant}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6B5945]">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#6B5945]/30 rounded-full bg-[#FAF1DD]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-[#6B5945] hover:text-[#B8860B] cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-mono font-bold text-[#241A12]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-[#6B5945] hover:text-[#B8860B] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-[#D8A83E]/30">
              <div className="grid grid-cols-2 gap-3">

                {/* Add to Cart */}
                <button
                  onClick={handleAdd}
                  className="py-3 px-4 rounded-full bg-[#111111] hover:bg-[#241A12] text-[#F4D99B] border-2 border-[#111111] font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`py-3 px-4 rounded-full border-2 transition flex items-center justify-center gap-2 text-xs font-bold uppercase cursor-pointer ${
                    isWishlisted
                      ? 'border-rose-500 text-rose-600 bg-rose-500/10'
                      : 'border-[#6B5945]/40 text-[#6B5945] hover:text-[#B8860B] hover:border-[#B8860B]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                  <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-4 rounded-full bg-[#B8860B] hover:bg-[#8A6A15] text-white font-extrabold text-xs uppercase tracking-[0.2em] transition flex items-center justify-center gap-2 shadow-[0_14px_32px_-12px_rgba(184,134,11,0.7)] cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>ORDER NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};