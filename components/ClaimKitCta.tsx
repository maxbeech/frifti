// The optional, one-time premium upsell shown under a generated claim plan. Picks the best
// product for the situation (Estate Claim Report for heirs, otherwise the Claim Kit) from
// the registry in lib/products.ts, and links through to /premium with the claim pre-filled.
// Always reassures the user the free path still works — this is help, not a gate.

import Link from "next/link";
import { recommendedProduct } from "@/lib/products";
import type { ClaimPlan, OwnerStatus } from "@/lib/claims";

export function premiumHref(opts: { productId: string; stateSlug: string; assetSlug: string; ownerStatus: OwnerStatus; value: number }): string {
  const q = new URLSearchParams({
    product: opts.productId,
    state: opts.stateSlug,
    asset: opts.assetSlug,
    owner: opts.ownerStatus,
  });
  if (opts.value > 0) q.set("value", String(opts.value));
  return `/premium?${q.toString()}`;
}

export function ClaimKitCta({
  plan,
  value,
  ownerStatus,
}: {
  plan: ClaimPlan;
  value: number;
  ownerStatus: OwnerStatus;
}) {
  const product = recommendedProduct({ plan, value, ownerStatus });
  if (!product) return null;

  const href = premiumHref({
    productId: product.id,
    stateSlug: plan.state.slug,
    assetSlug: plan.asset.slug,
    ownerStatus,
    value,
  });

  return (
    <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
      <span className="inline-block rounded-full bg-emerald-600/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
        Optional · one-time · {product.priceLabel}
      </span>
      <h3 className="mt-2 font-semibold text-slate-900">Want it done for you? Get the {product.name}</h3>
      <p className="mt-1 text-sm text-slate-600">{product.tagline}</p>
      <Link
        href={href}
        className="mt-3 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        See what&apos;s inside the {product.name} →
      </Link>
      <p className="mt-2 text-xs text-slate-500">
        Claiming from {plan.state.name} is free and you can do it yourself with the checklist above — the{" "}
        {product.name} just does the organising for you.
      </p>
    </div>
  );
}
