import { NextResponse } from "next/server";
import { chatWithKisanSaathi, type SaathiContext, type SaathiMessage } from "@/lib/geminiKisanSaathi";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const limited = rateLimit(`saathi:${ip}`, 40, 60 * 60_000);
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

    const reply = await chatWithKisanSaathi(messages, context);
    return NextResponse.json({ reply, provider: "kisan-saathi" });
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
