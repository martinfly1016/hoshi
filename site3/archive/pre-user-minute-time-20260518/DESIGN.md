# 星の命式 ─ 視覚規範 / Visual Design Spec

> Hoshi no Meishiki — Design System v1.0
> 和風幽玄 · 平安陰陽師 / Heian Onmyōji aesthetic
> 最終更新：令和七年 (2026)

本文档定义「星の命式」的视觉语言、组件规范与文案语气。后续任何新页面、邮件、宣传图，都应以本文为准。

---

## 0. 设计原则 / Principles

| # | 原则 | 反例 |
|---|---|---|
| 1 | **留白即仪式** — 大量负空间，元素少而准 | 信息密度高、卡片堆叠 |
| 2 | **静多于动** — 动效仅强化神秘感，不取悦 | 弹跳、视差、闪烁 |
| 3 | **古典为骨，现代为面** — 古文 + 现代等宽数字编号 | 全部古文或全英文 |
| 4 | **可读高于装饰** — 表单、正文必须清晰好用 | 通体竖排、低对比 |
| 5 | **朱印是重音** — 朱红仅用于落款、提交、强调 | 朱红做大背景或边框 |

---

## 1. 色彩 / Palette

四套主题，全部基于 `oklch` 思维构建，保持彼此明度梯度一致。CSS 变量定义在 `styles.css` `:root` 与 `[data-theme=...]`。

### 1.1 月夜 Tsukiyo（默认 / Dark）
> 深夜墨蓝 + 月白 + 朱印。最具神秘感。

| 角色 | Token | 值 | 用途 |
|---|---|---|---|
| BG | `--bg` | `#0d1018` | 页面底色 |
| BG 2 | `--bg-2` | `#141826` | 卡片底 |
| Paper | `--bg-paper` | `#1a1f2e` | 命盘卡片 |
| Ink | `--ink` | `#ebe3d1` | 主要文字（月白） |
| Ink 2 | `--ink-2` | `#a8a08c` | 次级文字 |
| Ink 3 | `--ink-3` | `#6b6557` | 辅助/标签 |
| Rule | `--rule` | `rgba(235,227,209,0.14)` | 细分割线 |
| Rule strong | `--rule-strong` | `rgba(235,227,209,0.28)` | 表单边框 |
| Accent | `--accent` | `#6480a8` | 月靛 / 链接 |
| Accent 2 | `--accent-2` | `#98a8c4` | 北斗星点 |
| Seal | `--seal` | `#a23b30` | 朱印 |
| Seal deep | `--seal-deep` | `#6e2820` | 朱印阴影 |
| Gold | `--gold` | `#b89968` | 极少量金线 |

### 1.2 紙白 Kamishiro（Light · 宣纸）
背景 `#f1ebdd`，文字 `#14171f`，accent `#2c3a66` 深靛，朱印不变。

### 1.3 靛深 Aifukashi（Dark · 重靛）
背景 `#08112a`，文字 `#d8d4c4`，accent `#7c98d0`。

### 1.4 朱墨 Shuboku（Light · 重朱）
背景 `#ece2cd`，主色 `#8a2818` —— 朱印转为主色，谨慎用面积。

### 使用规则
- **不要**新增中间色；如需弱化，用 `color-mix(in srgb, var(--ink) X%, transparent)`。
- 主题切换通过 `<html data-theme="...">` 一键切换，全部组件自动响应。
- 朱印 `--seal` 永远是「重音」，单页面出现 ≤ 3 处。

---

## 2. 字体 / Typography

三套字体组合，通过 `<html data-type="...">` 切换。

| Token | 字体栈 | 用途 |
|---|---|---|
| `--f-display` | Shippori Mincho / Yuji Mai / Yuji Syuku | 标题、命字、四柱 |
| `--f-body` | Noto Serif JP / Klee One | 正文、表单 label |
| `--f-seal` | Yuji Syuku / Shippori Mincho | 朱印汉字、章 |
| `--f-mono` | JetBrains Mono | 编号 (壹/序)、英文 caption |

### 字号阶梯（桌面）
| 名称 | 用途 | 值 |
|---|---|---|
| Display XL | Hero 标题 | `clamp(72px, 10vw, 144px)` / 字距 `0.04em` |
| Display L | 鑑定页大字 (鑑定之儀) | `56px` 竖排 / 字距 `0.3em` |
| Heading | 段落小标题 | `28px` / 字距 `0.12em` |
| Body | 正文 | `14px` / 行高 `2.0` / 字距 `0.12em` |
| Label | 表单 ja 标签 | `18px` / 字距 `0.2em` |
| Eyebrow | 编号、英文小标 | `10–11px` / 字距 `0.3–0.4em` |

