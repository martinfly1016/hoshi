import { calculateShichusuimei, LOCATIONS } from "./calculation-lab.js?v=user-tool-20260510-1";

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

let lastResult = null;

function element(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function currentClockTime() {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function setStatus(message) {
  element("status").textContent = message;
}

function readInput() {
  return {
    date: element("birth-date").value,
    timeKnown: element("time-known").checked,
    time: element("birth-time").value || "12:00",
    locationId: element("location").value,
    timeCalculationMode: element("time-mode").value,
    lateZiHourMode: element("late-zi-mode").value,
  };
}

function renderWarnings(warnings) {
  if (!warnings.length) {
    return `<span class="muted">无</span>`;
  }

  return warnings
    .map((warning) => `<span class="notice">${escapeHtml(WARNING_LABELS[warning] || warning)}</span>`)
    .join("");
}

function renderPillars(result) {
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
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        ${PILLAR_KEYS.map((key) => {
          const pillar = result.pillars[key];
          const confidence = pillar.source === "default_noon" ? "12:00 午时假设值" : "按输入计算";
          return `
            <tr>
              <td>${PILLAR_LABELS[key]}</td>
              <td><strong>${pillar.text}</strong></td>
              <td>${pillar.stem}</td>
              <td>${pillar.branch}</td>
              <td>${pillar.element.stem} / ${pillar.element.branch}</td>
              <td>${pillar.hiddenStems.join("、")}</td>
              <td>${result.tenGods[key]}</td>
              <td>${confidence}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

function formatTrueSolarMeta(meta) {
  if (meta.trueSolarTime !== "applied") {
    return "未应用";
  }

  const offset = meta.trueSolar.offsetMinutes;
  const sign = offset > 0 ? "+" : "";
  return `${sign}${offset.toFixed(1)} 分钟`;
}

function renderMeta(result) {
  const meta = result.calculationMeta;
  return `
    <table>
      <tbody>
        <tr><th>原始输入时间</th><td>${escapeHtml(meta.inputDateTime)}（${escapeHtml(meta.timezone)}）</td></tr>
        <tr><th>有效计算时间</th><td>${escapeHtml(meta.effectiveBirthDateTime)}</td></tr>
        <tr><th>出生地</th><td>${escapeHtml(meta.location.label)}</td></tr>
        <tr><th>时间模式</th><td>${meta.timeCalculationMode === "true_solar_time" ? "真太阳时" : "标准时间"}</td></tr>
        <tr><th>真太阳时偏移</th><td>${escapeHtml(formatTrueSolarMeta(meta))}</td></tr>
        <tr><th>子时规则</th><td>${meta.lateZiHourMode === "same_day" ? "晚子时不换日" : "23:00 子初换日"}</td></tr>
        <tr><th>提示</th><td>${renderWarnings(meta.warnings)}</td></tr>
      </tbody>
    </table>
  `;
}

function renderResult(result) {
  element("result").innerHTML = `
    <div class="result-summary">
      <p>四柱</p>
      <div class="pillar-line">${escapeHtml(result.pillarLine)}</div>
      <p>日主：${escapeHtml(result.dayMaster)}；计算库：${escapeHtml(result.engine)}</p>
    </div>

    <h2>命式</h2>
    ${renderPillars(result)}

    <h2>计算信息</h2>
    ${renderMeta(result)}
  `;
}

function renderError(error) {
  const message = error.message || "计算失败";
  element("result").innerHTML = `
    <div class="error">
      <strong>${escapeHtml(message)}</strong>
      <p>${escapeHtml(WARNING_LABELS[message] || "请检查日期、时间、出生地和计算模式。")}</p>
    </div>
  `;
}

function calculate() {
  try {
    const result = calculateShichusuimei(readInput());
    lastResult = result;
    renderResult(result);
    setStatus(`已计算 ${currentClockTime()}`);
  } catch (error) {
    lastResult = null;
    renderError(error);
    setStatus(`计算失败 ${currentClockTime()}`);
  }
}

async function copyJson() {
  if (!lastResult) {
    setStatus("没有可复制的结果");
    return;
  }

  const json = JSON.stringify(lastResult, null, 2);
  try {
    await navigator.clipboard.writeText(json);
    setStatus(`已复制 JSON ${currentClockTime()}`);
  } catch {
    setStatus("复制失败，请手动复制页面结果");
  }
}

function populateLocations() {
  element("location").innerHTML = LOCATIONS.map(
    (location) => `<option value="${location.id}">${escapeHtml(location.label)}</option>`,
  ).join("");
  element("location").value = "tokyo";
}

function bindEvents() {
  element("birth-form").addEventListener("submit", (event) => {
    event.preventDefault();
    calculate();
  });
  element("copy-json").addEventListener("click", copyJson);
  element("time-known").addEventListener("change", () => {
    element("birth-time").disabled = !element("time-known").checked;
    calculate();
  });
  ["birth-date", "birth-time", "location", "time-mode", "late-zi-mode"].forEach((id) => {
    element(id).addEventListener("change", calculate);
  });
}

function init() {
  populateLocations();
  bindEvents();
  calculate();
}

init();
