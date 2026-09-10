# Thursday visual QA - September 10, 2026

Review branch: `design/sites-warmth-review`. Production remains `40bcaea`.
This review requires fresh Q approval before any main merge or production deployment.

## Narrow changes

- Remove image drop-shadow/glow filters. Preserve all three official logo binaries, dimensions, colors, and aspect ratio.
- Add a flat soft-background (`#F5F4F1`) backing on dark header/drawer surfaces and the always-dark footer. The backing does not intercept clicks or change layout dimensions.
- Give secondary drawer links slightly more text room below 360px. This fixes the observed 320px English mid-word split in "contractors" without changing the wording or font.
- Transfer drawer focus with a cancellable zero-delay timer after the opening input event, rather than waiting for requestAnimationFrame. During hidden-browser reduced-motion QA, the frame-dependent path left focus outside the open drawer. Final keyboard checks pass.

IBM Plex Sans Arabic and Manrope, public claims, form/application flow, consent/tracking, logo assets, and official palette are unchanged. No dependencies added.

## Validation

- Final production build passed. Homepage route 6.53 kB, reported first-load JS 144 kB; shared JS 87.2 kB. These are build figures, not real-user performance measurements.
- 25/25 tests passed across admin-auth, typography, language, interaction-polish, and brand-mark suites. Logo binary hash guards passed.
- Final 64-case rendered matrix: homepage, start-here, post-project, contractor; Arabic/English; light/dark; 320/390/768/1440px, height 844px. No horizontal overflow, logo filters, or image/wrapper size mismatch.
- Screenshots inspected: English desktop homepage/footer, English 320px light drawer, Arabic 320/390px dark drawer. The narrow English label now wraps at word boundaries.
- Reduced-motion Arabic and English: headline remains visible, logo has no animation, menu focuses its Close control, Escape restores opener focus. Shift+Tab/Tab wrap within the drawer verified.
- Focused local browser warning/error log empty. Local HTTP routes served successfully. No application, upload, or production record was submitted.

## Remaining checkpoint

Review the deployed preview, particularly the small neutral logo backing in dark mode. No unresolved defect found in this bounded review. Physical-device Safari/Android testing and real-user performance telemetry were not performed; browser viewport emulation is not a substitute for those.

Files: `app/globals.css`, `components/AppShell.jsx`, `tests/brand-mark.test.mjs`, this review note.
