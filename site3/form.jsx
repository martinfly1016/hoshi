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

const RITE_NAV_ITEMS = [
  { key: 'profile', num: '壹', icon: '人', label: '名前・性別' },
  { key: 'birthday', num: '貳', icon: '日', label: '生年月日' },
  { key: 'birthtime', num: '參', icon: '時', label: '出生時刻' },
  { key: 'birthplace', num: '肆', icon: '地', label: '出生地' },
];

const RESULT_NAV_ITEMS = [
  { id: 's0', num: '壹', icon: '基', label: '基本情報' },
  { id: 's1', num: '貳', icon: '盤', label: '四柱命式' },
  { id: 's2', num: '參', icon: '要', label: '要点解読' },
  { id: 's3', num: '肆', icon: '詳', label: '詳しい解説' },
];

const FORTUNE_NAV_ITEMS = [
  { id: 'f0', num: '壹', icon: '図', label: '十年運マップ' },
  { id: 'f1', num: '貳', icon: '今', label: '現在の大運' },
  { id: 'f2', num: '參', icon: '巡', label: '近い流年' },
  { id: 'f3', num: '肆', icon: '表', label: '明細表' },
];

function TopicButton({ num, icon, label, active, onClick }) {
  return (
    <button type="button" className={`side-topic ${active ? 'is-active' : ''}`} onClick={onClick}>
      <span className="topic-icon" aria-hidden="true">{icon || num}</span>
      <span className="topic-copy">
        <span className="num">{num}</span>
        <span>{label}</span>
      </span>
    </button>
  );
}

