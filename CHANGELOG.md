# Changelog

All notable changes to Frifti are documented here.

## 2026-09-03: Fix Safari JSON-LD crash on blog pages

- JSON-LD payloads containing multiple schema entities now render as an object-rooted
  `@graph` rather than a top-level array. This prevents Safari from throwing
  `r["@context"].toLowerCase` on `/blog/claimittexas-gov-explained` and other pages with
  multi-entity structured data. Added a regression test for the serializer.

## 2026-08-26: Production observability

- Added Sentry browser, Node.js, and edge monitoring, request-error capture, source-map uploads, and the in-product feedback widget. Runtime reporting is disabled explicitly when no DSN is configured.

## 2026-08-03: GEO audit fixes — sitewide Organization/WebSite JSON-LD, blog BreadcrumbList, explicit AI-crawler robots policy

A full GEO (generative-engine optimisation) surface audit found the basics already covered
(`llms.txt`, `SoftwareApplication` + `FAQPage` on the homepage, `BreadcrumbList` + `HowTo`/
`FAQPage` on state and asset pages, an accurate sitemap) but three gaps a generic SEO audit
wouldn't catch:

- **Added `Organization` + `WebSite` JSON-LD sitewide** (`app/layout.tsx`), so any page a
  crawler or AI assistant lands on — not just the homepage — can resolve who publishes the
  site without a separate lookup.
- **Added `BreadcrumbList` JSON-LD to blog posts** (`app/blog/[slug]/page.tsx`), matching the
  pattern already used on state and asset pages. Previously only `BlogPosting`/`FAQPage`/
  `HowTo`/`Review` were present there.
- **Made the AI-crawler robots policy explicit** (`app/robots.ts`): GPTBot, ChatGPT-User,
  OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User,
  Google-Extended, and CCBot now get their own named `Allow: /` rule alongside the general
  `*` rule, so the welcome is unambiguous instead of implicit.

No new dependencies; `npm test`, `npm run lint`, and `npm run build` all pass with all 401
routes still generating statically.

## 2026-07-21: New guide — lost pensions, plus content-schema migration shipped

- **New Academy post**: "How to Find a Lost Pension: The Free PBGC Search Guide"
  (`/blog/how-to-find-a-lost-pension`) — free search steps across PBGC's Missing
  Participants database, DOL Form 5500 filings, the National Registry of Unclaimed
  Retirement Benefits, and state unclaimed-property portals, the next Tier-2 topic from
  `docs/seo_geo_content_plan.md` not yet covered by an existing post.
- **Shipped a previously uncommitted migration**: blog content moved from a single
  `lib/posts.ts` file to a typed `lib/posts/data/` directory (one file per post, shared
  `types.ts`/`schema.ts`), with matching `app/blog` page updates. Merged against an
  independently-diverged `origin/master` (an older commit had added 12 posts to the
  now-superseded `lib/posts.ts`); resolved in favour of the new architecture, which already
  covers 5 of those 12 topics with deeper content under different slugs. Four legacy topics
  have no equivalent yet and are flagged in the Growth Profile table as the next content
  gap: unclaimed wages recovery, safe-deposit-box abandoned property, business compliance,
  and checking an existing claim's status.

## 2026-07-01: Premium visual redesign, de-AI-ified copy, and bug fixes

A full pass on "this looks and reads like a generic AI template" across the whole site,
plus the real bugs found while doing it. The previous brand-overhaul pass (below) swapped
raw Tailwind colors for design tokens but left every page following the same
"eyebrow badge → centered h2 → p → card grid" rhythm with `system-ui` type and no
imagery/motion beyond a hover scale on blog thumbnails. This pass replaces that with an
actual typographic identity, componentized primitives instead of copy-pasted cards, subtle
motion, and a site-wide copy pass to remove em dashes and AI-listicle phrasing.

### Added
- **Typography**: Fraunces (`font-display`, editorial variable serif) for headlines paired
  with Geist Sans (`font-sans`) for UI/body, both self-hosted via `next/font`
  (`app/layout.tsx`), replacing the plain `system-ui` stack.
- **Design primitives**: `components/ui/Button.tsx` (primary/secondary/ghost, replaces every
  hand-rolled button and the `→`/`↗` unicode-arrow CTA convention with a real icon),
  `components/ui/Badge.tsx`, `components/ui/Accordion.tsx` (single-open FAQ accordion,
  replaces FAQ-as-identical-bordered-cards everywhere it appeared), `components/icons/`
  (a small hand-drawn icon set plus `AssetIcon`, replacing `✓`/`→` glyphs), and
  `components/Reveal.tsx`/`components/MobileNav.tsx` (both using the new `motion` package;
  `Reveal` respects `prefers-reduced-motion`).
