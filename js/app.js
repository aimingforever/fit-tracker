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
// Legal Disclaimer
// ============================================================
function showDisclaimer(onAccept) {
  // Build disclaimer HTML — reuses the wizard modal slot but with custom title
  const html = `
    <div class="modal-title">⚖️ 使用须知 & 隐私声明</div>
    <div style="max-height:55vh;overflow-y:auto;font-size:13px;line-height:1.7;color:#374151">
      <p><b>🏥 仅供个人记录和参考</b></p>
      <p>本应用仅为个人健康数据记录与参考工具，不构成任何医疗建议、诊断或治疗方案。如有任何健康问题，请和具有执业资格的医师或医疗专业人员咨询。</p>
      <p><b>🔒 数据存储与隐私</b></p>
      <ul style="padding-left:16px;margin:4px 0">
        <li>本应用不收集、不传输、不存储任何个人信息至任何服务器</li>
        <li>所有数据（体重、饮食、训练记录等）仅存储在您自己设备的浏览器本地（localStorage）</li>
        <li>您对自己的数据负全部责任，建议定期导出备份</li>
        <li>唯一外部请求为加载图表库（Chart.js / jsDelivr CDN），不包含任何用户数据</li>
      </ul>
      <p><b>🇺🇸 / 🇨🇳 适用法律</b></p>
      <p>本应用遵守美合众国相关法律及中华人民共和国《个人信息保护法（PIPL）》等相关法律法规。由于本应用不收集任何个人信息，不适用需要数据处理塀准的法律要求。</p>
      <p style="color:#9ca3af;font-size:11px">继续使用即表示您已阅读并同意上述内容。</p>
    </div>
    <button class="btn btn-primary btn-full" style="margin-top:12px" onclick="window._acceptDisclaimer()">✓ 我已阅读并同意，继续使用</button>
  `;
  showModal(html);
  // Prevent closing by tapping the backdrop
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.onclick = null;

  window._acceptDisclaimer = () => {
    const s = getSettings();
    s.disclaimerAccepted = true;
    saveSettings(s);
    hideModal();
    onAccept();
  };
}

// ============================================================
// First-Run Wizard
// ============================================================
function showWizard() {
  const html = `
    <div class="modal-title">👋 欢迎使用 3 个月减脂计划</div>
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
        <input type="number" id="wiz-weight" placeholder="例：195" min="100" max="400" step="0.1" oninput="window._wizCalcTargets()">
      </div>
      <div class="form-group">
        <label>目标体重 (磅)</label>
        <input type="number" id="wiz-goal" placeholder="例：165" min="100" max="400" step="0.1">
      </div>
      <div id="wiz-calc-box" style="display:none;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:10px 14px;font-size:13px;color:#15803d;margin-bottom:4px">
        自动计算 → 每日热量目标：<b id="wiz-calc-kcal"></b> kcal &nbsp;·&nbsp; 蛋白质目标：<b id="wiz-calc-protein"></b> g
        <div style="font-size:11px;color:#6b7280;margin-top:4px">可在设置中随时调整</div>
      </div>
      <button type="submit" class="btn btn-primary btn-full" style="margin-top:8px">开始计划 🚀</button>
    </form>
  `;
  showModal(html);

  window._wizCalcTargets = () => {
    const w = parseFloat(document.getElementById('wiz-weight')?.value);
    const box = document.getElementById('wiz-calc-box');
    if (!w || w < 100) { if (box) box.style.display = 'none'; return; }
    const kcal    = Math.max(1500, Math.round(w * 9.2 / 100) * 100);
    const protein = Math.round(w * 0.73);
    document.getElementById('wiz-calc-kcal').textContent    = kcal;
    document.getElementById('wiz-calc-protein').textContent = protein;
    if (box) box.style.display = '';
  };

  document.getElementById('wizard-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const settings = getSettings();
    settings.isFirstRun        = false;
    settings.userName          = document.getElementById('wiz-name').value.trim() || null;
    settings.startDate         = document.getElementById('wiz-start').value;
    const startW = parseFloat(document.getElementById('wiz-weight').value);
    const goalW  = parseFloat(document.getElementById('wiz-goal').value);
    if (!startW || startW < 100) { showToast('请输入当前体重', 'danger'); return; }
    if (!goalW  || goalW  < 80)  { showToast('请输入目标体重', 'danger'); return; }
    settings.startWeightLbs    = startW;
    settings.goalWeightLbs     = goalW;
    settings.dailyKcalTarget   = Math.max(1500, Math.round(startW * 9.2 / 100) * 100);
    settings.dailyProteinTarget= Math.round(startW * 0.73);
    saveSettings(settings);
    hideModal();
    showToast('设置已保存！开始你的 3 个月旅程 💪', 'success');
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

  // Disclaimer + first-run wizard
  if (!settings.disclaimerAccepted) {
    await navigate('dashboard');
    showDisclaimer(() => { if (settings.isFirstRun) showWizard(); });
  } else if (settings.isFirstRun) {
    await navigate('dashboard');
    showWizard();
  } else {
    await navigate('dashboard');
  }
}

boot();
