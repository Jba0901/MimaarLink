# MimaarLink Mobile Web App Design Roadmap

## Document Status

- Design owner: Jassim2, MimaarLink head designer/builder
- Decision owner: Q
- Updated: 2026-07-19
- Live baseline: `main` after the 2026-07-19 mobile homepage LCP checkpoint
- Purpose: turn the polished responsive website into an implementation-ready, Arabic-first mobile web application without weakening the public acquisition website

This roadmap separates what is already live, what is safe routine work, and what still requires Q's approval. It is a design and delivery plan; it does not claim that unbuilt product features already exist.

## Product Direction

MimaarLink should become a fast, trustworthy Qatar construction marketplace that is comfortable to use with one hand. On every app screen, the user should understand their current state and the next useful action within three seconds.

The public website remains the acquisition layer. The future mobile web application becomes the returning-user layer for project owners, contractors, and consultants. Admin remains a separate operations workspace.

## Verified Baseline

The following was verified from source and a successful production build on 2026-07-18:

- The current public `AppShell` uses three mobile destinations on applicable routes: Home, Post project, and Join as provider.
- Focused entry and form routes can hide public navigation while retaining the same header, language, appearance, spacing, and interaction rules.
- Existing project and provider flows already have reusable progress, status, upload, success, loading, empty, error, and missing-data patterns.
- The public flows are URL-driven and can be revisited through saved project or provider status links.
- There is no customer authentication, customer dashboard, live opportunity feed, notification center, service worker, web-app manifest, or install prompt yet.
- The role-aware app-shell proposal is a decision brief only on `design/mobile-app-shell-review`; it has no runtime code and no production effect.
- The palette-normalization proposal on `design/brand-palette-normalization-review` is a real global CSS change, but it is not merged.
- The production build passes. The current build reports 145 kB on the homepage, 150 kB on both `/post-project` and `/contractor`, 137-138 kB on project/provider status, 147 kB on bid comparison, and 87.2 kB shared by all routes. Post-submit panels, later-step upload/select controls, and desktop-only form guidance are deferred without changing the approved mobile form hierarchy, bringing both public forms back to the preferred 150 kB build line.

Rendered browser coverage now includes 240, 280, 320, 360, 390, and 430 px phones, 768 px tablet, the 1024 px desktop-navigation breakpoint, and 1280 px desktop; Arabic and English; light and dark themes; short-height keyboard conditions; focus and validation; reduced motion; and 200% reflow-equivalent checks at a 640×360 CSS viewport. Checked surfaces include the public shell and drawer, role selection, every owner and contractor/consultant onboarding step, populated project/provider status, populated bid comparison, dense admin lists and details, long bilingual records, large prices, file rows, mobile footer endings with and without the bottom navigation, the tracked-visit consent prompt on standard, compact, and short-landscape phones, stacked consent-plus-menu states at 240×320 and 320×568, missing/error states, slow local file preparation, an actually interrupted submission request with entered data retained, and live offline/reconnected events on both public forms. The remaining gaps are physical-device verification and real-user performance telemetry.

The compact-width coverage now also includes the homepage hero, fixed three-tab navigation, and footer ending at 240×568 in Arabic/RTL and English/LTR across light and dark themes.

The same 240×568 compact pass now covers role selection, all three owner-form steps, all three provider-form steps, privacy settings, and provider document validation in both language directions and themes. The form controls retain 44 px targets with no horizontal overflow. A 240×320 keyboard-height pass also confirmed that owner contact inputs remain visible when focused. Commit `5622b22` removes the duplicate floating toast from missing-CR validation because it overlapped the required upload card at that height; the existing focused inline error remains visible, translated, and announced in Arabic/light and English/dark.

Populated saved-link coverage now also reaches 240×568 for project status, provider status, and bid comparison using disposable local response fixtures with long bilingual names, locations, timelines, filenames, document checklists, mixed statuses, multiple bids, and very large prices. Project/provider headers, next actions, timelines, file links, stacked bid actions, fixed navigation, and 44 px targets remained contained in Arabic/light and English/dark. Commit `0963589` gives bid prices a deliberate ultra-compact treatment: the already currency-labelled price card hides its duplicate inline QAR unit below 320 px, and only the 240-class number size reduces to 18 px. This keeps 987,654,321 and 1,234,567,890 uninterrupted at 240 and 280 px while preserving the original 22 px number plus visible QAR at 320 px and above.

