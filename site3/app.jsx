/* App root — routing + theme + tweaks */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "tsukiyo",
  "type": "mincho",
  "motion": "full",
  "hero": "centered"
}/*EDITMODE-END*/;

const THEMES = [
  { key: 'tsukiyo',   ja: '月夜',   romaji: 'TSUKIYO',   palette: ['#0d1018', '#ebe3d1', '#6480a8', '#a23b30'] },
  { key: 'kamishiro', ja: '紙白',   romaji: 'KAMISHIRO', palette: ['#f1ebdd', '#14171f', '#2c3a66', '#a23b30'] },
  { key: 'aifukashi', ja: '靛深',   romaji: 'AIFUKASHI', palette: ['#08112a', '#d8d4c4', '#7c98d0', '#c2493a'] },
  { key: 'shuboku',   ja: '朱墨',   romaji: 'SHUBOKU',   palette: ['#ece2cd', '#181208', '#8a2818', '#8a2818'] },
];

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page, setPage] = React.useState('hero');   // hero | rite | result | fortune | insight
  const [washing, setWashing] = React.useState(false);
  const [calcResult, setCalcResult] = React.useState(null);

  // Auto-calculated current year info
  const yearInfo = React.useMemo(() => {
    const y = new Date().getFullYear();
    const reiwaYear = y - 2018;
    const kanjiDigits = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    let reiwaStr = '';
    if (reiwaYear === 1) reiwaStr = '元';
    else if (reiwaYear < 10) reiwaStr = kanjiDigits[reiwaYear];
    else if (reiwaYear === 10) reiwaStr = '十';
    else if (reiwaYear < 20) reiwaStr = '十' + (reiwaYear % 10 === 0 ? '' : kanjiDigits[reiwaYear % 10]);
    else reiwaStr = kanjiDigits[Math.floor(reiwaYear / 10)] + '十' + (reiwaYear % 10 === 0 ? '' : kanjiDigits[reiwaYear % 10]);

    const stems = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
    const branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    const stem = stems[(y - 4) % 10];
    const branch = branches[(y - 4) % 12];

    const tens = ['', 'X', 'XX', 'XXX', 'XL', 'L'];
    const units = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    const roman = 'MM' + tens[Math.floor((y % 100) / 10)] + units[y % 10];

    return {
      reiwa: `令和${reiwaStr}年`,
      ganzhi: `${stem}${branch}`,
      roman: roman
    };
  }, []);
  
  if (typeof window !== 'undefined') {
    window.__hoshiYearInfo = yearInfo;
  }

  // Active theme state
  const [activeTheme, setActiveTheme] = React.useState(() => {
    try {
      const saved = localStorage.getItem('hoshi-user-theme');
      if (saved) return saved;
      const isLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      return isLight ? 'kamishiro' : 'tsukiyo';
    } catch (e) {
      return tweaks.theme;
    }
  });

  React.useEffect(() => {
    if (tweaks.theme !== activeTheme && tweaks.theme !== TWEAK_DEFAULTS.theme) {
      setActiveTheme(tweaks.theme);
      try { localStorage.setItem('hoshi-user-theme', tweaks.theme); } catch(e){}
    }
  }, [tweaks.theme]);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e) => {
      try {
        if (!localStorage.getItem('hoshi-user-theme')) {
          const next = e.matches ? 'kamishiro' : 'tsukiyo';
          setActiveTheme(next);
          setTweak('theme', next);
        }
      } catch(e){}
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [setTweak]);

  const toggleTheme = () => {
    const isLight = activeTheme === 'kamishiro' || activeTheme === 'shuboku';
    const next = isLight ? 'tsukiyo' : 'kamishiro';
    setActiveTheme(next);
    setTweak('theme', next);
    try { localStorage.setItem('hoshi-user-theme', next); } catch(e){}
  };

  React.useEffect(() => {
    const el = document.documentElement;
    el.dataset.theme = activeTheme;
    el.dataset.type = tweaks.type;
    el.dataset.motion = tweaks.motion;
    el.dataset.hero = tweaks.hero;
  }, [activeTheme, tweaks]);

  const goto = (target) => {
    if (target === page) return;
    setWashing(true);
    window.setTimeout(() => {
      setPage(target);
      window.scrollTo({ top: 0 });
      window.setTimeout(() => setWashing(false), 80);
    }, 520);
  };

  return (
    <React.Fragment>
      <div className="grain"></div>

      <header className="chrome">
        <div className="mark">
          <span className="seal">命</span>
          <span>星 の 命 式</span>
        </div>
        <nav>
          <button className={page === 'hero' ? 'is-active' : ''}
            onClick={() => goto('hero')}>序　章</button>
          <button className={page === 'rite' ? 'is-active' : ''}
            onClick={() => goto('rite')}>命式作成</button>
          <button className={page === 'result' ? 'is-active' : ''}
            onClick={() => { if (calcResult) goto('result'); }}
            style={{ opacity: calcResult ? 1 : 0.4, cursor: calcResult ? 'pointer' : 'not-allowed' }}>命　式</button>
          <button className={page === 'insight' ? 'is-active' : ''}
            onClick={() => { if (calcResult) goto('insight'); }}
            style={{ opacity: calcResult ? 1 : 0.4, cursor: calcResult ? 'pointer' : 'not-allowed' }}>詳　解</button>
          <button className={page === 'fortune' ? 'is-active' : ''}
            onClick={() => { if (calcResult) goto('fortune'); }}
            style={{ opacity: calcResult ? 1 : 0.4, cursor: calcResult ? 'pointer' : 'not-allowed' }}>星辰譜</button>
          <button onClick={toggleTheme} title="切り替え (明暗)" className="theme-toggle">
            {activeTheme === 'kamishiro' || activeTheme === 'shuboku' ? '☽' : '☀'}
          </button>
        </nav>
        <div style={{
          fontFamily: 'var(--f-mono)', color: 'var(--ink-3)', letterSpacing: '0.3em', fontSize: 10,
        }}>
          {yearInfo.reiwa} · {yearInfo.ganzhi}
        </div>
      </header>

      <main className="page">
        {page === 'hero' && <Hero onEnter={() => goto('rite')} />}
        {page === 'rite' && <Rite onBack={() => goto('hero')}
          onSubmitDone={(res) => {
            setCalcResult(res);
            goto('result');
          }} />}
        {page === 'result' && calcResult && (
          <ResultView 
            id="result-card"
            name={calcResult.profile.name} 
            calculation={calcResult.chart} 
            profile={calcResult.profile}
            onBack={() => goto('rite')}
            onShowFortune={() => goto('fortune')}
            onShowInsight={() => goto('insight')}
          />
        )}
        {page === 'insight' && calcResult && (
          <InsightView 
            calculation={calcResult.chart}
            onBack={() => goto('result')}
          />
        )}
        {page === 'fortune' && calcResult && (
          <FortuneView 
            calculation={calcResult.chart}
            profile={calcResult.profile}
            onBack={() => goto('result')}
          />
        )}
      </main>

      <div className={`ink-wash ${washing ? 'show' : ''}`}></div>

      <TweaksPanel title="Tweaks">
        <TweakSection title="主題 — Theme">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {THEMES.map(t => (
              <button key={t.key}
                onClick={() => {
                  setTweak('theme', t.key);
                  setActiveTheme(t.key);
                  try { localStorage.setItem('hoshi-user-theme', t.key); } catch(e){}
                }}
                style={{
                  textAlign: 'left', padding: 10,
                  border: activeTheme === t.key ? '1px solid #fff' : '1px solid rgba(255,255,255,0.16)',
                  background: activeTheme === t.key ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                <div style={{ display: 'flex', gap: 4, height: 18 }}>
                  {t.palette.map((c, i) => <div key={i} style={{ flex: 1, background: c }}></div>)}
                </div>
                <div style={{ fontSize: 13, letterSpacing: '0.2em' }}>
                  {t.ja}
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginLeft: 8, letterSpacing: '0.3em' }}>{t.romaji}</span>
                </div>
              </button>
            ))}
          </div>
        </TweakSection>
        <TweakSection title="字体 — Type">
          <TweakRadio value={tweaks.type} onChange={(v) => setTweak('type', v)}
            options={[{ value: 'mincho', label: '衬线 明朝' }, { value: 'song', label: '仿宋 Yuji' }, { value: 'kaisho', label: '楷体 Syuku' }]} />
        </TweakSection>
        <TweakSection title="動效 — Motion">
          <TweakRadio value={tweaks.motion} onChange={(v) => setTweak('motion', v)}
            options={[{ value: 'off', label: '関' }, { value: 'soft', label: '弱' }, { value: 'full', label: '強' }]} />
        </TweakSection>
        <TweakSection title="Hero 排版">
          <TweakRadio value={tweaks.hero} onChange={(v) => setTweak('hero', v)}
            options={[{ value: 'centered', label: '居中庄严' }, { value: 'offset', label: '偏置留白' }]} />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
