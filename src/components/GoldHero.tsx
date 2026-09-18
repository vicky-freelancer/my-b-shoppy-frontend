import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface GoldHeroProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  subtitle?: string;
  metaText?: string;
}

/**
 * Warm champagne page hero used on inner pages.
 */
export const GoldHero: React.FC<GoldHeroProps> = ({
  title,
  breadcrumbs,
  subtitle,
  metaText,
}) => {
  return (
    <section className="relative overflow-hidden bg-gold-soft border-b border-[#D8A83E]/30">
      <div className="absolute -top-28 right-[18%] w-80 h-80 rounded-full bg-white/50 blur-[110px] pointer-events-none"></div>
      <div className="absolute -bottom-32 left-[6%] w-72 h-72 rounded-full bg-[#E8C875]/40 blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-8 right-[24%] w-56 h-48 rounded-t-full bg-[#8A6A15]/12 blur-2xl rotate-[14deg] pointer-events-none"></div>

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
        <nav className="flex items-center flex-wrap gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6B5945]" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={`${crumb.label}-${index}`}>
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#B8860B]/70" />}
              {crumb.path ? (
                <Link to={crumb.path} className="hover:text-[#B8860B] transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#241A12] font-bold">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1
              className="font-display font-medium text-[#241A12] leading-[1.05]"
              style={{ fontSize: 'clamp(40px, 5.4vw, 68px)' }}
            >
              {title}
            </h1>

            {subtitle && (
              <p className="max-w-xl text-[15px] leading-relaxed text-[#3d2f1a]/90">{subtitle}</p>
            )}
          </div>

          {metaText && (
            <span className="shrink-0 inline-flex self-start md:self-auto items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFF8E8]/90 border border-[#D8A83E]/50 text-[11px] font-bold uppercase tracking-[0.22em] text-[#B8860B] shadow">
              {metaText}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};