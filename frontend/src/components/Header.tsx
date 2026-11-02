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
import { useQuery } from '@tanstack/react-query';
import { apiCategories } from '../lib/catalogApi';
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
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [mobileOpenCategoryId, setMobileOpenCategoryId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  const {
    cartItems,
    wishlistIds,
    openCart,
    openWishlist,
    openSearch,
    subcategories,
  } = useStore();

  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: apiCategories });
  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const subcategoriesFor = (categoryId: string) =>
    subcategories
      .filter((subcategory) => subcategory.categoryId === categoryId && subcategory.isActive !== false)
      .sort((a, b) => a.sortOrder - b.sortOrder);

  const activeCategory =
    categories.find((category) => category.id === activeCategoryId);
  const activeCategorySubcategories = activeCategory ? subcategoriesFor(activeCategory.id) : [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setCategoriesOpen(false);
    setActiveCategoryId(null);
    setMobileMenuOpen(false);
    setMobileCategoriesOpen(false);
    setMobileOpenCategoryId(null);
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

      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 xl:px-12 min-h-[80px] sm:h-[92px] flex flex-wrap sm:flex-nowrap items-center justify-between gap-x-2 gap-y-1 py-3 sm:py-0">

        {/* ------- LEFT: Brand ------- */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group min-w-0" aria-label="MY B SHOPPY home">
          <span className="relative w-9 h-9 shrink-0 sm:w-[52px] sm:h-[52px] rounded-full overflow-hidden border-2 border-[#D8A83E]/70 shadow-[0_0_0_4px_rgba(216,168,62,0.14),0_8px_24px_-8px_rgba(0,0,0,0.6)] ring-1 ring-[#E8C875]/40 transition-transform duration-300 group-hover:scale-105">
            <img src="/images/logo/logo.png" alt="MY B SHOPPY logo" className="w-full h-full object-cover" />
          </span>
          <span className="leading-none">
            <span className="block text-[13px] min-[380px]:text-base sm:text-[22px] font-bold tracking-[0.08em] text-[#E8C875] font-display group-hover:text-[#F4D99B] transition-colors">
              MY B SHOPPY
            </span>
            <span className="block mt-1 text-[6px] min-[380px]:text-[7px] sm:text-[9px] tracking-[0.12em] sm:tracking-[0.34em] text-[#D8A83E]/90">
              STYLE • ACCESSORIES • YOU
            </span>
          </span>
        </Link>

        {/* ------- CENTER: Nav (desktop) ------- */}
        <nav className="hidden xl:flex items-center gap-6 2xl:gap-9 shrink-0">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link);

            if (link.hasDropdown) {
              return (
                <div
                  key={link.id}
                  className="relative"
                  onMouseEnter={() => {
                    setActiveCategoryId(null);
                    setCategoriesOpen(true);
                  }}
                  onMouseLeave={() => setCategoriesOpen(false)}
                  onFocus={() => setCategoriesOpen(true)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setCategoriesOpen(false);
                      setActiveCategoryId(null);
                    }
                  }}
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
                    className={`absolute top-full left-0 pt-3 z-50 transition-all duration-250 ${
                      categoriesOpen
                        ? 'opacity-100 translate-y-0 pointer-events-auto visible'
                        : 'opacity-0 translate-y-2 pointer-events-none invisible'
                    }`}
                    aria-hidden={!categoriesOpen}
                  >
                    <div className={`max-w-[calc(100vw-2rem)] rounded-2xl bg-[#151210] border border-[#D8A83E]/25 shadow-2xl shadow-black/60 overflow-hidden ${activeCategory ? 'w-[520px]' : 'w-[240px]'}`}>
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
                      <div className="flex">
                        <div className={`w-[238px] shrink-0 py-2 max-h-[min(420px,70vh)] overflow-y-auto ${activeCategory ? 'border-r border-[#2a2118]' : ''}`}>
                          {categories.map((category) => {
                            const isActiveCategory = category.id === activeCategory?.id;
                            const hasSubcategories = subcategoriesFor(category.id).length > 0;
                            return (
                              <Link
                                key={category.id}
                                to={`/categories/${category.id}`}
                                onMouseEnter={() => setActiveCategoryId(category.id)}
                                onFocus={() => setActiveCategoryId(category.id)}
                                aria-expanded={isActiveCategory}
                                aria-controls={isActiveCategory ? 'desktop-subcategories' : undefined}
                                onClick={() => setCategoriesOpen(false)}
                                className={`flex items-center gap-2 mx-2 my-0.5 px-3 py-2 rounded-xl transition-colors ${
                                  isActiveCategory
                                    ? 'bg-[#241a12] text-[#E8C875]'
                                    : 'text-[#F5F0E4]/80 hover:bg-[#241a12] hover:text-[#E8C875]'
                                }`}
                              >
                                <span className="flex-1 min-w-0 truncate text-xs font-semibold">
                                  {category.name}
                                </span>
                                {hasSubcategories && (
                                  <ChevronDown
                                    className={`w-3.5 h-3.5 shrink-0 -rotate-90 ${
                                      isActiveCategory ? 'text-[#E8C875]' : 'text-[#D8A83E]/50'
                                    }`}
                                  />
                                )}
                              </Link>
                            );
                          })}
                        </div>
                        {activeCategory && (
                        <div id="desktop-subcategories" aria-label={`${activeCategory.name} subcategories`} className="flex-1 min-w-0 py-2 max-h-[min(420px,70vh)] overflow-y-auto">
                            <>
                              <div className="px-4 py-1.5 flex items-center justify-between gap-2">
                                <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#D8A83E]/70 truncate">
                                  {activeCategory.name}
                                </span>
                                <Link
                                  to={`/categories/${activeCategory.id}`}
                                  onClick={() => setCategoriesOpen(false)}
                                  className="shrink-0 text-[9px] font-semibold uppercase tracking-widest text-[#F5F0E4]/55 hover:text-[#E8C875] transition-colors"
                                >
                                  All
                                </Link>
                              </div>
                              {activeCategorySubcategories.length > 0 ? (
                                activeCategorySubcategories.map((subcategory) => (
                                  <Link
                                    key={subcategory.id}
                                    to={`/categories/${activeCategory.id}/${subcategory.slug}`}
                                    onClick={() => setCategoriesOpen(false)}
                                    className="flex items-center justify-between gap-2 px-4 py-2 mx-1 rounded-lg text-[11px] font-medium text-[#F5F0E4]/80 hover:bg-[#241a12] hover:text-[#E8C875] transition-colors group/sub"
                                  >
                                    <span className="truncate">{subcategory.name}</span>
                                    <ArrowRight className="w-3 h-3 shrink-0 text-[#D8A83E]/40 group-hover/sub:text-[#E8C875] group-hover/sub:translate-x-0.5 transition-all" />
                                  </Link>
                                ))
                              ) : (
                                <Link
                                  to={`/categories/${activeCategory.id}?view=products`}
                                  onClick={() => setCategoriesOpen(false)}
                                  className="flex items-center justify-between gap-2 px-4 py-2 mx-1 rounded-lg text-[11px] font-medium text-[#F5F0E4]/70 hover:bg-[#241a12] hover:text-[#E8C875] transition-colors"
                                >
                                  <span>Browse all products</span>
                                  <ArrowRight className="w-3 h-3 text-[#D8A83E]/40" />
                                </Link>
                              )}
                            </>
                        </div>
                        )}
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
        <div className="flex shrink-0 items-center gap-0 sm:gap-2">

          <button
            onClick={openSearch}
            aria-label="Search products"
            className="relative p-2 sm:p-2.5 text-[#F5F0E4]/85 hover:text-[#E8C875] transition rounded-full hover:bg-white/5 cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={openWishlist}
            aria-label={`Wishlist, ${wishlistIds.length} saved`}
            className="relative p-2 sm:p-2.5 text-[#F5F0E4]/85 hover:text-[#E8C875] transition rounded-full hover:bg-white/5 cursor-pointer"
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
            className="hidden sm:block p-2 sm:p-2.5 text-[#F5F0E4]/85 hover:text-[#E8C875] transition rounded-full hover:bg-white/5 cursor-pointer"
          >
            <User className="w-5 h-5" />
          </button>

          <button
            onClick={openCart}
            aria-label={`View cart, ${cartCount} items`}
            className="relative p-2 sm:p-2.5 text-[#E8C875] hover:text-white transition rounded-full hover:bg-white/5 cursor-pointer"
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
            className="xl:hidden p-2 sm:p-2.5 text-[#F5F0E4] hover:text-[#E8C875] transition cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ------- Mobile drawer ------- */}
      {mobileMenuOpen && (
        <div className="xl:hidden max-h-[calc(100dvh-96px)] overflow-y-auto overscroll-contain bg-[#151210]/98 backdrop-blur-md border-t border-[#2a2118] px-5 pt-4 pb-6 space-y-3">
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
                  <div className="space-y-1 pt-1">
                    {categories.map((category) => {
                      const subcategoryItems = subcategoriesFor(category.id);
                      const isCategoryOpen = mobileOpenCategoryId === category.id;
                      return (
                        <div
                          key={category.id}
                          className="rounded-xl border border-[#2a2118]/80 overflow-hidden"
                        >
                          <div className="flex items-center">
                            <Link
                              to={`/categories/${category.id}`}
                              className="flex-1 min-w-0 px-3 py-2.5 text-[11px] font-medium text-[#F5F0E4]/80 hover:text-[#E8C875] transition-colors truncate"
                            >
                              {category.name}
                            </Link>
                            {subcategoryItems.length > 0 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setMobileOpenCategoryId(isCategoryOpen ? null : category.id)
                                }
                                aria-expanded={isCategoryOpen}
                                aria-label={`${isCategoryOpen ? 'Hide' : 'Show'} ${category.name} collections`}
                                className="shrink-0 px-3 py-2.5 text-[#D8A83E] cursor-pointer"
                              >
                                <ChevronDown
                                  className={`w-4 h-4 transition-transform duration-300 ${
                                    isCategoryOpen ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>
                            )}
                          </div>
                          {isCategoryOpen && subcategoryItems.length > 0 && (
                            <div className="px-2 pb-2 space-y-0.5 bg-black/20">
                              {subcategoryItems.map((subcategory) => (
                                <Link
                                  key={subcategory.id}
                                  to={`/categories/${category.id}/${subcategory.slug}`}
                                  className="flex items-center justify-between gap-2 px-3 py-2 text-[11px] rounded-lg text-[#F5F0E4]/70 hover:bg-white/5 hover:text-[#E8C875] transition-colors"
                                >
                                  <span className="truncate">{subcategory.name}</span>
                                  <ArrowRight className="w-3 h-3 shrink-0 text-[#D8A83E]/50" />
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <Link
                      to="/categories"
                      className="block px-3 py-2.5 mt-1 text-[11px] font-bold uppercase tracking-widest rounded-xl text-[#E8C875] border border-[#D8A83E]/30 text-center"
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
