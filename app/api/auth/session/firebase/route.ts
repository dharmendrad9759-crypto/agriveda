import { NextRequest, NextResponse } from "next/server";
import { applySessionCookie, signSession } from "@/lib/session";
import { ensureFarmerRecord } from "@/lib/supabaseFarmer";
import { createSupabaseServiceClient } from "@/lib/supabase";
import { normalizePhone } from "@/lib/otpStore";
import { clientIp, rateLimit } from "@/lib/rateLimit";

/**
 * After Firebase Phone Auth succeeds on the client, exchange idToken
 * for an Agriveda httpOnly session (server verifies token with Google).
 */
export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`firebase-session:${ip}`, 10, 60_000);
    if (!limited.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const idToken = String(body.idToken ?? "").trim();
    const deviceId = String(body.deviceId ?? "").trim();

    if (!idToken || !deviceId) {
      return NextResponse.json({ error: "idToken and deviceId required" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
    }

    const lookup = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!lookup.ok) {
      return NextResponse.json({ error: "Invalid Firebase token" }, { status: 401 });
    }

    const data = (await lookup.json()) as {
      users?: { localId?: string; phoneNumber?: string }[];
    };
    const user = data.users?.[0];
    if (!user?.localId) {
      return NextResponse.json({ error: "Invalid Firebase token" }, { status: 401 });
    }

    const rawPhone = user.phoneNumber?.replace(/\D/g, "") ?? "";
    const phone = normalizePhone(rawPhone) ?? rawPhone.slice(-10);
    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: "Phone missing on Firebase account" }, { status: 400 });
    }

    const client = createSupabaseServiceClient();
    if (client) {
      await ensureFarmerRecord(deviceId, client, { phone });
    }

    const token = signSession({
      phone,
      deviceId,
      firebaseUid: user.localId,
    });
    const res = NextResponse.json({ success: true, phone });
    applySessionCookie(res, token);
    return res;
  } catch {
    return NextResponse.json({ error: "Session create failed" }, { status: 500 });
  }
}
