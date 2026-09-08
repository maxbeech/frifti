import { NextResponse, type NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { getProduct, isProductPurchasable } from "@/lib/products";
import { createCheckoutSession } from "@/lib/stripe";
import { getState } from "@/lib/states";
import { getAsset } from "@/lib/assets";
import { SITE } from "@/lib/site";

// One-time Claim Kit / Estate Report checkout. The claim context (state/asset/owner/value)
// is carried in query params and stored as Stripe session metadata so /success can rebuild
// and deliver the exact personalised kit after payment — no database required.
//
// Graceful degradation: if billing for the requested product isn't configured, we redirect
// back to /premium (which shows an honest "coming soon" state) rather than erroring.

export async function GET(req: NextRequest) {
  return handle(req);
}
export async function POST(req: NextRequest) {
  return handle(req);
}

async function handle(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const productId = sp.get("product") ?? "claim-kit";
  const product = getProduct(productId);

  // Validate the claim context against our source-of-truth data.
  const state = getState(sp.get("state") ?? "");
  const asset = getAsset(sp.get("asset") ?? "");
  const ownerRaw = sp.get("owner") ?? "self";
  const owner = ["self", "business", "heir"].includes(ownerRaw) ? ownerRaw : "self";
  const value = String(Math.max(0, Number(sp.get("value")) || 0));

  if (!product || !state || !asset) {
    return NextResponse.redirect(new URL("/premium", req.nextUrl.origin), 303);
  }

  const back = `/premium?product=${product.id}&state=${state.slug}&asset=${asset.slug}&owner=${owner}${value !== "0" ? `&value=${value}` : ""}`;

  // Billing not live for this product → send the user to the honest premium page.
  if (!isProductPurchasable(product)) {
    return NextResponse.redirect(new URL(`${back}&status=soon`, req.nextUrl.origin), 303);
  }

  try {
    const origin = process.env.SITE_URL || req.nextUrl.origin || SITE.url;
    const url = await createCheckoutSession({
      priceId: process.env[product.priceEnv]!,
      successUrl: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}${back}`,
      metadata: { product: product.id, state: state.slug, asset: asset.slug, owner, value },
    });
    return NextResponse.redirect(url, 303);
  } catch (error) {
    Sentry.captureException(error, { extra: { product: product.id, state: state.slug, asset: asset.slug } });
    return NextResponse.redirect(new URL(`${back}&status=error`, req.nextUrl.origin), 303);
  }
}
