import React from 'react';
import { ActiveTab, Language } from '../types/typing';
import {
  Keyboard,
  BookOpen,
  Timer,
  FileText,
  AlertTriangle,
  Gamepad2,
  BarChart3,
  Volume2,
  VolumeX,
  HelpCircle,
  Sliders,
  Flame,
  Zap,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  language: Language;
  onToggleLanguage: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
  streakDays: number;
  userLevel: number;
  userXp: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  language,
  onToggleLanguage,
  soundEnabled,
  onToggleSound,
  onOpenGuide,
  onOpenSettings,
  streakDays,
  userLevel,
  userXp,
}) => {
  const toPersianNum = (n: number | string) => {
    if (language === 'en') return String(n);
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(n).replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'lessons',
      label: language === 'fa' ? 'دوره‌های آموزشی' : 'Lessons',
      icon: <BookOpen size={17} />,
    },
    {
      id: 'speed_test',
      label: language === 'fa' ? 'آزمون سرعت' : 'Speed Test',
      icon: <Timer size={17} />,
    },
    {
      id: 'custom_practice',
      label: language === 'fa' ? 'تمرین آزاد' : 'Custom Text',
      icon: <FileText size={17} />,
    },
    {
      id: 'weak_keys',
      label: language === 'fa' ? 'کلیدهای ضعیف' : 'Weak Keys',
      icon: <AlertTriangle size={17} />,
    },
    {
      id: 'game',
      label: language === 'fa' ? 'بازی واژه‌ربا' : 'Word Rush',
      icon: <Gamepad2 size={17} />,
    },
    {
      id: 'stats',
      label: language === 'fa' ? 'کارنامه و آمار' : 'Analytics',
      icon: <BarChart3 size={17} />,
    },
  ];

  return (
    <header className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('lessons')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform">
            <Keyboard size={24} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {language === 'fa' ? 'تایپ‌یار' : 'TypeYar'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/60 dark:border-indigo-800">
                {language === 'fa' ? 'ده انگشتی' : 'Touch Typing'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline-block">
              {language === 'fa'
                ? 'سامانه آموزش حرفه‌ای تایپ سریع'
                : 'Fast Persian & English Typing'}
            </span>
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Progress & Utility Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Daily Streak */}
          <div
            title="روزهای متوالی تمرین"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900 text-xs font-bold"
          >
            <Flame size={16} className="fill-rose-500" />
            <span>{toPersianNum(streakDays)}</span>
          </div>

          {/* Level / XP */}
          <div
            title="سطح مهارت شما"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900 text-xs font-bold"
          >
            <Zap size={16} className="text-amber-500 fill-amber-500" />
            <span>سطح {toPersianNum(userLevel)}</span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            title={language === 'fa' ? 'تغییر به زبان انگلیسی' : 'Switch to Persian'}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-700 dark:text-slate-200 transition-colors"
          >
            {language === 'fa' ? 'EN' : 'فا'}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'قطع صدا' : 'وصل صدا'}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Guide Modal Trigger */}
          <button
            onClick={onOpenGuide}
            title="راهنمای استقرار دست‌ها و ارگونومی"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <HelpCircle size={18} />
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            title="تنظیمات"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <Sliders size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="lg:hidden border-t border-slate-100 dark:border-slate-800 px-3 py-2 flex items-center gap-1 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
