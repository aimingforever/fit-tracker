// js/modules/diet.js — 饮食记录模块

import { getDailyLog, saveDailyLog, getSettings, getCustomFoods, saveCustomFoods, getTodayDate } from '../storage.js';
import { ALL_PRESETS, PRESET_CATEGORIES } from '../data/presets.js';
import { handleDayComplete } from '../engines/gamification.js';
import { showModal, hideModal, showToast, on } from '../app.js';

let _el = null;
let _date = getTodayDate();
let _activeCategory = 'home_breakfast';

export function init(el) {
  _el = el;
  on('fit:logUpdated', () => refresh());
  render();
}

export function refresh() {
  _date = getTodayDate();
  render();
}

function render() {
  const log      = getDailyLog(_date);
  const settings = getSettings();
  const meals    = log.meals || [];

  const totalKcal    = meals.reduce((s, m) => s + (m.kcal    || 0), 0);
  const totalProtein = meals.reduce((s, m) => s + (m.protein || 0), 0);
  const totalCarbs   = meals.reduce((s, m) => s + (m.carbs   || 0), 0);
  const totalFat     = meals.reduce((s, m) => s + (m.fat     || 0), 0);
  const kcalTarget   = settings.dailyKcalTarget || 1800;
  const proteinTarget= settings.dailyProteinTarget || 140;

  // Group meals by slot
  const SLOTS = [
    { id: 'breakfast', label: '早餐', emoji: '🌅' },
    { id: 'lunch',     label: '午餐', emoji: '☀️' },
    { id: 'dinner',    label: '晚餐', emoji: '🌙' },
    { id: 'snack',     label: '零食/加餐', emoji: '🍎' },
  ];

  const slotMeals = {};
  SLOTS.forEach(s => { slotMeals[s.id] = meals.filter(m => m.slot === s.id); });

  _el.innerHTML = `
    <div class="section-title">🥗 今日饮食</div>

    <!-- 进食顺序提示 -->
    <div class="card" style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border-left:4px solid var(--color-primary)">
      <div class="card-title" style="margin-bottom:8px">🍽️ 进食顺序（降低血糖峰值 20–30%）</div>
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <div style="display:flex;align-items:center;gap:6px">
          <span style="background:var(--color-primary);color:#fff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">①</span>
          <span style="font-size:14px">蛋白质 + 蔬菜</span>
        </div>
        <span style="color:var(--color-muted);font-size:18px">→</span>
        <div style="display:flex;align-items:center;gap:6px">
          <span style="background:#f59e0b;color:#fff;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0">②</span>
          <span style="font-size:14px">主食最后吃（米饭 / 面包）</span>
        </div>
      </div>
    </div>

    <!-- 汇总 -->
    <div class="card">
      <div class="card-title">今日汇总</div>
      <div class="summary-bar">
        <div class="summary-stat">
          <div class="val ${totalKcal > kcalTarget ? 'text-danger' : 'text-success'}">${totalKcal}</div>
          <div class="lbl">热量 (kcal)</div>
        </div>
        <div class="summary-stat">
          <div class="val ${totalProtein >= proteinTarget ? 'text-success' : 'text-warning'}">${totalProtein}g</div>
          <div class="lbl">蛋白质</div>
        </div>
        <div class="summary-stat">
          <div class="val">${totalCarbs}g</div>
          <div class="lbl">碳水</div>
        </div>
        <div class="summary-stat">
          <div class="val">${totalFat}g</div>
          <div class="lbl">脂肪</div>
        </div>
      </div>
      <div class="progress-wrap">
        <div class="progress-bar ${totalKcal > kcalTarget ? 'progress-red' : 'progress-green'}"
             style="width:${Math.min(100, (totalKcal / kcalTarget) * 100).toFixed(1)}%"></div>
      </div>
      <div class="text-sm text-muted mt-2 text-right">目标 ${kcalTarget} kcal · 剩余 ${Math.max(0, kcalTarget - totalKcal)} kcal</div>
    </div>

    <!-- 餐食记录列表 -->
    <div class="card">
      <div class="card-title">餐食记录</div>
      ${SLOTS.map(slot => {
        const items = slotMeals[slot.id];
        const slotKcal = items.reduce((s, m) => s + (m.kcal || 0), 0);
        return `
          <div class="meal-section">
            <div class="meal-header">
              ${slot.emoji} ${slot.label}
              ${slotKcal > 0 ? `<span class="text-muted text-sm"> — ${slotKcal} kcal</span>` : ''}
              <button class="btn btn-ghost btn-sm" style="float:right;padding:0;font-size:18px" onclick="window._openAddFood('${slot.id}')">＋</button>
            </div>
            ${items.length === 0
              ? `<div class="text-muted text-sm" style="padding:4px 0 8px">点击 ＋ 添加${slot.label}</div>`
              : items.map((food, idx) => `
                  <div class="meal-food-row">
                    <span>${food.emoji || '🍽️'}</span>
                    <span class="food-name">${food.name}</span>
                    <span class="food-kcal">${food.kcal} kcal</span>
                    <button class="btn btn-ghost btn-icon" onclick="window._removeFood('${slot.id}', ${idx})" style="font-size:16px;color:var(--color-danger)">✕</button>
                  </div>
                `).join('')
            }
          </div>
        `;
      }).join('')}
    </div>

    <!-- 快速选择预设 -->
    <div class="card">
      <div class="card-title">快速选择</div>
      <div class="quick-tabs">
        ${PRESET_CATEGORIES.map(cat => `
          <button class="quick-tab-btn ${_activeCategory === cat.id ? 'active' : ''}"
                  onclick="window._switchCategory('${cat.id}')">${cat.emoji} ${cat.name}</button>
        `).join('')}
        <button class="quick-tab-btn ${_activeCategory === 'custom' ? 'active' : ''}"
                onclick="window._switchCategory('custom')">📝 自定义</button>
      </div>
      <div id="preset-list">
        ${renderPresetList(_activeCategory)}
      </div>
    </div>
  `;

  // Handlers
  window._openAddFood = (slot) => {
    openAddFoodModal(slot);
  };

  window._removeFood = (slot, idx) => {
    const log = getDailyLog(_date);
    const slotItems = log.meals.filter(m => m.slot === slot);
    const allOthers = log.meals.filter(m => m.slot !== slot);
    slotItems.splice(idx, 1);
    log.meals = [...allOthers, ...slotItems];
    saveDailyLog(_date, log);
    triggerDayComplete();
    render();
  };

  window._switchCategory = (catId) => {
    _activeCategory = catId;
    const presetListEl = document.getElementById('preset-list');
    if (presetListEl) {
      presetListEl.innerHTML = renderPresetList(catId);
      document.querySelectorAll('.quick-tab-btn').forEach(btn => {
        const cat = btn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        btn.classList.toggle('active', cat === catId);
      });
    }
  };

  window._addPresetToSlot = (presetId, slot) => {
    const preset = ALL_PRESETS.find(p => p.id === presetId);
    if (!preset || !slot) return;
    const log = getDailyLog(_date);
    log.meals.push({
      id:      preset.id,
      name:    preset.name,
      kcal:    preset.kcal,
      protein: preset.protein,
      carbs:   preset.carbs,
      fat:     preset.fat,
      emoji:   preset.emoji,
      slot,
      addedAt: new Date().toISOString(),
    });
    saveDailyLog(_date, log);
    hideModal();
    triggerDayComplete();
    render();
    showToast(`${preset.emoji} ${preset.name} 已添加`, 'success', 1800);
  };
}

