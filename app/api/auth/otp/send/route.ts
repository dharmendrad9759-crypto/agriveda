import { NextResponse } from "next/server";

/** Phone OTP login removed — use Google Sign-In. */
export async function POST() {
  return NextResponse.json(
    {
      error: "Phone OTP बंद है — Google से लॉगिन करें",
      code: "otp_removed",
    },
    { status: 410 }
  );
}
