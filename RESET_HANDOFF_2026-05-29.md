# Hoshi Reset Handoff - 2026-05-29

This handoff backs up the current product state and the next development request so a reset conversation can continue without relying on chat history.

## Current Product

- Product: `星の命式`, a Japanese-market Four Pillars / Shichusuimei tool.
- Core target user: Japanese ordinary users interested in personality, relationships, work, money, health tendencies, and luck cycles, with mobile-first usage expected.
- Product principle: show a readable result first, then expose professional structure and reasoning. Avoid raw tables without explanation.
- Public user entry: `site3/latest.html`, currently redirecting to `index.html?v=20260527-user-detail-meaning-1`.
- Public verification/backend page: `site3/shichusuimei/free/index.html`, latest known query in channel topic: `?v=free-20260525-elements-1`.
- Main source branch: `main`.
- Git status at handoff creation: clean against `origin/main`.

## Latest Confirmed Release

Latest user-facing release in `WORKLOG.md`:

- Version: `v0.3.81`
- Date: 2026-05-27 01:03 JST
- Scope: user page `/index.html`
- URL: `/latest.html` / `/index.html?v=20260527-user-detail-meaning-1`
- Main change: added concrete meaning explanations after structural/statistical output in the detail page. Four pillars, five elements, and ten gods now follow the rhythm "structure/statistics -> what this means".
- Commits: main `32e6ece`, with worklog update `be63b43`.

## Development History Summary

The project evolved from a static Japanese fortune site into a more complete Shichusuimei calculator:

- Integrated the calculation engine into the user-facing page.
- Added true chart output: four pillars, day master, five elements, ten gods, hidden stems, Na Yin, void branches, terrain, self-seat, true solar time.
- Split results into three pages: `命式`, `命式詳細`, `大運・流年`.
- Refined `命式` into a fast overview: basic info, chart table, important reading tags, and next-step cards.
- Expanded `命式詳細` with day master, five elements, pattern/strength/yongshen, ten gods, four pillar meanings, marriage palace, work/money/relationship/health-oriented readings.
- Repeatedly improved mobile and desktop readability, especially four-pillar table width, left navigation, Japanese terminology, and visual hierarchy.
- Changed five-element ratio calculation in v0.3.56 so ratio uses stems and weighted hidden stems, while seasonal strength is kept separate for strength analysis.
- Recent detail work focused on reducing "just data" sections by adding meaning explanations after chart/statistical information.

## Current New Request From Wreal

After backup and reset, Wreal wants the bot to lead the next development phase as the main agent.

Requested operating model:

- Main agent manages product development progress, sub-agent assignment, review, validation, and group progress updates.
- Use specialist agents as needed:
  - Algorithm development
  - User product function design
  - User product UI design
  - Backend algorithm testing
  - User-facing product testing
- Keep a closed loop each round: define requirement -> develop -> verify -> discover next requirement.
- Keep development records and backups updated, including problem/request, implementation, and resulting page state.

Requested next development tasks:

1. Improve algorithm accuracy, especially the reported issue that many different charts appear to become `身弱`. The strength calculation should be researched, tested, and corrected.
2. Inspect and update the user page for accuracy, natural Japanese, and removal of residual Chinese expressions.
3. Complete the `命式詳細` page so all listed topics have actual explanatory coverage, and connect it properly from the `命式` page.
4. Build the first usable `大運・流年` page and link it from the `命式` page.
5. Prepare several UI design directions for future European and American users while keeping the core function unchanged and preserving an Eastern mystical feeling.

## Main-Agent Team Structure For Next Phase

Initial structure:

- Main agent: product owner / tech lead / release manager. Owns prioritization, coordination, final review, logs, and Discord updates.
- Algorithm agent: audits and improves Shichusuimei calculation rules, especially day-master strength.
- Product function agent: maps page structure and missing feature coverage for `命式詳細` and `大運・流年`.
- UI/UE agent: improves current Japanese page readability and prepares Western-market UI concepts.
- Backend QA agent: creates calculation regression cases and checks backend verification output.
- User-facing QA agent: checks desktop/mobile flows, Japanese copy, links, navigation, and visual regressions.

## Immediate Plan

Phase 1: backup and audit

- Create this handoff.
- Add a short `WORKLOG.md` entry pointing to this handoff.
- Launch focused audits for algorithm, Japanese UI/copy, feature gaps, and Western UI directions.

Phase 2: algorithm correction

- Locate current `身強身弱` logic.
- Build a small regression set with varied seasons/day masters/supporting elements.
- Fix the weighting if it is biased toward weak outcomes.
- Verify both backend verification page and user page consume the corrected result.

Phase 3: user page quality pass

- Remove remaining Chinese terminology or awkward Japanese from visible user-facing strings.
- Check navigation and links between `命式`, `命式詳細`, and `大運・流年`.
- Verify desktop and mobile with at least one generated result.

