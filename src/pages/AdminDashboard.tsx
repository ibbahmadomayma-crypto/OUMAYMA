import React, { useState } from 'react';
import {
  Sparkles,
  PlusCircle,
  Trash2,
  Edit3,
  EyeOff,
  Eye,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Save,
  RotateCcw,
  Image as ImageIcon,
  KeyRound,
  ShieldCheck,
  ShoppingBag,
  Clock,
  ArrowRight,
  ArrowLeft,
  X,
  Search,
  Minus,
  Plus,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Product, ProductColor, CategoryType, OrderStatus } from '../types';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const {
    products,
    orders,
    language,
    formatPrice,
    updateProduct,
    addProduct,
    removeProduct,
    adjustStock,
    setStockExact,
    toggleProductStatus,
    updateOrderStatus,
    resetToInitialCatalog,
  } = useStore();

  const { user, logout, updatePassword } = useAuth();
  const isAr = language === 'ar';

  // Navigation tab for the 3 controls requested by the owner:
  // a. "كيفاش نحسن" (Enhance & Update)
  // b. "نزييد" (Add Product)
  // c. "نقص" (Remove / Reduce Stock & Hide)
  // + Orders & Settings
  const [activeTab, setActiveTab] = useState<'update' | 'add' | 'reduce' | 'orders' | 'settings'>('update');

  // Notification toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ==========================================
  // a. "كيفاش نحسن" (Enhance & Update) States
  // ==========================================
  const [selectedProductIdToEdit, setSelectedProductIdToEdit] = useState<string>(products[0]?.id || '');
  const productToEdit = products.find((p) => p.id === selectedProductIdToEdit) || products[0];

  const [editForm, setEditForm] = useState<Partial<Product>>({});

  // Sync edit form when productToEdit changes
  React.useEffect(() => {
    if (productToEdit) {
      setEditForm({
        name: productToEdit.name,
        nameAr: productToEdit.nameAr,
        category: productToEdit.category,
        price: productToEdit.price,
        originalPrice: productToEdit.originalPrice || undefined,
        stock: productToEdit.stock,
        badge: productToEdit.badge,
        images: [...productToEdit.images],
        description: productToEdit.description,
        descriptionAr: productToEdit.descriptionAr,
        fabric: productToEdit.fabric,
        fabricAr: productToEdit.fabricAr,
      });
    }
  }, [productToEdit?.id]);

  const handleSaveProductUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productToEdit) return;

    updateProduct(productToEdit.id, editForm);
    showToast(isAr ? 'تم تحديث بيانات المنتج بنجاح! ("كيفاش نحسن")' : 'Product successfully enhanced & updated!');
  };

  // Preset image gallery for quick swapping
  const PRESET_GALLERY = [
    { label: 'Royal Gold Abaya', url: '/src/assets/images/product_luxury_abaya_1792873602148.jpg' },
    { label: 'Emerald Satin Dress', url: '/src/assets/images/product_emerald_dress_1792873602067.jpg' },
    { label: 'Beige Linen Set', url: '/src/assets/images/product_linen_casual_set_1792873602830.jpg' },
    { label: 'Gold Jewelry & Scarf', url: '/src/assets/images/product_gold_accessories_1792873603176.jpg' },
    { label: 'Editorial Runway Duo', url: '/src/assets/images/hero_womens_fashion_banner_1792873601726.jpg' },
  ];

  // ==========================================
  // b. "نزييد" (Add New Product) States
  // ==========================================
  const [newName, setNewName] = useState('');
  const [newNameAr, setNewNameAr] = useState('');
  const [newCategory, setNewCategory] = useState<'dresses' | 'abayas' | 'casual' | 'accessories'>('abayas');
  const [newPrice, setNewPrice] = useState<number>(165);
  const [newOriginalPrice, setNewOriginalPrice] = useState<number>(195);
  const [newStock, setNewStock] = useState<number>(15);
  const [newImageUrl, setNewImageUrl] = useState('/src/assets/images/product_luxury_abaya_1792873602148.jpg');
  const [newBadge, setNewBadge] = useState<'New' | 'Bestseller' | 'Exclusive' | 'Sale' | undefined>('New');
  const [newDescription, setNewDescription] = useState('Exquisite tailored luxury women\'s garment crafted with premium stitching.');
  const [newDescriptionAr, setNewDescriptionAr] = useState('قطعة نسائية فاخرة بتفصيل دقيق وقماش عالي الجودة.');
  const [newFabric, setNewFabric] = useState('100% Pure Mulberry Silk');
  const [newFabricAr, setNewFabricAr] = useState('حرير طبيعي 100%');
  const [newSizes, setNewSizes] = useState<string[]>(['S (52)', 'M (54)', 'L (56)']);
  const [newColorName, setNewColorName] = useState('Classic Black');
  const [newColorNameAr, setNewColorNameAr] = useState('أسود كلاسيكي');
  const [newColorHex, setNewColorHex] = useState('#1c1917');

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newNameAr.trim()) return;

    const added = addProduct({
      name: newName,
      nameAr: newNameAr,
      category: newCategory,
      price: Number(newPrice),
      originalPrice: newOriginalPrice ? Number(newOriginalPrice) : undefined,
      stock: Number(newStock),
      status: Number(newStock) > 0 ? 'active' : 'out_of_stock',
      images: [newImageUrl.trim() || PRESET_GALLERY[0].url],
      sizes: newSizes.length > 0 ? newSizes : ['Free Size'],
      colors: [
        { name: newColorName, nameAr: newColorNameAr, hex: newColorHex },
      ],
      badge: newBadge,
      description: newDescription,
      descriptionAr: newDescriptionAr,
      fabric: newFabric,
      fabricAr: newFabricAr,
      care: 'Dry clean only',
      careAr: 'تنظيف جاف فقط',
    });

    showToast(isAr ? `تمت إضافة ونشر "${added.nameAr}" في المتجر بنجاح!` : `New product "${added.name}" published!`);

    // Reset form
    setNewName('');
    setNewNameAr('');
    setSelectedProductIdToEdit(added.id);
    setActiveTab('update'); // redirect to view the updated item
  };

  // ==========================================
  // c. "نقص" (Remove / Reduce Stock & Hide) States
  // ==========================================
  const [reduceSearchQuery, setReduceSearchQuery] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const filteredReduceProducts = products.filter((p) => {
    if (!reduceSearchQuery.trim()) return true;
    const q = reduceSearchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.nameAr.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  // Settings & Security state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    const res = updatePassword(oldPassword, newPassword);
    if (res.success) {
      setPasswordMsg({ text: isAr ? 'تم تغيير كلمة المرور بنجاح!' : 'Password updated successfully!', isError: false });
      setOldPassword('');
      setNewPassword('');
    } else {
      setPasswordMsg({ text: res.error || 'Failed', isError: true });
    }
  };

  // Inventory Metrics calculation
  const totalStockCount = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValuation = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const outOfStockCount = products.filter((p) => p.stock <= 0 || p.status === 'out_of_stock').length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  return (
    <div className="min-h-screen bg-stone-100/70 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-none shadow-xl border border-stone-700 flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 border border-stone-200 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-semibold text-base text-stone-900">
                {isAr ? 'تأكيد حذف المنتج ("نقص")' : 'Confirm Product Deletion'}
              </h3>
            </div>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              {isAr
                ? `هل أنت متأكدة من حذف "${productToDelete.nameAr}" نهائياً من المتجر؟ لا يمكن التراجع عن هذه الخطوة.`
                : `Are you sure you want to permanently delete "${productToDelete.name}"? This action cannot be undone.`}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  removeProduct(productToDelete.id);
                  showToast(isAr ? 'تم حذف المنتج من المتجر بنجاح' : 'Product permanently deleted');
                  setProductToDelete(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700"
              >
                {isAr ? 'نعم، حذف نهائي' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-stone-900 text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-stone-800 border border-stone-700">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-medium tracking-wide">
                  {isAr ? 'لوحة تحكم صاحبة المتجر — أميمة' : "Omayma's Owner Control Hub"}
                </h1>
                <span className="text-[10px] uppercase tracking-widest bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5">
                  Verified Owner
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {user?.email || 'ibbahmadomayma@gmail.com'} · {isAr ? 'تحكم كامل بالمنتجات والمخزون' : 'Direct Store & Inventory Authority'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
            >
              {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{isAr ? 'معاينة المتجر كزبونة' : 'View Live Store'}</span>
            </button>
            <button
              onClick={logout}
              className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium transition-colors border border-rose-900/60"
            >
              {isAr ? 'خروج' : 'Logout'}
            </button>
          </div>
        </div>

        {/* 3 Prominent Arabic Control Tabs specifically requested */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto border-t border-stone-800">
          <button
            onClick={() => setActiveTab('update')}
            className={`py-3.5 px-5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'update'
                ? 'border-white text-white bg-stone-800/60'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/30'
            }`}
          >
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span>{isAr ? '«كيفاش نحسن» (تحديث وتعديل)' : '1. "كيفاش نحسن" (Enhance & Update)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`py-3.5 px-5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'add'
                ? 'border-white text-white bg-stone-800/60'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/30'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? '«نزييد» (إضافة منتج جديد)' : '2. "نزييد" (Add Product)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('reduce')}
            className={`py-3.5 px-5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'reduce'
                ? 'border-white text-white bg-stone-800/60'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/30'
            }`}
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>{isAr ? '«نقص» (إنقاص المخزون وحذف)' : '3. "نقص" (Remove / Reduce)'}</span>
            {lowStockCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-mono">
                {lowStockCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'border-white text-white bg-stone-800/60'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/30'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-sky-400" />
            <span>{isAr ? 'الطلبات والمبيعات' : 'Orders'}</span>
            <span className="font-mono text-[10px] bg-stone-700 text-stone-200 px-1.5 py-0.2">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 px-5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'border-white text-white bg-stone-800/60'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/30'
            }`}
          >
            <KeyRound className="w-4 h-4 text-stone-400" />
            <span>{isAr ? 'الأمان والإعدادات' : 'Security'}</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 border border-stone-200 shadow-2xs">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider block">
              {isAr ? 'إجمالي المنتجات' : 'Total Products'}
            </span>
            <span className="text-2xl font-bold font-mono text-stone-900 mt-1 block">
              {products.length}
            </span>
            <span className="text-[11px] text-stone-400">
              {products.filter((p) => p.status === 'active').length} {isAr ? 'نشط في المتجر' : 'Active in store'}
            </span>
          </div>

          <div className="bg-white p-4 border border-stone-200 shadow-2xs">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider block">
              {isAr ? 'مجموع القطع في المخزن' : 'Stock Quantity'}
            </span>
            <span className="text-2xl font-bold font-mono text-stone-900 mt-1 block">
              {totalStockCount}
            </span>
            <span className="text-[11px] text-stone-400">
              {isAr ? 'قطعة جاهزة للشحن' : 'Pieces ready to ship'}
            </span>
          </div>

          <div className="bg-white p-4 border border-stone-200 shadow-2xs">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider block">
              {isAr ? 'تنبيهات نفاد المخزون' : 'Stock Alerts'}
            </span>
            <span className="text-2xl font-bold font-mono text-amber-700 mt-1 block">
              {lowStockCount + outOfStockCount}
            </span>
            <span className="text-[11px] text-stone-400">
              {outOfStockCount} {isAr ? 'نفد تماماً' : 'sold out'}, {lowStockCount} {isAr ? 'مخزون حرج' : 'low'}
            </span>
          </div>

          <div className="bg-white p-4 border border-stone-200 shadow-2xs">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider block">
              {isAr ? 'قيمة المخزون الإجمالية' : 'Inventory Value'}
            </span>
            <span className="text-2xl font-bold font-mono text-stone-900 mt-1 block">
              {formatPrice(totalValuation)}
            </span>
            <span className="text-[11px] text-stone-400">
              {orders.length} {isAr ? 'طلب مسجل' : 'customer orders'}
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: "كيفاش نحسن" (Enhance & Update Product Details)  */}
        {/* ======================================================== */}
        {activeTab === 'update' && (
          <div className="space-y-8">
            <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 border border-amber-200">
                      {isAr ? 'التحكم الأول: كيفاش نحسن' : 'Control 1: Enhance & Update'}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-stone-900 mt-2">
                    {isAr ? 'تحديث وتطوير تفاصيل وأسعار وصور المنتجات' : 'Product & Pricing Management Studio'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    {isAr
                      ? 'اختاري أي قطعة من المخزون لتعديل سعرها، تغيير صورتها، تحديث كمياتها، أو تحسين وصفها فوراً.'
                      : 'Select any product to adjust its retail price, change high-res images, and update live stock count.'}
                  </p>
                </div>

                {/* Product Selector Dropdown */}
                <div className="w-full sm:w-72">
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isAr ? 'اختاري القطعة للتعديل:' : 'Select Product to Edit:'}
                  </label>
                  <select
                    value={selectedProductIdToEdit}
                    onChange={(e) => setSelectedProductIdToEdit(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 bg-white font-medium text-stone-900 focus:outline-none focus:border-stone-900"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {isAr ? p.nameAr : p.name} ({formatPrice(p.price)} · Stock: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {productToEdit ? (
                <form onSubmit={handleSaveProductUpdate} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
                  {/* Left Column: Image Swap & Live Preview */}
                  <div className="lg:col-span-4 space-y-4">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-stone-900">
                      {isAr ? 'صورة المنتج الحالية' : 'Current Visual Stage'}
                    </span>

                    <div className="relative aspect-[3/4] bg-stone-100 border border-stone-200 overflow-hidden">
                      <img
                        src={editForm.images?.[0] || productToEdit.images[0]}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {editForm.badge && (
                        <span className="absolute top-3 left-3 text-[11px] uppercase tracking-wider bg-white/95 px-2 py-0.5 border border-stone-200 text-stone-900 font-medium">
                          {editForm.badge}
                        </span>
                      )}
                    </div>

                    {/* Image URL Input */}
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        {isAr ? 'رابط الصورة المباشر (Image URL):' : 'Product Image URL:'}
                      </label>
                      <input
                        type="text"
                        value={editForm.images?.[0] || ''}
                        onChange={(e) => setEditForm({ ...editForm, images: [e.target.value] })}
                        className="w-full text-xs p-2 border border-stone-300 font-mono"
                      />
                    </div>

                    {/* Quick Preset Image Swapper */}
                    <div>
                      <span className="block text-[11px] font-medium text-stone-600 mb-1.5">
                        {isAr ? 'أو اختاري صورة احترافية من مكتبة المتجر:' : 'Or pick from curated studio presets:'}
                      </span>
                      <div className="grid grid-cols-5 gap-1.5">
                        {PRESET_GALLERY.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditForm({ ...editForm, images: [preset.url] })}
                            className={`aspect-square overflow-hidden border-2 cursor-pointer transition-all ${
                              editForm.images?.[0] === preset.url
                                ? 'border-stone-900 scale-105'
                                : 'border-stone-200 opacity-60 hover:opacity-100'
                            }`}
                            title={preset.label}
                          >
                            <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Pricing, Stock & Detail Controls */}
                  <div className="lg:col-span-8 space-y-5">
                    {/* Titles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          {isAr ? 'اسم المنتج بالعربية *' : 'Product Name (Arabic) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={editForm.nameAr || ''}
                          onChange={(e) => setEditForm({ ...editForm, nameAr: e.target.value })}
                          className="w-full text-xs p-2.5 border border-stone-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          {isAr ? 'اسم المنتج بالإنجليزية *' : 'Product Name (English) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full text-xs p-2.5 border border-stone-300"
                        />
                      </div>
                    </div>

                    {/* Pricing & Stock Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-50 p-4 border border-stone-200">
                      <div>
                        <label className="block text-xs font-medium text-stone-900 mb-1">
                          {isAr ? 'السعر الحالي ($ USD) *' : 'Current Price ($ USD) *'}
                        </label>
                        <div className="relative">
                          <DollarSign className="w-4 h-4 text-stone-500 absolute left-2.5 top-2.5" />
                          <input
                            type="number"
                            required
                            min="1"
                            value={editForm.price || ''}
                            onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                            className="w-full text-xs p-2.5 pl-8 border border-stone-300 font-mono font-bold text-stone-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          {isAr ? 'السعر الأصلي قبل التخفيض ($)' : 'Original / Compare Price ($)'}
                        </label>
                        <div className="relative">
                          <DollarSign className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
                          <input
                            type="number"
                            min="0"
                            value={editForm.originalPrice || ''}
                            onChange={(e) => setEditForm({ ...editForm, originalPrice: Number(e.target.value) })}
                            placeholder="Optional"
                            className="w-full text-xs p-2.5 pl-8 border border-stone-300 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-900 mb-1">
                          {isAr ? 'الكمية في المخزن (Stock) *' : 'Stock Quantity *'}
                        </label>
                        <div className="relative">
                          <Package className="w-4 h-4 text-stone-500 absolute left-2.5 top-2.5" />
                          <input
                            type="number"
                            required
                            min="0"
                            value={editForm.stock ?? ''}
                            onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                            className="w-full text-xs p-2.5 pl-8 border border-stone-300 font-mono font-bold text-stone-900"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Category & Badge */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          {isAr ? 'التصنيف' : 'Category'}
                        </label>
                        <select
                          value={editForm.category || 'abayas'}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                          className="w-full text-xs p-2.5 border border-stone-300 bg-white"
                        >
                          <option value="abayas">{isAr ? 'عبايات راقية' : 'Abayas'}</option>
                          <option value="dresses">{isAr ? 'فساتين سهرة' : 'Dresses'}</option>
                          <option value="casual">{isAr ? 'ملابس وأطقم يومية' : 'Casual Wear'}</option>
                          <option value="accessories">{isAr ? 'إكسسوارات وحلي' : 'Accessories'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          {isAr ? 'الشارة الترويجية (Badge)' : 'Badge Label'}
                        </label>
                        <select
                          value={editForm.badge || ''}
                          onChange={(e) => setEditForm({ ...editForm, badge: (e.target.value || undefined) as any })}
                          className="w-full text-xs p-2.5 border border-stone-300 bg-white"
                        >
                          <option value="">{isAr ? 'بدون شارة' : 'None'}</option>
                          <option value="New">New (وصل حديثاً)</option>
                          <option value="Bestseller">Bestseller (الأكثر طلباً)</option>
                          <option value="Exclusive">Exclusive (تصميم حصري)</option>
                          <option value="Sale">Sale (تخفيض)</option>
                        </select>
                      </div>
                    </div>

                    {/* Descriptions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          {isAr ? 'الوصف بالعربية' : 'Description (Arabic)'}
                        </label>
                        <textarea
                          rows={3}
                          value={editForm.descriptionAr || ''}
                          onChange={(e) => setEditForm({ ...editForm, descriptionAr: e.target.value })}
                          className="w-full text-xs p-2 border border-stone-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          {isAr ? 'الوصف بالإنجليزية' : 'Description (English)'}
                        </label>
                        <textarea
                          rows={3}
                          value={editForm.description || ''}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full text-xs p-2 border border-stone-300"
                        />
                      </div>
                    </div>

                    {/* Fabric & Care */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          {isAr ? 'نوع القماش والتفصيل' : 'Fabric & Material'}
                        </label>
                        <input
                          type="text"
                          value={editForm.fabricAr || editForm.fabric || ''}
                          onChange={(e) => setEditForm({ ...editForm, fabricAr: e.target.value, fabric: e.target.value })}
                          className="w-full text-xs p-2.5 border border-stone-300"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="w-full py-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                        >
                          <Save className="w-4 h-4 text-emerald-400" />
                          <span>{isAr ? 'حفظ ونشر التعديلات فوراً («كيفاش نحسن»)' : 'Save & Publish Enhancements'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : null}
            </div>

            {/* Quick Bulk Price & Stock Adjuster Table */}
            <div className="bg-white p-6 border border-stone-200 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 mb-1">
                {isAr ? 'تعديل الأسعار والمخزون السريع لجميع المنتجات' : 'Quick Mass Price & Inventory Tuner'}
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                {isAr ? 'يمكنكِ تعديل الأسعار والمخزون بضغطة زر دون الدخول لكل منتج على حدة.' : 'Update pricing and inventory across all items in one view.'}
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-stone-200">
                  <thead className="bg-stone-100 text-stone-700">
                    <tr>
                      <th className="p-2.5 border-b border-stone-200">{isAr ? 'المنتج' : 'Product'}</th>
                      <th className="p-2.5 border-b border-stone-200">{isAr ? 'التصنيف' : 'Category'}</th>
                      <th className="p-2.5 border-b border-stone-200">{isAr ? 'السعر الحالي ($)' : 'Price ($)'}</th>
                      <th className="p-2.5 border-b border-stone-200">{isAr ? 'المخزون المتوفر' : 'Stock'}</th>
                      <th className="p-2.5 border-b border-stone-200">{isAr ? 'إجراء سريع' : 'Quick Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50">
                        <td className="p-2.5 flex items-center gap-2.5">
                          <img src={p.images[0]} alt="" className="w-8 h-10 object-cover border border-stone-200 shrink-0" />
                          <div>
                            <span className="font-semibold text-stone-900 block line-clamp-1">
                              {isAr ? p.nameAr : p.name}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">{p.id}</span>
                          </div>
                        </td>
                        <td className="p-2.5 uppercase text-stone-500">{p.category}</td>
                        <td className="p-2.5 font-mono font-semibold">
                          <input
                            type="number"
                            defaultValue={p.price}
                            onBlur={(e) => {
                              const val = Number(e.target.value);
                              if (val > 0 && val !== p.price) {
                                updateProduct(p.id, { price: val });
                                showToast(isAr ? `تم تعديل سعر ${p.nameAr} إلى ${val} $` : `Price updated to $${val}`);
                              }
                            }}
                            className="w-20 p-1 border border-stone-300 font-mono text-xs"
                          />
                        </td>
                        <td className="p-2.5 font-mono font-semibold">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => adjustStock(p.id, -1)}
                              className="p-1 bg-stone-100 hover:bg-stone-200 text-stone-700"
                              title="Decrease 1"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className={`w-8 text-center font-mono ${p.stock <= 5 ? 'text-amber-700' : 'text-stone-900'}`}>
                              {p.stock}
                            </span>
                            <button
                              onClick={() => adjustStock(p.id, 1)}
                              className="p-1 bg-stone-100 hover:bg-stone-200 text-stone-700"
                              title="Increase 1"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                        <td className="p-2.5">
                          <button
                            onClick={() => {
                              setSelectedProductIdToEdit(p.id);
                              window.scrollTo({ top: 180, behavior: 'smooth' });
                            }}
                            className="px-2.5 py-1 text-[11px] font-medium bg-stone-100 hover:bg-stone-200 text-stone-800"
                          >
                            {isAr ? 'تعديل كامل' : 'Edit Details'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: "نزييد" (Add New Product Studio)                   */}
        {/* ======================================================== */}
        {activeTab === 'add' && (
          <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-sm">
            <div className="pb-6 border-b border-stone-200">
              <span className="text-xs uppercase tracking-widest text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 border border-emerald-200">
                {isAr ? 'التحكم الثاني: نزييد' : 'Control 2: Add New Product'}
              </span>
              <h2 className="font-display text-2xl font-semibold text-stone-900 mt-2">
                {isAr ? 'إضافة ونشر تصميم نسائي جديد إلى البوتيك' : 'Publish New Garment Design'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {isAr
                  ? 'أدخلي تفاصيل القطعة الجديدة والأسعار والمقاسات والصورة لتظهر فوراً لزبائنكِ في واجهة المتجر.'
                  : 'Fill in design specifications, price, stock, and photography to immediately offer it in the storefront.'}
              </p>
            </div>

            <form onSubmit={handleAddNewProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
              {/* Visual preview column */}
              <div className="lg:col-span-4 space-y-4">
                <span className="block text-xs font-semibold uppercase tracking-wider text-stone-900">
                  {isAr ? 'معاينة صورة التصميم' : 'Photo Preview'}
                </span>

                <div className="relative aspect-[3/4] bg-stone-100 border border-stone-200 overflow-hidden">
                  <img
                    src={newImageUrl || PRESET_GALLERY[0].url}
                    alt="New Product"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {newBadge && (
                    <span className="absolute top-3 left-3 text-[11px] uppercase tracking-wider bg-white/95 px-2 py-0.5 border border-stone-200 text-stone-900 font-medium">
                      {newBadge}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isAr ? 'رابط الصورة (Image URL):' : 'Image URL:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs p-2 border border-stone-300 font-mono"
                  />
                </div>

                <div>
                  <span className="block text-[11px] font-medium text-stone-600 mb-1.5">
                    {isAr ? 'أو اختاري صورة فورية من مكتبة التصوير:' : 'Or choose from studio assets:'}
                  </span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {PRESET_GALLERY.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewImageUrl(preset.url)}
                        className={`aspect-square overflow-hidden border-2 cursor-pointer transition-all ${
                          newImageUrl === preset.url
                            ? 'border-emerald-700 scale-105'
                            : 'border-stone-200 opacity-60 hover:opacity-100'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Fields column */}
              <div className="lg:col-span-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      {isAr ? 'اسم المنتج بالعربية *' : 'Product Name (Arabic) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newNameAr}
                      onChange={(e) => setNewNameAr(e.target.value)}
                      placeholder={isAr ? 'مثال: عباية حرير كريب ملكية مطرزة' : 'e.g. عباية مطرزة بالذهب'}
                      className="w-full text-xs p-2.5 border border-stone-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      {isAr ? 'اسم المنتج بالإنجليزية *' : 'Product Name (English) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Royal Embroidered Silk Abaya"
                      className="w-full text-xs p-2.5 border border-stone-300"
                    />
                  </div>
                </div>

                {/* Price, Stock, Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-50 p-4 border border-stone-200">
                  <div>
                    <label className="block text-xs font-medium text-stone-900 mb-1">
                      {isAr ? 'سعر البيع ($ USD) *' : 'Retail Price ($ USD) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-stone-300 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      {isAr ? 'السعر الأصلي (قبل الخصم)' : 'Compare Price ($)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newOriginalPrice}
                      onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-stone-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-900 mb-1">
                      {isAr ? 'الكمية المتوفرة (Stock) *' : 'Available Stock *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newStock}
                      onChange={(e) => setNewStock(Number(e.target.value))}
                      className="w-full text-xs p-2.5 border border-stone-300 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      {isAr ? 'التصنيف *' : 'Category *'}
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full text-xs p-2.5 border border-stone-300 bg-white"
                    >
                      <option value="abayas">{isAr ? 'عبايات راقية (Abayas)' : 'Abayas'}</option>
                      <option value="dresses">{isAr ? 'فساتين سهرة ومناسبات (Dresses)' : 'Dresses'}</option>
                      <option value="casual">{isAr ? 'ملابس وأطقم يومية (Casual Wear)' : 'Casual Wear'}</option>
                      <option value="accessories">{isAr ? 'إكسسوارات وحلي (Accessories)' : 'Accessories'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      {isAr ? 'شارة العرض' : 'Badge'}
                    </label>
                    <select
                      value={newBadge || ''}
                      onChange={(e) => setNewBadge((e.target.value || undefined) as any)}
                      className="w-full text-xs p-2.5 border border-stone-300 bg-white"
                    >
                      <option value="New">New (جديد)</option>
                      <option value="Bestseller">Bestseller (الأكثر طلباً)</option>
                      <option value="Exclusive">Exclusive (حصري)</option>
                      <option value="Sale">Sale (تخفيض)</option>
                      <option value="">{isAr ? 'بدون شارة' : 'None'}</option>
                    </select>
                  </div>
                </div>

                {/* Sizes checkboxes */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">
                    {isAr ? 'المقاسات المتوفرة للقطعة:' : 'Available Sizes:'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S (52)', 'M (54)', 'L (56)', 'XL (58)', 'Free Size'].map((sz) => {
                      const checked = newSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            setNewSizes(
                              checked ? newSizes.filter((s) => s !== sz) : [...newSizes, sz]
                            );
                          }}
                          className={`py-1.5 px-3 text-xs border cursor-pointer ${
                            checked
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'bg-white text-stone-700 border-stone-300'
                          }`}
                        >
                          {sz} {checked && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Color swatch */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-stone-50 p-3 border border-stone-200">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">
                      {isAr ? 'اسم اللون بالعربية' : 'Color Name (AR)'}
                    </label>
                    <input
                      type="text"
                      value={newColorNameAr}
                      onChange={(e) => setNewColorNameAr(e.target.value)}
                      className="w-full text-xs p-2 border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">
                      {isAr ? 'اسم اللون بالإنجليزية' : 'Color Name (EN)'}
                    </label>
                    <input
                      type="text"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      className="w-full text-xs p-2 border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-700 mb-1">
                      {isAr ? 'كود اللون (Hex)' : 'Color Swatch'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-8 h-8 cursor-pointer border border-stone-300 p-0"
                      />
                      <input
                        type="text"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-20 text-xs p-1.5 border border-stone-300 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      {isAr ? 'الوصف بالعربية *' : 'Description (AR) *'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newDescriptionAr}
                      onChange={(e) => setNewDescriptionAr(e.target.value)}
                      className="w-full text-xs p-2 border border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      {isAr ? 'الوصف بالإنجليزية *' : 'Description (EN) *'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full text-xs p-2 border border-stone-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-emerald-700 text-white text-xs font-semibold uppercase tracking-widest hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>{isAr ? 'نشر القطعة الجديدة فوراً في المتجر («نزييد»)' : 'Publish New Item to Store ("نزييد")'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: "نقص" (Remove / Reduce Stock & Hide Products)      */}
        {/* ======================================================== */}
        {activeTab === 'reduce' && (
          <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-rose-800 font-semibold bg-rose-50 px-2.5 py-0.5 border border-rose-200">
                  {isAr ? 'التحكم الثالث: نقص' : 'Control 3: Remove / Reduce'}
                </span>
                <h2 className="font-display text-2xl font-semibold text-stone-900 mt-2">
                  {isAr ? 'إدارة إنقاص المخزون، الإخفاء المؤقت، والحذف النهائي' : 'Fast Stock Decrement & Deletion Console'}
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  {isAr
                    ? 'أزرار سريعة بجانب كل منتج لإنقاص الكمية، تعيينه كـ"نفد من المخزون"، إخفاؤه من واجهة المتجر، أو حذفه نهائياً.'
                    : 'Quick buttons next to every item in the catalog to decrement inventory, set out of stock, hide, or permanently remove.'}
                </p>
              </div>

              {/* Search Bar for products */}
              <div className="w-full sm:w-64 relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={reduceSearchQuery}
                  onChange={(e) => setReduceSearchQuery(e.target.value)}
                  placeholder={isAr ? 'ابحثي في المخزون...' : 'Filter products...'}
                  className="w-full text-xs pl-9 pr-3 py-2 border border-stone-300"
                />
              </div>
            </div>

            {/* Inventory Management Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-stone-200">
                <thead className="bg-stone-100 text-stone-700">
                  <tr>
                    <th className="p-3 border-b border-stone-200">{isAr ? 'القطعة' : 'Item'}</th>
                    <th className="p-3 border-b border-stone-200">{isAr ? 'السعر' : 'Price'}</th>
                    <th className="p-3 border-b border-stone-200">{isAr ? 'المخزون الحالي' : 'Stock'}</th>
                    <th className="p-3 border-b border-stone-200">{isAr ? 'إنقاص سريع («نقص»)' : 'Fast Decrement'}</th>
                    <th className="p-3 border-b border-stone-200">{isAr ? 'حالة الظهور' : 'Visibility'}</th>
                    <th className="p-3 border-b border-stone-200 text-right">{isAr ? 'حذف نهائي' : 'Delete'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filteredReduceProducts.map((p) => {
                    const isOutOfStock = p.stock <= 0 || p.status === 'out_of_stock';
                    const isHidden = p.status === 'hidden';

                    return (
                      <tr key={p.id} className={`hover:bg-stone-50 ${isHidden ? 'bg-stone-50/70 opacity-70' : ''}`}>
                        {/* Item Info */}
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]}
                              alt=""
                              className="w-12 h-16 object-cover border border-stone-200 shrink-0"
                            />
                            <div>
                              <h4 className="font-semibold text-stone-900 line-clamp-1">
                                {isAr ? p.nameAr : p.name}
                              </h4>
                              <span className="text-[11px] text-stone-500 uppercase">
                                {p.category} · {p.sizes.length} {isAr ? 'مقاسات' : 'sizes'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="p-3 font-mono font-semibold text-stone-900">
                          {formatPrice(p.price)}
                        </td>

                        {/* Current Stock */}
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono text-sm font-bold ${
                                isOutOfStock
                                  ? 'text-rose-600'
                                  : p.stock <= 5
                                  ? 'text-amber-700'
                                  : 'text-stone-900'
                              }`}
                            >
                              {p.stock}
                            </span>
                            {isOutOfStock ? (
                              <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 font-medium">
                                {isAr ? 'نفد' : 'Sold Out'}
                              </span>
                            ) : p.stock <= 5 ? (
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 font-medium">
                                {isAr ? 'حرج' : 'Low'}
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-400">
                                {isAr ? 'وفير' : 'OK'}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Fast Decrement Buttons: "-1", "-5", "Set to 0" */}
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => adjustStock(p.id, -1)}
                              disabled={p.stock <= 0}
                              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-xs border border-stone-300 disabled:opacity-40"
                              title={isAr ? 'إنقاص 1 قطعة' : 'Decrement 1'}
                            >
                              -1
                            </button>
                            <button
                              onClick={() => adjustStock(p.id, -5)}
                              disabled={p.stock <= 0}
                              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-xs border border-stone-300 disabled:opacity-40"
                              title={isAr ? 'إنقاص 5 قطع' : 'Decrement 5'}
                            >
                              -5
                            </button>
                            <button
                              onClick={() => setStockExact(p.id, 0)}
                              disabled={p.stock <= 0}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs border border-rose-200 disabled:opacity-40"
                              title={isAr ? 'تصفير المخزون (نفد)' : 'Mark as Sold Out'}
                            >
                              {isAr ? 'نفد (0)' : 'Out (0)'}
                            </button>
                          </div>
                        </td>

                        {/* Visibility Toggle: Hide / Unhide without deleting */}
                        <td className="p-3">
                          <button
                            onClick={() => toggleProductStatus(p.id)}
                            className={`px-3 py-1 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                              isHidden
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                            }`}
                            title={isHidden ? (isAr ? 'إظهار في المتجر' : 'Show in Store') : (isAr ? 'إخفاء مؤقت' : 'Hide from Store')}
                          >
                            {isHidden ? (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>{isAr ? 'مخفي (إظهار)' : 'Hidden (Unhide)'}</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                                <span>{isAr ? 'ظاهر (إخفاء)' : 'Active (Hide)'}</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Permanent Delete Action */}
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title={isAr ? 'حذف نهائي من المتجر («نقص»)' : 'Permanently Delete Product'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: Orders & Shipments                                */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="pb-6 border-b border-stone-200">
              <h2 className="font-display text-2xl font-semibold text-stone-900">
                {isAr ? 'سجل طلبات الزبائن والمبيعات' : 'Customer Orders & Fulfillment'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {isAr
                  ? 'متابعة الطلبات المكتملة وتفاصيل الشحن وطريقة الدفع (الدفع عند الاستلام أو البطاقة).'
                  : 'Live orders submitted through checkout with customer address and delivery status.'}
              </p>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="p-5 border border-stone-200 bg-stone-50/50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-stone-900">
                          {order.id}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="text-xs text-stone-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="text-xs font-semibold text-stone-900">
                          {order.customerName}
                        </span>
                      </div>
                      <div className="text-xs text-stone-600 mt-1">
                        <span>📞 {order.phone}</span>
                        <span className="mx-2">·</span>
                        <span>✉️ {order.email}</span>
                        <span className="mx-2">·</span>
                        <span>📍 {order.address}, {order.city}, {order.country}</span>
                      </div>
                    </div>

                    {/* Status updater */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500">{isAr ? 'الحالة:' : 'Status:'}</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded border ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : order.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="Pending">Pending (قيد المراجعة)</option>
                        <option value="Confirmed">Confirmed (تم التأكيد)</option>
                        <option value="Shipped">Shipped (خرج للتوصيل)</option>
                        <option value="Delivered">Delivered (تم التسليم)</option>
                        <option value="Cancelled">Cancelled (ملغي)</option>
                      </select>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="text-xs space-y-1.5 text-stone-700">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {isAr ? item.product.nameAr : item.product.name} ({item.selectedSize}) × {item.quantity}
                        </span>
                        <span className="font-mono">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-xs">
                    <span className="text-stone-500">
                      {isAr ? 'طريقة الدفع: ' : 'Payment: '}
                      <strong className="text-stone-800">
                        {order.paymentMethod === 'cod' ? 'Cash on Delivery (دفع عند الاستلام)' : 'Credit Card'}
                      </strong>
                    </span>
                    <span className="font-semibold text-stone-900 text-sm">
                      {isAr ? 'المجموع: ' : 'Total: '}
                      <span className="font-mono">{formatPrice(order.total)}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: Security & Settings                               */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Password Management */}
            <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-stone-700" />
                <span>{isAr ? 'تغيير كلمة مرور الإدارة' : 'Change Admin Password'}</span>
              </h3>

              {passwordMsg && (
                <div
                  className={`mt-4 p-2.5 text-xs ${
                    passwordMsg.isError
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {passwordMsg.text}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isAr ? 'كلمة المرور الحالية' : 'Current Password'}
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-300"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {isAr ? 'كلمة المرور الجديدة' : 'New Password (min 6 chars)'}
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-300"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors"
                >
                  {isAr ? 'تحديث كلمة المرور' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* Catalog Factory Reset */}
            <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-stone-700" />
                <span>{isAr ? 'استعادة الكتالوج النموذجي' : 'Restore Catalog Default'}</span>
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed">
                {isAr
                  ? 'إذا أردتِ استعادة المنتجات الأصلية المجهزة بأحدث الصور الاحترافية (عبايات، فساتين، أطقم الكتان، وإكسسوارات الذهب)، يمكنكِ إعادة ضبط المخزون بضغطة واحدة.'
                  : 'Reset product database to the pristine curated haute-couture catalog.'}
              </p>

              <button
                onClick={() => {
                  if (window.confirm(isAr ? 'هل تريدين حقاً استعادة الكتالوج الأساسي؟' : 'Restore initial sample catalog?')) {
                    resetToInitialCatalog();
                    showToast(isAr ? 'تم استعادة الكتالوج الأساسي بنجاح' : 'Default catalog restored');
                  }
                }}
                className="py-2.5 px-5 bg-stone-200 text-stone-800 text-xs font-medium uppercase tracking-wider hover:bg-stone-300 transition-colors"
              >
                {isAr ? 'استعادة الكتالوج الأصلي' : 'Restore Original Catalog'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
