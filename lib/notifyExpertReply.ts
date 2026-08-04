/**
 * Notify farmer when expert replies — WhatsApp (preferred) and/or SMS,
 * plus durable in-app notification row for My Queries / home badge.
 */
import type { ExpertQueryRow } from "@/lib/expertQueries";
import { createSupabaseServiceClient, hasSupabaseServiceRole } from "@/lib/supabase";
import { isSmsConfigured } from "@/lib/sms";

function digitPhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const d = raw.replace(/\D/g, "");
  if (d.length === 10 && /^[6-9]/.test(d)) return d;
  if (d.length === 12 && d.startsWith("91")) return d.slice(2);
  return null;
}

function indianE164(phone10: string): string {
  return `+91${phone10}`;
}

async function sendTwilioMessage(to: string, from: string, body: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  if (!accountSid || !authToken || !from) return false;

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
    }
  );
  if (!res.ok) {
    console.error("[notifyExpertReply] Twilio", await res.text());
    return false;
  }
  return true;
}

async function sendMsg91Text(phone10: string, text: string): Promise<boolean> {
  const authKey = process.env.MSG91_AUTH_KEY?.trim();
  if (!authKey) return false;
  const sender = process.env.MSG91_SENDER_ID?.trim() || "AGRVDA";
  const url =
    `https://control.msg91.com/api/sendhttp.php?authkey=${encodeURIComponent(authKey)}` +
    `&mobiles=91${phone10}&message=${encodeURIComponent(text)}&sender=${encodeURIComponent(sender)}&route=4&country=91`;
  const res = await fetch(url, { method: "GET" });
  const body = (await res.text()).trim().toLowerCase();
  if (!res.ok || body.includes("error") || body.includes("invalid")) {
    console.error("[notifyExpertReply] MSG91", body);
    return false;
  }
  return true;
}

function appOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.CAPACITOR_SERVER_URL?.trim() ||
    "https://agriveda-theta.vercel.app"
  ).replace(/\/$/, "");
}

export type NotifyResult = {
  whatsapp: boolean;
  sms: boolean;
  inApp: boolean;
};

/** After admin saves expert_reply — deliver to WhatsApp/SMS + farmer app inbox. */
export async function notifyFarmerOfExpertReply(
  row: ExpertQueryRow
): Promise<NotifyResult> {
  const result: NotifyResult = { whatsapp: false, sms: false, inApp: false };
  const phone = digitPhone(row.farmer_phone);
  const crop = row.crop_name || "फसल";
  const replyPreview = (row.expert_reply || "").trim().slice(0, 280);
  const link = `${appOrigin()}/my-queries`;
  const text =
    `Agriveda विशेषज्ञ जवाब (${crop}):\n` +
    `${replyPreview}${replyPreview.length >= 280 ? "…" : ""}\n` +
    `ऐप में पूरा जवाब: ${link}`;

  if (phone) {
    const waFrom = process.env.TWILIO_WHATSAPP_FROM?.trim(); // e.g. whatsapp:+14155238886
    const smsFrom =
      process.env.TWILIO_PHONE_NUMBER?.trim() ||
      process.env.TWILIO_FROM_NUMBER?.trim();

    if (waFrom && process.env.TWILIO_ACCOUNT_SID?.trim()) {
      result.whatsapp = await sendTwilioMessage(
        `whatsapp:${indianE164(phone)}`,
        waFrom.startsWith("whatsapp:") ? waFrom : `whatsapp:${waFrom}`,
        text
      );
    }

    if (!result.whatsapp && isSmsConfigured()) {
      if (process.env.MSG91_AUTH_KEY?.trim()) {
        result.sms = await sendMsg91Text(phone, text);
      } else if (smsFrom) {
        result.sms = await sendTwilioMessage(indianE164(phone), smsFrom, text);
      }
    }
  }

  if (hasSupabaseServiceRole()) {
    const client = createSupabaseServiceClient();
    if (client) {
      try {
        const { error } = await client.from("farmer_notifications").insert({
          device_id: row.device_id,
          farmer_phone: row.farmer_phone,
          expert_query_id: row.id,
          title: "विशेषज्ञ का जवाब आया",
          body: replyPreview.slice(0, 400) || `आपके ${crop} सवाल का जवाब आ गया है`,
          href: "/my-queries",
          read: false,
        });
        result.inApp = !error;
        if (error) console.error("[notifyExpertReply] inApp", error.message);
      } catch (err) {
        console.error("[notifyExpertReply] inApp failed", err);
      }
    }
  }

  return result;
}
