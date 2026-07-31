import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE = "agriveda_admin";
export const ADMIN_MAX_AGE_SEC = 60 * 60 * 12; // 12 hours

type AdminPayload = {
  role: "admin";
  exp: number;
};

function adminSecret(): string | null {
  const secret = process.env.ADMIN_PANEL_SECRET;
  if (secret && secret.length >= 12) return secret;
  // Dev convenience only — never treat as production auth
  if (process.env.NODE_ENV !== "production" && process.env.VERCEL_ENV !== "production") {
    return "dev-admin-agriveda";
  }
  return null;
}

function signingKey(): string | null {
  return (
    process.env.SESSION_SECRET ||
    process.env.AUTH_SECRET ||
    (process.env.NODE_ENV !== "production" ? "dev-only-agriveda-session-secret" : null)
  );
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function isAdminConfigured(): boolean {
  return Boolean(adminSecret());
}

export function verifyAdminPassword(password: string): boolean {
  const secret = adminSecret();
  if (!secret || !password) return false;
  return safeEqual(password, secret);
}

export function signAdminToken(): string {
  const key = signingKey();
  if (!key) throw new Error("SESSION_SECRET required for admin cookies");
  const payload: AdminPayload = {
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + ADMIN_MAX_AGE_SEC,
  };
  const data = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = createHmac("sha256", key).update(`admin:${data}`).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const key = signingKey();
  if (!key) return false;
  const [data, sig] = token.split(".");
  if (!data || !sig) return false;
  const expected = createHmac("sha256", key).update(`admin:${data}`).digest("base64url");
  if (!safeEqual(sig, expected)) return false;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as AdminPayload;
    if (payload.role !== "admin") return false;
    if (payload.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

export function readAdminFromRequest(req: NextRequest): boolean {
  return verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);
}

export function requireAdmin(
  req: NextRequest
): { ok: true } | { error: NextResponse } {
  if (!readAdminFromRequest(req)) {
    return {
      error: NextResponse.json({ error: "Admin login required" }, { status: 401 }),
    };
  }
  return { ok: true };
}

export function applyAdminCookie(res: NextResponse, token: string): void {
  const secure =
    process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_MAX_AGE_SEC,
  });
}

export function clearAdminCookie(res: NextResponse): void {
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

export function generateAdminSecret(): string {
  return randomBytes(24).toString("base64url");
}
