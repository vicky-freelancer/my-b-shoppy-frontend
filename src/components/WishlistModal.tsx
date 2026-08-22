import React from 'react';
import { ProductItem } from '../types';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: ProductItem[];
  currencySymbol: string;
  onRemoveWishlist: (product: ProductItem) => void;
  onAddToCart: (product: ProductItem) => void;
  onQuickView: (product: ProductItem) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  currencySymbol,
  onRemoveWishlist,
  onAddToCart,
  onQuickView
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121110] border-l border-[#272420] text-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-[#272420] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              <h2 className="font-serif-luxury text-lg font-bold tracking-tight text-[#fae19c]">
                Saved Wishlist ({wishlistProducts.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1f1d1a] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {wishlistProducts.length === 0 ? (
              <div className="py-24 text-center space-y-3">
                <Heart className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-slate-300 font-semibold text-sm">Your wishlist is empty</p>
                <p className="text-slate-500 text-xs max-w-xs mx-auto">
                  Click the heart icon on any jewelry piece or accessory to save your favorites here.
                </p>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 rounded-xl bg-[#181615] border border-[#272420] flex gap-3.5 items-center justify-between"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    onClick={() => {
                      onQuickView(product);
                      onClose();
                    }}
                    className="w-16 h-16 rounded-lg object-cover bg-black shrink-0 border border-[#38332c] cursor-pointer"
                  />

                  <div className="flex-1 min-w-0 space-y-1 text-left">
                    <h4 
                      onClick={() => {
                        onQuickView(product);
                        onClose();
                      }}
                      className="text-xs font-semibold text-white truncate cursor-pointer hover:text-[#d4af37]"
                    >
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {product.category}
                    </p>
                    <p className="text-xs font-bold text-[#d4af37] font-mono">
                      {currencySymbol}{product.price.toLocaleString('en-US')}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="p-2 rounded-lg bg-[#d4af37] hover:bg-[#fae19c] text-black transition cursor-pointer"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveWishlist(product)}
                      className="p-2 rounded-lg border border-[#38332c] text-slate-400 hover:text-rose-400 hover:border-rose-500 transition cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
