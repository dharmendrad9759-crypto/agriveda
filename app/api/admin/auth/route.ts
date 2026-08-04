import { NextRequest, NextResponse } from "next/server";
import {
  applyAdminCookie,
  clearAdminCookie,
  isAdminConfigured,
  readAdminSession,
  sessionFromPanelUser,
  signAdminToken,
  verifyAdminPassword,
} from "@/lib/adminAuth";
import {
  findPanelUserByUsername,
  touchPanelLogin,
  verifyPanelPassword,
} from "@/lib/panelUsers";
import { kvDelete, kvGet, kvSet } from "@/lib/durableKv";
import { clientIp, rateLimit } from "@/lib/rateLimit";

const FAIL_WINDOW_MS = 30 * 60_000;
const MAX_FAILS = 12;

type FailBucket = { count: number; resetAt: number };

export async function GET(request: NextRequest) {
  const session = readAdminSession(request);
  if (!session) {
    return NextResponse.json({
      authenticated: false,
      configured: isAdminConfigured(),
    });
  }
  return NextResponse.json({
    authenticated: true,
    configured: isAdminConfigured(),
    user: {
      id: session.userId,
      username: session.username,
      displayName: session.displayName,
      role: session.role === "admin" ? "owner" : session.role,
      permissions: session.permissions,
    },
  });
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const failKey = `admin-fail:${ip}`;
  const fails = await kvGet<FailBucket>(failKey);
  if (fails && Date.now() < fails.resetAt && fails.count >= MAX_FAILS) {
    const retry = Math.max(1, Math.ceil((fails.resetAt - Date.now()) / 1000));
    return NextResponse.json(
      { error: `बहुत गलत प्रयास — ${retry}s बाद` },
      { status: 429 }
    );
  }

  const limited = await rateLimit(`admin-login:${ip}`, 8, 15 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: `बहुत कोशिशें — ${limited.retryAfterSec}s बाद` },
      { status: 429 }
    );
  }

  let username = "";
  let password = "";
  try {
    const body = (await request.json()) as { password?: string; username?: string };
    password = String(body.password ?? "");
    username = String(body.username ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const bumpFail = async () => {
    const now = Date.now();
    const prev =
      fails && now < fails.resetAt ? fails : { count: 0, resetAt: now + FAIL_WINDOW_MS };
    const next = { count: prev.count + 1, resetAt: prev.resetAt };
    await kvSet(failKey, next, Math.max(1000, next.resetAt - now));
  };

  try {
    // Path A: expert/manager login with username + password
    if (username) {
      const user = await findPanelUserByUsername(username);
      if (!user || !user.active || !verifyPanelPassword(password, user.passwordHash)) {
        await bumpFail();
        return NextResponse.json({ error: "गलत username / password" }, { status: 401 });
      }
      await kvDelete(failKey);
      await touchPanelLogin(user.id);
      const token = signAdminToken(sessionFromPanelUser(user));
      const res = NextResponse.json({
        ok: true,
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          role: user.role,
          permissions: sessionFromPanelUser(user).permissions,
        },
      });
      applyAdminCookie(res, token);
      return res;
    }

    // Path B: Main Owner master password (ADMIN_PANEL_SECRET)
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: "ADMIN_PANEL_SECRET set करें (.env) — Main Owner login" },
        { status: 503 }
      );
    }
    if (!verifyAdminPassword(password)) {
      await bumpFail();
      return NextResponse.json({ error: "गलत पासवर्ड" }, { status: 401 });
    }

    await kvDelete(failKey);
    const token = signAdminToken();
    const res = NextResponse.json({
      ok: true,
      user: {
        id: "owner-master",
        username: "owner",
        displayName: "Main Owner",
        role: "owner",
        permissions: sessionFromPanelUser({
          id: "owner-master",
          username: "owner",
          displayName: "Main Owner",
          role: "owner",
          canAssign: true,
          canManageExperts: true,
          canViewAll: true,
          active: true,
          cropScopes: [],
          createdAt: "",
          lastLoginAt: null,
        }).permissions,
      },
    });
    applyAdminCookie(res, token);
    return res;
  } catch {
    return NextResponse.json({ error: "SESSION_SECRET missing" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearAdminCookie(res);
  return res;
}
