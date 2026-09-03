import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Trophy, ArrowRight, RotateCcw, CheckCircle2, Zap } from 'lucide-react';

interface LessonCompleteModalProps {
  isOpen: boolean;
  lessonTitle: string;
  wpm: number;
  accuracy: number;
  timeSeconds: number;
  errors: number;
  stars: number;
  xpEarned: number;
  hasNextLesson: boolean;
  onNextLesson: () => void;
  onRetry: () => void;
  onClose: () => void;
  language: 'fa' | 'en';
}

export const LessonCompleteModal: React.FC<LessonCompleteModalProps> = ({
  isOpen,
  lessonTitle,
  wpm,
  accuracy,
  timeSeconds,
  errors,
  stars,
  xpEarned,
  hasNextLesson,
  onNextLesson,
  onRetry,
  onClose,
  language,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger festive confetti explosion
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toPersianNum = (n: number | string) => {
    if (language === 'en') return String(n);
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(n).replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
  };

  const getFeedbackMessage = () => {
    if (language === 'en') {
      if (stars === 3) return 'Outstanding! Perfect finger coordination!';
      if (stars === 2) return 'Great work! Keep up the rhythm!';
      return 'Lesson completed. Keep practicing to reach 3 stars!';
    }
    if (stars === 3) return 'فوق‌العاده بود! تسلط و هماهنگی انگشتان شما بی‌نقص است.';
    if (stars === 2) return 'بسیار عالی! ریتم و پیوستگی دستان شما در حال پیشرفت چشمگیر است.';
    return 'تمرین با موفقیت تکمیل شد. با تکرار بیشتر به امتیاز ۳ ستاره برسید!';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center gap-6"
        dir={language === 'fa' ? 'rtl' : 'ltr'}
      >
        {/* Trophy icon */}
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shadow-inner">
          <Trophy size={36} />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1">
            <CheckCircle2 size={16} />
            {language === 'fa' ? 'تمرین تکمیل شد!' : 'Lesson Completed!'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-50">
            {lessonTitle}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {getFeedbackMessage()}
          </p>
        </div>

        {/* Star Rating Display */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((starIndex) => (
            <Star
              key={starIndex}
              size={34}
              className={`transition-all duration-300 ${
                starIndex <= stars
                  ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-md'
                  : 'text-slate-300 dark:text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* XP Badge */}
        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-sm font-bold border border-indigo-200 dark:border-indigo-800">
          <Zap size={16} className="text-amber-500 fill-amber-500" />
          <span>+{toPersianNum(xpEarned)} امتیاز تجربه (XP)</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          {/* WPM */}
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">
              {language === 'fa' ? 'سرعت' : 'Speed'}
            </span>
            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
              {toPersianNum(wpm)}{' '}
              <span className="text-xs font-normal text-slate-400">WPM</span>
            </span>
          </div>

          {/* Accuracy */}
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">
              {language === 'fa' ? 'دقت' : 'Accuracy'}
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {toPersianNum(accuracy)}%
            </span>
          </div>

          {/* Time */}
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">
              {language === 'fa' ? 'زمان' : 'Time'}
            </span>
            <span className="text-xl font-black text-slate-700 dark:text-slate-200">
              {toPersianNum(timeSeconds)}s
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-2">
          {hasNextLesson && (
            <button
              onClick={onNextLesson}
              className="w-full flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-200 dark:shadow-none transition-colors"
            >
              <span>{language === 'fa' ? 'درس بعدی' : 'Next Lesson'}</span>
              <ArrowRight size={18} className={language === 'fa' ? 'rotate-180' : ''} />
            </button>
          )}

          <button
            onClick={onRetry}
            className="w-full flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold transition-colors"
          >
            <RotateCcw size={18} />
            <span>{language === 'fa' ? 'تکرار تمرین' : 'Retry'}</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          {language === 'fa' ? 'بازگشت به فهرست دروس' : 'Back to Lessons List'}
        </button>
      </div>
    </div>
  );
};
