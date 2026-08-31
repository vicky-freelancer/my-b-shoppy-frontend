import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  LayoutGrid,
  PackageCheck,
  Quote,
  Truck,
} from 'lucide-react';
import { CATEGORIES_CATALOG, STORE_CONFIG } from '../storeConfig';
import { ProductCard } from '../components/ProductCard';
import { CategoryHeroSlider } from '../components/CategoryHeroSlider';
import { GoldFrame } from '../components/GoldFrame';
import { useStore } from '../context/StoreContext';
import { useSeo } from '../lib/seo';

const testimonials = [
  {
    quote:
      'The Solstice Ring looks even richer in person. Three people asked if it was real gold at the wedding — nobody believed the price.',
    name: 'Ananya S.',
    location: 'Mumbai, IN',
  },
  {
    quote:
      'Ordered on Monday and my Pearl Bloom Claw arrived by Thursday. Packaging felt like unboxing a luxury boutique.',
    name: 'Ritika M.',
    location: 'Bengaluru, IN',
  },
  {
    quote:
      'My whole scrunchie collection is silk now. Zero creases, zero breakage — and they double as wrist candy.',
    name: 'Zara K.',
    location: 'Dubai, UAE',
  },
];

export const HomePage: React.FC = () => {
  const { products, wishlistIds, toggleWishlist, addToCart, setQuickViewProduct } = useStore();
  useSeo({
    title: 'my B shoppy — Luxury E-Commerce & Fine Accessories',
    description:
      'Shop curated artificial jewels, hair accessories, bows, scrunchies, mobile charms & luxury gifts at my B shoppy. Premium quality, easy checkout available.',
    path: '/',
  });

  const featured = products
    .filter((p) => p.badge && ['EXCLUSIVE', 'NEW', 'BESTSELLER'].includes(p.badge))
    .slice(0, 8);
  const featuredList = featured.length > 0 ? featured : products.slice(0, 8);

  const totalCatalogCount = CATEGORIES_CATALOG.reduce((acc, c) => acc + (c.count || 0), 0);

  return (
    <div className="space-y-20 sm:space-y-24 pb-4">
      {/* ============ HERO — CATEGORY SLIDESHOW ============ */}
      <CategoryHeroSlider />

      {/* ============ TRUST STRIP ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Banknote,
              title: 'Easy Checkout',
              desc: 'Simple, secure checkout with flexible payment options.',
            },
            {
              icon: BadgeCheck,
              title: 'Premium Materials',
              desc: 'Anti-tarnish plating & mulberry silk standards.',
            },
            {
              icon: PackageCheck,
              title: 'Gift-Ready Packaging',
              desc: 'Every order ships dust-proof & photo-ready.',
            },
            {
              icon: Truck,
              title: 'Fast Dispatch',
              desc: 'Ships within 24 hours across India & abroad.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#141312] border border-[#272420] hover:border-[#4d4437] rounded-2xl p-5 space-y-2.5 transition-colors group shadow-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1c1a17] border border-[#38332c] flex items-center justify-center group-hover:border-[#d4af37]/60 transition-colors">
                <item.icon className="w-5 h-5 text-[#d4af37]" />
              </div>
              <h3 className="text-sm font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CATEGORY SHOWCASE — FULL GOLD SECTION ============ */}
      <section className="relative bg-gradient-to-br from-[#e9cd77] via-[#d4af37] to-[#b8942a] overflow-hidden">
        {/* Ambient sheen */}
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 left-1/5 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#4a3a10]">
                Browse By Category
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#241b06]">
                Nine Worlds of Elegance
              </h2>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#241b06] hover:text-black transition-colors"
            >
              View All Categories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {CATEGORIES_CATALOG.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className="group relative rounded-2xl overflow-hidden border border-[#272420] hover:border-[#d4af37]/70 aspect-[4/5] transition-all duration-300 shadow-md block"
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

              {category.badge && (
                <span className="absolute top-3 left-3 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/80 text-[#d4af37] border border-[#d4af37]/60 backdrop-blur-sm">
                  {category.badge}
                </span>
              )}

              <div className="absolute bottom-0 inset-x-0 p-4 space-y-1">
                <h3 className="font-display text-lg font-bold text-white group-hover:text-[#fae19c] transition-colors">
                  {category.name}
                </h3>
                <p className="text-[11px] text-slate-300 line-clamp-1">{category.tagline}</p>
                <div className="flex items-center justify-between pt-1.5">
                  <span className="text-[11px] font-mono text-[#d4af37] font-bold">
                    From ₹{category.startingPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400">{category.count}+ items</span>
                </div>
              </div>
            </Link>
          ))}

          {/* Final tile -> all categories */}
          <Link
            to="/categories"
            className="group relative rounded-2xl overflow-hidden border border-dashed border-[#4d4437] hover:border-[#d4af37]/70 aspect-[4/5] transition-all duration-300 flex flex-col items-center justify-center text-center p-6 bg-[#141312]"
          >
            <LayoutGrid className="w-8 h-8 text-[#d4af37] mb-3" />
            <h3 className="font-display text-lg font-bold text-white group-hover:text-[#fae19c] transition-colors">
              All Categories
            </h3>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Explore every curated world of my B shoppy
            </p>
            <ArrowRight className="w-4 h-4 text-[#d4af37] mt-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#d4af37]">
              Handpicked For You
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#f3f0e6]">
              This Season's Icons
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#d4af37] hover:text-[#fae19c] transition-colors"
          >
            Shop All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <GoldFrame>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {featuredList.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currencySymbol={STORE_CONFIG.currencySymbol}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={toggleWishlist}
                onAddToCart={(prod) => addToCart(prod)}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </GoldFrame>
      </section>

      {/* ============ EDITORIAL SPLIT BANNER — FULL GOLD SECTION ============ */}
      <section className="relative bg-gradient-to-br from-[#e9cd77] via-[#d4af37] to-[#b8942a] overflow-hidden">
        {/* Ambient sheen */}
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 left-1/5 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-xl space-y-5">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#4a3a10] block">
              Our Craft Promise
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#241b06] leading-tight">
              Every Piece, Chosen Like an Heirloom
            </h2>
            <p className="text-sm sm:text-base text-[#3d2f0a] font-medium leading-relaxed">
              We travel, test and wear every design before it earns a place in the my B shoppy
              catalogue. If we wouldn't gift it to our own sisters, mothers and best friends —
              it doesn't ship.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#241b06] hover:bg-black text-[#f5e6b8] hover:text-[#fae19c] font-extrabold text-xs uppercase tracking-widest transition-colors shadow-lg"
            >
              Read Our Story
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#d4af37]">
            Loved Worldwide
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#f3f0e6]">
            Words From Our Shoppers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="bg-[#141312] border border-[#272420] hover:border-[#4d4437] rounded-2xl p-6 space-y-4 transition-colors"
            >
              <Quote className="w-6 h-6 text-[#d4af37]/70" />
              <blockquote className="text-sm text-slate-300 leading-relaxed">
                "{t.quote}"
              </blockquote>
              <figcaption className="pt-2 border-t border-[#26231f]">
                <p className="text-sm font-bold text-white">{t.name}</p>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider">{t.location}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ============ NEWSLETTER / CTA — FULL GOLD CLOSER ============ */}
      <section className="relative bg-gradient-to-br from-[#e9cd77] via-[#d4af37] to-[#b8942a] overflow-hidden">
        {/* Ambient sheen */}
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 left-1/5 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center space-y-5 max-w-2xl mx-auto">
            <Banknote className="w-10 h-10 text-[#241b06] mx-auto" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#241b06]">
              Shop Now, Pay at Your Doorstep
            </h2>
            <p className="text-sm sm:text-base text-[#3d2f0a] font-medium leading-relaxed">
              Browse freely, order confidently, and pay only when your package is safely in your hands.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#241b06] hover:bg-black text-[#f5e6b8] hover:text-[#fae19c] font-extrabold text-sm uppercase tracking-widest shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
