import assert from "node:assert";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { REDACTED, scrubBreadcrumb, scrubEvent, scrubLog, scrubText, scrubTransaction } from "../lib/scrub.ts";
import { safeContext } from "../lib/observability.ts";
import { openFeedbackForm } from "../lib/feedback.ts";
import { FeedbackButton } from "../components/FeedbackButton.tsx";

let passed = 0;
async function test(name: string, fn: () => void | Promise<void>) {
  await fn();
  passed++;
  console.log(`  ok - ${name}`);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const any = (v: unknown) => v as any;

const SECRETS = [
  "jane.doe@example.com",
  "+44 7700 900123",
  "Bearer abcdefghijklmnop1234",
  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abcdefghijk",
  "sk_live_abcdefghijklmnop",
  "pk_test_abcdefghijklmnop",
  "whsec_abcdefghijklmnop",
  "hlm_sk_abcdefghijklmnop",
  "sntrys_abcdefghijklmnop",
];

await test("scrubText redacts emails, phones, bearer/JWT, API keys", () => {
  for (const s of SECRETS) {
    const out = scrubText(`context ${s} end`);
    assert.ok(!out.includes(s), `leaked: ${s} -> ${out}`);
  }
});

await test("scrubText redacts secret-looking key/value pairs and serialised objects", () => {
  const out = scrubText('{"password":"hunter2hunter2","access_token":"abc123xyz","ok":1} api_key=zzz999');
  assert.ok(!/hunter2|abc123xyz|zzz999/.test(out), out);
});

await test("scrubText stays fast on a long adversarial string and truncates", () => {
  const evil = ["a".repeat(50_000), "1 ".repeat(30_000), "a@".repeat(30_000), "sk_" + "a".repeat(50_000), "eyJ" + "a".repeat(50_000) + ".", "token=" + "=".repeat(50_000)];
  for (const s of evil) {
    const t = Date.now();
    const out = scrubText(s);
    assert.ok(Date.now() - t < 500, `slow: ${Date.now() - t}ms`);
    assert.ok(out.length <= 10_100);
  }
});

await test("scrubEvent redacts message, extra, request, breadcrumbs and drops user", () => {
  const ev = any({
    message: "failed for jane.doe@example.com",
    exception: { values: [{ value: "Bearer abcdefghijklmnop1234 rejected" }] },
    user: { email: "jane.doe@example.com" },
    extra: { email: "a@b.co", note: "sk_live_abcdefghijklmnop", count: 3 },
    request: { url: "https://www.frifti.com/x?token=abc&email=a@b.co", cookies: { a: "b" }, headers: { authorization: "Bearer x" } },
    breadcrumbs: [{ message: "GET https://www.frifti.com/y?secret=1", data: { url: "/z?a=1", to: "/q?b=2" } }],
  });
  const out = any(scrubEvent(ev));
  const blob = JSON.stringify(out);
  assert.ok(!/jane\.doe|a@b\.co|sk_live|token=|secret=|a=1|b=2|abcdefghijklmnop1234/.test(blob), blob);
  assert.strictEqual(out.user, undefined);
  assert.strictEqual(out.request.url, "https://www.frifti.com/x");
  assert.strictEqual(out.extra.count, 3);
});

await test("scrubEvent keeps name and email on feedback events only", () => {
  const ev = any({ contexts: { feedback: { name: "Jane", contact_email: "jane@example.com", message: "hi" } }, user: { email: "jane@example.com" } });
  const out = any(scrubEvent(ev));
  assert.strictEqual(out.contexts.feedback.contact_email, "jane@example.com");
  assert.strictEqual(out.user.email, "jane@example.com");
});

await test("scrubEvent fails closed (returns null) when scrubbing throws", () => {
  const ev = any({ get message(): string { throw new Error("boom"); } });
  assert.strictEqual(scrubEvent(ev), null);
  const hostile = any({ breadcrumbs: [{ get data(): unknown { throw new Error("boom"); } }] });
  assert.strictEqual(scrubEvent(hostile), null);
  assert.strictEqual(scrubBreadcrumb(any({ get message(): string { throw new Error("x"); } })), null);
  assert.strictEqual(scrubLog(any({ get message(): string { throw new Error("x"); } })), null);
});

await test("scrubBreadcrumb strips query strings and redacts message", () => {
  const b = any(scrubBreadcrumb(any({ message: "mail jane.doe@example.com", data: { url: "/a?x=1", from: "/b?y=2", to: "/c#frag" } })));
  assert.ok(!b.message.includes("jane"));
  assert.deepStrictEqual([b.data.url, b.data.from, b.data.to], ["/a", "/b", "/c"]);
});

await test("scrubLog redacts message and attributes", () => {
  const l = any(scrubLog(any({ level: "info", message: "hi jane.doe@example.com", attributes: { token: "t", email: "e", count: 2, note: "sk_live_abcdefghijklmnop" } })));
  const blob = JSON.stringify(l);
  assert.ok(!/jane\.doe|sk_live/.test(blob), blob);
  assert.strictEqual(l.attributes.token, REDACTED);
  assert.strictEqual(l.attributes.count, 2);
});

await test("scrubTransaction strips query strings from request and span data", () => {
  const t = any(
    scrubTransaction(
      any({
        transaction: "GET /api/x?y=1",
        request: { url: "https://www.frifti.com/a?b=c" },
        spans: [{ description: "GET https://www.frifti.com/a?b=c", data: { "http.url": "https://x/y?z=1", "url.query": "z=1" } }],
      }),
    ),
  );
  const blob = JSON.stringify(t);
  assert.ok(!/\?|z=1|b=c/.test(blob), blob);
});

await test("safeContext keeps ids, codes, counts and drops user content", () => {
  const c = safeContext({ scope: "x", product: "claim-kit", count: 3, ok: true, email: "a@b.co", note: "some free text with spaces", body: "x", sessionId: "cs_test_a1b2c3" });
  assert.deepStrictEqual(c, { product: "claim-kit", count: 3, ok: true, email: "[omitted]", note: "[omitted]", body: "[omitted]", sessionId: "cs_test_a1b2c3" });
});

await test("openFeedbackForm opens the form, pre-fills the user, reports unavailable", async () => {
  const calls: string[] = [];
  const sdk = {
    getFeedback: () => ({ createForm: async () => ({ appendToDom: () => calls.push("append"), open: () => calls.push("open") }) }),
    setUser: (u: { email?: string }) => calls.push(`user:${u.email}`),
  };
  assert.strictEqual(await openFeedbackForm(sdk, { email: "a@b.co" }), "opened");
  assert.deepStrictEqual(calls, ["user:a@b.co", "append", "open"]);
  assert.strictEqual(await openFeedbackForm({ getFeedback: () => undefined, setUser() {} }), "unavailable");
});

await test("FeedbackButton renders a labelled control", () => {
  const html = renderToStaticMarkup(createElement(FeedbackButton, { variant: "header" }));
  assert.ok(html.includes("Send feedback") && html.includes("<button"), html);
});

console.log(`sentry: ${passed} passed`);
