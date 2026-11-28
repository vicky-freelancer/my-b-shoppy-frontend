// Deterministic catalog rows for offline browser tests.
export const products = Array.from({ length: 47 }, (_, index) => {
  const id = index + 1;
  return {
    id, slug: `fixture-${id}`, name: `Fixture Product ${id}`, title: `Fixture Product ${id}`,
    price: id * 10, sale_price: id * 10, mrp: id * 10 + 20, quantity: id === 2 ? 0 : 5,
    stock: 5, in_stock: true, variants: ['Gold', 'Silver'],
    category_id: id <= 35 ? 'ad-jewellery' : 'hair-accessories',
    category: id <= 35 ? 'AD Jewellery' : 'Hair Accessories',
    subcategory_id: id <= 10 ? '1' : id === 36 ? '2' : null,
    subcategory: id === 11 || id === 36 ? 'Fancy Rings' : null,
    created_at: '2026-01-01T00:00:00Z', rating: id % 5 || 5, reviews_count: id,
    badge: id <= 4 ? 'NEW' : null, material: 'Gold', stone: 'Crystal',
    description: id === 1 ? 'Unique description needle' : `Product description ${id}`,
    image_url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect width="40" height="40" fill="gold"/%3E%3C/svg%3E',
  };
});
export const subcategories = [{ id: '1', category_id: 'ad-jewellery',
  name: 'Fancy Rings', slug: 'fancy-rings', featured_image: '', is_active: true, sort_order: 0 },
  { id: '2', category_id: 'hair-accessories', name: 'Fancy Rings', slug: 'fancy-rings', featured_image: '', is_active: true, sort_order: 0 }];

// Contract: backend/src/commerce/app.mjs and repository.mjs. IDs are decimal
// strings as emitted by Repository.enrich; subcategory IDs are database IDs.
export function restFixture(rawUrl, inputRows = products) {
  const url = new URL(rawUrl), params = url.searchParams;
  const rows = inputRows.map(row => ({ ...row, id: String(row.id),
    subcategory_id: row.subcategory_id ? String(row.subcategory_id) : null,
    in_stock: row.quantity > 0, available_quantity: row.quantity,
    variant_options: row.variants.map((label, i) => ({ id: String(Number(row.id) * 10 + i), label, is_active: 1, sort_order: i })),
    images: [{ asset_id: String(row.id), position: 0, url: row.image_url }],
  }));
  if (url.pathname === '/api/v1/categories') return { status: 200, body: { categories: [
    { id: 'ad-jewellery', name: 'AD Jewellery', count: 35, startingPrice: 10, image_url: '' },
    { id: 'hair-accessories', name: 'Hair Accessories', count: 12, startingPrice: 360, image_url: '' },
  ] } };
  if (url.pathname === '/api/v1/subcategories') return { status: 200, body: { subcategories } };
  if (url.pathname === '/api/v1/products/resolve') {
    const ids = (params.get('ids') || '').split(',');
    return { status: 200, body: { products: rows.filter(row => ids.includes(row.id) || ids.includes(row.slug)) } };
  }
  if (url.pathname.startsWith('/api/v1/products/')) {
    const key = decodeURIComponent(url.pathname.slice('/api/v1/products/'.length));
    const product = rows.find(row => row.id === key || row.slug === key);
    return product ? { status: 200, body: { product } } : { status: 404, body: { code: 'PRODUCT_NOT_FOUND' } };
  }
  if (url.pathname !== '/api/v1/products') return null;
  let filtered = rows.filter(row => (!params.has('categoryId') || row.category_id === params.get('categoryId')) &&
    (!params.has('subcategoryId') || row.subcategory_id === params.get('subcategoryId')) &&
    (params.get('featured') !== 'true' || row.badge) &&
    (!params.has('q') || [row.title, row.description, row.material, row.stone, row.category].join(' ').toLowerCase().includes(params.get('q').toLowerCase())));
  const sort = params.get('sort') || 'newest';
  const value = row => sort === 'rating' ? row.rating : sort === 'popular' ? row.reviews_count : sort.startsWith('price-') ? row.sale_price : Number(row.id);
  filtered.sort((a, b) => (sort === 'price-asc' ? 1 : -1) * (value(a) - value(b)) || Number(b.id) - Number(a.id));
  const count = filtered.length, page = Number(params.get('page') || 1), size = Number(params.get('pageSize') || 20);
  return { status: 200, body: { products: filtered.slice((page - 1) * size, page * size), count } };
}

export function respond(rawUrl, inputRows = products) {
  const url = new URL(rawUrl);
  const params = url.searchParams;
  let rows = url.pathname.endsWith('/subcategories') ? [...subcategories] : [...inputRows];
  for (const [column, value] of params) {
    if (value.startsWith('in.(')) {
      const ids = value.slice(4, -1).split(',').map(id => id.replace(/^"|"$/g, ''));
      rows = rows.filter(row => ids.includes(String(row[column])));
    } else if (value.startsWith('eq.')) rows = rows.filter(row => String(row[column]) === value.slice(3));
  }
  const orders = (params.get('order') || '').split(',').filter(Boolean);
  rows.sort((a, b) => {
    for (const order of orders) {
      const [column, direction] = order.split('.');
      const comparison = a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
      if (comparison) return direction === 'desc' ? -comparison : comparison;
    }
    return 0;
  });
  const total = rows.length;
  const offset = Number(params.get('offset') || 0), limit = Number(params.get('limit') || 1000);
  const status = offset > 0 && offset >= total ? 416 : 200;
  rows = rows.slice(offset, offset + limit);
  const select = params.get('select');
  if (select && select !== '*') rows = rows.map(row => Object.fromEntries(select.split(',').map(key => [key, row[key] ?? null])));
  return { rows, status, headers: { 'content-type': 'application/json', 'content-range': `${offset}-${offset + rows.length - 1}/${total}`,
    'access-control-allow-origin': '*', 'access-control-expose-headers': 'Content-Range' } };
}
