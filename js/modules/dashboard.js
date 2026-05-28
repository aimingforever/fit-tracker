// js/modules/dashboard.js — 主页仪表板

import { getSettings, getDailyLog, saveDailyLog, getAchievements, getTodayDate } from '../storage.js';
import { getLevelInfo, LEVELS } from '../engines/gamification.js';
import { handleDayComplete } from '../engines/gamification.js';
import { getRuleReminders } from '../engines/rules.js';
import { getCurrentWeek, getCurrentPhase, PLAN } from '../data/plan.js';
import { showModal, hideModal, showToast, on } from '../app.js';
import { getRandomMessage, MORNING_MESSAGES } from '../data/messages.js';

let _el = null;
let _date = getTodayDate();

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
  const settings = getSettings();
  const log      = getDailyLog(_date);
  const ach      = getAchievements();
  const levelInfo= getLevelInfo(ach.totalXP || 0);

  // Compute totals
  const totalKcal    = log.meals.reduce((s, m) => s + (m.kcal    || 0), 0);
  const totalProtein = log.meals.reduce((s, m) => s + (m.protein || 0), 0);
  const totalCarbs   = log.meals.reduce((s, m) => s + (m.carbs   || 0), 0);
  const totalFat     = log.meals.reduce((s, m) => s + (m.fat     || 0), 0);
  const kcalTarget   = settings.dailyKcalTarget   || 1800;
  const proteinTarget= settings.dailyProteinTarget || 140;
  const waterTarget  = settings.dailyWaterMl       || 2500;
  const waterMl      = log.waterMl || 0;

  // Current week/phase
  const week  = getCurrentWeek(settings.startDate);
  const phaseId = getCurrentPhase(settings.startDate);
  const phase = PLAN.phases.find(p => p.id === phaseId);

  // Streak
  const streak = ach.streak || 0;

  // Reminders
  const reminders = getRuleReminders(log);

  // Days since start
  let dayNum = 1;
  if (settings.startDate) {
    const diff = Math.floor((new Date(_date) - new Date(settings.startDate)) / 86400000);
    dayNum = Math.max(1, diff + 1);
  }

  const greeting = settings.userName ? `你好，${settings.userName}！` : '你好！';
  const motivMsg = getRandomMessage(MORNING_MESSAGES);

  // Net calorie status
  let netClass = 'green';
  let netLabel = `今日净热量：${totalKcal} kcal`;
  if (totalKcal > kcalTarget * 1.05) { netClass = 'red'; netLabel += ' ⚠️ 超标了'; }
  else if (totalKcal > kcalTarget) { netClass = 'orange'; netLabel += ' 接近上限'; }
  else if (totalKcal === 0) { netLabel = '今天还没有记录饮食'; }

  // XP progress
  const xpProgress = levelInfo.nextXP ? ((ach.totalXP - levelInfo.minXP) / (levelInfo.nextXP - levelInfo.minXP) * 100).toFixed(1) : 100;
  const xpToNext   = levelInfo.nextXP ? (levelInfo.nextXP - (ach.totalXP || 0)) : 0;

  _el.innerHTML = `
    <div class="dashboard-wrap">
      <!-- 顶部：日期与问候 -->
      <div class="page-header">
        <div>
          <div class="text-xl font-bold">${greeting}</div>
          <div class="text-sm text-muted">第 ${dayNum} 天 · 第 ${week} 周 · ${phase ? phase.name.split('：')[0] : ''}</div>
        </div>
        <div class="text-right">
          ${streak > 0 ? `<div class="badge badge-green">🔥 连打 ${streak} 天</div>` : ''}
        </div>
      </div>

      <!-- 激励语 -->
      <div class="card" style="padding:12px 16px; background: var(--color-primary-light);">
        <div class="text-sm" style="color:var(--color-primary-dark);">${motivMsg}</div>
      </div>

      <!-- 热量卡片 -->
      <div class="card">
        <div class="card-title">今日热量</div>
        <div class="calorie-row">
          <div class="calorie-item">
            <div class="value" style="color:var(--color-primary)">${totalKcal}</div>
            <div class="label">已摄入 kcal</div>
          </div>
          <div class="calorie-item">
            <div class="value">${kcalTarget}</div>
            <div class="label">目标 kcal</div>
          </div>
          <div class="calorie-item">
            <div class="value" style="color:var(--color-info)">${totalProtein}g</div>
            <div class="label">蛋白质</div>
          </div>
          <div class="calorie-item">
            <div class="value" style="color:var(--color-text-muted)">${totalFat}g</div>
            <div class="label">脂肪</div>
          </div>
        </div>
        <div class="progress-wrap" style="margin-bottom:8px">
          <div class="progress-bar ${kcalProgressColor(totalKcal, kcalTarget)}"
               style="width:${Math.min(100, totalKcal / kcalTarget * 100).toFixed(1)}%"></div>
        </div>
        <div class="net-kcal-row ${netClass}">
          <span class="text-sm">${netLabel}</span>
          <span class="text-sm font-bold">${kcalTarget - totalKcal > 0 ? `剩余 ${kcalTarget - totalKcal}` : '达标 ✓'}</span>
        </div>
      </div>

      <!-- 蛋白质进度 -->
      <div class="card">
        <div class="card-header">
          <div class="card-title" style="margin:0">蛋白质</div>
          <span class="text-sm text-muted">${totalProtein}g / ${proteinTarget}g</span>
        </div>
        <div class="progress-wrap">
          <div class="progress-bar ${totalProtein >= proteinTarget ? 'progress-green' : 'progress-yellow'}"
               style="width:${Math.min(100, totalProtein / proteinTarget * 100).toFixed(1)}%"></div>
        </div>
      </div>

      <!-- 饮水 -->
      <div class="card">
        <div class="card-header">
          <div class="card-title" style="margin:0">💧 饮水</div>
          <span class="text-sm text-muted">${waterMl} / ${waterTarget} ml</span>
        </div>
        <div class="progress-wrap" style="margin-bottom:10px">
          <div class="progress-bar ${waterMl >= waterTarget ? 'progress-green' : 'progress-gray'}"
               style="width:${Math.min(100, waterMl / waterTarget * 100).toFixed(1)}%"></div>
        </div>
        <div class="water-btns">
          ${[200, 300, 500].map(ml => `
            <button class="btn btn-outline btn-sm" onclick="window._addWater(${ml})">+${ml}ml</button>
          `).join('')}
          <button class="btn btn-ghost btn-sm" onclick="window._setWater()">自定义</button>
        </div>
      </div>

      <!-- 训练状态 -->
      <div class="card">
        <div class="card-header">
          <div class="card-title" style="margin:0">🏋️ 今日训练</div>
          ${log.workout.completed
            ? '<span class="badge badge-green">已完成 ✓</span>'
            : '<span class="badge badge-gray">未完成</span>'}
        </div>
        ${getTodayWorkoutPreview(settings.startDate)}
        ${!log.workout.completed
          ? `<button class="btn btn-primary btn-full" style="margin-top:10px" onclick="window._quickWorkoutDone()">打卡完成训练 ✓</button>`
          : ''}
      </div>

      <!-- 睡眠记录 -->
      <div class="card">
        <div class="card-header">
          <div class="card-title" style="margin:0">😴 睡眠</div>
          ${log.sleepHours != null
            ? `<span class="text-sm ${log.sleepHours >= 7 ? 'text-success' : 'text-warning'}">${log.sleepHours} 小时</span>`
            : '<span class="text-muted text-sm">未记录</span>'}
        </div>
        <button class="btn btn-outline btn-sm btn-full" onclick="window._logSleep()">记录睡眠</button>
      </div>

      <!-- 体重 -->
      <div class="card">
        <div class="card-header">
          <div class="card-title" style="margin:0">⚖️ 体重</div>
          ${log.weightLbs != null
            ? `<span class="text-sm font-bold">${log.weightLbs} lbs</span>`
            : '<span class="text-muted text-sm">未记录</span>'}
        </div>
        <button class="btn btn-outline btn-sm btn-full" onclick="window._logWeight()">记录体重</button>
      </div>

      <!-- XP / Level -->
      <div class="card">
        <div class="card-header">
          <div class="card-title" style="margin:0">Lv.${levelInfo.level} ${levelInfo.name}</div>
          <span class="text-sm text-muted">${ach.totalXP || 0} XP</span>
        </div>
        <div class="xp-bar-wrap">
          <div class="xp-level">
            <span class="text-sm">Lv.${levelInfo.level}</span>
            ${levelInfo.nextXP ? `<span class="text-sm">还需 ${xpToNext} XP → Lv.${levelInfo.level + 1}</span>` : '<span class="text-sm">满级！</span>'}
          </div>
          <div class="progress-wrap">
            <div class="progress-bar progress-green" style="width:${xpProgress}%"></div>
          </div>
        </div>
      </div>

      <!-- 提醒/违规警告 -->
      ${reminders.length > 0 ? `
        <div class="card">
          <div class="card-title">⚠️ 温馨提醒</div>
          ${reminders.map(r => `<div class="prohibition-item"><span>⚠️</span><span>${r}</span></div>`).join('')}
        </div>
      ` : ''}
    </div>
  `;

  // Attach global handlers
  window._addWater = (ml) => {
    const log = getDailyLog(_date);
    log.waterMl = (log.waterMl || 0) + ml;
    saveDailyLog(_date, log);
    showToast(`已添加 ${ml}ml 饮水 💧`, 'info', 1500);
    triggerDayComplete();
    render();
  };

  window._setWater = () => {
    const html = `
      <div class="modal-title">自定义饮水量</div>
      <div class="form-group">
        <label>当天总饮水量 (ml)</label>
        <input type="number" id="water-input" value="${log.waterMl || 0}" min="0" max="10000" step="50">
      </div>
      <button class="btn btn-primary btn-full" onclick="window._saveWater()">保存</button>
    `;
    showModal(html);
  };

  window._saveWater = () => {
    const val = parseInt(document.getElementById('water-input')?.value) || 0;
    const log = getDailyLog(_date);
    log.waterMl = val;
    saveDailyLog(_date, log);
    hideModal();
    triggerDayComplete();
    render();
  };

  window._logSleep = () => {
    const currentLog = getDailyLog(_date);
    const html = `
      <div class="modal-title">记录睡眠</div>
      <div class="form-group">
        <label>睡眠时长 (小时)</label>
        <input type="number" id="sleep-hours" value="${currentLog.sleepHours || 7}" min="0" max="24" step="0.5">
      </div>
      <div class="form-group">
        <label>就寝时间</label>
        <input type="time" id="sleep-bed" value="${currentLog.bedTime || '22:30'}">
      </div>
      <div class="form-group">
        <label>起床时间</label>
        <input type="time" id="sleep-wake" value="${currentLog.wakeTime || '06:30'}">
      </div>
      <div class="form-group">
        <label>睡眠质量 (1–5 星)</label>
        <input type="number" id="sleep-quality" value="${currentLog.sleepQuality || 3}" min="1" max="5" step="1">
      </div>
      <button class="btn btn-primary btn-full" onclick="window._saveSleep()">保存</button>
    `;
    showModal(html);
  };

  window._saveSleep = () => {
    const log = getDailyLog(_date);
    log.sleepHours   = parseFloat(document.getElementById('sleep-hours')?.value) || null;
    log.bedTime      = document.getElementById('sleep-bed')?.value || null;
    log.wakeTime     = document.getElementById('sleep-wake')?.value || null;
    log.sleepQuality = parseInt(document.getElementById('sleep-quality')?.value) || null;
    saveDailyLog(_date, log);
    hideModal();
    triggerDayComplete();
    render();
    showToast('睡眠已记录 😴', 'success', 1500);
  };

  window._logWeight = () => {
    const currentLog = getDailyLog(_date);
    const html = `
      <div class="modal-title">记录体重</div>
      <div class="form-group">
        <label>今日体重 (磅)</label>
        <input type="number" id="weight-input" value="${currentLog.weightLbs || (getSettings().startWeightLbs || 195)}" min="80" max="500" step="0.1">
      </div>
      <button class="btn btn-primary btn-full" onclick="window._saveWeight()">保存</button>
    `;
    showModal(html);
  };

  window._saveWeight = () => {
    const val = parseFloat(document.getElementById('weight-input')?.value);
    if (!val || val < 80) { showToast('请输入有效体重', 'danger'); return; }
    const log = getDailyLog(_date);
    log.weightLbs = val;
    saveDailyLog(_date, log);
    hideModal();
    triggerDayComplete();
    render();
    showToast(`体重已记录: ${val} lbs ⚖️`, 'success', 1500);
  };

  window._quickWorkoutDone = () => {
    const log = getDailyLog(_date);
    log.workout.completed = true;
    log.workout.completedAt = new Date().toISOString();
    saveDailyLog(_date, log);
    triggerDayComplete();
    render();
    showToast('训练打卡！💪', 'success');
  };
}

function kcalProgressColor(current, target) {
  if (current >= target * 1.05) return 'progress-red';
  if (current >= target)        return 'progress-yellow';
  return 'progress-green';
}

function getTodayWorkoutPreview(startDate) {
  const dayOfWeek = new Date().getDay();
  const phaseId = getCurrentPhase(startDate);
  const phase = PLAN.phases.find(p => p.id === phaseId);
  if (!phase) return '<div class="text-muted text-sm">训练计划加载中…</div>';
  const plan = phase.weekSchedule[dayOfWeek];
  if (!plan) return '<div class="text-muted text-sm">今日无训练计划</div>';
  const typeEmoji = { strength: '🏋️', swim: '🏊', elliptical: '🚴', active_rest: '🚶', rest: '😴' };
  return `
    <div class="flex items-center gap-2 mt-2">
      <span style="font-size:20px">${typeEmoji[plan.type] || '🏃'}</span>
      <div>
        <div class="font-semibold text-sm">${plan.label}</div>
        ${plan.duration ? `<div class="text-muted text-sm">${plan.duration}</div>` : ''}
      </div>
    </div>
  `;
}

function triggerDayComplete() {
  const log = getDailyLog(_date);
  handleDayComplete(_date, log);
}
