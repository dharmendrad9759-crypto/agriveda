import { NextRequest, NextResponse } from "next/server";

function adminSigningKey(): string | null {
  const dedicated = process.env.ADMIN_COOKIE_SECRET;
  if (dedicated && dedicated.length >= 16) return dedicated;
  const session = process.env.SESSION_SECRET || process.env.AUTH_SECRET;
  if (session && session.length >= 16) return session;
  if (process.env.NODE_ENV !== "production" && process.env.VERCEL_ENV !== "production") {
    return "dev-only-agriveda-session-secret";
  }
  return null;
}

function b64urlToBytes(s: string): Uint8Array {
  const pad = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(pad + "=".repeat((4 - (pad.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function adminCookieValid(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const keyStr = adminSigningKey();
  if (!keyStr) return false;
  const [data, sig] = token.split(".");
  if (!data || !sig) return false;
  try {
    const enc = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      enc.encode(keyStr),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const ok = await crypto.subtle.verify(
      "HMAC",
      cryptoKey,
      b64urlToBytes(sig) as BufferSource,
      enc.encode(`admin:${data}`)
    );
    if (!ok) return false;
    const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(data))) as {
      exp?: number;
    };
    if (typeof payload.exp !== "number") return false;
    return payload.exp >= Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin" && pathname !== "/admin/") {
    const token = request.cookies.get("agriveda_admin")?.value;
    if (!(await adminCookieValid(token))) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();
  if (
    pathname.startsWith("/api/farm-sync") ||
    pathname.startsWith("/api/spray-logs") ||
    pathname.startsWith("/api/expert-queries") ||
    pathname.startsWith("/api/account") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/ai-doctor") ||
    pathname.startsWith("/api/kisan-saathi") ||
    pathname.startsWith("/api/push") ||
    pathname.startsWith("/api/farmer-notifications") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/tts")
  ) {
    res.headers.set("Cache-Control", "private, no-store");
    res.headers.set("Pragma", "no-cache");
  }
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};

/** Next.js still accepts the legacy middleware export name. */
export { proxy as middleware };
