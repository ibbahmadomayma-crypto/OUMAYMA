import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, ShieldCheck, LogOut, Menu, X, SlidersHorizontal } from 'lucide-react';
import { useStore, CURRENCIES } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { CategoryType, Currency } from '../types';

interface NavbarProps {
  currentView: 'home' | 'catalog' | 'checkout' | 'admin';
  setCurrentView: (view: 'home' | 'catalog' | 'checkout' | 'admin') => void;
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}) => {
  const {
    cartItemCount,
    wishlist,
    currency,
    setCurrency,
    language,
    setLanguage,
    setIsCartOpen,
    setIsWishlistOpen,
  } = useStore();

  const { isAuthenticated, user, logout, setIsLoginModalOpen } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const isAr = language === 'ar';

  const navItems = [
    { id: 'all', label: isAr ? 'المتجر بالكامل' : 'All Catalog', view: 'catalog' as const },
    { id: 'abayas', label: isAr ? 'عبايات راقية' : 'Abayas', view: 'catalog' as const },
    { id: 'dresses', label: isAr ? 'فساتين سهرة' : 'Dresses', view: 'catalog' as const },
    { id: 'casual', label: isAr ? 'ملابس يومية' : 'Casual Wear', view: 'catalog' as const },
    { id: 'accessories', label: isAr ? 'إكسسوارات' : 'Accessories', view: 'catalog' as const },
  ];

  const handleNavClick = (catId: string) => {
    setSelectedCategory(catId as CategoryType);
    setCurrentView('catalog');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top micro announcement */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-center w-full md:w-auto tracking-wider font-light">
            {isAr
              ? 'توصيل مجاني لجميع الطلبات فوق 150 $ · استخدم الكود OMAYMA10 للحصول على خصم 10%'
              : 'Complimentary shipping on orders over $150 · Use code OMAYMA10 for 10% off'}
          </p>
          <div className="hidden md:flex items-center gap-4 text-xs font-light text-stone-300">
            {/* Currency selector */}
            <label className="flex items-center gap-1 cursor-pointer">
              <span className="text-stone-400">{isAr ? 'العملة:' : 'Currency:'}</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-transparent text-stone-100 border-none outline-none cursor-pointer focus:ring-0 text-xs py-0.5"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code} className="bg-stone-900 text-stone-100">
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            <span className="text-stone-700">|</span>

            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="text-stone-200 hover:text-white transition-colors cursor-pointer"
            >
              {language === 'en' ? 'العربية (AR)' : 'English (EN)'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar adhering to the Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20">
          {/* Zone 1: Brand Wordmark (Single text element wordmark) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setCurrentView('home');
                setSelectedCategory('all');
              }}
              className="group flex flex-col text-left cursor-pointer transition-opacity hover:opacity-85"
            >
              <span className="font-display text-2xl sm:text-3xl font-semibold tracking-wide text-stone-900">
                Maison Omayma
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-stone-500 font-sans -mt-1">
                {isAr ? 'دار الأزياء النسائية الراقية' : 'Haute Couture & Prêt-à-Porter'}
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (single-line, whitespace-nowrap) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-700">
            <button
              onClick={() => setCurrentView('home')}
              className={`hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentView === 'home' ? 'text-stone-950 border-b-2 border-stone-950 font-semibold' : ''
              }`}
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </button>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 py-1 ${
                  currentView === 'catalog' && selectedCategory === item.id
                    ? 'text-stone-950 border-b-2 border-stone-950 font-semibold'
                    : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Functional & Action Zone */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Search Input / Expand button */}
            <div className="relative">
              {isSearchExpanded ? (
                <div className="flex items-center bg-stone-100 rounded-full px-3 py-1.5 border border-stone-200">
                  <Search className="w-4 h-4 text-stone-500 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (currentView !== 'catalog') setCurrentView('catalog');
                    }}
                    placeholder={isAr ? 'ابحث عن فستان، عباية...' : 'Search abayas, dresses...'}
                    className="bg-transparent border-none outline-none text-xs text-stone-900 w-36 sm:w-48 placeholder-stone-400"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsSearchExpanded(false);
                      setSearchQuery('');
                    }}
                    className="text-stone-400 hover:text-stone-700 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchExpanded(true)}
                  aria-label="Search"
                  className="p-2 text-stone-700 hover:text-stone-950 transition-colors cursor-pointer rounded-full hover:bg-stone-100"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              aria-label="Wishlist"
              className="relative p-2 text-stone-700 hover:text-stone-950 transition-colors cursor-pointer rounded-full hover:bg-stone-100"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-stone-900 text-white text-[10px] rounded-full flex items-center justify-center font-mono tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              className="relative p-2 text-stone-700 hover:text-stone-950 transition-colors cursor-pointer rounded-full hover:bg-stone-100"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-stone-900 text-white text-[10px] rounded-full flex items-center justify-center font-mono tabular-nums">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Owner Admin Access Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    currentView === 'admin'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                  }`}
                  title={isAr ? 'لوحة تحكم المتجر (أميمة)' : 'Store Owner Dashboard'}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">
                    {isAr ? 'لوحة الإدارة' : 'Owner Panel'}
                  </span>
                </button>
                <button
                  onClick={logout}
                  aria-label="Logout"
                  className="p-1.5 text-stone-500 hover:text-rose-600 rounded-md hover:bg-stone-100"
                  title={isAr ? 'تسجيل الخروج' : 'Logout'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-stone-300 text-stone-800 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                title={isAr ? 'دخول صاحبة المتجر' : 'Owner Portal Sign In'}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
                <span className="hidden sm:inline">{isAr ? 'دخول الإدارة' : 'Admin'}</span>
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-950 rounded-md"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-6 py-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="text-xs text-stone-500">{isAr ? 'العملة واللغة:' : 'Preferences:'}</span>
            <div className="flex items-center gap-3">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-stone-100 text-stone-900 border border-stone-300 rounded px-2 py-1 text-xs"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="px-2 py-1 bg-stone-100 text-stone-800 rounded border border-stone-300 text-xs font-medium"
              >
                {language === 'en' ? 'العربية' : 'English'}
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={() => {
                setCurrentView('home');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 font-medium text-stone-900 hover:text-stone-600"
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </button>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-left py-2 font-medium text-stone-700 hover:text-stone-950 flex items-center justify-between"
              >
                <span>{item.label}</span>
                {selectedCategory === item.id && currentView === 'catalog' && (
                  <span className="text-xs text-stone-500">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setCurrentView('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-stone-900 text-white rounded-md text-sm font-medium flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'لوحة تحكم المتجر (الإدارة)' : 'Open Owner Admin Panel'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 border border-stone-300 text-stone-800 rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:bg-stone-50"
              >
                <ShieldCheck className="w-4 h-4 text-stone-600" />
                <span>{isAr ? 'تسجيل دخول صاحبة المتجر' : 'Owner Admin Login'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
