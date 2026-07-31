import { NextRequest, NextResponse } from "next/server";
import {
  applyAdminCookie,
  clearAdminCookie,
  isAdminConfigured,
  readAdminFromRequest,
  signAdminToken,
  verifyAdminPassword,
} from "@/lib/adminAuth";
import { clientIp, rateLimit } from "@/lib/rateLimit";

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
  const limited = rateLimit(`admin-login:${ip}`, 8, 15 * 60_000);
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
    return NextResponse.json({ error: "गलत पासवर्ड" }, { status: 401 });
  }

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
