// js/modules/settings.js — 设置页面

import { getSettings, saveSettings, getAchievements, exportJSON, importJSON, clearAll, getUsageBytes } from '../storage.js';
import { getLevelInfo, LEVELS } from '../engines/gamification.js';
import { getCurrentWeek, getCurrentPhase, PLAN } from '../data/plan.js';
import { showToast, showModal, hideModal } from '../app.js';

let _el = null;

export function init(el) {
  _el = el;
  render();
}

export function refresh() {
  render();
}

function render() {
  const settings = getSettings();
  const ach      = getAchievements();
  const levelInfo= getLevelInfo(ach.totalXP || 0);
  const week     = getCurrentWeek(settings.startDate);
  const phaseId  = getCurrentPhase(settings.startDate);
  const phase    = PLAN.phases.find(p => p.id === phaseId);
  const bytes    = getUsageBytes();
  const kbUsed   = (bytes / 1024).toFixed(1);

  _el.innerHTML = `
    <div class="section-title">⚙️ 设置</div>

    <!-- 个人信息 -->
    <div class="card">
      <div class="settings-section-title">个人信息</div>

      <div class="form-group">
        <label>姓名</label>
        <input type="text" id="set-name" value="${settings.userName || ''}" placeholder="你的名字" maxlength="20">
      </div>
      <div class="form-group">
        <label>计划开始日期</label>
        <input type="date" id="set-start" value="${settings.startDate || ''}">
      </div>
      <div class="form-group">
        <label>初始体重 (磅)</label>
        <input type="number" id="set-start-weight" value="${settings.startWeightLbs}" min="80" max="500" step="0.1">
      </div>
      <div class="form-group">
        <label>目标体重 (磅)</label>
        <input type="number" id="set-goal-weight" value="${settings.goalWeightLbs}" min="80" max="500" step="0.1">
      </div>
      <button class="btn btn-primary btn-full" onclick="window._savePersonal()">保存个人信息</button>
    </div>

    <!-- 目标设置 -->
    <div class="card">
      <div class="settings-section-title">目标设置</div>

      <div class="form-group">
        <label>每日热量目标 (kcal)</label>
        <input type="number" id="set-kcal" value="${settings.dailyKcalTarget}" min="1200" max="3000" step="50">
      </div>
      <div class="form-group">
        <label>每日蛋白质目标 (g)</label>
        <input type="number" id="set-protein" value="${settings.dailyProteinTarget}" min="50" max="300" step="5">
      </div>
      <div class="form-group">
        <label>每日饮水目标 (ml)</label>
        <input type="number" id="set-water" value="${settings.dailyWaterMl}" min="500" max="6000" step="100">
      </div>
      <button class="btn btn-primary btn-full" onclick="window._saveGoals()">保存目标</button>
    </div>

    <!-- 进度概览 -->
    <div class="card">
      <div class="settings-section-title">进度概览</div>
      <div class="setting-row">
        <span class="setting-label">当前进度</span>
        <span class="setting-value">第 ${week} 周 / 13 周</span>
      </div>
      <div class="setting-row">
        <span class="setting-label">当前阶段</span>
        <span class="setting-value">${phase ? phase.name : '未开始'}</span>
      </div>
      <div class="setting-row">
        <span class="setting-label">等级</span>
        <span class="setting-value">Lv.${levelInfo.level} ${levelInfo.name}</span>
      </div>
      <div class="setting-row">
        <span class="setting-label">总 XP</span>
        <span class="setting-value">${ach.totalXP || 0} XP</span>
      </div>
      <div class="setting-row">
        <span class="setting-label">连续打卡</span>
        <span class="setting-value">${ach.streak || 0} 天</span>
      </div>
      <div class="setting-row">
        <span class="setting-label">累计训练</span>
        <span class="setting-value">${ach.totalWorkoutDays || 0} 天</span>
      </div>
      <div class="setting-row">
        <span class="setting-label">解锁徽章</span>
        <span class="setting-value">${(ach.unlockedBadges || []).length} 枚</span>
      </div>
    </div>

    <!-- 数据管理 -->
    <div class="card">
      <div class="settings-section-title">数据管理</div>
      <div class="setting-row">
        <span class="setting-label">已用存储</span>
        <span class="setting-value">${kbUsed} KB</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">
        <button class="btn btn-outline btn-full" onclick="window._exportData()">📤 导出数据 (JSON)</button>
        <button class="btn btn-outline btn-full" onclick="window._importData()">📥 导入数据</button>
        <button class="btn btn-danger btn-full" onclick="window._confirmClear()">🗑️ 清除所有数据</button>
      </div>
    </div>

    <!-- 关于 -->
    <div class="card">
      <div class="settings-section-title">关于</div>
      <div class="setting-row">
        <span class="setting-label">版本</span>
        <span class="setting-value">v1.0.0</span>
      </div>
      <div class="setting-row">
        <span class="setting-label">数据存储</span>
        <span class="setting-value">本地 localStorage</span>
      </div>
      <div class="setting-row">
        <span class="setting-label">无服务器</span>
        <span class="setting-value">隐私保护 ✓</span>
      </div>
    </div>
  `;

  // Handlers
  window._savePersonal = () => {
    const settings = getSettings();
    const name = document.getElementById('set-name')?.value.trim();
    const start = document.getElementById('set-start')?.value;
    const startW = parseFloat(document.getElementById('set-start-weight')?.value);
    const goalW  = parseFloat(document.getElementById('set-goal-weight')?.value);

    if (!start) { showToast('请设置开始日期', 'danger'); return; }
    if (!startW || startW < 80) { showToast('请输入有效的初始体重', 'danger'); return; }
    if (!goalW || goalW < 80)   { showToast('请输入有效的目标体重', 'danger'); return; }

    settings.userName       = name || null;
    settings.startDate      = start;
    settings.startWeightLbs = startW;
    settings.goalWeightLbs  = goalW;
    saveSettings(settings);
    showToast('个人信息已保存 ✓', 'success');
    render();
  };

  window._saveGoals = () => {
    const settings = getSettings();
    const kcal    = parseInt(document.getElementById('set-kcal')?.value)    || 1800;
    const protein = parseInt(document.getElementById('set-protein')?.value) || 140;
    const water   = parseInt(document.getElementById('set-water')?.value)   || 2500;

    if (kcal < 1200 || kcal > 3000) { showToast('热量目标范围：1200–3000 kcal', 'danger'); return; }
    if (protein < 50 || protein > 300) { showToast('蛋白质目标范围：50–300 g', 'danger'); return; }
    if (water < 500 || water > 6000)   { showToast('饮水目标范围：500–6000 ml', 'danger'); return; }

    settings.dailyKcalTarget    = kcal;
    settings.dailyProteinTarget = protein;
    settings.dailyWaterMl       = water;
    saveSettings(settings);
    showToast('目标设置已保存 ✓', 'success');
    render();
  };

  window._exportData = () => {
    try {
      exportJSON();
      showToast('数据已导出到下载文件夹 📤', 'success');
    } catch {
      showToast('导出失败，请重试', 'danger');
    }
  };

  window._importData = () => {
    const html = `
      <div class="modal-title">📥 导入数据</div>
      <p class="text-muted text-sm" style="margin-bottom:12px">选择之前导出的 JSON 文件，已有数据将被合并（不覆盖）。</p>
      <input type="file" id="import-file" accept=".json" style="margin-bottom:12px;width:100%">
      <button class="btn btn-primary btn-full" onclick="window._doImport()">导入</button>
    `;
    showModal(html);

    window._doImport = () => {
      const fileInput = document.getElementById('import-file');
      if (!fileInput?.files?.length) { showToast('请先选择文件', 'danger'); return; }
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const ok = importJSON(e.target.result);
        if (ok) {
          hideModal();
          render();
          showToast('数据导入成功！', 'success');
        } else {
          showToast('导入失败：文件格式不正确', 'danger');
        }
      };
      reader.readAsText(file);
    };
  };

  window._confirmClear = () => {
    const html = `
      <div class="modal-title" style="color:var(--color-danger)">⚠️ 清除所有数据</div>
      <p style="margin-bottom:16px">此操作将删除所有记录（日志、设置、成就），且<strong>无法恢复</strong>。</p>
      <p class="text-muted text-sm" style="margin-bottom:16px">建议先导出数据备份后再清除。</p>
      <div class="flex gap-2">
        <button class="btn btn-ghost btn-full" onclick="window.closeModal()">取消</button>
        <button class="btn btn-danger btn-full" onclick="window._doClear()">确认清除</button>
      </div>
    `;
    showModal(html);
    window.closeModal = hideModal;
  };

  window._doClear = () => {
    clearAll();
    hideModal();
    showToast('所有数据已清除', 'info');
    setTimeout(() => location.reload(), 1500);
  };
}
