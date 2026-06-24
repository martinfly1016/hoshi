const NEW2_PREFECTURES = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'
];

const NEW2_HELP = [
  { icon: 'ph:clock', title: '出生時刻が不明な場合', text: '時刻が分からない場合は「不明」を選択してください。日柱までの命式と、時刻不明用の解説をご覧いただけます。' },
  { icon: 'ph:map-pin', title: '出生地を選ぶ理由', text: '四柱推命では、出生地の緯度・経度から真太陽時を計算します。正確な命式を出すために必要な情報です。' },
  { icon: 'ph:book-open', title: '結果の見方', text: '命式の各要素が持つ意味や、大運・流年の読み方を分かりやすく解説します。' },
];

function New2Brand({ onHome }) {
  return (
    <button className="brand" type="button" onClick={onHome} aria-label="命式作成へ戻る">
      <span className="brand-desktop-mark"><iconify-icon icon="ph:star-four"></iconify-icon></span>
      <span className="brand-mobile-mark">命</span>
      <span className="brand-copy"><strong>星の命式</strong><small>四柱推命・七柱推命</small></span>
    </button>
  );
}

function New2Header({ page, hasResult, onNavigate, onFaq }) {
  const [open, setOpen] = React.useState(false);
  const go = (target) => { setOpen(false); onNavigate(target); };
  return (
    <>
      <header className="site-header">
        <New2Brand onHome={() => go('query')} />
        <nav className={open ? 'is-open' : ''} aria-label="サイトナビゲーション">
          <button className={page === 'query' ? 'is-active' : ''} onClick={() => go('query')}>命式を作成</button>
          <button disabled={!hasResult} className={page === 'result' || page === 'insight' ? 'is-active' : ''} onClick={() => go('result')}>鑑定の読み方</button>
          <button disabled={!hasResult} className={page === 'fortune' ? 'is-active' : ''} onClick={() => go('fortune')}>大運・流年</button>
          <button onClick={() => { setOpen(false); onFaq(); }}>よくある質問</button>
        </nav>
        <button className="menu-button" type="button" aria-expanded={open} onClick={() => setOpen(value => !value)}>
          <span>{open ? '閉じる' : 'メニュー'}</span>
          <iconify-icon icon={open ? 'ph:x' : 'ph:list'}></iconify-icon>
        </button>
      </header>
      {open && <button className="menu-scrim" aria-label="メニューを閉じる" onClick={() => setOpen(false)} />}
    </>
  );
}

function New2Steps() {
  return (
    <div className="steps" aria-label="鑑定の流れ">
      <div className="is-active"><span>1</span><div><strong>入力する</strong><small>生年月日や出生情報を入力します</small></div></div>
      <div><span>2</span><div><strong>命式を確認</strong><small>あなたの命式を確認します</small></div></div>
      <div><span>3</span><div><strong>解説を読む</strong><small>命式の意味や運勢を読み解きます</small></div></div>
    </div>
  );
}

function New2Field({ icon, title, hint, children }) {
  return (
    <div className="query-field">
      <div className="field-label">
        <iconify-icon icon={icon}></iconify-icon>
        <div><strong>{title}</strong><small>{hint}</small></div>
      </div>
      <div className="field-control">{children}</div>
    </div>
  );
}

