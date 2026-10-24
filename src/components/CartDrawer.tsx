import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartTotal,
    formatPrice,
    language,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isCartOpen) return null;

  const isAr = language === 'ar';
  const freeShippingThreshold = 150;
  const progressPercent = Math.min(100, Math.round((cartTotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  const discount = appliedPromo === 'OMAYMA10' ? cartTotal * 0.1 : 0;
  const shipping = cartTotal >= freeShippingThreshold || cartTotal === 0 ? 0 : 15;
  const finalTotal = Math.max(0, cartTotal - discount + shipping);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === 'OMAYMA10') {
      setAppliedPromo('OMAYMA10');
      setPromoError('');
    } else {
      setPromoError(isAr ? 'رمز قسيمة غير صالح' : 'Invalid coupon code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-stone-900" />
            <h2 className="font-display text-xl font-semibold text-stone-900">
              {isAr ? 'حقيبة التسوق' : 'Shopping Bag'}
            </h2>
            <span className="text-xs text-stone-500 font-mono tabular-nums">
              ({cart.length})
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-stone-50 px-5 py-3 border-b border-stone-200">
          <div className="flex justify-between text-xs text-stone-600 mb-1.5">
            {remainingForFreeShipping > 0 ? (
              <span>
                {isAr
                  ? `أضيفي ${formatPrice(remainingForFreeShipping)} للشحن المجاني`
                  : `Add ${formatPrice(remainingForFreeShipping)} for Complimentary Shipping`}
              </span>
            ) : (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {isAr ? 'مبارك! حصلتِ على توصيل مجاني' : 'You have earned Complimentary Shipping!'}
              </span>
            )}
            <span className="font-mono text-stone-500">{progressPercent}%</span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-stone-900 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Itemized List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-stone-500">
              <ShoppingBag className="w-12 h-12 text-stone-300 mb-3 stroke-1" />
              <p className="font-display text-lg text-stone-700 mb-1">
                {isAr ? 'حقيبتك فارغة حالياً' : 'Your shopping bag is empty'}
              </p>
              <p className="text-xs text-stone-400 mb-4 max-w-xs">
                {isAr
                  ? 'تصفحي مجموعاتنا الراقية من العبايات والفساتين وأضيفي ما يعجبك.'
                  : 'Discover our curated selection of couture abayas, evening gowns, and everyday sets.'}
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 bg-stone-900 text-white text-xs font-medium uppercase tracking-wider hover:bg-stone-800 transition-colors"
              >
                {isAr ? 'ابدأي التسوق الآن' : 'Start Shopping'}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 pb-4 border-b border-stone-100 items-start"
              >
                {/* Thumbnail */}
                <div className="w-20 h-26 bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between h-26">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                        {isAr ? item.product.nameAr : item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Variant tags */}
                    <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-2">
                      <span>{isAr ? `المقاس: ${item.selectedSize}` : `Size: ${item.selectedSize}`}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full inline-block border border-stone-300"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        {isAr ? item.selectedColor.nameAr : item.selectedColor.name}
                      </span>
                    </div>
                  </div>

                  {/* Price & Stepper */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-stone-200 bg-stone-50 rounded-xs">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-950"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-mono font-medium tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:text-stone-950"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-semibold text-stone-900 font-mono tabular-nums">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Subtotal & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50/50 space-y-3">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder={isAr ? 'رمز الكوبون (مثال: OMAYMA10)' : 'Promo Code (try: OMAYMA10)'}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-none focus:outline-none focus:border-stone-900 uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 bg-stone-200 text-stone-800 text-xs font-medium hover:bg-stone-300 transition-colors cursor-pointer"
              >
                {isAr ? 'تطبيق' : 'Apply'}
              </button>
            </form>

            {appliedPromo && (
              <div className="text-[11px] text-emerald-700 flex items-center justify-between">
                <span>{isAr ? 'تم تطبيق خصم الكوبون (10%)' : 'Coupon discount applied (10%)'}</span>
                <span className="font-mono">-{formatPrice(discount)}</span>
              </div>
            )}
            {promoError && <p className="text-[11px] text-rose-600">{promoError}</p>}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
              <div className="flex justify-between">
                <span>{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                <span className="font-mono tabular-nums">{formatPrice(cartTotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>{isAr ? 'الخصم الترويجي:' : 'Discount:'}</span>
                  <span className="font-mono tabular-nums">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{isAr ? 'رسوم التوصيل:' : 'Shipping:'}</span>
                <span className="font-mono tabular-nums">
                  {shipping === 0 ? (isAr ? 'مجاني' : 'Complimentary') : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-stone-900 pt-2 border-t border-stone-200">
                <span>{isAr ? 'المجموع الإجمالي:' : 'Total:'}</span>
                <span className="font-mono tabular-nums text-base">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                onCheckout();
              }}
              className="w-full py-3.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>{isAr ? 'متابعة الدفع وإنهاء الطلب' : 'Proceed to Checkout'}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
