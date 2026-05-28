// js/engines/rules.js — 规则引擎 & 违规检测

import { PROHIBITIONS } from '../data/prohibitions.js';

// 基于当日 log 检测是否有违规风险
export function detectViolations(log) {
  const violations = [];

  const totalKcal = log.meals.reduce((s, m) => s + (m.kcal || 0), 0);
  // 极端节食
  if (totalKcal > 0 && totalKcal < 1200) {
    violations.push({ id: 'extreme_diet', ...PROHIBITIONS.find(p => p.id === 'extreme_diet') });
  }
  // 不喝水
  if (log.waterMl != null && log.waterMl < 1000) {
    violations.push({ id: 'no_water', ...PROHIBITIONS.find(p => p.id === 'no_water') });
  }
  // 熬夜 — 入睡时间 00:00 后
  if (log.bedTime) {
    const [h] = log.bedTime.split(':').map(Number);
    if (h >= 1 && h <= 5) {
      violations.push({ id: 'late_sleep', ...PROHIBITIONS.find(p => p.id === 'late_sleep') });
    }
  }

  return violations;
}

// 根据进度提供规则提示
export function getRuleReminders(log) {
  const reminders = [];
  const mealSlots = ['breakfast','lunch','dinner'];
  const hasMeals  = mealSlots.filter(slot => log.meals.some(m => m.slot === slot));

  if (!hasMeals.includes('breakfast')) {
    reminders.push('别忘了早餐！跳过早餐会让下午更容易暴食。');
  }
  if ((log.waterMl || 0) < 1500) {
    reminders.push('今天喝水还不足够，记得多补水！');
  }
  return reminders;
}

export { PROHIBITIONS };
