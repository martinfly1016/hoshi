# Design QA

## Scope

- Reference: Scheme 2 desktop and mobile screenshots supplied by the user.
- Implementation: `site3/` homepage and the existing query flow.
- Devices: 1536 x 1053 desktop Chrome and iPhone 17 Simulator Safari.

## Visual comparison

- Passed: white canvas, red seal accent, Mincho display type, fine gray rules, rectangular controls, red primary action.
- Passed: desktop header and navigation proportions; query form and help column remain independent and do not squeeze each other.
- Passed: mobile header, single-column homepage, three-step flow, query field structure, and safe horizontal bounds.
- Passed: no nested decorative cards were introduced on the homepage.

## Interaction and behavior

- Passed: homepage primary action routes to `#rite`.
- Passed: query screen renders all four original input groups.
- Passed: mobile menu opens, exposes five destinations, and reports its state through `aria-expanded`.
- Passed: the logo returns to the homepage and FAQ navigation opens the query help area.
- Passed: existing calculation and result components were not changed.

## Responsive checks

- Passed: document width equals viewport width at 390 px.
- Passed: desktop screenshot at 1536 px and iOS Simulator screenshot show no clipped page regions or incoherent overlap.
- Passed: mobile CTA and navigation meet stable touch-target sizing.

## Result

Passed. No P0, P1, or P2 visual or functional defects remain in the tested homepage and query entry flow.
