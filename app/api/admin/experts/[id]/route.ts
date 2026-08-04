import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/adminAuth";
import { updatePanelUser, type PanelRole } from "@/lib/panelUsers";
import { clientIp, rateLimit } from "@/lib/rateLimit";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const auth = requirePermission(request, "manageExperts");
  if ("error" in auth) return auth.error;

  const limited = await rateLimit(`admin-experts-patch:${clientIp(request)}`, 40, 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id } = await ctx.params;
  let body: {
    displayName?: string;
    role?: string;
    canAssign?: boolean;
    canManageExperts?: boolean;
    canViewAll?: boolean;
    active?: boolean;
    password?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const role =
    body.role === "manager" || body.role === "expert" ? (body.role as PanelRole) : undefined;

  const result = await updatePanelUser(id, {
    displayName: body.displayName,
    role,
    canAssign: body.canAssign,
    canManageExperts: body.canManageExperts,
    canViewAll: body.canViewAll,
    active: body.active,
    password: body.password,
  });

  if (!result.user) {
    return NextResponse.json({ error: result.error || "Update failed" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, expert: result.user });
}
