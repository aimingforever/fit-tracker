// js/data/plan.js — 13 周训练计划数据

export const PHASE_WEEKS = {
  phase1: [1, 2, 3, 4],
  phase2: [5, 6, 7, 8, 9],
  phase3: [10, 11, 12, 13],
};

// 根据 startDate 与今天计算当前周次 (1-indexed, max 13)
export function getCurrentWeek(startDate) {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const today = new Date();
  const diffMs  = today - start;
  const diffDays = Math.floor(diffMs / 86400000);
  return Math.min(Math.max(1, Math.floor(diffDays / 7) + 1), 13);
}

export function getCurrentPhase(startDate) {
  const week = getCurrentWeek(startDate);
  if (week <= 4)  return 'phase1';
  if (week <= 9)  return 'phase2';
  return 'phase3';
}

// ============================================================
// Phase 1 (Week 1-4)
// ============================================================
const PHASE1_SCHEDULE = {
  1: { // 周一
    type: 'strength',
    label: '力量：下肢与核心',
    duration: '45–60 分钟',
    note: '重点体会臀部和大腿后侧发力，膝盖绝对不要内扣。',
    exercises: [
      {
        id: 'romanian_deadlift',
        name: '罗马尼亚硬拉',
        sets: '3 组',
        reps: '每组 10 次',
        rest: '90 秒',
        kneeRisk: false,
        instruction: {
          prepare: '双脚与肩同宽站立，握住哑铃，背部挺直。',
          caution: '全程保持背部中立位，不要弓腰；膝盖微微弯曲即可。',
          execution: '1. 吸气；2. 臀部向后推，哑铃沿大腿前侧缓慢下滑至小腿中部；3. 感受大腿后侧拉伸感；4. 呼气，臀部发力向前推，回到直立位；5. 顶部夹紧臀部 1 秒。',
          variant: '进阶：单腿 RDL，对核心稳定要求更高。',
          alternative: '膝盖不适时：换俯卧臀桥，零膝盖压力。'
        }
      },
      {
        id: 'leg_press',
        name: '器械倒蹬',
        sets: '3 组',
        reps: '每组 12 次',
        rest: '90 秒',
        kneeRisk: true,
        instruction: {
          prepare: '坐上倒蹬机，脚掌与肩同宽踩在踏板上，不要太靠下。',
          caution: '膝盖疼痛时跳过此动作。下放时膝盖不要锁死，角度不超过 90°。',
          execution: '1. 吸气；2. 缓慢弯曲膝盖至 90°；3. 呼气，蹬腿回到起始位；4. 顶部不要完全锁定关节。',
          variant: '调整脚的位置：高位踩踏板侧重臀部，低位侧重股四头肌。',
          alternative: '膝盖不适时：换臀桥（Glute Bridge）。'
        }
      },
      {
        id: 'glute_bridge',
        name: '臀桥',
        sets: '3 组',
        reps: '每组 15 次',
        rest: '60 秒',
        kneeRisk: false,
        instruction: {
          prepare: '仰卧，双脚踩地，膝盖弯曲约 90°，双脚与肩同宽。',
          caution: '上升时避免腰部过度拱起，用臀部发力。',
          execution: '1. 吸气；2. 呼气，收紧臀部，将臀部推向天花板；3. 顶部夹紧 1-2 秒；4. 缓慢下降。',
          variant: '进阶：单腿臀桥（Single-leg Glute Bridge）。',
          alternative: '此动作本身即为膝盖友好型，无需替代。'
        }
      },
      {
        id: 'dead_bug',
        name: '死虫式（核心）',
        sets: '3 组',
        reps: '每侧 8 次',
        rest: '60 秒',
        kneeRisk: false,
        instruction: {
          prepare: '仰卧，双臂垂直举起，双腿膝盖弯曲 90° 悬空。',
          caution: '全程腰背贴地，不要拱起。核心收紧。',
          execution: '1. 吸气；2. 右臂向后伸展，同时左腿伸直向前下方；3. 接近地面但不触地；4. 呼气，回到起始位；5. 换边。',
          variant: '进阶：同时伸展时在腰部下方放一张纸，保持纸不被压到。',
          alternative: '如感觉太难：只动手臂，腿保持弯曲。'
        }
      }
    ]
  },
  2: { // 周二
    type: 'swim',
    label: '有氧：游泳',
    duration: '30–40 分钟',
    note: '维持轻松~适中强度，可蛙泳或自由泳交替。',
    exercises: []
  },
  3: { // 周三
    type: 'strength',
    label: '力量：上肢推拉',
    duration: '45–60 分钟',
    note: '上肢日，专注感受目标肌肉收缩。',
    exercises: [
      {
        id: 'dumbbell_bench',
        name: '哑铃卧推',
        sets: '3 组',
        reps: '每组 10 次',
        rest: '90 秒',
        kneeRisk: false,
        instruction: {
          prepare: '躺在健身凳上，哑铃举过胸部，肘部约 45° 角外展。',
          caution: '腰部保持轻微自然弓度，不要过度拱起，肩胛骨夹紧。',
          execution: '1. 吸气；2. 缓慢将哑铃下放至胸部两侧；3. 肘部弯曲约 90°；4. 呼气，推起哑铃至顶部；5. 顶部保持 1 秒。',
          variant: '进阶：上斜哑铃卧推（30° 坡度）。',
          alternative: '没有器材：宽距俯卧撑。'
        }
      },
      {
        id: 'lat_pulldown',
        name: '高位下拉',
        sets: '3 组',
        reps: '每组 10 次',
        rest: '90 秒',
        kneeRisk: false,
        instruction: {
          prepare: '坐在下拉机，双手宽握把手，胸部微微抬起。',
          caution: '避免用身体后倾借力，控制整个动作范围。',
          execution: '1. 吸气；2. 将把手下拉至上胸部；3. 呼气，感受背阔肌收缩；4. 缓慢回到起始位。',
          variant: '进阶：反握下拉（更强调肱二头肌参与）。',
          alternative: '无器材：弹力带辅助引体向上。'
        }
      },
      {
        id: 'cable_row',
        name: '坐姿绳索划船',
        sets: '3 组',
        reps: '每组 10 次',
        rest: '90 秒',
        kneeRisk: false,
        instruction: {
          prepare: '坐在绳索机前，双脚踩踏板，上身保持直立略微前倾。',
          caution: '不要用腰部后仰借力，保持上身稳定。',
          execution: '1. 吸气；2. 双手握把向腹部拉近；3. 肩胛骨夹紧，感受中背部收缩；4. 呼气，缓慢放回。',
          variant: '换为弹力带划船。',
          alternative: '哑铃单臂划船（One-arm DB Row）。'
        }
      },
      {
        id: 'lateral_raise',
        name: '哑铃侧平举',
        sets: '3 组',
        reps: '每组 12 次',
        rest: '60 秒',
        kneeRisk: false,
        instruction: {
          prepare: '站立，双手各持轻哑铃，手臂微微弯曲。',
          caution: '避免耸肩，上举时不要超过肩部高度太多。',
          execution: '1. 吸气；2. 双臂慢慢向两侧抬起至肩高；3. 停顿 1 秒；4. 呼气，缓慢放下。',
          variant: '单臂侧平举，可借助支撑。',
          alternative: '弹力带侧平举。'
        }
      }
    ]
  },
  4: { // 周四
    type: 'active_rest',
    label: '动态休息',
    duration: '20–30 分钟',
    note: '散步、伸展或轻度瑜伽，促进恢复。',
    exercises: []
  },
  5: { // 周五
    type: 'strength',
    label: '力量：全身循环',
    duration: '45 分钟',
    note: '全身训练，注重动作质量而非重量。',
    exercises: [
      {
        id: 'kettlebell_swing',
        name: '壶铃摆动',
        sets: '3 组',
        reps: '每组 15 次',
        rest: '60 秒',
        kneeRisk: false,
        instruction: {
          prepare: '双脚略宽于肩，壶铃置于双脚前方。',
          caution: '用臀部发力而非手臂，保持背部中立，膝盖不要内扣。',
          execution: '1. 铰链弯腰，双手握壶铃；2. 向后摆动至两腿间；3. 猛然夹臀，将壶铃摆至肩高；4. 控制下落，循环。',
          variant: '进阶：单手壶铃摆动。',
          alternative: '哑铃硬拉+向上推肩的组合动作。'
        }
      },
      {
        id: 'dumbbell_lunge',
        name: '哑铃弓步蹲',
        sets: '3 组',
        reps: '每侧 10 次',
        rest: '75 秒',
        kneeRisk: true,
        instruction: {
          prepare: '站立，双手各持哑铃置于两侧。',
          caution: '膝盖疼痛时跳过，换臀桥或侧步蹲。前腿膝盖不要超过脚尖太多。',
          execution: '1. 迈出一大步；2. 后膝缓慢下降至离地约 2 寸；3. 前腿蹬地回来；4. 换腿。',
          variant: '原地弓步或向后弓步（膝盖压力更小）。',
          alternative: '膝盖不适：换侧弓步（侧步蹲）或臀桥。'
        }
      },
      {
        id: 'plank',
        name: '平板支撑',
        sets: '3 组',
        reps: '每组 30–45 秒',
        rest: '60 秒',
        kneeRisk: false,
        instruction: {
          prepare: '俯卧，前臂撑地，肘部在肩部正下方。',
          caution: '避免臀部过高或塌腰，保持全身一条直线。',
          execution: '1. 前臂和脚尖支撑身体；2. 核心收紧，保持姿势；3. 均匀呼吸；4. 时间到后缓慢放下。',
          variant: '进阶：侧平板支撑、平板抬腿。',
          alternative: '站姿核心抗旋转（用弹力带）。'
        }
      }
    ]
  },
  6: { // 周六
    type: 'swim',
    label: '有氧：游泳/椭圆机',
    duration: '45 分钟',
    note: '可选游泳或椭圆机，保持有氧心率区间。',
    exercises: []
  },
  0: { // 周日
    type: 'rest',
    label: '休息 + 备餐',
    duration: '',
    note: '充分休息，为下周备好健康食材。',
    exercises: []
  }
};

