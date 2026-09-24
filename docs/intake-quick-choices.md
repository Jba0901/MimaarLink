# Intake preference fields — 24 September 2026

## Current direction

Q chose the simplest interaction for values people may not know precisely: one normal text field plus one `Not sure` / `غير متأكد` shortcut. Owner start time, owner budget, and provider typical project size all use this same pattern.

There are no preset ranges, visual scales, sliders, modal pickers, or `optional` labels on these controls. People can type an answer in their own words or choose the single uncertainty shortcut.

## Shipped behavior

- Nothing is selected by default.
- Typing preserves free text exactly as entered.
- Choosing `Not sure` clears the visible text value and stores the existing localized uncertainty value.
- Focusing the text field after choosing `Not sure` clears the shortcut so the person can type immediately.
- Switching between Arabic and English keeps the uncertainty selection recognized without rewriting the submitted answer.
- The existing API field names and payload shapes remain unchanged.
- Arabic RTL, English LTR, light/dark themes, reduced motion, official palette, fonts, validation, uploads, and step navigation remain supported.

## Validation expectations

- Test `/post-project` and `/contractor` at 320px and 390px in Arabic and English.
- Verify typed values, the uncertainty toggle, focus-to-type behavior, language-switch persistence, keyboard focus, and no horizontal overflow.
- Run the production build and automated tests before release.
- Do not submit live forms, upload files, or use real customer information during QA.
