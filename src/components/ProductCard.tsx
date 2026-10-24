import React, { useState } from 'react';
import { Heart, Plus, Eye, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart, toggleWishlist, isInWishlist, formatPrice, language } = useStore();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isAr = language === 'ar';
  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0 || product.status === 'out_of_stock';

  const categoryLabels: Record<string, { en: string; ar: string }> = {
    abayas: { en: 'Abayas', ar: 'عبايات' },
    dresses: { en: 'Evening Dresses', ar: 'فساتين' },
    casual: { en: 'Casual Wear', ar: 'ملابس يومية' },
    accessories: { en: 'Accessories', ar: 'إكسسوارات' },
  };

  const primaryImage = product.images[0] || '';

  return (
    <article
      className="group relative flex flex-col bg-white border border-stone-200/80 rounded-none overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage (65-75% visual weight) */}
      <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onOpenDetails(product)}>
        {!imageError && primaryImage ? (
          <img
            src={primaryImage}
            alt={isAr ? product.nameAr : product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Styled Fallback Container per Zero-Broken-Image Policy */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-stone-100 via-stone-200 to-stone-100 text-stone-500">
            <Sparkles className="w-8 h-8 stroke-1 text-stone-400 mb-2" />
            <span className="font-display text-base text-stone-700 text-center font-medium">
              {isAr ? product.nameAr : product.name}
            </span>
            <span className="text-[11px] text-stone-400 uppercase tracking-widest mt-1">
              Maison Omayma
            </span>
          </div>
        )}

        {/* Quiet Subtle Kicker Tag (Maximum 1 subtle tag, never pill badge sandwich) */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[11px] uppercase tracking-wider font-medium text-stone-900 bg-white/90 backdrop-blur-sm px-2 py-0.5 border border-stone-200 shadow-2xs">
              {product.badge}
            </span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="text-xs uppercase tracking-widest text-white font-medium bg-stone-900 px-3 py-1">
              {isAr ? 'نفد من المخزون' : 'Sold Out'}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-colors backdrop-blur-xs cursor-pointer ${
            inWishlist
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/80 text-stone-600 hover:text-stone-900 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick Actions Hover Drawer on Desktop */}
        <div className={`absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-stone-950/60 to-transparent flex items-center gap-2 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none sm:hidden'
        }`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            className="flex-1 py-2 px-3 bg-white text-stone-900 text-xs font-medium hover:bg-stone-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isAr ? 'عرض التفاصيل' : 'Quick View'}</span>
          </button>
          {!isOutOfStock && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="py-2 px-3 bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
              title={isAr ? 'إضافة للسلة' : 'Add to Bag'}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Product Card Details */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Category in quiet muted 12px uppercase without pill box */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span className="uppercase tracking-wider">
              {isAr
                ? categoryLabels[product.category]?.ar || product.category
                : categoryLabels[product.category]?.en || product.category}
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-stone-400">
              {product.sizes.length} {isAr ? 'مقاسات' : 'sizes'}
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onOpenDetails(product)}
            className="text-base font-medium text-stone-900 hover:text-stone-600 transition-colors line-clamp-1 cursor-pointer"
          >
            {isAr ? product.nameAr : product.name}
          </h3>

          {/* Color swatches preview */}
          <div className="flex items-center gap-1.5 mt-2">
            {product.colors.slice(0, 4).map((c, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full border border-stone-300"
                style={{ backgroundColor: c.hex }}
                title={isAr ? c.nameAr : c.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-stone-400 font-mono">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Stock indicator in clean tabular numerals */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-stone-900 font-mono tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock state */}
          <div className="text-xs">
            {isOutOfStock ? (
              <span className="text-rose-600 font-medium">
                {isAr ? 'نفد' : 'Out of stock'}
              </span>
            ) : product.stock <= 5 ? (
              <span className="text-amber-700 font-medium font-mono tabular-nums">
                {isAr ? `تبقى ${product.stock}` : `Only ${product.stock} left`}
              </span>
            ) : (
              <span className="text-stone-400">
                {isAr ? 'متوفر' : 'In stock'}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
