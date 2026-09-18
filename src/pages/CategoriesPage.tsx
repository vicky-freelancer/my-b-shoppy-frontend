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

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {CATEGORIES_CATALOG.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className="group relative rounded-[24px] overflow-hidden border border-[#D8A83E]/40 hover:border-[#B8860B] transition-all duration-300 shadow-[0_18px_44px_-22px_rgba(90,62,20,0.5)] block h-72 img-zoom"
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#241A12]/95 via-[#241A12]/35 to-transparent"></div>

              <div className="absolute bottom-0 inset-x-0 p-6">
                <h3 className="font-display text-2xl font-medium text-[#FFF8E8] group-hover:text-[#F4D99B] transition-colors">
                  {category.name}
                </h3>
                <span className="inline-flex items-center gap-1.5 pt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E8C875] opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Explore Category
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center space-y-3">
          <p className="text-sm text-[#6B5945]">
            Not sure where to begin? Browse everything in one place.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#111111] hover:bg-[#241A12] text-[#F4D99B] font-semibold text-[12px] uppercase tracking-[0.22em] transition-colors hover:-translate-y-0.5"
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
