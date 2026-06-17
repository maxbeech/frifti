import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: `${SITE.url}/privacy` } };

export default function Privacy() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="text-sm text-slate-400">Last updated June 18, 2026</p>
      <div className="space-y-4 text-slate-700">
        <p>{SITE.name} is a free informational tool. The search and claim wizard run entirely in your browser — the state, property type, amount, and owner details you enter to generate a checklist are not sent to or stored by us.</p>
        <p>We do not sell personal information. If you join the Pro waitlist or create an account in the future, we will collect only the email address and claim details you choose to provide, and use them solely to operate the service.</p>
        <p>When you click through to an official state portal, that government site&apos;s own privacy policy applies to anything you submit there.</p>
        <p>Questions? Email privacy@claimwisehq.com.</p>
      </div>
    </div>
  );
}
