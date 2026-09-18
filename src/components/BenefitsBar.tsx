import React from 'react';
import { Truck, ShieldCheck, Gem, HeartHandshake } from 'lucide-react';

const benefits = [
  {
    icon: Truck,
    title: 'Fast & Reliable Shipping',
    desc: 'Across India',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    desc: '100% Safe & Trusted',
  },
  {
    icon: Gem,
    title: 'Trendy Collections',
    desc: 'Latest Styles & Designs',
  },
  {
    icon: HeartHandshake,
    title: 'Happy Customers',
    desc: 'Loved by 10K+ Shoppers',
  },
];

export const BenefitsBar: React.FC = () => {
  return (
    <section className="relative z-10 -mt-px bg-white border-b border-[#6B5945]/15">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, i) => (
            <div
              key={benefit.title}
              className={`relative flex items-center gap-4 px-4 sm:px-6 py-6 sm:py-8 group ${
                i % 2 === 1 ? 'border-l border-[#6B5945]/15' : ''
              } ${i < 2 ? 'border-b border-[#6B5945]/15 lg:border-b-0' : ''} ${
                i > 0 ? 'lg:border-l lg:border-[#6B5945]/15' : ''
              }`}
            >
              <span className="shrink-0 w-11 h-11 rounded-full bg-[#FAF1DD] border border-[#D8A83E]/45 flex items-center justify-center text-[#B8860B] transition-transform duration-300 group-hover:scale-110">
                <benefit.icon className="w-5 h-5" />
              </span>
              <span>
                <span className="block text-[13px] sm:text-sm font-semibold text-black tracking-tight">
                  {benefit.title}
                </span>
                <span className="block text-[11px] sm:text-xs text-black/70 mt-0.5">
                  {benefit.desc}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};