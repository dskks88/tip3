import React from 'react';
import { KeyDefinition } from '../types/typing';
import { FINGER_INFOS, KEYBOARD_LAYOUT } from '../utils/keyboardLayouts';

interface KeyboardProps {
  activeKeyCode: string | null;
  needsShift: boolean;
  pressedKeyCode: string | null;
  language: 'fa' | 'en';
}

export const Keyboard: React.FC<KeyboardProps> = ({
  activeKeyCode,
  needsShift,
  pressedKeyCode,
  language,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto select-none bg-slate-900/95 dark:bg-slate-950 p-3 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-800 text-slate-100">
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5 w-full">
            {row.map((keyDef: KeyDefinition) => {
              const isTarget = activeKeyCode === keyDef.code;
              const isShiftTarget =
                needsShift &&
                (keyDef.code === 'ShiftLeft' || keyDef.code === 'ShiftRight');
              const isPressed = pressedKeyCode === keyDef.code;
              const fingerInfo = FINGER_INFOS[keyDef.finger];

              // Check if key has tactile bump (F / J in QWERTY = ب / ت in Persian)
              const hasBump = keyDef.code === 'KeyF' || keyDef.code === 'KeyJ';

              // Key display values
              const mainChar =
                language === 'fa' ? keyDef.persianChar : keyDef.englishChar;
              const subChar =
                language === 'fa'
                  ? keyDef.persianShiftChar || keyDef.englishChar
                  : keyDef.englishShiftChar || keyDef.persianChar;

              const isHighlighted = isTarget || isShiftTarget;

              return (
                <div
                  key={keyDef.code}
                  className={`
                    relative rounded-lg sm:rounded-xl transition-all duration-75 flex flex-col items-center justify-center
                    ${keyDef.width || 'flex-1 min-w-[28px] sm:min-w-[44px]'}
                    h-10 sm:h-13
                    ${
                      isHighlighted
                        ? 'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-lg ring-2 ring-indigo-400 ring-offset-1 ring-offset-slate-900 scale-[1.03] z-10'
                        : isPressed
                        ? 'bg-slate-700 translate-y-0.5 shadow-inner'
                        : 'bg-slate-800/90 hover:bg-slate-750 text-slate-200 border-t border-slate-700/80 shadow-[0_3px_0_0_#0f172a]'
                    }
                  `}
                  style={{
                    borderBottom: isHighlighted
                      ? '3px solid #312e81'
                      : `2px solid ${fingerInfo.color}33`,
                  }}
                >
                  {/* Finger indicator dot at the bottom of the key */}
                  {!keyDef.isModifier && (
                    <div
                      className="absolute bottom-1 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full opacity-60"
                      style={{ backgroundColor: fingerInfo.color }}
                    />
                  )}

                  {/* Tactile bump on home keys (F & J / ب & ت) */}
                  {hasBump && (
                    <div className="absolute bottom-2.5 sm:bottom-3 w-3 sm:w-4 h-0.5 rounded-full bg-slate-300 dark:bg-slate-200 shadow-sm opacity-90" />
                  )}

                  {/* Character rendering */}
                  {keyDef.isModifier ? (
                    <span className="text-[10px] sm:text-xs font-semibold tracking-tight text-slate-300">
                      {mainChar}
                    </span>
                  ) : keyDef.code === 'Space' ? (
                    <span className="text-[10px] sm:text-xs font-medium text-slate-300">
                      {language === 'fa'
                        ? needsShift
                          ? 'نیم‌فاصله (Shift + Space)'
                          : 'فاصله (Space)'
                        : 'Space'}
                    </span>
                  ) : (
                    <div className="flex flex-col items-center justify-center leading-none">
                      {/* Secondary/Shift character */}
                      {subChar && subChar !== mainChar && (
                        <span className="text-[9px] sm:text-[10px] text-slate-400 opacity-70 mb-0.5">
                          {subChar}
                        </span>
                      )}
                      {/* Main character */}
                      <span className="text-xs sm:text-base font-bold font-['Vazirmatn']">
                        {mainChar}
                      </span>
                    </div>
                  )}

                  {/* Active Key pulsing aura */}
                  {isHighlighted && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-300"></span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
