# MimaarLink Mobile Web App Design Roadmap

## Document Status

- Design owner: Jassim2, MimaarLink head designer/builder
- Decision owner: Q
- Updated: 2026-07-18
- Live baseline: `main` at `bcb8f17`
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
- The production build passes. Current first-load JavaScript is 139 kB on the homepage, 118-140 kB on most public journey pages, 172 kB on both `/post-project` and `/contractor`, and 87.1 kB shared by all routes.

A first rendered browser pass now covers 320 px Arabic and English, 390 px Arabic, light and dark themes, the public mobile navigation and drawer, role selection, owner entry, contractor/consultant entry, and a missing-project state. That pass fixed RTL step numbering, small-phone dock labels, and the narrow dark-theme control. The complete viewport, state, keyboard, network, and real-device matrix remains open.

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
| Shared | Role selection | `/start-here` | Ready to reuse | Continue as owner, contractor, or consultant |
| Owner | New project | `/post-project` | Functional flow; app-shell integration pending | Submit project details |
| Owner | Project status | `/project/[id]` | Functional saved-link flow | Complete or review the next step |
| Owner | Bid comparison | `/bids/[projectId]` | Functional contextual flow | Review the most suitable bid |
| Provider | Application | `/contractor` | Functional contractor/consultant flow | Submit company details |
| Provider | Application status | `/contractor-status/[id]` | Functional saved-link flow | Resolve the next document or review step |
| Shared | Privacy and measurement | `/privacy` | Live website surface | Review or change consent |
| Operations | Admin | `/admin` and detail routes | Responsive internal workspace | Operate projects and providers |

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

Status: next routine work before production app integration.

1. Complete rendered QA across the current public journeys using the required size, language, theme, and interaction matrix.
2. Record and fix only evidence-backed overflow, hierarchy, spacing, focus, contrast, and touch issues.
3. Reduce the `/post-project` and `/contractor` first-load bundles from 172 kB toward the 150 kB public-route target without weakening form feedback or uploads.
4. Define visual states for interrupted forms, invalid saved links, offline entry, and slow uploads.
5. Keep PWA installation and caching out of this phase.

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
