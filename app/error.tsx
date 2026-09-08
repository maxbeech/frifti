"use client";

import { useEffect, useRef } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/openhelm-analytics";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const reported = useRef(false);

  useEffect(() => {
    if (reported.current) return;
    reported.current = true;
    Sentry.captureException(error);
    track("error_boundary_shown", { digest: error.digest ?? "", message: error.message });
  }, [error]);

  return (
    <div className="mx-auto max-w-lg space-y-5 py-16 text-center">
      <p className="text-sm font-semibold tracking-wide text-muted uppercase">Something went wrong</p>
      <h1 className="font-display text-3xl tracking-tight text-ink">This page hit a snag</h1>
      <p className="text-body">Nothing you did wrong. Try again, or head back to search for your unclaimed property free.</p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Button
          type="button"
          icon={false}
          onClick={() => {
            track("error_recovery_action", { action: "retry" });
            reset();
          }}
        >
          Try again
        </Button>
        <Button href="/" variant="secondary" icon={false} onClick={() => track("error_recovery_action", { action: "home" })}>
          Go to homepage
        </Button>
      </div>
    </div>
  );
}
