// js/modules/data-page.js — 数据趋势页

import { getRecentLogs, getDailyLog, saveDailyLog, getTodayDate, getSettings } from '../storage.js';
import { showToast, on } from '../app.js';
import { handleDayComplete } from '../engines/gamification.js';
import { getAchievements } from '../storage.js';
import { getLevelInfo, BADGES } from '../engines/gamification.js';

let _el = null;
let _date = getTodayDate();
let _charts = {};
let _activeTab = 'weight';

export function init(el) {
  _el = el;
  on('fit:logUpdated', () => refresh());
  render();
}

export function refresh() {
  _date = getTodayDate();
  destroyCharts();
  render();
}

function destroyCharts() {
  Object.values(_charts).forEach(c => { try { c.destroy(); } catch {} });
  _charts = {};
}

function render() {
  _el.innerHTML = `
    <div class="section-title">📊 数据与趋势</div>

    <!-- 标签切换 -->
    <div class="quick-tabs" style="margin-bottom:12px">
      ${[
        { id: 'weight', label: '⚖️ 体重' },
        { id: 'sleep',  label: '😴 睡眠' },
        { id: 'mood',   label: '😊 心情' },
        { id: 'weekly', label: '📅 周报' },
        { id: 'badges', label: '🏅 徽章' },
      ].map(t => `
        <button class="quick-tab-btn ${_activeTab === t.id ? 'active' : ''}"
                onclick="window._switchDataTab('${t.id}')">${t.label}</button>
      `).join('')}
    </div>

    <div id="data-tab-content">
      ${renderActiveTabContent()}
    </div>
  `;

  window._switchDataTab = (tabId) => {
    _activeTab = tabId;
    destroyCharts();
    document.querySelectorAll('#data-page-wrap .quick-tab-btn').forEach(btn => {
      const id = btn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
      btn.classList.toggle('active', id === tabId);
    });
    document.querySelectorAll('.quick-tab-btn').forEach(btn => {
      const id = btn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
      btn.classList.toggle('active', id === tabId);
    });
    const content = document.getElementById('data-tab-content');
    if (content) {
      content.innerHTML = renderActiveTabContent();
      initCharts();
    }
  };

  initCharts();
}

function renderActiveTabContent() {
  switch (_activeTab) {
    case 'weight': return renderWeightTab();
    case 'sleep':  return renderSleepTab();
    case 'mood':   return renderMoodTab();
    case 'weekly': return renderWeeklyTab();
    case 'badges': return renderBadgesTab();
    default:       return '';
  }
}

// ============================================================
// Weight Tab
// ============================================================
function renderWeightTab() {
  const logs   = getRecentLogs(30);
  const today  = getDailyLog(_date);
  const weightLogs = logs.filter(l => l.log.weightLbs != null).slice(0, 14);

  return `
    <!-- 今日体重输入 -->
    <div class="card">
      <div class="card-title">今日体重</div>
      <div class="data-input-row">
        <input type="number" id="weight-today" value="${today.weightLbs || ''}"
               placeholder="输入体重 (磅)" min="80" max="500" step="0.1">
        <button class="btn btn-primary" onclick="window._saveWeightToday()">保存</button>
      </div>
    </div>

    <!-- 趋势图 -->
    <div class="card">
      <div class="card-title">最近 14 天体重趋势</div>
      ${weightLogs.length < 2
        ? '<div class="empty-state"><div class="icon">📈</div><div class="msg">记录更多天数后显示趋势图</div></div>'
        : '<div class="chart-wrap"><canvas id="weight-chart"></canvas></div>'
      }
    </div>

    <!-- 数据列表 -->
    <div class="card">
      <div class="card-title">历史记录</div>
      ${weightLogs.length === 0
        ? '<div class="text-muted text-sm">暂无体重记录</div>'
        : weightLogs.map(({ date, log }) => `
            <div class="list-item">
              <span class="text-muted text-sm" style="min-width:90px">${formatDate(date)}</span>
              <span class="font-bold">${log.weightLbs} lbs</span>
              <span class="text-muted text-sm">${(log.weightLbs * 0.4536).toFixed(1)} kg</span>
            </div>
          `).join('')
      }
    </div>
  `;
}

