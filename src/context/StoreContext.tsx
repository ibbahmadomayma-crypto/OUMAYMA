import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Currency, Language, CurrencyConfig, ProductColor } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rate: 1, label: 'USD ($)' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€)' },
  MAD: { code: 'MAD', symbol: 'د.م.', rate: 10.1, label: 'MAD (Morocco)' },
  DZD: { code: 'DZD', symbol: 'دج', rate: 134.5, label: 'DZD (Algeria)' },
  SAR: { code: 'SAR', symbol: 'ر.س', rate: 3.75, label: 'SAR (Saudi)' },
};

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  currency: Currency;
  language: Language;
  selectedProductForModal: Product | null;
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  setCurrency: (c: Currency) => void;
  setLanguage: (lang: Language) => void;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  // Shopping Cart Actions
  addToCart: (product: Product, size?: string, color?: ProductColor, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  // Orders & Checkout Actions
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'subtotal' | 'discount' | 'shipping' | 'total'> & { promoCode?: string }) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  // Owner Controls:
  // a. "كيفاش نحسن" (Enhance & Update)
  updateProduct: (id: string, updates: Partial<Product>) => void;
  // b. "نزييد" (Add Product)
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  // c. "نقص" (Remove / Reduce Stock & Hide)
  removeProduct: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;
  setStockExact: (id: string, stock: number) => void;
  toggleProductStatus: (id: string) => void;
  resetToInitialCatalog: () => void;
  formatPrice: (amountInUSD: number) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'maison_omayma_products_v1',
  CART: 'maison_omayma_cart_v1',
  WISHLIST: 'maison_omayma_wishlist_v1',
  ORDERS: 'maison_omayma_orders_v1',
  CURRENCY: 'maison_omayma_currency_v1',
  LANG: 'maison_omayma_lang_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Pre-populate with 2 realistic sample orders for admin demonstration
    return [
      {
        id: 'ORD-8921',
        customerName: 'Amina Mansouri',
        email: 'amina.m@example.com',
        phone: '+213 550 12 34 56',
        address: '14 Boulevard Didouche Mourad',
        city: 'Algiers',
        country: 'Algeria',
        paymentMethod: 'cod',
        items: [
          {
            id: 'sample-1',
            productId: 'prod-abaya-01',
            product: INITIAL_PRODUCTS[0],
            selectedSize: 'M (54)',
            selectedColor: INITIAL_PRODUCTS[0].colors[0],
            quantity: 1,
          }
        ],
        subtotal: 185,
        discount: 0,
        shipping: 0,
        total: 185,
        status: 'Confirmed',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        notes: 'Please call before delivery in the afternoon.',
      },
      {
        id: 'ORD-8920',
        customerName: 'Fatima Zahra El-Idrissi',
        email: 'fz.elidrissi@example.com',
        phone: '+212 661 98 76 54',
        address: 'Avenue Mohammed V, Résidence Jasmine #4',
        city: 'Casablanca',
        country: 'Morocco',
        paymentMethod: 'card',
        items: [
          {
            id: 'sample-2',
            productId: 'prod-dress-01',
            product: INITIAL_PRODUCTS[1],
            selectedSize: 'S',
            selectedColor: INITIAL_PRODUCTS[1].colors[0],
            quantity: 1,
          }
        ],
        subtotal: 210,
        discount: 21,
        shipping: 0,
        total: 189,
        status: 'Delivered',
        createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
      }
    ];
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      if (saved && saved in CURRENCIES) return saved as Currency;
    } catch {
      // default
    }
    return 'USD';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG);
      if (saved === 'ar' || saved === 'en') return saved;
    } catch {
      // default
    }
    return 'en';
  });

  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
    // Adjust HTML dir attribute for RTL when Arabic is active
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setCurrency = (c: Currency) => setCurrencyState(c);
  const setLanguage = (lang: Language) => setLanguageState(lang);

  const openProductModal = (product: Product) => setSelectedProductForModal(product);
  const closeProductModal = () => setSelectedProductForModal(null);

  // Cart operations
  const addToCart = (product: Product, size?: string, color?: ProductColor, quantity = 1) => {
    const selectedSize = size || product.sizes[0] || 'Standard';
    const selectedColor = color || product.colors[0] || { name: 'Default', nameAr: 'افتراضي', hex: '#000000' };
    const cartItemId = `${product.id}-${selectedSize}-${selectedColor.name}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, {
        id: cartItemId,
        productId: product.id,
        product,
        selectedSize,
        selectedColor,
        quantity: Math.min(quantity, Math.max(1, product.stock))
      }];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === cartItemId) {
          const maxStock = item.product.stock || 99;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Place Order (decrements stock & creates order record)
  const placeOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'subtotal' | 'discount' | 'shipping' | 'total'> & { promoCode?: string }): Order => {
    const subtotal = cartTotal;
    const discount = orderData.promoCode?.trim().toUpperCase() === 'OMAYMA10' ? subtotal * 0.1 : 0;
    const shipping = subtotal > 150 ? 0 : 15;
    const total = Math.max(0, subtotal - discount + shipping);

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: orderData.customerName,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      city: orderData.city,
      country: orderData.country,
      paymentMethod: orderData.paymentMethod,
      items: [...cart],
      subtotal,
      discount,
      shipping,
      total,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      notes: orderData.notes,
    };

    // Decrement stock for ordered items
    setProducts(prevProducts => {
      const updated = [...prevProducts];
      for (const item of cart) {
        const prodIndex = updated.findIndex(p => p.id === item.productId);
        if (prodIndex >= 0) {
          const currentStock = updated[prodIndex].stock;
          const newStock = Math.max(0, currentStock - item.quantity);
          updated[prodIndex] = {
            ...updated[prodIndex],
            stock: newStock,
            status: newStock === 0 ? 'out_of_stock' : updated[prodIndex].status,
            updatedAt: new Date().toISOString(),
          };
        }
      }
      return updated;
    });

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // ==========================================
  // OWNER CONTROL PANELS:
  // a. "كيفاش نحسن" (Enhance & Update Product)
  // ==========================================
  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = {
            ...p,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          // Automatically adjust status if stock reaches 0
          if (updated.stock <= 0 && updated.status === 'active') {
            updated.status = 'out_of_stock';
          } else if (updated.stock > 0 && updated.status === 'out_of_stock') {
            updated.status = 'active';
          }
          return updated;
        }
        return p;
      })
    );

    // Also update any matching product in current cart or modal
    setCart(prev =>
      prev.map(item =>
        item.productId === id ? { ...item, product: { ...item.product, ...updates } } : item
      )
    );

    if (selectedProductForModal && selectedProductForModal.id === id) {
      setSelectedProductForModal(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  // ==========================================
  // b. "نزييد" (Add New Product)
  // ==========================================
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
    const newId = `prod-${productData.category}-${Date.now().toString().slice(-4)}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  // ==========================================
  // c. "نقص" (Remove / Reduce Stock & Hide)
  // ==========================================
  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.productId !== id));
    setWishlist(prev => prev.filter(wId => wId !== id));
    if (selectedProductForModal?.id === id) {
      setSelectedProductForModal(null);
    }
  };

  const adjustStock = (id: string, delta: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + delta);
          return {
            ...p,
            stock: newStock,
            status: newStock === 0 ? 'out_of_stock' : (p.status === 'out_of_stock' ? 'active' : p.status),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
  };

  const setStockExact = (id: string, stock: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newStock = Math.max(0, stock);
          return {
            ...p,
            stock: newStock,
            status: newStock === 0 ? 'out_of_stock' : (p.status === 'out_of_stock' ? 'active' : p.status),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
  };

  const toggleProductStatus = (id: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextStatus = p.status === 'hidden' ? (p.stock > 0 ? 'active' : 'out_of_stock') : 'hidden';
          return {
            ...p,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
  };

  const resetToInitialCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  };

  // Price formatting helper
  const formatPrice = (amountInUSD: number): string => {
    const config = CURRENCIES[currency];
    const converted = amountInUSD * config.rate;
    // Format according to currency style
    if (currency === 'MAD' || currency === 'DZD' || currency === 'SAR') {
      return `${Math.round(converted).toLocaleString()} ${config.symbol}`;
    }
    return `${config.symbol}${converted.toFixed(0)}`;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        currency,
        language,
        selectedProductForModal,
        isCartOpen,
        isWishlistOpen,
        setCurrency,
        setLanguage,
        openProductModal,
        closeProductModal,
        setIsCartOpen,
        setIsWishlistOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        toggleWishlist,
        isInWishlist,
        placeOrder,
        updateOrderStatus,
        updateProduct,
        addProduct,
        removeProduct,
        adjustStock,
        setStockExact,
        toggleProductStatus,
        resetToInitialCatalog,
        formatPrice,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
