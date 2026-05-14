/* Hero — 星の命式 landing */

function Hero({ onEnter }) {
  return (
    <section className="hero" data-screen-label="01 序章">
      <div className="hero-poem">
        <div className="line">天に二十八宿、地に十二支あり</div>
        <div className="line">星辰の運び、命の式に映る</div>
        <div className="line dim">— 陰陽寮古記 卷之壹</div>
      </div>

      <div className="hero-title-block">
        <div className="hero-meta">
          <span className="index">壹 / 序</span>
          <span className="div"></span>
          <span>SHO·SHŌ</span>
        </div>

        <h1 className="hero-title">
          <span className="row">星<span className="ko">の</span></span>
          <span className="row">命　式</span>
          <span className="small">HOSHI　NO　MEISHIKI</span>
        </h1>

        <button className="hero-cta" onClick={onEnter}>
          <span>無料にて卜を乞う</span>
          <span className="arrow"></span>
          <span className="seal-mini">卜</span>
        </button>

        <div style={{
          marginTop: 28,
          fontSize: 11,
          letterSpacing: '0.3em',
          color: 'var(--ink-3)',
          fontFamily: 'var(--f-mono)',
        }}>
          生年月日と時辰、出生の地を奉ぜよ ── 星辰、汝が命式を顕さん
        </div>
      </div>

      <div className="hero-chart">
        <StarChart />
      </div>

      <div className="hero-side">星辰廻天 · 卜以識運</div>

      <div className="hero-bottom">
        <div className="stations">
          <span>角 · 亢 · 氐</span>
          <span>斗 · 牛 · 女</span>
          <span>奎 · 婁 · 胃</span>
          <span>井 · 鬼 · 柳</span>
        </div>
        <div>陰陽寮 / 令和七年 · MMXXVI</div>
      </div>
    </section>
  );
}

window.Hero = Hero;
