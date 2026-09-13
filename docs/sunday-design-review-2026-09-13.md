# Sunday design review - September 13, 2026

Baseline: review branch `design/sites-warmth-review` at `04f0039`; production remains `40bcaea`.

## Completed narrow polish

1. **Informative upload loading state.** On the deployed review at 320px, the provider's optional-profile step briefly rendered a blank white 92px fallback before the lazy upload component arrived. The shared fallback now immediately shows the localized label, file guidance, upload icon, and dashed control outline. A throttled local 3G check confirmed the fallback remains understandable while the chunk loads. This improves both provider profile and owner project-file upload steps without adding the component to the initial route bundle.
2. **Narrow timeline hint.** The English `e.g., Start in 2 weeks, finish in 1 month` and Arabic equivalent clipped inside the 320px single-line field. The examples now state only `Start in 2 weeks` / `البدء خلال أسبوعين`, preserving the field purpose while fitting both scripts.
3. **Full phone touch height.** The WhatsApp input element measured 42px inside a 44px shell at 320px. Its own minimum height is now 44px.

No claims, application logic, file limits, consent/tracking, font, logo asset, palette, route, or dependency changed.

## Ranked remaining priorities

1. **Approval-gated provider trust wording - verified.** The page headline is `Join as a verified contractor` / `انضم كمقاول موثوق`, but the same flow says the profile is reviewed and the CR number is verified after submission. Recommended neutral replacement: `Apply as a contractor` / `قدّم كمقاول`. This is a public-claim change, so it was not changed in this visual pass; Q and the marketing owner should approve the exact bilingual wording.
2. **Fresh-consent-state mobile regression - unverified in this pass.** The agent-owned preview browser retained a prior consent choice, and supported browser controls could not clear that origin's storage. The compact consent treatment was previously validated, but a genuinely fresh browser profile should recheck the paid-social `/post-project` entry before ad activation.
3. **Physical devices and field performance - unverified.** Browser emulation covered 320/390/1440px, but real iOS Safari, Android Chrome, and real-user performance telemetry remain separate checkpoints.

## Evidence

- Production build passed: homepage 6.53 kB route, 143 kB first-load JS; shared JS 87.2 kB. Build figures are not real-user performance measurements.
- 28/28 automated tests passed across admin auth, typography, language, interaction, brand-mark, and form visual-polish suites.
- 48 final route layouts: homepage, start-here, post-project, and contractor; Arabic/English; light/dark; 320/390/1440px. No horizontal overflow, invisible H1, or visible interactive control below 44px.
- Visual captures inspected: Arabic 390px homepage, Arabic 390px start-here, Arabic 390px owner form, English 320px provider steps 1-3, English/Arabic 320px project details, and Arabic dark 320px project details.
- Reduced motion: no active animations and heading opacity 1. Focused local runtime warning/error log empty.
- Provider steps were reached with synthetic local QA values; no submit/upload action or production record was created.

Files changed in this Sunday pass: `components/LazyFormControls.jsx`, `app/contractor/page.js`, `lib/i18n.js`, `tests/form-visual-polish.test.mjs`, and this review note.
