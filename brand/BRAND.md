# Mimaary Brand & Website Spec

Version 1.6 · October 2026 · Owner: Jassim Abdulrahman Al-Anbari, Founder & CEO

**v1.6 (7 Oct 2026):** the brand is **Mimaary / معماري**. MimaarLink is retired everywhere: name, logo files and copy. The legal entity is Mimaary Digital Platform / منصة معماري الرقمية (CR No. 243332).

**v1.5 (website redesign, 5 Oct 2026):** warmer and calmer. Warm stone ground with white cards, a deep navy hero, softer shapes (12px cards, pill buttons), centred display headline with one accent phrase, arch line drawings instead of photos, no bottom tab bar on the website. The v1.4 look stays in git history (main at `446f486`) for the future app.

This is the single source of truth for how the Mimaary website (currently served at mimaarlink.com) looks, reads and behaves. Follow it exactly. When something is not covered here, choose the calmer, clearer option and ask before inventing new visual patterns.

Stack: Next.js, Tailwind CSS, Supabase, Vercel. The site is bilingual (English and Arabic, full RTL).

---

## 1. What Mimaary is

Mimaary is a Qatar-based construction technology platform. A project owner submits **one request** and receives **three to five competing offers** from vetted contractors and consultants, then compares price, timeline, scope and exclusions side by side and chooses.

- **Promise (EN):** One request. Three to five offers. You choose.
- **Promise (AR):** طلب واحد. من ثلاثة إلى خمسة عروض. والقرار لك.
- **Brand line (EN):** The trusted start of every project in Qatar.
- **Brand line (AR):** البداية الموثوقة لكل مشروع في قطر.
- **Descriptor:** The project-sourcing platform for Qatar's built environment.
- **Name:** Mimaary (EN) · معماري (AR). In Arabic sentences write «منصة معماري» wherever «معماري» alone could read as the adjective "architectural"; in headings, logos and titles «معماري» alone is fine.
- **Legal name:** Mimaary Digital Platform / منصة معماري الرقمية (CR No. 243332). Footer and trust copy show the legal name and CR number only.

## 2. Personality and feeling

**Calm authority.** Mimaary should feel like the well-run version of this market: a private bank's composure applied to construction. Confidence comes from restraint, order and clarity, never from volume.

Four traits: **Trusted, Precise, Qatari, Quick.**

What each audience must feel:
| Audience | Feeling | Design implication |
|---|---|---|
| Project owners | Relief | Guided, never judged for not knowing technical terms. Always know what happens next. |
| Contractors & consultants | Respect | Being listed is a mark of quality. Serious, well-scoped work. |
| Investors & institutions | Legitimacy | Polished, registered, bilingual, ready to scale. |

Mimaary is never: a crowded classifieds marketplace, a cold government portal, a flashy "AI startup" with fake dashboards, or loud and salesy.

## 3. Colour

Principle: **Navy leads. Teal acts. Nothing competes.** Premium comes from navy depth, white space and serif type, not from extra colours.

### Tokens
| Token | Hex | Role |
|---|---|---|
| `navy` | `#152B54` | Brand colour. Headlines, navigation, premium sections. |
| `teal` | `#009F91` | **Actions only**: buttons, links, selected and active states. Never decorative. |
| `teal-hover` | `#04A3AB` | Hover state for teal actions. |
| `teal-ink` | `#00786D` | Teal text on pale teal backgrounds (small labels). |
| `pale-teal` | `#EAF7F4` | **Signature panel** background (with navy text). Also info panels and selected rows. |
| `night` | `#0D1B2A` | Dark mode background. Never replaces navy as the brand colour. |
| `bright-teal` | `#0AC7CE` | Accent in dark mode, and accent text on navy sections (contrast). |
| `ground` | `#F7F3EC` | Warm stone page background and alternate sections (v1.5; was cool `#F6F8FB`). |
| `white` | `#FFFFFF` | Cards, forms, main surfaces. |
| `body` | `#2E3E57` | Body text. |
| `muted` | `#586576` | Secondary text, captions, labels. |
| `line` | `#E7E0D4` | Warm borders and 1px dividers (v1.5; was `#DCE3EA`). |
| `warn` | `#B5462B` | System warnings and proposal exclusions only. Not a brand colour. |

**Retired:** Warm Amber (`#FFB638`). Remove it everywhere. Do not use gold. The warm ground is a quiet neutral, not a colour: never use sand or beige for buttons, text or accents.

### Usage ratio per page
55% white and ground · 25% navy · 12% teal · 6% text grey · 2% pale teal.

### The signature treatment
**Navy text on pale teal** is reserved for the moments that matter: key figures ("3–5 offers") and the offer an owner selects. Label text inside it uses `teal-ink`.

### Navy sections
The hero, the contractor band, the closing call and the footer sit on navy (`#152B54`, deepening towards `#0F2142`). On navy: headings and body in white tones, accent text in `bright-teal`, the primary button stays teal fill, secondary buttons are outline white.