Phase 4: feature completion

- Fill missing `命式詳細` topic bodies.
- Replace the current `大運・流年` placeholder/degraded state with a first useful page: current decade luck, ten-year map, near-year cards, and technical tables as detail.

Phase 5: Western UI proposals

- Produce multiple concept directions before implementation.
- Keep the current Japanese product stable while exploring a later English/global variant.

## Known Risks

- `身強身弱` can easily become wrong if five-element balance, month令 strength, root/support, and ten-god pressure are collapsed into one simple ratio.
- There are two main code surfaces to keep in sync: user page `site3/form.jsx` and verification page `site3/shichusuimei/free/page.js`, plus calculation logic in `site3/calculation-lab.js` / bridge code.
- GitHub Pages uses cache-busted query parameters and `latest.html`; every release must update both source and published/static references consistently.
- User-facing Japanese copy should avoid Chinese terms unless they are recognized Japanese 四柱推命 terms.

## First QA Findings

- `大運・流年を見る` is currently clickable, but the user page returns an `開発中` placeholder; complete luck-page code appears to exist later but is unreachable. Next step: activate a first usable luck page or clearly mark the entry as `準備中`.
- Backend verification page navigation still has Chinese/traditional Chinese text: `主導航`, `首頁`, `純工具`.
- Backend verification page still has simplified Chinese ten-god / hidden-stem labels near display logic: `劫财`, `伤官`, `偏财`, `正财`, `七杀`, `藏干`.
- Copy polish candidates: `時区`, `晚子時`, `好运来源`, `四柱定位`, `命主タイプ`, `人生格局`.

## First Algorithm Findings

- Root cause found for the reported `身強身弱` bias: `analyzeDayMasterStrength()` behaves as if it receives a day-master element (`木火土金水`), but the call site passes the day-master stem (`辛`, `戊`, etc.).
- Because the stem is not found in the five-element list, support calculation collapses toward a mostly fixed metal-based check. This causes many non-metal charts to become `身弱` or `従格`, and even metal charts miss proper mother-element support.
- Minimal next fix: pass `pillars.day.element.stem` or normalize the stem to an element inside `analyzeDayMasterStrength()`.
- Regression requirement: add fixtures for strong, neutral, weak, and follower outcomes, including non-metal day masters with clear peer/mother support.

## First Product-Function Findings

- `命式詳細` now covers most main topics, including chart structure, four-pillar meaning, day-master type, pattern/strength, five-element traits, life task, marriage, career, money, relationships, health, and ten-god composition.
- The biggest functional gap is `大運・流年`: the page currently returns an `開発中` placeholder before the fuller luck-cycle page code, so the promised ten-year map / current decade / near annual fortunes / detail table are unreachable.
- `運勢の流れ` and bottom-page luck links therefore land on placeholder content.
- Next `命式詳細` additions should be light explanations for `蔵干の読み方` and `十二運 / 地勢・自坐`, plus calculation notes for unknown birth time and true solar time.

## First Western UI Concepts

- Recommended MVP direction: `Mystic Analyst`, an Eastern-mystic but Western-readable insight dashboard. It should show a plain-English summary first, then the Four Pillars chart, with `What this means` and `Traditional basis` layers.
- Brand-rich alternative: `Eastern Codex`, an interactive manuscript / celestial archive style that keeps the chart central and explains characters with English labels.
- Softer broad-market alternative: `Celestial Wellness`, a Western astrology/wellness style centered on element balance and core self, with the technical chart moved into an advanced tab.
- Main caution: keep enough traditional structure visible so the product does not become a generic personality or wellness app.

## First Implementation After Reset

Version `v0.3.82` is prepared locally with cache key `20260529-strength-fortune-1`.

- Fixed the `身強身弱` root bug by using the day-master element instead of the day-master stem in strength analysis.
- Added explainable strength fields and a regression script: `npm --prefix spikes/calculation-libraries run test:strength`.
- Enabled the first usable `大運・流年` page by removing the `開発中` early return from `FortuneView`.
- Updated `命式` next-action copy so `大運・流年` is marked as `初版公開`.
- Cleaned the backend verification page navigation and several visible Chinese terms.
- Verification passed: `node --check site3/calculation-lab.js`, `node --check site3/shichusuimei/free/page.js`, `npm --prefix spikes/calculation-libraries run test:strength`, `git diff --check`.
- Local preview: `http://127.0.0.1:4173/index.html?v=20260529-strength-fortune-1`.
- Not yet pushed/deployed; external publish should be done only after explicit approval.

## Files To Read First After Reset

- `AGENT_WORKFLOW.md`
- `WORKLOG.md`
- `product-requirements.md`
- `RESET_HANDOFF_2026-05-29.md`
- `site3/latest.html`
- `site3/form.jsx`
- `site3/calculation-lab.js`
- `site3/shichusuimei/free/page.js`
