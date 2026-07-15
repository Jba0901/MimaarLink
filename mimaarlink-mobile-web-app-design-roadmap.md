# MimaarLink Mobile Web App Design Roadmap

## Product Direction

MimaarLink should evolve from the current responsive website into a simple Arabic-first mobile web application without breaking the existing public acquisition paths.

The design goal is a fast, trustworthy Qatar construction marketplace that works comfortably with one hand and makes the next action obvious within three seconds.

## Standing Design Rules

- Mobile first, starting at 320 px and using 390 px as the main design canvas.
- Arabic and RTL are the default; English and LTR must receive equal QA.
- Keep the official logo and approved navy, teal, light teal, amber, white, soft background, muted text, and border colors.
- Use 44 px minimum interactive targets and short, direct labels.
- Prefer one clear primary action per screen.
- Keep motion subtle, optional, and disabled when reduced motion is requested.
- Reuse the current website structure and components before adding new patterns.

## Existing Routes To Reuse

| Current route | Future mobile-app role |
|---|---|
| `/start-here` | Role and journey selection |
| `/post-project` | New project flow |
| `/project/[id]` | Project status and progress |
| `/bids/[projectId]` | Bid review and comparison |
| `/contractor` | Contractor or consultant application |
| `/contractor-status/[id]` | Provider application status |
| `/admin` | Separate responsive operations workspace |

`AppShell`, `FormProgress`, status patterns, upload areas, project cards, provider cards, and bid rows should become the first shared app components.

## Website Foundation Implemented

- The homepage, bid comparison, and public status journeys now share a clear three-destination mobile navigation pattern through `AppShell`.
- Project and provider progress now use one reusable `StatusTimeline` component with a distinct current step, completed steps, and upcoming steps.
- Bid summary cards and actions adapt at 360 px and 390 px so Arabic and English labels have enough room without awkward wrapping.
- Focused acquisition and form routes can intentionally hide the bottom navigation while retaining the same header, brand, and interaction rules.
- Dynamic routes and admin lists now use one localized `PageState` pattern for loading, empty, and missing-data states instead of blank screens or bare spinners.
- Dialogs, confirmation alerts, and the future drawer primitive now share phone-safe margins, rounded surfaces, readable RTL/LTR headers, full-width mobile actions, and 44 px close controls.
- Project and provider submissions now end in one reusable `SuccessPanel` with a consistent saved-link block, touch-safe copy control, and direct status action.
- Toast feedback now follows MimaarLink's actual light/dark mode, official success/warning/error colors, and a header-safe mobile offset instead of a separate theme system.
- Selects, option menus, admin tabs, and mobile sheets now share 44 px touch targets, rounded MimaarLink surfaces, official focus colors, and RTL-safe spacing.
- Text fields, text areas, phone inputs, file uploads, and default cards now share one touch-safe form language with clear error states and a reusable keyboard-accessible upload dropzone.
- Admin list and detail screens now suppress public navigation chrome, surface status at the top, use RTL-correct directional cues, and stack dense actions safely on phones.
- Public and admin status badges now use one semantic color map, while success, warning, error, download, checklist, and bid-comparison chips share the same readable mobile badge system.
- The homepage FAQ now uses one accessible reusable accordion with large mobile rows, 40 px brand icon tiles, keyboard navigation, and visible focus; contact actions share the same focus language.
- Shared navigation now exposes active-page state, keeps brand and desktop links at least 44 px tall, localizes the language control, and honors reduced-motion preferences across every transition and animation.
- Campaign landing pages now use compact mobile benefit rows, a connected vertical process, and passive category tags; privacy and measurement surfaces share the same touch-safe hierarchy and avoid covering the homepage app navigation.
- Project and provider forms now keep guidance and validation at least 12 px, stack provider-role choices below 420 px, and delay two-column service options until 360 px so Arabic and English remain readable on the smallest supported phone.
- The homepage process now becomes a connected RTL-safe vertical journey on phones, and its trust benefits become compact icon-and-copy rows while retaining the established desktop grids.
- Mobile app navigation now uses an 11 px label floor with 19 px icons, while the last 10 px admin metadata labels use readable badges or 12 px descriptions and dense bid chips wrap safely on narrow screens.

These are reusable website primitives for the future app. They do not approve or lock the authenticated app dashboard, account model, notification model, or final app navigation architecture.

## Proposed Mobile Information Architecture

### Project owner journey

1. Start and choose project owner.
2. Post a project in short steps.
3. View project status and required follow-ups.
4. Review matched providers and compare bids.
5. Contact MimaarLink when coordination is needed.

### Contractor or consultant journey

1. Choose provider type.
2. Complete the company application in short steps.
3. View application and document status.
4. Review suitable opportunities when this capability is ready.
5. Submit or update bid information when this capability is ready.

### Shared app surfaces

- Language and appearance settings.
- Notifications and status updates.
- Contact and support.
- Clear loading, empty, success, warning, and error states.

Authentication, persistent dashboards, provider opportunity feeds, and the future authenticated app's final navigation structure are major product decisions and require Q's approval before implementation.

## Delivery Phases

### Phase 0 — Website foundation now

- Keep every public page responsive and visually consistent.
- Normalize design tokens and interaction patterns.
- Improve forms, statuses, loading states, and touch behavior.
- Maintain a clean component foundation that can move into the app shell.

### Phase 1 — Reviewable app-shell prototype

- Build the shell and core screen map on a separate `design/` branch.
- Prototype the owner and provider journeys with existing data structures.
- Review navigation, hierarchy, and screen density with Q before merging.

### Phase 2 — Mobile web application MVP

- Implement the approved shell and journeys.
- Add installable-web-app behavior only after the core flows are stable.
- Validate slow connections, interrupted forms, uploads, and return visits.

### Phase 3 — Product expansion

- Add approved dashboards, notifications, opportunity feeds, and richer bid comparison.
- Extend the same design system to later native applications if needed.

## Visual QA Matrix

- 320 × 568 small phone.
- 360 × 800 common Android phone.
- 390 × 844 primary mobile canvas.
- 430 × 932 large phone.
- 768 px tablet.
- 1280 px desktop.
- Arabic and English.
- Light and dark themes.
- Touch, keyboard, reduced motion, and browser zoom.

## Performance Targets

- Largest Contentful Paint below 2.5 seconds on a typical mobile connection.
- Interaction to Next Paint below 200 ms.
- Cumulative Layout Shift below 0.1.
- Public-route first-load JavaScript below 150 kB where practical.
- No decorative animation should block input, scrolling, or form completion.

## Change And Approval Policy

Routine visual fixes, responsive corrections, accessibility improvements, token cleanup, and component consistency can be implemented, verified, committed, and pushed directly.

Major redesigns—including a new homepage direction, new navigation architecture, new brand palette or typography, app dashboard structure, or major journey reorganization—must be built on a separate review branch and merged only after Q approves it.
