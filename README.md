# MY B SHOPPY — Luxury E-Commerce Store

Premium fashion accessories storefront (hair accessories, artificial jewellery,
bows, scrunchies, handbags) with a Razorpay payment backend.

## Project structure

```
my-b-shoppy/
├── frontend/            # React + Vite UI (dev server on :3000)
│   ├── src/             # Pages, components, context, lib, store config
│   ├── public/          # Static assets (images, sitemap.xml, robots.txt)
│   ├── scripts/         # Asset + sitemap generators
│   ├── index.html
│   ├── vite.config.ts   # Dev proxy forwards /api → backend (:5000)
│   └── package.json
├── backend/             # Express API (Razorpay) on :5000
│   ├── src/server.mjs   # create-order, verify-payment, webhook,
│   │                    # and serves the built frontend in production
│   ├── .env             # RAZORPAY keys + PORT (never commit!)
│   └── package.json
├── package.json         # Workspace root — one command to run everything
└── README.md
```

## Getting started

**Prerequisites:** Node.js 18+

1. Install dependencies (single install for both workspaces):
   `npm install`
2. Create `backend/.env` from `backend/.env.example` with your Razorpay keys:
   ```
   RAZORPAY_KEY_ID="rzp_test_xxx"
   RAZORPAY_KEY_SECRET="your_key_secret"
   PORT=5000
   ```
   The key secret lives only on the backend — never in the browser.
3. Start both servers from the root (recommended):
   `npm run dev`
   - Backend (Express/Razorpay): http://localhost:5000  →  `/api/health`
   - Frontend (Vite): http://localhost:3000
   Vite proxies `/api/*` calls to the backend.

Or run them in separate terminals:
- `npm run server` — backend only (production mode also serves `frontend/dist`)
- `npm run dev:backend` — backend with restart-on-change
- `npm run dev:frontend` — frontend only

## Test payments (test mode only)

Use these in the Razorpay checkout popup (your key starts with `rzp_test_`):

- Success card: `4100 2800 0000 1007` (any CVV, any future expiry; OTP = any 4–10 digits)
- Declined card: `4100 2800 0006 0003`
- UPI success: `success@razorpay` · UPI failure: `failure@razorpay`

## Production

- `npm run build` builds the frontend into `frontend/dist` and regenerates
  `frontend/public/sitemap.xml` + `robots.txt`.
- `npm start` (== `npm run server`) runs the Express backend, which serves both
  the `/api/*` endpoints and the built app from `frontend/dist` on the same port.
- Keep using test keys until you validate the full flow, then paste in live keys
  (`rzp_live_...`).

## Common tasks

| Task | Command |
| --- | --- |
| Install everything | `npm install` |
| Run frontend + backend | `npm run dev` |
| Backend only | `npm run server` |
| Frontend only | `npm run dev:frontend` |
| Typecheck frontend | `npm run lint` |
| Build frontend | `npm run build` |
| Regenerate sitemap | `npm run sitemap` |