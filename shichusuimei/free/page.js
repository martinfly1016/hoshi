import { calculateShichusuimei, LOCATIONS } from "../../calculation-lab.js?v=free-20260511-6";

const READING_DELAY_MS = 980;
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

const ELEMENT_CLASS = {
  木: "wood",
  火: "fire",
  土: "earth",
  金: "metal",
  水: "water",
};

const ELEMENT_DESCRIPTIONS = {
  木: "成長、企画、広がり",
  火: "表現、熱量、直感",
  土: "安定、蓄積、調整",
  金: "判断、整理、完成度",
  水: "知性、流れ、適応",
};

const ROW_GUIDES = {
  干神: {
    icon: "神",
    hint: "日主から見た天干の働き",
  },
  天干: {
    icon: "天",
    hint: "表に出やすい性質",
  },
  地支: {
    icon: "地",
    hint: "季節や土台となる性質",
  },
  藏干: {
    icon: "藏",
    hint: "地支の内側にある要素",
  },
  支神: {
    icon: "支",
    hint: "藏干を通変星で見た働き",
  },
  纳音: {
    icon: "音",
    hint: "柱ごとの象意",
  },
  空亡: {
    icon: "空",
    hint: "作用が弱まりやすい支",
  },
  地势: {
    icon: "勢",
    hint: "日主から見た十二運",
  },
  自坐: {
    icon: "坐",
    hint: "各柱自身の十二運",
  },
  神煞: {
    icon: "煞",
    hint: "補助的な象意",
  },
};

const WARNING_LABELS = {
  BIRTH_TIME_DEFAULTED_TO_NOON: "出生時間が不明なため、時柱は 12:00（午時）として仮計算しています。",
  TRUE_SOLAR_TIME_APPLIED: "出生地の経度をもとに真太陽時へ換算しました。",
  TRUE_SOLAR_TIME_REQUIRES_BIRTHPLACE: "真太陽時で計算するには、都市レベルの出生地が必要です。",
  LATE_ZI_HOUR_MODE_USER_SELECTABLE: "23:00-23:59 は流派により日柱の扱いが分かれる時間帯です。",
};

const FORMAL_LOCATION_LABELS = {
  tokyo: "東京都 千代田区",
  osaka: "大阪府 大阪市",
  kyoto: "京都府 京都市",
};

const FORMAL_LOCATIONS = LOCATIONS.filter(
  (location) => location.timezone === "Asia/Tokyo" && location.latitude != null && location.longitude != null,
);

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
let lastResultInputSignature = "";
let activeRunId = 0;

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

