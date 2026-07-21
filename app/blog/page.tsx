import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { POSTS } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Unclaimed Property Guides",
  description: "Plain-English guides to finding and claiming unclaimed property: timelines, required documents, fees, and multi-state searches.",
  alternates: { canonical: `${SITE.url}/blog` },
};

const CATEGORY_LABEL: Record<string, string> = {
  academy: "Academy",
  news: "News",
  reviews: "Review",
};

export default function BlogIndex() {
  const sorted = [...POSTS].sort((a, b) => (a.published < b.published ? 1 : -1));
  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Unclaimed Property Guides",
    url: `${SITE.url}/blog`,
    publisher: { "@type": "Organization", name: SITE.name },
    blogPost: sorted.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.published,
      dateModified: p.updated,
      url: `${SITE.url}/blog/${p.slug}`,
    })),
  };
  return (
    <div className="space-y-8">
      <JsonLd data={blogLd} />
      <header className="max-w-2xl space-y-2">
        <h1 className="font-display text-3xl tracking-tight text-ink sm:text-5xl">Unclaimed Property Guides</h1>
        <p className="text-lg text-body">Straight answers on how to find unclaimed money and get it paid out. No jargon, no upsells.</p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2">
        {sorted.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-ink"
          >
            <div className="relative h-44 w-full overflow-hidden bg-bg">
              <Image
                src={p.featuredImage.src}
                alt={p.featuredImage.alt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 rounded bg-lime px-2 py-0.5 text-[11px] font-semibold tracking-wide text-ink uppercase">
                {CATEGORY_LABEL[p.category] ?? p.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-5">
              <h2 className="font-display text-lg leading-snug text-ink">{p.title}</h2>
              <p className="mt-1 text-sm text-body">{p.description}</p>
              <p className="mt-2 text-xs text-muted">Published {p.published}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
