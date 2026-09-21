# PRD — my B shoppy Online Payments with Razorpay

**Product:** my B shoppy storefront (React + Vite)
**Module:** Payment Gateway Integration (Razorpay)
**Status:** Draft v1.0
**Date:** 2026-09-19
**Primary Owner:** Store Owner / Developer
**Document type:** Product Requirements Document (PRD)

---

## 1. Overview

### 1.1 Problem statement
The current checkout is Cash-on-Delivery (COD) only. Customers pay the courier at the doorstep,
which limits trust, reachability for out-of-area orders, pre-payment capture, and prevents
discounts/EMI/UPI collections. The business needs an online, prepaid payment channel.

### 1.2 Solution
Replace COD with a **prepaid online payment flow** powered by the Razorpay Payment Gateway.
Cart / product checkout collects delivery details, creates a Razorpay order, opens Razorpay's
hosted checkout (cards, UPI, netbanking, wallets, EMI), verifies the payment cryptographically on
the server, and records a **paid** order in the database. COD is removed entirely.

### 1.3 Goals (success metrics)
- 100% of orders are prepaid online (no COD paths remain in the UI).
- Payment authorisation is verified server-side (HMAC signature) before an order is marked paid.
- The Razorpay key **secret** never appears in client-side code or the browser network tab.
- Test environment completes an end-to-end paid order with test cards in < 5 minutes.
- Order data (customer, items, payment id) lands in the database with `status = 'paid'`.

### 1.4 Non-goals (v1)
- Refund/partial-refund tooling (handled in Razorpay Dashboard).
- Multi-currency support (INR only for v1).
- Saved cards / subscriptions.
- Live payment processing until full flow is validated in test mode.

---

## 2. Users & User stories

| Persona | Story |
|---|---|
| Shopper | "I add products to my bag and pay online with UPI/card without needing cash at the door." |
| Shopper (uncertain) | "If my payment fails or I cancel, I see a clear message and can retry without re-entering my address." |
| Store owner | "I can see which orders were prepaid and their Razorpay payment IDs." |
| Developer | "I can run a full payment in test mode locally with simulated cards." |

---

## 3. Functional requirements

### FR-1 — Checkout entry points
- "ORDER NOW" in the cart drawer and cart page, "Buy Now" on quick-view and product pages all launch
  the single Checkout modal (`CheckoutModal`).
- No COD terminology remains in the UI.

### FR-2 — Checkout form
- Collects: full name*, phone* (>= 6 digits), email (for payment receipt), city/state*, full address*,
  delivery notes (optional), country.
- Client-side validation blocks submission until required fields are valid.

### FR-3 — Order cost breakdown
- Subtotal = Σ (unit price × quantity).
- Courier charge (₹60 flat) applied when the bag is non-empty.
- **Total payable online** = subtotal + courier charge.
- Amount is sent to Razorpay in **paise** (INR × 100, integer).

### FR-4 — Payment flow (CREATE → PAY → VERIFY → RECORD)
1. `POST /api/create-order` (server) → Razorpay Orders API → `order_id` + `key_id`.
2. Razorpay `checkout.js` opens with `order_id`, prefilled name/email/phone.
3. Customer completes payment in the Razorpay popup.
4. Popup returns `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`.
5. `POST /api/verify-payment` re-computes the HMAC-SHA256 signature server-side.
6. Only after `valid === true` is the order inserted into Supabase with `status = 'paid'`.

### FR-5 — Failure & cancellation handling
- Payment cancelled or failed → inline error banner, form state preserved, no order recorded.
- Verification mismatch → explicit error, order **not** recorded.
- Network/back-end error at any step → user sees a retryable message.

### FR-6 — Success confirmation
- Success screen shows a tracking reference (MBS-xxxxxx) and the Razorpay payment ID.
- Cart is cleared on success.
- Confetti animation (best effort, ignored in sandboxed iframes).

### FR-7 — Data stored
Orders are stored with: customer identity, delivery address, items summary, `total_amount`,
`status='paid'`, `payment_method='online'`, `razorpay_order_id`, `razorpay_payment_id`,
`razorpay_signature`.

### FR-8 — Server status/health
- `GET /api/health` reports whether Razorpay is configured and whether we are in TEST or LIVE mode.

---

## 4. High-level architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                            BROWSER (React SPA)                              │
│                                                                            │
│  Cart / Product pages → CheckoutModal → src/lib/razorpay.ts client         │
│    │  (contains only the PUBLIC key_id)                                    │
│    │                                                                       │
│    ▼                                                                       │
│  Vite dev server (:3000)  ── proxy /api ──►  ┌──────────────────────────┐  │
│  or Express static (prod)                     │    EXPRESS BACKEND       │  │
└──────────────────────────────────────────────►│    backend/src/server.mjs  (:5000)
                                                │  · POST /api/create-order │
                   PUBLIC key_id only,          │  · POST /api/verify-      │
                   no secret                    │       payment             │
                                   ┌──────────► │  · POST /api/razorpay-    │
                                   │            │       webhook             │
                                   │            │  · GET /api/health        │
                                   │            │  · serves dist/ (prod)    │
                                   │            └──────────┬───────────────┘
                                   │                       │ holds KEY_SECRET
                                   │                       ▼
                         ┌─────────┴─────────┐   ┌────────────────────┐
                         │  Razorpay API     │   │  Supabase (orders) │
                         │  api.razorpay.com │   │  insert paid order │
                         └─────────┬─────────┘   └────────────────────┘
                                   │ checkout.js
                                   ▼
                         Razorpay hosted checkout popup
