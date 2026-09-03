import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types/typing';
import { soundManager } from '../utils/sound';
import { Gamepad2, Heart, Trophy, Zap, RotateCcw, Play, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

const PERSIAN_WORDS_POOL = [
  'بهار', 'درخت', 'آسمان', 'شتاب', 'گلستان', 'خورشید', 'پیروزی', 'پرواز',
  'دانش', 'اندیشه', 'فرهنگ', 'روشنایی', 'ستاره', 'سرعت', 'امید', 'تلاش',
  'مهارت', 'زیبایی', 'کتاب', 'نگاه', 'لبخند', 'آرامش', 'جهان', 'دریا',
  'نسیم', 'پروانه', 'روزگار', 'گلاب', 'بیدار', 'فردا', 'پژواک', 'ایمان'
];

const ENGLISH_WORDS_POOL = [
  'apple', 'river', 'sky', 'light', 'speed', 'flame', 'keyboard', 'focus',
  'dream', 'power', 'magic', 'planet', 'bright', 'galaxy', 'future', 'rapid',
  'action', 'energy', 'breeze', 'cloud', 'wonder', 'target', 'legend', 'space'
];

interface FallingWord {
  id: number;
  text: string;
  xPercent: number;
  yPercent: number;
  speed: number;
}

interface TypingGameViewProps {
  language: Language;
}

export const TypingGameView: React.FC<TypingGameViewProps> = ({ language }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [combo, setCombo] = useState<number>(0);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [words, setWords] = useState<FallingWord[]>([]);
  const [gameLang, setGameLang] = useState<Language>(language);
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');

  const nextWordId = useRef<number>(1);
  const frameRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load high score
  useEffect(() => {
    try {
      const saved = localStorage.getItem('typeyar_game_highscore');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {
      // ignore
    }
  }, []);

  const getWordPool = () => (gameLang === 'fa' ? PERSIAN_WORDS_POOL : ENGLISH_WORDS_POOL);

  const spawnWord = () => {
    const pool = getWordPool();
    const randomText = pool[Math.floor(Math.random() * pool.length)];
    const speedMult = difficulty === 'easy' ? 0.22 : difficulty === 'normal' ? 0.35 : 0.55;

    const newWord: FallingWord = {
      id: nextWordId.current++,
      text: randomText,
      xPercent: 10 + Math.random() * 80,
      yPercent: 0,
      speed: speedMult + Math.random() * 0.1,
    };

    setWords((prev) => [...prev, newWord]);
  };

  const handleStartGame = () => {
    setScore(0);
    setLives(3);
    setCombo(0);
    setCurrentInput('');
    setWords([]);
    setGameState('playing');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Spawn words periodically
    const spawnInterval = difficulty === 'easy' ? 2200 : difficulty === 'normal' ? 1700 : 1200;
    spawnTimerRef.current = window.setInterval(spawnWord, spawnInterval);

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setWords((prev) => {
        const nextWords: FallingWord[] = [];
        let lostLife = false;

        for (const w of prev) {
          const newY = w.yPercent + w.speed * delta * 20;
          if (newY >= 88) {
            // Word hit bottom
            lostLife = true;
          } else {
            nextWords.push({ ...w, yPercent: newY });
          }
        }

        if (lostLife) {
          soundManager.playError();
          setCombo(0);
          setLives((l) => {
            if (l <= 1) {
              setGameState('gameover');
              return 0;
            }
            return l - 1;
          });
        }

        return nextWords;
      });

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [gameState, difficulty, gameLang]);

  // Handle game over
  useEffect(() => {
    if (gameState === 'gameover') {
      if (score > highScore) {
        setHighScore(score);
        try {
          localStorage.setItem('typeyar_game_highscore', score.toString());
        } catch {
          // ignore
        }
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
    }
  }, [gameState, score, highScore]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCurrentInput(val);

    // Check if input matches any active falling word
    const matchedIndex = words.findIndex((w) => w.text === val.trim());

    if (matchedIndex !== -1) {
      // Destroy word!
      const destroyedWord = words[matchedIndex];
      soundManager.playKeyClick();
      setWords((prev) => prev.filter((w) => w.id !== destroyedWord.id));
      setCurrentInput('');

      // Add score
      const newCombo = combo + 1;
      const points = 10 * Math.min(newCombo, 5);
      setCombo(newCombo);
      setScore((s) => s + points);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Gamepad2 className="text-indigo-600" />
            <span>بازی تایپ سریع: واژه‌ربا (Word Rush)</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            کلمات در حال سقوط را پیش از رسیدن به خط پایین تایپ کنید تا امتیاز و زنجیره کمبو کسب نمایید!
          </p>
        </div>

        {/* Game stats ribbon */}
        <div className="flex items-center gap-4">
          {/* Hearts */}
          <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 px-3.5 py-2 rounded-2xl border border-rose-200 dark:border-rose-900">
            {[1, 2, 3].map((heartIndex) => (
              <Heart
                key={heartIndex}
                size={20}
                className={`transition-all ${
                  heartIndex <= lives
                    ? 'fill-rose-500 text-rose-500 scale-110'
                    : 'text-slate-300 dark:text-slate-700 opacity-40'
                }`}
              />
            ))}
          </div>

          {/* Score */}
          <div className="flex flex-col bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold">امتیاز فعلی</span>
            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
              {score}
            </span>
          </div>

          {/* High Score */}
          <div className="hidden sm:flex flex-col bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold">رکورد برتر</span>
            <span className="text-xl font-black text-amber-500">
              {highScore}
            </span>
          </div>
        </div>
      </div>

      {/* Game Stage */}
      <div className="relative w-full h-[450px] bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl flex flex-col justify-between p-4">
        {/* Sky background decorations */}
        <div className="absolute inset-0 bg-radial from-indigo-950/40 via-slate-900 to-slate-950 pointer-events-none" />

        {/* Combo Indicator */}
        {combo > 1 && (
          <div className="absolute top-4 left-6 z-20 flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 px-3 py-1 rounded-full text-xs font-black animate-bounce">
            <Flame size={16} />
            <span>کمبو {combo}x!</span>
          </div>
        )}

        {/* Falling Words Arena */}
        <div className="relative flex-1 w-full overflow-hidden">
          {words.map((w) => {
            const isPartiallyMatched = currentInput.trim() && w.text.startsWith(currentInput.trim());

            return (
              <div
                key={w.id}
                style={{
                  left: `${w.xPercent}%`,
                  top: `${w.yPercent}%`,
                  transform: 'translateX(-50%)',
                }}
                className={`
                  absolute px-4 py-2 rounded-2xl font-bold font-['Vazirmatn'] text-sm sm:text-base transition-transform duration-75 shadow-lg
                  ${
                    isPartiallyMatched
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300 scale-110 z-10'
                      : 'bg-slate-800/90 text-white border border-slate-700/80'
                  }
                `}
                dir={gameLang === 'fa' ? 'rtl' : 'ltr'}
              >
                {w.text}
              </div>
            );
          })}
        </div>

        {/* Danger Line */}
        <div className="w-full border-b-2 border-dashed border-rose-500/60 pb-1 mb-2">
          <span className="text-[10px] text-rose-400/80 font-bold px-2">خط سقوط (خطر از دست رفتن جان)</span>
        </div>

        {/* Bottom Typing Input Row */}
        <div className="relative z-20 w-full max-w-md mx-auto">
          {gameState === 'playing' ? (
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              placeholder={gameLang === 'fa' ? 'کلمه را تایپ کنید...' : 'Type word here...'}
              dir={gameLang === 'fa' ? 'rtl' : 'ltr'}
              className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 text-white placeholder-slate-500 border-2 border-indigo-500 font-['Vazirmatn'] text-lg font-bold text-center focus:outline-none focus:ring-4 focus:ring-indigo-500/40 shadow-xl"
              autoFocus
            />
          ) : (
            <div className="text-center">
              <button
                onClick={handleStartGame}
                className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-xl flex items-center gap-2 mx-auto transition-transform active:scale-95"
              >
                <Play size={20} />
                <span>{gameState === 'gameover' ? 'شروع بازی مجدد' : 'شروع بازی'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Game Over Modal Screen */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center mb-3">
              <Trophy size={36} />
            </div>
            <h3 className="text-2xl font-black text-white mb-1">پایان بازی!</h3>
            <p className="text-sm text-slate-400 mb-4">
              امتیاز نهایی شما:{' '}
              <span className="text-xl font-black text-amber-400">{score}</span>
            </p>
            <button
              onClick={handleStartGame}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg"
            >
              <RotateCcw size={18} />
              <span>تلاش دوباره</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
