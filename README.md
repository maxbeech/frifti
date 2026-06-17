# ClaimWise HQ

Free 50-state unclaimed-property (unclaimed money) finder and step-by-step claim guide.
Search every official US state treasury unclaimed-property database in one place, then
follow a guided claim journey — exact documents, notarization rules, common rejections and
a typical timeline for owners, heirs and businesses. Routes only to free official government
portals (state treasuries + the NAUPA-sponsored MissingMoney.com). Never a finder's fee.

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Static / SSG programmatic SEO (410+ pages)
- Deployed on Vercel; Stripe billing is env-gated and degrades gracefully

## Core
- `lib/calc/claim.ts` — deterministic claim-guidance engine (documents, steps, notarization, timeline)
- `lib/data/states.ts` — 50 states + DC: administering agency + official portal
- `lib/data/assetTypes.ts` — 7 NAUPA property-type categories
- `components/Finder.tsx` — state search hub (client)
- `components/ClaimWizard.tsx` — live claim-guide builder (client)

## Programmatic SEO
- `/unclaimed-property/[state]` — 51 state pages
- `/unclaimed-property/[state]/[asset-type]` — 357 state × asset-type pages
- `/states`, `/how-to-claim`, `/missingmoney-alternative`, `/pricing`
- `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`

## GEO (AI discoverability)
- JSON-LD: SoftwareApplication + FAQPage + HowTo + BreadcrumbList
- `public/llms.txt` with clean citable facts
- On-page FAQ sections on every key page

## Develop
```bash
npm install
npm test       # engine + data-integrity tests
npm run dev
npm run build
```

## Environment (Pro billing — optional)
- `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID` — when absent, `/api/checkout` returns a friendly 503
- `NEXT_PUBLIC_SITE_URL` — canonical site URL

## Disclaimer
ClaimWise HQ is not a government agency. It links to official, free state programs and
MissingMoney.com. Always claim directly through the official state portal; requirements and
timelines are set by each state.
