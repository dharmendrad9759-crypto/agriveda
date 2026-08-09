import { NextRequest, NextResponse } from "next/server";
import { chatWithKisanSaathi, type SaathiContext, type SaathiMessage } from "@/lib/geminiKisanSaathi";
import { getGeminiApiKey } from "@/lib/geminiPlantDoctor";
import { clientIp, rateLimit, requireDurableRateLimit } from "@/lib/rateLimit";
import { requireSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    if (!getGeminiApiKey()) {
      return NextResponse.json(
        {
          error: "किसान साथी अभी उपलब्ध नहीं — GEMINI_API_KEY सेट करें",
          mode: "offline",
        },
        { status: 503 }
      );
    }

    const auth = requireSession(req);
    if ("error" in auth) return auth.error;

    const durable = requireDurableRateLimit();
    if (durable) return durable;

    const ip = clientIp(req);
    const limited = await rateLimit(
      `saathi:${auth.session.deviceId}:${ip}`,
      40,
      60 * 60_000
    );
    if (!limited.ok) {
      return NextResponse.json(
        { error: `बहुत सारे सवाल — ${limited.retryAfterSec} सेकंड बाद` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const messages = (body.messages ?? []) as SaathiMessage[];
    const context = (body.context ?? {}) as SaathiContext;

    if (!messages.length || !messages[messages.length - 1]?.content?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    if (messages.length > 30) {
      return NextResponse.json({ error: "Chat too long — नया chat शुरू करें" }, { status: 400 });
    }

    const MAX_MSG_CHARS = 4000;
    for (const m of messages) {
      if (typeof m.content === "string" && m.content.length > MAX_MSG_CHARS) {
        return NextResponse.json(
          { error: "Message too long — छोटा लिखें" },
          { status: 400 }
        );
      }
      if (typeof m.content === "string" && /data:image\//i.test(m.content)) {
        return NextResponse.json(
          { error: "Chat में फोटो न भेजें — AI Doctor इस्तेमाल करें" },
          { status: 400 }
        );
      }
    }

    const result = await chatWithKisanSaathi(messages, context);
    if (result.offline || !result.reply.trim()) {
      return NextResponse.json(
        {
          error: "किसान साथी अभी जवाब नहीं दे पाया — थोड़ी देर बाद कोशिश करें",
          mode: "offline",
        },
        { status: 503 }
      );
    }
    return NextResponse.json({
      reply: result.reply,
      provider: "kisan-saathi",
      mode: "live",
    });
  } catch (err) {
    console.error("[kisan-saathi]", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Chat failed — later try करें" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY),
  });
}
