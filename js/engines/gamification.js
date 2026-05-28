// js/engines/gamification.js

import { getAchievements, saveAchievements, getSettings, getRecentLogs } from '../storage.js';

// Lazy emit — avoids circular dependency with app.js
function emit(event, payload) {
  if (typeof window !== 'undefined' && window.__fitEmit) {
    window.__fitEmit(event, payload);
  }
}

export const LEVELS = [
  { level: 1, name: '新手上路',   minXP: 0,     maxXP: 200 },
  { level: 2, name: '习惯养成',   minXP: 200,   maxXP: 600 },
  { level: 3, name: '稳步前行',   minXP: 600,   maxXP: 1500 },
  { level: 4, name: '势如破竹',   minXP: 1500,  maxXP: 3000 },
  { level: 5, name: '意志钢铁',   minXP: 3000,  maxXP: 5500 },
  { level: 6, name: '精英战士',   minXP: 5500,  maxXP: 9000 },
  { level: 7, name: '传奇冠军',   minXP: 9000,  maxXP: Infinity },
];

export const XP_REWARDS = {
  meal_complete:    30,
  workout_complete: 50,
  protein_goal:     25,
  kcal_goal:        25,
  water_goal:       10,
  sleep_goal:       20,
  weight_logged:    10,
  all_five_bonus:   10,
  comeback:         30,
};

export const BADGES = [
  // Training
  { id: 'first_workout',     name: '破冰',         emoji: '🏋️', category: 'training', condition: 'total_workout_days', threshold: 1 },
  { id: 'train_3_days',      name: '三天火焰',      emoji: '🔥', category: 'training', condition: 'total_workout_days', threshold: 3 },
  { id: 'streak_7',          name: '七日精英',      emoji: '⚡', category: 'training', condition: 'streak',             threshold: 7 },
  { id: 'streak_14',         name: '双周战士',      emoji: '💪', category: 'training', condition: 'streak',             threshold: 14 },
  { id: 'streak_21',         name: '三周猛狮',      emoji: '🦁', category: 'training', condition: 'streak',             threshold: 21 },
  { id: 'streak_30',         name: '月度传奇',      emoji: '🏆', category: 'training', condition: 'streak',             threshold: 30 },
  { id: 'streak_60',         name: '双月无敌',      emoji: '🌟', category: 'training', condition: 'streak',             threshold: 60 },
  { id: 'streak_91',         name: '13周完赛',      emoji: '👑', category: 'training', condition: 'streak',             threshold: 91 },
  { id: 'first_swim',        name: '入水第一次',    emoji: '🏊', category: 'training', condition: 'total_swim_days',    threshold: 1 },
  { id: 'swim_10',           name: '泳池常客',      emoji: '💦', category: 'training', condition: 'total_swim_days',    threshold: 10 },
  { id: 'phase1_done',       name: '第一阶段✔',    emoji: '🎯', category: 'training', condition: 'phase_complete',     threshold: 1 },
  { id: 'phase2_done',       name: '第二阶段✔',    emoji: '🚀', category: 'training', condition: 'phase_complete',     threshold: 2 },
  { id: 'phase3_done',       name: '终极完赛',      emoji: '🏁', category: 'training', condition: 'phase_complete',     threshold: 3 },
  { id: 'train_50_days',     name: '半百出勤',      emoji: '⭐', category: 'training', condition: 'total_workout_days', threshold: 50 },
  // Diet
  { id: 'first_full_day_meals', name: '第一餐全记录', emoji: '🥗', category: 'diet', condition: 'total_full_meal_days', threshold: 1 },
  { id: 'protein_7_days',    name: '蛋白质战士',    emoji: '🥩', category: 'diet',     condition: 'protein_streak',     threshold: 7 },
  { id: 'kcal_accurate_7',   name: '热量精准手',    emoji: '🎯', category: 'diet',     condition: 'kcal_accurate_streak',threshold: 7 },
  { id: 'diet_log_30',       name: '饮食记录30天',  emoji: '📊', category: 'diet',     condition: 'total_full_meal_days',threshold: 30 },
  { id: 'clean_diet_14',     name: '清醒饮食',      emoji: '🥦', category: 'diet',     condition: 'clean_diet_streak',   threshold: 14 },
  { id: 'meal_prep_4_weeks', name: '备餐冠军',      emoji: '🍳', category: 'diet',     condition: 'sunday_prep_streak',  threshold: 4 },
  // Sleep
  { id: 'first_good_sleep',  name: '早睡达标',      emoji: '😴', category: 'sleep',    condition: 'first_good_sleep',    threshold: null },
  { id: 'sleep_7_days',      name: '睡眠优等生',    emoji: '🌙', category: 'sleep',    condition: 'sleep_streak',        threshold: 7 },
  { id: 'sleep_14_days',     name: '睡眠大师',      emoji: '⭐', category: 'sleep',    condition: 'sleep_streak',        threshold: 14 },
  // Water
  { id: 'first_water_goal',  name: '饮水达标',      emoji: '💧', category: 'water',    condition: 'water_streak',        threshold: 1 },
  { id: 'water_7_days',      name: '补水卫士',      emoji: '🚰', category: 'water',    condition: 'water_streak',        threshold: 7 },
  { id: 'water_30_days',     name: '水神',          emoji: '🌊', category: 'water',    condition: 'water_streak',        threshold: 30 },
  // Weight
  { id: 'first_weight',      name: '称重初体验',    emoji: '⚖️', category: 'weight',   condition: 'total_weight_days',   threshold: 1 },
  { id: 'weight_30_days',    name: '坚持称重30天',  emoji: '📈', category: 'weight',   condition: 'total_weight_days',   threshold: 30 },
  // Comprehensive
  { id: 'perfect_day',       name: '完美一天',      emoji: '💎', category: 'comprehensive', condition: 'perfect_day',    threshold: 1 },
  { id: 'perfect_7',         name: '完美一周',      emoji: '🌈', category: 'comprehensive', condition: 'total_perfect_days',threshold: 7 },
];

