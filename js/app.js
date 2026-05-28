// js/app.js — App Shell: 路由、事件总线、Toast、Modal、初始化

import { getSettings, saveSettings, getTodayDate } from './storage.js';

// ============================================================
// Event Bus
// ============================================================
const _listeners = {};

export function on(event, handler) {
  if (!_listeners[event]) _listeners[event] = [];
  _listeners[event].push(handler);
}

export function off(event, handler) {
  if (!_listeners[event]) return;
  _listeners[event] = _listeners[event].filter(h => h !== handler);
}

export function emit(event, payload) {
  (_listeners[event] || []).forEach(h => {
    try { h(payload); } catch (e) { console.error('Event handler error', event, e); }
  });
}

// Expose emit globally for gamification engine (avoids circular import)
window.__fitEmit = emit;

// ============================================================
// Toast
// ============================================================
export function showToast(message, type = 'success', duration = 2800) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================================
// Modal (Bottom Sheet)
// ============================================================
export function showModal(html) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  content.innerHTML = `<div class="modal-drag-handle"></div>${html}`;
  overlay.removeAttribute('hidden');
  overlay.onclick = (e) => { if (e.target === overlay) hideModal(); };
}

export function hideModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.setAttribute('hidden', '');
  document.getElementById('modal-content').innerHTML = '';
}

// ============================================================
// Navigation / Tab Routing
// ============================================================
let _currentTab = 'dashboard';
const _moduleCache = {};

const TAB_MODULES = {
  dashboard: () => import('./modules/dashboard.js'),
  diet:      () => import('./modules/diet.js'),
  exercise:  () => import('./modules/exercise.js'),
  data:      () => import('./modules/data-page.js'),
  settings:  () => import('./modules/settings.js'),
};

async function navigate(tab) {
  if (tab === _currentTab && _moduleCache[tab]) return;

  // Update active tab button
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  // Show/hide panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    const panelTab = panel.id.replace('tab-', '');
    if (panelTab === tab) {
      panel.removeAttribute('hidden');
    } else {
      panel.setAttribute('hidden', '');
    }
  });

  _currentTab = tab;

  // Lazy-load the module
  const loader = TAB_MODULES[tab];
  if (!loader) return;

  try {
    const mod = await loader();
    if (!_moduleCache[tab]) {
      _moduleCache[tab] = mod;
      const el = document.getElementById(`tab-${tab}`);
      if (el && mod.init) mod.init(el);
    }
    if (_moduleCache[tab] && _moduleCache[tab].refresh) {
      _moduleCache[tab].refresh();
    }
  } catch (e) {
    console.error(`Failed to load module: ${tab}`, e);
  }
}

// ============================================================
// First-Run Wizard
// ============================================================
function showWizard() {
  const html = `
    <div class="modal-title">👋 欢迎使用 13 周减脂计划</div>
    <p class="text-muted text-sm mb-2">先设置一下基本信息，只需 1 分钟。</p>
    <form id="wizard-form">
      <div class="form-group">
        <label>你的姓名（可选）</label>
        <input type="text" id="wiz-name" placeholder="例：阿强" maxlength="20">
      </div>
      <div class="form-group">
        <label>计划开始日期</label>
        <input type="date" id="wiz-start" value="${getTodayDate()}">
      </div>
      <div class="form-group">
        <label>当前体重 (磅)</label>
        <input type="number" id="wiz-weight" value="195" min="100" max="400" step="0.1">
      </div>
      <div class="form-group">
        <label>目标体重 (磅)</label>
        <input type="number" id="wiz-goal" value="165" min="100" max="400" step="0.1">
      </div>
      <div class="form-group">
        <label>每日热量目标 (kcal)</label>
        <input type="number" id="wiz-kcal" value="1800" min="1200" max="3000" step="50">
      </div>
      <div class="form-group">
        <label>每日蛋白质目标 (g)</label>
        <input type="number" id="wiz-protein" value="140" min="50" max="300" step="5">
      </div>
      <button type="submit" class="btn btn-primary btn-full" style="margin-top:8px">开始计划 🚀</button>
    </form>
  `;
  showModal(html);

  document.getElementById('wizard-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const settings = getSettings();
    settings.isFirstRun        = false;
    settings.userName          = document.getElementById('wiz-name').value.trim() || null;
    settings.startDate         = document.getElementById('wiz-start').value;
    settings.startWeightLbs    = parseFloat(document.getElementById('wiz-weight').value) || 195;
    settings.goalWeightLbs     = parseFloat(document.getElementById('wiz-goal').value) || 165;
    settings.dailyKcalTarget   = parseInt(document.getElementById('wiz-kcal').value)   || 1800;
    settings.dailyProteinTarget= parseInt(document.getElementById('wiz-protein').value)|| 140;
    saveSettings(settings);
    hideModal();
    showToast('设置已保存！开始你的 13 周旅程 💪', 'success');
    navigate('dashboard');
  });
}

// ============================================================
// XP / Level-up notifications (global listeners)
// ============================================================
function initGlobalListeners() {
  on('fit:xpGained', ({ xp, reasons }) => {
    if (xp > 0) showToast(`+${xp} XP  ${reasons[reasons.length - 1] || ''}`, 'success', 2500);
  });

  on('fit:levelUp', ({ level, name }) => {
    showToast(`🎉 升级！Lv.${level} ${name}`, 'warning', 4000);
  });

  on('fit:badgeUnlocked', ({ badges }) => {
    badges.forEach(b => showToast(`🏅 解锁徽章：${b.emoji} ${b.name}`, 'info', 3500));
  });

  on('fit:comeback', () => {
    showToast('欢迎回来！重新出发 🔥', 'warning', 3000);
  });
}

// ============================================================
// Boot
// ============================================================
async function boot() {
  const settings = getSettings();

  // Bottom nav click
  document.getElementById('bottom-nav').addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-btn');
    if (btn && btn.dataset.tab) navigate(btn.dataset.tab);
  });

  initGlobalListeners();

  // First-run wizard
  if (settings.isFirstRun) {
    await navigate('dashboard');
    showWizard();
  } else {
    await navigate('dashboard');
  }
}

boot();
