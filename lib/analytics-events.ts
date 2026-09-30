// Every analytics event Frifti sends, in one place. Pure (no React, no browser), so the names and
// payload shapes are unit-tested in test/analytics-events.test.mts and no call site invents its own.
//
// Frifti has no accounts: a visitor runs the free claim wizard and may buy a one-time Claim Kit.
// So the journey is first_visit (GA automatic) -> claim_plan_generated -> purchase, and every
// step that can stall has a `*_failed` / `checkout_cancelled` sibling. No event carries an email,
// a name or free text; every `reason` is a short code.

export const EVENTS = {
  stateSelected: "state_selected",
  claimPlanGenerated: "claim_plan_generated",
  portalClick: "portal_click",
  partnerOfferClick: "partner_offer_click",
  selectItem: "select_item",
  beginCheckout: "begin_checkout",
  checkoutFailed: "checkout_failed",
  checkoutCancelled: "checkout_cancelled",
  purchase: "purchase",
  purchaseConfirmationFailed: "purchase_confirmation_failed",
  errorBoundaryShown: "error_boundary_shown",
  errorRecoveryAction: "error_recovery_action",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

export type GaItem = { item_id: string; item_name: string; price: number };

/** Params per event, so a call site cannot drift from what the journeys read. */
export interface EventParams {
  state_selected: { state: string };
  claim_plan_generated: { state: string; asset: string; owner_status: string; complexity: string };
  portal_click: { state: string; asset: string };
  partner_offer_click: { partner: string; category: string; is_affiliate: boolean };
  select_item: { item_list_name: string; items: GaItem[] };
  begin_checkout: { currency: "USD"; value: number; items: GaItem[] };
  checkout_failed: { reason: CheckoutFailureReason; product: string };
  checkout_cancelled: { product: string };
  purchase: { transaction_id: string; currency: string; value: number; items?: GaItem[] };
  purchase_confirmation_failed: { reason: PurchaseFailureReason };
  error_boundary_shown: { digest: string };
  error_recovery_action: { action: "retry" | "home" };
}

export type CheckoutFailureReason = "checkout_error" | "not_available";
export type PurchaseFailureReason = "not_configured" | "unverified" | "not_paid" | "no_amount";

export type EventCall = { [K in keyof EventParams]: { name: K; params: EventParams[K] } }[keyof EventParams];

/**
 * What /premium should report when Stripe Checkout sent the buyer back, from its `status` query
 * value: `error` and `soon` come from /api/checkout, `cancelled` from Stripe's cancel URL.
 * Anything else (no status, a stray value) sends nothing.
 */
export function checkoutReturnEvent(status: string, productId: string): EventCall | null {
  switch (status) {
    case "error":
      return { name: "checkout_failed", params: { reason: "checkout_error", product: productId } };
    case "soon":
      return { name: "checkout_failed", params: { reason: "not_available", product: productId } };
    case "cancelled":
      return { name: "checkout_cancelled", params: { product: productId } };
    default:
      return null;
  }
}

/** Why /success could not confirm a payment. `session` is null when Stripe could not be asked. */
export function purchaseFailureReason(input: { configured: boolean; session: { paid: boolean } | null }): PurchaseFailureReason {
  if (!input.configured) return "not_configured";
  if (!input.session) return "unverified";
  return input.session.paid ? "no_amount" : "not_paid";
}

/**
 * The `purchase` event for a payment /success has verified, or null when there is no charge to
 * report (a 100% discount is a completed checkout, not revenue). `amountTotal` is what Stripe
 * actually charged, in major units; the catalogue price is only a fallback for Stripe doubles that
 * omit it.
 */
export function purchaseCall(input: {
  sessionId: string;
  amountTotal: number | null;
  currency: string | null;
  product: { id: string; name: string; priceUsd: number } | null;
}): EventCall | null {
  const value = input.amountTotal ?? input.product?.priceUsd ?? 0;
  if (!(value > 0) || !input.sessionId) return null;
  const currency = (input.currency ?? "usd").toUpperCase();
  const params: EventParams["purchase"] = { transaction_id: input.sessionId, currency, value };
  if (input.product) params.items = [{ item_id: input.product.id, item_name: input.product.name, price: input.product.priceUsd }];
  return { name: "purchase", params };
}

/** The minimum of `Storage` the once-guard needs, so tests can pass a plain object. */
export type OnceStore = { getItem(key: string): string | null; setItem(key: string, value: string): void };

/**
 * True the first time a key is seen in this browser, false on a reload of the same page.
 * Storage that throws (private mode, blocked cookies) counts as first-time, so the event is
 * sent rather than lost; GA also de-duplicates `purchase` on transaction_id.
 */
export function claimOnce(store: OnceStore | null, key: string): boolean {
  if (!store) return true;
  try {
    if (store.getItem(key)) return false;
    store.setItem(key, "1");
  } catch {
    return true;
  }
  return true;
}
