import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import {
  getExpertQueryById,
  replyToExpertQuery,
  setExpertQueryStatus,
  type ExpertQueryStatus,
} from "@/lib/expertQueries";
import { clientIp, rateLimit } from "@/lib/rateLimit";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, ctx: Ctx) {
  const auth = requireAdmin(request);
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const row = await getExpertQueryById(id);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ query: row });
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const auth = requireAdmin(request);
  if ("error" in auth) return auth.error;

  const ip = clientIp(request);
  const limited = rateLimit(`admin-eq-patch:${ip}`, 60, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id } = await ctx.params;
  let body: { reply?: string; expertName?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.reply === "string" && body.reply.trim()) {
    const row = await replyToExpertQuery(
      id,
      body.reply,
      body.expertName?.trim() || "Agriveda Expert"
    );
    if (!row) return NextResponse.json({ error: "Reply failed" }, { status: 404 });
    return NextResponse.json({ ok: true, query: row });
  }

  if (
    body.status === "pending" ||
    body.status === "in_review" ||
    body.status === "answered" ||
    body.status === "closed"
  ) {
    const row = await setExpertQueryStatus(id, body.status as ExpertQueryStatus);
    if (!row) return NextResponse.json({ error: "Update failed" }, { status: 404 });
    return NextResponse.json({ ok: true, query: row });
  }

  return NextResponse.json({ error: "reply or status required" }, { status: 400 });
}
