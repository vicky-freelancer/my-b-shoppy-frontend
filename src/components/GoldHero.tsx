import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbItem } from './PageHero';

interface GoldHeroProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  subtitle?: string;
  metaText?: string;
}

/**
 * Full-gold page hero — solid luxury gold background, no imagery.
 * Used for All Products & About Us pages.
 */
export const GoldHero: React.FC<GoldHeroProps> = ({
  title,
  breadcrumbs,
  subtitle,
  metaText,
}) => {
  return (
    <div className="relative bg-gradient-to-br from-[#e9cd77] via-[#d4af37] to-[#b8942a] overflow-hidden py-12 sm:py-16 border-b border-[#a5821f]">
      {/* Subtle ambient sheen */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 left-1/5 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Left: Breadcrumb & Typography */}
          <div className="space-y-3 z-10">
            <nav className="flex items-center flex-wrap space-x-2 text-xs font-bold text-[#4a3a10]/70">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={`${crumb.label}-${index}`}>
                  {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#4a3a10]/40" />}
                  {crumb.path ? (
                    <Link to={crumb.path} className="hover:text-[#2a2008] transition">
                      {crumb.label}
                    </Link>
                  ) : index === breadcrumbs.length - 1 ? (
                    <span className="text-[#2a2008]">{crumb.label}</span>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#241b06]">
              {title}
            </h1>

            {subtitle && (
              <p className="text-sm sm:text-base max-w-xl leading-relaxed text-[#3d2f0a] font-medium">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right: Meta chip */}
          {metaText && (
            <div className="shrink-0 z-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#241b06] text-[#f5e6b8] text-[11px] font-extrabold uppercase tracking-widest shadow-lg">
                {metaText}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
