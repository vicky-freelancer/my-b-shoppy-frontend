import { useEffect } from 'react';

export const SITE_URL = 'https://mybshoppy.com';
export const SITE_NAME = 'my B shoppy';
export const DEFAULT_DESCRIPTION =
  'Discover luxury jewels, hair accessories, bows, scrunchies, and lifestyle essentials with Cash on Delivery & Supabase synchronization.';

interface SeoInput {
  title: string;
  description?: string;
  path: string;
  image?: string;
}

const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const upsertCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

export const useSeo = ({ title, description, path, image }: SeoInput) => {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    const desc = description || DEFAULT_DESCRIPTION;
    const url = `${SITE_URL}${path}`;
    const ogImage =
      image ||
      'https://images.unsplash.com/photo-1611591475155-42e4fdb8885c?auto=format&fit=crop&w=1200&q=80';

    document.title = fullTitle;
    upsertMeta('name', 'description', desc);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', desc);
    upsertMeta('name', 'twitter:image', ogImage);
    upsertCanonical(url);
  }, [title, description, path, image]);
};
