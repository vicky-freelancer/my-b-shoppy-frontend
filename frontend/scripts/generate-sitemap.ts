/**
 * Sitemap & robots.txt generator for my B shoppy (https://mybshoppy.com)
 *
 * Run: npm run sitemap
 * Regenerates public/sitemap.xml and public/robots.txt from the live
 * catalogue API so the sitemap always matches published products.
 * Falls back to the bundled storeConfig catalogue when the API is unavailable.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { CATEGORIES_CATALOG, INITIAL_PRODUCTS } from '../src/storeConfig';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://mybshoppy.com';
const TODAY = new Date().toISOString().split('T')[0];
const API_BASE = (process.env.SITEMAP_API_URL || process.env.VITE_API_URL || 'https://api.mybshoppy.com').replace(/\/+$/, '');

interface SitemapEntry {
  path: string;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: string;
  lastmod?: string;
}

interface CatalogProduct { id?: string | number; slug?: string; is_active?: unknown; archived_at?: unknown }
interface CatalogCategory { id?: string | number; slug?: string }
interface CatalogSubcategory { category_id?: string | number; slug?: string }

const baseEntries: SitemapEntry[] = [
  // Core storefront
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/shop', changefreq: 'daily', priority: '0.9' },
  { path: '/categories', changefreq: 'weekly', priority: '0.9' },
];

const contentEntries: SitemapEntry[] = [
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
];

function staticEntries(): SitemapEntry[] {
  return [
    ...baseEntries,
    ...CATEGORIES_CATALOG.map((category) => ({
      path: `/categories/${category.id}`,
      changefreq: 'weekly' as const,
      priority: '0.8',
    })),
    ...INITIAL_PRODUCTS.map((product) => ({
      path: `/product/${product.id}`,
      changefreq: 'weekly' as const,
      priority: '0.7',
    })),
    ...contentEntries,
  ];
}

async function fetchCatalog(): Promise<{ categories: CatalogCategory[]; subcategories: CatalogSubcategory[]; products: CatalogProduct[] }> {
  const get = async (path: string) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    try {
      const response = await fetch(`${API_BASE}/api/v1/${path}`, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json() as Record<string, unknown>;
      if (!Array.isArray(data.categories) && !Array.isArray(data.subcategories) && !Array.isArray(data.products)) {
        throw new Error('Invalid catalog response');
      }
      return data;
    } finally {
      clearTimeout(timer);
    }
  };
  const [categories, subcategories, products] = await Promise.all([
    get('categories'), get('subcategories'), get('products?pageSize=500&sort=newest'),
  ]);
  return {
    categories: (categories.categories || []) as CatalogCategory[],
    subcategories: (subcategories.subcategories || []) as CatalogSubcategory[],
    products: (products.products || []) as CatalogProduct[],
  };
}

async function liveEntries(): Promise<SitemapEntry[] | null> {
  try {
    const catalog = await fetchCatalog();
    if (!catalog.categories.length) return null;
    const paths = new Map<string, SitemapEntry>();
    const add = (entry: SitemapEntry) => { if (!paths.has(entry.path)) paths.set(entry.path, entry); };
    baseEntries.forEach(add);
    catalog.categories.forEach((category) => {
      const slug = category.slug || category.id;
      if (slug) add({ path: `/categories/${slug}`, changefreq: 'weekly', priority: '0.8' });
    });
    catalog.subcategories.forEach((subcategory) => {
      if (subcategory.category_id && subcategory.slug) {
        add({ path: `/categories/${subcategory.category_id}/${subcategory.slug}`, changefreq: 'weekly', priority: '0.7' });
      }
    });
    catalog.products.forEach((product) => {
      if (product.is_active === false || product.archived_at) return;
      const slug = product.slug || product.id;
      if (slug) add({ path: `/product/${slug}`, changefreq: 'weekly', priority: '0.7' });
    });
    contentEntries.forEach(add);
    return [...paths.values()];
  } catch (error) {
    console.warn(`[WARN] Live catalogue unavailable (${error instanceof Error ? error.message : error}); using bundled catalogue for sitemap.`);
    return null;
  }
}

const escapeXml = (value: string): string =>
  value.replace(/[<>&'"?]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      case '?':
        return '%3F';
      default:
        return c;
    }
  });

function generateSitemap(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${SITE_URL}${escapeXml(entry.path)}</loc>
    <lastmod>${entry.lastmod || TODAY}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated by scripts/generate-sitemap.ts - do not edit manually -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function generateRobots(): string {
  return `# my B shoppy - https://mybshoppy.com
User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

const publicDir = join(__dirname, '..', 'public');
mkdirSync(publicDir, { recursive: true });

const live = await liveEntries();
const entries = live || staticEntries();

writeFileSync(join(publicDir, 'sitemap.xml'), generateSitemap(entries), 'utf8');
writeFileSync(join(publicDir, 'robots.txt'), generateRobots(), 'utf8');

console.log(`[OK] sitemap.xml generated with ${entries.length} URLs`);
console.log(`[OK] robots.txt generated`);
console.log(`     Domain: ${SITE_URL}`);
console.log(`     Source: ${live ? 'live catalogue' : 'bundled'}`);
