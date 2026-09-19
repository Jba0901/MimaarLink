# Intake visual-scale refinement — 18 September 2026

## 19 September owner-budget simplification

Q replaced the owner budget scale with a single manual text input and one `Not sure` / `غير متأكد` shortcut. There are no budget presets, modal pickers, or unit-conversion rules. Existing free-text values continue to display unchanged, the shortcut remains bilingual across a language switch, and focusing the input clears a selected shortcut. This change affects only the owner budget question; the timing and provider-size visual scales remain in place. The budget label uses QAR, not thousands, because the user types the full amount or range.

Q rejected both the original visible option grids and the follow-up popup picker as too reading-heavy. The final direction is an inline visual scale: the common answers are visible as short, tappable points, while uncertain and custom answers remain small secondary actions.

## Shipped behavior

- Owner timing is a five-point start scale: now, two weeks, one month, one to three months, or flexible. Budget is a four-point scale from under QAR 25,000 through QAR 500,000+.
- Provider typical project size uses the same compact monetary scale, with `varies by project` as its contextual secondary answer.
- Nothing is selected by default. The chosen point receives a teal check, the track fills to that point, and the full answer appears in the compact header.
- `Not sure`, `varies`, and custom entry are available without competing with the primary scale. Custom entry expands in place rather than opening a sheet or dialog.
- A selected answer exposes one compact clear control. Presets, custom values, step navigation, and language switching continue to preserve the existing form state.
- Full accessible labels remain on every visual point; the visible captions are intentionally short. Each point is a real radio control with keyboard focus styling and a live selected-value summary.
- Arabic RTL reverses the scale naturally while bidirectional isolation preserves numeric ranges. English remains LTR. Light/dark themes, reduced motion, official palette, fonts, API payloads, validation, and upload behavior are preserved.
- Labels were shortened to `Preferred start`, `Budget (QAR)`, and `Typical project size (QAR)` plus concise Arabic equivalents.

## Validation evidence

- `npm run build`: passed on the final implementation.
- `node --test tests/*.test.mjs`: 38/38 passed, including new coverage for short captions and auxiliary-answer separation.
- Actual local production-build routes tested at 390px and 320px in Arabic and English: `/post-project` and `/contractor`.
- Tested preset selection, language-switch persistence, custom budget entry, provider project-size rendering, clear affordance, keyboard-accessible radio semantics, light/dark themes, and no horizontal overflow.
- Fresh browser warning/error logs were empty. No final form submission, upload, real contact details, or customer-data mutation occurred; only dummy local QA values were used.
- Responsive browser testing is not physical-device certification, and no conversion improvement is claimed without live measurement.
