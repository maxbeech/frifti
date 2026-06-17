import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { POSTS } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Unclaimed Property Guides",
  description: "Plain-English guides to finding and claiming unclaimed property: timelines, required documents, fees, and multi-state searches.",
  alternates: { canonical: `${SITE.url}/blog` },
};

export default function BlogIndex() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Unclaimed Property Guides</h1>
        <p className="max-w-2xl text-slate-600">Straight answers on how to find unclaimed money and get it paid out — no jargon, no upsells.</p>
      </header>
      <div className="grid gap-4">
        {POSTS.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="rounded-xl border border-slate-200 bg-white p-5 hover:border-emerald-300">
            <h2 className="font-semibold text-slate-800">{p.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{p.description}</p>
            <p className="mt-2 text-xs text-slate-400">Updated {p.updated}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
