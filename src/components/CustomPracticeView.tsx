import React, { useState } from 'react';
import { Language } from '../types/typing';
import { PRESET_TEXTS, PresetText } from '../data/presetTexts';
import { FileText, Upload, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

interface CustomPracticeViewProps {
  onStartPractice: (text: string, lang: Language) => void;
  language: Language;
}

export const CustomPracticeView: React.FC<CustomPracticeViewProps> = ({
  onStartPractice,
  language,
}) => {
  const [customText, setCustomText] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [detectedLang, setDetectedLang] = useState<Language>(language);

  // Filter presets
  const filteredPresets = PRESET_TEXTS.filter((p) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'english') return p.language === 'en';
    if (activeCategory === 'persian') return p.language === 'fa';
    return p.category === activeCategory;
  });

  const handleSelectPreset = (preset: PresetText) => {
    setCustomText(preset.text);
    setDetectedLang(preset.language);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCustomText(content.trim());
        // Simple language detection
        const hasPersian = /[\u0600-\u06FF]/.test(content);
        setDetectedLang(hasPersian ? 'fa' : 'en');
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleStart = () => {
    const trimmed = customText.trim();
    if (!trimmed) return;
    const hasPersian = /[\u0600-\u06FF]/.test(trimmed);
    const lang = hasPersian ? 'fa' : 'en';
    onStartPractice(trimmed, lang);
  };

  const wordCount = customText.trim() ? customText.trim().split(/\s+/).length : 0;
  const charCount = customText.length;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="text-indigo-600" />
            <span>تمرین آزاد با متون دلخواه و کتابخانه ادبی</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            متن دلخواه خود را جای‌گذاری کنید، فایل متنی بارگذاری نمایید یا از گزیده‌های شاهنامه، مثنوی، گلستان و مقالات مدرن استفاده فرمایید.
          </p>
        </div>

        {/* Upload Button */}
        <label className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-sm cursor-pointer border border-indigo-200 dark:border-indigo-800 transition-colors shrink-0">
          <Upload size={18} />
          <span>بارگذاری فایل متنی (.txt)</span>
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Main Grid: Custom Input + Preset Library */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Text Box */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-600" />
                متن تمرین شما
              </span>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{wordCount} کلمه</span>
                <span>•</span>
                <span>{charCount} حرف</span>
              </div>
            </div>

            <textarea
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                const hasPersian = /[\u0600-\u06FF]/.test(e.target.value);
                setDetectedLang(hasPersian ? 'fa' : 'en');
              }}
              placeholder="متن فارسی یا انگلیسی مورد نظر خود را در این بخش بنویسید یا الصاق کنید..."
              dir={detectedLang === 'fa' ? 'rtl' : 'ltr'}
              rows={8}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-['Vazirmatn'] text-slate-800 dark:text-slate-100 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                زبان تشخیص داده شده:{' '}
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {detectedLang === 'fa' ? 'فارسی (RTL)' : 'English (LTR)'}
                </span>
              </span>

              <button
                disabled={!customText.trim()}
                onClick={handleStart}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-md shadow-indigo-200 dark:shadow-none transition-colors"
              >
                <span>شروع تمرین این متن</span>
                <ArrowRight size={18} className="rotate-180" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Curated Preset Texts Library */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-600" />
                کتابخانه متون پیشنهادی
              </span>
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'همه' },
                { id: 'literature', label: 'شعر و ادب' },
                { id: 'proverbs', label: 'ضرب‌المثل‌ها' },
                { id: 'tech', label: 'فناوری' },
                { id: 'english', label: 'انگلیسی' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Preset Cards List */}
            <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 border border-slate-200/80 dark:border-slate-800 cursor-pointer transition-all flex flex-col gap-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {preset.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                      {preset.authorOrSource}
                    </span>
                  </div>
                  <p
                    className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed"
                    dir={preset.language === 'fa' ? 'rtl' : 'ltr'}
                  >
                    {preset.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
