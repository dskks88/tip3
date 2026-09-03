import React, { useState } from 'react';
import { Finger, Language, Lesson, LessonProgress } from '../types/typing';
import { LESSONS } from '../data/lessonsData';
import { TypingArea } from './TypingArea';
import { Keyboard } from './Keyboard';
import { HandsGuide } from './HandsGuide';
import { LessonCompleteModal } from './LessonCompleteModal';
import {
  BookOpen,
  Star,
  Lock,
  Play,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface LessonsViewProps {
  language: Language;
  lessonsProgress: Record<string, LessonProgress>;
  onLessonFinished: (lessonId: string, stats: { wpm: number; accuracy: number; stars: number }) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  showKeyboard: boolean;
  showHandsGuide: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  blindMode: boolean;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  language,
  lessonsProgress,
  onLessonFinished,
  soundEnabled,
  onToggleSound,
  showKeyboard,
  showHandsGuide,
  fontSize,
  blindMode,
}) => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [levelFilter, setLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced' | 'en'>('all');

  // Active keyboard highlighting states
  const [activeKeyCode, setActiveKeyCode] = useState<string | null>(null);
  const [needsShift, setNeedsShift] = useState<boolean>(false);
  const [activeFinger, setActiveFinger] = useState<Finger | null>(null);
  const [pressedKeyCode, setPressedKeyCode] = useState<string | null>(null);

  // Victory modal state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [lastStats, setLastStats] = useState<{
    wpm: number;
    accuracy: number;
    timeSeconds: number;
    errors: number;
    stars: number;
    xpEarned: number;
  }>({ wpm: 0, accuracy: 0, timeSeconds: 0, errors: 0, stars: 0, xpEarned: 0 });

  // Filter lessons
  const filteredLessons = LESSONS.filter((lesson) => {
    if (levelFilter === 'all') return true;
    if (levelFilter === 'en') return lesson.language === 'en';
    if (lesson.language === 'en' && levelFilter !== 'en') return false;
    return lesson.level === levelFilter;
  });

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setModalOpen(false);
  };

  const handleTypingComplete = (stats: {
    wpm: number;
    cpm: number;
    accuracy: number;
    errors: number;
    timeSeconds: number;
  }) => {
    if (!activeLesson) return;

    // Calculate stars
    let stars = 1;
    if (stats.wpm >= activeLesson.minWpm + 5 && stats.accuracy >= 95) {
      stars = 3;
    } else if (stats.wpm >= activeLesson.minWpm && stats.accuracy >= 90) {
      stars = 2;
    }

    const xpEarned = stars * 35;

    setLastStats({
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      timeSeconds: stats.timeSeconds,
      errors: stats.errors,
      stars,
      xpEarned,
    });

    onLessonFinished(activeLesson.id, {
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      stars,
    });

    setModalOpen(true);
  };

  const currentLessonIndex = activeLesson
    ? LESSONS.findIndex((l) => l.id === activeLesson.id)
    : -1;
  const nextLesson =
    currentLessonIndex !== -1 && currentLessonIndex < LESSONS.length - 1
      ? LESSONS[currentLessonIndex + 1]
      : null;

  const toPersianNum = (n: number | string) => {
    if (language === 'en') return String(n);
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(n).replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {activeLesson ? (
        /* Active Lesson Practice Mode */
        <div className="flex flex-col gap-6">
          {/* Header of Active Lesson */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveLesson(null)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                title="بازگشت به فهرست دروس"
              >
                <ArrowRight size={18} className={language === 'fa' ? '' : 'rotate-180'} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                    {activeLesson.level === 'beginner'
                      ? 'مقدماتی'
                      : activeLesson.level === 'intermediate'
                      ? 'متوسط'
                      : 'پیشرفته'}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    {activeLesson.title}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {activeLesson.description}
                </p>
              </div>
            </div>

            {/* Target Keys Tags */}
            {activeLesson.targetKeys.length > 0 && (
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <span className="text-xs text-slate-400 font-semibold">کلیدهای هدف:</span>
                <div className="flex items-center gap-1">
                  {activeLesson.targetKeys.map((k, i) => (
                    <span
                      key={i}
                      className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-black text-base flex items-center justify-center font-['Vazirmatn'] shadow-sm"
                    >
                      {k === '\u200c' ? '‌' : k}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Typing Area Canvas */}
          <TypingArea
            targetText={activeLesson.text}
            language={activeLesson.language}
            onComplete={handleTypingComplete}
            onActiveKeyChange={(code, shift, finger) => {
              setActiveKeyCode(code);
              setNeedsShift(shift);
              setActiveFinger(finger);
            }}
            onPressedKeyChange={(code) => setPressedKeyCode(code)}
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
            fontSize={fontSize}
            blindMode={blindMode}
          />

          {/* Hands Guide */}
          {showHandsGuide && (
            <HandsGuide activeFinger={activeFinger} language={activeLesson.language} />
          )}

          {/* Visual Physical Keyboard */}
          {showKeyboard && (
            <Keyboard
              activeKeyCode={activeKeyCode}
              needsShift={needsShift}
              pressedKeyCode={pressedKeyCode}
              language={activeLesson.language}
            />
          )}

          {/* Victory Modal */}
          <LessonCompleteModal
            isOpen={modalOpen}
            lessonTitle={activeLesson.title}
            wpm={lastStats.wpm}
            accuracy={lastStats.accuracy}
            timeSeconds={lastStats.timeSeconds}
            errors={lastStats.errors}
            stars={lastStats.stars}
            xpEarned={lastStats.xpEarned}
            hasNextLesson={Boolean(nextLesson)}
            onNextLesson={() => {
              if (nextLesson) {
                handleSelectLesson(nextLesson);
              }
            }}
            onRetry={() => {
              setModalOpen(false);
              // Force re-render of active lesson
              const curr = activeLesson;
              setActiveLesson(null);
              setTimeout(() => setActiveLesson(curr), 50);
            }}
            onClose={() => {
              setModalOpen(false);
              setActiveLesson(null);
            }}
            language={activeLesson.language}
          />
        </div>
      ) : (
        /* Lessons Catalog / List Mode */
        <div className="flex flex-col gap-6">
          {/* Header Banner */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="text-indigo-600" />
                <span>برنامه گام‌به‌گام آموزش تایپ ده انگشتی</span>
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                از استقرار پایه ردیف خانه تا تسلط کامل بر تمام حروف، اعداد، نیم‌فاصله و متون کهن فارسی.
              </p>
            </div>

            {/* Level filter pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700">
              {[
                { id: 'all', label: 'همه دروس' },
                { id: 'beginner', label: 'مقدماتی' },
                { id: 'intermediate', label: 'متوسط' },
                { id: 'advanced', label: 'پیشرفته' },
                { id: 'en', label: 'English' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() =>
                    setLevelFilter(pill.id as 'all' | 'beginner' | 'intermediate' | 'advanced' | 'en')
                  }
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    levelFilter === pill.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-200/60 dark:hover:bg-slate-700'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLessons.map((lesson, index) => {
              const progress = lessonsProgress[lesson.id];
              const isCompleted = Boolean(progress && progress.stars > 0);
              const stars = progress ? progress.stars : 0;

              return (
                <div
                  key={lesson.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5 group"
                >
                  <div className="flex flex-col gap-3">
                    {/* Top row: Category tag & Stars */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {lesson.level === 'beginner'
                          ? 'مقدماتی'
                          : lesson.level === 'intermediate'
                          ? 'متوسط'
                          : 'پیشرفته'}
                      </span>

                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((starIndex) => (
                          <Star
                            key={starIndex}
                            size={16}
                            className={`${
                              starIndex <= stars
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200 dark:text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Lesson Title & Description */}
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {lesson.description}
                      </p>
                    </div>

                    {/* Target Keys Badges */}
                    {lesson.targetKeys.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[11px] text-slate-400">کلیدها:</span>
                        <div className="flex flex-wrap gap-1">
                          {lesson.targetKeys.map((k, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200/60 dark:border-indigo-800 font-['Vazirmatn']"
                            >
                              {k === '\u200c' ? 'نیم‌فاصله' : k}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom: Best Stats & Action Button */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    {isCompleted ? (
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400">بهترین رکورد</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {toPersianNum(progress.bestWpm)} WPM ({toPersianNum(progress.bestAccuracy)}%)
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">
                        حداقل سرعت: {toPersianNum(lesson.minWpm)} WPM
                      </span>
                    )}

                    <button
                      onClick={() => handleSelectLesson(lesson)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors"
                    >
                      <Play size={14} />
                      <span>{isCompleted ? 'تکرار درس' : 'شروع درس'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
