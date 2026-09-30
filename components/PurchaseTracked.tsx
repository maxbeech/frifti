// Fires the GA4 `purchase` event once, for a Stripe session that /success has already
// verified server-side (session.paid === true). /success itself is a server component so
// this small client island is where the browser-side event actually gets sent.
//
// Frifti has no accounts, so the buyer is identified by a one-way reference to the checkout
// session they paid through (computed on the server), as plan `paid`, right before `purchase`.
"use client";

import { useEffect, useRef } from "react";
import { claimOnce, type EventCall } from "@/lib/analytics-events";
import { sendCall } from "@/lib/analytics-send";
import { identify } from "@/lib/openhelm-analytics";

export function PurchaseTracked({ call, userRef, sessionId }: { call: EventCall; userRef: string; sessionId: string }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    // A reload of the success page is the same purchase, not a second one.
    if (!claimOnce(window.localStorage, `frifti-ga:purchase:${sessionId}`)) return;
    identify({ userRef, plan: "paid" });
    sendCall(call);
  }, [call, userRef, sessionId]);

  return null;
}
