import { OrderFormData } from '../types';

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  key_id: string;
}

export interface RazorpayPaymentResult {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayCheckoutOptions {
  key_id: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: { name?: string; email?: string; contact?: string };
  notes: Record<string, string>;
}

let scriptPromise: Promise<void> | null = null;

/** Lazily loads Razorpay's checkout script once and returns a promise. */
export function loadRazorpayScript(): Promise<void> {
  if (typeof window !== 'undefined' && (window as any).Razorpay) {
    return Promise.resolve();
  }
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error('Failed to load Razorpay checkout. Please check your internet connection.'));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

/** Asks your Express server to create a Razorpay order (amount is in paise). */
export async function createRazorpayOrder(
  amountInPaise: number,
  receipt: string,
  notes: Record<string, string>
): Promise<RazorpayOrder> {
  const resp = await fetch('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountInPaise, currency: 'INR', receipt, notes }),
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(data?.error || 'Failed to create payment order');
  }
  return data as RazorpayOrder;
}

/** Server-side signature check to confirm the payment is genuine. */
export async function verifyRazorpayPayment(result: RazorpayPaymentResult): Promise<boolean> {
  const resp = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  });
  const data = await resp.json().catch(() => ({ valid: false }));
  return data?.valid === true;
}

/** Opens the Razorpay checkout popup. Resolves with the payment result on success. */
export function openRazorpayCheckout(options: RazorpayCheckoutOptions): Promise<RazorpayPaymentResult> {
  return new Promise((resolve, reject) => {
    const RazorpayCtor = (window as any).Razorpay;
    if (!RazorpayCtor) {
      reject(new Error('Razorpay is not loaded. Please try again.'));
      return;
    }

    const instance = new RazorpayCtor({
      key: options.key_id,
      order_id: options.order_id,
      amount: options.amount,
      currency: options.currency,
      name: options.name,
      description: options.description,
      prefill: options.prefill,
      notes: options.notes,
      handler: (response: RazorpayPaymentResult) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled. Your order was not placed.')),
      },
    } as any);

    instance.on('payment.failed', (response: any) => {
      reject(new Error(response?.error?.description || 'Payment failed. Please try again.'));
    });

    instance.open();
  });
}

/** Builds the notes sent to Razorpay for record-keeping. */
export function buildRazorpayNotes(orderData: OrderFormData): Record<string, string> {
  return {
    receipt_email: orderData.email || 'not provided',
    phone: orderData.phone,
    items: orderData.items_summary || orderData.product_name || 'my B shoppy order',
    address: `${orderData.address}, ${orderData.city}, ${orderData.country}`,
  };
}