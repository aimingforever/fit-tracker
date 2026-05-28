// js/modules/exercise.js — 训练打卡模块

import { getDailyLog, saveDailyLog, getSettings, getTodayDate } from '../storage.js';
import { getCurrentPhase, getDayPlan, PLAN } from '../data/plan.js';
import { handleDayComplete } from '../engines/gamification.js';
import { showModal, hideModal, showToast, on } from '../app.js';

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
  const settings  = getSettings();
  const log       = getDailyLog(_date);
  const startDate = settings.startDate;

  const dayPlan   = getDayPlan(startDate, _date);
  const phaseId   = getCurrentPhase(startDate);
  const phase     = PLAN.phases.find(p => p.id === phaseId);

  // Knee status
  const kneeStatus = log.workout?.kneeStatus || 'ok';

  if (!dayPlan) {
    _el.innerHTML = `<div class="empty-state"><div class="icon">🏋️</div><div class="msg">今日无训练计划</div></div>`;
    return;
  }

  const isRest = dayPlan.type === 'rest';
  const isSwim = dayPlan.type === 'swim' || dayPlan.type === 'elliptical';
  const isActive = dayPlan.type === 'active_rest';
  const isStrength = dayPlan.type === 'strength';

  const checked = log.workout?.exerciseChecked || [];
  const completed = log.workout?.completed || false;

  // Filter exercises based on knee status
  const filteredExercises = (dayPlan.exercises || []).map(ex => ({
    ...ex,
    skipped: (kneeStatus === 'pain' && ex.kneeRisk)
  }));

  const totalExercises = filteredExercises.filter(e => !e.skipped).length;
  const checkedCount   = filteredExercises.filter(e => !e.skipped && checked.includes(e.id)).length;

  _el.innerHTML = `
    <div class="section-title">🏋️ 今日训练</div>

    <!-- 阶段信息 -->
    <div class="card" style="display:flex;align-items:center;gap:10px">
      <span class="phase-badge">${phase ? phase.name : ''}</span>
      <span class="text-sm text-muted">${dayPlan.label}</span>
      ${dayPlan.duration ? `<span class="text-sm text-muted">· ${dayPlan.duration}</span>` : ''}
    </div>

    <!-- 完成状态 -->
    ${completed
      ? `<div class="card" style="background:var(--color-primary-light);border:1.5px solid var(--color-primary)">
           <div class="flex items-center gap-2">
             <span style="font-size:24px">✅</span>
             <div>
               <div class="font-bold" style="color:var(--color-primary-dark)">今日训练已完成！</div>
               <div class="text-sm text-muted">${log.workout.completedAt ? new Date(log.workout.completedAt).toLocaleTimeString('zh', {hour:'2-digit',minute:'2-digit'}) : ''} 打卡</div>
             </div>
           </div>
         </div>`
      : ''
    }

    ${isRest ? renderRestDay(dayPlan) : ''}
    ${isActive ? renderActiveRest(dayPlan) : ''}
    ${isSwim ? renderSwimDay(dayPlan, log, completed) : ''}
    ${isStrength ? renderStrengthDay(dayPlan, filteredExercises, checked, completed, kneeStatus, totalExercises, checkedCount) : ''}

    <!-- 备注 -->
    ${dayPlan.note ? `
      <div class="card" style="background:#fffbeb">
        <div class="text-sm" style="color:#92400e">💡 ${dayPlan.note}</div>
      </div>
    ` : ''}
  `;

  // Handlers
  window._toggleExercise = (exerciseId) => {
    const log = getDailyLog(_date);
    if (!log.workout) log.workout = {};
    if (!log.workout.exerciseChecked) log.workout.exerciseChecked = [];
    const idx = log.workout.exerciseChecked.indexOf(exerciseId);
    if (idx >= 0) {
      log.workout.exerciseChecked.splice(idx, 1);
    } else {
      log.workout.exerciseChecked.push(exerciseId);
    }
    saveDailyLog(_date, log);
    render();
  };

  window._setKneeStatus = (status) => {
    const log = getDailyLog(_date);
    if (!log.workout) log.workout = {};
    log.workout.kneeStatus = status;
    saveDailyLog(_date, log);
    render();
  };

  window._finishWorkout = () => {
    const log = getDailyLog(_date);
    if (!log.workout) log.workout = {};
    log.workout.completed = true;
    log.workout.completedAt = new Date().toISOString();
    log.workout.workoutType = dayPlan.type;
    saveDailyLog(_date, log);
    triggerDayComplete();
    render();
    showToast('训练打卡！💪 太棒了！', 'success');
  };

  window._showInstruction = (exId) => {
    const ex = dayPlan.exercises.find(e => e.id === exId);
    if (!ex) return;
    const html = `
      <div class="modal-title">${ex.name}</div>
      <div class="flex gap-2 mb-2 text-sm">
        <span class="badge badge-green">${ex.sets}</span>
        <span class="badge badge-green">${ex.reps}</span>
        <span class="badge badge-gray">休息 ${ex.rest}</span>
        ${ex.kneeRisk ? '<span class="badge badge-yellow">⚠️ 膝盖敏感</span>' : ''}
      </div>
      ${ex.instruction ? `
        <div class="form-group">
          <label>准备</label>
          <div class="text-sm">${ex.instruction.prepare}</div>
        </div>
        <div class="form-group">
          <label>注意事项</label>
          <div class="text-sm">${ex.instruction.caution}</div>
        </div>
        <div class="form-group">
          <label>执行步骤</label>
          <div class="text-sm">${ex.instruction.execution}</div>
        </div>
        <div class="form-group">
          <label>进阶变体</label>
          <div class="text-sm">${ex.instruction.variant}</div>
        </div>
        <div class="form-group">
          <label>替代动作</label>
          <div class="text-sm">${ex.instruction.alternative}</div>
        </div>
      ` : ''}
      <button class="btn btn-primary btn-full" onclick="window.closeModal()">明白了</button>
    `;
    showModal(html);
    window.closeModal = hideModal;
  };
}

