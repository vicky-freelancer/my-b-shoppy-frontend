import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useSeo } from '../lib/seo';
import { PageBanner } from '../components/PageBanner';

export const CartPage: React.FC = () => {
  const { cartItems, updateCartQuantity, removeCartItem, openCodCheckout } = useStore();

  useSeo({
    title: 'Your Shopping Bag',
    description: 'Review your MY B SHOPPY shopping bag — secure payments, fast shipping and easy checkout across India.',
    path: '/cart',
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div>
      <PageBanner
        eyebrow="Your Bag"
        title="Shopping <em>Bag</em>"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Cart' },
        ]}
      />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
        {cartItems.length === 0 ? (
          <div className="text-center py-20 space-y-5 bg-[#FFFDF6] border border-[#6B5945]/15 rounded-3xl">
            <span className="inline-flex w-16 h-16 rounded-full bg-[#FAF1DD] border border-[#D8A83E]/40 items-center justify-center text-[#B8860B]">
              <ShoppingBag className="w-7 h-7" />
            </span>
            <h2 className="font-display text-3xl text-[#241A12]">Your bag is feeling light</h2>
            <p className="text-sm text-[#6B5945] max-w-sm mx-auto">
              Explore our curated collection of clips, bows, scrunchies and more.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-9 py-4 rounded-full bg-[#111111] text-[#F4D99B] font-semibold text-[12px] uppercase tracking-[0.22em] hover:bg-[#241A12] transition-all hover:-translate-y-0.5"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.product.id}-${item.variant}`}
                  className="bg-[#FFFDF6] border border-[#6B5945]/15 rounded-3xl p-4 flex gap-4 sm:gap-5 items-center card-lift"
                >
                  <Link
                    to={`/product/${item.product.id}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#F8ECD0] shrink-0 img-zoom"
                  >
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <span className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
                      {item.product.category}
                    </span>
                    <h3 className="font-display text-xl text-[#241A12] truncate">
                      <Link to={`/product/${item.product.id}`} className="hover:text-[#B8860B] transition-colors">
                        {item.product.name}
                      </Link>
                    </h3>
                    <p className="text-[11px] text-[#6B5945]/85">Variant: {item.variant}</p>
                    <p className="mt-1 font-bold text-[#241A12]">₹{item.product.price.toLocaleString('en-IN')}</p>
                  </div>

                  {/* Quantity */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className="flex items-center border border-[#6B5945]/25 rounded-full overflow-hidden bg-[#FAF1DD]">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.variant, Math.max(1, item.quantity - 1))}
                        aria-label="Decrease quantity"
                        className="p-2 text-[#6B5945] hover:text-[#B8860B] cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-[13px] font-bold text-[#241A12]">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.variant, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="p-2 text-[#6B5945] hover:text-[#B8860B] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeCartItem(item.product.id, item.variant)}
                      aria-label={`Remove ${item.product.name}`}
                      className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#6B5945]/80 hover:text-[#B00020] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <aside className="bg-[#FAF1DD] border border-[#D8A83E]/40 rounded-3xl p-7 lg:sticky lg:top-28 space-y-5">
              <h2 className="font-display text-2xl text-[#241A12]">Order Summary</h2>

              <div className="space-y-2.5 text-[14px]">
                <div className="flex justify-between text-[#6B5945]">
                  <span>Subtotal ({cartItems.reduce((n, i) => n + i.quantity, 0)} items)</span>
                  <span className="text-[#241A12] font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#6B5945]">
                  <span>Shipping</span>
                  <span className="text-[#241A12] font-semibold">Free</span>
                </div>
                <div className="flex justify-between border-t border-[#D8A83E]/40 pt-3 text-lg font-bold text-[#241A12]">
                  <span>Total</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-2 text-[12px] text-[#6B5945]">
                <p className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#B8860B]" /> Fast & reliable shipping across India
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B8860B]" /> Secure payments, 100% safe & trusted
                </p>
              </div>

              <button
                onClick={openCodCheckout}
                className="w-full inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#111111] text-[#F4D99B] font-semibold text-[12px] uppercase tracking-[0.22em] hover:bg-[#241A12] transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/shop"
                className="w-full inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-[#111111]/50 text-[#111111] font-semibold text-[12px] uppercase tracking-[0.22em] hover:bg-[#111111]/5 transition-colors"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};