// ============================================================
// Pure functions
// ============================================================

export function getLevelInfo(xp) {
  const level = LEVELS.findLast(l => xp >= l.minXP) || LEVELS[0];
  const next   = LEVELS.find(l => l.minXP > xp);
  return {
    ...level,
    nextXP:      next ? next.minXP : null,
    progress:    next ? (xp - level.minXP) / (next.minXP - level.minXP) : 1,
  };
}

export function computeDailyXP(log, settings) {
  const s = settings;
  let xp = 0;
  const reasons = [];

  // 三餐记录
  const mealSlots = ['breakfast','lunch','dinner'];
  const hasMeals = mealSlots.filter(slot => log.meals.some(m => m.slot === slot));
  if (hasMeals.length >= 3) { xp += XP_REWARDS.meal_complete; reasons.push('三餐全记录'); }

  // 训练完成
  if (log.workout.completed) { xp += XP_REWARDS.workout_complete; reasons.push('完成训练'); }

  // 蛋白质达标
  const totalProtein = log.meals.reduce((s, m) => s + (m.protein || 0), 0);
  if (totalProtein >= (s.dailyProteinTarget || 140)) { xp += XP_REWARDS.protein_goal; reasons.push('蛋白质达标'); }

  // 热量达标
  const totalKcal = log.meals.reduce((s, m) => s + (m.kcal || 0), 0);
  if (totalKcal >= 1500 && totalKcal <= (s.dailyKcalTarget || 1800)) { xp += XP_REWARDS.kcal_goal; reasons.push('热量精准'); }

  // 饮水达标
  if ((log.waterMl || 0) >= (s.dailyWaterMl || 2500)) { xp += XP_REWARDS.water_goal; reasons.push('饮水达标'); }

  // 睡眠达标
  if ((log.sleepHours || 0) >= 7) { xp += XP_REWARDS.sleep_goal; reasons.push('睡眠达标'); }

  // 体重记录
  if (log.weightLbs != null) { xp += XP_REWARDS.weight_logged; reasons.push('体重记录'); }

  // 五项全达标奖励 (训练+饮食+蛋白+热量+饮水)
  if (log.workout.completed && hasMeals.length >= 3 && totalProtein >= (s.dailyProteinTarget || 140) &&
      totalKcal >= 1500 && (log.waterMl || 0) >= (s.dailyWaterMl || 2500)) {
    xp += XP_REWARDS.all_five_bonus;
    reasons.push('五项全满！');
  }

  return { xp, reasons };
}

function isPerfectDay(log, settings) {
  const s = settings;
  const mealSlots = ['breakfast','lunch','dinner'];
  const hasMeals = mealSlots.filter(slot => log.meals.some(m => m.slot === slot)).length >= 3;
  const protein = log.meals.reduce((s, m) => s + (m.protein || 0), 0);
  const kcal    = log.meals.reduce((s, m) => s + (m.kcal || 0), 0);
  return (
    log.workout.completed &&
    hasMeals &&
    protein >= (s.dailyProteinTarget || 140) &&
    kcal >= 1500 && kcal <= (s.dailyKcalTarget || 1800) &&
    (log.waterMl || 0) >= (s.dailyWaterMl || 2500) &&
    (log.sleepHours || 0) >= 7
  );
}

