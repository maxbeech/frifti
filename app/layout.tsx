import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: { title: SITE.name, description: SITE.description, url: SITE.url, siteName: SITE.name, type: "website" },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
};

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-600 text-sm text-white">C</span>
          ClaimWise<span className="text-emerald-600">HQ</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-600 sm:gap-5">
          <Link href="/#finder" className="hover:text-slate-900">Find money</Link>
          <Link href="/states" className="hover:text-slate-900">States</Link>
          <Link href="/how-to-claim" className="hidden hover:text-slate-900 sm:inline">How to claim</Link>
          <Link href="/pricing" className="rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-700">Pro</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-5xl px-5 py-8 text-sm text-slate-500">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/" className="hover:text-slate-900">Find unclaimed money</Link>
          <Link href="/states" className="hover:text-slate-900">Search by state</Link>
          <Link href="/how-to-claim" className="hover:text-slate-900">How to claim</Link>
          <Link href="/missingmoney-alternative" className="hover:text-slate-900">vs MissingMoney.com</Link>
          <Link href="/pricing" className="hover:text-slate-900">Pro</Link>
        </div>
        <p className="mt-4 max-w-3xl text-xs text-slate-400">
          {SITE.name} is a free guide that routes you to official, free government unclaimed-property
          programs (your State Treasurer, Comptroller or Department of Revenue, and the NAUPA-sponsored
          MissingMoney.com). We are not a government agency and never charge a finder&apos;s fee to claim
          money that is yours. Always claim directly through the official state portal. © {new Date().getFullYear()} {SITE.name}.
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Header />
        <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
