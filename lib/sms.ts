/**
 * Send OTP SMS via MSG91 (India) or Twilio when configured in .env.local
 * Falls back to false → caller shows demo OTP on screen (dev / test).
 */

function indianMobile(phone: string): string {
  return phone.startsWith("91") ? phone : `91${phone}`;
}

async function sendViaMsg91(phone: string, otp: string): Promise<boolean> {
  const authKey = process.env.MSG91_AUTH_KEY?.trim();
  if (!authKey) return false;

  const sender = process.env.MSG91_SENDER_ID?.trim() || "AGRVDA";
  const mobile = indianMobile(phone);
  const message = encodeURIComponent(
    `Agriveda: aapka OTP ${otp} hai. 5 minute tak valid. Kisi ko na batayein.`
  );

  const url =
    `https://control.msg91.com/api/sendhttp.php?authkey=${encodeURIComponent(authKey)}` +
    `&mobiles=${mobile}&message=${message}&sender=${encodeURIComponent(sender)}&route=4&country=91`;

  const res = await fetch(url, { method: "GET" });
  const body = (await res.text()).trim().toLowerCase();
  if (!res.ok || body.includes("error") || body.includes("invalid")) {
    console.error("[MSG91]", body);
    return false;
  }
  return true;
}

async function sendViaTwilio(phone: string, otp: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_PHONE_NUMBER?.trim();
  if (!accountSid || !authToken || !from) return false;

  const to = `+${indianMobile(phone)}`;
  const body = new URLSearchParams({
    To: to,
    From: from,
    Body: `Agriveda OTP: ${otp}. Valid for 5 minutes.`,
  });

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    }
  );

  if (!res.ok) {
    console.error("[Twilio]", await res.text());
    return false;
  }
  return true;
}

export function isSmsConfigured(): boolean {
  return Boolean(
    process.env.MSG91_AUTH_KEY?.trim() ||
      (process.env.TWILIO_ACCOUNT_SID?.trim() &&
        process.env.TWILIO_AUTH_TOKEN?.trim() &&
        process.env.TWILIO_PHONE_NUMBER?.trim())
  );
}

export async function sendOtpSms(phone: string, otp: string): Promise<boolean> {
  if (process.env.MSG91_AUTH_KEY?.trim()) {
    return sendViaMsg91(phone, otp);
  }
  if (process.env.TWILIO_ACCOUNT_SID?.trim()) {
    return sendViaTwilio(phone, otp);
  }
  return false;
}
