import * as Sentry from "@sentry/nextjs";
import { sharedSentryOptions } from "@/lib/sentry-options";

/**
 * Browser error reporting. The feedback integration backs our own "Send feedback"
 * control (header, mobile menu, footer), so reports land in frifti_web.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  const shared = sharedSentryOptions();
  Sentry.init({
    dsn,
    ...shared,
    // Requests go through our tunnel route (next.config.ts). A feedback report with a
    // screenshot is sent as a raw ArrayBuffer with NO content-type, and without one the
    // tunnel receives an empty body. See getsentry/sentry-javascript#16112.
    transportOptions: { headers: { "content-type": "application/x-sentry-envelope" } },
    integrations: [
      ...shared.integrations,
      Sentry.feedbackIntegration({
        colorScheme: "system",
        autoInject: false,
        showBranding: false,
        formTitle: "Send feedback",
        submitButtonLabel: "Send feedback",
        messagePlaceholder: "A bug, an idea, anything on your mind.",
        successMessageText: "Thanks, that's reached us.",
      }),
    ],
  });
} else {
  console.warn("[sentry] NEXT_PUBLIC_SENTRY_DSN is not set; browser errors and feedback will not be reported");
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
