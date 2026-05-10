import { SolarTime } from "tyme4ts";
import { Solar as LunarJsSolar } from "lunar-javascript";
import { Solar as LunarTsSolar } from "lunar-typescript";

const samples = [
  {
    id: "F001",
    type: "普通日期",
    input: { year: 1990, month: 6, day: 15, hour: 10, minute: 30, second: 0 },
    goal: "基础四柱、藏干、十神。",
  },
  {
    id: "F002A",
    type: "立春前",
    input: { year: 2024, month: 2, day: 4, hour: 15, minute: 30, second: 0 },
    goal: "立春前后年柱、月柱切换。",
  },
  {
    id: "F002B",
    type: "立春后",
    input: { year: 2024, month: 2, day: 4, hour: 16, minute: 30, second: 0 },
    goal: "立春前后年柱、月柱切换。",
  },
  {
    id: "F003A",
    type: "子时前",
    input: { year: 1988, month: 2, day: 15, hour: 22, minute: 30, second: 0 },
    goal: "23:00 前后日柱归属。",
  },
  {
    id: "F003B",
    type: "子时后",
    input: { year: 1988, month: 2, day: 15, hour: 23, minute: 30, second: 0 },
    goal: "23:00 前后日柱归属。",
  },
  {
    id: "F004",
    type: "真太阳时",
    input: { year: 1990, month: 6, day: 15, hour: 10, minute: 30, second: 0, location: "待定" },
    goal: "出生地经度导致的时辰变化。当前脚本先跑标准时间，真太阳时待人工对照。",
  },
  {
    id: "F005",
    type: "时辰不详",
    input: { year: 1990, month: 6, day: 15, hour: null, minute: null, second: null },
    goal: "缺失时柱时的结构化输出。第三方库需要明确策略，不能伪造时柱。",
  },
];

function formatInput(input) {
  const date = `${input.year}-${pad(input.month)}-${pad(input.day)}`;
  if (input.hour === null) return `${date} 时辰不详`;
  return `${date} ${pad(input.hour)}:${pad(input.minute)}:${pad(input.second)}`;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function pillarObject(year, month, day, hour) {
  return { year, month, day, hour };
}

function samePillars(a, b) {
  if (!a || !b) return false;
  return a.year === b.year && a.month === b.month && a.day === b.day && a.hour === b.hour;
}

function tymeResult(input) {
  if (input.hour === null) {
    return {
      status: "skipped",
      reason: "tyme4ts 需要明确时分秒；时辰不详应由业务层显式处理。",
    };
  }

  const time = SolarTime.fromYmdHms(
    input.year,
    input.month,
    input.day,
    input.hour,
    input.minute,
    input.second,
  );
  const eightChar = time.getSixtyCycleHour().getEightChar();
  const pillars = [
    eightChar.getYear(),
    eightChar.getMonth(),
    eightChar.getDay(),
    eightChar.getHour(),
  ];
  const dayStem = eightChar.getDay().getHeavenStem();

  return {
    status: "ok",
    solar: time.toString(),
    pillars: pillarObject(...pillars.map((p) => p.toString())),
    hideStems: pillars.map((p) => p.getEarthBranch().getHideHeavenStems().map((h) => h.toString())),
    tenStars: pillars.map((p, index) => (index === 2 ? "日主" : dayStem.getTenStar(p.getHeavenStem()).toString())),
  };
}

function lunarResult(SolarClass, input) {
  if (input.hour === null) {
    return {
      status: "skipped",
      reason: "lunar 系列需要明确时分秒；时辰不详应由业务层显式处理。",
    };
  }

  const solar = SolarClass.fromYmdHms(
    input.year,
    input.month,
    input.day,
    input.hour,
    input.minute,
    input.second,
  );
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  return {
    status: "ok",
    solar: solar.toYmdHms(),
    lunar: lunar.toString(),
    pillars: pillarObject(
      eightChar.getYear(),
      eightChar.getMonth(),
      eightChar.getDay(),
      eightChar.getTime(),
    ),
    hideStems: [
      eightChar.getYearHideGan(),
      eightChar.getMonthHideGan(),
      eightChar.getDayHideGan(),
      eightChar.getTimeHideGan(),
    ],
    tenStars: [
      eightChar.getYearShiShenGan(),
      eightChar.getMonthShiShenGan(),
      eightChar.getDayShiShenGan(),
      eightChar.getTimeShiShenGan(),
    ],
  };
}

function compareOne(sample) {
  const tyme = tymeResult(sample.input);
  const lunarJs = lunarResult(LunarJsSolar, sample.input);
  const lunarTs = lunarResult(LunarTsSolar, sample.input);

  const agreement =
    tyme.status === "ok" &&
    lunarJs.status === "ok" &&
    lunarTs.status === "ok" &&
    samePillars(tyme.pillars, lunarJs.pillars) &&
    samePillars(lunarJs.pillars, lunarTs.pillars);

  return {
    id: sample.id,
    type: sample.type,
    input: formatInput(sample.input),
    goal: sample.goal,
    tyme,
    lunarJs,
    lunarTs,
    agreement: sample.input.hour === null ? "not_applicable" : agreement ? "match" : "mismatch",
    externalReference: "pending",
  };
}

const results = samples.map(compareOne);
const summary = {
  generatedAt: new Date().toISOString(),
  packageCandidates: {
    tyme4ts: "1.4.6",
    lunarJavascript: "1.7.7",
    lunarTypescript: "1.8.6",
  },
  total: results.length,
  matched: results.filter((r) => r.agreement === "match").length,
  mismatch: results.filter((r) => r.agreement === "mismatch").length,
  notApplicable: results.filter((r) => r.agreement === "not_applicable").length,
};

console.log(JSON.stringify({ summary, results }, null, 2));
