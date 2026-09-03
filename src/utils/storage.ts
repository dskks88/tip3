import { KeyStat, LessonProgress, TestResult, UserProfile, UserSettings } from '../types/typing';

const STORAGE_KEYS = {
  PROFILE: 'typeyar_user_profile',
  LESSONS: 'typeyar_completed_lessons',
  TESTS: 'typeyar_test_history',
  KEY_STATS: 'typeyar_key_stats',
  SETTINGS: 'typeyar_user_settings',
};

export const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  soundType: 'mechanical',
  volume: 0.5,
  showHandsGuide: true,
  showKeyboard: true,
  fontSize: 'normal',
  blindMode: false,
  theme: 'light',
  caretStyle: 'line',
};

export const DEFAULT_PROFILE: UserProfile = {
  name: 'کاربر تایپ‌یار',
  level: 1,
  xp: 0,
  streakDays: 1,
  lastPracticeDate: new Date().toISOString().split('T')[0],
};

export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    const profile: UserProfile = JSON.parse(raw);

    // Update streak if needed
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastPracticeDate && profile.lastPracticeDate !== today) {
      const last = new Date(profile.lastPracticeDate);
      const now = new Date(today);
      const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        profile.streakDays += 1;
      } else if (diffDays > 1) {
        profile.streakDays = 1;
      }
      profile.lastPracticeDate = today;
      saveProfile(profile);
    }
    return profile;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function addXpToProfile(xpToAdd: number): UserProfile {
  const profile = loadProfile();
  profile.xp += xpToAdd;
  // Each level requires 100 * level XP
  const newLevel = Math.floor(profile.xp / 100) + 1;
  profile.level = newLevel;
  profile.lastPracticeDate = new Date().toISOString().split('T')[0];
  saveProfile(profile);
  return profile;
}

export function loadLessonsProgress(): Record<string, LessonProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LESSONS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLessonProgress(lessonId: string, progress: { wpm: number; accuracy: number; stars: number }): void {
  const all = loadLessonsProgress();
  const existing = all[lessonId] || { stars: 0, bestWpm: 0, bestAccuracy: 0, attempts: 0 };
  all[lessonId] = {
    stars: Math.max(existing.stars, progress.stars),
    bestWpm: Math.max(existing.bestWpm, progress.wpm),
    bestAccuracy: Math.max(existing.bestAccuracy, progress.accuracy),
    completedAt: new Date().toISOString(),
    attempts: existing.attempts + 1,
  };
  try {
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save lesson progress', e);
  }
}

export function loadTestHistory(): TestResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TESTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTestResult(result: TestResult): void {
  const tests = loadTestHistory();
  tests.unshift(result);
  // Keep last 50 tests
  const trimmed = tests.slice(0, 50);
  try {
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save test result', e);
  }
}

export function loadKeyStats(): Record<string, KeyStat> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.KEY_STATS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function recordKeyHit(char: string, isError: boolean): void {
  if (!char || char === ' ') return;
  const stats = loadKeyStats();
  const entry = stats[char] || { totalHits: 0, errorHits: 0 };
  entry.totalHits += 1;
  if (isError) {
    entry.errorHits += 1;
  }
  stats[char] = entry;
  try {
    localStorage.setItem(STORAGE_KEYS.KEY_STATS, JSON.stringify(stats));
  } catch {
    // ignore
  }
}
