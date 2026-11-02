// Offline PostgREST fixture. No production writes or payment provider calls.
export const products = Array.from({ length: 47 }, (_, index) => {
  const id = index + 1;
  return {
    id, slug: `fixture-${id}`, name: `Fixture Product ${id}`, title: `Fixture Product ${id}`,
    price: id * 10, sale_price: id * 10, mrp: id * 10 + 20, quantity: id === 2 ? 0 : 5,
    stock: 5, in_stock: true, variants: ['Gold', 'Silver'],
    category_id: id <= 35 ? 'ad-jewellery' : 'hair-accessories',
    category: id <= 35 ? 'AD Jewellery' : 'Hair Accessories',
    subcategory_id: id <= 10 ? '11111111-1111-4111-8111-111111111111' : null,
    subcategory: id === 11 ? 'Fancy---Rings' : null,
    created_at: '2026-01-01T00:00:00Z', rating: id % 5 || 5, reviews_count: id,
    badge: id <= 4 ? 'NEW' : null, material: 'Gold', stone: 'Crystal',
    description: id === 1 ? 'Unique description needle' : `Product description ${id}`,
    image_url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect width="40" height="40" fill="gold"/%3E%3C/svg%3E',
  };
});
export const subcategories = [{ id: '11111111-1111-4111-8111-111111111111', category_id: 'ad-jewellery',
  name: 'Fancy Rings', slug: 'fancy-rings', featured_image: '', is_active: true, sort_order: 0 }];

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
