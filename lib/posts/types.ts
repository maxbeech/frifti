import type { QA } from "../faq";

export type PostCategory = "academy" | "news" | "reviews";

export type ContentFormat =
  | "how-to"
  | "deep-dive"
  | "listicle"
  | "data-study"
  | "case-study"
  | "skyscraper"
  | "review"
  | "trend";

export type FeaturedImage = {
  src: string;
  alt: string;
  /** Photographer credit, e.g. "Photo by Jane Doe on Pexels". */
  credit: string;
  creditUrl: string;
};

export type ReviewMeta = {
  itemName: string;
  /** Out of 5. */
  ratingValue: number;
  pros: string[];
  cons: string[];
};

export type Block =
  | { h2: string }
  | { h3: string }
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  | { note: string }
  | { quote: { text: string; attribution: string } }
  | { table: { caption: string; headers: string[]; rows: string[][] } };

export type Post = {
  slug: string;
  title: string;
  category: PostCategory;
  format: ContentFormat;
  author: string;
  /** First publication date, YYYY-MM-DD. */
  published: string;
  /** Last updated date, YYYY-MM-DD. */
  updated: string;
  /** Meta description AND blog-index teaser — keep to 155 characters or fewer. */
  description: string;
  primaryKeyword: string;
  supportingKeywords: string[];
  longTailPhrases: string[];
  featuredImage: FeaturedImage;
  body: Block[];
  faq: QA[];
  /** Slugs of other posts to cross-link in a "Related guides" block. */
  related: string[];
  /** Present only for category: "reviews" posts — drives Review JSON-LD. */
  review?: ReviewMeta;
};

export { type QA };
