import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/adminAuth";
import { createPanelUser, listPanelUsers, type PanelRole } from "@/lib/panelUsers";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export async function GET(request: NextRequest) {
  const auth = requirePermission(request, "manageExperts");
  if ("error" in auth) {
    // Managers/owners with view — allow list for assignment dropdowns
    const any = requirePermission(request, "assignQueries");
    if ("error" in any) return auth.error;
    const users = await listPanelUsers();
    return NextResponse.json({
      experts: users
        .filter((u) => u.active && (u.role === "expert" || u.role === "manager"))
        .map((u) => ({
          id: u.id,
          username: u.username,
          displayName: u.displayName,
          role: u.role,
          active: u.active,
        })),
    });
  }

  const users = await listPanelUsers();
  return NextResponse.json({
    experts: users.map((u) => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      role: u.role,
      canAssign: u.canAssign,
      canManageExperts: u.canManageExperts,
      canViewAll: u.canViewAll,
      active: u.active,
      cropScopes: u.cropScopes,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
    })),
  });
}

export async function POST(request: NextRequest) {
  const auth = requirePermission(request, "manageExperts");
  if ("error" in auth) return auth.error;

  const limited = await rateLimit(`admin-experts:${clientIp(request)}`, 20, 60 * 60_000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: {
    username?: string;
    displayName?: string;
    password?: string;
    role?: string;
    canAssign?: boolean;
    canManageExperts?: boolean;
    canViewAll?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const role = (body.role === "manager" ? "manager" : "expert") as PanelRole;
  const result = await createPanelUser({
    username: String(body.username ?? ""),
    displayName: String(body.displayName ?? ""),
    password: String(body.password ?? ""),
    role,
    createdBy: auth.session.userId,
    canAssign: body.canAssign,
    canManageExperts: body.canManageExperts,
    canViewAll: body.canViewAll,
  });

  if (!result.user) {
    return NextResponse.json({ error: result.error || "Create failed" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    expert: {
      id: result.user.id,
      username: result.user.username,
      displayName: result.user.displayName,
      role: result.user.role,
      canAssign: result.user.canAssign,
      canManageExperts: result.user.canManageExperts,
      canViewAll: result.user.canViewAll,
      active: result.user.active,
    },
  });
}
