import React, { useState, useEffect } from 'react';
import { ActiveTab, Finger, Language, UserProfile, UserSettings } from './types/typing';
import {
  loadProfile,
  saveProfile,
  addXpToProfile,
  loadSettings,
  saveSettings,
  loadLessonsProgress,
  saveLessonProgress,
} from './utils/storage';
import { soundManager } from './utils/sound';
import { Navbar } from './components/Navbar';
import { LessonsView } from './components/LessonsView';
import { SpeedTestView } from './components/SpeedTestView';
import { CustomPracticeView } from './components/CustomPracticeView';
import { WeakKeysView } from './components/WeakKeysView';
import { TypingGameView } from './components/TypingGameView';
import { StatsView } from './components/StatsView';
import { SettingsModal } from './components/SettingsModal';
import { GuideModal } from './components/GuideModal';
import { TypingArea } from './components/TypingArea';
import { Keyboard } from './components/Keyboard';
import { HandsGuide } from './components/HandsGuide';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('lessons');
  const [language, setLanguage] = useState<Language>('fa');
  const [userProfile, setUserProfile] = useState<UserProfile>(loadProfile());
  const [settings, setSettings] = useState<UserSettings>(loadSettings());
  const [lessonsProgress, setLessonsProgress] = useState(loadLessonsProgress());

  // Modals
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Standalone Custom Practice Session (launched from Custom Text or Weak Keys)
  const [activeCustomPractice, setActiveCustomPractice] = useState<{
    text: string;
    lang: Language;
    title: string;
  } | null>(null);

  const [activeKeyCode, setActiveKeyCode] = useState<string | null>(null);
  const [needsShift, setNeedsShift] = useState<boolean>(false);
  const [activeFinger, setActiveFinger] = useState<Finger | null>(null);
  const [pressedKeyCode, setPressedKeyCode] = useState<string | null>(null);
  const [customComplete, setCustomComplete] = useState<boolean>(false);
  const [customStats, setCustomStats] = useState<{ wpm: number; accuracy: number; time: number } | null>(null);

  // Sync sound config
  useEffect(() => {
    soundManager.setConfig(settings.soundEnabled, settings.soundType, settings.volume);
  }, [settings.soundEnabled, settings.soundType, settings.volume]);

  // Update Profile Name
  const handleUpdateUserName = (newName: string) => {
    const updated = { ...userProfile, name: newName };
    setUserProfile(updated);
    saveProfile(updated);
  };

  // Update Settings
  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Lesson finished handler
  const handleLessonFinished = (
    lessonId: string,
    stats: { wpm: number; accuracy: number; stars: number }
  ) => {
    saveLessonProgress(lessonId, stats);
    setLessonsProgress(loadLessonsProgress());
    const updatedProfile = addXpToProfile(stats.stars * 35);
    setUserProfile(updatedProfile);
  };

  // Custom Practice Start
  const handleStartCustomPractice = (text: string, lang: Language, title = 'تمرین متن دلخواه') => {
    setActiveCustomPractice({ text, lang, title });
    setCustomComplete(false);
    setCustomStats(null);
  };

  const handleCustomPracticeComplete = (stats: {
    wpm: number;
    cpm: number;
    accuracy: number;
    errors: number;
    timeSeconds: number;
  }) => {
    soundManager.playSuccess();
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setCustomStats({
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      time: stats.timeSeconds,
    });
    setCustomComplete(true);
    const updated = addXpToProfile(50);
    setUserProfile(updated);
  };

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-['Vazirmatn'] transition-colors"
      dir={language === 'fa' ? 'rtl' : 'ltr'}
    >
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveCustomPractice(null);
          setActiveTab(tab);
        }}
        language={language}
        onToggleLanguage={() => setLanguage((l) => (l === 'fa' ? 'en' : 'fa'))}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() =>
          handleUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })
        }
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        streakDays={userProfile.streakDays}
        userLevel={userProfile.level}
        userXp={userProfile.xp}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* If user is in an active custom practice session */}
        {activeCustomPractice ? (
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveCustomPractice(null)}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                  title="بازگشت"
                >
                  <ArrowRight size={18} className={language === 'fa' ? '' : 'rotate-180'} />
                </button>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {activeCustomPractice.title}
                  </h2>
                  <span className="text-xs text-slate-400">
                    زبان:{' '}
                    {activeCustomPractice.lang === 'fa' ? 'فارسی استاندارد' : 'English QWERTY'}
                  </span>
                </div>
              </div>
            </div>

            {/* Typing Area */}
            {!customComplete ? (
              <>
                <TypingArea
                  targetText={activeCustomPractice.text}
                  language={activeCustomPractice.lang}
                  onComplete={handleCustomPracticeComplete}
                  onActiveKeyChange={(code, shift, finger) => {
                    setActiveKeyCode(code);
                    setNeedsShift(shift);
                    setActiveFinger(finger);
                  }}
                  onPressedKeyChange={(code) => setPressedKeyCode(code)}
                  soundEnabled={settings.soundEnabled}
                  onToggleSound={() =>
                    handleUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })
                  }
                  fontSize={settings.fontSize}
                  blindMode={settings.blindMode}
                />

                {settings.showHandsGuide && (
                  <HandsGuide
                    activeFinger={activeFinger}
                    language={activeCustomPractice.lang}
                  />
                )}

                {settings.showKeyboard && (
                  <Keyboard
                    activeKeyCode={activeKeyCode}
                    needsShift={needsShift}
                    pressedKeyCode={pressedKeyCode}
                    language={activeCustomPractice.lang}
                  />
                )}
              </>
            ) : (
              /* Custom Practice Victory Card */
              <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center gap-5 animate-fadeIn">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  تمرین با موفقیت به پایان رسید!
                </h3>
                {customStats && (
                  <div className="grid grid-cols-3 gap-3 w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400">سرعت</span>
                      <span className="text-lg font-black text-indigo-600">
                        {customStats.wpm} WPM
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400">دقت</span>
                      <span className="text-lg font-black text-emerald-600">
                        {customStats.accuracy}%
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400">زمان</span>
                      <span className="text-lg font-black text-slate-700 dark:text-slate-200">
                        {customStats.time}s
                      </span>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setActiveCustomPractice(null)}
                  className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors"
                >
                  بازگشت
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Normal Tab Content */
          <>
            {activeTab === 'lessons' && (
              <LessonsView
                language={language}
                lessonsProgress={lessonsProgress}
                onLessonFinished={handleLessonFinished}
                soundEnabled={settings.soundEnabled}
                onToggleSound={() =>
                  handleUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })
                }
                showKeyboard={settings.showKeyboard}
                showHandsGuide={settings.showHandsGuide}
                fontSize={settings.fontSize}
                blindMode={settings.blindMode}
              />
            )}

            {activeTab === 'speed_test' && (
              <SpeedTestView
                language={language}
                userName={userProfile.name}
                onUpdateUserName={handleUpdateUserName}
              />
            )}

            {activeTab === 'custom_practice' && (
              <CustomPracticeView
                onStartPractice={(text, lang) =>
                  handleStartCustomPractice(text, lang, 'تمرین متن انتخابی')
                }
                language={language}
              />
            )}

            {activeTab === 'weak_keys' && (
              <WeakKeysView
                onStartPractice={(text, lang) =>
                  handleStartCustomPractice(text, lang, 'تمرین کلیدهای ضعیف')
                }
                language={language}
              />
            )}

            {activeTab === 'game' && <TypingGameView language={language} />}

            {activeTab === 'stats' && <StatsView />}
          </>
        )}
      </main>

      {/* Modals */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        language={language}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        userName={userProfile.name}
        onUpdateUserName={handleUpdateUserName}
        language={language}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 py-6 mt-12 text-xs text-slate-500 dark:text-slate-400 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              تایپ‌یار (TypeYar)
            </span>
            <span>—</span>
            <span>پلتفرم تخصصی آموزش و سنجش تایپ ده انگشتی استاندارد فارسی و انگلیسی</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>کیبورد استاندارد ایران (ISIRI 9147)</span>
            <span>•</span>
            <span>پشتیبانی از نیم‌فاصله</span>
            <span>•</span>
            <span>صدور گواهی رسمی تایپ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
