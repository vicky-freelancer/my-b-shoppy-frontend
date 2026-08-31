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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
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
              className="bg-[#141312] border border-[#272420] hover:border-[#4d4437] rounded-2xl p-6 space-y-3 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-[#1c1a17] border border-[#38332c] flex items-center justify-center">
                <card.icon className="w-5 h-5 text-[#d4af37]" />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-widest text-[#d4af37]">
                {card.title}
              </h3>
              <p className="text-sm font-bold text-white break-all">{card.primary}</p>
              <p className="text-xs text-slate-400">{card.secondary}</p>
            </div>
          ))}
        </section>

        {/* Form + side panel */}
        <section className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-3 bg-[#141312] border border-[#272420] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1.5">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#f3f0e6]">
                Send Us a Message
              </h2>
              <p className="text-xs text-slate-400">
                Fill in the form and our care team will get back to you shortly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
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
                    className="w-full bg-[#181615] border border-[#38332c] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
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
                    className="w-full bg-[#181615] border border-[#38332c] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleInputChange}
                    className="w-full bg-[#181615] border border-[#38332c] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4af37] cursor-pointer"
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
                  <label htmlFor="orderId" className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Order ID (Optional)
                  </label>
                  <input
                    id="orderId"
                    name="orderId"
                    type="text"
                    value={form.orderId}
                    onChange={handleInputChange}
                    placeholder="e.g. MBS-2026-001234"
                    className="w-full bg-[#181615] border border-[#38332c] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
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
                  className="w-full bg-[#181615] border border-[#38332c] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#fae19c] text-black font-extrabold text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <MessageSquareText className="w-4 h-4" />
                Send Message
              </button>

              {submitted && (
                <p className="flex items-center gap-2 text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3">
                  <CheckCircle2 className="w-4 h-4" />
                  Message received! Our team will reach out within 24 hours.
                </p>
              )}
            </form>
          </div>

          {/* Side panel */}
          <aside className="lg:col-span-2 space-y-5">
            <div className="relative rounded-2xl overflow-hidden border border-[#292520] h-56">
              <img
                src="https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=900&q=80"
                alt="my B shoppy accessories flatlay"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-5 right-5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37]" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">
                  Shipping Worldwide From India
                </span>
              </div>
            </div>

            <div className="bg-[#141312] border border-[#272420] rounded-2xl p-6 space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <HelpCircle className="w-4 h-4 text-[#d4af37]" />
                Quick Answers
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-400 leading-relaxed list-none">
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] mt-0.5">◆</span>
                  Flexible payment options are available across India — inspect before you pay.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] mt-0.5">◆</span>
                  Orders dispatch within 24 hours on business days.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#d4af37] mt-0.5">◆</span>
                  Returns accepted within 7 days of delivery on eligible items.
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </div>

      {/* Closing gold band — alternates with the dark form section above */}
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
