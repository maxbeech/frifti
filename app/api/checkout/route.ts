import { NextResponse } from "next/server";

// Stripe checkout endpoint. Degrades gracefully when STRIPE_* env vars are absent:
// returns a friendly "launching shortly" JSON instead of a 500, so the Pro waitlist
// button never breaks before billing is wired up.
export async function GET() {
  return handle();
}

export async function POST() {
  return handle();
}

async function handle() {
  const secret = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!secret || !priceId) {
    return NextResponse.json(
      {
        ok: true,
        status: "waitlist",
        message:
          "ClaimWise HQ Pro is launching shortly. The free 50-state search and claim wizard are available now — paid claim tracking is coming soon.",
      },
      { status: 200 },
    );
  }

  // Billing is configured — create a Checkout Session via the Stripe REST API
  // (no SDK dependency needed for a single call).
  try {
    const origin = process.env.SITE_URL || "https://claimwisehq.vercel.app";
    const body = new URLSearchParams({
      mode: "subscription",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
    });
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) throw new Error(`Stripe responded ${res.status}`);
    const session = (await res.json()) as { url?: string };
    if (!session.url) throw new Error("No checkout URL returned");
    return NextResponse.redirect(session.url, 303);
  } catch {
    return NextResponse.json(
      { ok: false, status: "unavailable", message: "Checkout is temporarily unavailable. Please try again shortly." },
      { status: 503 },
    );
  }
}
