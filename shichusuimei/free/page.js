import { calculateShichusuimei } from "../../calculation-lab.js?v=free-20260511-7";
import { JAPAN_MUNICIPALITIES } from "../../japan-municipalities.js?v=free-20260511-7";

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

const PREFECTURE_ORDER = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];
const DEFAULT_PREFECTURE = "東京都";
const DEFAULT_MUNICIPALITY_ID = "jp-131016";
const MUNICIPALITIES_BY_ID = new Map(JAPAN_MUNICIPALITIES.map((location) => [location.id, location]));
const MUNICIPALITIES_BY_PREFECTURE = JAPAN_MUNICIPALITIES.reduce((groups, location) => {
  if (!groups.has(location.prefecture)) {
    groups.set(location.prefecture, []);
  }
  groups.get(location.prefecture).push(location);
  return groups;
}, new Map());

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

const STEM_ORDER = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const TEN_GOD_ORDER = ["比肩", "劫财", "食神", "伤官", "偏财", "正财", "七杀", "正官", "偏印", "正印", "日主"];
const TEN_GOD_PROFILES = {
  日主: {
    icon: "日",
    tags: ["本人軸", "本質", "基準"],
    text: "日主は日柱の天干そのものです。命主本人の性質を見る起点として扱います。",
  },
  比肩: {
    icon: "比",
    tags: ["自立", "対等", "芯の強さ"],
    text: "自分の判断で立ち、同じ立場の相手と並走しやすい星です。",
  },
  劫财: {
    icon: "劫",
    tags: ["競争", "突破", "巻き込み"],
    text: "競争心と突破力が前に出やすく、人や状況を動かしながら進む星です。",
  },
  食神: {
    icon: "食",
    tags: ["表現", "余裕", "育成"],
    text: "自然体の表現、楽しさ、育てる力として出やすい星です。",
  },
  伤官: {
    icon: "傷",
    tags: ["批評", "才気", "鋭さ"],
    text: "感覚が鋭く、型を破って言語化したり改善したりする星です。",
  },
  偏财: {
    icon: "偏",
    tags: ["機動力", "対人", "現場感"],
    text: "人や機会に素早く反応し、流れをつかみにいく星です。",
  },
  正财: {
    icon: "財",
    tags: ["実務", "管理", "積み上げ"],
    text: "現実感覚が強く、着実に管理しながら成果へつなぐ星です。",
  },
  七杀: {
    icon: "殺",
    tags: ["緊張感", "決断", "負荷対応"],
    text: "プレッシャーの中で判断し、厳しい局面を切り抜ける力として出ます。",
  },
  正官: {
    icon: "官",
    tags: ["規律", "責任", "信頼"],
    text: "秩序や役割意識を重んじ、きちんと形にしていく星です。",
  },
  偏印: {
    icon: "印",
    tags: ["直感", "独自視点", "再編集"],
    text: "独自の見方やひらめきで情報を再解釈しやすい星です。",
  },
  正印: {
    icon: "正",
    tags: ["学習", "保護", "吸収"],
    text: "知識や型を吸収し、守られながら安定して伸びやすい星です。",
  },
};
const STRUCTURE_GUIDES = {
  干神: {
    icon: "干",
    title: "干神",
    text: "四柱の天干に現れる十神です。表に出やすい役割や行動の出方を見ます。",
  },
  支神: {
    icon: "支",
    title: "支神",
    text: "地支の中にある藏干を十神に置き換えたものです。内側で動くテーマを見ます。",
  },
  藏干: {
    icon: "藏",
    title: "藏干",
    text: "地支の内側に潜む要素です。潜在的な資質や土台の流れを見ます。",
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

function municipalitiesForPrefecture(prefecture) {
  return MUNICIPALITIES_BY_PREFECTURE.get(prefecture) || [];
}

function selectedMunicipality() {
  return MUNICIPALITIES_BY_ID.get(element("municipality").value)
    || MUNICIPALITIES_BY_ID.get(DEFAULT_MUNICIPALITY_ID)
    || JAPAN_MUNICIPALITIES[0];
}

function locationOverrideFromMunicipality(location) {
  return {
    id: location.id,
    label: location.label,
    timezone: location.timezone,
    utcOffset: location.utcOffset,
    latitude: location.latitude,
    longitude: location.longitude,
  };
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
  const location = selectedMunicipality();
  return {
    date: element("birth-date").value,
    timeKnown: element("time-known").checked,
    time: element("birth-time").value || "12:00",
    locationId: location.id,
    locationOverride: locationOverrideFromMunicipality(location),
    timeCalculationMode: element("time-mode").value,
    lateZiHourMode: element("late-zi-mode").value,
  };
}

function inputSignature(input = readInput()) {
  return JSON.stringify(input);
}

function displayLocationLabel(location) {
  return (location?.label || "").replace(/^日本\s*\/\s*/, "");
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
  const missing = ELEMENT_LABELS.filter((name) => (result.fiveElements.counts[name] || 0) === 0);
  if (missing.length) {
    return `五行全体では ${strong} が強く、${missing.join("・")} は見えにくい配置です。これは命主を取り巻く環境で、自然に流れやすい力と意識して補いたい力の差として見ます。`;
  }
  return `五行全体では ${strong} が目立ち、${weak} は控えめです。これは命主を取り巻く環境や、自然に使いやすい力と補うと安定しやすい力の差として見ます。`;
}

function elementClass(elementName) {
  return ELEMENT_CLASS[elementName] || "neutral";
}

function orderIndex(order, value) {
  const index = order.indexOf(value);
  return index === -1 ? order.length : index;
}

function dayMasterLabel(result) {
  const dayStem = result.pillars.day.stem;
  const dayElement = result.pillars.day.element.stem;
  return `${dayStem}${dayElement}`;
}

function collectHeavenlyGodEntries(result) {
  return PILLAR_KEYS.map((key) => ({
    pillar: key,
    pillarLabel: PILLAR_LABELS[key],
    name: result.tenGods[key],
  }));
}

function collectHiddenStemEntries(result) {
  return PILLAR_KEYS.flatMap((key) => (
    (result.pillars[key].hiddenStemDetails || []).map((detail) => ({
      pillar: key,
      pillarLabel: PILLAR_LABELS[key],
      stem: detail.stem,
      element: detail.element,
      tenGod: detail.tenGod,
      type: detail.type,
    }))
  ));
}

function aggregateTenGodThemes(result) {
  const counts = new Map();
  const touch = (name, source) => {
    if (!name) return;
    if (!counts.has(name)) {
      counts.set(name, { name, total: 0, heavenly: 0, hidden: 0 });
    }
    const current = counts.get(name);
    current.total += 1;
    current[source] += 1;
  };

  collectHeavenlyGodEntries(result).forEach((entry) => touch(entry.name, "heavenly"));
  collectHiddenStemEntries(result).forEach((entry) => touch(entry.tenGod, "hidden"));

  return Array.from(counts.values()).sort(
    (left, right) => right.total - left.total || orderIndex(TEN_GOD_ORDER, left.name) - orderIndex(TEN_GOD_ORDER, right.name),
  );
}

function aggregateHiddenGodCounts(result) {
  const counts = new Map();
  collectHiddenStemEntries(result).forEach((entry) => {
    if (!counts.has(entry.tenGod)) {
      counts.set(entry.tenGod, { name: entry.tenGod, total: 0 });
    }
    counts.get(entry.tenGod).total += 1;
  });
  return Array.from(counts.values()).sort(
    (left, right) => right.total - left.total || orderIndex(TEN_GOD_ORDER, left.name) - orderIndex(TEN_GOD_ORDER, right.name),
  );
}

function aggregateHiddenStemCounts(result) {
  const counts = new Map();
  collectHiddenStemEntries(result).forEach((entry) => {
    if (!counts.has(entry.stem)) {
      counts.set(entry.stem, { stem: entry.stem, element: entry.element, total: 0 });
    }
    counts.get(entry.stem).total += 1;
  });
  return Array.from(counts.values()).sort(
    (left, right) => right.total - left.total || orderIndex(STEM_ORDER, left.stem) - orderIndex(STEM_ORDER, right.stem),
  );
}

function topHighlights(items, formatter, limit = 3) {
  return items.slice(0, limit).map(formatter).join("、");
}

function tenGodKeywords(name) {
  const profile = TEN_GOD_PROFILES[name];
  return profile ? profile.tags.join("・") : "";
}

function elementStatusLabel(value, min, max) {
  if (max === min) return "均衡";
  if (value === 0) return "不足";
  if (value === max) return "強め";
  if (value === min) return "控えめ";
  return "中位";
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
        const width = value === 0 ? 0 : Math.max(12, Math.round((value / max) * 100));
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
  `;
}

function renderTokenList(items, renderer, emptyLabel = "—") {
  if (!items.length) {
    return `<span class="muted">${emptyLabel}</span>`;
  }
  return `<div class="token-list">${items.map(renderer).join("")}</div>`;
}

function renderDayMasterSection(result) {
  const profile = STEM_PROFILES[result.dayMaster] || { title: "日主の説明", text: "", tags: [] };
  const dayPillar = result.pillars.day;
  const dayElement = dayPillar.element.stem;
  return `
    <p class="section-copy">第1歩は日主です。日主は日柱の天干で、命主本人の性質を読む起点になります。</p>
    <div class="summary">
      <article class="summary-main">
        <p class="eyebrow">DAY MASTER</p>
        <div class="value-display ${elementClass(dayElement)}">${escapeHtml(dayMasterLabel(result))}</div>
        <p class="lead-copy">この命式では、日主は日柱の天干「${escapeHtml(dayPillar.stem)}」です。</p>
        <h3 class="card-title">${escapeHtml(profile.title)}</h3>
        <p class="summary-text">${escapeHtml(profile.text)}</p>
        ${renderTags(profile.tags)}
      </article>
      <article class="summary-side">
        <div class="fact-list">
          <div class="fact-row"><span>日柱</span><strong>${escapeHtml(dayPillar.text)}</strong></div>
          <div class="fact-row"><span>日主</span><strong class="${elementClass(dayElement)}">${escapeHtml(dayMasterLabel(result))}</strong></div>
          <div class="fact-row"><span>自坐</span><strong>${escapeHtml(dayPillar.terrainSelf || "—")}</strong></div>
          <div class="fact-row"><span>藏干</span><strong>${escapeHtml(dayPillar.hiddenStems.join("・") || "—")}</strong></div>
          <div class="fact-row"><span>日主の五行</span><strong>${escapeHtml(ELEMENT_DESCRIPTIONS[dayElement] || "—")}</strong></div>
        </div>
      </article>
    </div>
  `;
}

function renderElementStateTable(result) {
  const counts = result.fiveElements.counts;
  const values = Object.values(counts);
  const max = Math.max(...values);
  const min = Math.min(...values);
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>五行</th>
            <th>数量</th>
            <th>状態</th>
            <th>特質</th>
          </tr>
        </thead>
        <tbody>
          ${ELEMENT_LABELS.map((name) => `
            <tr>
              <td><span class="table-mark ${elementClass(name)}">${name}</span></td>
              <td>${counts[name] || 0}</td>
              <td>${elementStatusLabel(counts[name] || 0, min, max)}</td>
              <td>${escapeHtml(ELEMENT_DESCRIPTIONS[name])}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderFiveElementsSection(result) {
  return `
    <p class="section-copy">第2歩は八字全体の五行状態です。ここでは命主を取り巻く全体環境として、木火土金水の偏りをまとめて見ます。</p>
    ${renderElementLegend()}
    <div class="summary">
      <article class="summary-main">
        ${renderElementBars(result)}
        <p class="summary-text">${escapeHtml(elementSummary(result))}</p>
      </article>
      ${renderElementStateTable(result)}
    </div>
  `;
}

function renderStructureGuideCards() {
  return `
    <div class="chart-guide">
      ${Object.entries(STRUCTURE_GUIDES).map(([, guide]) => `
        <article>
          <span class="guide-icon">${escapeHtml(guide.icon)}</span>
          <h3>${escapeHtml(guide.title)}</h3>
          <p>${escapeHtml(guide.text)}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function renderStructureTable(result) {
  const heavenlyGods = collectHeavenlyGodEntries(result);
  const hiddenGods = aggregateHiddenGodCounts(result);
  const hiddenStems = aggregateHiddenStemCounts(result);
  const hiddenGodHighlight = topHighlights(hiddenGods, (item) => {
    const keywords = tenGodKeywords(item.name);
    return `${item.name}${keywords ? `（${keywords}）` : ""}`;
  });
  const hiddenStemHighlight = topHighlights(hiddenStems, (item) => (
    `${item.stem}${item.element}（${ELEMENT_DESCRIPTIONS[item.element] || item.element}）`
  ));

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>構成</th>
            <th>命式内の出現</th>
            <th>見方</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>干神</th>
            <td>
              ${renderTokenList(heavenlyGods, (item) => `
                <span class="token">
                  <span class="token-subtle">${escapeHtml(item.pillarLabel)}</span>
                  <strong>${escapeHtml(item.name)}</strong>
                </span>
              `)}
            </td>
            <td>表に出やすい役割です。四柱では ${escapeHtml(heavenlyGods.map((item) => item.name).join("、"))} が見えています。</td>
          </tr>
          <tr>
            <th>支神</th>
            <td>
              ${renderTokenList(hiddenGods, (item) => `
                <span class="token">
                  <strong>${escapeHtml(item.name)}</strong>
                  <span class="token-subtle">×${item.total}</span>
                </span>
              `)}
            </td>
            <td>地支の内側で動くテーマです。主には ${escapeHtml(hiddenGodHighlight || "—")} が重なっています。</td>
          </tr>
          <tr>
            <th>藏干</th>
            <td>
              ${renderTokenList(hiddenStems, (item) => `
                <span class="token">
                  <strong class="${elementClass(item.element)}">${escapeHtml(item.stem)}${escapeHtml(item.element)}</strong>
                  <span class="token-subtle">×${item.total}</span>
                </span>
              `)}
            </td>
            <td>潜在的な構成要素です。主には ${escapeHtml(hiddenStemHighlight || "—")} が土台として入っています。</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderTenGodThemeCards(result) {
  const primaryThemes = aggregateTenGodThemes(result).filter((item) => item.name !== "日主").slice(0, 4);
  return `
    <div class="theme-grid">
      ${primaryThemes.map((item) => {
        const profile = TEN_GOD_PROFILES[item.name] || { icon: item.name.slice(0, 1), tags: [], text: "" };
        return `
          <article class="theme-card">
            <div class="theme-head">
              <span class="guide-icon">${escapeHtml(profile.icon)}</span>
              <div>
                <h3>${escapeHtml(item.name)}</h3>
                <p class="theme-meta">出現 ${item.total} · 干神 ${item.heavenly} / 支神 ${item.hidden}</p>
              </div>
            </div>
            ${renderTags(profile.tags)}
            <p>${escapeHtml(profile.text)}</p>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderStructureSection(result) {
  return `
    <p class="section-copy">第3歩は干神・支神・藏干です。ここでは命式の中に何が出ているかを並べ、その構成から主なテーマを整理します。</p>
    ${renderStructureGuideCards()}
    ${renderStructureTable(result)}
    ${renderTenGodThemeCards(result)}
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
        <h2>命式盤</h2>
        <span class="eyebrow">BASE / CHART</span>
      </div>
      ${renderTraditionalChart(result)}
    </section>

    <section class="section">
      <div class="section-title">
        <h2>日主</h2>
        <span class="eyebrow">STEP 1 / DAY MASTER</span>
      </div>
      ${renderDayMasterSection(result)}
    </section>

    <section class="section">
      <div class="section-title">
        <h2>五行状態</h2>
        <span class="eyebrow">STEP 2 / ELEMENTS</span>
      </div>
      ${renderFiveElementsSection(result)}
    </section>

    <section class="section">
      <div class="section-title">
        <h2>干神・支神・藏干</h2>
        <span class="eyebrow">STEP 3 / STRUCTURE</span>
      </div>
      ${renderStructureSection(result)}
    </section>

    <section class="section">
      <div class="section-title">
        <h2>計算情報</h2>
        <span class="eyebrow">META</span>
      </div>
      ${renderMeta(result)}
    </section>

    <section class="section">
      <div class="section-title">
        <h2>注意事項</h2>
        <span class="eyebrow">NOTES</span>
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

function populateMunicipalities(prefecture, preferredId = "") {
  const municipalities = municipalitiesForPrefecture(prefecture);
  element("municipality").innerHTML = municipalities.map(
    (location) => `<option value="${location.id}">${escapeHtml(location.municipality)}</option>`,
  ).join("");

  const fallbackId = municipalities[0]?.id || DEFAULT_MUNICIPALITY_ID;
  const defaultId = prefecture === DEFAULT_PREFECTURE ? DEFAULT_MUNICIPALITY_ID : fallbackId;
  const nextId = municipalities.some((location) => location.id === preferredId) ? preferredId : defaultId;
  element("municipality").value = nextId;
}

function populateLocationControls() {
  const availablePrefectures = new Set(JAPAN_MUNICIPALITIES.map((location) => location.prefecture));
  const prefectures = PREFECTURE_ORDER.filter((prefecture) => availablePrefectures.has(prefecture));
  element("prefecture").innerHTML = prefectures.map(
    (prefecture) => `<option value="${prefecture}">${escapeHtml(prefecture)}</option>`,
  ).join("");
  element("prefecture").value = DEFAULT_PREFECTURE;
  populateMunicipalities(DEFAULT_PREFECTURE, DEFAULT_MUNICIPALITY_ID);
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
  element("prefecture").addEventListener("change", () => {
    populateMunicipalities(element("prefecture").value);
    markInputChanged();
  });
  ["birth-date", "birth-time", "municipality", "time-mode", "late-zi-mode"].forEach((id) => {
    element(id).addEventListener("change", markInputChanged);
  });
}

function init() {
  populateLocationControls();
  syncBirthTimeField();
  bindEvents();
  renderInitialState();
  setStatus("未作成");
}

init();
