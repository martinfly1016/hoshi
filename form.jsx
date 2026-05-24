/* 鑑定の儀 — free reading form */

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

const REGION_OPTIONS = [
  { key: 'jp', label: '日本' },
  { key: 'cn', label: '中国・香港・台湾' },
  { key: 'us', label: '米国' },
  { key: 'world', label: 'その他海外' },
];

const WORLD_LOCATIONS = [
  { id: 'cn-beijing', country: 'cn', label: '中国 / 北京市', city: '北京市', region: '北京市', timezone: 'Asia/Shanghai', utcOffset: 8, latitude: 39.9042, longitude: 116.4074, keywords: '北京 beijing' },
  { id: 'cn-shanghai', country: 'cn', label: '中国 / 上海市', city: '上海市', region: '上海市', timezone: 'Asia/Shanghai', utcOffset: 8, latitude: 31.2304, longitude: 121.4737, keywords: '上海 shanghai' },
  { id: 'cn-guangzhou', country: 'cn', label: '中国 / 広東省 広州市', city: '広州市', region: '広東省', timezone: 'Asia/Shanghai', utcOffset: 8, latitude: 23.1291, longitude: 113.2644, keywords: '广东 廣東 広東 广州 廣州 guangzhou canton' },
  { id: 'cn-shenzhen', country: 'cn', label: '中国 / 広東省 深圳市', city: '深圳市', region: '広東省', timezone: 'Asia/Shanghai', utcOffset: 8, latitude: 22.5431, longitude: 114.0579, keywords: '广东 廣東 広東 深圳 shenzhen' },
  { id: 'cn-hangzhou', country: 'cn', label: '中国 / 浙江省 杭州市', city: '杭州市', region: '浙江省', timezone: 'Asia/Shanghai', utcOffset: 8, latitude: 30.2741, longitude: 120.1551, keywords: '浙江 杭州 hangzhou' },
  { id: 'cn-nanjing', country: 'cn', label: '中国 / 江蘇省 南京市', city: '南京市', region: '江蘇省', timezone: 'Asia/Shanghai', utcOffset: 8, latitude: 32.0603, longitude: 118.7969, keywords: '江苏 江蘇 南京 nanjing' },
  { id: 'cn-chengdu', country: 'cn', label: '中国 / 四川省 成都市', city: '成都市', region: '四川省', timezone: 'Asia/Shanghai', utcOffset: 8, latitude: 30.5728, longitude: 104.0668, keywords: '四川 成都 chengdu' },
  { id: 'cn-chongqing', country: 'cn', label: '中国 / 重慶市', city: '重慶市', region: '重慶市', timezone: 'Asia/Shanghai', utcOffset: 8, latitude: 29.563, longitude: 106.5516, keywords: '重庆 重慶 chongqing' },
  { id: 'cn-wuhan', country: 'cn', label: '中国 / 湖北省 武漢市', city: '武漢市', region: '湖北省', timezone: 'Asia/Shanghai', utcOffset: 8, latitude: 30.5928, longitude: 114.3055, keywords: '湖北 武汉 武漢 wuhan' },
  { id: 'cn-xian', country: 'cn', label: '中国 / 陝西省 西安市', city: '西安市', region: '陝西省', timezone: 'Asia/Shanghai', utcOffset: 8, latitude: 34.3416, longitude: 108.9398, keywords: '陕西 陝西 西安 xian xi an' },
  { id: 'cn-tianjin', country: 'cn', label: '中国 / 天津市', city: '天津市', region: '天津市', timezone: 'Asia/Shanghai', utcOffset: 8, latitude: 39.3434, longitude: 117.3616, keywords: '天津 tianjin' },
  { id: 'cn-hong-kong', country: 'cn', label: '中国 / 香港', city: '香港', region: '香港', timezone: 'Asia/Hong_Kong', utcOffset: 8, latitude: 22.3193, longitude: 114.1694, keywords: '香港 hong kong hk' },
  { id: 'cn-taipei', country: 'cn', label: '台湾 / 台北市', city: '台北市', region: '台湾', timezone: 'Asia/Taipei', utcOffset: 8, latitude: 25.033, longitude: 121.5654, keywords: '台湾 臺灣 台北 taipei' },
  { id: 'us-new-york', country: 'us', label: '米国 / New York, NY', city: 'New York', region: 'NY', timezone: 'America/New_York', utcOffset: -5, latitude: 40.7128, longitude: -74.006, keywords: 'new york ny ニューヨーク' },
  { id: 'us-los-angeles', country: 'us', label: '米国 / Los Angeles, CA', city: 'Los Angeles', region: 'CA', timezone: 'America/Los_Angeles', utcOffset: -8, latitude: 34.0522, longitude: -118.2437, keywords: 'los angeles california ca ロサンゼルス' },
  { id: 'us-san-francisco', country: 'us', label: '米国 / San Francisco, CA', city: 'San Francisco', region: 'CA', timezone: 'America/Los_Angeles', utcOffset: -8, latitude: 37.7749, longitude: -122.4194, keywords: 'san francisco california ca サンフランシスコ' },
  { id: 'us-chicago', country: 'us', label: '米国 / Chicago, IL', city: 'Chicago', region: 'IL', timezone: 'America/Chicago', utcOffset: -6, latitude: 41.8781, longitude: -87.6298, keywords: 'chicago illinois il シカゴ' },
  { id: 'us-houston', country: 'us', label: '米国 / Houston, TX', city: 'Houston', region: 'TX', timezone: 'America/Chicago', utcOffset: -6, latitude: 29.7604, longitude: -95.3698, keywords: 'houston texas tx ヒューストン' },
  { id: 'us-seattle', country: 'us', label: '米国 / Seattle, WA', city: 'Seattle', region: 'WA', timezone: 'America/Los_Angeles', utcOffset: -8, latitude: 47.6062, longitude: -122.3321, keywords: 'seattle washington wa シアトル' },
  { id: 'us-boston', country: 'us', label: '米国 / Boston, MA', city: 'Boston', region: 'MA', timezone: 'America/New_York', utcOffset: -5, latitude: 42.3601, longitude: -71.0589, keywords: 'boston massachusetts ma ボストン' },
  { id: 'us-honolulu', country: 'us', label: '米国 / Honolulu, HI', city: 'Honolulu', region: 'HI', timezone: 'Pacific/Honolulu', utcOffset: -10, latitude: 21.3069, longitude: -157.8583, keywords: 'honolulu hawaii hi ハワイ ホノルル' },
  { id: 'world-london', country: 'world', label: '英国 / London', city: 'London', region: 'England', timezone: 'Europe/London', utcOffset: 0, latitude: 51.5074, longitude: -0.1278, keywords: 'london uk england ロンドン' },
  { id: 'world-paris', country: 'world', label: 'フランス / Paris', city: 'Paris', region: 'Ile-de-France', timezone: 'Europe/Paris', utcOffset: 1, latitude: 48.8566, longitude: 2.3522, keywords: 'paris france パリ' },
  { id: 'world-sydney', country: 'world', label: 'オーストラリア / Sydney', city: 'Sydney', region: 'NSW', timezone: 'Australia/Sydney', utcOffset: 10, latitude: -33.8688, longitude: 151.2093, keywords: 'sydney australia シドニー' },
  { id: 'world-singapore', country: 'world', label: 'シンガポール / Singapore', city: 'Singapore', region: 'Singapore', timezone: 'Asia/Singapore', utcOffset: 8, latitude: 1.3521, longitude: 103.8198, keywords: 'singapore シンガポール' },
  { id: 'world-bangkok', country: 'world', label: 'タイ / Bangkok', city: 'Bangkok', region: 'Bangkok', timezone: 'Asia/Bangkok', utcOffset: 7, latitude: 13.7563, longitude: 100.5018, keywords: 'bangkok thailand バンコク' },
  { id: 'world-seoul', country: 'world', label: '韓国 / Seoul', city: 'Seoul', region: 'Seoul', timezone: 'Asia/Seoul', utcOffset: 9, latitude: 37.5665, longitude: 126.978, keywords: 'seoul korea ソウル 韓国' },
];

function calcApi() {
  return window.HOSHI_CALC || null;
}

function locationOptions() {
  return calcApi()?.LOCATIONS || FALLBACK_LOCATIONS;
}

function japanPrefectureLocations() {
  return locationOptions().filter((location) => location.label.startsWith('日本')).map((location) => {
    const prefecture = stripJapan(location.label).split(' ')[0];
    return {
      ...location,
      id: `jp-pref-${location.id}`,
      country: 'jp',
      label: `日本 / ${prefecture}`,
      city: '',
      region: prefecture,
      displayScope: 'prefecture',
      keywords: `${prefecture} ${stripJapan(location.label)}`,
    };
  });
}

function japanLocations() {
  const municipalities = calcApi()?.JAPAN_MUNICIPALITIES || [];
  const prefectures = japanPrefectureLocations();
  if (municipalities.length) {
    return [...prefectures, ...municipalities.map((location) => ({
      ...location,
      id: location.id,
      country: 'jp',
      label: `日本 / ${location.label}`,
      city: location.municipality,
      region: location.prefecture,
      keywords: `${location.prefecture} ${location.municipality}`,
    }))];
  }
  return prefectures;
}

function japanMunicipalityLocations(prefecture) {
  const municipalities = calcApi()?.JAPAN_MUNICIPALITIES || [];
  return municipalities
    .filter((location) => location.prefecture === prefecture)
    .map((location) => ({
      ...location,
      id: location.id,
      country: 'jp',
      label: `日本 / ${location.label}`,
      city: location.municipality,
      region: location.prefecture,
      keywords: `${location.prefecture} ${location.municipality}`,
    }));
}

