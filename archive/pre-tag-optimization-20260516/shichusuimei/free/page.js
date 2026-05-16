import { calculateShichusuimei } from "../../calculation-lab.js?v=free-20260516-accuracy-1";
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

const ELEMENT_BALANCE_ADVICE = {
  木: "計画を一度紙に落とし、伸ばす方向を絞ると安定します。",
  火: "急ぎすぎず、休息と確認の時間を先に確保すると熱量が活きます。",
  土: "抱え込みを減らし、役割と期限を分けると停滞を防げます。",
  金: "判断を急がず、対話と余白を入れると切れ味が整います。",
  水: "情報収集、睡眠、静かな移動時間を増やすと流れが戻りやすくなります。",
};

const SEASONAL_STATE_BY_BRANCH = {
  寅: { season: "春", states: { 木: "旺", 火: "相", 水: "休", 金: "囚", 土: "死" } },
  卯: { season: "春", states: { 木: "旺", 火: "相", 水: "休", 金: "囚", 土: "死" } },
  辰: { season: "土用", states: { 土: "旺", 金: "相", 火: "休", 木: "囚", 水: "死" } },
  巳: { season: "夏", states: { 火: "旺", 土: "相", 木: "休", 水: "囚", 金: "死" } },
  午: { season: "夏", states: { 火: "旺", 土: "相", 木: "休", 水: "囚", 金: "死" } },
  未: { season: "土用", states: { 土: "旺", 金: "相", 火: "休", 木: "囚", 水: "死" } },
  申: { season: "秋", states: { 金: "旺", 水: "相", 土: "休", 火: "囚", 木: "死" } },
  酉: { season: "秋", states: { 金: "旺", 水: "相", 土: "休", 火: "囚", 木: "死" } },
  戌: { season: "土用", states: { 土: "旺", 金: "相", 火: "休", 木: "囚", 水: "死" } },
  亥: { season: "冬", states: { 水: "旺", 木: "相", 金: "休", 土: "囚", 火: "死" } },
  子: { season: "冬", states: { 水: "旺", 木: "相", 金: "休", 土: "囚", 火: "死" } },
  丑: { season: "土用", states: { 土: "旺", 金: "相", 火: "休", 木: "囚", 水: "死" } },
};

const SEASONAL_STATE_TEXT = {
  旺: "月令の力を直接受け、最も勢いが出やすい",
  相: "旺じる五行から生じられ、次に伸びやすい",
  休: "季節から見ると力を使った後で、控えめに働く",
  囚: "季節の気に抑えられ、出方に制限がかかる",
  死: "季節から最も遠く、意識して補いたい",
};

const ELEMENT_GENERATES = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};

const ELEMENT_CONTROLS = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木",
};

const BRANCH_RELATIONSHIP_PROFILES = {
  子: "感情や情報の流れが細やかで、言葉にしない気配を読みやすい関係性です。",
  丑: "安心できる土台を重視し、時間をかけて信頼を積むほど安定しやすい関係性です。",
  寅: "成長意欲が強く、互いに前へ進む刺激を求めやすい関係性です。",
  卯: "柔らかな距離感や美意識が大切で、丁寧な配慮が関係を育てます。",
  辰: "現実的な調整力があり、理想と生活基盤のすり合わせがテーマになりやすい関係性です。",
  巳: "熱量と感受性が強く、惹きつけ合う一方で言葉の温度管理が大切です。",
  午: "明るさや率直さが出やすく、関係の中で情熱と自己表現が強まります。",
  未: "包容力と育てる力があり、互いの不安を受け止める姿勢が関係を整えます。",
  申: "判断力と変化対応が鍵になり、知的な会話や現実的な連携が重要です。",
  酉: "美意識や基準の高さが出やすく、尊重と適度な余白が関係を長持ちさせます。",
  戌: "責任感と守る意識が強く、約束や信頼の扱いが関係の軸になります。",
  亥: "共感や想像力が広がりやすく、自由さと安心感の両方を求める関係性です。",
};

const ELEMENT_RELATION_READING = {
  same: "日主と同じ五行なので、対等さや自分らしさを保てる関係を求めやすい配置です。",
  supported: "日支が日主を生じる関係なので、支えられる安心感や学び合いが関係の軸になりやすい配置です。",
  output: "日主が日支へ生じる関係なので、表現すること、尽くすこと、相手に向けて力を出すことがテーマになりやすい配置です。",
  wealth: "日主が日支を制する関係なので、現実的な責任、生活管理、相手との具体的な関わり方がテーマになりやすい配置です。",
  pressure: "日支が日主を制する関係なので、関係の中で責任感や緊張感が生まれやすく、約束や境界線を整えることが大切です。",
};

const PILLAR_SEAT_GUIDES = {
  year: {
    title: "年柱の坐",
    scope: "家系・幼少期・社会に出る前の土台",
    text: "年柱の天干がどんな地支に坐るかで、命主が受け継ぎやすい空気、初期環境、外側から見られやすい印象を読みます。",
  },
  month: {
    title: "月柱の坐",
    scope: "仕事環境・社会性・現実で使う力",
    text: "月柱は月令に近く、命式全体の季節感を握ります。仕事や役割の中で、どの力が地に足をつけやすいかを見ます。",
  },
  day: {
    title: "日柱の坐",
    scope: "本人の居場所・親密な関係・婚姻宮",
    text: "日柱は命主本人に最も近く、日支は配偶者宮・婚姻宮としても見ます。自分が安心する距離感や関係性の質を読みます。",
  },
  hour: {
    title: "時柱の坐",
    scope: "未来志向・晩年・子女や表現の芽",
    text: "時柱はこれから伸びる力や内側の願いを見ます。長期的に育てたい才能、晩年のテーマ、表現の出口を読む場所です。",
  },
};

const READING_SOURCE_GUIDES = {
  year: {
    stem: "外に出る印象",
    branch: "家系・幼少期の土台",
  },
  month: {
    stem: "社会で見せる役割",
    branch: "仕事環境・月令",
  },
  day: {
    stem: "日主・本人の核",
    branch: "婚姻宮・親密な関係",
  },
  hour: {
    stem: "内側の願い・表現",
    branch: "未来・晩年・子女",
  },
};

