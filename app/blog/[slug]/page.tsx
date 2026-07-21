import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PostBody } from "@/components/PostBody";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { SITE } from "@/lib/site";
import { POSTS, getPost } from "@/lib/posts";
import { faqJsonLd } from "@/lib/faq";
import { buildToc } from "@/lib/posts/toc";
import { blogPostingLd, howToLd, reviewLd } from "@/lib/posts/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

const CATEGORY_LABEL: Record<string, string> = {
  academy: "Academy",
  news: "News",
  reviews: "Review",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const url = `${SITE.url}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      images: [{ url: post.featuredImage.src, alt: post.featuredImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.featuredImage.src],
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${SITE.url}/blog/${post.slug}`;
  const toc = buildToc(post.body);
  const related = post.related.map((s) => getPost(s)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const jsonLd = [blogPostingLd(post, url), faqJsonLd(post.faq), howToLd(post, url), reviewLd(post, url)].filter(Boolean);

  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <JsonLd data={jsonLd as Record<string, unknown>[]} />
      <nav className="text-xs text-muted">
        <Link href="/blog" className="hover:text-ink">Guides</Link> <span aria-hidden>/</span> {post.title}
      </nav>
      <header className="space-y-3">
        <Badge>{CATEGORY_LABEL[post.category] ?? post.category}</Badge>
        <h1 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">{post.title}</h1>
        <p className="text-sm text-muted">
          By {post.author} · Published {post.published} · Updated {post.updated}
        </p>
      </header>
      <div className="relative h-64 w-full overflow-hidden rounded-xl bg-bg sm:h-80">
        <Image src={post.featuredImage.src} alt={post.featuredImage.alt} fill sizes="(max-width: 672px) 100vw, 672px" className="object-cover" priority />
      </div>
      <p className="text-xs text-muted">
        {post.featuredImage.credit} on{" "}
        <a href={post.featuredImage.creditUrl} target="_blank" rel="noopener noreferrer" className="underline">
          Pexels
        </a>
      </p>

      {toc.length > 1 && (
        <nav aria-label="Table of contents" className="rounded-xl border border-line bg-bg p-4">
          <p className="mb-2 text-sm font-semibold text-ink">On this page</p>
          <ul className="space-y-1 text-sm">
            {toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="text-ink hover:underline">{t.text}</a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <PostBody body={post.body} />

      {post.faq.length > 0 && (
        <section className="space-y-4 pt-2">
          <h2 className="font-display text-2xl tracking-tight text-ink">Frequently asked questions</h2>
          <Accordion items={post.faq} />
        </section>
      )}

      {related.length > 0 && (
        <section className="space-y-2 pt-2">
          <h2 className="text-lg font-semibold text-ink">Related guides</h2>
          <ul className="list-disc space-y-1 pl-5">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/blog/${r.slug}`} className="text-ink hover:underline">{r.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="rounded-xl border border-line bg-bg p-5">
        <p className="text-sm font-medium text-ink">Ready to check your name?</p>
        <Button href="/#search" size="sm" className="mt-2">Search unclaimed property free</Button>
      </div>
    </article>
  );
}
