// Thin, dependency-free wrapper over the Stripe REST API — the single place the app talks
// to Stripe. One-time payments only (mode=payment). Used by /api/checkout to create a
// session and by /success to verify one. Everything degrades gracefully: when the secret
// key is absent these helpers report "not configured" rather than throwing into the UI.

// Overridable so a full checkout journey can be exercised against a local double that speaks
// Stripe's exact request/response contract, without real credentials. Defaults to the real API.
const STRIPE_API = process.env.STRIPE_API_BASE || "https://api.stripe.com/v1";
// Fail fast rather than hang the request if Stripe's API is slow/unreachable — the caller's
// existing graceful-degradation UI (honest "soon"/"error"/"couldn't verify" states) then kicks
// in well within a serverless function's execution budget instead of after it.
const STRIPE_TIMEOUT_MS = 10_000;

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export type CreateSessionParams = {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata: Record<string, string>;
};

/** Create a one-time-payment Checkout Session and return its hosted URL. Throws if unconfigured/failed. */
export async function createCheckoutSession(p: CreateSessionParams): Promise<string> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("Stripe is not configured");

  const body = new URLSearchParams({
    mode: "payment",
    "line_items[0][price]": p.priceId,
    "line_items[0][quantity]": "1",
    success_url: p.successUrl,
    cancel_url: p.cancelUrl,
  });
  for (const [k, v] of Object.entries(p.metadata)) body.set(`metadata[${k}]`, v);

  const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(STRIPE_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Stripe responded ${res.status}`);
  const session = (await res.json()) as { url?: string };
  if (!session.url) throw new Error("Stripe returned no checkout URL");
  return session.url;
}

export type VerifiedSession = { paid: boolean; metadata: Record<string, string>; createdAt: number };

/**
 * Retrieve a session and report whether it was paid, plus its metadata. Resolves to null if
 * unverifiable for ANY reason — non-2xx response, malformed JSON, timeout, DNS/network failure —
 * so the /success page's honest "couldn't verify this payment" state is always what renders,
 * never an uncaught exception bubbling into the generic error boundary.
 */
export async function retrieveCheckoutSession(id: string): Promise<VerifiedSession | null> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || !id) return null;

  try {
    const res = await fetch(`${STRIPE_API}/checkout/sessions/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
      signal: AbortSignal.timeout(STRIPE_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const s = (await res.json()) as { payment_status?: string; metadata?: Record<string, string>; created?: number };
    return {
      paid: s.payment_status === "paid" || s.payment_status === "no_payment_required",
      metadata: s.metadata ?? {},
      // Stripe's `created` is Unix seconds — anchor the follow-up schedule to purchase time,
      // not page-view time, so dates stay fixed if the buyer reopens a saved/printed copy later.
      createdAt: s.created ? s.created * 1000 : Date.now(),
    };
  } catch {
    return null;
  }
}
