-- Additive migration for an existing shared admin/storefront categories table.
-- Already applied by backend/scripts/sync-parent-categories.mjs on this project.
-- Existing products, collections and other parent categories are preserved.
insert into public.categories (id, name, slug, is_active) values
  ('bows-and-scrunchies', 'Bows & Scrunchies', 'bows-and-scrunchies', true),
  ('key-chains', 'Key chains', 'key-chains', true),
  ('mobile-charms', 'Mobile charms', 'mobile-charms', true),
  ('men-accessories', 'Men accessories', 'men-accessories', true)
on conflict (id) do update
set name = excluded.name, slug = excluded.slug, is_active = true;
