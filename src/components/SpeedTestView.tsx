import React, { useState, useEffect, useRef } from 'react';
import { Language, TestResult } from '../types/typing';
import { PRESET_TEXTS } from '../data/presetTexts';
import { soundManager } from '../utils/sound';
import { saveTestResult, recordKeyHit } from '../utils/storage';
import { Timer, Trophy, RotateCcw, Award, Printer, CheckCircle, Share2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpeedTestViewProps {
  language: Language;
  userName: string;
  onUpdateUserName: (name: string) => void;
}

export const SpeedTestView: React.FC<SpeedTestViewProps> = ({
  language,
  userName,
  onUpdateUserName,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(60); // 60, 120, 300
  const [testLanguage, setTestLanguage] = useState<Language>(language);
  const [targetText, setTargetText] = useState<string>('');
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [mistakeIndices, setMistakeIndices] = useState<Set<number>>(new Set());
  const [totalKeyPresses, setTotalKeyPresses] = useState<number>(0);

  const [testState, setTestState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [result, setResult] = useState<TestResult | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  // Pick random rich text from presets
  const prepareText = (lang: Language) => {
    const candidates = PRESET_TEXTS.filter((t) => t.language === lang);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    // Repeat if needed so learner doesn't run out of text during 5 min test
    return `${chosen.text} ${chosen.text} ${chosen.text}`;
  };

  const handleStartNewTest = (duration = selectedDuration, lang = testLanguage) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedDuration(duration);
    setTestLanguage(lang);
    setTargetText(prepareText(lang));
    setTypedChars([]);
    setMistakeIndices(new Set());
    setTotalKeyPresses(0);
    setTimeLeft(duration);
    setTestState('idle');
    setResult(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  useEffect(() => {
    handleStartNewTest(60, language);
  }, [language]);

  // Timer countdown
  useEffect(() => {
    if (testState === 'running') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testState]);

  const calculateRank = (wpm: number) => {
    if (wpm >= 70) return 'استاد اعظم تایپ ده انگشتی (Master Typist)';
    if (wpm >= 50) return 'تایپیست فوق سریع و حرفه‌ای (Pro Typist)';
    if (wpm >= 35) return 'تایپیست ماهر و باثبات (Skilled Typist)';
    if (wpm >= 20) return 'تایپیست متوسط (Intermediate Typist)';
    return 'تایپیست مقدماتی (Beginner Typist)';
  };

  const handleFinishTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTestState('finished');
    soundManager.playSuccess();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });

    const elapsedSeconds = selectedDuration - timeLeft || selectedDuration;
    const minutes = Math.max(0.01, elapsedSeconds / 60);

    const correctCount = typedChars.reduce((acc, c, i) => (c === targetText[i] ? acc + 1 : acc), 0);
    const finalWpm = Math.round(correctCount / 5 / minutes);
    const finalCpm = Math.round(correctCount / minutes);
    const finalAccuracy = totalKeyPresses > 0 ? Math.round((correctCount / totalKeyPresses) * 100) : 100;

    const testRes: TestResult = {
      id: `TY-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('fa-IR'),
      wpm: finalWpm,
      cpm: finalCpm,
      accuracy: Math.min(100, finalAccuracy),
      durationSeconds: selectedDuration,
      language: testLanguage,
      errorCount: mistakeIndices.size,
      totalChars: typedChars.length,
      rankTitle: calculateRank(finalWpm),
    };

    setResult(testRes);
    saveTestResult(testRes);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (testState === 'finished') return;

    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typedChars.length > 0) {
        setTypedChars((prev) => prev.slice(0, -1));
      }
      return;
    }

    let char = e.key;
    if (e.shiftKey && (e.code === 'Space' || e.key === ' ')) {
      char = '\u200c'; // Persian ZWNJ
    } else if (e.key.length > 1) {
      return;
    }

    e.preventDefault();

    if (testState === 'idle') {
      setTestState('running');
    }

    setTotalKeyPresses((prev) => prev + 1);

    const currentIndex = typedChars.length;
    const expected = targetText[currentIndex];
    const isCorrect = char === expected;

    recordKeyHit(expected, !isCorrect);

    if (isCorrect) {
      soundManager.playKeyClick();
    } else {
      soundManager.playError();
      setMistakeIndices((prev) => {
        const next = new Set(prev);
        next.add(currentIndex);
        return next;
      });
    }

    const next = [...typedChars, char];
    setTypedChars(next);

    if (next.length >= targetText.length) {
      handleFinishTest();
    }
  };

  const toPersianNum = (n: number | string) => {
    if (testLanguage === 'en') return String(n);
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(n).replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
  };

  const currentIndex = typedChars.length;
  const correctCount = typedChars.reduce((acc, c, i) => (c === targetText[i] ? acc + 1 : acc), 0);
  const elapsed = selectedDuration - timeLeft;
  const currentMinutes = Math.max(0.01, elapsed / 60);
  const liveWpm = elapsed > 0 ? Math.round(correctCount / 5 / currentMinutes) : 0;
  const liveAccuracy = totalKeyPresses > 0 ? Math.round((correctCount / totalKeyPresses) * 100) : 100;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Test Setup / Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Timer className="text-indigo-600" />
            <span>آزمون رسمی سنجش سرعت و دقت تایپ</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            با شروع تایپ، زمان‌سنج آغاز می‌شود. پس از پایان، گواهی رسمی تایپ ده انگشتی صادر خواهد شد.
          </p>
        </div>

        {/* Controls: Duration & Language */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Duration choices */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            {[60, 120, 300].map((dur) => (
              <button
                key={dur}
                disabled={testState === 'running'}
                onClick={() => handleStartNewTest(dur, testLanguage)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDuration === dur
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {dur === 60 ? '۱ دقیقه' : dur === 120 ? '۲ دقیقه' : '۵ دقیقه'}
              </button>
            ))}
          </div>

          {/* Language choice */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              disabled={testState === 'running'}
              onClick={() => handleStartNewTest(selectedDuration, 'fa')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                testLanguage === 'fa'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              فارسی
            </button>
            <button
              disabled={testState === 'running'}
              onClick={() => handleStartNewTest(selectedDuration, 'en')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                testLanguage === 'en'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              English
            </button>
          </div>

          <button
            onClick={() => handleStartNewTest()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            <RotateCcw size={14} />
            <span>آزمون جدید</span>
          </button>
        </div>
      </div>

      {testState !== 'finished' ? (
        <>
          {/* Live Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Timer card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                  timeLeft <= 10
                    ? 'bg-rose-100 text-rose-600 animate-pulse'
                    : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                }`}
              >
                <Timer size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-semibold">زمان باقی‌مانده</span>
                <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  {toPersianNum(timeLeft)} ثانیه
                </span>
              </div>
            </div>

            {/* Live WPM */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                <Trophy size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-semibold">سرعت فعلی</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {toPersianNum(liveWpm)}{' '}
                  <span className="text-xs text-slate-400 font-normal">WPM</span>
                </span>
              </div>
            </div>

            {/* Live Accuracy */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <CheckCircle size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-semibold">دقت تایپ</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {toPersianNum(liveAccuracy)}%
                </span>
              </div>
            </div>

            {/* Total characters typed */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                <Award size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-semibold">حروف تایپ شده</span>
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {toPersianNum(typedChars.length)}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Typing Canvas */}
          <div
            onClick={() => {
              setIsFocused(true);
              inputRef.current?.focus();
            }}
            className="relative min-h-[220px] bg-white dark:bg-slate-900 border-2 border-indigo-400 dark:border-indigo-700 rounded-3xl p-6 sm:p-8 cursor-text shadow-lg shadow-indigo-100/50 dark:shadow-none transition-all"
            dir={testLanguage === 'fa' ? 'rtl' : 'ltr'}
          >
            <input
              ref={inputRef}
              type="text"
              className="opacity-0 absolute -top-10 left-0 w-1 h-1 pointer-events-none"
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoComplete="off"
              spellCheck="false"
            />

            {!isFocused && (
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-[2px] rounded-3xl flex items-center justify-center z-10">
                <div className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 font-bold text-sm animate-bounce">
                  <AlertCircle size={18} />
                  <span>برای شروع آزمون، اینجا کلیک کنید</span>
                </div>
              </div>
            )}

            <div className="select-none font-['Vazirmatn'] text-xl sm:text-2xl leading-relaxed flex flex-wrap items-baseline gap-y-2">
              {targetText.split('').map((char, index) => {
                const isTyped = index < currentIndex;
                const isCurrent = index === currentIndex;
                const typed = typedChars[index];
                const isMatch = isTyped && typed === char;

                let charClass = 'text-slate-400 dark:text-slate-600';
                if (isTyped) {
                  charClass = isMatch
                    ? 'text-slate-900 dark:text-slate-100 font-semibold'
                    : 'text-white bg-rose-500 rounded px-0.5 font-bold';
                } else if (isCurrent) {
                  charClass = 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 rounded px-1 font-bold';
                }

                return (
                  <span key={index} className={`relative inline-block ${charClass}`}>
                    {isCurrent && (
                      <span
                        className={`absolute ${
                          testLanguage === 'fa' ? '-right-0.5' : '-left-0.5'
                        } top-1 bottom-1 w-0.5 bg-indigo-600 animate-caret`}
                      />
                    )}
                    {char === '\u200c' ? '‌' : char}
                  </span>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* Official Certificate Display */
        result && (
          <div className="w-full flex flex-col items-center gap-6 animate-fadeIn">
            {/* The Certificate Paper */}
            <div
              id="typing-certificate"
              className="w-full max-w-3xl bg-gradient-to-br from-amber-50/40 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-8 sm:p-12 rounded-3xl border-8 border-double border-amber-300/80 dark:border-amber-600/60 shadow-2xl relative overflow-hidden"
              dir="rtl"
            >
              {/* Watermark Seal */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col items-center text-center gap-4 relative z-10">
                {/* Crest */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-900 flex items-center justify-center shadow-lg ring-4 ring-amber-100 dark:ring-amber-950">
                  <Award size={44} />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs tracking-widest font-black text-amber-700 dark:text-amber-400 uppercase">
                    سامانه هوشمند تایپ‌یار
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    گواهی‌نامه رسمی مهارت تایپ ده‌انگشتی
                  </h1>
                  <span className="text-xs text-slate-400">
                    شناسه اعتبارسنجی: {result.id} | تاریخ: {result.date}
                  </span>
                </div>

                <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent my-1" />

                {/* Candidate Name Input / Display */}
                <p className="text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                  بدین‌وسیله گواهی می‌شود که داوطلب گرامی{' '}
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => onUpdateUserName(e.target.value)}
                    className="inline-block mx-1 px-3 py-1 font-black text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-400 bg-transparent text-center focus:outline-none text-lg min-w-[140px]"
                    placeholder="نام و نام خانوادگی شما"
                  />
                  با موفقیت در آزمون استاندارد سرعت و دقت تایپ ده انگشتی به مدت{' '}
                  <span className="font-bold">{result.durationSeconds} ثانیه</span> شرکت نموده و به
                  نتایج ممتاز زیر دست یافته است:
                </p>

                {/* Big Score Badges */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-xl my-3">
                  <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
                    <span className="text-xs text-slate-400 font-semibold">سرعت تایپ (WPM)</span>
                    <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                      {toPersianNum(result.wpm)}
                    </span>
                    <span className="text-[10px] text-slate-400">کلمه در دقیقه</span>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
                    <span className="text-xs text-slate-400 font-semibold">دقت نهایی</span>
                    <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                      {toPersianNum(result.accuracy)}%
                    </span>
                    <span className="text-[10px] text-slate-400">بدون احتساب خطاها</span>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
                    <span className="text-xs text-slate-400 font-semibold">کل کاراکترها (CPM)</span>
                    <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
                      {toPersianNum(result.cpm)}
                    </span>
                    <span className="text-[10px] text-slate-400">حرف در دقیقه</span>
                  </div>
                </div>

                {/* Certified Rank Title */}
                <div className="py-2 px-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-bold text-sm sm:text-base">
                  رتبه مهارتی اعطا شده: <span className="underline">{result.rankTitle}</span>
                </div>

                {/* Signatures */}
                <div className="flex justify-between w-full max-w-lg mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      مهر رسمی سامانه تایپ‌یار
                    </span>
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-400 mt-2 flex items-center justify-center text-[10px] text-amber-600 font-bold">
                      تأیید شد
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-end">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      پلتفرم استاندارد آموزش تایپ
                    </span>
                    <span className="text-slate-400 mt-1">TypeYar Touch Typing System</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons for Certificate */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-colors"
              >
                <Printer size={18} />
                <span>چاپ یا ذخیره گواهی (PDF)</span>
              </button>

              <button
                onClick={() => handleStartNewTest()}
                className="flex items-center gap-2 py-3 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold transition-colors"
              >
                <RotateCcw size={18} />
                <span>تکرار آزمون</span>
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};
