/* 星図 — rotating star chart with 十天干 outer ring,
   十二支 inner ring, 八卦 core and faint guide grid.
   Incorporates Yin-Yang and Wuxing color cues. */

const GAN = [
  { c: '甲', w: '木', color: '#4a825e' },
  { c: '乙', w: '木', color: '#4a825e' },
  { c: '丙', w: '火', color: '#c2493a' },
  { c: '丁', w: '火', color: '#c2493a' },
  { c: '戊', w: '土', color: '#997a4d' },
  { c: '己', w: '土', color: '#997a4d' },
  { c: '庚', w: '金', color: '#c2a55a' },
  { c: '辛', w: '金', color: '#c2a55a' },
  { c: '壬', w: '水', color: '#3b5c87' },
  { c: '癸', w: '水', color: '#3b5c87' },
];

const ZHI = [
  { c: '子', w: '水', color: '#3b5c87' },
  { c: '丑', w: '土', color: '#997a4d' },
  { c: '寅', w: '木', color: '#4a825e' },
  { c: '卯', w: '木', color: '#4a825e' },
  { c: '辰', w: '土', color: '#997a4d' },
  { c: '巳', w: '火', color: '#c2493a' },
  { c: '午', w: '火', color: '#c2493a' },
  { c: '未', w: '土', color: '#997a4d' },
  { c: '申', w: '金', color: '#c2a55a' },
  { c: '酉', w: '金', color: '#c2a55a' },
  { c: '戌', w: '土', color: '#997a4d' },
  { c: '亥', w: '水', color: '#3b5c87' },
];

const BAGUA = [
  { c: '乾', sym: '☰' },
  { c: '兑', sym: '☱' },
  { c: '离', sym: '☲' },
  { c: '震', sym: '☳' },
  { c: '巽', sym: '☴' },
  { c: '坎', sym: '☵' },
  { c: '艮', sym: '☶' },
  { c: '坤', sym: '☷' },
];

function StarChart() {
  const cx = 400, cy = 400;

  // outer ring radius
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

          {/* outer 10 Stems ring */}
          <g className="sc-rotate-cw">
            <circle cx={cx} cy={cy} r={rOuter} fill="none"
              stroke="var(--rule-strong)" strokeWidth="0.6" />
            <circle cx={cx} cy={cy} r={rOuterTick} fill="none"
              stroke="var(--rule)" strokeWidth="0.4" />
            {GAN.map((gan, i) => {
              const a = (i / GAN.length) * Math.PI * 2 - Math.PI / 2;
              const x = cx + Math.cos(a) * (rOuter - 18);
              const y = cy + Math.sin(a) * (rOuter - 18);
              const tx = cx + Math.cos(a) * rOuterTick;
              const ty = cy + Math.sin(a) * rOuterTick;
              const tx2 = cx + Math.cos(a) * (rOuterTick - 14);
              const ty2 = cy + Math.sin(a) * (rOuterTick - 14);
              return (
                <g key={gan.c}>
                  <line x1={tx} y1={ty} x2={tx2} y2={ty2}
                    stroke="var(--rule-strong)" strokeWidth={0.6} />
                  <text x={x} y={y - 8}
                    fill={gan.color}
                    fontSize="18"
                    fontFamily="var(--f-display)"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${(i / GAN.length) * 360}, ${x}, ${y})`}>
                    {gan.c}
                  </text>
                  {/* Wuxing label */}
                  <text x={x} y={y + 10}
                    fill={gan.color}
                    fontSize="10"
                    fontFamily="var(--f-display)"
                    textAnchor="middle"
                    opacity="0.6"
                    transform={`rotate(${(i / GAN.length) * 360}, ${x}, ${y})`}>
                    {gan.w}
                  </text>
                </g>
              );
            })}
          </g>

          {/* mid 12 Branches ring (counter-rotating) */}
          <g className="sc-rotate-ccw">
            <circle cx={cx} cy={cy} r={rMid} fill="none"
              stroke="var(--rule-strong)" strokeWidth="0.5" />
            <circle cx={cx} cy={cy} r={rMidTick} fill="none"
              stroke="var(--rule)" strokeWidth="0.3" strokeDasharray="2 4" />
            {ZHI.map((zhi, i) => {
              const a = (i / ZHI.length) * Math.PI * 2 - Math.PI / 2;
              const x = cx + Math.cos(a) * (rMid - 22);
              const y = cy + Math.sin(a) * (rMid - 22);
              return (
                <g key={zhi.c}>
                  {/* radial divider */}
                  <line
                    x1={cx + Math.cos(a - Math.PI/12) * rMidTick}
                    y1={cy + Math.sin(a - Math.PI/12) * rMidTick}
                    x2={cx + Math.cos(a - Math.PI/12) * rInner}
                    y2={cy + Math.sin(a - Math.PI/12) * rInner}
                    stroke="var(--rule)" strokeWidth="0.4" />
                  <text x={x} y={y - 4}
                    fill={zhi.color}
                    fontSize="22"
                    fontFamily="var(--f-display)"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${(i / ZHI.length) * 360}, ${x}, ${y})`}>
                    {zhi.c}
                  </text>
                  <text x={x} y={y + 12}
                    fill={zhi.color}
                    fontSize="10"
                    fontFamily="var(--f-display)"
                    textAnchor="middle"
                    opacity="0.6"
                    transform={`rotate(${(i / ZHI.length) * 360}, ${x}, ${y})`}>
                    {zhi.w}
                  </text>
                </g>
              );
            })}
          </g>

          {/* inner guide circles and Bagua core */}
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

            {/* Eight Trigrams (Bagua) around the center */}
            {BAGUA.map((b, i) => {
              const a = (i / BAGUA.length) * Math.PI * 2 - Math.PI / 2;
              const x = cx + Math.cos(a) * (rGuide - 25);
              const y = cy + Math.sin(a) * (rGuide - 25);
              return (
                <g key={b.c}>
                  <text x={x} y={y - 8}
                    fill="var(--ink-2)"
                    fontSize="16"
                    fontFamily="var(--f-display)"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${(i / BAGUA.length) * 360}, ${x}, ${y})`}>
                    {b.sym}
                  </text>
                  <text x={x} y={y + 10}
                    fill="var(--ink-3)"
                    fontSize="10"
                    fontFamily="var(--f-display)"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${(i / BAGUA.length) * 360}, ${x}, ${y})`}>
                    {b.c}
                  </text>
                </g>
              );
            })}

            {/* centre kanji */}
            <text x={cx} y={cy + 12}
              fill="var(--ink)"
              fontSize="68"
              fontFamily="var(--f-seal)"
              textAnchor="middle">命</text>
            <text x={cx} y={cy + 56}
              fill="var(--ink-3)"
              fontSize="9"
              fontFamily="var(--f-display)"
              letterSpacing="3"
              textAnchor="middle">四柱推命</text>
          </g>

          {/* corner sigils */}
          {['木','火','金','水'].map((d, i) => {
            const positions = [
              { x: 760, y: 400 }, // right
              { x: 400, y: 760 }, // bottom
              { x: 40,  y: 400 }, // left
              { x: 400, y: 40  }, // top
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
