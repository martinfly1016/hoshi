/* App root — routing + theme + tweaks */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "kamishiro",
  "type": "mincho",
  "motion": "soft",
  "hero": "centered"
}/*EDITMODE-END*/;

const THEMES = [
  { key: 'tsukiyo',   ja: '月夜',   romaji: 'TSUKIYO',   palette: ['#0d1018', '#ebe3d1', '#6480a8', '#a23b30'] },
  { key: 'kamishiro', ja: '紙白',   romaji: 'KAMISHIRO', palette: ['#f1ebdd', '#14171f', '#2c3a66', '#a23b30'] },
  { key: 'aifukashi', ja: '靛深',   romaji: 'AIFUKASHI', palette: ['#08112a', '#d8d4c4', '#7c98d0', '#c2493a'] },
  { key: 'shuboku',   ja: '朱墨',   romaji: 'SHUBOKU',   palette: ['#ece2cd', '#181208', '#8a2818', '#8a2818'] },
];

const APP_LANGUAGES = [
  { key: 'ja', label: '日本語', available: true },
  { key: 'zh', label: '中国語', available: false },
  { key: 'en', label: '英語', available: false },
];

function AppIcon({ name }) {
  const glyphs = {
    home: '⌂',
    create: '+',
    result: '▦',
    library: '☰',
    settings: '⚙',
    copy: '⧉',
    share: '↗',
    export: '⇩',
  };
  return <span className="app-icon" aria-hidden="true">{glyphs[name] || '•'}</span>;
}

function CompactElementBars({ chart }) {
  if (!chart?.fiveElements?.counts) return null;
  const labels = ['木', '火', '土', '金', '水'];
  const percentages = typeof elementPercentages === 'function' ? elementPercentages(chart) : null;
  const counts = chart.fiveElements.counts || {};
  const max = Math.max(1, ...Object.values(counts));
  return (
    <div className="pwa-element-bars" aria-label="五行バランス">
      {labels.map((label) => {
        const width = percentages ? percentages[label] : Math.round(((counts[label] || 0) / max) * 100);
        return (
          <div key={label} className={`pwa-element-row ${elementClass ? elementClass(label) : ''}`}>
            <span>{label}</span>
            <i><b style={{ width: `${Math.max(6, width || 0)}%` }}></b></i>
            <em>{percentages ? `${width}%` : counts[label] || 0}</em>
          </div>
        );
      })}
    </div>
  );
}

function PillarMiniMatrix({ chart }) {
  const keys = ['year', 'month', 'day', 'hour'];
  const labels = { year: '年柱', month: '月柱', day: '日柱', hour: '時柱' };
  return (
    <div className="pwa-pillar-mini" aria-label="四柱">
      {keys.map((key) => (
        <div key={key} className={key === 'day' ? 'is-day' : ''}>
          <span>{labels[key]}</span>
          <strong>{chart?.pillars?.[key]?.text || '—'}</strong>
        </div>
      ))}
    </div>
  );
}

function HomeScreen({ calcResult, yearInfo, onCreate, onResult, onLibrary }) {
  const chart = calcResult?.chart;
  const recentName = calcResult?.profile?.name || '直近の命式';
  const currentAnnual = chart && typeof currentAnnualFortune === 'function' ? currentAnnualFortune(chart) : null;
  return (
    <section className="pwa-screen home-screen" aria-label="今日の概要">
      <div className="pwa-screen-head">
        <div>
          <span className="pwa-kicker">今日の概要</span>
          <h1>星の命式</h1>
        </div>
        <button type="button" className="pwa-primary-icon" onClick={onCreate} aria-label="命式を作成">
          <AppIcon name="create" />
        </button>
      </div>

      <section className="pwa-today-panel">
        <div>
          <span className="pwa-kicker">現在の暦</span>
          <h2>{yearInfo.ganzhi} / {yearInfo.reiwa}</h2>
          <p>命式を作成すると、四柱・五行・大運の要点をこの画面からすぐ確認できます。</p>
        </div>
        <div className="pwa-cycle-chip">{yearInfo.gregorian}</div>
      </section>

      <div className="pwa-action-grid">
        <button type="button" className="pwa-action-card is-primary" onClick={onCreate}>
          <span>新規作成</span>
          <strong>命式を作成</strong>
          <small>生年月日、時刻、出生地から計算</small>
        </button>
        <button type="button" className="pwa-action-card" onClick={calcResult ? onResult : onCreate}>
          <span>命式概要</span>
          <strong>{calcResult ? '結果を見る' : '入力から開始'}</strong>
          <small>{calcResult ? `${recentName} の命式を開く` : '結果は作成後に表示'}</small>
        </button>
      </div>

      <section className="pwa-section">
        <div className="pwa-section-title">
          <h2>最近の命式</h2>
          <button type="button" onClick={onLibrary}>すべて見る</button>
        </div>
        {calcResult ? (
          <button type="button" className="pwa-recent-card" onClick={onResult}>
            <div>
              <strong>{recentName}</strong>
              <small>{chart?.pillars?.day?.text || '—'} / {chart?.strength?.status || '判定中'}</small>
            </div>
            <PillarMiniMatrix chart={chart} />
          </button>
        ) : (
          <div className="pwa-empty-state">
            <strong>まだ命式がありません</strong>
            <p>最初の命式を作成すると、ここに最近の結果が表示されます。</p>
          </div>
        )}
      </section>

      <section className="pwa-section pwa-two-col">
        <article>
          <span className="pwa-kicker">流年</span>
          <h3>{currentAnnual?.name || '流年サマリー'}</h3>
          <p>{currentAnnual ? `${currentAnnual.year}年のテーマを結果画面で確認できます。` : '命式作成後に現在の流れを表示します。'}</p>
        </article>
        <article>
          <span className="pwa-kicker">記録</span>
          <h3>保存した読み解き</h3>
          <p>ブックマーク、比較、メモ機能を追加できる構造にしています。</p>
        </article>
      </section>
    </section>
  );
}

