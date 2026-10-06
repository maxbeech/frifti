import * as Sentry from "@sentry/nextjs";
import { scrubBreadcrumb, scrubEvent, scrubLog, scrubTransaction } from "@/lib/scrub";

/**
 * The one place the options shared by every Sentry.init live (browser in
 * instrumentation-client.ts, server and edge in instrumentation.ts), so scrubbing,
 * sampling and log forwarding cannot drift between runtimes.
 */
export function sharedSentryOptions() {
  return {
    tracesSampleRate: 0.05,
    environment: process.env.NODE_ENV,
    sendDefaultPii: false,
    beforeSend: scrubEvent,
    beforeSendTransaction: scrubTransaction,
    beforeBreadcrumb: scrubBreadcrumb,
    // Structured logs, plus every console call forwarded as a log line.
    enableLogs: true,
    beforeSendLog: scrubLog,
    integrations: [Sentry.consoleLoggingIntegration({ levels: ["log", "info", "warn", "error"] })],
  };
}
