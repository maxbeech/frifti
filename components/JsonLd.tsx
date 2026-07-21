// Renders a JSON-LD <script> for GEO / AI-discoverability and rich results.
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  // Escape "<" so a stray "</script>" inside stringified content (e.g. blog copy) can't
  // break out of the script tag — JSON.stringify alone doesn't guard against this.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
