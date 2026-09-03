export type Language = 'fa' | 'en';

export type Finger =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface KeyDefinition {
  code: string;
  persianChar: string;
  persianShiftChar?: string;
  englishChar: string;
  englishShiftChar?: string;
  finger: Finger;
  row: number; // 0: numbers, 1: top, 2: home, 3: bottom, 4: space
  width?: string; // flex ratio or standard width
  isModifier?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: 'home_row' | 'top_row' | 'bottom_row' | 'special_chars' | 'words' | 'sentences' | 'english_basics' | 'english_words';
  level: 'beginner' | 'intermediate' | 'advanced';
  targetKeys: string[];
  text: string;
  language: Language;
  minWpm: number;
  minAccuracy: number;
}

export interface LessonProgress {
  stars: number; // 0 to 3
  bestWpm: number;
  bestAccuracy: number;
  completedAt?: string;
  attempts: number;
}

export interface TestResult {
  id: string;
  date: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  durationSeconds: number;
  language: Language;
  errorCount: number;
  totalChars: number;
  rankTitle: string;
}

export interface KeyStat {
  totalHits: number;
  errorHits: number;
}

export interface UserSettings {
  soundEnabled: boolean;
  soundType: 'mechanical' | 'typewriter' | 'soft' | 'beep';
  volume: number;
  showHandsGuide: boolean;
  showKeyboard: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  blindMode: boolean;
  theme: 'light' | 'dark' | 'slate';
  caretStyle: 'line' | 'block' | 'underline';
}

export interface UserProfile {
  name: string;
  level: number;
  xp: number;
  streakDays: number;
  lastPracticeDate?: string;
}

export type ActiveTab =
  | 'lessons'
  | 'speed_test'
  | 'custom_practice'
  | 'weak_keys'
  | 'game'
  | 'stats';
