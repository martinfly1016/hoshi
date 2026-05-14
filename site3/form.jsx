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
  const [gender, setGender] = React.useState('');
  const [calendar, setCalendar] = React.useState('seireki'); // seireki | kyureki
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
  const valid = name && gender && year && month && day && locationId && (unsure || birthTime || shi);

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
          date: `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          timeKnown: !unsure,
          time: unsure ? '12:00' : (birthTime || representativeTime(shi)),
          locationId: selectedLocation.id,
          locationOverride: selectedLocation,
          timeCalculationMode: 'true_solar_time',
          lateZiHourMode: 'same_day',
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
    <section className="rite" data-screen-label="02 鑑定の儀">
      <aside className="rite-side">
        <div className="kanji">鑑　定<br/>の　儀</div>
        <div className="label">RITE · OF · DIVINATION</div>
        <div className="seal-stack">
          <div><span className="num">壹</span>　名と性</div>
          <div><span className="num">貳</span>　生年月日</div>
          <div><span className="num">參</span>　時辰</div>
          <div><span className="num">肆</span>　出生の地</div>
          <div style={{ marginTop: 18, color: 'var(--seal)' }}>
            <span className="num" style={{ color: 'var(--seal)' }}>伍</span>　卜を乞う
          </div>
        </div>
      </aside>

      <div className="rite-main">
        <div className="rite-intro">
          <h2>命式を編むに、四つの徴を奉ぜよ</h2>
          <p>
            星辰の巡りは古より変わらず、人の命式もまた然り。<br/>
            汝が名・性・生辰・出生の地を以て、二十八宿と十二支を擦り合わせ、
            その吉凶悔吝を顕さん。記したる事項は卜算のみに用い、外に漏らさず。
          </p>
        </div>

        <FormField num="壹 / 一" ja="名 諱" romaji="NA · IMINA"
          hint="本名でも、字（あざな）でも可">
          <div className="input-line with-mark" data-mark="NAME">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例 ）藤原 朔" />
          </div>
        </FormField>

        <FormField num="壹 / 二" ja="性 別" romaji="SEI · BETSU">
          <div className="gender-row">
            {[
              { key: 'yang', ja: '陽 / 男', sym: '☰' },
              { key: 'yin',  ja: '陰 / 女', sym: '☷' },
              { key: 'gen',  ja: '無 / 不問', sym: '☯' },
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
          hint="西暦と旧暦は切替可。出生時の暦に合わせよ">
          <div className="toggle-row">
            <button className={calendar === 'seireki' ? 'on' : ''}
              onClick={() => setCalendar('seireki')}>西　暦</button>
            <button className={calendar === 'kyureki' ? 'on' : ''}
              onClick={() => setCalendar('kyureki')}>旧　暦</button>
          </div>
          <div className="input-row">
            <div className="input-line with-mark" data-mark="年 / Y">
              <input value={year} onChange={e => setYear(e.target.value)}
                placeholder={calendar === 'seireki' ? '1996' : '丙子'} />
            </div>
            <div className="input-line with-mark" data-mark="月 / M">
              <input value={month} onChange={e => setMonth(e.target.value)}
                placeholder="08" />
            </div>
            <div className="input-line with-mark" data-mark="日 / D">
              <input value={day} onChange={e => setDay(e.target.value)}
                placeholder="14" />
            </div>
          </div>
          {calendar === 'kyureki' && (
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.2em' }}>
              ※ 旧暦・閏月の場合は月の下に「閏」を添えよ
            </div>
          )}
        </FormField>

        <FormField num="參 / 一" ja="時 辰" romaji="JI · SHIN"
          hint="正確な出生時刻があれば入力。不詳の場合はその旨を選べ">
          <div className="input-line with-mark" data-mark="時刻">
            <input
              type="time"
              value={birthTime}
              disabled={unsure}
              onChange={e => {
                setBirthTime(e.target.value);
                setShi('');
              }} />
          </div>
          <div className="chips">
            {SHI_HOURS.map(s => (
              <button key={s.ji}
                className={`chip ${shi === s.ji && !unsure ? 'on' : ''}`}
                onClick={() => { setShi(s.ji); setBirthTime(representativeTime(s.ji)); setUnsure(false); }}>
                <span className="ji">{s.ji}</span>
                <span className="hours">{s.hours}</span>
              </button>
            ))}
            <button
              className={`chip full-w ${unsure ? 'on' : ''}`}
              onClick={() => { setUnsure(true); setShi(''); }}>
              ── 不詳 / 時辰を識らず ──
            </button>
          </div>
        </FormField>

        <FormField num="肆 / 一" ja="出生の地" romaji="SHUSSEI · NO · CHI"
          hint="経緯度の補正に用いる。最寄りの都府県と市町村を記せ">
          <div className="input-row two">
            <div className="input-line with-mark" data-mark="都府県">
              <select value={locationId} onChange={e => setLocationId(e.target.value)}>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>{stripJapan(location.label)}</option>
                ))}
              </select>
            </div>
            <div className="input-line with-mark" data-mark="市町村">
              <input value={city} onChange={e => setCity(e.target.value)}
                placeholder="任意メモ：例 ）京都市 上京区" />
            </div>
          </div>
        </FormField>

        <div className="rite-submit">
          <div className="legal">
            記入内容は卜算と汝個人の鑑定書のみに用ふ。<br/>
            星辰の前にて、虚妄を語る勿れ。
          </div>
          <button className={`submit-btn ${busy ? 'busy' : ''}`}
            disabled={!valid || busy}
            onClick={submit}>
            <span>卜　を　乞　う</span>
            <span style={{ width: 28, height: 1, background: 'currentColor' }}></span>
            <span className="seal-stamp">命</span>
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
const ELEMENT_LABELS = ['木', '火', '土', '金', '水'];
const ELEMENT_CLASS = {
  木: 'wood',
  火: 'fire',
  土: 'earth',
  金: 'metal',
  水: 'water',
};
const WARNING_LABELS = {
  BIRTH_TIME_DEFAULTED_TO_NOON: '出生時間不詳のため、時柱は12:00で仮計算しています。',
  TRUE_SOLAR_TIME_APPLIED: '出生地の経度から真太陽時補正を適用しています。',
  TRUE_SOLAR_TIME_REQUIRES_BIRTHPLACE: '真太陽時計算には出生地の経緯度が必要です。',
  LATE_ZI_HOUR_MODE_USER_SELECTABLE: '23:00台は晚子時/子初換日で流派差が出ます。',
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

function ResultPreview({ id, name, calculation, profile }) {
  const percentages = elementPercentages(calculation);
  const tenGods = collectTenGods(calculation);
  const hiddenStems = collectHiddenStems(calculation);
  const meta = calculation.calculationMeta;

  return (
    <div className="result-card" id={id}>
      <div>
        <div style={{
          fontFamily: 'var(--f-display)',
          fontSize: 13,
          letterSpacing: '0.3em',
          color: 'var(--ink-2)',
          marginBottom: 18,
        }}>
          ── 命主 {name || '無名'} の四柱 ──
        </div>
        <div className="pillars">
          {PILLAR_KEYS.map((key) => {
            const pillar = calculation.pillars[key];
            return (
            <div key={key} className={`pillar ${key === 'day' ? 'is-day' : ''}`}>
              <div className="lbl">{PILLAR_LABELS[key]}</div>
              <div className="gz">
                <span className={`top ${elementClass(pillar.element.stem)}`}>{pillar.stem}</span>
                <span className={`btm ${elementClass(pillar.element.branch)}`}>{pillar.branch}</span>
              </div>
              <div className="nayin">{calculation.tenGods[key]} · {pillar.naYin || '—'}</div>
            </div>
            );
          })}
        </div>
        <div className="calculation-meta">
          <span>真太陽時：{formatDateTimeLabel(meta.effectiveBirthDateTime)}</span>
          <span>出生地：{stripJapan(meta.location?.label)}</span>
          <span>日主：{calculation.dayMaster}{calculation.pillars.day.element.stem}</span>
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
          ※ この表示は后台検証ページと同じ計算核心を使用しています。鑑定文と見せ方は今後ユーザー向けに調整します。
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
    </div>
  );
}

window.Rite = Rite;
