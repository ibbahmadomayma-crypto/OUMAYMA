import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Truck, CreditCard, Banknote, CheckCircle2, Printer, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

interface CheckoutPageProps {
  onBackToShop: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBackToShop }) => {
  const { cart, cartTotal, formatPrice, language, placeOrder } = useStore();
  const isAr = language === 'ar';

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Algeria');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [notes, setNotes] = useState('');

  // Card details if selected
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const freeShippingThreshold = 150;
  const shipping = cartTotal >= freeShippingThreshold || cartTotal === 0 ? 0 : 15;
  const grandTotal = cartTotal + shipping;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder({
        customerName,
        email,
        phone,
        country,
        city,
        address: `${address} (Postal Code: ${postalCode})`,
        paymentMethod,
        items: cart,
        notes,
      });

      setConfirmedOrder(order);
      setIsSubmitting(false);
    }, 800);
  };

  // If order was successfully confirmed, show receipt state
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white border border-stone-200 p-8 sm:p-12 shadow-sm text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs uppercase tracking-widest text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 border border-emerald-200">
            {isAr ? 'تم تأكيد طلبكِ بنجاح' : 'Order Confirmed'}
          </span>

          <h1 className="font-display text-3xl sm:text-4xl text-stone-900 mt-4 mb-2">
            {isAr ? 'شكراً لثقتكِ بدار أميمة' : 'Thank you for your order'}
          </h1>

          <p className="text-xs text-stone-500 max-w-md mx-auto mb-8">
            {isAr
              ? `تم تسجيل طلبكِ برقم (${confirmedOrder.id}) وسيقوم فريق الخياطة والتجهيز بتجهيزه وشحنه فوراً.`
              : `Your order #${confirmedOrder.id} is confirmed. A receipt and tracking summary will be dispatched to ${confirmedOrder.email}.`}
          </p>

          {/* Receipt Breakdown Box */}
          <div className="text-left bg-stone-50 border border-stone-200 p-6 mb-8 text-xs space-y-3">
            <div className="flex justify-between pb-3 border-b border-stone-200">
              <span className="font-semibold text-stone-900">{isAr ? 'رقم الطلب:' : 'Order Number:'}</span>
              <span className="font-mono font-medium text-stone-900">{confirmedOrder.id}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-600">{isAr ? 'اسم العميلة:' : 'Recipient:'}</span>
              <span className="text-stone-900 font-medium">{confirmedOrder.customerName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-600">{isAr ? 'رقم الهاتف للتوصيل:' : 'Delivery Phone:'}</span>
              <span className="text-stone-900 font-mono">{confirmedOrder.phone}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-600">{isAr ? 'عنوان التوصيل:' : 'Delivery Address:'}</span>
              <span className="text-stone-900 text-right">{confirmedOrder.address}, {confirmedOrder.city}, {confirmedOrder.country}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-stone-600">{isAr ? 'طريقة الدفع:' : 'Payment Method:'}</span>
              <span className="text-stone-900 font-medium">
                {confirmedOrder.paymentMethod === 'cod'
                  ? (isAr ? 'الدفع نقداً عند الاستلام (COD)' : 'Cash on Delivery')
                  : (isAr ? 'بطاقة بنكية' : 'Credit Card')}
              </span>
            </div>

            <div className="pt-3 border-t border-stone-200 space-y-2">
              <span className="font-semibold text-stone-900 block">{isAr ? 'القطع المطلوبة:' : 'Ordered Items:'}</span>
              {confirmedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-stone-600">
                  <span>
                    {isAr ? item.product.nameAr : item.product.name} ({item.selectedSize}) × {item.quantity}
                  </span>
                  <span className="font-mono">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between font-semibold text-stone-900 text-sm">
              <span>{isAr ? 'المجموع المستحق للدفع:' : 'Total Amount Due:'}</span>
              <span className="font-mono text-base">{formatPrice(confirmedOrder.total)}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.print()}
              className="py-2.5 px-5 border border-stone-300 text-stone-700 text-xs font-medium hover:bg-stone-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isAr ? 'طباعة الفاتورة' : 'Print Receipt'}</span>
            </button>
            <button
              onClick={onBackToShop}
              className="py-2.5 px-6 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 cursor-pointer"
            >
              {isAr ? 'العودة لمتابعة التسوق' : 'Continue Shopping'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Normal Checkout form
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <button
          onClick={onBackToShop}
          className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 mb-2 cursor-pointer"
        >
          {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
          <span>{isAr ? 'الرجوع إلى المتجر' : 'Return to Catalog'}</span>
        </button>
        <h1 className="font-display text-3xl font-normal text-stone-900">
          {isAr ? 'إنهاء الطلب وتأكيد الشحن' : 'Secure Checkout'}
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          {isAr
            ? 'يرجى إدخال معلومات التوصيل واختيار طريقة الدفع المفضلة لديكِ'
            : 'Enter delivery address and select payment preference'}
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="p-12 text-center bg-white border border-stone-200">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-display text-xl text-stone-800 mb-2">
            {isAr ? 'حقيبة التسوق فارغة' : 'Your cart is empty'}
          </h3>
          <button
            onClick={onBackToShop}
            className="py-2.5 px-5 bg-stone-900 text-white text-xs uppercase tracking-wider font-medium hover:bg-stone-800"
          >
            {isAr ? 'تصفح التشكيلات' : 'Explore Collections'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Customer & Delivery Information (Left 7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 border border-stone-200 space-y-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900 pb-2 border-b border-stone-100">
                1. {isAr ? 'معلومات المستلمة والتواصل' : 'Contact Information'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isAr ? 'الاسم واللقب بالكامل *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isAr ? 'مثال: أمينة المنصوري' : 'e.g. Jane Doe'}
                    className="w-full text-xs p-2.5 border border-stone-300 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs p-2.5 border border-stone-300 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isAr ? 'رقم الهاتف للتوصيل (هام لمندوب الشحن) *' : 'Phone Number (For Courier) *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+213 550 00 00 00"
                    className="w-full text-xs p-2.5 border border-stone-300 focus:outline-none focus:border-stone-900 font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900 pb-2 border-b border-stone-100">
                2. {isAr ? 'عنوان التوصيل والإقامة' : 'Shipping Address'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isAr ? 'الدولة *' : 'Country *'}
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 focus:outline-none focus:border-stone-900 bg-white"
                  >
                    <option value="Algeria">Algeria (الجزائر)</option>
                    <option value="Morocco">Morocco (المغرب)</option>
                    <option value="Tunisia">Tunisia (تونس)</option>
                    <option value="Saudi Arabia">Saudi Arabia (السعودية)</option>
                    <option value="United Arab Emirates">UAE (الإمارات)</option>
                    <option value="France">France</option>
                    <option value="United States">United States</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isAr ? 'المدينة أو الولاية *' : 'City / Province *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={isAr ? 'الجزائر العاصمة / وهران / الدار البيضاء...' : 'Algiers / Casablanca / Paris'}
                    className="w-full text-xs p-2.5 border border-stone-300 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isAr ? 'العنوان التفصيلي (الشارع، رقم العمارة أو المنزل) *' : 'Street Address *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={isAr ? 'اسم الشارع، رقم الشقة أو البناية' : 'Apartment, suite, unit, building, floor'}
                    className="w-full text-xs p-2.5 border border-stone-300 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isAr ? 'الرمز البريدي' : 'Postal / ZIP Code'}
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="16000"
                    className="w-full text-xs p-2.5 border border-stone-300 focus:outline-none focus:border-stone-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isAr ? 'ملاحظات إضافية للتوصيل' : 'Order Notes (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={isAr ? 'مثال: التوصيل بعد العصر' : 'Special instructions'}
                    className="w-full text-xs p-2.5 border border-stone-300 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section adhering to COD guidelines */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900 pb-2 border-b border-stone-100">
                3. {isAr ? 'طريقة الدفع' : 'Payment Method'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <Banknote className="w-5 h-5 text-stone-900" />
                    <span className="text-xs font-semibold text-stone-900">
                      {isAr ? 'الدفع نقداً عند الاستلام' : 'Cash on Delivery (COD)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-normal">
                    {isAr
                      ? 'ادفعي للمندوب نقداً بعد استلام الطرد ومعاينته بالكامل بكل أمان.'
                      : 'Pay in cash directly to the delivery courier upon doorstep receipt.'}
                  </p>
                </div>

                {/* Card Payment */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <CreditCard className="w-5 h-5 text-stone-900" />
                    <span className="text-xs font-semibold text-stone-900">
                      {isAr ? 'بطاقة بنكية / فيزا أو ماستركارد' : 'Credit / Debit Card'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-normal">
                    {isAr
                      ? 'دفع مشفر وآمن ببطاقات Visa و Mastercard و CIB.'
                      : 'Encrypted online transaction with Visa, Mastercard, or CIB.'}
                  </p>
                </div>
              </div>

              {/* Card Inputs if selected */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-stone-50 border border-stone-200 mt-3 space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">
                      {isAr ? 'رقم البطاقة' : 'Card Number'}
                    </label>
                    <input
                      type="text"
                      required={paymentMethod === 'card'}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full text-xs p-2 bg-white border border-stone-300 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        {isAr ? 'تاريخ الانتهاء' : 'Expiry (MM/YY)'}
                      </label>
                      <input
                        type="text"
                        required={paymentMethod === 'card'}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full text-xs p-2 bg-white border border-stone-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-700 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        required={paymentMethod === 'card'}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        className="w-full text-xs p-2 bg-white border border-stone-300 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Column (Right 5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-stone-200 sticky top-28 space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900 pb-2 border-b border-stone-100">
              {isAr ? 'ملخص الحقيبة والطلب' : 'Order Summary'}
            </h2>

            <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                  <div className="w-14 h-18 bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                      {isAr ? item.product.nameAr : item.product.name}
                    </h4>
                    <span className="text-[11px] text-stone-500 block">
                      {item.selectedSize} · {isAr ? item.selectedColor.nameAr : item.selectedColor.name} · Qty: {item.quantity}
                    </span>
                    <span className="text-xs font-semibold text-stone-900 font-mono tabular-nums">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-4 border-t border-stone-200 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>{isAr ? 'المجموع الفرعي للمنتجات:' : 'Subtotal:'}</span>
                <span className="font-mono tabular-nums">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{isAr ? 'تكلفة الشحن والتوصيل:' : 'Estimated Shipping:'}</span>
                <span className="font-mono tabular-nums">
                  {shipping === 0 ? (isAr ? 'شحن مجاني' : 'Complimentary') : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-stone-900 pt-3 border-t border-stone-200">
                <span>{isAr ? 'المجموع الكلي المطلوب:' : 'Grand Total:'}</span>
                <span className="font-mono tabular-nums">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-stone-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 disabled:opacity-50 transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>{isAr ? 'جاري تأكيد الطلب...' : 'Securing your order...'}</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    {paymentMethod === 'cod'
                      ? (isAr ? 'تأكيد الطلب والدفع عند الاستلام' : 'Confirm Order & Pay on Delivery')
                      : (isAr ? 'إتمام الدفع الآمن' : 'Place Order Securely')}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
