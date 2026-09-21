import React, { useState } from 'react';
import { CartItem, OrderFormData, FormErrors, ProductItem } from '../types';
import { STORE_CONFIG } from '../storeConfig';
import { submitOrder } from '../lib/supabaseClient';
import {
  createRazorpayOrder,
  loadRazorpayScript,
  openRazorpayCheckout,
  verifyRazorpayPayment,
  buildRazorpayNotes,
} from '../lib/razorpay';
import confetti from 'canvas-confetti';
import { X, ShieldCheck, CheckCircle2, Truck, AlertCircle, ShoppingBag, Loader2, Copy, Check, Lock } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  directProduct?: { product: ProductItem; variant: string; quantity: number } | null;
  currencySymbol: string;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
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
    country: STORE_CONFIG.defaultCountry || 'India',
    product_name: '',
    product_variant: '',
    quantity: 1,
    notes: '',
    status: 'paid',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('');
  const [confirmedPaymentId, setConfirmedPaymentId] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string>('');
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

  const COURIER_CHARGE = 60;
  const courierCharges = activeItems.length > 0 ? COURIER_CHARGE : 0;
  const finalAmount = totalAmount + courierCharges;

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
    setPaymentError('');

    const itemsSummary = activeItems
      .map((i) => `${i.product.name} (${i.variant}) x${i.quantity}`)
      .join(', ');

    const payload: OrderFormData = {
      ...formData,
      product_name: activeItems[0]?.product.name || 'Luxury Item',
      product_variant: activeItems.map((i) => `${i.variant} x${i.quantity}`).join(' | '),
      quantity: totalUnits,
      notes: formData.notes ? `${formData.notes} | Items: ${itemsSummary}` : `Items: ${itemsSummary}`,
      total_amount: finalAmount,
      items_summary: itemsSummary,
      status: 'paid',
    };

    try {
      // 1. Ask the server to create a Razorpay order (amount in paise)
      const receipt = `MBS-${Date.now().toString(36).toUpperCase()}`;
      const amountInPaise = Math.round(finalAmount * 100);
      const order = await createRazorpayOrder(amountInPaise, receipt, buildRazorpayNotes(payload));

      // 2. Load Razorpay's checkout and open the payment popup
      await loadRazorpayScript();
      const payment = await openRazorpayCheckout({
        key_id: order.key_id,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        name: STORE_CONFIG.storeName,
        description: `${STORE_CONFIG.storeName} order — ${totalUnits} item(s)`,
        prefill: {
          name: payload.customer_name,
          email: payload.email,
          contact: payload.phone,
        },
        notes: buildRazorpayNotes(payload),
      });

      // 3. Server-side signature check — never trust the popup result alone
      const isValid = await verifyRazorpayPayment(payment);
      if (!isValid) {
        throw new Error('Payment signature verification failed. Please contact support.');
      }

      // 4. Record the PAID order in Supabase
      const response = await submitOrder({
        ...payload,
        razorpay_order_id: payment.razorpay_order_id,
        razorpay_payment_id: payment.razorpay_payment_id,
        razorpay_signature: payment.razorpay_signature,
      });

      const orderId = response.orderId || `MBS-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedOrderId(orderId);
      setConfirmedPaymentId(payment.razorpay_payment_id);
      setOrderSuccess(true);
      onClearCart();

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#B8860B', '#ffffff', '#f59e0b', '#10b981'],
        });
      } catch {
        // ignore confetti errors in sandboxed iframes
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payment could not be completed. Please retry.';
      console.error(err);
      setPaymentError(message);
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
      className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-[#111111]/70 backdrop-blur-sm px-4 py-6 sm:px-6 sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      <div className="relative w-full max-w-2xl mx-auto bg-[#FFFDF6] border border-[#D8A83E]/50 rounded-[24px] shadow-2xl overflow-hidden text-[#241A12]">

        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D8A83E]/40 flex items-center justify-between bg-[#FAF1DD]">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#B8860B]" />
            <h2 className="font-display text-base sm:text-lg font-bold text-[#241A12]">
              Checkout
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6B5945] hover:text-[#241A12] hover:bg-[#E8C875]/40 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Confirmed View */}
        {orderSuccess ? (
          <div className="p-6 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#241A12] font-display">
                Payment Successful!
              </h3>
              <p className="text-sm text-[#6B5945] max-w-md mx-auto">
                Thank you for shopping with <span className="text-[#B8860B] font-semibold">my B shoppy</span>. Your payment has been received and your order is confirmed.
              </p>
            </div>

            {/* Reference Box */}
            <div className="p-4 rounded-xl bg-[#FAF1DD] border border-[#D8A83E]/40 max-w-md mx-auto flex items-center justify-between">
              <div className="text-left">
                <span className="text-[11px] text-[#6B5945] uppercase font-mono">Order Tracking Ref</span>
                <p className="text-base font-mono font-bold text-[#B8860B]">{confirmedOrderId}</p>
                {confirmedPaymentId && (
                  <p className="text-[11px] text-[#6B5945] font-mono mt-1">Payment ID: {confirmedPaymentId}</p>
                )}
              </div>
              <button
                onClick={handleCopyId}
                className="px-3 py-1.5 rounded-full bg-[#FFFDF6] hover:bg-[#E8C875]/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-[#6B5945]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 max-w-md mx-auto text-left flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Our courier will call or SMS you before dispatching. A receipt has been sent to{formData.email ? ` ${formData.email}` : ' your email'}.
              </span>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-[#111111] hover:bg-[#241A12] text-[#F4D99B] font-extrabold text-xs uppercase tracking-widest transition cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* Active Checkout Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6">

            {/* Order Items Preview */}
            <div className="p-4 rounded-2xl bg-[#FAF1DD] border border-[#D8A83E]/40 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#b8860b]">
                Order Items Summary ({totalUnits} items)
              </span>

              <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                {activeItems.map((item) => (
                  <div key={`${item.product.id}-${item.variant}`} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded bg-slate-200 flex items-center justify-center font-mono font-bold text-[10px] text-slate-600">
                        {item.quantity}x
                      </span>
                      <span className="truncate text-slate-700">{item.product.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">({item.variant})</span>
                    </div>
                    <span className="font-mono font-semibold text-slate-900 ml-2">
                      {currencySymbol}{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Item Subtotal</span>
                  <span className="font-mono font-medium text-slate-800">
                    {currencySymbol}{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#b8860b]" />
                    Courier Charges
                  </span>
                  <span className="font-mono font-medium text-slate-800">
                    {currencySymbol}{courierCharges.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Total Payable Online</span>
                  <span className="text-base font-bold font-mono text-[#b8860b]">
                    {currencySymbol}{finalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information Inputs */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Delivery Address & Contact
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    placeholder="e.g. Jessica Sterling"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                  />
                  {errors.customer_name && (
                    <p className="text-[11px] text-rose-500">{errors.customer_name}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-medium">Phone Number (For Delivery SMS) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-rose-500">{errors.phone}</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-medium">Email (For Payment Receipt)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. customer@example.com"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                  />
                </div>

                {/* City / Province */}
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-medium">City / State / Area *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Tiruchirappalli, TN"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                  />
                  {errors.city && (
                    <p className="text-[11px] text-rose-500">{errors.city}</p>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs text-slate-600 font-medium">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#B8860B]"
                  >
                    {STORE_CONFIG.availableCountries.map((c) => (
                      <option key={c} value={c} className="bg-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Street Address */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs text-slate-600 font-medium">Full Street Address (Building, Apt, Suite) *</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                  />
                  {errors.address && (
                    <p className="text-[11px] text-rose-500">{errors.address}</p>
                  )}
                </div>

                {/* Delivery Notes */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs text-slate-600 font-medium">Special Delivery Notes (Optional)</label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Leave with concierge or call before ringing"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B8860B]"
                  />
                </div>

              </div>
            </div>

            {/* Payment Error Banner */}
            {paymentError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Secure Payment Notice */}
            <div className="p-3.5 rounded-2xl bg-[#FAF1DD] border border-[#D8A83E]/40 flex items-center gap-3 text-xs text-[#6B5945]">
              <Lock className="w-5 h-5 text-[#B8860B] shrink-0" />
              <span>
                <strong className="text-[#241A12]">100% Secure Online Payment:</strong> You will be redirected to Razorpay's encrypted checkout — UPI, cards & netbanking accepted.
              </span>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting || activeItems.length === 0}
              className="w-full py-4 px-6 rounded-full bg-[#111111] hover:bg-[#241A12] text-[#F4D99B] font-extrabold text-xs uppercase tracking-widest transition duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Opening Secure Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>PAY ONLINE & PLACE ORDER</span>
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};