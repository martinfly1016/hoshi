/* 鑑定の儀 — free reading form */

const SHI_HOURS = [
  { ji: '子', hours: '23–01', en: 'NE' },
  { ji: '丑', hours: '01–03', en: 'OX' },
  { ji: '寅', hours: '03–05', en: 'TR' },
  { ji: '卯', hours: '05–07', en: 'RB' },
  { ji: '辰', hours: '07–09', en: 'DR' },
  { ji: '巳', hours: '09–11', en: 'SN' },
  { ji: '午', hours: '11–13', en: 'HR' },
  { ji: '未', hours: '13–15', en: 'SH' },
  { ji: '申', hours: '15–17', en: 'MK' },
  { ji: '酉', hours: '17–19', en: 'RT' },
  { ji: '戌', hours: '19–21', en: 'DG' },
  { ji: '亥', hours: '21–23', en: 'PG' },
];

const PROVINCES = [
  '京都府','東京都','大阪府','神奈川県','北海道','奈良県','兵庫県',
  '愛知県','福岡県','沖縄県','宮城県','石川県','長野県','広島県',
];

const FALLBACK_LOCATIONS = [
  { id: 'tokyo', label: '日本 / 東京都 千代田区', timezone: 'Asia/Tokyo', utcOffset: 9, latitude: 35.6812, longitude: 139.7671 },
  { id: 'kyoto', label: '日本 / 京都府 京都市', timezone: 'Asia/Tokyo', utcOffset: 9, latitude: 35.0116, longitude: 135.7681 },
  { id: 'osaka', label: '日本 / 大阪府 大阪市', timezone: 'Asia/Tokyo', utcOffset: 9, latitude: 34.6937, longitude: 135.5023 },
  { id: 'kanagawa', label: '日本 / 神奈川県 横浜市', timezone: 'Asia/Tokyo', utcOffset: 9, latitude: 35.4437, longitude: 139.638 },
  { id: 'hokkaido', label: '日本 / 北海道 札幌市', timezone: 'Asia/Tokyo', utcOffset: 9, latitude: 43.0642, longitude: 141.3469 },
];

function calcApi() {
  return window.HOSHI_CALC || null;
}

function locationOptions() {
  return calcApi()?.LOCATIONS || FALLBACK_LOCATIONS;
}

function findLocation(id) {
  if (id === 'overseas') {
    return { id: 'overseas', label: '海外', timezone: 'Asia/Hong_Kong', utcOffset: 8, latitude: 22.3193, longitude: 114.1694 };
  }
  return locationOptions().find((location) => location.id === id) || locationOptions()[0];
}

function stripJapan(label) {
  return String(label || '').replace(/^日本\s*\/\s*/, '');
}

function representativeTime(shi) {
  const map = {
    子: '00:00',
    丑: '02:00',
    寅: '04:00',
    卯: '06:00',
    辰: '08:00',
    巳: '10:00',
    午: '12:00',
    未: '14:00',
    申: '16:00',
    酉: '18:00',
    戌: '20:00',
    亥: '22:00',
  };
  return map[shi] || '12:00';
}

function FormField({ num, ja, romaji, hint, children }) {
  return (
    <div className="field">
      <div className="field-key">
        <span className="num">{num}</span>
        <span className="ja">{ja}</span>
        <span className="num" style={{ marginTop: 2 }}>{romaji}</span>
        {hint && <span className="hint">{hint}</span>}
      </div>
      <div className="field-input">{children}</div>
    </div>
  );
}

