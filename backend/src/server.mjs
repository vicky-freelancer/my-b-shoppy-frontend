import express from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';


const backendDir = fileURLToPath(new URL('..', import.meta.url));
dotenv.config({ path: path.join(backendDir, '.env') });

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const RAZORPAY_BASE = 'https://api.razorpay.com';
const PORT = Number(process.env.PORT) || 5000;

const app = express();
// Keep the raw body so the webhook signature can be verified
app.use(express.json({ verify: (req, _res, buf) => { req['rawBody'] = buf; } }));

// CORS — this backend is deployed separately from the frontend (api.mybshoppy.com),
// so browser calls from the storefront domain must be allowed explicitly.
const ALLOWED_ORIGINS = [
  'https://mybshoppy.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin not allowed by CORS: ${origin}`));
    }
  },
}));

function razorpayHeaders() {
  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
  return {
    'Content-Type': 'application/json',
    Authorization: `Basic ${auth}`,
  };
}

/** Health check — lets you confirm the server is up and which key mode is active */
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    razorpayConfigured: Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET),
    mode: !RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET ? 'UNCONFIGURED' : RAZORPAY_KEY_ID.startsWith('rzp_test_') ? 'TEST' : 'LIVE',
  });
});

/**
 * Create a Razorpay order.
 * amount is in the smallest currency unit (paise for INR), e.g. ₹599 = 59900.
 */
app.post('/api/create-order', async (req, res) => {
  try {
    const amount = req.body?.amount;
    const currency = req.body?.currency || 'INR';

    if (!Number.isSafeInteger(amount) || amount < 100) {
      return res.status(400).json({ error: 'Amount must be at least 100 paise (₹1)' });
    }

    if (currency !== 'INR') return res.status(400).json({ error: 'Only INR payments are supported' });
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ error: 'Online payments are not configured. Please contact the store.' });
    }

    const receipt = String(req.body?.receipt || `MBS-${Date.now()}`).slice(0, 40);
    const notes = req.body?.notes || {};

    const upstream = await fetch(`${RAZORPAY_BASE}/v1/orders`, {
      method: 'POST',
      headers: razorpayHeaders(),
      body: JSON.stringify({ amount, currency, receipt, payment_capture: 1, notes }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data?.error?.description || 'Failed to create Razorpay order' });
    }

    // Send the order back to the browser along with the public key_id only
    res.json({ ...data, key_id: RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('create-order error:', err);
    res.status(500).json({ error: 'Internal error while creating order' });
  }
});

/**
 * Verify that a payment really came from Razorpay.
 * The signature is an HMAC-SHA256 of "order_id|payment_id" using the key secret.
 * Only the server can compute this, which is why cheating is hard.
 */
app.post('/api/verify-payment', (req, res) => {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return res.status(503).json({ valid: false, error: 'Online payments are not configured' });
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ valid: false, error: 'Missing payment fields' });
  }

  const expected = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const valid = typeof razorpay_signature === 'string' && /^[a-f0-9]{64}$/i.test(razorpay_signature) &&
    crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(razorpay_signature, 'hex'));
  if (!valid) {
    return res.status(400).json({ valid: false, error: 'Payment signature verification failed' });
  }
  res.json({ valid: true });
});

/**
 * Webhook for server-side payment confirmation.
 * Configure in Dashboard -> Settings -> Webhooks (url: /api/razorpay-webhook,
 * events: payment.authorized, payment.failed). In test mode use a public tunnel
 * like ngrok/cloudflared, or the deployed URL.
 */
app.post('/api/razorpay-webhook', (req, res) => {
  const signature = req.get('x-razorpay-signature') || '';
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (webhookSecret) {
    const expected = crypto.createHmac('sha256', webhookSecret).update(req['rawBody'] || '').digest('hex');
    if (signature !== expected) {
      return res.status(400).json({ ok: false, error: 'Invalid webhook signature' });
    }
  }

  const event = req.body?.event;
  const payment = req.body?.payload?.payment?.entity || {};
  console.log(`[webhook] ${event} payment=${payment.id} order=${payment.order_id} status=${payment.status}`);
  res.json({ ok: true });
});

// API-only deployments and a combined storefront deployment are both supported.
app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found' }));
const frontendDist = path.resolve(backendDir, '..', 'frontend', 'dist');
if (existsSync(path.join(frontendDist, 'index.html'))) {
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => res.sendFile(path.join(frontendDist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`my B shoppy server running at http://localhost:${PORT}`);
  console.log(`Razorpay mode: ${RAZORPAY_KEY_ID.startsWith('rzp_test_') ? 'TEST' : 'LIVE'}`);
});
