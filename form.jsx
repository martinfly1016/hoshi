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
    return { id: 'overseas', label: '海外（日本標準時以外）', timezone: 'UTC', utcOffset: 0, latitude: 0, longitude: 0 };
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
  // calendar state maps to the era toggle (seireki/showa/heisei/reiwa)
  const [calendar, setCalendar] = React.useState('seireki'); // seireki | showa | heisei | reiwa
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
              if (calendar === 'showa') y += 1925; // Showa 1 = 1926
              else if (calendar === 'heisei') y += 1988; // Heisei 1 = 1989
              else if (calendar === 'reiwa') y += 2018; // Reiwa 1 = 2019
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
        setResult({ input, chart: calculated, profile: { name, gender, location: selectedLocation, shi, unsure } });
        setDone(true);
        window.setTimeout(() => {
          const el = document.getElementById('result-card');
          if (el) {
            window.scrollTo({
              top: el.getBoundingClientRect().top + window.scrollY - 120,
              behavior: 'smooth',
            });
          }
        }, 200);
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
        <div className="label">MEISHIKI · CREATION</div>
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

        <FormField num="壹 / 一" ja="お名前" romaji="O · NA · MAE"
          hint="※ 省略可。結果画面での呼び名として使用します">
          <div className="input-line">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例 ）田中 太郎" />
          </div>
        </FormField>

        <FormField num="壹 / 二" ja="性 別" romaji="SEI · BETSU"
          hint="※ 大運（10年ごとの運勢）の順逆計算に影響します">
          <div className="gender-row">
            {[
              { key: 'yang', ja: '男性 (陽)', sym: '☰' },
              { key: 'yin',  ja: '女性 (陰)', sym: '☷' },
              { key: 'gen',  ja: '選択しない', sym: '☯' },
            ].map(g => (
              <button key={g.key}
                className={`gender-btn ${gender === g.key ? 'on' : ''}`}
                onClick={() => setGender(g.key)}>
                <span className="glyph">{g.sym}</span>
                <span>{g.ja}</span>
              </button>
            ))}
          </div>
        </FormField>

        <FormField num="貳 / 一" ja="生年月日" romaji="SEI · NEN · GAPPI"
          hint="西暦または和暦（昭和・平成・令和）を選択し、入力してください">
          <div className="toggle-row">
            <button className={calendar === 'seireki' ? 'on' : ''}
              onClick={() => setCalendar('seireki')}>西　暦</button>
            <button className={calendar === 'showa' ? 'on' : ''}
              onClick={() => setCalendar('showa')}>昭　和</button>
            <button className={calendar === 'heisei' ? 'on' : ''}
              onClick={() => setCalendar('heisei')}>平　成</button>
            <button className={calendar === 'reiwa' ? 'on' : ''}
              onClick={() => setCalendar('reiwa')}>令　和</button>
          </div>
          <div className="input-row">
            <div className="input-line with-mark" data-mark="年 / Y">
              <select value={year} onChange={e => setYear(e.target.value)}>
                <option value="" disabled>--</option>
                {calendar === 'seireki' && Array.from({length: 107}, (_, i) => 2026 - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
                {calendar === 'showa' && Array.from({length: 64}, (_, i) => 64 - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
                {calendar === 'heisei' && Array.from({length: 31}, (_, i) => 31 - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
                {calendar === 'reiwa' && Array.from({length: 8}, (_, i) => 8 - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="input-line with-mark" data-mark="月 / M">
              <select value={month} onChange={e => setMonth(e.target.value)}>
                <option value="" disabled>--</option>
                {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="input-line with-mark" data-mark="日 / D">
              <select value={day} onChange={e => setDay(e.target.value)}>
                <option value="" disabled>--</option>
                {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </FormField>

        <FormField num="參 / 一" ja="出生時間" romaji="SHUSSEI · JI · KAN"
          hint="該当する出生時間（時辰）を選択してください。不明な場合は「時間不明」を選択してください">
          <div className="input-line">
            <select
              value={unsure ? 'unsure' : shi}
              onChange={e => {
                const val = e.target.value;
                if (val === 'unsure') {
                  setUnsure(true);
                  setShi('');
                  setBirthTime('12:00');
                } else {
                  setUnsure(false);
                  setShi(val);
                  setBirthTime(representativeTime(val));
                }
              }}
            >
              <option value="" disabled>-- 時辰を選択 --</option>
              {SHI_HOURS.map(s => (
                <option key={s.ji} value={s.ji}>
                  {s.ji}の刻 ({s.hours.replace('–', ':00 ～ ') + ':00'})
                </option>
              ))}
              <option value="unsure">時間不明</option>
            </select>
          </div>
        </FormField>

        <FormField num="肆 / 一" ja="出生地" romaji="SHUSSEI · CHI"
          hint="正確な自然時（太陽の南中時刻）を計算するための時差補正に使用します。一番近い場所を選んでください">
          <div className="input-line">
            <select value={locationId} onChange={e => setLocationId(e.target.value)}>
              {locations.map(location => {
                // Strip "日本 / " and the city name (keep only prefecture)
                let label = stripJapan(location.label);
                label = label.split(' ')[0];
                return (
                  <option key={location.id} value={location.id}>{label}</option>
                );
              })}
              <option value="overseas">海外（日本標準時以外）</option>
            </select>
          </div>
        </FormField>

        <div className="rite-submit">
          <div className="legal">
            出生時間が不明でも鑑定できます。<br/>
            その場合、時柱は12:00の仮計算として表示します。<br/>
            <span style={{ fontSize: '0.85em', color: 'var(--ink-3)', display: 'block', marginTop: '8px' }}>
              ※ 入力内容はこの端末上で計算し、サーバーには保存しません。
            </span>
          </div>
          <button className={`submit-btn ${busy ? 'busy' : ''}`}
            disabled={!valid || busy}
            onClick={submit}>
            <span>無料で命式を見る</span>
            <span className="arrow"></span>
            <span className="seal-mini">占</span>
          </button>
        </div>

        {error && <div className="notice result-error">{error}</div>}

        {done && result && <ResultPreview id="result-card"
          name={name} calculation={result.chart} profile={result.profile} />}

        <div style={{ marginTop: 56, textAlign: 'center' }}>
          <button onClick={onBack}
            style={{
              fontSize: 11, letterSpacing: '0.4em',
              color: 'var(--ink-3)', fontFamily: 'var(--f-mono)',
            }}>
            ← 序章へ戻る
          </button>
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
const PILLAR_LABELS = {
  year: '年柱',
  month: '月柱',
  day: '日柱',
  hour: '時柱',
};
const STEM_ICONS = {
  '甲': '🌳', // 大樹
  '乙': '🌿', // 草花
  '丙': '☀️', // 太陽
  '丁': '🕯️', // 灯火
  '戊': '⛰️', // 山
  '己': '🪴', // 大地
  '庚': '⚔️', // 剣
  '辛': '✨', // 宝石
  '壬': '🌊', // 海
  '癸': '💧', // 雨
};
const PILLAR_READING = {
  year: {
    icon: '根',
    title: '年柱はルーツと外側の環境',
    text: '家族、育った環境、社会から見えやすい雰囲気を見ます。',
  },
  month: {
    icon: '場',
    title: '月柱は社会性と仕事の土台',
    text: '季節の力が強く出る柱で、仕事や役割、社会での使い方を見ます。',
  },
  day: {
    icon: '我',
    title: '日柱は本人と大切な関係',
    text: '日主を含む中心の柱です。本人の核と、近い関係性の傾向を見ます。',
  },
  hour: {
    icon: '芽',
    title: '時柱は未来と内側の可能性',
    text: '出生時間から出す柱です。内面、晩年、これから育つテーマを見ます。',
  },
};
const ELEMENT_LABELS = ['木', '火', '土', '金', '水'];
const ELEMENT_CLASS = {
  木: 'wood',
  火: 'fire',
  土: 'earth',
  金: 'metal',
  水: 'water',
};
function getShenSha(targetBranch, dayStem, yearBranch, dayBranch) {
  const result = [];
  
  // 天乙貴人 (Tian Yi Gui Ren)
  const tianYiMap = {
    '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
    '乙': ['子', '申'], '己': ['子', '申'],
    '丙': ['亥', '酉'], '丁': ['亥', '酉'],
    '壬': ['卯', '巳'], '癸': ['卯', '巳'],
    '辛': ['寅', '午']
  };
  if (tianYiMap[dayStem]?.includes(targetBranch)) result.push('天乙貴人');

  // 太極貴人 (Tai Ji Gui Ren)
  const taiJiMap = {
    '甲': ['子', '午'], '乙': ['子', '午'],
    '丙': ['卯', '酉'], '丁': ['卯', '酉'],
    '戊': ['辰', '戌', '丑', '未'], '己': ['辰', '戌', '丑', '未'],
    '庚': ['寅', '亥'], '辛': ['寅', '亥'],
    '壬': ['巳', '申'], '癸': ['巳', '申']
  };
  if (taiJiMap[dayStem]?.includes(targetBranch)) result.push('太極貴人');

  // 文昌貴人 (Wen Chang)
  const wenChangMap = {
    '甲': '巳', '乙': '午', '丙': '申', '戊': '申',
    '丁': '酉', '己': '酉', '庚': '亥', '辛': '子',
    '壬': '寅', '癸': '卯'
  };
  if (wenChangMap[dayStem] === targetBranch) result.push('文昌貴人');

  // 天厨貴人 (Tian Chu)
  const tianChuMap = {
    '甲': '巳', '乙': '午', '丙': '子', '丁': '巳',
    '戊': '午', '己': '申', '庚': '寅', '辛': '午',
    '壬': '酉', '癸': '亥'
  };
  if (tianChuMap[dayStem] === targetBranch) result.push('天厨貴人');

  // 羊刃 (Yang Ren)
  const yangRenMap = {
    '甲': '卯', '乙': '辰', '丙': '午', '丁': '未',
    '戊': '午', '己': '未', '庚': '酉', '辛': '戌',
    '壬': '子', '癸': '丑'
  };
  if (yangRenMap[dayStem] === targetBranch) result.push('羊刃');

  // 詞館 (Ci Guan)
  const ciGuanMap = {
    '甲': '寅', '乙': '卯', '丙': '巳', '戊': '巳',
    '丁': '午', '己': '午', '庚': '申', '辛': '酉',
    '壬': '亥', '癸': '子'
  };
  if (ciGuanMap[dayStem] === targetBranch) result.push('詞館');

  // Groups based on Year or Day Branch
  const zhiGroup = (branch) => {
    if (['申', '子', '辰'].includes(branch)) return 'shui';
    if (['亥', '卯', '未'].includes(branch)) return 'mu';
    if (['寅', '午', '戌'].includes(branch)) return 'huo';
    if (['巳', '酉', '丑'].includes(branch)) return 'jin';
    return null;
  };

  const checkSanzhi = (baseBranch) => {
    const group = zhiGroup(baseBranch);
    if (group === 'shui') {
      if (targetBranch === '寅') result.push('駅馬');
      if (targetBranch === '子') result.push('将星');
      if (targetBranch === '辰') result.push('華蓋');
      if (targetBranch === '酉') result.push('桃花');
      if (targetBranch === '午') result.push('災殺');
    }
    if (group === 'mu') {
      if (targetBranch === '巳') result.push('駅馬');
      if (targetBranch === '卯') result.push('将星');
      if (targetBranch === '未') result.push('華蓋');
      if (targetBranch === '子') result.push('桃花');
      if (targetBranch === '酉') result.push('災殺');
    }
    if (group === 'huo') {
      if (targetBranch === '申') result.push('駅馬');
      if (targetBranch === '午') result.push('将星');
      if (targetBranch === '戌') result.push('華蓋');
      if (targetBranch === '卯') result.push('桃花');
      if (targetBranch === '子') result.push('災殺');
    }
    if (group === 'jin') {
      if (targetBranch === '亥') result.push('駅馬');
      if (targetBranch === '酉') result.push('将星');
      if (targetBranch === '丑') result.push('華蓋');
      if (targetBranch === '午') result.push('桃花');
      if (targetBranch === '卯') result.push('災殺');
    }
  };

  checkSanzhi(yearBranch);
  checkSanzhi(dayBranch);

  return [...new Set(result)]; // Unique
}

const WARNING_LABELS = {
  BIRTH_TIME_DEFAULTED_TO_NOON: '出生時間不詳のため、時柱は12:00で仮計算しています。',
  TRUE_SOLAR_TIME_APPLIED: '出生地の経度から真太陽時補正を適用しています。',
  TRUE_SOLAR_TIME_REQUIRES_BIRTHPLACE: '真太陽時計算には出生地の経緯度が必要です。',
  LATE_ZI_HOUR_MODE_USER_SELECTABLE: '23:00台は晚子時/子初換日で流派差が出ます。',
};
const STEM_YINYANG = {
  甲: '陽', 乙: '陰', 丙: '陽', 丁: '陰', 戊: '陽',
  己: '陰', 庚: '陽', 辛: '陰', 壬: '陽', 癸: '陰',
};
const STEM_READING = {
  甲: { title: '大樹のようにまっすぐ伸びる人', text: '理想を掲げ、時間をかけて形にしていく力があります。焦らず根を張るほど、信頼が育ちます。', tags: ['誠実', '成長志向', '長期戦'] },
  乙: { title: '草花のようにしなやかに場を読む人', text: '柔らかな感受性と調整力があります。人との関係の中で才能が開きやすいタイプです。', tags: ['柔軟', '協調', '美意識'] },
  丙: { title: '太陽のように場を明るくする人', text: '明るさと表現力で人を惹きつけます。隠すより見せることで運が動きやすいタイプです。', tags: ['表現力', '率直', '求心力'] },
  丁: { title: '灯火のように心を照らす人', text: '細やかな洞察と集中力があります。小さな違和感を拾い、丁寧に磨くほど強みになります。', tags: ['洞察', '集中', '繊細'] },
  戊: { title: '山のように安定をつくる人', text: '物事を受け止め、場の土台を整える力があります。信頼を積むほど大きな役割を任されます。', tags: ['安定', '包容', '責任感'] },
  己: { title: '田畑のように人や環境を育てる人', text: '現実感覚と育成力があります。人や環境を整えながら成果へつなげることが得意です。', tags: ['育成', '実務', '調整役'] },
  庚: { title: '鋼のように道を切り開く人', text: '決断力と突破力があります。曖昧な状況を整理し、必要な一手を打つことで力を発揮します。', tags: ['決断', '突破', '実行'] },
  辛: { title: '宝石のように磨かれて光る人', text: '繊細な美意識と基準の高さがあります。細部を磨き、質を高めるほど存在感が増します。', tags: ['美意識', '精密', '洗練'] },
  壬: { title: '大河のように広がる人', text: '視野が広く、変化に乗る力があります。固定されすぎない環境で発想が広がります。', tags: ['自由', '構想', '移動'] },
  癸: { title: '雨露のように静かに満たす人', text: '観察力と知性があり、静かに情報を集めて本質へ近づくタイプです。', tags: ['観察', '知性', '内省'] },
};
const TEN_GOD_READING = {
  比肩: { tags: ['自立', '対等', '芯の強さ'], text: '自分の判断で立ち、同じ立場の相手と並走しやすい星です。' },
  劫财: { tags: ['競争', '突破', '巻き込み'], text: '競争心と突破力が前に出やすく、人や状況を動かしながら進む星です。' },
  食神: { tags: ['表現', '余裕', '育成'], text: '自然体の表現、楽しさ、育てる力として出やすい星です。' },
  伤官: { tags: ['批評', '才気', '鋭さ'], text: '感覚が鋭く、型を破って言語化したり改善したりする星です。' },
  偏财: { tags: ['機動力', '対人', '現場感'], text: '人や機会に素早く反応し、流れをつかみにいく星です。' },
  正财: { tags: ['実務', '管理', '積み上げ'], text: '現実感覚が強く、着実に管理しながら成果へつなぐ星です。' },
  七杀: { tags: ['緊張感', '決断', '負荷対応'], text: 'プレッシャーの中で判断し、厳しい局面を切り抜ける力として出ます。' },
  正官: { tags: ['規律', '責任', '信頼'], text: '秩序や役割意識を重んじ、きちんと形にしていく星です。' },
  偏印: { tags: ['直感', '独自視点', '再編集'], text: '独自の見方やひらめきで情報を再解釈しやすい星です。' },
  正印: { tags: ['学習', '保護', '吸収'], text: '知識や型を吸収し、守られながら安定して伸びやすい星です。' },
};
const TEN_GOD_GROUPS = {
  比肩: { role: '自分軸', icon: '自', text: '自立心、同じ立場の仲間、対等な関係を表します。' },
  劫财: { role: '競争と仲間', icon: '競', text: '競争心、巻き込み力、強い突破力として出ます。' },
  食神: { role: '表現と楽しさ', icon: '表', text: '自然な表現、楽しさ、育てる力として現れます。' },
  伤官: { role: '感性と改善', icon: '鋭', text: '鋭い感覚、批評性、型を越える才能として出ます。' },
  偏财: { role: '機会と対人', icon: '機', text: '人や機会に素早く反応し、現場で流れをつかむ力です。' },
  正财: { role: '管理と積み上げ', icon: '積', text: '現実感覚、管理、安定した積み上げを表します。' },
  七杀: { role: '決断と負荷対応', icon: '決', text: '緊張感の中で決める力、責任ある局面への強さです。' },
  正官: { role: '信頼と秩序', icon: '秩', text: '役割意識、社会的信用、ルールの中で整える力です。' },
  偏印: { role: '直感と再編集', icon: '直', text: '独自視点、直感、情報を組み替える力として出ます。' },
  正印: { role: '学習と保護', icon: '学', text: '学び、吸収、守られながら伸びる力を表します。' },
};

function elementClass(elementName) {
  return ELEMENT_CLASS[elementName] || 'neutral';
}

function elementPercentages(result) {
  const counts = result.fiveElements.counts;
  const total = Math.max(1, Object.values(counts).reduce((sum, value) => sum + value, 0));
  return Object.fromEntries(ELEMENT_LABELS.map((name) => [name, Math.round(((counts[name] || 0) / total) * 100)]));
}

function formatDateTimeLabel(value) {
  const [date = '', time = ''] = String(value || '').split(' ');
  const [year, month, day] = date.split('-');
  if (!year || !month || !day) return value || '—';
  return `${year}年${month}月${day}日 ${time}`;
}

function collectHiddenStems(result) {
  const counts = new Map();
  PILLAR_KEYS.forEach((key) => {
    (result.pillars[key].hiddenStemDetails || []).forEach((detail) => {
      const current = counts.get(detail.stem) || { ...detail, total: 0 };
      current.total += 1;
      counts.set(detail.stem, current);
    });
  });
  return Array.from(counts.values()).sort((a, b) => b.total - a.total);
}

function collectTenGods(result) {
  const counts = new Map();
  PILLAR_KEYS.forEach((key) => {
    const god = result.tenGods[key];
    counts.set(god, (counts.get(god) || 0) + 1);
    (result.pillars[key].hiddenStemDetails || []).forEach((detail) => {
      counts.set(detail.tenGod, (counts.get(detail.tenGod) || 0) + 1);
    });
  });
  return Array.from(counts.entries())
    .filter(([name]) => name && name !== '日主')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
}

function strongestElements(result) {
  const entries = Object.entries(result.fiveElements.counts);
  const max = Math.max(...entries.map(([, value]) => value));
  return entries.filter(([, value]) => value === max).map(([name]) => name);
}

function weakestElements(result) {
  const entries = Object.entries(result.fiveElements.counts);
  const min = Math.min(...entries.map(([, value]) => value));
  return entries.filter(([, value]) => value === min).map(([name]) => name);
}

function dayMasterType(calculation) {
  const stem = calculation.dayMaster;
  const element = calculation.pillars.day.element.stem;
  return `${STEM_YINYANG[stem] || ''}${element}`;
}

function readingTags(calculation, tenGods) {
  const stemTags = STEM_READING[calculation.dayMaster]?.tags || [];
  const godTags = tenGods.slice(0, 2).flatMap(([god]) => TEN_GOD_READING[god]?.tags || []);
  return [...stemTags, ...godTags].slice(0, 6);
}

function balanceAdvice(calculation) {
  const missing = ELEMENT_LABELS.filter((name) => (calculation.fiveElements.counts[name] || 0) === 0);
  const support = missing.length ? missing : weakestElements(calculation);
  const advice = {
    木: '学び直し、計画づくり、自然に触れる時間が助けになります。',
    火: '発信、表現、朝日や温かい場に触れる行動が助けになります。',
    土: '生活リズム、食事、片づけ、貯蓄計画など土台づくりが合います。',
    金: '金属アクセサリー、白や金色の小物、道具の整理、ルール化が助けになります。',
    水: '休息、読書、移動、水辺の散歩、情報収集で流れを作ると安定しやすいです。',
  };
  return {
    support,
    text: support.map((name) => advice[name]).join(' '),
  };
}

function mainThemeText(tenGods) {
  const names = tenGods.slice(0, 3).map(([god]) => god);
  if (!names.length) return '目立つ通変星に大きな偏りはありません。';
  return names.map((name) => `${name}（${(TEN_GOD_READING[name]?.tags || []).join('・')}）`).join('、');
}

function elementStateLabel(calculation, name) {
  const counts = calculation.fiveElements.counts;
  const values = Object.values(counts);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const value = counts[name] || 0;
  if (value === 0) return '不足';
  if (max === min) return '均衡';
  if (value === max) return '強め';
  if (value === min) return '控えめ';
  return '中位';
}

function elementGuideText(name) {
  const guide = {
    木: '成長、企画、広がりを表します。新しい方向へ伸びる力です。',
    火: '表現、熱量、直感を表します。外へ伝える力です。',
    土: '安定、蓄積、調整を表します。場を支える力です。',
    金: '判断、整理、完成度を表します。形を整える力です。',
    水: '知性、流れ、適応を表します。情報を受け取り変化する力です。',
  };
  return guide[name] || '';
}

function topTenGodEntries(calculation) {
  return collectTenGods(calculation).slice(0, 5).map(([name, total]) => ({
    name,
    total,
    ...(TEN_GOD_GROUPS[name] || { role: name, icon: name?.slice(0, 1) || '星', text: TEN_GOD_READING[name]?.text || '' }),
  }));
}

function genderLabel(value) {
  if (value === 'male') return '男性';
  if (value === 'female') return '女性';
  return '未指定';
}

function directionLabel(value) {
  if (value === 'forward') return '順行';
  if (value === 'backward') return '逆行';
  return '未判定';
}

function cycleReading(pillar) {
  if (!pillar) return '';
  const stemElement = pillar.element?.stem || '';
  const branchElement = pillar.element?.branch || '';
  const god = pillar.heavenlyTenGod;
  const godText = TEN_GOD_GROUPS[god]?.role || TEN_GOD_READING[god]?.tags?.join('・') || 'テーマ';
  return `${stemElement}${branchElement ? `と${branchElement}` : ''}の気が巡り、${god ? `${god}（${godText}）` : '命式のテーマ'}が表に出やすい時期として見ます。`;
}

function currentAnnualFortune(calculation) {
  return calculation.luckCycles?.annualFortunes?.[0] || null;
}

function currentDecadeFortune(decade, targetYear) {
  if (!decade || decade.status !== 'ok') return null;
  const items = decade.items || [];
  return items.find((item) => item.startYear <= targetYear && targetYear <= item.endYear)
    || items.find((item) => targetYear < item.startYear)
    || items[items.length - 1]
    || null;
}

function decadeTheme(item) {
  if (!item) return null;
  const god = item.pillar?.heavenlyTenGod;
  const role = TEN_GOD_GROUPS[god]?.role || TEN_GOD_READING[god]?.tags?.join('・') || '命式のテーマ';
  const element = item.pillar?.element?.stem || '';
  const branch = item.pillar?.element?.branch || '';
  return {
    title: `${item.name}の10年は「${role}」を育てる時期`,
    intro: `${item.startYear}年から${item.endYear}年、${item.startAge}歳から${item.endAge}歳にかけての大きな流れです。${element}${branch ? `と${branch}` : ''}の気が巡り、${god || '通変星'}のテーマが背景に出やすくなります。`,
    work: `仕事では、${role}をどう使うかが焦点になります。新しい肩書きの断定ではなく、役割の取り方・責任の持ち方・動き方の癖として読みます。`,
    money: god === '偏财' || god === '正财'
      ? '財星が出るため、収入断定ではなく、現実管理・対人機会・お金の扱い方を整える10年として見ます。'
      : '財運は直接の金額ではなく、五行と通変星の使い方から、機会を受け取る姿勢や管理力として見ます。',
    love: '恋愛や対人では、表に出る態度と内側の欲求が変わりやすい時期です。相手との役割分担を固定しすぎないことが読みのポイントです。',
    care: '大運は10年単位の背景運です。年ごとの流年と重ねることで、強く出る年・調整したい年を見ていきます。',
  };
}

function WuxingDiagram({ dayElement, elementCounts }) {
  const ELEMENTS = [
    { key: '火', color: 'var(--seal)' },
    { key: '土', color: 'var(--gold)' },
    { key: '金', color: 'var(--ink)' },
    { key: '水', color: 'var(--accent)' },
    { key: '木', color: '#58a66c' },
  ];

  // Coordinates for a pentagon
  const cx = 200, cy = 200, r = 130;
  const nodes = ELEMENTS.map((el, i) => {
    // Start at top (-90 deg), go clockwise by 72 deg
    const angle = (i * 72 - 90) * (Math.PI / 180);
    return {
      ...el,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });

  const getGodFamily = (targetElement) => {
    const wuxingCycle = ['木', '火', '土', '金', '水'];
    const idxDay = wuxingCycle.indexOf(dayElement);
    const idxTarget = wuxingCycle.indexOf(targetElement);
    const diff = (idxTarget - idxDay + 5) % 5;
    if (diff === 0) return '比肩 · 劫財'; // Same
    if (diff === 1) return '食神 · 傷官'; // Generates
    if (diff === 2) return '正財 · 偏財'; // Overcomes
    if (diff === 3) return '正官 · 七殺'; // Overcome by
    if (diff === 4) return '正印 · 偏印'; // Generated by
    return '';
  };

  return (
    <div className="wuxing-diagram">
      <svg viewBox="0 0 400 400" aria-hidden="true" style={{ width: '100%', height: 'auto', maxWidth: 400, margin: '0 auto', display: 'block' }}>
        {/* Generate lines (outer pentagon) */}
        <polygon
          points={nodes.map(n => `${n.x},${n.y}`).join(' ')}
          fill="none" stroke="var(--rule-strong)" strokeWidth="2" strokeDasharray="4 6"
        />
        {/* Overcome lines (inner star) */}
        <polygon
          points={`${nodes[0].x},${nodes[0].y} ${nodes[2].x},${nodes[2].y} ${nodes[4].x},${nodes[4].y} ${nodes[1].x},${nodes[1].y} ${nodes[3].x},${nodes[3].y}`}
          fill="none" stroke="var(--rule)" strokeWidth="1.5"
        />
        
        {/* Nodes */}
        {nodes.map(node => {
          const count = elementCounts[node.key] || 0;
          const isDayMaster = node.key === dayElement;
          return (
            <g key={node.key}>
              <circle cx={node.x} cy={node.y} r={isDayMaster ? 36 : 28} fill="var(--bg)" stroke={node.color} strokeWidth={isDayMaster ? 3 : 1.5} />
              {isDayMaster && <circle cx={node.x} cy={node.y} r={42} fill="none" stroke={node.color} strokeWidth={1} strokeOpacity={0.4} strokeDasharray="2 4" />}
              
              <text x={node.x} y={node.y + 4} textAnchor="middle" fill={node.color} fontSize={isDayMaster ? 20 : 16} fontFamily="var(--f-display)">
                {node.key}
              </text>
              
              {/* Badge for element count */}
              <circle cx={node.x + 22} cy={node.y - 22} r={10} fill={node.color} />
              <text x={node.x + 22} y={node.y - 18} textAnchor="middle" fill="var(--bg)" fontSize="10" fontFamily="var(--f-mono)" fontWeight="bold">
                {count}
              </text>

              {/* Ten God Family Label */}
              <text x={node.x} y={node.y + (isDayMaster ? 58 : 46)} textAnchor="middle" fill="var(--ink-2)" fontSize="11" letterSpacing="0.1em" fontFamily="var(--f-display)">
                {getGodFamily(node.key)}
              </text>
              {isDayMaster && (
                <text x={node.x} y={node.y - 48} textAnchor="middle" fill={node.color} fontSize="12" letterSpacing="0.2em" fontFamily="var(--f-display)">
                  日主
                </text>
              )}
            </g>
          );
        })}

        {/* Center Label */}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--ink-3)" fontSize="13" letterSpacing="0.4em" fontFamily="var(--f-display)">
          五行生剋
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--ink-3)" fontSize="10" letterSpacing="0.1em" opacity="0.6" fontFamily="var(--f-body)">
          ( 相生 --- / 相剋 — )
        </text>
      </svg>
    </div>
  );
}

function FortuneView({ calculation, onBack }) {
  const luck = calculation.luckCycles || {};
  const decade = luck.decadeFortunes?.items || [];
  const currentAnnual = currentAnnualFortune(calculation);
  const currentDecade = currentDecadeFortune(luck.decadeFortunes, luck.target?.year || currentAnnual?.year);
  const currentDecadeTheme = decadeTheme(currentDecade);

  const monthly = luck.monthlyFortunes || [];
  const daily = luck.dailyFortunes || [];

  const scrollTo = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="rite" data-screen-label="04 星辰譜">
      <aside className="rite-side">
        <div className="kanji">星辰譜</div>
        <div className="label">FORTUNE · CYCLES</div>
        <div className="seal-stack">
          <div style={{ cursor: 'pointer' }} onClick={() => scrollTo('section-decade-summary')}><span className="num">壹</span>　現在の大運テーマ</div>
          <div style={{ cursor: 'pointer' }} onClick={() => scrollTo('section-current-luck')}><span className="num">貳</span>　今日（年・月・日）</div>
          <div style={{ cursor: 'pointer' }} onClick={() => scrollTo('section-decade-list')}><span className="num">參</span>　生涯の大運表</div>
          <div style={{ cursor: 'pointer' }} onClick={() => scrollTo('section-annual-list')}><span className="num">肆</span>　直近の流年表</div>
          <div style={{ marginTop: 24 }}>
             <button onClick={onBack} style={{ background: 'transparent', border: 0, color: 'var(--ink-3)', cursor: 'pointer', fontFamily: 'var(--f-mono)', letterSpacing: '0.2em' }}>
               ← 命式へ戻る
             </button>
          </div>
        </div>
      </aside>

      <div className="rite-main" style={{ paddingBottom: 120 }}>
        <div className="result-card" style={{ marginTop: 0 }}>
          
          <div className="result-summary result-wide" id="section-decade-summary" style={{ paddingTop: 20 }}>
            <div className="summary-kicker">大運（10年運）の解読</div>
            <h2 style={{ fontSize: 24, margin: '0 0 16px', letterSpacing: '0.05em' }}>{currentDecadeTheme?.title || '現在の大運テーマ'}</h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--ink-2)' }}>
              {currentDecadeTheme?.intro}
            </p>
          </div>

          {currentDecadeTheme && (
            <div className="result-wide visual-block" style={{ marginTop: 32, display: 'grid', gap: 16 }}>
              <article style={{ border: '1px solid var(--rule)', background: 'var(--bg-paper)', padding: 20, borderRadius: 6 }}>
                <strong style={{ display: 'block', color: 'var(--seal)', marginBottom: 8, fontSize: 13 }}>◆ 仕事・役割</strong>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.8, color: 'var(--ink-2)' }}>{currentDecadeTheme.work}</p>
              </article>
              <article style={{ border: '1px solid var(--rule)', background: 'var(--bg-paper)', padding: 20, borderRadius: 6 }}>
                <strong style={{ display: 'block', color: 'var(--gold)', marginBottom: 8, fontSize: 13 }}>◆ 財と価値</strong>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.8, color: 'var(--ink-2)' }}>{currentDecadeTheme.money}</p>
              </article>
              <article style={{ border: '1px solid var(--rule)', background: 'var(--bg-paper)', padding: 20, borderRadius: 6 }}>
                <strong style={{ display: 'block', color: 'var(--accent)', marginBottom: 8, fontSize: 13 }}>◆ 对人・恋爱</strong>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.8, color: 'var(--ink-2)' }}>{currentDecadeTheme.love}</p>
              </article>
            </div>
          )}

          <div id="section-current-luck" className="result-wide visual-block" style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--rule)' }}>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 16, letterSpacing: '0.2em', color: 'var(--ink)', marginBottom: 12, textAlign: 'center' }}>
              今日の巡り（流年・流月・流日）
            </div>
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.8, marginBottom: 24 }}>
              大運という大きな季節の流れの中で、今日この瞬間に巡っている「気」の組み合わせです。
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: '今年の運気 (流年)', item: currentAnnual, color: 'var(--accent)' },
                { label: '今月の運気 (流月)', item: monthly.find(m => {
                  const now = new Date();
                  return m.solarStartDate.includes(`-${String(now.getMonth() + 1).padStart(2, '0')}-`);
                }) || monthly[0], color: 'var(--gold)' },
                { label: '今日の運気 (流日)', item: daily[0], color: 'var(--seal)' }
              ].map(luckItem => (
                <div key={luckItem.label} style={{ background: 'var(--bg-paper)', border: `1px solid var(--rule)`, borderRadius: 8, padding: '20px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--ink-3)', marginBottom: 12, letterSpacing: '0.1em' }}>{luckItem.label}</div>
                  <div style={{ fontSize: 28, fontFamily: 'var(--f-display)', color: 'var(--ink)', marginBottom: 8 }}>
                    {luckItem.item?.pillar?.text}
                  </div>
                  <div style={{ fontSize: 12, color: luckItem.color, fontWeight: 'bold' }}>
                    {luckItem.item?.pillar?.heavenlyTenGod}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 8, minHeight: '3em' }}>
                    {luckItem.item?.pillar?.fortuneTheme}
                  </div>
                  {luckItem.item?.climate && (
                    <div style={{ marginTop: 10, padding: '8px', border: `1px solid ${luckItem.color}`, borderRadius: 4, background: 'color-mix(in srgb, var(--bg) 40%, transparent)' }}>
                       <div style={{ fontSize: 9, color: luckItem.color, marginBottom: 2 }}>{luckItem.item.climate.label}</div>
                       <div style={{ fontSize: 10, color: 'var(--ink-2)', lineHeight: 1.4 }}>{luckItem.item.climate.text}</div>
                    </div>
                  )}
                  {luckItem.item?.impacts?.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12, textAlign: 'left' }}>
                      {luckItem.item.impacts.map(imp => (
                        <div key={imp.label} style={{ fontSize: 10, padding: '8px', borderRadius: 4, background: imp.type === 'chong' ? 'var(--seal-deep)' : 'color-mix(in srgb, var(--gold) 15%, transparent)', color: imp.type === 'chong' ? '#fff' : 'var(--ink-2)', border: '1px solid currentColor' }}>
                           <strong style={{ display: 'block', marginBottom: 2 }}>{imp.label}</strong>
                           <div style={{ opacity: 0.9, lineHeight: 1.4 }}>{imp.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 8 }}>
                    {luckItem.item?.year || luckItem.item?.date || ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="section-decade-list" className="result-wide visual-block" style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--rule)' }}>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 16, letterSpacing: '0.2em', color: 'var(--ink)', marginBottom: 12, textAlign: 'center' }}>
              生涯の大運表（10年ごとの運勢）
            </div>
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.8, marginBottom: 24 }}>
              大運はあなたの人生の背景を流れる大きな季節のようなものです。
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {decade.map(d => {
                const isCurrent = d.name === currentDecade?.name;
                const dTheme = decadeTheme(d);
                return (
                  <div key={d.name} style={{ display: 'flex', flexDirection: 'column', padding: '20px', background: isCurrent ? 'color-mix(in srgb, var(--gold) 10%, transparent)' : 'var(--bg-paper)', border: isCurrent ? '1px solid var(--gold)' : '1px solid var(--rule)', borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ width: 80, fontSize: 13, fontFamily: 'var(--f-mono)', color: isCurrent ? 'var(--gold)' : 'var(--ink-3)' }}>
                        {d.startAge}〜{d.endAge}歳
                      </div>
                      <div style={{ fontSize: 24, fontFamily: 'var(--f-display)', width: 80, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '0.6em', filter: 'grayscale(0.3)' }}>{STEM_ICONS[d.pillar.stem]}</span>
                        {d.pillar.text}
                      </div>
                      <div style={{ flex: 1, fontSize: 14, color: 'var(--ink)', fontWeight: 'bold' }}>
                        {d.pillar.heavenlyTenGod}
                      </div>
                      {isCurrent && <div style={{ fontSize: 11, background: 'var(--gold)', color: 'var(--bg)', padding: '2px 10px', borderRadius: 4, letterSpacing: '0.1em', fontWeight: 'bold' }}>現在</div>}
                    </div>
                    
                    <div style={{ paddingLeft: 8, borderLeft: `2px solid ${isCurrent ? 'var(--gold)' : 'var(--rule)'}` }}>
                      <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                        {d.pillar.fortuneTheme}
                      </div>
                      {d.impacts?.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                          {d.impacts.map(imp => (
                            <div key={imp.label} style={{ fontSize: 11, padding: '8px 12px', borderRadius: 4, background: imp.type === 'chong' ? 'var(--seal-deep)' : 'color-mix(in srgb, var(--gold) 15%, transparent)', color: imp.type === 'chong' ? '#fff' : 'var(--ink-2)', border: '1px solid currentColor' }}>
                               <strong style={{ display: 'block', marginBottom: 2 }}>{imp.label}</strong>
                               <div style={{ opacity: 0.9, lineHeight: 1.4 }}>{imp.text}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div id="section-annual-list" className="result-wide visual-block" style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--rule)' }}>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 16, letterSpacing: '0.2em', color: 'var(--ink)', marginBottom: 12, textAlign: 'center' }}>
              直近の流年表（1年ごとの運勢）
            </div>
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.8, marginBottom: 24 }}>
              流年はその年ごとに訪れる具体的なテーマや出来事の傾向を示します。
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(luck.annualFortunes || []).slice(0, 10).map(a => {
                const isCurrent = a.year === currentAnnual?.year;
                return (
                  <div key={a.year} style={{ display: 'flex', flexDirection: 'column', padding: '16px', background: isCurrent ? 'color-mix(in srgb, var(--accent) 15%, transparent)' : 'var(--bg-paper)', border: isCurrent ? '1px solid var(--accent)' : '1px solid var(--rule)', borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ width: 80, fontSize: 13, fontFamily: 'var(--f-mono)', color: isCurrent ? 'var(--accent)' : 'var(--ink-3)' }}>
                        {a.year}年
                      </div>
                      <div style={{ fontSize: 20, fontFamily: 'var(--f-display)', width: 80, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '0.6em', filter: 'grayscale(0.3)' }}>{STEM_ICONS[a.pillar.stem]}</span>
                        {a.pillar.text}
                      </div>
                      <div style={{ flex: 1, fontSize: 13, color: 'var(--ink)', fontWeight: 'bold' }}>
                        {a.pillar.heavenlyTenGod}
                      </div>
                      {isCurrent && <div style={{ fontSize: 11, background: 'var(--accent)', color: 'var(--bg)', padding: '2px 8px', borderRadius: 4, letterSpacing: '0.1em', fontWeight: 'bold' }}>今年</div>}
                    </div>
                    <div style={{ paddingLeft: 8, borderLeft: `2px solid ${isCurrent ? 'var(--accent)' : 'var(--rule)'}` }}>
                      <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                        {a.pillar.fortuneTheme}
                      </div>
                      {a.impacts?.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                          {a.impacts.map(imp => (
                            <div key={imp.label} style={{ fontSize: 10, padding: '6px 10px', borderRadius: 4, background: imp.type === 'chong' ? 'var(--seal-deep)' : 'color-mix(in srgb, var(--gold) 10%, transparent)', color: imp.type === 'chong' ? '#fff' : 'var(--ink-2)', border: '1px solid currentColor' }}>
                               <strong style={{ display: 'block', marginBottom: 2 }}>{imp.label}</strong>
                               <div style={{ opacity: 0.9, lineHeight: 1.4 }}>{imp.text}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function ResultView({ id, name, calculation, profile, onBack, onShowFortune }) {
  const percentages = elementPercentages(calculation);
  const tenGods = collectTenGods(calculation);
  const hiddenStems = collectHiddenStems(calculation);
  const meta = calculation.calculationMeta;
  const stemReading = STEM_READING[calculation.dayMaster] || { title: '日主の説明', text: '', tags: [] };
  const primaryGod = tenGods[0]?.[0];
  const secondaryGod = tenGods[1]?.[0] || primaryGod;
  const primaryGodReading = TEN_GOD_READING[primaryGod] || { tags: [], text: '通変星の出方を見ながら、表に出やすい行動傾向を読みます。' };
  const secondaryGodReading = TEN_GOD_READING[secondaryGod] || primaryGodReading;
  const strong = strongestElements(calculation).join('・');
  const weakAdvice = balanceAdvice(calculation);
  const tags = readingTags(calculation, tenGods);
  const tenGodRoles = topTenGodEntries(calculation);
  const luck = calculation.luckCycles || {};
  const decade = luck.decadeFortunes;
  const annualFortunes = (luck.annualFortunes || []).slice(0, 6);
  const currentAnnual = currentAnnualFortune(calculation);
  const currentDecade = currentDecadeFortune(decade, luck.target?.year || currentAnnual?.year);
  const currentDecadeTheme = decadeTheme(currentDecade);

  const scrollTo = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      // Offset for fixed header if needed
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const shenShaSet = new Set();
  PILLAR_KEYS.forEach(key => {
    const pillar = calculation.pillars[key];
    getShenSha(pillar.branch, calculation.pillars.day.stem, calculation.pillars.year.branch, calculation.pillars.day.branch).forEach(ss => shenShaSet.add(ss));
  });
  const uniqueShenSha = Array.from(shenShaSet);

  return (
    <section className="rite" data-screen-label="03 命式">
      <aside className="rite-side">
        <div className="kanji">命式</div>
        <div className="label">MEISHIKI · CHART</div>
        <div className="seal-stack">
          <div style={{ cursor: 'pointer' }} onClick={() => scrollTo('section-daymaster')}><span className="num">壹</span>　日主と性格</div>
          <div style={{ cursor: 'pointer' }} onClick={() => scrollTo('section-pillars')}><span className="num">貳</span>　四柱の構成</div>
          <div style={{ cursor: 'pointer' }} onClick={() => scrollTo('section-wuxing')}><span className="num">參</span>　五行バランス</div>
          <div style={{ cursor: 'pointer' }} onClick={() => scrollTo('section-tengod')}><span className="num">肆</span>　十神の強み</div>
          <div style={{ cursor: 'pointer' }} onClick={() => scrollTo('section-shensha')}><span className="num">伍</span>　神煞（特殊星）</div>
          <div style={{ marginTop: 24 }}>
             <button onClick={onBack} style={{ background: 'transparent', border: 0, color: 'var(--ink-3)', cursor: 'pointer', fontFamily: 'var(--f-mono)', letterSpacing: '0.2em' }}>
               ← 入力へ戻る
             </button>
          </div>
        </div>
      </aside>

      <div className="rite-main" style={{ paddingBottom: 120 }}>
        <div className="result-card" id={id} style={{ marginTop: 0 }}>
          <div className="result-summary result-wide" id="section-daymaster" style={{ paddingTop: 20 }}>
            <div className="summary-kicker">四柱推命 鑑定結果</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, marginTop: 12 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'color-mix(in srgb, var(--gold) 10%, transparent)', border: '1px solid var(--gold)', display: 'grid', placeItems: 'center', fontSize: 32, filter: 'grayscale(0.2)' }}>
                {STEM_ICONS[calculation.dayMaster]}
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', letterSpacing: '0.1em', marginBottom: 4 }}>
                  あなたを表す星（日主）： <strong className={elementClass(calculation.pillars.day.element.stem)} style={{ fontSize: 16 }}>{calculation.dayMaster} ({calculation.pillars.day.element.stem})</strong>
                </div>
                <h2 style={{ margin: 0, fontSize: 24, letterSpacing: '0.05em' }}>
                  {stemReading.title}
                </h2>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--ink-2)' }}>
              {stemReading.text}
            </p>
            <div className="result-tags">
              {tags.map((tag) => <span key={tag}># {tag}</span>)}
            </div>
            {calculation.strength && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
                <div style={{ padding: '16px 20px', background: 'color-mix(in srgb, var(--gold) 10%, transparent)', border: '1px solid var(--rule)', borderRadius: 6 }}>
                  <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em', marginBottom: 6 }}>エネルギーの強弱</div>
                  <strong style={{ fontSize: 15, color: 'var(--gold)', display: 'block', marginBottom: 4 }}>◆ {calculation.strength.status}</strong>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>{calculation.strength.text}</p>
                </div>
                {calculation.pattern && (
                  <div style={{ padding: '16px 20px', background: 'color-mix(in srgb, var(--accent) 10%, transparent)', border: '1px solid var(--rule)', borderRadius: 6 }}>
                    <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em', marginBottom: 6 }}>命式の格局（社会的役割）</div>
                    <strong style={{ fontSize: 15, color: 'var(--accent)', display: 'block', marginBottom: 4 }}>◆ {calculation.pattern.name}</strong>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>{calculation.pattern.text}</p>
                  </div>
                )}
              </div>
            )}

            {calculation.yongShen && (
              <div style={{ marginTop: 16, padding: '20px', background: 'color-mix(in srgb, var(--seal) 4%, transparent)', border: '1px solid var(--rule)', borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em', marginBottom: 12 }}>守護の五行（窮通宝鑑による調候用神）</div>
                <div style={{ display: 'flex', gap: 20, alignItems: 'start' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 24 }}>{STEM_ICONS[calculation.yongShen.primary]}</div>
                      <div style={{ fontSize: 18, color: 'var(--seal)', fontWeight: 'bold' }}>{calculation.yongShen.primary}</div>
                      <div style={{ fontSize: 9, color: 'var(--ink-3)' }}>第一守護</div>
                    </div>
                    {calculation.yongShen.secondary && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 24 }}>{STEM_ICONS[calculation.yongShen.secondary]}</div>
                        <div style={{ fontSize: 18, color: 'var(--gold)', fontWeight: 'bold' }}>{calculation.yongShen.secondary}</div>
                        <div style={{ fontSize: 9, color: 'var(--ink-3)' }}>第二守護</div>
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, paddingTop: 4 }}>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7 }}>
                      {calculation.yongShen.text}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

      <div id="section-pillars" style={{ paddingTop: 40, marginTop: 40, borderTop: '1px solid var(--rule)' }}>
        <div style={{
          fontFamily: 'var(--f-display)',
          fontSize: 16,
          letterSpacing: '0.2em',
          color: 'var(--ink)',
          marginBottom: 12,
          textAlign: 'center'
        }}>
          四柱の構成
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.8, marginBottom: 32 }}>
          命主 {name || '無名'} が生まれ持った4つの柱です。<br/>日柱が自分自身を表し、他の柱は周囲の環境や時間軸を表します。
        </p>
        <div className="pillars">
          {['hour', 'day', 'month', 'year'].map((key) => {
            const pillar = calculation.pillars[key];
            const shenShaList = getShenSha(pillar.branch, calculation.pillars.day.stem, calculation.pillars.year.branch, calculation.pillars.day.branch);
            const isVoid = pillar.voidBranches?.includes(pillar.branch);
            return (
            <div key={key} className={`pillar ${key === 'day' ? 'is-day' : ''}`}>
              <div className="lbl">
                {PILLAR_LABELS[key]}
                {isVoid && <span style={{ marginLeft: 6, color: 'var(--seal)', fontSize: 9 }}>[空亡]</span>}
              </div>
              <div className="gz">
                <span className={`top ${elementClass(pillar.element.stem)}`}>
                  <div style={{ fontSize: '0.45em', opacity: 0.85, marginBottom: 4, filter: 'grayscale(0.2)' }}>{STEM_ICONS[pillar.stem] || ''}</div>
                  {pillar.stem}
                </span>
                <span className={`btm ${elementClass(pillar.element.branch)}`}>{pillar.branch}</span>
              </div>
              <div className="nayin">
                <span style={{ fontWeight: 'bold', color: 'var(--ink)' }}>{calculation.tenGods[key]}</span>
                <div style={{ fontSize: '0.9em', marginTop: 2 }}>{pillar.lifeStage || '—'}</div>
                <div style={{ fontSize: '0.8em', opacity: 0.6, marginTop: 4 }}>{pillar.naYin || '—'}</div>
              </div>
              <div className="shensha">
                {shenShaList.map(ss => <div key={ss} className="shensha-badge">{ss}</div>)}
              </div>
            </div>
            );
          })}
        </div>

        {calculation.luckCycles?.natalInteractions?.length > 0 && (
          <div style={{ marginTop: 24, padding: '16px', background: 'color-mix(in srgb, var(--ink) 4%, transparent)', border: '1px solid var(--rule)', borderRadius: 6 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em', marginBottom: 12 }}>命局内の干支関係（冲・合）</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {calculation.luckCycles.natalInteractions.map(inter => (
                <div key={inter.label}>
                  <strong style={{ fontSize: 13, color: 'var(--gold)', display: 'block', marginBottom: 2 }}>◆ {inter.label}</strong>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6 }}>{inter.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="calculation-meta">
          <span>真太陽時：{formatDateTimeLabel(meta.effectiveBirthDateTime)}</span>
          <span>出生地：{stripJapan(meta.location?.label)}</span>
          <span>日主：{calculation.dayMaster}{calculation.pillars.day.element.stem}</span>
        </div>
      </div>

      <div id="section-wuxing" className="result-wide visual-block" style={{ marginTop: 48, paddingTop: 40, borderTop: '1px solid var(--rule)' }}>
        <div style={{
          fontFamily: 'var(--f-display)',
          fontSize: 16,
          letterSpacing: '0.2em',
          color: 'var(--ink)',
          marginBottom: 12,
          textAlign: 'center'
        }}>
          五行と十神のバランス
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.8, marginBottom: 32 }}>
          {calculation.dayMaster}{calculation.pillars.day.element.stem} を日主（自分自身）とした時の、五行の相生・相剋と十神の対応図です。<br/>
          数字は命式内の各五行の数を表します。
        </p>
        <WuxingDiagram dayElement={calculation.pillars.day.element.stem} elementCounts={calculation.fiveElements.counts} />
      </div>

      <div id="section-tengod" className="result-wide visual-block" style={{ marginTop: 48, paddingTop: 40, borderTop: '1px solid var(--rule)' }}>
        <div style={{
          fontFamily: 'var(--f-display)',
          fontSize: 16,
          letterSpacing: '0.2em',
          color: 'var(--ink)',
          marginBottom: 12,
          textAlign: 'center'
        }}>
          命式から見えた あなたの「強み」と「武器」
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.8, marginBottom: 32 }}>
          命式に現れた「十神（通変星）」の力関係から、<br/>あなたが無意識に使っている才能や、社会で活かしやすい武器を読み解きます。
        </p>

        <div className="ten-god-map" style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {tenGodRoles.map((god, idx) => (
            <article key={god.name} style={{ display: 'flex', gap: '16px', padding: '20px', border: '1px solid var(--rule-strong)', background: 'var(--bg-paper)', borderRadius: '8px' }}>
              <div className="god-symbol" style={{ width: '48px', height: '48px', flexShrink: 0, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--rule)', display: 'grid', placeItems: 'center', fontSize: '20px', fontFamily: 'var(--f-display)', color: 'var(--ink)' }}>
                {god.icon}
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '15px', color: 'var(--ink)', marginBottom: '4px', letterSpacing: '0.1em' }}>
                  {god.role} <span style={{ fontSize: '11px', color: 'var(--ink-3)', marginLeft: '8px', letterSpacing: '0' }}>{god.name} ({god.total}個)</span>
                </strong>
                <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.7', color: 'var(--ink-2)' }}>
                  {god.text}
                </p>
                <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(TEN_GOD_READING[god.name]?.tags || []).map(tag => (
                    <span key={tag} style={{ fontSize: '10px', color: 'var(--accent)', background: 'color-mix(in srgb, var(--accent) 15%, transparent)', padding: '2px 8px', borderRadius: '4px' }}>#{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="divinations">
        <div className="head">命式 要点</div>
        <div className="row"><span>命式</span><span className="v">{calculation.pillarLine}</span></div>
        <div className="row"><span>日主</span><span className="v">{calculation.dayMaster}{calculation.pillars.day.element.stem}</span></div>
        <div className="row"><span>主要十神</span><span className="v">{tenGods.slice(0, 3).map(([god]) => god).join('・') || '—'}</span></div>
        <div className="row"><span>藏干</span><span className="v">{hiddenStems.slice(0, 4).map(item => `${item.stem}${item.element}`).join('・') || '—'}</span></div>
        <div className="row"><span>時柱</span><span className="v">{profile.unsure ? '不詳 / 午時仮計算' : calculation.pillars.hour.text}</span></div>
        <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2.0, color: 'var(--ink-3)' }}>
          ※ 結果は四柱推命の命式をわかりやすく整理したものです。断定ではなく、自分を理解するためのヒントとしてご覧ください。
        </div>
      </div>

      <div className="result-wide reading-block">
        <div className="section-caption">あなたの本質</div>
        <div className="reading-grid">
          <article>
            <span>日主</span>
            <h3>{stemReading.title}</h3>
            <p>{stemReading.text}</p>
          </article>
          <article>
            <span>性格の傾向</span>
            <h3>{primaryGod || '命式全体'}</h3>
            <p>{primaryGodReading.text}</p>
          </article>
          <article>
            <span>恋愛・対人</span>
            <h3>{secondaryGod || '関係性'}</h3>
            <p>関係性では、表に出る態度と内側の欲求のバランスを見ます。{secondaryGodReading.text}</p>
          </article>
          <article>
            <span>仕事・才能</span>
            <h3>{strong || '五行バランス'}</h3>
            <p>仕事では、自然に使いやすい五行と通変星の組み合わせが強みになります。無理に職種を断定せず、力を出しやすい役割として見ます。</p>
          </article>
        </div>
      </div>

      <div className="result-wide">
        <div className="section-caption">五行バランス</div>
        <div className="element-bars user-bars">
          {ELEMENT_LABELS.map((name) => (
            <div className="element-row" key={name}>
              <span>{name}</span>
              <div className="bar"><span className={elementClass(name)} style={{ width: `${Math.max(4, percentages[name])}%` }}></span></div>
              <strong>{percentages[name]}%</strong>
            </div>
          ))}
        </div>
        <p className="balance-copy">
          五行は木・火・土・金・水のバランスを見ます。この命式では {strong} が出やすく、
          {weakAdvice.support.join('・')} を生活の中で意識すると整いやすい配置です。{weakAdvice.text}
        </p>
        <div className="element-guide-grid">
          {ELEMENT_LABELS.map((name) => (
            <article className={`element-guide ${elementClass(name)}`} key={name}>
              <span className="element-symbol">{name}</span>
              <div>
                <strong>{elementStateLabel(calculation, name)}</strong>
                <p>{elementGuideText(name)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div id="section-shensha" className="result-wide visual-block" style={{ marginTop: 48, paddingTop: 40, borderTop: '1px solid var(--rule)' }}>
        <div style={{
          fontFamily: 'var(--f-display)',
          fontSize: 16,
          letterSpacing: '0.2em',
          color: 'var(--ink)',
          marginBottom: 12,
          textAlign: 'center'
        }}>
          命局の「神煞（特殊星）」
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.8, marginBottom: 32 }}>
          特定の干支の組み合わせによって生じる特殊な星「神煞」です。<br/>あなたの運命に宿る特別なご加護や傾向を示します。
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          {uniqueShenSha.length > 0 ? uniqueShenSha.map(ss => (
            <div key={ss} style={{ border: '1px solid var(--gold)', background: 'color-mix(in srgb, var(--gold) 10%, var(--bg))', padding: '12px 24px', borderRadius: '4px', fontFamily: 'var(--f-display)', color: 'var(--ink)', letterSpacing: '0.1em' }}>
              {ss}
            </div>
          )) : (
            <div style={{ color: 'var(--ink-3)', fontSize: '13px' }}>特に目立つ神煞はありません（フラットな命局です）。</div>
          )}
        </div>
      </div>

      <div className="result-wide visual-block">
        <div className="section-caption">大運・流年を見る</div>
        <div className="luck-summary">
          <div>
            <span className="summary-kicker">CURRENT YEAR</span>
            <h3>{currentAnnual ? `${currentAnnual.year}年 · ${currentAnnual.name}` : '流年'}</h3>
            <p>{currentAnnual ? cycleReading(currentAnnual.pillar) : '今年の干支を命式と合わせて読みます。'}</p>
          </div>
          <div>
            <span className="summary-kicker">DECADE FLOW</span>
            <h3>大運は10年単位の流れ</h3>
            <p>大運は人生の背景に流れる大きな運の周期です。性別により順行・逆行が変わるため、正確に見る場合は性別指定が必要です。</p>
          </div>
        </div>

        {decade?.status === 'ok' ? (
          <React.Fragment>
            {currentDecadeTheme && (
              <div className="current-decade-card">
                <span className="luck-chip">現在の大運</span>
                <h3>{currentDecadeTheme.title}</h3>
                <p>{currentDecadeTheme.intro}</p>
                <div className="decade-theme-grid">
                  <article><strong>仕事</strong><p>{currentDecadeTheme.work}</p></article>
                  <article><strong>財運</strong><p>{currentDecadeTheme.money}</p></article>
                  <article><strong>恋愛・対人</strong><p>{currentDecadeTheme.love}</p></article>
                  <article><strong>読み方</strong><p>{currentDecadeTheme.care}</p></article>
                </div>
              </div>
            )}
            <div className="luck-reading-grid decade-grid">
              {decade.items.slice(0, 4).map((item) => (
                <article className={`luck-card ${item === currentDecade ? 'is-current' : ''}`} key={`${item.index}-${item.name}`}>
                  <span className="luck-chip">{item.startAge}-{item.endAge}歳</span>
                  <h3>{item.name}</h3>
                  <p>{item.startYear}年 - {item.endYear}年 / {genderLabel(decade.gender)}・{directionLabel(decade.direction)}</p>
                  <small>{cycleReading(item.pillar)}</small>
                </article>
              ))}
            </div>
          </React.Fragment>
        ) : (
          <div className="luck-note">
            <strong>大運を表示するには性別を選択してください</strong>
            <p>現在は「無 / 不問」のため、大運の順逆を確定できません。フォーム上部の性別で「陽 / 男」または「陰 / 女」を選ぶと、大運表と解説を表示します。</p>
          </div>
        )}

        <div className="luck-reading-grid annual-grid">
          {annualFortunes.map((item) => (
            <article className={`luck-card ${item === currentAnnual ? 'is-current' : ''}`} key={item.year}>
              <span className="luck-chip">{item.year}</span>
              <h3>{item.name}</h3>
              <p>{item.pillar.heavenlyTenGod || '—'} / {item.pillar.element.stem}・{item.pillar.element.branch}</p>
              <small>{cycleReading(item.pillar)}</small>
            </article>
          ))}
        </div>
      </div>

      <div className="result-wide">
        <div className="section-caption">命式詳細</div>
        <div className="bazi-board-lite">
          <div className="bazi-lite-row head">
            <span>項目</span>
            {PILLAR_KEYS.map((key) => <strong key={key}>{PILLAR_LABELS[key]}</strong>)}
          </div>
          <div className="bazi-lite-row">
            <span>干神</span>
            {PILLAR_KEYS.map((key) => <strong key={key}>{calculation.tenGods[key]}</strong>)}
          </div>
          <div className="bazi-lite-row">
            <span>天干</span>
            {PILLAR_KEYS.map((key) => <strong key={key} className={elementClass(calculation.pillars[key].element.stem)}>{calculation.pillars[key].stem}</strong>)}
          </div>
          <div className="bazi-lite-row">
            <span>地支</span>
            {PILLAR_KEYS.map((key) => <strong key={key} className={elementClass(calculation.pillars[key].element.branch)}>{calculation.pillars[key].branch}</strong>)}
          </div>
          <div className="bazi-lite-row compact">
            <span>藏干</span>
            {PILLAR_KEYS.map((key) => <strong key={key}>{calculation.pillars[key].hiddenStems.join('・') || '—'}</strong>)}
          </div>
          <div className="bazi-lite-row compact">
            <span>纳音</span>
            {PILLAR_KEYS.map((key) => <strong key={key}>{calculation.pillars[key].naYin || '—'}</strong>)}
          </div>
          <div className="bazi-lite-row compact">
            <span>空亡</span>
            {PILLAR_KEYS.map((key) => <strong key={key}>{(calculation.pillars[key].voidBranches || []).join('') || '—'}</strong>)}
          </div>
          <div className="bazi-lite-row compact">
            <span>地勢</span>
            {PILLAR_KEYS.map((key) => <strong key={key}>{calculation.pillars[key].terrainByDay || '—'}</strong>)}
          </div>
          <div className="bazi-lite-row compact">
            <span>自坐</span>
            {PILLAR_KEYS.map((key) => <strong key={key}>{calculation.pillars[key].terrainSelf || '—'}</strong>)}
          </div>
        </div>
      </div>

      {meta.warnings?.length > 0 && (
        <div className="result-wide notice-list">
          {meta.warnings.map((warning) => (
            <div className="notice" key={warning}>{WARNING_LABELS[warning] || warning}</div>
          ))}
        </div>
      )}

      <div className="result-wide next-actions">
        <button onClick={onShowFortune}>大運・流年を見る <span>運勢</span></button>
        <button disabled>相性を見る <span>準備中</span></button>
        <button disabled>結果を保存する <span>準備中</span></button>
      </div>
    </div>
    </div>
    </section>
  );
}

window.Rite = Rite;
window.ResultView = ResultView;
window.FortuneView = FortuneView;