The role-specific acquisition landings at `/for-projects` and `/for-contractors` now have explicit compact coverage at 240×320, 240×568, 320×360, and 320×568 in both language directions and themes. Commit `eb8e5f9` removes the 240 px menu drawer's internal horizontal scrollbar, gives its quick actions enough width to keep bilingual labels readable, stacks secondary links at that width, and preserves 44 px interactive targets. The same checkpoint gives the ultra-short landing hero a deliberate 240-class type treatment so the owner and provider primary actions are fully visible without weakening the standard 240×568 hierarchy. Both acquisition routes remain 125 kB first-load in the production build.

### Production mobile lab checkpoint

The first repeatable production mobile lab audit was recorded on 2026-07-19 against `https://mimaarlink.com`. These are Lighthouse lab measurements, not field Core Web Vitals.

Before the mobile homepage optimization:

| Route | Performance | LCP | CLS | TBT | Transfer |
|---|---:|---:|---:|---:|---:|
| `/` | 83 | 4.19 s | 0 | 0 ms | 621 kB |
| `/post-project` | 98 | 2.43 s | 0 | 0 ms | 340 kB |
| `/contractor` | 98 | 2.44 s | 0 | 3 ms | 339 kB |

The homepage LCP was the decorative Qatar skyline band at the bottom of the first mobile viewport. Its image request transferred about 262 kB. Commit `d1e5748` keeps the skyline artwork on larger screens but replaces it on phones with a no-request navy/teal atmospheric gradient. The change passed 320 and 390 px Arabic/light and English/dark rendering, the production build, and a local mobile network audit confirming zero skyline-image requests.

Vercel subsequently promoted `d1e5748` and the `968c9ff` performance checkpoint. The live production stylesheet changed to `276b2f0e4b660f9c.css` plus `fb79fdaa6ffd9208.css`. Three fresh production mobile runs all made zero skyline-image requests; their median result was:

| Route | Performance | FCP | LCP | Speed Index | CLS | TBT | Transfer |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/` | 97 | 1.24 s | 2.59 s | 2.70 s | 0 | 0 ms | 359 kB |

Compared with the first production run, the deployed fix reduced homepage LCP by 1.60 seconds, about 38%, and transferred about 262 kB less, about 42%, while preserving zero layout shift and blocking time.

The remaining 2.59-second LCP was the market-section subtitle already inside the first phone viewport. Its Lighthouse breakdown attributed about 1.92 seconds to element render delay: the shared scroll-reveal pattern kept this text transparent until client-side intersection observation ran. Commit `75afbcf` removes that reveal only from the phone-sized market band, leaving tablet and desktop motion unchanged. It passed Arabic/light and English/dark rendering at 320 and 390 px and a production build.

Vercel promoted `75afbcf` through the later `291a82a` checkpoint, changing the live production stylesheet to `c71a82944cfd2e5d.css` plus `fb79fdaa6ffd9208.css`. Three production mobile runs after that promotion produced this median:

| Route | Performance | FCP | LCP | Speed Index | CLS | TBT | Transfer |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/` | 95 | 1.50 s | 2.66 s | 3.10 s | 0.004 | 7 ms | 359 kB |

The trace-observed median paint improved from 2.11 seconds to 1.73 seconds, about 18%, and its median reveal delay fell from 1.98 seconds to 1.57 seconds. The throttling-model headline LCP remained above the 2.5-second target and varied from 2.59 to 2.70 seconds, so the target stayed open. Making the counters visible sooner also exposed a very small layout shift from their mobile count-up animation. Commit `a922144` keeps those counters static on phones while preserving their final values and desktop animation.

