import type { AdminSession } from "@/lib/adminAuth";
import { maskPhone } from "@/lib/privacyMask";

type QueryRow = {
  assigned_to: string | null;
  status: string;
  crop_slug?: string | null;
  farmer_phone?: string | null;
  farmer_village?: string | null;
  farmer_district?: string | null;
  farmer_state?: string | null;
};

export function canAccessQuery(session: AdminSession, row: QueryRow): boolean {
  if (session.permissions.viewAllQueries) return true;
  if (row.assigned_to === session.userId) return true;
  if (
    !row.assigned_to &&
    (row.status === "pending" || row.status === "in_review") &&
    session.permissions.assignQueries
  ) {
    return true;
  }
  return false;
}

export function cropInScope(session: AdminSession, cropSlug: string | null | undefined): boolean {
  const scopes = session.cropScopes;
  if (!scopes || scopes.length === 0) return true;
  if (!cropSlug) return true;
  return scopes.includes(cropSlug);
}

export function canSeeFullFarmerPii(session: AdminSession, row: QueryRow): boolean {
  if (session.permissions.viewAllQueries) return true;
  if (session.permissions.assignQueries) return true;
  return row.assigned_to === session.userId;
}

export function publicLocation(session: AdminSession, row: QueryRow): string {
  const parts = canSeeFullFarmerPii(session, row)
    ? [row.farmer_village, row.farmer_district, row.farmer_state]
    : [row.farmer_district, row.farmer_state];
  return parts.filter(Boolean).join(" · ");
}

export function publicFarmerPhone(session: AdminSession, row: QueryRow): string | null {
  if (canSeeFullFarmerPii(session, row)) return row.farmer_phone ?? null;
  return maskPhone(row.farmer_phone);
}