function ReadingPointCards({ topic, content }) {
  const items = [
    { icon: '要', label: '要点', text: content.intro },
    { icon: '読', label: '読み方', text: content.p1 },
    { icon: '注', label: '注意', text: content.note },
  ];
  return (
    <div className="reading-point-grid" aria-label={`${topic}の要点`}>
      {items.map((item) => (
        <article key={item.label} className="reading-point-card">
          <span className="reading-point-icon" aria-hidden="true">{item.icon}</span>
          <div>
            <strong>{item.label}</strong>
            <p>{item.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function DetailDisclosure({ title = '詳しい説明', children }) {
  return (
    <details className="read-more-panel">
      <summary>
        <span>{title}</span>
        <em>開く</em>
      </summary>
      <div className="read-more-body">{children}</div>
    </details>
  );
}

const RELATION_VISUAL_LABELS = {
  same: { label: '同じ五行', direction: 'same', text: '同じ性質が重なり、自分らしさや同じ目線が出やすい関係です。' },
  supported: { label: '日支が日主を生む', direction: 'branch-to-stem', text: '親密関係や生活の場から、本人が支えられやすい関係です。' },
  output: { label: '日主が日支を生む', direction: 'stem-to-branch', text: '本人が関係や生活の場へ力を注ぎやすい関係です。' },
  wealth: { label: '日主が日支を制する', direction: 'stem-to-branch', text: '本人が関係や生活の場を管理し、責任を持ちやすい関係です。' },
  pressure: { label: '日支が日主を制する', direction: 'branch-to-stem', text: '親密関係や生活の場から、本人に役割や緊張感が生まれやすい関係です。' },
};

function DayBranchRelationVisual({ calculation }) {
  const day = calculation.pillars.day;
  const stemElement = day.element?.stem || '五行';
  const branchElement = day.element?.branch || '五行';
  const relationKey = marriageElementRelationKey(stemElement, branchElement);
  const visual = RELATION_VISUAL_LABELS[relationKey] || RELATION_VISUAL_LABELS.same;
  const hiddenMain = day.hiddenStemDetails?.[0];
  const arrow = visual.direction === 'branch-to-stem' ? '←' : visual.direction === 'same' ? '＝' : '→';
  return (
    <section className="day-relation-card" aria-label="日主と日支の関係">
      <div className="relation-node">
        <span>日主</span>
        <strong className={elementClass(stemElement)}>{day.stem}</strong>
        <small>{stemElement} / 本人像</small>
      </div>
      <div className="relation-flow">
        <b>{arrow}</b>
        <span>{visual.label}</span>
      </div>
      <div className="relation-node">
        <span>日支</span>
        <strong className={elementClass(branchElement)}>{day.branch}</strong>
        <small>{branchElement} / 婚姻宮</small>
      </div>
      <p>{visual.text}</p>
      {hiddenMain && (
        <div className="relation-hidden">
          <span>内側の気配</span>
          <strong>{hiddenMain.stem}{hiddenMain.element}</strong>
          <small>{displayTenGod(hiddenMain.tenGod)}</small>
        </div>
      )}
    </section>
  );
}

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
  { id: 'us-new-york', country: 'us', label: '米国 / ニューヨーク州 ニューヨーク市', city: 'New York', region: 'NY', timezone: 'America/New_York', utcOffset: -5, latitude: 40.7128, longitude: -74.006, keywords: 'new york ny ニューヨーク' },
  { id: 'us-los-angeles', country: 'us', label: '米国 / カリフォルニア州 ロサンゼルス', city: 'Los Angeles', region: 'CA', timezone: 'America/Los_Angeles', utcOffset: -8, latitude: 34.0522, longitude: -118.2437, keywords: 'los angeles california ca ロサンゼルス' },
  { id: 'us-san-francisco', country: 'us', label: '米国 / カリフォルニア州 サンフランシスコ', city: 'San Francisco', region: 'CA', timezone: 'America/Los_Angeles', utcOffset: -8, latitude: 37.7749, longitude: -122.4194, keywords: 'san francisco california ca サンフランシスコ' },
  { id: 'us-chicago', country: 'us', label: '米国 / イリノイ州 シカゴ', city: 'Chicago', region: 'IL', timezone: 'America/Chicago', utcOffset: -6, latitude: 41.8781, longitude: -87.6298, keywords: 'chicago illinois il シカゴ' },
  { id: 'us-houston', country: 'us', label: '米国 / テキサス州 ヒューストン', city: 'Houston', region: 'TX', timezone: 'America/Chicago', utcOffset: -6, latitude: 29.7604, longitude: -95.3698, keywords: 'houston texas tx ヒューストン' },
  { id: 'us-seattle', country: 'us', label: '米国 / ワシントン州 シアトル', city: 'Seattle', region: 'WA', timezone: 'America/Los_Angeles', utcOffset: -8, latitude: 47.6062, longitude: -122.3321, keywords: 'seattle washington wa シアトル' },
  { id: 'us-boston', country: 'us', label: '米国 / マサチューセッツ州 ボストン', city: 'Boston', region: 'MA', timezone: 'America/New_York', utcOffset: -5, latitude: 42.3601, longitude: -71.0589, keywords: 'boston massachusetts ma ボストン' },
  { id: 'us-honolulu', country: 'us', label: '米国 / ハワイ州 ホノルル', city: 'Honolulu', region: 'HI', timezone: 'Pacific/Honolulu', utcOffset: -10, latitude: 21.3069, longitude: -157.8583, keywords: 'honolulu hawaii hi ハワイ ホノルル' },
  { id: 'world-london', country: 'world', label: '英国 / ロンドン', city: 'London', region: 'England', timezone: 'Europe/London', utcOffset: 0, latitude: 51.5074, longitude: -0.1278, keywords: 'london uk england ロンドン' },
  { id: 'world-paris', country: 'world', label: 'フランス / パリ', city: 'Paris', region: 'Ile-de-France', timezone: 'Europe/Paris', utcOffset: 1, latitude: 48.8566, longitude: 2.3522, keywords: 'paris france パリ' },
  { id: 'world-sydney', country: 'world', label: 'オーストラリア / シドニー', city: 'Sydney', region: 'NSW', timezone: 'Australia/Sydney', utcOffset: 10, latitude: -33.8688, longitude: 151.2093, keywords: 'sydney australia シドニー' },
  { id: 'world-singapore', country: 'world', label: 'シンガポール / シンガポール', city: 'Singapore', region: 'Singapore', timezone: 'Asia/Singapore', utcOffset: 8, latitude: 1.3521, longitude: 103.8198, keywords: 'singapore シンガポール' },
  { id: 'world-bangkok', country: 'world', label: 'タイ / バンコク', city: 'Bangkok', region: 'Bangkok', timezone: 'Asia/Bangkok', utcOffset: 7, latitude: 13.7563, longitude: 100.5018, keywords: 'bangkok thailand バンコク' },
  { id: 'world-seoul', country: 'world', label: '韓国 / ソウル', city: 'Seoul', region: 'Seoul', timezone: 'Asia/Seoul', utcOffset: 9, latitude: 37.5665, longitude: 126.978, keywords: 'seoul korea ソウル 韓国' },
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

function displayTimezoneLabel(timezone) {
  const labels = {
    'Asia/Tokyo': '日本標準時',
    'Asia/Shanghai': '中国標準時',
    'Asia/Hong_Kong': '香港時間',
    'Asia/Taipei': '台湾時間',
    'America/New_York': '米国東部時間',
    'America/Los_Angeles': '米国太平洋時間',
    'America/Chicago': '米国中部時間',
    'Pacific/Honolulu': 'ハワイ時間',
    'Europe/London': '英国時間',
    'Europe/Paris': '中央ヨーロッパ時間',
    'Australia/Sydney': 'シドニー時間',
    'Asia/Singapore': 'シンガポール時間',
    'Asia/Bangkok': 'バンコク時間',
    'Asia/Seoul': '韓国標準時',
  };
  return labels[timezone] || timezone || '—';
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
  const [activeStep, setActiveStep] = React.useState('profile');
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
    setActiveStep(step);
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => {
      const focusable = target.querySelector('input:not([disabled]), select:not([disabled]), button:not([disabled])');
      if (focusable) focusable.focus({ preventScroll: true });
    }, 420);
  };

  React.useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const targets = RITE_NAV_ITEMS
      .map((item) => [item.key, fieldRefs.current[item.key]])
      .filter((entry) => entry[1]);
    if (!targets.length) return undefined;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const match = targets.find((entry) => entry[1] === visible.target);
      if (match) setActiveStep(match[0]);
    }, {
      rootMargin: '-28% 0px -48% 0px',
      threshold: [0.15, 0.35, 0.6],
    });

    targets.forEach((entry) => observer.observe(entry[1]));
    return () => observer.disconnect();
  }, []);

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
    <section className="rite creation-rite" data-screen-label="02 命式作成">
      <div className="rite-main">
        <div className="rite-intro">
          <h2>命式を作成</h2>
          <p>
            お名前・性別・生年月日・出生時刻・出生地を入力してください。
          </p>
        </div>

        <nav className="rite-stepper" aria-label="作成ステップ">
          {RITE_NAV_ITEMS.map((item) => (
            <TopicButton
              key={item.key}
              {...item}
              active={activeStep === item.key}
              onClick={() => jumpToStep(item.key)}
            />
          ))}
        </nav>

        <FormField num="名" ja="お名前" romaji="任意"
          fieldRef={(node) => { fieldRefs.current.profile = node; }}
          hint="省略可。結果画面での呼び名">
          <div className="input-line">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="例 ）田中 太郎" />
          </div>
        </FormField>

        <FormField num="性" ja="性別" romaji="性別"
          hint="大運の順逆計算に使用">
          <div className="gender-row">
            {[
              { key: 'yang', ja: '男性', sym: '☰' },
              { key: 'yin',  ja: '女性', sym: '☷' },
              { key: 'gen',  ja: '未選択', sym: '○' },
            ].map(g => (
              <button key={g.key} className={`gender-btn ${gender === g.key ? 'on' : ''}`} onClick={() => setGender(g.key)}>
                <span className="glyph">{g.sym}</span>
                <span>{g.ja}</span>
              </button>
            ))}
          </div>
        </FormField>

        <FormField num="日" ja="生年月日" romaji="日付"
          fieldRef={(node) => { fieldRefs.current.birthday = node; }}
          hint="生まれた日付">
          <div className="toggle-row era-row">
            {['seireki','showa','heisei','reiwa'].map(c => (
               <button key={c} className={calendar === c ? 'on' : ''} onClick={() => setCalendar(c)}>
                 {c === 'seireki' ? '西暦' : (c === 'showa' ? '昭和' : (c === 'heisei' ? '平成' : '令和'))}
               </button>
            ))}
          </div>
          <div className="input-row date-row">
            <div className="input-line with-mark" data-mark="年">
              <select value={year} onChange={e => setYear(e.target.value)}>
                <option value="" disabled>--</option>
                {calendar === 'seireki' && Array.from({length: 107}, (_, i) => 2026 - i).map(y => <option key={y} value={y}>{y}</option>)}
                {calendar === 'showa' && Array.from({length: 64}, (_, i) => 64 - i).map(y => <option key={y} value={y}>{y}</option>)}
                {calendar === 'heisei' && Array.from({length: 31}, (_, i) => 31 - i).map(y => <option key={y} value={y}>{y}</option>)}
                {calendar === 'reiwa' && Array.from({length: 8}, (_, i) => 8 - i).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="input-line with-mark" data-mark="月">
              <select value={month} onChange={e => setMonth(e.target.value)}>
                <option value="" disabled>--</option>
                {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="input-line with-mark" data-mark="日">
              <select value={day} onChange={e => setDay(e.target.value)}>
                <option value="" disabled>--</option>
                {Array.from({length: 31}, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </FormField>

        <FormField num="時" ja="出生時刻" romaji="時刻"
          fieldRef={(node) => { fieldRefs.current.birthtime = node; }}
          hint="時刻がわかる場合は入力">
          <div className="toggle-row compact time-mode-row">
            <button className={!unsure ? 'on' : ''} onClick={() => setUnsure(false)}>時刻を入力</button>
            <button className={unsure ? 'on' : ''} onClick={() => setUnsure(true)}>時間不明</button>
          </div>
          <div className={`input-row time-row ${unsure ? 'is-disabled' : ''}`}>
            <div className="input-line with-mark" data-mark="時">
              <select value={birthHour} disabled={unsure} aria-disabled={unsure ? 'true' : 'false'} onChange={e => {
                setUnsure(false);
                setBirthHour(e.target.value);
              }}>
                {Array.from({length: 24}, (_, i) => String(i).padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div className="input-line with-mark" data-mark="分">
              <select value={birthMinute} disabled={unsure} aria-disabled={unsure ? 'true' : 'false'} onChange={e => {
                setUnsure(false);
                setBirthMinute(e.target.value);
              }}>
                {Array.from({length: 60}, (_, i) => String(i).padStart(2, '0')).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </FormField>

        <FormField num="地" ja="出生地" romaji="場所"
          fieldRef={(node) => { fieldRefs.current.birthplace = node; }}
          hint="都道府県・市区町村">
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
                  placeholder={locationRegion === 'cn' ? '例 ）上海 / 広東 / 香港' : locationRegion === 'us' ? '例 ）カリフォルニア / ニューヨーク' : '例 ）ロンドン / ソウル / シンガポール'}
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
            {selectedLocation?.timezone ? ` / ${displayTimezoneLabel(selectedLocation.timezone)}` : ''}
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
      </div>
      <aside className="creation-preview" aria-label="命式プレビュー">
        <div className="creation-preview-card">
          <button type="button" className="preview-link" disabled={!initialResult}>四柱の並び <span>›</span></button>
          <div className="preview-pillars">
            {[
              ['年柱', initialResult?.chart?.pillars?.year?.text || '—'],
              ['月柱', initialResult?.chart?.pillars?.month?.text || '—'],
              ['日柱', initialResult?.chart?.pillars?.day?.text || '—'],
              ['時柱', initialResult?.chart?.pillars?.hour?.text || '—'],
            ].map((item) => (
              <div key={item[0]} className={item[0] === '日柱' ? 'is-day' : ''}>
                <span>{item[0]}</span>
                <strong>{item[1]}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="creation-preview-card">
          <h3>五行バランス</h3>
          {['木', '火', '土', '金', '水'].map((item, index) => (
            <div key={item} className="preview-balance-row">
              <span>{item}</span>
              <i style={{ width: `${[28, 54, 42, 68, 76][index]}%` }}></i>
            </div>
          ))}
        </div>
        <div className="creation-preview-card">
          <h3>日主の強さ</h3>
          <p>{initialResult ? (initialResult.chart?.strength?.label || '確認済み') : '入力後にプレビューを表示します'}</p>
        </div>
      </aside>
      <div className="mobile-command-bar" aria-live="polite">
        <span>{valid ? '入力完了' : '必須項目を入力'}</span>
        <button className={busy ? 'busy' : ''} disabled={!valid || busy} onClick={submit}>
          {busy ? '作成中' : '命式を見る'}
        </button>
      </div>
      <div className={`seal-overlay native-progress-overlay ${showStamp ? 'show' : ''}`} role="status" aria-live="polite">
        <div className="progress-hud">
          <span className="progress-spinner" aria-hidden="true"></span>
          <strong>命式を作成中</strong>
          <small>入力内容をこの端末で計算しています</small>
        </div>
      </div>
    </section>
  );
}

const PILLAR_KEYS = ['year', 'month', 'day', 'hour'];
const PILLAR_LABELS = { year: '年柱', month: '月柱', day: '日柱', hour: '時柱' };
const STEM_ICONS = { '甲': '🌳', '乙': '🌿', '丙': '☀️', '丁': '🕯️', '戊': '⛰️', '己': '🪴', '庚': '⚔️', '辛': '✨', '壬': '🌊', '癸': '💧' };
const BRANCH_READING = { '子': '万物が芽生え始める時期。', '丑': '粘り強さと着実さを表します。', '寅': '勢いと開拓精神を表します。', '卯': '柔軟性と協調性を表します。', '辰': '変化と理想を表します。', '巳': '情熱と華やかさを表します。', '午': '求心力と率直さを表します。', '未': '包容力と安定を表します。', '申': '決断力と合理性を表します。', '酉': '洗練された感性と美意識。', '戌': '誠実さと守りの力。', '亥': '自由と構想力を表します。' };
const BRANCH_RELATIONSHIP_PROFILES = {
  子: '感情や情報の流れが細やかで、言葉にしない気配を読みやすい婚姻運です。',
  丑: '安心できる土台を重視し、時間をかけて信頼を積むほど安定しやすい婚姻運です。',
  寅: '成長意欲が強く、互いに前へ進む刺激を求めやすい婚姻運です。',
  卯: '柔らかな距離感や美意識が大切で、丁寧な配慮が関係を育てる婚姻運です。',
  辰: '現実的な調整力があり、理想と生活基盤のすり合わせがテーマになりやすい婚姻運です。',
  巳: '熱量と感受性が強く、惹きつけ合う一方で言葉の温度管理が大切な婚姻運です。',
  午: '明るさや率直さが出やすく、関係の中で情熱と自己表現が強まる婚姻運です。',
  未: '包容力と育てる力があり、互いの不安を受け止める姿勢が関係を整える婚姻運です。',
  申: '判断力と変化対応が鍵になり、知的な会話や現実的な連携が重要な婚姻運です。',
  酉: '美意識や基準の高さが出やすく、尊重と適度な余白が関係を長持ちさせる婚姻運です。',
  戌: '責任感と守る意識が強く、約束や信頼の扱いが関係の軸になる婚姻運です。',
  亥: '共感や想像力が広がりやすく、自由さと安心感の両方を求める婚姻運です。',
};
const ELEMENT_GENERATES = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const ELEMENT_CONTROLS = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };
const MARRIAGE_ELEMENT_RELATION_READING = {
  same: '日主と同じ五行なので、対等さや自分らしさを保てる関係を求めやすい配置です。',
  supported: '日支が日主を生じる関係なので、支えられる安心感や学び合いが関係の軸になりやすい配置です。',
  output: '日主が日支へ生じる関係なので、表現すること、尽くすこと、相手に向けて力を出すことがテーマになりやすい配置です。',
  wealth: '日主が日支を制する関係なので、現実的な責任、生活管理、相手との具体的な関わり方がテーマになりやすい配置です。',
  pressure: '日支が日主を制する関係なので、関係の中で責任感や緊張感が生まれやすく、約束や境界線を整えることが大切です。',
};
const ELEMENT_RELATION_READING = {
  same: '日主と同じ五行なので、自分らしさや同じ目線で進む力として出やすい関係です。',
  supported: 'その五行が日主を生じる関係なので、支え・学び・安心材料として働きやすい関係です。',
  output: '日主がその五行を生じる関係なので、表現、創作、育てる力、外へ出す力として働きやすい関係です。',
  wealth: '日主がその五行を制する関係なので、現実的な管理、責任、成果づくりとして扱いやすい関係です。',
  pressure: 'その五行が日主を制する関係なので、役割、緊張感、約束、規律として意識されやすい関係です。',
};
const PILLAR_READING = {
  year: { icon: '根', title: '年柱はルーツと外側の環境', text: '家族、育った環境、社会から見えやすい雰囲気を見ます。' },
  month: { icon: '場', title: '月柱は社会性と仕事の土台', text: '季節の力が強く出る柱で、仕事や役割、社会での使い方を見ます。' },
  day: { icon: '我', title: '日柱は本人と大切な関係', text: '日主を含む中心の柱です。本人の核と、近い関係性の傾向を見ます。' },
  hour: { icon: '芽', title: '時柱は未来と内側の可能性', text: '内面、晩年、これから育つテーマを見ます。' },
};
const PILLAR_POSITION_READING = {
  year: {
    keyword: '根',
    title: 'ルーツ・外部環境',
    focus: '外から見える印象',
    relation: '家族・父母・育った環境',
    period: '幼少期・祖先から受け継ぐ土台',
    detail: '年柱は、その人が生まれ育った背景や、外側から見られやすい雰囲気を表します。本人の内面そのものというより、家系、親族、幼少期の環境、社会から最初に受ける印象を読む位置です。',
  },
  month: {
    keyword: '場',
    title: '社会性・仕事の土台',
    focus: '社会で使う力',
    relation: '仕事・上司・同僚・社会との関係',
    period: '青年期から社会へ出る時期',
    detail: '月柱は、社会の中でどう力を使うかを見る柱です。仕事環境、役割、才能の出し方、社会的な評価に関わりやすく、命式全体の季節感や格局を見るうえでも重要な位置です。',
  },
  day: {
    keyword: '我',
    title: '本人・婚姻関係',
    focus: '日主本人の核',
    relation: '自分自身・配偶者・近い関係',
    period: '成年期・結婚後の生活領域',
    detail: '日柱は日主を含む中心の柱で、本人の核となる性質を読みます。日支は婚姻宮として、配偶者や近い関係性、安心できる距離感、生活の中で出やすい関係パターンを見る位置です。',
  },
  hour: {
    keyword: '芽',
    title: '未来・子女関係',
    focus: '内面とこれから育つテーマ',
    relation: '子ども・後輩・晩年の人間関係',
    period: '中年以降・晩年・未来の可能性',
    detail: '時柱は、内側に残る可能性や、これから育つテーマを見ます。子女、後輩、晩年の過ごし方、未来に向けて伸びていく力を読む位置で、表にすぐ出る性格よりも後から育つ芽として扱います。',
  },
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
const TEN_GOD_LIFE_TASKS = {
  比肩: '人生課題は、自分の軸を持ちながら周囲と対等に協力することです。頑固さに偏らず、自立心を信頼へ変えるほど力が安定します。',
  劫财: '人生課題は、競争心や突破力を人を巻き込む力として使うことです。勝ち負けだけに偏らず、仲間と利益を分ける意識が鍵になります。',
  食神: '人生課題は、感じたことや才能を楽しく表現し、続けて形にすることです。楽しさ・余裕・育てる力を仕事や人間関係に活かすほど、魅力と成果が育ちます。',
  伤官: '人生課題は、鋭い感性や批評眼を壊す力ではなく、改善と創造の力に変えることです。言葉の強さを整えるほど才能が伝わりやすくなります。',
  傷官: '人生課題は、鋭い感性や批評眼を壊す力ではなく、改善と創造の力に変えることです。言葉の強さを整えるほど才能が伝わりやすくなります。',
  偏财: '人生課題は、人脈や機会の広がりを現実の成果につなげることです。広く動く力に優れるぶん、選ぶ基準と継続性を持つと運がまとまります。',
  偏財: '人生課題は、人脈や機会の広がりを現実の成果につなげることです。広く動く力に優れるぶん、選ぶ基準と継続性を持つと運がまとまります。',
  正财: '人生課題は、安定した管理力を自分の価値づくりへつなげることです。堅実さを守りに閉じず、信頼される成果として積み上げるほど強みになります。',
  正財: '人生課題は、安定した管理力を自分の価値づくりへつなげることです。堅実さを守りに閉じず、信頼される成果として積み上げるほど強みになります。',
  七杀: '人生課題は、緊張感や決断力を責任ある行動へ変えることです。プレッシャーの中で急ぎすぎず、規律を持つほど大きな役割を担いやすくなります。',
  七殺: '人生課題は、緊張感や決断力を責任ある行動へ変えることです。プレッシャーの中で急ぎすぎず、規律を持つほど大きな役割を担いやすくなります。',
  偏官: '人生課題は、緊張感や決断力を責任ある行動へ変えることです。プレッシャーの中で急ぎすぎず、規律を持つほど大きな役割を担いやすくなります。',
  正官: '人生課題は、責任感や規律を自分らしい信頼に変えることです。正しさだけで背負いすぎず、役割を整えて周囲と協働するほど評価されます。',
  偏印: '人生課題は、独自の直感や視点を現実に使える形へ翻訳することです。ひらめきを散らさず、学びや表現に落とし込むほど個性が武器になります。',
  正印: '人生課題は、学びや保護される力を自立した知恵へ育てることです。安心できる環境で吸収したものを、人の役に立つ形にするほど運が伸びます。',
  印綬: '人生課題は、学びや保護される力を自立した知恵へ育てることです。安心できる環境で吸収したものを、人の役に立つ形にするほど運が伸びます。',
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
function tenGodReading(name) {
  const label = displayTenGod(name);
  return TEN_GOD_READING[name]
    || TEN_GOD_READING[label]
    || TEN_GOD_READING[Object.keys(TEN_GOD_READING).find((key) => displayTenGod(key) === label)]
    || null;
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

function tenGodCompositionInsight(gods) {
  if (!gods.length) {
    return {
      title: '十神の偏りは控えめです',
      main: 'この命盤では、特定の十神だけが強く重なるというより、複数の役割を状況に応じて使い分ける読みになります。',
      source: '天干と蔵干の分布を合わせて、外に見えやすい役割と内側に残りやすい役割を分けて確認します。',
      balance: 'この場合は、ひとつの性質で断定せず、命式の型・身強身弱・五行バランスと合わせて読みます。',
    };
  }
  const [primary, secondary] = gods;
  const primaryLabel = displayTenGod(primary.name);
  const secondaryLabel = secondary ? displayTenGod(secondary.name) : '';
  const reading = tenGodReading(primary.name);
  const topLabels = gods.slice(0, 3).map((god) => displayTenGod(god.name));
  const groupText = [
    topLabels.some((name) => ['比肩', '劫財'].includes(name)) ? '自分軸・競争心' : '',
    topLabels.some((name) => ['食神', '傷官'].includes(name)) ? '表現力・感性' : '',
    topLabels.some((name) => ['正財', '偏財'].includes(name)) ? '現実成果・人との機会' : '',
    topLabels.some((name) => ['正官', '偏官'].includes(name)) ? '責任感・判断力' : '',
    topLabels.some((name) => ['印綬', '偏印'].includes(name)) ? '学び・直感・保護' : '',
  ].filter(Boolean).join('、');
  const sourceText = primary.heavenly > primary.hidden
    ? `「${primaryLabel}」は天干側に出やすいため、周囲から見える行動や第一印象に表れやすい配置です。`
    : primary.hidden > primary.heavenly
      ? `「${primaryLabel}」は蔵干側に多いため、表面の印象よりも内側の動機・背景・無意識の反応として働きやすい配置です。`
      : `「${primaryLabel}」は天干と蔵干の両方に見えるため、外に出る行動と内側の動機がつながりやすい配置です。`;
  const secondaryText = secondary
    ? `次に「${secondaryLabel}」も重なるので、${primaryLabel}だけでなく${secondaryLabel}のテーマも一緒に出やすくなります。`
    : 'ひとつの十神だけで断定せず、他の柱や五行バランスと合わせて読みます。';
  return {
    title: `中心テーマは「${primaryLabel}」です`,
    main: reading
      ? `この命盤でいちばん重なる十神は「${primaryLabel}」です。${reading.text}`
      : `この命盤でいちばん重なる十神は「${primaryLabel}」です。この星を中心に、行動パターンや人生課題を読みます。`,
    source: sourceText,
    balance: groupText
      ? `上位の十神をまとめると、${groupText} が出やすい構成です。${secondaryText}`
      : secondaryText,
  };
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

function marriageElementRelationKey(dayElement, palaceElement) {
  if (dayElement === palaceElement) return 'same';
  if (ELEMENT_GENERATES[palaceElement] === dayElement) return 'supported';
  if (ELEMENT_GENERATES[dayElement] === palaceElement) return 'output';
  if (ELEMENT_CONTROLS[dayElement] === palaceElement) return 'wealth';
  if (ELEMENT_CONTROLS[palaceElement] === dayElement) return 'pressure';
  return 'same';
}

function marriageFortuneSummary(calc) {
  const dayPillar = calc.pillars.day;
  const dayElement = dayPillar.element.stem;
  const palaceElement = dayPillar.element.branch;
  const relationKey = marriageElementRelationKey(dayElement, palaceElement);
  const branchProfile = BRANCH_RELATIONSHIP_PROFILES[dayPillar.branch] || '日支は親密な関係で出やすい距離感や生活感を読む入口です。';
  const relation = MARRIAGE_ELEMENT_RELATION_READING[relationKey];
  return `婚姻運は、日柱の地支である「日支」を婚姻宮として見ます。この命盤の日支は ${dayPillar.branch}（${palaceElement}）です。${branchProfile} 日主 ${calc.dayMaster}（${dayElement}）に対して日支がどう働くかを見ると、${relation}`;
}

function careerFortuneSummary(calc, patternName, strengthStatus, god) {
  const monthPillar = calc.pillars.month;
  const mainRole = god ? displayTenGod(god) : '通変星';
  const strengthText = calc.strength?.status === '身強'
    ? '自分で主導権を握り、判断や責任を引き受けるほど仕事運が動きやすいタイプです。'
    : calc.strength?.status === '身弱'
      ? '組織や専門環境の中で支えを受けながら、得意分野を磨くほど仕事運が安定しやすいタイプです。'
      : '身強弱と五行バランスを重ねて、仕事で力を出しやすい環境を見ます。';
  return `仕事運は、社会性を表す月柱と命式全体の型、身強弱、目立つ通変星を合わせて見ます。この命盤では月柱が ${monthPillar.text}、命式の型は「${patternName}」、身強弱は ${strengthStatus} です。仕事で表に出やすい役割は「${mainRole}」のテーマです。${strengthText}`;
}

function wealthFortuneSummary(calc) {
  const stats = tenGodStats(calc);
  const wealthStars = stats.filter(item => ['正财', '正財', '偏财', '偏財'].includes(item.name) || ['正財', '偏財'].includes(displayTenGod(item.name)));
  const wealthLabel = wealthStars.length
    ? wealthStars.map(item => displayTenGod(item.name)).filter(Boolean).join('・')
    : '財星は控えめ';
  const dominantLabel = strongestElements(calc).filter(Boolean).join('・') || '五行';
  const supportLabel = supportElements(calc).filter(Boolean).join('・') || '調整五行';
  const starText = wealthStars.length
    ? `命盤の中に ${wealthLabel} が見えるため、お金は人との機会、管理力、現実的な成果づくりと結びつきやすいタイプです。`
    : '財星が強く前面に出ない場合、金運は一攫千金よりも、仕事の型・信用・五行バランスを整えることで育てる読みになります。';
  return `金運は、財星（正財・偏財）だけでなく、仕事運、五行バランス、用神を合わせて見ます。${starText} 五行では ${dominantLabel} が出やすく、${supportLabel} を補うほどお金の流れも整えやすくなります。`;
}

function relationshipFortuneSummary(calc, god) {
  const mainRole = god ? displayTenGod(god) : '通変星';
  const dayBranch = calc.pillars.day.branch;
  const branchProfile = BRANCH_RELATIONSHIP_PROFILES[dayBranch] || '日支は親密な関係や近い相手との距離感を読む入口です。';
  const roleText = god && TEN_GOD_READING[god]?.text
    ? `目立つ通変星「${mainRole}」は、対人関係では ${TEN_GOD_READING[god].text}`
    : `目立つ通変星「${mainRole}」から、対人関係で出やすい役割や振る舞いを見ます。`;
  return `対人運は、命盤で目立つ通変星と、近い関係を表す日支を合わせて見ます。${roleText} 日支は ${dayBranch} で、${branchProfile}`;
}

function healthFortuneSummary(calc) {
  const dominantLabel = strongestElements(calc).filter(Boolean).join('・') || '五行';
  const supportLabel = supportElements(calc).filter(Boolean).join('・') || '調整五行';
  const balance = Number.isFinite(calc.fiveElements?.balanceScore) ? Math.round(calc.fiveElements.balanceScore) : null;
  const balanceText = balance === null
    ? '五行の偏りから、生活リズムを整える方向を見ます。'
    : balance >= 75
      ? `五行バランスは比較的まとまりやすい状態です（平衡 ${balance}）。`
      : balance >= 55
        ? `五行に少し偏りがあります（平衡 ${balance}）。強い五行を使いすぎず、弱い五行を補う意識が大切です。`
        : `五行の偏りがはっきり出やすい状態です（平衡 ${balance}）。生活の中で補う五行を意識すると整えやすくなります。`;
  return `健康運は病気の診断ではなく、体調管理・生活リズムの傾向として見ます。命盤では ${dominantLabel} が出やすく、${supportLabel} を補うことがバランスの鍵です。${balanceText}`;
}

function decadeFlowSummary(calc, current) {
  const luck = calc.luckCycles || {};
  const items = luck.decadeFortunes?.items || [];
  if (!current) return '性別を選ぶと大運の流れを定位できます。十年ごとの大運から、人生のどの時期に外へ動きやすいか、整える時期か、責任が増える時期かを見ます。';
  const guide = fortuneGuideForGod(current.pillar?.heavenlyTenGod);
  const currentGod = displayTenGod(current.pillar?.heavenlyTenGod);
  const currentAge = `${current.startAge}-${current.endAge}歳`;
  const enriched = items.map(item => enrichDecadeFortune(item, current));
  const peak = enriched.reduce((best, item) => (!best || item.score > best.score ? item : best), null);
  const firstHalf = enriched.slice(0, Math.ceil(enriched.length / 2));
  const secondHalf = enriched.slice(Math.ceil(enriched.length / 2));
  const avg = list => list.length ? list.reduce((sum, item) => sum + item.score, 0) / list.length : 0;
  const lifeTone = avg(secondHalf) >= avg(firstHalf) + 3
    ? '人生後半にかけて運の使い方が育ちやすい流れです。'
    : avg(firstHalf) >= avg(secondHalf) + 3
      ? '早い時期から動きが出やすく、若い時期の経験が後半の土台になります。'
      : '大きく一方向に偏るより、十年ごとのテーマを切り替えながら進む流れです。';
  const peakText = peak ? `全体の中では ${peak.startAge}-${peak.endAge}歳の ${peak.name} が比較的外へ動きやすい節目です。` : '';
  return `現在は ${current.name}（${current.startYear}-${current.endYear}年 / ${currentAge}）の十年大運です。この大運では「${currentGod}」の働きが前に出やすく、テーマは「${guide.rhythm}」。${guide.advice} 人生全体の大運を見ると、${lifeTone}${peakText}`;
}

function buildUserReadingTags(calc, tenGods) {
  const stem = STEM_READING[calc.dayMaster] || { text: '', tags: [] };
  const dominant = strongestElements(calc);
  const support = supportElements(calc);
  const current = currentDecadeFortune(calc.luckCycles?.decadeFortunes, calc.luckCycles?.target?.year || new Date().getFullYear());
  const god = tenGods[0]?.[0];
  const patternName = displayPatternName(calc.pattern);
  const strengthStatus = calc.strength?.status || '身強弱未判定';
  const dominantLabel = dominant.filter(Boolean).join('・') || '五行';
  const supportLabel = support.filter(Boolean).join('・') || '調整五行';
  const yongLabel = [calc.yongShen?.primary, calc.yongShen?.secondary].filter(Boolean).join('・') || supportLabel;
  return [
    {
      kind: 'core',
      label: '日主タイプ',
      value: `${calc.dayMaster}（${calc.pillars.day.element.stem}）`,
      icon: STEM_ICONS[calc.dayMaster] || '主',
      detail: `この命盤の人物タイプは、日柱の天干「日主」から見ます。日主は ${calc.dayMaster}（${calc.pillars.day.element.stem}）で、${stem.title || 'その人の本質を表すタイプ'}。${stem.text || '命式全体を読む起点になります。'}`,
      evidence: `日柱天干 ${calc.dayMaster} / 五行 ${calc.pillars.day.element.stem}`,
      action: 'daymaster',
      target: { page: 'insight', topic: 'core', anchor: 'insight-topic-main' },
    },
    {
      kind: 'pattern',
      label: '命式の型と特質',
      value: `${patternName} / ${strengthStatus}`,
      detail: `人生全体の命式の型は「${patternName}」を中心に見ます。身強弱は ${strengthStatus}。${displayPatternText(calc.pattern, '月令と天干から命式の大枠を見ます。')} ${calc.strength?.text || '日主の勢いも合わせて、どんな環境で力を出しやすいかを読みます。'}`,
      evidence: `月令・天干 / 日主 ${calc.dayMaster} / 月支 ${calc.pillars.month.branch}`,
      action: 'insight',
      target: { page: 'insight', topic: 'pattern', anchor: 'insight-topic-main' },
    },
    {
      kind: 'element',
      label: '五行特質',
      value: `${dominantLabel} 強め / ${supportLabel} 補い`,
      detail: `五行の状態は、性格の出方と調整ポイントをまとめて見ます。この命盤では ${dominantLabel} が前に出やすく、${supportLabel} を意識して補うとバランスが整いやすい構成です。用神・調候の候補は ${yongLabel} です。`,
      evidence: '天干・地支・蔵干・月令補正 / 調候・用神',
      action: 'elements',
      target: { page: 'insight', topic: 'element', anchor: 'insight-topic-main' },
    },
    {
      kind: 'god',
      label: '人生課題',
      value: god ? `${displayTenGod(god)}の課題` : '通変星の課題',
      detail: god ? `人生課題は、命盤の中で重なりやすい通変星から見ます。この命盤で目立つ通変星は「${displayTenGod(god)}」です。${TEN_GOD_LIFE_TASKS[god] || TEN_GOD_LIFE_TASKS[displayTenGod(god)] || TEN_GOD_READING[god]?.text || '行動の癖や課題として表れやすいテーマです。'}` : '人生課題は、命盤で重なる通変星から見ます。どんな行動パターンが強く出やすく、それをどう成長課題に変えるかを読む項目です。',
      evidence: god ? `四柱の天干・蔵干に出る通変星 / 出現 ${tenGods[0]?.[1] || 0}` : '通変星',
      action: 'insight',
      target: { page: 'insight', topic: 'lifeTask', anchor: 'insight-topic-main' },
    },
    {
      kind: 'source',
      label: '婚姻運',
      value: `日支 ${calc.pillars.day.branch}`,
      detail: marriageFortuneSummary(calc),
      evidence: `日柱 ${calc.pillars.day.text} / 日支 ${calc.pillars.day.branch} / 日主 ${calc.dayMaster}`,
      action: 'marriage',
      target: { page: 'insight', topic: 'marriage', anchor: 'insight-topic-main' },
    },
    {
      kind: 'career',
      label: '仕事運',
      value: `${patternName} / ${displayTenGod(god) || '通変星'}`,
      detail: careerFortuneSummary(calc, patternName, strengthStatus, god),
      evidence: `月柱 ${calc.pillars.month.text} / 命式の型 / 身強弱 / 通変星`,
      action: 'career',
      target: { page: 'insight', topic: 'career', anchor: 'insight-topic-main' },
    },
    {
      kind: 'money',
      label: '金運',
      value: tenGodStats(calc).some(item => ['正財', '偏財'].includes(displayTenGod(item.name))) ? '財星あり' : '育てる金運',
      detail: wealthFortuneSummary(calc),
      evidence: '正財・偏財 / 五行バランス / 用神',
      action: 'career',
      target: { page: 'insight', topic: 'money', anchor: 'insight-topic-main' },
    },
    {
      kind: 'relationship',
      label: '対人運',
      value: god ? `${displayTenGod(god)}の出方` : '人間関係',
      detail: relationshipFortuneSummary(calc, god),
      evidence: `通変星 / 日支 ${calc.pillars.day.branch}`,
      action: 'relationship',
      target: { page: 'insight', topic: 'relationship', anchor: 'insight-topic-main' },
    },
    {
      kind: 'health',
      label: '健康運',
      value: `${supportLabel} ケア`,
      detail: healthFortuneSummary(calc),
      evidence: '五行バランス / 補う五行 / 用神',
      action: 'health',
      target: { page: 'insight', topic: 'health', anchor: 'insight-topic-main' },
    },
    {
      kind: 'trend',
      label: '運勢の流れ',
      value: current ? `${current.name} / ${fortuneTrendTag(calc)}` : fortuneTrendTag(calc),
      detail: decadeFlowSummary(calc, current),
      evidence: current ? `現在の十年大運 ${current.name} / ${current.startAge}-${current.endAge}歳 / ${current.startYear}-${current.endYear}年` : '大運未判定',
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

const USER_TAG_ICONS = {
  pattern: '型',
  strength: '強',
  core: '主',
  element: '五',
  support: '補',
  warning: '缺',
  god: '神',
  source: '縁',
  career: '仕',
  money: '財',
  relationship: '人',
  health: '健',
  trend: '運',
};

function userTagIcon(tag) {
  return tag?.icon || USER_TAG_ICONS[tag?.kind] || '要';
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
      <div className="summary-kicker">命盤要点解読</div>
      <h2>重要な読みをタグで確認</h2>
      <p>気になる要点を押すと、このページ下部の概要説明へ移動します。さらに詳しく読む場合は、各説明カードの「詳細説明」から深い鑑定へ進めます。</p>
      <div className="user-tag-row">
        {tags.map((tag, index) => (
          <button
            key={`${tag.label}-${tag.value}`}
            className={`user-tag tag-${tag.kind} ${activeTagIndex === index ? 'is-active' : ''}`}
            onClick={() => focusTagDetail(index)}
          >
            <span className="user-tag-mini-icon" aria-hidden="true">{userTagIcon(tag)}</span>
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
            <div className={`user-tag-detail-icon tag-${tag.kind}`} aria-hidden="true">{userTagIcon(tag)}</div>
            <div className="user-tag-detail-body">
              <div className="user-tag-detail-head">
              <span className={`user-tag tag-${tag.kind}`}>
                <small>{tag.label}</small>
                <strong>{tag.value}</strong>
              </span>
              </div>
              <p>{tag.detail}</p>
              <em>{tag.evidence}</em>
            </div>
            <button className="user-tag-detail-action" onClick={() => onNavigate(tag)}>詳細説明</button>
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
          <h3>八字要素表</h3>
        </div>
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

function pillarSpecificReading(key, pillar, calculation, profile) {
  const stemElement = pillar.element?.stem || '五行';
  const branchElement = pillar.element?.branch || '五行';
  const dayStem = calculation.dayMaster;
  const dayElement = calculation.pillars.day.element?.stem || stemElement;
  const branchText = BRANCH_READING[pillar.branch] || '地支の性質がその柱の背景として出ます。';
  const stemReading = STEM_READING[pillar.stem] || { title: `${pillar.stem}の性質`, text: '天干の性質が表に出ます。' };
  const stemRelation = ELEMENT_RELATION_READING[marriageElementRelationKey(dayElement, stemElement)] || '';
  const branchRelation = ELEMENT_RELATION_READING[marriageElementRelationKey(dayElement, branchElement)] || '';
  const hiddenMain = pillar.hiddenStemDetails?.[0];
  const hiddenText = hiddenMain
    ? `内側には ${hiddenMain.stem}${hiddenMain.element}（${displayTenGod(hiddenMain.tenGod)}）の気配が入りやすい配置です。`
    : '内側の気配は蔵干を合わせて確認します。';
  if (key === 'year') {
    return `この命盤の${PILLAR_LABELS[key]}は ${pillar.text} です。年干の ${pillar.stem}${stemElement} は、家系や幼少期に外へ見えやすい雰囲気として出ます。${stemReading.title}。${stemReading.text} 日主 ${dayStem}${dayElement} に対して ${pillar.stem}${stemElement} は、${stemRelation} 年支の ${pillar.branch}${branchElement} は、育った環境や親族から受け取る空気の土台です。${branchText} 日主 ${dayStem}${dayElement} に対して ${pillar.branch}${branchElement} は、${branchRelation} つまり ${pillar.text} は、外側に見える「${pillar.stem}」の気配と、幼少期・家族環境の「${pillar.branch}」が重なる柱です。${hiddenText}`;
  }
  if (key === 'month') {
    return `この命盤の${PILLAR_LABELS[key]}は ${pillar.text} です。月干の ${pillar.stem}${stemElement} は、社会で表に出る役割や仕事上の見え方として出ます。${stemReading.title}。${stemReading.text} 日主 ${dayStem}${dayElement} に対して ${pillar.stem}${stemElement} は、${stemRelation} 月支の ${pillar.branch}${branchElement} は、仕事環境、上司・同僚、社会評価の土台です。${branchText} 日主 ${dayStem}${dayElement} に対して ${pillar.branch}${branchElement} は、${branchRelation} つまり ${pillar.text} は、「${pillar.stem}」の社会的な表れ方と、「${pillar.branch}」の仕事環境・青年期の場が重なる柱です。${hiddenText}`;
  }
  if (key === 'day') {
    const relationKey = marriageElementRelationKey(stemElement, branchElement);
    const relation = MARRIAGE_ELEMENT_RELATION_READING[relationKey] || '';
    const branchProfile = BRANCH_RELATIONSHIP_PROFILES[pillar.branch] || branchText;
    return `この命盤の${PILLAR_LABELS[key]}は ${pillar.text} です。日主は ${pillar.stem}${stemElement} で、${stemReading.title}。${stemReading.text} 日支は ${pillar.branch}${branchElement} で、ここを婚姻宮として見ます。つまり ${pillar.text} は、「${pillar.stem}」の本人像と、「${pillar.branch}」の親密関係・生活感が重なる柱です。${branchProfile} 日主 ${pillar.stem}${stemElement} に対して日支 ${pillar.branch}${branchElement} がどう働くかを見ると、${relation} ${hiddenText}`;
  }
  if (key === 'hour') {
    const genderNote = profile?.gender === 'yang'
      ? '男性命の子女縁は時柱だけで断定せず、官殺や大運も重ねますが、時柱は子ども・後輩・晩年の関わりを見る入口になります。'
      : '子女縁は時柱だけで断定せず、命式全体や大運も重ねて見ます。';
    return `この命盤の${PILLAR_LABELS[key]}は ${pillar.text} です。時干の ${pillar.stem}${stemElement} は、未来に外へ出ていく表現や才能の芽を表します。日主 ${dayStem}${dayElement} に対して ${pillar.stem}${stemElement} は、${stemRelation} 時支の ${pillar.branch}${branchElement} は、晩年・子ども・後輩との関係の土台です。${branchText} 日主 ${dayStem}${dayElement} に対して ${pillar.branch}${branchElement} は、${branchRelation} つまり ${pillar.text} は、「${pillar.stem}」の表現力と「${pillar.branch}」の内側の支えが、未来・晩年・子女関係に重なる柱です。${genderNote} ${hiddenText}`;
  }
  return `この命盤の${PILLAR_LABELS[key]}は ${pillar.text} です。天干は ${pillar.stem}${stemElement}、地支は ${pillar.branch}${branchElement} で読みます。${branchText} ${hiddenText}`;
}

function pillarOverallInsight(calculation) {
  const year = calculation.pillars.year;
  const month = calculation.pillars.month;
  const day = calculation.pillars.day;
  const hour = calculation.pillars.hour;
  return {
    title: `${year.text} → ${month.text} → ${day.text} → ${hour.text} の流れ`,
    p1: 'この四柱は、年柱で家系・幼少期の土台を見て、月柱で社会に出る場を見て、日柱で本人と親密関係を見て、時柱で未来・晩年・子女後輩との関係を見ます。',
    p2: `この命盤では、日主 ${calculation.dayMaster}${day.element?.stem || ''} を中心に、年柱 ${year.text}、月柱 ${month.text}、日柱 ${day.text}、時柱 ${hour.text} がそれぞれ別の人生領域を担当します。ひとつの柱だけで断定せず、どの柱に出た性質なのかを分けることで、家庭・社会・本人・未来のどこにそのテーマが出やすいかを読みます。`,
  };
}

function PillarMeaningSection({ calculation, profile }) {
  const pillarInsight = pillarOverallInsight(calculation);
  return (
    <section id="insight-pillars-meaning" className="backend-panel insight-pillars-meaning">
      <div className="backend-panel-head">
        <div>
          <div className="summary-kicker">四柱の意味 / 読み取り位置</div>
          <h3>四柱が表す関係・時間・人生領域</h3>
        </div>
        <span>四柱の位置</span>
      </div>
      <div className="pillar-position-overview" aria-label="四柱のキーワード">
        {PILLAR_KEYS.map(key => {
          const p = calculation.pillars[key];
          const guide = PILLAR_POSITION_READING[key];
          return (
            <article key={`${key}-overview`} className={key === 'day' ? 'is-primary' : ''}>
              <span>{PILLAR_LABELS[key]}</span>
              <strong>{guide.keyword}</strong>
              <em>{guide.title}</em>
              <small>{guide.relation}</small>
              <small>{guide.period}</small>
              <b>{p.text}</b>
            </article>
          );
        })}
      </div>
      <div className="backend-card-grid pillar-position-list">
        {PILLAR_KEYS.map(key => {
          const p = calculation.pillars[key];
          const guide = PILLAR_POSITION_READING[key];
          const hiddenText = (p.hiddenStemDetails || []).map(detail => `${detail.stem}${detail.element}（${displayTenGod(detail.tenGod)}）`).join('、') || '—';
          return (
            <article key={key} className={key === 'day' ? 'is-primary' : ''}>
              <small>{PILLAR_LABELS[key]} / {guide.keyword} / {guide.title}</small>
              <strong><span className={elementClass(p.element.stem)}>{p.stem}</span><span className={elementClass(p.element.branch)}>{p.branch}</span></strong>
              <p>{guide.detail}</p>
              {key === 'day' && <DayBranchRelationVisual calculation={calculation} />}
              <DetailDisclosure title={`${PILLAR_LABELS[key]}の詳しい読み`}>
                <p className="pillar-specific-copy">{pillarSpecificReading(key, p, calculation, profile)}</p>
              </DetailDisclosure>
              <em>見る対象: {guide.focus}</em>
              <em>関係: {guide.relation}</em>
              <em>時間帯: {guide.period}</em>
              <em>蔵干: {hiddenText}</em>
              <em>地勢 {p.terrainByDay || '—'} / 自坐 {p.terrainSelf || '—'}</em>
              {key === 'day' && <b>日支 {p.branch} は婚姻宮として詳解します</b>}
            </article>
          );
        })}
      </div>
      <div className="pillar-overall-meaning">
        <span>四柱全体の読み方</span>
        <strong>{pillarInsight.title}</strong>
        <p>{pillarInsight.p1}</p>
        <p>{pillarInsight.p2}</p>
      </div>
    </section>
  );
}

function BackendDetailSync({ calculation }) {
  const gods = tenGodStats(calculation);
  const maxGodTotal = Math.max(1, ...gods.map(god => god.total || 0));
  const tenGodInsight = tenGodCompositionInsight(gods);
  const yong = [calculation.yongShen?.primary, calculation.yongShen?.secondary].filter(Boolean).join('・') || '—';
  return (
    <div className="backend-sync-stack">
      <section id="insight-judgement" className="backend-panel">
        <div className="backend-panel-head">
          <div>
            <div className="summary-kicker">命式の型 / 身強身弱 / 用神</div>
            <h3>命式全体の判定を読みやすく整理する</h3>
          </div>
          <span>主要判定</span>
        </div>
        <div className="judgement-topic-list">
          <article>
            <div className="judgement-topic-key"><span>壹</span><small>命式の型</small><em>命盤の大枠</em></div>
            <div className="judgement-topic-copy">
              <b>判定</b>
              <strong>{displayPatternName(calculation.pattern)}</strong>
              <p>{displayPatternText(calculation.pattern)}</p>
            </div>
          </article>
          <article>
            <div className="judgement-topic-key"><span>貳</span><small>身強身弱</small><em>日主の勢い</em></div>
            <div className="judgement-topic-copy">
              <b>判定</b>
              <strong>{calculation.strength?.status || '—'}</strong>
              <p>{calculation.strength?.text || '日主の勢いを見ます。'}</p>
            </div>
          </article>
          <article>
            <div className="judgement-topic-key"><span>參</span><small>用神</small><em>整える五行</em></div>
            <div className="judgement-topic-copy">
              <b>候補</b>
              <strong>{yong}</strong>
              <p>{calculation.yongShen?.text || '命式を整える五行を見ます。'}</p>
            </div>
          </article>
        </div>
      </section>

      <section id="insight-ten-gods" className="backend-panel">
        <div className="backend-panel-head">
          <div>
            <div className="summary-kicker">十神構成</div>
            <h3>通変星がどこに出ているかを見る</h3>
          </div>
          <span>天干 / 蔵干</span>
        </div>
        <p className="backend-copy">五行の構成は前のテーマで確認済みなので、ここでは偏官・傷官などの十神だけを集計します。同じ十神でも、天干に出ているものは表に出やすい役割、蔵干にあるものは内側や背景に残りやすい役割として分けて読みます。</p>
        <div className="theme-analysis-list">
          <article className="is-role">
            <div className="theme-analysis-rows">
              {gods.slice(0, 8).map(god => (
                <div key={god.name} className="theme-analysis-row ten-god-row">
                  <b>{displayTenGod(god.name)}</b>
                  <div className="theme-analysis-meter"><i style={{ width: `${Math.max(8, Math.round(((god.total || 0) / maxGodTotal) * 100))}%` }} /></div>
                  <span>×{god.total}</span>
                  <div className="ten-god-source-split">
                    <em>天干 <strong>{god.heavenly}</strong></em>
                    <em>蔵干 <strong>{god.hidden}</strong></em>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
        <div className="ten-god-interpretation">
          <div>
            <span>この構成の読み方</span>
            <strong>{tenGodInsight.title}</strong>
          </div>
          <p>{tenGodInsight.main}</p>
          <p>{tenGodInsight.source}</p>
          <p>{tenGodInsight.balance}</p>
        </div>
      </section>

    </div>
  );
}

function ElementBasisPanel({ calculation }) {
  const seasonal = seasonalElementState(calculation);
  const percentages = elementPercentages(calculation);
  const basis = calculation.fiveElements?.basis || {};
  const dominant = strongestElements(calculation).filter(Boolean).join('・') || '五行';
  const support = supportElements(calculation).filter(Boolean).join('・') || '調整五行';
  const balance = Number.isFinite(calculation.fiveElements?.balanceScore) ? Math.round(calculation.fiveElements.balanceScore) : null;
  const yong = [calculation.yongShen?.primary, calculation.yongShen?.secondary].filter(Boolean).join('・') || '—';
  const balanceText = balance === null
    ? '平衡値は、五行の偏りを読むための目安です。数値だけで吉凶を断定せず、月令の旺衰や身強弱と合わせて読みます。'
    : balance >= 75
      ? `平衡 ${balance} は比較的まとまりのある状態です。ただし強い五行と補う五行の差は残るため、出やすい性質と整える方向を分けて確認します。`
      : balance >= 55
        ? `平衡 ${balance} は中程度のまとまりです。偏りは弱点ではなく、どの性質を活かし、どの性質を補うかを見る材料になります。`
        : `平衡 ${balance} は偏りが出やすい状態です。強く出る五行を活かしつつ、不足しやすい五行を生活・環境・判断の中で補う読みになります。`;
  return (
    <div id="insight-element-basis" className="element-basis-block">
      <div className="element-basis-head">
        <div>
          <div className="summary-kicker">五行計算の根拠</div>
          <h3>構成比と旺相休囚死</h3>
        </div>
        <span>平衡 {calculation.fiveElements?.balanceScore ?? '—'}</span>
      </div>
      <p className="backend-copy">五行の構成比は、四柱の天干と地支の蔵干を重みづけして算出しています。月支 {basis.monthBranch || calculation.pillars.month.branch} の季節による旺衰は、構成比とは分けて身強弱の参考にします。</p>
      <div className="element-basis-list">
        {ELEMENT_LABELS.map(el => (
          <article key={el} className="element-basis-row">
            <div className="element-basis-label">
              <strong className={elementClass(el)}>{el}</strong>
              <span>{percentages[el] || 0}%</span>
            </div>
            <div className="element-basis-meter" aria-label={`${el} ${percentages[el] || 0}%`}>
              <i style={{ width: `${percentages[el] || 0}%`, background: `var(--${elementClass(el)})` }} />
            </div>
            <div className="element-basis-state">
              <b>{seasonal.states[el] || '休'}</b>
              <span>{SEASONAL_STATE_TEXT[seasonal.states[el]] || ''}</span>
            </div>
            <div className="element-basis-points">
              <span>構成 {calculation.fiveElements?.rawPoints?.[el] ?? '—'}</span>
              <span>季節補正 {calculation.fiveElements?.seasonalAdjustedPoints?.[el] ?? '—'}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="element-basis-meaning">
        <span>この五行構成の意味</span>
        <strong>{dominant} が前に出て、{support} を補う構成</strong>
        <p>この命盤では {dominant} が前に出やすく、性格や行動の癖にもその五行の性質が表れやすい構成です。</p>
        <p>{support} は意識して補うと全体が整いやすい要素です。用神候補は {yong} で、強い五行をさらに増やすより、命式全体が流れやすくなる方向を見ます。</p>
        <p>{balanceText}</p>
      </div>
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
    { label: '標準時', value: displayTimezoneLabel(meta.timezone || location.timezone) },
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
  const percentages = elementPercentages(calculation);
  const dominantElements = Object.entries(percentages).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([name]) => name).join('・');
  const support = supportElements(calculation).join('・');
  return (
    <div className="foundation-detail-stack">
      <section id="insight-elements" className="backend-panel">
        <div className="backend-panel-head">
          <div>
            <div className="summary-kicker">五行バランス</div>
            <h3>強く出る五行は {dominantElements || '—'}</h3>
          </div>
          <span>補 {support || '—'}</span>
        </div>
        <p className="backend-copy">五行の構成比と生剋図を確認します。続けて、どの要素が何%として計算され、季節による旺衰をどう別扱いしているかを確認できます。</p>
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
        <ElementBasisPanel calculation={calculation} />
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
        <div className="kanji">命式</div><div className="label">命式確認</div>
        <div className="seal-stack">
          {RESULT_NAV_ITEMS.map((item) => (
            <TopicButton key={item.id} {...item} onClick={() => scrollTo(item.id)} />
          ))}
          <button type="button" className="side-back" onClick={onBack}>← 入力へ戻る</button>
        </div>
      </aside>
      <div className="rite-main result-main" style={{ paddingBottom: 120 }}>
        <div className="return-action-row">
          <button className="inline-return-btn edit" onClick={onBack}>入力内容を修正する</button>
        </div>
        <div className="result-card" data-card-label="命式の確認" style={{ marginTop: 0 }}>
          <div id="s0" className="result-summary result-wide" style={{ paddingBottom: 0 }}>
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

          <div id="s3" className="result-wide result-next-panel" style={{ marginTop: 64 }}>
            <div className="result-next-head">
              <div>
                <div className="summary-kicker">次の読み解き</div>
                <h2>さらに深く読む</h2>
              </div>
              <p>命盤の要点を確認したあと、詳しい解説または大運の流れへ進めます。</p>
            </div>
            <div className="result-next-actions">
              <button className="result-next-card is-primary" onClick={onShowInsight}>
                <span className="result-next-icon">詳</span>
                <span className="result-next-copy">
                  <strong>命式詳細を読む</strong>
                  <small>日主タイプ・命式の型・五行特質・婚姻運・仕事運などを詳しく確認</small>
                </span>
                <span className="result-next-meta">詳細解説</span>
              </button>
              <button className="result-next-card" onClick={onShowFortune}>
                <span className="result-next-icon">運</span>
                <span className="result-next-copy">
                  <strong>大運・流年を見る</strong>
                  <small>十年運マップ・現在の大運・近い流年・明細表を確認</small>
                </span>
                <span className="result-next-meta">初版公開</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InsightView({ calculation, profile, onBack, onEditInput, routeTarget }) {
  const [topic, setTopic] = React.useState(routeTarget?.topic || 'core');
  const [activePillar, setActivePillar] = React.useState(null);
  const handledRouteKey = React.useRef(null);
  const primaryGod = collectTenGods(calculation)[0]?.[0] || '比肩';
  const dayStem = calculation.dayMaster;
  const patternName = displayPatternName(calculation.pattern);
  const strengthStatus = calculation.strength?.status || '身強弱未判定';
  const dominantLabel = strongestElements(calculation).filter(Boolean).join('・') || '五行';
  const supportLabel = supportElements(calculation).filter(Boolean).join('・') || '調整五行';
  const yongLabel = [calculation.yongShen?.primary, calculation.yongShen?.secondary].filter(Boolean).join('・') || supportLabel;
  const TOPICS = [
    { key: 'core', ja: '日主タイプ', icon: STEM_ICONS[dayStem] || '主', title: '日主のタイプ分類' },
    { key: 'pattern', ja: '命式の型', icon: '型', title: '命式の型と特質' },
    { key: 'element', ja: '五行特質', icon: '五', title: '五行バランスと調整点' },
    { key: 'lifeTask', ja: '人生課題', icon: '神', title: '人生課題として出やすいテーマ' },
    { key: 'marriage', ja: '婚姻運', icon: '縁', title: '婚姻運と関係の傾向' },
    { key: 'career', ja: '仕事運', icon: '仕', title: '仕事運と適職の方向' },
    { key: 'money', ja: '金運', icon: '財', title: '金運とお金の流れ' },
    { key: 'relationship', ja: '対人運', icon: '人', title: '対人運と人間関係' },
    { key: 'health', ja: '健康運', icon: '健', title: '健康運と生活リズム' },
  ];
  const currentTopic = TOPICS.find(t => t.key === topic) || TOPICS[0];
  const topicNums = ['貳','參','肆','伍','陸','柒','捌','玖','拾'];
  const getInsightContent = (key) => {
    const stemReading = STEM_READING[dayStem] || { title: 'その人の本質を表すタイプ', text: '日主は命式全体を読む起点になります。' };
    const godLabel = displayTenGod(primaryGod);
    const contents = {
      core: {
        intro: `日主タイプは、日柱の天干である日主から見ます。`,
        p1: `日主は ${dayStem}（${calculation.pillars.day.element.stem}）です。${stemReading.title}。${stemReading.text}`,
        p2: `日主は性格だけでなく、五行バランス、仕事運、婚姻運、対人運を見るときの中心点になります。`,
        source: `日柱天干 ${dayStem} / 日主五行 ${calculation.pillars.day.element.stem}`,
        note: '日主は鑑定の起点です。ここだけで断定せず、月柱・五行・通変星と重ねて読みます。',
      },
      pattern: {
        intro: `命式の型は、命式全体の構造と身強弱を合わせて見ます。`,
        p1: `この命盤の型は「${patternName}」、身強弱は ${strengthStatus} です。${displayPatternText(calculation.pattern, '月令と天干から命式の大枠を見ます。')}`,
        p2: calculation.strength?.text || '日主の勢いと五行の支えから、どんな環境で力を出しやすいかを読みます。',
        source: `月支 ${calculation.pillars.month.branch} / 月柱 ${calculation.pillars.month.text} / 身強弱 ${strengthStatus}`,
        note: '命式の型は人生全体の構造を読むための整理です。吉凶を一語で決めるものではありません。',
      },
      element: {
        intro: `五行特質は、強く出る五行・補いたい五行・用神をまとめて見ます。`,
        p1: `この命盤では ${dominantLabel} が前に出やすく、${supportLabel} を補うと全体が整いやすい構成です。`,
        p2: `用神・調候の候補は ${yongLabel} です。五行は性格、仕事、対人関係、健康運の生活リズムにも反映されます。`,
        source: `天干・地支・蔵干の構成比 / 補う五行 ${supportLabel} / 用神候補 ${yongLabel}`,
        note: '五行構成比と季節の旺衰は分けて扱います。割合だけで身強弱を決めない設計です。',
      },
      lifeTask: {
        intro: `人生課題は、命盤の中で重なりやすい通変星から見ます。`,
        p1: `この命盤で目立つ通変星は「${godLabel}」です。四柱の天干・蔵干に出る通変星を重ねて、行動パターンを読みます。`,
        p2: TEN_GOD_LIFE_TASKS[primaryGod] || TEN_GOD_LIFE_TASKS[godLabel] || TEN_GOD_READING[primaryGod]?.text || '行動の癖や課題として表れやすいテーマです。',
        source: `四柱天干・蔵干の通変星 / 主要テーマ ${godLabel}`,
        note: '課題は弱点の決めつけではなく、強く出やすい癖をどう育てるかを見る項目です。',
      },
      marriage: {
        intro: `婚姻運は、日支を婚姻宮として見ます。`,
        p1: marriageFortuneSummary(calculation),
        p2: `詳しくは日支 ${calculation.pillars.day.branch} と日主 ${dayStem} の関係、さらに命盤内の配偶者星や通変星を重ねて読みます。`,
        source: `日柱 ${calculation.pillars.day.text} / 日支 ${calculation.pillars.day.branch} / 日主 ${dayStem}`,
        note: '婚姻運は関係性の傾向を見る項目です。結婚の有無や時期を断定しません。',
      },
      career: {
        intro: `仕事運は、月柱・命式の型・身強弱・通変星を合わせて見ます。`,
        p1: careerFortuneSummary(calculation, patternName, strengthStatus, primaryGod),
        p2: `月柱 ${calculation.pillars.month.text} は社会性や仕事環境を表す柱です。ここに命式全体の型を重ねて、仕事で力を出しやすい場を読みます。`,
        source: `月柱 ${calculation.pillars.month.text} / 命式の型 ${patternName} / 通変星 ${godLabel}`,
        note: '適職名を固定するより、力を出しやすい環境・役割・働き方の方向を重視します。',
      },
      money: {
        intro: `金運は、財星だけでなく仕事運・五行バランス・用神を合わせて見ます。`,
        p1: wealthFortuneSummary(calculation),
        p2: `正財・偏財が強いかだけで判断せず、収入の入口、管理力、信用づくり、補う五行を重ねて見ます。`,
        source: `財星（正財・偏財）/ 仕事運 / 五行バランス / 用神候補 ${yongLabel}`,
        note: '金額や収入を保証する読みではなく、お金との関わり方と整え方の傾向を示します。',
      },
      relationship: {
        intro: `対人運は、通変星と日支から人間関係で出やすい振る舞いを見ます。`,
        p1: relationshipFortuneSummary(calculation, primaryGod),
        p2: `人との距離感、協力の仕方、言葉の出方は、日主・日支・目立つ通変星の組み合わせで読みます。`,
        source: `主要通変星 ${godLabel} / 日支 ${calculation.pillars.day.branch} / 日主 ${dayStem}`,
        note: '相性そのものではなく、この命式側に出やすい対人姿勢を読むページです。',
      },
      health: {
        intro: `健康運は病気の診断ではなく、体調管理と生活リズムの傾向として見ます。`,
        p1: healthFortuneSummary(calculation),
        p2: `五行の偏りがある場合は、強い五行を使いすぎず、補う五行を生活・環境・休息の中で整えることを重視します。`,
        source: `五行バランス / 強い五行 ${dominantLabel} / 補う五行 ${supportLabel}`,
        note: '医療判断ではありません。体調不良や不安がある場合は専門家に相談してください。',
      },
    };
    return contents[key] || contents.core;
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
      <aside className="rite-side insight-side">
        <div className="kanji">命式詳細</div><div className="label">詳しい読み解き</div>
        <div className="seal-stack">
          <button
            type="button"
            className="side-topic"
            onClick={() => scrollTo('insight-structure-board')}
          >
            <span className="topic-icon" aria-hidden="true">盤</span>
            <span className="topic-copy"><span className="num">零</span><span>命式構造表</span></span>
          </button>
          <button
            type="button"
            className="side-topic"
            onClick={() => scrollTo('insight-pillars-meaning')}
          >
            <span className="topic-icon" aria-hidden="true">柱</span>
            <span className="topic-copy"><span className="num">壹</span><span>四柱の意味</span></span>
          </button>
          {TOPICS.map((t, i) => (
            <TopicButton
              key={t.key}
              num={topicNums[i] || i + 1}
              icon={t.icon}
              label={t.ja}
              active={topic === t.key}
              onClick={() => setTopic(t.key)}
            />
          ))}
          <button type="button" className="side-back" onClick={onBack}>← 命式へ戻る</button>
        </div>
      </aside>
      <div className="rite-main" style={{ paddingBottom: 120 }}>
        <div className="return-action-row">
          <button className="inline-return-btn" onClick={onBack}>← 命式へ戻る</button>
          <button className="inline-return-btn edit" onClick={onEditInput}>入力内容を修正する</button>
        </div>
        <div className="page-context-bar">
          <span className="page-context-icon" aria-hidden="true">{currentTopic.icon}</span>
          <div>
            <small>現在位置 / 命式詳細</small>
            <strong>{currentTopic.ja}</strong>
          </div>
        </div>
        <div className="result-card" data-card-label="命式詳細" style={{ marginTop: 0 }}><div className="result-summary result-wide" style={{ paddingTop: 20 }}>
          <div id="insight-structure-board" className="insight-structure-board">
            <BaziStructureBoard calculation={calculation} activePillar={activePillar} onFocus={setActivePillar} />
          </div>
          <PillarMeaningSection calculation={calculation} profile={profile} />
          <section id="insight-topic-main" className="insight-reader">
            <div className="insight-reader-head">
              <div className={`insight-reader-icon tag-${currentTopic.key}`}>{currentTopic.icon}</div>
              <div>
                <div className="summary-kicker">{currentTopic.ja}の詳解</div>
                <h2>{currentTopic.title}</h2>
                <p>{content.intro}</p>
              </div>
            </div>
            <div className="insight-topic-tabs" aria-label="詳解テーマ">
              {TOPICS.map((t, i) => (
                <button key={t.key} type="button" className={t.key === topic ? 'is-active' : ''} onClick={() => setTopic(t.key)}>
                  <span>{topicNums[i]}</span>{t.ja}
                </button>
              ))}
            </div>
            <ReadingPointCards topic={currentTopic.ja} content={content} />
            <div className="insight-reader-body">
              <article className="insight-main-copy">
                {topic === 'core' || topic === 'marriage' ? <DayBranchRelationVisual calculation={calculation} /> : null}
                <DetailDisclosure title="補足の読み解きを開く">
                  <p>{content.p1}</p>
                  <p>{content.p2}</p>
                </DetailDisclosure>
              </article>
              <aside className="insight-evidence">
                <strong>読み取り根拠</strong>
                <p>{content.source}</p>
                <strong>読み方の注意</strong>
                <p>{content.note}</p>
              </aside>
            </div>
          </section>
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
        <div className="kanji">大運・流年</div><div className="label">運勢の流れ</div>
        <div className="seal-stack">
          {FORTUNE_NAV_ITEMS.map((item) => (
            <TopicButton key={item.id} {...item} onClick={() => scrollTo(item.id)} />
          ))}
          <button type="button" className="side-back" onClick={onBack}>← 命式へ戻る</button>
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
