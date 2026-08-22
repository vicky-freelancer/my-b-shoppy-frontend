import React, { useState } from 'react';
import { ProductItem } from '../types';
import { X, Heart, ShoppingBag, Truck, ShieldCheck, Check, Plus, Minus, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-[#141312] border border-[#38332c] rounded-2xl shadow-2xl overflow-hidden text-white my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-slate-300 hover:text-white border border-[#38332c] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Image & Badges */}
          <div className="relative aspect-square md:aspect-auto bg-black flex items-center justify-center overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-black/80 text-[#d4af37] border border-[#d4af37]/70">
                {product.badge}
              </span>
            )}
          </div>

          {/* Right: Details, Variant Selector, Quantity, and Actions */}
          <div className="p-6 sm:p-8 space-y-5 flex flex-col justify-between">
            
            <div className="space-y-3 text-left">
              {/* Category */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#d4af37]">
                  {product.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif-luxury text-2xl font-bold text-[#fae19c]">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl font-bold text-white font-mono">
                  {currencySymbol}{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-slate-500 line-through font-mono">
                    {currencySymbol}{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                  Cash on Delivery
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* Specs: Material & Stone */}
              {(product.material || product.stone) && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {product.material && (
                    <span className="text-[11px] px-2.5 py-1 rounded bg-[#1c1a17] border border-[#38332c] text-slate-300">
                      Material: <strong className="text-white">{product.material}</strong>
                    </span>
                  )}
                  {product.stone && (
                    <span className="text-[11px] px-2.5 py-1 rounded bg-[#1c1a17] border border-[#38332c] text-slate-300">
                      Stone: <strong className="text-[#d4af37]">{product.stone}</strong>
                    </span>
                  )}
                </div>
              )}

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Select Option / Size:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          selectedVariant === variant
                            ? 'bg-[#d4af37] text-black shadow-md'
                            : 'bg-[#1a1816] text-slate-300 border border-[#38332c] hover:border-slate-500'
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
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#38332c] rounded-lg bg-[#181615]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-mono font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-[#272420]">
              <div className="grid grid-cols-2 gap-3">
                
                {/* Add to Cart */}
                <button
                  onClick={handleAdd}
                  className="py-3 px-4 rounded-xl bg-[#1f1d1a] hover:bg-[#2c2823] text-[#d4af37] border border-[#d4af37] font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
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
                  className={`py-3 px-4 rounded-xl border transition flex items-center justify-center gap-2 text-xs font-bold uppercase cursor-pointer ${
                    isWishlisted
                      ? 'border-rose-500 text-rose-500 bg-rose-500/10'
                      : 'border-[#38332c] text-slate-300 hover:text-white hover:bg-[#1f1d1a]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                  <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>

              {/* Buy Now with COD */}
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-4 rounded-xl bg-[#d4af37] hover:bg-[#fae19c] text-black font-extrabold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <span>ORDER NOW (CASH ON DELIVERY)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
