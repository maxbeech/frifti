// Thin client wrapper around the shared Button, used only for the one-time-product buy CTA
// on /premium. That page is a server component (personalises from search params server-side),
// so the begin_checkout tracking call has to live in a small client island rather than the
// page itself. Fires before the plain <a> navigates to /api/checkout — track() only pushes to
// dataLayer synchronously, so it never delays or blocks the navigation.
"use client";

import { Button } from "@/components/ui/Button";
import { track } from "@/lib/openhelm-analytics";

export function CheckoutButton({
  href,
  productId,
  productName,
  priceUsd,
  className,
  children,
}: {
  href: string;
  productId: string;
  productName: string;
  priceUsd: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      href={href}
      variant="primary"
      icon={false}
      className={className}
      onClick={() =>
        track("begin_checkout", {
          currency: "USD",
          value: priceUsd,
          items: [{ item_id: productId, item_name: productName, price: priceUsd }],
        })
      }
    >
      {children}
    </Button>
  );
}
