# ClaimWise HQ

Free 50-state **unclaimed property** search hub and guided claim wizard.

ClaimWise HQ takes you straight to the official state treasury portal for all 50 states,
Washington D.C., and Puerto Rico, then builds a step-by-step claim checklist (documents,
complexity, timeline) for your specific state, property type, and situation.

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Static / ISR pages, deployed on Vercel
- Stripe checkout (env-gated; degrades to a friendly waitlist when `STRIPE_*` is absent)

## Routes
- `/` — landing page, search wizard, asset & state directory, pricing, FAQ
- `/unclaimed-property/[state]` — 52 official state portals + claim guide (programmatic SEO)
- `/unclaimed-property/[state]/[asset]` — 312 state × property-type pages
- `/blog`, `/blog/[slug]` — claim guides
- `/missingmoney-alternative` — competitor comparison
- `/api/checkout` — Stripe checkout (graceful degradation)
- `/sitemap.xml`, `/robots.txt`, `/llms.txt` — SEO + GEO artifacts

## Data
- `lib/states.ts` — official unclaimed-property portal + administering agency for all 52 jurisdictions
- `lib/assets.ts` — property categories (NAUPA-style) with required-document hints
- `lib/claims.ts` — deterministic claim-guidance engine (complexity, checklist, timeline)
- `test/claims.test.mts` — unit tests pinning the engine to hand-computed values

## Develop
```bash
npm install
npm run dev      # http://localhost:3000
npm test         # run the claim-engine tests
npm run build    # production build
```

## Environment (optional)
| Var | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | Enable real Stripe checkout for Pro |
| `STRIPE_PRICE_ID` | Pro subscription price ID |
| `SITE_URL` | Override the canonical origin used in checkout redirects |

Without these, the Pro button returns a friendly "launching shortly" waitlist response.

## Disclaimer
ClaimWise HQ is independent and not affiliated with NAUPA or any state treasury. It provides
informational guidance, not legal or financial advice. Searching and claiming your own
unclaimed property from a state is always free — never pay a finder.