```

### Key design decision — why a backend is required
Creating a Razorpay order and verifying a payment signature both require the **key secret**.
If the secret lived in the browser, anyone could read it from the network tab and create/execute
payments on the merchant account. Therefore a thin Node (Express) service owns the secret and
exposes only two safe endpoints. The browser only ever sees the **key_id** (public by design).

---

## 5. Component details

### 5.1 Frontend
| File | Responsibility |
|---|---|
| `src/components/CheckoutModal.tsx` | Address form, cost breakdown, pay button, error banner, success screen. Orchestrates steps FR-4. |
| `src/lib/razorpay.ts` | Loads `checkout.js`, `createRazorpayOrder()`, `openRazorpayCheckout()`, `verifyRazorpayPayment()`, `buildRazorpayNotes()`. |
| `src/lib/supabaseClient.ts` | `submitOrder()` inserts the paid order. |
| `src/context/StoreContext.tsx` | Checkout open/close state (`isCheckoutOpen`, `openCheckout`, `closeCheckout`). |
| `src/components/CartDrawer.tsx`, `QuickViewModal.tsx`, `src/pages/CartPage.tsx`, `ProductDetailPage.tsx` | Entry points. |
| `src/types.ts` | `OrderFormData` extended with payment fields. |

### 5.2 Backend (`backend/src/server.mjs`)
| Endpoint | Behaviour |
|---|---|
| `POST /api/create-order` | Validates amount ≥ 100 paise, builds an order in Razorpay (`payment_capture: 1`), returns `{ id, amount, currency, key_id }`. |
| `POST /api/verify-payment` | HMAC-SHA256(`order_id|payment_id`, key_secret) compared to received signature. Returns `{ valid }`. |
| `POST /api/razorpay-webhook` | Validates `x-razorpay-signature` (if a webhook secret is set) and logs `payment.authorized` / `payment.failed` events. |
| `GET /api/health` | Config + mode introspection. |
| static + SPA fallback | Serves `dist/` in production, falls back to `index.html` for router paths. |

### 5.3 Configuration (`backend/.env`)
| Variable | Purpose |
|---|---|
| `RAZORPAY_KEY_ID` | Public key, shown in the popup. |
| `RAZORPAY_KEY_SECRET` | Server-only secret for orders + verification. |
| `RAZORPAY_WEBHOOK_SECRET` (optional) | Verifies webhook calls. |
| `PORT` | Backend port (default 5000). |
| `GEMINI_API_KEY`, `APP_URL` | Existing app configuration. |

`.env` is gitignored; `.env.example` documents the schema.

---

## 6. Payment lifecycle (sequence)

```
CUSTOMER          FRONTEND             BACKEND               RAZORPAY
   │  fill form        │                    │                    │
   │──── Pay ─────────►│  POST /api/create-order               │
   │                   │───────────────────►│── create order ──►│
   │                   │  {order_id,key_id} │◄── order_id ─────│
   │                   │◄───────────────────│                    │
   │  (popup opens; pays with test card)    │                    │
   │◄───── Razorpay Checkout (checkout.js) ──────────────────────│
   │        returns payment_id + signature                       │
   │                   │  POST /api/verify-payment               │
   │                   │───────────────────►│  HMAC compare      │
   │                   │  {valid:true}      │                    │
   │                   │◄───────────────────│                    │
   │                   │  Supabase insert (status='paid')        │
   │◄── success screen │                    │                    │
