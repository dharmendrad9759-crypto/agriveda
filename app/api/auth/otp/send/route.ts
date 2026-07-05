import { NextRequest, NextResponse } from "next/server";
import { generateOtp, normalizePhone, saveOtp } from "@/lib/otpStore";
import { isSmsConfigured, sendOtpSms } from "@/lib/sms";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = normalizePhone(String(body.phone ?? ""));

    if (!phone) {
      return NextResponse.json(
        { error: "सही 10 अंकों का मोबाइल नंबर डालें" },
        { status: 400 }
      );
    }

    const otp = generateOtp();
    saveOtp(phone, otp);

    const smsSent = isSmsConfigured() ? await sendOtpSms(phone, otp) : false;

    return NextResponse.json({
      success: true,
      message: smsSent
        ? "OTP आपके मोबाइल पर भेज दिया गया है"
        : "OTP तैयार (टेस्ट मोड — नीचे OTP दिखेगा)",
      demoOtp: smsSent ? undefined : otp,
    });
  } catch {
    return NextResponse.json({ error: "OTP भेजने में समस्या" }, { status: 500 });
  }
}