### 移动端
- Hero Display：`clamp(56px, 17vw, 96px)`，更小屏 `clamp(48px, 18vw, 80px)`。
- 输入框统一 `16px`（防 iOS 自动缩放）。
- 字距整体减 0.05–0.1em，避免拥挤。

### 文案规则
- **古雅文言为基调**：「卜を乞う」「星辰、命式を顕さん」「虚妄を語る勿れ」。
- **数字用大写**：壹・貳・參・肆・伍。表单字段编号用 `壹 / 一` 双层制：粗类 / 细项。
- **人名/动词适度白话**：表单 placeholder 可现代（例：藤原 朔），保留可用性。
- 不使用 emoji，不使用 ★ ☆ 装饰符。

---

## 3. 空间与版式 / Layout

### 网格
- 桌面 Hero：12 列概念，但实际用 `grid-template-columns: 1fr 1fr` 两栏，左字右图。
- 鉴定页：`minmax(180px, 0.32fr) minmax(0, 1fr)`，左侧粘性 sidebar。
- 移动端：`1fr` 单列，**必须** `grid-column: auto` 重置桌面规则，否则会被强塞虚拟列。

### 段落留白（桌面）
| 区域 | padding |
|---|---|
| 页边 | `64px` 左右 / `120px` 上 / `80px` 下 |
| 字段间隔 | `28px` 上下，分割线 `1px` |
| 章节间隔 | `56–80px` |

### 移动端断点
- `≤ 1080px` —— 单列布局正式启用
- `≤ 420px` —— 极小屏调整（chips 改 3 列、性别按钮纵排）

### 竖排排版
- 仅用于 Hero 诗句、鉴定页 sidebar 大字（鑑定之儀）。
- `writing-mode: vertical-rl; text-orientation: mixed`，字距 `0.3–0.5em`。
- **正文不使用竖排** —— 易读性优先。

---

## 4. 视觉母题 / Motifs

### 4.1 星图（StarChart）
SVG `viewBox="0 0 800 800"`，三层结构：

| 层 | 半径 | 内容 | 旋转 |
|---|---|---|---|
| 外环 | r=372 | 二十八宿汉字（角・亢・氐…），每 7 宿一组朱红刻度（青龙/玄武/白虎/朱雀） | 顺时针 180s |
| 中环 | r=300 | 十二支（子・丑・寅…），径向虚线分宫 | 逆时针 240s |
| 内环 | r=240 / 180 | 北斗七星折线 + 中央「命」字钤印 | 呼吸 8s |

- 旋转速度受 `--motion` 变量控制：`off / soft / full` 对应 `0 / 0.4 / 1`。
- 中央汉字用 `--f-seal`，字号 68px，下方 `MEISHIKI` 英文 caption 9px。
- 四角小字「東 / 南 / 西 / 北」作方位锚。

### 4.2 朱印 Seal
- 形状：方形 `border` 1–4px，朱红实心或描边。
- 内含 1 字汉字（命 / 占 / 卜），`--f-seal`，旋转 -6° ~ -8° 营造手钤感。
- 必带 `box-shadow: 0 2px 0 var(--seal-deep)` 模拟印泥按压。
- **大小档**：mini 22–28px / standard 36–44px / hero 220px（落印仪式）。

### 4.3 纸纹 Grain
固定全局 SVG turbulence noise，`opacity: var(--paper-grain)` 主题感知，`mix-blend-mode: overlay`。Light 主题加重至 0.10–0.12 模拟宣纸。

### 4.4 编号系统
所有重要 section 配双层编号：
```
壹 / 一    NA · IMINA
（汉字大写）（罗马音 mono）
```
桌面用 `var(--f-mono)` `10px 0.3em`，朱印色仅在「肆 → 伍 卜を乞う」最终步骤出现。

---

## 5. 动效 / Motion

三档 `--motion`：
- **靜 (off)**：无动画，所有 `animation: none`。
- **弱 (soft)**：旋转 0.4 倍速、呼吸 0.4 倍幅度、淡入保留。
- **盈 (full)**：完整时长。

### 时序基准
| 动效 | 时长 | 缓动 |
|---|---|---|
| 星图外环旋转 | 180s | linear |
| 星图内环呼吸 | 8s | ease-in-out |
| 北斗 twinkle | 3s 错开 0.3s | ease-in-out |
| 页面切换墨晕 | 600ms | ease |
| 落印仪式 | 600ms `cubic-bezier(.2,.9,.2,1)` |
| 标语淡入 | 600ms 延迟 500ms |
| 输入聚焦边线 | 400ms | ease |
| 按钮 hover | 500ms | ease |

### 落印仪式
1. 用户点击「卜を乞う」
2. 半透明背景模糊 (`backdrop-filter: blur(3px)`) 淡入
3. 朱印「命」字从 `scale(2.4) rotate(-15°) opacity:0` 砸下，最终 `scale(1) rotate(-6°)`
4. 1.4s 后下方淡入「星辰、命式を顕す」
5. 1.9s 后退场，命盘预览滑入

