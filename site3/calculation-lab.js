import {
  DefaultEightCharProvider,
  LunarHour,
  LunarSect2EightCharProvider,
  SolarTime,
} from "./vendor/tyme4ts/index.mjs?v=lab-20260510-3";

const STEM_ELEMENTS = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

const BRANCH_ELEMENTS = {
  子: "水",
  丑: "土",
  寅: "木",
  卯: "木",
  辰: "土",
  巳: "火",
  午: "火",
  未: "土",
  申: "金",
  酉: "金",
  戌: "土",
  亥: "水",
};

const PILLAR_KEYS = ["year", "month", "day", "hour"];
const PILLAR_LABELS = {
  year: "年柱",
  month: "月柱",
  day: "日柱",
  hour: "时柱",
};

const WARNING_LABELS = {
  BIRTH_TIME_DEFAULTED_TO_NOON: "出生时间不详，时柱按 12:00 午时假设计算。",
  TRUE_SOLAR_TIME_APPLIED: "已按出生地经纬度换算真太阳时。",
  TRUE_SOLAR_TIME_REQUIRES_BIRTHPLACE: "真太阳时模式需要城市级出生地经纬度。",
  LATE_ZI_HOUR_MODE_USER_SELECTABLE: "23:00-23:59 存在晚子时/子初换日流派差异。",
};

