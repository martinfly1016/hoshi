import {
  ChildLimit,
  DefaultEightCharProvider,
  Gender,
  LunarHour,
  LunarSect2EightCharProvider,
  SixtyCycleYear,
  SolarDay,
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

function normalizeInputLocation(input) {
  const override = input.locationOverride;
  const latitude = Number(override?.latitude);
  const longitude = Number(override?.longitude);
  if (override && Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return {
      id: override.id || input.locationId || "custom-location",
      label: override.label || "出生地",
      timezone: override.timezone || "Asia/Tokyo",
      utcOffset: Number.isFinite(Number(override.utcOffset)) ? Number(override.utcOffset) : 9,
      latitude,
      longitude,
    };
  }
  return locationById(input.locationId);
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

function normalizeGender(value) {
  if (value === "male" || value === "man") return "male";
  if (value === "female" || value === "woman") return "female";
  return "unspecified";
}

function tymeGender(value) {
  const gender = normalizeGender(value);
  if (gender === "male") return Gender.MAN;
  if (gender === "female") return Gender.WOMAN;
  return null;
}

function formatSolarDateTime(solarTime) {
  return formatLocal({
    year: solarTime.getYear(),
    month: solarTime.getMonth(),
    day: solarTime.getDay(),
    hour: solarTime.getHour(),
    minute: solarTime.getMinute(),
    second: solarTime.getSecond(),
  });
}

const BRANCH_CHONG = {
  '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳'
};

const BRANCH_HE_6 = {
  '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯',
  '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午'
};

function getFortuneTheme(tenGod) {
  const themes = {
    '比肩': '自立と競争、自分らしさを再確立する時期。',
    '劫财': '人間関係が広がり、勢いと出費が増える時期。',
    '食神': '表現、楽しみ、ゆとりある生活を楽しむ時期。',
    '伤官': '感性が鋭くなり、既存の枠を壊し新しい才を発揮する時期。',
    '偏财': '流動的な財や人脈、チャンスが大きく动く时期。',
    '正财': '安定した基盤、誠実な積み上げ、着実な成果の时期。',
    '七杀': '強い責任、大きな試練、大胆な挑戦と開拓の時期。',
    '正官': '社会的地位、信頼、規律ある秩序を整える時期。',
    '偏印': '直感、神秘、型破りな知識や技術を習得する時期。',
    '正印': '学び、名誉、周囲からの守りや支援を受ける時期。',
  };
  return themes[tenGod] || '変化と運勢の交差点。';
}

const BRANCH_XING = [
  { branches: ['子', '卯'], label: '無礼の刑', text: '礼節を欠きやすく、身近な人間関係での摩擦に注意が必要な時期。' },
  { branches: ['寅', '巳', '申'], label: '恩なき刑', text: '信頼関係の揺らぎや、親切が裏目に出やすい傾向。冷静な距離感が吉。' },
  { branches: ['丑', '未', '戌'], label: '持勢の刑', text: '自分の力を過信しやすく、強引な進め方で衝突を招きやすい時期。' },
  { branches: ['辰', '辰'], label: '自刑', text: '自分のこだわりや迷いによって、袋小路に入り込みやすい傾向。' },
  { branches: ['午', '午'], label: '自刑', text: '情熱が空回りしやすく、焦りから自分を追い詰めやすい時期。' },
  { branches: ['酉', '酉'], label: '自刑', text: '完璧主義が過ぎて、重箱の隅をつつくような不満が募りやすい傾向。' },
  { branches: ['亥', '亥'], label: '自刑', text: '考え込みすぎてしまい、精神的な疲弊や孤立を感じやすい時期。' },
];

const BRANCH_HE_3 = [
  { branches: ['申', '子', '辰'], label: '三合水局', text: '知性と潤いが巡り、物事が広がりを持って発展しやすい大吉の組み合わせ。' },
  { branches: ['亥', '卯', '未'], label: '三合木局', text: '成長と発展の気が強く、新しいプロジェクトや活動が形になりやすい好機。' },
  { branches: ['寅', '午', '戌'], label: '三合火局', text: '情熱と活力が最高潮に。カリスマ性を発揮し、周囲を巻き込むエネルギー。' },
  { branches: ['巳', '酉', '丑'], label: '三合金局', text: '決断と実実の気が高まり、成果の収穫や基盤固めに適した実りある時期。' },
];

const BRANCH_HE_6_DESC = {
  '子丑': '支合（土）：着実な協力関係。足元を固め、安定した成果を出す組み合わせ。',
  '寅亥': '支合（木）：理想的な連携。精神的な充足と、スムーズな発展を促す絆。',
  '卯戌': '支合（火）：情熱の共有。互いの欠点を補い合い、活力を生み出す関係。',
  '辰酉': '支合（金）：確かな信頼。高い目標に向かって、規律正しく進める協力。',
  '巳申': '支合（水）：変化への対応。知恵を出し合い、複雑な状況を切り抜ける力。',
  '午未': '支合（火）：太陽と月の調和。大きな包容力で、周囲を安心させるエネルギー。',
};

function analyzeLuckImpact(luckPillar, natalPillars) {
  const impacts = [];
  const luckBranch = luckPillar.branch;
  const natalBranches = Object.values(natalPillars).map(p => p.branch);
  const allBranches = [luckBranch, ...natalBranches];

  // 1. Clashes (Chong)
  PILLAR_KEYS.forEach(key => {
    const natal = natalPillars[key];
    if (BRANCH_CHONG[luckBranch] === natal.branch) {
      impacts.push({ 
        type: 'chong', 
        pillar: key, 
        label: `${PILLAR_LABELS[key]}に冲`, 
        text: `${luckBranch}と${natal.branch}が激突。${PILLAR_LABELS[key]}の領域に大きな変化や刷新、動揺が起こりやすい時期。`,
        severity: 'high' 
      });
    }
  });

  // 2. Six-Combinations (He)
  PILLAR_KEYS.forEach(key => {
    const natal = natalPillars[key];
    const pair = [luckBranch, natal.branch].sort().join('');
    if (BRANCH_HE_6_DESC[pair]) {
      impacts.push({ 
        type: 'he', 
        pillar: key, 
        label: `${PILLAR_LABELS[key]}と支合`, 
        text: BRANCH_HE_6_DESC[pair],
        severity: 'mid' 
      });
    }
  });

  // 3. Three-Combinations (San He) - Check if luck completes a trio in natal
  BRANCH_HE_3.forEach(trio => {
    if (trio.branches.includes(luckBranch)) {
      const countInNatal = trio.branches.filter(b => natalBranches.includes(b)).length;
      const countTotal = trio.branches.filter(b => allBranches.includes(b)).length;
      // If luck completes a trio or contributes to a partial one
      if (countTotal === 3 && countInNatal >= 1) {
        impacts.push({ type: 'sanhe', label: trio.label, text: trio.text, severity: 'high' });
      }
    }
  });

  // 4. Punishments (Xing)
  BRANCH_XING.forEach(rule => {
    const matched = rule.branches.every(b => allBranches.includes(b));
    if (matched) {
      // For self-punishment, need at least 2 occurrences in the combined set
      if (rule.branches[0] === rule.branches[1]) {
         const count = allBranches.filter(b => b === rule.branches[0]).length;
         if (count < 2) return;
      }
      impacts.push({ type: 'xing', label: rule.label, text: rule.text, severity: 'mid' });
    }
  });

  return impacts;
}


function normalizeCycle(cycle, dayStem, source = "luck_cycle", confidence = "reference") {
  const pillar = normalizePillar(cycle, dayStem, source, confidence);
  const tenGod = dayStem.getTenStar(cycle.getHeavenStem()).toString();
  return {
    ...pillar,
    heavenlyTenGod: tenGod,
    fortuneTheme: getFortuneTheme(tenGod)
  };
}


function buildDecadeFortunes(solarTime, genderValue, dayStem) {
  const gender = tymeGender(genderValue);
  if (gender == null) {
    return {
      status: "requires_gender",
      provider: "tyme4ts-default-child-limit",
      items: [],
      note: "大運は性別によって順行・逆行が変わるため、検証には性別指定が必要です。",
    };
  }

  const childLimit = ChildLimit.fromSolarTime(solarTime, gender);
  const startFortune = childLimit.getStartDecadeFortune();
  const items = Array.from({ length: 8 }, (_, index) => {
    const decade = startFortune.next(index);
    const cycle = decade.getSixtyCycle();
    return {
      index: index + 1,
      name: decade.getName(),
      startAge: decade.getStartAge(),
      endAge: decade.getEndAge(),
      startYear: decade.getStartSixtyCycleYear().getYear(),
      endYear: decade.getEndSixtyCycleYear().getYear(),
      pillar: normalizeCycle(cycle, dayStem, "decade_fortune", "reference"),
    };
  });

  return {
    status: "ok",
    provider: "tyme4ts-default-child-limit",
    direction: childLimit.isForward() ? "forward" : "backward",
    gender: normalizeGender(genderValue),
    startOffset: {
      years: childLimit.getYearCount(),
      months: childLimit.getMonthCount(),
      days: childLimit.getDayCount(),
      hours: childLimit.getHourCount(),
      minutes: childLimit.getMinuteCount(),
    },
    startTime: formatSolarDateTime(childLimit.getStartTime()),
    endTime: formatSolarDateTime(childLimit.getEndTime()),
    items,
  };
}

function buildAnnualFortunes(year, dayStem) {
  return Array.from({ length: 10 }, (_, index) => {
    const targetYear = year + index;
    const cycle = SixtyCycleYear.fromYear(targetYear).getSixtyCycle();
    return {
      year: targetYear,
      name: cycle.getName(),
      pillar: normalizeCycle(cycle, dayStem, "annual_fortune", "reference"),
    };
  });
}

function buildMonthlyFortunes(year, dayStem) {
  return SixtyCycleYear.fromYear(year).getMonths().map((month, index) => {
    const firstDay = month.getFirstDay().getSolarDay();
    const cycle = month.getSixtyCycle();
    return {
      index: index + 1,
      solarStartDate: `${firstDay.getYear()}-${pad(firstDay.getMonth())}-${pad(firstDay.getDay())}`,
      name: cycle.getName(),
      pillar: normalizeCycle(cycle, dayStem, "monthly_fortune", "reference"),
    };
  });
}

function buildDailyFortunes(year, month, day, dayStem) {
  const start = SolarDay.fromYmd(year, month, day);
  return Array.from({ length: 14 }, (_, index) => {
    const solarDay = start.next(index);
    const cycle = solarDay.getSixtyCycleDay().getSixtyCycle();
    return {
      date: `${solarDay.getYear()}-${pad(solarDay.getMonth())}-${pad(solarDay.getDay())}`,
      name: cycle.getName(),
      pillar: normalizeCycle(cycle, dayStem, "daily_fortune", "reference"),
    };
  });
}

function normalizeFortuneDate(input, fallbackParts) {
  const today = new Date();
  const parsedDate = input.fortuneDate ? parseDate(input.fortuneDate) : null;
  return {
    year: Number(input.fortuneYear) || parsedDate?.year || today.getFullYear(),
    month: parsedDate?.month || today.getMonth() + 1,
    day: parsedDate?.day || today.getDate(),
    fallbackBirthYear: fallbackParts.year,
  };
}

function analyzeClimateBalance(luckPillar, birthMonthBranch) {
  const summer = ['巳', '午', '未'];
  const winter = ['亥', '子', '丑'];
  const luckStem = luckPillar.stem;
  const luckBranch = luckPillar.branch;
  const luckElements = [luckPillar.element.stem, luckPillar.element.branch];

  if (summer.includes(birthMonthBranch)) {
    // Needs cooling (Water)
    if (luckElements.includes('水')) {
      return { status: 'good', label: '調候：潤い', text: '夏の生まれに待望の「水」が巡ります。過熱を抑え、冷静な判断ができる実り多い時期です。' };
    }
  }
  if (winter.includes(birthMonthBranch)) {
    // Needs warming (Fire)
    if (luckElements.includes('火')) {
      return { status: 'good', label: '調候：温め', text: '冬の生まれに温かな「火」が巡ります。凍てついた状況が溶け出し、活力が湧いてくる前向きな時期です。' };
    }
  }
  return null;
}

function analyzeNatalInteractions(natalPillars) {
  const impacts = [];
  const keys = PILLAR_KEYS; // hour, day, month, year
  
  // Check pairs within natal pillars
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const p1 = natalPillars[keys[i]];
      const p2 = natalPillars[keys[j]];
      
      // 1. Clash
      if (BRANCH_CHONG[p1.branch] === p2.branch) {
        impacts.push({ 
          label: `${PILLAR_LABELS[keys[i]]}と${PILLAR_LABELS[keys[j]]}の冲`, 
          text: `${p1.branch}と${p2.branch}が反発し合う関係です。相反する性質が同居することで、葛藤や変化が生じやすい傾向です。` 
        });
      }
      
      // 2. 6-Combo
      const pair = [p1.branch, p2.branch].sort().join('');
      if (BRANCH_HE_6_DESC[pair]) {
        impacts.push({ 
          label: `${PILLAR_LABELS[keys[i]]}と${PILLAR_LABELS[keys[j]]}の支合`, 
          text: BRANCH_HE_6_DESC[pair] 
        });
      }
    }
  }

  // 3. 3-Combo in natal
  const natalBranches = Object.values(natalPillars).map(p => p.branch);
  BRANCH_HE_3.forEach(trio => {
    const matched = trio.branches.filter(b => natalBranches.includes(b));
    if (matched.length === 3) {
      impacts.push({ label: trio.label, text: trio.text });
    }
  });
  
  return impacts;
}

