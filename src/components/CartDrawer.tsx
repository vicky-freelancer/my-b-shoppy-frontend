import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Truck, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currencySymbol: string;
  onUpdateQuantity: (productId: string, variant: string, newQuantity: number) => void;
  onRemoveItem: (productId: string, variant: string) => void;
  onProceedToCod: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  currencySymbol,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCod
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121110] border-l border-[#272420] text-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-[#272420] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              <h2 className="font-serif-luxury text-lg font-bold tracking-tight text-[#fae19c]">
                Shopping Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1f1d1a] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Value Highlight */}
          <div className="bg-[#1b1916] px-5 py-2.5 border-b border-[#272420] flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-[#d4af37] font-semibold">
              <Truck className="w-4 h-4" />
              <span>Free Doorstep Delivery</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified</span>
            </span>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-slate-300 font-semibold text-sm">Your shopping bag is empty</p>
                <p className="text-slate-500 text-xs max-w-xs mx-auto">
                  Explore our luxury jewelry and accessories catalog to add pieces to your collection.
                </p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={`${item.product.id}-${item.variant}`}
                  className="p-3.5 rounded-xl bg-[#181615] border border-[#272420] flex gap-3.5 items-center"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-black shrink-0 border border-[#38332c]"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-xs font-semibold text-white truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Variant: <span className="text-[#d4af37] font-medium">{item.variant}</span>
                    </p>
                    <p className="text-xs font-bold text-white font-mono">
                      {currencySymbol}{item.product.price.toLocaleString('en-US')}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex items-center border border-[#38332c] rounded-md bg-[#121110]">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.variant, Math.max(1, item.quantity - 1))
                          }
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono text-white">{item.quantity}</span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.variant, item.quantity + 1)
                          }
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id, item.variant)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer ml-auto"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & COD Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-[#272420] bg-[#141312] space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 font-medium">Estimated Subtotal</span>
                <span className="text-xl font-extrabold text-white font-mono">
                  {currencySymbol}{subtotal.toLocaleString('en-US')}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 text-center">
                Taxes, customs & express doorstep shipping calculated at zero charge.
              </p>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCod();
                }}
                className="w-full py-3.5 px-4 bg-[#d4af37] hover:bg-[#fae19c] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition duration-200 shadow-xl flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>ORDER NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
