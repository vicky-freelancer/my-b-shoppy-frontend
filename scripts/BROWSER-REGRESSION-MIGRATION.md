# Browser regression migration (in progress)

The browser suite formerly intercepted Supabase PostgREST requests with select,
order, offset and range semantics. The storefront now uses the Express API.
The current client and contracts are in `frontend/src/lib/catalogApi.ts`,
`frontend/src/lib/productQueries.ts`, `backend/src/commerce/app.mjs` and
`backend/src/commerce/repository.mjs`.

| Request | Response or behavior | Browser coverage status |
| --- | --- | --- |
| GET /api/v1/categories | `{categories: [...]}` | Fixture exists; category page reached |
| GET /api/v1/subcategories | `{subcategories: [...]}` | Fixture exists; legacy matching assertion fails |
| GET /api/v1/products | `{products: [...], count}`; `page`, `pageSize`, `sort`, `categoryId`, `subcategoryId`, `q`, `featured` | Featured, listing, sort and pagination passed; further cases pending |
| GET /api/v1/products/resolve | `{products: [...]}` for up to 100 IDs or slugs | Fixture exists; detail and wishlist coverage incomplete |
| GET /api/v1/products/:key | `{product: ...}` or 404 | Fixture exists; image/detail coverage incomplete |
| GET /api/checkout/status | `{enabled: false, code: 'CHECKOUT_TEMPORARILY_UNAVAILABLE'}` | Fixture exists; checkout coverage incomplete |
| GET /api/v1/checkout/session and POST /api/v1/checkout | Current backend returns unavailable | Not yet exercised; unexpected calls are blocked |

The 11-product legacy subcategory assertion expected text fallback for a row
with no subcategory ID. `Repository.list` uses both `p.category_id=?` and
`p.subcategory_id=?`; `CategoryDetailPage` resolves the slug within the
selected category and supplies the resulting ID. The assertion now expects ten
and verifies that the text-only product is absent. A fixture contract check
also covers correct, different and missing IDs, matching labels with a different
ID, and duplicate names in separate categories. Missing or wrong IDs can exclude
migrated products from the intended subcategory; actual production records have
not been inspected. The detail page has a separate category-scoped text fallback
for its breadcrumb, which does not change the listing filter.

The old checkout success path used obsolete order endpoints. It now uses an
explicitly enabled, isolated test fixture for session, order and confirmation,
and a local Razorpay stub. The current production checkout status endpoint
returns disabled and the backend's checkout endpoints return unavailable; the
success fixture is a hypothetical client-path test, not a production contract
or proof of payment durability. The old 416 pagination scenario must be
replaced by the REST API's 200 response with an empty page and a total count.
The current suite fails during that catalogue-shrink scenario; its later
subcategory movement, refresh and cache checks remain unverified. Old 416 and
PostgREST select-based assertions have not all been migrated.

Additional unfinished coverage includes cart quantity and removal, state across
SPA navigation and reload, validation, mobile layout, empty and error states,
loading/recovery, and independent server-side redirect verification. Cart state
currently resets on a full reload by design. The Vite test server does not
process `.htaccess`. Fixture-based results cannot prove live backend or payment
durability.

Changed files: `scripts/check-product-browser.mjs`, `scripts/product-fixtures.mjs`,
this document, and the previously proposed `frontend/public/.htaccess` redirect.
Existing checkout, product and category commands pass; checkout reports 13
checks, while the other two commands do not report assertion counts. The
production build passes and its `.htaccess` matches the source. The latest
browser run executed twelve checks: the separate fixture contract check and ten
named legacy checks passed, and the next named check failed. Three later named
checks did not execute; none were intentionally skipped. Requested new journey
coverage is still unimplemented. The fixture's image representation and its
remaining old PostgREST helper also need review against the current media
contract. The production recommendation
is NO-GO until the suite and requested coverage pass and the redirect is verified
on Hostinger. Production data and backend settings were not changed.

## Pagination investigation

A local browser diagnostic reproduced a stale-cache defect without contacting
the production API. Start at `/categories/ad-jewellery?view=products` with 35
fixture products, then request page 2 while shrinking the fixture to products
1–10. Page 1 returned HTTP 200, count 35 and IDs 35–16. The selector
`a[href^="/product/"]` matched those 20 products; page 1 was selected, Previous
disabled and Next enabled. The browser URL has no page parameter; pagination is
React state, and the API request carries `page`.

The request `?page=2&sort=newest&categoryId=ad-jewellery` returned HTTP 200,
count 10 and no products. Its React Query cache entry recorded count 10 and an
empty list. The component clamped back to page 1, but its cache still held count
35 and IDs 35–16, with success/idle state. The DOM again showed `Showing 1–20 of
35 products`, 20 matching cards, page 1 selected and page 2 offered. There was
no loading indicator.

