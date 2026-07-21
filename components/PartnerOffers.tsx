// Contextual, trust-first "helpful next steps" block. Shows only services tied to a real
// step in the user's claim, always frames them as optional, recommends free official tools
// alongside, and discloses affiliate links clearly. Pure presentation — relevance and link
// building live in lib/partners.ts (the single source of truth).

import Link from "next/link";
import { partnersForPlan, buildPartnerLink, hasAffiliatePartners } from "@/lib/partners";
import type { ClaimPlan, OwnerStatus } from "@/lib/claims";
import { ExternalIcon } from "@/components/icons";

export function PartnerOffers({
  plan,
  value,
  ownerStatus,
}: {
  plan: ClaimPlan;
  value: number;
  ownerStatus: OwnerStatus;
}) {
  const partners = partnersForPlan({ plan, value, ownerStatus });
  if (partners.length === 0) return null;
  const showDisclosure = hasAffiliatePartners(partners);

  return (
    <section className="mt-8 border-t border-line pt-6">
      <h3 className="text-sm font-semibold text-ink">Helpful next steps</h3>
      <p className="mt-1 text-xs text-muted">
        Optional services some people use alongside a claim. None of these are needed to search or claim your
        property, that part is always free and you can do it yourself.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {partners.map((p) => {
          const { url, isAffiliate } = buildPartnerLink(p);
          return (
            <a
              key={p.slug}
              href={url}
              target="_blank"
              rel={isAffiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
              className="group flex flex-col rounded-xl border border-line bg-surface p-4 transition-colors hover:border-ink"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wide text-ink">
                {p.category}
                {p.free && " · free"}
              </span>
              <span className="mt-1 font-semibold text-ink">{p.name}</span>
              <span className="mt-1 text-sm text-body">{p.pitch}</span>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-ink group-hover:underline">
                {p.cta}
                <ExternalIcon className="h-3.5 w-3.5" />
                {isAffiliate && <span className="ml-1 font-normal text-muted">(partner)</span>}
              </span>
            </a>
          );
        })}
      </div>
      {showDisclosure && (
        <p className="mt-3 text-xs text-muted">
          Some links above are partner links: if you use one we may earn a commission, at no cost to you. We only
          list services tied to a real step in your claim and point you to free options first.{" "}
          <Link href="/disclosure" className="underline hover:text-body">
            How this works
          </Link>
          .
        </p>
      )}
    </section>
  );
}
