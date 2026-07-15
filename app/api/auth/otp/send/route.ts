import { NextRequest, NextResponse } from "next/server";
import {
  generateOtp,
  isProductionRuntime,
  normalizePhone,
  saveOtp,
} from "@/lib/otpStore";
import { isSmsConfigured, sendOtpSms } from "@/lib/sms";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    const limited = rateLimit(`otp-send:${ip}`, 5, 60_000);
    if (!limited.ok) {
      return NextResponse.json(
        { error: `बहुत जल्दी OTP माँगे — ${limited.retryAfterSec} सेकंड बाद कोशिश करें` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const phone = normalizePhone(String(body.phone ?? ""));

    if (!phone) {
      return NextResponse.json(
        { error: "सही 10 अंकों का मोबाइल नंबर डालें" },
        { status: 400 }
      );
    }

    const phoneLimited = rateLimit(`otp-send-phone:${phone}`, 3, 60 * 60_000);
    if (!phoneLimited.ok) {
      return NextResponse.json(
        { error: "इस नंबर पर बहुत OTP भेज चुके — 1 घंटे बाद कोशिश करें" },
        { status: 429 }
      );
    }

    const otp = generateOtp();
    saveOtp(phone, otp);

    const smsConfigured = isSmsConfigured();
    if (!smsConfigured && isProductionRuntime()) {
      return NextResponse.json(
        { error: "SMS service configure नहीं है — ऐप अभी OTP नहीं भेज सकती" },
        { status: 503 }
      );
    }

    const smsSent = smsConfigured ? await sendOtpSms(phone, otp) : false;

    if (!smsSent && isProductionRuntime()) {
      return NextResponse.json(
        { error: "OTP SMS नहीं भेजा जा सका — थोड़ी देर बाद कोशिश करें" },
        { status: 503 }
      );
    }

    // demoOtp ONLY outside production (local/dev testing without SMS)
    return NextResponse.json({
      success: true,
      message: smsSent
        ? "OTP आपके मोबाइल पर भेज दिया गया है"
        : "OTP तैयार (dev test — नीचे OTP दिखेगा)",
      demoOtp: !smsSent && !isProductionRuntime() ? otp : undefined,
    });
  } catch {
    return NextResponse.json({ error: "OTP भेजने में समस्या" }, { status: 500 });
  }
}