function LibraryScreen({ calcResult, onCreate, onResult }) {
  const chart = calcResult?.chart;
  const name = calcResult?.profile?.name || '現在の命式';
  return (
    <section className="pwa-screen library-screen" aria-label="命式ライブラリ">
      <div className="pwa-screen-head">
        <div>
          <span className="pwa-kicker">命式一覧</span>
          <h1>命式ライブラリ</h1>
        </div>
        <button type="button" className="pwa-primary-icon" onClick={onCreate} aria-label="追加">
          <AppIcon name="create" />
        </button>
      </div>
      <div className="pwa-search-row">
        <input type="search" placeholder="命式・タグ・メモを検索" />
        <button type="button" aria-label="設定"><AppIcon name="settings" /></button>
      </div>
      <div className="pwa-filter-row" aria-label="絞り込み">
        <button className="is-active" type="button">すべて</button>
        <button type="button">最近</button>
        <button type="button">比較</button>
        <button type="button">タグ付き</button>
      </div>
      {calcResult ? (
        <button type="button" className="pwa-library-item" onClick={onResult}>
          <div className="pwa-library-main">
            <strong>{name}</strong>
            <small>{chart?.pillars?.day?.text || '—'} / {chart?.pattern?.name || '命式'}</small>
            <div className="pwa-tag-row">
              <span>{chart?.strength?.status || '判定中'}</span>
              <span>{chart?.dayMaster || '日主'}</span>
              <span>現在</span>
            </div>
          </div>
          <PillarMiniMatrix chart={chart} />
        </button>
      ) : (
        <div className="pwa-empty-state">
          <strong>保存された命式はありません</strong>
          <p>まずは命式を作成してください。保存・比較の画面はここに集約します。</p>
          <button type="button" onClick={onCreate}>命式を作成</button>
        </div>
      )}
      <div className="pwa-compare-tray">
        <span>選択中 0件</span>
        <button type="button" disabled>比較</button>
      </div>
    </section>
  );
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page, setPage] = React.useState(() => {
    const allowed = new Set(['home', 'rite', 'result', 'fortune', 'insight', 'library']);
    const hash = typeof window !== 'undefined' ? window.location.hash.replace(/^#\/?/, '') : '';
    return allowed.has(hash) ? hash : 'home';
  });   // home | rite | result | fortune | insight | library
  const [washing, setWashing] = React.useState(false);
  const [calcResult, setCalcResult] = React.useState(null);
  const [routeTarget, setRouteTarget] = React.useState(null);
  const [language, setLanguage] = React.useState('ja');

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

    return {
      reiwa: `令和${reiwaStr}年`,
      ganzhi: `${stem}${branch}`,
      gregorian: `西暦${y}年`
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
      return 'kamishiro';
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

  const goto = (target, detailTarget = null) => {
    setRouteTarget(detailTarget ? { ...detailTarget, key: `${Date.now()}-${Math.random()}` } : null);
    if (typeof window !== 'undefined' && ['home', 'rite', 'result', 'library'].includes(target)) {
      window.history.replaceState(null, '', `#${target}`);
    }
    if (target === page) return;
    setWashing(true);
    window.setTimeout(() => {
      setPage(target);
      if (!detailTarget?.anchor) window.scrollTo({ top: 0 });
      window.setTimeout(() => setWashing(false), 70);
    }, 180);
  };

  const navItems = [
    { key: 'home', label: '今日', icon: 'home' },
    { key: 'rite', label: '作成', icon: 'create' },
    { key: 'result', label: '結果', icon: 'result', disabled: !calcResult },
    { key: 'library', label: '一覧', icon: 'library' },
  ];
  const visiblePage = ['insight', 'fortune'].includes(page) ? 'result' : page;

  return (
    <React.Fragment>
      <div className="grain"></div>

      <header className="chrome">
        <div className="mark">
          <span className="seal">命</span>
          <span>星の命式</span>
        </div>
        <nav className="app-actions" role="navigation" aria-label="アプリ操作">
          <div className="language-switch" aria-label="表示言語">
            {APP_LANGUAGES.filter((item) => item.available).map((item) => (
              <button
                key={item.key}
                type="button"
                className={language === item.key ? 'is-active' : ''}
                onClick={() => setLanguage(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button onClick={toggleTheme} title="切り替え (明暗)" className="theme-toggle">
            {activeTheme === 'kamishiro' || activeTheme === 'shuboku' ? '☽' : '☀'}
          </button>
          <button type="button" title="書き出し" className="icon-action"><AppIcon name="export" /></button>
        </nav>
      </header>

      <aside className="app-sidebar" aria-label="メインナビゲーション">
        <div className="sidebar-search">命式を検索</div>
        <div className="sidebar-group">
          <span>作業領域</span>
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={visiblePage === item.key ? 'is-active' : ''}
              disabled={item.disabled}
              onClick={() => goto(item.key)}
            >
              <AppIcon name={item.icon} />{item.label}
            </button>
          ))}
        </div>
        <div className="sidebar-group">
          <span>操作</span>
          <button type="button" disabled={!calcResult}><AppIcon name="copy" />複製</button>
          <button type="button" disabled={!calcResult}><AppIcon name="share" />共有</button>
        </div>
        <small>端末内で処理</small>
      </aside>

      <main className="page app-main">
        {page === 'home' && <HomeScreen calcResult={calcResult} yearInfo={yearInfo} onCreate={() => goto('rite')} onResult={() => goto('result')} onLibrary={() => goto('library')} />}
        {page === 'library' && <LibraryScreen calcResult={calcResult} onCreate={() => goto('rite')} onResult={() => goto('result')} />}
        {page === 'rite' && <Rite onBack={() => goto('rite')}
          initialResult={calcResult}
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
            onShowFortune={(target) => goto('fortune', target)}
            onShowInsight={(target) => goto('insight', target)}
          />
        )}
        {page === 'insight' && calcResult && (
          <InsightView 
            calculation={calcResult.chart}
            profile={calcResult.profile}
            routeTarget={routeTarget}
            onBack={() => goto('result')}
            onEditInput={() => goto('rite')}
          />
        )}
        {page === 'fortune' && calcResult && (
          <FortuneView 
            calculation={calcResult.chart}
            profile={calcResult.profile}
            routeTarget={routeTarget}
            onBack={() => goto('result')}
            onEditInput={() => goto('rite')}
          />
        )}
      </main>

      <nav className="mobile-tabbar" aria-label="主要機能">
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={visiblePage === item.key ? 'is-active' : ''}
            aria-current={visiblePage === item.key ? 'page' : undefined}
            disabled={item.disabled}
            onClick={() => goto(item.key)}
          >
            <AppIcon name={item.icon} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className={`ink-wash ${washing ? 'show' : ''}`}></div>

      <TweaksPanel title="調整">
        <TweakSection title="主題">
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
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginLeft: 8, letterSpacing: '0.12em' }}>配色</span>
                </div>
              </button>
            ))}
          </div>
        </TweakSection>
        <TweakSection title="書体">
          <TweakRadio value={tweaks.type} onChange={(v) => setTweak('type', v)}
            options={[{ value: 'mincho', label: '明朝体' }, { value: 'song', label: '宋朝風' }, { value: 'kaisho', label: '楷書体' }]} />
        </TweakSection>
        <TweakSection title="動き">
          <TweakRadio value={tweaks.motion} onChange={(v) => setTweak('motion', v)}
            options={[{ value: 'off', label: 'なし' }, { value: 'soft', label: '控えめ' }, { value: 'full', label: 'しっかり' }]} />
        </TweakSection>
        <TweakSection title="最初の画面">
          <TweakRadio value={tweaks.hero} onChange={(v) => setTweak('hero', v)}
            options={[{ value: 'centered', label: '中央配置' }, { value: 'offset', label: '余白を活かす' }]} />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