// ============================================================
// Sleep Tab
// ============================================================
function renderSleepTab() {
  const logs   = getRecentLogs(14);
  const today  = getDailyLog(_date);
  const sleepLogs = logs.filter(l => l.log.sleepHours != null);

  return `
    <!-- 今日睡眠 -->
    <div class="card">
      <div class="card-title">今日睡眠</div>
      <div class="form-group">
        <label>睡眠时长 (小时)</label>
        <input type="number" id="sleep-today" value="${today.sleepHours || ''}"
               placeholder="例：7.5" min="0" max="24" step="0.5">
      </div>
      <div class="form-group">
        <label>睡眠质量 (1–5星)</label>
        <input type="number" id="sleep-quality-today" value="${today.sleepQuality || ''}"
               placeholder="1–5" min="1" max="5" step="1">
      </div>
      <button class="btn btn-primary btn-full" onclick="window._saveSleepToday()">保存</button>
    </div>

    <!-- 趋势图 -->
    <div class="card">
      <div class="card-title">最近 14 天睡眠趋势</div>
      ${sleepLogs.length < 2
        ? '<div class="empty-state"><div class="icon">😴</div><div class="msg">记录更多后显示趋势图</div></div>'
        : '<div class="chart-wrap"><canvas id="sleep-chart"></canvas></div>'
      }
    </div>

    <!-- 列表 -->
    <div class="card">
      <div class="card-title">历史记录</div>
      ${sleepLogs.length === 0
        ? '<div class="text-muted text-sm">暂无睡眠记录</div>'
        : sleepLogs.map(({ date, log }) => `
            <div class="list-item">
              <span class="text-muted text-sm" style="min-width:90px">${formatDate(date)}</span>
              <span class="font-bold">${log.sleepHours}h</span>
              ${log.sleepQuality ? `<span class="badge badge-${log.sleepQuality >= 4 ? 'green' : 'yellow'}">${'⭐'.repeat(log.sleepQuality)}</span>` : ''}
              ${log.sleepHours >= 7 ? '<span class="badge badge-green">达标</span>' : '<span class="badge badge-yellow">不足</span>'}
            </div>
          `).join('')
      }
    </div>
  `;
}

// ============================================================
// Mood Tab
// ============================================================
function renderMoodTab() {
  const today   = getDailyLog(_date);
  const logs    = getRecentLogs(14);
  const moodMap = { 1:'😞', 2:'😟', 3:'😐', 4:'😊', 5:'😄' };

  return `
    <!-- 今日心情 -->
    <div class="card">
      <div class="card-title">今日心情</div>
      <div class="mood-grid">
        ${[1,2,3,4,5].map(n => `
          <button class="mood-btn ${today.mood === n ? 'selected' : ''}"
                  onclick="window._setMood(${n})">${moodMap[n]}<div style="font-size:10px;margin-top:2px">${getMoodLabel(n)}</div></button>
        `).join('')}
      </div>
      <div class="form-group" style="margin-top:12px">
        <label>备注 (可选)</label>
        <textarea id="mood-note" placeholder="今天有什么感受？" rows="2"
                  style="resize:none">${today.moodNote || ''}</textarea>
      </div>
      <button class="btn btn-primary btn-full" onclick="window._saveMood()">保存</button>
    </div>

    <!-- 心情历史 -->
    <div class="card">
      <div class="card-title">心情趋势</div>
      ${logs.filter(l => l.log.mood).length < 2
        ? '<div class="empty-state"><div class="icon">😊</div><div class="msg">记录更多后显示趋势</div></div>'
        : '<div class="chart-wrap"><canvas id="mood-chart"></canvas></div>'
      }
    </div>
  `;
}