Vercel promoted `a922144` through the later `fe8e033` footer-continuity checkpoint. Production changed to `d3400c48e23dafdc.css` plus `fb79fdaa6ffd9208.css`. Three production mobile runs after that promotion produced this median:

| Route | Performance | FCP | LCP | Trace-observed LCP | Speed Index | CLS | TBT | Transfer |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `/` | 96 | 1.23 s | 2.58 s | 1.50 s | 2.83 s | 0.00027 | 0 ms | 359 kB |

Commit `fe8e033` also moves the mobile-navigation reserve inside the footer surface when a footer is present. This removes the trailing white strip below the navy footer while keeping the same protected scroll space above the fixed navigation. It passed Arabic/light and English/dark rendering at 360×800 and 430×932, the 1024 px desktop-navigation breakpoint, footer pages with and without mobile navigation, and the production build.

Commit `ebfccb5` aligns the tracked-visit consent prompt with the existing 240×320 compact-mode rule that hides the bottom navigation. The prompt now uses the released navigation space instead of reserving an empty 5.75-rem gap, keeping its sticky accept/decline actions reachable and reducing unnecessary internal scrolling. It passed Arabic and English rendering at 240×320, the unaffected 320×568 and 390×720 phone layouts, the 640×360 short-landscape rule, and the production build.

Vercel promoted `ebfccb5` through `b101fdc`, changing production to `a3d5eadd80558171.css` plus `fb79fdaa6ffd9208.css`; the live stylesheet contains the compact consent rule. Commit `b101fdc` also strengthens the light-theme menu backdrop from 35% to 45% navy so bright fixed controls, including consent, recede cleanly behind the modal drawer. The menu remains above consent at its existing layer, and the combined state passed Arabic/RTL and English/LTR rendering at 240×320 and 320×568 in light and dark themes, including the top and scrolled drawer content.

Commit `c809a66` removes a separate 240×568 homepage overflow caused by the hero badge and action group imposing their minimum-content width on the one-column grid. The hero column can now shrink to the available inline space and the badge wraps within it. Arabic/RTL and English/LTR passed at 240×568 in light and dark themes with no horizontal overflow; the three-tab navigation remained readable, the privacy/footer ending cleared the fixed navigation, and the standard 390×844 Arabic/light layout remained unchanged. The production build passed with the same 145 kB homepage and 150 kB public-form first-load sizes. The direct deployment attempt was rate-limited, but Vercel then promoted the later `a0a9ed` documentation checkpoint containing the fix. A cache-bypassed production response returned HTTP 200 and contained both the bounded hero grid and badge classes, so the visual correction is live.

The animated-counter shift is gone. The remaining negligible layout shift came from the market source line, not a counter, and remained far below the 0.1 acceptance limit. At that checkpoint, the headline LCP median was about 84 ms above the 2.5-second target even though the trace-observed median was 1.50 seconds.

A fresh three-run production audit after the compact-hero promotion produced the first passing headline median without another source change:

| Route | Performance | FCP | LCP | Trace-observed LCP | Speed Index | CLS | TBT | Transfer |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `/` | 97 | 1.24 s | 2.476 s | 1.321 s | 2.39 s | 0.00027 | 0 ms | 358.5 kB |

All three runs scored 97, the individual headline LCP results were 2.542, 2.441, and 2.476 seconds, and none requested the removed mobile skyline image. The three-run median is 24 ms below the 2.5-second lab target, so the agreed mobile lab LCP checkpoint now passes. The margin is narrow and remains a lab result; future visual work must preserve it and project-owned field telemetry is still required before claiming real-user Core Web Vitals acceptance.

PageSpeed field data was also unavailable because the public endpoint returned HTTP 429, and no project-owned real-user telemetry was found. Therefore LCP, INP, and CLS acceptance is not yet proven from real users.

## Non-Negotiable Design Rules

