/**
 * Lightweight product analytics — local buffer + optional beacon.
 * No third-party SDK required; safe for Capacitor WebView.
 */

export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

const KEY = "agriveda-analytics-events";
const MAX = 200;

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

/** Track a farmer action (page_view, tool_open, ai_scan, bug_report, …) */
export function track(name: string, props?: AnalyticsProps) {
  if (typeof window === "undefined") return;
  const event = { name, props, t: new Date().toISOString() };
  const next = [...readBuffer(), event];
  writeBuffer(next);

  // Dev visibility
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", name, props ?? {});
  }

  // Optional ingest endpoint (no-op if missing / offline)
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
