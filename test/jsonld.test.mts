import assert from "node:assert";
import { jsonLdDocument } from "../lib/jsonld.ts";

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed++;
  console.log(`  ok - ${name}`);
}

test("wraps multiple JSON-LD nodes in an object-rooted graph", () => {
  const document = jsonLdDocument([
    { "@context": "https://schema.org", "@type": "Organization", name: "Frifti" },
    { "@context": "https://schema.org", "@type": "WebSite", name: "Frifti" },
  ]);

  assert.deepStrictEqual(document, {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", name: "Frifti" },
      { "@type": "WebSite", name: "Frifti" },
    ],
  });
});

test("preserves a single JSON-LD node", () => {
  const node = { "@context": "https://schema.org", "@type": "FAQPage" };
  assert.strictEqual(jsonLdDocument(node), node);
});

console.log(`jsonld.test.mts: ${passed} passed`);
