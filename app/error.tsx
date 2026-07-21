"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg space-y-5 py-16 text-center">
      <p className="text-sm font-semibold tracking-wide text-muted uppercase">Something went wrong</p>
      <h1 className="font-display text-3xl tracking-tight text-ink">This page hit a snag</h1>
      <p className="text-body">Nothing you did wrong. Try again, or head back to search for your unclaimed property free.</p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Button type="button" onClick={() => reset()} icon={false}>Try again</Button>
        <Button href="/" variant="secondary" icon={false}>Go to homepage</Button>
      </div>
    </div>
  );
}
