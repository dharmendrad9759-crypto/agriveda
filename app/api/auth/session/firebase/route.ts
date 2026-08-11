import { NextRequest, NextResponse } from "next/server";
import { applySessionCookie, signSession } from "@/lib/session";
import { ensureFarmerRecord } from "@/lib/supabaseFarmer";
import { createSupabaseServiceClient } from "@/lib/supabase";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { isValidDeviceId } from "@/lib/deviceIdValidate";
import {
  activeDeviceStoreReady,
  claimActiveDevice,
} from "@/lib/authActiveDevice";
import { rejectIfNativeAppTooOld } from "@/lib/minNativeVersion";

type FirebaseLookupUser = {
  localId?: string;
  email?: string;
  displayName?: string;
  phoneNumber?: string;
  providerUserInfo?: { providerId?: string; email?: string }[];
};

/**
 * After Firebase Google (or any) Auth succeeds on the client, exchange idToken
 * for an Agriveda httpOnly session.
 */
export async function POST(request: NextRequest) {
  try {
    const forceUpdate = rejectIfNativeAppTooOld(request);
    if (forceUpdate) return forceUpdate;

    const ip = clientIp(request);
    const limited = await rateLimit(`firebase-session:${ip}`, 10, 60_000);
    if (!limited.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const idToken = String(body.idToken ?? "").trim();
    const deviceId = String(body.deviceId ?? "").trim();

    if (!idToken || !isValidDeviceId(deviceId)) {
      return NextResponse.json({ error: "idToken and valid deviceId required" }, { status: 400 });
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

    const data = (await lookup.json()) as { users?: FirebaseLookupUser[] };
    const user = data.users?.[0];
    if (!user?.localId) {
      return NextResponse.json({ error: "Invalid Firebase token" }, { status: 401 });
    }

    const emailRaw =
      user.email ||
      user.providerUserInfo?.find((p) => p.email)?.email ||
      "";
    const email = emailRaw.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Google account में email ज़रूरी है" },
        { status: 400 }
      );
    }

    const isProd =
      process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
    if (isProd && !activeDeviceStoreReady()) {
      return NextResponse.json(
        {
          error:
            "Device lock उपलब्ध नहीं — SUPABASE_SERVICE_ROLE_KEY / app_kv सेट करें",
        },
        { status: 503 }
      );
    }

    const claim = await claimActiveDevice(user.localId, deviceId, email);
    if (!claim.ok) {
      return NextResponse.json(
        {
          error:
            "यह Google ID दूसरी डिवाइस पर लॉगिन है। पहले उस फोन से Logout करें।",
          code: "DEVICE_CONFLICT",
        },
        { status: 409 }
      );
    }

    const displayName = (user.displayName || "").trim().slice(0, 80);
    const rawPhone = user.phoneNumber?.replace(/\D/g, "") ?? "";
    const phone =
      rawPhone.length >= 10 && rawPhone.length <= 15 ? rawPhone.slice(-10) : "";

    const client = createSupabaseServiceClient();
    if (client) {
      await ensureFarmerRecord(deviceId, client, {
        phone: phone || undefined,
        name: displayName || undefined,
      });
    }

    let token: string;
    try {
      token = signSession({
        phone,
        email,
        name: displayName || undefined,
        deviceId,
        firebaseUid: user.localId,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("SESSION_SECRET")) {
        return NextResponse.json(
          {
            error:
              "SESSION_SECRET missing — Vercel → Settings → Environment Variables में SESSION_SECRET डालकर Redeploy करें",
          },
          { status: 500 }
        );
      }
      throw err;
    }

    const res = NextResponse.json({
      success: true,
      email,
      name: displayName || null,
      phone: phone || null,
    });
    applySessionCookie(res, token);
    return res;
  } catch (err) {
    console.error("[firebase-session]", err);
    return NextResponse.json({ error: "Session create failed" }, { status: 500 });
  }
}
