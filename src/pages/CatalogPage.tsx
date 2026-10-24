import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, X, Search, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryType, Product } from '../types';

interface CatalogPageProps {
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenProduct: (product: Product) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onOpenProduct,
}) => {
  const { products, language, formatPrice } = useStore();
  const isAr = language === 'ar';

  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColorHex, setSelectedColorHex] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Available Sizes in inventory
  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [products]);

  // Available Colors in inventory
  const allColors = useMemo(() => {
    const map = new Map<string, { name: string; nameAr: string; hex: string }>();
    products.forEach((p) => {
      p.colors.forEach((c) => {
        if (!map.has(c.hex)) map.set(c.hex, c);
      });
    });
    return Array.from(map.values());
  }, [products]);

  // Categories list
  const categories: { id: CategoryType; name: string }[] = [
    { id: 'all', name: isAr ? 'جميع المعروضات' : 'All Collections' },
    { id: 'abayas', name: isAr ? 'عبايات راقية' : 'Couture Abayas' },
    { id: 'dresses', name: isAr ? 'فساتين سهرة' : 'Evening Dresses' },
    { id: 'casual', name: isAr ? 'ملابس وأطقم يومية' : 'Casual Wear' },
    { id: 'accessories', name: isAr ? 'إكسسوارات وحلي' : 'Accessories' },
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Must not be hidden by admin
      if (product.status === 'hidden') return false;

      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchNameAr = product.nameAr.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        if (!matchName && !matchNameAr && !matchDesc) return false;
      }

      // Size filter
      if (selectedSize !== 'all' && !product.sizes.includes(selectedSize)) {
        return false;
      }

      // Color filter
      if (selectedColorHex !== 'all' && !product.colors.some((c) => c.hex === selectedColorHex)) {
        return false;
      }

      // Stock filter
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0; // featured default
    });
  }, [products, selectedCategory, searchQuery, selectedSize, selectedColorHex, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedColorHex('all');
    setInStockOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSize !== 'all' ||
    selectedColorHex !== 'all' ||
    inStockOnly ||
    searchQuery.trim() !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="border-b border-stone-200 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-medium">
            {isAr ? 'الكتالوج الكامل' : 'Collection Archive'}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-stone-900 mt-1">
            {selectedCategory === 'all'
              ? (isAr ? 'جميع الأزياء النسائية' : "Women's Collection")
              : categories.find((c) => c.id === selectedCategory)?.name}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {isAr
              ? `عرض ${filteredProducts.length} قطعة متوفرة في دار أميمة`
              : `Showing ${filteredProducts.length} pieces available at Maison Omayma`}
          </p>
        </div>

        {/* Sorting & Filter Trigger Bar */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 py-2 px-3 border border-stone-300 text-xs font-medium text-stone-800"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{isAr ? 'الفلاتر والخيارات' : 'Filters'}</span>
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-stone-900" />}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <label htmlFor="sort-by" className="font-medium shrink-0">
              {isAr ? 'الترتيب حسب:' : 'Sort by:'}
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-300 py-1.5 px-3 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
            >
              <option value="featured">{isAr ? 'المميز والأعلى تقييماً' : 'Featured'}</option>
              <option value="price-low">{isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
              <option value="price-high">{isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
              <option value="newest">{isAr ? 'وصل حديثاً' : 'Newest Arrivals'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block md:col-span-1 space-y-6 sticky top-28 bg-white p-5 border border-stone-200">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              {isAr ? 'تصفية النتائج' : 'Filter Products'}
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-stone-500 hover:text-stone-900 flex items-center gap-1 underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                {isAr ? 'إعادة ضبط' : 'Reset'}
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div>
            <h4 className="text-xs font-medium text-stone-900 mb-2.5">
              {isAr ? 'التصنيف' : 'Category'}
            </h4>
            <div className="space-y-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`w-full text-left py-1.5 px-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    selectedCategory === c.id
                      ? 'bg-stone-900 text-white font-medium'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">
                    {c.id === 'all'
                      ? products.filter((p) => p.status !== 'hidden').length
                      : products.filter((p) => p.category === c.id && p.status !== 'hidden').length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-stone-900">{isAr ? 'المقاس' : 'Size'}</h4>
              {selectedSize !== 'all' && (
                <button
                  onClick={() => setSelectedSize('all')}
                  className="text-[11px] text-stone-400 hover:text-stone-700"
                >
                  {isAr ? 'الكل' : 'All'}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedSize('all')}
                className={`py-1 px-2 text-xs border cursor-pointer ${
                  selectedSize === 'all'
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-200 text-stone-700 hover:border-stone-400'
                }`}
              >
                {isAr ? 'الجميع' : 'All'}
              </button>
              {allSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-1 px-2 text-xs border cursor-pointer ${
                    selectedSize === s
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-200 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-medium text-stone-900">{isAr ? 'اللون' : 'Color'}</h4>
              {selectedColorHex !== 'all' && (
                <button
                  onClick={() => setSelectedColorHex('all')}
                  className="text-[11px] text-stone-400 hover:text-stone-700"
                >
                  {isAr ? 'الكل' : 'All'}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allColors.map((col) => (
                <button
                  key={col.hex}
                  onClick={() => setSelectedColorHex(selectedColorHex === col.hex ? 'all' : col.hex)}
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                    selectedColorHex === col.hex
                      ? 'ring-2 ring-stone-900 ring-offset-2'
                      : 'border-stone-300 hover:border-stone-600'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={isAr ? col.nameAr : col.name}
                />
              ))}
            </div>
          </div>

          {/* In Stock Only Checkbox */}
          <div className="pt-4 border-t border-stone-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-stone-300 text-stone-900 focus:ring-0"
              />
              <span>{isAr ? 'القطع المتوفرة فوراً فقط' : 'In-Stock Only'}</span>
            </label>
          </div>
        </aside>

        {/* Product Cards Grid Area */}
        <main className="md:col-span-3 lg:col-span-4">
          {searchQuery && (
            <div className="mb-4 p-3 bg-stone-100 border border-stone-200 text-xs flex items-center justify-between">
              <span>
                {isAr ? 'نتائج البحث عن: ' : 'Search results for: '}
                <strong className="text-stone-900">"{searchQuery}"</strong>
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-stone-500 hover:text-stone-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-stone-300 p-8">
              <Search className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <h3 className="font-display text-xl text-stone-800 mb-1">
                {isAr ? 'لم نعثر على أي تطابق' : 'No matching pieces found'}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
                {isAr
                  ? 'جربي تعديل خيارات الفلترة أو مسح كلمات البحث للعثور على تصاميم دار أميمة.'
                  : 'Try clearing your filters or searching with different terms.'}
              </p>
              <button
                onClick={resetFilters}
                className="py-2 px-4 bg-stone-900 text-white text-xs uppercase tracking-wider font-medium hover:bg-stone-800"
              >
                {isAr ? 'إعادة ضبط كل الفلاتر' : 'Reset All Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onOpenDetails={onOpenProduct}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white h-full p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-stone-200 mb-6">
                <span className="font-display text-xl font-semibold text-stone-900">
                  {isAr ? 'تصفية الكتالوج' : 'Filter Catalog'}
                </span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase text-stone-800 mb-2">
                  {isAr ? 'التصنيف' : 'Category'}
                </h4>
                <div className="space-y-1">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.id);
                      }}
                      className={`w-full text-left py-2 px-3 text-xs ${
                        selectedCategory === c.id
                          ? 'bg-stone-900 text-white font-medium'
                          : 'text-stone-700 bg-stone-50'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase text-stone-800 mb-2">
                  {isAr ? 'المقاس' : 'Size'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSize('all')}
                    className={`py-1.5 px-3 text-xs border ${
                      selectedSize === 'all' ? 'bg-stone-900 text-white' : 'border-stone-300'
                    }`}
                  >
                    {isAr ? 'الكل' : 'All'}
                  </button>
                  {allSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-1.5 px-3 text-xs border ${
                        selectedSize === s ? 'bg-stone-900 text-white' : 'border-stone-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* In stock */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-xs text-stone-800">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                  <span>{isAr ? 'المتوفر في المخزون فقط' : 'In-Stock Only'}</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex gap-2">
              <button
                onClick={resetFilters}
                className="py-3 px-4 bg-stone-100 text-stone-800 text-xs font-medium uppercase tracking-wider w-1/3"
              >
                {isAr ? 'مسح' : 'Clear'}
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="py-3 px-4 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider w-2/3"
              >
                {isAr ? 'تطبيق الفلترة' : 'Apply Filters'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
