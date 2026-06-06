import assert from "node:assert/strict";
import { calculateShichusuimei } from "../../../site3/calculation-lab.js";
import { HeavenStem } from "../../../site3/vendor/tyme4ts/index.mjs";

const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const STEM_ELEMENT = {
  甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土",
  己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水",
};
const STEM_POLARITY = {
  甲: "yang", 乙: "yin", 丙: "yang", 丁: "yin", 戊: "yang",
  己: "yin", 庚: "yang", 辛: "yin", 壬: "yang", 癸: "yin",
};
const GENERATES = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
const CONTROLS = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };

function expectedTenGod(dayStem, targetStem) {
  const dayElement = STEM_ELEMENT[dayStem];
  const targetElement = STEM_ELEMENT[targetStem];
  const samePolarity = STEM_POLARITY[dayStem] === STEM_POLARITY[targetStem];

  if (dayElement === targetElement) return samePolarity ? "比肩" : "劫财";
  if (GENERATES[dayElement] === targetElement) return samePolarity ? "食神" : "伤官";
  if (CONTROLS[dayElement] === targetElement) return samePolarity ? "偏财" : "正财";
  if (CONTROLS[targetElement] === dayElement) return samePolarity ? "七杀" : "正官";
  if (GENERATES[targetElement] === dayElement) return samePolarity ? "偏印" : "正印";
  throw new Error(`No ten-god rule matched: ${dayStem}/${targetStem}`);
}

for (const dayStem of STEMS) {
  for (const targetStem of STEMS) {
    const actual = HeavenStem.fromName(dayStem).getTenStar(HeavenStem.fromName(targetStem)).toString();
    assert.equal(actual, expectedTenGod(dayStem, targetStem), `${dayStem}日主 vs ${targetStem}天干`);
  }
}

const screenshotCase = calculateShichusuimei({
  date: "1987-11-05",
  timeKnown: true,
  time: "09:45",
  gender: "female",
  locationId: "jp-131016",
  locationOverride: {
    id: "jp-131016",
    label: "東京都 千代田区",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 35.6812,
    longitude: 139.7671,
  },
  timeCalculationMode: "standard_time",
  lateZiHourMode: "same_day",
  fortuneYear: 2026,
});

assert.equal(screenshotCase.dayMaster, "戊", "QA case should use 戊 day master");

const jiaYinDecade = screenshotCase.luckCycles.decadeFortunes.items.find((item) => item.name === "甲寅");
assert.ok(jiaYinDecade, "QA case should include 甲寅 decade fortune");
assert.equal(jiaYinDecade.startYear, 2018);
assert.equal(jiaYinDecade.endYear, 2027);
assert.equal(jiaYinDecade.pillar.heavenlyTenGod, "七杀", "戊日主に対する甲天干は七杀");
assert.equal(jiaYinDecade.reading.label, "七殺", "Displayed luck guide label should be 七殺, not 偏官");

const yiMaoDecade = screenshotCase.luckCycles.decadeFortunes.items.find((item) => item.name === "乙卯");
assert.ok(yiMaoDecade, "QA case should include next 乙卯 decade fortune");
assert.equal(yiMaoDecade.pillar.heavenlyTenGod, "正官", "戊日主に対する乙天干は正官");

const readings = screenshotCase.luckCycles.decadeYearReadings;
assert.equal(readings.find((item) => item.year === 2027)?.title, "甲寅大運 × 丁未流年");
assert.equal(readings.find((item) => item.year === 2028)?.title, "乙卯大運 × 戊申流年");

console.log("Ten-god regression checks passed", {
  matrixCases: STEMS.length * STEMS.length,
  screenshotDayMaster: screenshotCase.dayMaster,
  jiaYinTenGod: jiaYinDecade.pillar.heavenlyTenGod,
});
