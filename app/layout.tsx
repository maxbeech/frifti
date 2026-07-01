import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
  alternates: { canonical: SITE.url },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-sm font-bold text-white">F</span>
              <span>{SITE.name}</span>
            </Link>
            <nav className="flex items-center gap-5 text-sm text-slate-600">
              <Link href="/unclaimed-property/california" className="hover:text-slate-900">States</Link>
              <Link href="/blog" className="hover:text-slate-900">Guides</Link>
              <Link href="/missingmoney-alternative" className="hidden hover:text-slate-900 sm:inline">vs MissingMoney</Link>
              <Link href="/#search" className="rounded-lg bg-emerald-600 px-3 py-1.5 font-medium text-white hover:bg-emerald-700">
                Find my money
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-slate-500">
            <p className="font-medium text-slate-700">{SITE.name}</p>
            <p className="mt-1 max-w-3xl">
              {SITE.name} is a free, independent guide that links you to the official state unclaimed-property
              programs. We are not a government agency and not affiliated with NAUPA or any state treasury.
              You never have to pay a state to claim your own property — searching and claiming is always free.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-800">Home</Link>
              <Link href="/blog" className="hover:text-slate-800">Guides</Link>
              <Link href="/premium" className="hover:text-slate-800">Claim Kit</Link>
              <Link href="/missingmoney-alternative" className="hover:text-slate-800">vs MissingMoney</Link>
              <Link href="/disclosure" className="hover:text-slate-800">Affiliate disclosure</Link>
              <Link href="/privacy" className="hover:text-slate-800">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-800">Terms</Link>
            </div>
            <p className="mt-4 text-xs text-slate-400">© 2026 {SITE.name}. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
