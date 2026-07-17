# MimaarLink Mobile App Shell — Phase 1 Review Brief

## Review Status

- Branch: `design/mobile-app-shell-review`
- Decision owner: Q
- Recommendation owner: MimaarLink head designer/builder
- Current state: decision brief only
- Production effect: none
- Merge status: do not merge until Q approves the direction and later reviews the visual prototype

## Executive Recommendation

Build a visual-only, role-aware mobile app-shell prototype on this review branch before adding customer authentication, notifications, or a live opportunity feed.

The recommended shell has three bottom destinations per role. Three destinations keep Arabic labels readable at 320 px, keep the primary task within thumb reach, and avoid turning the first app version into a crowded dashboard.

### Project owner navigation

1. **Overview** — latest project, current status, required next step, and bid summary.
2. **New project** — the existing `/post-project` step flow.
3. **Support** — MimaarLink contact and coordination options.

Bids stay contextual to a selected project rather than becoming a permanent global tab. This matches the current `/project/[id]` → `/bids/[projectId]` relationship and avoids an empty Bids destination for owners with no active project.

### Contractor or consultant navigation

1. **Overview** — application status, document checklist, and next required action.
2. **Opportunities** — a truthful empty/readiness state until a real opportunity feed exists.
3. **Profile** — provider type, services, areas, company information, and documents.

Support remains available from the menu and contextual cards. It does not consume a permanent provider tab.

## Why This Direction

- It reuses MimaarLink's real owner and provider journeys instead of inventing a generic marketplace dashboard.
- It supports one-handed use and short Arabic labels.
- It preserves the current public acquisition website and introduces the app as a later layer.
- It allows a useful prototype before customer authentication is designed.
- It keeps bids tied to projects and opportunities tied to providers, matching the current data structure.
- It can expand later without committing Phase 1 to notifications, chat, payments, or complex account settings.

## Current-State Truth

- Project owners currently post through `/post-project` and return through a saved `/project/[id]` status link.
- Bid comparison is project-specific at `/bids/[projectId]`.
- Contractors and consultants currently apply through `/contractor` and return through `/contractor-status/[id]`.
- The website has an authenticated admin area, but it does not yet have customer owner/provider accounts.
- Therefore, Phase 1 should demonstrate navigation and hierarchy with existing data shapes; it must not imply that customer accounts, notifications, or opportunity feeds already work.

## Mobile Shell Wireframes

### Project owner overview

```text
┌──────────────────────────────────┐
│ MimaarLink      Project owner  ☰ │
├──────────────────────────────────┤
│ Good morning                      │
│ Your project at a glance          │
│                                   │
│ ┌──────────────────────────────┐  │
│ │ Villa renovation             │  │
│ │ Contractors invited          │  │
│ │ ●━━━━●━━━━○━━━━○             │  │
│ │ Next: wait for clear bids    │  │
│ └──────────────────────────────┘  │
│                                   │
│ ┌──────────────┐ ┌─────────────┐ │
│ │ 3 providers  │ │ 0 bids yet  │ │
│ └──────────────┘ └─────────────┘ │
│                                   │
│ [ Post another project ]          │
│ Need help? Contact MimaarLink      │
├──────────────────────────────────┤
│  Overview   New project   Support │
└──────────────────────────────────┘
```

### Contractor or consultant overview

```text
┌──────────────────────────────────┐
│ MimaarLink          Contractor  ☰ │
├──────────────────────────────────┤
│ Company overview                   │
│                                   │
│ ┌──────────────────────────────┐  │
│ │ Application under review     │  │
│ │ ●━━━━●━━━━○━━━━○             │  │
│ │ Next: complete one document  │  │
│ └──────────────────────────────┘  │
│                                   │
│ Documents                         │
│ ✓ Commercial registration         │
│ ! Trade licence                    │
│ ✓ Establishment card              │
│                                   │
│ ┌──────────────────────────────┐  │
│ │ Opportunities               │  │
│ │ No suitable opportunities   │  │
│ │ are available yet.          │  │
│ └──────────────────────────────┘  │
├──────────────────────────────────┤
│   Overview   Opportunities Profile│
└──────────────────────────────────┘
```

The prototype must render these layouts in Arabic/RTL first and then verify the same hierarchy in English/LTR.