// ============================================================
// Phase 2 (Week 5-9) — 强度上升
// ============================================================
const PHASE2_SCHEDULE = {
  1: {
    type: 'strength',
    label: '力量：下肢与核心（进阶）',
    duration: '50–65 分钟',
    note: '加入深蹲，注意膝盖疼痛时跳过。',
    exercises: [
      {
        id: 'squat_p2',
        name: '深蹲（杠铃/哑铃）',
        sets: '4 组',
        reps: '每组 8 次',
        rest: '120 秒',
        kneeRisk: true,
        instruction: {
          prepare: '站立，双脚与肩同宽略宽，脚尖略外展。',
          caution: '膝盖疼痛时跳过，换倒蹬机。膝盖跟随脚尖方向，不要内扣。',
          execution: '1. 吸气；2. 臀部向后坐，同时膝盖弯曲；3. 下到大腿平行地面或略深；4. 呼气，蹬地起身；5. 顶部夹紧。',
          variant: '高脚杯深蹲（Goblet Squat）对于新手更友好。',
          alternative: '膝盖不适：倒蹬机 4×10 代替。'
        }
      },
      {
        id: 'romanian_deadlift_p2',
        name: '罗马尼亚硬拉（加重）',
        sets: '4 组',
        reps: '每组 8 次',
        rest: '90 秒',
        kneeRisk: false,
        instruction: {
          prepare: '参考 Phase 1 RDL，增加负重。',
          caution: '加重后更需保持背部中立。',
          execution: '同 Phase 1 RDL 执行要点。',
          variant: '单腿 RDL。',
          alternative: '俯卧臀桥。'
        }
      },
      {
        id: 'bulgarian_split_squat',
        name: '保加利亚分腿蹲',
        sets: '3 组',
        reps: '每侧 10 次',
        rest: '90 秒',
        kneeRisk: true,
        instruction: {
          prepare: '站在凳子前约 2 步，后脚脚背搭在凳子上。',
          caution: '膝盖疼痛时跳过。前腿膝盖不要超过脚尖太多。',
          execution: '1. 吸气；2. 后膝缓慢下降；3. 前腿大腿接近水平；4. 呼气，前腿发力起身。',
          variant: '持哑铃增加负重。',
          alternative: '后腿搭凳弓步蹲。'
        }
      },
      {
        id: 'dead_bug_p2',
        name: '死虫式（进阶）',
        sets: '3 组',
        reps: '每侧 10 次',
        rest: '60 秒',
        kneeRisk: false,
        instruction: {
          prepare: '同 Phase 1，但动作更慢、控制更强。',
          caution: '腰背全程贴地。',
          execution: '同 Phase 1 死虫式，更强调缓慢控制（3秒伸展）。',
          variant: '加弹力带阻力。',
          alternative: '普通死虫式。'
        }
      }
    ]
  },
  2: {
    type: 'swim',
    label: '有氧：游泳',
    duration: '45–50 分钟',
    note: '增加游泳时长，适度提高强度。',
    exercises: []
  },
  3: {
    type: 'strength',
    label: '力量：上肢推拉（进阶）',
    duration: '50–60 分钟',
    note: '增加组数，感受肌肉充血感。',
    exercises: [
      {
        id: 'dumbbell_bench_p2',
        name: '哑铃卧推（加重）',
        sets: '4 组',
        reps: '每组 8 次',
        rest: '90 秒',
        kneeRisk: false,
        instruction: {
          prepare: '同 Phase 1 哑铃卧推，增加哑铃重量。',
          caution: '加重后动作可能略有变形，优先保证姿势正确。',
          execution: '同 Phase 1 哑铃卧推。',
          variant: '上斜哑铃卧推。',
          alternative: '窄距俯卧撑。'
        }
      },
      {
        id: 'lat_pulldown_p2',
        name: '高位下拉（加重）',
        sets: '4 组',
        reps: '每组 8 次',
        rest: '90 秒',
        kneeRisk: false,
        instruction: {
          prepare: '同 Phase 1，增加重量。',
          caution: '不要用身体后倾借力。',
          execution: '同 Phase 1 高位下拉。',
          variant: '反握下拉。',
          alternative: '弹力带下拉。'
        }
      },
      {
        id: 'cable_row_p2',
        name: '绳索划船（加重）',
        sets: '4 组',
        reps: '每组 8 次',
        rest: '90 秒',
        kneeRisk: false,
        instruction: {
          prepare: '同 Phase 1。',
          caution: '保持上身稳定。',
          execution: '同 Phase 1 绳索划船。',
          variant: '单臂绳索划船。',
          alternative: '哑铃单臂划船。'
        }
      },
      {
        id: 'lateral_raise_p2',
        name: '哑铃侧平举（加重）',
        sets: '4 组',
        reps: '每组 12 次',
        rest: '60 秒',
        kneeRisk: false,
        instruction: {
          prepare: '同 Phase 1。',
          caution: '控制动作，不借力甩起。',
          execution: '同 Phase 1 侧平举。',
          variant: '弹力带侧平举。',
          alternative: '保持轻重量，增加次数。'
        }
      }
    ]
  },
  4: {
    type: 'active_rest',
    label: '动态休息',
    duration: '20–30 分钟',
    note: '伸展、泡沫轴放松或轻度步行。',
    exercises: []
  },
  5: {
    type: 'strength',
    label: '力量：全身循环（进阶）',
    duration: '50 分钟',
    note: '增加单腿 RDL 和弹力球动作。',
    exercises: [
      {
        id: 'single_leg_rdl',
        name: '单腿罗马尼亚硬拉',
        sets: '3 组',
        reps: '每侧 8 次',
        rest: '90 秒',
        kneeRisk: false,
        instruction: {
          prepare: '单脚站立，持轻哑铃。',
          caution: '用支撑脚的臀部发力，保持背部中立。',
          execution: '1. 吸气；2. 向前俯身同时抬起后腿；3. 身体和后腿形成一条直线；4. 呼气，回到起始位。',
          variant: '增加哑铃重量。',
          alternative: '双腿 RDL。'
        }
      },
      {
        id: 'med_ball_slam',
        name: '药球砸地（或哑铃过头压）',
        sets: '3 组',
        reps: '每组 12 次',
        rest: '60 秒',
        kneeRisk: false,
        instruction: {
          prepare: '双脚与肩同宽站立，双手持药球（或轻哑铃）。',
          caution: '拾起时弯腰，不要直腿。',
          execution: '1. 将球过头举起；2. 核心收紧；3. 用力将球砸向地面；4. 弯腰拾起，循环。',
          variant: '哑铃过头压（不砸地）。',
          alternative: '波比跳去掉俯卧撑部分。'
        }
      },
      {
        id: 'plank_p2',
        name: '平板支撑（进阶）',
        sets: '3 组',
        reps: '每组 45–60 秒',
        rest: '60 秒',
        kneeRisk: false,
        instruction: {
          prepare: '同 Phase 1 平板支撑。',
          caution: '保持全身一条直线。',
          execution: '同 Phase 1，增加时长。可加抬腿变体。',
          variant: '侧平板或平板抬腿。',
          alternative: '膝盖着地平板。'
        }
      }
    ]
  },
  6: {
    type: 'swim',
    label: '有氧：游泳/椭圆机',
    duration: '45–50 分钟',
    note: '保持有氧训练，可适度提高强度。',
    exercises: []
  },
  0: {
    type: 'rest',
    label: '休息 + 备餐',
    duration: '',
    note: '充分休息，准备下周训练食材。',
    exercises: []
  }
};

