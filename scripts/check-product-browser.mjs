import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { products, restFixture } from './product-fixtures.mjs';
import { writeFileSync } from 'node:fs';

const browser = await chromium.launch({ headless: true });
const base = process.env.PRODUCT_TEST_BASE_URL || 'http://127.0.0.1:3000';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname), 'Browser tests require a local server');
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.setDefaultTimeout(30_000);
const errors = [], requests = [], writes = [], checks = [], listingResponses = [];
const recordCheck = checks.push.bind(checks);
checks.push = (...items) => { for (const item of items) console.log('PASS:', item); return recordCheck(...items); };
page.on('pageerror', error => errors.push(error.message));
let checkoutEnabled = false;
let catalogFailure = false;
let responseGate;
const makeGate = predicate => {
  let release, signal, settle;
  const started = new Promise(resolve => { signal = resolve; });
  const blocked = new Promise(resolve => { release = resolve; });
  const finished = new Promise(resolve => { settle = resolve; });
  return { predicate, started, signal, blocked, release, finished, settle };
};
let fixtureRows = products.map(row => ({ ...row }));
let beforePayload;
// Exercise the same two predicates used by the SQL repository, including
// duplicate display names and legacy labels that must not override an ID.
{
  const probe = [
    { ...products[0], id: 101, subcategory_id: '1', subcategory: 'Fancy Rings' },
    { ...products[0], id: 102, subcategory_id: '2', subcategory: 'Fancy Rings' },
    { ...products[0], id: 103, subcategory_id: null, subcategory: 'Fancy Rings' },
    { ...products[0], id: 104, category_id: 'hair-accessories', subcategory_id: '2', subcategory: 'Fancy Rings' },
  ];
  const list = query => restFixture(`https://fixture.invalid/api/v1/products?${query}`, probe).body.products.map(p => p.id);
  assert.deepEqual(list('categoryId=ad-jewellery&subcategoryId=1'), ['101']);
  assert.deepEqual(list('categoryId=ad-jewellery&subcategoryId=2'), ['102']);
  assert.deepEqual(list('categoryId=hair-accessories&subcategoryId=2'), ['104']);
  assert.ok(list('categoryId=ad-jewellery').includes('103'));
  console.log('PASS: REST subcategory ID, missing ID, conflicting label and duplicate-name fixtures');
}
await page.addInitScript(() => {
  window.Razorpay = class {
    constructor(options) { this.options = options; window.__fixturePaymentOptions = options; }
    on() {}
    open() { this.options.handler({ razorpay_order_id: 'order_fixture', razorpay_payment_id: 'pay_fixture', razorpay_signature: 'fixture-signature' }); }
  };
});
await page.route('**/*', async route => {
  const request = route.request(), url = request.url();
  const parsed = new URL(url);
  if (parsed.pathname.startsWith('/api/')) {
    requests.push(parsed);
    const headers = { 'access-control-allow-origin': base, 'access-control-allow-credentials': 'true' };
    if (request.method() === 'GET' && parsed.pathname === '/api/checkout/status')
      return route.fulfill({ json: checkoutEnabled ? { enabled: true } : { enabled: false, code: 'CHECKOUT_TEMPORARILY_UNAVAILABLE' }, headers });
    if (checkoutEnabled && request.method() === 'GET' && parsed.pathname === '/api/v1/checkout/session')
      return route.fulfill({ json: {}, headers });
    if (checkoutEnabled && request.method() === 'POST' && parsed.pathname === '/api/v1/checkout') {
      const payload = request.postDataJSON();
      writes.push({ path: parsed.pathname, payload });
      return route.fulfill({ json: { order_id: 'order_fixture', access_token: 'fixture_access', provider_order_id: 'provider_fixture', key_id: 'fixture_key', total_paise: 8000 }, headers });
    }
    if (checkoutEnabled && request.method() === 'POST' && parsed.pathname === '/api/v1/orders/order_fixture/confirm') {
      writes.push({ path: parsed.pathname, payload: request.postDataJSON() });
      return route.fulfill({ json: { order_id: 'order_fixture', payment_id: 'pay_fixture', payment_status: 'paid' }, headers });
    }
    if (request.method() === 'GET') {
      if (catalogFailure && parsed.pathname === '/api/v1/products') return route.fulfill({ status: 503, json: { code: 'CATALOG_UNAVAILABLE' }, headers });
      const response = restFixture(url, fixtureRows);
      if (response) {
        if (beforePayload && parsed.pathname === '/api/v1/products' && parsed.searchParams.get('page') === '2') { const mutate = beforePayload; beforePayload = undefined; mutate(); const updated = restFixture(url, fixtureRows); listingResponses.push({ query: parsed.search, count: updated.body.count, ids: updated.body.products.map(p => p.id) }); return route.fulfill({ status: 200, json: updated.body, headers }); }
        if (responseGate?.predicate(parsed)) {
          const gate = responseGate; responseGate = undefined; gate.signal(); await gate.blocked;
          try { await route.fulfill({ status: gate.fail ? 503 : response.status, json: gate.fail ? { code: 'CATALOG_UNAVAILABLE' } : response.body, headers }); gate.settle('fulfilled'); }
          catch { gate.settle('cancelled'); }
          return;
        }
        if (parsed.pathname === '/api/v1/products') listingResponses.push({ query: parsed.search, count: response.body.count, ids: response.body.products.map(p => p.id) });
        return route.fulfill({ status: response.status, json: response.body, headers });
      }
    }
    writes.push({ method: request.method(), path: parsed.pathname });
    errors.push(`Unexpected API request: ${request.method()} ${url}`);
    return route.abort();
  }
  if (url.startsWith('http') && parsed.origin !== base) {
    if (!['fonts.googleapis.com', 'fonts.gstatic.com'].includes(parsed.hostname)) errors.push(`Unexpected external request: ${url}`);
    return route.abort();
  }
  return route.continue();
});
const goto = async path => page.goto(`${base}${path}`);
const cards = () => page.locator('a[href^="/product/"]');
const expectCount = async count => {
  await cards().first().waitFor();
  await page.waitForFunction(expected => document.querySelectorAll('a[href^="/product/"]').length === expected, count);
};
// Use the Node clock for assertions after advancing the browser's virtual clock.
const expectPrice = async amount => {
  let text = '';
  for (let attempt = 0; attempt < 100; attempt++) {
    text = await page.locator('a[href="/product/fixture-47"]').textContent();
    if (text.includes(`\u20b9${amount}`)) return;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  assert.fail(`Expected price ${amount}; received ${text}`);
};
try {
  await goto('/about');
  await page.waitForTimeout(500);
  assert.equal(requests.filter(url => url.pathname.endsWith('/products')).length, 0);
  checks.push('Unrelated page makes no product requests');
  await goto('/'); await expectCount(4);
  checks.push('Homepage featured products');
  await goto('/shop'); await expectCount(20);
  assert.ok((await page.locator('main').innerText()).includes('47'));
  assert.ok((await cards().first().getAttribute('href')).endsWith('fixture-47'));
  await page.getByRole('button', { name: 'Next Page', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('a[href^="/product/"]')?.getAttribute('href') === '/product/fixture-27');
  await expectCount(20);
  await page.getByRole('combobox').selectOption('price-asc');
  await page.waitForFunction(() => document.querySelector('a[href^="/product/"]')?.getAttribute('href') === '/product/fixture-1');
  const delayedSort = makeGate(u => u.pathname === '/api/v1/products' && u.searchParams.get('sort') === 'price-desc');
  responseGate = delayedSort;
  await page.getByRole('combobox').selectOption('price-desc');
  await delayedSort.started;
  await page.getByRole('combobox').selectOption('price-asc');
  delayedSort.release();
  await delayedSort.finished;
  assert.equal(await cards().first().getAttribute('href'), '/product/fixture-1');
  checks.push('Rapid sort navigation ignores cancelled late responses');
  checks.push('Shop pagination, counts and global sorting');
  await page.getByRole('button', { name: 'Add Fixture Product 1 to wishlist', exact: true }).click();
  await goto('/wishlist');
  // Wishlist intentionally resets on hard loads, as before. Test SPA navigation.
  await goto('/shop'); await expectCount(20);
  await page.getByRole('button', { name: 'Add Fixture Product 47 to wishlist', exact: true }).click();
  await page.getByRole('button', { name: 'Wishlist, 1 saved', exact: true }).click();
  assert.ok((await page.locator('body').innerText()).includes('Fixture Product 47'));
  checks.push('Wishlist toggle and modal');
  await goto('/categories/ad-jewellery');
  await page.getByRole('heading', { name: 'Fancy Rings', exact: true }).waitFor();
  await goto('/categories/ad-jewellery/fancy-rings'); await expectCount(10);
  assert.equal(await page.locator('a[href="/product/fixture-11"]').count(), 0);
  checks.push('Category discovery and ID-based subcategory matching');
  await goto('/product/fixture-1');
  await page.getByRole('heading', { name: 'Fixture Product 1', exact: true }).waitFor();
  await expectCount(4);
  await page.getByRole('button', { name: 'Silver', exact: true }).click();
  await page.getByRole('button', { name: 'Add to Cart', exact: true }).click();
  assert.ok((await page.locator('body').innerText()).includes('Silver'));
  checkoutEnabled = true;
  await page.getByRole('button', { name: 'ORDER NOW', exact: true }).click();
  await page.getByRole('dialog', { name: 'Checkout', exact: true }).waitFor();
  // The checkout code and calculations are unchanged. Exercise a fully mocked
  // Razorpay success path and intercept every order write locally.
  await page.getByPlaceholder('e.g. Jessica Sterling').fill('Fixture Customer');
  await page.getByPlaceholder('e.g. +91 98765 43210').fill('9999999999');
  await page.getByPlaceholder('e.g. Tiruchirappalli, TN').fill('Chennai');
  await page.getByPlaceholder('e.g. 620001').fill('620001');
  await page.getByPlaceholder('e.g. 742 Evergreen Terrace, Apt 4B').fill('Fixture address');
  await page.getByRole('button', { name: 'PAY ONLINE & PLACE ORDER', exact: true }).click();
  await page.getByText('pay_fixture', { exact: false }).first().waitFor();
  assert.equal(await page.evaluate(() => window.__fixturePaymentOptions.amount), 8000, 'fixture order amount reaches the payment UI in paise');
  assert.deepEqual(writes.map(item => item.path), ['/api/v1/checkout', '/api/v1/orders/order_fixture/confirm']);
  assert.deepEqual(writes[0].payload.items, [{ product_id: '1', variant_id: '11', quantity: 1 }]);
  checks.push('Detail deep link, variants, related products, add to cart, checkout total and mocked Razorpay success');
  await goto('/product/fixture-2');
  await page.getByRole('heading', { name: 'Fixture Product 2', exact: true }).waitFor();
  assert.ok((await page.locator('main').innerText()).includes('Sold Out'));
  checks.push('Zero stock remains sold out');
  await page.getByRole('button', { name: 'Search products', exact: true }).click();
  await page.getByPlaceholder(/Search hair accessories/).fill('unique description needle');
  await page.getByRole('heading', { name: 'Fixture Product 1', exact: true }).waitFor();
  checks.push('Description search');

  fixtureRows = products.map(row => ({ ...row }));
  await goto('/categories/ad-jewellery?view=products'); await expectCount(20);
  fixtureRows[0].category_id = 'hair-accessories';
  await page.getByRole('combobox').selectOption('price-asc');
  await page.getByText('34 Items Available', { exact: true }).waitFor();
  assert.equal(await page.locator('a[href="/product/fixture-1"]').count(), 0);
  checks.push('Category move refreshes membership and count');

  // Delete after the new metadata read but before the page-two payload reply.
  // Recovery must also remove the formerly cached first page before clamping.
  fixtureRows = products.map(row => ({ ...row }));
  await goto('/categories/ad-jewellery?view=products'); await expectCount(20);
  beforePayload = () => { fixtureRows = fixtureRows.slice(0, 10); };
  await page.getByRole('button', { name: 'Next Page', exact: true }).click();
  await expectCount(10);
  await page.getByText('10 Items Available', { exact: true }).waitFor();
  assert.deepEqual(await cards().evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))), Array.from({ length: 10 }, (_, i) => `/product/fixture-${10 - i}`));
  assert.equal(await page.getByRole('button', { name: 'Next Page', exact: true }).count(), 0);
  assert.ok(listingResponses.some(r => r.query.includes('page=2') && r.query.includes('categoryId=ad-jewellery') && r.count === 10 && r.ids.length === 0));
  checks.push('Catalogue shrink clamps category pagination and refreshes exact product IDs');

  fixtureRows = products.map(row => ({ ...row }));
  await goto('/shop'); await expectCount(20);
  const beforeShopRecovery = listingResponses.length;
  beforePayload = () => { fixtureRows = fixtureRows.slice(0, 10); };
  await page.getByRole('button', { name: 'Next Page', exact: true }).click();
  await expectCount(10);
  assert.deepEqual(await cards().evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))), Array.from({ length: 10 }, (_, i) => `/product/fixture-${10 - i}`));
  await page.getByText('10 Items Available', { exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Next Page', exact: true }).count(), 0);
  const recoveryRequests = listingResponses.slice(beforeShopRecovery);
  assert.equal(recoveryRequests.filter(r => new URLSearchParams(r.query).get('page') === '1').length, 1);
  assert.ok(recoveryRequests.some(r => new URLSearchParams(r.query).get('page') === '2' && r.count === 10 && r.ids.length === 0));
  checks.push('Catalogue shrink clamps shop pagination with one immediate destination refetch');

  fixtureRows = products.map(row => ({ ...row }));
  await goto('/shop'); await expectCount(20);
  const beforeCachedNavigation = listingResponses.length;
  await page.getByRole('button', { name: 'Next Page', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('a[href^="/product/"]')?.getAttribute('href') === '/product/fixture-27');
  await page.getByRole('button', { name: 'Previous Page', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('a[href^="/product/"]')?.getAttribute('href') === '/product/fixture-47');
  assert.equal(listingResponses.slice(beforeCachedNavigation).filter(r => new URLSearchParams(r.query).get('page') === '1').length, 0);
  checks.push('Normal page navigation reuses the fresh page-one cache');

  await goto('/shop'); await expectCount(20);
  beforePayload = () => { fixtureRows = []; };
  await page.getByRole('button', { name: 'Next Page', exact: true }).click();
  await page.getByText('Catalogue is being curated').waitFor();
  assert.equal(await cards().count(), 0);
  assert.equal(await page.getByRole('button', { name: 'Next Page', exact: true }).count(), 0);
  fixtureRows = products.map(row => ({ ...row }));
  await page.reload(); await expectCount(20);
  checks.push('Empty shrink clamps pagination and an expanded catalogue reloads');

  fixtureRows = products.map(row => ({ ...row }));
  await goto('/shop'); await expectCount(20);
  const gatedShop = makeGate(u => u.pathname === '/api/v1/products' && u.searchParams.get('page') === '1');
  responseGate = gatedShop;
  beforePayload = () => { fixtureRows = fixtureRows.slice(0, 10); };
  await page.getByRole('button', { name: 'Next Page', exact: true }).click();
  await gatedShop.started;
  await page.getByText('Loading products...', { exact: true }).waitFor();
  assert.equal(await cards().count(), 0, 'known stale cards must not be displayed during recovery');
  gatedShop.release();
  await expectCount(10);
  assert.deepEqual(await cards().evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))), Array.from({ length: 10 }, (_, i) => `/product/fixture-${10 - i}`));
  assert.equal(await page.getByText('Loading products...', { exact: true }).count(), 0);
  checks.push('Gated destination hides stale products until recovery resolves');

  fixtureRows = products.map(row => ({ ...row }));
  await goto('/categories/ad-jewellery?view=products'); await expectCount(20);
  const gatedCategory = makeGate(u => u.pathname === '/api/v1/products' && u.searchParams.get('page') === '1' && u.searchParams.get('categoryId') === 'ad-jewellery');
  responseGate = gatedCategory;
  beforePayload = () => { fixtureRows = fixtureRows.slice(0, 10); };
  await page.getByRole('button', { name: 'Next Page', exact: true }).click();
  await gatedCategory.started;
  await page.getByText('Loading products...', { exact: true }).waitFor();
  fixtureRows = products.map(row => ({ ...row }));
  await page.evaluate(() => { history.pushState({}, '', '/categories/hair-accessories?view=products'); dispatchEvent(new PopStateEvent('popstate')); });
  await expectCount(12);
  assert.deepEqual(await cards().evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))), Array.from({ length: 12 }, (_, i) => `/product/fixture-${47 - i}`));
  gatedCategory.release();
  const oldCategoryOutcome = await gatedCategory.finished;
  console.log('Old category route handler:', oldCategoryOutcome);
  assert.ok(['fulfilled', 'cancelled'].includes(oldCategoryOutcome));
  await page.getByText('12 Items Available', { exact: true }).waitFor();
  assert.deepEqual(await cards().evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))), Array.from({ length: 12 }, (_, i) => `/product/fixture-${47 - i}`));
  assert.equal(await page.getByRole('button', { name: 'Next Page', exact: true }).count(), 0);
  checks.push('Delayed category recovery cannot replace the newer category listing');

  fixtureRows = products.map(row => ({ ...row, subcategory_id: row.id <= 35 ? '1' : row.subcategory_id }));
  await goto('/categories/ad-jewellery/fancy-rings'); await expectCount(20);
  const gatedSub = makeGate(u => u.pathname === '/api/v1/products' && u.searchParams.get('page') === '1' && u.searchParams.get('subcategoryId') === '1');
  responseGate = gatedSub;
  beforePayload = () => { fixtureRows = fixtureRows.slice(0, 10); };
  await page.getByRole('button', { name: 'Next Page', exact: true }).click();
  await gatedSub.started;
  await page.getByText('Loading products...', { exact: true }).waitFor();
  fixtureRows = products.map(row => ({ ...row }));
  await page.evaluate(() => { history.pushState({}, '', '/categories/hair-accessories/fancy-rings'); dispatchEvent(new PopStateEvent('popstate')); });
  await expectCount(1);
  gatedSub.release(); await gatedSub.finished;
  assert.deepEqual(await cards().evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))), ['/product/fixture-36']);
  assert.equal(await page.getByRole('button', { name: 'Next Page', exact: true }).count(), 0);
  checks.push('Settled old subcategory recovery does not replace the active collection');

  fixtureRows = products.map(row => ({ ...row }));
  await goto('/shop'); await expectCount(20);
  const gatedSortRecovery = makeGate(u => u.pathname === '/api/v1/products' && u.searchParams.get('page') === '1' && u.searchParams.get('sort') === 'newest');
  responseGate = gatedSortRecovery;
  beforePayload = () => { fixtureRows = fixtureRows.slice(0, 10); };
  await page.getByRole('button', { name: 'Next Page', exact: true }).click();
  await gatedSortRecovery.started;
  await page.getByText('Loading products...', { exact: true }).waitFor();
  await page.getByRole('combobox').selectOption('price-asc');
  await expectCount(10);
  gatedSortRecovery.release(); await gatedSortRecovery.finished;
  assert.deepEqual(await cards().evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))), Array.from({ length: 10 }, (_, i) => `/product/fixture-${i + 1}`));
  assert.equal(await page.getByRole('button', { name: 'Next Page', exact: true }).count(), 0);
  checks.push('Sort change during gated recovery keeps the active sorted listing');

  fixtureRows = products.map(row => ({ ...row }));
  await goto('/shop'); await expectCount(20);
  fixtureRows = fixtureRows.slice(0, 20);
  const olderShrink = makeGate(u => u.pathname === '/api/v1/products' && u.searchParams.get('page') === '2' && u.searchParams.get('sort') === 'newest');
  responseGate = olderShrink;
  const shrinkRequestStart = requests.length;
  await page.getByRole('button', { name: 'Next Page', exact: true }).click();
  await olderShrink.started;
  fixtureRows = fixtureRows.slice(0, 10);
  await page.getByRole('combobox').selectOption('price-asc');
  await expectCount(10);
  olderShrink.release(); await olderShrink.finished;
  assert.deepEqual(await cards().evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))), Array.from({ length: 10 }, (_, i) => `/product/fixture-${i + 1}`));
  await page.getByText('10 Items Available', { exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Next Page', exact: true }).count(), 0);
  const shrinkRequests = requests.slice(shrinkRequestStart).filter(u => u.pathname === '/api/v1/products');
  assert.equal(shrinkRequests.filter(u => u.searchParams.get('page') === '2' && u.searchParams.get('sort') === 'newest').length, 1);
  assert.equal(shrinkRequests.filter(u => u.searchParams.get('page') === '1' && u.searchParams.get('sort') === 'price-asc').length, 1);
  checks.push('Out-of-order shrink responses preserve the newer sort and count');

  fixtureRows = products.map(row => ({ ...row }));
  await goto('/shop'); await expectCount(20);
  const gatedFailure = makeGate(u => u.pathname === '/api/v1/products' && u.searchParams.get('page') === '1');
  responseGate = gatedFailure;
  beforePayload = () => { fixtureRows = fixtureRows.slice(0, 10); };
  await page.getByRole('button', { name: 'Next Page', exact: true }).click();
  await gatedFailure.started;
  await page.getByText('Loading products...', { exact: true }).waitFor();
  catalogFailure = true; gatedFailure.fail = true; gatedFailure.release(); await gatedFailure.finished;
  await page.getByRole('alert').filter({ hasText: 'catalogue is temporarily unavailable' }).waitFor();
  assert.equal(await cards().count(), 0);
  assert.equal(await page.getByText('Loading products...', { exact: true }).count(), 0);
  catalogFailure = false;
  await page.getByRole('button', { name: 'Try again' }).click(); await expectCount(10);
  assert.deepEqual(await cards().evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))), Array.from({ length: 10 }, (_, i) => `/product/fixture-${10 - i}`));
  checks.push('Failed gated recovery shows error and retry restores correct products');

  fixtureRows = products.map(row => ({ ...row }));
  await goto('/shop'); await expectCount(20);
  const gatedSearch = makeGate(u => u.pathname === '/api/v1/products' && u.searchParams.get('page') === '1');
  responseGate = gatedSearch;
  beforePayload = () => { fixtureRows = fixtureRows.slice(0, 10); };
  await page.getByRole('button', { name: 'Next Page', exact: true }).click();
  await gatedSearch.started;
  await page.getByRole('button', { name: 'Search products', exact: true }).click();
  await page.getByPlaceholder(/Search hair accessories/).fill('unique description needle');
  await page.getByRole('heading', { name: 'Fixture Product 1', exact: true, level: 4 }).waitFor();
  gatedSearch.release(); await gatedSearch.finished;
  await page.getByRole('heading', { name: 'Fixture Product 1', exact: true, level: 4 }).waitFor();
  checks.push('Search modal remains usable during gated listing recovery');

  fixtureRows = products.map(row => ({ ...row }));
  await goto('/categories/ad-jewellery?view=products'); await expectCount(20);
  const refreshListings = () => page.evaluate(async () => { const { invalidateProductQueries } = await import('/src/lib/productQueries.ts'); await invalidateProductQueries(); });
  fixtureRows = fixtureRows.slice(0, 10);
  await refreshListings(); await expectCount(10);
  assert.deepEqual(await cards().evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))), Array.from({ length: 10 }, (_, i) => `/product/fixture-${10 - i}`));
  assert.equal(await page.getByRole('button', { name: 'Next Page', exact: true }).count(), 0);
  fixtureRows = [];
  await refreshListings();
  await page.getByText('Coming soon', { exact: true }).waitFor();
  assert.equal(await cards().count(), 0);
  fixtureRows = products.map(row => ({ ...row }));
  await refreshListings(); await expectCount(20);
  assert.equal(await cards().first().getAttribute('href'), '/product/fixture-35');
  await page.getByText('35 Items Available', { exact: true }).waitFor();
  checks.push('Page-one refresh handles shrink, empty and expansion');

  fixtureRows = products.map(row => ({ ...row }));
  await goto('/categories/ad-jewellery/fancy-rings'); await expectCount(10);
  fixtureRows[0].subcategory_id = '22222222-2222-4222-8222-222222222222';
  fixtureRows[0].subcategory = 'Fancy Rings';
  await page.getByRole('combobox').selectOption('price-asc');
  await expectCount(9);
  checks.push('Subcategory move refreshes membership');

  fixtureRows = products.map(row => ({ ...row }));
  checkoutEnabled = false;
  await goto('/product/fixture-1');
  await page.getByRole('heading', { name: 'Fixture Product 1', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Add to Cart', exact: true }).click();
  const cartLine = page.locator('h4').filter({ hasText: 'Fixture Product 1' }).locator('..');
  await cartLine.locator('div.flex.items-center.border button').nth(1).click();
  await page.getByRole('heading', { name: 'Shopping Bag (2)' }).waitFor();
  await page.getByRole('button', { name: 'Close cart' }).click();
  await page.getByRole('link', { name: 'SHOP', exact: true }).first().click();
  await page.getByRole('button', { name: 'View cart, 2 items' }).waitFor();
  await page.getByRole('button', { name: 'View cart, 2 items' }).click();
  await page.getByRole('button', { name: 'ORDER NOW', exact: true }).click();
  await page.getByRole('button', { name: 'Checkout Temporarily Unavailable' }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Checkout Temporarily Unavailable' }).isDisabled(), true);
  await page.getByRole('button', { name: 'Close checkout' }).click();
  checkoutEnabled = true;
  await page.getByRole('button', { name: 'View cart, 2 items' }).click();
  await page.getByRole('button', { name: 'ORDER NOW', exact: true }).click();
  await page.getByRole('button', { name: 'PAY ONLINE & PLACE ORDER' }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'PAY ONLINE & PLACE ORDER' }).click();
  assert.equal(await page.getByPlaceholder('e.g. Jessica Sterling').evaluate(el => el.validity.valueMissing), true);
  await page.getByRole('button', { name: 'Close checkout' }).click();
  await page.getByRole('button', { name: 'View cart, 2 items' }).click();
  await page.getByTitle('Remove item').click();
  await page.getByText('Your shopping bag is empty').waitFor();
  await page.getByRole('button', { name: 'Close cart' }).click();
  await page.getByRole('button', { name: 'Add Fixture Product 47 to cart' }).click();
  await page.getByRole('heading', { name: 'Shopping Bag (1)' }).waitFor();
  await page.reload();
  await page.getByRole('button', { name: 'View cart, 0 items' }).waitFor();
  checks.push('Cart quantity, SPA persistence, removal, refresh reset and checkout safeguards');

  fixtureRows = [];
  await goto('/shop');
  await page.getByText('Catalogue is being curated').waitFor();
  assert.equal(await cards().count(), 0);
  catalogFailure = true;
  await goto('/shop');
  await page.getByRole('alert').filter({ hasText: 'catalogue is temporarily unavailable' }).waitFor();
  catalogFailure = false;
  fixtureRows = products.map(row => ({ ...row }));
  await page.getByRole('button', { name: 'Try again' }).click();
  await expectCount(20);
  checks.push('Empty catalogue, API failure and retry recovery');

  await page.setViewportSize({ width: 390, height: 844 });
  await goto('/shop'); await expectCount(20);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.setViewportSize({ width: 1440, height: 1000 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  checks.push('Mobile and desktop listing fit the viewport');

  fixtureRows = products.map(row => ({ ...row }));
  await page.clock.install();
  await goto('/shop'); await expectCount(20);
  await page.locator('a[href="/product/fixture-47"]').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const image = document.querySelector('a[href="/product/fixture-47"] img');
    return image?.complete && image.naturalWidth > 0;
  });
  const imageReads = () => requests.filter(url => /^\/api\/v1\/products\/\d+$/.test(url.pathname)).length;
  const listingReads = () => requests.filter(url => url.pathname === '/api/v1/products').length;
  const imagesBefore = imageReads();
  const listingsBefore = listingReads();
  fixtureRows[46].price = 777; fixtureRows[46].sale_price = 777;
  await page.clock.fastForward(31_000);
  await expectPrice(777);
  assert.ok(listingReads() > listingsBefore, 'visible listing must refresh without user navigation');
  assert.equal(imageReads(), imagesBefore, 'listing refresh must reuse image cache');

  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    window.dispatchEvent(new Event('visibilitychange'));
  });
  const hiddenReads = listingReads();
  await page.clock.fastForward(31_000);
  assert.equal(listingReads(), hiddenReads, 'hidden listing must not poll');
  fixtureRows[46].price = 888; fixtureRows[46].sale_price = 888;
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
    window.dispatchEvent(new Event('visibilitychange'));
  });
  await expectPrice(888);
  assert.equal(imageReads(), imagesBefore, 'focus refresh must not refetch images');
  checks.push('Visible-page refresh is bounded; hidden pages pause; focus refreshes data without images');

  // Changes are visible on stale SPA navigation, preserving in-memory caches.
  await page.evaluate(() => { history.pushState({}, '', '/about'); dispatchEvent(new PopStateEvent('popstate')); });
  const aboutReads = listingReads();
  await page.clock.fastForward(31_000);
  assert.equal(listingReads(), aboutReads, 'unrelated route must not poll products');
  fixtureRows[46].price = 999; fixtureRows[46].sale_price = 999;
  await page.evaluate(() => { history.pushState({}, '', '/shop'); dispatchEvent(new PopStateEvent('popstate')); });
  await expectPrice(999);
  assert.equal(imageReads(), imagesBefore, 'navigation must reuse unexpired image data');
  checks.push('Stale SPA navigation refreshes products; unrelated routes do not poll');

  assert.deepEqual(errors, []);
  assert.ok(requests.filter(url => url.pathname.endsWith('/products')).every(url => url.searchParams.get('select') !== '*'));
  writeFileSync('reports/product-browser-regressions-phase4.json', JSON.stringify({ checks, pageErrors: errors, interceptedOrderWrites: writes.length, realPaymentCalls: 0 }, null, 2));
  console.log(checks.join('\n'));
} catch (error) {
  console.log('Completed checks:', checks, 'Page errors:', errors, 'Body:', (await page.locator('body').innerText()).slice(-2500));
  throw error;
} finally { await browser.close(); }
