// js/data/prohibitions.js — 禁忌事项列表

export const PROHIBITIONS = [
  // 饮食类
  { id: 'sugary_drinks',  category: 'diet',     emoji: '🥤', text: '含糖饮料（可乐、奶茶、果汁）' },
  { id: 'alcohol',        category: 'diet',     emoji: '🍺', text: '酒精（任何种类）' },
  { id: 'fried_food',     category: 'diet',     emoji: '🍟', text: '油炸食品' },
  { id: 'sweets',         category: 'diet',     emoji: '🍰', text: '精制甜食（蛋糕、饼干、糖果）' },
  { id: 'fast_food',      category: 'diet',     emoji: '🍔', text: '外卖快餐' },
  { id: 'late_eating',    category: 'diet',     emoji: '🌙', text: '深夜进食（22:00 后）' },
  { id: 'binge',          category: 'diet',     emoji: '🍽️', text: '暴饮暴食' },
  // 行为类
  { id: 'late_sleep',     category: 'behavior', emoji: '😴', text: '熬夜（0:00 后未入睡）' },
  { id: 'sedentary',      category: 'behavior', emoji: '💺', text: '久坐（连续 >2 小时不动）' },
  { id: 'skip_breakfast', category: 'behavior', emoji: '⏰', text: '跳过早餐' },
  { id: 'emotional_eat',  category: 'behavior', emoji: '😤', text: '情绪化进食' },
  { id: 'extreme_diet',   category: 'behavior', emoji: '🚫', text: '极端节食（< 1200 kcal）' },
  { id: 'no_water',       category: 'behavior', emoji: '💧', text: '不喝水或饮水量极少（< 1000ml）' },
  // 训练类
  { id: 'hold_breath',    category: 'exercise', emoji: '💨', text: '训练时屏气' },
  { id: 'squat_with_pain',category: 'exercise', emoji: '🦵', text: '膝盖疼痛时仍然深蹲' },
  { id: 'skip_warmup',    category: 'exercise', emoji: '🔥', text: '跳过热身直接大重量训练' },
  { id: 'overtraining',   category: 'exercise', emoji: '⚡', text: '连续两天训练同一肌群' },
  { id: 'train_injured',  category: 'exercise', emoji: '🩹', text: '受伤不休息强行训练' },
];
