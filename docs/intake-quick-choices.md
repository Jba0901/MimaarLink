# Intake picker refinement — 17 September 2026

Q rejected the first visible-card implementation because it made optional questions visually heavy. The replacement keeps the useful predefined answers but reveals them only when requested. This is a routine reversible front-end refinement under Q's standing instruction to publish tested website improvements to main.

## Shipped behavior

- The owner form shows two compact 68px summary rows instead of ten simultaneous option cards. Each row presents one icon, question, current answer, and directional affordance; a selected answer replaces the arrow with a teal check.
- Activating a row opens a bottom sheet on narrow screens and a centered dialog on larger screens. Options are vertically stacked with 54px touch targets and the page behind is visually de-emphasized.
- Owner timing is explicitly a preferred **start**, not project duration: earliest possible, within two weeks, one month, one to three months, flexible, not sure yet, or custom text.
- Owner budget offers `not sure yet`, under 25,000, 25,000–100,000, 100,000–500,000, over 500,000 QAR, or unrestricted custom text. Provider typical project size uses the same ranges but says `varies by project` instead of `not sure yet`.
- Nothing is selected by default. Choosing a preset closes the picker and updates the summary immediately. A reopened picker exposes one clear-answer action. Custom entry stays inside the picker, receives focus, and requires an explicit use-answer action.
- Active answers survive forward/back navigation and language switching. Bilingual aliases avoid rewriting submitted strings. Bidirectional isolation keeps numeric ranges ordered left-to-right while the complete Arabic row remains right-aligned.
- Focus is trapped while the picker is open and restored to its trigger after closing. Escape and the localized close control work, the background cannot scroll, and all states have visible focus/selected styling in light and dark themes. Motion is disabled under reduced-motion preferences.
- Existing string payloads, validation, API, schema, required fields, upload limits, claims, consent, fonts, logo, and palette are unchanged. No dependency added.

## Validation evidence

- `npm run build`: passed three times during the replacement, including after the final RTL isolation correction.
- `node --test tests/*.test.mjs`: 37/37 passed. Behavior tests cover cross-language preset recognition for owner timing, owner budget, and provider project size, plus blank/custom answers that must not select a preset.
- Actual local production-build routes tested, with no duplicated fixture: `/post-project` and `/contractor`.
- Arabic/English inspections at 320px and 390px plus Arabic desktop at 1280px. Light and dark themes were exercised through the real app-shell control.
- No observed horizontal overflow. Summary rows were 68px at 390px and expanded naturally to 88px at 320px rather than clipping. Picker options remained 54px high.
- Tested immediate preset selection, valid not-sure/varies answers, localized selected summaries, custom budget focus and confirmation, clear action, focus restoration, language switching with preset and custom values, mobile bottom placement, desktop centered placement, and correct RTL presentation of number-only ranges.
- Fresh browser warning/error logs were empty. No final form submission, file upload, real contact details, or customer-data mutation occurred.
- Browser testing is responsive desktop emulation, not physical iOS/Android certification. No conversion-rate or field-performance improvement is claimed without live measurement.
