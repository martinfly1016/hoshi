/* Hero — 星の命式 landing */

function Hero({ onEnter }) {
  return (
    <section className="hero" data-screen-label="01 トップ">
      <div className="hero-poem">
        <div className="line">生年月日・出生時刻・出生地から、命式をすばやく作成</div>
        <div className="line dim">四柱推命 / 五行バランス / 大運・流年</div>
      </div>

      <div className="hero-title-block">
        <div className="hero-meta">
          <span className="index">FREE TOOL</span>
          <span className="div"></span>
          <span>SHICHI SUIMEI</span>
        </div>

        <h1 className="hero-title">
          <span className="row">星<span className="ko">の</span></span>
          <span className="row">命　式</span>
          <span className="small">HOSHI　NO　MEISHIKI</span>
        </h1>

        <button className="hero-cta" onClick={onEnter}>
          <span>無料で命式を見る</span>
          <span className="arrow"></span>
          <span className="seal-mini">占</span>
        </button>

        <div className="hero-lead">
          入力はこの端末上で計算します。保存やログインなしで、命式・五行・運勢の流れを確認できます。
        </div>
      </div>

      <div className="hero-chart">
        <StarChart />
      </div>

      <div className="hero-side">陰陽五行 · 四柱推命</div>

      <div className="hero-bottom">
        <div className="stations">
          <span>正財 · 偏財</span>
          <span>正官 · 偏官</span>
          <span>正印 · 偏印</span>
          <span>食神 · 傷官</span>
          <span>比肩 · 劫財</span>
        </div>
        <div>四柱推命 / {window.__hoshiYearInfo?.reiwa || '令和八年'} · {window.__hoshiYearInfo?.roman || 'MMXXVI'}</div>
      </div>
    </section>
  );
}

window.Hero = Hero;
