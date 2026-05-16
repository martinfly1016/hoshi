export function getShenSha(targetBranch, dayStem, yearBranch, dayBranch) {
  const result = [];
  
  // 天乙貴人 (Tian Yi Gui Ren)
  const tianYiMap = {
    '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
    '乙': ['子', '申'], '己': ['子', '申'],
    '丙': ['亥', '酉'], '丁': ['亥', '酉'],
    '壬': ['卯', '巳'], '癸': ['卯', '巳'],
    '辛': ['寅', '午']
  };
  if (tianYiMap[dayStem]?.includes(targetBranch)) result.push('天乙貴人');

  // 太極貴人 (Tai Ji Gui Ren)
  const taiJiMap = {
    '甲': ['子', '午'], '乙': ['子', '午'],
    '丙': ['卯', '酉'], '丁': ['卯', '酉'],
    '戊': ['辰', '戌', '丑', '未'], '己': ['辰', '戌', '丑', '未'],
    '庚': ['寅', '亥'], '辛': ['寅', '亥'],
    '壬': ['巳', '申'], '癸': ['巳', '申']
  };
  if (taiJiMap[dayStem]?.includes(targetBranch)) result.push('太極貴人');

  // 文昌貴人 (Wen Chang)
  const wenChangMap = {
    '甲': '巳', '乙': '午', '丙': '申', '戊': '申',
    '丁': '酉', '己': '酉', '庚': '亥', '辛': '子',
    '壬': '寅', '癸': '卯'
  };
  if (wenChangMap[dayStem] === targetBranch) result.push('文昌貴人');

  // 天厨貴人 (Tian Chu)
  const tianChuMap = {
    '甲': '巳', '乙': '午', '丙': '子', '丁': '巳',
    '戊': '午', '己': '申', '庚': '寅', '辛': '午',
    '壬': '酉', '癸': '亥'
  };
  if (tianChuMap[dayStem] === targetBranch) result.push('天厨貴人');

  // 羊刃 (Yang Ren)
  const yangRenMap = {
    '甲': '卯', '乙': '辰', '丙': '午', '丁': '未',
    '戊': '午', '己': '未', '庚': '酉', '辛': '戌',
    '壬': '子', '癸': '丑'
  };
  if (yangRenMap[dayStem] === targetBranch) result.push('羊刃');

  // 詞館 (Ci Guan)
  const ciGuanMap = {
    '甲': '寅', '乙': '卯', '丙': '巳', '戊': '巳',
    '丁': '午', '己': '午', '庚': '申', '辛': '酉',
    '壬': '亥', '癸': '子'
  };
  if (ciGuanMap[dayStem] === targetBranch) result.push('詞館');

  // Groups based on Year or Day Branch
  const zhiGroup = (branch) => {
    if (['申', '子', '辰'].includes(branch)) return 'shui';
    if (['亥', '卯', '未'].includes(branch)) return 'mu';
    if (['寅', '午', '戌'].includes(branch)) return 'huo';
    if (['巳', '酉', '丑'].includes(branch)) return 'jin';
    return null;
  };

  const checkSanzhi = (baseBranch) => {
    const group = zhiGroup(baseBranch);
    if (group === 'shui') {
      if (targetBranch === '寅') result.push('駅馬');
      if (targetBranch === '子') result.push('将星');
      if (targetBranch === '辰') result.push('華蓋');
      if (targetBranch === '酉') result.push('桃花 (咸池)');
      if (targetBranch === '午') result.push('災殺');
    }
    if (group === 'mu') {
      if (targetBranch === '巳') result.push('駅馬');
      if (targetBranch === '卯') result.push('将星');
      if (targetBranch === '未') result.push('華蓋');
      if (targetBranch === '子') result.push('桃花 (咸池)');
      if (targetBranch === '酉') result.push('災殺');
    }
    if (group === 'huo') {
      if (targetBranch === '申') result.push('駅馬');
      if (targetBranch === '午') result.push('将星');
      if (targetBranch === '戌') result.push('華蓋');
      if (targetBranch === '卯') result.push('桃花 (咸池)');
      if (targetBranch === '子') result.push('災殺');
    }
    if (group === 'jin') {
      if (targetBranch === '亥') result.push('駅馬');
      if (targetBranch === '酉') result.push('将星');
      if (targetBranch === '丑') result.push('華蓋');
      if (targetBranch === '午') result.push('桃花 (咸池)');
      if (targetBranch === '卯') result.push('災殺');
    }
  };

  checkSanzhi(yearBranch);
  checkSanzhi(dayBranch);

  return [...new Set(result)]; // Unique
}
