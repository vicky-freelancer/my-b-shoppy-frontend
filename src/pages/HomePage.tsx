import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HeroSlider } from '../components/HeroSlider';
import { BenefitsBar } from '../components/BenefitsBar';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { CategoriesSection } from '../components/CategoriesSection';
import { EditorialPromo } from '../components/EditorialPromo';
import { Reveal } from '../components/Reveal';
import { useStore } from '../context/StoreContext';
import { useSeo } from '../lib/seo';
import { STORE_CONFIG } from '../storeConfig';

const testimonials = [
  {
    quote: 'The most beautiful hair clips I have ever owned. Everyone keeps asking where they are from!',
    name: 'Ananya S.',
    location: 'Trichy, IN',
  },
  {
    quote: 'Packaging felt like unboxing a luxury boutique. My scrunchies are my new favourite accessory.',
    name: 'Ritika M.',
    location: 'Chennai, IN',
  },
  {
    quote: 'Trendy, cute and genuinely good quality. MY B SHOPPY is my go-to for every outfit.',
    name: 'Zara K.',
    location: 'Bengaluru, IN',
  },
];

export const HomePage: React.FC = () => {
  const { products, wishlistIds, toggleWishlist, addToCart } = useStore();

  useSeo({
    title: 'MY B SHOPPY — Style • Accessories • You',
    description:
      'Premium Indian fashion accessories — hair clips, artificial jewellery, bows, scrunchies and handbags. Trendy, cute and made for every style and every mood.',
    path: '/',
  });

  const featured = products
    .filter((p) => p.badge && ['BESTSELLER', 'NEW', 'EXCLUSIVE'].includes(p.badge))
    .slice(0, 4);
  const featuredList = featured.length > 0 ? featured : products.slice(0, 4);

  return (
    <main>
      {/* ============ HERO ============ */}
      <HeroSlider />

      {/* ============ BENEFITS ============ */}
      <BenefitsBar />

      {/* ============ FEATURED PRODUCTS ============ */}
      <FeaturedProducts
        products={featuredList}
        currencySymbol={STORE_CONFIG.currencySymbol}
        wishlistIds={wishlistIds}
        onToggleWishlist={toggleWishlist}
        onAddToCart={(product) => addToCart(product)}
      />

      {/* ============ CATEGORIES ============ */}
      <CategoriesSection categories={STORE_CONFIG.categories} />

      {/* ============ EDITORIAL PROMO ============ */}
      <EditorialPromo />

      {/* ============ LOVE STRIP ============ */}
      <section className="py-16 sm:py-20 bg-[#d9a33f] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <Reveal>
            <div className="text-center space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-black">
                <span aria-hidden="true" className="mr-2">✦</span> Loved by 10K+ Shoppers
              </p>
              <h2
                className="font-display font-medium text-black leading-[1.06]"
                style={{ fontSize: 'clamp(32px, 4vw, 50px)' }}
              >
                Words From Our <em className="italic text-black">Style Circle</em>
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 90}>
                <figure className="h-full bg-[#FFFDF6] border border-[#6B5945]/15 rounded-3xl p-7 card-lift">
                  <div className="flex gap-0.5 text-[#D8A83E] text-[13px]" aria-label="5 star rating">
                    {'★★★★★'.split('').map((s, j) => (
                      <span key={j}>{s}</span>
                    ))}
                  </div>
                  <blockquote className="mt-4 font-display italic text-[19px] leading-relaxed text-black">
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-5 pt-4 border-t border-[#6B5945]/12">
                    <p className="text-[13px] font-semibold text-black">{t.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-black/70">{t.location}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 text-center">
            <Link
              to="/shop"
              className="btn-arrow-cta group inline-flex items-center gap-2.5 px-10 py-4 rounded-full bg-[#111111] text-[#F4D99B] hover:bg-[#241A12] font-semibold text-[12px] uppercase tracking-[0.24em] shadow-[0_18px_36px_-14px_rgba(17,17,17,0.5)] transition-all duration-300 hover:-translate-y-0.5"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4 arrow" />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
};