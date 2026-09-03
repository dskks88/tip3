import { Finger, KeyDefinition } from '../types/typing';

export interface FingerInfo {
  id: Finger;
  nameFa: string;
  nameEn: string;
  hand: 'left' | 'right';
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export const FINGER_INFOS: Record<Finger, FingerInfo> = {
  'left-pinky': {
    id: 'left-pinky',
    nameFa: 'کوچک دست چپ',
    nameEn: 'Left Pinky',
    hand: 'left',
    color: '#ec4899', // pink-500
    bgColor: 'bg-pink-100 dark:bg-pink-950/50',
    borderColor: 'border-pink-300 dark:border-pink-800',
    textColor: 'text-pink-700 dark:text-pink-300',
  },
  'left-ring': {
    id: 'left-ring',
    nameFa: 'انگشتری دست چپ',
    nameEn: 'Left Ring',
    hand: 'left',
    color: '#8b5cf6', // purple-500
    bgColor: 'bg-purple-100 dark:bg-purple-950/50',
    borderColor: 'border-purple-300 dark:border-purple-800',
    textColor: 'text-purple-700 dark:text-purple-300',
  },
  'left-middle': {
    id: 'left-middle',
    nameFa: 'میانی دست چپ',
    nameEn: 'Left Middle',
    hand: 'left',
    color: '#3b82f6', // blue-500
    bgColor: 'bg-blue-100 dark:bg-blue-950/50',
    borderColor: 'border-blue-300 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-300',
  },
  'left-index': {
    id: 'left-index',
    nameFa: 'اشاره دست چپ',
    nameEn: 'Left Index',
    hand: 'left',
    color: '#06b6d4', // cyan-500
    bgColor: 'bg-cyan-100 dark:bg-cyan-950/50',
    borderColor: 'border-cyan-300 dark:border-cyan-800',
    textColor: 'text-cyan-700 dark:text-cyan-300',
  },
  'thumb': {
    id: 'thumb',
    nameFa: 'شست (هر دو دست)',
    nameEn: 'Thumbs',
    hand: 'left', // shared
    color: '#10b981', // emerald-500
    bgColor: 'bg-emerald-100 dark:bg-emerald-950/50',
    borderColor: 'border-emerald-300 dark:border-emerald-800',
    textColor: 'text-emerald-700 dark:text-emerald-300',
  },
  'right-index': {
    id: 'right-index',
    nameFa: 'اشاره دست راست',
    nameEn: 'Right Index',
    hand: 'right',
    color: '#14b8a6', // teal-500
    bgColor: 'bg-teal-100 dark:bg-teal-950/50',
    borderColor: 'border-teal-300 dark:border-teal-800',
    textColor: 'text-teal-700 dark:text-teal-300',
  },
  'right-middle': {
    id: 'right-middle',
    nameFa: 'میانی دست راست',
    nameEn: 'Right Middle',
    hand: 'right',
    color: '#f59e0b', // amber-500
    bgColor: 'bg-amber-100 dark:bg-amber-950/50',
    borderColor: 'border-amber-300 dark:border-amber-800',
    textColor: 'text-amber-700 dark:text-amber-300',
  },
  'right-ring': {
    id: 'right-ring',
    nameFa: 'انگشتری دست راست',
    nameEn: 'Right Ring',
    hand: 'right',
    color: '#f97316', // orange-500
    bgColor: 'bg-orange-100 dark:bg-orange-950/50',
    borderColor: 'border-orange-300 dark:border-orange-800',
    textColor: 'text-orange-700 dark:text-orange-300',
  },
  'right-pinky': {
    id: 'right-pinky',
    nameFa: 'کوچک دست راست',
    nameEn: 'Right Pinky',
    hand: 'right',
    color: '#ef4444', // red-500
    bgColor: 'bg-red-100 dark:bg-red-950/50',
    borderColor: 'border-red-300 dark:border-red-800',
    textColor: 'text-red-700 dark:text-red-300',
  },
};

// Keyboard physical rows: 5 rows
export const KEYBOARD_LAYOUT: KeyDefinition[][] = [
  // Row 0: Number Row
  [
    { code: 'Backquote', persianChar: '÷', persianShiftChar: '~', englishChar: '`', englishShiftChar: '~', finger: 'left-pinky', row: 0 },
    { code: 'Digit1', persianChar: '۱', persianShiftChar: '!', englishChar: '1', englishShiftChar: '!', finger: 'left-pinky', row: 0 },
    { code: 'Digit2', persianChar: '۲', persianShiftChar: '٬', englishChar: '2', englishShiftChar: '@', finger: 'left-ring', row: 0 },
    { code: 'Digit3', persianChar: '۳', persianShiftChar: '٫', englishChar: '3', englishShiftChar: '#', finger: 'left-middle', row: 0 },
    { code: 'Digit4', persianChar: '۴', persianShiftChar: '﷼', englishChar: '4', englishShiftChar: '$', finger: 'left-index', row: 0 },
    { code: 'Digit5', persianChar: '۵', persianShiftChar: '٪', englishChar: '5', englishShiftChar: '%', finger: 'left-index', row: 0 },
    { code: 'Digit6', persianChar: '۶', persianShiftChar: '×', englishChar: '6', englishShiftChar: '^', finger: 'right-index', row: 0 },
    { code: 'Digit7', persianChar: '۷', persianShiftChar: '،', englishChar: '7', englishShiftChar: '&', finger: 'right-index', row: 0 },
    { code: 'Digit8', persianChar: '۸', persianShiftChar: '*', englishChar: '8', englishShiftChar: '*', finger: 'right-middle', row: 0 },
    { code: 'Digit9', persianChar: '۹', persianShiftChar: ')', englishChar: '9', englishShiftChar: '(', finger: 'right-ring', row: 0 },
    { code: 'Digit0', persianChar: '۰', persianShiftChar: '(', englishChar: '0', englishShiftChar: ')', finger: 'right-pinky', row: 0 },
    { code: 'Minus', persianChar: '-', persianShiftChar: '_', englishChar: '-', englishShiftChar: '_', finger: 'right-pinky', row: 0 },
    { code: 'Equal', persianChar: '=', persianShiftChar: '+', englishChar: '=', englishShiftChar: '+', finger: 'right-pinky', row: 0 },
    { code: 'Backspace', persianChar: 'حذف', englishChar: 'Backspace', finger: 'right-pinky', row: 0, width: 'w-16 sm:w-20', isModifier: true },
  ],
  // Row 1: Top Row
  [
    { code: 'Tab', persianChar: 'تب', englishChar: 'Tab', finger: 'left-pinky', row: 1, width: 'w-14 sm:w-16', isModifier: true },
    { code: 'KeyQ', persianChar: 'ض', persianShiftChar: 'ْ', englishChar: 'q', englishShiftChar: 'Q', finger: 'left-pinky', row: 1 },
    { code: 'KeyW', persianChar: 'ص', persianShiftChar: 'ٌ', englishChar: 'w', englishShiftChar: 'W', finger: 'left-ring', row: 1 },
    { code: 'KeyE', persianChar: 'ث', persianShiftChar: 'ٍ', englishChar: 'e', englishShiftChar: 'E', finger: 'left-middle', row: 1 },
    { code: 'KeyR', persianChar: 'ق', persianShiftChar: 'ً', englishChar: 'r', englishShiftChar: 'R', finger: 'left-index', row: 1 },
    { code: 'KeyT', persianChar: 'ف', persianShiftChar: 'ُ', englishChar: 't', englishShiftChar: 'T', finger: 'left-index', row: 1 },
    { code: 'KeyY', persianChar: 'غ', persianShiftChar: 'ِ', englishChar: 'y', englishShiftChar: 'Y', finger: 'right-index', row: 1 },
    { code: 'KeyU', persianChar: 'ع', persianShiftChar: 'َ', englishChar: 'u', englishShiftChar: 'U', finger: 'right-index', row: 1 },
    { code: 'KeyI', persianChar: 'ه', persianShiftChar: 'ّ', englishChar: 'i', englishShiftChar: 'I', finger: 'right-middle', row: 1 },
    { code: 'KeyO', persianChar: 'خ', persianShiftChar: ']', englishChar: 'o', englishShiftChar: 'O', finger: 'right-ring', row: 1 },
    { code: 'KeyP', persianChar: 'ح', persianShiftChar: '[', englishChar: 'p', englishShiftChar: 'P', finger: 'right-pinky', row: 1 },
    { code: 'BracketLeft', persianChar: 'ج', persianShiftChar: '}', englishChar: '[', englishShiftChar: '{', finger: 'right-pinky', row: 1 },
    { code: 'BracketRight', persianChar: 'چ', persianShiftChar: '{', englishChar: ']', englishShiftChar: '}', finger: 'right-pinky', row: 1 },
    { code: 'Backslash', persianChar: '\\', persianShiftChar: '|', englishChar: '\\', englishShiftChar: '|', finger: 'right-pinky', row: 1 },
  ],
  // Row 2: Home Row (با کلیدهای برآمده ب / ت و F / J)
  [
    { code: 'CapsLock', persianChar: 'قفل کلید', englishChar: 'Caps', finger: 'left-pinky', row: 2, width: 'w-16 sm:w-20', isModifier: true },
    { code: 'KeyA', persianChar: 'ش', persianShiftChar: 'ؤ', englishChar: 'a', englishShiftChar: 'A', finger: 'left-pinky', row: 2 },
    { code: 'KeyS', persianChar: 'س', persianShiftChar: 'ئ', englishChar: 's', englishShiftChar: 'S', finger: 'left-ring', row: 2 },
    { code: 'KeyD', persianChar: 'ی', persianShiftChar: 'ي', englishChar: 'd', englishShiftChar: 'D', finger: 'left-middle', row: 2 },
    { code: 'KeyF', persianChar: 'ب', persianShiftChar: 'إ', englishChar: 'f', englishShiftChar: 'F', finger: 'left-index', row: 2 }, // Bump
    { code: 'KeyG', persianChar: 'ل', persianShiftChar: 'أ', englishChar: 'g', englishShiftChar: 'G', finger: 'left-index', row: 2 },
    { code: 'KeyH', persianChar: 'ا', persianShiftChar: 'آ', englishChar: 'h', englishShiftChar: 'H', finger: 'right-index', row: 2 },
    { code: 'KeyJ', persianChar: 'ت', persianShiftChar: 'ة', englishChar: 'j', englishShiftChar: 'J', finger: 'right-index', row: 2 }, // Bump
    { code: 'KeyK', persianChar: 'ن', persianShiftChar: '»', englishChar: 'k', englishShiftChar: 'K', finger: 'right-middle', row: 2 },
    { code: 'KeyL', persianChar: 'م', persianShiftChar: '«', englishChar: 'l', englishShiftChar: 'L', finger: 'right-ring', row: 2 },
    { code: 'Semicolon', persianChar: 'ک', persianShiftChar: ':', englishChar: ';', englishShiftChar: ':', finger: 'right-pinky', row: 2 },
    { code: 'Quote', persianChar: 'گ', persianShiftChar: ';', englishChar: "'", englishShiftChar: '"', finger: 'right-pinky', row: 2 },
    { code: 'Enter', persianChar: 'ورود', englishChar: 'Enter', finger: 'right-pinky', row: 2, width: 'w-16 sm:w-24', isModifier: true },
  ],
  // Row 3: Bottom Row
  [
    { code: 'ShiftLeft', persianChar: 'تبدیل', englishChar: 'Shift', finger: 'left-pinky', row: 3, width: 'w-20 sm:w-24', isModifier: true },
    { code: 'KeyZ', persianChar: 'ظ', persianShiftChar: 'ك', englishChar: 'z', englishShiftChar: 'Z', finger: 'left-pinky', row: 3 },
    { code: 'KeyX', persianChar: 'ط', persianShiftChar: 'ٓ', englishChar: 'x', englishShiftChar: 'X', finger: 'left-ring', row: 3 },
    { code: 'KeyC', persianChar: 'ز', persianShiftChar: 'ژ', englishChar: 'c', englishShiftChar: 'C', finger: 'left-middle', row: 3 },
    { code: 'KeyV', persianChar: 'ر', persianShiftChar: 'ٰ', englishChar: 'v', englishShiftChar: 'V', finger: 'left-index', row: 3 },
    { code: 'KeyB', persianChar: 'ذ', persianShiftChar: '‌', englishChar: 'b', englishShiftChar: 'B', finger: 'left-index', row: 3 },
    { code: 'KeyN', persianChar: 'د', persianShiftChar: 'ٔ', englishChar: 'n', englishShiftChar: 'N', finger: 'right-index', row: 3 },
    { code: 'KeyM', persianChar: 'پ', persianShiftChar: 'ء', englishChar: 'm', englishShiftChar: 'M', finger: 'right-index', row: 3 },
    { code: 'Comma', persianChar: 'و', persianShiftChar: '>', englishChar: ',', englishShiftChar: '<', finger: 'right-middle', row: 3 },
    { code: 'Period', persianChar: '.', persianShiftChar: '<', englishChar: '.', englishShiftChar: '>', finger: 'right-ring', row: 3 },
    { code: 'Slash', persianChar: '/', persianShiftChar: '؟', englishChar: '/', englishShiftChar: '?', finger: 'right-pinky', row: 3 },
    { code: 'ShiftRight', persianChar: 'تبدیل', englishChar: 'Shift', finger: 'right-pinky', row: 3, width: 'w-20 sm:w-24', isModifier: true },
  ],
  // Row 4: Space Row
  [
    { code: 'ControlLeft', persianChar: 'کنترل', englishChar: 'Ctrl', finger: 'left-pinky', row: 4, width: 'w-14 sm:w-16', isModifier: true },
    { code: 'AltLeft', persianChar: 'دگرساز', englishChar: 'Alt', finger: 'left-ring', row: 4, width: 'w-12 sm:w-14', isModifier: true },
    { code: 'Space', persianChar: 'فاصله / نیم‌فاصله', englishChar: 'Space', finger: 'thumb', row: 4, width: 'flex-1 min-w-[180px] sm:min-w-[280px]' },
    { code: 'AltRight', persianChar: 'دگرساز', englishChar: 'Alt', finger: 'right-ring', row: 4, width: 'w-12 sm:w-14', isModifier: true },
    { code: 'ControlRight', persianChar: 'کنترل', englishChar: 'Ctrl', finger: 'right-pinky', row: 4, width: 'w-14 sm:w-16', isModifier: true },
  ],
];

// Helper to normalize Persian characters for comparison
export function normalizeChar(char: string): string {
  if (!char) return '';
  return char
    .replace(/\u064A/g, 'ی') // Arabic Yeh to Persian Yeh
    .replace(/\u0643/g, 'ک') // Arabic Kaf to Persian Kaf
    .replace(/\u0654/g, 'ٔ') // Hamza above
    .replace(/[\u064B-\u065F]/g, ''); // Diacritics if optional, but in specific lessons we keep
}

// Map characters to key information
export function findKeyForChar(char: string, language: 'fa' | 'en'): { key: KeyDefinition; needsShift: boolean } | null {
  if (char === ' ') {
    const spaceKey = KEYBOARD_LAYOUT[4].find((k) => k.code === 'Space');
    return spaceKey ? { key: spaceKey, needsShift: false } : null;
  }
  // Zero-Width Non-Joiner (نیم‌فاصله)
  if (char === '\u200c') {
    // In Persian standard: Shift+Space or Shift+B
    const spaceKey = KEYBOARD_LAYOUT[4].find((k) => k.code === 'Space');
    return spaceKey ? { key: spaceKey, needsShift: true } : null;
  }

  for (const row of KEYBOARD_LAYOUT) {
    for (const k of row) {
      if (k.isModifier) continue;

      if (language === 'fa') {
        if (k.persianChar === char) {
          return { key: k, needsShift: false };
        }
        if (k.persianShiftChar === char) {
          return { key: k, needsShift: true };
        }
      } else {
        if (k.englishChar === char) {
          return { key: k, needsShift: false };
        }
        if (k.englishShiftChar === char) {
          return { key: k, needsShift: true };
        }
      }
    }
  }

  return null;
}
