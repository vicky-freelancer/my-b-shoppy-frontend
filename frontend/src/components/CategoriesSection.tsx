import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProductCategory } from '../types';
import { SectionHeading } from './SectionHeading';
import { CategoryCard } from './CategoryCard';
import { Reveal } from './Reveal';

interface CategoriesSectionProps {
  categories: ProductCategory[];
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  const featured = categories.slice(0, 4);

  return (
    <section className="relative py-16 sm:py-24 bg-[#d9a33f] overflow-hidden">
      <div className="absolute -top-28 left-[20%] w-80 h-80 rounded-full bg-[#E8C875]/30 blur-[110px] pointer-events-none"></div>

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="mb-8 flex justify-center sm:mb-10">
            <Link
              to="/categories"
              className="btn-arrow-cta group inline-flex items-center gap-2 text-base sm:text-lg font-bold uppercase tracking-[0.16em] text-black transition-colors duration-300 hover:text-[#6B4C08]"
            >
              View All Categories
              <ArrowRight className="arrow h-5 w-5 text-[#B8860B]" aria-hidden="true" />
            </Link>
          </div>
          <SectionHeading
            eyebrow="Browse by category"
            titleBefore="Worlds of"
            titleItalic="Elegance"
          />
        </Reveal>

        <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
          {featured.map((category, i) => (
            <Reveal key={category.id} delay={i * 90}>
              <CategoryCard category={category} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
