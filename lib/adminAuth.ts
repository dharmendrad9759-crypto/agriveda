import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  permissionsForUser,
  type PanelPermissions,
  type PanelRole,
  type PanelUser,
  OWNER_MASTER_ID,
} from "@/lib/panelUsers";

export const ADMIN_COOKIE = "agriveda_admin";
export const ADMIN_MAX_AGE_SEC = 60 * 60 * 12; // 12 hours

export type AdminSession = {
  /** @deprecated use role === owner with userId owner-master */
  role: PanelRole | "admin";
  userId: string;
  displayName: string;
  username: string;
  permissions: PanelPermissions;
  exp: number;
};

type LegacyPayload = { role: "admin"; exp: number };

function adminSecret(): string | null {
  const secret = process.env.ADMIN_PANEL_SECRET;
  if (secret && secret.length >= 12) return secret;
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

function ownerMasterSession(): Omit<AdminSession, "exp"> {
  return {
    role: "owner",
    userId: OWNER_MASTER_ID,
    displayName: "Main Owner",
    username: "owner",
    permissions: permissionsForUser({
      role: "owner",
      canAssign: true,
      canManageExperts: true,
      canViewAll: true,
    }),
  };
}

export function sessionFromPanelUser(user: PanelUser): Omit<AdminSession, "exp"> {
  return {
    role: user.role,
    userId: user.id,
    displayName: user.displayName,
    username: user.username,
    permissions: permissionsForUser(user),
  };
}

export function signAdminToken(partial?: Omit<AdminSession, "exp">): string {
  const key = signingKey();
  if (!key) throw new Error("SESSION_SECRET required for admin cookies");
  const base = partial ?? ownerMasterSession();
  const payload: AdminSession = {
    ...base,
    exp: Math.floor(Date.now() / 1000) + ADMIN_MAX_AGE_SEC,
  };
  const data = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = createHmac("sha256", key).update(`admin:${data}`).digest("base64url");
  return `${data}.${sig}`;
}

export function readAdminSession(req: NextRequest): AdminSession | null {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const key = signingKey();
  if (!key) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = createHmac("sha256", key).update(`admin:${data}`).digest("base64url");
  if (!safeEqual(sig, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as
      | AdminSession
      | LegacyPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    // Legacy single-password cookie → treat as owner
    if (
      "role" in payload &&
      payload.role === "admin" &&
      !("userId" in payload && (payload as AdminSession).userId)
    ) {
      return {
        ...ownerMasterSession(),
        exp: payload.exp,
      };
    }

    const s = payload as AdminSession;
    if (!s.userId || !s.permissions) return null;
    const role = s.role === "admin" ? "owner" : s.role;
    return { ...s, role };
  } catch {
    return null;
  }
}

/** @deprecated prefer readAdminSession */
export function verifyAdminToken(token: string | undefined | null): boolean {
  if (!token) return false;
  // Temporary shim for old call sites — decode via fake request not available
  const key = signingKey();
  if (!key) return false;
  const [data, sig] = token.split(".");
  if (!data || !sig) return false;
  const expected = createHmac("sha256", key).update(`admin:${data}`).digest("base64url");
  return safeEqual(sig, expected);
}

export function readAdminFromRequest(req: NextRequest): boolean {
  return Boolean(readAdminSession(req));
}

export function requireAdmin(
  req: NextRequest
): { ok: true; session: AdminSession } | { error: NextResponse } {
  const session = readAdminSession(req);
  if (!session) {
    return {
      error: NextResponse.json({ error: "Admin login required" }, { status: 401 }),
    };
  }
  return { ok: true, session };
}

export function requirePermission(
  req: NextRequest,
  key: keyof PanelPermissions
): { ok: true; session: AdminSession } | { error: NextResponse } {
  const auth = requireAdmin(req);
  if ("error" in auth) return auth;
  if (!auth.session.permissions[key]) {
    return {
      error: NextResponse.json(
        { error: "Permission नहीं है — Owner से अनुमति माँगें" },
        { status: 403 }
      ),
    };
  }
  return auth;
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
