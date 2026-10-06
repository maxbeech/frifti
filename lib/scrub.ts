import type { Breadcrumb, ErrorEvent, EventHint, Log } from "@sentry/nextjs";

type TransactionEvent = Parameters<NonNullable<NonNullable<Parameters<typeof import("@sentry/nextjs").init>[0]>["beforeSendTransaction"]>>[0];

/**
 * The one scrubber for everything Frifti sends to Sentry: events, logs,
 * breadcrumbs and transactions.
 *
 * Three rules it never breaks:
 *  1. FAIL CLOSED. If scrubbing throws, the event/log/breadcrumb is dropped (null),
 *     never sent raw.
 *  2. LINEAR TIME. Every pattern uses bounded repetition and no nested or
 *     overlapping quantifiers, and text is truncated to MAX_TEXT before matching,
 *     so hostile log text cannot cause catastrophic backtracking.
 *  3. Feedback keeps the name and email the person typed; everything else loses them.
 */

export const REDACTED = "[redacted]";
/** Strings longer than this are cut before any regex runs. */
export const MAX_TEXT = 10_000;
const MAX_DEPTH = 6;
const MAX_KEYS = 100;

// Order matters little; each is independently bounded.
const TEXT_PATTERNS: RegExp[] = [
  // Emails.
  /[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9.-]{1,255}\.[A-Za-z]{2,24}/g,
  // JWTs (three base64url segments).
  /eyJ[A-Za-z0-9_-]{5,2000}\.[A-Za-z0-9_-]{5,2000}\.[A-Za-z0-9_-]{0,2000}/g,
  // Bearer / Basic credentials.
  /\b(?:Bearer|Basic)\s{1,5}[A-Za-z0-9._~+/=-]{8,2000}/gi,
  // Vendor-prefixed API keys: sk_, pk_, rk_, whsec_, hlm_sk_, sntrys_, sntryu_, ghp_, gho_, github_pat_.
  /\b(?:sk|pk|rk|whsec|hlm_sk|sntrys|sntryu|ghp|gho|github_pat)_[A-Za-z0-9_-]{8,300}/g,
  /\bxox[abprs]-[A-Za-z0-9-]{8,200}/g,
  /\bAKIA[0-9A-Z]{16}\b/g,
  // key=value / "key":"value" for secret-ish names (also catches access_token, api_key, ...).
  /(?:password|passwd|secret|token|authorization|api[_-]?key|cookie|signature)[A-Za-z0-9_-]{0,20}["']?\s{0,3}[:=]\s{0,3}["']?[^\s"',;&]{1,500}/gi,
  // Phone numbers: 10 to 20 chars of digits and separators, starting and ending on a digit.
  /(?<![\w.])\+?\d[\d ().-]{8,18}\d(?![\w])/g,
];

const SECRET_KEYS = [
  "key", "token", "secret", "password", "passwd", "authorization", "cookie", "session",
  "signature", "credential", "dsn", "bearer",
];
const PII_KEYS = [
  "email", "phone", "address", "firstname", "first_name", "lastname", "last_name",
  "fullname", "full_name", "username", "ssn", "birth", "dob", "ip_address",
];
// Values of these keys are URLs: keep the path, drop the query and fragment.
const URL_KEYS = new Set([
  "url", "to", "from", "http.url", "url.full", "http.target", "url.path", "referrer", "referer", "href", "origin",
]);
// Values of these keys ARE query strings.
const QUERY_KEYS = new Set(["query_string", "url.query", "http.query", "query", "search", "http.fragment", "fragment"]);

function isSensitiveKey(key: string): boolean {
  const k = key.toLowerCase();
  return SECRET_KEYS.some((s) => k.includes(s)) || PII_KEYS.some((s) => k.includes(s));
}

/** Remove the query string and fragment from a URL or path. */
export function stripQuery(url: string): string {
  const cut = url.length > MAX_TEXT ? url.slice(0, MAX_TEXT) : url;
  const q = cut.indexOf("?");
  const h = cut.indexOf("#");
  const end = q === -1 ? h : h === -1 ? q : Math.min(q, h);
  return end === -1 ? cut : cut.slice(0, end);
}

/** Redact secrets and personal data inside free text. Throws are the caller's problem (fail closed). */
export function scrubText(input: string): string {
  let text = input.length > MAX_TEXT ? `${input.slice(0, MAX_TEXT)}…[truncated]` : input;
  for (const re of TEXT_PATTERNS) text = text.replace(re, REDACTED);
  return text;
}