function buildLuckCycles(input, solarTime, dayStem, effectiveParts, natalPillars) {
  const target = normalizeFortuneDate(input, effectiveParts);
  const birthMonthBranch = natalPillars.month.branch;
  const natalInteractions = analyzeNatalInteractions(natalPillars);
  
  const enrich = (item) => {
    if (!item?.pillar) return item;
    return {
      ...item,
      impacts: analyzeLuckImpact(item.pillar, natalPillars),
      climate: analyzeClimateBalance(item.pillar, birthMonthBranch)
    };
  };

  const decades = buildDecadeFortunes(solarTime, input.gender, dayStem);
  if (decades.status === 'ok') {
    decades.items = decades.items.map(enrich);
  }

  return {
    target,
    natalInteractions,
    decadeFortunes: decades,
    annualFortunes: buildAnnualFortunes(target.year, dayStem).map(enrich),
    monthlyFortunes: buildMonthlyFortunes(target.year, dayStem).map(enrich),
    dailyFortunes: buildDailyFortunes(target.year, target.month, target.day, dayStem).map(enrich),

    notes: [
      "大運は tyme4ts の DefaultChildLimitProvider による初版検証値です。",
      "流年・流月・流日は干支暦の周期表示で、吉凶断定ではありません。",
    ],
  };
}

