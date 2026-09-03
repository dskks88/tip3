import React from 'react';
import { X, BookOpen, Check, Keyboard, Compass, ShieldCheck } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'fa' | 'en';
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
        dir={language === 'fa' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <BookOpen size={22} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                راهنمای جامع تسلط بر تایپ ده انگشتی فارسی
              </h2>
              <span className="text-xs text-slate-400">اصول ارگونومی، استقرار دستان و حافظه عضلانی</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content sections */}
        <div className="flex flex-col gap-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {/* Rule 1 */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 flex items-start gap-3">
            <ShieldCheck className="text-indigo-600 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                قانون طلایی: به هیچ وجه به کیبورد نگاه نکنید!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                در آغاز ممکن است سرعت شما کمی کاهش یابد، اما نگاه نکردن به کیبورد تنها راه تشکیل مسیرهای عصبی ناخودآگاه (Muscle Memory) در مغز است. به راهنمای رنگی دستان و کیبورد روی مانیتور اعتماد کنید.
              </p>
            </div>
          </div>

          {/* Rule 2: Home Row */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Keyboard size={18} className="text-indigo-600" />
              استقرار پایه روی ردیف خانه (Home Row)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              انگشتان اشاره شما دارای دو خانه شاخص با برجستگی فیزیکی هستند:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center gap-2">
                <Check size={16} className="text-emerald-500 shrink-0" />
                <span>انگشت اشاره دست چپ همیشه روی کلید «ب» (F)</span>
              </li>
              <li className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center gap-2">
                <Check size={16} className="text-emerald-500 shrink-0" />
                <span>انگشت اشاره دست راست همیشه روی کلید «ت» (J)</span>
              </li>
            </ul>
          </div>

          {/* Rule 3: Special Keys */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Compass size={18} className="text-indigo-600" />
              کلیدهای کلیدی در نگارش فارسی
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                  نیم‌فاصله (Shift + Space):
                </span>
                برای کلماتی نظیر «می‌شود»، «خانه‌ها»، «دست‌کم» از ترکیب کلید تبدیل (Shift) و کلید فاصله استفاده نمایید.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                  کلید ژ (Shift + C):
                </span>
                با فشردن هم‌زمان تبدیل و کلید ز، حرف ژ تایپ می‌گردد.
              </div>
            </div>
          </div>
        </div>

        {/* Footer close */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-colors"
          >
            متوجه شدم، آماده تمرینم
          </button>
        </div>
      </div>
    </div>
  );
};