/** A URL-looking string inside free text ("GET https://x/y?z=1"): drop the query part of any http(s) URL. */
function stripQueriesInText(text: string): string {
  return text.replace(/(https?:\/\/[^\s?#"']{1,2000})[?#][^\s"']{0,2000}/g, "$1");
}

/** Recursively scrub a value. Beyond MAX_DEPTH the remainder is replaced, never passed through. */
export function scrubValue(value: unknown, depth = 0, key = ""): unknown {
  if (value == null) return value;
  if (typeof value === "string") {
    if (QUERY_KEYS.has(key.toLowerCase())) return REDACTED;
    if (URL_KEYS.has(key.toLowerCase())) return scrubText(stripQuery(value));
    return scrubText(stripQueriesInText(value));
  }
  if (typeof value !== "object") return value;
  if (depth >= MAX_DEPTH) return "[truncated]";
  if (Array.isArray(value)) return value.slice(0, MAX_KEYS).map((v) => scrubValue(v, depth + 1, key));
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>).slice(0, MAX_KEYS)) {
    out[k] = isSensitiveKey(k) ? REDACTED : scrubValue(v, depth + 1, k);
  }
  return out;
}

function isFeedback(event: ErrorEvent): boolean {
  return Boolean((event.contexts as Record<string, unknown> | undefined)?.feedback);
}

function scrubRequest(request: NonNullable<ErrorEvent["request"]>): void {
  if (request.url) request.url = scrubText(stripQuery(request.url));
  delete request.cookies;
  request.query_string = undefined;
  if (request.headers) request.headers = scrubValue(request.headers) as Record<string, string>;
  if (request.data) request.data = scrubValue(request.data);
}

function scrubInPlace(event: ErrorEvent | TransactionEvent, keepFeedback: boolean): void {
  if (event.request) scrubRequest(event.request);
  if (event.message) event.message = scrubText(event.message);
  for (const ex of event.exception?.values ?? []) {
    if (typeof ex.value === "string") ex.value = scrubText(ex.value);
  }
  if (event.extra) event.extra = scrubValue(event.extra) as Record<string, unknown>;
  if (event.tags) event.tags = scrubValue(event.tags) as typeof event.tags;
  if (event.contexts) {
    const feedback = (event.contexts as Record<string, unknown>).feedback;
    const scrubbed = scrubValue(event.contexts) as Record<string, unknown>;
    if (keepFeedback && feedback) scrubbed.feedback = feedback;
    event.contexts = scrubbed as typeof event.contexts;
  }
  if (!keepFeedback) delete event.user;
  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs.map((b: Breadcrumb) => scrubBreadcrumbUnsafe(b));
  }
  if (event.transaction) event.transaction = scrubText(stripQuery(event.transaction));
}

/** Sentry `beforeSend`. Fail closed: a throw drops the event. */
export function scrubEvent(event: ErrorEvent, hint?: EventHint): ErrorEvent | null {
  void hint;
  try {
    scrubInPlace(event, isFeedback(event));
    return event;
  } catch {
    return null;
  }
}

/** Sentry `beforeSendTransaction`: strips query strings from the request and every span URL. */
export function scrubTransaction(event: TransactionEvent): TransactionEvent | null {
  try {
    scrubInPlace(event, false);
    for (const span of event.spans ?? []) {
      if (span.description) span.description = scrubText(stripQueriesInText(span.description));
      if (span.data) span.data = scrubValue(span.data) as typeof span.data;
    }
    return event;
  } catch {
    return null;
  }
}

function scrubBreadcrumbUnsafe(b: Breadcrumb): Breadcrumb {
  return {
    ...b,
    message: b.message ? scrubText(stripQueriesInText(b.message)) : b.message,
    data: b.data ? (scrubValue(b.data) as Record<string, unknown>) : b.data,
  };
}

/** Sentry `beforeBreadcrumb`. Fail closed: a throw drops the breadcrumb. */
export function scrubBreadcrumb(b: Breadcrumb): Breadcrumb | null {
  try {
    return scrubBreadcrumbUnsafe(b);
  } catch {
    return null;
  }
}

/** Sentry `beforeSendLog`. Fail closed: a throw drops the log. */
export function scrubLog(log: Log): Log | null {
  try {
    return {
      ...log,
      message: typeof log.message === "string" ? scrubText(log.message) : log.message,
      attributes: log.attributes ? (scrubValue(log.attributes) as Log["attributes"]) : log.attributes,
    };
  } catch {
    return null;
  }
}
