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
  const [unsure, setUnsure] = React.useState(false);
  const [pref, setPref] = React.useState('');
  const [city, setCity] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [showStamp, setShowStamp] = React.useState(false);

  const valid = name && gender && year && month && day && (shi || unsure) && pref;

  const submit = () => {
    if (!valid || busy) return;
    setBusy(true);
    setShowStamp(true);
    window.setTimeout(() => {
      setShowStamp(false);
      setBusy(false);
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
          hint="二時刻ごとに一辰、不詳の場合はその旨を選べ">
          <div className="chips">
            {SHI_HOURS.map(s => (
              <button key={s.ji}
                className={`chip ${shi === s.ji && !unsure ? 'on' : ''}`}
                onClick={() => { setShi(s.ji); setUnsure(false); }}>
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
              <select value={pref} onChange={e => setPref(e.target.value)}>
                <option value="">— 都府県を選ぶ —</option>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                <option value="海外">海　外（その他）</option>
              </select>
            </div>
            <div className="input-line with-mark" data-mark="市町村">
              <input value={city} onChange={e => setCity(e.target.value)}
                placeholder="例 ）京都市 上京区" />
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

        {done && <ResultPreview id="result-card"
          name={name} pref={pref} shi={shi} unsure={unsure} />}

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

function ResultPreview({ id, name, pref, shi, unsure }) {
  // mock 八字 — purely visual placeholder
  const tg = ['丙','戊','庚','癸'];
  const dz = ['寅','申','子','酉'];
  const nayin = ['炉中火','大駅土','壁上土','剣鋒金'];
  const labels = ['年柱','月柱','日柱','時柱'];

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
          {labels.map((l, i) => (
            <div key={l} className="pillar">
              <div className="lbl">{l}</div>
              <div className="gz">
                <span className="top">{tg[i]}</span>
                <span className="btm">{dz[i]}</span>
              </div>
              <div className="nayin">{nayin[i]}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="divinations">
        <div className="head">星辰 卜断</div>
        <div className="row"><span>命宮</span><span className="v">巳宮 · 朱雀</span></div>
        <div className="row"><span>本命星</span><span className="v">紫微 · 太陰</span></div>
        <div className="row"><span>大運</span><span className="v">己卯 · 三十二歳起</span></div>
        <div className="row"><span>流年</span><span className="v">丙午 · 火運盛</span></div>
        <div className="row"><span>吉方</span><span className="v">{pref || '南'} ／ 東南</span></div>
        <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2.0, color: 'var(--ink-3)' }}>
          {unsure
            ? '※ 時辰不詳のため、時柱は概略にて推算す。続きは詳鑑にて——'
            : '※ 此は序断の一片。詳細鑑書は次の門にて続く——'}
        </div>
      </div>
    </div>
  );
}

window.Rite = Rite;
