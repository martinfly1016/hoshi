# Mobile Testing

## Local preview

Run a static server from `site3`:

```bash
python3 -m http.server 4185 --directory site3
```

Open:

```text
http://127.0.0.1:4185/shichusuimei/free/mobile-preview.html
```

## What this preview does

- Left device: input state
- Right device: auto-calculated result state
- Top toolbar: switch the result device between `日主 / 五行 / 十神 / 命盤 / 補足`

The result iframe loads:

```text
./index.html?autocalc=1&section=...
```

So mobile verification no longer depends on manually scrolling a long desktop page.

## Acceptance checklist

1. Input area fits within one phone screen without horizontal overflow.
2. Result area uses mobile tabs; only one major section is visible at a time on narrow screens.
3. `日主 / 五行 / 十神 / 命盤 / 補足` are all reachable with one tap.
4. Long tables stay inside their own scroll containers.
5. No text overlaps, clipped buttons, or accidental two-column squeeze.
6. After changes, verify at least:
   - input state
   - generated result
   - `五行`
   - `十神`
   - `命盤`
