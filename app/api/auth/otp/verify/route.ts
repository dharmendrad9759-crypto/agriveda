import { NextRequest, NextResponse } from "next/server";
import { normalizePhone, verifyOtp } from "@/lib/otpStore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = normalizePhone(String(body.phone ?? ""));
    const otp = String(body.otp ?? "").trim();

    if (!phone) {
      return NextResponse.json({ error: "मोबाइल नंबर गलत है" }, { status: 400 });
    }
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: "6 अंकों का OTP डालें" }, { status: 400 });
    }

    if (!verifyOtp(phone, otp)) {
      return NextResponse.json({ error: "OTP गलत है या समय समाप्त हो गया" }, { status: 401 });
    }

    return NextResponse.json({ success: true, phone });
  } catch {
    return NextResponse.json({ error: "OTP verify नहीं हो सका" }, { status: 500 });
  }
}
