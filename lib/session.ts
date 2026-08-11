import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getActiveDevice } from "@/lib/authActiveDevice";
import { rejectIfNativeAppTooOld } from "@/lib/minNativeVersion";

export const SESSION_COOKIE = "agriveda_session";
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

export type SessionPayload = {
  /** Digits-only phone when present; empty string for Google-only accounts */
  phone: string;
  email?: string;
  name?: string;
  deviceId: string;
  firebaseUid?: string;
  exp: number;
};

function sessionSecret(): string | null {
  const secret = process.env.SESSION_SECRET || process.env.AUTH_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    return null;
  }
  return "dev-only-agriveda-session-secret";
}

function requireSecret(): string {
  const secret = sessionSecret();
  if (!secret) {
    throw new Error("SESSION_SECRET (min 16 chars) is required in production");
  }
  return secret;
}

function b64urlJson(value: unknown): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

/** Create a signed session token (HMAC-SHA256). */
export function signSession(
  partial: Omit<SessionPayload, "exp"> & { exp?: number }
): string {
  const payload: SessionPayload = {
    phone: partial.phone ?? "",
    email: partial.email,
    name: partial.name,
    deviceId: partial.deviceId,
    firebaseUid: partial.firebaseUid,
    exp: partial.exp ?? Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC,
  };
  const data = b64urlJson(payload);
  const sig = createHmac("sha256", requireSecret()).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const secret = sessionSecret();
  if (!secret) return null;

  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  const expected = createHmac("sha256", secret).update(data).digest("base64url");
  if (!safeEqual(sig, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as SessionPayload;
    if (!payload.deviceId || typeof payload.exp !== "number") return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!/^[a-zA-Z0-9_-]{8,80}$/.test(payload.deviceId)) return null;

    const phone = typeof payload.phone === "string" ? payload.phone : "";
    const phoneOk = phone === "" || /^\d{10,15}$/.test(phone);
    if (!phoneOk) return null;

    const googleOk = Boolean(
      payload.firebaseUid &&
        typeof payload.firebaseUid === "string" &&
        payload.firebaseUid.length >= 8 &&
        payload.email &&
        isEmail(payload.email)
    );
    const legacyPhoneOk = Boolean(phone && /^\d{10,15}$/.test(phone));

    if (!googleOk && !legacyPhoneOk) return null;

    return {
      ...payload,
      phone,
    };
  } catch {
    return null;
  }
}

export function readSessionFromRequest(req: NextRequest): SessionPayload | null {
  return verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
}

/** 401/426 JSON if not logged in, native too old, or device superseded. */
export async function requireSession(
  req: NextRequest
): Promise<{ session: SessionPayload } | { error: NextResponse }> {
  const forceUpdate = rejectIfNativeAppTooOld(req);
  if (forceUpdate) return { error: forceUpdate };

  const session = readSessionFromRequest(req);
  if (!session) {
    return {
      error: NextResponse.json(
        { error: "Login required — पहले Google से लॉगिन करें" },
        { status: 401 }
      ),
    };
  }

  if (session.firebaseUid) {
    const active = await getActiveDevice(session.firebaseUid);
    if (active && active.deviceId !== session.deviceId) {
      return {
        error: NextResponse.json(
          {
            error: "यह खाता दूसरी डिवाइस पर लॉगिन है — यहाँ से फिर लॉगिन करें",
            code: "SESSION_DEVICE_MISMATCH",
          },
          { status: 401 }
        ),
      };
    }
  }

  return { session };
}

export function applySessionCookie(res: NextResponse, token: string): void {
  const secure =
    process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

export function clearSessionCookie(res: NextResponse): void {
  const secure =
    process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/** Generate a strong random SESSION_SECRET helper (not used at runtime). */
export function generateSessionSecret(): string {
  return randomBytes(32).toString("hex");
}
