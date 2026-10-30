// Idempotent, additive update of the shared Supabase parent category catalogue.
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const config = readFileSync(new URL('../../frontend/src/storeConfig.ts', import.meta.url), 'utf8');
const url = config.match(/url: '(https:\/\/[^']+)'/)?.[1];
const key = config.match(/publishableKey: '([^']+)'/)?.[1];
const client = createClient(url, key, { auth: { persistSession: false } });
const ids = JSON.parse(config.match(/const CATEGORY_DISPLAY_ORDER = (\[[^;]+\]);/)?.[1] || '[]');
const names = JSON.parse(config.match(/const CATEGORY_DISPLAY_NAMES: Record<string, string> = (\{[^;]+\});/)?.[1] || '{}');
if (ids.length !== 10 || ids.some((id) => !names[id])) throw new Error('Invalid category configuration');
const additions = ids.map((id) => ({ id, name: names[id] }));

const { data: existing, error: readError } = await client.from('categories').select('id,name,slug');
if (readError) throw new Error(`Cannot read parent categories: ${readError.message}`);
for (const category of additions) {
  const match = existing.find((row) => row.id === category.id || row.slug === category.id);
  const { error } = match
    ? await client.from('categories').update({ name: category.name, is_active: true }).eq('id', match.id)
    : await client.from('categories').insert({ ...category, slug: category.id, is_active: true });
  if (error) throw new Error(`Cannot sync ${category.name}: ${error.message}`);
}
const { data: verified, error } = await client.from('categories').select('id,name,slug,is_active');
if (error) throw error;
for (const category of additions) {
  if (!verified.some((row) => row.name === category.name && row.is_active && (row.id === category.id || row.slug === category.id))) {
    throw new Error(`Verification failed: ${category.name}`);
  }
}
console.log('Verified all ten parent categories in the shared Supabase database.');
