import { calculateShichusuimei, LOCATIONS } from "./calculation-lab.js?v=20260602-qa-label-cleanup-1";

const PILLAR_KEYS = ["year", "month", "day", "hour"];
const PILLAR_LABELS = {
  year: "年柱",
  month: "月柱",
  day: "日柱",
  hour: "時柱",
};

const WARNING_LABELS = {
  BIRTH_TIME_DEFAULTED_TO_NOON: "出生時間が不明のため、時柱は 12:00 午時として仮計算しています。",
  TRUE_SOLAR_TIME_APPLIED: "出生地の経緯度にもとづき真太陽時へ換算しました。",
  TRUE_SOLAR_TIME_REQUIRES_BIRTHPLACE: "真太陽時モードには市区町村レベルの出生地経緯度が必要です。",
  LATE_ZI_HOUR_MODE_USER_SELECTABLE: "23:00-23:59 は夜子時／子初換日で流派差があります。",
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
    return `<span class="muted">なし</span>`;
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
          <th>蔵干</th>
          <th>通変星</th>
          <th>説明</th>
        </tr>
      </thead>
      <tbody>
        ${PILLAR_KEYS.map((key) => {
          const pillar = result.pillars[key];
          const confidence = pillar.source === "default_noon" ? "12:00 午時の仮計算" : "入力にもとづく計算";
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
    return "未適用";
  }

  const offset = meta.trueSolar.offsetMinutes;
  const sign = offset > 0 ? "+" : "";
  return `${sign}${offset.toFixed(1)} 分`;
}

function renderMeta(result) {
  const meta = result.calculationMeta;
  return `
    <table>
      <tbody>
        <tr><th>入力時刻</th><td>${escapeHtml(meta.inputDateTime)}（${escapeHtml(meta.timezone)}）</td></tr>
        <tr><th>有効計算時刻</th><td>${escapeHtml(meta.effectiveBirthDateTime)}</td></tr>
        <tr><th>出生地</th><td>${escapeHtml(meta.location.label)}</td></tr>
        <tr><th>時間モード</th><td>${meta.timeCalculationMode === "true_solar_time" ? "真太陽時" : "標準時間"}</td></tr>
        <tr><th>真太陽時の補正</th><td>${escapeHtml(formatTrueSolarMeta(meta))}</td></tr>
        <tr><th>子時ルール</th><td>${meta.lateZiHourMode === "same_day" ? "夜子時は当日扱い" : "23:00 子初で翌日扱い"}</td></tr>
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
      <p>日主：${escapeHtml(result.dayMaster)}；計算ライブラリ：${escapeHtml(result.engine)}</p>
    </div>

    <h2>命式</h2>
    ${renderPillars(result)}

    <h2>計算情報</h2>
    ${renderMeta(result)}
  `;
}

function renderError(error) {
  const message = error.message || "計算に失敗しました";
  element("result").innerHTML = `
    <div class="error">
      <strong>${escapeHtml(message)}</strong>
      <p>${escapeHtml(WARNING_LABELS[message] || "日付、時刻、出生地、計算モードを確認してください。")}</p>
    </div>
  `;
}

function calculate() {
  try {
    const result = calculateShichusuimei(readInput());
    lastResult = result;
    renderResult(result);
    setStatus(`計算済み ${currentClockTime()}`);
  } catch (error) {
    lastResult = null;
    renderError(error);
    setStatus(`計算失敗 ${currentClockTime()}`);
  }
}

async function copyJson() {
  if (!lastResult) {
    setStatus("コピーできる結果がありません");
    return;
  }

  const json = JSON.stringify(lastResult, null, 2);
  try {
    await navigator.clipboard.writeText(json);
    setStatus(`JSON をコピーしました ${currentClockTime()}`);
  } catch {
    setStatus("コピーに失敗しました。ページ上の結果を手動でコピーしてください");
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
