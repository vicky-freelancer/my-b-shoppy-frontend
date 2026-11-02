import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { products, respond } from './product-fixtures.mjs';
import { writeFileSync } from 'node:fs';

const browser = await chromium.launch({ headless: true });
const base = process.env.PRODUCT_TEST_BASE_URL || 'http://127.0.0.1:3000';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname), 'Browser tests require a local server');
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [], requests = [], writes = [], checks = [];
page.on('pageerror', error => errors.push(error.message));
let paymentAmount;
let slowDescending = false;
let fixtureRows = products.map(row => ({ ...row }));
let beforePayload;
await page.addInitScript(() => {
  window.Razorpay = class {
    constructor(options) { this.options = options; }
    on() {}
    open() { this.options.handler({ razorpay_order_id: 'order_fixture', razorpay_payment_id: 'pay_fixture', razorpay_signature: 'fixture-signature' }); }
  };
});
await page.route('**/*', async route => {
  const request = route.request(), url = request.url();
  if (url.includes('.supabase.co/rest/v1/')) {
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: {
      'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': request.headers()['access-control-request-headers'] || '*',
    } });
    if (!['GET', 'HEAD'].includes(request.method())) {
      writes.push({ table: new URL(url).pathname.split('/').pop(), method: request.method() });
      return route.fulfill({ status: 201, json: [], headers: { 'access-control-allow-origin': '*' } });
    }
    requests.push(new URL(url));
    if (beforePayload && new URL(url).searchParams.get('select')?.includes('variants')) {
      const mutate = beforePayload; beforePayload = undefined; mutate();
    }
    if (slowDescending && new URL(url).searchParams.get('order')?.startsWith('price.desc')) {
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    const response = respond(url, fixtureRows);
    if (request.method() === 'HEAD') return route.fulfill({ status: 200, body: '', headers: response.headers });
    return route.fulfill({ status: response.status, json: response.status === 416
      ? { message: 'Requested range not satisfiable' } : response.rows, headers: response.headers });
  }
  if (url.includes('/api/create-order')) {
    paymentAmount = request.postDataJSON().amount;
    return route.fulfill({ json: { id: 'order_fixture', amount: paymentAmount, currency: 'INR', key_id: 'rzp_test_fixture' } });
  }
  if (url.includes('/api/verify-payment')) return route.fulfill({ json: { valid: true } });
  if (url.startsWith('http') && new URL(url).origin !== base) return route.abort();
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
    if (text.includes(`₹${amount}`)) return;
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
  slowDescending = true;
  const delayed = page.waitForRequest(request => new URL(request.url()).searchParams.get('order')?.startsWith('price.desc'));
  await page.getByRole('combobox').selectOption('price-desc');
  await delayed;
  await page.getByRole('combobox').selectOption('price-asc');
  await page.waitForTimeout(1000);
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
  await goto('/categories/ad-jewellery/fancy-rings'); await expectCount(11);
  checks.push('Category discovery and legacy subcategory matching');
  await goto('/product/fixture-1');
  await page.getByRole('heading', { name: 'Fixture Product 1', exact: true }).waitFor();
  await expectCount(4);
  await page.getByRole('button', { name: 'Silver', exact: true }).click();
  await page.getByRole('button', { name: 'Add to Cart', exact: true }).click();
  assert.ok((await page.locator('body').innerText()).includes('Silver'));
  await page.getByRole('button', { name: 'ORDER NOW', exact: true }).click();
  await page.getByRole('dialog', { name: 'Checkout', exact: true }).waitFor();
  // The checkout code and calculations are unchanged. Exercise a fully mocked
  // Razorpay success path and intercept every order write locally.
  await page.getByPlaceholder('e.g. Jessica Sterling').fill('Fixture Customer');
  await page.getByPlaceholder('e.g. +91 98765 43210').fill('9999999999');
  await page.getByPlaceholder('e.g. Tiruchirappalli, TN').fill('Chennai');
  await page.getByPlaceholder('e.g. 742 Evergreen Terrace, Apt 4B').fill('Fixture address');
  await page.getByRole('button', { name: 'PAY ONLINE & PLACE ORDER', exact: true }).click();
  await page.getByText('pay_fixture', { exact: false }).first().waitFor();
  assert.equal(paymentAmount, 7000, '10 product + 60 courier, converted to paise');
  assert.deepEqual(writes, [{ table: 'orders', method: 'POST' }]);
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
  checks.push('Concurrent deletion/416 clamps filtered pagination and replaces cached earlier page');

  fixtureRows = products.map(row => ({ ...row }));
  await goto('/categories/ad-jewellery/fancy-rings'); await expectCount(11);
  fixtureRows[0].subcategory_id = '22222222-2222-4222-8222-222222222222';
  fixtureRows[0].subcategory = 'Fancy Rings';
  await page.getByRole('combobox').selectOption('price-asc');
  await expectCount(10);
  checks.push('Subcategory move refreshes membership');

  fixtureRows = products.map(row => ({ ...row }));
  await page.clock.install();
  await goto('/shop'); await expectCount(20);
  await page.locator('a[href="/product/fixture-47"]').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const image = document.querySelector('a[href="/product/fixture-47"] img');
    return image?.complete && image.naturalWidth > 0;
  });
  const imageReads = () => requests.filter(url => url.searchParams.get('select') === 'id,image_url').length;
  const listingReads = () => requests.filter(url => url.searchParams.get('select')?.includes('variants')).length;
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