function QueryScreen({ onComplete, faqRef }) {
  const [gender, setGender] = React.useState('male');
  const [calendar, setCalendar] = React.useState('western');
  const [era, setEra] = React.useState('reiwa');
  const [year, setYear] = React.useState('1990');
  const [month, setMonth] = React.useState('1');
  const [day, setDay] = React.useState('1');
  const [hour, setHour] = React.useState('12');
  const [minute, setMinute] = React.useState('00');
  const [unknownTime, setUnknownTime] = React.useState(false);
  const [country, setCountry] = React.useState('jp');
  const [prefecture, setPrefecture] = React.useState('東京都');
  const [municipalityId, setMunicipalityId] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');

  const api = window.HOSHI_CALC;
  const municipalities = api?.JAPAN_MUNICIPALITIES || [];
  const cityOptions = municipalities.filter(item => item.prefecture === prefecture);
  React.useEffect(() => {
    const preferred = cityOptions.find(item => item.municipality === '新宿区') || cityOptions[0];
    setMunicipalityId(preferred?.id || '');
  }, [prefecture, municipalities.length]);

  const convertYear = () => {
    const value = Number(year);
    if (calendar === 'western') return value;
    return value + (era === 'showa' ? 1925 : era === 'heisei' ? 1988 : 2018);
  };

  const submit = () => {
    const calc = window.HOSHI_CALC;
    if (!calc?.calculateShichusuimei) {
      setError('計算ライブラリを読み込んでいます。数秒後にもう一度お試しください。');
      return;
    }
    const location = country === 'jp'
      ? municipalities.find(item => item.id === municipalityId) || municipalities.find(item => item.prefecture === prefecture)
      : calc.LOCATIONS?.find(item => !String(item.label).startsWith('日本')) || calc.LOCATIONS?.[0];
    if (!location) { setError('出生地を選択してください。'); return; }
    setBusy(true); setError('');
    window.setTimeout(() => {
      try {
        const input = {
          date: `${String(convertYear()).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          timeKnown: !unknownTime,
          time: unknownTime ? '12:00' : `${hour}:${minute}`,
          locationId: location.id,
          locationOverride: location,
          timeCalculationMode: 'true_solar_time',
          lateZiHourMode: 'same_day',
          gender,
        };
        const chart = calc.calculateShichusuimei(input);
        onComplete({
          input,
          chart,
          profile: { name: '', gender: gender === 'male' ? 'yang' : gender === 'female' ? 'yin' : 'gen', location, unsure: unknownTime },
          form: { gender: gender === 'male' ? 'yang' : gender === 'female' ? 'yin' : 'gen', calendar: calendar === 'western' ? 'seireki' : era, year, month, day, birthTime: `${hour}:${minute}`, unsure: unknownTime, locationId: location.id },
        });
      } catch (submitError) {
        setError(submitError?.message || '入力内容を確認してください。');
      } finally { setBusy(false); }
    }, 260);
  };

  const radio = (key, label) => (
    <button type="button" className={`radio-option ${gender === key ? 'is-selected' : ''}`} onClick={() => setGender(key)}><span></span>{label}</button>
  );

  return (
    <main className="query-page">
      <div className="query-main">
        <section className="query-intro">
          <h1>四柱推命の命式を作成</h1>
          <p>生年月日や出生時刻などを入力すると、あなたの命式を無料で作成できます。<br />命式の基本構造や大運・流年の流れを確認しましょう。</p>
        </section>
        <New2Steps />
        <section className="query-form" aria-label="命式作成フォーム">
          <New2Field icon="ph:user" title="基本情報" hint="性別を選択してください。">
            <div className="radio-row">{radio('male','男性')}{radio('female','女性')}{radio('unspecified','未選択')}</div>
          </New2Field>
          <New2Field icon="ph:calendar-blank" title="生年月日" hint="西暦または日本の元号で入力してください。">
            <div className="segmented"><button className={calendar === 'western' ? 'is-selected' : ''} onClick={() => setCalendar('western')}>西暦</button><button className={calendar === 'era' ? 'is-selected' : ''} onClick={() => setCalendar('era')}>元号</button></div>
            {calendar === 'era' && <label><span>元号</span><select value={era} onChange={event => setEra(event.target.value)}><option value="showa">昭和</option><option value="heisei">平成</option><option value="reiwa">令和</option></select></label>}
            <div className="select-grid date-grid">
              <label><span>年</span><select value={year} onChange={event => setYear(event.target.value)}>{Array.from({length: calendar === 'western' ? 107 : 64}, (_, index) => calendar === 'western' ? 2026-index : 64-index).map(value => <option key={value}>{value}</option>)}</select></label>
              <label><span>月</span><select value={month} onChange={event => setMonth(event.target.value)}>{Array.from({length:12},(_,index)=>index+1).map(value=><option key={value}>{value}</option>)}</select></label>
              <label><span>日</span><select value={day} onChange={event => setDay(event.target.value)}>{Array.from({length:31},(_,index)=>index+1).map(value=><option key={value}>{value}</option>)}</select></label>
            </div>
          </New2Field>
          <New2Field icon="ph:clock" title="出生時刻" hint="24時間制で入力してください。分からない場合は「不明」を選択してください。">
            <div className="time-row">
              <label><span>時刻</span><select disabled={unknownTime} value={hour} onChange={event=>setHour(event.target.value)}>{Array.from({length:24},(_,index)=>String(index).padStart(2,'0')).map(value=><option key={value}>{value}</option>)}</select></label><b>時</b>
              <label><span>&nbsp;</span><select disabled={unknownTime} value={minute} onChange={event=>setMinute(event.target.value)}>{Array.from({length:60},(_,index)=>String(index).padStart(2,'0')).map(value=><option key={value}>{value}</option>)}</select></label><b>分</b>
              <label className="check"><input type="checkbox" checked={unknownTime} onChange={event=>setUnknownTime(event.target.checked)} /><span>不明（時刻不明）</span></label>
            </div>
          </New2Field>
          <New2Field icon="ph:map-pin" title="出生地" hint="都道府県または市区町村を選択してください。">
            <div className="select-grid location-grid">
              <label><span>国</span><select value={country} onChange={event=>setCountry(event.target.value)}><option value="jp">日本</option><option value="overseas">海外</option></select></label>
              {country === 'jp' ? <>
                <label><span>都道府県</span><select value={prefecture} onChange={event=>setPrefecture(event.target.value)}>{NEW2_PREFECTURES.map(value=><option key={value}>{value}</option>)}</select></label>
                <label><span>市区町村（任意）</span><select value={municipalityId} onChange={event=>setMunicipalityId(event.target.value)}><option value="">都道府県のみ</option>{cityOptions.map(item=><option key={item.id} value={item.id}>{item.municipality}</option>)}</select></label>
              </> : <label><span>地域</span><select><option>中国・香港・台湾</option><option>米国</option><option>その他海外</option></select></label>}
            </div>
          </New2Field>
          <div className="submit-area">
            <button className="primary-button" type="button" onClick={submit} disabled={busy}><span>{busy ? '命式を作成中です' : '無料で命式を見る'}</span><iconify-icon icon="ph:caret-right"></iconify-icon></button>
            <p><iconify-icon icon="ph:lock-simple"></iconify-icon>入力内容は命式の作成・表示のみに使用し、保存・公開はしません。</p>
            {error && <div className="form-error">{error}</div>}
          </div>
        </section>
      </div>
      <aside className="help-panel" ref={faqRef}>
        <h2>よくあるご質問</h2>
        {NEW2_HELP.map(item => <article key={item.title}><iconify-icon icon={item.icon}></iconify-icon><div><h3>{item.title}</h3><p>{item.text}</p><button onClick={() => faqRef.current?.scrollIntoView({behavior:'smooth'})}>詳しく見る <iconify-icon icon="ph:caret-right"></iconify-icon></button></div></article>)}
        <article className="seven-note"><iconify-icon icon="ph:flower-lotus"></iconify-icon><div><h3>七柱推命について</h3><p>七柱推命をご希望の方は、命式作成後の結果画面で切り替えてご確認いただけます。</p></div></article>
      </aside>
    </main>
  );
}

function App() {
  const [page, setPage] = React.useState('query');
  const [result, setResult] = React.useState(null);
  const [routeTarget, setRouteTarget] = React.useState(null);
  const faqRef = React.useRef(null);
  const navigate = (target, detail = null) => {
    if (target !== 'query' && !result) return;
    setRouteTarget(detail ? {...detail, key: Date.now()} : null);
    setPage(target);
    window.scrollTo({top:0, behavior:'smooth'});
  };
  const openFaq = () => {
    if (page !== 'query') setPage('query');
    window.setTimeout(() => faqRef.current?.scrollIntoView({behavior:'smooth', block:'start'}), 80);
  };
  return (
    <>
      <New2Header page={page} hasResult={Boolean(result)} onNavigate={navigate} onFaq={openFaq} />
      {page === 'query' && <QueryScreen faqRef={faqRef} onComplete={value => { setResult(value); setPage('result'); window.scrollTo(0,0); }} />}
      {page === 'result' && result && <ResultView name="" calculation={result.chart} profile={result.profile} onBack={()=>navigate('query')} onShowInsight={target=>navigate('insight',target)} onShowFortune={target=>navigate('fortune',target)} />}
      {page === 'insight' && result && <InsightView calculation={result.chart} profile={result.profile} routeTarget={routeTarget} onBack={()=>navigate('result')} onEditInput={()=>navigate('query')} />}
      {page === 'fortune' && result && <FortuneView calculation={result.chart} profile={result.profile} routeTarget={routeTarget} onBack={()=>navigate('result')} onEditInput={()=>navigate('query')} />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
