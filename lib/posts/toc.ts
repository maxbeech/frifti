import type { Block } from "./types";

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type TocEntry = { id: string; text: string };

/**
 * Deduped anchor id per H2 block, keyed by its index in `body`. A single pass shared by
 * `buildToc` (the on-page nav) and `PostBody` (the actual heading elements) so a repeated
 * H2 text never produces two elements with the same id — otherwise every TOC link after the
 * first duplicate would scroll to the first occurrence instead of its own.
 */
export function headingIds(body: Block[]): Map<number, string> {
  const seen = new Map<string, number>();
  const ids = new Map<number, string>();
  body.forEach((b, i) => {
    if (!("h2" in b)) return;
    const base = slugifyHeading(b.h2);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    ids.set(i, count === 0 ? base : `${base}-${count}`);
  });
  return ids;
}

/** One entry per H2 block, in document order, for the on-page table of contents. */
export function buildToc(body: Block[]): TocEntry[] {
  const ids = headingIds(body);
  return body
    .map((b, i) => ("h2" in b ? { id: ids.get(i)!, text: b.h2 } : null))
    .filter((entry): entry is TocEntry => entry !== null);
}
