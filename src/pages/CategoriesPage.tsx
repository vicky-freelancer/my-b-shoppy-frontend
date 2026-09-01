import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { GoldHero } from '../components/GoldHero';
import { GoldBand } from '../components/GoldBand';
import { CATEGORIES_CATALOG } from '../storeConfig';
import { useSeo } from '../lib/seo';

export const CategoriesPage: React.FC = () => {
  useSeo({
    title: 'Categories',
    description:
      'Explore nine curated categories at my B shoppy — artificial jewels, hair accessories, bows, scrunchies, mobile charms, key chains, stationery, mens collection & hand bags.',
    path: '/categories',
  });

  return (
    <div>
      <GoldHero
        title="Categories"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Categories' },
        ]}
        subtitle="Nine curated worlds of elegance — from coquette bows to heirloom-inspired jewels and masculine essentials"
        metaText={`${CATEGORIES_CATALOG.length} Curated Worlds`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {CATEGORIES_CATALOG.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className="group relative rounded-2xl overflow-hidden border border-[#272420] hover:border-[#d4af37]/70 transition-all duration-300 shadow-md block h-72"
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10"></div>

              <div className="absolute bottom-0 inset-x-0 p-6">
                <h3 className="font-display text-2xl font-bold text-white group-hover:text-[#fae19c] transition-colors">
                  {category.name}
                </h3>
                <span className="inline-flex items-center gap-1.5 pt-3 text-[11px] font-bold uppercase tracking-widest text-[#d4af37] opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Explore Category
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center space-y-3">
          <p className="text-sm text-slate-400">
            Not sure where to begin? Browse everything in one place.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#d4af37] hover:bg-[#fae19c] text-black font-extrabold text-xs uppercase tracking-widest transition-colors"
          >
            Shop All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Closing gold band — alternates with the dark catalogue above */}
      <GoldBand
        eyebrow="Convenient Checkout"
        title="Every Category, Delivered to Your Doorstep"
        text="Browse freely, order confidently and pay only after inspecting your parcel at the door."
        primaryCta={{ label: 'Start Shopping', path: '/shop' }}
      />
    </div>
  );
};