function buildInputParts(input) {
  const date = parseDate(input.date);
  const time = input.timeKnown ? parseTime(input.time) : { hour: 12, minute: 0, second: 0 };
  const parts = { ...date, ...time };
  validateLocalParts(parts);
  return parts;
}

function analyzeDayMasterStrength(dayStem, monthBranch, elementCounts) {
  const wuxingCycle = ['木', '火', '土', '金', '水'];
  const idx = wuxingCycle.indexOf(dayStem);
  const supportElements = [wuxingCycle[(idx - 1 + 5) % 5], dayStem]; // Mother + Same
  
  // 1. Seasonality (De Ling)
  const seasons = {
    '木': ['寅', '卯', '辰'],
    '火': ['巳', '午', '未'],
    '金': ['申', '酉', '戌'],
    '水': ['亥', '子', '丑'],
    '土': ['辰', '戌', '丑', '未']
  };
  const isDeLing = seasons[dayStem].includes(monthBranch);
  
  // 2. Peer/Seal count (De Zhu)
  const supportCount = supportElements.reduce((sum, el) => sum + (elementCounts[el] || 0), 0);
  
  let score = (isDeLing ? 3 : 0) + supportCount;
  let status = '中和';
  let text = '中和：五行のバランスが取れた命局です。環境に左右されすぎず、安定した歩みが可能です。';
  
  if (score >= 6) {
    status = '身強';
    text = '身強：自己のエネルギーが強く、自力で運を切り拓く力があります。強い目標を持つことで輝きます。';
  } else if (score <= 3) {
    status = '身弱';
    text = '身弱：周囲の環境や人の影響を繊細に受け取る命局です。他者の支援や環境を整えることで本領を発揮します。';
  }
  
  return { status, text, score };
}

