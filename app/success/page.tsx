import type { Metadata } from "next";
import * as Sentry from "@sentry/nextjs";
import { PrintButton } from "@/components/PrintButton";
import { PurchaseTracked } from "@/components/PurchaseTracked";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { retrieveCheckoutSession, stripeConfigured } from "@/lib/stripe";
import { buildClaimKit } from "@/lib/kit";
import { getProduct } from "@/lib/products";
import { getState } from "@/lib/states";
import { getAsset } from "@/lib/assets";
import type { OwnerStatus } from "@/lib/claims";

// Post-payment delivery. Verifies the Stripe session server-side, then renders the buyer's
// personalised kit straight from lib/kit.ts using the session metadata, no database. If the
// payment can't be verified, shows an explicit, honest failure state (never a fake unlock).
export const metadata: Metadata = { title: "Your Claim Kit", robots: { index: false } };

function str(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-2xl space-y-6 py-6">{children}</div>;
}

export default async function Success({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const sessionId = str(sp.session_id);

  // No session reference at all → nothing to deliver.
  if (!sessionId) {
    return (
      <Shell>
        <h1 className="font-display text-2xl text-ink">No claim kit to show</h1>
        <p className="text-body">We couldn&apos;t find a purchase reference. If you just paid, use the link in your Stripe receipt email, or start again from the kit page.</p>
        <Button href="/premium">View the Claim Kit</Button>
      </Shell>
    );
  }

  const session = stripeConfigured() ? await retrieveCheckoutSession(sessionId) : null;

  // Couldn't verify (billing not configured, or Stripe lookup failed) → explicit failure.
  if (!session || !session.paid) {
    // A buyer reaching this branch has (most likely) just paid and is stuck on an unverified
    // state — a handled failure that would otherwise leave them stalled with no trace at all.
    Sentry.captureMessage("checkout_success_unverified", {
      level: "warning",
      extra: { sessionId, hasSession: Boolean(session), stripeConfigured: stripeConfigured() },
    });
    return (
      <Shell>
        <h1 className="font-display text-2xl text-ink">We couldn&apos;t verify this payment yet</h1>
        <p className="text-body">
          {session && !session.paid
            ? "Your payment hasn't completed. If you were charged, it may still be processing, refresh in a minute, or use the link in your Stripe receipt."
            : "We couldn't confirm this purchase. If you were charged, contact us with your receipt and we'll sort it out. In the meantime, you can always claim free yourself."}
        </p>
        <Button href="/#search" variant="secondary">Start a free claim</Button>
      </Shell>
    );
  }

  // Verified paid → rebuild the exact kit from session metadata.
  const m = session.metadata;
  const product = getProduct(m.product ?? "claim-kit");
  const state = getState(m.state ?? "");
  const asset = getAsset(m.asset ?? "");
  const ownerStatus: OwnerStatus = (["self", "business", "heir"].includes(m.owner ?? "") ? m.owner : "self") as OwnerStatus;
  const value = Math.max(0, Number(m.value) || 0);

  if (!product || !state || !asset) {
    return (
      <Shell>
        <h1 className="font-display text-2xl text-ink">Payment received</h1>
        <p className="text-body">Thank you. We couldn&apos;t rebuild the claim details from this purchase, please contact us with your Stripe receipt and we&apos;ll send your kit straight over.</p>
      </Shell>
    );
  }

  const kit = buildClaimKit({ stateSlug: state.slug, assetSlug: asset.slug, ownerStatus, estimatedValue: value, product: product.id });

  // Real calendar dates for the follow-up schedule, anchored to the purchase time (from
  // Stripe) so they stay fixed if the buyer reopens a saved/printed copy of this page later.
  const purchasedAt = new Date(session.createdAt);
  const dateFor = (offsetWeeks: number) => {
    const d = new Date(purchasedAt);
    d.setDate(d.getDate() + offsetWeeks * 7);
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <article className="mx-auto max-w-2xl space-y-8 py-6">
      <PurchaseTracked transactionId={sessionId} productId={product.id} productName={product.name} priceUsd={product.priceUsd} />
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-5">
        <div>
          <Badge className="print:hidden">Payment confirmed · {product.name}</Badge>
          <h1 className="mt-1 font-display text-2xl text-ink">{kit.title}</h1>
        </div>
        <PrintButton />
      </header>

      <p className="text-body">{kit.intro}</p>
      <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 print:hidden">
        Save this page now: print it or use &ldquo;Save as PDF&rdquo;. It&apos;s your copy, there&apos;s no account to log back into.
      </p>

      <Button href={state.portal} icon="external" className="print:hidden">Open the official {state.name} portal</Button>

      <section className="space-y-3">
        <h2 className="font-display text-xl text-ink">1. Your cover letter</h2>
        <p className="text-sm text-body">Replace every [BRACKETED] field, then attach it to your claim.</p>
        <pre className="overflow-x-auto rounded-xl border border-line bg-surface p-5 font-sans text-sm whitespace-pre-wrap text-ink">{kit.coverLetter}</pre>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl text-ink">2. Document checklist</h2>
        <ul className="space-y-2">
          {kit.checklist.map((c) => (
            <li key={c.item} className="rounded-xl border border-line bg-surface p-4">
              <p className="font-medium text-ink">☐ {c.item}</p>
              <p className="mt-1 text-sm text-body">{c.why}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl text-ink">3. Follow-up schedule</h2>
        <ul className="space-y-2">
          {kit.followUps.map((f) => (
            <li key={f.label} className="flex gap-3 rounded-xl border border-line bg-surface p-4 text-sm">
              <span className="shrink-0 font-semibold text-ink">{dateFor(f.offsetWeeks)}</span>
              <span className="text-body"><span className="font-medium text-ink">{f.label}:</span> {f.action}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl text-ink">4. How to submit</h2>
        <ol className="space-y-2 text-sm text-body">
          {kit.submissionSteps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-xs font-semibold text-white">{i + 1}</span>
              <span className="pt-0.5">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl text-ink">5. Avoid these rejection reasons</h2>
        <ul className="space-y-2">
          {kit.rejectionTips.map((t) => (
            <li key={t.problem} className="rounded-xl border border-line bg-surface p-4 text-sm">
              <p className="font-medium text-ink">{t.problem}</p>
              <p className="mt-1 text-body">{t.fix}</p>
            </li>
          ))}
        </ul>
      </section>

      {kit.estateSections && (
        <section className="space-y-3">
          <h2 className="font-display text-xl text-ink">6. Estate & heir guidance</h2>
          {kit.estateSections.map((sec) => (
            <div key={sec.h} className="rounded-xl border border-line bg-surface p-4">
              <h3 className="font-semibold text-ink">{sec.h}</h3>
              {sec.p && <p className="mt-1 text-sm text-body">{sec.p}</p>}
              {sec.ul && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-body">
                  {sec.ul.map((li) => <li key={li}>{li}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      <p className="border-t border-line pt-5 text-xs text-muted">
        Frifti is independent and not affiliated with {state.agency} or any government body. This kit is
        informational guidance, not legal advice. The official {state.name} portal is always the authoritative
        source for your claim, and claiming from the state is free.
      </p>
    </article>
  );
}
