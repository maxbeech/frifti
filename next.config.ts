import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
  },
  async redirects() {
    return [
      {
        // Consolidated into is-missingmoney-com-legit 2026-08-20: same query cluster,
        // split impressions, and the surviving page already outranks this one and
        // matches the content plan's exact target keyword.
        source: "/blog/missingmoney-com-vs-state-portal",
        destination: "/blog/is-missingmoney-com-legit",
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || "maxed-labs",
  project: process.env.SENTRY_PROJECT || "frifti_web",
  silent: !process.env.CI,
  telemetry: false,
  widenClientFileUpload: true,
  // A random path per build: a fixed "/monitoring" is on ad-blocker lists.
  tunnelRoute: true,
  sourcemaps: { deleteSourcemapsAfterUpload: true },
});
