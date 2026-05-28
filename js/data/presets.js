// js/data/presets.js — 预设食物库

export const HOME_BREAKFAST = [
  {
    id: 'dkb_egg_poached',
    name: '水煮荷包蛋 + 吐司',
    desc: 'DKB 全麦面包 2 片 + 水煮蛋 2 个 + 无糖豆浆 240ml',
    kcal: 360, protein: 22, carbs: 41, fat: 13,
    emoji: '🍳',
    category: 'home_breakfast'
  },
  {
    id: 'dkb_egg_scrambled_avocado',
    name: '炒蛋牛油果吐司',
    desc: 'DKB 全麦面包 2 片 + 炒蛋 2 个 + 牛油果 1/4 个',
    kcal: 460, protein: 22, carbs: 42, fat: 23,
    emoji: '🥑',
    category: 'home_breakfast'
  },
  {
    id: 'boiled_egg_light',
    name: '水煮蛋轻食',
    desc: '水煮蛋 2 个 + 黄瓜 1 根',
    kcal: 210, protein: 18, carbs: 2, fat: 15,
    emoji: '🥚',
    category: 'home_breakfast'
  }
];

export const COMPANY_BREAKFAST = [
  {
    id: 'oatmeal_standard',
    name: '公司燕麦早餐（标准）',
    desc: '燕麦 80g + 蛋白粉 1 勺 + 牛奶 200ml + 蓝莓 50g',
    kcal: 410, protein: 16, carbs: 62, fat: 9,
    emoji: '🥣',
    category: 'company_breakfast'
  },
  {
    id: 'oatmeal_light',
    name: '公司燕麦早餐（轻量）',
    desc: '燕麦 50g + 牛奶 150ml',
    kcal: 230, protein: 8, carbs: 42, fat: 4,
    emoji: '🥣',
    category: 'company_breakfast'
  }
];

export const COMPANY_LUNCH = [
  {
    id: 'chicken_lunch',
    name: '鸡胸肉套餐',
    desc: '鸡胸肉 200g + 糙米 100g + 蔬菜',
    kcal: 560, protein: 38, carbs: 45, fat: 14,
    emoji: '🍱',
    category: 'company_lunch'
  },
  {
    id: 'salmon_lunch',
    name: '三文鱼套餐',
    desc: '三文鱼 180g + 糙米 100g + 蔬菜',
    kcal: 590, protein: 40, carbs: 42, fat: 18,
    emoji: '🐟',
    category: 'company_lunch'
  },
  {
    id: 'salad_only',
    name: '大份蔬菜沙拉',
    desc: '混合蔬菜 400g + 鸡蛋 1 个 + 橄榄油醋汁',
    kcal: 280, protein: 8, carbs: 55, fat: 4,
    emoji: '🥗',
    category: 'company_lunch'
  }
];

export const COSTCO_DINNER = [
  {
    id: 'high_protein_dinner',
    name: '高蛋白晚餐组合',
    desc: '鸡胸肉 200g + 糙米 80g + 西兰花 150g',
    kcal: 580, protein: 52, carbs: 52, fat: 8,
    emoji: '🍽️',
    category: 'costco_dinner'
  },
  {
    id: 'salmon_dinner',
    name: '三文鱼晚餐',
    desc: 'Costco 三文鱼 200g + 烤蔬菜',
    kcal: 620, protein: 44, carbs: 12, fat: 42,
    emoji: '🐠',
    category: 'costco_dinner'
  },
  {
    id: 'beef_veg_bowl',
    name: '牛肉蔬菜碗',
    desc: '牛肉末 150g + 彩椒 100g + 糙米 80g',
    kcal: 550, protein: 45, carbs: 40, fat: 14,
    emoji: '🥩',
    category: 'costco_dinner'
  },
  {
    id: 'egg_veg_no_rice',
    name: '蛋类蔬菜（无主食）',
    desc: '鸡蛋 3 个 + 菠菜/蘑菇炒',
    kcal: 380, protein: 28, carbs: 10, fat: 24,
    emoji: '🍳',
    category: 'costco_dinner'
  },
  {
    id: 'shrimp_rice_bowl',
    name: '蒜蓉虾仁碗',
    desc: '无壳虾 200g + 蒜蓉炒 + 西兰花 150g + 糙米 60g',
    kcal: 380, protein: 46, carbs: 32, fat: 6,
    emoji: '🍤',
    category: 'costco_dinner'
  },
  {
    id: 'shrimp_veg_stir',
    name: '虾仁蔬菜炒（无主食）',
    desc: '无壳虾 200g + 彩椒/西兰花/洋葱 200g',
    kcal: 280, protein: 42, carbs: 14, fat: 5,
    emoji: '🍤',
    category: 'costco_dinner'
  },
  {
    id: 'lemon_shrimp_salad',
    name: '柠檬虾仁沙拉',
    desc: '无壳虾 150g + 大份沙拉 + 橄榄油',
    kcal: 260, protein: 34, carbs: 12, fat: 9,
    emoji: '🥗',
    category: 'costco_dinner'
  }
];

export const SNACKS = [
  { id: 'apple',         name: '苹果 1个',         desc: '',               kcal: 80,  protein: 0.4, carbs: 21, fat: 0.2, emoji: '🍎', category: 'snack' },
  { id: 'banana',        name: '香蕉 1根',         desc: '',               kcal: 90,  protein: 1.1, carbs: 23, fat: 0.3, emoji: '🍌', category: 'snack' },
  { id: 'orange',        name: '橙子 1个',         desc: '',               kcal: 65,  protein: 1.2, carbs: 16, fat: 0.2, emoji: '🍊', category: 'snack' },
  { id: 'protein_bar',   name: '蛋白棒（Kirkland）', desc: '',              kcal: 190, protein: 21,  carbs: 21, fat: 7,   emoji: '🍫', category: 'snack' },
  { id: 'greek_yogurt',  name: '希腊酸奶 150g',    desc: '',               kcal: 130, protein: 17,  carbs: 9,  fat: 0,   emoji: '🥛', category: 'snack' },
  { id: 'nuts_30g',      name: '坚果 30g',         desc: '综合坚果',        kcal: 180, protein: 4,   carbs: 8,  fat: 15,  emoji: '🥜', category: 'snack' },
  { id: 'pumpkin_seeds', name: '南瓜籽 30g',       desc: '补锌，每周2-3次', kcal: 160, protein: 9,   carbs: 5,  fat: 14,  emoji: '🌰', category: 'snack' }
];

export const ALL_PRESETS = [
  ...HOME_BREAKFAST,
  ...COMPANY_BREAKFAST,
  ...COMPANY_LUNCH,
  ...COSTCO_DINNER,
  ...SNACKS
];

export const PRESET_CATEGORIES = [
  { id: 'home_breakfast',   name: '家庭早餐', emoji: '🏠' },
  { id: 'company_breakfast',name: '公司早餐', emoji: '🏢' },
  { id: 'company_lunch',    name: '公司午餐', emoji: '🍱' },
  { id: 'costco_dinner',    name: 'Costco晚餐',emoji: '🛒' },
  { id: 'snack',            name: '零食/加餐', emoji: '🍎' },
];
