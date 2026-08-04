/** Keys never allowed in product analytics / logs */
const BLOCKED_PROP_KEYS = new Set([
  "phone",
  "mobile",
  "token",
  "password",
  "otp",
  "secret",
  "authorization",
  "cookie",
  "name",
  "farmername",
  "farmer_name",
  "farmerphone",
  "farmer_phone",
  "village",
  "address",
  "email",
  "lat",
  "lng",
  "latitude",
  "longitude",
  "location",
  "photo",
  "image",
  "imagebase64",
  "imagebase64second",
  "base64",
  "dataurl",
  "thumbnail",
  "thumbnailurl",
  "deviceid",
  "device_id",
  "firebaseuid",
  "session",
]);

function isBlockedKey(key: string): boolean {
  const k = key.toLowerCase().replace(/[^a-z0-9_]/g, "");
  if (BLOCKED_PROP_KEYS.has(k)) return true;
  if (k.includes("phone") || k.includes("password") || k.includes("token")) return true;
  if (k.includes("base64") || k.includes("photo") || k.includes("image")) return true;
  return false;
}

/** Strip PII / media from analytics props before buffer or network. */
export function scrubAnalyticsProps(
  props?: Record<string, unknown> | null
): Record<string, string | number | boolean> | undefined {
  if (!props || typeof props !== "object") return undefined;
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(props)) {
    if (isBlockedKey(key)) continue;
    if (value == null) continue;
    if (typeof value === "string") {
      if (value.length > 80) continue;
      if (/^\d{10}$/.test(value)) continue;
      if (value.startsWith("data:") || value.includes("base64")) continue;
      out[key] = value;
    } else if (typeof value === "number" || typeof value === "boolean") {
      out[key] = value;
    }
  }
  return Object.keys(out).length ? out : undefined;
}

export function isProductAnalyticsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem("agriveda-app-settings");
    if (!raw) return false; // privacy-first default: OFF
    const parsed = JSON.parse(raw) as { productAnalytics?: boolean };
    return parsed.productAnalytics === true;
  } catch {
    return false;
  }
}