- Start at 320 px; use 390 px as the primary design canvas.
- Design Arabic and RTL first, then verify equal hierarchy and usability in English and LTR.
- Keep the official logo unchanged.
- Use only the approved MimaarLink palette: navy `#152B54`, deep navy `#0D1B2A`, teal `#00B59E`, mint `#D0F2EE`, amber `#FFB638`, error `#EF4444`, info `#38BDF8`, soft `#F5F4F1`, white, muted `#5F6B7A`, and border `#E3E7EA`.
- Keep interactive targets at least 44 px; primary mobile actions should normally be at least 48 px tall.
- Present one dominant action per screen and keep secondary actions visually quieter.
- Reuse current components and data shapes before introducing new patterns.
- Use short, literal labels. Do not imply that an opportunity, notification, account, or real-time update exists when it does not.
- Keep motion subtle, non-blocking, and fully disabled when reduced motion is requested.
- Do not let installation, offline behavior, or app chrome interfere with project submission, provider application, or saved-link return journeys.

## Screen Inventory

### Current and reusable screens

| Audience | Surface | Current route | Readiness | Primary action in the app |
|---|---|---|---|---|
| Public | Marketing home | `/` | Live website surface | Choose the correct journey |
| Public | Project-owner introduction | `/for-projects` | Live acquisition surface | Post a project |
| Public | Contractor introduction | `/for-contractors` | Live acquisition surface | Join as a contractor |
| Shared | Role selection | `/start-here` | Ready to reuse | Continue as owner, contractor, or consultant |
| Owner | New project | `/post-project` | Functional flow; app-shell integration pending | Submit project details |
| Owner | Project status | `/project/[id]` | Functional saved-link flow | Complete or review the next step |
| Owner | Bid comparison | `/bids/[projectId]` | Functional contextual flow | Review the most suitable bid |
| Provider | Application | `/contractor` | Functional contractor/consultant flow | Submit company details |
| Provider | Application status | `/contractor-status/[id]` | Functional saved-link flow | Resolve the next document or review step |
| Shared | Privacy and measurement | `/privacy` | Live website surface | Review or change consent |
| Operations | Admin | `/admin` and detail routes | Responsive internal workspace | Operate projects and providers |

### Verified onboarding screen decomposition

This is the implementation-level screen inventory for the current mobile journeys. It was rendered at 320×568 and 390×720, with additional 320×360 short-height checks, in Arabic/RTL and English/LTR across light and dark themes. Validation was exercised without sending any project or provider submission.

| Audience | Screen | Current route/state | Primary action | Future app treatment |
|---|---|---|---|---|
| Shared | Choose journey | `/start-here` | Continue as owner, contractor, or consultant | Reuse as the truthful first-run role choice until customer identity exists |
| Owner | Choose project type | `/post-project`, step 1 | Select the closest category | Reuse unchanged inside the owner task flow |
| Owner | Scope and attachments | `/post-project`, step 2 | Describe the required work and continue | Reuse; keep optional location, timing, budget, and files subordinate to the required description |
| Owner | Contact details | `/post-project`, step 3 | Submit the project | Reuse; show one contact heading through the progress card and keep validation focus visible above the keyboard |
| Owner | Saved-link handoff | `/post-project`, completion | Save or open the project-status link | Reuse until an approved returning-customer identity replaces saved-link return |
| Provider | Identity and provider type | `/contractor`, step 1 | Enter legal company and contact details | Reuse for contractors and consultants with the selected role made explicit |
| Provider | Services and coverage | `/contractor`, step 2 | Choose actual services and continue | Reuse; consultant grade remains a consultant-only control |
| Provider | Verification documents | `/contractor`, step 3 | Submit the provider application | Reuse; CR stays the only required document at this stage and validation must focus its upload control |
| Provider | Saved-link handoff | `/contractor`, completion | Save or open the provider-status link | Reuse until the approved return model exists |

The future role-aware app shell should wrap these task screens only after approval. It must not merge steps, invent accounts, or replace the current saved-link handoff before the Phase 2 identity decision.

### New app surfaces that do not exist yet