function japanPrefectureLocation(prefecture) {
  return japanPrefectureLocations().find((location) => location.region === prefecture) || japanPrefectureLocations()[0];
}

function allRegisteredLocations() {
  return [...japanLocations(), ...WORLD_LOCATIONS];
}

function findRegisteredLocation(id, registry = allRegisteredLocations()) {
  return registry.find((location) => location.id === id) || registry[0];
}

function inferRegionFromLocationId(id) {
  if (String(id || '').startsWith('jp-') || locationOptions().some((location) => location.id === id && location.label.startsWith('日本'))) return 'jp';
  if (String(id || '').startsWith('cn-')) return 'cn';
  if (String(id || '').startsWith('us-')) return 'us';
  if (String(id || '').startsWith('world-')) return 'world';
  return 'jp';
}

function normalizeInitialLocationId(id) {
  const rawId = id || 'jp-pref-tokyo';
  if (String(rawId).startsWith('jp-') || String(rawId).startsWith('cn-') || String(rawId).startsWith('us-') || String(rawId).startsWith('world-')) {
    return rawId;
  }
  const legacyJapanLocation = locationOptions().find((location) => location.id === rawId && location.label.startsWith('日本'));
  if (legacyJapanLocation) return `jp-pref-${legacyJapanLocation.id}`;
  if (rawId === 'overseas') return 'cn-hong-kong';
  return rawId;
}

function stripJapan(label) {
  return String(label || '').replace(/^日本\s*\/\s*/, '');
}

