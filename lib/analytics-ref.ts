import { createHash } from "node:crypto";

/**
 * The pseudonymous GA user reference of the OpenHelm journey contract (user property
 * `oh_user_ref`): the first 16 lowercase hex characters of SHA-256 over the UTF-8 bytes of the id.
 *
 * Server only: the raw id never reaches the browser, only this one-way ref. Frifti has no user
 * accounts, so the only id it holds for a customer is the Stripe Checkout session they paid
 * through; a buyer is one reference per purchase. Pinned to the contract vector in
 * test/analytics-events.test.mts.
 */
export function analyticsUserRef(id: string): string {
  return createHash("sha256").update(id, "utf8").digest("hex").slice(0, 16);
}
