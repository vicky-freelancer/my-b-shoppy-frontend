import assert from 'node:assert/strict';
import { getCheckoutAvailability, CheckoutUnavailableError } from '../src/lib/checkoutAvailability';
import { createRazorpayOrder, verifyRazorpayPayment } from '../src/lib/razorpay';
import { submitOrder } from '../src/lib/supabaseClient';

const originalFetch = globalThis.fetch;
const calls: { url: string; method: string }[] = [];
let status = 200;
let body: unknown = { enabled: false };
let fail = false;
let checks = 0;
globalThis.fetch = async (input, init) => {
  calls.push({ url: String(input), method: init?.method || 'GET' });
  if (init?.signal?.aborted || fail) throw new Error('synthetic network failure');
  if (String(input).endsWith('/api/verify-payment')) return new Response('{"valid":true}', { status: 200 });
  return new Response(typeof body === 'string' ? body : JSON.stringify(body), { status });
};
try {
  for (const candidate of [{}, null, [], { enabled: 'true' }, { enabled: false }, 'invalid JSON']) {
    body = candidate;
    assert.equal((await getCheckoutAvailability()).enabled, false); checks++;
  }
  body = { enabled: true }; status = 503;
  assert.equal((await getCheckoutAvailability()).enabled, false); checks++;
  status = 200; fail = true;
  assert.equal((await getCheckoutAvailability()).enabled, false); checks++;
  fail = false;
  const controller = new AbortController(); controller.abort();
  assert.equal((await getCheckoutAvailability(controller.signal)).enabled, false); checks++;
  body = { enabled: true };
  assert.equal((await getCheckoutAvailability()).enabled, true); checks++;
  body = { enabled: false }; calls.length = 0;
  await assert.rejects(() => createRazorpayOrder(7000, 'synthetic', {}), CheckoutUnavailableError);
  assert.equal(calls.length, 1);
  assert.ok(calls[0].url.endsWith('/api/checkout/status'));
  assert.equal(calls[0].method, 'GET'); checks++;
  calls.length = 0;
  // Even an enabled public availability response cannot restore browser writes.
  body = { enabled: true };
  const result = await submitOrder({ customer_name: 'Synthetic', phone: '000', email: '', city: 'Synthetic', address: 'Synthetic', country: 'India', product_name: 'Synthetic', product_variant: 'Standard', quantity: 1, notes: '', status: 'paid', total_amount: 70 });
  assert.equal(result.success, false);
  assert.equal(result.code, 'CLIENT_ORDER_WRITES_DISABLED');
  assert.equal(calls.length, 0); checks++;
  const verified = await verifyRazorpayPayment({ razorpay_order_id: 'order_synthetic', razorpay_payment_id: 'pay_synthetic', razorpay_signature: 'synthetic' });
  assert.equal(verified, true);
  assert.equal(calls.at(-1)?.method, 'POST');
  assert.ok(calls.at(-1)?.url.endsWith('/api/verify-payment')); checks++;
  console.log(`Checkout containment frontend checks: ${checks} passed; no order/provider requests or Supabase writes.`);
} finally { globalThis.fetch = originalFetch; }
