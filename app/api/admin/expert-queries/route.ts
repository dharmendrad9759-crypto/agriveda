import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { listExpertQueriesAdmin, type ExpertQueryStatus } from "@/lib/expertQueries";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if ("error" in auth) return auth.error;

  const ip = clientIp(request);
  const limited = await rateLimit(`admin-eq-list:${ip}`, 120, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const statusParam = request.nextUrl.searchParams.get("status") ?? "all";
  const status =
    statusParam === "pending" ||
    statusParam === "in_review" ||
    statusParam === "answered" ||
    statusParam === "closed"
      ? (statusParam as ExpertQueryStatus)
      : "all";

  const rows = await listExpertQueriesAdmin({ status, limit: 100 });

  return NextResponse.json({
    queries: rows.map((r) => ({
      id: r.id,
      farmerName: r.farmer_name,
      farmerPhone: r.farmer_phone,
      location: [r.farmer_village, r.farmer_district, r.farmer_state].filter(Boolean).join(" · "),
      cropName: r.crop_name,
      cropSlug: r.crop_slug,
      queryText: r.query_text,
      photoUrl: r.photo_url,
      aiDiagnosis: r.ai_diagnosis,
      source: r.source,
      status: r.status,
      expertReply: r.expert_reply,
      expertName: r.expert_name,
      answeredAt: r.answered_at,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    })),
    counts: {
      pending: rows.filter((r) => r.status === "pending").length,
      answered: rows.filter((r) => r.status === "answered").length,
      total: rows.length,
    },
  });
}
