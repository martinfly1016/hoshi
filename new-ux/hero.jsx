/* Scheme 2 landing page, preserving the original homepage content and entry flow. */

function Hero({ onEnter, yearInfo }) {
  const readingItems = [
    { num: '01', title: '四柱命式', text: '年柱・月柱・日柱・時柱から、命盤の基本構造を確認します。' },
    { num: '02', title: '五行バランス', text: '木・火・土・金・水の強弱と、日主を取り巻く関係を読み解きます。' },
    { num: '03', title: '大運・流年', text: '十年ごとの大運と、毎年の流れが命式にどう重なるかを表示します。' },
  ];

  return (
    <section className="scheme2-home" data-screen-label="01 トップ">
      <div className="scheme2-home-hero">
        <div className="scheme2-home-copy">
          <p className="scheme2-home-kicker">四柱推命・七柱推命</p>
          <h1>星の命式</h1>
          <div className="scheme2-home-poem">
            <p>天に十干、地に十二支あり</p>
            <p>陰陽五行の運び、命式に映る</p>
          </div>
          <p className="scheme2-home-lead">
            生年月日・出生時刻・出生地から、命式をひらきます。<br />
            命式の基本情報と、四柱・五行、大運・流年の流れを確認できます。
          </p>
          <button type="button" className="scheme2-home-cta" onClick={onEnter}>
            <span>無料で命式を見る</span>
            <span className="scheme2-home-cta-arrow" aria-hidden="true">›</span>
          </button>
          <p className="scheme2-home-privacy">入力内容はこの端末上で計算し、保存・公開しません。</p>
        </div>

        <div className="scheme2-home-visual" aria-label="陰陽五行と十干十二支の命盤">
          <div className="scheme2-home-chart-head">
            <span>{yearInfo?.ganzhi}</span>
            <strong>{yearInfo?.reiwa}</strong>
          </div>
          <div className="scheme2-home-chart">
            <StarChart />
          </div>
          <p>陰陽五行 · 四柱推命</p>
        </div>
      </div>

      <div className="scheme2-home-flow" aria-label="鑑定の流れ">
        <div className="is-active"><span>1</span><strong>入力する</strong><small>生年月日や出生情報</small></div>
        <div><span>2</span><strong>命式を確認</strong><small>四柱・五行の構造</small></div>
        <div><span>3</span><strong>解説を読む</strong><small>大運・流年の流れ</small></div>
      </div>

      <section className="scheme2-home-reading" aria-labelledby="scheme2-reading-title">
        <div className="scheme2-home-section-head">
          <p>命式から読み解く</p>
          <h2 id="scheme2-reading-title">星の命式でわかること</h2>
        </div>
        <div className="scheme2-home-reading-grid">
          {readingItems.map((item) => (
            <article key={item.num}>
              <span>{item.num}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="scheme2-home-ten-gods" aria-label="十神">
        <span>正財 · 偏財</span>
        <span>正官 · 偏官</span>
        <span>正印 · 偏印</span>
        <span>食神 · 傷官</span>
        <span>比肩 · 劫財</span>
      </div>
    </section>
  );
}

window.Hero = Hero;
