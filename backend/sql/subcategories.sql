-- Run this in the Supabase SQL editor before using the storefront
-- Category -> Subcategory -> Products navigation.
-- Safe to re-run: all objects are created only when missing.

create extension if not exists pgcrypto;

create table if not exists public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id text not null,
  name text not null,
  slug text not null,
  featured_image text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, slug)
);

create index if not exists subcategories_category_idx
  on public.subcategories (category_id, is_active, sort_order);

-- Products can be linked to a subcategory by UUID (preferred) or by name.
alter table public.products
  add column if not exists subcategory_id uuid references public.subcategories(id) on delete set null;

alter table public.products
  add column if not exists subcategory text;

create index if not exists products_subcategory_idx
  on public.products (subcategory_id);

alter table public.subcategories enable row level security;

drop policy if exists "Public can read active subcategories" on public.subcategories;
create policy "Public can read active subcategories"
  on public.subcategories
  for select
  using (is_active = true);

-- The admin dashboard should write with the service-role key (bypasses RLS).
-- If it writes with an authenticated anon key instead, add a manage policy there.
