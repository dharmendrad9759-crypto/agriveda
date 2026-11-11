import { NextRequest, NextResponse } from "next/server";
import {
  clearSessionCookie,
  readSessionFromRequest,
  requireSession,
  revokeRequestSession,
} from "@/lib/session";
import { isSessionRevoked } from "@/lib/sessionRevoke";
import { isProductionRuntime } from "@/lib/runtimeEnv";
import { releaseActiveDevice } from "@/lib/authActiveDevice";
import { ensureFarmerRecord } from "@/lib/supabaseFarmer";
import { createSupabaseServiceClient } from "@/lib/supabase";

/** Current session + farmer id (server-derived). */
export async function GET(request: NextRequest) {
  const session = readSessionFromRequest(request);
  if (
    !session ||
    (isProductionRuntime() && !session.jti) ||
    (await isSessionRevoked(session.jti))
  ) {
    return NextResponse.json({ authenticated: false });
  }

  let farmerId: string | null = null;
  const client = createSupabaseServiceClient();
  if (client) {
    farmerId = await ensureFarmerRecord(session.deviceId, client, {
      phone: session.phone || undefined,
      name: session.name || undefined,
      firebaseUid: session.firebaseUid,
    });
  }

  return NextResponse.json({
    authenticated: true,
    phone: session.phone || null,
    email: session.email || null,
    name: session.name || null,
    deviceId: session.deviceId,
    farmerId,
  });
}

export async function DELETE(request: NextRequest) {
  const session = readSessionFromRequest(request);
  await revokeRequestSession(request);
  if (session?.firebaseUid) {
    await releaseActiveDevice(session.firebaseUid, session.deviceId);
  }
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res);
  return res;
}

/** Lightweight auth check helper used by other routes. */
export async function assertSession(request: NextRequest) {
  return requireSession(request);
}
