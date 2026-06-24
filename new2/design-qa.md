# Design QA: new2 Scheme 2 Query Page

## Comparison target

- Source visual truth:
  - `/Users/cathy/.codex/attachments/7b5aac07-f56e-4d3f-92c0-f6298fb03a59/codex-clipboard-9d68918b-eb85-454a-b13d-cffd960db816.png`
  - `/Users/cathy/.codex/attachments/feb48d73-6b18-4a6a-a067-d1e326d78e14/codex-clipboard-590ac797-3364-41a7-9c63-0fde187f690a.png`
- Implementation target: `http://127.0.0.1:4177/index.html?figma=2`
- State: query page before data entry; result page after default submit.
- Viewports checked: 1280 x 720, 900 x 900, 390 x 844, 360 x 780.
- Additional states checked on 2026-06-24: result summary, `命式詳細`, and `大運・流年` after default submit.
- Implementation screenshot path: blocked. In-app browser screenshot capture timed out twice; a retry in a fresh tab crashed that tab.
- Full-view comparison evidence: blocked by screenshot capture failure.
- Focused region comparison evidence: browser DOM geometry checks for header, query grid, form rows, controls, FAQ panel, submit CTA, and result layout.

## Findings

- [Resolved P0] `大運・流年` page could blank out after navigation.
  - Evidence: in-app browser console reported `ReferenceError: normalizeDisplayTerms is not defined` from `FortuneView`, and the root became empty after clicking the fortune page.
  - Fix: restored `normalizeDisplayTerms()` as a safe wrapper around the Japanese terminology normalizer and cache-busted `form.jsx`.

- [Resolved P1] Result subpages still used default browser-looking controls and cramped unstyled tables.
  - Evidence: the `八字要素表` section rendered as a stack of default button outlines, matching the user's attached screenshot.
  - Fix: added a result-page visual system for the bazi matrix, basic info grid, reading tags, insight panels, fortune cards, and luck tables.

- [Resolved P1] Desktop right rail squeezed the form at the default desktop viewport.
  - Evidence: before patch, at 1280 px the page kept a two-column layout and compressed the form to 782 px wide, leaving field controls at 432 px.
  - Fix: raised the single-column breakpoint to 1360 px so the FAQ rail drops below before it can compress the input form.

- [Resolved P2] Mobile form label column consumed too much horizontal space.
  - Evidence: before patch, at 360 px the month and day selects were 55 px or less after the left label column took 150 px.
  - Fix: reduced the mobile label column to 112 px, tightened label padding, and made the date year field full-width with month/day side by side below.

- [Blocked] Screenshot-based visual comparison could not be completed in the in-app browser.
  - Evidence: viewport and full-page screenshots timed out; a fresh-tab screenshot attempt crashed the tab.
  - Impact: this pass verifies geometry, overflow, and interaction, but not pixel-level typography/color/image fidelity against the reference in a combined comparison image.
  - Fix: retry screenshot capture in a stable browser surface or ask permission to use a separate Playwright/Chrome capture path for visual diff images.

## Checks Passed

- Desktop query page at 1280 px: no horizontal overflow; main form is 1212 px wide after FAQ moves below; field controls are 862 px wide.
- Tablet/narrow desktop at 900 px: no horizontal overflow; form is 832 px wide; FAQ appears below as a three-card grid.
- Mobile at 390 px: no horizontal overflow; year select is 238 px, month/day selects are 116 px each, location selects are 238 px.
- Mobile at 360 px: no horizontal overflow; year select is 208 px, month/day selects are 101 px each, location selects are 208 px.
- Submit flow: default input submits successfully and reaches `あなたの命式` on 390 px and 360 px mobile checks.
- Desktop result page at 1280 px: no horizontal overflow; left result navigation and main result content align in a stable two-column layout.
- Desktop `大運・流年` page at 1280 px: page renders without blank screen; fortune map, visual blocks, and luck tables use the Scheme 2 card/table styling.
- Desktop `命式詳細` page at 1280 px: page renders through the result-card entry; bazi matrix, insight reader, tabs, evidence panel, and backend panels are styled and do not use default button styling.
- Mobile result summary at 390 px: document width remains within viewport; bazi matrix overflow is contained inside `.bazi-board-pro`.
- Mobile `命式詳細` at 390 px: document width remains within viewport; bazi matrix overflow is internal.
- Mobile `大運・流年` at 390 px: document width remains within viewport; luck table overflow is contained inside `.user-luck-table-wrap`.

## Patches Made Since Previous QA Pass

- Switched the calculator entry from ESM module loading to a bundled browser script so the query page submits reliably in the in-app browser.
- Updated the CSS cache key in `index.html`.
- Raised the desktop collapse breakpoint from 1080 px to 1360 px.
- Reduced mobile label/control column imbalance.
- Added a mobile date layout where year spans the full control width and month/day share the next row.
- Gave the CTA icon a stable width to avoid a zero-width grid track.
- Added result-page CSS for bazi matrix, reading tags, insight panels, backend panels, fortune cards, and scroll-contained tables.
- Restored missing display-term normalization used by the fortune page.
- Updated `form.jsx` and `styles.css` cache keys.

## Required Fidelity Surfaces

- Fonts and typography: partially checked by DOM and CSS. Font stacks and weights remain aligned to Scheme 2 (`Shippori Mincho` display, `Noto Sans JP` UI), but pixel-level visual comparison is blocked by screenshot capture.
- Spacing and layout rhythm: passed for measured basics. Major columns, form rows, controls, FAQ rail, CTA, result layout, insight layout, and fortune layout have stable widths. Wide bazi/table content scrolls inside its own container on mobile instead of widening the page.
- Colors and visual tokens: partially checked by CSS. Red, ink, muted gray, and rule tokens are defined consistently; screenshot comparison is still needed for final color fidelity.
- Image quality and asset fidelity: not applicable to the current query page beyond icon rendering; screenshot confirmation is blocked.
- Copy and content: passed for the tested query/result/insight/fortune paths; Japanese copy remains visible and submit reaches the preserved result content.

## Implementation Checklist

- Retry screenshot capture for desktop and mobile in a stable browser surface.
- Compare implementation screenshots against the two Scheme 2 reference images in one combined image per viewport.
- After screenshot comparison passes, update this report from blocked to passed.

final result: blocked