function checkBadges(ach, previousAch) {
  const newBadges = [];
  for (const badge of BADGES) {
    if (previousAch.unlockedBadges.includes(badge.id)) continue;
    let unlocked = false;
    switch (badge.condition) {
      case 'total_workout_days':    unlocked = ach.totalWorkoutDays >= badge.threshold; break;
      case 'streak':                unlocked = ach.streak >= badge.threshold; break;
      case 'total_swim_days':       unlocked = ach.totalSwimDays >= badge.threshold; break;
      case 'phase_complete':        unlocked = (ach.phaseComplete || 0) >= badge.threshold; break;
      case 'total_full_meal_days':  unlocked = (ach.totalFullMealDays || 0) >= badge.threshold; break;
      case 'protein_streak':        unlocked = (ach.proteinStreak || 0) >= badge.threshold; break;
      case 'kcal_accurate_streak':  unlocked = (ach.kcalAccurateStreak || 0) >= badge.threshold; break;
      case 'clean_diet_streak':     unlocked = (ach.cleanDietStreak || 0) >= badge.threshold; break;
      case 'sunday_prep_streak':    unlocked = (ach.sundayPrepStreak || 0) >= badge.threshold; break;
      case 'first_good_sleep':      unlocked = ach.firstGoodSleep === true; break;
      case 'sleep_streak':          unlocked = (ach.sleepStreak || 0) >= badge.threshold; break;
      case 'water_streak':          unlocked = (ach.waterStreak || 0) >= badge.threshold; break;
      case 'total_weight_days':     unlocked = (ach.totalWeightDays || 0) >= badge.threshold; break;
      case 'perfect_day':           unlocked = (ach.totalPerfectDays || 0) >= badge.threshold; break;
      case 'total_perfect_days':    unlocked = (ach.totalPerfectDays || 0) >= badge.threshold; break;
    }
    if (unlocked) {
      ach.unlockedBadges.push(badge.id);
      newBadges.push(badge);
    }
  }
  return newBadges;
}

// ============================================================
// Main handler — called after saving a daily log
// ============================================================
export function handleDayComplete(date, log) {
  const settings = getSettings();
  const ach      = getAchievements();
  const prevAch  = JSON.parse(JSON.stringify(ach)); // deep copy

  const { xp, reasons } = computeDailyXP(log, settings);

  // Check comeback (gap > 1 day)
  let isComeback = false;
  if (ach.lastActiveDate) {
    const lastDate = new Date(ach.lastActiveDate);
    const today    = new Date(date);
    const diffDays = Math.floor((today - lastDate) / 86400000);
    if (diffDays > 1 && xp > 0) {
      ach.totalXP    += XP_REWARDS.comeback;
      isComeback      = true;
      reasons.push('重新出发！');
      ach.streak      = 1;
    } else if (diffDays === 1 && xp > 0) {
      ach.streak += 1;
    } else if (diffDays === 0) {
      // same day re-save, keep streak
    }
  } else if (xp > 0) {
    ach.streak = 1;
  }

  if (xp > 0) {
    ach.lastActiveDate = date;
    ach.totalXP += xp;
  }

  // Workout stats
  if (log.workout.completed) {
    ach.totalWorkoutDays = (ach.totalWorkoutDays || 0) + 1;
    if (log.workout.workoutType === 'swim') {
      ach.totalSwimDays = (ach.totalSwimDays || 0) + 1;
    }
  }

  // Perfect day
  if (isPerfectDay(log, settings)) {
    ach.totalPerfectDays = (ach.totalPerfectDays || 0) + 1;
    ach.perfectDayStreak = (ach.perfectDayStreak || 0) + 1;
  }

  // Meal stats
  const mealSlots = ['breakfast','lunch','dinner'];
  const hasMeals = mealSlots.every(slot => log.meals.some(m => m.slot === slot));
  if (hasMeals) ach.totalFullMealDays = (ach.totalFullMealDays || 0) + 1;

  const protein = log.meals.reduce((s, m) => s + (m.protein || 0), 0);
  if (protein >= (settings.dailyProteinTarget || 140)) {
    ach.proteinStreak = (ach.proteinStreak || 0) + 1;
  } else {
    ach.proteinStreak = 0;
  }

  const kcal = log.meals.reduce((s, m) => s + (m.kcal || 0), 0);
  if (kcal >= 1500 && kcal <= (settings.dailyKcalTarget || 1800)) {
    ach.kcalAccurateStreak = (ach.kcalAccurateStreak || 0) + 1;
  } else {
    ach.kcalAccurateStreak = 0;
  }

  // Water streak
  if ((log.waterMl || 0) >= (settings.dailyWaterMl || 2500)) {
    ach.waterStreak = (ach.waterStreak || 0) + 1;
  } else {
    ach.waterStreak = 0;
  }

  // Sleep
  if ((log.sleepHours || 0) >= 7) {
    ach.sleepStreak = (ach.sleepStreak || 0) + 1;
    if (!ach.firstGoodSleep) ach.firstGoodSleep = true;
  } else {
    ach.sleepStreak = 0;
  }

  // Weight logging
  if (log.weightLbs != null) {
    ach.totalWeightDays = (ach.totalWeightDays || 0) + 1;
  }

  // Level
  const levelInfo = getLevelInfo(ach.totalXP);
  const prevLevel = ach.level || 1;
  ach.level = levelInfo.level;

  // Badges
  const newBadges = checkBadges(ach, prevAch);

  saveAchievements(ach);

  // Emit events for UI updates
  if (xp > 0) emit('fit:xpGained', { xp, reasons });
  if (ach.level > prevLevel) emit('fit:levelUp', { level: ach.level, name: levelInfo.name });
  if (newBadges.length > 0) emit('fit:badgeUnlocked', { badges: newBadges });
  if (isComeback) emit('fit:comeback', {});

  return { xp, reasons, newBadges, levelUp: ach.level > prevLevel ? ach.level : null };
}
