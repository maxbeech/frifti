import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { REDIRECTS } from "./lib/redirects";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
  },
  async redirects() {
    return REDIRECTS;
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
