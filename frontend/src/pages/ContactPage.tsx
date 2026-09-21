import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
} from 'lucide-react';
import { GoldHero } from '../components/GoldHero';
import { GoldBand } from '../components/GoldBand';
import { STORE_CONFIG } from '../storeConfig';
import { useSeo } from '../lib/seo';

interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  orderId: string;
  message: string;
}

const initialForm: ContactFormState = {
  name: '',
  email: '',
  subject: 'General Enquiry',
  orderId: '',
  message: '',
};

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  useSeo({
    title: 'Contact Us',
    description:
      'Reach the my B shoppy support team — email, phone & response within 24 hours. Questions about orders, shipping, returns or products, we are here to help.',
    path: '/contact',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim() && form.email.trim() && form.message.trim()) {
      setSubmitted(true);
      setForm(initialForm);
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div>
      <GoldHero
        title="Contact Us"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Contact' },
        ]}
        subtitle="Real humans, real answers — we reply to every message within one business day"
        metaText="Replies Within 24h"
      />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-12 space-y-14">
        {/* Info cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: Mail,
              title: 'Email Us',
              primary: STORE_CONFIG.contact.email,
              secondary: 'Best for order & product queries',
            },
            {
              icon: Phone,
              title: 'Call / WhatsApp',
              primary: STORE_CONFIG.contact.phone,
              secondary: 'Voice support during working hours',
            },
            {
              icon: Clock,
              title: 'Support Hours',
              primary: STORE_CONFIG.contact.supportHours,
              secondary: 'Replies within 24 hours, always',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="bg-[#FFFDF6] border border-[#D8A83E]/30 hover:border-[#B8860B]/70 rounded-3xl p-6 space-y-3 transition-colors card-lift"
            >
              <div className="w-11 h-11 rounded-full border border-[#D8A83E]/50 bg-[#FAF1DD] flex items-center justify-center">
                <card.icon className="w-5 h-5 text-[#B8860B]" />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.24em] text-[#B8860B]">
                {card.title}
              </h3>
              <p className="text-sm font-bold text-[#241A12] break-all">{card.primary}</p>
              <p className="text-xs text-[#6B5945]">{card.secondary}</p>
            </div>
          ))}
        </section>

        {/* Form + side panel */}
        <section className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-3 bg-[#FFFDF6] border border-[#D8A83E]/30 rounded-[28px] p-6 sm:p-8 space-y-6">
            <div className="space-y-1.5">
              <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#241A12]">
                Send Us a <em className="italic text-gold-gradient">Message</em>
              </h2>
              <p className="text-xs text-[#6B5945]">
                Fill in the form and our care team will get back to you shortly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-wider text-[#241A12]">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="Aishwarya Sharma"
                    className="w-full bg-[#FAF1DD] border border-[#6B5945]/25 rounded-xl px-3.5 py-2.5 text-sm text-[#241A12] placeholder-[#6B5945]/50 focus:outline-none focus:border-[#B8860B]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-[#241A12]">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full bg-[#FAF1DD] border border-[#6B5945]/25 rounded-xl px-3.5 py-2.5 text-sm text-[#241A12] placeholder-[#6B5945]/50 focus:outline-none focus:border-[#B8860B]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-[11px] font-bold uppercase tracking-wider text-[#241A12]">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF1DD] border border-[#6B5945]/25 rounded-xl px-3.5 py-2.5 text-sm text-[#241A12] focus:outline-none focus:border-[#B8860B] cursor-pointer"
                  >
                    <option>General Enquiry</option>
                    <option>Order Status</option>
                    <option>Returns & Exchanges</option>
                    <option>Product Question</option>
                    <option>Bulk / Gifting Order</option>
                    <option>Feedback</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="orderId" className="text-[11px] font-bold uppercase tracking-wider text-[#241A12]">
                    Order ID (Optional)
                  </label>
                  <input
                    id="orderId"
                    name="orderId"
                    type="text"
                    value={form.orderId}
                    onChange={handleInputChange}
                    placeholder="e.g. MBS-2026-001234"
                    className="w-full bg-[#FAF1DD] border border-[#6B5945]/25 rounded-xl px-3.5 py-2.5 text-sm text-[#241A12] placeholder-[#6B5945]/50 focus:outline-none focus:border-[#B8860B]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-[11px] font-bold uppercase tracking-wider text-[#241A12]">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleInputChange}
                  placeholder="Tell us how we can help…"
                  className="w-full bg-[#FAF1DD] border border-[#6B5945]/25 rounded-xl px-3.5 py-2.5 text-sm text-[#241A12] placeholder-[#6B5945]/50 focus:outline-none focus:border-[#B8860B] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#111111] hover:bg-[#241A12] text-[#F4D99B] font-semibold text-xs sm:text-sm uppercase tracking-[0.22em] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <MessageSquareText className="w-4 h-4" />
                Send Message
              </button>

              {submitted && (
                <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-500/40 rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4" />
                  Message received! Our team will reach out within 24 hours.
                </p>
              )}
            </form>
          </div>

          {/* Side panel */}
          <aside className="lg:col-span-2 space-y-5">
            <div className="relative rounded-[28px] overflow-hidden border border-[#D8A83E]/40 h-56">
              <img
                src="/images/categories/Handbags.jpg"
                alt="my B shoppy accessories flatlay"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#241A12]/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-5 right-5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E8C875]" />
                <span className="text-xs font-bold text-[#FFF8E8] uppercase tracking-widest">
                  Shipping Worldwide From India
                </span>
              </div>
            </div>

            <div className="bg-[#FFFDF6] border border-[#D8A83E]/30 rounded-[28px] p-6 space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-[#241A12]">
                <HelpCircle className="w-4 h-4 text-[#B8860B]" />
                Quick Answers
              </h3>
              <ul className="space-y-2.5 text-xs text-[#6B5945] leading-relaxed list-none">
                <li className="flex items-start gap-2">
                  <span className="text-[#B8860B] mt-0.5">◆</span>
                  Flexible payment options are available across India — inspect before you pay.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B8860B] mt-0.5">◆</span>
                  Orders dispatch within 24 hours on business days.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B8860B] mt-0.5">◆</span>
                  Returns accepted within 7 days of delivery on eligible items.
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </div>

      {/* Closing band — alternates with the cream form section above */}
      <GoldBand
        eyebrow="We Are Here To Help"
        title="Prefer a Human Answer?"
        text="Message our care team about any order, product or return — real replies within one business day."
        primaryCta={{ label: 'Browse Categories', path: '/categories' }}
        secondaryCta={{ label: 'Shop All Products', path: '/shop' }}
      />
    </div>
  );
};