# Testing Workflow

This page is mobile-first, but acceptance must always cover both desktop and mobile.

## Required surfaces

Every UI change must be checked on both:

1. `PC / Desktop browser`
2. `iOS Safari behavior`

Use the tools in this order:

1. Desktop browser check
2. `mobile-preview.html` quick structure check
3. iOS Simulator final mobile check

## Local preview

Run a static server from `site3`:

```bash
python3 -m http.server 4185 --directory site3
```

Primary URLs:

```text
http://127.0.0.1:4185/shichusuimei/free/index.html
http://127.0.0.1:4185/shichusuimei/free/mobile-preview.html
```

Direct result-state URLs:

```text
http://127.0.0.1:4185/shichusuimei/free/index.html?autocalc=1&section=day-master
http://127.0.0.1:4185/shichusuimei/free/index.html?autocalc=1&section=elements
http://127.0.0.1:4185/shichusuimei/free/index.html?autocalc=1&section=structure
http://127.0.0.1:4185/shichusuimei/free/index.html?autocalc=1&section=chart
http://127.0.0.1:4185/shichusuimei/free/index.html?autocalc=1&section=meta
```

Section-direct preview:

```text
http://127.0.0.1:4185/shichusuimei/free/mobile-preview.html?section=day-master
http://127.0.0.1:4185/shichusuimei/free/mobile-preview.html?section=elements
http://127.0.0.1:4185/shichusuimei/free/mobile-preview.html?section=structure
http://127.0.0.1:4185/shichusuimei/free/mobile-preview.html?section=chart
http://127.0.0.1:4185/shichusuimei/free/mobile-preview.html?section=meta
```

## What `mobile-preview.html` does

- Left device: input state
- Right device: auto-calculated result state
- Top toolbar: switches the result device between `日主 / 五行 / 十神 / 命盤 / 補足`
- Result iframe loads `./index.html?autocalc=1&section=...`

This is a fast structure check. It does not replace Simulator validation.

## Desktop acceptance

Minimum desktop checks:

1. Page opens without blank screen.
2. Input form is usable.
3. `命式を作成` returns a valid result.
4. Result navigation works.
5. No obvious layout breakage at standard desktop widths.

## iOS Simulator acceptance

Preferred device baseline:

- `iPhone 16 Pro` as the default mobile acceptance device
- `iPhone SE (3rd generation)` only as an optional narrow-width stress device when a layout is close to breaking

### simctl environment

This machine may still have:

```bash
xcode-select -p
# /Library/Developer/CommandLineTools
```

In that case, plain `xcrun simctl ...` can fail even when Xcode and Simulator are installed.

For project-local usage, use the wrapper in this folder:

```bash
./simctl-xcode.sh list devices available
```

It forces:

```bash
DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer
```

If you want to fix the whole machine globally, run this yourself in Terminal:

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
```

### Launch

Open Simulator, then open Safari inside the device and visit:

```text
http://127.0.0.1:4185/shichusuimei/free/index.html
```

For fast regression, you can also open a direct result state:

```text
http://127.0.0.1:4185/shichusuimei/free/index.html?autocalc=1&section=structure
```

Useful commands with the wrapper:

```bash
./simctl-xcode.sh list devices available
./simctl-xcode.sh openurl booted http://127.0.0.1:4185/shichusuimei/free/index.html
./simctl-xcode.sh io booted screenshot /tmp/hoshi-ios-check.png
```

### What to verify in Simulator

1. First screen height is reasonable.
2. No page-level horizontal overflow.
3. Tab targets are reachable by thumb without accidental clipping.
4. Long cards scroll correctly.
5. Inputs and selects remain usable in Safari.
6. Result content remains readable after calculation.
7. `十神` and `命盤` are still understandable on a real phone viewport.
8. Safari bottom toolbar must not hide critical actions or create false horizontal overflow.

## Mobile acceptance checklist

1. Input area fits within one phone screen without horizontal overflow.
2. Result area uses mobile tabs; only one major section is visible at a time on narrow screens.
3. `日主 / 五行 / 十神 / 命盤 / 補足` are all reachable with one tap.
4. Long tables stay inside their own scroll containers.
5. No text overlaps, clipped buttons, or accidental two-column squeeze.
6. `十神` must use a mobile-readable structure, not an over-compressed chart.
7. `mobile-preview.html` must reflect the current default device baseline (`iPhone 16 Pro`, 402px wide viewport).

## Minimum regression pass after each UI change

Check at least:

- input state
- generated result
- `日主`
- `五行`
- `十神`
- `命盤`
- desktop browser
- iOS Simulator