// ============================================================
// Phase 3 (Week 10-13) — 冲刺巩固
// ============================================================
const PHASE3_SCHEDULE = {
  1: {
    type: 'strength',
    label: '力量：下肢冲刺',
    duration: '60–70 分钟',
    note: '最后阶段，全力以赴！',
    exercises: [
      {
        id: 'squat_p3',
        name: '深蹲（终极重量）',
        sets: '4 组',
        reps: '每组 8 次',
        rest: '120 秒',
        kneeRisk: true,
        instruction: {
          prepare: '同 Phase 2 深蹲，最大安全负重。',
          caution: '膝盖疼痛时仍跳过，安全第一。',
          execution: '同 Phase 2 深蹲，专注形式完美。',
          variant: '前蹲。',
          alternative: '倒蹬机 4×10。'
        }
      },
      {
        id: 'rdl_p3',
        name: '罗马尼亚硬拉（顶峰重量）',
        sets: '4 组',
        reps: '每组 8 次',
        rest: '90 秒',
        kneeRisk: false,
        instruction: {
          prepare: '同 Phase 2 RDL，再次增加重量。',
          caution: '大重量下更需保持背部中立。',
          execution: '同 RDL 标准动作。',
          variant: '加颈后杠铃（进一步增重）。',
          alternative: '保持 Phase 2 重量，增加组数。'
        }
      },
      {
        id: 'leg_press_p3',
        name: '倒蹬机（高重量）',
        sets: '4 组',
        reps: '每组 10 次',
        rest: '90 秒',
        kneeRisk: true,
        instruction: {
          prepare: '同 Phase 1 倒蹬，大幅增加重量。',
          caution: '膝盖疼痛立刻停止。',
          execution: '同倒蹬标准动作，控制离心阶段。',
          variant: '单腿倒蹬。',
          alternative: '壶铃摆动。'
        }
      },
      {
        id: 'single_leg_glute_bridge',
        name: '单腿臀桥',
        sets: '3 组',
        reps: '每侧 12 次',
        rest: '60 秒',
        kneeRisk: false,
        instruction: {
          prepare: '仰卧，单脚踩地，另一腿伸直或弯曲抬起。',
          caution: '保持骨盆水平，不要歪斜。',
          execution: '1. 呼气，支撑腿臀部发力将臀部推起；2. 顶部夹紧 2 秒；3. 缓慢下降。',
          variant: '脚踩在凳子上的单腿臀桥（更大范围）。',
          alternative: '双腿臀桥增加次数。'
        }
      }
    ]
  },
  2: {
    type: 'swim',
    label: '有氧：游泳（冲刺）',
    duration: '50–60 分钟',
    note: '最后几周，增大游泳强度或时长。',
    exercises: []
  },
  3: {
    type: 'strength',
    label: '力量：上肢冲刺',
    duration: '60 分钟',
    note: '上肢各动作达到个人最大安全负重。',
    exercises: [
      {
        id: 'incline_bench',
        name: '上斜哑铃卧推',
        sets: '4 组',
        reps: '每组 8 次',
        rest: '90 秒',
        kneeRisk: false,
        instruction: {
          prepare: '调整凳子至 30° 坡度，哑铃举过胸部。',
          caution: '上斜角度强调上胸肌，保持肩胛骨夹紧。',
          execution: '同平卧哑铃卧推动作，角度不同。',
          variant: '加大坡度至 45°。',
          alternative: '平地哑铃卧推。'
        }
      },
      {
        id: 'pullup',
        name: '引体向上（或辅助）',
        sets: '4 组',
        reps: '每组最大次数',
        rest: '120 秒',
        kneeRisk: false,
        instruction: {
          prepare: '握住单杠，掌心朝外，略宽于肩。',
          caution: '不要晃动借力，控制整个动作。',
          execution: '1. 悬挂；2. 呼气，拉起至下巴超过单杠；3. 顶部停顿；4. 缓慢下降。',
          variant: '反握引体（肱二头肌更多参与）。',
          alternative: '弹力带辅助引体，或高位下拉。'
        }
      },
      {
        id: 't_bar_row',
        name: 'T 杠划船（或哑铃）',
        sets: '4 组',
        reps: '每组 10 次',
        rest: '90 秒',
        kneeRisk: false,
        instruction: {
          prepare: '俯身，背部中立，双手握把。',
          caution: '保持上身稳定，不要甩起身体。',
          execution: '1. 将重量向腹部拉近；2. 感受中背部收缩；3. 缓慢放回。',
          variant: '哑铃单臂划船。',
          alternative: '绳索坐姿划船。'
        }
      },
      {
        id: 'shoulder_press',
        name: '哑铃肩上推举',
        sets: '4 组',
        reps: '每组 10 次',
        rest: '75 秒',
        kneeRisk: false,
        instruction: {
          prepare: '坐在凳子上背靠垂直，哑铃举至肩高，肘部 90°。',
          caution: '避免腰部过度后仰，核心收紧。',
          execution: '1. 呼气，将哑铃推向头顶；2. 两哑铃在顶部靠近但不相碰；3. 吸气，缓慢下降。',
          variant: '站姿哑铃肩推（增加核心参与）。',
          alternative: '绳索肩推。'
        }
      }
    ]
  },
  4: {
    type: 'active_rest',
    label: '动态休息',
    duration: '20–30 分钟',
    note: '泡沫轴放松，充分拉伸。',
    exercises: []
  },
  5: {
    type: 'strength',
    label: '力量：全身冲刺',
    duration: '55 分钟',
    note: '最后几周的精华训练。',
    exercises: [
      {
        id: 'kettlebell_complex',
        name: '壶铃组合（摆动+抓举）',
        sets: '4 组',
        reps: '每侧 8 次',
        rest: '90 秒',
        kneeRisk: false,
        instruction: {
          prepare: '准备一个适当重量的壶铃。',
          caution: '掌握好壶铃运动轨迹，避免手腕扭伤。',
          execution: '1. 完成 8 次单手壶铃摆动；2. 不停顿，直接转为 8 次壶铃抓举；3. 换手重复。',
          variant: '仅摆动，增加次数。',
          alternative: '哑铃摆动+过头推。'
        }
      },
      {
        id: 'box_jump',
        name: '箱跳（或台阶跳）',
        sets: '3 组',
        reps: '每组 8 次',
        rest: '90 秒',
        kneeRisk: true,
        instruction: {
          prepare: '站在稳定的箱子或台阶前，双脚与肩同宽。',
          caution: '膝盖疼痛时跳过，换壶铃摆动。落地缓冲，膝盖微弯。',
          execution: '1. 微蹲预备；2. 用力跳上箱子；3. 轻柔落地，膝盖缓冲；4. 走下箱子（不跳下）。',
          variant: '步台跳（踏步上台阶代替箱跳）。',
          alternative: '壶铃摆动 15 次代替。'
        }
      },
      {
        id: 'core_circuit',
        name: '核心循环（平板+侧平板+死虫）',
        sets: '3 组',
        reps: '各 30 秒',
        rest: '60 秒',
        kneeRisk: false,
        instruction: {
          prepare: '准备垫子。',
          caution: '全程保持核心收紧。',
          execution: '1. 平板支撑 30s；2. 右侧平板 30s；3. 左侧平板 30s；4. 死虫式 30s（各 8 次）。循环 3 轮。',
          variant: '增加时长至 45s。',
          alternative: '只做平板支撑，增加时长。'
        }
      }
    ]
  },
  6: {
    type: 'swim',
    label: '有氧：游泳/椭圆机（冲刺）',
    duration: '50–60 分钟',
    note: '最后阶段有氧，可以尝试间歇式游泳。',
    exercises: []
  },
  0: {
    type: 'rest',
    label: '休息 + 备餐',
    duration: '',
    note: '最后几周的休息同样重要，不可忽视。',
    exercises: []
  }
};

