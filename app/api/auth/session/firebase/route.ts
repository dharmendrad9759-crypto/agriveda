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

type IdpSignInResult = {
  localId?: string;
  email?: string;
  displayName?: string;
  idToken?: string;
  error?: { message?: string };
};

function requestUriForIdp(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl?.startsWith("https://")) return appUrl.replace(/\/$/, "");
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim();
  if (authDomain) return `https://${authDomain.replace(/^https?:\/\//, "")}`;
  return "https://agriveda-theta.vercel.app";
}

/** Exchange Google OIDC idToken → Firebase user (server-side; avoids WebView Firebase JS). */
async function signInWithGoogleIdToken(
  apiKey: string,
  googleIdToken: string
): Promise<{ ok: true; user: FirebaseLookupUser } | { ok: false; error: string; status: number }> {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postBody: `id_token=${encodeURIComponent(googleIdToken)}&providerId=google.com`,
        requestUri: requestUriForIdp(),
        returnIdpCredential: true,
        returnSecureToken: true,
      }),
    }
  );

  const data = (await res.json().catch(() => ({}))) as IdpSignInResult;
  if (!res.ok || !data.localId) {
    const msg = String(data.error?.message || "");
    if (/OPERATION_NOT_ALLOWED/i.test(msg)) {
      return {
        ok: false,
        status: 503,
        error:
          "Firebase में Google Sign-in Enable करें — Authentication → Sign-in method → Google",
      };
    }
    if (/INVALID_IDP_RESPONSE|INVALID_ID_TOKEN|id_token/i.test(msg)) {
      return { ok: false, status: 401, error: "Google login token अमान्य — फिर कोशिश करें" };
    }
    console.error("[firebase-session] signInWithIdp failed", res.status, msg);
    return {
      ok: false,
      status: 401,
      error: "Google login verify नहीं हुआ — Firebase / API key चेक करें",
    };
  }

  return {
    ok: true,
    user: {
      localId: data.localId,
      email: data.email,
      displayName: data.displayName,
    },
  };
}

async function lookupFirebaseUser(
  apiKey: string,
  firebaseIdToken: string
): Promise<{ ok: true; user: FirebaseLookupUser } | { ok: false; error: string; status: number }> {
  const lookup = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: firebaseIdToken }),
    }
  );

  if (!lookup.ok) {
    return { ok: false, status: 401, error: "Invalid Firebase token" };
  }

  const data = (await lookup.json()) as { users?: FirebaseLookupUser[] };
  const user = data.users?.[0];
  if (!user?.localId) {
    return { ok: false, status: 401, error: "Invalid Firebase token" };
  }
  return { ok: true, user };
}

/**
 * Create Agriveda httpOnly session from:
 * - `googleIdToken` — Android native Google Sign-In (preferred on Capacitor)
 * - `idToken` — Firebase ID token from web popup / JS SDK
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
    const firebaseIdToken = String(body.idToken ?? "").trim();
    const googleIdToken = String(body.googleIdToken ?? "").trim();
    const deviceId = String(body.deviceId ?? "").trim();

    if ((!firebaseIdToken && !googleIdToken) || !isValidDeviceId(deviceId)) {
      return NextResponse.json(
        { error: "idToken/googleIdToken and valid deviceId required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
    }

    const verified = googleIdToken
      ? await signInWithGoogleIdToken(apiKey, googleIdToken)
      : await lookupFirebaseUser(apiKey, firebaseIdToken);

    if (!verified.ok) {
      return NextResponse.json({ error: verified.error }, { status: verified.status });
    }

    const user = verified.user;
    if (!user.localId) {
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
      firebaseUid: user.localId,
    });
    applySessionCookie(res, token);
    return res;
  } catch (err) {
    console.error("[firebase-session]", err);
    return NextResponse.json({ error: "Session create failed" }, { status: 500 });
  }
}
