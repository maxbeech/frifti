import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg space-y-5 py-16 text-center">
      <p className="text-sm font-semibold tracking-wide text-muted uppercase">404</p>
      <h1 className="font-display text-3xl tracking-tight text-ink">We couldn&apos;t find that page</h1>
      <p className="text-body">The state, guide or page you were looking for doesn&apos;t exist, but your money might still be waiting.</p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Button href="/#search">Start a free claim</Button>
        <Button href="/" variant="secondary" icon={false}>Go to homepage</Button>
      </div>
    </div>
  );
}
