import React, { useState } from 'react';
import { X, Heart, Shield, RotateCcw, Truck, Check, Sparkles } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onInstantCheckout?: () => void;
  onOpenSizeGuide?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onInstantCheckout,
  onOpenSizeGuide,
}) => {
  const { addToCart, toggleWishlist, isInWishlist, formatPrice, language } = useStore();

  if (!product) return null;

  const isAr = language === 'ar';
  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0 || product.status === 'out_of_stock';

  const [selectedImage, setSelectedImage] = useState(product.images[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Standard', nameAr: 'افتراضي', hex: '#000000' }
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'shipping'>('details');
  const [addedToast, setAddedToast] = useState(false);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
    if (onInstantCheckout) onInstantCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-stone-100 rounded-full text-stone-700 transition-colors shadow-xs"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Column (Left) */}
        <div className="md:w-1/2 p-6 bg-stone-50 flex flex-col items-center justify-center">
          <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden bg-stone-100 border border-stone-200/60 shadow-xs">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-stone-200 text-stone-500">
                <Sparkles className="w-10 h-10 text-stone-400 mb-2" />
                <span className="font-display text-lg text-stone-700">{product.name}</span>
              </div>
            )}

            {product.badge && (
              <span className="absolute top-3 left-3 text-[11px] uppercase tracking-wider font-medium text-stone-900 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 border border-stone-200">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails if multiple images exist */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto max-w-sm">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-18 shrink-0 overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === img ? 'border-stone-900 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Contiguous Purchase Module (Right) */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Category quiet kicker */}
            <div className="text-xs uppercase tracking-widest text-stone-500 font-medium mb-1.5">
              {product.category} · Maison Omayma
            </div>

            {/* Title */}
            <h2 className="font-display text-2xl sm:text-3xl font-normal text-stone-900 mb-2">
              {isAr ? product.nameAr : product.name}
            </h2>

            {/* Price display with tabular nums */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-semibold text-stone-900 font-mono tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-stone-400 line-through font-mono tabular-nums">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {isOutOfStock ? (
                <span className="text-xs text-rose-600 font-medium ml-2">
                  {isAr ? 'نفد من المخزون' : 'Out of Stock'}
                </span>
              ) : (
                <span className="text-xs text-emerald-700 font-medium ml-2">
                  {isAr ? `متوفر في المخزون (${product.stock} قطعة)` : `In Stock (${product.stock} available)`}
                </span>
              )}
            </div>

            {/* Color Variant Selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium text-stone-800">
                  {isAr ? 'اللون المحدد:' : 'Selected Color:'}
                </span>
                <span className="text-stone-500 font-medium">
                  {isAr ? selectedColor.nameAr : selectedColor.name}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(c)}
                    className={`w-7 h-7 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                      selectedColor.name === c.name
                        ? 'ring-2 ring-stone-900 ring-offset-2'
                        : 'border-stone-300 hover:border-stone-500'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={isAr ? c.nameAr : c.name}
                  >
                    {selectedColor.name === c.name && (
                      <span className="block w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Variant Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium text-stone-800">
                  {isAr ? 'المقاس:' : 'Size:'}
                </span>
                {onOpenSizeGuide && (
                  <button
                    onClick={onOpenSizeGuide}
                    className="text-stone-500 underline hover:text-stone-900 cursor-pointer text-xs"
                  >
                    {isAr ? 'دليل المقاسات' : 'Size Guide'}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 px-3 text-xs font-medium border transition-colors cursor-pointer ${
                      selectedSize === s
                        ? 'border-stone-900 bg-stone-900 text-white shadow-2xs'
                        : 'border-stone-200 text-stone-700 bg-white hover:border-stone-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Actions */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-stone-300 bg-stone-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-2 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-mono font-semibold text-stone-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="px-3 py-2 text-stone-600 hover:text-stone-900 disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-3 px-4 bg-stone-900 text-white text-xs font-medium uppercase tracking-wider hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors cursor-pointer text-center"
              >
                {addedToast ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    {isAr ? 'تمت الإضافة للسلة!' : 'Added to Bag!'}
                  </span>
                ) : (
                  <span>{isAr ? 'إضافة إلى حقيبة التسوق' : 'Add to Shopping Bag'}</span>
                )}
              </button>

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 border border-stone-200 hover:border-stone-400 transition-colors cursor-pointer ${
                  inWishlist ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-stone-600'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            {/* Instant Buy Now Button */}
            {!isOutOfStock && (
              <button
                onClick={handleBuyNow}
                className="w-full mb-6 py-2.5 px-4 bg-stone-100 text-stone-900 text-xs font-semibold uppercase tracking-wider hover:bg-stone-200 border border-stone-300 transition-colors cursor-pointer"
              >
                {isAr ? 'شراء فوري مباشر (الدفع عند الاستلام)' : 'Instant Checkout (Cash on Delivery / Card)'}
              </button>
            )}

            {/* Tabs for Details / Fabric & Care / Shipping */}
            <div className="border-t border-stone-200 pt-4">
              <div className="flex border-b border-stone-200 gap-6 text-xs font-medium text-stone-500 mb-3">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 border-b-2 cursor-pointer transition-colors ${
                    activeTab === 'details' ? 'border-stone-900 text-stone-900' : 'border-transparent hover:text-stone-800'
                  }`}
                >
                  {isAr ? 'الوصف والتصميم' : 'Description'}
                </button>
                <button
                  onClick={() => setActiveTab('fabric')}
                  className={`pb-2 border-b-2 cursor-pointer transition-colors ${
                    activeTab === 'fabric' ? 'border-stone-900 text-stone-900' : 'border-transparent hover:text-stone-800'
                  }`}
                >
                  {isAr ? 'القماش والعناية' : 'Fabric & Care'}
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-2 border-b-2 cursor-pointer transition-colors ${
                    activeTab === 'shipping' ? 'border-stone-900 text-stone-900' : 'border-transparent hover:text-stone-800'
                  }`}
                >
                  {isAr ? 'التوصيل والاستبدال' : 'Delivery & Return'}
                </button>
              </div>

              <div className="text-xs text-stone-600 leading-relaxed min-h-[70px]">
                {activeTab === 'details' && (
                  <p>{isAr ? product.descriptionAr : product.description}</p>
                )}
                {activeTab === 'fabric' && (
                  <div className="space-y-1.5">
                    <p>
                      <strong>{isAr ? 'نوع القماش: ' : 'Fabric: '}</strong>
                      {isAr ? product.fabricAr || product.fabric : product.fabric || 'Premium Couture Blend'}
                    </p>
                    <p>
                      <strong>{isAr ? 'تعليمات الغسيل: ' : 'Care Instructions: '}</strong>
                      {isAr ? product.careAr || product.care : product.care || 'Dry clean recommended'}
                    </p>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-stone-700">
                      <Truck className="w-3.5 h-3.5 text-stone-500" />
                      <span>{isAr ? 'توصيل سريع خلال 2-4 أيام عمل' : 'Fast delivery in 2-4 business days'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-700">
                      <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                      <span>{isAr ? 'استرجاع واستبدال مجاني خلال 7 أيام' : 'Complimentary returns & exchanges within 7 days'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-700">
                      <Shield className="w-3.5 h-3.5 text-stone-500" />
                      <span>{isAr ? 'جودة وتفصيل مضمون 100%' : '100% Authentic quality guaranteed'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
