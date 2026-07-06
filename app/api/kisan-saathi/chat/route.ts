import { NextResponse } from "next/server";
import { chatWithKisanSaathi, type SaathiContext, type SaathiMessage } from "@/lib/geminiKisanSaathi";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = (body.messages ?? []) as SaathiMessage[];
    const context = (body.context ?? {}) as SaathiContext;

    if (!messages.length || !messages[messages.length - 1]?.content?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const reply = await chatWithKisanSaathi(messages, context);
    return NextResponse.json({ reply, provider: "kisan-saathi" });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Chat failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY),
  });
}
