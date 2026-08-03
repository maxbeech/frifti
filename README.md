# Frifti

Free 50-state **unclaimed property** search hub and guided claim wizard.

Frifti takes you straight to the official state treasury portal for all 50 states,
Washington D.C., and Puerto Rico, then builds a step-by-step claim checklist (documents,
complexity, timeline) for your specific state, property type, and situation.

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Static / ISR pages (1-week revalidation), deployed on Vercel
- Stripe Checkout for **one-time** products (env-gated; degrades to an honest "launching shortly" state when `STRIPE_*` is absent)
- No database: the paid kit is delivered by verifying the Stripe session and regenerating the kit from session metadata

## Brand
Two colors, defined once as design tokens in `app/globals.css` and used everywhere else via
Tailwind utilities (`bg-brand`, `text-lime`, `text-ink`, `border-line`, …) — never raw
`slate-*`/`emerald-*` classes:
- `#2E2A39` charcoal — `--color-brand`/`--color-ink`, header/footer/dark panels and primary text
- `#D7FF88` lime — `--color-lime`, the one accent for CTAs, highlights and badges

Typography: **Fraunces** (`font-display`, an editorial variable serif) for headlines, paired
with **Geist Sans** (`font-sans`, the site default) for UI and body copy. Both are self-hosted
via `next/font` in `app/layout.tsx`, no external font requests.

Shared UI primitives live in `components/ui/` (`Button`, `Badge`, `Accordion`) and
`components/icons/` (a small hand-drawn icon set, plus `AssetIcon` for the asset-type
directory) — reuse these instead of hand-rolling another card/button/badge treatment.
`components/Reveal.tsx` wraps `motion` for scroll-triggered entrances and respects
`prefers-reduced-motion`.

Logo and favicon live at `public/logo.png` (header/footer wordmark) and `app/icon.png` /
`app/favicon.ico` / `app/apple-icon.png` (generated from the same source mark).

## Monetisation
Three routes, all built around the promise that claiming from a state is **always free**:
1. **Free** — the full search wizard, document checklist, and guides.
2. **One-time products** — an optional `Claim Kit` ($14.99) and `Estate Claim Report` ($49) that pre-fill and organise a claim. See `/premium`.
3. **Affiliate** — a few contextual partner links (online notarisation, estate help, free 401(k)/life-policy finders) shown only when relevant, disclosed, and upgraded to affiliate links only when their `NEXT_PUBLIC_AFFILIATE_*` id is set.

## Routes
- `/` — landing page, search wizard, asset & state directory, pricing, FAQ
- `/unclaimed-property/[state]` — 52 official state portals + claim guide (programmatic SEO)
- `/unclaimed-property/[state]/[asset]` — 312 state × property-type pages
- `/premium` — Claim Kit & Estate Report sales page (personalised from claim params)
- `/blog`, `/blog/[slug]` — 21 SEO/GEO-optimised Academy, News & Review posts (see `lib/posts/`)
- `/missingmoney-alternative` — competitor comparison
- `/disclosure` — affiliate & advertising disclosure
- `/api/checkout` — one-time Stripe Checkout (graceful degradation)
- `/success` — verifies payment, delivers the generated kit (noindex)
- `/sitemap.xml`, `/robots.txt`, `/llms.txt` — SEO + GEO artifacts. `robots.txt` explicitly
  allows the major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, …)
  alongside the general `*` rule. `Organization`/`WebSite` JSON-LD renders on every page
  (`app/layout.tsx`); `BreadcrumbList` renders on every state, asset, and blog post page.

## Data & logic (single sources of truth)
- `lib/site.ts` — brand name, domain, canonical URL, and social handle
- `lib/states.ts` — official unclaimed-property portal + administering agency for all 52 jurisdictions
- `lib/assets.ts` — property categories (NAUPA-style) with required-document hints
- `lib/claims.ts` — deterministic claim-guidance engine (complexity, checklist, timeline)
- `lib/products.ts` — the one-time products, pricing, and which to recommend per claim
- `lib/partners.ts` — affiliate/resource partners, contextual matching, affiliate-link building
- `lib/kit.ts` — generates the real paid kit (cover letter, follow-ups, tips) from a claim
- `lib/stripe.ts` — dependency-free Stripe REST wrapper (create + verify Checkout Session)
- `lib/posts/` — blog content model (`types.ts`), JSON-LD builders (`schema.ts`), TOC helper
  (`toc.ts`), and one file per post under `data/`; `index.ts` aggregates them into `POSTS`
- `test/*.test.mts` — unit tests pinning the engine, products, partners, and kit to expected values

## Develop
```bash
npm install
npm run dev      # http://localhost:3000
npm test         # run the claim-engine tests
npm run build    # production build
```

## Environment (all optional)
| Var | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | Enable real Stripe Checkout for the one-time products |
| `STRIPE_PRICE_CLAIM_KIT` | Stripe Price ID for the Claim Kit (amount must equal $14.99) |
| `STRIPE_PRICE_ESTATE_REPORT` | Stripe Price ID for the Estate Claim Report (amount must equal $49) |
| `SITE_URL` | Override the canonical origin used in checkout redirects |
| `NEXT_PUBLIC_AFFILIATE_NOTARYLIVE` | Affiliate id for NotaryLive (online notarisation) — link becomes affiliate when set |
| `NEXT_PUBLIC_AFFILIATE_PROOF` | Affiliate id for Proof (online notarisation) — link becomes affiliate when set |
| `NEXT_PUBLIC_AFFILIATE_TRUSTWILL` | Affiliate id for Trust & Will (estate help) |
| `NEXT_PUBLIC_AFFILIATE_CAPITALIZE` | Affiliate id for Capitalize (find old 401ks) |

Without the Stripe vars, the buy buttons show an honest "launching shortly" state and the free wizard is unaffected. Without an affiliate id, partner links still point to the real service — we just don't earn a commission. Affiliate ids are non-secret (they appear in the outbound URL), hence the `NEXT_PUBLIC_` prefix so they can be inlined client-side.

## Disclaimer
Frifti is independent and not affiliated with NAUPA or any state treasury. It provides
informational guidance, not legal or financial advice. Searching and claiming your own
unclaimed property from a state is always free — never pay a finder.
