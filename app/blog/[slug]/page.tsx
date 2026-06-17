import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { POSTS, getPost } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${SITE.url}/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.description, type: "article", url: `${SITE.url}/blog/${post.slug}` },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    dateModified: post.updated,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  };

  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <JsonLd data={articleLd} />
      <nav className="text-xs text-slate-500">
        <Link href="/blog" className="hover:text-slate-700">Guides</Link> <span aria-hidden>/</span> {post.title}
      </nav>
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{post.title}</h1>
        <p className="text-sm text-slate-400">Updated {post.updated}</p>
      </header>
      <div className="space-y-4">
        {post.body.map((block, i) => {
          if (block.h) return <h2 key={i} className="pt-2 text-xl font-semibold text-slate-900">{block.h}</h2>;
          if (block.ul) return (
            <ul key={i} className="list-disc space-y-1 pl-5 text-slate-700">
              {block.ul.map((li) => <li key={li}>{li}</li>)}
            </ul>
          );
          return <p key={i} className="text-slate-700">{block.p}</p>;
        })}
      </div>
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-sm font-medium text-slate-800">Ready to check your name?</p>
        <Link href="/#search" className="mt-2 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
          Search unclaimed property free →
        </Link>
      </div>
    </article>
  );
}
