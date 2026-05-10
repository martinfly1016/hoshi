import {
  DefaultEightCharProvider,
  LunarHour,
  LunarSect2EightCharProvider,
  SolarTime,
} from "./vendor/tyme4ts/index.mjs?v=lab-20260510-2";

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
    id: "tokyo",
    label: "日本 / 东京都 千代田区",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 35.6812,
    longitude: 139.7671,
  },
  {
    id: "osaka",
    label: "日本 / 大阪市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 34.6937,
    longitude: 135.5023,
  },
  {
    id: "kyoto",
    label: "日本 / 京都市",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: 35.0116,
    longitude: 135.7681,
  },
  {
    id: "jp-prefecture-only",
    label: "日本 / 仅都道府县级（无城市经纬度）",
    timezone: "Asia/Tokyo",
    utcOffset: 9,
    latitude: null,
    longitude: null,
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

function normalizePillar(pillar, source = "user_input", confidence = "confirmed") {
  const text = pillar.toString();
  const stem = text.slice(0, 1);
  const branch = text.slice(1, 2);
  return {
    text,
    stem,
    branch,
    element: {
      stem: STEM_ELEMENTS[stem],
      branch: BRANCH_ELEMENTS[branch],
    },
    hiddenStems: pillar.getEarthBranch().getHideHeavenStems().map((stemItem) => stemItem.toString()),
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
  const hourSource = input.timeKnown ? "user_input" : "default_noon";
  const hourConfidence = input.timeKnown ? "confirmed" : "low";
  const pillarsWithRaw = {
    year: { raw: rawPillars.year.raw, ...normalizePillar(rawPillars.year.raw) },
    month: { raw: rawPillars.month.raw, ...normalizePillar(rawPillars.month.raw) },
    day: { raw: rawPillars.day.raw, ...normalizePillar(rawPillars.day.raw) },
    hour: { raw: rawPillars.hour.raw, ...normalizePillar(rawPillars.hour.raw, hourSource, hourConfidence) },
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
  const rows = FIXTURES.map((fixture) => {
    const run = runFixture(fixture);
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

if (typeof document !== "undefined") {
  init();
}

export { calculateShichusuimei, FIXTURES, LOCATIONS };