export const PLAN = {
  phases: [
    {
      id: 'phase1',
      name: '第一阶段：启动与适应',
      weeks: [1, 2, 3, 4],
      goal: '排出水分，适应热量缺口，唤醒沉睡肌肉',
      expectedLoss: '8–10 磅（含糖原消耗带走的水分）',
      weekSchedule: PHASE1_SCHEDULE
    },
    {
      id: 'phase2',
      name: '第二阶段：力量建立',
      weeks: [5, 6, 7, 8, 9],
      goal: '增加训练强度，持续消耗脂肪，建立肌肉基础',
      expectedLoss: '7–10 磅（纯脂肪为主）',
      weekSchedule: PHASE2_SCHEDULE
    },
    {
      id: 'phase3',
      name: '第三阶段：冲刺巩固',
      weeks: [10, 11, 12, 13],
      goal: '维持肌肉，冲刺减脂，巩固成果',
      expectedLoss: '5–8 磅',
      weekSchedule: PHASE3_SCHEDULE
    }
  ]
};

// 根据日期获取当天的训练计划
export function getDayPlan(startDate, date) {
  const currentPhaseId = getCurrentPhase(startDate);
  const phase = PLAN.phases.find(p => p.id === currentPhaseId);
  if (!phase) return null;
  const dayOfWeek = new Date(date + 'T12:00:00').getDay(); // 0=Sunday
  return phase.weekSchedule[dayOfWeek] || null;
}
