import { calculateShichusuimei, LOCATIONS } from "../../calculation-lab.js?v=free-20260511-1";

const PILLAR_KEYS = ["year", "month", "day", "hour"];
const PILLAR_LABELS = {
  year: "年柱",
  month: "月柱",
  day: "日柱",
  hour: "時柱",
};

const ELEMENT_LABELS = ["木", "火", "土", "金", "水"];
const ELEMENT_JA = {
  木: "木",
  火: "火",
  土: "土",
  金: "金",
  水: "水",
};

const WARNING_LABELS = {
  BIRTH_TIME_DEFAULTED_TO_NOON: "出生時間が不明なため、時柱は 12:00（午時）として仮計算しています。",
  TRUE_SOLAR_TIME_APPLIED: "出生地の経度をもとに真太陽時へ換算しました。",
  TRUE_SOLAR_TIME_REQUIRES_BIRTHPLACE: "真太陽時で計算するには、都市レベルの出生地が必要です。",
  LATE_ZI_HOUR_MODE_USER_SELECTABLE: "23:00-23:59 は流派により日柱の扱いが分かれる時間帯です。",
};

const STEM_PROFILES = {
  甲: {
    title: "まっすぐ伸びる大樹のような日主",
    text: "理想を掲げ、時間をかけて形にしていく力があります。焦らず根を張るほど、周囲からの信頼が育ちます。",
    tags: ["成長志向", "誠実", "長期戦に強い"],
  },
  乙: {
    title: "しなやかに場を読む草花のような日主",
    text: "柔らかな感受性と調整力があり、人との関係の中で才能が開きやすい命式です。",
    tags: ["柔軟", "協調", "美意識"],
  },
  丙: {
    title: "太陽のように場を照らす日主",
    text: "明るさと表現力で人を惹きつけます。隠すより見せることで運が動きやすいタイプです。",
    tags: ["表現力", "率直", "求心力"],
  },
  丁: {
    title: "灯火のように心を照らす日主",
    text: "細やかな洞察と集中力があります。小さな違和感を拾い、丁寧に磨くほど強みになります。",
    tags: ["洞察", "集中", "繊細"],
  },
  戊: {
    title: "山のように安定をつくる日主",
    text: "物事を受け止め、場の土台を整える力があります。信頼を積むほど大きな役割を任されます。",
    tags: ["安定", "包容", "責任感"],
  },
  己: {
    title: "田畑のように育てる日主",
    text: "現実感覚と育成力があります。人や環境を整えながら成果へつなげることが得意です。",
    tags: ["育成", "実務", "調整役"],
  },
  庚: {
    title: "鋼のように道を切り開く日主",
    text: "決断力と突破力があります。曖昧な状況を整理し、必要な一手を打つことで力を発揮します。",
    tags: ["決断", "突破", "実行"],
  },
  辛: {
    title: "宝石のように磨かれて光る日主",
    text: "繊細な美意識と基準の高さがあります。細部を磨き、質を高めるほど存在感が増します。",
    tags: ["美意識", "精密", "洗練"],
  },
  壬: {
    title: "大河のように広がる日主",
    text: "視野が広く、変化に乗る力があります。固定されすぎない環境で発想が広がります。",
    tags: ["自由", "構想", "移動"],
  },
  癸: {
    title: "雨露のように静かに満たす日主",
    text: "観察力と知性があり、静かに情報を集めて本質へ近づくタイプです。",
    tags: ["観察", "知性", "内省"],
  },
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

function strongestElements(counts) {
  const entries = Object.entries(counts);
  const max = Math.max(...entries.map(([, value]) => value));
  return entries.filter(([, value]) => value === max).map(([name]) => name);
}

function weakestElements(counts) {
  const entries = Object.entries(counts);
  const min = Math.min(...entries.map(([, value]) => value));
  return entries.filter(([, value]) => value === min).map(([name]) => name);
}

function buildTags(result) {
  const profile = STEM_PROFILES[result.dayMaster] || { tags: [] };
  const strong = strongestElements(result.fiveElements.counts).map((name) => `${ELEMENT_JA[name]}が強め`);
  const gods = [result.tenGods.month, result.tenGods.hour]
    .filter(Boolean)
    .filter((value) => value !== "日主")
    .map((value) => `${value}の働き`);
  return [...profile.tags, ...strong, ...gods].slice(0, 6);
}

function elementSummary(result) {
  const strong = strongestElements(result.fiveElements.counts).join("・");
  const weak = weakestElements(result.fiveElements.counts).join("・");
  return `五行では ${strong} が目立ち、${weak} は控えめです。強い要素は自然に使いやすい資質、控えめな要素は意識して補うと安定しやすい領域として見ます。`;
}

function renderElementBars(result) {
  const counts = result.fiveElements.counts;
  const max = Math.max(1, ...Object.values(counts));
  return `
    <div class="element-bars">
      ${ELEMENT_LABELS.map((name) => {
        const value = counts[name] || 0;
        const width = Math.max(6, Math.round((value / max) * 100));
        return `
          <div class="element-row">
            <span>${name}</span>
            <div class="bar"><span style="width:${width}%"></span></div>
            <strong>${value}</strong>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderTags(tags) {
  return `<div class="tags">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>`;
}

function renderWarnings(result) {
  const warnings = result.calculationMeta.warnings;
  if (!warnings.length) {
    return `<p class="notice">特別な注意事項はありません。</p>`;
  }

  return `
    <div class="notice-list">
      ${warnings.map((warning) => `<div class="notice">${escapeHtml(WARNING_LABELS[warning] || warning)}</div>`).join("")}
    </div>
  `;
}

function renderPillarCards(result) {
  return `
    <div class="pillar-grid">
      ${PILLAR_KEYS.map((key) => {
        const pillar = result.pillars[key];
        const confidence = pillar.source === "default_noon" ? "仮計算" : "確定";
        return `
          <article class="pillar">
            <div class="pillar-name">
              <span>${PILLAR_LABELS[key]}</span>
              <span>${confidence}</span>
            </div>
            <div class="pillar-chars">${escapeHtml(pillar.text)}</div>
            <div class="pillar-meta">
              <div>天干 ${pillar.stem} / 地支 ${pillar.branch}</div>
              <div>通変星 ${escapeHtml(result.tenGods[key])}</div>
              <div>藏干 ${pillar.hiddenStems.map(escapeHtml).join("・")}</div>
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderMeishikiTable(result) {
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>柱</th>
            <th>四柱</th>
            <th>天干</th>
            <th>地支</th>
            <th>五行</th>
            <th>通変星</th>
            <th>藏干</th>
            <th>説明</th>
          </tr>
        </thead>
        <tbody>
          ${PILLAR_KEYS.map((key) => {
            const pillar = result.pillars[key];
            const note = pillar.source === "default_noon" ? "出生時間不明のため時柱は参考表示です。" : "入力情報から計算しています。";
            return `
              <tr>
                <td>${PILLAR_LABELS[key]}</td>
                <td><strong>${escapeHtml(pillar.text)}</strong></td>
                <td>${pillar.stem}</td>
                <td>${pillar.branch}</td>
                <td>${pillar.element.stem} / ${pillar.element.branch}</td>
                <td>${escapeHtml(result.tenGods[key])}</td>
                <td>${pillar.hiddenStems.map(escapeHtml).join("、")}</td>
                <td>${note}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderMeta(result) {
  const meta = result.calculationMeta;
  const trueSolar = meta.trueSolarTime === "applied"
    ? `${meta.trueSolar.offsetMinutes > 0 ? "+" : ""}${meta.trueSolar.offsetMinutes.toFixed(1)} 分`
    : "未使用";
  return `
    <div class="table-wrap">
      <table>
        <tbody>
          <tr><th>入力時間</th><td>${escapeHtml(meta.inputDateTime)}（${escapeHtml(meta.timezone)}）</td></tr>
          <tr><th>有効計算時間</th><td>${escapeHtml(meta.effectiveBirthDateTime)}</td></tr>
          <tr><th>出生地</th><td>${escapeHtml(meta.location.label)}</td></tr>
          <tr><th>時間補正</th><td>${escapeHtml(trueSolar)}</td></tr>
          <tr><th>23:00 子時</th><td>${meta.lateZiHourMode === "same_day" ? "晚子時として当日扱い" : "23:00 で翌日扱い"}</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderResult(result) {
  const profile = STEM_PROFILES[result.dayMaster] || {
    title: "日主の特徴",
    text: "命式の中心となる日主から、基本的な性質を読み解きます。",
    tags: [],
  };
  const tags = buildTags(result);

  element("result").innerHTML = `
    <section class="section">
      <div class="section-title">
        <h2>命式の概要</h2>
        <span class="eyebrow">貳 / RESULT</span>
      </div>
      <div class="summary">
        <div class="summary-main">
          <p class="eyebrow">FOUR PILLARS</p>
          <div class="pillar-line">${escapeHtml(result.pillarLine)}</div>
          <p class="summary-text">${escapeHtml(profile.title)}。${escapeHtml(profile.text)}</p>
          ${renderTags(tags)}
        </div>
        <aside class="summary-side">
          <p class="eyebrow">FIVE ELEMENTS</p>
          ${renderElementBars(result)}
          <p class="summary-text">${escapeHtml(elementSummary(result))}</p>
        </aside>
      </div>
    </section>

    <section class="section">
      <div class="section-title">
        <h2>命式</h2>
        <span class="eyebrow">參 / CHART</span>
      </div>
      ${renderPillarCards(result)}
    </section>

    <section class="section">
      <div class="section-title">
        <h2>専門表</h2>
        <span class="eyebrow">肆 / DETAILS</span>
      </div>
      ${renderMeishikiTable(result)}
    </section>

    <section class="section">
      <div class="section-title">
        <h2>計算情報</h2>
        <span class="eyebrow">伍 / META</span>
      </div>
      ${renderMeta(result)}
    </section>

    <section class="section">
      <div class="section-title">
        <h2>注意事項</h2>
        <span class="eyebrow">陸 / NOTES</span>
      </div>
      ${renderWarnings(result)}
    </section>

    <section class="section">
      <div class="section-title">
        <h2>次に見る</h2>
        <span class="eyebrow">漆 / NEXT</span>
      </div>
      <div class="next-links">
        <a class="next-link" href="#" aria-disabled="true">相性を見る<span>ふたりの命式から関係性を見る機能を準備中です。</span></a>
        <a class="next-link" href="#" aria-disabled="true">大運を見る<span>10年周期の流れを読む機能を準備中です。</span></a>
        <a class="next-link" href="#" aria-disabled="true">もっと深く読む<span>AI 解読と質問機能を準備中です。</span></a>
      </div>
    </section>
  `;
}

function renderError(error) {
  const message = error.message || "計算に失敗しました";
  element("result").innerHTML = `
    <section class="section">
      <div class="error">
        <strong>${escapeHtml(message)}</strong>
        <p>${escapeHtml(WARNING_LABELS[message] || "入力内容を確認してください。")}</p>
      </div>
    </section>
  `;
}

function calculate() {
  try {
    const result = calculateShichusuimei(readInput());
    lastResult = result;
    renderResult(result);
    setStatus(`作成済 ${currentClockTime()}`);
  } catch (error) {
    lastResult = null;
    renderError(error);
    setStatus(`失敗 ${currentClockTime()}`);
  }
}

async function copyJson() {
  if (!lastResult) {
    setStatus("コピーできる結果がありません");
    return;
  }
  try {
    await navigator.clipboard.writeText(JSON.stringify(lastResult, null, 2));
    setStatus(`JSON をコピーしました ${currentClockTime()}`);
  } catch {
    setStatus("コピーに失敗しました");
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
