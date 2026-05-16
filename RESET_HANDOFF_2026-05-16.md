# Reset Handoff - HOSHI / 星の命式

Date: 2026-05-16 JST
Context: Wreal requested that the conversation be reset after the current optimization round. This file captures the core state needed to resume work.

## Current Live URLs

- User page latest: `https://martinfly1016.github.io/hoshi/index.html?v=20260516-chart-before-tags-1`
- Backend/free validation latest: `https://martinfly1016.github.io/hoshi/shichusuimei/free/index.html?v=free-20260516-chart-2`
- GitHub Pages branch: `gh-pages`
- Work branch: `main`

## Current Commits Before This Handoff

- Latest `main`: `2d43f3f` - `Log chart before tags release`
- Latest feature code commit: `f529c67` - `Place user chart before tag index`
- Latest `gh-pages`: `ee42b3d` - `Deploy chart before tag index`

## Product Direction

The result experience should be split into three user-facing pages:

1. `命式`
   - For users who want to quickly calculate and inspect their chart.
   - Keep this page lightweight.
   - Current order: basic information -> four-pillar chart -> tag index -> buttons to deeper pages.
   - Do not mirror every backend/detail field here.

2. `命式詳細`
   - For users who want deeper reading and explanation.
   - Contains day master explanation, five elements, pattern / strength / yongshen, ten gods, hidden stems, reading source, four-pillar seats, marriage palace, and other detailed explanations.

3. `大運流年`
   - For luck-cycle reading.
   - Contains current decade luck, annual luck, monthly luck, daily luck, and related tables/cards.

This split is important because future monetization may place `命式詳細` and `大運流年` behind paid flows while keeping quick `命式` easier to access.

## Latest User Page Changes

Version: `/index.html?v=20260516-chart-before-tags-1`

Current `命式` order:

1. `基本情報`
2. `四柱の命式（排盤）`
3. `命式タグ索引`
4. `命式詳細 / 大運流年` buttons

Recent fixes:

- Mobile hero poem was fixed from awkward vertical text to horizontal two-line text.
- User result `命式構造表` was made compact on mobile:
  - Header shows both pillar label and gan-zhi, e.g. `年柱 / 庚午`.
  - On a 390px mobile viewport, all four columns are visible at once.
  - Page horizontal overflow verified as `0`.
- Tag index was moved below the four-pillar chart per Wreal's latest request.
- Side navigation/anchor order now matches the page order: `基本情報 -> 四柱排盤 -> タグ索引 -> 詳しい鑑定`.

## Latest Backend/Free Validation Changes

Version: `/shichusuimei/free/index.html?v=free-20260516-chart-2`

Current backend/free `命式` page:

- Basic information and one four-pillar matrix only.
- Four-pillar matrix rows:
  - `干神`
  - `天干`
  - `地支`
  - `藏干`
  - `支神`
  - `纳音`
  - `空亡`
  - `地勢`
  - `自坐`
- Removed duplicate four-pillar cards.
- Removed empty `神煞` row.
- Mobile table hint retained.

Backend/free information split:

- `命式`: basic info + chart only.
- `命式詳細`: tags, day master, five elements, pattern/strength/yongshen, ten gods, hidden stems, reading source, pillar seats, marriage palace.
- `大運流年`: luck cycles.

## Algorithm / Reading Content Notes

Important implemented concepts:

- Five elements now use backend-calculated `fiveElements.percentages` / raw points where available.
- Five elements explanation includes excess/lack/supplement guidance.
- Seasonal element status uses `旺相休囚死` based on month branch:
  - 寅卯 -> 木旺
  - 巳午 -> 火旺
  - 申酉 -> 金旺
  - 亥子 -> 水旺
  - 辰未戌丑 -> 土旺
- `日柱 / 婚姻宮` explanation is in detail sections and should reference:
  - 日支
  - 日柱藏干 / 支神
  - 日支五行 versus 日主五行
  - Avoid deterministic marriage claims.
- `四柱それぞれの坐` should explain all four pillars, not only day pillar:
  - 年柱: family, childhood, external impression
  - 月柱: society, work environment, how talents are used
  - 日柱: self core, day master, marriage palace
  - 時柱: inner life, future, later years, children / expression
- `読み取り位置` visualization should identify which chart element supports the reading, especially `日柱 -> 地支 -> 婚姻宮`.

## Files Most Often Edited

- User page:
  - `site3/index.html`
  - `site3/form.jsx`
  - `site3/styles.css`
  - `site3/app.jsx`
  - `site3/calculation-bridge.js`

- Backend/free validation page:
  - `site3/shichusuimei/free/index.html`
  - `site3/shichusuimei/free/page.js`

- Shared / support:
  - `site3/calculation-lab.js`
  - `site3/japan-municipalities.js`
  - `WORKLOG.md`

## Deployment Procedure

Work happens on `main`; deploy by copying `site3/` into the root of `gh-pages`.

Typical deploy:

```sh
tmpdir=$(mktemp -d /tmp/hoshi-gh-pages.XXXXXX)
git worktree add "$tmpdir" gh-pages
find "$tmpdir" -mindepth 1 -maxdepth 1 ! -name .git -exec trash {} +
ditto site3 "$tmpdir"
git -C "$tmpdir" add -A
git -C "$tmpdir" commit -m "Deploy ..."
git -C "$tmpdir" push origin gh-pages
git worktree remove "$tmpdir"
```

Use `trash`, not `rm`, per workspace safety convention.

## Cache / Verification Notes

- Mobile browser and GitHub Pages cache aggressively.
- Always bump query strings in `index.html` for changed assets:
  - `styles.css?v=...`
  - `form.jsx?v=...`
  - `app.jsx?v=...` if changed
  - `page.js?v=...` for backend/free page
- Send exact cache-busted links to Wreal.
- Useful verification:
  - `node --check site3/shichusuimei/free/page.js` for backend/free JS.
  - `curl` live `index.html` to confirm it references the new asset version.
  - `curl` live asset to confirm new markers exist.
  - Browser 390px viewport for mobile layout; check `document.documentElement.scrollWidth - window.innerWidth === 0`.

## Worklog / Archive Convention

- `WORKLOG.md` is the detailed release log.
- Each meaningful page release should:
  - Archive previous `site3` snapshot under `site3/archive/pre-.../`.
  - Update cache-busted URL.
  - Commit main changes.
  - Deploy `site3` to `gh-pages`.
  - Add a `WORKLOG.md` row with version, scope, URL, archive URL, main commit, and gh-pages commit.

## Group Chat Notes

- This work happened in Discord channel `#星の命式`.
- When responding visibly in the group, use the `message` tool.
- Wreal is the product reviewer and gives direct UI/product feedback in Chinese.
- Keep group replies concise and include exact cache-busted URLs.
