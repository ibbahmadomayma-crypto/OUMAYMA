export type CategoryType = 'all' | 'dresses' | 'abayas' | 'casual' | 'accessories';

export interface ProductColor {
  name: string;
  nameAr: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  category: 'dresses' | 'abayas' | 'casual' | 'accessories';
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: 'active' | 'hidden' | 'out_of_stock';
  images: string[];
  sizes: string[];
  colors: ProductColor[];
  badge?: 'New' | 'Bestseller' | 'Exclusive' | 'Sale';
  fabric?: string;
  fabricAr?: string;
  care?: string;
  careAr?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; // unique item cart key (productId + size + color)
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  paymentMethod: 'cod' | 'card';
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}

export type Currency = 'USD' | 'EUR' | 'MAD' | 'DZD' | 'SAR';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number; // relative to USD base = 1
  label: string;
}

export type Language = 'en' | 'ar';
