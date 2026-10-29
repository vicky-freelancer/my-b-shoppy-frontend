import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { CATEGORIES_CATALOG, INITIAL_PRODUCTS } from '../src/storeConfig';
import { fetchSupabaseProducts, fetchSupabaseSubcategories } from '../src/lib/supabaseClient';

const parents = [
  ['bows-and-scrunchies', 'Bows & Scrunchies'],
  ['key-chains', 'Key chains'],
  ['mobile-charms', 'Mobile charms'],
  ['men-accessories', 'Men accessories'],
];
assert.equal(CATEGORIES_CATALOG.length, 9);
for (const [id, name] of parents) {
  const category = CATEGORIES_CATALOG.find((category) => category.id === id);
  assert.equal(category?.name, name);
  assert.ok(existsSync(new URL(`../public${category!.imageUrl}`, import.meta.url)));
}
for (const id of ['silk-luxe-scrunchie', 'rust-scrunchie', 'satin-bow', 'velvet-pearl-bow']) {
  assert.equal(INITIAL_PRODUCTS.find((product) => product.id === id)?.categoryId, 'bows-and-scrunchies');
}

const fixtures = [
  ...parents.map(([id]) => id), 'bows', 'scrunchies', 'mens-collection', 'Key chains',
  'Mobile charms', 'Men accessories', 'Bows & Scrunchies',
];
const expected = [...parents.map(([id]) => id), 'bows-and-scrunchies', 'bows-and-scrunchies',
  'men-accessories', 'key-chains', 'mobile-charms', 'men-accessories', 'bows-and-scrunchies'];
// Exercise the real Supabase adapter using admin-shaped product and collection rows.
Object.assign(globalThis, { window: { fetch: async (input: RequestInfo | URL) => {
  const url = String(input);
  const rows = fixtures.map((category, index) => url.includes('/subcategories')
    ? { id: index + 1, category_id: category, name: `Collection ${index}`, slug: `collection-${index}`, is_active: true }
    : { id: index + 1, title: `Product ${index}`, category_id: category, category: 'Old label', sale_price: 100, quantity: 3 });
  return new Response(JSON.stringify(rows), { status: 200, headers: { 'Content-Type': 'application/json' } });
} } });
const products = await fetchSupabaseProducts();
assert.equal(products.error, null);
assert.deepEqual(products.data?.map((product) => product.categoryId), expected);
const subcategories = await fetchSupabaseSubcategories();
assert.equal(subcategories.error, null);
assert.deepEqual(subcategories.data?.map((subcategory) => subcategory.categoryId), expected);
console.log('Category sync checks passed: nine parents, images, sample products, admin payloads and legacy aliases.');
