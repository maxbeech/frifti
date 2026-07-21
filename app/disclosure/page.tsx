import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "How Frifti makes money: optional one-time products and a small number of relevant partner links. We never charge you to claim, and never take a cut of your property.",
  alternates: { canonical: `${SITE.url}/disclosure` },
};

export default function Disclosure() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="font-display text-3xl text-ink">Affiliate &amp; advertising disclosure</h1>
      <p className="text-sm text-muted">Last updated 30 June 2026</p>
      <div className="space-y-4 text-body">
        <p>
          {SITE.name} is free to use. Searching for and claiming your own unclaimed property from a state is always
          free, and we will never charge you for it or take a percentage of what you recover. We are not a finder or
          asset-recovery firm; in fact, we tell people to avoid them.
        </p>
        <p>We keep the lights on in two transparent ways:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Optional one-time products.</strong> Our <Link href="/premium" className="text-ink underline">Claim Kit and Estate Claim Report</Link> are
            paid, one-time packs that pre-fill and organise the paperwork for a claim you could also complete yourself
            for free. They are never required to claim.
          </li>
          <li>
            <strong>A few relevant partner links.</strong> Alongside a claim we sometimes suggest services tied to a
            real step in the process, for example online notarisation for a notarised claim form, estate help for an
            heir, or a free tool to find old 401(k)s and lost life-insurance policies. If you use some of these links
            we may earn a commission, at no extra cost to you.
          </li>
        </ul>
        <p>
          Our rules for partner links: we only show a service when it is genuinely relevant to your situation, we
          recommend free and official tools (such as the NAIC life-policy locator) right alongside paid ones, and we
          mark affiliate links clearly. A commission never changes the guidance we give: the official state portal is
          always the authoritative, free way to claim.
        </p>
        <p>Questions? Email hello@frifti.com.</p>
      </div>
    </div>
  );
}
