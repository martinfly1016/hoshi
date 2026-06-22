# Design QA

## Comparison target

- Source visual truth:
  - `/Users/cathy/.codex/attachments/7b5aac07-f56e-4d3f-92c0-f6298fb03a59/codex-clipboard-9d68918b-eb85-454a-b13d-cffd960db816.png`
  - `/Users/cathy/.codex/attachments/feb48d73-6b18-4a6a-a067-d1e326d78e14/codex-clipboard-590ac797-3364-41a7-9c63-0fde187f690a.png`
- Implementation screenshots:
  - `/tmp/hoshi-qa/home-v2b-desktop.png`
  - `/tmp/hoshi-qa/home-v2b-mobile.png`
- Viewports: 1491 x 1055 desktop; iPhone 17 Simulator Safari mobile.
- State: homepage before data entry.

## Evidence

- Full-view desktop comparison: `/tmp/hoshi-qa/compare-home-v2b-desktop.png`
- Full-view mobile comparison: `/tmp/hoshi-qa/compare-home-v2b-mobile.png`
- Focused header and intro comparison: `/tmp/hoshi-qa/compare-header-focus.png`
- The source shows the query form while the implementation shows the preserved legacy homepage content. Comparison therefore evaluates the shared visual system, grid, typography, navigation, steps, controls, and responsive rhythm rather than identical content blocks.

## Findings

- Fonts and typography: passed. Mincho display headings, sans-serif UI text, weights, wrapping, and hierarchy now follow the reference.
- Spacing and layout rhythm: passed. Desktop uses the same 940 px main area, 380 px auxiliary rail, 40 px gap, compact introduction, and bordered step/content regions. Mobile follows the same header, introduction, three-step flow, and stacked content rhythm.
- Colors and visual tokens: passed. White canvas, dark ink, muted gray, fine gray rules, pale red icon grounds, and solid red primary actions match the reference system.
- Image and asset fidelity: passed for the homepage scope. The legacy rotating chart is intentionally retained as original product content and no placeholder assets were introduced.
- Copy and content: passed. The original Japanese brand, poem, privacy message, CTA, ten-gods labels, and query entry behavior remain available.
- Interaction: passed. CTA and auxiliary cards route to the four-field query screen; the mobile menu exposes four destinations and reports state through `aria-expanded`.
- Responsive behavior: passed. At 390 px, document width equals viewport width and no horizontal overflow is present.

## Patches made since the previous QA pass

- Replaced the oversized split-screen hero with the Scheme 2 content hierarchy.
- Matched the desktop main/rail grid and help-card dimensions.
- Removed the redundant desktop Home navigation item; the logo remains the home control.
- Reduced mobile introduction height and aligned the three-step flow with the reference.
- Moved the legacy chart into a structured content panel rather than using it as the first-screen composition.

## Follow-up polish

- P3: the legacy `命` seal is retained instead of the reference's star emblem because no separate source logo asset was supplied.

final result: passed
