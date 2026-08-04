import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import {
  assignExpertQuery,
  getExpertQueryById,
  replyToExpertQuery,
  setExpertQueryStatus,
  type ExpertQueryStatus,
} from "@/lib/expertQueries";
import { clientIp, rateLimit } from "@/lib/rateLimit";

type Ctx = { params: Promise<{ id: string }> };

function canAccessQuery(
  session: {
    userId: string;
    permissions: { viewAllQueries: boolean; replyAll: boolean; assignQueries: boolean };
  },
  row: { assigned_to: string | null; status: string }
): boolean {
  if (session.permissions.viewAllQueries || session.permissions.replyAll) return true;
  if (row.assigned_to === session.userId) return true;
  if (!row.assigned_to && (row.status === "pending" || row.status === "in_review")) return true;
  return false;
}

export async function GET(request: NextRequest, ctx: Ctx) {
  const auth = requireAdmin(request);
  if ("error" in auth) return auth.error;
  const { id } = await ctx.params;
  const row = await getExpertQueryById(id);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!canAccessQuery(auth.session, row)) {
    return NextResponse.json({ error: "Permission नहीं" }, { status: 403 });
  }
  return NextResponse.json({ query: row });
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const auth = requireAdmin(request);
  if ("error" in auth) return auth.error;

  const ip = clientIp(request);
  const limited = await rateLimit(`admin-eq-patch:${ip}`, 60, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id } = await ctx.params;
  const existing = await getExpertQueryById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!canAccessQuery(auth.session, existing)) {
    return NextResponse.json({ error: "Permission नहीं" }, { status: 403 });
  }

  let body: {
    reply?: string;
    expertName?: string;
    status?: string;
    assignedTo?: string | null;
    claim?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Assign / claim
  if (body.claim === true) {
    if (existing.assigned_to && existing.assigned_to !== auth.session.userId) {
      return NextResponse.json({ error: "पहले से assign है" }, { status: 409 });
    }
    const row = await assignExpertQuery(id, auth.session.userId);
    if (!row) return NextResponse.json({ error: "Claim failed" }, { status: 400 });
    return NextResponse.json({ ok: true, query: row });
  }

  if ("assignedTo" in body) {
    if (!auth.session.permissions.assignQueries && !auth.session.permissions.manageExperts) {
      return NextResponse.json({ error: "Assign permission नहीं" }, { status: 403 });
    }
    const row = await assignExpertQuery(
      id,
      body.assignedTo === null || body.assignedTo === ""
        ? null
        : String(body.assignedTo)
    );
    if (!row) return NextResponse.json({ error: "Assign failed" }, { status: 400 });
    return NextResponse.json({ ok: true, query: row });
  }

  if (typeof body.reply === "string" && body.reply.trim()) {
    // Experts may only reply to their assignment (or after claim)
    if (
      !auth.session.permissions.replyAll &&
      existing.assigned_to &&
      existing.assigned_to !== auth.session.userId
    ) {
      return NextResponse.json({ error: "यह ticket आपको assign नहीं" }, { status: 403 });
    }
    // Auto-claim unassigned when expert replies
    if (!existing.assigned_to && !auth.session.permissions.replyAll) {
      await assignExpertQuery(id, auth.session.userId);
    }

    const displayName =
      body.expertName?.trim() || auth.session.displayName || "Agriveda Expert";
    const row = await replyToExpertQuery(id, body.reply, displayName);
    if (!row) return NextResponse.json({ error: "Reply failed" }, { status: 404 });

    try {
      const { notifyFarmerOfExpertReply } = await import("@/lib/notifyExpertReply");
      const delivery = await notifyFarmerOfExpertReply(row);
      return NextResponse.json({ ok: true, query: row, delivery });
    } catch (err) {
      console.error("[admin reply notify]", err);
      return NextResponse.json({ ok: true, query: row, delivery: null });
    }
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

  return NextResponse.json({ error: "reply, status, assign, or claim required" }, { status: 400 });
}
