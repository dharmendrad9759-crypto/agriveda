/** Reliable Capacitor / Android WebView detection */
export function isCapacitorNative(): boolean {
  if (typeof window === "undefined") return false;

  const w = window as Window & { Capacitor?: { isNativePlatform?: () => boolean } };
  if (w.Capacitor?.isNativePlatform?.()) return true;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Capacitor } = require("@capacitor/core") as typeof import("@capacitor/core");
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

/** Full page load — required for Next.js App Router inside Capacitor WebView */
export function hardNavigate(path: string): void {
  if (typeof window === "undefined" || !path) return;

  const target =
    path.startsWith("http://") || path.startsWith("https://")
      ? path
      : `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`;

  const current = window.location.href;
  if (current === target || current === `${target}/`) return;

  window.location.href = target;
}

export function hrefToPath(href: string): string | null {
  if (!href || href.startsWith("#") || href.startsWith("javascript:")) return null;
  if (href.startsWith("/")) return href;
  try {
    const url = new URL(href, window.location.origin);
    if (url.origin === window.location.origin) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return null;
  }
  return null;
}