| Audience | Proposed surface | Phase | Truthful Phase 1 content |
|---|---|---|---|
| Owner | Overview | App-shell prototype | Representative project status, next step, provider count, and bid summary |
| Provider | Overview | App-shell prototype | Representative application status, document checklist, and next step |
| Provider | Opportunities | App-shell prototype | Explicit readiness or empty state only; no invented projects |
| Provider | Profile | App-shell prototype | Representative company, service, area, and document summary |
| Shared | Support | App-shell prototype | Existing phone, email, WhatsApp, and Instagram channels |
| Shared | App menu | App-shell prototype | Language, appearance, support, and prototype role switch |
| Shared | Customer identity and return | Product decision before production MVP | Not designed or approved |
| Shared | Notifications | Later approved expansion | Not designed or approved |

Admin must not enter the customer bottom navigation. Marketing pages can link into the app journeys, but they should not be forced into authenticated-looking app chrome.

## Navigation Model

### Live website navigation

Keep the current public mobile navigation on `main`: Home, Post project, and Join as provider. It is an acquisition navigation pattern, not the future role-aware customer app shell.

### Recommended app navigation — approval required

The review brief recommends three destinations per role:

**Project owner**

1. Overview
2. New project
3. Support

Bids remain contextual to a selected project through `/project/[id]` to `/bids/[projectId]`. This avoids an empty permanent Bids tab for owners who have no active project.

**Contractor or consultant**

1. Overview
2. Opportunities
3. Profile

Support remains in the menu and contextual cards for providers. Opportunities must show a truthful readiness or empty state until a live feed is approved and built.

The recommended shell uses a compact app bar and a three-item bottom navigation with a minimum 56 px visual height plus the device safe-area inset. It does not include a notification bell, floating center action, five-tab dock, chat, payments, or account controls.

This model is documented at commit `b67c794` on `design/mobile-app-shell-review`. It is not approved, implemented, or merged.

## Reusable Pattern Inventory On `main`

| Pattern | Current source | App use |
|---|---|---|
| Public shell, header, drawer, theme/language, footer | `components/AppShell.jsx` | Keep as acquisition shell; extract shared brand/header rules for the app shell |
| Step progress | `components/FormProgress.jsx` | Project and provider task flows |
| File selection and validation | `components/FileUploadDropzone.jsx` | Project attachments and provider documents |
| Field feedback | `components/InlineFieldMessage.jsx` | Validation, recovery, and upload guidance |
| Connectivity status | `components/NetworkStatusNotice.jsx` | Truthful offline and reconnected feedback on submission journeys |
| Loading, empty, error, missing | `components/PageState.jsx` | Every route and data boundary |
| Submission completion | `components/SuccessPanel.jsx` | Saved-link handoff and next action |
| Status progression | `components/StatusTimeline.jsx` | Owner project and provider application overview |
| Semantic status | `components/StatusBadge.jsx` | Cards, summaries, lists, and details |
| Consent controls | `components/MarketingConsentSettings.jsx` | App settings only if product scope later includes it |
| Dialogs, alerts, sheets, selects, tabs, toast | `components/ui/` | Phone-safe overlays, menus, choices, and feedback |

The app shell should configure role-specific navigation and content without duplicating these patterns or creating a second visual system.

## Mobile Layout Contract

- App bar: compact, safe-area aware, official logo, current role, and one menu control.
- Content gutter: 16 px at the smallest phone sizes, expanding only when the content benefits.
- Main canvas: soft background in light mode; deep background in dark mode.
- Primary task card: first meaningful content after the app bar.
- Cards: rounded, business-like, restrained shadow, clear border, no decorative density.
- Type: Cairo for Arabic, Inter for English; 14-16 px body, 12-14 px helper text, clear 20-28 px screen titles.
- Bottom navigation: three equal destinations, 20 px icons, 11-12 px bold labels, active state visible without relying on color alone, safe-area padding.
- Form actions: full-width on small phones; sticky actions only when they do not cover fields, validation, consent, or browser controls.
- Dense comparisons: switch to stacked summaries before shrinking text or touch targets.
- Desktop/tablet: preserve centered content and useful width; do not stretch mobile cards into sparse full-width panels.

## State And Edge-Case Contract

Every core journey must deliberately design and verify:

