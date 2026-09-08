// The optional, one-time premium upsell shown under a generated claim plan. Picks the best
// product for the situation (Estate Claim Report for heirs, otherwise the Claim Kit) from
// the registry in lib/products.ts, and links through to /premium with the claim pre-filled.
// Always reassures the user the free path still works — this is help, not a gate.
"use client";

import { recommendedProduct } from "@/lib/products";
import type { ClaimPlan, OwnerStatus } from "@/lib/claims";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/openhelm-analytics";

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
    <div className="mt-6 rounded-xl border border-line bg-bg p-5">
      <Badge>Optional · one-time · {product.priceLabel}</Badge>
      <h3 className="mt-2 font-display text-lg text-ink">Want it done for you? Get the {product.name}.</h3>
      <p className="mt-1 text-sm text-body">{product.tagline}</p>
      <Button
        href={href}
        variant="primary"
        size="sm"
        className="mt-3"
        onClick={() =>
          track("select_item", {
            item_list_name: "claim_kit_cta",
            items: [{ item_id: product.id, item_name: product.name, price: product.priceUsd }],
          })
        }
      >
        See what&apos;s inside the {product.name}
      </Button>
      <p className="mt-2 text-xs text-muted">
        Claiming from {plan.state.name} is free, and you can do it yourself with the checklist above. The{" "}
        {product.name} just does the organising for you.
      </p>
    </div>
  );
}
