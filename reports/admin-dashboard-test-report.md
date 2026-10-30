# Admin dashboard test report

Date: 2026-10-30.

**Latest update:** The admin dashboard now uses the requested server-validated account and a mobile navigation drawer. The previous authentication bypass described in issue 1 below is fixed. The latest Chromium suite passed 27/27 checks, covering rejected credentials, ignored forged local-storage logins, successful login, reload persistence, logout revocation, forms, settings, export and all six admin tabs at 320, 375, 390, 768, 1024 and 1440 pixels. Authentication API integration tests and both final production builds/TypeScript checks passed.

The three order-handling defects below remain unchanged. Browser database requests were intercepted; authentication requests exercised the real local server. The password is not stored in the browser bundle. The Node server must run for login (`npm start` after `npm run build`); static-only hosting is not sufficient. Production sessions use Secure cookies over HTTPS, and server restarts end sessions. The new UI login does not replace Supabase database permission policies.

 Tested the local admin app in `D:/my B shoppy admin dashboard` and storefront in `D:/my B shoppy frontend`.

Category changes are complete in both applications and verified in the shared Supabase categories table. Existing category IDs and product assignments were preserved. Ear Rings is a new parent category; existing AD Jewellery products were not moved into it.

Requested order: AD Jewellery ? Hair Accessories ? Anti Tarnish Jewellery ? Ear Rings ? Bows & Scrunchies ? Bags ? Mobile Charms ? Key Chains ? Mens Accessories ? Stationery & Gifts.

The admin category defaults, database loading, offline/old cache loading, product and collection forms, order form defaults, and product/order category filters now use this order. Filters show only categories represented in their current data; legacy values retain their original values for matching.

## Results

| Check | Result |
| --- | --- |
| Shared database category sync and verification | PASS: all ten rows verified |
| Storefront category adapter integration suite | PASS |
| Storefront TypeScript and backend syntax checks | PASS |
| Storefront production build | PASS; bundle size advisory |
| Admin TypeScript check | PASS |
| Admin production build | PASS; bundle size advisory |
| Admin functional tests using in-memory database stubs | 26 passed / 29 checks; three failures below |
| Chromium UI checks using intercepted database requests | 27 / 27 checks passed after the mobile and authentication update |
| Backend payment/routing integration suite | PASS |

## Issues found

1. **RESOLVED ? previous admin authentication bypass.** A fresh browser context with no saved login opened the dashboard. `src/App.tsx` initializes missing users to `DEFAULT_ADMIN`. Source review also found that `src/components/LoginView.tsx` logs a user in locally with the Super Admin role when Supabase rejects their credentials. Database row security was not audited, so these observations do not prove unrestricted database access. The current server login replaces these paths; fresh or forged local sessions now remain signed out.
2. **High priority ? historical order totals change with current catalog prices.** `src/lib/utils.ts:getOrderAmount` prioritizes a product's current sale price over the stored order amount. Reproduction: an order for two units with a stored amount of 400 is displayed/calculated as 600 when the matching product now costs 300. This can affect revenue analytics and CSV exports.
3. **High priority ? failed order status persistence reports success.** A simulated Supabase failure in `updateOrderStatus` returns `success: true` and changes the local cache. The UI can appear updated although the database write failed.
4. **High priority ? failed order creation reports success.** A simulated Supabase insert failure in `createOrder` returns `success: true` and creates a local-only order. Local display does not establish durable persistence.

The three failed automated assertions reproduce issues 2?4. Issue 1 was confirmed in Chromium and reviewed in source. The authentication issue was fixed in the subsequent mobile/login update. The three order-handling issues remain recorded and unfixed.

## Browser coverage

Chromium at desktop, tablet and mobile widths of 320, 375, 390, 768, 1024 and 1440 pixels, using synthetic product, category, collection and order fixtures. All Supabase HTTP requests were intercepted, and browser write requests were rejected to prevent changes to real business records.

Checked dashboard startup; product search matching and no-result states; exact category order in product and subcategory forms; Dashboard, Subcategories, Products, Orders, Customers and Analytics navigation; Settings modal; settings save and reload persistence; order CSV download; mobile document viewport fit; absence of uncaught JavaScript errors.

A mobile viewport-fit pass means the tested page did not overflow the document horizontally. It is not a visual audit of every admin screen at every size. Likewise, successful tab rendering does not validate every calculation or interaction inside that tab.

## Functional coverage

- PASS: Category filter sorting and legacy labels
- PASS: Category fallback exact order and stable IDs
- PASS: Old category cache reordered, renamed, expanded; IDs preserved
- PASS: Live category rows normalized in requested order
- PASS: Category database error uses ordered cache
- PASS: Corrupt category cache recovers
- PASS: Subcategory input validation
- PASS: Create subcategory and cache
- PASS: Duplicate subcategory rejected
- PASS: Edit subcategory and cache
- PASS: Deactivate and reactivate subcategory
- PASS: Assigned subcategory cannot be deleted
- PASS: Unassigned subcategory deletes
- PASS: Subcategory write failure reported
- PASS: Create product and cache
- PASS: Edit product price and inventory
- PASS: Duplicate product
- PASS: Missing duplicate product rejected
- PASS: Delete product and cache
- PASS: Product deletion database failure reported
- PASS: Inventory summary calculations
- PASS: Custom order cannot decrement catalog stock
- PASS: Create order and cache
- PASS: Order status and tracking update
- PASS: Order analytics aggregate statuses and totals
- FAIL: Stored order price is stable after catalog price changes
- FAIL: Database order status failure returns failure
- FAIL: Database order creation failure returns failure
- PASS: Delete order

## Not verified

Live authenticated login and authorization, real database product/order/collection writes, real image storage uploads, realtime events across users, email or WhatsApp delivery, real Razorpay payment capture, every modal validation branch, bulk order deletion, every sorting/filter combination, and simultaneous stock updates. The database sync changed category records only. Functional mutation tests used in-memory stubs, so their success does not establish that production schemas, permissions and storage policies permit those operations.

## Reproduction and artifacts

From the storefront workspace:

- `npx tsx scripts/check-admin.ts` ? exercises actual admin library functions against database stubs; intentionally exits with failure while the three defects remain.
- Start the admin with `npm run dev -- --port 3200` in the admin folder, then run `node scripts/check-admin-browser.mjs` in the storefront folder. Requires Playwright and installed Chromium (`npm install --no-save --package-lock=false playwright` and `npx playwright install chromium`), and `ADMIN_QA_PASSWORD` set to the configured password.
- `npm run test:categories --workspace frontend`
- `npm run test --workspace backend`
- `npm run lint` and `npm run build` in each application as applicable.

Evidence: `reports/admin-browser-results.json`, `scripts/admin-functional-results.json`, `reports/admin-desktop.png`, `reports/admin-mobile.png`. Browser tests use an isolated browser context and synthetic records. The functional harness defaults to the sibling admin folder; set `ADMIN_REPO_ROOT` to override that path. Set `ADMIN_QA_URL` to override the browser test URL.

Overall: the requested category changes are verified. The admin dashboard cannot be certified as fully working because of the reproduced order defects and untested live integrations. The requested login and mobile layouts pass their dedicated checks.
