// Sends one analytics event when a server-rendered page shows a state worth measuring (a failed or
// cancelled checkout, an unconfirmed payment). The pages are server components, so the browser-side
// call lives in this small client island. An optional `onceKey` keeps a reload from re-sending.
"use client";

import { useEffect, useRef } from "react";
import { claimOnce, type EventCall } from "@/lib/analytics-events";
import { sendCall } from "@/lib/analytics-send";

export function AnalyticsOnMount({ call, onceKey }: { call: EventCall; onceKey?: string }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    if (onceKey && !claimOnce(window.sessionStorage, `frifti-ga:${onceKey}`)) return;
    sendCall(call);
  }, [call, onceKey]);
  return null;
}