## Shell Anatomy

### Compact app bar

- Official MimaarLink logo and wordmark.
- Current role chip: project owner, contractor, or consultant.
- One menu control for language, appearance, support, and role switching in the prototype.
- No notification bell in Phase 1 because a notification model is not yet approved.

### Content canvas

- Soft background `#F5F4F1` in light mode and `#07111D` in dark mode.
- One primary status or task card near the top.
- Secondary metrics use compact rows or two-column tiles only when they fit from 360 px.
- One clear primary action per screen.
- Existing loading, empty, success, warning, and error components are reused.

### Bottom navigation

- Three equal destinations.
- Minimum 56 px visual height plus safe-area inset.
- 20 px line icons and 11–12 px bold labels.
- Active destination uses teal with navy content.
- Inactive destinations use muted text on the card surface.
- No floating center button, oversized dock, or five-tab navigation in Phase 1.

## Screen Map For The Prototype

### Shared

1. Role selection based on `/start-here`.
2. Arabic/English and light/dark controls.
3. Shared support surface.
4. Shared loading, empty, error, and missing-data examples.

### Project owner

1. Owner overview using a representative existing project shape.
2. Existing new-project form inside the focused shell.
3. Project detail and status timeline.
4. Bid comparison reached contextually from the project.
5. Owner empty state with a single “Post project” action.

### Contractor or consultant

1. Provider overview using a representative existing provider shape.
2. Existing application form inside the focused shell.
3. Application and document status.
4. Opportunities readiness/empty state with no invented projects.
5. Profile and document summary.

## Route Reuse Plan

| Existing route | Prototype role |
|---|---|
| `/start-here` | role selection entry |
| `/post-project` | owner new-project task |
| `/project/[id]` | owner project detail/status |
| `/bids/[projectId]` | contextual owner bid comparison |
| `/contractor` | provider application task |
| `/contractor-status/[id]` | provider overview/status source |
| `/admin` | stays outside the customer app shell |

The prototype may use a non-production preview route or local role toggle on this branch. Final route and account behavior are Phase 2 decisions.

## Visual Direction

- Preserve the official logo unchanged.
- Use only navy `#152B54`, deep navy `#0D1B2A`, teal `#00B59E`, light teal `#D0F2EE`, amber `#FFB638`, white, soft background, muted text, and border tokens.
- Continue the current rounded but business-like card system.
- Use Cairo for Arabic and Inter for English.
- Keep body text at 14–16 px, helper text at 12–14 px, and touch targets at least 44 px.
- Use amber only for provider emphasis or warnings, never as the dominant shell color.
- Keep motion subtle and fully disabled when reduced motion is requested.

## Performance And Interaction Guardrails

- Prototype public first-load JavaScript target: below 150 kB where practical.
- No heavy chart library, map, carousel, or animation dependency.
- No decorative animation may delay scrolling or input.
- Status cards must remain useful on slow connections and during loading.
- 320, 360, 390, and 430 px phone widths are mandatory review sizes.
- Arabic/RTL, English/LTR, light, dark, keyboard, touch, and reduced motion are mandatory review states.

## Phase 1 Branch Scope After Approval

### Included

- Visual app shell and three-tab navigation.
- Owner and provider overview prototypes.
- Existing form, status, bid, and empty-state components placed in the shell.
- Representative local/demo states only where live customer identity is unavailable.
- Mobile, tablet, and desktop responsive presentation.

### Explicitly excluded

- Customer sign-in or account recovery.
- Persistent owner/provider dashboard records beyond current saved-link data.
- Live provider opportunity feed.
- Push or in-app notifications.
- Chat, payments, contracts, ratings, maps, or file-storage redesign.
- Production route replacement or merge to `main`.

## Approval Requested

Approve the recommended Phase 1 direction as one package:

1. Role-aware shell rather than one universal dashboard.
2. Three bottom destinations per role.
3. Contextual owner bids and menu-based provider support.
4. Visual/demo prototype first, before customer authentication or new backend features.
5. Continue prototype work on `design/mobile-app-shell-review`, with no merge until Q reviews and explicitly approves it.

Q can approve by replying: **Approve the recommended Phase 1 app shell.**

If Q does not approve, no app-shell code should be added and `main` should remain the current responsive website.