Scheduled page-1 requests subsequently returned count 10 and IDs 10–1. The
cache and DOM then held those ten IDs, showed count 10 and hid the pagination
controls. The original wait can time out at the 30-second refresh boundary
before its failure handler captures the now-correct DOM. The separate diagnostic
also had a case-sensitive text-wait mismatch (`Items Available` versus rendered
`ITEMS AVAILABLE`); its cache and selector snapshots establish the independent
stale-cache behavior. The only console/network errors observed were deliberately
blocked external font requests; no API or page errors were recorded.

Root cause: `frontend/src/lib/useProducts.ts` keys listing caches by page, and
`frontend/src/lib/productQueries.ts` treats them as fresh for 30 seconds.
`frontend/src/pages/CategoryDetailPage.tsx` clamps an invalid page using the new
count but does not invalidate or refetch the destination page's older cache.
`frontend/src/pages/ShopPage.tsx` has the same clamp pattern and needs a separate
regression check. Customers can temporarily see removed products, stale counts,
and an invalid next-page control following a catalogue shrink. This is a
production frontend behavior reproduced with fixtures, not evidence that the
production catalogue is currently affected.

Proposed minimal patch, subject to separate approval: when a response makes the
current page invalid, invalidate or explicitly refetch the destination listing
query using its complete category, subcategory, sort and page key before relying
on cached rows; apply the same logic to shop and category listings. Test delayed
destination responses, exact IDs and counts, first/last page shrink, empty and
expanded catalogues, filter/category changes and errors, without refetch loops.
No production frontend patch was made. As requested, work stopped at the
confirmed frontend defect; the full suite and additional requested journeys were
not rerun in this phase. Earlier build and test results above are prior results.
Redirect verification remains pending Hostinger.

## Approved cache recovery implementation

The invalid-page response now triggers removal of the exact destination listing
cache entry before changing page state. The existing loading state covers the
invalid-page transition; mounting the destination query fetches fresh data. The
query key is shared by listing and recovery and includes category, subcategory,
sort, page and page size. Normal navigation does not invoke recovery. The global
30-second policy remains unchanged. Changed production files are
`frontend/src/lib/useProducts.ts`, `frontend/src/pages/ShopPage.tsx`, and
`frontend/src/pages/CategoryDetailPage.tsx`; the existing redirect is unchanged.

Before the change, the category diagnostic above observed 20 stale IDs 35–16
after the page-two count fell to 10, and no immediate page-one request. After
the change, fixture browser checks for category and shop each observe exactly
IDs 10–1 and no next-page control. The shop check records one immediate page-one
request after the page-two empty response; ordinary shop page-two-to-page-one
navigation records zero page-one requests and uses the fresh cache. A separate
pre-change shop run was not captured, nor were repeated network counts for the
category scenario; avoid treating the category baseline as a shop measurement.

The final browser invocation executed 21 checks (20 named browser checks and one
fixture-contract check): 21 passed, zero failed, zero skipped and zero of those
implemented checks left unexecuted. These include simulated checkout, disabled
checkout and basic form validation, cart quantity/removal/SPA persistence and
reload reset, viewport fit, empty/error/retry, polling and cache reuse. Existing
checkout checks passed 13; product and category commands passed but do not
report assertion counts. Frontend type checking and production build passed;
the built `.htaccess` matches the source.

Coverage still missing includes a separately demonstrated pre-fix shop failure,
deterministic delayed-destination and rapid cross-category recovery races,
first-page shrink without navigation, loading-state assertions, and a complete
independent search/filter pagination-reset matrix. The suite's other diagnostic
and fixture limitations above still apply. The 21 passed checks do not prove all
requested scenarios or live payment durability. Hostinger rewrite compatibility
is pending, so the deployment recommendation remains NO-GO until the remaining
coverage and server verification are completed.

## Final targeted verification and deployment preparation

Three consecutive complete browser invocations each ran 24 checks: 23 named
browser checks and one fixture-contract check. Each run passed all 24, with zero
failures, skips or unexecuted checks among those implemented. Checkout checks
reported 13 passed; product and category commands passed without individual
counts. TypeScript and the production build passed, and the built `.htaccess`
matched the source. The sitemap generated during the build was restored.

New deterministic response gates verified that the shop recovery displays the
existing loading message and no stale cards while page 1 is held, then renders
IDs 10–1 on release. A second gate held an old category recovery while navigation
to hair accessories rendered its 12 expected IDs. Its gate is released before
the final assertion, but the test does not wait for the old route handler to
finish: it does not conclusively prove behavior after the late response settles.
The existing shop recovery test records one destination page request, and normal
page-two-to-page-one navigation records zero page-one requests. The tests do not
measure every category request or all race permutations.

