// Typed front door to track(): the event name and its params must agree with lib/analytics-events.ts.
// Client-side only in effect; track() is a no-op on the server and when no measurement id is set.
import { track } from "@/lib/openhelm-analytics";
import type { EventCall, EventParams } from "@/lib/analytics-events";

export function sendEvent<K extends keyof EventParams>(name: K, params: EventParams[K]): boolean {
  return track(name, params);
}

export function sendCall(call: EventCall): boolean {
  return track(call.name, call.params);
}
