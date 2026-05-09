const freeForm = document.querySelector("[data-free-form]");
const resultShell = document.querySelector("[data-result-shell]");
const themeButtons = document.querySelectorAll("[data-theme-choice]");
const themePreviewTitle = document.querySelector("[data-theme-preview-title]");
const themePreviewCopy = document.querySelector("[data-theme-preview-copy]");
const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const themes = {
  yoru: {
    title: "星読の夜",
    copy: "深い夜色に星図と金線を重ね、無料ツールでありながら鑑定を受ける前の期待感を作ります。"
  },
  washi: {
    title: "和紙と朱印",
    copy: "和紙の明るさ、朱色、静かな余白で、日本向けの命式サービスらしい落ち着きを出します。"
  },
  modern: {
    title: "現代占星",
    copy: "軽い背景と細い星図表現で、スマホアプリに近い読みやすさと若い印象を優先します。"
  }
};

const initialTheme = new URLSearchParams(window.location.search).get("theme") || localStorage.getItem("hoshi-theme") || "yoru";
applyTheme(themes[initialTheme] ? initialTheme : "yoru");
initConstellations();
initReveals();
initPointerGlow();

const prefectures = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

document.querySelectorAll("[data-prefecture-select]").forEach((select) => {
  prefectures.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.append(option);
  });
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyTheme(button.dataset.themeChoice);
  });
});

if (freeForm && resultShell) {
  freeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(freeForm);
    const birthday = formData.get("birthday");
    const birthplace = formData.get("birthplace");

    if (!birthday || !birthplace) {
      resultShell.innerHTML = "<strong>入力内容を確認してください</strong><p>生年月日と出生地は必須です。</p>";
      return;
    }

    resultShell.innerHTML = `
      <strong>鑑定エンジン接続前の確認画面</strong>
      <p>入力内容は受け付けました。公開版では、この領域に日主、命式表、五行バランス、性格・恋愛・仕事の読み解きを表示します。</p>
      <ul class="pill-list" aria-label="入力内容">
        <li>生年月日: ${escapeHtml(birthday)}</li>
        <li>出生時間: ${escapeHtml(formData.get("birthtime") || "不明")}</li>
        <li>出生地: ${escapeHtml(birthplace)}</li>
      </ul>
      <p class="hint">現在は未検証の疑似ロジックを使わないため、命式結果は表示していません。</p>
    `;
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function applyTheme(themeName) {
  const selectedTheme = themes[themeName] ? themeName : "yoru";
  document.documentElement.dataset.theme = selectedTheme;
  localStorage.setItem("hoshi-theme", selectedTheme);

  themeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeChoice === selectedTheme));
  });

  if (themePreviewTitle && themePreviewCopy) {
    themePreviewTitle.textContent = themes[selectedTheme].title;
    themePreviewCopy.textContent = themes[selectedTheme].copy;
  }
}

function initConstellations() {
  if (!motionAllowed) return;

  document.querySelectorAll("[data-constellation]").forEach((section) => {
    const canvas = document.createElement("canvas");
    canvas.className = "constellation-layer";
    canvas.setAttribute("aria-hidden", "true");
    section.prepend(canvas);

    const context = canvas.getContext("2d");
    const stars = [];
    let width = 0;
    let height = 0;
    let frame = 0;

    const resize = () => {
      const rect = section.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      stars.length = 0;

      const count = Math.round(Math.min(86, Math.max(34, width / 16)));
      for (let index = 0; index < count; index += 1) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.7 + 0.35,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.05,
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    const draw = () => {
      frame += 0.008;
      context.clearRect(0, 0, width, height);

      stars.forEach((star, index) => {
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < -20) star.x = width + 20;
        if (star.x > width + 20) star.x = -20;
        if (star.y < -20) star.y = height + 20;
        if (star.y > height + 20) star.y = -20;

        const glow = 0.42 + Math.sin(frame * 4 + star.phase) * 0.22;
        context.beginPath();
        context.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(246, 222, 158, ${glow})`;
        context.fill();

        for (let next = index + 1; next < stars.length; next += 1) {
          const other = stars[next];
          const dx = star.x - other.x;
          const dy = star.y - other.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 108) {
            context.beginPath();
            context.moveTo(star.x, star.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(215, 182, 108, ${0.12 * (1 - distance / 108)})`;
            context.lineWidth = 0.8;
            context.stroke();
          }
        }
      });

      requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    section.addEventListener("pointermove", (event) => {
      const rect = section.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
      section.style.setProperty("--drift-x", `${x * 10}px`);
      section.style.setProperty("--drift-y", `${y * 8}px`);
    });

    section.addEventListener("pointerleave", () => {
      section.style.setProperty("--drift-x", "0px");
      section.style.setProperty("--drift-y", "0px");
    });
  });
}

function initReveals() {
  const revealTargets = document.querySelectorAll(".card, .section-kicker, .content, .theme-panel, .form-panel, .faq, .steps");
  revealTargets.forEach((target) => target.classList.add("reveal"));

  if (!motionAllowed || !("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealTargets.forEach((target) => observer.observe(target));
}

function initPointerGlow() {
  document.querySelectorAll(".card, .theme-button").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      element.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    });
  });
}
