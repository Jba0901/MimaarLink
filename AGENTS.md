# MimaarLink Agent Instructions

Shared instructions for every coding agent on this repo (Codex, Claude Code, others).
`CLAUDE.md` imports this file, so there is one source of truth. Update it here.

## What MimaarLink does

MimaarLink connects project owners with contractors and consultants across Qatar's built environment. An owner describes a project; we turn it into a clear brief, send it to vetted providers, and the owner receives three to five comparable offers to choose from.

We cover a wide range of project activities, because the market demands it:

- **Contracting / build:** fit-out, MEP (mechanical, electrical, plumbing), commercial buildings, villas and residential, healthcare and F&B spaces (clinics, restaurants, cafés), industrial facilities (warehouses, workshops), mixed-use and private developments, general contracting, and specialist trades.
- **Consulting / design:** architecture, engineering, design, site supervision, approvals, and tendering.

**Market reality to keep in mind.** Qatar's project-sourcing market is currently informal and fragmented: work is scattered across referrals, WhatsApp and personal contacts, scopes are unclear, and almost everyone does a bit of everything. There are no clean categories yet. MimaarLink's job is to bring order to this: a single clear starting point, structured briefs, qualified providers, and comparable offers. So when the product handles the long and messy range of real project types, the experience must still feel clear, calm and organized. **Flexibility in what we accept; clarity in how we present it.**

## Before you start

1. Read `docs/HANDOFF.md` (latest entry first). It says what changed last, what is half-done, and what is waiting on Jassim.
2. For UI, copy, ads, landing pages or any visual work, read `brand/BRAND.md` (v1.4). It is the source of truth for colour, type, logo, layout, motion, components, copy and the homepage structure. Where older docs disagree, `brand/BRAND.md` wins.
3. For strategy, outreach, ads, operations, pricing, provider acquisition or long-term planning, read `COMPANY-BRAIN.md` (one-page company picture and current status), then the linked file: `docs/operating-system.md` (how agents work for MimaarLink), `docs/operations.md` (running a project by hand), `docs/strategy/10-year-moat.md`, `docs/playbooks/meta-ads-launch.md`. Files in `docs/archive/` are history only; do not follow them.

`mimaarlink-design-system.md`, `mimaarlink-brand-theme-draft.md`, `mimaarlink-worker-design-brief.md` and `mimaarlink-mobile-web-app-design-roadmap.md` predate v1.4. Their positioning and channel guidance is still useful; their palette, fonts and logo rules are superseded.

## Recording decisions

When Jassim decides something real (a feature, price, name, design choice or rule), it must be written down so other sessions and agents can build on it. Chat alone is not a record.

- Brand and design → `brand/BRAND.md`
- Product rules → `AGENTS.md` (Product rules)
- Everything else (pricing, names, business, operations) → `DECISIONS.md`

If you can edit the repo, add it yourself in the same change and mention it in the handoff. If you can't (a chat-only session), tell Jassim which file it belongs in and give the exact line to paste. One dated line per decision, short and factual. Ideas, options and "maybe later" are not decisions; don't record them.

## Product rules

- MimaarLink is a serious Qatar construction and project marketplace: one request, three to five offers, the owner chooses.
- Arabic-first UX and copy unless the task says English. Every user-facing string exists in both languages; Arabic is written natively, not machine-translated.
- Keep forms, uploads, admin data, status pages, tracking links and file access working. Do not change Supabase tables, auth or submission payloads without Jassim's approval (additive, nullable columns added through the existing migration block in the API are the only exception, and must be noted in the handoff).

## Brand defaults (v1.4, full spec in `brand/BRAND.md`)

- Navy `#152B54` leads. Teal `#009F91` is for actions only. Pale teal `#EAF7F4` with navy text is the signature panel.
- Ground `#F6F8FB`, line `#DCE3EA`, body `#2E3E57`, muted `#586576`, warn `#B5462B` (warnings and exclusions only).
- Dark mode: night `#0D1B2A`, surfaces `#13243B`, accent bright teal `#0AC7CE`.
- Retired: amber `#FFB638`, old teal `#00B59E`, light teal `#D0F2EE`, Manrope. Do not reintroduce them.
- Type: Source Serif 4 / Noto Naskh Arabic for headings (weight 500), IBM Plex Sans / IBM Plex Sans Arabic for interface text. Loaded in `lib/fonts.js`.
- Radius 6px. One soft shadow. Motion: 140ms hover/press, 220ms components, 360ms steps/pages, one easing, no bounce, respect reduced motion.
- Logo: use the SVG files in `public/brand/logo/` (copied byte-for-byte from `brand/logo/`). Never retype the wordmark, recolour, filter or crop it. The old `public/logo.png` files stay in the repo but are no longer used by the site.

## Code map (things that are easy to break)

- Tokens: `app/brand-tokens.css` (CSS variables) and `tailwind.config.js` (`navy`, `teal`, `signature`, `warn`…). The shadcn HSL variables in `app/globals.css` are mapped to the same palette.
- Buttons: `.btn` padding and radius live in `@layer components` in `app/globals.css`. Do not move them into `@layer utilities` or `:where()`; the preflight reset then strips padding from `<button>` elements.
- Guided forms: `components/GuidedFlow.jsx` (steps-left progress, step frame, back/continue, review list, draft notice, chips) used by `app/post-project/page.js` and `app/contractor/page.js`. Progress shows steps left only, never time.
- Drafts: `lib/formDraft.js` stores answers in this browser for 7 days. `DRAFT_FIELDS` in each form must never include contact details, CR number or files.
- Owner pages: `app/project/[id]/page.js` (four-phase timeline via `components/PhaseTimeline.jsx`) and `app/bids/[projectId]/page.js` (side-by-side offers, neutral sort, shortlist).
- Shortlist: `POST /api/projects/shortlist` stores `projects.selected_contractor_id` and only accepts a firm that bid on that project.
- Motion helpers: `components/RevealGroup.jsx` (scroll reveals via `data-reveal` / `data-reveal-stagger`), `components/RouteProgress.jsx` (tap progress line and page settle-in). Touch press states live in the `@media (hover: none)` block in `app/globals.css`.
- App readiness: `app/manifest.js` (installable web app) and `viewport` / `appleWebApp` in `app/layout.js`.

## Workflow

- Keep UI mobile-first; check 375px, 768px and 1440px, Arabic and English, light and dark.
- Before every commit run both:
  - `npm run build`
  - `node --test tests/*.test.mjs` (source-level tests; when a deliberate design change breaks one, rewrite it to guard the new intent, never delete the guarantee)
- Develop on a branch and open a PR; Vercel builds a preview for every branch. Merge to `main` only when Jassim says so.

## Handoff (required after every change)

Several agents work on this repo. Before you finish a task, add an entry at the top of `docs/HANDOFF.md` with:

- Date, agent (Codex / Claude Code), branch and PR link.
- What changed and why, in plain words.
- Anything half-done, risky, or behaving differently than before.
- Decisions or inputs waiting on Jassim.
- How you verified it (build, tests, screens checked).

Also put a short "Handoff:" paragraph at the end of the commit message body so `git log` alone tells the next agent what to know.