- Initial loading, delayed loading, empty, missing, validation error, server error, and successful completion.
- Slow or interrupted upload, rejected file type or size, long filename, retry, and removal.
- Long Arabic names, locations, company names, category labels, bid notes, and translated action labels.
- Browser Back and Forward, refresh, direct deep-link entry, copied saved links, and an expired or invalid identifier.
- Partially completed forms and accidental navigation. The product must decide whether progress is stored locally, on the server, or not at all before the UI promises recovery.
- Offline entry and connection loss. Until a real synchronization model exists, show a clear offline state and never imply that a submission or upload was saved.
- External WhatsApp, phone, email, and Instagram actions. Clearly indicate external transitions and preserve the user's current app state.
- Keyboard appearance, small viewport height, device safe areas, 200% browser zoom, reduced motion, and focus visibility.

## Delivery Sequence

### Phase 0A — Website foundation

Status: source-complete for the current visual sweep; rendered QA remains open.

- Maintain the existing mobile-first website and acquisition navigation.
- Continue only routine visual fixes, responsive corrections, accessibility improvements, and shared-component cleanup on `main`.
- Keep public forms focused and avoid adding app-like chrome before the shell decision is approved.

### Phase 0B — Pre-app hardening

Status: in progress. Populated public records, the complete onboarding screen inventory, the public-form bundle pass, 200% reflow checks, dense-admin stress QA, slow file-preparation presentation, interrupted-submission recovery, explicit offline/reconnected form states, and the first production mobile lab audit were completed on 2026-07-19.

1. Complete the remaining real-device verification when a physical device bridge is available.
2. Preserve the passing 2.476-second three-run production median and re-test after any first-viewport, font, motion, or critical-request change; do not reintroduce mobile skyline image weight or delayed market text.
3. Add or obtain project-owned real-user telemetry before claiming field LCP, INP, or CLS targets.
4. Record and fix only evidence-backed overflow, hierarchy, spacing, focus, contrast, touch, and loading issues.
5. Keep `/post-project` and `/contractor` at or below the preferred 150 kB first-load build line, and prevent admin-only interaction systems from returning to public form bundles.
6. Preserve the verified interrupted-submission, invalid-link, slow file-preparation, and offline/reconnected states without implying that unsent work was saved.
7. Keep PWA installation and caching out of this phase.

### Phase 1 — Role-aware shell prototype

Status: blocked by the app-shell direction approval, not by implementation readiness.

After Q approves the direction:

1. Refresh `design/mobile-app-shell-review` onto the latest `main` before adding runtime code.
2. Build Arabic/RTL first: compact app bar, role chip, menu, content canvas, and three-tab bottom navigation.
3. Prototype owner Overview, New project, Support, project detail, and contextual bids using representative existing data shapes.
4. Prototype provider Overview, Opportunities readiness state, Profile, application, and application status.
5. Reuse the current state, timeline, badge, upload, form, and success components.
6. Keep all data representative or explicitly marked as a demo where customer identity is unavailable.
7. Verify mobile, tablet, desktop, Arabic, English, light, dark, keyboard, touch, and reduced-motion presentation.
8. Push the prototype only to the review branch. Q reviews it before any merge request.

Approval of the direction authorizes prototype work; it does not authorize merging the prototype to `main`.

### Phase 2 — Production mobile web-app MVP

Status: begins only after prototype review and separate product decisions.

Required decisions before implementation:

- How a returning owner or provider is identified: current saved links, approved passwordless access, or another explicitly approved model.
- Whether one person can hold multiple roles and how switching works.
- Which records appear in Overview when there are multiple projects or applications.
- Whether provider Opportunities remains a readiness screen or becomes a real data feed.
- The final route structure and what public pages remain outside the app shell.

Once approved:

1. Implement the approved shell against real existing flows.
2. Preserve direct saved-link access and trustworthy missing/error states.
3. Add only the minimum data behavior needed for the selected return model.
4. Meet the visual, accessibility, state, and performance acceptance criteria below.
5. Deliver the production integration on a review branch because it changes the global navigation architecture.
6. Merge only after Q reviews and explicitly approves that implementation.

