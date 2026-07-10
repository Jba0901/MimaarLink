# MimaarLink First Advertising Sprint

Date: 2026-07-10

Owner: Jassim

Chief Operator: Codex / Jassim2

## Decision

The first paid campaign should acquire serious project owners. Do not spend meaningful advertising money recruiting contractors or consultants yet.

Why:

- Project demand is the scarce side of the marketplace.
- Contractors and consultants can be recruited more cheaply through direct WhatsApp outreach, directories, referrals, and Jassim's network.
- Paying for provider applications before projects exist increases supply without proving revenue.
- A real project request can validate the landing page, manual matching workflow, provider response, and QAR 750 fee model at the same time.

Primary offer:

> Share your project details and MimaarLink will help you reach suitable contractors or consultant offices in Qatar and compare their responses more clearly.

Do not claim guaranteed quality, lowest price, guaranteed bids, or guaranteed project completion.

## What AI Should Do

Use AI for:

- Arabic and English copy variants.
- Creative concepts and storyboards.
- Clean background or still-life images without readable text, logos, prices, ratings, or fake documents.
- Resizing a validated concept into feed, story, and reel-cover formats.
- UTM naming, campaign reports, and performance analysis.
- First-pass quality checks for spacing, contrast, mobile readability, and brand consistency.

Do not let AI:

- Recreate or modify the MimaarLink logo.
- Generate fake project results, testimonials, contractor ratings, prices, approvals, or documents.
- Place final Arabic typography without human review.
- Use fake Western villas or unrealistic construction workers as Qatar evidence.
- Publish ads or change budgets without Jassim's approval.

Best asset order:

1. Real Qatar project/site photos that MimaarLink has permission to use.
2. Current MimaarLink website screenshots with no user or test data.
3. Licensed Qatar/GCC-relevant stock photos.
4. AI-generated neutral plans/materials still life, used only when it cannot imply a completed MimaarLink project.

Do not hire three freelancers for the first test. Produce the first six concepts internally, then hire one Arabic Meta creative designer only if a concept shows real lead intent and needs professional iteration.

## Launch Gate

Do not spend until all items are complete:

- Production `/start-here` and `/post-project` work on mobile.
- Test project submission reaches Supabase and appears in `/admin`.
- UTM attribution appears in the project admin detail.
- Meta Business portfolio, ad account, Facebook Page, and Instagram account are connected.
- Meta dataset/pixel is created.
- Meta Pixel Test Events confirms one `PageView`, one form-start event, and one successful `Lead` event without personal form data.
- Website `Lead` event fires only after a successful project submission.
- Project form-start event fires when the user starts the project flow.
- Privacy/cookie wording is reviewed before third-party tracking is enabled.
- Every ad uses a unique `utm_content` value.
- Jassim can answer a new qualified lead within 15-30 minutes during business hours.

Current technical state on 2026-07-10:

- First-party UTM capture is implemented in the website code.
- Meta Pixel is not present and must not be assumed active.
- A Meta dataset/pixel ID is still required. Conversions API is a later scale improvement once qualified-lead feedback is worth sending back to Meta.

## 14-Day Campaign

### Campaign 1: Project Owner Leads

- Objective: Leads.
- Conversion location: Website.
- Optimization event: `Lead`, triggered only after a successful project submission.
- Destination: `https://mimaarlink.com/post-project`.
- Geography: Qatar.
- Age hypothesis: 25-60.
- Gender: All.
- Placements: Advantage+ placements initially.
- Languages: Do not restrict in the first broad test; Arabic creative will self-select while avoiding exclusion of Arabic readers using English device settings.

Ad set - Broad Qatar:

- Qatar, age 25-60, no detailed interests.
- Arabic-first creatives.
- Purpose: allow Meta to learn from the creative and conversion event.
- Give Advantage+ audience suggestions related to renovation, interior design, architecture, villas, property management, facilities, small business, offices, and retail fit-out when those options exist in Ads Manager.
- Treat suggestions as hypotheses, not proof of ownership or purchase intent.

Use one consolidated owner ad set. Qatar is too small and the budget is too lean for fragmented learning.

### Budget Control

Maximum first-test budget: QAR 1,200 over 14 days.

Stage 1, days 1-4:

- QAR 80/day total.
- One owner ad set.
- Three project-owner creatives.

Stage 2, days 5-10:

- Pause obvious creative losers.
- Keep the best two creatives and replace a clear loser once enough data exists.
- Keep QAR 80/day only if there are form starts or a real submission.

Stage 3, days 11-14:

- Increase to QAR 100/day only if at least one real project submission has been reached and the lead is contactable.
- Otherwise keep the budget flat or pause.

Do not create a retargeting ad set until the audience is large enough to deliver consistently. Prepare the creative now, but activate retargeting only after meaningful site traffic or form starts exist.

## First Three Paid Creative Angles

### A. Villa Renovation

Image headline:

> عندك مشروع وتحتاج مقاول؟

Primary text:

> عندك مشروع تجديد أو تشطيب في قطر؟ انشر تفاصيل مشروعك عبر معمار لينك وسنساعدك في الوصول إلى مقاولين مناسبين لنطاق العمل.

