import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    products,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
    formatPrice,
    language,
    openProductModal,
  } = useStore();

  if (!isWishlistOpen) return null;

  const isAr = language === 'ar';
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <h2 className="font-display text-xl font-semibold text-stone-900">
              {isAr ? 'قائمة الأمنيات والمفضلة' : 'Saved Favorites'}
            </h2>
            <span className="text-xs text-stone-500 font-mono tabular-nums">
              ({wishlistProducts.length})
            </span>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-stone-500">
              <Heart className="w-12 h-12 text-stone-300 mb-3 stroke-1" />
              <p className="font-display text-lg text-stone-700 mb-1">
                {isAr ? 'لم تحفظي أي قطعة بعد' : 'No favorites saved yet'}
              </p>
              <p className="text-xs text-stone-400 max-w-xs">
                {isAr
                  ? 'انقري على أيقونة القلب على أي فستان أو عباية لحفظها هنا والعودة إليها لاحقاً.'
                  : 'Click the heart icon on any design to bookmark it for later review.'}
              </p>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-3.5 pb-4 border-b border-stone-100 items-start"
              >
                <div
                  className="w-20 h-26 bg-stone-100 overflow-hidden shrink-0 border border-stone-200 cursor-pointer"
                  onClick={() => {
                    setIsWishlistOpen(false);
                    openProductModal(product);
                  }}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between h-26">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4
                        onClick={() => {
                          setIsWishlistOpen(false);
                          openProductModal(product);
                        }}
                        className="text-xs font-semibold text-stone-900 line-clamp-1 cursor-pointer hover:text-stone-600"
                      >
                        {isAr ? product.nameAr : product.name}
                      </h4>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-xs font-semibold text-stone-900 font-mono tabular-nums mt-1 block">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(product);
                      toggleWishlist(product.id);
                    }}
                    className="py-1.5 px-3 bg-stone-900 text-white text-[11px] font-medium uppercase tracking-wider hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isAr ? 'نقل إلى السلة' : 'Move to Bag'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
