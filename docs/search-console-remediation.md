# Search Console remediation

Updated: 2026-09-20

## Decisions and status

| Search Console status | Cause | Remediation | Verification target |
| --- | --- | --- | --- |
| Alternative page with proper canonical tag | Claim-kit query parameters personalise the on-page preview but do not create separate products. | Keep the canonical `/premium`; do not add parameter URLs to the sitemap. | Parameter URL renders 200 with a canonical to `https://www.frifti.com/premium`. |
| Page with redirect | HTTP and apex hosts are non-canonical variants. | Keep Vercel's permanent redirects to HTTPS www. | `http://frifti.com`, `http://www.frifti.com`, and `https://frifti.com` end at `https://www.frifti.com/`. |
| Not found | The historical mayonnaise product URL has no equivalent Frifti content. | Keep an honest 404 rather than introduce an irrelevant soft redirect. | The www route returns 404 after the apex redirect. |
| Discovered or crawled, currently not indexed | State-and-asset pages are useful in-product tools but share six templates, making them poor standalone search results. | Keep the pages reachable, set `noindex, follow`, and exclude them from the sitemap. | A state hub and each reviewed blog guide remain sitemap candidates; an asset route contains `noindex, follow`. |
| Crawled static files | Versioned Next.js bundles and favicon query variants are non-HTML resources. | No application change: these are not content URLs and are not in the sitemap. | Resources remain crawlable and return their correct content type. |

## Indexable inventory

The sitemap is intentionally limited to standalone static pages, the 52 state hubs, and the
typed editorial posts under `lib/posts/data/`. All sitemap URLs use `SITE.url` from
`lib/site.ts`, which is `https://www.frifti.com`.

## Follow-up in Search Console

After production is live, submit the sitemap and use URL Inspection to request recrawls of
the home page, a state hub, and representative editorial guides. Search Console statuses are
historical reports and will not clear until Google recrawls them.
