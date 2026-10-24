import React from 'react';
import { X, Ruler } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const { language } = useStore();
  if (!isOpen) return null;

  const isAr = language === 'ar';

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-stone-200 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-stone-800" />
            <h3 className="font-display text-2xl font-semibold text-stone-900">
              {isAr ? 'دليل المقاسات الرسمي' : 'Official Size Guide'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-stone-500 hover:text-stone-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abaya Length Chart */}
        <div className="mt-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 mb-2">
            {isAr ? 'مقاسات طول العبايات (حسب طول القامة)' : 'Abaya Length Guide (By Height)'}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-stone-200">
              <thead className="bg-stone-100 text-stone-700">
                <tr>
                  <th className="p-2 border-b border-stone-200">{isAr ? 'مقاس العباية' : 'Abaya Size'}</th>
                  <th className="p-2 border-b border-stone-200">{isAr ? 'طول المرأة (سم)' : 'Customer Height (cm)'}</th>
                  <th className="p-2 border-b border-stone-200">{isAr ? 'طول العباية (إنش)' : 'Length (inches)'}</th>
                  <th className="p-2 border-b border-stone-200">{isAr ? 'عرض الصدر (سم)' : 'Bust (cm)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-mono tabular-nums text-stone-600">
                <tr>
                  <td className="p-2 font-sans font-semibold text-stone-900">52 (S)</td>
                  <td className="p-2">150 - 155 cm</td>
                  <td className="p-2">52"</td>
                  <td className="p-2">102 cm</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans font-semibold text-stone-900">54 (M)</td>
                  <td className="p-2">156 - 160 cm</td>
                  <td className="p-2">54"</td>
                  <td className="p-2">108 cm</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans font-semibold text-stone-900">56 (L)</td>
                  <td className="p-2">161 - 167 cm</td>
                  <td className="p-2">56"</td>
                  <td className="p-2">114 cm</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans font-semibold text-stone-900">58 (XL)</td>
                  <td className="p-2">168 - 175 cm</td>
                  <td className="p-2">58"</td>
                  <td className="p-2">120 cm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Ready to Wear & Evening Dresses */}
        <div className="mt-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900 mb-2">
            {isAr ? 'مقاسات فساتين السهرة والملابس اليومية' : 'Evening Dresses & Ready-to-Wear'}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-stone-200">
              <thead className="bg-stone-100 text-stone-700">
                <tr>
                  <th className="p-2 border-b border-stone-200">{isAr ? 'المقاس' : 'Size'}</th>
                  <th className="p-2 border-b border-stone-200">US</th>
                  <th className="p-2 border-b border-stone-200">UK</th>
                  <th className="p-2 border-b border-stone-200">EU</th>
                  <th className="p-2 border-b border-stone-200">{isAr ? 'محيط الصدر' : 'Bust'}</th>
                  <th className="p-2 border-b border-stone-200">{isAr ? 'محيط الخصر' : 'Waist'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-mono tabular-nums text-stone-600">
                <tr>
                  <td className="p-2 font-sans font-semibold text-stone-900">XS</td>
                  <td className="p-2">2 - 4</td>
                  <td className="p-2">6</td>
                  <td className="p-2">34</td>
                  <td className="p-2">82-85 cm</td>
                  <td className="p-2">63-66 cm</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans font-semibold text-stone-900">S</td>
                  <td className="p-2">4 - 6</td>
                  <td className="p-2">8</td>
                  <td className="p-2">36</td>
                  <td className="p-2">86-89 cm</td>
                  <td className="p-2">67-71 cm</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans font-semibold text-stone-900">M</td>
                  <td className="p-2">8 - 10</td>
                  <td className="p-2">10 - 12</td>
                  <td className="p-2">38 - 40</td>
                  <td className="p-2">90-95 cm</td>
                  <td className="p-2">72-77 cm</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans font-semibold text-stone-900">L</td>
                  <td className="p-2">12 - 14</td>
                  <td className="p-2">14</td>
                  <td className="p-2">42</td>
                  <td className="p-2">96-102 cm</td>
                  <td className="p-2">78-85 cm</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans font-semibold text-stone-900">XL</td>
                  <td className="p-2">16</td>
                  <td className="p-2">16</td>
                  <td className="p-2">44</td>
                  <td className="p-2">103-110 cm</td>
                  <td className="p-2">86-93 cm</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 text-white text-xs font-medium uppercase tracking-wider hover:bg-stone-800 transition-colors"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
