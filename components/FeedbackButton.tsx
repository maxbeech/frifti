"use client";

import { useState } from "react";
import { MessageIcon } from "@/components/icons";
import { openFeedbackForm } from "@/lib/feedback";

/**
 * The one feedback control. It opens Sentry's feedback form, so a report from a
 * visitor lands in the same Sentry project as the errors from the code.
 * The SDK is imported lazily so it is not part of the first paint.
 */
export function FeedbackButton({
  variant = "header",
  className = "",
  onOpen,
}: {
  variant?: "header" | "footer" | "drawer";
  className?: string;
  onOpen?: () => void;
}) {
  const [unavailable, setUnavailable] = useState(false);

  const open = async () => {
    onOpen?.();
    try {
      const Sentry = await import("@sentry/nextjs");
      const result = await openFeedbackForm(Sentry);
      if (result === "unavailable") setUnavailable(true);
    } catch {
      setUnavailable(true);
    }
  };

  if (unavailable) return <span className={`text-xs ${className}`}>Feedback isn&apos;t available right now.</span>;

  const styles =
    variant === "header"
      ? "inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white"
      : variant === "drawer"
        ? "flex w-full items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-white/85 hover:bg-white/5 hover:text-white"
        : "inline-flex items-center gap-1.5 text-xs hover:text-white";

  return (
    <button type="button" onClick={open} data-testid="feedback-button" className={`${styles} ${className}`}>
      <MessageIcon className="h-4 w-4 shrink-0" />
      Send feedback
    </button>
  );
}
