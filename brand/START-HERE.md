# Prompt for the website agent

Copy everything below the line into your coding agent, with this folder added to the repository root as `/brand`.

---

We are rebranding the Mimaary website (www.mimaary.com). The complete spec is in `/brand/BRAND.md`. Read it fully before changing anything, and treat it as the source of truth for colour, typography, logo, layout, motion, components, copy and the homepage structure.

Work in this order and stop for my review after each step:

1. **Audit.** Read the current codebase and list every place that conflicts with BRAND.md (colours, fonts, radii, amber usage, logo files, copy, RTL issues). Do not change code yet.
2. **Foundation.** Add `/brand/brand-tokens.css` to `app/globals.css`, wire the theme (Tailwind v4 `@theme` block, or `/brand/tailwind.brand.js` for v3), load fonts from `/brand/fonts.ts` in `app/layout.tsx`, and replace the logo, favicon and app icons with the files in `/brand/logo`.
3. **Components.** Update buttons, inputs, cards, badges and navigation to match section 8 of BRAND.md, in both languages and both themes.
4. **Homepage.** Rebuild the homepage following section 10, using the English and Arabic copy provided. Mark every example or placeholder clearly; never invent statistics, testimonials or logos.
5. **Remaining pages.** Apply the same system to Start Here, Post a Project, and the contractor and consultant application pages. Convert long forms into a one-question-per-screen flow without changing the Supabase submission logic.

Rules: keep the existing Supabase logic, auth and URLs working; use logical CSS properties for RTL; test at 375px, 768px and 1440px in Arabic and English, light and dark; commit each step separately with a clear message.
