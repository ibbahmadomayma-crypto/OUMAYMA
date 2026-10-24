import React from 'react';
import { ArrowRight, ArrowLeft, Sparkles, Shield, Clock, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryType, Product } from '../types';
import { HERO_BANNER_IMAGE } from '../data/initialProducts';

interface HomePageProps {
  onNavigateCatalog: (category?: CategoryType) => void;
  onOpenProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateCatalog, onOpenProduct }) => {
  const { products, language } = useStore();
  const isAr = language === 'ar';

  const featuredProducts = products.filter((p) => p.status === 'active').slice(0, 4);

  const categories = [
    {
      id: 'abayas' as const,
      name: isAr ? 'عبايات راقية ومطرزة' : 'Couture Abayas',
      subtitle: isAr ? 'تطريز يدوي بأقمشة كريب وسلك ملكية' : 'Hand-embroidered royal crepe & silk',
      image: '/src/assets/images/product_luxury_abaya_1792873602148.jpg',
    },
    {
      id: 'dresses' as const,
      name: isAr ? 'فساتين سهرة ومناسبات' : 'Evening Gowns',
      subtitle: isAr ? 'قصات ساحرة من الساتان والكريب' : 'Luminous satin silhouettes & drape',
      image: '/src/assets/images/product_emerald_dress_1792873602067.jpg',
    },
    {
      id: 'casual' as const,
      name: isAr ? 'أطقم كتان ويومية' : 'Everyday Linen',
      subtitle: isAr ? 'راحة عصرية بخامات طبيعية قابلة للتنفس' : 'Relaxed organic two-piece sets',
      image: '/src/assets/images/product_linen_casual_set_1792873602830.jpg',
    },
    {
      id: 'accessories' as const,
      name: isAr ? 'إكسسوارات وحلي' : 'Artisan Jewelry',
      subtitle: isAr ? 'مطلية بالذهب ولؤلؤ باروك حر' : '18k gold plating & freshwater pearls',
      image: '/src/assets/images/product_gold_accessories_1792873603176.jpg',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Campaign Hero (Adheres to 1_ecommerce_retail.md: 1 bold campaign focal point with direct route into collection) */}
      <section className="relative bg-stone-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px] items-stretch">
          {/* Text Content Column */}
          <div className="lg:col-span-5 flex flex-col justify-center p-8 sm:p-12 lg:p-16 z-10 order-2 lg:order-1">
            <span className="text-xs uppercase tracking-[0.25em] text-stone-400 font-medium mb-3">
              {isAr ? 'مجموعة خريف وشتاء 2026 الحصرية' : 'Autumn / Winter 2026 Collection'}
            </span>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light leading-tight text-stone-100 mb-5 text-balance">
              {isAr
                ? 'فخامة خالدة وأناقة تليق بكل لحظة'
                : 'Poise, fluid draping, and modern elegance.'}
            </h1>

            <p className="text-sm text-stone-300 leading-relaxed font-light mb-8 max-w-md">
              {isAr
                ? 'دار أزياء أميمة تجمع بين أصالة الحياكة الشرقية الراقية واللمسات العصرية العالمية لتمنحكِ حضوراً استثنائياً في كل مناسبة.'
                : 'Curated by Maison Omayma for the modern woman. Discover tailored silk abayas, architectural evening gowns, and artisanal accessories.'}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigateCatalog('all')}
                className="py-3.5 px-7 bg-white text-stone-950 text-xs font-semibold uppercase tracking-widest hover:bg-stone-200 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{isAr ? 'استكشاف التشكيلة كاملة' : 'Explore The Collection'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onNavigateCatalog('abayas')}
                className="py-3.5 px-6 border border-stone-600 text-stone-200 text-xs font-medium uppercase tracking-widest hover:border-white hover:text-white transition-colors cursor-pointer"
              >
                {isAr ? 'قسم العبايات' : 'View Abayas'}
              </button>
            </div>
          </div>

          {/* Hero Media Column */}
          <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-full order-1 lg:order-2 overflow-hidden">
            <img
              src={HERO_BANNER_IMAGE}
              alt="Maison Omayma Women's Fashion Campaign"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </section>

      {/* Trust & Craftsmanship Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-stone-200 text-stone-800 text-xs">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-stone-700 shrink-0" />
            <div>
              <p className="font-semibold text-stone-900">{isAr ? 'أقمشة فاخرة 100%' : 'Artisan Craftsmanship'}</p>
              <p className="text-stone-500">{isAr ? 'حرير، كتان عضوي، وتطريز متقن' : 'Premium silk and organic linen'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-stone-700 shrink-0" />
            <div>
              <p className="font-semibold text-stone-900">{isAr ? 'توصيل سريع وموثوق' : 'Express Delivery'}</p>
              <p className="text-stone-500">{isAr ? 'خلال 2-4 أيام عمل' : 'Fast 2-4 business days'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-stone-700 shrink-0" />
            <div>
              <p className="font-semibold text-stone-900">{isAr ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</p>
              <p className="text-stone-500">{isAr ? 'عاينِي طلبكِ قبل الدفع' : 'Inspect before paying'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-stone-700 shrink-0" />
            <div>
              <p className="font-semibold text-stone-900">{isAr ? 'استبدال واسترجاع مرن' : 'Easy Exchanges'}</p>
              <p className="text-stone-500">{isAr ? 'خلال 7 أيام من الاستلام' : 'Within 7 calendar days'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Category Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">
              {isAr ? 'التصنيفات الرئيسية' : 'Curated Categories'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-medium text-stone-900 mt-1">
              {isAr ? 'تشكيلات مصممة لجميع إطلالاتك' : 'Tailored For Every Occasion'}
            </h2>
          </div>
          <button
            onClick={() => onNavigateCatalog('all')}
            className="text-xs font-semibold uppercase tracking-wider text-stone-900 hover:text-stone-600 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isAr ? 'عرض الكتالوج بالكامل' : 'Browse All Catalog'}</span>
            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigateCatalog(cat.id)}
              className="group relative aspect-[3/4] bg-stone-100 overflow-hidden cursor-pointer border border-stone-200"
            >
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[11px] uppercase tracking-wider text-stone-300 font-sans">
                  {cat.subtitle}
                </span>
                <h3 className="font-display text-xl font-medium mt-1">
                  {cat.name}
                </h3>
                <span className="text-xs underline underline-offset-4 mt-2 text-stone-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isAr ? 'تسوقي القسم ←' : 'Explore Category →'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Arrivals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">
              {isAr ? 'الأكثر طلباً ومبيعاً' : 'Selected Highlights'}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-medium text-stone-900 mt-1">
              {isAr ? 'أحدث الإبداعات في البوتيك' : 'Featured New Arrivals'}
            </h2>
          </div>
          <button
            onClick={() => onNavigateCatalog('all')}
            className="text-xs font-semibold uppercase tracking-wider text-stone-900 hover:text-stone-600 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isAr ? 'عرض الكل' : 'View All'}</span>
            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenDetails={onOpenProduct}
            />
          ))}
        </div>
      </section>

      {/* Editorial Craftsmanship Story */}
      <section className="bg-stone-100 py-16 border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs uppercase tracking-widest text-stone-500 font-medium block mb-3">
            {isAr ? 'فلسفة دار أميمة' : 'The Atelier Standard'}
          </span>
          <h2 className="font-display text-2xl sm:text-4xl text-stone-900 max-w-2xl mx-auto leading-relaxed text-balance">
            {isAr
              ? '«نصمم ملابس تحتفي بأنوثتكِ وقوتكِ، حيث يلتقي الحرير الخالص مع الحرفية اليدوية الاستثنائية»'
              : '"Garments that honor elegance and comfort in equal measure, bringing pure silk and thoughtful tailoring to every piece."'}
          </h2>
          <div className="mt-8 flex justify-center items-center gap-6 text-xs text-stone-600">
            <span>{isAr ? 'تصميم حصري' : 'Exclusive Studio Designs'}</span>
            <span>·</span>
            <span>{isAr ? 'أقمشة طبيعية' : 'Natural Fibers'}</span>
            <span>·</span>
            <span>{isAr ? 'إنتاج مدروس' : 'Mindful Craftsmanship'}</span>
          </div>
        </div>
      </section>
    </div>
  );
};