// ============================================================
// Weekly Report Tab
// ============================================================
function renderWeeklyTab() {
  const logs = getRecentLogs(7);

  const totalWorkouts   = logs.filter(l => l.log.workout?.completed).length;
  const avgKcal         = avg(logs.map(l => l.log.meals.reduce((s, m) => s + (m.kcal || 0), 0)));
  const avgProtein      = avg(logs.map(l => l.log.meals.reduce((s, m) => s + (m.protein || 0), 0)));
  const avgSleep        = avg(logs.filter(l => l.log.sleepHours).map(l => l.log.sleepHours));
  const waterDays       = logs.filter(l => (l.log.waterMl || 0) >= 2500).length;
  const settings        = getSettings();
  const kcalTarget      = settings.dailyKcalTarget || 1800;

  return `
    <div class="card">
      <div class="card-title">本周（过去7天）概览</div>
      <div class="weekly-stat-grid">
        <div class="weekly-stat-item">
          <div class="wval">${totalWorkouts}</div>
          <div class="wlbl">训练天数</div>
        </div>
        <div class="weekly-stat-item">
          <div class="wval">${avgKcal ? Math.round(avgKcal) : '--'}</div>
          <div class="wlbl">平均热量</div>
        </div>
        <div class="weekly-stat-item">
          <div class="wval">${avgProtein ? Math.round(avgProtein) + 'g' : '--'}</div>
          <div class="wlbl">平均蛋白质</div>
        </div>
        <div class="weekly-stat-item">
          <div class="wval">${avgSleep ? avgSleep.toFixed(1) + 'h' : '--'}</div>
          <div class="wlbl">平均睡眠</div>
        </div>
        <div class="weekly-stat-item">
          <div class="wval">${waterDays}/7</div>
          <div class="wlbl">饮水达标天</div>
        </div>
        <div class="weekly-stat-item">
          <div class="wval">${kcalTarget}</div>
          <div class="wlbl">热量目标</div>
        </div>
      </div>
    </div>

    <!-- 每日明细 -->
    <div class="card">
      <div class="card-title">每日明细</div>
      ${logs.length === 0
        ? '<div class="text-muted text-sm">暂无记录</div>'
        : logs.map(({ date, log }) => {
            const kcal    = log.meals.reduce((s, m) => s + (m.kcal || 0), 0);
            const protein = log.meals.reduce((s, m) => s + (m.protein || 0), 0);
            return `
              <div class="list-item" style="flex-wrap:wrap;gap:6px">
                <span class="text-sm font-semibold" style="min-width:80px">${formatDate(date)}</span>
                ${log.workout?.completed ? '<span class="badge badge-green">训练✓</span>' : '<span class="badge badge-gray">未训练</span>'}
                ${kcal > 0 ? `<span class="badge badge-${kcal <= kcalTarget ? 'green' : 'red'}">${kcal}kcal</span>` : ''}
                ${protein > 0 ? `<span class="badge badge-${protein >= 140 ? 'green' : 'yellow'}">${Math.round(protein)}g蛋白</span>` : ''}
                ${log.sleepHours ? `<span class="badge badge-${log.sleepHours >= 7 ? 'green' : 'yellow'}">${log.sleepHours}h睡</span>` : ''}
              </div>
            `;
          }).join('')
      }
    </div>
  `;
}

