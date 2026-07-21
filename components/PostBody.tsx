import Link from "next/link";
import type { Block } from "@/lib/posts/types";
import { headingIds } from "@/lib/posts/toc";

// The bold-link branch must come first: at `**[text](url)**` the plain-bold branch would
// otherwise match starting at the leading `*`, and its `[^*]+` greedily swallows the whole
// `[text](url)` (no `*` inside it), rendering literal brackets instead of a link.
const INLINE_PATTERN = /\*\*\[([^\]]+)\]\(([^)]+)\)\*\*|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

function renderLink(key: number, text: string, href: string): React.ReactNode {
  const className = "text-ink underline underline-offset-2 hover:text-body";
  return href.startsWith("/") ? (
    <Link key={key} href={href} className={className}>{text}</Link>
  ) : (
    <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={className}>{text}</a>
  );
}

/** Minimal markdown-lite: `[text](url)` becomes a link, `**text**` becomes bold, `**[text](url)**` becomes a bold link. */
function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(INLINE_PATTERN)) {
    const start = match.index ?? 0;
    if (start > lastIndex) nodes.push(text.slice(lastIndex, start));

    const [full, boldLinkText, boldLinkHref, linkText, href, boldText] = match;
    if (boldLinkHref) {
      nodes.push(<strong key={key++}>{renderLink(key, boldLinkText, boldLinkHref)}</strong>);
    } else if (href) {
      nodes.push(renderLink(key++, linkText, href));
    } else if (boldText) {
      nodes.push(<strong key={key++}>{boldText}</strong>);
    }
    lastIndex = start + full.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function PostBody({ body }: { body: Block[] }) {
  const ids = headingIds(body);
  return (
    <div className="space-y-4">
      {body.map((block, i) => {
        if ("h2" in block) {
          return (
            <h2 key={i} id={ids.get(i)} className="scroll-mt-24 pt-4 font-display text-2xl tracking-tight text-ink">
              {block.h2}
            </h2>
          );
        }
        if ("h3" in block) {
          return (
            <h3 key={i} className="pt-2 font-display text-lg text-ink">
              {block.h3}
            </h3>
          );
        }
        if ("ul" in block) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5 text-body">
              {block.ul.map((li, j) => (
                <li key={j}>{renderInline(li)}</li>
              ))}
            </ul>
          );
        }
        if ("ol" in block) {
          return (
            <ol key={i} className="list-decimal space-y-1 pl-5 text-body">
              {block.ol.map((li, j) => (
                <li key={j}>{renderInline(li)}</li>
              ))}
            </ol>
          );
        }
        if ("note" in block) {
          return (
            <div key={i} className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-ink">
              <p className="mb-1 font-semibold uppercase tracking-wide text-amber-700">TL;DR</p>
              <p>{renderInline(block.note)}</p>
            </div>
          );
        }
        if ("quote" in block) {
          return (
            <blockquote key={i} className="border-l-4 border-lime-strong pl-4">
              <p className="font-display text-lg leading-snug text-ink italic">&ldquo;{block.quote.text}&rdquo;</p>
              <footer className="mt-2 text-sm text-muted">{block.quote.attribution}</footer>
            </blockquote>
          );
        }
        if ("table" in block) {
          const { caption, headers, rows } = block.table;
          return (
            <figure key={i} className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line-strong">
                    {headers.map((h, j) => (
                      <th key={j} className="py-2 pr-4 font-semibold text-ink">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, j) => (
                    <tr key={j} className="border-b border-line">
                      {row.map((cell, k) => (
                        <td key={k} className="py-2 pr-4 text-body">{renderInline(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <figcaption className="mt-2 text-xs text-muted">{caption}</figcaption>
            </figure>
          );
        }
        return (
          <p key={i} className="text-body">
            {renderInline(block.p)}
          </p>
        );
      })}
    </div>
  );
}