function renderPresetList(catId) {
  if (catId === 'custom') {
    const customs = getCustomFoods();
    if (customs.length === 0) {
      return `
        <div class="empty-state">
          <div class="icon">📝</div>
          <div class="msg">还没有自定义食物</div>
        </div>
        <button class="btn btn-outline btn-full mt-2" onclick="window._createCustomFood()">添加自定义食物</button>
      `;
    }
    return `
      ${customs.map(food => `
        <div class="preset-row">
          <span style="font-size:20px">${food.emoji || '🍽️'}</span>
          <div class="preset-info">
            <div class="preset-name">${food.name}</div>
            <div class="preset-kcal">${food.kcal} kcal · 蛋白质 ${food.protein}g</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window._addCustomToSlot('${food.id}')">添加</button>
        </div>
      `).join('')}
      <button class="btn btn-outline btn-full mt-2" onclick="window._createCustomFood()">+ 新增自定义食物</button>
    `;
  }
  const items = ALL_PRESETS.filter(p => p.category === catId);
  return items.map(food => `
    <div class="preset-row">
      <span style="font-size:20px">${food.emoji}</span>
      <div class="preset-info">
        <div class="preset-name">${food.name}</div>
        <div class="preset-kcal">${food.kcal} kcal · 蛋白质 ${food.protein}g · 碳水 ${food.carbs}g · 脂肪 ${food.fat}g</div>
        ${food.desc ? `<div class="text-muted text-sm">${food.desc}</div>` : ''}
      </div>
      <button class="btn btn-primary btn-sm" onclick="window._openAddFood_preset('${food.id}')">添加</button>
    </div>
  `).join('');
}