const LOCATIONS = [
  {
    id: "hokkaido",
    label: "日本 / 北海道 札幌市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 43.0642,
    longitude: 141.3469,
  },
  {
    id: "aomori",
    label: "日本 / 青森県 青森市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 40.8244,
    longitude: 140.74,
  },
  {
    id: "iwate",
    label: "日本 / 岩手県 盛岡市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 39.7036,
    longitude: 141.1527,
  },
  {
    id: "miyagi",
    label: "日本 / 宮城県 仙台市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 38.2682,
    longitude: 140.8694,
  },
  {
    id: "akita",
    label: "日本 / 秋田県 秋田市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 39.7186,
    longitude: 140.1024,
  },
  {
    id: "yamagata",
    label: "日本 / 山形県 山形市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 38.2404,
    longitude: 140.3633,
  },
  {
    id: "fukushima",
    label: "日本 / 福島県 福島市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 37.7608,
    longitude: 140.4747,
  },
  {
    id: "ibaraki",
    label: "日本 / 茨城県 水戸市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 36.3418,
    longitude: 140.4468,
  },
  {
    id: "tochigi",
    label: "日本 / 栃木県 宇都宮市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 36.5658,
    longitude: 139.8836,
  },
  {
    id: "gunma",
    label: "日本 / 群馬県 前橋市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 36.3912,
    longitude: 139.0609,
  },
  {
    id: "saitama",
    label: "日本 / 埼玉県 さいたま市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 35.8569,
    longitude: 139.6489,
  },
  {
    id: "chiba",
    label: "日本 / 千葉県 千葉市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 35.6074,
    longitude: 140.1065,
  },
  {
    id: "tokyo",
    label: "日本 / 東京都 千代田区",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 35.6812,
    longitude: 139.7671,
  },
  {
    id: "kanagawa",
    label: "日本 / 神奈川県 横浜市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 35.4437,
    longitude: 139.638,
  },
  {
    id: "niigata",
    label: "日本 / 新潟県 新潟市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 37.9026,
    longitude: 139.0232,
  },
  {
    id: "toyama",
    label: "日本 / 富山県 富山市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 36.6953,
    longitude: 137.2113,
  },
  {
    id: "ishikawa",
    label: "日本 / 石川県 金沢市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 36.5947,
    longitude: 136.6256,
  },
  {
    id: "fukui",
    label: "日本 / 福井県 福井市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 36.0652,
    longitude: 136.2216,
  },
  {
    id: "yamanashi",
    label: "日本 / 山梨県 甲府市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 35.6621,
    longitude: 138.5683,
  },
  {
    id: "nagano",
    label: "日本 / 長野県 長野市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 36.6513,
    longitude: 138.181,
  },
  {
    id: "gifu",
    label: "日本 / 岐阜県 岐阜市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 35.4233,
    longitude: 136.7607,
  },
  {
    id: "shizuoka",
    label: "日本 / 静岡県 静岡市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 34.9756,
    longitude: 138.3828,
  },
  {
    id: "aichi",
    label: "日本 / 愛知県 名古屋市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 35.1815,
    longitude: 136.9066,
  },
  {
    id: "mie",
    label: "日本 / 三重県 津市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 34.7303,
    longitude: 136.5086,
  },
  {
    id: "shiga",
    label: "日本 / 滋賀県 大津市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 35.0045,
    longitude: 135.8686,
  },
  {
    id: "kyoto",
    label: "日本 / 京都府 京都市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 35.0116,
    longitude: 135.7681,
  },
  {
    id: "osaka",
    label: "日本 / 大阪府 大阪市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 34.6937,
    longitude: 135.5023,
  },
  {
    id: "hyogo",
    label: "日本 / 兵庫県 神戸市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 34.6901,
    longitude: 135.1955,
  },
  {
    id: "nara",
    label: "日本 / 奈良県 奈良市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 34.6851,
    longitude: 135.8048,
  },
  {
    id: "wakayama",
    label: "日本 / 和歌山県 和歌山市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 34.226,
    longitude: 135.1675,
  },
  {
    id: "tottori",
    label: "日本 / 鳥取県 鳥取市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 35.5011,
    longitude: 134.2351,
  },
  {
    id: "shimane",
    label: "日本 / 島根県 松江市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 35.4681,
    longitude: 133.0485,
  },
  {
    id: "okayama",
    label: "日本 / 岡山県 岡山市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 34.6551,
    longitude: 133.9195,
  },
  {
    id: "hiroshima",
    label: "日本 / 広島県 広島市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 34.3853,
    longitude: 132.4553,
  },
  {
    id: "yamaguchi",
    label: "日本 / 山口県 山口市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 34.1785,
    longitude: 131.4737,
  },
  {
    id: "tokushima",
    label: "日本 / 徳島県 徳島市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 34.0703,
    longitude: 134.5549,
  },
  {
    id: "kagawa",
    label: "日本 / 香川県 高松市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 34.3428,
    longitude: 134.0466,
  },
  {
    id: "ehime",
    label: "日本 / 愛媛県 松山市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 33.8392,
    longitude: 132.7657,
  },
  {
    id: "kochi",
    label: "日本 / 高知県 高知市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 33.5597,
    longitude: 133.5311,
  },
  {
    id: "fukuoka",
    label: "日本 / 福岡県 福岡市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 33.5902,
    longitude: 130.4017,
  },
  {
    id: "saga",
    label: "日本 / 佐賀県 佐賀市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 33.2494,
    longitude: 130.2988,
  },
  {
    id: "nagasaki",
    label: "日本 / 長崎県 長崎市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 32.7448,
    longitude: 129.8737,
  },
  {
    id: "kumamoto",
    label: "日本 / 熊本県 熊本市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 32.8031,
    longitude: 130.7079,
  },
  {
    id: "oita",
    label: "日本 / 大分県 大分市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 33.2382,
    longitude: 131.6126,
  },
  {
    id: "miyazaki",
    label: "日本 / 宮崎県 宮崎市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 31.9077,
    longitude: 131.4202,
  },
  {
    id: "kagoshima",
    label: "日本 / 鹿児島県 鹿児島市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 31.5966,
    longitude: 130.5571,
  },
  {
    id: "okinawa",
    label: "日本 / 沖縄県 那覇市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 26.2124,
    longitude: 127.6809,
  },
  {
    id: "beijing-dongcheng",
    label: "中国 / 北京市 东城区",
    timezone: "Asia/Shanghai",
    utcOffset: 8,
    latitude: 39.9288,
    longitude: 116.4164,
  },
  {
    id: "shanghai-huangpu",
    label: "中国 / 上海市 黄浦区",
    timezone: "Asia/Shanghai",
    utcOffset: 8,
    latitude: 31.2317,
    longitude: 121.4846,
  },
];

