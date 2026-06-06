import assert from "node:assert/strict";
import { calculateShichusuimei } from "../../../site3/calculation-lab.js";

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

console.log("Ten-god regression checks passed");