### 减少动效
- `prefers-reduced-motion: reduce` 时，旋转 + 呼吸全部禁用，保留淡入。
- Tweaks 面板「動效 — 関」一键关闭。

---

## 6. 组件规范 / Components

### 6.1 顶栏 Chrome
- `position: fixed; top:0; padding: 22px 36px`（移动 14px 18px）。
- 左：朱印 `命` + 品牌字「星 の 命 式」`f-seal 14px 0.18em`。
- 中：导航 4 项 `11px 0.32em`，激活态下方红点。
- 右：纪年戳 `mono 10px 0.3em`，移动端隐藏。

### 6.2 CTA 按钮
- **主 CTA**（Hero「卜を乞う」）：透明底 + 描边 + 朱印迷你章。
- **提交按钮**（鉴定页）：实心墨色，朱印贴右上 `-14px -14px`。
- Hover：`translateY(-1px)` + 投影渗透。

### 6.3 表单字段 Field
```
  ┌─────────┬─────────────────────────┐
  │ 壹/一   │  ▁▁▁▁▁▁▁▁▁▁▁▁▁ NAME   │
  │ 名 諱   │                         │
  │ NA·IMINA│                         │
  └─────────┴─────────────────────────┘
```
- 上下 `border-top: 1px solid var(--rule)`。
- 左 `160px` label 列，右 input flex。
- input：仅下边线，`f-display 18px`，聚焦时下边线 `var(--ink)`。
- 右下 `with-mark` 数据角标：`mono 10px` 标识 `年/Y`、`月/M`、`NAME`。

### 6.4 时辰 Chips
12 + 1 网格（桌面 6 列、移动 4 列、小屏 3 列）：
```
[ 子 ] [ 丑 ] [ 寅 ] ...
[23-01]
[ ── 不詳 / 時辰を識らず ── ]
```
- 选中态：`border: var(--accent)`，背景 `accent 18%`，右上 4px 朱红圆点。

### 6.5 命盘卡 Pillars
- 4 柱（年/月/日/时）：天干上 / 地支下，地支用 `--accent` 着色。
- 下方纳音二字 `ink-2 0.3em`。
- 移动端 2×2。

### 6.6 朱印仪式遮罩
- 全屏 `position: fixed`，`backdrop-filter: blur(3px)`。
- 中央 220px 朱印章，下方副标语。

---

## 7. Tweaks 面板（开发者/设计师）

通过 `?tweaks=1` 或工具栏开关激活：

| 项 | 选项 | 说明 |
|---|---|---|
| 主題 | 月夜 / 紙白 / 靛深 / 朱墨 | 切换 4 套色票 |
| 字体 | 衬线明朝 / 仿宋 Yuji / 楷体 Syuku | 切换 `--f-display/body/seal` |
| 動效 | 関 / 弱 / 強 | 控制 `--motion` |
| Hero 排版 | 居中庄严 / 偏置留白 | 切换 grid 比例 |

---

## 8. 文件结构

```
/
├── index.html             — 主入口
├── mobile-preview.html    — iPhone 双机位预览
├── styles.css             — 全部 CSS（含主题变量、组件、媒体查询）
├── starchart.jsx          — 星图组件
├── hero.jsx               — 首页 Hero
├── form.jsx               — 鉴定页表单 + 命盘
├── app.jsx                — 路由 + Tweaks 主面板
├── tweaks-panel.jsx       — Tweaks UI 框架
├── ios-frame.jsx          — iOS 设备框架（仅 mobile-preview 使用）
└── DESIGN.md              — 本文件
```

### 加载顺序（index.html）
1. Google Fonts（Shippori / Noto Serif JP / Yuji Syuku / Yuji Mai / Klee One / JetBrains Mono）
2. styles.css
3. React 18.3.1 + ReactDOM + Babel standalone
4. tweaks-panel → starchart → hero → form → app

---

## 9. 后续扩展指南 / Roadmap

新增页面/功能时，请遵守：

1. **复用 token**，不要硬编码颜色和字号。
2. **新组件先做 4 主题验证**：确保在月夜 / 紙白 / 靛深 / 朱墨 下都成立。
3. **每页必须有一个「重音」**：朱印、大字、或反白条，三选一。
4. **文案先写古文，再做白话兜底**（无障碍）。
5. **动效控制在 1 秒以内**（除星图旋转）。
6. **新页面必须配置 `data-screen-label`**（如 `03 命式詳鑑`）以便后续锚定评论。

### 待开发
- 命式詳鑑页 (`03`) — 全屏命盘 + 章节滚动
- 流年運勢页 (`04`) — 时间轴 + 北斗指引
- 籤紙頒布页 (`05`) — 木刻签条样式 PDF 导出

---

*星辰廻天 · 卜以識運*
