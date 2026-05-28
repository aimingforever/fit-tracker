// js/storage.js — 唯一直接操作 localStorage 的模块

const KEY_SETTINGS     = 'fit_settings';
const KEY_LOG_PREFIX   = 'fit_log_';
const KEY_ACHIEVEMENTS = 'fit_achievements';
const KEY_CUSTOM_FOODS = 'fit_custom_foods';

// ============================================================
// 默认值
// ============================================================
export const DEFAULT_SETTINGS = {
  isFirstRun:           true,
  disclaimerAccepted:   false,
  userName:             null,
  startDate:            null,
  startWeightLbs:       195,
  goalWeightLbs:        165,
  weightUnit:           'lbs',
  dailyKcalTarget:      1800,
  dailyProteinTarget:   140,
  dailyWaterMl:         2500,
};

export const DEFAULT_ACHIEVEMENTS = {
  totalXP:              0,
  level:                1,
  streak:               0,
  lastActiveDate:       null,
  flexDaysThisMonth:    2,
  flexDaysResetMonth:   null,
  unlockedBadges:       [],
  totalWorkoutDays:     0,
  totalSwimDays:        0,
  totalPerfectDays:     0,
  totalFlexDaysUsed:    0,
};

export function createEmptyLog(date) {
  return {
    date,
    weightLbs:    null,
    meals:        [],
    workout: {
      completed:       false,
      exerciseChecked: [],
      kneeStatus:      'ok',
      workoutType:     null,
      completedAt:     null,
    },
    waterMl:      0,
    sleepHours:   null,
    bedTime:      null,
    wakeTime:     null,
    sleepQuality: null,
    mood:         null,
    moodStressors:[],
    moodNote:     '',
  };
}

// ============================================================
// Settings
// ============================================================
export function getSettings() {
  try {
    const raw = localStorage.getItem(KEY_SETTINGS);
    const saved = raw ? JSON.parse(raw) : {};
    return { ...DEFAULT_SETTINGS, ...saved };
  } catch { return { ...DEFAULT_SETTINGS }; }
}

export function saveSettings(settings) {
  localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
}

// ============================================================
// Daily Log
// ============================================================
export function getDailyLog(date) {
  try {
    const raw = localStorage.getItem(KEY_LOG_PREFIX + date);
    const saved = raw ? JSON.parse(raw) : {};
    const empty = createEmptyLog(date);
    const merged = { ...empty, ...saved };
    merged.workout = { ...empty.workout, ...(saved.workout || {}) };
    if (!Array.isArray(merged.meals)) merged.meals = [];
    return merged;
  } catch { return createEmptyLog(date); }
}

export function saveDailyLog(date, log) {
  localStorage.setItem(KEY_LOG_PREFIX + date, JSON.stringify(log));
}

export function getRecentLogs(n) {
  const logs = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(KEY_LOG_PREFIX)) {
      const date = key.slice(KEY_LOG_PREFIX.length);
      try {
        const log = JSON.parse(localStorage.getItem(key));
        logs.push({ date, log });
      } catch { /* skip */ }
    }
  }
  logs.sort((a, b) => b.date.localeCompare(a.date));
  return logs.slice(0, n);
}

// ============================================================
// Achievements
// ============================================================
export function getAchievements() {
  try {
    const raw = localStorage.getItem(KEY_ACHIEVEMENTS);
    const saved = raw ? JSON.parse(raw) : {};
    return { ...DEFAULT_ACHIEVEMENTS, ...saved };
  } catch { return { ...DEFAULT_ACHIEVEMENTS }; }
}

export function saveAchievements(ach) {
  localStorage.setItem(KEY_ACHIEVEMENTS, JSON.stringify(ach));
}

// ============================================================
// Custom Foods
// ============================================================
export function getCustomFoods() {
  try {
    const raw = localStorage.getItem(KEY_CUSTOM_FOODS);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveCustomFoods(foods) {
  localStorage.setItem(KEY_CUSTOM_FOODS, JSON.stringify(foods));
}

// ============================================================
// Export / Import / Clear
// ============================================================
export function exportJSON() {
  const today = getTodayDate();
  const logs = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(KEY_LOG_PREFIX)) {
      const date = key.slice(KEY_LOG_PREFIX.length);
      try { logs[date] = JSON.parse(localStorage.getItem(key)); } catch { /* skip */ }
    }
  }
  const data = {
    exportedAt:   new Date().toISOString(),
    settings:     getSettings(),
    achievements: getAchievements(),
    customFoods:  getCustomFoods(),
    logs,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `fit-backup-${today}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function importJSON(jsonText) {
  try {
    const data = JSON.parse(jsonText);
    if (data.settings)     saveSettings({ ...getSettings(), ...data.settings });
    if (data.achievements) saveAchievements({ ...getAchievements(), ...data.achievements });
    if (data.customFoods)  saveCustomFoods(data.customFoods);
    if (data.logs) {
      for (const [date, log] of Object.entries(data.logs)) {
        const existing = getDailyLog(date);
        saveDailyLog(date, { ...existing, ...log });
      }
    }
    return true;
  } catch { return false; }
}

export function clearAll() {
  const toRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('fit_')) toRemove.push(key);
  }
  toRemove.forEach(k => localStorage.removeItem(k));
}

export function getUsageBytes() {
  let bytes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('fit_')) {
      bytes += (key.length + (localStorage.getItem(key) || '').length) * 2;
    }
  }
  return bytes;
}

// ============================================================
// Utilities
// ============================================================
export function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}