The page-one category listing was refreshed through the existing
`invalidateProductQueries` mechanism with 35→10→0→35 fixture rows. It verified
the ten exact IDs, no next-page control, empty state, and restored count and
first ID. It does not independently assert all 35 restored IDs. Existing sort
coverage checks the price-ascending reset and rapid price-sort reversal; the
remaining sort options and category/subcategory navigation reset combinations
were not covered as a full matrix. Search is a separate, non-paginated modal
query; this storefront has no listing price-filter control. Search-keyword and
combined filter pagination-reset scenarios therefore need product-specific
scope clarification rather than an invented control.

Still unverified: rapid subcategory switches, search/sort changes while the
destination response is held, multiple shrink responses arriving out of order,
recovery failure while the destination request is held, and definitive settling
of an older response after newer navigation. These are not counted as skipped
implemented tests. Network isolation intercepts catalogue and checkout API
requests; simulated checkout never contacts a payment provider. The existing
pre-migration rapid-sort check still uses a fixed 800 ms fixture delay; new
recovery checks use explicit gates.

Source review: listing and recovery share the same key for category,
subcategory identity, sort, page and page size. Recovery removes only the
exact destination query and its in-flight request, which can affect any other
observer sharing that exact key; the current tested page uses one listing
observer. The 30-second global freshness policy remains. No additional production
defect was established by these tests; untested concurrency should not be
represented as verified.

Proposed commit 1: `frontend/src/lib/useProducts.ts`,
`frontend/src/pages/ShopPage.tsx`, `frontend/src/pages/CategoryDetailPage.tsx`,
`scripts/check-product-browser.mjs`, `scripts/product-fixtures.mjs`, and this
document. Proposed commit 2: `frontend/public/.htaccess` alone. Deploy commit 1
and validate storefront listings, then deploy commit 2 and verify the permanent
redirect and paths/query strings on Hostinger. Roll back either deployed commit
with a new revert of that commit and redeploy; rolling back the frontend fix
restores the known stale-page behavior. Neither commit was created or pushed.
Recommendation: NO-GO for the requested final approval until the remaining
supported race scenarios are tested. Hostinger redirect compatibility can only
be checked after an approved controlled deployment. Fixture checkout results do
not establish live backend reliability or payment durability.

## Final regression closure

Three consecutive final browser runs each executed 29 checks (28 named browser
checks plus one fixture contract check), with 29 passed and zero failed, skipped
or unexecuted checks in each. Two earlier attempts failed on an ambiguous
search-heading selector; the corrected test targets the modal's level-four
heading. The cross-category gate now waits for the old route handler to settle.
In all three final runs Playwright reported the handler as fulfilled; after
settlement the active hair-accessories listing retained IDs 47–36, count 12 and
no next-page control. Handler fulfillment does not independently prove whether
the browser consumed or cancelled the response.

Controlled gates also passed for subcategory navigation, sorting while recovery
is held, two out-of-order shrink responses, recovery failure and successful
retry, and search modal interaction during recovery. In the out-of-order test
exactly one older page-two newest request and one newer price-ascending page-one
request were observed. The previously fixed-delay rapid-sort fixture now uses a
controlled gate. Existing shop recovery observes one immediate page-one request;
normal cached back-navigation observes zero. Other network paths are not assigned
an exhaustive request-count guarantee.

Price filtering is not applicable because no listing price filter exists.
Search pagination reset is not applicable because search is a separate
non-paginated modal. No new production frontend changes were made in this phase.
The existing checkout command passed 13 checks; product and category commands
passed without individual counts; TypeScript and the production build passed.
The built `.htaccess` matches its source and the build-generated sitemap was
restored. The prior NO-GO recommendation above is superseded: GO for controlled
deployment of the cache recovery commit. Hostinger rewrite verification is a
post-deployment acceptance check for the separate redirect commit; fixture
checkout is not proof of production payment durability.

Stage the reviewed cache and test files with:

```
git add -- frontend/src/lib/useProducts.ts frontend/src/pages/ShopPage.tsx frontend/src/pages/CategoryDetailPage.tsx scripts/check-product-browser.mjs scripts/product-fixtures.mjs scripts/BROWSER-REGRESSION-MIGRATION.md
git diff --cached --stat
```

After commit 1 is separately approved and created, stage commit 2 with:

```
git add -- frontend/public/.htaccess
git diff --cached --stat
```

Deploy and smoke-test commit 1 first; deploy commit 2 separately. To roll back
either deployed change use `git revert <commit-hash>` for the affected commit
and redeploy. Hostinger smoke tests must check 301 status, preserved path and
query, no loop, static assets and SPA routing. No commit or deployment was made.
