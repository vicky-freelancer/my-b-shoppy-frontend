-- Additive migration for the shared admin/storefront categories table.
-- Display order is controlled by the catalog configuration in each application.
-- Existing products, collections and other parent categories are preserved.
insert into public.categories (id, name, slug, is_active) values
  ('ad-jewellery', 'AD Jewellery', 'ad-jewellery', true),
  ('hair-accessories', 'Hair Accessories', 'hair-accessories', true),
  ('anti-tarnish-jewellery', 'Anti Tarnish Jewellery', 'anti-tarnish-jewellery', true),
  ('ear-rings', 'Ear Rings', 'ear-rings', true),
  ('bows-and-scrunchies', 'Bows & Scrunchies', 'bows-and-scrunchies', true),
  ('bags', 'Bags', 'bags', true),
  ('mobile-charms', 'Mobile Charms', 'mobile-charms', true),
  ('key-chains', 'Key Chains', 'key-chains', true),
  ('men-accessories', 'Mens Accessories', 'men-accessories', true),
  ('stationery-and-gifts', 'Stationery & Gifts', 'stationery-and-gifts', true)
on conflict (id) do update
set name = excluded.name, slug = excluded.slug, is_active = true;