function openAddFoodModal(slot) {
  const html = `
    <div class="modal-title">添加到 ${getSlotLabel(slot)}</div>
    <div class="quick-tabs" style="margin-bottom:12px">
      ${PRESET_CATEGORIES.map(cat => `
        <button class="quick-tab-btn" onclick="window._modalShowCat('${cat.id}', '${slot}')">${cat.emoji} ${cat.name}</button>
      `).join('')}
    </div>
    <div id="modal-preset-list">
      ${renderModalPresets(PRESET_CATEGORIES[0].id, slot)}
    </div>
    <div class="divider"></div>
    <button class="btn btn-outline btn-full" onclick="window._openCustomEntry('${slot}')">✏️ 手动输入食物</button>
  `;
  showModal(html);

  window._modalShowCat = (catId, slot) => {
    document.getElementById('modal-preset-list').innerHTML = renderModalPresets(catId, slot);
    document.querySelectorAll('.quick-tab-btn').forEach(btn => {
      const cat = btn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
      btn.classList.toggle('active', cat === catId);
    });
  };
}

function renderModalPresets(catId, slot) {
  const items = ALL_PRESETS.filter(p => p.category === catId);
  return items.map(food => `
    <div class="preset-row">
      <span style="font-size:20px">${food.emoji}</span>
      <div class="preset-info">
        <div class="preset-name">${food.name}</div>
        <div class="preset-kcal">${food.kcal} kcal · P ${food.protein}g</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="window._addPresetToSlot('${food.id}', '${slot}')">+</button>
    </div>
  `).join('');
}

window._openAddFood_preset = (presetId) => {
  const preset = ALL_PRESETS.find(p => p.id === presetId);
  if (!preset) return;
  const html = `
    <div class="modal-title">${preset.emoji} ${preset.name}</div>
    <div class="text-muted text-sm mb-2">${preset.desc || ''}</div>
    <div class="card" style="margin-bottom:12px">
      <div class="flex" style="flex-wrap:wrap;gap:12px">
        <div><div class="text-xl font-bold">${preset.kcal}</div><div class="text-muted text-sm">kcal</div></div>
        <div><div class="text-xl font-bold">${preset.protein}g</div><div class="text-muted text-sm">蛋白质</div></div>
        <div><div class="text-xl font-bold">${preset.carbs}g</div><div class="text-muted text-sm">碳水</div></div>
        <div><div class="text-xl font-bold">${preset.fat}g</div><div class="text-muted text-sm">脂肪</div></div>
      </div>
    </div>
    <div class="form-group">
      <label>添加到哪一餐？</label>
      <select id="slot-select">
        <option value="breakfast">🌅 早餐</option>
        <option value="lunch">☀️ 午餐</option>
        <option value="dinner">🌙 晚餐</option>
        <option value="snack">🍎 零食/加餐</option>
      </select>
    </div>
    <button class="btn btn-primary btn-full" onclick="window._addPresetToSlot('${preset.id}', document.getElementById('slot-select').value)">添加</button>
  `;
  showModal(html);
};

