import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  User,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { STORE_CONFIG } from '../storeConfig';
import { useStore } from '../context/StoreContext';

const navLinks = [
  { id: 'home', label: 'HOME', path: '/' },
  { id: 'shop', label: 'SHOP', path: '/shop' },
  { id: 'categories', label: 'CATEGORIES', path: '/categories', hasDropdown: true },
  { id: 'about', label: 'ABOUT US', path: '/about' },
  { id: 'contact', label: 'CONTACT', path: '/contact' },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  const {
    cartItems,
    wishlistIds,
    openCart,
    openWishlist,
    openSearch,
  } = useStore();

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileCategoriesOpen(false);
  }, [location.pathname]);

  // Close menus on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setCategoriesOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isLinkActive = (link: (typeof navLinks)[number]) => {
    if (link.path === '/') return location.pathname === '/';
    return location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
  };

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 bg-[#111111]/95 backdrop-blur-md transition-all duration-500 border-b ${
        scrolled ? 'border-[#D8A83E]/30 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)]' : 'border-[#2a2118]'
      }`}
    >
      {/* Thin gold accent line on top */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#B8860B] via-[#E8C875] to-[#B8860B]"></div>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-[92px] flex items-center justify-between gap-4">

        {/* ------- LEFT: Brand ------- */}
        <Link to="/" className="flex items-center gap-3 group shrink-0" aria-label="MY B SHOPPY home">
          <span className="relative w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-full overflow-hidden border-2 border-[#D8A83E]/70 shadow-[0_0_0_4px_rgba(216,168,62,0.14),0_8px_24px_-8px_rgba(0,0,0,0.6)] ring-1 ring-[#E8C875]/40 transition-transform duration-300 group-hover:scale-105">
            <img src="/images/logo/logo.png" alt="MY B SHOPPY logo" className="w-full h-full object-cover" />
          </span>
          <span className="leading-none">
            <span className="block text-lg sm:text-[22px] font-bold tracking-[0.08em] text-[#E8C875] font-display group-hover:text-[#F4D99B] transition-colors">
              MY B SHOPPY
            </span>
            <span className="block mt-1 text-[8.5px] sm:text-[9px] tracking-[0.34em] text-[#D8A83E]/90">
              STYLE • ACCESSORIES • YOU
            </span>
          </span>
        </Link>

        {/* ------- CENTER: Nav (desktop) ------- */}
        <nav className="hidden lg:flex items-center gap-9">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link);

            if (link.hasDropdown) {
              return (
                <div
                  key={link.id}
                  className="relative"
                  onMouseEnter={() => setCategoriesOpen(true)}
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  <Link
                    to={link.path}
                    aria-haspopup="true"
                    aria-expanded={categoriesOpen}
                    className={`relative text-[12px] font-semibold tracking-[0.22em] uppercase transition-colors py-2 inline-flex items-center gap-1.5 ${
                      isActive ? 'text-[#E8C875]' : 'text-[#F5F0E4]/85 hover:text-white'
                    }`}
                  >
                    {link.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${categoriesOpen ? 'rotate-180 text-[#E8C875]' : ''}`}
                    />
                    <span
                      className={`absolute -bottom-0.5 left-0 h-[2px] bg-[#E8C875] transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0'
                      } ${!isActive ? 'group-hover:w-full' : ''}`}
                    />
                  </Link>

                  {/* Dropdown */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 transition-all duration-250 ${
                      categoriesOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="w-[340px] rounded-2xl bg-[#151210] border border-[#D8A83E]/25 shadow-2xl shadow-black/60 overflow-hidden">
                      <div className="px-5 py-3 border-b border-[#2a2118] flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#E8C875]">
                          Shop by Category
                        </span>
                        <Link
                          to="/categories"
                          onClick={() => setCategoriesOpen(false)}
                          className="text-[10px] font-semibold uppercase tracking-widest text-[#F5F0E4]/60 hover:text-[#E8C875] transition-colors"
                        >
                          View All
                        </Link>
                      </div>
                      <div className="max-h-[340px] overflow-y-auto py-2">
                        {STORE_CONFIG.categories.slice(0, 9).map((category) => (
                          <Link
                            key={category.id}
                            to={`/categories/${category.id}`}
                            onClick={() => setCategoriesOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 mx-2 my-0.5 rounded-xl transition-colors hover:bg-[#241a12] group"
                          >
                            <span className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-[#D8A83E]/25 bg-[#241a12]">
                              <img src={category.imageUrl} alt="" loading="lazy" className="w-full h-full object-cover" />
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="block text-xs font-semibold text-[#F5F0E4]/90 truncate">
                                {category.name}
                              </span>
                              <span className="block text-[10px] text-[#D8A83E]/70">
                                From ₹{category.startingPrice} · {category.count}+ items
                              </span>
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#D8A83E]/50 group-hover:text-[#E8C875] group-hover:translate-x-0.5 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.id}
                to={link.path}
                className={`relative text-[12px] font-semibold tracking-[0.22em] uppercase transition-colors py-2 ${
                  isActive ? 'text-[#E8C875]' : 'text-[#F5F0E4]/85 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[2px] bg-[#E8C875] transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* ------- RIGHT: Actions ------- */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          <button
            onClick={openSearch}
            aria-label="Search products"
            className="relative p-2.5 text-[#F5F0E4]/85 hover:text-[#E8C875] transition rounded-full hover:bg-white/5 cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={openWishlist}
            aria-label={`Wishlist, ${wishlistIds.length} saved`}
            className="relative p-2.5 text-[#F5F0E4]/85 hover:text-[#E8C875] transition rounded-full hover:bg-white/5 cursor-pointer"
          >
            <Heart className="w-5 h-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#D8A83E] text-[#111111] text-[10px] font-bold flex items-center justify-center shadow">
                {wishlistIds.length}
              </span>
            )}
          </button>

          <button
            aria-label="My account"
            className="hidden sm:block p-2.5 text-[#F5F0E4]/85 hover:text-[#E8C875] transition rounded-full hover:bg-white/5 cursor-pointer"
          >
            <User className="w-5 h-5" />
          </button>

          <button
            onClick={openCart}
            aria-label={`View cart, ${cartCount} items`}
            className="relative p-2.5 text-[#E8C875] hover:text-white transition rounded-full hover:bg-white/5 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[19px] h-[19px] px-1 rounded-full bg-[#D8A83E] text-[#111111] text-[11px] font-bold flex items-center justify-center shadow-[0_2px_8px_rgba(216,168,62,0.5)]">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden p-2.5 text-[#F5F0E4] hover:text-[#E8C875] transition cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ------- Mobile drawer ------- */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#151210]/98 backdrop-blur-md border-t border-[#2a2118] px-5 pt-4 pb-6 space-y-3">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <React.Fragment key={link.id}>
                <button
                  onClick={() => setMobileCategoriesOpen((v) => !v)}
                  aria-expanded={mobileCategoriesOpen}
                  className={`w-full flex items-center justify-between text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-xl ${
                    isLinkActive(link) ? 'bg-[#241a12] text-[#E8C875]' : 'text-[#F5F0E4]/85'
                  }`}
                >
                  {link.label}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileCategoriesOpen && (
                  <div className="pl-3 grid grid-cols-2 gap-1.5 pt-1">
                    {STORE_CONFIG.categories.slice(0, 9).map((category) => (
                      <Link
                        key={category.id}
                        to={`/categories/${category.id}`}
                        className="px-3 py-2 text-[11px] font-medium rounded-lg text-[#F5F0E4]/75 hover:bg-white/5 hover:text-[#E8C875] transition-colors truncate"
                      >
                        {category.name}
                      </Link>
                    ))}
                    <Link
                      to="/categories"
                      className="col-span-2 px-3 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-xl text-[#E8C875] border border-[#D8A83E]/30 text-center"
                    >
                      View All Categories
                    </Link>
                  </div>
                )}
              </React.Fragment>
            ) : (
              <Link
                key={link.id}
                to={link.path}
                className={`block px-3 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-xl ${
                  isLinkActive(link) ? 'bg-[#241a12] text-[#E8C875]' : 'text-[#F5F0E4]/85 hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      )}
    </header>
  );
};