function delay(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
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

function inputSignature(input = readInput()) {
  return JSON.stringify(input);
}

function displayLocationLabel(location) {
  return (FORMAL_LOCATION_LABELS[location.id] || location.label).replace(/^日本\s*\/\s*/, "");
}

function setBusy(isBusy) {
  element("calculate-submit").disabled = isBusy;
  element("copy-json").disabled = isBusy;
  element("birth-form").setAttribute("aria-busy", isBusy ? "true" : "false");
}

function setResultClass(className = "") {
  element("result").className = ["results", className].filter(Boolean).join(" ");
}

function revealResult() {
  setResultClass("is-entering");
  window.setTimeout(() => setResultClass(), 700);
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

function elementClass(elementName) {
  return ELEMENT_CLASS[elementName] || "neutral";
}

function formatDateTimeLabel(value) {
  const [date = "", time = ""] = String(value).split(" ");
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return escapeHtml(value);
  return `${year}年${month}月${day}日 ${time}`;
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

function renderInitialState() {
  setResultClass();
  element("result").innerHTML = `
    <section class="empty-state">
      <p class="eyebrow">READY</p>
      <h2>命式を作成できます</h2>
      <p>入力内容を整えたあと、鑑定の流れに入ります。</p>
    </section>
  `;
}

function renderCasting() {
  setResultClass();
  element("result").innerHTML = `
    <section class="casting" role="status" aria-live="polite">
      <div>
        <div class="casting-mark" aria-hidden="true">
          <span class="casting-orbit"></span>
        </div>
        <p class="eyebrow">READING THE CHART</p>
        <h2>命式を整えています</h2>
        <p>暦、節気、出生時刻を合わせています。</p>
      </div>
    </section>
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

function renderHiddenStemCell(pillar) {
  const details = pillar.hiddenStemDetails || pillar.hiddenStems.map((stem) => ({ stem, element: null }));
  return details.map((detail) => `
    <span class="mini-line ${elementClass(detail.element)}">${escapeHtml(detail.stem)}${detail.element ? `·${escapeHtml(detail.element)}` : ""}</span>
  `).join("");
}

function renderHiddenGodCell(pillar) {
  const details = pillar.hiddenStemDetails || [];
  if (!details.length) return `<span class="muted">—</span>`;
  return details.map((detail) => `
    <span class="mini-line ${elementClass(detail.element)}">${escapeHtml(detail.tenGod)}</span>
  `).join("");
}

function renderRowLabel(label) {
  const guide = ROW_GUIDES[label] || { icon: label.slice(0, 1), hint: "" };
  return `
    <div class="bazi-label-content">
      <span class="bazi-icon">${escapeHtml(guide.icon)}</span>
      <span>
        <strong>${escapeHtml(label)}</strong>
        <small>${escapeHtml(guide.hint)}</small>
      </span>
    </div>
  `;
}

function renderTraditionalRow(result, label, className, renderer) {
  return `
    <div class="bazi-row ${className || ""}">
      <div class="bazi-label">${renderRowLabel(label)}</div>
      ${PILLAR_KEYS.map((key) => `<div class="bazi-cell ${key === "day" ? "is-day" : ""}">${renderer(result.pillars[key], key)}</div>`).join("")}
    </div>
  `;
}

function renderElementLegend() {
  return `
    <div class="element-legend" aria-label="五行の色分け">
      ${ELEMENT_LABELS.map((name) => `
        <div class="element-chip">
          <span class="element-mark ${elementClass(name)}">${name}</span>
          <span>${escapeHtml(ELEMENT_DESCRIPTIONS[name])}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderChartGuide(result) {
  const dayStem = result.pillars.day.stem;
  const dayElement = result.pillars.day.element.stem;
  return `
    <div class="chart-guide">
      <article>
        <span class="guide-icon">日</span>
        <h3>まず日主を見る</h3>
        <p>この命式の中心は日柱の天干「<strong class="${elementClass(dayElement)}">${escapeHtml(dayStem)}</strong>」。性質を読む起点になります。</p>
      </article>
      <article>
        <span class="guide-icon">神</span>
        <h3>干神・支神を見る</h3>
        <p>日主から見た関係性です。行動の出方、得意な役割、意識しやすいテーマを読みます。</p>
      </article>
      <article>
        <span class="guide-icon">藏</span>
        <h3>藏干を見る</h3>
        <p>地支の内側にある要素です。表には出にくい本音、環境、潜在的な資質として扱います。</p>
      </article>
      <article>
        <span class="guide-icon">五</span>
        <h3>五行の偏りを見る</h3>
        <p>木・火・土・金・水の強弱で、使いやすい力と補いたい力を大まかに把握します。</p>
      </article>
    </div>
  `;
}

function renderTraditionalChart(result) {
  const meta = result.calculationMeta;
  const timeLabel = meta.trueSolarTime === "applied" ? "真太陽時" : "計算時刻";
  const timeText = formatDateTimeLabel(meta.effectiveBirthDateTime);
  const solarNote = meta.trueSolarTime === "applied"
    ? `出生地の経度補正 ${meta.trueSolar.offsetMinutes > 0 ? "+" : ""}${meta.trueSolar.offsetMinutes.toFixed(1)}分`
    : "標準時で計算";

  return `
    <div class="bazi-meta">
      <div><span>${timeLabel}</span>：${escapeHtml(timeText)}</div>
      <div><span>節気基準</span>：月柱は二十四節気を基準に算出 · ${escapeHtml(solarNote)}</div>
    </div>

    ${renderElementLegend()}

    <div class="bazi-board">
      <div class="bazi-row bazi-head">
        <div class="bazi-label"><span class="bazi-head-label">項目</span></div>
        ${PILLAR_KEYS.map((key) => `<div class="bazi-cell">${PILLAR_LABELS[key]}</div>`).join("")}
      </div>
      ${renderTraditionalRow(result, "干神", "bazi-god", (_pillar, key) => escapeHtml(result.tenGods[key]))}
      ${renderTraditionalRow(result, "天干", "bazi-stem", (pillar) => `<span class="${elementClass(pillar.element.stem)}">${escapeHtml(pillar.stem)}</span>`)}
      ${renderTraditionalRow(result, "地支", "bazi-branch", (pillar) => `<span class="${elementClass(pillar.element.branch)}">${escapeHtml(pillar.branch)}</span>`)}
      ${renderTraditionalRow(result, "藏干", "bazi-detail", (pillar) => renderHiddenStemCell(pillar))}
      ${renderTraditionalRow(result, "支神", "bazi-detail", (pillar) => renderHiddenGodCell(pillar))}
      ${renderTraditionalRow(result, "纳音", "bazi-flat", (pillar) => `<span class="${elementClass((pillar.naYin || "").slice(-1))}">${escapeHtml(pillar.naYin || "—")}</span>`)}
      ${renderTraditionalRow(result, "空亡", "bazi-flat", (pillar) => escapeHtml((pillar.voidBranches || []).join("") || "—"))}
      ${renderTraditionalRow(result, "地势", "bazi-flat", (pillar) => escapeHtml(pillar.terrainByDay || "—"))}
      ${renderTraditionalRow(result, "自坐", "bazi-flat", (pillar) => escapeHtml(pillar.terrainSelf || "—"))}
      ${renderTraditionalRow(result, "神煞", "bazi-shensha", () => `<span class="muted">—</span>`)}
    </div>

    ${renderChartGuide(result)}
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
          <tr><th>出生地</th><td>${escapeHtml(displayLocationLabel(meta.location))}</td></tr>
          <tr><th>時間補正</th><td>${escapeHtml(trueSolar)}</td></tr>
          <tr><th>23:00 子時</th><td>${meta.lateZiHourMode === "same_day" ? "晚子時として当日扱い" : "23:00 で翌日扱い"}</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderResult(result) {
  element("result").innerHTML = `
    <section class="section">
      <div class="section-title">
        <h2>命式</h2>
        <span class="eyebrow">貳 / CHART</span>
      </div>
      ${renderTraditionalChart(result)}
    </section>

    <section class="section">
      <div class="section-title">
        <h2>五行</h2>
        <span class="eyebrow">參 / ELEMENTS</span>
      </div>
      <div class="summary-side compact">
        ${renderElementBars(result)}
        <p class="summary-text">${escapeHtml(elementSummary(result))}</p>
      </div>
    </section>

    <section class="section">
      <div class="section-title">
        <h2>計算情報</h2>
        <span class="eyebrow">肆 / META</span>
      </div>
      ${renderMeta(result)}
    </section>

    <section class="section">
      <div class="section-title">
        <h2>注意事項</h2>
        <span class="eyebrow">伍 / NOTES</span>
      </div>
      ${renderWarnings(result)}
    </section>
  `;
  revealResult();
}

function renderError(error) {
  const message = error.message || "計算に失敗しました";
  setResultClass();
  element("result").innerHTML = `
    <section class="section">
      <div class="error">
        <strong>${escapeHtml(message)}</strong>
        <p>${escapeHtml(WARNING_LABELS[message] || "入力内容を確認してください。")}</p>
      </div>
    </section>
  `;
  revealResult();
}

async function calculate() {
  const runId = activeRunId + 1;
  activeRunId = runId;
  const input = readInput();
  setBusy(true);
  renderCasting();
  setStatus("作成中");

  await delay(READING_DELAY_MS);
  if (runId !== activeRunId) {
    return;
  }

  try {
    const result = calculateShichusuimei(input);
    lastResult = result;
    lastResultInputSignature = inputSignature(input);
    renderResult(result);
    setStatus(`作成済 ${currentClockTime()}`);
  } catch (error) {
    lastResult = null;
    lastResultInputSignature = "";
    renderError(error);
    setStatus(`失敗 ${currentClockTime()}`);
  } finally {
    if (runId === activeRunId) {
      setBusy(false);
    }
  }
}

async function copyJson() {
  if (!lastResult || lastResultInputSignature !== inputSignature()) {
    setStatus("コピーできる最新結果がありません");
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
  element("location").innerHTML = FORMAL_LOCATIONS.map(
    (location) => `<option value="${location.id}">${escapeHtml(displayLocationLabel(location))}</option>`,
  ).join("");
  element("location").value = "tokyo";
}

function syncBirthTimeField() {
  const timeKnown = element("time-known").checked;
  const birthTime = element("birth-time");
  birthTime.disabled = !timeKnown;
  birthTime.setAttribute("aria-disabled", timeKnown ? "false" : "true");
  birthTime.closest(".field").classList.toggle("is-time-abandoned", !timeKnown);
}

function markInputChanged() {
  syncBirthTimeField();
  if (!lastResult) {
    setStatus("未作成");
    return;
  }

  if (lastResultInputSignature !== inputSignature()) {
    element("result").classList.add("result-stale");
    setStatus("条件が変更されました");
  }
}

function bindEvents() {
  element("birth-form").addEventListener("submit", (event) => {
    event.preventDefault();
    calculate();
  });
  element("copy-json").addEventListener("click", copyJson);
  element("time-known").addEventListener("change", markInputChanged);
  ["birth-date", "birth-time", "location", "time-mode", "late-zi-mode"].forEach((id) => {
    element(id).addEventListener("change", markInputChanged);
  });
}

function init() {
  populateLocations();
  syncBirthTimeField();
  bindEvents();
  renderInitialState();
  setStatus("未作成");
}

init();
