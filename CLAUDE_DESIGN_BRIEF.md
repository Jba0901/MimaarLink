# Claude Design Brief: MimaarLink Creative Design Pass

You are working on the MimaarLink website.

## Working Branch

Work only on:

`claude-creative-design-pass`

Do not work on `main`. Do not merge into `main`. Do not delete files unless clearly necessary.

Before editing, run:

```bash
git branch --show-current
git status
```

If you are not on the correct branch, run:

```bash
git checkout claude-creative-design-pass
```

## Project Context

MimaarLink is a Qatar contractor/project matching platform. It helps project owners submit a project and helps contractors apply to join the network.

The product must feel:

- Professional
- Trustworthy
- Mobile-first
- Arabic-first
- Easy for nontechnical users
- Serious enough for Qatar contractors and project owners

## Core Routes

- `/`
- `/start-here`
- `/post-project`
- `/contractor`
- `/for-projects`
- `/for-contractors`
- `/project/[id]`
- `/contractor-status/[id]`
- `/bids/[projectId]`
- `/admin`
- `/admin/project/[id]`
- `/admin/contractor/[id]`

## Preserve Existing Functionality

Do not break:

- Project submission form
- Contractor application form
- File uploads
- Supabase-backed API routes
- Admin login/dashboard
- Project status pages
- Contractor status pages
- Bid comparison pages
- Arabic/English language switching
- Arabic as the default experience
- Contact links: email, WhatsApp, phone, Instagram

Be especially careful with:

- `app/api/[[...path]]/route.js`
- Supabase database/storage behavior
- Upload limits
- Admin actions
- Dynamic status pages
- Form submissions
- Data handling

## Brand Palette

- Navy: `#0D1B2A`
- Teal: `#00B59E` / `#0EB59E`
- Pale teal: `#D0F2EE`
- Amber accent: `#FFB638`
- White: `#FFFFFF`

## Design Direction

Act as the owner, lead designer, and senior frontend developer.

Review the entire website first, then improve it end-to-end with a more polished, modern, simple, trustworthy visual design.

The site should feel like a serious Qatar business platform, not a toy app and not a generic AI template.

## Specific Goals

1. Make the visual system more consistent across all pages.
2. Fix inconsistent icon/logo sizing everywhere.
3. Make contact/social icons visually balanced and same size.
4. Improve spacing, typography, cards, buttons, form fields, and section rhythm.
5. Improve mobile responsiveness.
6. Improve Arabic layout and RTL polish.
7. Make forms easier on the eyes, especially placeholder/help text.
8. Reduce visual noise and repetitive text.
9. Keep CTAs clear and direct.
10. Add subtle animations only where they improve perceived quality:
    - soft fade-up
    - gentle hover lift
    - button press feedback
    - subtle active states
11. Avoid distracting movement.
12. Avoid ugly square/grid backgrounds.
13. Avoid excessive gradients, blobs, or decorations.
14. Keep the site fast and efficient.

## UX Principle

The user should instantly understand:

- “I want to post a project”
- “I am a contractor”
- “I can contact MimaarLink”
- “This is a serious service in Qatar”

Use inspiration from high-quality professional marketplace, SaaS, and local-services websites, but do not copy any brand or assets directly.

## Technical Expectations

- Use existing Next.js + Tailwind patterns.
- Prefer improving existing components instead of rewriting everything.
- Keep changes scoped and understandable.
- Do not introduce large dependencies unless clearly justified.
- Do not touch secrets or `.env` files.
- Do not change business logic unless needed for UI consistency.
- Use `lucide-react` icons where suitable.
- If creating shared UI helpers/classes, keep them simple.

## Verification

After changes, run:

```bash
npm run build
```

Visually test at least:

- `/`
- `/start-here`
- `/post-project`
- `/contractor`
- `/for-projects`
- `/for-contractors`
- `/admin`

Check desktop and mobile widths.

Confirm:

- No broken layout
- No text overflow
- No icon size mismatch
- Arabic default still works
- Forms still look usable
- Contact links remain clickable
- Build passes

## Deliverable

1. Commit changes with a clear message.
2. Push branch `claude-creative-design-pass`.
3. Provide a concise summary:
   - What changed
   - Why it changed
   - Files touched
   - Build/test result
   - Any risks or follow-up recommendations

Again: do not merge into `main`. This is a design exploration branch.