function analyzePattern(dayStem, monthBranch, revealedStems) {
  // Main Qi of each branch
  const mainQiMap = {
    '子': '癸', '丑': '己', '寅': '甲', '卯': '乙', '辰': '戊', '巳': '丙',
    '午': '丁', '未': '己', '申': '庚', '酉': '辛', '戌': '戊', '亥': '壬'
  };
  const mainStem = mainQiMap[monthBranch];
  
  // Determine Ten God of that main stem vs dayStem
  // Using simplified logic here as we can't easily call the API outside the main function
  const stems = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const elements = ['木','木','火','火','土','土','金','金','水','水'];
  const yinyang = ['陽','陰','陽','陰','陽','陰','陽','陰','陽','陰'];
  
  const idxDay = stems.indexOf(dayStem);
  const idxMain = stems.indexOf(mainStem);
  
  const elDay = elements[idxDay];
  const elMain = elements[idxMain];
  const yyDay = yinyang[idxDay];
  const yyMain = yinyang[idxMain];
  
  const wuxingCycle = ['木', '火', '土', '金', '水'];
  const diff = (wuxingCycle.indexOf(elMain) - wuxingCycle.indexOf(elDay) + 5) % 5;
  const isSamePolarity = yyDay === yyMain;
  
  let god = '';
  if (diff === 0) god = isSamePolarity ? '比肩' : '劫財';
  if (diff === 1) god = isSamePolarity ? '食神' : '傷官';
  if (diff === 2) god = isSamePolarity ? '偏財' : '正財';
  if (diff === 3) god = isSamePolarity ? '七殺' : '正官';
  if (diff === 4) god = isSamePolarity ? '偏印' : '正印';

  const isRevealed = revealedStems.includes(mainStem);
  
  const DESCS = {
    '正官': '正官格：品格と規律を重んじ、社会的な信頼を得て発展する王道の格局です。',
    '七殺': '七殺格：困難を突破する力と果敢な決断力を持ち、カリスマ性を発揮する格局です。',
    '正財': '正財格：着実な努力と誠実な管理能力で、安定した富と地位を築く格局です。',
    '偏財': '偏財格：機転が利き、変化する流れやチャンスを捉えて大きく飛躍する格局です。',
    '食神': '食神格：衣食住や感性に恵まれ、ゆとりある表現や才能で人を惹きつける格局です。',
    '傷官': '傷官格：卓越した知性と美意識を持ち、既存の枠を超えた創造性を発揮する格局です。',
    '正印': '正印格：学習能力と慈愛に溢れ、知識や名誉を通じて周囲に守られ発展する格局です。',
    '偏印': '偏印格：鋭い直感と独自の視点を持ち、専門的な技術や神秘的な分野で輝く格局です。',
    '建禄': '建禄格：自立心が非常に強く、自らの実力で道を切り拓くバイタリティ溢れる格局です。',
    '月刃': '月刃格：不屈の精神と強い意志を持ち、逆境であればあるほど力を発揮する格局です。'
  };

  let finalName = god === '比肩' ? '建禄' : (god === '劫財' ? '月刃' : god);
  
  return {
    name: `${finalName}格`,
    revealed: isRevealed,
    text: DESCS[finalName] || '標準的な命式構成です。'
  };
}

