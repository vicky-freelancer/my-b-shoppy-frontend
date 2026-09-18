import React from 'react';
import { Award, Gem, HandHeart, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { GoldHero } from '../components/GoldHero';
import { GoldBand } from '../components/GoldBand';
import { CATEGORIES_CATALOG } from '../storeConfig';
import { useSeo } from '../lib/seo';

const totalCatalogCount = CATEGORIES_CATALOG.reduce((acc, c) => acc + (c.count || 0), 0);

export const AboutPage: React.FC = () => {
  useSeo({
    title: 'About Us',
    description:
      'The story of my B shoppy — a luxury e-commerce house curating artificial jewels, hair accessories & gifts with premium quality and fair pricing.',
    path: '/about',
  });

  return (
    <div>
      <GoldHero
        title="Our Story"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'About Us' },
        ]}
        subtitle="Trendy. Affordable. Yours. — the three words that built everything we do at my B shoppy"
        metaText="Since Day One"
      />

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16 space-y-20">
        {/* Story split section */}
        <section className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="space-y-5 order-2 lg:order-1">
            <h2
              className="font-display font-medium text-[#241A12] leading-tight"
              style={{ fontSize: 'clamp(30px, 4vw, 44px)' }}
            >
              Born From a Simple <em className="italic text-gold-gradient">Belief</em>
            </h2>
            <p className="text-sm sm:text-base text-[#3d2f1a]/90 leading-relaxed">
              my B shoppy started with one frustration: beautiful accessories were either
              heartbreakingly expensive or disappointingly flimsy. We believed the space between
              those two extremes deserved better — so we built it.
            </p>
            <p className="text-sm text-[#6B5945] leading-relaxed">
              Today we curate over {totalCatalogCount.toLocaleString('en-IN')}+ pieces across nine
              collections, each tested for real life: anti-tarnish finishes that survive monsoons,
              silk that survives sleep, clasps that survive handbags. Every order ships in
              gift-ready packaging because we believe unboxing should feel like a celebration,
              not an errand.
            </p>
            <p className="text-sm text-[#6B5945] leading-relaxed">
              And because trust is our most treasured material, protected delivery lets you inspect
              every treasure before you pay a single rupee.
            </p>
          </div>

          <div className="relative order-1 lg:order-2">
            <img
              src="/images/categories/Artificial Jewels.jpg"
              alt="Curated gold jewellery collection"
              loading="lazy"
              className="rounded-[28px] border border-[#D8A83E]/40 shadow-[0_40px_80px_-36px_rgba(90,62,20,0.5)] w-full h-[420px] object-cover"
            />
            <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#FAF1DD]/95 backdrop-blur-md border border-[#D8A83E]/60 shadow-xl">
              <Gem className="w-6 h-6 text-[#B8860B]" />
              <div>
                <p className="text-sm font-extrabold text-[#241A12]">9 Curated Collections</p>
                <p className="text-[11px] text-[#6B5945]">One uncompromising standard</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats band — warm champagne section alternating with the cream story above */}
        <section className="relative bg-gold-soft border-y border-[#D8A83E]/30 overflow-hidden -mx-5 sm:-mx-8 lg:-mx-12">
          <div className="absolute -top-24 right-1/4 w-96 h-96 bg-white/50 rounded-full blur-[110px] pointer-events-none"></div>
          <div className="absolute -bottom-32 left-1/5 w-80 h-80 bg-[#E8C875]/40 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative px-5 sm:px-8 lg:px-12 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: `${totalCatalogCount}+`, label: 'Curated Pieces' },
                { value: '25K+', label: 'Happy Shoppers' },
                { value: '4.9★', label: 'Average Rating' },
                { value: '24h', label: 'Dispatch Time' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1.5">
                  <p
                    className="font-display font-medium text-[#241A12]"
                    style={{ fontSize: 'clamp(30px, 3.6vw, 42px)' }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#8A6A15] font-bold">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values grid */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#B8860B]">
              <span aria-hidden="true" className="mr-2">✦</span> What We Stand For
            </p>
            <h2
              className="font-display font-medium text-[#241A12]"
              style={{ fontSize: 'clamp(30px, 4vw, 46px)' }}
            >
              The Values Behind <em className="italic text-gold-gradient">Every Order</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Award,
                title: 'Quality First',
                desc: 'Every design is wear-tested by our own team before launch. If it fades, snags, or tarnishes early — it never reaches the catalogue.',
              },
              {
                icon: HandHeart,
                title: 'Fair Pricing',
                desc: 'Luxury aesthetics without luxury markups. We price honestly so gifting generosity stays affordable.',
              },
              {
                icon: ShieldCheck,
                title: 'Trust Built In',
                desc: 'Convenient payment options, protective packaging and responsive human support — your confidence is part of the product.',
              },
              {
                icon: Leaf,
                title: 'Conscious Curation',
                desc: 'Vegan leathers, cruelty-free materials and durable designs that stay out of landfill — style that doesn\'t cost the earth.',
              },
            ].map((value) => (
              <div
                key={value.title}
                className="bg-[#FFFDF6] border border-[#D8A83E]/30 hover:border-[#B8860B]/70 rounded-3xl p-6 space-y-3 transition-colors card-lift"
              >
                <div className="w-11 h-11 rounded-full border border-[#D8A83E]/50 bg-[#FAF1DD] flex items-center justify-center">
                  <value.icon className="w-5 h-5 text-[#B8860B]" />
                </div>
                <h3 className="text-base font-bold text-[#241A12]">{value.title}</h3>
                <p className="text-xs text-[#6B5945] leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Craftsmanship banner */}
        <section className="relative rounded-[28px] overflow-hidden border border-[#D8A83E]/30 min-h-[360px] flex items-center">
          <img
            src="/images/categories/Bows.jpg"
            alt="Craftsmanship detail"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#241A12]/92 via-[#241A12]/70 to-transparent"></div>
          <div className="relative max-w-xl p-8 sm:p-14 space-y-5">
            <Sparkles className="w-8 h-8 text-[#E8C875]" />
            <h2
              className="font-display font-medium text-[#FFF8E8] leading-tight"
              style={{ fontSize: 'clamp(30px, 4vw, 44px)' }}
            >
              Details You Can <em className="italic text-[#F4D99B]">Feel</em>
            </h2>
            <p className="text-sm sm:text-base text-[#F5F0E4]/85 leading-relaxed">
              Hammered textures that catch candlelight. French velvet with real weight. Springs
              tuned to hold without pulling. We obsess over millimetres because you shouldn't
              have to think about them.
            </p>
          </div>
        </section>
      </div>

      {/* Closing gold band — alternates with the dark craftsmanship section above */}
      <GoldBand
        eyebrow="Join The Family"
        title="Ready to Find Your Signature Piece?"
        text="Thousands of shoppers already made my B shoppy their favourite accessories destination — your treasure is one click away."
        primaryCta={{ label: 'Shop The Collection', path: '/shop' }}
        secondaryCta={{ label: 'Get In Touch', path: '/contact' }}
      />
    </div>
  );
};
