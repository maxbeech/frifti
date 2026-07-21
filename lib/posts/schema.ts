import { SITE } from "../site";
import type { Post } from "./types";

export function blogPostingLd(post: Post, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.featuredImage.src,
    datePublished: post.published,
    dateModified: post.updated,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: url,
  };
}

/** Only meaningful for how-to posts that have at least one ordered-step list. */
export function howToLd(post: Post, url: string) {
  if (post.format !== "how-to") return undefined;
  const steps = post.body.find((b): b is { ol: string[] } => "ol" in b)?.ol;
  if (!steps || steps.length < 2) return undefined;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: post.title,
    description: post.description,
    step: steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
    mainEntityOfPage: url,
  };
}

/** Only present for category: "reviews" posts with a `review` block. */
export function reviewLd(post: Post, url: string) {
  if (!post.review) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@type": "Product", name: post.review.itemName },
    reviewRating: { "@type": "Rating", ratingValue: post.review.ratingValue, bestRating: 5 },
    author: { "@type": "Organization", name: SITE.name },
    datePublished: post.published,
    mainEntityOfPage: url,
  };
}