const FIXTURES = [
  {
    id: "F001",
    title: "普通日期",
    note: "基础四柱样例，三库与外部截图一致。",
    input: {
      date: "1990-06-15",
      timeKnown: true,
      time: "10:30",
      timeCalculationMode: "standard_time",
      lateZiHourMode: "same_day",
      locationId: "tokyo",
    },
    expected: {
      pillars: "庚午 / 壬午 / 辛亥 / 癸巳",
      source: "tyme4ts / lunar 系列 / 测测截图",
    },
  },
  {
    id: "F002A",
    title: "立春前",
    note: "年柱、月柱节气边界前。",
    input: {
      date: "2024-02-04",
      timeKnown: true,
      time: "15:30",
      timeCalculationMode: "standard_time",
      lateZiHourMode: "same_day",
      locationId: "tokyo",
    },
    expected: {
      pillars: "癸卯 / 乙丑 / 戊戌 / 庚申",
      source: "tyme4ts / lunar 系列 / 测测截图",
    },
  },
  {
    id: "F002B",
    title: "立春后",
    note: "年柱、月柱节气边界后。",
    input: {
      date: "2024-02-04",
      timeKnown: true,
      time: "16:30",
      timeCalculationMode: "standard_time",
      lateZiHourMode: "same_day",
      locationId: "tokyo",
    },
    expected: {
      pillars: "甲辰 / 丙寅 / 戊戌 / 庚申",
      source: "tyme4ts / lunar 系列 / 测测截图",
    },
  },
  {
    id: "F003A",
    title: "子时前",
    note: "22:30 亥时，子时换日规则不介入。",
    input: {
      date: "1988-02-15",
      timeKnown: true,
      time: "22:30",
      timeCalculationMode: "standard_time",
      lateZiHourMode: "same_day",
      locationId: "tokyo",
    },
    expected: {
      pillars: "戊辰 / 甲寅 / 庚子 / 丁亥",
      source: "tyme4ts / lunar 系列 / 测测截图",
    },
  },
  {
    id: "F003B-SAME",
    title: "子时后 / 产品默认",
    note: "23:30，默认晚子时不换日。",
    input: {
      date: "1988-02-15",
      timeKnown: true,
      time: "23:30",
      timeCalculationMode: "standard_time",
      lateZiHourMode: "same_day",
      locationId: "tokyo",
    },
    expected: {
      pillars: "戊辰 / 甲寅 / 庚子 / 戊子",
      warnings: ["LATE_ZI_HOUR_MODE_USER_SELECTABLE"],
      source: "问真早晚子时开 / 产品默认规则",
    },
  },
  {
    id: "F003B-NEXT",
    title: "子时后 / 专家选项",
    note: "23:30，子初换日。",
    input: {
      date: "1988-02-15",
      timeKnown: true,
      time: "23:30",
      timeCalculationMode: "standard_time",
      lateZiHourMode: "next_day",
      locationId: "tokyo",
    },
    expected: {
      pillars: "戊辰 / 甲寅 / 辛丑 / 戊子",
      warnings: ["LATE_ZI_HOUR_MODE_USER_SELECTABLE"],
      source: "问真早晚子时关 / 测测在真太阳时进入子时后的口径",
    },
  },
  {
    id: "BZ-Z002",
    title: "北京真太阳时 23:00",
    note: "测测要求地点；23:00 标准时间换算为约 22:31 真太阳时，不进入子时。",
    input: {
      date: "1988-02-15",
      timeKnown: true,
      time: "23:00",
      timeCalculationMode: "true_solar_time",
      lateZiHourMode: "next_day",
      locationId: "beijing-dongcheng",
    },
    expected: {
      pillars: "戊辰 / 甲寅 / 庚子 / 丁亥",
      trueSolarTime: "1988-02-15 22:31",
      source: "八字测测专业版截图",
    },
  },
  {
    id: "BZ-Z003",
    title: "北京真太阳时 23:30",
    note: "23:30 标准时间换算为约 23:01 真太阳时，测测显示子时换日。",
    input: {
      date: "1988-02-15",
      timeKnown: true,
      time: "23:30",
      timeCalculationMode: "true_solar_time",
      lateZiHourMode: "next_day",
      locationId: "beijing-dongcheng",
    },
    expected: {
      pillars: "戊辰 / 甲寅 / 辛丑 / 戊子",
      trueSolarTime: "1988-02-15 23:01",
      warnings: ["LATE_ZI_HOUR_MODE_USER_SELECTABLE"],
      source: "八字测测专业版 F003B 截图",
    },
  },
  {
    id: "F005",
    title: "时辰不详",
    note: "业务层默认 12:00 午时，时柱必须降级标记。",
    input: {
      date: "1990-06-15",
      timeKnown: false,
      time: "12:00",
      timeCalculationMode: "standard_time",
      lateZiHourMode: "same_day",
      locationId: "tokyo",
    },
    expected: {
      pillars: "庚午 / 壬午 / 辛亥 / 甲午",
      warnings: ["BIRTH_TIME_DEFAULTED_TO_NOON"],
      source: "业务规则：时辰不详默认午时",
    },
  },
];

