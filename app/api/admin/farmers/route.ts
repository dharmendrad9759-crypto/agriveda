import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/adminAuth";
import { countFarmersAdmin, listFarmersAdmin } from "@/lib/farmersAdmin";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = requirePermission(request, "viewAllQueries");
  if ("error" in auth) return auth.error;

  const ip = clientIp(request);
  const limited = await rateLimit(`admin-farmers:${ip}`, 60, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const q = request.nextUrl.searchParams.get("q") ?? "";
  const countOnly = request.nextUrl.searchParams.get("countOnly") === "1";

  if (countOnly) {
    const { total, configured } = await countFarmersAdmin();
    return NextResponse.json({ total, configured });
  }

  const limit = Number(request.nextUrl.searchParams.get("limit") ?? "50");
  const offset = Number(request.nextUrl.searchParams.get("offset") ?? "0");

  const { farmers, total, configured } = await listFarmersAdmin({ q, limit, offset });

  return NextResponse.json({
    farmers: farmers.map((f) => ({
      id: f.id,
      deviceId: f.deviceId,
      name: f.profile?.name || f.name,
      phone: f.profile?.phone || f.phone,
      email: f.profile?.email ?? null,
      location: [f.profile?.village, f.profile?.district, f.profile?.state]
        .filter(Boolean)
        .join(" · "),
      district: f.profile?.district ?? null,
      state: f.profile?.state ?? null,
      pincode: f.profile?.pincode ?? null,
      language: f.language,
      createdAt: f.createdAt,
      profileUpdatedAt: f.profileUpdatedAt,
      farmUpdatedAt: f.farmUpdatedAt,
      hasPush: f.hasPush,
      hasProfile: Boolean(f.profile?.onboardingComplete),
      hasFarm: Boolean(f.farm?.fieldCount),
      fieldCount: f.farm?.fieldCount ?? 0,
      crops: f.farm?.crops ?? [],
      farmAreaAcres: f.profile?.totalFarmAreaAcres ?? null,
      lastLat: f.lastLat,
      lastLon: f.lastLon,
    })),
    total,
    configured,
    viewer: auth.session.displayName,
  });
}