### Dark mode
Background `night`, surfaces `#13243B`, text `#F2F5FA`, body `#C9D6E8`, muted `#8FA0B6`, lines `#243650`, accent `bright-teal`, signature panel `#0F2E3A` with `#F2F5FA` text.

## 4. Typography

Self-hosted with `next/font/local` from `lib/font-files/` (see `lib/fonts.js`); do not switch back to `next/font/google`, it makes builds depend on Google Fonts being reachable:

| Role | Latin | Arabic | Weights |
|---|---|---|---|
| Display & headings | Source Serif 4 | Noto Naskh Arabic | 400, 500 (Arabic 500, 600) |
| Body & UI | IBM Plex Sans | IBM Plex Sans Arabic | 400, 500, 600 |

Rules:
- Headings are **serif, weight 500**, never bold 700. `text-wrap: balance`.
- The homepage hero headline is a **display** line: serif weight 400 (Arabic 500, the lightest Naskh weight loaded), centred, with one short accent phrase in teal (bright teal on navy).
- All interface text (buttons, inputs, nav, labels, tables) is IBM Plex Sans / IBM Plex Sans Arabic.
- Section labels (v1.5): the small logo arch mark + sans 500, 14px, sentence case, `teal-ink` (bright teal on navy). The older uppercase letter-spaced eyebrow stays only on pages not yet redesigned.
- Body 16–18px, line-height 1.6 (Arabic 1.8). Keep paragraphs under ~65 characters wide.
- Arabic and English must look equally polished. Never render Arabic in the Latin font.

Scale (desktop / mobile): Display 64/40px · H1 56/38px · H2 36/28px · H3 20/18px · Body 17/16px · Small 14px · Label 12px.

## 5. Logo

Files are in `brand/logo/` and served byte-for-byte from `public/brand/logo/` (SVG, vector). Use them as files; **never recreate the logo in code or type the wordmark in a font.**

The v1.6 set keeps the arch mark exactly as before. Only the wordmark was redrawn, as outlines of IBM Plex Sans SemiBold ("Mimaary") and IBM Plex Sans Arabic SemiBold («معماري»), at the old cap height and spacing, in navy (white on dark). A designer may refine the wordmark later; replace the files, keep the names.

| File | Use |
|---|---|
| `mimaary-logo-en.svg` | Header on light backgrounds (default) |
| `mimaary-logo-en-dark.svg` | Header/footer on navy or night, and in dark mode |
| `mimaary-logo-ar.svg` / `-ar-dark.svg` | Arabic version of the site |
| `mimaary-logo-bilingual.svg` | Footer or About page |
| `mimaary-logo-stacked.svg` | Square spaces |
| `mimaary-mark.svg` | Mark alone (loading states, small spaces) |
| `mimaary-icon.svg`, `mimaary-icon-512.png`, `mimaary-icon-180.png` | Favicon, apple-touch-icon, PWA and social |

Rules: minimum 120px wide for the full logo, 20px tall for the mark. Clear space around the logo at least the width of one arch leg. Never stretch, recolour, add shadows or place navy logo on navy.

## 6. Shape, layout and spacing

- **Radius (v1.5):** cards and panels 12px; inputs and small controls 8px; buttons and status pills fully rounded (pill). No other radii.
- **Signature shape:** the arch from the logo, used as a small section mark and in line drawings. The v1.4 chamfered corner is retired.
- **Soft cards on the ground:** group content in white 12px cards with generous padding (24px phone, 32px desktop) on the warm ground. Thin dividers only inside cards (offer rows, FAQ).
- **Grid:** 8px spacing scale; max content width 1200px; 12 columns desktop, single column on phones; side gutter at least 16px.
- **Shadows:** almost none. One soft shadow for raised elements: `0 18px 40px -24px rgba(13,27,42,.28)`.
- **Imagery:** real Qatari architecture, sites, drawings, models; colour-graded cool towards navy. No handshakes, stock smiles, cartoons, or futuristic AI renders. Until real photos exist, use thin line drawings built from the logo arch (e.g. the hero skyline), never a fake photo.

## 7. Motion and interaction

| Token | Duration | Use |
|---|---|---|
| `fast` | 140ms | Hover, press, focus feedback |
| `base` | 220ms | Components (menus, cards, accordions) |
| `slow` | 360ms | Page and step transitions |

One easing everywhere: `cubic-bezier(.2,.7,.2,1)`. No bounce, no spring overshoot, no parallax, no scroll-jacking. Respect `prefers-reduced-motion`.

Interaction principles:
1. **Fast in feel:** every tap responds instantly (pressed state `translateY(1px)`), buttons show a loading state within 100ms.
2. **One question per screen** for posting a project: a guided flow with visible progress and auto-saved drafts. Never one long form.
3. **Status always visible:** owners see a timeline: Brief received → Sent to firms → Offers in → Compare and choose.
4. **A person is one tap away:** WhatsApp link on every key screen.
5. **No dead ends:** every empty state and error says what to do next.

## 8. Components