function pad(value) {
  return String(value).padStart(2, "0");
}

function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return { year, month, day };
}

function parseTime(value) {
  const [hour, minute] = value.split(":").map(Number);
  return { hour, minute, second: 0 };
}

function validateLocalParts(parts) {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second));
  const valid =
    date.getUTCFullYear() === parts.year &&
    date.getUTCMonth() === parts.month - 1 &&
    date.getUTCDate() === parts.day &&
    date.getUTCHours() === parts.hour &&
    date.getUTCMinutes() === parts.minute;

  if (!valid) {
    throw new Error("INVALID_DATE");
  }
}

function localPartsToDate(parts) {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second));
}

function dateToLocalParts(date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
  };
}

function addMinutes(parts, minutes) {
  const next = localPartsToDate(parts).getTime() + Math.round(minutes * 60 * 1000);
  return dateToLocalParts(new Date(next));
}

function formatLocal(parts) {
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)} ${pad(parts.hour)}:${pad(parts.minute)}`;
}

function dayOfYear(year, month, day) {
  const current = Date.UTC(year, month - 1, day);
  const start = Date.UTC(year, 0, 0);
  return Math.floor((current - start) / 86400000);
}

function equationOfTimeMinutes(parts) {
  const n = dayOfYear(parts.year, parts.month, parts.day);
  const b = (2 * Math.PI * (n - 81)) / 364;
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}

function trueSolarAdjustmentMinutes(parts, location) {
  const standardMeridian = location.utcOffset * 15;
  const longitudeCorrection = 4 * (location.longitude - standardMeridian);
  const equationOfTime = equationOfTimeMinutes(parts);
  return {
    standardMeridian,
    longitudeCorrection,
    equationOfTime,
    total: longitudeCorrection + equationOfTime,
  };
}

function locationById(id) {
  return LOCATIONS.find((location) => location.id === id) || LOCATIONS[0];
}

function providerForLateZi(mode) {
  if (mode === "next_day") {
    return new DefaultEightCharProvider();
  }
  return new LunarSect2EightCharProvider();
}

function hiddenStemType(type) {
  if (type === 2) return "main";
  if (type === 1) return "middle";
  return "residual";
}

function collectHiddenStemDetails(pillar, dayStem) {
  return pillar.getEarthBranch().getHideHeavenStems().map((stemItem) => {
    const stem = stemItem.getHeavenStem();
    return {
      stem: stem.toString(),
      element: stem.getElement().toString(),
      tenGod: dayStem.getTenStar(stem).toString(),
      type: hiddenStemType(stemItem.getType()),
    };
  });
}

function normalizePillar(pillar, dayStem, source = "user_input", confidence = "confirmed") {
  const text = pillar.toString();
  const stem = text.slice(0, 1);
  const branch = text.slice(1, 2);
  const hiddenStemDetails = collectHiddenStemDetails(pillar, dayStem);
  return {
    text,
    stem,
    branch,
    element: {
      stem: STEM_ELEMENTS[stem],
      branch: BRANCH_ELEMENTS[branch],
    },
    hiddenStems: hiddenStemDetails.map((detail) => detail.stem),
    hiddenStemDetails,
    naYin: pillar.getSound().toString(),
    voidBranches: pillar.getExtraEarthBranches().map((branchItem) => branchItem.toString()),
    terrainByDay: dayStem.getTerrain(pillar.getEarthBranch()).toString(),
    terrainSelf: pillar.getHeavenStem().getTerrain(pillar.getEarthBranch()).toString(),
    source,
    confidence,
  };
}

function collectTenGods(pillars) {
  const dayStem = pillars.day.raw.getHeavenStem();
  return {
    year: dayStem.getTenStar(pillars.year.raw.getHeavenStem()).toString(),
    month: dayStem.getTenStar(pillars.month.raw.getHeavenStem()).toString(),
    day: "日主",
    hour: dayStem.getTenStar(pillars.hour.raw.getHeavenStem()).toString(),
  };
}

function stripRawPillars(pillars) {
  const out = {};
  for (const key of PILLAR_KEYS) {
    const { raw, ...rest } = pillars[key];
    out[key] = rest;
  }
  return out;
}

function countElements(pillars) {
  const counts = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const key of PILLAR_KEYS) {
    counts[pillars[key].element.stem] += 1;
    counts[pillars[key].element.branch] += 1;
  }
  return counts;
}

function buildPillarLine(pillars) {
  return PILLAR_KEYS.map((key) => pillars[key].text).join(" / ");
}

function buildInputParts(input) {
  const date = parseDate(input.date);
  const time = input.timeKnown ? parseTime(input.time) : { hour: 12, minute: 0, second: 0 };
  const parts = { ...date, ...time };
  validateLocalParts(parts);
  return parts;
}

function calculateShichusuimei(input) {
  const location = locationById(input.locationId);
  const rawParts = buildInputParts(input);
  const warnings = [];
  let effectiveParts = rawParts;
  let trueSolar = {
    applied: false,
    offsetMinutes: 0,
    longitudeCorrection: 0,
    equationOfTime: 0,
    standardMeridian: location.utcOffset * 15,
  };

  if (!input.timeKnown) {
    warnings.push("BIRTH_TIME_DEFAULTED_TO_NOON");
  }

  if (input.timeCalculationMode === "true_solar_time") {
    if (location.longitude == null || location.latitude == null) {
      warnings.push("TRUE_SOLAR_TIME_REQUIRES_BIRTHPLACE");
      throw new Error("TRUE_SOLAR_TIME_REQUIRES_BIRTHPLACE");
    }

    const adjustment = trueSolarAdjustmentMinutes(rawParts, location);
    effectiveParts = addMinutes(rawParts, adjustment.total);
    trueSolar = {
      applied: true,
      offsetMinutes: adjustment.total,
      longitudeCorrection: adjustment.longitudeCorrection,
      equationOfTime: adjustment.equationOfTime,
      standardMeridian: adjustment.standardMeridian,
    };
    warnings.push("TRUE_SOLAR_TIME_APPLIED");
  }

  if (effectiveParts.hour === 23) {
    warnings.push("LATE_ZI_HOUR_MODE_USER_SELECTABLE");
  }

  LunarHour.provider = providerForLateZi(input.lateZiHourMode);
  const solarTime = SolarTime.fromYmdHms(
    effectiveParts.year,
    effectiveParts.month,
    effectiveParts.day,
    effectiveParts.hour,
    effectiveParts.minute,
    effectiveParts.second,
  );
  const eightChar = solarTime.getLunarHour().getEightChar();
  const rawPillars = {
    year: { raw: eightChar.getYear() },
    month: { raw: eightChar.getMonth() },
    day: { raw: eightChar.getDay() },
    hour: { raw: eightChar.getHour() },
  };
  const dayStem = rawPillars.day.raw.getHeavenStem();
  const hourSource = input.timeKnown ? "user_input" : "default_noon";
  const hourConfidence = input.timeKnown ? "confirmed" : "low";
  const pillarsWithRaw = {
    year: { raw: rawPillars.year.raw, ...normalizePillar(rawPillars.year.raw, dayStem) },
    month: { raw: rawPillars.month.raw, ...normalizePillar(rawPillars.month.raw, dayStem) },
    day: { raw: rawPillars.day.raw, ...normalizePillar(rawPillars.day.raw, dayStem) },
    hour: { raw: rawPillars.hour.raw, ...normalizePillar(rawPillars.hour.raw, dayStem, hourSource, hourConfidence) },
  };
  const tenGods = collectTenGods(pillarsWithRaw);
  const pillars = stripRawPillars(pillarsWithRaw);

  return {
    ok: true,
    engine: "tyme4ts",
    version: "calculation-lab-v0.1",
    inputEcho: input,
    calculationMeta: {
      timezone: location.timezone,
      location: {
        id: location.id,
        label: location.label,
        latitude: location.latitude,
        longitude: location.longitude,
      },
      calendar: "gregorian",
      solarTermMode: "verified_by_tyme4ts",
      timeCalculationMode: input.timeCalculationMode,
      lateZiHourMode: input.lateZiHourMode,
      birthTimeStatus: input.timeKnown ? "known" : "unknown_defaulted",
      inputDateTime: formatLocal(rawParts),
      effectiveBirthDateTime: formatLocal(effectiveParts),
      trueSolarTime: trueSolar.applied ? "applied" : "not_applied",
      trueSolar,
      warnings: [...new Set(warnings)],
    },
    pillars,
    pillarLine: buildPillarLine(pillars),
    dayMaster: pillars.day.stem,
    tenGods,
    hiddenStems: Object.fromEntries(PILLAR_KEYS.map((key) => [key, pillars[key].hiddenStems])),
    fiveElements: {
      counts: countElements(pillars),
    },
  };
}

function fixtureById(id) {
  return FIXTURES.find((fixture) => fixture.id === id) || null;
}

function element(id) {
  return document.getElementById(id);
}

function renderCalculationStatus(message, type = "ok") {
  const status = element("calculation-status");
  if (!status) {
    return;
  }
  status.className = `calc-status ${type}`;
  status.textContent = message;
}

function currentClockTime() {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function renderFixtureRunStatus(message, type = "ok") {
  const status = element("fixture-run-status");
  if (!status) {
    return;
  }
  status.className = `fixture-run-status ${type}`;
  status.textContent = message;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderWarningList(warnings) {
  if (!warnings.length) {
    return `<span class="muted">无</span>`;
  }
  return warnings
    .map((warning) => `<span class="pill warn">${escapeHtml(warning)}：${escapeHtml(WARNING_LABELS[warning] || "")}</span>`)
    .join("");
}

function renderPillarTable(result) {
  return `
    <table>
      <thead>
        <tr>
          <th>位置</th>
          <th>四柱</th>
          <th>天干</th>
          <th>地支</th>
          <th>五行</th>
          <th>藏干</th>
          <th>十神</th>
          <th>可信度</th>
        </tr>
      </thead>
      <tbody>
        ${PILLAR_KEYS.map((key) => {
          const pillar = result.pillars[key];
          return `
            <tr>
              <td>${PILLAR_LABELS[key]}</td>
              <td><strong>${pillar.text}</strong></td>
              <td>${pillar.stem}</td>
              <td>${pillar.branch}</td>
              <td>${pillar.element.stem} / ${pillar.element.branch}</td>
              <td>${pillar.hiddenStems.join("、")}</td>
              <td>${result.tenGods[key]}</td>
              <td>${pillar.source === "default_noon" ? "12:00 午时假设值 / 低可信" : "已确认"}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

function formatMinutes(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)} 分钟`;
}

function renderMetaTable(result) {
  const meta = result.calculationMeta;
  return `
    <table>
      <tbody>
        <tr><th>原始输入时间</th><td>${meta.inputDateTime}（${meta.timezone}）</td></tr>
        <tr><th>有效计算时间</th><td>${meta.effectiveBirthDateTime}</td></tr>
        <tr><th>地点</th><td>${meta.location.label}</td></tr>
        <tr><th>计算模式</th><td>${meta.timeCalculationMode === "true_solar_time" ? "真太阳时" : "标准时间"}</td></tr>
        <tr><th>子时规则</th><td>${meta.lateZiHourMode === "same_day" ? "晚子时不换日（产品默认）" : "23:00 子初换日（专家选项）"}</td></tr>
        <tr><th>真太阳时偏移</th><td>${meta.trueSolarTime === "applied" ? `${formatMinutes(meta.trueSolar.offsetMinutes)}（经度 ${formatMinutes(meta.trueSolar.longitudeCorrection)}；均时差 ${formatMinutes(meta.trueSolar.equationOfTime)}）` : "未应用"}</td></tr>
        <tr><th>提示</th><td>${renderWarningList(meta.warnings)}</td></tr>
      </tbody>
    </table>
  `;
}

function renderResult(result, fixture) {
  const expected = fixture?.expected;
  const match = expected?.pillars ? expected.pillars === result.pillarLine : null;
  element("result").innerHTML = `
    <div class="result-head">
      <div>
        <h2>计算结果</h2>
        <p>${escapeHtml(result.pillarLine)}</p>
      </div>
      ${match === null ? "" : `<span class="status ${match ? "pass" : "fail"}">${match ? "与样例一致" : "与样例不一致"}</span>`}
    </div>
    ${renderPillarTable(result)}
    <h3>计算元信息</h3>
    ${renderMetaTable(result)}
    <h3>结构化 JSON</h3>
    <pre>${escapeHtml(JSON.stringify(result, null, 2))}</pre>
  `;
}

function renderError(error) {
  const code = error.message || "UNKNOWN_ERROR";
  element("result").innerHTML = `
    <div class="error">
      <strong>计算失败：${escapeHtml(code)}</strong>
      <p>${escapeHtml(WARNING_LABELS[code] || "请检查日期、时间、地点和计算模式。")}</p>
    </div>
  `;
}

function readFormInput() {
  return {
    date: element("birth-date").value,
    timeKnown: element("time-known").checked,
    time: element("birth-time").value || "12:00",
    timeCalculationMode: element("time-mode").value,
    lateZiHourMode: element("late-zi-mode").value,
    locationId: element("location").value,
  };
}

function fillForm(input) {
  element("birth-date").value = input.date;
  element("time-known").checked = input.timeKnown;
  element("birth-time").value = input.time;
  element("birth-time").disabled = !input.timeKnown;
  element("time-mode").value = input.timeCalculationMode;
  element("late-zi-mode").value = input.lateZiHourMode;
  element("location").value = input.locationId;
}

function calculateCurrent() {
  const fixture = fixtureById(element("fixture").value);
  try {
    const result = calculateShichusuimei(readFormInput());
    renderResult(result, fixture);
    renderCalculationStatus(`已重新计算 ${currentClockTime()}`);
  } catch (error) {
    renderError(error);
    renderCalculationStatus(`计算失败 ${currentClockTime()}`, "fail");
  }
}

function fixtureMatchesCurrent(fixture) {
  if (!fixture) {
    return false;
  }
  const input = readFormInput();
  return JSON.stringify(input) === JSON.stringify(fixture.input);
}

function runFixture(fixture) {
  try {
    const result = calculateShichusuimei(fixture.input);
    const pillarMatched = fixture.expected.pillars === result.pillarLine;
    const expectedWarnings = fixture.expected.warnings || [];
    const warningsMatched = expectedWarnings.every((warning) => result.calculationMeta.warnings.includes(warning));
    const trueSolarMatched = fixture.expected.trueSolarTime
      ? fixture.expected.trueSolarTime === result.calculationMeta.effectiveBirthDateTime
      : true;
    return {
      ok: pillarMatched && warningsMatched && trueSolarMatched,
      result,
      pillarMatched,
      warningsMatched,
      trueSolarMatched,
    };
  } catch (error) {
    return { ok: false, error };
  }
}

function renderFixtureTable() {
  const runs = FIXTURES.map((fixture) => ({ fixture, run: runFixture(fixture) }));
  const rows = runs.map(({ fixture, run }) => {
    const actual = run.result?.pillarLine || run.error?.message || "ERROR";
    const effective = run.result?.calculationMeta.effectiveBirthDateTime || "-";
    return `
      <tr>
        <td>${fixture.id}</td>
        <td>${escapeHtml(fixture.title)}</td>
        <td>${escapeHtml(fixture.note)}</td>
        <td>${escapeHtml(fixture.expected.pillars)}</td>
        <td>${escapeHtml(actual)}</td>
        <td>${escapeHtml(effective)}</td>
        <td>${escapeHtml(fixture.expected.source)}</td>
        <td><span class="status ${run.ok ? "pass" : "fail"}">${run.ok ? "通过" : "失败"}</span></td>
      </tr>
    `;
  }).join("");

  element("fixtures").innerHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>样例</th>
          <th>目的</th>
          <th>期望四柱</th>
          <th>实际四柱</th>
          <th>有效时间</th>
          <th>来源</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
  const passed = runs.filter(({ run }) => run.ok).length;
  const failed = runs.length - passed;
  renderFixtureRunStatus(`已运行 ${currentClockTime()}，${passed}/${runs.length} 通过`, failed ? "fail" : "ok");
}

function populateOptions() {
  element("fixture").innerHTML = FIXTURES.map(
    (fixture) => `<option value="${fixture.id}">${fixture.id} - ${fixture.title}</option>`,
  ).join("");
  element("location").innerHTML = LOCATIONS.map(
    (location) => `<option value="${location.id}">${location.label}</option>`,
  ).join("");
}

function bindEvents() {
  element("fixture").addEventListener("change", () => {
    const fixture = fixtureById(element("fixture").value);
    if (fixture) {
      fillForm(fixture.input);
    }
    calculateCurrent();
  });
  element("calculate").addEventListener("click", calculateCurrent);
  element("run-fixtures").addEventListener("click", renderFixtureTable);
  element("time-known").addEventListener("change", () => {
    element("birth-time").disabled = !element("time-known").checked;
  });
  ["birth-date", "birth-time", "time-mode", "late-zi-mode", "location"].forEach((id) => {
    element(id).addEventListener("change", () => {
      if (!fixtureMatchesCurrent(fixtureById(element("fixture").value))) {
        element("fixture").value = "CUSTOM";
      }
      calculateCurrent();
    });
  });
}

function init() {
  populateOptions();
  element("fixture").insertAdjacentHTML("beforeend", `<option value="CUSTOM">CUSTOM - 当前表单</option>`);
  fillForm(FIXTURES[0].input);
  bindEvents();
  renderFixtureTable();
  calculateCurrent();
}

if (typeof document !== "undefined" && document.getElementById("fixture")) {
  init();
}

export { calculateShichusuimei, FIXTURES, LOCATIONS };
