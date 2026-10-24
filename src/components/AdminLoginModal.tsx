import React, { useState } from 'react';
import { X, Lock, Mail, ShieldCheck, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

interface AdminLoginModalProps {
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccess }) => {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useAuth();
  const { language } = useStore();

  const [email, setEmail] = useState('ibbahmadomayma@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const isAr = language === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || (isAr ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials'));
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setEmail('ibbahmadomayma@gmail.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white w-full max-w-md p-6 sm:p-8 shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-stone-900 text-white rounded-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-stone-900">
                {isAr ? 'بوابة إدارة المتجر' : 'Store Owner Portal'}
              </h3>
              <p className="text-xs text-stone-500">
                {isAr ? 'وصول حصري لصاحبة المتجر (أميمة)' : 'Exclusive Access for Owner / Admin'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1 text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Credentials Reminder Box */}
        <div className="mb-5 p-3.5 bg-stone-50 border border-stone-200 text-xs text-stone-600 rounded-none">
          <div className="flex items-center justify-between font-medium text-stone-900 mb-1">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-stone-500" />
              {isAr ? 'بيانات الدخول المخصصة لمالك المتجر:' : 'Owner Credentials:'}
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] text-stone-800 underline hover:text-stone-950 font-medium cursor-pointer"
            >
              {isAr ? 'تعبئة تلقائية' : 'Quick Autofill'}
            </button>
          </div>
          <p className="text-[11px] text-stone-500 font-mono">
            Email: <strong className="text-stone-700">ibbahmadomayma@gmail.com</strong>
            <br />
            Pass: <strong className="text-stone-700">admin123</strong>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              {isAr ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 border border-stone-300 rounded-none focus:outline-none focus:border-stone-900"
                placeholder="your-email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-9 pr-9 py-2 border border-stone-300 rounded-none focus:outline-none focus:border-stone-900"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-stone-800 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isLoading
              ? (isAr ? 'جاري التحقق...' : 'Verifying...')
              : (isAr ? 'تسجيل الدخول إلى لوحة التحكم' : 'Sign In to Dashboard')}
          </button>
        </form>
      </div>
    </div>
  );
};
