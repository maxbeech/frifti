"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// Last-resort boundary: a render error that escaped every page boundary.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#fff", color: "#111" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
          <div style={{ maxWidth: 440 }}>
            <h1 style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}>Something went wrong</h1>
            <p style={{ color: "#555", marginBottom: "1.5rem" }}>
              It has been reported and we&apos;ll look into it. Please try again.
            </p>
            {error.digest && <p style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#888" }}>Error ID: {error.digest}</p>}
            <button onClick={reset} style={{ padding: "0.6rem 1.4rem", border: 0, borderRadius: 8, background: "#111", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
