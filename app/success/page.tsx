import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "You're on the list", robots: { index: false } };

export default function Success() {
  return (
    <div className="mx-auto max-w-xl space-y-4 py-12 text-center">
      <h1 className="text-3xl font-bold text-slate-900">You&apos;re on the Pro waitlist 🎉</h1>
      <p className="text-slate-600">
        Thanks for your interest in ClaimWise HQ Pro. In the meantime, the free 50-state search and claim wizard
        are ready to use right now.
      </p>
      <Link href="/#search" className="inline-block rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
        Start a free claim →
      </Link>
    </div>
  );
}