```

---

## 7. Data model (Supabase `orders`)

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK / serial | Auto-generated |
| `customer_name` | text | Required |
| `phone` | text | Required |
| `email` | text | Nullable |
| `city` | text | Required |
| `address` | text | Required |
| `country` | text | Required |
| `product_name` | text | First item title |
| `product_variant` | text | Variant summary |
| `quantity` | int | Total units |
| `notes` | text | Delivery notes + item list |
| `items_summary` | text | Human-readable line items |
| `total_amount` | numeric | Subtotal + courier, INR |
| `status` | text | `'paid'` |
| `payment_method` | text | `'online'` |
| `razorpay_order_id` | text | Order created server-side |
| `razorpay_payment_id` | text | Popup result |
| `razorpay_signature` | text | Popup result (archival) |
| `created_at` | timestamptz | Default now() |

---

## 8. Security model

| Concern | Control |
|---|---|
| Secret exposure | Key secret only in `server.mjs`; never bundled by Vite, never sent to browser. |
| Fake payments | Server-side HMAC signature verification; popup result is never trusted directly. |
| Amount tampering | Order amount is fixed at creation on the server from the same payload used for the checkout. |
| Webhook forgery | Optional webhook secret + raw-body HMAC check. |
| Secrets in repo | `.env` gitignored; placeholders only in `.env.example`. |
| Replay / duplicate orders | v1 relies on unique receipt per attempt; webhooks (phase 2) make recording idempotent. |

---

## 9. Environments

| Environment | Keys | Purpose |
|---|---|---|
| Dev / local | `rzp_test_...` | Fast iteration; `npm run server` + `npm run dev`. |
| Test / staging | `rzp_test_...` | E2E test cards + webhook via ngrok/cloudflared. |
| Production | `rzp_live_...` | Real money. Requires fully tested flow, ownership/KYC on the account. |

Never copy a `rzp_test_` value into production configuration, and vice versa.

---

## 10. Testing strategy

### 10.1 Automated (CI / local)
- `npm run lint` — TypeScript checks (frontend).
- Backend endpoint smoke tests: `/api/health`, `create-order` (valid + too-small amount),
  `verify-payment` with a tampered signature (`valid:false`) and a regenerated genuine
  signature (`valid:true`).

### 10.2 Manual gateway tests (test mode)
| Scenario | Input | Expected |
|---|---|---|
| Card success | `4100 2800 0000 1007` (any CVV, future expiry, OTP ≥ 4 digits) | Success screen; order `paid` in Supabase; payment visible in Dashboard. |
| Card declined | `4100 2800 0006 0003` | Error banner; no order recorded. |
| Insufficient funds | `4100 2800 0008 0001` | Error banner; no order recorded. |
| UPI success | `success@razorpay` | Success flow. |
| UPI failure | `failure@razorpay` | Error banner. |
| Cancel popup | Close the popup | "Payment cancelled" message; no order recorded. |
| Tampered signature | Modify signature manually | Order not recorded. |

### 10.3 Known caveats
- In test mode UPI **cancel results in a success** — use live mode to test UPI cancellation.
- Test cards only work in test mode; live mode rejects them with `card issuer is invalid`.

---

## 11. Deployment & operations

### 11.1 Local / dev
```
npm install
# create .env (copy .env.example, paste test keys)
npm run server     # terminal 1  → starts backend :5000
npm run dev        # terminal 2  → starts Vite   :3000
```

### 11.2 Production
```
npm run build      # compile SPA into dist/
npm start          # Express serves dist/ + /api on :5000 (or PORT)
```
Deploy the single process (e.g. Cloud Run, Railway, Render, or any Node host). Vite is not
required at runtime. If HTTPS terminates at a proxy, forward `/api` and client router paths to
`index.html`.

### 11.3 Webhook (phase 2, recommended for production truth)
- Configure in Razorpay Dashboard → Settings → Webhooks → URL
  `<public-base-url>/api/razorpay-webhook`, events: `payment.authorized`, `payment.failed`.
- Set the webhook secret in `.env` and enable signature validation.
- Use a public tunnel (ngrok / cloudflared) to test webhooks locally.

### 11.4 Monitoring & support
- Backend logs order creation, verification outcomes, and webhook events.
- Dispute/refund operations are performed in the Razorpay Dashboard.
- Reconciliation: `razorpay_payment_id` stored on each order lets you cross-check the Dashboard.

---

## 12. Milestones

| Phase | Scope | Exit criteria |
|---|---|---|
| M1 (done in repo) | Express order/verify endpoints; frontend online-only checkout; Supabase paid orders; proxy; docs | `npm run lint` passes; `create-order` returns a Razorpay `order_id` with a valid test key. |
| M2 | Full E2E test-mode payment with test cards + UPI; failure & cancel paths verified | A paid order appears in Supabase + Razorpay Dashboard. |
| M3 | Webhook wiring; idempotent server-side recording; reconciliation view | Webhook events update orders; duplicates impossible. |
| M4 | Live keys + monitored rollout with a small traffic slice | Real payments captured and reconciled. |

---

## 13. Open questions / risks

| Risk | Mitigation |
|---|---|
| Test key rotated mid-development | Regenerate keys once, store in `.env`, re-run M2 checklist. |
| Popup blocked in a sandboxed iframe | Razorpay opens its own window; verify in a normal browser tab. |
| Courier charge discrepancies | Courier charge constant is single-sourced in `CheckoutModal`; keep it in settings if it becomes configurable. |
| Signature of failed payment recorded | Only verified successful payments are recorded. |
| Order recovery after confirm step times out | Phase 3 webhook reconciles paid-but-unrecorded orders. |

---

## 14. Glossary

- **Paise** — 1/100 of an Indian Rupee; Razorpay amounts are integers in paise.
- **Order** — a Razorpay "order" needing payment (`payment_capture: 1`).
- **Signature** — HMAC-SHA256 of `order_id|payment_id` with the key secret.
- **Prepaid / Online** — customer pays at checkout time; replaces COD.