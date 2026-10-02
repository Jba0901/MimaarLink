# Handoff log

Newest entry first. Every agent (Codex, Claude Code) adds an entry before finishing a task; see "Handoff" in `AGENTS.md`.

---

## 2026-10-02 · Claude Code · branch `claude/beautiful-dirac-pjb9ld` · [PR #3](https://github.com/Jba0901/MimaarLink/pull/3) (open, awaiting merge)

**What changed**
- Real CR number **243332** replaces the placeholders in the footer and the homepage Trust section (EN + AR). Source: Jassim's commercial registration printout. Only the number is published, no personal or ID details.
- `brand/BRAND.md`: the Arabic name معمار لينك is marked as confirmed against the registration (trade name on the CR).
- `AGENTS.md` rewritten for brand v1.4: the old version still told agents to use teal `#00B59E`, amber and `public/logo.png`, which would undo the rebrand. Added a code map, workflow and this handoff rule.
- New `CLAUDE.md` imports `AGENTS.md`, so Codex and Claude Code read the same instructions.
- New `docs/HANDOFF.md` (this file).

**Waiting on Jassim**
- Review `AGENTS.md`, then merge PR #3.
- Make one real submission on the live site (post a project and check it appears in `/admin`). The flows were verified against a local PostgreSQL copy of the schema, not the live database.

**Verified**
- `npm run build` passes and `node --test tests/*.test.mjs` is 42/42.

---

## 2026-09-30 → 10-02 · Claude Code · [PR #2](https://github.com/Jba0901/MimaarLink/pull/2) (merged to `main`)

Brand v1.4 rebrand plus two rounds of interface work. Full detail is in the PR description and in the commit messages.

**Rebrand**
- Tokens in `app/brand-tokens.css` and Tailwind; new fonts in `lib/fonts.js`; 6px radius; amber retired.
- SVG logos in `public/brand/logo/`.
- Homepage rebuilt per BRAND.md section 10. Example offers are always labelled illustrative.

**Forms**
- Post a Project and the contractor/consultant application are one-question-per-screen guided flows (`components/GuidedFlow.jsx`).
- Optional steps can be skipped. Location is optional and the server still defaults it to Doha.
- Every answer can be edited from the review screen.
- A local 7-day draft keeps non-contact answers only (`lib/formDraft.js`).
- Submission payloads are unchanged; the project form now also sends `location`, which the API already accepted.

**Owner pages**
- Status page shows a four-phase timeline (`components/PhaseTimeline.jsx`).
- The offers page has side-by-side cards with neutral sort by price or duration. The "Lowest price" badge is removed.

**Database (additive)**
- `projects.selected_contractor_id` and `projects.selected_at` are added on startup by the migration block in `app/api/[[...path]]/route.js`.
- The shortlist endpoint stores the chosen firm, and only one that bid on that project (404 otherwise).
- The admin project page shows "Chosen by the owner".

**Motion and mobile**
- Calm brand timings everywhere.
- Touch press states mirror desktop hover (`@media (hover: none)` block in `app/globals.css`).
- Scroll reveals run on phones (`components/RevealGroup.jsx`).
- Tap progress line and page settle-in (`components/RouteProgress.jsx`).
- The hero offers sequence plays on the first visit only.

**App readiness**
- `app/manifest.js` (installable), theme-color, Apple web-app meta, 192/512 icons.
- No service worker or offline mode yet.

**Gotchas found and fixed**
- `.btn` padding must live in `@layer components`; under `:where()` the preflight reset removed padding from `<button>` (the cramped Back button).
- Skeleton blocks use `.ml-skel` (line colour). `bg-muted` matched the page background and was invisible.
- 12 tests in `tests/` asserted pre-rebrand implementation details. They were rewritten to guard the same intent under v1.4, and 4 were added.

**Not done / later**
- Login or OTP verification. Keep the current CR + WhatsApp + tracking-link flow for now; when it comes, key companies by CR number, not phone.
- Offline service worker and store wrapper (TWA / Capacitor) when the app plan is set.
- `public/logo.png` and `public/logo-dark-transparent.png` are no longer referenced by the site but are kept (tests pin their hashes).
