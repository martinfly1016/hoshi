/* 星図 — rotating star chart with 二十八宿 outer ring,
   十二支 inner ring, 北斗 and faint guide grid. */

const STATIONS = [
  // 東方青龍
  '角','亢','氐','房','心','尾','箕',
  // 北方玄武
  '斗','牛','女','虚','危','室','壁',
  // 西方白虎
  '奎','婁','胃','昴','畢','觜','参',
  // 南方朱雀
  '井','鬼','柳','星','張','翼','軫',
];
const SHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

// rough big-dipper coordinates (in 800x800 viewBox, around centre)
const DIPPER = [
  { x: 470, y: 308 },  // 天枢 Dubhe
  { x: 432, y: 322 },  // 天璇 Merak
  { x: 404, y: 354 },  // 天玑 Phecda
  { x: 388, y: 400 },  // 天权 Megrez
  { x: 358, y: 432 },  // 玉衡 Alioth
  { x: 322, y: 458 },  // 开阳 Mizar
  { x: 290, y: 488 },  // 摇光 Alkaid
];

function StarChart() {
  const cx = 400, cy = 400;

  // outer ring radius for 28 mansions text
  const rOuter = 372;
  const rOuterTick = 360;
  const rMid = 300;
  const rMidTick = 288;
  const rInner = 240;
  const rGuide = 180;
  const rCore = 120;

  return (
    <div className="starchart-wrap">
      <div className="starchart">
        <svg viewBox="0 0 800 800" aria-hidden="true">
          <defs>
            <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="var(--accent)"  stopOpacity="0.18" />
              <stop offset="60%" stopColor="var(--accent)"  stopOpacity="0.04" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="var(--ink)" stopOpacity="0.10" />
              <stop offset="100%" stopColor="var(--ink)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* faint glow */}
          <circle cx={cx} cy={cy} r={rOuter+20} fill="url(#bgGlow)" />

          {/* outer 28 mansions ring */}
          <g className="sc-rotate-cw">
            <circle cx={cx} cy={cy} r={rOuter} fill="none"
              stroke="var(--rule-strong)" strokeWidth="0.6" />
            <circle cx={cx} cy={cy} r={rOuterTick} fill="none"
              stroke="var(--rule)" strokeWidth="0.4" />
            {STATIONS.map((s, i) => {
              const a = (i / STATIONS.length) * Math.PI * 2 - Math.PI / 2;
              const x = cx + Math.cos(a) * (rOuter - 18);
              const y = cy + Math.sin(a) * (rOuter - 18);
              const tx = cx + Math.cos(a) * rOuterTick;
              const ty = cy + Math.sin(a) * rOuterTick;
              const tx2 = cx + Math.cos(a) * (rOuterTick - 14);
              const ty2 = cy + Math.sin(a) * (rOuterTick - 14);
              const isCardinal = i % 7 === 0;
              return (
                <g key={s}>
                  <line x1={tx} y1={ty} x2={tx2} y2={ty2}
                    stroke={isCardinal ? 'var(--seal)' : 'var(--rule-strong)'}
                    strokeWidth={isCardinal ? 1 : 0.6} />
                  <text x={x} y={y}
                    fill={isCardinal ? 'var(--ink)' : 'var(--ink-2)'}
                    fontSize="14"
                    fontFamily="var(--f-display)"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${(i / STATIONS.length) * 360}, ${x}, ${y})`}>
                    {s}
                  </text>
                </g>
              );
            })}
          </g>

          {/* mid 12 supports ring (counter-rotating) */}
          <g className="sc-rotate-ccw">
            <circle cx={cx} cy={cy} r={rMid} fill="none"
              stroke="var(--rule-strong)" strokeWidth="0.5" />
            <circle cx={cx} cy={cy} r={rMidTick} fill="none"
              stroke="var(--rule)" strokeWidth="0.3" strokeDasharray="2 4" />
            {SHI.map((s, i) => {
              const a = (i / SHI.length) * Math.PI * 2 - Math.PI / 2;
              const x = cx + Math.cos(a) * (rMid - 18);
              const y = cy + Math.sin(a) * (rMid - 18);
              return (
                <g key={s}>
                  {/* radial divider */}
                  <line
                    x1={cx + Math.cos(a - Math.PI/12) * rMidTick}
                    y1={cy + Math.sin(a - Math.PI/12) * rMidTick}
                    x2={cx + Math.cos(a - Math.PI/12) * rInner}
                    y2={cy + Math.sin(a - Math.PI/12) * rInner}
                    stroke="var(--rule)" strokeWidth="0.4" />
                  <text x={x} y={y}
                    fill="var(--ink-2)"
                    fontSize="18"
                    fontFamily="var(--f-display)"
                    textAnchor="middle"
                    dominantBaseline="middle">
                    {s}
                  </text>
                </g>
              );
            })}
          </g>

          {/* inner guide circles */}
          <g className="sc-breath">
            <circle cx={cx} cy={cy} r={rInner} fill="none"
              stroke="var(--rule)" strokeWidth="0.5" />
            <circle cx={cx} cy={cy} r={rGuide} fill="none"
              stroke="var(--rule)" strokeWidth="0.4" strokeDasharray="1 4" />
            <circle cx={cx} cy={cy} r={rCore} fill="url(#coreGlow)" />
            <circle cx={cx} cy={cy} r={rCore} fill="none"
              stroke="var(--rule-strong)" strokeWidth="0.7" />

            {/* cardinal axes */}
            {[0, 90, 180, 270].map(deg => {
              const a = (deg - 90) * Math.PI / 180;
              return (
                <line key={deg}
                  x1={cx + Math.cos(a) * rCore}
                  y1={cy + Math.sin(a) * rCore}
                  x2={cx + Math.cos(a) * rInner}
                  y2={cy + Math.sin(a) * rInner}
                  stroke="var(--rule-strong)" strokeWidth="0.4" />
              );
            })}

            {/* 北斗七星 */}
            <g>
              <polyline
                points={DIPPER.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="var(--accent-2)"
                strokeWidth="0.8"
                strokeOpacity="0.5"
              />
              {DIPPER.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={i === 0 ? 4 : 3}
                    fill="var(--accent-2)" className="sc-twinkle"
                    style={{ animationDelay: `${i * 0.3}s` }} />
                  <circle cx={p.x} cy={p.y} r={i === 0 ? 9 : 6}
                    fill="var(--accent)" fillOpacity="0.18" />
                </g>
              ))}
              {/* faint dipper labels */}
              <text x={DIPPER[0].x + 14} y={DIPPER[0].y - 8}
                fill="var(--ink-3)" fontSize="9"
                fontFamily="var(--f-mono)" letterSpacing="2">
                BOREALIS · 北斗
              </text>
            </g>

            {/* centre kanji */}
            <text x={cx} y={cy + 12}
              fill="var(--ink)"
              fontSize="68"
              fontFamily="var(--f-seal)"
              textAnchor="middle">命</text>
            <text x={cx} y={cy + 56}
              fill="var(--ink-3)"
              fontSize="9"
              fontFamily="var(--f-mono)"
              letterSpacing="3"
              textAnchor="middle">MEISHIKI</text>
          </g>

          {/* corner sigils */}
          {['東','南','西','北'].map((d, i) => {
            const positions = [
              { x: 760, y: 400 }, // 東 right
              { x: 400, y: 760 }, // 南 bottom
              { x: 40,  y: 400 }, // 西 left
              { x: 400, y: 40  }, // 北 top
            ];
            const p = positions[i];
            return (
              <text key={d} x={p.x} y={p.y}
                fill="var(--ink-3)"
                fontSize="13"
                fontFamily="var(--f-display)"
                textAnchor="middle"
                dominantBaseline="middle">{d}</text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

window.StarChart = StarChart;
