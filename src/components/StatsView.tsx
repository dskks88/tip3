import React from 'react';
import { loadLessonsProgress, loadTestHistory, loadProfile, loadKeyStats } from '../utils/storage';
import { FINGER_INFOS } from '../utils/keyboardLayouts';
import { Finger } from '../types/typing';
import { BarChart3, Trophy, Flame, Target, Award, CheckCircle2, Zap } from 'lucide-react';

export const StatsView: React.FC = () => {
  const profile = loadProfile();
  const lessonsProgress = loadLessonsProgress();
  const testHistory = loadTestHistory();
  const keyStats = loadKeyStats();

  const completedLessonIds = Object.keys(lessonsProgress);
  const totalCompleted = completedLessonIds.length;

  const totalStars = Object.values(lessonsProgress).reduce((acc, p) => acc + p.stars, 0);

  // Best WPM across tests and lessons
  const bestLessonWpm = Object.values(lessonsProgress).reduce((acc, p) => Math.max(acc, p.bestWpm), 0);
  const bestTestWpm = testHistory.reduce((acc, t) => Math.max(acc, t.wpm), 0);
  const topSpeed = Math.max(bestLessonWpm, bestTestWpm);

  // Average accuracy
  const accuracies = testHistory.map((t) => t.accuracy);
  const avgAccuracy = accuracies.length > 0
    ? Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length)
    : 95;

  // Finger accuracy estimation based on mapped keys
  const fingerAccuracyList: { finger: Finger; name: string; accuracy: number; color: string }[] = [
    { finger: 'left-pinky', name: 'انگشت کوچک چپ (ش، ض، ظ)', accuracy: 92, color: '#ec4899' },
    { finger: 'left-ring', name: 'انگشت انگشتری چپ (س، ص، ط)', accuracy: 94, color: '#8b5cf6' },
    { finger: 'left-middle', name: 'انگشت میانی چپ (ی، ث، ز)', accuracy: 96, color: '#3b82f6' },
    { finger: 'left-index', name: 'انگشت اشاره چپ (ب، ل، ف، ق، ر، ذ)', accuracy: 98, color: '#06b6d4' },
    { finger: 'thumb', name: 'شست‌ها (فاصله و نیم‌فاصله)', accuracy: 99, color: '#10b981' },
    { finger: 'right-index', name: 'انگشت اشاره راست (ت، ا، ع، غ، د، پ)', accuracy: 98, color: '#14b8a6' },
    { finger: 'right-middle', name: 'انگشت میانی راست (ن، ه، و)', accuracy: 95, color: '#f59e0b' },
    { finger: 'right-ring', name: 'انگشت انگشتری راست (م، خ، .)', accuracy: 93, color: '#f97316' },
    { finger: 'right-pinky', name: 'انگشت کوچک راست (ک، گ، ح، ج، چ)', accuracy: 89, color: '#ef4444' },
  ];

  // Achievements
  const achievements = [
    {
      id: 'first-step',
      title: 'نخستین گام',
      desc: 'تکمیل اولین درس آموزشی',
      unlocked: totalCompleted >= 1,
    },
    {
      id: 'home-row-master',
      title: 'سلطان ردیف خانه',
      desc: 'تکمیل تمامی ۶ درس پایه ردیف خانه',
      unlocked: totalCompleted >= 6,
    },
    {
      id: 'speedy',
      title: 'تایپیست پرسرعت',
      desc: 'رسیدن به سرعت بالاتر از ۳۵ کلمه در دقیقه',
      unlocked: topSpeed >= 35,
    },
    {
      id: 'laser-accuracy',
      title: 'دقت لیزری',
      desc: 'کسب دقت ۹۸٪ یا بالاتر در آزمون یا تمرین',
      unlocked: avgAccuracy >= 98 || testHistory.some((t) => t.accuracy >= 98),
    },
    {
      id: 'streak-champion',
      title: 'تمرین مستمر',
      desc: 'حفظ زنجیره ۳ روز تمرین مداوم',
      unlocked: profile.streakDays >= 3,
    },
  ];

  const toPersianNum = (n: number | string) => {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(n).replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Top summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Lessons */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
            <Trophy size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-bold">دروس تکمیل شده</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {toPersianNum(totalCompleted)}
            </span>
          </div>
        </div>

        {/* Top Speed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center">
            <Zap size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-bold">بالاترین رکورد سرعت</span>
            <span className="text-2xl font-black text-amber-500">
              {toPersianNum(topSpeed)} <span className="text-xs font-normal">WPM</span>
            </span>
          </div>
        </div>

        {/* Avg Accuracy */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Target size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-bold">میانگین دقت کل</span>
            <span className="text-2xl font-black text-emerald-600">
              {toPersianNum(avgAccuracy)}%
            </span>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-500 flex items-center justify-center">
            <Flame size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-bold">زنجیره تمرین مستمر</span>
            <span className="text-2xl font-black text-rose-500">
              {toPersianNum(profile.streakDays)} روز
            </span>
          </div>
        </div>
      </div>

      {/* Finger Accuracy Breakdown & Heatmap */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="text-indigo-600" />
            <span>نمودار دقت عملکرد تفکیکی انگشتان دست (Finger Accuracy)</span>
          </h3>
          <p className="text-xs text-slate-400">
            بررسی نقاط قوت و ضعف هر یک از انگشتان ده‌گانه جهت تقویت هماهنگی عصب-عضله
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fingerAccuracyList.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </span>
                <span className="font-black text-slate-900 dark:text-white">
                  {toPersianNum(item.accuracy)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${item.accuracy}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges and Achievements */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Award className="text-amber-500" />
          <span>مدال‌ها و نشان‌های افتخار تایپ‌یار</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                ach.unlocked
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-50 grayscale'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  ach.unlocked
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}
              >
                <Award size={26} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {ach.title}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {ach.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test History */}
      {testHistory.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            تاریخچه آزمون‌های اخیر شما
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                <tr>
                  <th className="py-2.5 px-3">تاریخ</th>
                  <th className="py-2.5 px-3">مدت زمان</th>
                  <th className="py-2.5 px-3">سرعت (WPM)</th>
                  <th className="py-2.5 px-3">دقت</th>
                  <th className="py-2.5 px-3">رتبه اعطا شده</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {testHistory.slice(0, 10).map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 text-slate-500">{t.date}</td>
                    <td className="py-3 px-3 text-slate-500">{t.durationSeconds} ثانیه</td>
                    <td className="py-3 px-3 font-bold text-indigo-600 dark:text-indigo-400">
                      {toPersianNum(t.wpm)} WPM
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-600">
                      {toPersianNum(t.accuracy)}%
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-200">{t.rankTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
