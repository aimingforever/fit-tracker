// js/data/ingredients.js — 单食材数据库（每 100g 营养数据）

export const INGREDIENTS = [
  // ── 蛋白质类 ──────────────────────────────────────────────
  { id: 'ing_chicken_breast',  name: '鸡胸肉',            emoji: '🍗', category: 'protein', per100g: { kcal: 165, protein: 31.0, carbs: 0.0,  fat: 3.6  } },
  { id: 'ing_chicken_thigh',   name: '鸡腿肉（去皮）',    emoji: '🍗', category: 'protein', per100g: { kcal: 177, protein: 24.0, carbs: 0.0,  fat: 9.0  } },
  { id: 'ing_salmon',          name: '三文鱼',             emoji: '🐟', category: 'protein', per100g: { kcal: 208, protein: 20.0, carbs: 0.0,  fat: 13.0 } },
  { id: 'ing_shrimp',          name: '无壳虾',             emoji: '🍤', category: 'protein', per100g: { kcal: 99,  protein: 24.0, carbs: 0.2,  fat: 0.3  } },
  { id: 'ing_ground_beef_90',  name: '牛肉末（90% 瘦）',  emoji: '🥩', category: 'protein', per100g: { kcal: 170, protein: 26.0, carbs: 0.0,  fat: 7.0  } },
  { id: 'ing_egg_whole',       name: '鸡蛋（全蛋）',      emoji: '🥚', category: 'protein', per100g: { kcal: 143, protein: 13.0, carbs: 0.7,  fat: 9.5  } },
  { id: 'ing_egg_white',       name: '蛋白',               emoji: '🥚', category: 'protein', per100g: { kcal: 52,  protein: 11.0, carbs: 0.7,  fat: 0.2  } },
  { id: 'ing_greek_yogurt',    name: '希腊酸奶（无脂）',  emoji: '🥛', category: 'protein', per100g: { kcal: 59,  protein: 10.0, carbs: 3.6,  fat: 0.4  } },
  { id: 'ing_protein_powder',  name: '乳清蛋白粉',         emoji: '💪', category: 'protein', per100g: { kcal: 385, protein: 80.0, carbs: 7.0,  fat: 4.0  } },
  { id: 'ing_cottage_cheese',  name: '白软干酪',            emoji: '🧀', category: 'protein', per100g: { kcal: 98,  protein: 11.0, carbs: 3.4,  fat: 4.5  } },
  { id: 'ing_tuna_canned',     name: '金枪鱼罐头（水浸）',emoji: '🐟', category: 'protein', per100g: { kcal: 116, protein: 26.0, carbs: 0.0,  fat: 0.8  } },
  { id: 'ing_pork_loin',       name: '猪里脊',             emoji: '🥩', category: 'protein', per100g: { kcal: 143, protein: 22.0, carbs: 0.0,  fat: 5.0  } },

  // ── 主食类 ───────────────────────────────────────────────
  { id: 'ing_brown_rice_cooked',name: '糙米饭（熟）',      emoji: '🍚', category: 'carbs',   per100g: { kcal: 111, protein: 2.6,  carbs: 23.0, fat: 0.9  } },
  { id: 'ing_white_rice_cooked',name: '白米饭（熟）',      emoji: '🍚', category: 'carbs',   per100g: { kcal: 130, protein: 2.7,  carbs: 28.0, fat: 0.3  } },
  { id: 'ing_oats_dry',         name: '燕麦片（干）',      emoji: '🌾', category: 'carbs',   per100g: { kcal: 389, protein: 17.0, carbs: 66.0, fat: 7.0  } },
  { id: 'ing_dkb_bread',        name: "DKB 全麦面包",      emoji: '🍞', category: 'carbs',   per100g: { kcal: 270, protein: 12.0, carbs: 45.0, fat: 4.5  } },
  { id: 'ing_dinner_roll',      name: 'Dinner Roll',       emoji: '🥐', category: 'carbs',   per100g: { kcal: 297, protein: 8.0,  carbs: 52.0, fat: 6.0  } },
  { id: 'ing_sweet_potato',     name: '红薯（熟）',        emoji: '🍠', category: 'carbs',   per100g: { kcal: 90,  protein: 2.0,  carbs: 21.0, fat: 0.1  } },
  { id: 'ing_whole_wheat_pasta',name: '全麦意面（熟）',    emoji: '🍝', category: 'carbs',   per100g: { kcal: 124, protein: 5.0,  carbs: 25.0, fat: 0.5  } },

  // ── 蔬菜类 ───────────────────────────────────────────────
  { id: 'ing_broccoli',        name: '西兰花',              emoji: '🥦', category: 'veg',     per100g: { kcal: 34,  protein: 2.8,  carbs: 7.0,  fat: 0.4  } },
  { id: 'ing_spinach',         name: '菠菜',                emoji: '🥬', category: 'veg',     per100g: { kcal: 23,  protein: 2.9,  carbs: 3.6,  fat: 0.4  } },
  { id: 'ing_bell_pepper',     name: '彩椒',                emoji: '🫑', category: 'veg',     per100g: { kcal: 31,  protein: 1.0,  carbs: 6.0,  fat: 0.3  } },
  { id: 'ing_cucumber',        name: '黄瓜',                emoji: '🥒', category: 'veg',     per100g: { kcal: 15,  protein: 0.7,  carbs: 3.6,  fat: 0.1  } },
  { id: 'ing_mushroom',        name: '蘑菇',                emoji: '🍄', category: 'veg',     per100g: { kcal: 22,  protein: 3.1,  carbs: 3.3,  fat: 0.3  } },
  { id: 'ing_onion',           name: '洋葱',                emoji: '🧅', category: 'veg',     per100g: { kcal: 40,  protein: 1.1,  carbs: 9.0,  fat: 0.1  } },
  { id: 'ing_kale',            name: '羽衣甘蓝',            emoji: '🥬', category: 'veg',     per100g: { kcal: 49,  protein: 4.3,  carbs: 9.0,  fat: 0.9  } },
  { id: 'ing_mixed_salad',     name: '混合沙拉叶',          emoji: '🥗', category: 'veg',     per100g: { kcal: 20,  protein: 1.5,  carbs: 3.0,  fat: 0.3  } },
  { id: 'ing_tomato',          name: '番茄',                emoji: '🍅', category: 'veg',     per100g: { kcal: 18,  protein: 0.9,  carbs: 3.9,  fat: 0.2  } },
  { id: 'ing_celery',          name: '芹菜',                emoji: '🌿', category: 'veg',     per100g: { kcal: 16,  protein: 0.7,  carbs: 3.0,  fat: 0.2  } },

  // ── 水果类 ───────────────────────────────────────────────
  { id: 'ing_apple',           name: '苹果',                emoji: '🍎', category: 'fruit',   per100g: { kcal: 52,  protein: 0.3,  carbs: 14.0, fat: 0.2  } },
  { id: 'ing_banana',          name: '香蕉',                emoji: '🍌', category: 'fruit',   per100g: { kcal: 89,  protein: 1.1,  carbs: 23.0, fat: 0.3  } },
  { id: 'ing_orange',          name: '橙子',                emoji: '🍊', category: 'fruit',   per100g: { kcal: 47,  protein: 0.9,  carbs: 12.0, fat: 0.1  } },
  { id: 'ing_blueberry',       name: '蓝莓',                emoji: '🫐', category: 'fruit',   per100g: { kcal: 57,  protein: 0.7,  carbs: 14.0, fat: 0.3  } },
  { id: 'ing_avocado',         name: '牛油果',              emoji: '🥑', category: 'fruit',   per100g: { kcal: 160, protein: 2.0,  carbs: 9.0,  fat: 15.0 } },
  { id: 'ing_strawberry',      name: '草莓',                emoji: '🍓', category: 'fruit',   per100g: { kcal: 32,  protein: 0.7,  carbs: 8.0,  fat: 0.3  } },

  // ── 油脂 / 坚果 / 饮品 ───────────────────────────────────
  { id: 'ing_olive_oil',       name: '橄榄油',              emoji: '🫒', category: 'other',   per100g: { kcal: 884, protein: 0.0,  carbs: 0.0,  fat: 100.0} },
  { id: 'ing_pumpkin_seeds',   name: '南瓜籽',              emoji: '🌰', category: 'other',   per100g: { kcal: 559, protein: 30.0, carbs: 11.0, fat: 49.0 } },
  { id: 'ing_mixed_nuts',      name: '综合坚果',            emoji: '🥜', category: 'other',   per100g: { kcal: 607, protein: 14.0, carbs: 21.0, fat: 54.0 } },
  { id: 'ing_soy_milk_unsweet',name: '无糖豆浆',            emoji: '🥛', category: 'other',   per100g: { kcal: 33,  protein: 2.7,  carbs: 2.5,  fat: 1.5  } },
  { id: 'ing_whole_milk',      name: '牛奶（全脂）',        emoji: '🥛', category: 'other',   per100g: { kcal: 61,  protein: 3.2,  carbs: 4.8,  fat: 3.3  } },
  { id: 'ing_almond_milk',     name: '杏仁奶（无糖）',      emoji: '🥛', category: 'other',   per100g: { kcal: 15,  protein: 0.5,  carbs: 0.3,  fat: 1.2  } },
];

export const INGREDIENT_CATEGORIES = [
  { id: 'protein', name: '蛋白质', emoji: '🍗' },
  { id: 'carbs',   name: '主食',   emoji: '🍚' },
  { id: 'veg',     name: '蔬菜',   emoji: '🥦' },
  { id: 'fruit',   name: '水果',   emoji: '🍎' },
  { id: 'other',   name: '油脂/饮品', emoji: '🫒' },
];