// ============================================================
// Badges Tab
// ============================================================
function renderBadgesTab() {
  const ach = getAchievements();
  const unlocked = ach.unlockedBadges || [];
  const levelInfo = getLevelInfo(ach.totalXP || 0);

  const categories = [
    { id: 'training',     label: '训练类' },
    { id: 'diet',         label: '饮食类' },
    { id: 'sleep',        label: '睡眠类' },
    { id: 'water',        label: '饮水类' },
    { id: 'weight',       label: '体重类' },
    { id: 'comprehensive',label: '综合类' },
  ];

  return `
    <!-- XP / Level summary -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="text-xl font-bold">Lv.${levelInfo.level} ${levelInfo.name}</div>
          <div class="text-muted text-sm">总 XP: ${ach.totalXP || 0}</div>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold" style="color:var(--color-primary)">${unlocked.length}</div>
          <div class="text-muted text-sm">/ ${BADGES.length} 徽章</div>
        </div>
      </div>
      <div class="progress-wrap">
        <div class="progress-bar progress-green" style="width:${(unlocked.length / BADGES.length * 100).toFixed(1)}%"></div>
      </div>
    </div>

    ${categories.map(cat => {
      const catBadges = BADGES.filter(b => b.category === cat.id);
      return `
        <div class="card">
          <div class="card-title">${cat.label}</div>
          <div class="badge-grid">
            ${catBadges.map(badge => {
              const isUnlocked = unlocked.includes(badge.id);
              return `
                <div class="badge-item ${isUnlocked ? '' : 'locked'}" title="${badge.desc || badge.name}">
                  <div class="badge-emoji">${badge.emoji}</div>
                  <div class="badge-name">${badge.name}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('')}
  `;
}

// ============================================================
// Chart initialization
// ============================================================
function initCharts() {
  if (typeof Chart === 'undefined') return;

  if (_activeTab === 'weight') {
    const logs = getRecentLogs(14).filter(l => l.log.weightLbs != null).reverse();
    if (logs.length >= 2 && document.getElementById('weight-chart')) {
      _charts.weight = new Chart(document.getElementById('weight-chart'), {
        type: 'line',
        data: {
          labels: logs.map(l => formatDate(l.date)),
          datasets: [{
            label: '体重 (lbs)',
            data: logs.map(l => l.log.weightLbs),
            borderColor: '#16a34a',
            backgroundColor: 'rgba(22,163,74,0.08)',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: false } }
        }
      });
    }
  }

  if (_activeTab === 'sleep') {
    const logs = getRecentLogs(14).filter(l => l.log.sleepHours != null).reverse();
    if (logs.length >= 2 && document.getElementById('sleep-chart')) {
      _charts.sleep = new Chart(document.getElementById('sleep-chart'), {
        type: 'bar',
        data: {
          labels: logs.map(l => formatDate(l.date)),
          datasets: [{
            label: '睡眠 (h)',
            data: logs.map(l => l.log.sleepHours),
            backgroundColor: logs.map(l => l.log.sleepHours >= 7 ? '#16a34a' : '#f59e0b'),
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, max: 12 } }
        }
      });
    }
  }

  if (_activeTab === 'mood') {
    const logs = getRecentLogs(14).filter(l => l.log.mood).reverse();
    if (logs.length >= 2 && document.getElementById('mood-chart')) {
      _charts.mood = new Chart(document.getElementById('mood-chart'), {
        type: 'line',
        data: {
          labels: logs.map(l => formatDate(l.date)),
          datasets: [{
            label: '心情',
            data: logs.map(l => l.log.mood),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.08)',
            fill: true,
            tension: 0.3,
            pointRadius: 5,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: false, min: 1, max: 5, ticks: { stepSize: 1 } } }
        }
      });
    }
  }
}

// ============================================================
// Handlers
// ============================================================
window._saveWeightToday = () => {
  const val = parseFloat(document.getElementById('weight-today')?.value);
  if (!val || val < 80) { showToast('请输入有效体重', 'danger'); return; }
  const log = getDailyLog(_date);
  log.weightLbs = val;
  saveDailyLog(_date, log);
  handleDayComplete(_date, log);
  destroyCharts();
  render();
  showToast(`体重已记录: ${val} lbs`, 'success', 1500);
};

window._saveSleepToday = () => {
  const hours   = parseFloat(document.getElementById('sleep-today')?.value);
  const quality = parseInt(document.getElementById('sleep-quality-today')?.value) || null;
  if (!hours) { showToast('请输入睡眠时长', 'danger'); return; }
  const log = getDailyLog(_date);
  log.sleepHours   = hours;
  log.sleepQuality = quality;
  saveDailyLog(_date, log);
  handleDayComplete(_date, log);
  destroyCharts();
  render();
  showToast('睡眠已记录', 'success', 1500);
};

window._setMood = (val) => {
  const log = getDailyLog(_date);
  log.mood = val;
  saveDailyLog(_date, log);
  // Re-render mood buttons
  document.querySelectorAll('.mood-btn').forEach((btn, idx) => {
    btn.classList.toggle('selected', idx + 1 === val);
  });
};

window._saveMood = () => {
  const log = getDailyLog(_date);
  log.moodNote = document.getElementById('mood-note')?.value || '';
  saveDailyLog(_date, log);
  showToast('心情已保存 😊', 'success', 1500);
};

// ============================================================
// Helpers
// ============================================================
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function avg(arr) {
  const valid = arr.filter(v => v != null && v > 0);
  if (valid.length === 0) return null;
  return valid.reduce((s, v) => s + v, 0) / valid.length;
}

function getMoodLabel(n) {
  return ['很差','较差','一般','不错','极好'][n - 1] || '';
}
