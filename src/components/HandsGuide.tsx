import React from 'react';
import { Finger } from '../types/typing';
import { FINGER_INFOS } from '../utils/keyboardLayouts';

interface HandsGuideProps {
  activeFinger: Finger | null;
  language: 'fa' | 'en';
}

export const HandsGuide: React.FC<HandsGuideProps> = ({ activeFinger, language }) => {
  const currentFingerInfo = activeFinger ? FINGER_INFOS[activeFinger] : null;

  const isLeftFingerActive = (f: Finger) => activeFinger === f;
  const isRightFingerActive = (f: Finger) => activeFinger === f;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Active finger guidance label */}
      <div className="flex items-center gap-3">
        <div
          className="w-4 h-4 rounded-full transition-colors duration-200 shadow-sm"
          style={{ backgroundColor: currentFingerInfo?.color || '#94a3b8' }}
        />
        <div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
            {language === 'fa' ? 'انگشت پیشنهادی برای کلید فعلی:' : 'Recommended finger for key:'}
          </span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {currentFingerInfo
              ? language === 'fa'
                ? currentFingerInfo.nameFa
                : currentFingerInfo.nameEn
              : language === 'fa'
              ? 'هر دو دست روی ردیف خانه'
              : 'Both hands on home row'}
          </span>
        </div>
      </div>

      {/* Visual Hands Representation */}
      <div className="flex items-center gap-8 px-2">
        {/* Left Hand */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-semibold text-slate-400 mb-1">
            {language === 'fa' ? 'دست چپ' : 'Left Hand'}
          </span>
          <div className="flex items-end gap-1.5 h-14 bg-slate-100 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700/60">
            {/* Left Pinky */}
            <div
              title={language === 'fa' ? 'انگشت کوچک' : 'Pinky'}
              className={`w-3.5 transition-all duration-150 rounded-t-md ${
                isLeftFingerActive('left-pinky')
                  ? 'h-9 bg-pink-500 ring-2 ring-pink-300 ring-offset-1 scale-110 shadow-md'
                  : 'h-6 bg-pink-200 dark:bg-pink-900/40'
              }`}
            />
            {/* Left Ring */}
            <div
              title={language === 'fa' ? 'انگشت انگشتری' : 'Ring'}
              className={`w-3.5 transition-all duration-150 rounded-t-md ${
                isLeftFingerActive('left-ring')
                  ? 'h-11 bg-purple-500 ring-2 ring-purple-300 ring-offset-1 scale-110 shadow-md'
                  : 'h-8 bg-purple-200 dark:bg-purple-900/40'
              }`}
            />
            {/* Left Middle */}
            <div
              title={language === 'fa' ? 'انگشت میانی' : 'Middle'}
              className={`w-3.5 transition-all duration-150 rounded-t-md ${
                isLeftFingerActive('left-middle')
                  ? 'h-12 bg-blue-500 ring-2 ring-blue-300 ring-offset-1 scale-110 shadow-md'
                  : 'h-9 bg-blue-200 dark:bg-blue-900/40'
              }`}
            />
            {/* Left Index */}
            <div
              title={language === 'fa' ? 'انگشت اشاره (کلید ب)' : 'Index (Key F)'}
              className={`w-3.5 transition-all duration-150 rounded-t-md relative ${
                isLeftFingerActive('left-index')
                  ? 'h-10 bg-cyan-500 ring-2 ring-cyan-300 ring-offset-1 scale-110 shadow-md'
                  : 'h-8 bg-cyan-200 dark:bg-cyan-900/40'
              }`}
            >
              {/* tactile bump dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-slate-600 dark:bg-slate-300 absolute top-1 left-1 opacity-70" />
            </div>
            {/* Left Thumb */}
            <div
              title={language === 'fa' ? 'شست' : 'Thumb'}
              className={`w-4 transition-all duration-150 rounded-t-md ${
                activeFinger === 'thumb'
                  ? 'h-7 bg-emerald-500 ring-2 ring-emerald-300 ring-offset-1 scale-110 shadow-md'
                  : 'h-5 bg-emerald-200 dark:bg-emerald-900/40'
              }`}
            />
          </div>
        </div>

        {/* Right Hand */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-semibold text-slate-400 mb-1">
            {language === 'fa' ? 'دست راست' : 'Right Hand'}
          </span>
          <div className="flex items-end gap-1.5 h-14 bg-slate-100 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700/60">
            {/* Right Thumb */}
            <div
              title={language === 'fa' ? 'شست' : 'Thumb'}
              className={`w-4 transition-all duration-150 rounded-t-md ${
                activeFinger === 'thumb'
                  ? 'h-7 bg-emerald-500 ring-2 ring-emerald-300 ring-offset-1 scale-110 shadow-md'
                  : 'h-5 bg-emerald-200 dark:bg-emerald-900/40'
              }`}
            />
            {/* Right Index */}
            <div
              title={language === 'fa' ? 'انگشت اشاره (کلید ت)' : 'Index (Key J)'}
              className={`w-3.5 transition-all duration-150 rounded-t-md relative ${
                isRightFingerActive('right-index')
                  ? 'h-10 bg-teal-500 ring-2 ring-teal-300 ring-offset-1 scale-110 shadow-md'
                  : 'h-8 bg-teal-200 dark:bg-teal-900/40'
              }`}
            >
              {/* tactile bump dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-slate-600 dark:bg-slate-300 absolute top-1 left-1 opacity-70" />
            </div>
            {/* Right Middle */}
            <div
              title={language === 'fa' ? 'انگشت میانی' : 'Middle'}
              className={`w-3.5 transition-all duration-150 rounded-t-md ${
                isRightFingerActive('right-middle')
                  ? 'h-12 bg-amber-500 ring-2 ring-amber-300 ring-offset-1 scale-110 shadow-md'
                  : 'h-9 bg-amber-200 dark:bg-amber-900/40'
              }`}
            />
            {/* Right Ring */}
            <div
              title={language === 'fa' ? 'انگشت انگشتری' : 'Ring'}
              className={`w-3.5 transition-all duration-150 rounded-t-md ${
                isRightFingerActive('right-ring')
                  ? 'h-11 bg-orange-500 ring-2 ring-orange-300 ring-offset-1 scale-110 shadow-md'
                  : 'h-8 bg-orange-200 dark:bg-orange-900/40'
              }`}
            />
            {/* Right Pinky */}
            <div
              title={language === 'fa' ? 'انگشت کوچک' : 'Pinky'}
              className={`w-3.5 transition-all duration-150 rounded-t-md ${
                isRightFingerActive('right-pinky')
                  ? 'h-9 bg-red-500 ring-2 ring-red-300 ring-offset-1 scale-110 shadow-md'
                  : 'h-6 bg-red-200 dark:bg-red-900/40'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