CTA:

> انشر مشروعك

Visual:

- Bright, real Qatar villa renovation in progress.
- Clean white headline zone.
- Teal CTA.
- Official logo in a separate clean area.

UTM content: `owner_villa_hook_a`

### B. Office Or Shop Fit-Out

Image headline:

> مشروع تشطيب أو تجديد؟

Primary text:

> بدل البحث والتواصل مع جهات كثيرة، أرسل تفاصيل مشروع مكتبك أو محلك عبر معمار لينك للوصول إلى مقدمي خدمة مناسبين في قطر.

CTA:

> ابدأ مشروعك

Visual:

- Real office or shop fit-out showing partitions, MEP, ceilings, joinery, or flooring.
- Navy headline area.
- White CTA area with teal action.

UTM content: `owner_fitout_hook_b`

### C. Compare Before Choosing

Image headline:

> قارن العروض قبل ما تختار

Primary text:

> وضح نطاق المشروع من البداية وقارن العروض قبل الاختيار. ابدأ بإرسال تفاصيل مشروعك عبر معمار لينك.

CTA:

> انشر التفاصيل

Visual:

- Clean plans, calculator, materials, and measuring tools.
- No fake names, documents, prices, ratings, or generated Arabic text.
- Brand-colored comparison bars may be added manually.

UTM content: `owner_compare_hook_c`

## Organic Provider Acquisition

Paid provider ads remain paused for the first sprint.

Daily target:

- 15 targeted contractor messages.
- 5 targeted consultant-office messages.
- 5 follow-ups from the previous day.
- 3 short qualification calls.

Provider categories:

1. Villa renovation and fit-out.
2. Commercial fit-out.
3. MEP, HVAC, electrical, and plumbing.
4. Civil maintenance and waterproofing.
5. Consultant offices for scope, BOQ, design, approvals, supervision, and bid comparison.

Do not promise projects. Ask for service fit, ideal project size, response speed, documents, recent work, and willingness to consider a QAR 750 fee for a qualified opportunity after selection for direct introduction.

## Measurement

Required funnel events:

- Landing page view.
- Path selected.
- Project form started.
- Project submitted: Meta standard `Lead` event.
- Contractor application submitted.
- Consultant application submitted.
- WhatsApp click.
- Qualified project: manual admin outcome, later sent through Conversions API or offline event.

UTM standard:

```text
utm_source=meta
utm_medium=paid_social
utm_campaign=owner_leads_jul26
utm_content=owner_villa_hook_a
```

Change only `utm_content` for each creative. Use stable names; do not rename creatives mid-test.

## Scorecard

Primary business metrics:

- Real project submissions.
- Contactable project owners.
- Qualified project submissions.
- Cost per qualified project.
- Provider response to each qualified project.
- Provider willingness to pay QAR 750.

Diagnostic metrics:

- Link click-through rate.
- Landing-page views.
- Project form starts.
- Form-start to submit rate.
- Cost per project submission.

Do not optimize decisions around likes, follows, impressions, or cheap clicks.

Initial success target:

- 5 real project submissions in 14 days.
- 2-3 qualified submissions.
- Form-start to submit rate above 15-20%.
- Early cost per qualified project at or below QAR 200-300.
- At least one project reaches a serious provider matching round.

## Kill Rules

- After QAR 300 with no project form starts: pause and fix creative/offer/landing mismatch.
- After QAR 600 with form starts but no submission: pause and fix form friction or trust gaps.
- After QAR 900 with no qualified project: stop paid acquisition and rework the wedge before spending more.
- Replace a creative after roughly 2,000 impressions if outbound CTR remains below 0.7%, or after QAR 150 with no form start.
- If submissions are unreachable, fake, micro-handyman only, or have no budget/timeline: narrow the copy and qualification fields.
- If project owners submit but providers will not respond: improve provider supply or project scoping before scaling ads.
- If providers respond but reject QAR 750: test fee timing and opportunity quality before changing the price.

## Outreach Beyond Ads

Use three parallel demand channels while the campaign runs:

1. Warm introductions through Jassim's construction, logistics, real estate, and corporate contacts.
2. Direct outreach to property managers, facility managers, real estate offices, shop/office operators, and consultant offices that encounter owners needing quotes.
3. Instagram and WhatsApp content that sends users to `/start-here`, using the same three owner hooks as the paid campaign.

The goal is not to make the Instagram account look busy. The goal is to create project submissions that can enter the manual matching process.

## Sources

- Meta ad objectives: https://www.facebook.com/business/ads/ad-objectives
- Meta lead ads: https://www.facebook.com/business/ads/ad-objectives/lead-generation
- Meta website and instant forms: https://www.facebook.com/business/ads/ad-objectives/lead-generation/lead-ads-with-forms
- Meta Conversions API: https://www.facebook.com/business/help/AboutConversionsAPI
- Meta Advertising Standards: https://transparency.meta.com/policies/ad-standards/
- Qatar digital audience context: https://datareportal.com/reports/digital-2026-qatar

Audience figures are planning context, not public advertising claims. Do not place market-size numbers inside ads without refreshing and verifying them.
