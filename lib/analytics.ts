/**
 * Lightweight product analytics — OFF by default.
 * No third-party ads SDK / crash SDK. Optional beacon only if farmer enables it.
 */

import {
  isProductAnalyticsEnabled,
  scrubAnalyticsProps,
} from "@/lib/privacySanitize";

export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

const KEY = "agriveda-analytics-events";
const MAX = 80;

function readBuffer(): Array<{ name: string; props?: AnalyticsProps; t: string }> {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeBuffer(events: Array<{ name: string; props?: AnalyticsProps; t: string }>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(events.slice(-MAX)));
  } catch {
    /* quota */
  }
}

/** Track a farmer action — no-op unless Settings → product analytics ON. */
export function track(name: string, props?: AnalyticsProps) {
  if (typeof window === "undefined") return;
  if (!isProductAnalyticsEnabled()) return;
  if (!name || typeof name !== "string" || name.length > 64) return;

  const safeProps = scrubAnalyticsProps(props as Record<string, unknown>);
  const event = { name: name.slice(0, 64), props: safeProps, t: new Date().toISOString() };
  writeBuffer([...readBuffer(), event]);

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event.name, safeProps ?? {});
  }

  try {
    const body = JSON.stringify(event);
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => undefined);
    }
  } catch {
    /* offline ok */
  }
}

export function getAnalyticsBuffer() {
  return readBuffer();
}

export function clearAnalyticsBuffer() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
