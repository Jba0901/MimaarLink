# Handoff log

Newest entry first. Every agent (Codex, Claude Code) adds an entry before finishing a task; see "Handoff" in `AGENTS.md`.

---

## 2026-10-05 · Claude Code · branch `claude/beautiful-dirac-pjb9ld` · website redesign, Phase 1 (homepage + shell)

**What changed** (one commit each)
- Brand v1.5 (`brand/BRAND.md`, `AGENTS.md`, `DECISIONS.md`): Jassim wanted the phone experience as calm as binaa.qdb.qa. Warm stone ground `#F7F3EC` + warm line `#E7E0D4`, white cards (12px), inputs 8px, pill buttons, navy sections with bright-teal accent text, centred display headline, arch line drawings instead of photos, chamfer retired, no bottom tab bar on the website, homepage order with a FAQ.
- Tokens (`app/brand-tokens.css`, `app/globals.css` HSL mapping): every page is warmer already; `--ml-radius-card`, `--ml-radius-pill`, navy-section tokens.
- Shell (`components/AppShell.jsx`): bottom tab bar removed (and its padding/offsets), quiet ghost header buttons, `overHero` header that shares the navy hero until scroll, calm navy footer with written-out contacts.
- Homepage (`app/page.js`, new `components/HeroSkyline.jsx`): navy hero with two path cards, step cards, example comparison, contractor band, sectors, trust cards, FAQ, navy close. Sticky floating button removed.

**Behaving differently**
- The bottom tab bar is gone on all pages; navigation is the header menu.
- Forms, status and offers pages only picked up the warm colours and softer corners; their full restyle is Phase 3.
- The v1.4 design is kept for the future app at main `446f486` (a git tag could not be pushed from this session; Jassim can tag it on GitHub).

**Waiting on Jassim**
- Review Phase 1 on his phone before Phase 2 (other pages), 3 (forms/status), 4 (polish).
- FAQ wording (5 answers, facts from `DECISIONS.md`, no figures).
- Real photos of Doha projects, if any, to replace the line drawing later.

**Verified**
- `npm run build` + `node --test tests/*.test.mjs` (49/49) at every commit. Chromium screenshots at 390 (EN/AR, light/night), 768 (AR) and 1440 (EN); no horizontal scroll at 320/375/390/768/1024/1440 in both languages; scroll reveals confirmed on a real-paced scroll.

---

## 2026-10-02 · Claude Code · branch `claude/beautiful-dirac-pjb9ld` · menu drawer cleanup

**What changed**
- Menu drawer and contact icons (`components/AppShell.jsx`), from Jassim's review of night mode:
  - No ↗ arrows: removed from the three path cards (internal links) and from the WhatsApp/Instagram badges in the drawer and footer.
  - Night mode is flat: the drawer cards no longer use the `path-card` gradient and heavy shadow; they are card surfaces with a 1px line.
  - 6px corners on icon tiles, quick links, appearance row, contact buttons and close button (no more rounded-2xl / circles).
  - No extra-bold: "Choose your path" is serif 500; labels and card titles are semibold.
  - "Toggle theme" now says "Switch to light" / "Switch to night" (AR: التبديل إلى الوضع الفاتح / الليلي).
- `.path-card` in `globals.css` is unchanged and still used on the start-here page.

**Waiting on Jassim**
- Nothing.

**Verified**
- Build and tests (47/47). Screenshots at 390px: EN night, AR night, EN light.

---

## 2026-10-02 · Claude Code · branch `claude/beautiful-dirac-pjb9ld` · [PR #5](https://github.com/Jba0901/MimaarLink/pull/5) · provider form cleanup from Jassim's review

**What changed** (one commit each)
- Arabic placeholders sat on the left in free-text fields (budget, size, start, location). Cause: `dir="auto"` makes an empty field left to right. Those fields now use `unicode-bidi: plaintext` (`app/globals.css`) with no `dir`, so placeholders follow the page and typed numbers still read in order. Arabic "Skip" spelling fixed (تخطَّ).
- Contractor/consultant application: the "Where do you work?" step is gone (most work is in Doha; `DECISIONS.md`). Contractor is 7 steps, consultant 8. No API or database change: `serviceAreas` is simply not sent and the API stores `''`.
- Nothing preselected: `/contractor` without `?type` starts with no type chosen (neutral eyebrow "Join as a contractor or consultant"), and the consultant classification starts empty. A consultant who continues without choosing is still sent as `'unknown'`.
- Provider copy no longer promises matching by area (aside box, for-contractors page, homepage provider point, after-apply steps), EN and AR.

**Behaving differently**
- An unknown `?type=` value now shows the type question instead of meaning contractor.
- Owners keep the "Where is the project?" step (Jassim chose to keep it).

**Waiting on Jassim**
- Optional: header/footer links labelled "Contractor" go to `/contractor` and show the type question. They could point to `/contractor?type=contractor` to skip it. Not changed.

**Verified**
- `npm run build` and `node --test tests/*.test.mjs` (46/46) pass at each commit. Chromium: Arabic budget and size steps (empty and typed) at 375px; full consultant walk-through in English and Arabic at 1280px (nothing preselected, review has no area row).

---

## 2026-10-02 · Claude Code · branch `claude/beautiful-dirac-pjb9ld` · working rules from Jassim

**What changed**
- `AGENTS.md` Product rules: restored "never invent statistics, testimonials, logos, project counts or awards; do not overpromise; leave a marked placeholder and flag it". This answers the open question from the business docs cleanup entry.
- `AGENTS.md` Workflow: work in small steps, show Jassim a plan and wait for approval before non-trivial code changes, commit each step separately, tell Jassim before touching Supabase logic, auth or existing URLs.
- `brand/BRAND.md` §4 said fonts load with `next/font/google`. Since PR #4 they are self-hosted; the line now says so, so no one switches back.

**Waiting on Jassim**
- Vercel: `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` still need checking (see older entry).

**Verified**
- Doc-only change. Build and tests run before commit.

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