### Phase 2B — Installable web app

Add installable behavior only after the core owner and provider journeys are stable:

- Add a manifest, icons derived from approved brand assets, theme colors, and standalone display behavior.
- Cache only safe static assets and deliberately approved read-only screens.
- Do not queue submissions, uploads, bids, or profile changes offline without a separately designed synchronization model.
- Test update behavior, stale content, install prompts, standalone safe areas, and removal/reinstallation.

### Phase 3 — Approved expansion

Potential later work includes notifications, live provider opportunities, richer bid tools, account settings, and future native-app adaptation. Each product area receives its own user-flow decision, visual review, and backend readiness check before it enters the shell.

## Acceptance Criteria

### Visual and interaction

- The primary action and current status are understandable within three seconds.
- No horizontal overflow at 320, 360, 390, or 430 px.
- Arabic and English preserve the same priority, not necessarily identical line breaks.
- Every interactive target is at least 44 px and every state is keyboard reachable.
- Bottom navigation does not cover content, validation, consent, toast feedback, or device safe areas.
- Long content wraps or truncates intentionally, with critical identifiers still available.
- Light and dark themes use the official palette and retain readable contrast.
- Reduced motion removes nonessential transition and animation.

### Product truth

- No demo state is mistaken for live customer data.
- No unsaved submission is described as saved.
- Opportunities, notifications, account access, and offline behavior are only exposed when their real behavior exists.
- Bids remain attached to a project; provider status remains attached to the application until an approved account model changes that structure.

### Performance

- Largest Contentful Paint below 2.5 seconds on the agreed mobile test profile.
- Interaction to Next Paint below 200 ms.
- Cumulative Layout Shift below 0.1.
- Public and customer-app route first-load JavaScript below 150 kB where practical; any exception is documented with the user-facing reason.
- No heavy chart, map, carousel, or animation dependency without a demonstrated need.
- Decorative motion never delays input, scrolling, navigation, or submission.

LCP, INP, and CLS require runtime measurement; a production build alone cannot verify them.

## QA Matrix

| Dimension | Required coverage |
|---|---|
| Viewports | 320 x 568, 360 x 800, 390 x 844, 430 x 932, 768 px tablet, 1280 px desktop |
| Language direction | Arabic/RTL and English/LTR |
| Theme | Light and dark |
| Input | Touch, keyboard, file picker, browser Back/Forward |
| Accessibility | Visible focus, reduced motion, 200% zoom, semantic labels, status not conveyed by color alone |
| Content stress | Long Arabic and English labels, filenames, company names, locations, notes, and empty data |
| Network/state | Delayed data, failed data, offline entry, interrupted upload, retry, refresh, invalid saved link |
| App mode | Normal browser and, after Phase 2B, installed standalone mode |

## Approval Gates

| Decision | Review artifact | Current state | Approval |
|---|---|---|---|
| Role-aware three-tab app shell and demo-first prototype | `design/mobile-app-shell-review` at `b67c794` | Decision brief only; branch is behind `main` | Reply: **Approve the recommended Phase 1 app shell.** |
| Global official-palette token normalization | `design/brand-palette-normalization-review` at `6db8ea6` | CSS proposal only; not merged | Reply: **Approve the global brand palette normalization.** |
| Customer identity, multiple records, role switching, and production route model | Future decision brief | Not designed | Q approval required before Phase 2 implementation |
| Notifications, live opportunities, offline mutation, chat, payments, contracts, ratings, or maps | Separate future scopes | Not approved | Individual product and design approval required |

The two current review branches are independent. Approval of one does not approve the other. Both branches must be refreshed against the latest `main` before implementation or merge so recent mobile fixes are preserved.

## Change Policy

Routine visual fixes, responsive corrections, accessibility improvements, performance cleanup, state consistency, and reusable-component refinements can be verified, committed, and pushed directly to `main`.

Major changes — including app navigation, customer dashboards, account structure, new global palette or typography, homepage replacement, or major journey reorganization — must remain on a separate review branch. Q must approve the direction before build-out and approve the finished implementation before merge.
