# Handoff log

Newest entry first. Every agent (Codex, Claude Code) adds an entry before finishing a task; see "Handoff" in `AGENTS.md`.

---

## 2026-10-07 · Claude Code · branch `claude/sweet-noether-xhtfnc` · new legal name, rename decided

**What changed**
- Jassim's commercial registration was updated (SR3003832). New legal name: **Mimaary Digital Platform / منصة معماري الرقمية**. CR number **243332 unchanged**. Individual establishment, expires 22/05/2027.
- Footer (`components/AppShell.jsx`) now reads "Mimaary Digital Platform · CR No. 243332" (AR: "منصة معماري الرقمية · سجل تجاري رقم 243332").
- Homepage trust item "Registered in Qatar" (`app/page.js`, EN + AR) now names the legal entity. The wording still works after the brand rename.
- Recorded in `DECISIONS.md`, `brand/BRAND.md` §1 and the footer line in §8, and the `COMPANY-BRAIN.md` header.

**Decided, not yet built: brand rename MimaarLink → Mimaary / معماري**
- Do NOT rename strings piecemeal. The logo SVGs in `public/brand/logo/` say MimaarLink and must not be retyped or edited (brand rule), so the switch waits for a new logo set. The name appears in about 240 places across 43 files (i18n, metadata, manifest, privacy page, email, Instagram handle, logo file names).
- Inputs needed from Jassim: new logo files, domain (`mimaary.com` was unregistered at the .com registry on 2026-10-07), email, and Instagram/WhatsApp names.

**Not published on purpose**
- The CR printout includes Jassim's ID number. Only the legal name and CR number go on the site. The PDF is not committed.

**Waiting on Jassim**
- Logo, domain, contact handles (above).
- The CR lists one activity: "Digital Platform for Retail Trade Intermediation" (479121). Worth confirming with MOCI that it covers construction/consulting service matching before any paid ads.

**Verified**
- `npm run build` and `node --test tests/*.test.mjs` pass (see commit).

---

## 2026-10-02 · Claude Code · branch `claude/beautiful-dirac-pjb9ld` · [PR #4](https://github.com/Jba0901/MimaarLink/pull/4) · fonts self-hosted

**What changed**
- The Vercel preview build for `d1fbf08` failed because the build machine could not download the fonts from Google Fonts (`next/font/google` fetches them during every build).
- `lib/fonts.js` now uses `next/font/local` with the woff2 files committed in `lib/font-files/`. These are the same Google Fonts files (latin subset for Source Serif 4 and IBM Plex Sans, arabic subset for IBM Plex Sans Arabic and Noto Naskh Arabic, same weights). Builds no longer need the internet for fonts. Licences were already in `public/fonts/licenses/`.
- `tests/typography.test.mjs`: the font test now guards "self-hosted from repo files, never `next/font/google`", that every font file exists, and that `display: 'swap'` stays.

**Behaving differently**
- Each font now holds only its own script. Latin letters and Western digits inside Arabic text come from IBM Plex Sans / Source Serif (next in the font stack) instead of the Arabic fonts' own Latin glyphs. Plex looks the same; in Arabic headings, Latin digits (e.g. "3–5") now use Source Serif instead of Noto Naskh's digits.
- To update a font later, replace the file in `lib/font-files/` (download from Google Fonts CSS with a modern browser user agent).

**Waiting on Jassim**
- Nothing.

**Verified**
- Clean `npm run build` and `node --test tests/*.test.mjs` (42/42) pass. Served the build and checked in Chromium at 375px: all four fonts load from the site itself, with no requests to Google; Arabic homepage renders correctly.

---

## 2026-10-02 · Claude Code · branch `claude/beautiful-dirac-pjb9ld` · decisions log

**What changed**
- New "Recording decisions" section in `AGENTS.md`: when Jassim decides something real, it goes in `brand/BRAND.md` (brand/design), `AGENTS.md` (product rules) or `DECISIONS.md` (everything else). Agents that can edit the repo write it themselves; chat-only sessions tell Jassim the file and the exact line.
- New `DECISIONS.md` at the root, seeded with decisions already made (free for now, open intake, CR number shown). Linked from the `COMPANY-BRAIN.md` index.

**Waiting on Jassim**
- Nothing new.

**Verified**
- Doc-only change; no code touched. Build and tests run before commit.

---

## 2026-10-02 · Claude Code · branch `claude/beautiful-dirac-pjb9ld` · business docs cleanup

**What changed**
- New `COMPANY-BRAIN.md` at the root: one page with mission, market, customers, money model, current status, focus, long-term gates, firm rules and an index of files.
- The July business docs were reorganised:
  - Agent operating system and prompt library merged into a short `docs/operating-system.md`. The old prompts listed the retired colours.
  - Matching SOP, qualification score and scripts extracted into `docs/operations.md`.
  - The strategy file moved to `docs/strategy/10-year-moat.md` and the ads plan to `docs/playbooks/meta-ads-launch.md`; both have a status note on top.
  - The two referral target lists moved to `docs/outreach/` with clear names.
  - The first-wave plan, the weekly board (last updated 20 July) and the old agent files moved to `docs/archive/`, marked "history only".
- `AGENTS.md` "Before you start" now points to the brain and the new paths.

**Decisions from Jassim, recorded in the brain**
- Intake stays open to all project types (`AGENTS.md`). Messy cases are handled case by case and turned into rules after market experience.
- MimaarLink is free for owners and providers for now. QAR 750 is only a hypothesis; do not quote any price.
- Status: 3 contractor applications; no confirmed real projects.

**Waiting on Jassim**
- On 2 Oct, Jassim's own commit removed the "do not overpromise / never invent statistics" line from `AGENTS.md` Product rules. The brain keeps both as firm rules. Confirm or restore.
- Check that Vercel has `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` set as two different values. The fail-closed admin fix (`52e5d64`) is on main, so admin stays locked without them.

**Verified**
- Doc-only change; no code was touched. Checked that no code or test references the moved file names. Build and tests run before commit.

---

## 2026-10-02 · Claude Code · branch `claude/beautiful-dirac-pjb9ld` · [PR #3](https://github.com/Jba0901/MimaarLink/pull/3) (open, awaiting merge)

**What changed**
- Real CR number **243332** replaces the placeholders in the footer and the homepage Trust section (EN + AR). Source: Jassim's commercial registration printout. Only the number is published, no personal or ID details.
- `brand/BRAND.md`: the Arabic name معمار لينك is marked as confirmed against the registration (trade name on the CR).
- `AGENTS.md` rewritten for brand v1.4: the old version still told agents to use teal `#00B59E`, amber and `public/logo.png`, which would undo the rebrand. Added a code map, workflow and this handoff rule.
- New `CLAUDE.md` imports `AGENTS.md`, so Codex and Claude Code read the same instructions.
- New `docs/HANDOFF.md` (this file).
- `AGENTS.md` gains a "What MimaarLink does" section (Jassim's wording): the full range of contracting and consulting activities, the informal market reality, and the principle "flexibility in what we accept; clarity in how we present it". Use it when designing categories, intake, copy and matching.

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