function getYongShen(dayStem, monthBranch) {
  const summer = ['巳', '午', '未'];
  const winter = ['亥', '子', '丑'];
  const spring = ['寅', '卯', '辰'];
  const autumn = ['申', '酉', '戌'];

  // Qiong Tong Bao Jian inspired logic
  const logic = {
    '甲': {
      spring: { primary: '丙', secondary: '癸', text: '初春の木はまだ寒く、太陽の光（丙火）を喜びます。適度な潤い（癸水）で根を養うのが理想です。' },
      summer: { primary: '癸', secondary: '丁', text: '夏の木は乾燥しやすいため、潤い（癸水）が最優先です。生い茂った枝葉を整える力も必要です。' },
      autumn: { primary: '庚', secondary: '丁', text: '秋の木は収穫の時。斧（庚金）で切り出し、火（丁火）で鍛えることで、社会の役に立つ材木となります。' },
      winter: { primary: '丙', secondary: '丁', text: '冬の木は凍てついています。何よりも温かさ（丙火）が必要です。太陽が万物を溶かす流れが吉です。' }
    },
    '乙': {
      spring: { primary: '丙', secondary: '癸', text: '春の草花は太陽（丙火）を浴びて輝きます。癸水の潤いがあれば、さらに美しく咲き誇ります。' },
      summer: { primary: '癸', secondary: '丙', text: '夏の草花は枯れやすいため、癸水による冷却が欠かせません。太陽も程よくあれば成長が促されます。' },
      autumn: { primary: '癸', secondary: '丙', text: '秋の草花は枯れていく時期。癸水で潤いを保ちつつ、太陽（丙火）で最後の大輪を咲かせるのが吉です。' },
      winter: { primary: '丙', secondary: '戊', text: '冬の草花は寒さに弱いです。太陽（丙火）で温め、土（戊土）で根元を保護することが命を繋ぎます。' }
    },
    '丙': {
      spring: { primary: '壬', secondary: '甲', text: '春の太陽は強い輝きを持ちます。大河（壬水）に映ることでその美しさが増し、甲木を育てて威光を保ちます。' },
      summer: { primary: '壬', secondary: '庚', text: '夏の太陽は熱すぎます。壬水での冷却が必須です。庚金があれば水流を助け、バランスが整います。' },
      autumn: { primary: '壬', secondary: '辛', text: '秋の太陽は西に沈みゆくもの。壬水で輝きを反射させ、辛金でその美しさを際立たせます。' },
      winter: { primary: '壬', secondary: '戊', text: '冬の太陽は雲に隠れがち。壬水でその存在を証明し、戊土で水流をコントロールして穏やかに照らします。' }
    },
    '丁': {
      spring: { primary: '甲', secondary: '庚', text: '春の灯火は風に弱いです。甲木を薪とし、庚金で薪を割る（劈甲引丁）ことで、消えない情熱の炎となります。' },
      summer: { primary: '壬', secondary: '庚', text: '夏の灯火は熱気で霞みます。壬水でクールダウンし、庚金で火の力を適度に導くのが吉です。' },
      autumn: { primary: '甲', secondary: '庚', text: '秋の灯火は薪が必要です。甲木で力を補い、庚金でその質を高めることで、長く輝き続けます。' },
      winter: { primary: '甲', secondary: '庚', text: '冬の灯火は寒さを追い払う貴重な存在。厚い薪（甲木）をくべ続けることが、運勢を安定させる鍵です。' }
    },
    '戊': {
      spring: { primary: '丙', secondary: '甲', text: '春の山はまだ冷たいです。太陽（丙火）で土を温め、甲木で山を彩ることで、豊かな景色（格）が生まれます。' },
      summer: { primary: '癸', secondary: '丙', text: '夏の山はカラカラです。慈雨（癸水）で潤すことが最優先。丙火があれば万物の成長を助けます。' },
      autumn: { primary: '丙', secondary: '癸', text: '秋の山は収穫の時。太陽（丙火）で恵みを照らし、癸水で瑞々しさを保つことが、豊かさに繋がります。' },
      winter: { primary: '丙', secondary: '甲', text: '冬の山は凍土。太陽（丙火）で凍えを溶かし、甲木で活力を与えることで、春への準備が整います。' }
    },
    '己': {
      spring: { primary: '丙', secondary: '癸', text: '春の田畑は太陽（丙火）と雨（癸水）が命です。これらが揃うことで、作物を育てる力が最大限に発揮されます。' },
      summer: { primary: '癸', secondary: '丙', text: '夏の田畑は乾燥厳禁。癸水での潤いが第一です。太陽（丙火）があれば光合成を助け、収穫が増えます。' },
      autumn: { primary: '丙', secondary: '癸', text: '秋の田畑は収穫期。冷え込む前に太陽（丙火）で温め、癸水で土の質を維持するのが理想です。' },
      winter: { primary: '丙', secondary: '甲', text: '冬の田畑は凍っています。太陽（丙火）で凍土を溶かすことが最優先。甲木があれば土の活力が戻ります。' }
    },
    '庚': {
      spring: { primary: '甲', secondary: '丁', text: '春の鋼はまだ硬さが足りません。丁火で鍛え、甲木を火の燃料にすることで、名刀へと生まれ変わります。' },
      summer: { primary: '壬', secondary: '癸', text: '夏の鋼は熱で溶けそうになります。壬水や癸水で冷やす（淬火）ことが、強靭な精神を作る鍵です。' },
      autumn: { primary: '丁', secondary: '甲', text: '秋の鋼は最も鋭い時。丁火で磨き、甲木でその形を整えることで、大きな成果を勝ち取れます。' },
      winter: { primary: '丁', secondary: '甲', text: '冬の鋼は凍てついて脆いです。丁火で温め、甲木で炎を絶やさないことが、折れない心を作ります。' }
    },
    '辛': {
      spring: { primary: '壬', secondary: '己', text: '春の宝石は汚れやすいです。壬水で洗い流し、己土で台座を整えることで、その真価が発揮されます。' },
      summer: { primary: '壬', secondary: '己', text: '夏の宝石は熱で曇ります。壬水の冷却と洗浄が必須です。己土があれば適度な影となり輝きを守ります。' },
      autumn: { primary: '壬', secondary: '甲', text: '秋の宝石は美しさが最高潮。壬水で磨き、甲木でその価値を広めることで、多くの人を魅了します。' },
      winter: { primary: '丙', secondary: '壬', text: '冬の宝石は冷え切っています。太陽（丙火）で光を当て、壬水で澄んだ輝きを保つのが理想的です。' }
    },
    '壬': {
      spring: { primary: '庚', secondary: '丙', text: '春の大河は源流が細くなりがち。庚金で水源を助け、太陽（丙火）で凍てつきを溶かして、悠々と流れるのが吉です。' },
      summer: { primary: '壬', secondary: '辛', text: '夏の大河は干上がりやすいため、仲間の水（壬水）や水源（辛金）を喜びます。勢いを保つことが成功への道です。' },
      autumn: { primary: '戊', secondary: '丁', text: '秋の大河は荒れ狂うことがあります。戊土の堤防で流れを整え、丁火で温かみを添えることで、豊かさをもたらします。' },
      winter: { primary: '戊', secondary: '丙', text: '冬の大河は凍結の恐れがあります。戊土で形を保ち、太陽（丙火）で水を流し続けることが、停滞を防ぐ鍵です。' }
    },
    '癸': {
      spring: { primary: '庚', secondary: '丙', text: '春の雨露は庚金で源を強め、太陽（丙火）で温まることで、万物を育む慈愛の雨となります。' },
      summer: { primary: '庚', secondary: '辛', text: '夏の雨露は蒸発しやすいため、水源（庚金・辛金）を極めて重視します。絶え間ない供給が知性を支えます。' },
      autumn: { primary: '辛', secondary: '丙', text: '秋の雨露は冷たく澄んでいます。辛金でその清らかさを保ち、太陽（丙火）で輝きを添えるのが吉です。' },
      winter: { primary: '丙', secondary: '戊', text: '冬の雨露は氷や雪になります。太陽（丙火）で温めて水に戻し、戊土でその力を受け止めることが安定に繋がります。' }
    }
  };

  const dayLogic = logic[dayStem];
  if (!dayLogic) return null;

  let seasonKey = 'spring';
  if (summer.includes(monthBranch)) seasonKey = 'summer';
  else if (autumn.includes(monthBranch)) seasonKey = 'autumn';
  else if (winter.includes(monthBranch)) seasonKey = 'winter';

  return dayLogic[seasonKey];
}

function calculateShichusuimei(input) {
  const location = normalizeInputLocation(input);
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
    strength: analyzeDayMasterStrength(dayStem.toString(), pillars.month.branch, countElements(pillars)),
    pattern: analyzePattern(dayStem.toString(), pillars.month.branch, [pillars.year.stem, pillars.month.stem, pillars.hour.stem]),
    yongShen: getYongShen(dayStem.toString(), pillars.month.branch),
    luckCycles: buildLuckCycles(input, solarTime, dayStem, effectiveParts, pillars),
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
