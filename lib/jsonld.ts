export type JsonLdNode = Record<string, unknown>;

/**
 * Keeps every JSON-LD script rooted at an object. Safari's JSON-LD parser throws
 * when a script has a top-level array, even though that form is valid JSON-LD.
 */
export function jsonLdDocument(data: JsonLdNode | JsonLdNode[]): JsonLdNode {
  if (!Array.isArray(data)) return data;

  return {
    "@context": "https://schema.org",
    "@graph": data.map((item) => {
      const node = { ...item };
      delete node["@context"];
      return node;
    }),
  };
}