const TERRAIN_SELF_READING = {
  長生: "始まりと成長の気があり、素直に伸ばすほど力が出ます。",
  沐浴: "感受性と揺らぎが強く、魅力と迷いが同時に出やすい状態です。",
  冠帯: "見せ方や社会的な整え方に力が入り、役割意識が育ちます。",
  建禄: "自立心と実務力が強く、自分の足で立つほど安定します。",
  帝旺: "勢いが最も強く、主導権や存在感が前に出やすい状態です。",
  衰: "勢いを整理し、経験をもとに落ち着いて判断する状態です。",
  病: "繊細さが出やすく、無理をせず整えることで感覚が活きます。",
  死: "一度区切りをつけ、不要なものを手放すことで次へ進む状態です。",
  墓: "内側に蓄える力があり、深くしまい込んだ資質を掘り起こします。",
  絶: "既存の型から離れやすく、変化や転機を通じて再構成する状態です。",
  胎: "まだ形になる前の可能性があり、準備と育成が大切です。",
  養: "守られながら育つ気があり、環境を整えるほど安定します。",
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
const STEM_YINYANG = {
  甲: "陽", 乙: "陰", 丙: "陽", 丁: "陰", 戊: "陽",
  己: "陰", 庚: "陽", 辛: "陰", 壬: "陽", 癸: "陰",
};
const TEN_GOD_ORDER = ["比肩", "劫财", "食神", "伤官", "偏财", "正财", "七杀", "正官", "偏印", "正印", "日主"];
const TEN_GOD_TONE_CLASS = {
  比肩: "earth",
  劫财: "earth",
  食神: "metal",
  伤官: "metal",
  偏财: "water",
  正财: "water",
  七杀: "wood",
  正官: "wood",
  偏印: "fire",
  正印: "fire",
  日主: "earth",
};
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
const RESULT_SECTION_TABS = [
  { id: "page-meishiki", label: "命式", query: "meishiki", aliases: ["day-master", "chart"] },
  { id: "page-detail", label: "命式詳細", query: "detail", aliases: ["elements", "structure", "reading", "interpretation", "meta"] },
  { id: "page-luck", label: "大運流年", query: "luck", aliases: ["fortune"] },
];
const DEFAULT_RESULT_SECTION_ID = RESULT_SECTION_TABS[0].id;
const MOBILE_RESULTS_MEDIA = window.matchMedia("(max-width: 760px)");
const URL_PARAMS = new URLSearchParams(window.location.search);

let lastResult = null;
let lastResultInputSignature = "";
let activeRunId = 0;
let activeResultSectionId = resolveResultSectionId(URL_PARAMS.get("section"));

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

function resolveResultSectionId(value) {
  const normalized = String(value || "").trim().toLowerCase();
  const match = RESULT_SECTION_TABS.find((item) => (
    item.id === normalized || item.query === normalized || (item.aliases || []).includes(normalized)
  ));
  return match ? match.id : DEFAULT_RESULT_SECTION_ID;
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
    gender: element("gender").value,
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

function elementCompositionReading(result) {
  const counts = result.fiveElements.counts;
  const strong = strongestElements(counts);
  const missing = ELEMENT_LABELS.filter((name) => (counts[name] || 0) === 0);
  const support = missing.length ? missing : weakestElements(counts);
  const strongText = strong.map((name) => `${name}（${ELEMENT_DESCRIPTIONS[name]}）`).join("・");
  const supportText = support.map((name) => `${name}（${ELEMENT_DESCRIPTIONS[name]}）`).join("・");
  const actionText = support.map((name) => ELEMENT_BALANCE_ADVICE[name]).join(" ");
  return {
    title: `${strong.join("・")}が多く、${support.join("・")}を補う命式`,
    body: `この命式は ${strongText} が前に出やすい構成です。反対に ${supportText} は薄くなりやすいため、日常ではこの五行を意識して補うと全体の流れが整います。`,
    advice: actionText,
  };
}

function seasonalElementState(result) {
  const monthBranch = result.pillars.month.branch;
  const seasonal = SEASONAL_STATE_BY_BRANCH[monthBranch] || SEASONAL_STATE_BY_BRANCH.寅;
  return {
    monthBranch,
    season: seasonal.season,
    states: seasonal.states,
  };
}

function seasonalStateSummary(result) {
  const seasonal = seasonalElementState(result);
  const ordered = ELEMENT_LABELS.map((name) => `${name}${seasonal.states[name]}`).join("・");
  return `${seasonal.monthBranch}月（${seasonal.season}）の月令で見ると、${ordered} の配置です。旺相休囚死は、単純な量ではなく「季節から見た働きやすさ」を読む補助線として使います。`;
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

function elementPercentages(result) {
  if (result.fiveElements?.percentages) {
    return result.fiveElements.percentages;
  }
  const counts = result.fiveElements.counts;
  const total = Math.max(1, Object.values(counts).reduce((sum, value) => sum + value, 0));
  return Object.fromEntries(ELEMENT_LABELS.map((name) => [name, Math.round(((counts[name] || 0) / total) * 100)]));
}

function balanceTypeLabel(result) {
  const values = Object.values(result.fiveElements.counts);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const missing = values.filter((value) => value === 0).length;
  if (max - min <= 1 && missing === 0) return "均衡型";
  if (strongestElements(result.fiveElements.counts).includes(result.pillars.day.element.stem)) return "日主強め";
  if (missing >= 2) return "偏り型";
  return "混合型";
}

function mainTenGodLabel(result) {
  return topHighlights(
    aggregateTenGodThemes(result).filter((item) => item.name !== "日主"),
    (item) => item.name,
    2,
  ) || "—";
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
            <div class="bar"><span class="${elementClass(name)}" style="width:${width}%"></span></div>
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

function renderSectionRail() {
  return `
    <nav class="result-rail" aria-label="結果ナビゲーション">
      ${RESULT_SECTION_TABS.map((item) => `
        <button
          type="button"
          class="rail-link"
          data-target="${item.id}"
          aria-pressed="${item.id === activeResultSectionId ? "true" : "false"}"
        >${item.label}</button>
      `).join("")}
    </nav>
  `;
}

function renderFiveElementWheel(result) {
  const percentages = elementPercentages(result);
  const dayElement = result.pillars.day.element.stem;
  const layout = {
    火: { x: 160, y: 58 },
    土: { x: 246, y: 120 },
    金: { x: 214, y: 228 },
    水: { x: 106, y: 228 },
    木: { x: 74, y: 120 },
  };

  return `
    <div class="wheel-wrap">
      <svg class="element-wheel" viewBox="0 0 320 300" role="img" aria-label="五行バランス図">
        <circle class="wheel-halo" cx="160" cy="150" r="118"></circle>
        <circle class="wheel-ring" cx="160" cy="150" r="96"></circle>
        ${ELEMENT_LABELS.map((name) => `
          <line class="wheel-spoke" x1="160" y1="150" x2="${layout[name].x}" y2="${layout[name].y}"></line>
        `).join("")}
        ${ELEMENT_LABELS.map((name) => `
          <g class="wheel-node ${elementClass(name)} ${name === dayElement ? "is-active" : ""}" transform="translate(${layout[name].x} ${layout[name].y})">
            <circle r="${name === dayElement ? 38 : 34}"></circle>
            <text class="wheel-char" x="0" y="-4">${name}</text>
            <text class="wheel-percent" x="0" y="18">${percentages[name]}%</text>
          </g>
        `).join("")}
        <g class="wheel-center">
          <circle cx="160" cy="150" r="34"></circle>
          <text class="wheel-center-label" x="160" y="145">日主</text>
          <text class="wheel-center-value" x="160" y="168">${escapeHtml(dayMasterLabel(result))}</text>
        </g>
      </svg>
    </div>
  `;
}

function renderDayMasterSection(result) {
  const profile = STEM_PROFILES[result.dayMaster] || { title: "日主の説明", text: "", tags: [] };
  const dayPillar = result.pillars.day;
  const dayElement = dayPillar.element.stem;
  const weakElements = ELEMENT_LABELS.filter((name) => (result.fiveElements.counts[name] || 0) === 0);
  const supportLabel = weakElements.length ? weakElements.join("・") : weakestElements(result.fiveElements.counts).join("・");
  return `
    <div class="card-head">
      <div>
        <p class="card-kicker">STEP 1</p>
        <h2>日主から自分の核を見る</h2>
      </div>
      <span class="balance-badge">${escapeHtml(balanceTypeLabel(result))}</span>
    </div>
    <p class="section-copy">日主は日柱の天干で、命主本人の性質を読む起点です。まずはここを中心に命式全体を見ます。</p>
    <div class="overview-shell">
      <div class="overview-copy">
        <div class="value-display ${elementClass(dayElement)}">${escapeHtml(dayMasterLabel(result))}</div>
        <p class="lead-copy">この命式では、日主は日柱の天干「${escapeHtml(dayPillar.stem)}」です。</p>
        <h3 class="card-title">${escapeHtml(profile.title)}</h3>
        <p class="summary-text">${escapeHtml(profile.text)}</p>
        ${renderTags(profile.tags)}
      </div>
      ${renderFiveElementWheel(result)}
    </div>
    <div class="metric-grid">
      <article class="metric-card">
        <span class="metric-label">日柱</span>
        <strong class="metric-value">${escapeHtml(dayPillar.text)}</strong>
        <p>${escapeHtml(dayPillar.hiddenStems.join("・") || "—")}</p>
      </article>
      <article class="metric-card">
        <span class="metric-label">主導五行</span>
        <strong class="metric-value">${escapeHtml(strongestElements(result.fiveElements.counts).join("・"))}</strong>
        <p>環境で流れやすい要素</p>
      </article>
      <article class="metric-card">
        <span class="metric-label">補いたい五行</span>
        <strong class="metric-value">${escapeHtml(supportLabel)}</strong>
        <p>意識して整えると安定</p>
      </article>
      <article class="metric-card">
        <span class="metric-label">主要十神</span>
        <strong class="metric-value">${escapeHtml(mainTenGodLabel(result))}</strong>
        <p>命式内で重なりやすい役割</p>
      </article>
    </div>
  `;
}

function renderElementStateCards(result) {
  const counts = result.fiveElements.counts;
  const percentages = elementPercentages(result);
  const values = Object.values(counts);
  const max = Math.max(...values);
  const min = Math.min(...values);
  return `
    <div class="element-stat-grid">
      ${ELEMENT_LABELS.map((name) => `
        <article class="element-stat-card">
          <span class="table-mark ${elementClass(name)}">${name}</span>
          <strong class="metric-value">${percentages[name]}%</strong>
          <span class="stat-state">${elementStatusLabel(counts[name] || 0, min, max)}</span>
          <p>${escapeHtml(ELEMENT_DESCRIPTIONS[name])}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function renderFiveElementAlgorithmPanel(result) {
  const analysis = result.fiveElements || {};
  const basis = analysis.basis || {};
  const percentages = elementPercentages(result);
  return `
    <div class="algorithm-panel">
      <div class="card-subhead">
        <div>
          <p class="card-kicker">ALGORITHM BASIS</p>
          <h3>五行計算の根拠</h3>
        </div>
        <span class="balance-badge">平衡 ${escapeHtml(analysis.balanceScore ?? "—")}</span>
      </div>
      <p class="summary-text">五行は天干、地支の藏干、月柱の季節補正を合わせて点数化しています。表示用の構成比は raw points から算出し、丸めた件数だけに依存しないようにしています。</p>
      <div class="algorithm-grid">
        ${ELEMENT_LABELS.map((name) => `
          <article class="algorithm-card">
            <span class="table-mark ${elementClass(name)}">${name}</span>
            <strong>${escapeHtml(`${percentages[name] || 0}%`)}</strong>
            <p>${escapeHtml(`raw ${analysis.rawPoints?.[name] ?? "—"} / count ${analysis.counts?.[name] ?? 0}`)}</p>
          </article>
        `).join("")}
      </div>
      <div class="mini-meta-list algorithm-meta">
        <span><strong>月支</strong>${escapeHtml(basis.monthBranch || "—")}</span>
        <span><strong>月柱倍率</strong>${escapeHtml(basis.monthPillarMultiplier || "—")}</span>
        <span><strong>天干基礎点</strong>${escapeHtml(basis.stemBasePoint || "—")}</span>
        <span><strong>藏干基礎点</strong>${escapeHtml(basis.branchHiddenQiBasePoint || "—")}</span>
      </div>
    </div>
  `;
}

function renderElementReading(result) {
  const reading = elementCompositionReading(result);
  return `
    <div class="element-reading">
      <p class="reading-kicker">五行の読み方</p>
      <h3>${escapeHtml(reading.title)}</h3>
      <p>${escapeHtml(reading.body)}</p>
      <p>${escapeHtml(reading.advice)}</p>
    </div>
  `;
}

function renderSeasonalElementStates(result) {
  const seasonal = seasonalElementState(result);
  return `
    <div class="seasonal-panel">
      <div class="card-subhead">
        <div>
          <p class="card-kicker">旺相休囚死</p>
          <h3>月令から五行の勢いを見る</h3>
        </div>
        <span class="balance-badge">${escapeHtml(seasonal.monthBranch)}月 / ${escapeHtml(seasonal.season)}</span>
      </div>
      <p class="summary-text">${escapeHtml(seasonalStateSummary(result))}</p>
      <div class="seasonal-state-grid">
        ${ELEMENT_LABELS.map((name) => {
          const state = seasonal.states[name] || "休";
          return `
            <article class="seasonal-state-card">
              <span class="table-mark ${elementClass(name)}">${name}</span>
              <strong>${escapeHtml(state)}</strong>
              <p>${escapeHtml(SEASONAL_STATE_TEXT[state])}</p>
            </article>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderFiveElementsSection(result) {
  return `
    <div class="card-head">
      <div>
        <p class="card-kicker">STEP 2</p>
        <h2>五行の環境をまとめて見る</h2>
      </div>
    </div>
    <p class="section-copy">ここでは命主を取り巻く全体環境として、木火土金水の偏りをひとまとまりで見ます。</p>
    ${renderElementLegend()}
    <div class="soft-panel">
      <div class="element-analysis-layout">
        ${renderFiveElementWheel(result)}
        <div>
          ${renderElementReading(result)}
          ${renderElementBars(result)}
        </div>
      </div>
      <p class="summary-text">${escapeHtml(elementSummary(result))}</p>
    </div>
    ${renderSeasonalElementStates(result)}
    ${renderFiveElementAlgorithmPanel(result)}
    ${renderElementStateCards(result)}
  `;
}

function renderStructureGuideCards() {
  return `
    <div class="detail-grid">
      ${Object.entries(STRUCTURE_GUIDES).map(([, guide]) => `
        <article class="detail-card">
          <span class="guide-icon warm">${escapeHtml(guide.icon)}</span>
          <h3>${escapeHtml(guide.title)}</h3>
          <p>${escapeHtml(guide.text)}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function renderTenGodChart(result) {
  const themes = aggregateTenGodThemes(result);
  const themeMap = new Map(themes.map((item) => [item.name, item]));
  const total = Math.max(1, themes.reduce((sum, item) => sum + item.total, 0));
  const orderedEntries = TEN_GOD_ORDER.filter((name) => name !== "日主").map((name) => {
    const item = themeMap.get(name) || { total: 0 };
    const percent = Math.round((item.total / total) * 100);
    const toneClass = TEN_GOD_TONE_CLASS[name] || "earth";
    return { name, item, percent, toneClass };
  });
  return `
    <div class="god-chart-card">
      <div class="card-subhead">
        <h3>十神占比</h3>
        <p>天干と藏干に現れる十神の出現率です。</p>
      </div>
      <div class="god-chart">
        ${orderedEntries.map(({ name, item, percent, toneClass }) => `
            <article class="god-col ${item.total === 0 ? "is-empty" : ""}">
              <div class="god-track">
                <span class="god-fill ${toneClass}" style="height:${item.total === 0 ? 6 : Math.max(18, percent)}%"></span>
              </div>
              <span class="god-icon ${toneClass}">${escapeHtml(TEN_GOD_PROFILES[name]?.icon || name.slice(0, 1))}</span>
              <strong class="god-name">${escapeHtml(name)}</strong>
              <span class="god-percent">${percent}%</span>
            </article>
        `).join("")}
      </div>
      <div class="god-mobile-list">
        ${orderedEntries.map(({ name, item, percent, toneClass }) => `
          <article class="god-mobile-item ${item.total === 0 ? "is-empty" : ""}">
            <div class="god-mobile-head">
              <span class="god-icon ${toneClass}">${escapeHtml(TEN_GOD_PROFILES[name]?.icon || name.slice(0, 1))}</span>
              <strong>${escapeHtml(name)}</strong>
              <span>${percent}%</span>
            </div>
            <div class="god-mobile-track">
              <span class="god-mobile-fill ${toneClass}" style="width:${item.total === 0 ? 0 : Math.max(10, percent)}%"></span>
            </div>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

function renderStructureCards(result) {
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
    <div class="detail-grid">
      <article class="detail-card">
        <div class="card-subhead">
          <h3>干神</h3>
          <p>表に出やすい役割</p>
        </div>
        ${renderTokenList(heavenlyGods, (item) => `
          <span class="token">
            <span class="token-subtle">${escapeHtml(item.pillarLabel)}</span>
            <strong>${escapeHtml(item.name)}</strong>
          </span>
        `)}
        <p>${escapeHtml(`四柱では ${heavenlyGods.map((item) => item.name).join("、")} が見えています。`)}</p>
      </article>
      <article class="detail-card">
        <div class="card-subhead">
          <h3>支神</h3>
          <p>内側で動く十神テーマ</p>
        </div>
        ${renderTokenList(hiddenGods, (item) => `
          <span class="token">
            <strong>${escapeHtml(item.name)}</strong>
            <span class="token-subtle">×${item.total}</span>
          </span>
        `)}
        <p>${escapeHtml(`主には ${hiddenGodHighlight || "—"} が重なっています。`)}</p>
      </article>
      <article class="detail-card">
        <div class="card-subhead">
          <h3>藏干</h3>
          <p>潜在的な土台要素</p>
        </div>
        ${renderTokenList(hiddenStems, (item) => `
          <span class="token">
            <strong class="${elementClass(item.element)}">${escapeHtml(item.stem)}${escapeHtml(item.element)}</strong>
            <span class="token-subtle">×${item.total}</span>
          </span>
        `)}
        <p>${escapeHtml(`主には ${hiddenStemHighlight || "—"} が土台として入っています。`)}</p>
      </article>
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
    <div class="card-head">
      <div>
        <p class="card-kicker">STEP 3</p>
        <h2>干神・支神・藏干の構成を見る</h2>
      </div>
    </div>
    <p class="section-copy">命式の中に何が出ているかを並べ、そこから主要テーマを整理します。</p>
    ${renderTenGodChart(result)}
    ${renderStructureGuideCards()}
    ${renderStructureCards(result)}
    ${renderTenGodThemeCards(result)}
  `;
}

function dayMasterTypeLabel(result) {
  const stem = result.dayMaster;
  const element = result.pillars.day.element.stem;
  return `${STEM_YINYANG[stem] || ""}${ELEMENT_JA[element] || element}`;
}

function elementBalancingAdvice(result) {
  const counts = result.fiveElements.counts;
  const missing = ELEMENT_LABELS.filter((name) => (counts[name] || 0) === 0);
  const support = missing.length ? missing : weakestElements(counts);
  const advice = {
    木: "学び直し、計画づくり、植物や自然に触れる時間を増やすと、成長と方向づけを補いやすくなります。",
    火: "朝日を浴びる、発信や表現の機会を作る、温かい場に参加するなど、熱量を外へ出す行動が助けになります。",
    土: "生活リズム、食事、片づけ、貯蓄計画など、毎日の土台を整えるほど安定感が出やすくなります。",
    金: "金属の小物やアクセサリー、白・金色系の持ち物、道具の整理、ルール化によって判断力を補いやすくなります。",
    水: "休息、読書、移動、水辺の散歩、情報収集など、流れと柔軟性を作る行動が合いやすいです。",
  };
  return {
    support,
    text: support.map((name) => `${name}: ${advice[name]}`).join(" "),
  };
}

function renderInterpretationSummary(result) {
  const profile = STEM_PROFILES[result.dayMaster] || { title: "日主の説明", text: "", tags: [] };
  const typeLabel = dayMasterTypeLabel(result);
  const mainThemes = aggregateTenGodThemes(result).filter((item) => item.name !== "日主").slice(0, 3);
  const themeText = mainThemes.map((item) => {
    const tags = tenGodKeywords(item.name);
    return `${item.name}${tags ? `（${tags}）` : ""}`;
  }).join("、");
  return `
    <div class="reading-lead">
      <div>
        <span class="metric-label">日主タイプ</span>
        <strong class="reading-type ${elementClass(result.pillars.day.element.stem)}">${escapeHtml(typeLabel)}</strong>
      </div>
      <p>${escapeHtml(`この命式の日主は「${result.dayMaster}」で、${typeLabel}の性質として読みます。${profile.text}`)}</p>
      <p>${escapeHtml(`十神では ${themeText || "大きな偏りなし"} が目立ち、表に出やすい行動と内側で動く欲求を分けて確認します。`)}</p>
    </div>
  `;
}

function renderBalancingSection(result) {
  const balance = elementBalancingAdvice(result);
  return `
    <div class="soft-panel reading-panel">
      <div class="card-subhead">
        <h3>五行バランスと整え方</h3>
        <p>不足・控えめな五行を、生活上の比喩として補う初版ガイドです。</p>
      </div>
      ${renderElementBars(result)}
      <p class="summary-text">${escapeHtml(elementSummary(result))}</p>
      <p class="summary-text">${escapeHtml(`補いたい候補は ${balance.support.join("・")} です。${balance.text}`)}</p>
    </div>
  `;
}

function renderLifeThemeCards(result) {
  const themes = aggregateTenGodThemes(result).filter((item) => item.name !== "日主");
  const primary = themes[0]?.name || "日主";
  const secondary = themes[1]?.name || primary;
  const hidden = aggregateHiddenGodCounts(result)[0]?.name || secondary;
  const primaryProfile = TEN_GOD_PROFILES[primary] || TEN_GOD_PROFILES["日主"];
  const secondaryProfile = TEN_GOD_PROFILES[secondary] || TEN_GOD_PROFILES["日主"];
  const hiddenProfile = TEN_GOD_PROFILES[hidden] || TEN_GOD_PROFILES["日主"];
  const cards = [
    {
      title: "性格の核",
      text: `${primary} が主題として出ています。${primaryProfile.text} 日主の性質と合わせると、無意識に選びやすい判断基準が見えてきます。`,
    },
    {
      title: "仕事・役割",
      text: `${secondary} の働きから、仕事では ${secondaryProfile.tags.join("・")} の場面で力を使いやすいと読みます。向いている職種断定ではなく、力を出しやすい役割の仮説です。`,
    },
    {
      title: "恋愛・対人",
      text: `${hidden} は内側で動くテーマとして見ます。${hiddenProfile.text} 関係性では、表に出る態度と本音のズレを確認すると読みが深まります。`,
    },
    {
      title: "財運・現実面",
      text: `財星（偏财・正财）や官星（七杀・正官）の出方を、収入の断定ではなく現実管理・責任・対人機会の傾向として扱います。`,
    },
  ];
  return `
    <div class="theme-grid reading-theme-grid">
      ${cards.map((card) => `
        <article class="theme-card">
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.text)}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function elementRelationKey(dayElement, palaceElement) {
  if (dayElement === palaceElement) return "same";
  if (ELEMENT_GENERATES[palaceElement] === dayElement) return "supported";
  if (ELEMENT_GENERATES[dayElement] === palaceElement) return "output";
  if (ELEMENT_CONTROLS[dayElement] === palaceElement) return "wealth";
  if (ELEMENT_CONTROLS[palaceElement] === dayElement) return "pressure";
  return "same";
}

function dayMarriagePalaceReading(result) {
  const dayPillar = result.pillars.day;
  const dayElement = dayPillar.element.stem;
  const palaceElement = dayPillar.element.branch;
  const hiddenDetails = dayPillar.hiddenStemDetails || [];
  const mainHidden = hiddenDetails[0];
  const relationKey = elementRelationKey(dayElement, palaceElement);
  const hiddenText = hiddenDetails
    .map((detail) => `${detail.stem}${detail.element}${detail.tenGod ? `（${detail.tenGod}）` : ""}`)
    .join("、") || "—";
  return {
    branch: dayPillar.branch,
    branchElement: palaceElement,
    hiddenText,
    mainHiddenTenGod: mainHidden?.tenGod || "—",
    profile: BRANCH_RELATIONSHIP_PROFILES[dayPillar.branch] || "日支は親密な関係で出やすい距離感や生活感を読む入口です。",
    relation: ELEMENT_RELATION_READING[relationKey],
    terrain: dayPillar.terrainByDay || dayPillar.terrainSelf || "—",
  };
}

function renderMarriagePalaceDetail(result) {
  const reading = dayMarriagePalaceReading(result);
  return `
    <div class="soft-panel marriage-palace-panel">
      <div class="card-subhead">
        <div>
          <p class="card-kicker">日柱 / 婚姻宮</p>
          <h3>日支から親密な関係の傾向を見る</h3>
        </div>
        <span class="balance-badge">${escapeHtml(reading.branch)} / ${escapeHtml(reading.branchElement)}</span>
      </div>
      <p class="summary-text">四柱推命では、日柱の地支を配偶者宮・婚姻宮として見ます。ここでは結婚の有無を断定せず、親密な関係で出やすい距離感、安心材料、摩擦の出方を読む入口として扱います。</p>
      <div class="marriage-palace-grid">
        <article class="mini-reading-card">
          <span class="metric-label">日支</span>
          <strong class="metric-value ${elementClass(reading.branchElement)}">${escapeHtml(reading.branch)}</strong>
          <p>${escapeHtml(reading.profile)}</p>
        </article>
        <article class="mini-reading-card">
          <span class="metric-label">藏干・支神</span>
          <strong class="metric-value">${escapeHtml(reading.mainHiddenTenGod)}</strong>
          <p>${escapeHtml(`内側には ${reading.hiddenText} があり、表の態度だけでなく本音や生活感として現れやすい要素を見ます。`)}</p>
        </article>
        <article class="mini-reading-card">
          <span class="metric-label">日主との関係</span>
          <strong class="metric-value">${escapeHtml(reading.branchElement)}</strong>
          <p>${escapeHtml(reading.relation)}</p>
        </article>
      </div>
      <p class="summary-text">${escapeHtml(`十二運では ${reading.terrain} と見ます。関係性の詳解では、この日支に大運・流年が冲・合・刑・害を起こす年を重ねると、出会い方、関係の変化、距離感の調整ポイントをさらに具体化できます。`)}</p>
    </div>
  `;
}

function renderReadingSourceMap(result) {
  return `
    <div class="soft-panel reading-source-panel">
      <div class="card-subhead">
        <div>
          <p class="card-kicker">読み取り位置</p>
          <h3>どの柱・どの要素から読んでいるか</h3>
        </div>
        <span class="balance-badge">四柱定位</span>
      </div>
      <p class="summary-text">詳解では、命式のどの場所を根拠にしているかを先に示します。たとえば婚姻や親密な関係は、日柱の地支、つまり「日支」を配偶者宮・婚姻宮として読んでいます。</p>
      <div class="source-map-grid">
        ${PILLAR_KEYS.map((key) => {
          const pillar = result.pillars[key];
          const guide = READING_SOURCE_GUIDES[key];
          const isDay = key === "day";
          return `
            <article class="source-pillar-card ${isDay ? "is-primary" : ""}">
              <div class="source-pillar-label">
                <strong>${escapeHtml(PILLAR_LABELS[key])}</strong>
                <span>${escapeHtml(pillar.text)}</span>
              </div>
              <div class="source-pillar-stack" aria-label="${escapeHtml(PILLAR_LABELS[key])}の天干と地支">
                <div class="source-token source-stem">
                  <span>天干</span>
                  <strong class="${elementClass(pillar.element.stem)}">${escapeHtml(pillar.stem)}</strong>
                  <em>${escapeHtml(guide.stem)}</em>
                </div>
                <div class="source-token source-branch ${isDay ? "is-highlighted" : ""}">
                  <span>地支</span>
                  <strong class="${elementClass(pillar.element.branch)}">${escapeHtml(pillar.branch)}</strong>
                  <em>${escapeHtml(guide.branch)}</em>
                  ${isDay ? `<b class="source-badge">婚姻宮</b>` : ""}
                </div>
              </div>
              ${isDay ? `<p class="source-note">この「日柱の地支」が婚姻宮です。下の婚姻宮詳解は、ここを中心に藏干・支神・五行関係を重ねて読んでいます。</p>` : `<p class="source-note">${escapeHtml(PILLAR_SEAT_GUIDES[key].scope)}を読む入口です。</p>`}
            </article>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function pillarSeatReading(result, key) {
  const pillar = result.pillars[key];
  const guide = PILLAR_SEAT_GUIDES[key];
  const stemElement = pillar.element.stem;
  const branchElement = pillar.element.branch;
  const hiddenDetails = pillar.hiddenStemDetails || [];
  const mainHidden = hiddenDetails[0];
  const relationKey = elementRelationKey(stemElement, branchElement);
  const hiddenText = hiddenDetails
    .map((detail) => `${detail.stem}${detail.element}${detail.tenGod ? `（${detail.tenGod}）` : ""}`)
    .join("、") || "—";
  const selfTerrain = pillar.terrainSelf || "—";
  return {
    key,
    guide,
    text: pillar.text,
    stem: pillar.stem,
    branch: pillar.branch,
    stemElement,
    branchElement,
    hiddenText,
    mainHiddenTenGod: mainHidden?.tenGod || "—",
    relation: ELEMENT_RELATION_READING[relationKey],
    selfTerrain,
    selfTerrainText: TERRAIN_SELF_READING[selfTerrain] || "この柱の天干が地支に坐る時の勢いを見ます。",
  };
}

function renderPillarSeatDetails(result) {
  const readings = PILLAR_KEYS.map((key) => pillarSeatReading(result, key));
  return `
    <div class="soft-panel pillar-seat-panel">
      <div class="card-subhead">
        <div>
          <p class="card-kicker">四柱 / 坐</p>
          <h3>四柱それぞれの坐を詳しく見る</h3>
        </div>
        <span class="balance-badge">年・月・日・時</span>
      </div>
      <p class="summary-text">「坐」は、それぞれの柱の天干がどの地支の上に乗っているかを見る読み方です。表に出る天干と、足元にある地支・藏干・十二運を合わせることで、その柱の力が安定しやすいか、揺れやすいか、どこで発揮されやすいかを読みます。</p>
      <div class="pillar-seat-grid">
        ${readings.map((reading) => `
          <article class="pillar-seat-card">
            <div class="pillar-seat-head">
              <span class="metric-label">${escapeHtml(reading.guide.title)}</span>
              <strong class="pillar-seat-value">
                <span class="${elementClass(reading.stemElement)}">${escapeHtml(reading.stem)}</span><span class="${elementClass(reading.branchElement)}">${escapeHtml(reading.branch)}</span>
              </strong>
              <p>${escapeHtml(reading.guide.scope)}</p>
            </div>
            <div class="mini-meta-list">
              <span><strong>坐</strong>${escapeHtml(`${reading.stem}${reading.stemElement} → ${reading.branch}${reading.branchElement}`)}</span>
              <span><strong>自坐</strong>${escapeHtml(reading.selfTerrain)}</span>
              <span><strong>主な支神</strong>${escapeHtml(reading.mainHiddenTenGod)}</span>
            </div>
            <p>${escapeHtml(reading.guide.text)}</p>
            <p>${escapeHtml(`藏干は ${reading.hiddenText}。${reading.relation}`)}</p>
            <p>${escapeHtml(`十二運の自坐は ${reading.selfTerrain}。${reading.selfTerrainText}`)}</p>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

function renderInterpretationSection(result) {
  return `
    <div class="card-head">
      <div>
        <p class="card-kicker">READING / DRAFT</p>
        <h2>命式の初版解説文</h2>
      </div>
      <span class="balance-badge">検証用</span>
    </div>
    <p class="section-copy">この解説は、排盤結果からルールベースで作る初版文案です。吉凶を断定せず、日本ユーザーに命式の見方を説明する目的で配置しています。</p>
    ${renderInterpretationSummary(result)}
    ${renderBalancingSection(result)}
    ${renderReadingSourceMap(result)}
    ${renderPillarSeatDetails(result)}
    ${renderMarriagePalaceDetail(result)}
    ${renderLifeThemeCards(result)}
    <p class="notice">注意: 現段階の解説は検証用です。出生時間不明、真太陽時、23:00 子時の流派差により、時柱や一部解釈は変わる可能性があります。</p>
  `;
}

function renderChartSection(result) {
  return `
    <div class="card-head">
      <div>
        <p class="card-kicker">BASE / CHART</p>
        <h2>命式盤をそのまま確認する</h2>
      </div>
    </div>
    <p class="section-copy">まずは四柱そのものを確認し、そのあとに納音・空亡・地勢・自坐の補足を見られるようにしています。</p>
    ${renderPillarCards(result)}
    <div class="chart-shell">
      ${renderTraditionalChart(result)}
    </div>
    ${renderAuxiliaryCard(result)}
  `;
}

function renderMetaSection(result) {
  return `
    <div class="card-head">
      <div>
        <p class="card-kicker">META / NOTES</p>
        <h2>計算条件と注意事項</h2>
      </div>
    </div>
    <div class="meta-stack">
      ${renderMeta(result)}
      ${renderWarnings(result)}
    </div>
  `;
}

function renderPageHero({ kicker, title, text, items = [] }) {
  return `
    <div class="page-hero">
      <div>
        <p class="card-kicker">${escapeHtml(kicker)}</p>
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(text)}</p>
      </div>
      <div class="page-hero-list">
        ${items.map((item) => `
          <span>
            <strong>${escapeHtml(item.label)}</strong>
            ${escapeHtml(item.text)}
          </span>
        `).join("")}
      </div>
    </div>
  `;
}

function renderMeishikiSummaryCards(result) {
  const meta = result.calculationMeta;
  const location = displayLocationLabel(meta.location);
  return `
    <div class="summary-mini-grid">
      <article class="mini-reading-card">
        <span class="metric-label">日主</span>
        <strong class="metric-value ${elementClass(result.pillars.day.element.stem)}">${escapeHtml(dayMasterLabel(result))}</strong>
        <p>本人の核として、詳解と運勢読みの中心に置く要素です。</p>
      </article>
      <article class="mini-reading-card">
        <span class="metric-label">主導五行</span>
        <strong class="metric-value">${escapeHtml((result.fiveElements.dominant || strongestElements(result.fiveElements.counts)).join("・"))}</strong>
        <p>${escapeHtml(`平衡スコア ${result.fiveElements.balanceScore ?? "—"}。詳細ページで偏りと補い方を確認します。`)}</p>
      </article>
      <article class="mini-reading-card">
        <span class="metric-label">出生地・時刻</span>
        <strong class="metric-value compact-value">${escapeHtml(location || "—")}</strong>
        <p>${escapeHtml(formatDateTimeLabel(meta.effectiveBirthDateTime))}</p>
      </article>
    </div>
  `;
}

function renderMeishikiPage(result) {
  return `
    <div class="page-stack">
      ${renderPageHero({
        kicker: "PAGE 1 / MEISHIKI",
        title: "命式",
        text: "まず四柱そのものを確認するページです。年柱・月柱・日柱・時柱、日主、基本条件をここに集約します。",
        items: [
          { label: "四柱", text: "年・月・日・時の干支" },
          { label: "日主", text: "本人の核" },
          { label: "基準", text: "時刻・出生地・補正" },
        ],
      })}
      ${renderMeishikiSummaryCards(result)}
      <section class="page-block">
        ${renderChartSection(result)}
      </section>
      <section class="page-block">
        ${renderDayMasterSection(result)}
      </section>
    </div>
  `;
}

function renderDetailPage(result) {
  return `
    <div class="page-stack">
      ${renderPageHero({
        kicker: "PAGE 2 / DETAIL",
        title: "命式詳細",
        text: "命式を読み解くための詳解ページです。五行、十神、読み取り位置、四柱の坐、婚姻宮などをここで展開します。",
        items: [
          { label: "五行", text: "偏りと補い方" },
          { label: "十神", text: "役割とテーマ" },
          { label: "定位", text: "どこを根拠に読むか" },
        ],
      })}
      <section class="page-block">
        ${renderFiveElementsSection(result)}
      </section>
      <section class="page-block">
        ${renderStructureSection(result)}
      </section>
      <section class="page-block">
        ${renderInterpretationSection(result)}
      </section>
      <section class="page-block">
        ${renderMetaSection(result)}
      </section>
    </div>
  `;
}

function renderLuckPage(result) {
  return `
    <div class="page-stack">
      ${renderPageHero({
        kicker: "PAGE 3 / LUCK",
        title: "大運流年",
        text: "命式に時間の流れを重ねるページです。十年単位の大運と、年・月・日の運勢周期を初版として並べます。",
        items: [
          { label: "大運", text: "十年単位の流れ" },
          { label: "流年", text: "年ごとの干支" },
          { label: "流月・流日", text: "近い周期の確認" },
        ],
      })}
      ${renderLuckOverviewCards(result)}
      <section class="page-block">
        ${renderLuckCyclesSection(result)}
      </section>
    </div>
  `;
}

function directionLabel(value) {
  if (value === "forward") return "順行";
  if (value === "backward") return "逆行";
  return "未判定";
}

function genderLabel(value) {
  if (value === "male") return "男性";
  if (value === "female") return "女性";
  return "未指定";
}

function renderLuckTable(items, columns) {
  if (!items?.length) {
    return `<p class="notice">表示できるデータがありません。</p>`;
  }
  return `
    <div class="table-wrap luck-table-wrap">
      <table class="luck-table">
        <thead>
          <tr>${columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${items.map((item) => `
            <tr>${columns.map((column) => `<td>${escapeHtml(column.value(item))}</td>`).join("")}</tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function findCurrentDecadeFortune(result) {
  const decade = result.luckCycles?.decadeFortunes;
  const targetYear = result.luckCycles?.target?.year;
  if (!decade || decade.status !== "ok" || !targetYear) return null;
  return (decade.items || []).find((item) => item.startYear <= targetYear && targetYear <= item.endYear) || null;
}

function renderLuckOverviewCards(result) {
  const luck = result.luckCycles || {};
  const currentDecade = findCurrentDecadeFortune(result);
  const annual = luck.annualFortunes?.[0];
  const monthly = luck.monthlyFortunes?.[0];
  const daily = luck.dailyFortunes?.[0];
  const cards = [
    {
      label: "現在の大運",
      value: currentDecade?.name || "未判定",
      body: currentDecade
        ? `${currentDecade.startYear}-${currentDecade.endYear} / ${currentDecade.pillar?.heavenlyTenGod || "十神未判定"}`
        : "性別を選ぶと十年運を定位します。",
      element: currentDecade?.pillar?.element?.stem,
    },
    {
      label: "流年",
      value: annual?.name || "—",
      body: annual ? `${annual.year}年 / ${annual.pillar.element.stem}${annual.pillar.element.branch}` : "対象年を確認します。",
      element: annual?.pillar?.element?.stem,
    },
    {
      label: "流月",
      value: monthly?.name || "—",
      body: monthly ? `${monthly.index}月 / 節入 ${monthly.solarStartDate}` : "対象月を確認します。",
      element: monthly?.pillar?.element?.stem,
    },
    {
      label: "流日",
      value: daily?.name || "—",
      body: daily ? `${daily.date} / ${daily.pillar.element.stem}${daily.pillar.element.branch}` : "対象日を確認します。",
      element: daily?.pillar?.element?.stem,
    },
  ];
  return `
    <div class="summary-mini-grid luck-overview-grid">
      ${cards.map((card) => `
        <article class="mini-reading-card">
          <span class="metric-label">${escapeHtml(card.label)}</span>
          <strong class="metric-value ${card.element ? elementClass(card.element) : ""}">${escapeHtml(card.value)}</strong>
          <p>${escapeHtml(card.body)}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function renderDecadeFortunes(result) {
  const decade = result.luckCycles?.decadeFortunes;
  if (!decade || decade.status !== "ok") {
    return `
      <div class="soft-panel reading-panel">
        <div class="card-subhead">
          <h3>大運</h3>
          <p>大運は性別によって順行・逆行が変わります。</p>
        </div>
        <p class="notice">${escapeHtml(decade?.note || "性別を選択して再計算してください。")}</p>
      </div>
    `;
  }
  return `
    <div class="soft-panel reading-panel">
      <div class="card-subhead">
        <h3>大運</h3>
        <p>${escapeHtml(`${genderLabel(decade.gender)} / ${directionLabel(decade.direction)} / 起運 ${decade.startTime}`)}</p>
      </div>
      ${renderLuckTable(decade.items, [
        { label: "順", value: (item) => item.index },
        { label: "大運", value: (item) => item.name },
        { label: "年齢", value: (item) => `${item.startAge}-${item.endAge}歳` },
        { label: "期間", value: (item) => `${item.startYear}-${item.endYear}` },
        { label: "十神", value: (item) => item.pillar.heavenlyTenGod || "—" },
      ])}
    </div>
  `;
}

function renderLuckCyclesSection(result) {
  const luck = result.luckCycles || {};
  const target = luck.target || {};
  return `
    <div class="card-head">
      <div>
        <p class="card-kicker">LUCK / CYCLES</p>
        <h2>大運・流年・流月・流日の初版排盤</h2>
      </div>
      <span class="balance-badge">${escapeHtml(`${target.year || "—"}年`)}</span>
    </div>
    <p class="section-copy">ここでは運勢周期の干支を検証用に並べます。解釈文への反映は、計算結果の確認後に段階的に進めます。</p>
    ${renderDecadeFortunes(result)}
    <div class="luck-grid">
      <article class="detail-card">
        <div class="card-subhead">
          <h3>流年</h3>
          <p>${escapeHtml(`${target.year || "—"}年から10年`)}</p>
        </div>
        ${renderLuckTable(luck.annualFortunes || [], [
          { label: "年", value: (item) => item.year },
          { label: "干支", value: (item) => item.name },
          { label: "五行", value: (item) => `${item.pillar.element.stem}/${item.pillar.element.branch}` },
        ])}
      </article>
      <article class="detail-card">
        <div class="card-subhead">
          <h3>流月</h3>
          <p>${escapeHtml(`${target.year || "—"}年の節月`)}</p>
        </div>
        ${renderLuckTable(luck.monthlyFortunes || [], [
          { label: "月", value: (item) => item.index },
          { label: "開始", value: (item) => item.solarStartDate },
          { label: "干支", value: (item) => item.name },
        ])}
      </article>
      <article class="detail-card">
        <div class="card-subhead">
          <h3>流日</h3>
          <p>${escapeHtml(`${target.year || "—"}-${pad(target.month || 1)}-${pad(target.day || 1)} から14日`)}</p>
        </div>
        ${renderLuckTable(luck.dailyFortunes || [], [
          { label: "日付", value: (item) => item.date },
          { label: "干支", value: (item) => item.name },
          { label: "五行", value: (item) => `${item.pillar.element.stem}/${item.pillar.element.branch}` },
        ])}
      </article>
    </div>
    ${(luck.notes || []).map((note) => `<p class="notice">${escapeHtml(note)}</p>`).join("")}
  `;
}

function renderAuxiliaryCard(result) {
  return `
    <div class="detail-grid auxiliary-grid">
      ${PILLAR_KEYS.map((key) => {
        const pillar = result.pillars[key];
        return `
          <article class="detail-card compact-pillar">
            <div class="card-subhead">
              <h3>${escapeHtml(PILLAR_LABELS[key])}</h3>
              <p>${escapeHtml(pillar.text)}</p>
            </div>
            <div class="mini-meta-list">
              <span><strong>納音</strong>${escapeHtml(pillar.naYin || "—")}</span>
              <span><strong>空亡</strong>${escapeHtml((pillar.voidBranches || []).join("") || "—")}</span>
              <span><strong>地勢</strong>${escapeHtml(pillar.terrainByDay || "—")}</span>
              <span><strong>自坐</strong>${escapeHtml(pillar.terrainSelf || "—")}</span>
            </div>
          </article>
        `;
      }).join("")}
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
    ${renderSectionRail()}

    <section id="page-meishiki" class="section insight-card">
      ${renderMeishikiPage(result)}
    </section>

    <section id="page-detail" class="section insight-card">
      ${renderDetailPage(result)}
    </section>

    <section id="page-luck" class="section insight-card">
      ${renderLuckPage(result)}
    </section>
  `;
  bindResultRail();
  syncResultPresentation(false);
  if (URL_PARAMS.get("autocalc") === "1") {
    window.setTimeout(() => {
      activateResultSection(activeResultSectionId, true);
    }, 80);
  }
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

function bindResultRail() {
  const rail = element("result").querySelector(".result-rail");
  if (!rail || rail.dataset.bound === "true") return;
  rail.dataset.bound = "true";
  rail.addEventListener("click", (event) => {
    const button = event.target.closest(".rail-link[data-target]");
    if (!button) return;
    activateResultSection(button.dataset.target, true);
  });
}

function activateResultSection(targetId, shouldScroll = true) {
  activeResultSectionId = resolveResultSectionId(targetId);
  syncResultPresentation(shouldScroll);
}

function syncResultPresentation(shouldScroll = false) {
  const result = element("result");
  if (!result || !result.querySelector(".result-rail")) return;

  const mobileTabbed = MOBILE_RESULTS_MEDIA.matches;
  result.classList.toggle("mobile-tabbed", mobileTabbed);
  result.classList.add("paged-results");

  RESULT_SECTION_TABS.forEach((item) => {
    const section = element(item.id);
    const button = result.querySelector(`.rail-link[data-target="${item.id}"]`);
    const isActive = item.id === activeResultSectionId;
    if (section) {
      section.classList.toggle("is-active", isActive);
      section.toggleAttribute("hidden", !isActive);
    }
    if (button) {
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    }
  });

  if (shouldScroll) {
    const activeSection = element(activeResultSectionId);
    if (activeSection) {
      activeSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
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
  ["birth-date", "birth-time", "gender", "municipality", "time-mode", "late-zi-mode"].forEach((id) => {
    element(id).addEventListener("change", markInputChanged);
  });
}

function init() {
  populateLocationControls();
  syncBirthTimeField();
  bindEvents();
  renderInitialState();
  setStatus("未作成");
  MOBILE_RESULTS_MEDIA.addEventListener("change", () => syncResultPresentation(false));
  if (URL_PARAMS.get("autocalc") === "1") {
    window.setTimeout(() => {
      calculate();
    }, 120);
  }
}

init();
