import React from 'react';
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
          <SectionHeading
            eyebrow="Browse by category"
            titleBefore="Nine Worlds of"
            titleItalic="Elegance"
            linkLabel="View All Categories"
            linkPath="/categories"
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