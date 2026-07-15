import { NextRequest, NextResponse } from "next/server";
import {
  clearSessionCookie,
  readSessionFromRequest,
  requireSession,
} from "@/lib/session";
import { ensureFarmerRecord } from "@/lib/supabaseFarmer";
import { createSupabaseServiceClient } from "@/lib/supabase";

/** Current session + farmer id (server-derived). */
export async function GET(request: NextRequest) {
  const session = readSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  let farmerId: string | null = null;
  const client = createSupabaseServiceClient();
  if (client) {
    farmerId = await ensureFarmerRecord(session.deviceId, client, {
      phone: session.phone,
    });
  }

  return NextResponse.json({
    authenticated: true,
    phone: session.phone,
    deviceId: session.deviceId,
    farmerId,
  });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res);
  return res;
}

/** Lightweight auth check helper used by other routes. */
export function assertSession(request: NextRequest) {
  return requireSession(request);
}