function renderRestDay(plan) {
  return `
    <div class="card text-center">
      <div style="font-size:48px">😴</div>
      <div class="text-lg font-bold mt-2">${plan.label}</div>
      <div class="text-muted text-sm mt-2">${plan.note}</div>
    </div>
  `;
}

function renderActiveRest(plan) {
  return `
    <div class="card">
      <div class="flex items-center gap-3">
        <span style="font-size:32px">🚶</span>
        <div>
          <div class="font-bold">${plan.label}</div>
          <div class="text-sm text-muted">${plan.duration}</div>
          <div class="text-sm text-muted mt-1">${plan.note}</div>
        </div>
      </div>
      <button class="btn btn-primary btn-full mt-2" onclick="window._finishWorkout()">✓ 完成今日动态休息</button>
    </div>
  `;
}

function renderSwimDay(plan, log, completed) {
  return `
    <div class="card">
      <div class="flex items-center gap-3">
        <span style="font-size:32px">🏊</span>
        <div>
          <div class="font-bold">${plan.label}</div>
          <div class="text-sm text-muted">目标时长：${plan.duration}</div>
          <div class="text-sm text-muted mt-1">${plan.note}</div>
        </div>
      </div>
      ${!completed
        ? `<button class="btn btn-primary btn-full mt-2" onclick="window._finishWorkout()">🏊 完成游泳打卡</button>`
        : ''
      }
    </div>
  `;
}

function renderStrengthDay(plan, exercises, checked, completed, kneeStatus, total, checkedCount) {
  return `
    <!-- 膝盖状态 -->
    <div class="card">
      <div class="card-title">今日膝盖状态</div>
      <div class="knee-btns">
        <button class="knee-btn ${kneeStatus === 'ok'    ? 'selected-ok'   : ''}" onclick="window._setKneeStatus('ok')">✅ 无不适</button>
        <button class="knee-btn ${kneeStatus === 'mild'  ? 'selected-mild' : ''}" onclick="window._setKneeStatus('mild')">⚠️ 轻度不适</button>
        <button class="knee-btn ${kneeStatus === 'pain'  ? 'selected-pain' : ''}" onclick="window._setKneeStatus('pain')">🚫 疼痛明显</button>
      </div>
      ${kneeStatus === 'pain' ? '<div class="text-sm text-danger mt-2">膝盖疼痛：所有膝盖敏感动作已自动跳过</div>' : ''}
    </div>

    <!-- 动作列表 -->
    <div class="card">
      <div class="card-header">
        <div class="card-title" style="margin:0">训练动作</div>
        <div class="text-sm text-muted">${checkedCount}/${total} 完成</div>
      </div>
      ${exercises.map(ex => `
        <div class="exercise-row ${ex.skipped ? 'skipped' : ''}">
          ${ex.skipped
            ? `<span style="font-size:18px">⏭️</span>`
            : `<input type="checkbox" class="exercise-checkbox"
                      ${checked.includes(ex.id) ? 'checked' : ''}
                      onchange="window._toggleExercise('${ex.id}')">`
          }
          <div class="exercise-info">
            <div class="exercise-name">
              ${ex.name}
              ${ex.kneeRisk ? '<span class="badge badge-yellow" style="margin-left:4px;font-size:10px">膝盖</span>' : ''}
            </div>
            <div class="exercise-meta">${ex.sets} · ${ex.reps} · 休息 ${ex.rest}</div>
            ${ex.skipped ? '<div class="text-sm text-danger">膝盖疼痛时跳过</div>' : ''}
          </div>
          <button class="btn btn-ghost btn-icon" onclick="window._showInstruction('${ex.id}')"
                  title="查看动作说明" style="font-size:16px">ℹ️</button>
        </div>
      `).join('')}
    </div>

    <!-- 完成按钮 -->
    ${!completed
      ? `<button class="btn btn-primary btn-full" onclick="window._finishWorkout()">
           ✓ 完成今日训练打卡
           ${checkedCount < total ? `<span style="opacity:0.7;font-size:12px;margin-left:4px">(${total - checkedCount}个动作未完成)</span>` : ''}
         </button>`
      : ''
    }
  `;
}

function triggerDayComplete() {
  const log = getDailyLog(_date);
  handleDayComplete(_date, log);
}
