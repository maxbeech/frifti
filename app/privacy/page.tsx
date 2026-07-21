import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Frifti handles your data: the free claim wizard runs entirely in your browser, we never sell personal information, and we only collect the minimum claim details needed to process an optional paid kit.",
  alternates: { canonical: `${SITE.url}/privacy` },
};

export default function Privacy() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="font-display text-3xl text-ink">Privacy Policy</h1>
      <p className="text-sm text-muted">Last updated June 18, 2026</p>
      <div className="space-y-4 text-body">
        <p>{SITE.name} is a free informational tool. The search and claim wizard run entirely in your browser: the state, property type, amount, and owner details you enter to generate a checklist are not sent to or stored by us.</p>
        <p>We do not sell personal information. If you buy an optional one-time Claim Kit or Estate Claim Report, payment is processed by Stripe; we receive only the claim details (state, property type, owner type) needed to generate your kit, never your card number. We do not create accounts.</p>
        <p>When you click through to an official state portal, or to a partner service we recommend, that destination&apos;s own privacy policy applies to anything you submit there. See our <a href="/disclosure" className="text-ink underline">affiliate disclosure</a> for how partner links work.</p>
        <p>Questions? Email privacy@frifti.com.</p>
      </div>
    </div>
  );
}
