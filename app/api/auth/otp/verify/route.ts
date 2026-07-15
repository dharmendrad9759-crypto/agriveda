import { NextRequest, NextResponse } from "next/server";
import { normalizePhone, verifyOtp } from "@/lib/otpStore";
import { applySessionCookie, signSession } from "@/lib/session";
import { ensureFarmerRecord } from "@/lib/supabaseFarmer";
import { createSupabaseServiceClient } from "@/lib/supabase";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`otp-verify:${ip}`, 10, 60_000);
    if (!limited.ok) {
      return NextResponse.json(
        { error: `बहुत प्रयास — ${limited.retryAfterSec} सेकंड बाद` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const phone = normalizePhone(String(body.phone ?? ""));
    const otp = String(body.otp ?? "").trim();
    const deviceId = String(body.deviceId ?? "").trim();

    if (!phone) {
      return NextResponse.json({ error: "मोबाइल नंबर गलत है" }, { status: 400 });
    }
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: "6 अंकों का OTP डालें" }, { status: 400 });
    }
    if (!deviceId || deviceId.length < 8) {
      return NextResponse.json({ error: "deviceId missing" }, { status: 400 });
    }

    if (!verifyOtp(phone, otp)) {
      return NextResponse.json(
        { error: "OTP गलत है या समय समाप्त हो गया" },
        { status: 401 }
      );
    }

    const client = createSupabaseServiceClient();
    if (client) {
      await ensureFarmerRecord(deviceId, client, { phone });
    }

    const token = signSession({ phone, deviceId });
    const res = NextResponse.json({ success: true, phone });
    applySessionCookie(res, token);
    return res;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("SESSION_SECRET")) {
      return NextResponse.json(
        { error: "Server misconfigured — SESSION_SECRET set करें" },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "OTP verify नहीं हो सका" }, { status: 500 });
  }
}
