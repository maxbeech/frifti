// Thin, dependency-free wrapper over the Stripe REST API — the single place the app talks
// to Stripe. One-time payments only (mode=payment). Used by /api/checkout to create a
// session and by /success to verify one. Everything degrades gracefully: when the secret
// key is absent these helpers report "not configured" rather than throwing into the UI.

const STRIPE_API = "https://api.stripe.com/v1";

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
  });
  if (!res.ok) throw new Error(`Stripe responded ${res.status}`);
  const session = (await res.json()) as { url?: string };
  if (!session.url) throw new Error("Stripe returned no checkout URL");
  return session.url;
}

export type VerifiedSession = { paid: boolean; metadata: Record<string, string> };

/** Retrieve a session and report whether it was paid, plus its metadata. null if unverifiable. */
export async function retrieveCheckoutSession(id: string): Promise<VerifiedSession | null> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || !id) return null;

  const res = await fetch(`${STRIPE_API}/checkout/sessions/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${secret}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const s = (await res.json()) as { payment_status?: string; metadata?: Record<string, string> };
  return {
    paid: s.payment_status === "paid" || s.payment_status === "no_payment_required",
    metadata: s.metadata ?? {},
  };
}
