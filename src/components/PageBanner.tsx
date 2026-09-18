import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageBannerProps {
  eyebrow?: string;
  title: string; // may contain <em> for italic accents
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  metaText?: string;
}

/**
 * Warm champagne editorial page banner used across inner pages.
 */
export const PageBanner: React.FC<PageBannerProps> = ({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  metaText,
}) => {
  return (
    <section className="relative overflow-hidden bg-gold-soft border-b border-[#D8A83E]/30">
      <div className="absolute -top-28 right-[18%] w-80 h-80 rounded-full bg-white/50 blur-[110px] pointer-events-none"></div>
      <div className="absolute -bottom-32 left-[6%] w-72 h-72 rounded-full bg-[#E8C875]/40 blur-[100px] pointer-events-none"></div>
      {/* blurred foliage silhouette */}
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

        {eyebrow && (
          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.34em] text-[#B8860B]">
            <span aria-hidden="true" className="mr-2">✦</span>
            {eyebrow}
          </p>
        )}

        <h1
          className="mt-3 font-display font-medium text-[#241A12] leading-[1.05]"
          style={{ fontSize: 'clamp(40px, 5.4vw, 68px)' }}
          dangerouslySetInnerHTML={{ __html: title }}
        />

        {subtitle && (
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#3d2f1a]/90">{subtitle}</p>
        )}
      </div>

      {metaText && (
        <div className="relative pb-8">
          <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFF8E8]/90 border border-[#D8A83E]/50 text-[11px] font-bold uppercase tracking-[0.22em] text-[#B8860B] shadow">
              {metaText}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};