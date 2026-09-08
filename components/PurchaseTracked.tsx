// Fires the GA4 `purchase` event once, for a Stripe session that /success has already
// verified server-side (session.paid === true). /success itself is a server component so
// this small client island is where the browser-side event actually gets sent.
"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/openhelm-analytics";

export function PurchaseTracked({
  transactionId,
  productId,
  productName,
  priceUsd,
}: {
  transactionId: string;
  productId: string;
  productName: string;
  priceUsd: number;
}) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    track("purchase", {
      transaction_id: transactionId,
      currency: "USD",
      value: priceUsd,
      items: [{ item_id: productId, item_name: productName, price: priceUsd }],
    });
  }, [transactionId, productId, productName, priceUsd]);

  return null;
}
