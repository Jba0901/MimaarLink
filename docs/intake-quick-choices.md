# Intake quick choices — 16 September 2026

Q requested more interactive, easy-to-answer owner and provider forms, then specifically requested common predefined timelines. This is a routine front-end refinement under Q's standing instruction to publish tested routine website improvements to main.

## Shipped behavior

- Owner timing is now explicitly a preferred **start**, not project duration: earliest possible, within two weeks, one month, three months, flexible, or custom text.
- Owner budget and provider typical project size offer broad optional QAR ranges (under 25,000; 25,000–100,000; 100,000+) plus unrestricted custom text. These are selectable ranges, not price estimates or recommendations.
- No answer is selected by default. Presets toggle off when tapped again. A clear action also removes the answer and restores keyboard focus to the question's first choice.
- Custom entry opens only on request and receives focus. A custom draft survives temporarily choosing a preset while that step stays mounted. The active answer survives navigating forward/back and changing language.
- Options have 48px minimum touch height, selected checkmarks, native button keyboard behavior, fieldset/legend grouping, visible focus rings, RTL layout, and light/dark styles. Color transitions honor reduced motion.
- Existing string payloads, validation, API, schema, required fields, upload limits, claims, consent, fonts, logo, and palette are unchanged. No dependency added.

## Validation evidence

- `npm run build`: passed twice, including the final focus correction.
- `node --test tests/*.test.mjs`: 37/37 passed. New behavior tests cover cross-language preset recognition and avoiding accidental selection for blank/custom answers.
- Actual local production-build routes tested, with no duplicated fixture: `/post-project` and `/contractor`.
- Arabic/English mobile inspections at 320px and 390px; owner tablet inspection at 768px; provider desktop inspection at 1280px. Light and dark themes exercised through the real app-shell control.
- No observed horizontal overflow. At 390px Arabic, every new choice was 48px high and no choice text overflowed its button. At 320px labels wrap rather than clip.
- Tested preset selection/deselection with mouse and Space, language switching with an active preset, custom budget draft restoration, forward/back persistence for owner and provider custom answers, blank optional state, custom-input focus, and clear-action focus restoration.
- Fresh browser warning/error logs were empty. No final form submission, file upload, real contact details, or customer-data mutation occurred.
- Browser testing is responsive desktop emulation, not physical iOS/Android certification. No conversion-rate or field-performance improvement is claimed without live measurement.