**Primary button:** teal fill, white text, pill shape, 12px/20px padding, IBM Plex Sans 500. Hover `teal-hover` + soft teal shadow; arrow icon nudges 3px right (left in RTL). One primary button per view.
**Secondary button:** transparent pill, navy text, 1px `line` border; hover border becomes navy. On navy: white text, white 40% border.
**Text link:** teal, underline offset 4px.
**Inputs:** white, 1px `line` border, 8px radius, 48px tall, label above (never placeholder-only). Focus: 2px teal outline, 3px offset. Errors in `warn` below the field.
**Section label:** see typography.
**Signature panel:** pale teal background, navy serif text, 12px corners.
**Vetted badge:** small pill, pale teal background, `teal-ink` text, 1px teal border, check icon, text "Vetted" / "معتمد".
**Status timeline:** 4 steps, teal dots and line for completed, ring for current, grey for upcoming.
**Offer comparison card:** white 12px card, 1px line border. Firm name + vetted badge, price in serif (tabular numbers, "QAR 38,500"), then rows: Duration, Warranty, Exclusions (exclusions in `warn`). Selected card: teal border, pale teal background, "Selected" label.

## 9. Voice and copy

Speak like a senior advisor: short sentences, plain words, next step always clear.

| Situation | Avoid | Write |
|---|---|---|
| Headline | The revolutionary AI-powered platform disrupting construction! | Describe your project. Receive three to five offers. |
| Confirmation | Your request has been submitted successfully to our system. | Brief received. We're sending it to vetted firms now. |
| Error | Error 422: invalid input. | Add the project location so firms can price it accurately. |
| Provider invite | Sign up now and get tons of leads!! | Apply to join. Qualified firms receive projects that match their capability. |

Rules:
- No exclamation marks. No "revolutionary", "disruptive", "seamless", "cutting-edge".
- Numbers over adjectives, and only numbers we can keep.
- AI stays in the background: describe what it does for people (clearer briefs, side-by-side comparison). Never claim AI decides, certifies or guarantees.
- **Never invent** statistics, testimonials, client or partner logos, project counts, or awards. Leave a clearly marked placeholder instead and flag it.
- Arabic is written natively for Gulf readers (Modern Standard Arabic, warm business tone), not machine-translated.

## 10. Homepage structure

Build in this order. Each section has one job. Sections alternate navy and the warm ground; content sits in white 12px cards.

1. **Hero (navy, centred)**
   - Label: PROJECT SOURCING IN QATAR · تنفيذ مشاريعك في قطر
   - Display: One request. Three to five offers. **You choose.** · طلب واحد. من ثلاثة إلى خمسة عروض. **والقرار لك.** (accent phrase in bright teal)
   - Sub: Describe your project in your own words. We turn it into a clear brief, send it to vetted contractors and consultants, and put their offers side by side. · صف مشروعك بكلماتك، ونحوّله إلى وصف واضح نرسله إلى مقاولين واستشاريين معتمدين، ثم نعرض عروضهم جنبًا إلى جنب.
   - Two path cards: `01` Have a project? · لديك مشروع؟ → primary "Post your project · انشر مشروعك"; `02` Contractor or consultant? · مقاول أو استشاري؟ → secondary "Apply to join · قدّم طلب الانضمام".
   - Bottom: arch line-drawing skyline (no photo).
2. **How it works (ground):** Describe · Define · Receive offers · Choose, one white card each with an icon.
3. **The comparison:** an example of three offers side by side (marked as an example). This is the most persuasive moment.
4. **For contractors & consultants (navy band):** why serious firms join; how qualification works.
5. **Sectors:** Fit-out, MEP, Commercial, Healthcare & F&B, Villas, Industrial, Design & Supervision.
6. **Trust:** how firms are vetted, registered in Qatar (CR No. 243332), privacy, human support.
7. **Questions:** a short FAQ answered only with decided facts (see `DECISIONS.md`). No invented figures.
8. **Close (navy):** one confident call to post a project, with WhatsApp as the alternative.

Footer (navy): bilingual logo, one line, text links, contact as text, "Mimaary Digital Platform · CR No. 243332" (legal name and CR number only). No bottom tab bar on the website (it may return in the app).

## 11. Arabic and RTL

- `dir="rtl"` and `lang="ar"` on the Arabic version; use logical CSS properties (`ms-`, `me-`, `ps-`, `pe-`, `start`, `end`) everywhere.
- Mirror layouts, directional icons, progress bars and timelines. Do not mirror the logo mark or numbers.
- Language toggle shows the other language's name: "العربية" / "English".

## 12. Accessibility and quality

- WCAG AA contrast minimum. Visible focus states on everything interactive.
- Semantic HTML, labelled form fields, alt text on images.
- Lighthouse performance 90+ on mobile. Use `next/image`, preload fonts via `next/font`.
- Test at 375px, 768px and 1440px, in both languages and both themes.

## 13. Do not change without approval

- Supabase data models, auth and existing form submission logic.
- URLs of existing pages (add redirects if structure changes).
- Legal or registration details.
