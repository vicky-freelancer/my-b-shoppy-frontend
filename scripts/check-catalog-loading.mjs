import assert from 'node:assert/strict';
import http from 'node:http';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const root = path.resolve('frontend/dist');
const server = http.createServer(async (request, response) => {
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
  if (file !== root && !file.startsWith(root + path.sep)) return response.writeHead(403).end();
  try {
    const data = await readFile(file);
    response.setHeader('Content-Type', ({ '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' })[path.extname(file)] || 'application/octet-stream');
    response.end(data);
  } catch {
    response.setHeader('Content-Type', 'text/html');
    response.end(await readFile(path.join(root, 'index.html')));
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
let releaseSubcategories;
let releaseRefresh;
const subcategoriesGate = new Promise(resolve => { releaseSubcategories = resolve; });
const refreshGate = new Promise(resolve => { releaseRefresh = resolve; });
try {
  browser = await chromium.launch();
  const page = await browser.newPage();
  let productRequests = 0;
  await page.route('**/*', async route => {
    const url = route.request().url();
    if (url.startsWith('http://127.0.0.1:')) return route.continue();
    if (url.includes('/rest/v1/products')) {
      productRequests++;
      if (productRequests > 1) await refreshGate;
      return route.fulfill({ json: [{ id: 'test-product', name: 'Loading test necklace', price: 120, category_id: 'ad-jewellery', variants: ['Standard'], image_url: '/images/products/gold-necklace.svg' }] });
    }
    if (url.includes('/rest/v1/subcategories')) {
      await subcategoriesGate;
      return route.fulfill({ json: [] });
    }
    return route.abort();
  });
  await page.goto(`http://127.0.0.1:${server.address().port}/shop`, { waitUntil: 'domcontentloaded' });
  const product = page.getByRole('heading', { name: 'Loading test necklace', exact: true });
  await product.waitFor({ timeout: 10000 });
  assert.equal(await page.getByText('Synchronizing products with Supabase...').count(), 0, 'Product grid must not wait for subcategories');
  assert.equal(productRequests, 1);
  releaseSubcategories();
  await page.waitForTimeout(3200);
  await page.evaluate(() => {
    window.dispatchEvent(new Event('focus'));
    window.dispatchEvent(new Event('focus'));
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(200);
  assert.equal(productRequests, 2, 'Simultaneous events must share one refresh');
  assert(await product.isVisible(), 'Products must remain visible during a pending refresh');
  assert.equal(await page.getByText('Synchronizing products with Supabase...').count(), 0);
  releaseRefresh();
  console.log('PASS: products render before subcategories; background refresh keeps grid visible; duplicate events share one request.');
} finally {
  releaseSubcategories();
  releaseRefresh();
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
