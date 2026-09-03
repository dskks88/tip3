import React from 'react';
import { loadKeyStats } from '../utils/storage';
import { Language } from '../types/typing';
import { AlertTriangle, Play, CheckCircle, Sparkles } from 'lucide-react';

interface WeakKeysViewProps {
  onStartPractice: (text: string, lang: Language) => void;
  language: Language;
}

export const WeakKeysView: React.FC<WeakKeysViewProps> = ({ onStartPractice, language }) => {
  const stats = loadKeyStats();

  // Calculate sorted weak keys
  const keysWithErrors = Object.entries(stats)
    .filter(([char, data]) => char.trim().length > 0 && data.totalHits >= 3 && data.errorHits > 0)
    .map(([char, data]) => ({
      char,
      errorRate: Math.round((data.errorHits / data.totalHits) * 100),
      totalHits: data.totalHits,
      errorHits: data.errorHits,
    }))
    .sort((a, b) => b.errorRate - a.errorRate);

  // Fallback defaults for Persian tricky keys if no data yet
  const defaultPersianWeakKeys = ['ض', 'ژ', 'ط', 'ظ', 'ص', 'ث', '\u200c'];

  const displayedKeys = keysWithErrors.length > 0
    ? keysWithErrors.slice(0, 8).map((k) => k.char)
    : defaultPersianWeakKeys;

  // Generate targeted drill text based on weak keys
  const generateDrillText = (keys: string[]): string => {
    // Word banks containing specific tricky letters
    const wordBank: Record<string, string[]> = {
      'ض': ['ضرب', 'حضور', 'ضمانت', 'ضمیر', 'قضا', 'فضا', 'حاضر', 'عوض'],
      'ص': ['صبر', 'صدا', 'تصمیم', 'صداقت', 'حاصل', 'صورت', 'صبح', 'اصیل'],
      'ط': ['طراوت', 'طناب', 'طلوع', 'طبیعت', 'خاطر', 'خطاب', 'سلطان'],
      'ظ': ['ظاهر', 'ظرفیت', 'نظام', 'حفظ', 'مظلوم', 'انتظار', 'وظیفه'],
      'ژ': ['ژاله', 'مژده', 'پژواک', 'انرژی', 'ژرفا', 'واژه', 'ویژه'],
      '\u200c': ['می‌شود', 'خانه‌ها', 'کتاب‌ها', 'می‌رود', 'دست‌کم', 'بی‌نهایت'],
      'ث': ['ثبات', 'اثر', 'مثل', 'مثلث', 'ثبت', 'ثروت', 'حدث'],
      'ق': ['قلم', 'قافله', 'فوق', 'قانون', 'قدرت', 'شرق', 'افق'],
      'غ': ['غروب', 'باغ', 'تیغ', 'غریب', 'روغن', 'فروغ', 'چراغ'],
      'گ': ['گلستان', 'گرامی', 'سنگ', 'نگاه', 'برگ', 'روزگار', 'رنگین'],
      'ک': ['کتاب', 'کوشش', 'نیکو', 'کوچک', 'پاک', 'کمین', 'کامل'],
    };

    const drills: string[] = [];

    // Add repeated key clusters
    keys.forEach((k) => {
      const displayK = k === '\u200c' ? 'نیم‌فاصله' : k;
      drills.push(`${displayK} ${displayK} ${displayK}`);
      if (wordBank[k]) {
        drills.push(...wordBank[k]);
      }
    });

    if (drills.length === 0) {
      return 'تکرار و تمرین کلیدهای دشوار: ضرب و صبر، ظاهر و طراوت، مژده و ژرفا، می‌خواند و بی‌نهایت.';
    }

    return drills.join(' ');
  };

  const handleLaunchWeakKeysDrill = () => {
    const drillText = generateDrillText(displayedKeys);
    onStartPractice(drillText, 'fa');
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" />
            <span>تمرین هوشمند کلیدهای پرخطا (Weak Keys)</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            سامانه به صورت مداوم کلیدهایی را که بیشترین نرخ اشتباه را در آن‌ها دارید شناسایی کرده و تمرین‌های ویژه‌ای برای بهبود عصب-عضله دستان شما می‌سازد.
          </p>
        </div>

        <button
          onClick={handleLaunchWeakKeysDrill}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-colors shrink-0"
        >
          <Play size={18} />
          <span>شروع تمرین متمرکز کلیدهای ضعیف</span>
        </button>
      </div>

      {/* Weak Keys Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Sparkles size={18} className="text-amber-500" />
          کلیدهای نیازمند تقویت و تمرین بیشتر
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {displayedKeys.map((keyChar, idx) => {
            const stat = stats[keyChar];
            const errorRate = stat && stat.totalHits > 0 ? Math.round((stat.errorHits / stat.totalHits) * 100) : 15 + idx * 4;
            const isHalfSpace = keyChar === '\u200c';

            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-2xl font-['Vazirmatn'] shadow-inner">
                    {isHalfSpace ? '‌' : keyChar}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {isHalfSpace ? 'نیم‌فاصله' : `کلید «${keyChar}»`}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      نرخ خطا: {errorRate}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Learning tip card */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
          <CheckCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <span className="font-bold block mb-1">توصیه ارگونومیک تایپ‌یار:</span>
            برای کلیدهای ردیف بالا و پایین مانند «ض»، «ص» و «ط»، سعی کنید مچ دست خود را از روی میز بلند نکنید؛ تنها انگشت مربوطه را با کشیدگی ملایم به سمت کلید حرکت دهید و بلافاصله به ردیف خانه بازگردید.
          </div>
        </div>
      </div>
    </div>
  );
};
