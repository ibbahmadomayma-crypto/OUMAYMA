import React, { useState } from 'react';
import { ShieldCheck, Mail, ArrowRight, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { CategoryType } from '../types';

interface FooterProps {
  onNavigateCategory: (cat: CategoryType) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateCategory, onOpenAdmin }) => {
  const { language } = useStore();
  const { isAuthenticated } = useAuth();
  const isAr = language === 'ar';

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <span className="font-display text-2xl font-normal tracking-wide text-white block">
              Maison Omayma
            </span>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              {isAr
                ? 'علامة أزياء راقية مكرسة لتصميم أرقى العبايات والفساتين والأطقم اليومية بأقمشة فاخرة وقصات انسيابية تناسب المرأة العصرية.'
                : 'A luxury atelier and boutique dedicated to authentic women’s couture abayas, evening gowns, and everyday sets crafted with timeless poise.'}
            </p>
            <div className="text-xs text-stone-500 space-y-1">
              <p>Email: contact@maison-omayma.com</p>
              <p>{isAr ? 'خدمة العملاء: من 9 صباحاً إلى 8 مساءً' : 'Atelier Hours: 09:00 - 20:00'}</p>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              {isAr ? 'التصنيفات' : 'Collections'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigateCategory('abayas')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isAr ? 'عبايات فاخرة ومطرزة' : 'Couture Abayas'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateCategory('dresses')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isAr ? 'فساتين سهرة ومناسبات' : 'Evening Gowns'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateCategory('casual')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isAr ? 'ملابس يومية وأطقم كتان' : 'Casual Linen Sets'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateCategory('accessories')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isAr ? 'إكسسوارات وحلي مطلية' : 'Fine Artisan Jewelry'}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              {isAr ? 'خدمة العملاء' : 'Client Care'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>{isAr ? 'الدفع عند الاستلام (COD)' : 'Cash on Delivery (COD)'}</li>
              <li>{isAr ? 'الشحن والتوصيل السريع' : 'Worldwide Express Shipping'}</li>
              <li>{isAr ? 'سياسة الاستبدال والاسترجاع' : 'Exchange & Returns Policy'}</li>
              <li>{isAr ? 'دليل القياسات والمقاسات' : 'Tailoring & Sizing Guide'}</li>
            </ul>
          </div>

          {/* Newsletter & Owner Access */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              {isAr ? 'النشرة البريدية' : 'Private Journal'}
            </h4>
            <p className="text-xs text-stone-400">
              {isAr
                ? 'اشتركي لتصلكِ أحدث التشكيلات والعروض الحصرية مباشرة إلى بريدك.'
                : 'Subscribe to receive invitations to private previews and seasonal releases.'}
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={isAr ? 'بريدك الإلكتروني' : 'Your email address'}
                className="bg-stone-800 text-white text-xs px-3 py-2 flex-1 border border-stone-700 outline-none focus:border-stone-500"
              />
              <button
                type="submit"
                className="bg-white text-stone-900 px-3 py-2 text-xs font-medium hover:bg-stone-200 transition-colors cursor-pointer"
              >
                {isAr ? 'اشتراك' : 'Join'}
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-emerald-400">
                {isAr ? 'شكراً لاشتراككِ في النشرة الخاصة!' : 'Thank you for subscribing.'}
              </p>
            )}

            {/* Owner Admin link */}
            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white underline cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                <span>
                  {isAuthenticated
                    ? (isAr ? 'فتح لوحة الإدارة (أميمة)' : 'Open Owner Admin Panel')
                    : (isAr ? 'دخول لوحة تحكم الإدارة (خاص بالمالك)' : 'Owner Portal Sign In')}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Maison Omayma Boutique. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-stone-500">
            <span>{isAr ? 'تصميم حصري للنساء' : 'Tailored exclusively for women'}</span>
            <span>·</span>
            <span>{isAr ? 'أميمة للأزياء' : 'Omayma Fashion Studio'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
