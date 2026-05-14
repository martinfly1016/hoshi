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
  const [page, setPage] = React.useState('hero');   // hero | rite
  const [washing, setWashing] = React.useState(false);

  // apply theme attrs to <html> so global CSS picks them up
  React.useEffect(() => {
    const el = document.documentElement;
    el.dataset.theme = tweaks.theme;
    el.dataset.type = tweaks.type;
    el.dataset.motion = tweaks.motion;
    el.dataset.hero = tweaks.hero;
  }, [tweaks]);

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
            onClick={() => goto('rite')}>鑑定の儀</button>
          <button>命　式</button>
          <button>星辰譜</button>
        </nav>
        <div style={{
          fontFamily: 'var(--f-mono)',
          color: 'var(--ink-3)',
          letterSpacing: '0.3em',
          fontSize: 10,
        }}>
          令和七年 · 丙午
        </div>
      </header>

      <main className="page">
        {page === 'hero' && <Hero onEnter={() => goto('rite')} />}
        {page === 'rite' && <Rite onBack={() => goto('hero')}
          onSubmitDone={() => {}} />}
      </main>

      <div className={`ink-wash ${washing ? 'show' : ''}`}></div>

      <TweaksPanel title="Tweaks">
        <TweakSection title="主題 — Theme">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
          }}>
            {THEMES.map(t => (
              <button key={t.key}
                onClick={() => setTweak('theme', t.key)}
                style={{
                  textAlign: 'left',
                  padding: 10,
                  border: tweaks.theme === t.key
                    ? '1px solid #fff' : '1px solid rgba(255,255,255,0.16)',
                  background: tweaks.theme === t.key
                    ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex', flexDirection: 'column', gap: 8,
                }}>
                <div style={{ display: 'flex', gap: 4, height: 18 }}>
                  {t.palette.map((c, i) => (
                    <div key={i} style={{ flex: 1, background: c }}></div>
                  ))}
                </div>
                <div style={{ fontSize: 13, letterSpacing: '0.2em' }}>
                  {t.ja}
                  <span style={{
                    fontSize: 9,
                    color: 'rgba(255,255,255,0.5)',
                    marginLeft: 8,
                    letterSpacing: '0.3em',
                  }}>{t.romaji}</span>
                </div>
              </button>
            ))}
          </div>
        </TweakSection>

        <TweakSection title="字体 — Type">
          <TweakRadio
            value={tweaks.type}
            onChange={(v) => setTweak('type', v)}
            options={[
              { value: 'mincho', label: '衬线 明朝' },
              { value: 'song',   label: '仿宋 Yuji' },
              { value: 'kaisho', label: '楷体 Syuku' },
            ]} />
        </TweakSection>

        <TweakSection title="動效 — Motion">
          <TweakRadio
            value={tweaks.motion}
            onChange={(v) => setTweak('motion', v)}
            options={[
              { value: 'off',  label: '関' },
              { value: 'soft', label: '弱' },
              { value: 'full', label: '強' },
            ]} />
        </TweakSection>

        <TweakSection title="Hero 排版">
          <TweakRadio
            value={tweaks.hero}
            onChange={(v) => setTweak('hero', v)}
            options={[
              { value: 'centered', label: '居中庄严' },
              { value: 'offset',   label: '偏置留白' },
            ]} />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
