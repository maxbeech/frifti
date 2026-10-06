import * as Sentry from "@sentry/nextjs";

/**
 * The one way server code reports a problem.
 *
 * Context is ids, codes, counts and enum values ONLY. Anything else (free text,
 * names, emails, request or response bodies) is replaced with "[omitted]" here,
 * so a careless call site cannot leak user content into Sentry.
 */

const SAFE_STRING = /^[A-Za-z0-9_:.\-/]{1,100}$/;
const SENSITIVE_KEY = /key|token|secret|password|authorization|cookie|email|phone|name|address|body|payload|message/i;

export type SafeContext = Record<string, string | number | boolean | null | undefined>;

export function safeContext(context: Record<string, unknown> = {}): Record<string, string | number | boolean | null> {
  const out: Record<string, string | number | boolean | null> = {};
  for (const [k, v] of Object.entries(context)) {
    if (k === "scope" || v === undefined) continue;
    if (SENSITIVE_KEY.test(k)) out[k] = "[omitted]";
    else if (typeof v === "number" || typeof v === "boolean" || v === null) out[k] = v;
    else if (typeof v === "string" && SAFE_STRING.test(v)) out[k] = v;
    else out[k] = "[omitted]";
  }
  return out;
}

function scopeOf(context: Record<string, unknown>): string {
  return typeof context.scope === "string" && SAFE_STRING.test(context.scope) ? context.scope : "server";
}

function reportingConfigured(): boolean {
  return Boolean(process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN);
}

export function captureServerError(err: unknown, context: Record<string, unknown> = {}): void {
  const scope = scopeOf(context);
  const safe = safeContext(context);
  if (reportingConfigured()) {
    try {
      Sentry.withScope((s) => {
        s.setTag("scope", scope);
        s.setContext("ids", safe);
        s.captureException(err instanceof Error ? err : new Error(String(err)));
      });
      return;
    } catch {
      // Never let reporting an error become an error; fall through to the console.
    }
  } else {
    console.error(`[${scope}] Sentry is not configured; error not reported`);
  }
  console.error(`[${scope}]`, err, safe);
}

export function captureServerMessage(message: string, context: Record<string, unknown> = {}, level: "warning" | "error" = "warning"): void {
  const scope = scopeOf(context);
  const safe = safeContext(context);
  if (reportingConfigured()) {
    try {
      Sentry.withScope((s) => {
        s.setTag("scope", scope);
        s.setLevel(level);
        s.setContext("ids", safe);
        s.captureMessage(message);
      });
      return;
    } catch {
      /* see above */
    }
  }
  console.warn(`[${scope}]`, message, safe);
}

/** Structured log with ids-only attributes (payments, webhooks, job runs). */
export function logEvent(level: "info" | "warn" | "error", message: string, attributes: Record<string, unknown> = {}): void {
  try {
    Sentry.logger[level](message, safeContext(attributes));
  } catch {
    /* logging must never throw */
  }
}