function searchableText(location) {
  return [location.label, location.region, location.city, location.prefecture, location.municipality, location.keywords]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function displayRegisteredLocation(location) {
  return stripJapan(location?.label || '');
}

function parseBirthTime(value) {
  const [hour = '12', minute = '00'] = String(value || '12:00').split(':');
  return {
    hour: String(Math.min(23, Math.max(0, parseInt(hour, 10) || 0))).padStart(2, '0'),
    minute: String(Math.min(59, Math.max(0, parseInt(minute, 10) || 0))).padStart(2, '0'),
  };
}

function composeBirthTime(hour, minute) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function FormField({ num, ja, romaji, hint, children, fieldRef }) {
  return (
    <div className="field" ref={fieldRef}>
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

function Rite({ onBack, onSubmitDone, initialResult }) {
  const initialForm = initialResult?.form || {};
  const [name, setName] = React.useState(initialForm.name || '');
  const [gender, setGender] = React.useState(initialForm.gender || 'gen');
  const [calendar, setCalendar] = React.useState(initialForm.calendar || 'seireki'); 
  const [year, setYear]   = React.useState(initialForm.year || '');
  const [month, setMonth] = React.useState(initialForm.month || '');
  const [day, setDay]     = React.useState(initialForm.day || '');
  const initialBirthTime = parseBirthTime(initialForm.birthTime);
  const [birthHour, setBirthHour] = React.useState(initialBirthTime.hour);
  const [birthMinute, setBirthMinute] = React.useState(initialBirthTime.minute);
  const [unsure, setUnsure] = React.useState(initialForm.unsure || false);
  const initialLocationId = normalizeInitialLocationId(initialForm.locationId || initialResult?.profile?.location?.id || 'jp-pref-tokyo');
  const initialRegisteredLocations = allRegisteredLocations();
  const initialLocation = findRegisteredLocation(initialLocationId, initialRegisteredLocations);
  const initialJapanPrefecture = initialForm.japanPrefecture || initialLocation?.region || initialLocation?.prefecture || '東京都';
  const [locationRegion, setLocationRegion] = React.useState(initialForm.locationRegion || inferRegionFromLocationId(initialLocationId));
  const [locationId, setLocationId] = React.useState(initialLocationId);
  const [japanPrefecture, setJapanPrefecture] = React.useState(initialJapanPrefecture);
  const [japanMunicipalityId, setJapanMunicipalityId] = React.useState(initialForm.japanMunicipalityId || (initialLocation?.country === 'jp' && initialLocation?.displayScope !== 'prefecture' ? initialLocation.id : ''));
  const [locationQuery, setLocationQuery] = React.useState(initialForm.locationQuery || '');
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState('');
  const [showStamp, setShowStamp] = React.useState(false);
  const fieldRefs = React.useRef({});

  const registeredLocations = allRegisteredLocations();
  const japanPrefectures = japanPrefectureLocations();
  const municipalityChoices = japanMunicipalityLocations(japanPrefecture);
  const selectedLocation = findRegisteredLocation(locationId, registeredLocations);
  const regionLocations = registeredLocations.filter((location) => location.country === locationRegion);
  const normalizedLocationQuery = locationQuery.trim().toLowerCase();
  const filteredLocations = (normalizedLocationQuery
    ? regionLocations.filter((location) => searchableText(location).includes(normalizedLocationQuery))
    : regionLocations
  ).slice(0, 80);
  const locationChoices = filteredLocations.some((location) => location.id === selectedLocation?.id)
    ? filteredLocations
    : [selectedLocation, ...filteredLocations].filter(Boolean);
  const birthTime = composeBirthTime(birthHour, birthMinute);
  const valid = year && month && day && locationId && selectedLocation && (unsure || birthTime);

  const jumpToStep = (step) => {
    const target = fieldRefs.current[step];
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => {
      const focusable = target.querySelector('input:not([disabled]), select:not([disabled]), button:not([disabled])');
      if (focusable) focusable.focus({ preventScroll: true });
    }, 420);
  };

  React.useEffect(() => {
    if (locationRegion === 'jp') return;
    if (filteredLocations.length && !filteredLocations.some((location) => location.id === locationId)) {
      setLocationId(filteredLocations[0].id);
    }
  }, [locationRegion, normalizedLocationQuery]);

  React.useEffect(() => {
    if (locationRegion !== 'jp') return;
    const municipality = municipalityChoices.find((location) => location.id === japanMunicipalityId);
    const prefecture = japanPrefectureLocation(japanPrefecture);
    const nextLocation = municipality || prefecture;
    if (nextLocation && nextLocation.id !== locationId) setLocationId(nextLocation.id);
  }, [locationRegion, japanPrefecture, japanMunicipalityId, municipalityChoices.length]);

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
          time: unsure ? '12:00' : birthTime,
          locationId: selectedLocation.id,
          locationOverride: selectedLocation,
          timeCalculationMode: 'true_solar_time',
          lateZiHourMode: 'same_day',
          gender: gender === 'yang' ? 'male' : gender === 'yin' ? 'female' : 'unspecified',
        };
        const calculated = api.calculateShichusuimei(input);
        const form = { name, gender, calendar, year, month, day, birthTime, unsure, locationId, locationRegion, japanPrefecture, japanMunicipalityId, locationQuery };
        const res = { input, chart: calculated, profile: { name, gender, location: selectedLocation, unsure }, form };
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
          <button type="button" onClick={() => jumpToStep('profile')}><span className="num">壹</span>　お名前と性別</button>
          <button type="button" onClick={() => jumpToStep('birthday')}><span className="num">貳</span>　生年月日</button>
          <button type="button" onClick={() => jumpToStep('birthtime')}><span className="num">參</span>　出生時間</button>
          <button type="button" onClick={() => jumpToStep('birthplace')}><span className="num">肆</span>　出生地</button>
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
          fieldRef={(node) => { fieldRefs.current.profile = node; }}
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
          fieldRef={(node) => { fieldRefs.current.birthday = node; }}
          hint="誕生日の暦（西暦または和暦）を選択し、入力してください">
          <div className="toggle-row">
            {['seireki','showa','heisei','reiwa'].map(c => (
               <button key={c} className={calendar === c ? 'on' : ''} onClick={() => setCalendar(c)}>
                 {c === 'seireki' ? '西暦' : (c === 'showa' ? '昭和' : (c === 'heisei' ? '平成' : '令和'))}
               </button>
            ))}
          </div>
          <div className="input-row date-row">
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
          fieldRef={(node) => { fieldRefs.current.birthtime = node; }}
          hint="出生時刻をできるだけ正確に入力してください。真太陽時の補正に使用します">
          <div className="toggle-row compact">
            <button className={!unsure ? 'on' : ''} onClick={() => setUnsure(false)}>時刻を入力</button>
            <button className={unsure ? 'on' : ''} onClick={() => setUnsure(true)}>時間不明</button>
          </div>
          <div className={`input-row time-row ${unsure ? 'is-disabled' : ''}`}>
            <div className="input-line with-mark" data-mark="時 / H">
              <select value={birthHour} disabled={unsure} aria-disabled={unsure ? 'true' : 'false'} onChange={e => {
                setUnsure(false);
                setBirthHour(e.target.value);
              }}>
                {Array.from({length: 24}, (_, i) => String(i).padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div className="input-line with-mark" data-mark="分 / M">
              <select value={birthMinute} disabled={unsure} aria-disabled={unsure ? 'true' : 'false'} onChange={e => {
                setUnsure(false);
                setBirthMinute(e.target.value);
              }}>
                {Array.from({length: 60}, (_, i) => String(i).padStart(2, '0')).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </FormField>

        <FormField num="肆 / 一" ja="出生地" romaji="SHUSSEICHI"
          fieldRef={(node) => { fieldRefs.current.birthplace = node; }}
          hint="県・省・州・都市名で検索し、候補から出生地を選択してください">
          <div className="toggle-row compact location-region-row">
            {REGION_OPTIONS.map(region => (
              <button key={region.key} className={locationRegion === region.key ? 'on' : ''} onClick={() => {
                setLocationRegion(region.key);
                setLocationQuery('');
              }}>
                {region.label}
              </button>
            ))}
          </div>
          {locationRegion === 'jp' ? (
            <div className="japan-location-grid">
              <div className="input-line with-mark" data-mark="都道府県">
                <select value={japanPrefecture} onChange={e => {
                  const prefecture = e.target.value;
                  const nextPrefectureLocation = japanPrefectureLocation(prefecture);
                  setJapanPrefecture(prefecture);
                  setJapanMunicipalityId('');
                  if (nextPrefectureLocation) setLocationId(nextPrefectureLocation.id);
                }}>
                  {japanPrefectures.map(location => (
                    <option key={location.id} value={location.region}>{location.region}</option>
                  ))}
                </select>
              </div>
              <div className="input-line with-mark" data-mark="市区町村">
                <select value={japanMunicipalityId} onChange={e => {
                  const nextId = e.target.value;
                  setJapanMunicipalityId(nextId);
                  if (nextId) setLocationId(nextId);
                  else {
                    const nextPrefectureLocation = japanPrefectureLocation(japanPrefecture);
                    if (nextPrefectureLocation) setLocationId(nextPrefectureLocation.id);
                  }
                }}>
                  <option value="">都道府県のみ</option>
                  {municipalityChoices.map(location => (
                    <option key={location.id} value={location.id}>{location.municipality}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <>
              <div className="input-line with-mark" data-mark="検索">
                <input
                  type="text"
                  value={locationQuery}
                  onChange={e => setLocationQuery(e.target.value)}
                  placeholder={locationRegion === 'cn' ? '例 ）上海 / 広東 / 香港' : locationRegion === 'us' ? '例 ）California / New York' : '例 ）London / Seoul / Singapore'}
                />
              </div>
              <div className="input-line with-mark" data-mark="候補">
                <select value={selectedLocation?.id || ''} onChange={e => setLocationId(e.target.value)}>
                  {locationChoices.map(location => (
                    <option key={location.id} value={location.id}>{displayRegisteredLocation(location)}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="location-note">
            選択中: {displayRegisteredLocation(selectedLocation)}
            {selectedLocation?.timezone ? ` / ${selectedLocation.timezone}` : ''}
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
        <div className="caption">命式を作成しています</div>
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
const BAZI_ROW_GUIDES = {
  通変星: { icon: '神', hint: '表に出る役割' },
  天干: { icon: '天', hint: '外に見える性質' },
  地支: { icon: '地', hint: '足元の環境' },
  蔵干: { icon: '蔵', hint: '内側の気配' },
  蔵干通変: { icon: '支', hint: '内側の役割' },
  納音: { icon: '音', hint: '補助的な象意' },
  空亡: { icon: '空', hint: '抜けやすい気' },
  地勢: { icon: '勢', hint: '日主から見た勢い' },
  自坐: { icon: '坐', hint: '柱そのものの足場' },
};
const SEASONAL_ELEMENT_STATES = {
  寅: { season: '春', states: { 木: '旺', 火: '相', 水: '休', 金: '囚', 土: '死' } },
  卯: { season: '春', states: { 木: '旺', 火: '相', 水: '休', 金: '囚', 土: '死' } },
  辰: { season: '土用', states: { 土: '旺', 金: '相', 火: '休', 木: '囚', 水: '死' } },
  巳: { season: '夏', states: { 火: '旺', 土: '相', 木: '休', 水: '囚', 金: '死' } },
  午: { season: '夏', states: { 火: '旺', 土: '相', 木: '休', 水: '囚', 金: '死' } },
  未: { season: '土用', states: { 土: '旺', 金: '相', 火: '休', 木: '囚', 水: '死' } },
  申: { season: '秋', states: { 金: '旺', 水: '相', 土: '休', 火: '囚', 木: '死' } },
  酉: { season: '秋', states: { 金: '旺', 水: '相', 土: '休', 火: '囚', 木: '死' } },
  戌: { season: '土用', states: { 土: '旺', 金: '相', 火: '休', 木: '囚', 水: '死' } },
  亥: { season: '冬', states: { 水: '旺', 木: '相', 金: '休', 土: '囚', 火: '死' } },
  子: { season: '冬', states: { 水: '旺', 木: '相', 金: '休', 土: '囚', 火: '死' } },
  丑: { season: '土用', states: { 土: '旺', 金: '相', 火: '休', 木: '囚', 水: '死' } },
};
const SEASONAL_STATE_TEXT = {
  旺: '月令の力を直接受け、もっとも勢いが出やすい状態です。',
  相: '旺じる五行から生じられ、次に伸びやすい状態です。',
  休: '季節から見ると控えめに働き、力を休める状態です。',
  囚: '季節の気に抑えられ、出方に制限がかかる状態です。',
  死: '季節から遠く、意識して補いたい状態です。',
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
const TEN_GOD_DISPLAY = {
  比肩: '比肩',
  劫财: '劫財',
  劫財: '劫財',
  食神: '食神',
  伤官: '傷官',
  傷官: '傷官',
  偏财: '偏財',
  偏財: '偏財',
  正财: '正財',
  正財: '正財',
  七杀: '偏官',
  七殺: '偏官',
  偏官: '偏官',
  正官: '正官',
  偏印: '偏印',
  正印: '印綬',
  印綬: '印綬',
  日主: '日主',
};
function displayTenGod(name) {
  return TEN_GOD_DISPLAY[name] || name || '—';
}
function hasTenGod(set, name) {
  return set.has(name) || Array.from(set).some((item) => displayTenGod(item) === name);
}
function localizeReadingTerm(text) {
  return String(text || '')
    .replaceAll('七杀', '偏官')
    .replaceAll('七殺', '偏官')
    .replaceAll('劫财', '劫財')
    .replaceAll('伤官', '傷官')
    .replaceAll('偏财', '偏財')
    .replaceAll('正财', '正財')
    .replaceAll('正印格', '印綬格')
    .replaceAll('正印', '印綬')
    .replaceAll('藏干', '蔵干')
    .replaceAll('纳音', '納音')
    .replaceAll('格局', '命式の型');
}
function displayPatternName(pattern) {
  return localizeReadingTerm(pattern?.name || '命式の型');
}
function displayPatternText(pattern, fallback = '月令と天干から命式の型を見ます。') {
  return localizeReadingTerm(pattern?.text || fallback);
}

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

function seasonalElementState(calc) {
  const monthBranch = calc.fiveElements?.basis?.monthBranch || calc.pillars.month.branch;
  return SEASONAL_ELEMENT_STATES[monthBranch] || { season: '—', states: {} };
}

function tenGodStats(calc) {
  const map = new Map();
  PILLAR_KEYS.forEach(key => {
    const heavenly = calc.tenGods[key];
    if (heavenly && heavenly !== '日主') {
      const item = map.get(heavenly) || { name: heavenly, heavenly: 0, hidden: 0, total: 0 };
      item.heavenly += 1;
      item.total += 1;
      map.set(heavenly, item);
    }
    (calc.pillars[key].hiddenStemDetails || []).forEach(detail => {
      if (!detail.tenGod || detail.tenGod === '日主') return;
      const item = map.get(detail.tenGod) || { name: detail.tenGod, heavenly: 0, hidden: 0, total: 0 };
      item.hidden += 1;
      item.total += 1;
      map.set(detail.tenGod, item);
    });
  });
  return Array.from(map.values()).sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
}

function hiddenStemStats(calc) {
  const map = new Map();
  PILLAR_KEYS.forEach(key => {
    (calc.pillars[key].hiddenStemDetails || []).forEach(detail => {
      const id = `${detail.stem}-${detail.element}`;
      const item = map.get(id) || { stem: detail.stem, element: detail.element, total: 0 };
      item.total += 1;
      map.set(id, item);
    });
  });
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
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
      kind: 'core',
      label: '日主',
      value: `${calc.dayMaster}（${calc.pillars.day.element.stem}）`,
      detail: stem.text || '日主は日柱の天干で、命式全体を読む起点です。',
      evidence: `日柱天干 ${calc.dayMaster} / 五行 ${calc.pillars.day.element.stem}`,
      action: 'daymaster',
      target: { page: 'insight', topic: 'personality', anchor: 'insight-daymaster' },
    },
    {
      kind: 'pattern',
      label: '命式の型',
      value: displayPatternName(calc.pattern),
      detail: displayPatternText(calc.pattern, '月令と天干から命式の大枠を見ます。'),
      evidence: '月令・天干',
      action: 'insight',
      target: { page: 'insight', topic: 'talent', anchor: 'insight-judgement' },
    },
    {
      kind: 'strength',
      label: '身強弱',
      value: calc.strength?.status || '未判定',
      detail: calc.strength?.text || '日主の勢いを月令と五行構成から見ます。',
      evidence: `日主 ${calc.dayMaster} / 月支 ${calc.pillars.month.branch}`,
      action: 'daymaster',
      target: { page: 'insight', topic: 'career', anchor: 'insight-judgement' },
    },
    {
      kind: 'element',
      label: '強い五行',
      value: dominant.join('・'),
      detail: `${dominant.join('・')} が命式全体で前に出やすい五行です。`,
      evidence: '天干・蔵干・月令補正',
      action: 'elements',
      target: { page: 'insight', topic: 'talent', anchor: 'insight-elements' },
    },
    {
      kind: calc.fiveElements?.missing?.length ? 'warning' : 'support',
      label: calc.fiveElements?.missing?.length ? '不足五行' : '補う五行',
      value: support.join('・'),
      detail: `${support.join('・')} は意識して補うと全体が整いやすい候補です。`,
      evidence: '五行構成比',
      action: 'elements',
      target: { page: 'insight', topic: 'talent', anchor: 'insight-element-basis' },
    },
    {
      kind: 'support',
      label: '幸運の源',
      value: [calc.yongShen?.primary, calc.yongShen?.secondary].filter(Boolean).join('・') || '用神',
      detail: calc.yongShen?.text || '命式の偏りを整える要素を見ます。',
      evidence: '調候・用神',
      action: 'insight',
      target: { page: 'insight', topic: 'talent', anchor: 'insight-judgement' },
    },
    {
      kind: 'god',
      label: '主な課題',
      value: displayTenGod(god) || '十神',
      detail: god ? TEN_GOD_READING[god]?.text : '命式で重なる十神テーマです。',
      evidence: god ? `十神出現 ${tenGods[0]?.[1] || 0}` : '十神',
      action: 'insight',
      target: { page: 'insight', topic: 'personality', anchor: 'insight-ten-gods' },
    },
    {
      kind: 'source',
      label: '婚姻宮',
      value: `日支 ${calc.pillars.day.branch}`,
      detail: '親密な関係や婚姻の読みは、日柱の地支を中心に見ます。',
      evidence: `日柱 ${calc.pillars.day.text}`,
      action: 'marriage',
      target: { page: 'insight', topic: 'marriage', anchor: 'insight-topic-main' },
    },
    {
      kind: 'trend',
      label: '運勢の流れ',
      value: fortuneTrendTag(calc),
      detail: current ? `現在は ${current.name}（${current.startYear}-${current.endYear}）の大運です。` : '性別を選ぶと大運の流れを定位できます。',
      evidence: current ? `大運 ${current.name}` : '大運未判定',
      action: 'fortune',
      target: { page: 'fortune', anchor: 'f0' },
    },
  ];
}

function chartStateSummary(calc) {
  const dominant = strongestElements(calc).filter(Boolean);
  const support = supportElements(calc).filter(Boolean);
  const yong = [calc.yongShen?.primary, calc.yongShen?.secondary].filter(Boolean);
  const ratio = Number.isFinite(calc.strength?.ratio) ? Math.round(calc.strength.ratio * 100) : null;
  const balance = Number.isFinite(calc.fiveElements?.balanceScore) ? Math.round(calc.fiveElements.balanceScore) : null;
  const dominantLabel = dominant.length ? dominant.join('・') : '五行';
  const supportLabel = support.length ? support.join('・') : '調整五行';
  const yongLabel = yong.length ? yong.join('・') : supportLabel;
  const balanceTone = balance === null
    ? '五行の偏りは構成比から見ます。'
    : balance >= 75
      ? '五行の配分は比較的まとまり、持ち味を安定して使いやすい命盤です。'
      : balance >= 55
        ? '五行に少し偏りがあり、強い要素を活かしながら不足を補うと整います。'
        : '五行の偏りがはっきり出る命盤です。強い要素が長所にも課題にもなりやすく、補う五行が重要です。';
  return {
    title: `${displayPatternName(calc.pattern)} / ${calc.strength?.status || '身強弱'}`,
    lead: `この命盤は「${displayPatternName(calc.pattern)}」を土台に、日主 ${calc.dayMaster} が ${calc.strength?.status || '判定中'} の状態で動く構成です。五行では ${dominantLabel} が前に出やすく、${supportLabel} を意識すると全体の流れが整いやすくなります。`,
    note: `${balanceTone} 用神は ${yongLabel} を中心に読み、性格・仕事・対人関係の説明にもこの状態を反映します。`,
    cards: [
      {
        label: '命式の型',
        value: displayPatternName(calc.pattern),
        text: displayPatternText(calc.pattern, '月令と天干から、命式全体の方向性を読みます。'),
        source: `月支 ${calc.pillars.month.branch} / 月柱 ${calc.pillars.month.text}`,
      },
      {
        label: '日主の状態',
        value: ratio === null ? (calc.strength?.status || '身強弱') : `${calc.strength?.status || '身強弱'} ${ratio}%`,
        text: calc.strength?.text || '日主の勢いを、月令と五行の支えから見ます。',
        source: `日主 ${calc.dayMaster} / 日柱 ${calc.pillars.day.text}`,
      },
      {
        label: '五行の偏り',
        value: balance === null ? dominantLabel : `平衡 ${balance}`,
        text: `強く出る五行は ${dominantLabel}、補いたい五行は ${supportLabel} です。`,
        source: '天干・地支・蔵干・月令補正',
      },
      {
        label: '整える鍵',
        value: yongLabel,
        text: calc.yongShen?.text || `${supportLabel} を生活・仕事・環境で補うと、命盤の偏りを整えやすくなります。`,
        source: '調候用神 / 補五行',
      },
    ],
  };
}

function analyzeSynthesis(calculation, profile) {
  const dayBranch = calculation.pillars.day.branch;
  const gender = profile.gender;
  const tenGodsSet = new Set(collectTenGods(calculation).map(([god]) => god));
  const pattern = displayPatternName(calculation.pattern);
  const allShenSha = PILLAR_KEYS.flatMap(k => getShenSha(calculation.pillars[k].branch, calculation.dayMaster, calculation.pillars.year.branch, calculation.pillars.day.branch));
  
  const hasHongLuan = allShenSha.includes('紅鸞');
  const hasGuChen = allShenSha.includes('孤辰') || allShenSha.includes('寡宿');

  let marriagePoints = [];
  if (gender === 'female') {
    if (hasTenGod(tenGodsSet, '正官')) marriagePoints.push('命式内に「正官（夫の星）」があり、誠実な縁に恵まれやすい徳を持っています。');
    else if (hasTenGod(tenGodsSet, '偏官')) marriagePoints.push('「偏官」の影響が強く、ドラマチックで刺激的な関係を求める傾向にあります。');
    else marriagePoints.push('自立した個としての生き方を尊重し合える関係が幸福の鍵です。');
  } else if (gender === 'male') {
    if (hasTenGod(tenGodsSet, '正財')) marriagePoints.push('命式内に「正財（妻の星）」があり、家庭を基盤として運気を安定させる力があります。');
    else if (hasTenGod(tenGodsSet, '偏財')) marriagePoints.push('「偏財」が巡っており、華やかな対人関係の中から縁が広がりやすいタイプです。');
    else marriagePoints.push('共通の目的を持つことで絆が深まるパートナーシップが理想的です。');
  }
  marriagePoints.push(`配偶者の場所（日支）に「${dayBranch}」を宿しており、これが親密な関係での振る舞いを象徴します。`);
  if (hasHongLuan) marriagePoints.push('また「紅鸞」を宿しており、華やかな魅力と良縁に恵まれやすいでしょう。');
  if (hasGuChen) marriagePoints.push('一方で一人の時間を大切にする気質もあり、適度な距離感が関係維持のポイントです。');
  
  const career = `月支の「${calculation.pillars.month.branch}」と命式の型「${pattern}」が社会的な武器です。${calculation.strength?.status === '身強' ? '自ら主導権を握る環境' : '組織の中での専門的な役割'}で最も輝きます。`;
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
    const families = ['比肩・劫財', '食神・傷官', '正財・偏財', '正官・偏官', '印綬・偏印'];
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
  const [activeTagIndex, setActiveTagIndex] = React.useState(null);
  const focusTagDetail = (index) => {
    setActiveTagIndex(index);
    window.requestAnimationFrame(() => {
      const detail = document.getElementById(`tag-detail-${index}`);
      if (!detail) return;
      const offset = window.matchMedia('(max-width: 768px)').matches ? 132 : 88;
      window.scrollTo({ top: detail.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  };
  return (
    <section className="user-tag-index">
      <div className="summary-kicker">命式タグ索引</div>
      <h2>重要な読みをタグで確認する</h2>
      <p>タグを押すと、このページ下部の概要説明へ移動します。さらに詳しく読む場合は、各説明カードの「詳細説明」から深い鑑定へ進めます。</p>
      <div className="user-tag-row">
        {tags.map((tag, index) => (
          <button
            key={`${tag.label}-${tag.value}`}
            className={`user-tag tag-${tag.kind} ${activeTagIndex === index ? 'is-active' : ''}`}
            onClick={() => focusTagDetail(index)}
          >
            <small>{tag.label}</small>
            <strong>{tag.value}</strong>
          </button>
        ))}
      </div>
      <div className="user-tag-detail-grid">
        {tags.map((tag, index) => (
          <article
            key={`${tag.label}-${tag.value}-detail`}
            id={`tag-detail-${index}`}
            className={`user-tag-detail ${activeTagIndex === index ? 'is-active' : ''}`}
          >
            <div className="user-tag-detail-head">
              <span className={`user-tag tag-${tag.kind}`}>
                <small>{tag.label}</small>
                <strong>{tag.value}</strong>
              </span>
              <button onClick={() => onNavigate(tag)}>詳細説明</button>
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

function BaziStructureBoard({ calculation, activePillar, onFocus }) {
  const order = ['year', 'month', 'day', 'hour'];
  const rows = [
    {
      label: '通変星',
      className: 'bazi-god',
      render: (_pillar, key) => <strong>{displayTenGod(calculation.tenGods[key])}</strong>,
    },
    {
      label: '天干',
      className: 'bazi-stem',
      render: (pillar) => <strong className={elementClass(pillar.element.stem)}>{pillar.stem}</strong>,
    },
    {
      label: '地支',
      className: 'bazi-branch',
      render: (pillar) => <strong className={elementClass(pillar.element.branch)}>{pillar.branch}</strong>,
    },
    {
      label: '蔵干',
      className: 'bazi-detail',
      render: (pillar) => (pillar.hiddenStemDetails?.length
        ? pillar.hiddenStemDetails
        : pillar.hiddenStems.map(stem => ({ stem }))
      ).map((detail, index) => (
        <span key={`${detail.stem}-${index}`} className={`mini-line ${elementClass(detail.element)}`}>{detail.stem}{detail.element ? `・${detail.element}` : ''}</span>
      )),
    },
    {
      label: '蔵干通変',
      className: 'bazi-detail',
      render: (pillar) => pillar.hiddenStemDetails?.length ? pillar.hiddenStemDetails.map((detail, index) => (
        <span key={`${detail.tenGod}-${index}`} className={`mini-line ${elementClass(detail.element)}`}>{displayTenGod(detail.tenGod)}</span>
      )) : <span className="muted">—</span>,
    },
    {
      label: '納音',
      className: 'bazi-flat',
      render: (pillar) => <span className={elementClass((pillar.naYin || '').slice(-1))}>{pillar.naYin || '—'}</span>,
    },
    {
      label: '空亡',
      className: 'bazi-flat',
      render: (pillar) => <span>{(pillar.voidBranches || []).join('') || '—'}</span>,
    },
    {
      label: '地勢',
      className: 'bazi-flat',
      render: (pillar) => <span>{pillar.terrainByDay || pillar.lifeStage || '—'}</span>,
    },
    {
      label: '自坐',
      className: 'bazi-flat',
      render: (pillar) => <span>{pillar.terrainSelf || pillar.lifeStage || '—'}</span>,
    },
  ];
  return (
    <section className="bazi-structure-section" aria-label="命式構造表">
      <div className="bazi-structure-head">
        <div>
          <div className="summary-kicker">命式構造表</div>
          <h3>四柱を横に並べて、要素ごとに確認する</h3>
        </div>
        <p>検証ページの詳細表と同じ読み方で、どの柱のどの要素から判断しているかを確認できます。</p>
      </div>
      <div className="bazi-board-pro">
        <div className="bazi-pro-row bazi-pro-head">
          <div className="bazi-pro-label"><span className="bazi-head-label">項目</span></div>
          {order.map(key => (
            <button key={key} type="button" className={`bazi-pro-cell ${key === 'day' ? 'is-day' : ''} ${activePillar === key ? 'is-active-column' : ''}`} onClick={() => onFocus?.(activePillar === key ? null : key)}>
              <span className="bazi-pillar-title">{PILLAR_LABELS[key]}</span>
              <strong className="bazi-pillar-value">{calculation.pillars[key].text}</strong>
            </button>
          ))}
        </div>
        {rows.map(row => {
          const guide = BAZI_ROW_GUIDES[row.label] || { icon: row.label.slice(0, 1), hint: '' };
          return (
            <div key={row.label} className={`bazi-pro-row ${row.className}`}>
              <div className="bazi-pro-label">
                <div className="bazi-label-content">
                  <span className="bazi-icon">{guide.icon}</span>
                  <span><strong>{row.label}</strong><small>{guide.hint}</small></span>
                </div>
              </div>
              {order.map(key => (
                <button key={`${row.label}-${key}`} type="button" className={`bazi-pro-cell ${key === 'day' ? 'is-day' : ''} ${activePillar === key ? 'is-active-column' : ''}`} onClick={() => onFocus?.(activePillar === key ? null : key)}>
                  {row.render(calculation.pillars[key], key)}
                </button>
              ))}
            </div>
          );
        })}
      </div>
      <div className="bazi-scroll-hint">年柱・月柱・日柱・時柱を横に並べて確認できます</div>
    </section>
  );
}

function ChartStateOverview({ calculation }) {
  const state = chartStateSummary(calculation);
  return (
    <section className="chart-state-overview" aria-label="命盤が映す全体状態">
      <div className="chart-state-copy">
        <div className="summary-kicker">命盤状態</div>
        <h2>命盤が映す全体の状態</h2>
        <p>{state.lead}</p>
        <p>{state.note}</p>
      </div>
      <div className="chart-state-grid">
        {state.cards.map(card => (
          <article key={card.label} className="chart-state-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <p>{card.text}</p>
            <small>{card.source}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function BackendDetailSync({ calculation }) {
  const seasonal = seasonalElementState(calculation);
  const percentages = elementPercentages(calculation);
  const basis = calculation.fiveElements?.basis || {};
  const gods = tenGodStats(calculation);
  const hidden = hiddenStemStats(calculation);
  const yong = [calculation.yongShen?.primary, calculation.yongShen?.secondary].filter(Boolean).join('・') || '—';
  return (
    <div className="backend-sync-stack">
      <section id="insight-judgement" className="backend-panel">
        <div className="backend-panel-head">
          <div>
            <div className="summary-kicker">命式の型 / 身強身弱 / 用神</div>
            <h3>検証ページの判定をユーザー向けに整理する</h3>
          </div>
          <span>主要判定</span>
        </div>
        <div className="backend-card-grid three">
          <article><small>命式の型</small><strong>{displayPatternName(calculation.pattern)}</strong><p>{displayPatternText(calculation.pattern)}</p></article>
          <article><small>身強身弱</small><strong>{calculation.strength?.status || '—'}</strong><p>{calculation.strength?.text || '日主の勢いを見ます。'}</p></article>
          <article><small>用神</small><strong>{yong}</strong><p>{calculation.yongShen?.text || '命式を整える五行を見ます。'}</p></article>
        </div>
      </section>

      <section id="insight-element-basis" className="backend-panel">
        <div className="backend-panel-head">
          <div>
            <div className="summary-kicker">五行計算の根拠</div>
            <h3>構成比と旺相休囚死</h3>
          </div>
          <span>平衡 {calculation.fiveElements?.balanceScore ?? '—'}</span>
        </div>
        <p className="backend-copy">五行は天干、地支の蔵干、月柱の季節補正を合わせて点数化しています。月支 {basis.monthBranch || calculation.pillars.month.branch} の季節から、五行の働きやすさも重ねて見ます。</p>
        <div className="backend-card-grid five">
          {ELEMENT_LABELS.map(el => (
            <article key={el}>
              <small>{el}</small>
              <strong className={elementClass(el)}>{percentages[el] || 0}% / {seasonal.states[el] || '休'}</strong>
              <p>raw {calculation.fiveElements?.rawPoints?.[el] ?? '—'} / count {calculation.fiveElements?.counts?.[el] ?? 0}</p>
              <em>{SEASONAL_STATE_TEXT[seasonal.states[el]] || ''}</em>
            </article>
          ))}
        </div>
      </section>

      <section id="insight-ten-gods" className="backend-panel">
        <div className="backend-panel-head">
          <div>
            <div className="summary-kicker">十神 / 蔵干</div>
            <h3>表に出る役割と内側のテーマ</h3>
          </div>
          <span>構成分析</span>
        </div>
        <div className="backend-card-grid two">
          <article>
            <small>十神の割合</small>
            <div className="backend-token-list">
              {gods.slice(0, 8).map(god => <span key={god.name}><strong>{displayTenGod(god.name)}</strong> ×{god.total} <em>干{god.heavenly}/支{god.hidden}</em></span>)}
            </div>
          </article>
          <article>
            <small>蔵干の重なり</small>
            <div className="backend-token-list">
              {hidden.slice(0, 8).map(item => <span key={`${item.stem}-${item.element}`}><strong className={elementClass(item.element)}>{item.stem}{item.element}</strong> ×{item.total}</span>)}
            </div>
          </article>
        </div>
      </section>

      <section id="insight-reading-position" className="backend-panel">
        <div className="backend-panel-head">
          <div>
            <div className="summary-kicker">読み取り位置 / 四柱の坐</div>
            <h3>どの柱・どの要素から読んでいるか</h3>
          </div>
          <span>四柱の位置</span>
        </div>
        <div className="backend-card-grid four">
          {PILLAR_KEYS.map(key => {
            const p = calculation.pillars[key];
            const guide = PILLAR_READING[key];
            const hiddenText = (p.hiddenStemDetails || []).map(detail => `${detail.stem}${detail.element}（${displayTenGod(detail.tenGod)}）`).join('、') || '—';
            return (
              <article key={key} className={key === 'day' ? 'is-primary' : ''}>
                <small>{PILLAR_LABELS[key]} / {guide.title}</small>
                <strong><span className={elementClass(p.element.stem)}>{p.stem}</span><span className={elementClass(p.element.branch)}>{p.branch}</span></strong>
                <p>{guide.text}</p>
                <em>蔵干: {hiddenText}</em>
                <em>地勢 {p.terrainByDay || '—'} / 自坐 {p.terrainSelf || '—'}</em>
                {key === 'day' && <b>日支 {p.branch} は婚姻宮として詳解します</b>}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function genderDisplay(profile) {
  if (profile?.gender === 'yang') return '男性（陽）';
  if (profile?.gender === 'yin') return '女性（陰）';
  return '選択しない';
}

function timeDisplay(calculation, profile) {
  const input = calculation.inputEcho || {};
  if (profile?.unsure || !input.timeKnown) return '時間不明（12:00で仮計算）';
  const branch = calculation.pillars?.hour?.branch ? `${calculation.pillars.hour.branch}の刻` : '時辰';
  return `${input.time || '—'} / ${branch}`;
}

function BasicInfoPanel({ name, calculation, profile }) {
  const input = calculation.inputEcho || {};
  const meta = calculation.calculationMeta || {};
  const location = profile?.location || meta.location || {};
  const rows = [
    { label: 'お名前', value: name || '未入力' },
    { label: '性別', value: genderDisplay(profile) },
    { label: '生年月日', value: input.date || meta.inputDateTime?.slice(0, 10) || '—' },
    { label: '出生時間', value: timeDisplay(calculation, profile) },
    { label: '出生地', value: stripJapan(location.label || meta.location?.label || '—') },
    { label: 'タイムゾーン', value: meta.timezone || location.timezone || '—' },
    { label: '真太陽時', value: meta.trueSolarTime === 'applied' ? meta.effectiveBirthDateTime : '未補正' },
    { label: '四柱', value: calculation.pillarLine || PILLAR_KEYS.map(key => calculation.pillars[key].text).join(' / ') },
  ];
  return (
    <section id="s0" className="basic-info-panel result-wide" aria-label="命式の基本情報">
      <div className="basic-info-head">
        <div>
          <div className="summary-kicker">基本情報</div>
          <h2>命式を読むための前提</h2>
        </div>
        <strong>日主 {calculation.dayMaster}</strong>
      </div>
      <div className="basic-info-grid">
        {rows.map(row => (
          <div className="basic-info-item" key={row.label}>
            <span>{row.label}</span>
            <strong>{row.value || '—'}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function FoundationDetailSections({ calculation }) {
  const [activePillar, setActivePillar] = React.useState(null);
  const stemReading = STEM_READING[calculation.dayMaster] || { title: '日主の説明', text: '' };
  const percentages = elementPercentages(calculation);
  const dominantElements = Object.entries(percentages).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([name]) => name).join('・');
  const support = supportElements(calculation).join('・');
  return (
    <div className="foundation-detail-stack">
      <section id="insight-pillars" className="backend-panel">
        <div className="backend-panel-head">
          <div>
            <div className="summary-kicker">四柱の意味</div>
            <h3>年柱・月柱・日柱・時柱が表す領域</h3>
          </div>
          <span>基礎読解</span>
        </div>
        <PillarMeaningCards calculation={calculation} onFocus={setActivePillar} />
      </section>

      <section id="insight-daymaster" className="backend-panel">
        <div className="backend-panel-head">
          <div>
            <div className="summary-kicker">日主</div>
            <h3>あなたを表す星：{calculation.dayMaster}</h3>
          </div>
          <span>{stemReading.title}</span>
        </div>
        <div className="day-master-detail">
          <div className="day-master-symbol">{STEM_ICONS[calculation.dayMaster]}</div>
          <div>
            <p>{stemReading.text}</p>
            <div className="result-tags">{(STEM_READING[calculation.dayMaster]?.tags || []).map(t => <span key={t}># {t}</span>)}</div>
          </div>
        </div>
      </section>

      <section id="insight-elements" className="backend-panel">
        <div className="backend-panel-head">
          <div>
            <div className="summary-kicker">五行バランス</div>
            <h3>強く出る五行は {dominantElements || '—'}</h3>
          </div>
          <span>補 {support || '—'}</span>
        </div>
        <p className="backend-copy">五行の構成比と生剋図を確認します。細かな計算根拠と季節による強弱は下の五行計算の根拠で確認できます。</p>
        <div className="foundation-element-bars">
          {ELEMENT_LABELS.map(el => (
            <div key={el} className="foundation-element-row">
              <span className={elementClass(el)}>{el}</span>
              <div><i style={{ width: `${percentages[el] || 0}%`, background: `var(--${elementClass(el)})` }} /></div>
              <strong>{percentages[el] || 0}%</strong>
            </div>
          ))}
        </div>
        <WuxingDiagram dayElement={calculation.pillars.day.element.stem} elementCounts={calculation.fiveElements.counts} />
      </section>
    </div>
  );
}

function ResultView({ id, name, calculation, profile, onBack, onShowFortune, onShowInsight }) {
  const [activePillar, setActivePillar] = React.useState(null);
  const readingTags = React.useMemo(() => buildUserReadingTags(calculation, collectTenGods(calculation)), [calculation]);
  const scrollTo = (sid) => {
    const el = document.getElementById(sid);
    if (el) {
      const offset = window.matchMedia('(max-width: 768px)').matches ? 132 : 88;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }
  };
  const handleTagNavigate = (tag) => {
    const target = tag?.target || {};
    if (target.page === 'fortune' || tag?.action === 'fortune') {
      onShowFortune(target);
      return;
    }
    onShowInsight(target);
  };

  return (
    <section className="rite result-rite" data-screen-label="03 命式">
      <aside className="rite-side">
        <div className="kanji">命式</div><div className="label">MEISHIKI CHART</div>
        <div className="seal-stack">
          {['基本情報','四柱命式','タグ索引','詳しい解説'].map((n, i) => (
            <div key={n} style={{ cursor: 'pointer' }} onClick={() => scrollTo(`s${i}`)}><span className="num">{['壹','貳','參','肆'][i]}</span>　{n}</div>
          ))}
          <div style={{ marginTop: 24 }}><button onClick={onBack} style={{ background: 'transparent', border: 0, color: 'var(--ink-3)', cursor: 'pointer', fontFamily: 'var(--f-mono)', letterSpacing: '0.2em' }}>← 入力へ戻る</button></div>
        </div>
      </aside>
      <div className="rite-main result-main" style={{ paddingBottom: 120 }}>
        <div className="return-action-row">
          <button className="inline-return-btn edit" onClick={onBack}>入力内容を修正する</button>
        </div>
        <div className="result-card" data-card-label="命式の確認" style={{ marginTop: 0 }}>
          <div className="result-summary result-wide" style={{ paddingBottom: 0 }}>
            <div className="summary-kicker">四柱推命 鑑定結果</div>
            <h2 style={{ margin: '6px 0 8px', fontSize: 26, letterSpacing: '0.04em' }}>{name || 'あなた'}の命式</h2>
            <p style={{ fontSize: 13, color: 'var(--ink-2)' }}>まずは命盤そのものを素早く確認できます。詳しい読み解きは「命式詳細」と「大運・流年」に分けています。</p>
          </div>
          <BasicInfoPanel name={name} calculation={calculation} profile={profile} />
          
          <div id="s1" className="result-wide result-chart-section" style={{ paddingTop: 10 }}>
            <div className="result-summary result-wide" style={{ paddingTop: 0 }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 24, letterSpacing: '0.05em' }}>四柱の命式</h2>
              <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 24 }}>年柱・月柱・日柱・時柱を横に並べ、命盤の基本構造だけを確認します。</p>
            </div>
            <BaziStructureBoard calculation={calculation} activePillar={activePillar} onFocus={setActivePillar} />
          </div>

          <div id="s2" className="result-wide" style={{ marginTop: 44 }}>
            <UserTagIndex tags={readingTags} onNavigate={handleTagNavigate} />
          </div>

          <div id="s3" className="result-wide next-actions" style={{ marginTop: 64 }}>
            <button onClick={onShowInsight}>命式詳細を読む <span>詳解</span></button>
            <button onClick={onShowFortune}>大運・流年を見る <span>運勢</span></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function InsightView({ calculation, profile, onBack, onEditInput, routeTarget }) {
  const [topic, setTopic] = React.useState(routeTarget?.topic || 'personality');
  const handledRouteKey = React.useRef(null);
  const primaryGod = collectTenGods(calculation)[0]?.[0] || '比肩';
  const dayStem = calculation.dayMaster;
  const synthesis = React.useMemo(() => analyzeSynthesis(calculation, profile), [calculation, profile]);
  const TOPICS = [ { key: 'personality', ja: '性格傾向', icon: '👤', title: 'あなたの強みと本質' }, { key: 'talent', ja: '才能・天分', icon: '✨', title: '天から授かった才能' }, { key: 'career', ja: '仕事・金運', icon: '💰', title: '仕事と財の流れ' }, { key: 'marriage', ja: '恋愛・婚姻', icon: '❤️', title: '愛と絆の形' } ];
  const currentTopic = TOPICS.find(t => t.key === topic);
  const getInsightContent = (key) => {
    const contents = {
      personality: { intro: `日主「${dayStem}」と「${displayTenGod(primaryGod)}」から解析します。`, p1: `【本質】${STEM_READING[dayStem]?.text}`, p2: `【行動】${TEN_GOD_READING[primaryGod]?.text}` },
      talent: { intro: `あなたの才能の活かし所を特定します。`, p1: `あなたの命式の型は「${displayPatternName(calculation.pattern)}」です。${displayPatternText(calculation.pattern)}`, p2: `補助する要素があなたの独自性を高めています。` },
      career: { intro: `最適なビジネススタイルを提案します。`, p1: `エネルギーは「${calculation.strength?.status}」です。${calculation.strength?.text}`, p2: `【分析】${synthesis.career}` },
      marriage: { intro: `配偶者宮から理想のパートナーシップを導きます。`, p1: `配偶者の場所には「${calculation.pillars.day.branch}」が鎮座。${BRANCH_READING[calculation.pillars.day.branch]}`, p2: `【分析】${synthesis.marriage}` }
    };
    return contents[key] || contents.personality;
  };
  const content = getInsightContent(topic);
  const scrollTo = (sid) => {
    const el = document.getElementById(sid);
    if (el) {
      const offset = window.matchMedia('(max-width: 768px)').matches ? 132 : 88;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }
  };
  React.useEffect(() => {
    if (!routeTarget?.key || handledRouteKey.current === routeTarget.key) return;
    if (routeTarget.topic && routeTarget.topic !== topic) {
      setTopic(routeTarget.topic);
      return;
    }
    if (routeTarget.anchor) {
      window.requestAnimationFrame(() => scrollTo(routeTarget.anchor));
    }
    handledRouteKey.current = routeTarget.key;
  }, [routeTarget, topic]);
  return (
    <section className="rite" data-screen-label="05 命式詳細">
      <aside className="rite-side">
        <div className="kanji">命式詳細</div><div className="label">PERSONAL INSIGHTS</div>
        <div className="seal-stack">
          {TOPICS.map((t, i) => <div key={t.key} style={{ cursor: 'pointer', color: topic === t.key ? 'var(--gold)' : 'inherit' }} onClick={() => setTopic(t.key)}><span className="num">{['壹','貳','參','肆'][i]}</span>　{t.ja}</div>)}
          <div style={{ marginTop: 24 }}><button onClick={onBack} style={{ background: 'transparent', border: 0, color: 'var(--ink-3)', cursor: 'pointer', fontFamily: 'var(--f-mono)', letterSpacing: '0.2em' }}>← 命式へ戻る</button></div>
        </div>
      </aside>
      <div className="rite-main" style={{ paddingBottom: 120 }}>
        <div className="return-action-row">
          <button className="inline-return-btn" onClick={onBack}>← 命式へ戻る</button>
          <button className="inline-return-btn edit" onClick={onEditInput}>入力内容を修正する</button>
        </div>
        <div className="result-card" data-card-label="命式詳細" style={{ marginTop: 0 }}><div className="result-summary result-wide" style={{ paddingTop: 20 }}>
          <div className="summary-kicker">{currentTopic.ja}の詳解</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}><div style={{ width: 56, height: 56, borderRadius: '50%', background: 'color-mix(in srgb, var(--gold) 10%, transparent)', border: '1px solid var(--gold)', display: 'grid', placeItems: 'center', fontSize: 24 }}>{currentTopic.icon}</div><h2 style={{ margin: 0, fontSize: 24 }}>{currentTopic.title}</h2></div>
          <div id="insight-topic-main" className="visual-block" style={{ padding: '32px', background: 'var(--bg-paper)', borderRadius: '8px', border: '1px solid var(--rule-strong)' }}><p>{content.intro}</p><div style={{ fontSize: 15, lineHeight: 2, marginBottom: 24 }}>{content.p1}</div><div style={{ fontSize: 15, lineHeight: 2 }}>{content.p2}</div></div>
          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>{TOPICS.filter(t => t.key !== topic).map(t => <button key={t.key} onClick={() => setTopic(t.key)} style={{ padding: '16px', background: 'transparent', border: '1px solid var(--rule)', borderRadius: 6, color: 'var(--ink-2)', cursor: 'pointer', textAlign: 'left', fontSize: 13 }}>次：{t.ja} →</button>)}</div>
          <FoundationDetailSections calculation={calculation} />
          <BackendDetailSync calculation={calculation} />
        </div></div>
      </div>
    </section>
  );
}

function FortuneView({ calculation, profile, onBack, onEditInput, routeTarget }) {
  const handledRouteKey = React.useRef(null);
  const luck = calculation.luckCycles || {};
  const decade = luck.decadeFortunes?.items || [];
  const currentAnnual = currentAnnualFortune(calculation);
  const currentDecade = currentDecadeFortune(luck.decadeFortunes, luck.target?.year || currentAnnual?.year);
  const currentDecadeTheme = decadeTheme(currentDecade, profile?.gender);
  const monthly = luck.monthlyFortunes || [];
  const daily = luck.dailyFortunes || [];
  const scrollTo = (sid) => {
    const el = document.getElementById(sid);
    if (el) {
      const offset = window.matchMedia('(max-width: 768px)').matches ? 132 : 88;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }
  };
  React.useEffect(() => {
    if (!routeTarget?.anchor || handledRouteKey.current === routeTarget.key) return;
    window.requestAnimationFrame(() => scrollTo(routeTarget.anchor));
    handledRouteKey.current = routeTarget.key;
  }, [routeTarget]);
  return (
    <section className="rite" data-screen-label="04 大運・流年">
      <aside className="rite-side">
        <div className="kanji">大運・流年</div><div className="label">FORTUNE CYCLES</div>
        <div className="seal-stack">
          {['十年運マップ','現在の大運','近い流年','明細表'].map((n, i) => (
            <div key={n} style={{ cursor: 'pointer' }} onClick={() => scrollTo(`f${i}`)}><span className="num">{['壹','貳','參','肆'][i]}</span>　{n}</div>
          ))}
          <div style={{ marginTop: 24 }}><button onClick={onBack} style={{ background: 'transparent', border: 0, color: 'var(--ink-3)', cursor: 'pointer', fontFamily: 'var(--f-mono)', letterSpacing: '0.2em' }}>← 命式へ戻る</button></div>
        </div>
      </aside>
      <div className="rite-main" style={{ paddingBottom: 120 }}>
        <div className="return-action-row">
          <button className="inline-return-btn" onClick={onBack}>← 命式へ戻る</button>
          <button className="inline-return-btn edit" onClick={onEditInput}>入力内容を修正する</button>
        </div>
        <div className="result-card" data-card-label="運勢の流れ" style={{ marginTop: 0 }}>
          <div className="result-summary result-wide" id="f0" style={{ paddingTop: 20 }}>
            <DecadeFortuneMap decade={decade} currentDecade={currentDecade} />
          </div>
          <div className="result-summary result-wide" id="f1" style={{ marginTop: 56, paddingTop: 40, borderTop: '1px solid var(--rule)' }}>
            <div className="summary-kicker">大運（10年運）の解読</div><h2 style={{ fontSize: 24 }}>{currentDecadeTheme?.title}</h2><p>{currentDecadeTheme?.intro}</p>
            <div className="result-wide visual-block" style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {[ { l: '◆ 仕事', v: currentDecadeTheme.work, c: 'var(--seal)' }, { l: '◆ 財', v: currentDecadeTheme.money, c: 'var(--gold)' }, { l: '◆ 対人', v: currentDecadeTheme.love, c: 'var(--accent)' }, { l: '◆ 家庭', v: currentDecadeTheme.family, c: 'var(--ink-3)' } ].map(x => (
                <article key={x.l} style={{ border: '1px solid var(--rule)', background: 'var(--bg-paper)', padding: 20, borderRadius: 6 }}><strong style={{ display: 'block', color: x.c, marginBottom: 8, fontSize: 13 }}>{x.l}</strong><p style={{ fontSize: 13 }}>{x.v}</p></article>
              ))}
            </div>
          </div>
          <div id="f2" className="result-wide visual-block" style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--rule)' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}><h3>今日の巡り（流年・流月・流日）</h3></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
              {[ { label: '今年の運気', item: currentAnnual, color: 'var(--accent)' }, { label: '今月の運気', item: monthly[0], color: 'var(--gold)' }, { label: '今日の運気', item: daily[0], color: 'var(--seal)' } ].map(l => (
                <div key={l.label} style={{ background: 'var(--bg-paper)', border: '1px solid var(--rule)', borderRadius: 8, padding: '20px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>{l.label}</div>
                  <div style={{ fontSize: 28, fontFamily: 'var(--f-display)' }}>{l.item?.pillar?.text}</div>
                  <div style={{ fontSize: 12, color: l.color }}><strong>{displayTenGod(l.item?.pillar?.heavenlyTenGod)}</strong></div>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 8 }}>{normalizeDisplayTerms(l.item?.pillar?.fortuneTheme || '')}</div>
                </div>
              ))}
            </div>
            <AnnualFortuneGuide annual={luck.annualFortunes || []} />
          </div>
          <div id="f3" style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--rule)' }}>
             <div style={{ textAlign: 'center' }}><h3>明細表</h3><p className="backend-copy">上の見取り図で大きな流れを確認したあと、必要に応じて干支・十神の明細を見ます。</p></div>
             <LuckItemTable
               title="大運"
               subtitle={luck.decadeFortunes?.status === 'ok' ? `${luck.decadeFortunes.gender || '性別'} / ${luck.decadeFortunes.direction || '順逆'} / 起運 ${luck.decadeFortunes.startTime || '—'}` : '性別を選ぶと十年運を定位します'}
               items={decade}
               columns={[
                 { label: '順', value: item => item.index },
                 { label: '大運', value: item => item.name },
                 { label: '年齢', value: item => `${item.startAge}-${item.endAge}歳` },
                 { label: '期間', value: item => `${item.startYear}-${item.endYear}` },
                 { label: '十神', value: item => displayTenGod(item.pillar?.heavenlyTenGod) },
               ]}
             />
             <div className="backend-luck-grid">
               <LuckItemTable
                 title="流年"
                 subtitle={`${luck.target?.year || new Date().getFullYear()}年からの10年`}
                 items={luck.annualFortunes || []}
                 columns={[
                   { label: '年', value: item => item.year },
                   { label: '干支', value: item => item.name },
                   { label: '十神', value: item => displayTenGod(item.pillar?.heavenlyTenGod) },
                 ]}
               />
               <LuckItemTable
                 title="流月"
                 subtitle={`${luck.target?.year || new Date().getFullYear()}年の節月`}
                 items={monthly}
                 columns={[
                   { label: '月', value: item => item.index },
                   { label: '開始', value: item => item.solarStartDate || '—' },
                   { label: '干支', value: item => item.name },
                 ]}
               />
               <LuckItemTable
                 title="流日"
                 subtitle="対象日から14日"
                 items={daily}
                 columns={[
                   { label: '日付', value: item => item.date },
                   { label: '干支', value: item => item.name },
                   { label: '十神', value: item => displayTenGod(item.pillar?.heavenlyTenGod) },
                 ]}
               />
             </div>
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

const TEN_GOD_FORTUNE_GUIDE = {
  比肩: { keywords: ['自立', '基礎固め'], rhythm: '自分の軸を整える十年', score: 62, tone: 'steady', advice: '独立心が強まりやすい時期です。無理に広げるより、自分の判断基準、生活基盤、仕事の型を固めるほど後半に活きます。' },
  劫财: { keywords: ['競争', '突破'], rhythm: '勝負に出やすい十年', score: 72, tone: 'active', advice: '人との競争や共同作業の中で力が出やすい時期です。勢いはありますが、契約・お金・役割分担を曖昧にしないことが運を安定させます。' },
  食神: { keywords: ['表現', '余裕'], rhythm: '楽しみが広がる十年', score: 70, tone: 'growth', advice: '表現、発信、育成、生活の楽しみが運を開きやすい時期です。無理な勝負より、続けられる形で才能を外へ出すと流れが整います。' },
  伤官: { keywords: ['才能', '改革'], rhythm: '才能を磨く十年', score: 68, tone: 'active', advice: '鋭さや専門性が前に出やすい時期です。既存の型を壊す力がありますが、言葉が強くなりやすいので、批判より提案に変えると評価につながります。' },
  偏财: { keywords: ['人脈', 'チャンス'], rhythm: '外へ広がる十年', score: 78, tone: 'peak', advice: '人脈、商機、移動、交渉で運が動きやすい時期です。仕事や収入の入口が増えやすい一方、散漫にならないよう優先順位を決めることが大切です。' },
  正财: { keywords: ['安定', '管理'], rhythm: '現実を積み上げる十年', score: 66, tone: 'steady', advice: 'お金、生活、仕事の管理力が問われる時期です。派手な変化より、貯蓄・実務・信用を積み上げるほど安定した実りにつながります。' },
  七杀: { keywords: ['挑戦', '責任'], rhythm: '責任が増す十年', score: 74, tone: 'active', advice: 'プレッシャーや大きな役割が来やすい時期です。挑戦運はありますが、勢いだけで進むより、ルールと健康管理を整えるほど飛躍に変わります。' },
  正官: { keywords: ['信用', '昇進'], rhythm: '社会的評価が育つ十年', score: 76, tone: 'peak', advice: '肩書き、責任、組織内の評価が育ちやすい時期です。誠実さと継続力が運を押し上げるので、約束を守ることが最大の開運行動になります。' },
  偏印: { keywords: ['学び', '転換'], rhythm: '視点を変える十年', score: 58, tone: 'rest', advice: '学び直し、専門分野、環境の切り替えに向く時期です。外へ強く攻めるより、次の展開に必要な知識や感性を蓄えると流れが良くなります。' },
  正印: { keywords: ['休養', '保護'], rhythm: '整えて受け取る十年', score: 60, tone: 'rest', advice: '学び、保護、休養、資格や知識の吸収に向く時期です。無理に成果を急がず、体調や心の余白を整えることが次の上昇につながります。' },
};

function fortuneGuideForGod(god) {
  return TEN_GOD_FORTUNE_GUIDE[god] || { keywords: ['確認', '調整'], rhythm: '流れを確認する時期', score: 60, tone: 'steady', advice: '大きな断定はせず、命式本体と流年を重ねて運の出方を確認します。' };
}

function decadeStageLabel(item) {
  const age = Number(item?.startAge ?? 0);
  if (age < 20) return '早年';
  if (age < 40) return '成長期';
  if (age < 60) return '充実期';
  return '成熟期';
}

function enrichDecadeFortune(item, currentDecade) {
  const guide = fortuneGuideForGod(item?.pillar?.heavenlyTenGod);
  const isCurrent = currentDecade && item?.index === currentDecade.index;
  return {
    ...item,
    guide,
    score: guide.score,
    scoreLabel: guide.score >= 75 ? '上昇' : guide.score >= 68 ? '活動' : guide.score >= 62 ? '安定' : '整える',
    stage: decadeStageLabel(item),
    isCurrent,
  };
}

function DecadeFortuneMap({ decade, currentDecade }) {
  const items = (decade || []).map(item => enrichDecadeFortune(item, currentDecade));
  if (!items.length) {
    return <p className="backend-copy">大運の流れは性別を選択すると表示できます。十年ごとのテーマ、運勢の起伏、仕事・財・対人の読みをまとめて確認できます。</p>;
  }
  const points = items.map((item, index) => {
    const x = items.length <= 1 ? 50 : (index / (items.length - 1)) * 100;
    const y = 100 - item.score;
    return `${x},${y}`;
  }).join(' ');
  return (
    <section className="fortune-map">
      <div className="fortune-map-head">
        <div>
          <div className="summary-kicker">十年運の見取り図</div>
          <h3>人生の流れを、十年ごとのテーマで読む</h3>
          <p>点数は吉凶の断定ではなく、外へ動く力・責任の強さ・整える時期を見やすくしたリズムです。</p>
        </div>
      </div>
      <div className="fortune-curve" aria-label="十年ごとの運勢リズム">
        <svg viewBox="0 0 100 48" preserveAspectRatio="none">
          <polyline points={points} />
          {items.map((item, index) => {
            const x = items.length <= 1 ? 50 : (index / (items.length - 1)) * 100;
            const y = 100 - item.score;
            return <circle key={item.index} cx={x} cy={y} r={item.isCurrent ? 2.8 : 2} className={item.isCurrent ? 'is-current' : ''} />;
          })}
        </svg>
      </div>
      <div className="decade-readable-grid">
        {items.map(item => (
          <article key={item.index} className={`decade-readable-card tone-${item.guide.tone} ${item.isCurrent ? 'is-current' : ''}`}>
            <div className="decade-readable-top">
              <span>{item.stage}</span>
              {item.isCurrent && <b>現在</b>}
            </div>
            <strong>{item.startAge}-{item.endAge}歳</strong>
            <h4>{displayTenGod(item.pillar?.heavenlyTenGod)}：{item.guide.rhythm}</h4>
            <div className="fortune-score"><i style={{ width: `${item.score}%` }} /><em>{item.scoreLabel}</em></div>
            <div className="fortune-keywords">
              {item.guide.keywords.map(keyword => <span key={keyword}>{keyword}</span>)}
            </div>
            <p>{item.guide.advice}</p>
            <small>{item.name} / {item.startYear}-{item.endYear}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function AnnualFortuneGuide({ annual }) {
  const items = (annual || []).slice(0, 5);
  if (!items.length) return null;
  return (
    <section className="annual-readable-guide">
      <div className="summary-kicker">近い流年のテーマ</div>
      <h3>これから数年の動き方</h3>
      <div className="annual-readable-grid">
        {items.map(item => {
          const guide = fortuneGuideForGod(item.pillar?.heavenlyTenGod);
          return (
            <article key={item.year}>
              <span>{item.year}</span>
              <strong>{displayTenGod(item.pillar?.heavenlyTenGod)}</strong>
              <p>{guide.keywords.join('・')}</p>
              <em>{normalizeDisplayTerms(item.pillar?.fortuneTheme || guide.rhythm)}</em>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function decadeTheme(decade, gender) {
  if (!decade) {
    return {
      title: '大運は性別を選ぶと定位できます',
      intro: '十年ごとの運勢は、性別によって順行・逆行が変わります。未選択の場合は流年・流月・流日を中心に確認します。',
      work: '現在は命式本体の型と日主を中心に仕事の傾向を見ます。',
      money: '財運は財星と五行バランスを中心に仮説として見ます。',
      love: '対人・恋愛は日支と流年の関係を重ねて見ます。',
      family: '家庭面は日柱と時柱を中心に見ます。',
    };
  }
  const god = decade.pillar?.heavenlyTenGod || '十神';
  const profile = TEN_GOD_READING[god] || { text: 'この十年に出やすい役割を見ます。', tags: [] };
  const godLabel = displayTenGod(god);
  const label = gender === 'male' ? '男性' : gender === 'female' ? '女性' : '性別未指定';
  return {
    title: `${decade.name} の大運テーマ`,
    intro: `${decade.startYear}-${decade.endYear}年（${decade.startAge}-${decade.endAge}歳）は、${godLabel} の働きが前に出やすい十年です。${label}としての順逆計算に基づいて表示しています。${profile.text}`,
    work: `${godLabel} の役割を仕事の場でどう使うかを見ます。${profile.tags?.join('・') || '役割'} がテーマです。`,
    money: '財運は収入断定ではなく、現実管理・人脈・責任の出方として読みます。',
    love: '対人運はこの大運の十神と日支の婚姻宮を重ねて確認します。',
    family: '家庭や内面は日柱・時柱に、この十年の干支がどう作用するかを見ます。',
  };
}

function LuckItemTable({ title, subtitle, items, columns }) {
  const rows = items || [];
  return (
    <section className="backend-panel luck-table-panel">
      <div className="backend-panel-head">
        <div>
          <div className="summary-kicker">{title}</div>
          <h3>{subtitle}</h3>
        </div>
      </div>
      {rows.length ? (
        <div className="user-luck-table-wrap">
          <table className="user-luck-table">
            <thead><tr>{columns.map(col => <th key={col.label}>{col.label}</th>)}</tr></thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={`${title}-${index}`}>
                  {columns.map(col => <td key={col.label}>{col.value(item)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="backend-copy">表示できるデータがありません。大運は性別を選択すると順行・逆行を定位して表示できます。</p>
      )}
    </section>
  );
}

window.Rite = Rite;
window.ResultView = ResultView;
window.FortuneView = FortuneView;
window.InsightView = InsightView;