function Rite({ onBack, onSubmitDone }) {
  const [name, setName] = React.useState('');
  const [gender, setGender] = React.useState('gen');
  const [calendar, setCalendar] = React.useState('seireki'); 
  const [year, setYear]   = React.useState('');
  const [month, setMonth] = React.useState('');
  const [day, setDay]     = React.useState('');
  const [shi, setShi] = React.useState('');
  const [birthTime, setBirthTime] = React.useState('12:00');
  const [unsure, setUnsure] = React.useState(false);
  const [locationId, setLocationId] = React.useState('tokyo');
  const [city, setCity] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState('');
  const [showStamp, setShowStamp] = React.useState(false);

  const locations = locationOptions();
  const selectedLocation = findLocation(locationId);
  const valid = year && month && day && locationId && (unsure || birthTime || shi);

  const submit = () => {
    if (!valid || busy) return;
    const api = calcApi();
    if (!api?.calculateShichusuimei) {
      setError('計算ライブラリの読み込みが完了していません。数秒後に再度お試しください。');
      return;
    }
    setBusy(true);
    setError('');
    setShowStamp(true);
    window.setTimeout(() => {
      try {
        const input = {
          date: (() => {
            let y = parseInt(year, 10);
            if (!isNaN(y)) {
              if (calendar === 'showa') y += 1925;
              else if (calendar === 'heisei') y += 1988;
              else if (calendar === 'reiwa') y += 2018;
            }
            return `${String(y).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          })(),
          timeKnown: !unsure,
          time: unsure ? '12:00' : (birthTime || representativeTime(shi)),
          locationId: selectedLocation.id,
          locationOverride: selectedLocation,
          timeCalculationMode: 'true_solar_time',
          lateZiHourMode: 'same_day',
          gender: gender === 'yang' ? 'male' : gender === 'yin' ? 'female' : 'unspecified',
        };
        const calculated = api.calculateShichusuimei(input);
        const res = { input, chart: calculated, profile: { name, gender, location: selectedLocation, shi, unsure } };
        setResult(res);
        setDone(true);
        if (onSubmitDone) onSubmitDone(res);
      } catch (err) {
        setDone(false);
        setResult(null);
        setError(err?.message || '計算中にエラーが発生しました。入力内容をご確認ください。');
      } finally {
        setShowStamp(false);
        setBusy(false);
      }
    }, 1900);
  };

  return (
    <section className="rite" data-screen-label="02 命式作成">
      <aside className="rite-side">
        <div className="kanji">命式作成</div>
        <div className="label">MEISHIKI CREATION</div>
        <div className="seal-stack">
          <div><span className="num">壹</span>　お名前と性別</div>
          <div><span className="num">貳</span>　生年月日</div>
          <div><span className="num">參</span>　出生時間</div>
          <div><span className="num">肆</span>　出生地</div>
        </div>
      </aside>

      <div className="rite-main">
        <div className="rite-intro">
          <h2>生年月日から、あなたの命式を作成します</h2>
          <p>
            四柱推命では、生年月日・出生時間・出生地から命式を作ります。
          </p>
        </div>

        <FormField num="壹 / 一" ja="お名前" romaji="ONAMAE"
          hint="※ 省略可。結果画面での呼び名として使用します">
          <div className="input-line">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="例 ）田中 太郎" />
          </div>
        </FormField>

        <FormField num="壹 / 二" ja="性 別" romaji="SEIBETSU"
          hint="※ 大運（10年ごとの運勢）の順逆計算に影響します">
          <div className="gender-row">
            {[
              { key: 'yang', ja: '男性 (陽)', sym: '☰' },
              { key: 'yin',  ja: '女性 (陰)', sym: '☷' },
              { key: 'gen',  ja: '選択しない', sym: '☯' },
            ].map(g => (
              <button key={g.key} className={`gender-btn ${gender === g.key ? 'on' : ''}`} onClick={() => setGender(g.key)}>
                <span className="glyph">{g.sym}</span>
                <span>{g.ja}</span>
              </button>
            ))}
          </div>
        </FormField>

        <FormField num="貳 / 一" ja="生年月日" romaji="SEINENGAPPI"
          hint="誕生日の暦（西暦または旧暦）を選択し、入力してください">
          <div className="toggle-row">
            {['seireki','showa','heisei','reiwa'].map(c => (
               <button key={c} className={calendar === c ? 'on' : ''} onClick={() => setCalendar(c)}>
                 {c === 'seireki' ? '西暦' : (c === 'showa' ? '昭和' : (c === 'heisei' ? '平成' : '令和'))}
               </button>
            ))}
          </div>
          <div className="input-row">
            <div className="input-line with-mark" data-mark="年 / Y">
              <select value={year} onChange={e => setYear(e.target.value)}>
                <option value="" disabled>--</option>
                {calendar === 'seireki' && Array.from({length: 107}, (_, i) => 2026 - i).map(y => <option key={y} value={y}>{y}</option>)}
                {calendar === 'showa' && Array.from({length: 64}, (_, i) => 64 - i).map(y => <option key={y} value={y}>{y}</option>)}
                {calendar === 'heisei' && Array.from({length: 31}, (_, i) => 31 - i).map(y => <option key={y} value={y}>{y}</option>)}
                {calendar === 'reiwa' && Array.from({length: 8}, (_, i) => 8 - i).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="input-line with-mark" data-mark="月 / M">
              <select value={month} onChange={e => setMonth(e.target.value)}>
                <option value="" disabled>--</option>
                {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="input-line with-mark" data-mark="日 / D">
              <select value={day} onChange={e => setDay(e.target.value)}>
                <option value="" disabled>--</option>
                {Array.from({length: 31}, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </FormField>

        <FormField num="參 / 一" ja="出生時間" romaji="SHUSSEIJIKAN"
          hint="該当する出生時間（時辰）を選択してください。不明な場合は「時間不明」を選択してください">
          <div className="input-line">
            <select value={unsure ? 'unsure' : shi} onChange={e => {
                const val = e.target.value;
                if (val === 'unsure') { setUnsure(true); setShi(''); setBirthTime('12:00'); }
                else { setUnsure(false); setShi(val); setBirthTime(representativeTime(val)); }
              }}>
              <option value="" disabled>-- 時辰を選択 --</option>
              {SHI_HOURS.map(s => <option key={s.ji} value={s.ji}>{s.ji}の刻 ({s.hours.replace('–', ':00 ～ ') + ':00'})</option>)}
              <option value="unsure">時間不明</option>
            </select>
          </div>
        </FormField>

        <FormField num="肆 / 一" ja="出生地" romaji="SHUSSEICHI"
          hint="正確な自然時（太陽の南中時刻）を計算するための時差補正に使用します（※海外は香港時間を基準とします）">
          <div className="input-line">
            <select value={locationId} onChange={e => setLocationId(e.target.value)}>
              {locations.filter(l => l.label.startsWith('日本')).map(l => <option key={l.id} value={l.id}>{stripJapan(l.label).split(' ')[0]}</option>)}
              <option value="overseas">海外</option>
            </select>
          </div>
        </FormField>

        <div className="rite-submit">
          <div className="legal">
            出生時間が不明でも鑑定できます。その場合、時柱は12:00の仮計算として表示します。<br/>
            <span style={{ fontSize: '0.85em', color: 'var(--ink-3)', display: 'block', marginTop: '8px' }}>
              ※ 入力内容はこの端末上で計算し、サーバーには保存しません。
            </span>
          </div>
          <button className={`submit-btn ${busy ? 'busy' : ''}`} disabled={!valid || busy} onClick={submit}>
            <span>無料で命式を見る</span>
            <span className="arrow"></span>
            <span className="seal-mini">占</span>
          </button>
        </div>
        {error && <div className="notice result-error">{error}</div>}
        <div style={{ marginTop: 56, textAlign: 'center' }}>
          <button onClick={onBack} style={{ fontSize: 11, letterSpacing: '0.4em', color: 'var(--ink-3)', fontFamily: 'var(--f-mono)' }}>← 序章へ戻る</button>
        </div>
      </div>
      <div className={`seal-overlay ${showStamp ? 'show' : ''}`}>
        <div className="stamp">命</div>
        <div className="caption">星辰、命式を顕す</div>
      </div>
    </section>
  );
}

const PILLAR_KEYS = ['year', 'month', 'day', 'hour'];
const PILLAR_LABELS = { year: '年柱', month: '月柱', day: '日柱', hour: '時柱' };
const STEM_ICONS = { '甲': '🌳', '乙': '🌿', '丙': '☀️', '丁': '🕯️', '戊': '⛰️', '己': '🪴', '庚': '⚔️', '辛': '✨', '壬': '🌊', '癸': '💧' };
const BRANCH_READING = { '子': '万物が芽生え始める時期。', '丑': '粘り強さと着実さを表します。', '寅': '勢いと開拓精神を表します。', '卯': '柔軟性と協調性を表します。', '辰': '変化と理想を表します。', '巳': '情熱と華やかさを表します。', '午': '求心力と率直さを表します。', '未': '包容力と安定を表します。', '申': '決断力と合理性を表します。', '酉': '洗練された感性と美意識。', '戌': '誠実さと守りの力。', '亥': '自由と構想力を表します。' };
const PILLAR_READING = {
  year: { icon: '根', title: '年柱はルーツと外側の環境', text: '家族、育った環境、社会から見えやすい雰囲気を見ます。' },
  month: { icon: '場', title: '月柱は社会性と仕事の土台', text: '季節の力が強く出る柱で、仕事や役割、社会での使い方を見ます。' },
  day: { icon: '我', title: '日柱は本人と大切な関係', text: '日主を含む中心の柱です。本人の核と、近い関係性の傾向を見ます。' },
  hour: { icon: '芽', title: '時柱は未来と内側の可能性', text: '内面、晩年、これから育つテーマを見ます。' },
};
const ELEMENT_LABELS = ['木', '火', '土', '金', '水'];
const ELEMENT_CLASS = { 木: 'wood', 火: 'fire', 土: 'earth', 金: 'metal', 水: 'water' };
const STEM_YINYANG = { 甲: '陽', 乙: '陰', 丙: '陽', 丁: '陰', 戊: '陽', 己: '陰', 庚: '陽', 辛: '陰', 壬: '陽', 癸: '陰' };
const STEM_READING = {
  甲: { title: '大樹のようにまっすぐ伸びる人', text: '理想を掲げ、時間をかけて形にしていく力があります。', tags: ['誠実', '成長志向'] },
  乙: { title: '草花のようにしなやかに場を読む人', text: '柔らかな感受性と調整力があります。', tags: ['柔軟', '美意識'] },
  丙: { title: '太陽のように場を明るくする人', text: '明るさと表現力で人を惹きつけます。', tags: ['表現力', '率直'] },
  丁: { title: '灯火のように心を照らす人', text: '細やかな洞察と集中力があります。', tags: ['洞察', '集中'] },
  戊: { title: '山のように安定をつくる人', text: '物事を受け止め、場の土台を整える力があります。', tags: ['安定', '責任感'] },
  己: { title: '田畑のように人や環境を育てる人', text: '現実感覚と育成力があります。', tags: ['育成', '実務'] },
  庚: { title: '鋼のように道を切り開く人', text: '決断力と突破力があります。', tags: ['決断', '突破'] },
  辛: { title: '宝石のように磨かれて光る人', text: '繊細な美意識と基準の高さがあります。', tags: ['美意識', '洗練'] },
  壬: { title: '大河のように広がる人', text: '視野が広く、変化に乗る力があります。', tags: ['自由', '構想'] },
  癸: { title: '雨露のように静かに満たす人', text: '観察力と知性があり、本質へ近づくタイプです。', tags: ['知性', '内省'] },
};
const TEN_GOD_READING = {
  比肩: { tags: ['自立', '対等'], text: '自分の判断で立ち、同じ立場の相手と並走しやすい星です。' },
  劫财: { tags: ['競争', '突破'], text: '競争心と突破力が前に出やすく、人を動かしながら進む星です。' },
  食神: { tags: ['表現', '余裕'], text: '自然体の表現、楽しさ、育てる力として出やすい星です。' },
  伤官: { tags: ['批評', '才気'], text: '感覚が鋭く、型を破って新しい価値を生む星です。' },
  偏财: { tags: ['機動力', '対人'], text: '人や機会に素早く反応し、流れをつかみにいく星です。' },
  正财: { tags: ['実務', '管理'], text: '現実感覚が強く、着実に管理しながら成果へつなぐ星です。' },
  七杀: { tags: ['緊張感', '決断'], text: 'プレッシャーの中で判断し、厳しい局面を切り抜ける力です。' },
  正官: { tags: ['規律', '責任'], text: '秩序や役割意識を重んじ、きちんと形にしていく星です。' },
  偏印: { tags: ['直感', '独自視点'], text: '独自の見方やひらめきで情報を再解釈しやすい星です。' },
  正印: { tags: ['学習', '保護'], text: '知識や型を吸収し、守られながら伸びやすい星です。' },
};
const TEN_GOD_GROUPS = {
  比肩: { role: '自分軸', icon: '自' }, 劫财: { role: '競争', icon: '競' },
  食神: { role: '表現', icon: '表' }, 伤官: { role: '感性', icon: '鋭' },
  偏财: { role: '機会', icon: '機' }, 正财: { role: '管理', icon: '積' },
  七杀: { role: '決断', icon: '決' }, 正官: { role: '信頼', icon: '秩' },
  偏印: { role: '直感', icon: '直' }, 正印: { role: '学習', icon: '学' },
};

function getShenSha(targetBranch, dayStem, yearBranch, dayBranch) {
  const result = [];
  const tianYiMap = { '甲': ['丑','未'], '戊': ['丑','未'], '庚': ['丑','未'], '乙': ['子','申'], '己': ['子','申'], '丙': ['亥','酉'], '丁': ['亥','酉'], '壬': ['卯','巳'], '癸': ['卯','巳'], '辛': ['寅','午'] };
  if (tianYiMap[dayStem]?.includes(targetBranch)) result.push('天乙貴人');
  const hongLuanMap = { '子': '卯', '丑': '寅', '寅': '丑', '卯': '子', '辰': '亥', '巳': '戌', '午': '酉', '未': '申', '申': '未', '酉': '午', '戌': '巳', '亥': '辰' };
  if (hongLuanMap[yearBranch] === targetBranch) result.push('紅鸞');
  const seasonalGroups = { '寅':'spring','卯':'spring','辰':'spring','巳':'summer','午':'summer','未':'summer','申':'autumn','酉':'autumn','戌':'autumn','亥':'winter','子':'winter','丑':'winter' };
  const season = seasonalGroups[yearBranch];
  if (season === 'spring' && targetBranch === '巳') result.push('孤辰');
  if (season === 'spring' && targetBranch === '丑') result.push('寡宿');
  if (season === 'summer' && targetBranch === '申') result.push('孤辰');
  if (season === 'summer' && targetBranch === '辰') result.push('寡宿');
  if (season === 'autumn' && targetBranch === '亥') result.push('孤辰');
  if (season === 'autumn' && targetBranch === '未') result.push('寡宿');
  if (season === 'winter' && targetBranch === '寅') result.push('孤辰');
  if (season === 'winter' && targetBranch === '戌') result.push('寡宿');
  return [...new Set(result)];
}

function elementClass(el) { return ELEMENT_CLASS[el] || 'neutral'; }
function elementPercentages(res) {
  if (res.fiveElements?.percentages) return res.fiveElements.percentages;
  const counts = res.fiveElements.counts;
  const total = Math.max(1, Object.values(counts).reduce((s,v) => s+v, 0));
  return Object.fromEntries(ELEMENT_LABELS.map(n => [n, Math.round((counts[n]||0)/total*100)]));
}
function formatDateTimeLabel(v) { return v || '—'; }
function collectTenGods(res) {
  const counts = new Map();
  PILLAR_KEYS.forEach(k => {
    const god = res.tenGods[k];
    if (god && god !== '日主') counts.set(god, (counts.get(god)||0)+1);
  });
  return Array.from(counts.entries()).sort((a,b) => b[1]-a[1]);
}

function strongestElements(calc) {
  if (calc.fiveElements?.dominant?.length) return calc.fiveElements.dominant;
  const entries = Object.entries(calc.fiveElements.counts || {});
  const max = Math.max(...entries.map(([, value]) => value));
  return entries.filter(([, value]) => value === max).map(([name]) => name);
}

function supportElements(calc) {
  if (calc.fiveElements?.missing?.length) return calc.fiveElements.missing;
  if (calc.fiveElements?.weak?.length) return calc.fiveElements.weak;
  const entries = Object.entries(calc.fiveElements.counts || {});
  const min = Math.min(...entries.map(([, value]) => value));
  return entries.filter(([, value]) => value === min).map(([name]) => name);
}

function currentDecadeFortune(decade, targetYear) {
  if (!decade || decade.status !== 'ok') return null;
  const items = decade.items || [];
  return items.find((item) => item.startYear <= targetYear && targetYear <= item.endYear) || items[0];
}

function fortuneTrendTag(calc) {
  const luck = calc.luckCycles || {};
  const current = currentDecadeFortune(luck.decadeFortunes, luck.target?.year || new Date().getFullYear());
  if (!current) return '大運確認';
  if (current.index >= 4) return '大器晩成';
  if (current.index >= 3) return '中盤伸長';
  return '早期展開';
}

function buildUserReadingTags(calc, tenGods) {
  const stem = STEM_READING[calc.dayMaster] || { text: '', tags: [] };
  const dominant = strongestElements(calc);
  const support = supportElements(calc);
  const current = currentDecadeFortune(calc.luckCycles?.decadeFortunes, calc.luckCycles?.target?.year || new Date().getFullYear());
  const god = tenGods[0]?.[0];
  return [
    {
      kind: 'pattern',
      label: '格局',
      value: calc.pattern?.name || '格局',
      detail: calc.pattern?.text || '月令と天干から命式の大枠を見ます。',
      evidence: '月令・天干',
      action: 'insight',
    },
    {
      kind: 'strength',
      label: '身強弱',
      value: calc.strength?.status || '未判定',
      detail: calc.strength?.text || '日主の勢いを月令と五行構成から見ます。',
      evidence: `日主 ${calc.dayMaster} / 月支 ${calc.pillars.month.branch}`,
      action: 'daymaster',
    },
    {
      kind: 'core',
      label: '性格',
      value: `${calc.dayMaster}${calc.pillars.day.element.stem}`,
      detail: stem.text,
      evidence: '日柱天干',
      action: 'daymaster',
    },
    {
      kind: 'element',
      label: '强五行',
      value: dominant.join('・'),
      detail: `${dominant.join('・')} が命式全体で前に出やすい五行です。`,
      evidence: '天干・藏干・月令補正',
      action: 'elements',
    },
    {
      kind: calc.fiveElements?.missing?.length ? 'warning' : 'support',
      label: calc.fiveElements?.missing?.length ? '缺五行' : '補五行',
      value: support.join('・'),
      detail: `${support.join('・')} は意識して補うと全体が整いやすい候補です。`,
      evidence: '五行構成比',
      action: 'elements',
    },
    {
      kind: 'support',
      label: '好运来源',
      value: [calc.yongShen?.primary, calc.yongShen?.secondary].filter(Boolean).join('・') || '用神',
      detail: calc.yongShen?.text || '命式の偏りを整える要素を見ます。',
      evidence: '調候・用神',
      action: 'insight',
    },
    {
      kind: 'god',
      label: '主要课题',
      value: god || '十神',
      detail: god ? TEN_GOD_READING[god]?.text : '命式で重なる十神テーマです。',
      evidence: god ? `十神出現 ${tenGods[0]?.[1] || 0}` : '十神',
      action: 'insight',
    },
    {
      kind: 'source',
      label: '婚姻宮',
      value: `日支 ${calc.pillars.day.branch}`,
      detail: '親密な関係や婚姻の読みは、日柱の地支を中心に見ます。',
      evidence: `日柱 ${calc.pillars.day.text}`,
      action: 'marriage',
    },
    {
      kind: 'trend',
      label: '走势',
      value: fortuneTrendTag(calc),
      detail: current ? `現在は ${current.name}（${current.startYear}-${current.endYear}）の大運です。` : '性別を選ぶと大運の流れを定位できます。',
      evidence: current ? `大運 ${current.name}` : '大運未判定',
      action: 'fortune',
    },
  ];
}

function analyzeSynthesis(calculation, profile) {
  const dayBranch = calculation.pillars.day.branch;
  const gender = profile.gender;
  const tenGodsSet = new Set(collectTenGods(calculation).map(([god]) => god));
  const pattern = calculation.pattern?.name || '';
  const allShenSha = PILLAR_KEYS.flatMap(k => getShenSha(calculation.pillars[k].branch, calculation.dayMaster, calculation.pillars.year.branch, calculation.pillars.day.branch));
  
  const hasHongLuan = allShenSha.includes('紅鸞');
  const hasGuChen = allShenSha.includes('孤辰') || allShenSha.includes('寡宿');

  let marriagePoints = [];
  if (gender === 'female') {
    if (tenGodsSet.has('正官')) marriagePoints.push('命式内に「正官（夫の星）」があり、誠実な縁に恵まれやすい徳を持っています。');
    else if (tenGodsSet.has('七殺')) marriagePoints.push('「七殺」の影響が強く、ドラマチックで刺激的な関係を求める傾向にあります。');
    else marriagePoints.push('自立した個としての生き方を尊重し合える関係が幸福の鍵です。');
  } else if (gender === 'male') {
    if (tenGodsSet.has('正財')) marriagePoints.push('命式内に「正財（妻の星）」があり、家庭を基盤として運気を安定させる力があります。');
    else if (tenGodsSet.has('偏財')) marriagePoints.push('「偏財」が巡っており、華やかな対人関係の中から縁が広がりやすいタイプです。');
    else marriagePoints.push('共通の目的を持つことで絆が深まるパートナーシップが理想的です。');
  }
  marriagePoints.push(`配偶者の場所（日支）に「${dayBranch}」を宿しており、これが親密な関係での振る舞いを象徴します。`);
  if (hasHongLuan) marriagePoints.push('また「紅鸞」を宿しており、華やかな魅力と良縁に恵まれやすいでしょう。');
  if (hasGuChen) marriagePoints.push('一方で一人の時間を大切にする気質もあり、適度な距離感が関係維持のポイントです。');
  
  const career = `月支の「${calculation.pillars.month.branch}」と格局「${pattern}」が社会的な武器です。${calculation.strength?.status === '身強' ? '自ら主導権を握る環境' : '組織の中での専門的な役割'}で最も輝きます。`;
  return { marriage: marriagePoints.join(' '), career };
}

function WuxingDiagram({ dayElement, elementCounts }) {
  const ELEMENTS = [ { key: '火', color: 'var(--fire)' }, { key: '土', color: 'var(--earth)' }, { key: '金', color: 'var(--metal)' }, { key: '水', color: 'var(--water)' }, { key: '木', color: 'var(--wood)' } ];
  const cx = 200, cy = 200, r = 130;
  const nodes = ELEMENTS.map((el, i) => {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    return { ...el, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
  const getGodFamily = (targetElement) => {
    const wuxingCycle = ['木', '火', '土', '金', '水'];
    const idxDay = wuxingCycle.indexOf(dayElement);
    const idxTarget = wuxingCycle.indexOf(targetElement);
    const diff = (idxTarget - idxDay + 5) % 5;
    const families = ['比肩・劫財', '食神・傷官', '正財・偏財', '正官・七殺', '正印・偏印'];
    return families[diff] || '';
  };
  return (
    <div className="wuxing-diagram">
      <svg viewBox="0 0 400 400" aria-hidden="true" style={{ width: '100%', maxWidth: 400, margin: '0 auto', display: 'block', overflow: 'visible' }}>
        <polygon points={nodes.map(n => `${n.x},${n.y}`).join(' ')} fill="none" stroke="var(--rule-strong)" strokeWidth="2" strokeDasharray="4 6" />
        <polygon points={`${nodes[0].x},${nodes[0].y} ${nodes[2].x},${nodes[2].y} ${nodes[4].x},${nodes[4].y} ${nodes[1].x},${nodes[1].y} ${nodes[3].x},${nodes[3].y}`} fill="none" stroke="var(--rule)" strokeWidth="1.5" />
        {nodes.map(node => {
          const count = elementCounts[node.key] || 0;
          const isDayMaster = node.key === dayElement;
          return (
            <g key={node.key}>
              <circle cx={node.x} cy={node.y} r={isDayMaster ? 36 : 28} fill="var(--bg)" stroke={node.color} strokeWidth={isDayMaster ? 3 : 1.5} />
              <text x={node.x} y={node.y + 4} textAnchor="middle" fill={node.color} fontSize={isDayMaster ? 20 : 16} fontFamily="var(--f-display)">{node.key}</text>
              <circle cx={node.x + 22} cy={node.y - 22} r={10} fill={node.color} />
              <text x={node.x + 22} y={node.y - 18} textAnchor="middle" fill="var(--bg)" fontSize="10" fontWeight="bold">{count}</text>
              <text x={node.x} y={node.y + (isDayMaster ? 58 : 46)} textAnchor="middle" fill="var(--ink-2)" fontSize="11" fontFamily="var(--f-display)">{getGodFamily(node.key)}</text>
            </g>
          );
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--ink-3)" fontSize="13" letterSpacing="0.4em" fontFamily="var(--f-display)">五行生剋</text>
      </svg>
    </div>
  );
}

function UserTagIndex({ tags, onNavigate }) {
  return (
    <section className="user-tag-index">
      <div className="summary-kicker">命式タグ索引</div>
      <h2>重要な読みをタグで確認する</h2>
      <p>タグは単なるキーワードではなく、命式のどの部分から読んでいるかを示す入口です。クリックすると該当する説明へ移動します。</p>
      <div className="user-tag-row">
        {tags.map(tag => (
          <button key={`${tag.label}-${tag.value}`} className={`user-tag tag-${tag.kind}`} onClick={() => onNavigate(tag.action)}>
            <small>{tag.label}</small>
            <strong>{tag.value}</strong>
          </button>
        ))}
      </div>
      <div className="user-tag-detail-grid">
        {tags.map(tag => (
          <article key={`${tag.label}-${tag.value}-detail`} className="user-tag-detail">
            <div className="user-tag-detail-head">
              <span className={`user-tag tag-${tag.kind}`}>
                <small>{tag.label}</small>
                <strong>{tag.value}</strong>
              </span>
              <button onClick={() => onNavigate(tag.action)}>詳解へ</button>
            </div>
            <p>{tag.detail}</p>
            <em>{tag.evidence}</em>
          </article>
        ))}
      </div>
    </section>
  );
}

function PillarMeaningCards({ calculation, onFocus }) {
  return (
    <div className="pillar-meaning-grid" aria-label="四柱が表す人生領域">
      {['year', 'month', 'day', 'hour'].map((key) => {
        const guide = PILLAR_READING[key];
        const pillar = calculation.pillars[key];
        return (
          <article key={key} className={`pillar-meaning ${key === 'day' ? 'is-focus' : ''}`} onClick={() => onFocus(key)}>
            <div className="pillar-meaning-icon">{guide.icon}</div>
            <div>
              <span>{PILLAR_LABELS[key]} / {pillar.text}</span>
              <h3>{guide.title}</h3>
              <p>{guide.text}</p>
              <small>
                {key === 'year' && '家系・幼少期・外から見える印象'}
                {key === 'month' && '社会性・仕事環境・才能の使い方'}
                {key === 'day' && '本人の核・日主・婚姻宮'}
                {key === 'hour' && '内面・未来・晩年・子ども縁'}
              </small>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function ResultView({ id, name, calculation, profile, onBack, onShowFortune, onShowInsight }) {
  const [activePillar, setActivePillar] = React.useState(null);
  const synthesis = React.useMemo(() => analyzeSynthesis(calculation, profile), [calculation, profile]);
  const tenGods = collectTenGods(calculation);
  const stemReading = STEM_READING[calculation.dayMaster] || { title: '日主の説明', text: '' };
  const tags = buildUserReadingTags(calculation, tenGods);
  const percentages = elementPercentages(calculation);
  const shenShaSet = new Set();
  PILLAR_KEYS.forEach(k => getShenSha(calculation.pillars[k].branch, calculation.dayMaster, calculation.pillars.year.branch, calculation.pillars.day.branch).forEach(ss => shenShaSet.add(ss)));
  const uniqueShenSha = Array.from(shenShaSet);

  const scrollTo = (sid) => {
    const el = document.getElementById(sid);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  };
  const navigateFromTag = (action) => {
    if (action === 'fortune') onShowFortune();
    else if (action === 'insight' || action === 'marriage') onShowInsight();
    else if (action === 'elements') scrollTo('s2');
    else scrollTo('s1');
  };

  return (
    <section className="rite" data-screen-label="03 命式">
      <aside className="rite-side">
        <div className="kanji">命式</div><div className="label">MEISHIKI CHART</div>
        <div className="seal-stack">
          {['四柱の構成','日主と性格','五行バランス','神煞'].map((n, i) => (
            <div key={n} style={{ cursor: 'pointer' }} onClick={() => scrollTo(`s${i}`)}><span className="num">{['壹','貳','參','肆'][i]}</span>　{n}</div>
          ))}
          <div style={{ marginTop: 24 }}><button onClick={onBack} style={{ background: 'transparent', border: 0, color: 'var(--ink-3)', cursor: 'pointer', fontFamily: 'var(--f-mono)', letterSpacing: '0.2em' }}>← 入力へ戻る</button></div>
        </div>
      </aside>
      <div className="rite-main" style={{ paddingBottom: 120 }}>
        <div className="result-card" style={{ marginTop: 0 }}>
          <div className="result-summary result-wide" style={{ paddingBottom: 0 }}>
            <div className="summary-kicker">四柱推命 鑑定結果</div>
          </div>
          <UserTagIndex tags={tags} onNavigate={navigateFromTag} />
          
          <div id="s0" style={{ paddingTop: 10 }}>
            <div className="result-summary result-wide" style={{ paddingTop: 0 }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 24, letterSpacing: '0.05em' }}>四柱の命式（排盤）</h2>
              <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 24 }}>あなたの生年月日から導き出された、人生の縮図となる四つの柱です。</p>
            </div>
            <div className="pillars">
              {['hour', 'day', 'month', 'year'].map((key) => {
                const p = calculation.pillars[key];
                const iv = p.voidBranches?.includes(p.branch);
                const role = { year: '先祖・環境', month: '社会・仕事', day: '自分・家庭', hour: '未来・子供' }[key];
                return (
                  <div key={key} className={`pillar ${key === 'day' ? 'is-day' : ''} ${activePillar === key ? 'is-active-card' : ''}`} onClick={() => setActivePillar(activePillar === key ? null : key)}>
                    <div className="lbl">{PILLAR_LABELS[key]}{iv && <span style={{color:'var(--seal)'}}>[空]</span>}<br/><span style={{fontSize:9,opacity:0.6}}>{role}</span></div>
                    <div className="gz"><span className={`top ${elementClass(p.element.stem)}`}>{p.stem}</span><span className={`btm ${elementClass(p.element.branch)}`}>{p.branch}</span></div>
                    <div className="nayin"><strong>{calculation.tenGods[key]}</strong><br/>{p.lifeStage}</div>
                  </div>
                );
              })}
            </div>
            <PillarMeaningCards calculation={calculation} onFocus={setActivePillar} />
          </div>

          <div className="result-summary result-wide" id="s1" style={{ marginTop: 48, paddingTop: 40, borderTop: '1px solid var(--rule)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'color-mix(in srgb, var(--gold) 10%, transparent)', border: '1px solid var(--gold)', display: 'grid', placeItems: 'center', fontSize: 32 }}>{STEM_ICONS[calculation.dayMaster]}</div>
              <div><div style={{ fontSize: 13, color: 'var(--ink-3)' }}>あなたを表す星（日主）： <strong>{calculation.dayMaster}</strong></div><h2 style={{ margin: 0, fontSize: 24 }}>{stemReading.title}</h2></div>
            </div>
            <p>{stemReading.text}</p>
            <div className="result-tags">{(STEM_READING[calculation.dayMaster]?.tags || []).map(t => <span key={t}># {t}</span>)}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
              <div style={{ padding: '16px', background: 'var(--bg-paper)', border: '1px solid var(--rule)', borderRadius: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <strong>◆ {calculation.strength?.status}</strong>
                  <span style={{ fontSize: 10, fontFamily: 'var(--f-mono)', opacity: 0.6 }}>{Math.round(calculation.strength?.ratio * 100)}%</span>
                </div>
                <div style={{ height: 3, background: 'var(--rule)', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{ width: `${calculation.strength?.ratio * 100}%`, height: '100%', background: 'var(--gold)', transition: 'width 1s' }}></div>
                </div>
                <p style={{ fontSize: 12, margin: 0 }}>{calculation.strength?.text}</p>
              </div>
              <div style={{ padding: '16px', background: 'var(--bg-paper)', border: '1px solid var(--rule)', borderRadius: 6 }}><strong>◆ {calculation.pattern?.name}</strong><p style={{ fontSize: 12, margin: 0 }}>{calculation.pattern?.text}</p></div>
            </div>
            {calculation.yongShen && (
              <div style={{ marginTop: 16, padding: '20px', background: 'color-mix(in srgb, var(--seal) 4%, transparent)', border: '1px solid var(--rule)', borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: 'var(--ink-3)', marginBottom: 12 }}>守護の五行（調候用神）</div>
                <div style={{ display: 'flex', gap: 20 }}>
                   <div style={{ fontSize: 24 }}>{STEM_ICONS[calculation.yongShen.primary]}</div>
                   <p style={{ fontSize: 13, margin: 0 }}>{calculation.yongShen.text}</p>
                </div>
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 40 }}>
            <div style={{ padding: '20px', background: 'var(--bg-paper)', border: '1px solid var(--rule)', borderRadius: 8 }}><strong>❤️ 婚姻の視点</strong><p style={{ fontSize: 12 }}>{synthesis.marriage}</p></div>
            <div style={{ padding: '20px', background: 'var(--bg-paper)', border: '1px solid var(--rule)', borderRadius: 8 }}><strong>💰 事業の視点</strong><p style={{ fontSize: 12 }}>{synthesis.career}</p></div>
          </div>
          <div id="s2" style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--rule)' }}>
             <div style={{ maxWidth: 500, margin: '0 auto 48px', display: 'flex', flexDirection: 'column', gap: 12 }}>
               {ELEMENT_LABELS.map(el => (
                 <div key={el} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                   <div style={{ width: 24, fontWeight: 'bold', color: `var(--${elementClass(el)})` }}>{el}</div>
                   <div style={{ flex: 1, height: 6, background: 'var(--rule)', borderRadius: 10, overflow: 'hidden' }}>
                     <div style={{ width: `${percentages[el] || 0}%`, height: '100%', background: `var(--${elementClass(el)})` }}></div>
                   </div>
                   <strong style={{ width: 42, textAlign: 'right', fontFamily: 'var(--f-mono)', fontSize: 11 }}>{percentages[el] || 0}%</strong>
                 </div>
               ))}
             </div>
             <WuxingDiagram dayElement={calculation.pillars.day.element.stem} elementCounts={calculation.fiveElements.counts} />
          </div>
          <div id="s3" style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--rule)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              {uniqueShenSha.map(s => <div key={s} style={{ border: '1px solid var(--gold)', padding: '10px 20px', borderRadius: 4, fontSize: 13 }}>{s}</div>)}
            </div>
          </div>
          <div className="result-wide next-actions" style={{ marginTop: 64 }}>
            <button onClick={onShowInsight}>性格・才能の詳解 <span>診断</span></button>
            <button onClick={onShowFortune}>大運・流年を見る <span>運勢</span></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function InsightView({ calculation, profile, onBack }) {
  const [topic, setTopic] = React.useState('personality');
  const primaryGod = collectTenGods(calculation)[0]?.[0] || '比肩';
  const dayStem = calculation.dayMaster;
  const synthesis = React.useMemo(() => analyzeSynthesis(calculation, profile), [calculation, profile]);
  const TOPICS = [ { key: 'personality', ja: '性格特質', icon: '👤', title: 'あなたの強みと本質' }, { key: 'talent', ja: '才能・天分', icon: '✨', title: '天から授かった才能' }, { key: 'career', ja: '事業・金運', icon: '💰', title: '仕事と財の流れ' }, { key: 'marriage', ja: '情感・婚姻', icon: '❤️', title: '愛と絆の形' } ];
  const currentTopic = TOPICS.find(t => t.key === topic);
  const getInsightContent = (key) => {
    const contents = {
      personality: { intro: `日主「${dayStem}」と「${primaryGod}」から解析します。`, p1: `【本質】${STEM_READING[dayStem]?.text}`, p2: `【行動】${TEN_GOD_READING[primaryGod]?.text}` },
      talent: { intro: `あなたの才能の活かし所を特定します。`, p1: `あなたの格局は「${calculation.pattern?.name}」です。${calculation.pattern?.text}`, p2: `補助する要素があなたの独自性を高めています。` },
      career: { intro: `最適なビジネススタイルを提案します。`, p1: `エネルギーは「${calculation.strength?.status}」です。${calculation.strength?.text}`, p2: `【分析】${synthesis.career}` },
      marriage: { intro: `配偶者宮から理想のパートナーシップを導きます。`, p1: `配偶者の場所には「${calculation.pillars.day.branch}」が鎮座。${BRANCH_READING[calculation.pillars.day.branch]}`, p2: `【分析】${synthesis.marriage}` }
    };
    return contents[key] || contents.personality;
  };
  const content = getInsightContent(topic);
  return (
    <section className="rite" data-screen-label="05 鑑定詳解">
      <aside className="rite-side">
        <div className="kanji">鑑定詳解</div><div className="label">PERSONAL INSIGHTS</div>
        <div className="seal-stack">
          {TOPICS.map((t, i) => <div key={t.key} style={{ cursor: 'pointer', color: topic === t.key ? 'var(--gold)' : 'inherit' }} onClick={() => setTopic(t.key)}><span className="num">{['壹','貳','參','肆'][i]}</span>　{t.ja}</div>)}
          <div style={{ marginTop: 24 }}><button onClick={onBack} style={{ background: 'transparent', border: 0, color: 'var(--ink-3)', cursor: 'pointer', fontFamily: 'var(--f-mono)', letterSpacing: '0.2em' }}>← 命式へ戻る</button></div>
        </div>
      </aside>
      <div className="rite-main" style={{ paddingBottom: 120 }}>
        <div className="result-card" style={{ marginTop: 0 }}><div className="result-summary result-wide" style={{ paddingTop: 20 }}>
          <div className="summary-kicker">{currentTopic.ja}の詳解</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}><div style={{ width: 56, height: 56, borderRadius: '50%', background: 'color-mix(in srgb, var(--gold) 10%, transparent)', border: '1px solid var(--gold)', display: 'grid', placeItems: 'center', fontSize: 24 }}>{currentTopic.icon}</div><h2 style={{ margin: 0, fontSize: 24 }}>{currentTopic.title}</h2></div>
          <div className="visual-block" style={{ padding: '32px', background: 'var(--bg-paper)', borderRadius: '8px', border: '1px solid var(--rule-strong)' }}><p>{content.intro}</p><div style={{ fontSize: 15, lineHeight: 2, marginBottom: 24 }}>{content.p1}</div><div style={{ fontSize: 15, lineHeight: 2 }}>{content.p2}</div></div>
          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>{TOPICS.filter(t => t.key !== topic).map(t => <button key={t.key} onClick={() => setTopic(t.key)} style={{ padding: '16px', background: 'transparent', border: '1px solid var(--rule)', borderRadius: 6, color: 'var(--ink-2)', cursor: 'pointer', textAlign: 'left', fontSize: 13 }}>次：{t.ja} →</button>)}</div>
        </div></div>
      </div>
    </section>
  );
}

function FortuneView({ calculation, profile, onBack }) {
  const luck = calculation.luckCycles || {};
  const decade = luck.decadeFortunes?.items || [];
  const currentAnnual = currentAnnualFortune(calculation);
  const currentDecade = currentDecadeFortune(luck.decadeFortunes, luck.target?.year || currentAnnual?.year);
  const currentDecadeTheme = decadeTheme(currentDecade, profile?.gender);
  const monthly = luck.monthlyFortunes || [];
  const daily = luck.dailyFortunes || [];
  const scrollTo = (sid) => {
    const el = document.getElementById(sid);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  };
  return (
    <section className="rite" data-screen-label="04 星辰譜">
      <aside className="rite-side">
        <div className="kanji">星辰譜</div><div className="label">FORTUNE CYCLES</div>
        <div className="seal-stack">
          {['大運テーマ','今日','大運表'].map((n, i) => (
            <div key={n} style={{ cursor: 'pointer' }} onClick={() => scrollTo(`f${i}`)}><span className="num">{['壹','貳','參'][i]}</span>　{n}</div>
          ))}
          <div style={{ marginTop: 24 }}><button onClick={onBack} style={{ background: 'transparent', border: 0, color: 'var(--ink-3)', cursor: 'pointer', fontFamily: 'var(--f-mono)', letterSpacing: '0.2em' }}>← 命式へ戻る</button></div>
        </div>
      </aside>
      <div className="rite-main" style={{ paddingBottom: 120 }}>
        <div className="result-card" style={{ marginTop: 0 }}>
          <div className="result-summary result-wide" id="f0" style={{ paddingTop: 20 }}>
            <div className="summary-kicker">大運（10年運）の解読</div><h2 style={{ fontSize: 24 }}>{currentDecadeTheme?.title}</h2><p>{currentDecadeTheme?.intro}</p>
            <div className="result-wide visual-block" style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {[ { l: '◆ 仕事', v: currentDecadeTheme.work, c: 'var(--seal)' }, { l: '◆ 財', v: currentDecadeTheme.money, c: 'var(--gold)' }, { l: '◆ 対人', v: currentDecadeTheme.love, c: 'var(--accent)' }, { l: '◆ 家庭', v: currentDecadeTheme.family, c: 'var(--ink-3)' } ].map(x => (
                <article key={x.l} style={{ border: '1px solid var(--rule)', background: 'var(--bg-paper)', padding: 20, borderRadius: 6 }}><strong style={{ display: 'block', color: x.c, marginBottom: 8, fontSize: 13 }}>{x.l}</strong><p style={{ fontSize: 13 }}>{x.v}</p></article>
              ))}
            </div>
          </div>
          <div id="f1" className="result-wide visual-block" style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--rule)' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}><h3>今日の巡り（流年・流月・流日）</h3></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[ { label: '今年の運気', item: currentAnnual, color: 'var(--accent)' }, { label: '今月の運気', item: monthly[0], color: 'var(--gold)' }, { label: '今日の運気', item: daily[0], color: 'var(--seal)' } ].map(l => (
                <div key={l.label} style={{ background: 'var(--bg-paper)', border: '1px solid var(--rule)', borderRadius: 8, padding: '20px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>{l.label}</div>
                  <div style={{ fontSize: 28, fontFamily: 'var(--f-display)' }}>{l.item?.pillar?.text}</div>
                  <div style={{ fontSize: 12, color: l.color }}><strong>{l.item?.pillar?.heavenlyTenGod}</strong></div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 8 }}>{l.item?.pillar?.fortuneTheme}</div>
                </div>
              ))}
            </div>
          </div>
          <div id="f2" style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--rule)' }}>
             <div style={{ textAlign: 'center' }}><h3>生涯の大運表</h3></div>
             {decade.map(d => (
               <div key={d.name} style={{ padding: 16, border: '1px solid var(--rule)', marginBottom: 8 }}>{d.startAge}-{d.endAge}歳: {d.pillar.text} ({d.pillar.heavenlyTenGod})</div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function readingTags(calc, gods) {
  const st = STEM_READING[calc.dayMaster]?.tags || [];
  const gt = gods.slice(0, 2).flatMap(([g]) => TEN_GOD_READING[g]?.tags || []);
  return [...st, ...gt].slice(0, 6);
}

function currentAnnualFortune(calculation) { return calculation.luckCycles?.annualFortunes?.[0] || null; }

window.Rite = Rite;
window.ResultView = ResultView;
window.FortuneView = FortuneView;
window.InsightView = InsightView;
