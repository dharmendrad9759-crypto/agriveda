import { NextRequest, NextResponse } from "next/server";
import {
  applyAdminCookie,
  clearAdminCookie,
  isAdminConfigured,
  readAdminFromRequest,
  signAdminToken,
  verifyAdminPassword,
} from "@/lib/adminAuth";
import { kvDelete, kvGet, kvSet } from "@/lib/durableKv";
import { clientIp, rateLimit } from "@/lib/rateLimit";

const FAIL_WINDOW_MS = 30 * 60_000;
const MAX_FAILS = 12;

type FailBucket = { count: number; resetAt: number };

export async function GET(request: NextRequest) {
  return NextResponse.json({
    authenticated: readAdminFromRequest(request),
    configured: isAdminConfigured(),
  });
}

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "ADMIN_PANEL_SECRET set करें (.env)" },
      { status: 503 }
    );
  }

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

  let password = "";
  try {
    const body = (await request.json()) as { password?: string };
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    const now = Date.now();
    const prev =
      fails && now < fails.resetAt ? fails : { count: 0, resetAt: now + FAIL_WINDOW_MS };
    const next = { count: prev.count + 1, resetAt: prev.resetAt };
    await kvSet(failKey, next, Math.max(1000, next.resetAt - now));
    return NextResponse.json({ error: "गलत पासवर्ड" }, { status: 401 });
  }

  await kvDelete(failKey);

  try {
    const token = signAdminToken();
    const res = NextResponse.json({ ok: true });
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
