import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of Use", alternates: { canonical: `${SITE.url}/terms` } };

export default function Terms() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold text-slate-900">Terms of Use</h1>
      <p className="text-sm text-slate-400">Last updated June 18, 2026</p>
      <div className="space-y-4 text-slate-700">
        <p>{SITE.name} provides general, informational guidance about state unclaimed-property programs. It is not legal, financial, or tax advice, and we are not a law firm, a government agency, or affiliated with NAUPA or any state treasury.</p>
        <p>Claim requirements, dormancy periods, and timelines vary by state and property type and change over time. Always verify details against the official state portal, which is the authoritative source for every claim.</p>
        <p>You can always search for and claim your own unclaimed property directly from a state for free. {SITE.name} never charges a percentage of recovered property and is not a paid finder service.</p>
        <p>The service is provided &quot;as is&quot; without warranties. To the extent permitted by law, {SITE.name} is not liable for any loss arising from use of the site.</p>
      </div>
    </div>
  );
}
