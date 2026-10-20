# SEO recovery, October 2026

Written 2026-10-20. This is the change log for the consolidation pass after the August 2026 spam update.

## Diagnosis

Daily impressions in Search Console (sc-domain:frifti.com) ran at roughly 300 to 850 a day until 2026-08-10 (572), then fell to 51 on 2026-08-11 and about 10 to 30 a day since. Clicks were already near zero (0 to 2 a day, average position about 45), so the site was never really ranking; it was being shown deep in results.

The cliff is a week before Google's spam update (18 to 21 Aug), so the update did not cause it. Git history for 2026-08-01 to 08-13 shows no robots, noindex, canonical, redirect or layout change: only a mail client regeneration, a GEO audit adding JSON-LD and a robots allowlist for AI crawlers (08-03), and two new blog posts (08-06, 08-11). Nothing in code explains the cliff. The likeliest reading is a quality reassessment of the whole domain, which fits a site of 312 near-identical state x property-type pages plus 51 state pages. A manual action was not checked here (no Search Console access to that report); look under Security & Manual Actions.

Impressions 2026-07-01 to 2026-08-17 by family:

| Family | Pattern | URLs | Impressions | Clicks | Verdict | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| State hubs | `/unclaimed-property/{state}` | 52 | 16,325 | 17 | keep | Each has its own official portal and agency. The rest of the page is shared, so they are thin; see "Not done". |
| State x asset | `/unclaimed-property/{state}/{asset}` | 312 | 707 | 15 | merge | Six shared texts with the state name swapped. No state-specific rules are stored for any asset type. Was already `noindex` and out of the sitemap since 2026-09-20. Now 301 to the hub. |
| Hand-written guides | `/blog/{slug}` | 25 | 3,224 (incl. anchors) | 15 | keep | Individually written, distinct topics. |
| Templated guides | `/blog/{slug}` | 15 | 0 (published after the cliff) | 0 | merge | Built by one `makePost` function: the same ~15 paragraphs and fictional worked examples with the topic swapped. 301 to the closest real guide (or state hub). Nothing unique to move across. |
| Static | home, /blog, /premium, /missingmoney-alternative, legal | 7 | 113 | 2 | keep | |

## What changed

- `/unclaimed-property/{state}/{asset}` removed; permanent redirect to the state hub. Property-type links removed from the hub.
- 15 templated guides removed with permanent redirects (map in `lib/redirects.ts`). Three state explainers (Florida, Connecticut, North Carolina) go to their state hub; the rest go to the strongest related hand-written guide.
- Sitemap: 99 URLs before, 84 after (7 static, 52 hubs, 25 guides).
- Tests in `test/seo.test.mts` check the redirects, that every target is a live page, that no removed slug is still published, and the sitemap count.

## Not done

- State hubs share their text apart from name, agency and portal. If the next update still hits the site, the hubs are the next place to look. They need real per-state data (dormancy periods, value limits, claim rules) with sources; none is stored today and it was not invented here.
- The 25 remaining guides were not individually fact-checked for invented examples.
- Recovery takes months; do not expect movement before the next core or spam update.
