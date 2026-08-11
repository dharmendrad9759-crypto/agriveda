import { NextRequest, NextResponse } from "next/server";
import { deleteFarmerAccountServer } from "@/lib/deleteFarmerAccount";
import { clearSessionCookie, requireSession } from "@/lib/session";
import { releaseActiveDevice } from "@/lib/authActiveDevice";
import { rateLimit } from "@/lib/rateLimit";

/**
 * DELETE /api/account — Play Store account deletion.
 * Requires logged-in session. Wipes server farmer data + clears session cookie.
 * Client must also clear localStorage via clearAppData({ fullWipe: true }).
 */
export async function DELETE(request: NextRequest) {
  const auth = await requireSession(request);
  if ("error" in auth) return auth.error;

  const limited = await rateLimit(`account-delete:${auth.session.deviceId}`, 3, 60 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many delete attempts — 1 घंटे बाद कोशिश करें" },
      { status: 429 }
    );
  }

  const result = await deleteFarmerAccountServer({
    phone: auth.session.phone,
    deviceId: auth.session.deviceId,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  if (auth.session.firebaseUid) {
    await releaseActiveDevice(auth.session.firebaseUid, auth.session.deviceId);
  }

  const res = NextResponse.json({
    ok: true,
    deleted: true,
    message: "Account deleted. Local app data clear करें।",
  });
  clearSessionCookie(res);
  return res;
}
