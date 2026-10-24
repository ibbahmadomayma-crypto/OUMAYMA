/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SizeGuideModal } from './components/SizeGuideModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CategoryType, Product } from './types';

function getViewFromPath(pathname: string): 'home' | 'catalog' | 'checkout' | 'admin' {
  const clean = pathname.replace(/^\/+/, '').split('/')[0].toLowerCase();
  if (clean === 'catalog' || clean === 'collections' || clean === 'shop') return 'catalog';
  if (clean === 'checkout' || clean === 'cart') return 'checkout';
  if (clean === 'admin' || clean === 'dashboard') return 'admin';
  return 'home';
}

function StoreApp() {
  const [currentView, setCurrentViewState] = useState<'home' | 'catalog' | 'checkout' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      return getViewFromPath(window.location.pathname);
    }
    return 'home';
  });

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const {
    selectedProductForModal,
    openProductModal,
    closeProductModal,
    setIsCartOpen,
  } = useStore();

  const { isAuthenticated, setIsLoginModalOpen } = useAuth();

  const setCurrentView = (view: 'home' | 'catalog' | 'checkout' | 'admin', push = true) => {
    setCurrentViewState(view);
    if (push && typeof window !== 'undefined') {
      const newPath = view === 'home' ? '/' : `/${view}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState({ view }, '', newPath);
      }
    }
  };

  // Listen for browser forward/back buttons
  React.useEffect(() => {
    const handlePopState = () => {
      const view = getViewFromPath(window.location.pathname);
      setCurrentViewState(view);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenProduct = (product: Product) => {
    openProductModal(product);
  };

  const handleNavigateCatalog = (category: CategoryType = 'all') => {
    setSelectedCategory(category);
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInstantCheckout = () => {
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdminPortal = () => {
    if (isAuthenticated) {
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigateCatalog={handleNavigateCatalog}
            onOpenProduct={handleOpenProduct}
          />
        )}

        {currentView === 'catalog' && (
          <CatalogPage
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenProduct={handleOpenProduct}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onBackToShop={() => {
              setCurrentView('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            onBackToStore={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer (displayed on all customer-facing views) */}
      {currentView !== 'admin' && (
        <Footer
          onNavigateCategory={handleNavigateCatalog}
          onOpenAdmin={handleOpenAdminPortal}
        />
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={closeProductModal}
        onInstantCheckout={handleInstantCheckout}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        onCheckout={() => {
          setCurrentView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        onSuccess={() => {
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <StoreApp />
      </AuthProvider>
    </StoreProvider>
  );
}
