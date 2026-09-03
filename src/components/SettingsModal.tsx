import React from 'react';
import { UserSettings } from '../types/typing';
import { X, Volume2, Sliders, Type, Keyboard, HelpCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  userName: string;
  onUpdateUserName: (name: string) => void;
  language: 'fa' | 'en';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  userName,
  onUpdateUserName,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
        dir={language === 'fa' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <Sliders size={22} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                تنظیمات و سفارشی‌سازی تایپ‌یار
              </h2>
              <span className="text-xs text-slate-400">صدا، نمایشگر، کیبورد و ترجیحات کاربری</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex flex-col gap-5 text-sm">
          {/* User Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              نام و نام خانوادگی شما (جهت صدور گواهی‌نامه‌ها):
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => onUpdateUserName(e.target.value)}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="مثال: علی محمدی"
            />
          </div>

          {/* Sound Type Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Volume2 size={16} className="text-indigo-600" />
              <span>جلوه صوتی ضربه کلیدها:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'mechanical', label: 'مکانیکی Blue' },
                { id: 'typewriter', label: 'تایپ‌رایتر' },
                { id: 'soft', label: 'نرم و مدرن' },
                { id: 'beep', label: 'بیپ دیجیتال' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      soundType: t.id as UserSettings['soundType'],
                    })
                  }
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                    settings.soundType === t.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Volume Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">بلندی صدای کلیک:</span>
              <span className="text-slate-400">{Math.round(settings.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={(e) =>
                onUpdateSettings({ ...settings, volume: parseFloat(e.target.value) })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Font Size Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Type size={16} className="text-indigo-600" />
              <span>اندازه قلم متن تایپ:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'normal', label: 'معمولی (18px)' },
                { id: 'large', label: 'بزرگ (22px)' },
                { id: 'xlarge', label: 'خیلی بزرگ (28px)' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() =>
                    onUpdateSettings({ ...settings, fontSize: s.id as UserSettings['fontSize'] })
                  }
                  className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                    settings.fontSize === s.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs">
                نمایش راهنمای انگشتان دست روی صفحه
              </span>
              <input
                type="checkbox"
                checked={settings.showHandsGuide}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, showHandsGuide: e.target.checked })
                }
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs">
                نمایش کیبورد مجازی
              </span>
              <input
                type="checkbox"
                checked={settings.showKeyboard}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, showKeyboard: e.target.checked })
                }
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-colors"
          >
            ذخیره و بستن
          </button>
        </div>
      </div>
    </div>
  );
};
