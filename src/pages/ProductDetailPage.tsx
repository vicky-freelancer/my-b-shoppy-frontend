import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Banknote,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { GoldBand } from '../components/GoldBand';
import { GoldFrame } from '../components/GoldFrame';
import { STORE_CONFIG } from '../storeConfig';
import { useStore } from '../context/StoreContext';
import { useSeo } from '../lib/seo';

const formatPrice = (price: number) => price.toLocaleString('en-IN');

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, wishlistIds, toggleWishlist, addToCart, openDirectCheckout } = useStore();

  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);

  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  useSeo({
    title: product ? product.name : 'Product',
    description: product?.subtitle || product?.description,
    path: `/product/${id || ''}`,
    image: product?.imageUrl,
  });

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  const activeVariant = selectedVariant || product?.variants[0] || 'Standard';

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-5">
        <PackageCheck className="w-12 h-12 text-slate-600 mx-auto" />
        <h1 className="font-display text-3xl font-bold text-white">Product Not Found</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          This piece may have sold out or been moved to another collection.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d4af37] hover:bg-[#fae19c] text-black font-extrabold text-xs uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlistIds.includes(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-[#0f0e0d]">
      {/* Breadcrumb strip */}
      <div className="border-b border-[#26231f] bg-[#121110]">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-2 text-xs font-semibold text-slate-400 overflow-x-auto">
          <Link to="/" className="hover:text-white transition whitespace-nowrap">Home</Link>
          <span className="text-slate-600">/</span>
          <Link to="/categories" className="hover:text-white transition whitespace-nowrap">Categories</Link>
          <span className="text-slate-600">/</span>
          <Link
            to={`/categories/${product.categoryId}`}
            className="hover:text-white transition whitespace-nowrap"
          >
            {product.category}
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-[#d4af37] font-bold truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Left: Image */}
          <div className="space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-[#272420] bg-[#0b0a0a] group">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full aspect-square object-cover object-center"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-black/85 text-[#d4af37] border border-[#d4af37]/70 backdrop-blur-sm">
                  {product.badge}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="absolute top-4 right-4 text-xs font-extrabold px-2.5 py-1 rounded-lg bg-rose-600/90 text-white shadow-lg">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Assurance row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Banknote, label: 'Cash on Delivery' },
                { icon: Truck, label: '24h Dispatch' },
                { icon: ShieldCheck, label: 'Secure Packaging' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-1.5 bg-[#141312] border border-[#272420] rounded-xl py-3.5 px-2 text-center"
                >
                  <item.icon className="w-5 h-5 text-[#d4af37]" />
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Link
                to={`/categories/${product.categoryId}`}
                className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#d4af37] hover:text-[#fae19c] transition-colors"
              >
                {product.category}
              </Link>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#f3f0e6] leading-tight">
                {product.name}
              </h1>

              {product.subtitle && (
                <p className="text-sm text-slate-400 leading-relaxed">{product.subtitle}</p>
              )}

              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating)
                          ? 'fill-[#d4af37] text-[#d4af37]'
                          : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400">
                  <span className="text-white font-bold">{product.rating.toFixed(1)}</span> ·{' '}
                  {product.reviewsCount} reviews
                </span>
              </div>
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-3 pb-6 border-b border-[#26231f]">
              <span className="font-display text-4xl font-bold text-white font-mono">
                ₹{formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-slate-500 line-through font-mono">
                    ₹{formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wide">
                    Save ₹{formatPrice(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-[#d4af37]">
                  Select Variant
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        activeVariant === variant
                          ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10 shadow-[0_0_8px_rgba(212,175,55,0.25)]'
                          : 'border-[#38332c] text-slate-300 hover:border-[#736a5c] hover:text-white'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#d4af37]">
                  Quantity
                </span>
                <div className="flex items-center bg-[#181615] border border-[#38332c] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="p-2.5 text-slate-400 hover:text-white hover:bg-[#26231f] transition cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold font-mono text-white select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    aria-label="Increase quantity"
                    className="p-2.5 text-slate-400 hover:text-white hover:bg-[#26231f] transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`ml-auto flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                    isWishlisted
                      ? 'border-rose-500 text-rose-500 bg-rose-500/10'
                      : 'border-[#38332c] text-slate-300 hover:text-white hover:border-[#736a5c]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                  <span className="hidden sm:inline">
                    {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                  </span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={() => addToCart(product, activeVariant, quantity)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#fae19c] text-black font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-[0_8px_30px_rgba(212,175,55,0.25)] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => openDirectCheckout(product, activeVariant, quantity)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[#d4af37] hover:bg-[#d4af37] text-[#d4af37] hover:text-black font-extrabold text-xs sm:text-sm uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <Banknote className="w-4 h-4" />
                  Order Now · COD
                </button>
              </div>
            </div>

            {/* Meta details */}
            <dl className="pt-6 border-t border-[#26231f] grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
              {[
                ['Material', product.material],
                ['Stone / Accent', product.stone],
                ['Category', product.category],
                ['Availability', product.inStock === false ? 'Made to Order' : 'In Stock'],
              ]
                .filter(([, value]) => !!value)
                .map(([label, value]) => (
                  <div key={label as string} className="flex flex-col gap-0.5">
                    <dt className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                      {label}
                    </dt>
                    <dd className="text-slate-200 font-semibold">{value}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>

        {/* Description panel */}
        <section className="mt-14 bg-[#141312] border border-[#272420] rounded-2xl p-6 sm:p-9 space-y-3">
          <h2 className="font-display text-2xl font-bold text-[#f3f0e6]">About This Piece</h2>
          <p className="text-sm sm:text-[15px] text-slate-300 leading-relaxed max-w-3xl">
            {product.description}
          </p>
          <ul className="pt-3 space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              Anti-tarnish finish � water &amp; sweat resistant for everyday confidence.
            </li>
            <li className="flex items-start gap-2">
              <PackageCheck className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              Ships in signature my B shoppy protective gift packaging.
            </li>
            <li className="flex items-start gap-2">
              <Banknote className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
              Inspect before you pay � Cash on Delivery available pan-India.
            </li>
          </ul>
        </section>

        {/* Related products � FULL GOLD SECTION alternating with dark detail above */}
        {relatedProducts.length > 0 && (
          <section className="relative bg-gradient-to-br from-[#e9cd77] via-[#d4af37] to-[#b8942a] overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 mt-16">
            <div className="absolute -top-24 right-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-32 left-1/5 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative px-4 sm:px-6 lg:px-8 py-14 space-y-7">
              <div className="flex items-end justify-between gap-4 max-w-6xl mx-auto">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#241b06]">
                  You May Also Love
                </h2>
                <Link
                  to={`/categories/${product.categoryId}`}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#241b06] hover:text-black transition-colors"
                >
                  More From {product.category}
                </Link>
              </div>

              <GoldFrame className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {relatedProducts.map((rel) => (
                    <ProductCard
                      key={rel.id}
                      product={rel}
                      currencySymbol={STORE_CONFIG.currencySymbol}
                      isWishlisted={wishlistIds.includes(rel.id)}
                      onToggleWishlist={toggleWishlist}
                      onAddToCart={(prod) => addToCart(prod)}
                      onQuickView={(prod) => navigate(`/product/${prod.id}`)}
                      layoutView="grid"
                    />
                  ))}
                </div>
              </GoldFrame>
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="mt-14 pb-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#d4af37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Products
          </Link>
        </div>
      </div>

      {/* Closing gold band � alternates with the dark product detail above */}
      <GoldBand
        eyebrow="Cash On Delivery"
        title="Complete Your Look Today"
        text="Pair it with matching pieces from the collection � gift-wrapped, wear-tested and delivered to your door."
        primaryCta={{ label: 'Back to Shop', path: '/shop' }}
        secondaryCta={{ label: 'Need Help?', path: '/contact' }}
      />
    </div>
  );
};
