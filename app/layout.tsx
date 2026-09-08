import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistSans } from "geist/font/sans";
import { Fraunces } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { MobileNav } from "@/components/MobileNav";
import { NAV_LINKS } from "@/lib/nav";
import { JsonLd } from "@/components/JsonLd";
import { OpenHelmAnalytics } from "../lib/openhelm-analytics";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}: ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name}: ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
  alternates: { canonical: SITE.url },
};

// Organization + WebSite identity, rendered on every page so any URL a crawler or AI
// assistant lands on can resolve "who publishes this / what is this site" without first
// visiting the homepage. Keep in sync with lib/site.ts.
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logo.png`,
  description: SITE.description,
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  publisher: { "@type": "Organization", name: SITE.name },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col bg-bg text-ink antialiased">
        <JsonLd data={[organizationLd, websiteLd]} />
        <header className="bg-grain bg-brand">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <Link href="/" className="flex items-center" aria-label={`${SITE.name} home`}>
              <Image src="/logo.png" alt={SITE.name} width={112} height={51} priority className="h-8 w-auto" />
            </Link>
            <div className="flex items-center gap-2 sm:gap-6">
              <nav className="hidden items-center gap-6 text-sm text-white/70 sm:flex">
                {NAV_LINKS.map((l, i) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`hover:text-white ${i === NAV_LINKS.length - 1 ? "hidden lg:inline" : ""}`}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <Link
                href="/#search"
                className="hidden shrink-0 rounded-lg bg-lime px-3 py-1.5 text-xs font-semibold text-ink hover:bg-lime-strong sm:inline-block sm:text-sm"
              >
                Find my money
              </Link>
              <MobileNav />
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">{children}</main>

        <footer className="bg-grain bg-brand">
          <div className="mx-auto max-w-6xl px-5 py-12 text-sm text-white/60">
            <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
              <div className="max-w-md">
                <Image src="/logo.png" alt={SITE.name} width={112} height={51} className="h-7 w-auto" />
                <p className="mt-4 leading-relaxed">
                  {SITE.name} is a free, independent guide that links to the official state unclaimed-property
                  programs. We are not a government agency and are not affiliated with NAUPA or any state
                  treasury. Searching and claiming your own property is always free.
                </p>
              </div>
              <nav className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs sm:grid-cols-1 sm:justify-items-end">
                <Link href="/" className="hover:text-white">Home</Link>
                <Link href="/blog" className="hover:text-white">Guides</Link>
                <Link href="/premium" className="hover:text-white">Claim Kit</Link>
                <Link href="/missingmoney-alternative" className="hover:text-white">vs MissingMoney</Link>
                <Link href="/disclosure" className="hover:text-white">Affiliate disclosure</Link>
                <Link href="/privacy" className="hover:text-white">Privacy</Link>
                <Link href="/terms" className="hover:text-white">Terms</Link>
              </nav>
            </div>
            <p className="mt-8 border-t border-white/10 pt-5 text-xs text-white/40">© 2026 {SITE.name}. All rights reserved.</p>
          </div>
        </footer>

        <Analytics />
        <SpeedInsights />
        <OpenHelmAnalytics />
      </body>
    </html>
  );
}