- **Real mobile navigation** (`components/MobileNav.tsx`): the header previously hid
  "States"/"Guides"/"vs MissingMoney" below the `sm`/`lg` breakpoints with no fallback, so
  phone visitors had no way to reach them short of scrolling to the footer. `lib/nav.ts` is
  now the single source of truth for those links, shared by the desktop nav and the drawer.
- A subtle grain/noise texture (`bg-grain` in `app/globals.css`, pure CSS, no image asset) on
  charcoal panels (header, footer, hero, featured pricing card, mobile drawer).
- Visually differentiated pricing tiers on the home page (Free / Claim Kit / Estate Report no
  longer render as three identical grey-bordered cards), an asymmetric hero with a large
  serif watermark numeral instead of a centered text block in a flat box, and an editorial
  blog-card treatment (larger imagery, serif headline, corner tag instead of a pill).

### Fixed
- **`/premium` buy button was a dead end when visited without a claim context** (e.g. from
  the nav/footer rather than through the wizard): `buyHref` carried no `state`/`asset`, so
  `/api/checkout` always redirected straight back to bare `/premium` with no explanation.
  Now shows a "Build your claim to unlock this" CTA instead of a checkout link when
  unpersonalised.
- **Bold+link Markdown never rendered as a link in blog posts**: `components/PostBody.tsx`'s
  `INLINE_PATTERN` regex let the plain-bold branch match `**[text](url)**` first (its
  `[^*]+` swallows the whole bracket/paren sequence), rendering literal `[text](url)` wrapped
  in `<strong>` instead of a link. This broke 153 internal/external links across all 20 blog
  posts. Fixed the regex to recognize the combined bold-link form first.
- **Duplicated brand name in a page `<title>`**: `/missingmoney-alternative` set
  `title: "MissingMoney.com Alternative — Frifti"`, which the root layout's
  `template: "%s | Frifti"` then wrapped into `"...— Frifti | Frifti"`. Removed the brand
  name from the child title so the template applies once.
- `lib/posts/toc.ts`: table-of-contents heading ids weren't de-duplicated, so a post reusing
  an H2 twice would render two elements with the same id (and mismatch the ids
  `components/PostBody.tsx` assigned independently). Both now derive ids from one shared
  `headingIds()` pass.
- `app/error.tsx` never logged the caught error, added `console.error` in a `useEffect`.
- `app/missingmoney-alternative/page.tsx`: the CTA button hardcoded "52 states" while the
  paragraph above it correctly used `{STATES.length}`; now both are dynamic.
- `app/sitemap.ts`: state/asset pages set `lastModified` to request time on every build,
  which told crawlers all 364 programmatic pages were "just updated" on every deploy. Now
  anchored to a fixed `DIRECTORY_LAST_UPDATED` constant, bumped only when that data changes.
- README's environment table was missing `NEXT_PUBLIC_AFFILIATE_NOTARYLIVE`, which
  `lib/partners.ts` already reads.

### Changed
- Removed em dashes (~300 occurrences) from every page, component, and all 20 blog posts in
  `lib/posts/data/`, rewriting the surrounding clause naturally rather than swapping
  punctuation, plus the worst AI-listicle tics (formulaic hedging openers, repeated
  "None of this is X, it's Y" reassurance-beat closers). Blog word counts, FAQ counts,
  required content blocks (table/quote/note), and every internal/external link were
  preserved; `test/posts.test.mts`'s pinned SEO/structure assertions still pass.
- Every page template (`app/page.tsx`, `/premium`, `/unclaimed-property/[state]` +
  `[asset]`, `/missingmoney-alternative`, `/blog` + `[slug]`, `/success`, `/error`,
  `/not-found`, legal pages) rebuilt on the new typography and primitives; `ClaimFinder`,
  `ClaimKitCta`, `PartnerOffers`, and `PrintButton` restyled to match.

## 2026-07-01 — Brand overhaul: real visual identity + bug fixes

Replaced the generic Tailwind slate/emerald look with Frifti's actual brand identity, and fixed
several real bugs found during a full product audit, including actual browser screenshots
(desktop + emulated mobile via Playwright/system Chrome, since this environment has no
screen-recording access for a live browser) rather than relying on rendered-HTML review alone.

