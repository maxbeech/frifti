import * as Sentry from "@sentry/nextjs";
import { sharedSentryOptions } from "@/lib/sentry-options";

/**
 * Server and edge error reporting. Next calls `register()` once per runtime.
 * Sentry starts only when a DSN is present; without one we say so in the console.
 */
export async function register() {
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    console.warn("[sentry] SENTRY_DSN is not set; server errors and logs will not be reported");
    return;
  }
  Sentry.init({ dsn, ...sharedSentryOptions() });
}

export const onRequestError = Sentry.captureRequestError;
