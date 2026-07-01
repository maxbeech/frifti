# Changelog

All notable changes to Frifti are documented here.

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
