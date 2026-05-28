// js/data/messages.js — 随机激励语

export const MORNING_MESSAGES = [
  '今天又是新的一天，打起精神！💪',
  '记得补充水分，从一杯水开始！💧',
  '每一顿健康的餐食都是对自己的投资。',
  '训练不在于时间长，在于质量高。',
  '今天的你，比昨天更强一点点。',
  '打卡是最好的仪式感，开始吧！',
  '减脂路漫漫，但每一步都算数。',
  '记录饮食是减脂成功的最关键习惯。',
  '坚持才是最好的天赋！',
];

export const WORKOUT_DONE_MESSAGES = [
  '完成训练！今天的你值得表扬。🏆',
  '汗水不会说谎，出色完成！',
  '又一次训练入账，积累就是力量！⚡',
  '肌肉记住了今天的努力。',
  '这就是冠军的作息。👑',
];

export const GOAL_REACHED_MESSAGES = [
  '今天各项目标全部达成，完美！🌟',
  '五项全满！你今天是传奇！',
  '这种状态持续下去，目标不是梦！',
];

export const STREAK_MESSAGES = {
  3:  '已连续打卡 3 天，势头很好！🔥',
  7:  '一周连续打卡！习惯正在形成。⚡',
  14: '双周无间断，你在蜕变！💪',
  21: '21 天坚持！大脑已经接受这个习惯了。🦁',
  30: '一个月！这已经是生活方式，不只是计划。🏆',
};

export const COMEBACK_MESSAGES = [
  '回来了！重要的是站起来，不是没跌倒。💪',
  '断链不可怕，今天重新开始！',
  '每次重启都是新的机会，加油！🔥',
];

export function getRandomMessage(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
