import React from 'react';
import { ProductItem } from '../types';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

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
        className="absolute inset-0 bg-[#111111]/70 backdrop-blur-[4px] transition-opacity"
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF6] border-l border-[#D8A83E]/50 text-[#241A12] shadow-2xl flex flex-col">

          {/* Header */}
          <div className="bg-[#FAF1DD] p-5 border-b border-[#D8A83E]/40 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              <h2 className="font-display text-lg font-bold tracking-tight text-[#241A12]">
                Saved Wishlist ({wishlistProducts.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#6B5945] hover:text-[#241A12] hover:bg-[#E8C875]/40 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {wishlistProducts.length === 0 ? (
              <div className="py-24 text-center space-y-3">
                <Heart className="w-12 h-12 text-[#B8860B]/40 mx-auto" />
                <p className="text-[#241A12] font-semibold text-sm">Your wishlist is empty</p>
                <p className="text-[#6B5945] text-xs max-w-xs mx-auto">
                  Click the heart icon on any jewelry piece or accessory to save your favorites here.
                </p>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 rounded-2xl bg-[#FAF1DD] border border-[#D8A83E]/30 flex gap-3.5 items-center justify-between"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    onClick={() => {
                      onQuickView(product);
                      onClose();
                    }}
                    className="w-16 h-16 rounded-xl object-cover bg-[#F8ECD0] shrink-0 border border-[#D8A83E]/40 cursor-pointer"
                  />

                  <div className="flex-1 min-w-0 space-y-1 text-left">
                    <h4
                      onClick={() => {
                        onQuickView(product);
                        onClose();
                      }}
                      className="text-xs font-semibold text-[#241A12] truncate cursor-pointer hover:text-[#B8860B]"
                    >
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-[#6B5945]">
                      {product.category}
                    </p>
                    <p className="text-xs font-bold text-[#B8860B] font-mono">
                      {currencySymbol}{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="p-2 rounded-full bg-[#111111] hover:bg-[#241A12] text-[#F4D99B] transition cursor-pointer"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveWishlist(product)}
                      className="p-2 rounded-full border border-[#6B5945]/35 text-[#6B5945] hover:text-rose-600 hover:border-rose-500 transition cursor-pointer"
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