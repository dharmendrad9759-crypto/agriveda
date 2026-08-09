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
  const templateId = process.env.MSG91_OTP_TEMPLATE_ID?.trim();
  const mobile = indianMobile(phone);

  // Prefer Flow/template API (DLT) when template id is configured — auth not in query string
  if (templateId) {
    const res = await fetch("https://control.msg91.com/api/v5/flow/", {
      method: "POST",
      headers: {
        authkey: authKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        template_id: templateId,
        short_url: "0",
        recipients: [{ mobiles: mobile, otp }],
      }),
    });
    if (!res.ok) {
      console.error("[MSG91 flow]", await res.text());
      return false;
    }
    return true;
  }

  // Legacy sendhttp — POST body so authkey is not in URL/query logs
  const message = `Agriveda: aapka OTP ${otp} hai. 5 minute tak valid. Kisi ko na batayein.`;
  const body = new URLSearchParams({
    authkey: authKey,
    mobiles: mobile,
    message,
    sender,
    route: "4",
    country: "91",
  });
  const res = await fetch("https://control.msg91.com/api/sendhttp.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  const text = (await res.text()).trim().toLowerCase();
  if (!res.ok || text.includes("error") || text.includes("invalid")) {
    console.error("[MSG91]", text);
    return false;
  }
  return true;
}

async function sendViaTwilio(phone: string, otp: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  // Accept either name — .env.example historically used TWILIO_FROM_NUMBER
  const from =
    process.env.TWILIO_PHONE_NUMBER?.trim() ||
    process.env.TWILIO_FROM_NUMBER?.trim();
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
  const twilioFrom =
    process.env.TWILIO_PHONE_NUMBER?.trim() ||
    process.env.TWILIO_FROM_NUMBER?.trim();
  return Boolean(
    process.env.MSG91_AUTH_KEY?.trim() ||
      (process.env.TWILIO_ACCOUNT_SID?.trim() &&
        process.env.TWILIO_AUTH_TOKEN?.trim() &&
        twilioFrom)
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
