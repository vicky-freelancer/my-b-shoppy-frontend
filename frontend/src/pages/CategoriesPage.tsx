import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiCategories, catalogErrorMessage } from '../lib/catalogApi';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { GoldHero } from '../components/GoldHero';
import { GoldBand } from '../components/GoldBand';
import { useSeo } from '../lib/seo';
import { categoryImage, onCategoryImageError } from '../lib/categoryImages';

export const CategoriesPage: React.FC = () => {
  const live=useQuery({queryKey:['categories'],queryFn:apiCategories});
  const categories=live.data || [];
  useSeo({
    title: 'Categories',
    description:
      'Explore curated categories at my B shoppy — hair accessories, bows and scrunchies, jewellery, bags, key chains, mobile charms, men accessories and gifts.',
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
        subtitle="Nine curated worlds of elegance — hair accessories, AD jewellery, bags, anti tarnish jewellery and thoughtful gifts"
        metaText={`${categories.length} Curated Worlds`}
      />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
        {live.isPending && <p role="status">Loading categories...</p>}
        {live.error && <p role="alert" className="mb-6 rounded-xl border border-[#6B5945]/25 bg-[#FFFDF6] p-4 text-sm text-[#6B5945]">{catalogErrorMessage(live.error, 'Categories could not be loaded.')} <button onClick={() => live.refetch()} className="ml-1 font-bold text-[#B8860B] underline">Try again</button></p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className="group relative rounded-[24px] overflow-hidden border border-[#D8A83E]/40 hover:border-[#B8860B] transition-all duration-300 shadow-[0_18px_44px_-22px_rgba(90,62,20,0.5)] block h-72 img-zoom"
            >
              <img
                src={categoryImage(category)}
                alt={category.name}
                onError={(event) => onCategoryImageError(event, category)}
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
        text="Browse freely and choose your favourites. Online checkout will be available after verification."
        primaryCta={{ label: 'Start Shopping', path: '/shop' }}
      />
    </div>
  );
};