window._openCustomEntry = (slot) => {
  const html = `
    <div class="modal-title">手动输入食物</div>
    <div class="form-group">
      <label>食物名称</label>
      <input type="text" id="cf-name" placeholder="例：自制沙拉" maxlength="40">
    </div>
    <div class="form-group">
      <label>热量 (kcal)</label>
      <input type="number" id="cf-kcal" value="0" min="0" max="5000" step="1">
    </div>
    <div class="form-group">
      <label>蛋白质 (g)</label>
      <input type="number" id="cf-protein" value="0" min="0" max="500" step="0.1">
    </div>
    <div class="form-group">
      <label>碳水 (g)</label>
      <input type="number" id="cf-carbs" value="0" min="0" max="500" step="0.1">
    </div>
    <div class="form-group">
      <label>脂肪 (g)</label>
      <input type="number" id="cf-fat" value="0" min="0" max="500" step="0.1">
    </div>
    <div class="form-group">
      <label>添加到哪一餐？</label>
      <select id="cf-slot">
        <option value="${slot}" selected>${getSlotLabel(slot)}</option>
        <option value="breakfast">🌅 早餐</option>
        <option value="lunch">☀️ 午餐</option>
        <option value="dinner">🌙 晚餐</option>
        <option value="snack">🍎 零食/加餐</option>
      </select>
    </div>
    <div class="flex gap-2">
      <button class="btn btn-outline" onclick="window._saveCustomEntry(false)">添加一次</button>
      <button class="btn btn-primary" onclick="window._saveCustomEntry(true)">添加并保存到自定义库</button>
    </div>
  `;
  showModal(html);
};

window._saveCustomEntry = (saveToLib) => {
  const name    = document.getElementById('cf-name')?.value.trim();
  if (!name) { showToast('请填写食物名称', 'danger'); return; }
  const kcal    = parseFloat(document.getElementById('cf-kcal')?.value)    || 0;
  const protein = parseFloat(document.getElementById('cf-protein')?.value) || 0;
  const carbs   = parseFloat(document.getElementById('cf-carbs')?.value)   || 0;
  const fat     = parseFloat(document.getElementById('cf-fat')?.value)     || 0;
  const slot    = document.getElementById('cf-slot')?.value || 'snack';

  const food = {
    id:      'custom_' + Date.now(),
    name,
    kcal,
    protein,
    carbs,
    fat,
    emoji:   '🍽️',
    slot,
    addedAt: new Date().toISOString(),
  };

  if (saveToLib) {
    const customs = getCustomFoods();
    customs.push({ ...food });
    saveCustomFoods(customs);
  }

  const log = getDailyLog(_date);
  log.meals.push(food);
  saveDailyLog(_date, log);
  hideModal();
  triggerDayComplete();
  render();
  showToast(`${name} 已添加 🍽️`, 'success', 1800);
};

window._addCustomToSlot = (foodId) => {
  const customs = getCustomFoods();
  const food = customs.find(f => f.id === foodId);
  if (!food) return;
  const html = `
    <div class="modal-title">${food.name}</div>
    <div class="form-group">
      <label>添加到哪一餐？</label>
      <select id="custom-slot-select">
        <option value="breakfast">🌅 早餐</option>
        <option value="lunch">☀️ 午餐</option>
        <option value="dinner">🌙 晚餐</option>
        <option value="snack">🍎 零食/加餐</option>
      </select>
    </div>
    <button class="btn btn-primary btn-full" onclick="
      const slot = document.getElementById('custom-slot-select').value;
      window._addCustomFoodEntry('${foodId}', slot)
    ">添加</button>
  `;
  showModal(html);
};

window._addCustomFoodEntry = (foodId, slot) => {
  const customs = getCustomFoods();
  const food = customs.find(f => f.id === foodId);
  if (!food) return;
  const log = getDailyLog(_date);
  log.meals.push({ ...food, slot, addedAt: new Date().toISOString() });
  saveDailyLog(_date, log);
  hideModal();
  triggerDayComplete();
  render();
  showToast(`${food.name} 已添加`, 'success', 1800);
};

window._createCustomFood = () => {
  window._openCustomEntry('snack');
};

function getSlotLabel(slot) {
  const labels = { breakfast: '🌅 早餐', lunch: '☀️ 午餐', dinner: '🌙 晚餐', snack: '🍎 零食/加餐' };
  return labels[slot] || slot;
}

function triggerDayComplete() {
  const log = getDailyLog(_date);
  handleDayComplete(_date, log);
}
