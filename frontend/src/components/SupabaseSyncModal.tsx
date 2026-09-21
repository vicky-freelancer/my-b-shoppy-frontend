import React, { useState } from 'react';
import { STORE_CONFIG } from '../storeConfig';
import { ProductItem } from '../types';
import { seedProductsToSupabase, fetchSupabaseProducts } from '../lib/supabaseClient';
import { Database, CheckCircle2, AlertCircle, RefreshCw, UploadCloud, DownloadCloud, Code2, Copy, Check, X, ShieldCheck } from 'lucide-react';

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  onProductsUpdated: (products: ProductItem[]) => void;
  supabaseConnected: boolean;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({
  isOpen,
  onClose,
  products,
  onProductsUpdated,
  supabaseConnected
}) => {
  const [isPushing, setIsPushing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const sqlSchema = `-- Supabase Table Schemas for my B shoppy

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image_url TEXT,
  category TEXT,
  category_id TEXT,
  badge TEXT,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 12,
  material TEXT,
  stone TEXT,
  variants TEXT[],
  description TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Cash on Delivery Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  country TEXT DEFAULT 'United States',
  product_name TEXT,
  product_variant TEXT,
  quantity INTEGER DEFAULT 1,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Read Access for Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access" ON products FOR SELECT USING (true);
CREATE POLICY "Public Insert Access" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access" ON products FOR UPDATE USING (true);

-- 4. Enable Insert Access for Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Orders Insert" ON orders FOR INSERT WITH CHECK (true);
`;

  const handlePushToSupabase = async () => {
    setIsPushing(true);
    setSyncStatusMessage(null);

    const res = await seedProductsToSupabase(products);

    if (res.success) {
      setSyncStatusMessage({
        type: 'success',
        text: `Successfully synced ${res.count || products.length} catalog products into Supabase "products" table!`,
      });
    } else {
      setSyncStatusMessage({
        type: 'info',
        text: `Supabase connection verified. To enable remote table sync, execute the SQL schema below in your Supabase SQL editor: ${res.error}`,
      });
    }
    setIsPushing(false);
  };

  const handleFetchFromSupabase = async () => {
    setIsFetching(true);
    setSyncStatusMessage(null);

    const res = await fetchSupabaseProducts();

    if (res.data && res.data.length > 0) {
      onProductsUpdated(res.data);
      setSyncStatusMessage({
        type: 'success',
        text: `Retrieved ${res.data.length} live products from Supabase!`,
      });
    } else if (res.data && res.data.length === 0) {
      setSyncStatusMessage({
        type: 'info',
        text: 'Connected to Supabase, but the "products" table is currently empty. Click "Seed Catalog to Supabase" to push your catalog items.',
      });
    } else {
      setSyncStatusMessage({
        type: 'error',
        text: res.error || 'Failed to fetch products from Supabase.',
      });
    }
    setIsFetching(false);
  };

  const handleCopySql = () => {
    navigator.clipboard?.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#111111]/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#FFFDF6] border border-[#D8A83E]/50 rounded-[24px] shadow-2xl overflow-hidden text-[#241A12] my-8">

        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D8A83E]/40 flex items-center justify-between bg-[#FAF1DD]">
          <div className="flex items-center space-x-2.5">
            <Database className="w-5 h-5 text-[#B8860B]" />
            <h2 className="font-display text-base sm:text-lg font-bold text-[#241A12]">
              Supabase Database Synchronization
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6B5945] hover:text-[#241A12] hover:bg-[#E8C875]/40 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-left">

          {/* Status Panel */}
          <div className="p-4 rounded-2xl bg-[#FAF1DD] border border-[#D8A83E]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#6B5945] font-medium">Supabase Project Endpoint:</span>
              <span className="text-xs font-mono text-[#B8860B] truncate max-w-xs">
                {STORE_CONFIG.supabase.url || 'Not set'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#D8A83E]/30">
              <span className="text-xs text-[#6B5945] font-medium">Configured Tables:</span>
              <span className="text-xs font-mono text-[#241A12]">
                <span className="text-[#B8860B]">products</span> (Catalog) & <span className="text-[#B8860B]">orders</span> (Checkout)
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#D8A83E]/30">
              <span className="text-xs text-[#6B5945] font-medium">Live Connection Status:</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>Supabase JS Client Active</span>
              </span>
            </div>
          </div>

          {/* Sync Status Banner */}
          {syncStatusMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
                syncStatusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-800'
                  : syncStatusMessage.type === 'error'
                  ? 'bg-rose-500/10 border border-rose-500/40 text-rose-700'
                  : 'bg-amber-500/10 border border-amber-500/40 text-amber-800'
              }`}
            >
              {syncStatusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{syncStatusMessage.text}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleFetchFromSupabase}
              disabled={isFetching}
              className="py-3 px-4 rounded-full bg-[#FAF1DD] hover:bg-[#F4D99B] text-[#241A12] border border-[#D8A83E]/50 hover:border-[#B8860B] font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isFetching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4 text-[#B8860B]" />}
              <span>Fetch Supabase Products</span>
            </button>

            <button
              onClick={handlePushToSupabase}
              disabled={isPushing}
              className="py-3 px-4 rounded-full bg-[#B8860B] hover:bg-[#8A6A15] text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-[0_14px_32px_-12px_rgba(184,134,11,0.7)] cursor-pointer disabled:opacity-50"
            >
              {isPushing ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <UploadCloud className="w-4 h-4" />}
              <span>Sync All Items to Supabase</span>
            </button>
          </div>

          {/* SQL Setup Helper for Supabase Editor */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#241A12] flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#B8860B]" />
                <span>Supabase SQL Setup (Tables & Security Policies)</span>
              </span>
              <button
                onClick={handleCopySql}
                className="px-2.5 py-1 rounded-full bg-[#FAF1DD] hover:bg-[#E8C875]/40 text-xs font-semibold flex items-center gap-1 text-[#6B5945] cursor-pointer border border-[#D8A83E]/40"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>

            <pre className="p-3 bg-[#241A12] border border-[#D8A83E]/30 rounded-2xl text-[11px] font-mono text-[#F4D99B]/90 max-h-40 overflow-y-auto">
              {sqlSchema}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
};