### Added
- `lib/stripe.ts`: `STRIPE_API` base URL is now overridable via `STRIPE_API_BASE` (defaults to
  the real Stripe API) — lets the full checkout journey be exercised end-to-end against a
  local double that speaks Stripe's exact request/response contract, without real credentials.
  Used to verify, via Playwright driving a real browser against the real running app: loaded
  `/premium` with a real claim context → clicked the actual "Get the Claim Kit"/"Get the Estate
  Claim Report" buttons → followed the real redirect chain through a simulated Stripe hosted
  checkout → landed on `/success` with a genuine session id → confirmed the correct personalised
  kit rendered (right cover letter/agency, right document checklist, right follow-up dates
  anchored to the session's `created` timestamp, notarisation correctly triggered by claim
  value, estate/heir sections correctly triggered by owner status) with zero console errors.
  This is the one thing that couldn't be tested against the real Stripe API without the site
  owner's own credentials; the double closes that gap honestly rather than leaving it asserted.
- `app/not-found.tsx`, `app/error.tsx`: branded 404 and runtime-error pages — previously any
  unknown route or thrown error fell through to Next.js's generic unbranded default pages.
- `@vercel/analytics` and `@vercel/speed-insights`, wired into `app/layout.tsx` — the product
  had zero visibility into real traffic or Core Web Vitals; both are no-cost on Vercel's free
  tier and no-op outside of a Vercel deployment (their script 404s locally under `next start`,
  by design — they only resolve once actually served through Vercel's edge network).
- `app/blog/page.tsx`: added `Blog`/`BlogPosting` JSON-LD listing all 20 posts — found via an
  exhaustive sweep (every URL in the sitemap, not a sample) that this was the one page with
  meaningful content but no structured data at all.

### Fixed
- `lib/stripe.ts`: both Stripe API calls now have a 10s timeout (`AbortSignal.timeout`), and
  `retrieveCheckoutSession` now catches network/timeout errors internally instead of letting
  them throw uncaught into `/success`'s render — a slow or unreachable Stripe would otherwise
  hang the request and eventually surface the generic error boundary instead of the page's
  existing, more honest "we couldn't verify this payment" message.

### Verified (no code change, evidence for the record)
- **Exhaustive JSON-LD validation**: fetched all 391 URLs in `/sitemap.xml` and parsed every
  `application/ld+json` block found — 0 parse failures. 386 of 391 pages carry structured data
  (the exceptions — disclosure/privacy/terms — genuinely don't need any).
- **Exhaustive automated accessibility scan**: ran axe-core's WCAG 2.0/2.1 A+AA ruleset (the
  same engine Lighthouse uses, but for a full violation list rather than a rollup score)
  against all 11 distinct page templates (home, state, asset, premium, blog index/post,
  comparison, all 3 legal pages, success) — 0 violations.
- **Edge-case/malicious input testing** against the real running app: XSS payloads in `state`/
  `asset`/`owner` URL params render safely escaped (verified no literal unescaped `<img
  onerror=...>` reaches the DOM — React's default escaping holds); negative and absurdly large
  `value` params are clamped to 0 at every layer (`lib/claims.ts`, `/premium`, `/api/checkout`)
  rather than producing `NaN`/negative output; unicode/emoji and script-tag slugs in the URL
  path 404 cleanly.
- **Timeout mechanism proof**: pointed a real `fetch(..., { signal: AbortSignal.timeout(2000) })`
  at a deliberately-hanging local server and confirmed it aborts in ~2s with `TimeoutError`,
  validating the pattern used in the `lib/stripe.ts` fix above.
- **Lighthouse against a real production build** (`next build && next start`, not dev mode):
  home `95/100/96/100` (perf/a11y/best-practices/SEO), LCP 2.8s; a content-heavy blog post
  `97/100/96/100`, LCP 2.7s — both under Lighthouse's default throttled-mobile simulation.
  CLS is 0 on both. No specific actionable performance opportunity was flagged beyond that.
- **Keyboard navigation**, via Playwright driving real Chrome: tabbed through the homepage —
  focus order is logical (logo → nav → CTA → wizard fields → state list) and every element
  keeps a visible native focus ring (confirmed nothing sets `outline-none` anywhere in the
  codebase).
- **Live failure-path test against the real Stripe API** (not mocked): ran the app with a
  syntactically-valid-but-fake `STRIPE_SECRET_KEY`, hit `/api/checkout` — Stripe rejected the
  real network request and the app redirected to `/premium?...&status=error` as designed; hit
  `/success?session_id=cs_test_fake` — showed the honest "couldn't verify this payment" state,
  never a fake unlock.
- **Competitive research** beyond MissingMoney.com (Settlemate, NAUPA, consumer unclaimed-
  property apps): no compelling missing feature found that isn't a deliberate scope choice —
  direct official-portal linking, a real claim-guidance wizard, and no-account/no-subscription
  monetization are already genuine differentiators versus everything found.
- `app/globals.css`: brand palette as CSS/Tailwind design tokens — single source of truth for
  color. `--color-brand` (#2E2A39 charcoal, header/footer/dark panels), `--color-lime`
  (#D7FF88, the one accent for CTAs/highlights), `--color-ink`/`--color-body`/`--color-muted`
  (text hierarchy), `--color-line`/`--color-line-strong` (borders), `--color-surface`/`--color-bg`.
  `--color-muted` is tuned to `#746e7d` specifically to clear WCAG AA (4.5:1) contrast on both
  card and page backgrounds.
- Real logo and favicon: `public/logo.png` (wordmark, header/footer), `app/icon.png` +
  `app/favicon.ico` (regenerated multi-resolution) + `app/apple-icon.png`, all derived from the
  brand assets rather than the placeholder "F" square / default Next.js icon.
- Homepage "From the guides" section: surfaces the 3 latest blog posts with real images —
  previously the highest-authority page had zero internal links into the 20-post blog.

### Changed
- Every page and component (`app/**`, `components/**`) re-themed to the new tokens; primary
  buttons are lime-with-charcoal-text (not lime-with-white-text — lime is a light color, so
  white-on-lime would be illegible), secondary/outline buttons are charcoal-on-transparent.
- `components/ClaimFinder.tsx` / asset pages: added a missing `initialAsset` prop so
  `/unclaimed-property/[state]/[asset]` pre-fills the property type in the wizard instead of
  making the user re-select what the URL already told us.
- `app/layout.tsx`: "States" nav link now goes to `/#states` (the real directory on the home
  page) instead of a hardcoded `/unclaimed-property/california`; "States"/"Guides" text links
  hide below `sm` (only the logo + "Find my money" CTA show on the smallest phones) to keep
  the header from feeling cramped at narrow widths, and `app/terms/page.tsx` gained the
  contact email the other two legal pages already had.
- `app/success/page.tsx` + `lib/stripe.ts`: the follow-up schedule's dates are now anchored to
  the Stripe session's `created` timestamp (purchase time) instead of page-view time — a
  reopened/reprinted kit no longer shows a shifted schedule.
- `app/privacy/page.tsx`, `app/terms/page.tsx`: added missing `metadata.description`.
- `eslint.config.mjs`: added `.vercel/**` to the ignore list — lint was scanning ~1,900
  warnings/errors in Vercel's generated prebuild output instead of real source.
- `components/JsonLd.tsx`: escapes `<` in the serialized JSON-LD so a stray `</script>` inside
  page content can't break out of the script tag; removed a stale, non-firing eslint-disable.
- `app/terms/page.tsx`: added the contact email it was missing (present on `/privacy` and
  `/disclosure` but not here).
- `lib/states.ts`: **12 of 52 official state portal URLs were dead or wrong** (verified
  independently, live before and after the fix) — Alabama, Arizona, Georgia, Kentucky,
  Louisiana, Nebraska, Nevada, New Mexico, Ohio, Oklahoma, Wisconsin and Wyoming. Most had
  moved to a new domain (state agencies frequently migrate unclaimed-property portals to
  vendor platforms); New Mexico and Ohio's old URLs 404'd outright. Since this is the core
  trust mechanism of the whole product — the promise that we link straight to the *authoritative*
  free source — a dead link here is a serious defect, not cosmetic.

## 2026-07-01 — Blog overhaul: rich SEO/GEO content model + 15 new posts

Rebuilt the blog from a bare title/description/body array into a full SEO- and GEO-optimised
content model, aligned to `docs/seo_geo_content_plan.md`, then rewrote the 5 existing posts
and added 15 new ones — 20 total, spanning Academy, News and Reviews.

### Added
- `lib/posts/` (replaces the old single `lib/posts.ts`): `types.ts` (the `Post` schema —
  category, format, author, dates, keyword fields, featured image, rich `body` blocks, FAQ,
  related posts, optional review data), `toc.ts` (table-of-contents extraction), `schema.ts`
  (BlogPosting/HowTo/Review JSON-LD builders), `index.ts` (aggregates all 20 posts), and one
  file per post under `data/`.
- `components/PostBody.tsx`: renders the richer block set (headings, lists, tables, TL;DR
  notes, expert quotes) with lightweight inline markdown (`[text](url)`, `**bold**`).
- Unique featured image per post (Pexels, via the Pipedream MCP integration), with photographer
  credit and alt text; `next.config.ts` allows `images.pexels.com` as a remote image source.
- 15 new posts covering 401(k)s, life insurance, estate/inheritance claims, IRS money, scams,
  MissingMoney.com trust/comparison, NAUPA, ClaimItTexas.gov, surplus funds, and a state-level
  data study — plus 3 honest reviews (Capitalize, Trust & Will, MissingMoney.com).
- `test/posts.test.mts`: validates every post's SEO metadata, word count, required blocks
  (table, quote, TL;DR), unique featured images, and related-post links.

### Changed
- `app/blog/page.tsx` and `app/blog/[slug]/page.tsx`: featured image, category badge, byline,
  on-page table of contents, FAQ section, and a "Related guides" block; JSON-LD now includes
  FAQPage and, where relevant, HowTo or Review alongside BlogPosting.
- Rewrote the 5 original posts (same slugs, to preserve existing URLs) from ~110-140 words
  each to 1,400-2,500 words with the full block set above.

## 2026-07-01 — Rebrand: ClaimWise HQ → Frifti

Renamed the product from ClaimWise HQ to Frifti, with frifti.com as the canonical domain.

### Changed
- `lib/site.ts` (single source of truth): name, domain, canonical URL, and Twitter handle.
- All public-facing copy, metadata, and JSON-LD across `app/*` pages, `lib/faq.ts`, and
  code comments in `lib/products.ts` / `lib/partners.ts`.
- `README.md`, `CHANGELOG.md`, `docs/seo_geo_content_plan.md`, `public/llms.txt`.
- Contact emails: `hello@frifti.com`, `privacy@frifti.com`.
- `package.json` / `package-lock.json` project name.
- Header logo mark and GitHub repository/remote.

## 2026-06-30 — Monetisation: one-time products + affiliate

Replaced the unattractive $9.99/month "Pro tracker" subscription with a model that fits how
people actually use the site (claim once, leave) while protecting the "always free to claim"
trust message that the SEO and GEO strategy depends on.

### Added
- **One-time products** (`lib/products.ts`): an optional `Claim Kit` ($14.99) and
  `Estate Claim Report` ($49). No subscription, never a fee to claim.
- **Real deliverable generator** (`lib/kit.ts`): produces a genuine, personalised kit from
  the existing claim engine — a pre-addressed cover letter, an explained document checklist,
  a dated follow-up schedule, a submission walkthrough, rejection-avoidance tips, and (for the
  Estate Report) multi-state heir-search and affidavit guidance.
- **Affiliate route** (`lib/partners.ts`, `components/PartnerOffers.tsx`): contextual,
  trust-first partner suggestions tied to a real claim step — online notarisation (Proof),
  estate help (Trust & Will), the free NAIC life-policy locator, and a free old-401(k) finder
  (Capitalize). Relevance-gated, capped, disclosed, and upgraded to affiliate links only when a
  `NEXT_PUBLIC_AFFILIATE_*` id is configured.
- `/premium` — SEO + conversion page; personalises from claim params; shows an honest
  "launching shortly" state when Stripe isn't configured.
- `/success` — verifies the Stripe session server-side and delivers the generated kit
  (printable, no account), or shows an explicit failure state. No database.
- `/disclosure` — affiliate & advertising disclosure; linked in the footer.
- `lib/stripe.ts` — dependency-free Stripe REST wrapper (create + verify Checkout Session).
- `components/ClaimKitCta.tsx`, `components/PrintButton.tsx`.
- Unit tests for products, partners (matching + link building), and kit generation
  (`test/products.test.mts`, `test/partners.test.mts`, `test/kit.test.mts`); `npm test`
  now runs the whole suite via `test/run.mts` (24 blocks).

### Changed
- `/api/checkout` now creates **one-time** (`mode=payment`) Checkout Sessions carrying the
  claim context as metadata, and degrades gracefully to the honest `/premium` state.
- Home pricing rewritten to Free / Claim Kit / Estate Report.
- `ClaimFinder` results now surface the contextual Claim Kit CTA and partner offers.
- Updated `llms.txt`, `README.md`, `privacy`, sitemap, and `docs/seo_geo_content_plan.md`.

### Environment
- New: `STRIPE_PRICE_CLAIM_KIT`, `STRIPE_PRICE_ESTATE_REPORT`,
  `NEXT_PUBLIC_AFFILIATE_PROOF`, `NEXT_PUBLIC_AFFILIATE_TRUSTWILL`,
  `NEXT_PUBLIC_AFFILIATE_CAPITALIZE`. Removed: `STRIPE_PRICE_ID` (subscription).

## 2026-06-18 — Initial release
- 50-state unclaimed-property search hub, guided claim wizard, programmatic state/asset
  pages, blog guides, MissingMoney.com comparison, SEO + GEO artifacts.
