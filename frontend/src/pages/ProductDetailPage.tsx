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
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-24 text-center space-y-5">
        <PackageCheck className="w-12 h-12 text-[#B8860B]/50 mx-auto" />
        <h1 className="font-display text-3xl font-medium text-[#241A12]">Product Not Found</h1>
        <p className="text-sm text-[#6B5945] max-w-md mx-auto">
          This piece may have sold out or been moved to another collection.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#111111] hover:bg-[#241A12] text-[#F4D99B] font-semibold text-[12px] uppercase tracking-[0.22em] transition-all hover:-translate-y-0.5"
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
    <div>
      {/* Breadcrumb strip */}
      <div className="border-b border-[#D8A83E]/30 bg-[#FAF1DD]">
        <nav className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-12 flex items-center gap-2 text-xs font-semibold text-[#6B5945] overflow-x-auto">
          <Link to="/" className="hover:text-[#B8860B] transition whitespace-nowrap">Home</Link>
          <span className="text-[#B8860B]/60">/</span>
          <Link to="/categories" className="hover:text-[#B8860B] transition whitespace-nowrap">Categories</Link>
          <span className="text-[#B8860B]/60">/</span>
          <Link
            to={`/categories/${product.categoryId}`}
            className="hover:text-[#B8860B] transition whitespace-nowrap"
          >
            {product.category}
          </Link>
          <span className="text-[#B8860B]/60">/</span>
          <span className="text-[#B8860B] font-bold truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Left: Image */}
          <div className="space-y-4">
            <div className="relative rounded-[28px] overflow-hidden border border-[#D8A83E]/40 bg-[#F8ECD0] group img-zoom">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full aspect-square object-contain object-center"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#241A12]/85 text-[#E8C875] border border-[#E8C875]/60 backdrop-blur-sm">
                  {product.badge}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="absolute top-4 right-4 text-xs font-extrabold px-2.5 py-1 rounded-full bg-rose-600/90 text-white shadow-lg">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Assurance row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Banknote, label: 'Easy Checkout' },
                { icon: Truck, label: '24h Dispatch' },
                { icon: ShieldCheck, label: 'Secure Packaging' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-1.5 bg-[#FFFDF6] border border-[#D8A83E]/30 rounded-2xl py-3.5 px-2 text-center card-lift"
                >
                  <item.icon className="w-5 h-5 text-[#B8860B]" />
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#6B5945] uppercase tracking-wide">
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
                className="inline-block text-[11px] font-bold uppercase tracking-[0.24em] text-[#B8860B] hover:text-[#8A6A15] transition-colors"
              >
                {product.category}
              </Link>

              <h1 className="font-display font-medium text-[#241A12] leading-tight" style={{ fontSize: 'clamp(34px, 4.4vw, 52px)' }}>
                {product.name}
              </h1>

              {product.subtitle && (
                <p className="text-sm text-[#6B5945] leading-relaxed">{product.subtitle}</p>
              )}

              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating)
                          ? 'fill-[#D8A83E] text-[#D8A83E]'
                          : 'text-[#E8C875]/40'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#6B5945]">
                  <span className="text-[#241A12] font-bold">{product.rating.toFixed(1)}</span> ·{' '}
                  {product.reviewsCount} reviews
                </span>
              </div>
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-3 pb-6 border-b border-[#D8A83E]/30">
              <span className="font-display font-bold text-[#241A12] font-mono" style={{ fontSize: 'clamp(30px, 3.4vw, 40px)' }}>
                ₹{formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-[#6B5945]/70 line-through font-mono">
                    ₹{formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wide">
                    Save ₹{formatPrice(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[11px] font-black uppercase tracking-[0.24em] text-[#B8860B]">
                  Select Variant
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                        activeVariant === variant
                          ? 'border-[#B8860B] text-[#B8860B] bg-[#D8A83E]/10 shadow-[0_0_8px_rgba(184,134,11,0.25)]'
                          : 'border-[#6B5945]/35 text-[#6B5945] hover:border-[#B8860B] hover:text-[#241A12]'
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
                <span className="text-[11px] font-black uppercase tracking-[0.24em] text-[#B8860B]">
                  Quantity
                </span>
                <div className="flex items-center bg-[#FFFDF6] border border-[#6B5945]/30 rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="p-2.5 text-[#6B5945] hover:text-[#B8860B] hover:bg-[#FAF1DD] transition cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold font-mono text-[#241A12] select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    aria-label="Increase quantity"
                    className="p-2.5 text-[#6B5945] hover:text-[#B8860B] hover:bg-[#FAF1DD] transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`ml-auto flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                    isWishlisted
                      ? 'border-rose-500 text-rose-500 bg-rose-500/10'
                      : 'border-[#6B5945]/35 text-[#6B5945] hover:text-[#B8860B] hover:border-[#B8860B]'
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
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#111111] hover:bg-[#241A12] text-[#F4D99B] font-semibold text-[12px] sm:text-[13px] uppercase tracking-[0.22em] shadow-[0_18px_36px_-14px_rgba(17,17,17,0.5)] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => openDirectCheckout(product, activeVariant, quantity)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full border-2 border-[#B8860B] hover:bg-[#B8860B] text-[#B8860B] hover:text-white font-semibold text-[12px] sm:text-[13px] uppercase tracking-[0.22em] transition-colors cursor-pointer"
                >
                  <Banknote className="w-4 h-4" />
                  Order Now
                </button>
              </div>
            </div>

            {/* Meta details */}
            <dl className="pt-6 border-t border-[#D8A83E]/30 grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
              {[
                ['Material', product.material],
                ['Stone / Accent', product.stone],
                ['Category', product.category],
                ['Availability', product.inStock === false ? 'Made to Order' : 'In Stock'],
              ]
                .filter(([, value]) => !!value)
                .map(([label, value]) => (
                  <div key={label as string} className="flex flex-col gap-0.5">
                    <dt className="text-[#6B5945]/80 uppercase tracking-wider font-bold text-[10px]">
                      {label}
                    </dt>
                    <dd className="text-[#241A12] font-semibold">{value}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>

        {/* Description panel */}
        <section className="mt-14 bg-[#FFFDF6] border border-[#D8A83E]/30 rounded-[28px] p-6 sm:p-9 space-y-3">
          <h2 className="font-display text-2xl font-medium text-[#241A12]">
            About This <em className="italic text-gold-gradient">Piece</em>
          </h2>
          <p className="text-sm sm:text-[15px] text-[#3d2f1a]/90 leading-relaxed max-w-3xl">
            {product.description}
          </p>
          <ul className="pt-3 space-y-2 text-xs text-[#6B5945]">
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
              Anti-tarnish finish — water &amp; sweat resistant for everyday confidence.
            </li>
            <li className="flex items-start gap-2">
              <PackageCheck className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
              Ships in signature my B shoppy protective gift packaging.
            </li>
            <li className="flex items-start gap-2">
              <Banknote className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
              Inspect before you pay — easy, flexible payment available pan-India.
            </li>
          </ul>
        </section>

        {/* Related products — warm champagne section alternating with the cream detail above */}
        {relatedProducts.length > 0 && (
          <section className="relative bg-gold-soft border-y border-[#D8A83E]/30 overflow-hidden mt-16">
            <div className="absolute -top-24 right-1/4 w-96 h-96 bg-white/50 rounded-full blur-[110px] pointer-events-none"></div>
            <div className="absolute -bottom-32 left-1/5 w-80 h-80 bg-[#E8C875]/40 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative py-14 space-y-7">
              <div className="flex items-end justify-between gap-4 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
                <h2 className="font-display font-medium text-[#241A12]" style={{ fontSize: 'clamp(28px, 3.6vw, 42px)' }}>
                  You May Also <em className="italic text-gold-gradient">Love</em>
                </h2>
                <Link
                  to={`/categories/${product.categoryId}`}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#B8860B] hover:text-[#8A6A15] transition-colors"
                >
                  More From {product.category}
                </Link>
              </div>

              <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
                <GoldFrame className="max-w-full">
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
                      />
                    ))}
                  </div>
                </GoldFrame>
              </div>
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="mt-14 pb-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#6B5945] hover:text-[#B8860B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Products
          </Link>
        </div>
      </div>

      {/* Closing band — alternates with the cream product detail above */}
      <GoldBand
        eyebrow="Convenient Checkout"
        title="Complete Your Look Today"
        text="Pair it with matching pieces from the collection — gift-wrapped, wear-tested and delivered to your door."
        primaryCta={{ label: 'Back to Shop', path: '/shop' }}
        secondaryCta={{ label: 'Need Help?', path: '/contact' }}
      />
    </div>
  );
};