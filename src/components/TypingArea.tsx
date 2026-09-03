import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Finger, Language } from '../types/typing';
import { findKeyForChar } from '../utils/keyboardLayouts';
import { soundManager } from '../utils/sound';
import { recordKeyHit } from '../utils/storage';
import { RotateCcw, Volume2, VolumeX, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface TypingStats {
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
  timeSeconds: number;
}

interface TypingAreaProps {
  targetText: string;
  language: Language;
  onComplete: (stats: TypingStats) => void;
  onActiveKeyChange: (keyCode: string | null, needsShift: boolean, finger: Finger | null) => void;
  onPressedKeyChange: (keyCode: string | null) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  fontSize?: 'normal' | 'large' | 'xlarge';
  blindMode?: boolean;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  targetText,
  language,
  onComplete,
  onActiveKeyChange,
  onPressedKeyChange,
  soundEnabled,
  onToggleSound,
  fontSize = 'normal',
  blindMode = false,
}) => {
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [mistakeIndices, setMistakeIndices] = useState<Set<number>>(new Set());
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [hasCurrentError, setHasCurrentError] = useState<boolean>(false);
  const [totalKeyPresses, setTotalKeyPresses] = useState<number>(0);
  const [showBlind, setShowBlind] = useState<boolean>(blindMode);

  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  const currentIndex = typedChars.length;
  const currentChar = targetText[currentIndex] || '';

  // Calculate live statistics
  const correctCount = typedChars.reduce((acc, char, idx) => {
    return char === targetText[idx] ? acc + 1 : acc;
  }, 0);

  const accuracy = totalKeyPresses > 0 ? Math.round((correctCount / totalKeyPresses) * 100) : 100;
  const minutes = Math.max(0.001, elapsedTime / 60);
  const wpm = Math.round(correctCount / 5 / minutes);
  const cpm = Math.round(correctCount / minutes);

  // Focus input
  const handleFocusArea = () => {
    setIsFocused(true);
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  };

  // Reset state
  const handleReset = useCallback(() => {
    setTypedChars([]);
    setMistakeIndices(new Set());
    setIsStarted(false);
    setIsFinished(false);
    setStartTime(null);
    setElapsedTime(0);
    setHasCurrentError(false);
    setTotalKeyPresses(0);
    if (timerRef.current) clearInterval(timerRef.current);
    handleFocusArea();
  }, []);

  // Update active target key for keyboard & hands guide
  useEffect(() => {
    if (isFinished || currentIndex >= targetText.length) {
      onActiveKeyChange(null, false, null);
      return;
    }

    const keyInfo = findKeyForChar(currentChar, language);
    if (keyInfo) {
      onActiveKeyChange(keyInfo.key.code, keyInfo.needsShift, keyInfo.key.finger);
    } else {
      onActiveKeyChange(null, false, null);
    }
  }, [currentIndex, currentChar, language, isFinished, targetText, onActiveKeyChange]);

  // Timer runner
  useEffect(() => {
    if (isStarted && !isFinished) {
      timerRef.current = window.setInterval(() => {
        if (startTime) {
          const seconds = Math.floor((Date.now() - startTime) / 1000);
          setElapsedTime(seconds);
        }
      }, 500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, isFinished, startTime]);

  // Handle Typing Keydown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isFinished) return;

    // Report pressed physical key for tactile keyboard feedback
    onPressedKeyChange(e.code);
    setTimeout(() => onPressedKeyChange(null), 120);

    // Allow browser reload/tools
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    // Prevent default scrolling on space
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
    }

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typedChars.length > 0) {
        setTypedChars((prev) => prev.slice(0, -1));
        setHasCurrentError(false);
      }
      return;
    }

    // Key inputs (letters, punctuation, space, and Persian ZWNJ Shift+Space)
    let charTyped = e.key;

    // Normalize Persian ZWNJ (نیم‌فاصله) via Shift + Space or standard key
    if (e.shiftKey && (e.code === 'Space' || e.key === ' ')) {
      charTyped = '\u200c';
    } else if (e.key === 'Dead' || e.key.length > 1) {
      // Ignore functional keys like Shift, CapsLock, Arrow keys, etc.
      return;
    }

    e.preventDefault();

    // Start timer on first keypress
    if (!isStarted) {
      setIsStarted(true);
      setStartTime(Date.now());
    }

    setTotalKeyPresses((prev) => prev + 1);

    const expectedChar = targetText[currentIndex];
    const isCorrect = charTyped === expectedChar;

    // Record stats for weak keys analytics
    recordKeyHit(expectedChar, !isCorrect);

    if (isCorrect) {
      soundManager.playKeyClick();
      setHasCurrentError(false);
    } else {
      soundManager.playError();
      setHasCurrentError(true);
      setMistakeIndices((prev) => {
        const next = new Set(prev);
        next.add(currentIndex);
        return next;
      });
    }

    const nextTyped = [...typedChars, charTyped];
    setTypedChars(nextTyped);

    // Check if finished
    if (nextTyped.length >= targetText.length) {
      setIsFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
      soundManager.playSuccess();

      const finalElapsed = startTime ? Math.max(1, Math.floor((Date.now() - startTime) / 1000)) : 1;
      const finalMinutes = Math.max(0.01, finalElapsed / 60);
      const finalCorrect = nextTyped.reduce((acc, c, i) => (c === targetText[i] ? acc + 1 : acc), 0);
      const finalWpm = Math.round(finalCorrect / 5 / finalMinutes);
      const finalCpm = Math.round(finalCorrect / finalMinutes);
      const finalAccuracy = Math.round((finalCorrect / (totalKeyPresses + 1)) * 100);

      onComplete({
        wpm: finalWpm,
        cpm: finalCpm,
        accuracy: Math.min(100, finalAccuracy),
        errors: mistakeIndices.size + (isCorrect ? 0 : 1),
        timeSeconds: finalElapsed,
      });
    }
  };

  const fontSizeClass =
    fontSize === 'xlarge'
      ? 'text-2xl sm:text-3xl leading-relaxed'
      : fontSize === 'large'
      ? 'text-xl sm:text-2xl leading-relaxed'
      : 'text-lg sm:text-xl leading-relaxed';

  // Format Persian/Arabic numbers for natural RTL display
  const toPersianNum = (n: number | string) => {
    if (language === 'en') return String(n);
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(n).replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
      {/* Top Metrics Ribbon */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Real-time stats */}
        <div className="flex items-center gap-6 sm:gap-8">
          {/* WPM */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {language === 'fa' ? 'سرعت (کلمه/دقیقه)' : 'Speed (WPM)'}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-['Vazirmatn']">
                {toPersianNum(wpm)}
              </span>
              <span className="text-xs text-slate-400">WPM</span>
            </div>
          </div>

          {/* Accuracy */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {language === 'fa' ? 'دقت' : 'Accuracy'}
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-2xl sm:text-3xl font-black font-['Vazirmatn'] ${
                  accuracy >= 95
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : accuracy >= 85
                    ? 'text-amber-500'
                    : 'text-rose-600'
                }`}
              >
                {toPersianNum(accuracy)}%
              </span>
            </div>
          </div>

          {/* Time Elapsed */}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {language === 'fa' ? 'زمان' : 'Time'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-700 dark:text-slate-300 font-['Vazirmatn']">
              {toPersianNum(elapsedTime)}s
            </span>
          </div>

          {/* Mistakes */}
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {language === 'fa' ? 'خطاها' : 'Errors'}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-rose-500 font-['Vazirmatn']">
              {toPersianNum(mistakeIndices.size)}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Blind Mode Toggle */}
          <button
            onClick={() => setShowBlind(!showBlind)}
            title={language === 'fa' ? 'حالت تایپ کور' : 'Blind typing mode'}
            className={`p-2 rounded-xl border transition-colors ${
              showBlind
                ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            {showBlind ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={language === 'fa' ? 'صدای کیبورد' : 'Sound effects'}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-sm font-semibold transition-colors"
          >
            <RotateCcw size={16} />
            <span>{language === 'fa' ? 'شروع مجدد' : 'Restart'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-indigo-600 h-full transition-all duration-150 rounded-full"
          style={{ width: `${Math.min(100, (currentIndex / targetText.length) * 100)}%` }}
        />
      </div>

      {/* Typing Display Canvas */}
      <div
        ref={containerRef}
        onClick={handleFocusArea}
        className={`
          relative min-h-[170px] sm:min-h-[200px] p-6 sm:p-8 rounded-2xl sm:rounded-3xl cursor-text transition-all duration-200
          bg-white dark:bg-slate-900 border-2
          ${
            hasCurrentError
              ? 'border-rose-400 dark:border-rose-600 shadow-rose-100 dark:shadow-rose-950/30'
              : isFocused
              ? 'border-indigo-400 dark:border-indigo-600 shadow-lg shadow-indigo-100 dark:shadow-indigo-950/20'
              : 'border-slate-200 dark:border-slate-800'
          }
        `}
        dir={language === 'fa' ? 'rtl' : 'ltr'}
      >
        {/* Hidden input to receive focus and keyboard events */}
        <input
          ref={hiddenInputRef}
          type="text"
          className="opacity-0 absolute -top-10 left-0 w-1 h-1 pointer-events-none"
          onKeyDown={handleKeyDown}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        {/* Focus warning if blurred */}
        {!isFocused && (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-[2px] rounded-2xl sm:rounded-3xl flex items-center justify-center z-20">
            <div className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 font-medium text-sm animate-bounce">
              <AlertCircle size={18} />
              <span>
                {language === 'fa'
                  ? 'برای ادامه تایپ، اینجا کلیک کنید'
                  : 'Click here to focus and continue typing'}
              </span>
            </div>
          </div>
        )}

        {/* Text stream */}
        <div className={`select-none font-['Vazirmatn'] ${fontSizeClass} flex flex-wrap items-baseline gap-y-2`}>
          {targetText.split('').map((char, index) => {
            const isTyped = index < currentIndex;
            const isCurrent = index === currentIndex;
            const typedChar = typedChars[index];
            const isMatch = isTyped && typedChar === char;
            const isError = isTyped && !isMatch;

            // Half-space indicator
            const isHalfSpace = char === '\u200c';
            const displayChar = isHalfSpace ? '‌' : char === ' ' ? ' ' : char;

            let charStyle = 'text-slate-400 dark:text-slate-600'; // Default pending

            if (isTyped) {
              if (showBlind) {
                charStyle = 'text-indigo-600 dark:text-indigo-400 font-semibold';
              } else if (isMatch) {
                charStyle = 'text-slate-900 dark:text-slate-100 font-semibold';
              } else {
                charStyle =
                  'text-white bg-rose-500 rounded px-0.5 font-bold shadow-sm ring-1 ring-rose-600';
              }
            } else if (isCurrent) {
              charStyle = hasCurrentError
                ? 'text-rose-600 bg-rose-100 dark:bg-rose-950/60 rounded px-1 animate-pulse font-bold'
                : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded px-1 font-bold';
            }

            return (
              <span
                key={index}
                className={`relative transition-colors duration-75 inline-block ${charStyle} ${
                  isHalfSpace ? 'border-b-2 border-dashed border-indigo-400 px-0.5 mx-0.5' : ''
                }`}
              >
                {/* Blinking Caret */}
                {isCurrent && (
                  <span
                    className={`absolute ${
                      language === 'fa' ? '-right-0.5' : '-left-0.5'
                    } top-1 bottom-1 w-0.5 bg-indigo-600 dark:bg-indigo-400 animate-caret`}
                  />
                )}
                {displayChar}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
