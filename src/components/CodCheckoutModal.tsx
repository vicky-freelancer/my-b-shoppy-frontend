import React, { useState } from 'react';
import { CartItem, OrderFormData, FormErrors, ProductItem } from '../types';
import { STORE_CONFIG } from '../storeConfig';
import { submitCodOrder } from '../lib/supabaseClient';
import confetti from 'canvas-confetti';
import { X, ShieldCheck, CheckCircle2, Truck, AlertCircle, ShoppingBag, Loader2, Copy, Check } from 'lucide-react';

interface CodCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  directProduct?: { product: ProductItem; variant: string; quantity: number } | null;
  currencySymbol: string;
  onClearCart: () => void;
}

export const CodCheckoutModal: React.FC<CodCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  directProduct,
  currencySymbol,
  onClearCart
}) => {
  const [formData, setFormData] = useState<OrderFormData>({
    customer_name: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    country: STORE_CONFIG.defaultCountry || 'United States',
    product_name: '',
    product_variant: '',
    quantity: 1,
    notes: '',
    status: 'pending',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Lock background scroll while the checkout is open
  React.useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Compute active order items
  const activeItems: CartItem[] = directProduct
    ? [{ product: directProduct.product, variant: directProduct.variant, quantity: directProduct.quantity }]
    : cartItems;

  const totalAmount = activeItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const totalUnits = activeItems.reduce((total, item) => total + item.quantity, 0);

  const validateForm = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.customer_name.trim()) {
      errs.customer_name = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required for delivery SMS/calls';
    } else if (formData.phone.trim().length < 6) {
      errs.phone = 'Please enter a valid phone number';
    }

    if (!formData.city.trim()) {
      errs.city = 'City / Area is required';
    }

    if (!formData.address.trim()) {
      errs.address = 'Street address and apartment/house number required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const itemsSummary = activeItems
      .map((i) => `${i.product.name} (${i.variant}) x${i.quantity}`)
      .join(', ');

    const payload: OrderFormData = {
      ...formData,
      product_name: activeItems[0]?.product.name || 'Luxury Item',
      product_variant: activeItems.map((i) => `${i.variant} x${i.quantity}`).join(' | '),
      quantity: totalUnits,
      notes: formData.notes ? `${formData.notes} | Items: ${itemsSummary}` : `Items: ${itemsSummary}`,
      total_amount: totalAmount,
      items_summary: itemsSummary,
    };

    try {
      const response = await submitCodOrder(payload);

      if (response.success) {
        setConfirmedOrderId(response.orderId || `MBS-${Math.floor(100000 + Math.random() * 900000)}`);
        setOrderSuccess(true);
        onClearCart();

        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#d4af37', '#ffffff', '#f59e0b', '#10b981'],
          });
        } catch {
          // ignore confetti errors in sandboxed iframes
        }
      } else {
        alert(response.error || 'Failed to submit order. Please retry.');
      }
    } catch (err: unknown) {
      console.error(err);
      alert('Network error submitting order to Supabase. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (confirmedOrderId) {
      navigator.clipboard?.writeText(confirmedOrderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-black/85 backdrop-blur-sm px-4 py-6 sm:px-6 sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-label="Cash on Delivery Checkout"
    >
      <div className="relative w-full max-w-2xl mx-auto bg-[#141312] border border-[#38332c] rounded-2xl shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#272420] flex items-center justify-between bg-[#191715]">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
            <h2 className="font-serif-luxury text-base sm:text-lg font-bold text-[#fae19c]">
              Cash on Delivery Checkout
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#26231f] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Confirmed View */}
        {orderSuccess ? (
          <div className="p-6 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white font-serif-luxury">
                Order Placed Successfully!
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Thank you for shopping with <span className="text-[#d4af37] font-semibold">my B shoppy</span>. Your Cash on Delivery order has been submitted and recorded in Supabase.
              </p>
            </div>

            {/* Reference Box */}
            <div className="p-4 rounded-xl bg-[#1c1a17] border border-[#38332c] max-w-md mx-auto flex items-center justify-between">
              <div className="text-left">
                <span className="text-[11px] text-slate-500 uppercase font-mono">Order Tracking Ref</span>
                <p className="text-base font-mono font-bold text-[#d4af37]">{confirmedOrderId}</p>
              </div>
              <button
                onClick={handleCopyId}
                className="px-3 py-1.5 rounded bg-[#272420] hover:bg-[#38332c] text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-slate-300"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-emerald-300 max-w-md mx-auto text-left flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Our courier will call or SMS you before dispatching. You will inspect your package upon delivery and pay the courier with cash or tap.
              </span>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-[#d4af37] hover:bg-[#fae19c] text-black font-extrabold text-xs uppercase tracking-widest transition cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Active Checkout Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6">
            
            {/* Order Items Preview */}
            <div className="p-4 rounded-xl bg-[#181615] border border-[#272420] space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#d4af37]">
                Order Items Summary ({totalUnits} items)
              </span>
              
              <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                {activeItems.map((item) => (
                  <div key={`${item.product.id}-${item.variant}`} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded bg-[#272420] flex items-center justify-center font-mono font-bold text-[10px] text-slate-300">
                        {item.quantity}x
                      </span>
                      <span className="truncate text-slate-200">{item.product.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono">({item.variant})</span>
                    </div>
                    <span className="font-mono font-semibold text-white ml-2">
                      {currencySymbol}{(item.product.price * item.quantity).toLocaleString('en-US')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#272420] flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Due on Doorstep Delivery</span>
                <span className="text-base font-bold font-mono text-[#d4af37]">
                  {currencySymbol}{totalAmount.toLocaleString('en-US')}
                </span>
              </div>
            </div>

            {/* Customer Information Inputs */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Delivery Address & Contact
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    placeholder="e.g. Jessica Sterling"
                    className="w-full bg-[#181615] border border-[#38332c] rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
                  />
                  {errors.customer_name && (
                    <p className="text-[11px] text-rose-400">{errors.customer_name}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Phone Number (For Delivery SMS) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +1 555 019 283"
                    className="w-full bg-[#181615] border border-[#38332c] rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-rose-400">{errors.phone}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">Email (For Confirmation Receipt)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. customer@example.com"
                    className="w-full bg-[#181615] border border-[#38332c] rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {/* City / Province */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-medium">City / State / Area *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. New York, NY"
                    className="w-full bg-[#181615] border border-[#38332c] rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
                  />
                  {errors.city && (
                    <p className="text-[11px] text-rose-400">{errors.city}</p>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs text-slate-400 font-medium">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-[#181615] border border-[#38332c] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {STORE_CONFIG.availableCountries.map((c) => (
                      <option key={c} value={c} className="bg-[#141312]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Street Address */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs text-slate-400 font-medium">Full Street Address (Building, Apt, Suite) *</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                    className="w-full bg-[#181615] border border-[#38332c] rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
                  />
                  {errors.address && (
                    <p className="text-[11px] text-rose-400">{errors.address}</p>
                  )}
                </div>

                {/* Delivery Notes */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs text-slate-400 font-medium">Special Delivery Notes (Optional)</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Leave with concierge or call before ringing"
                    className="w-full bg-[#181615] border border-[#38332c] rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

              </div>
            </div>

            {/* Zero-Risk Notice */}
            <div className="p-3.5 rounded-xl bg-[#1c1a17] border border-[#38332c] flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck className="w-5 h-5 text-[#d4af37] shrink-0" />
              <span>
                <strong className="text-white">0% Upfront Prepayment:</strong> You will only hand cash/card to the courier after you receive and inspect your parcel.
              </span>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting || activeItems.length === 0}
              className="w-full py-4 px-6 rounded-xl bg-[#d4af37] hover:bg-[#fae19c] text-black font-extrabold text-xs uppercase tracking-widest transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Recording Order in Supabase...</span>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>CONFIRM & PLACE CASH ON DELIVERY ORDER</span>
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
