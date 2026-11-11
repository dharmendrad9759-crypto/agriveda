import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/session";
import { clientIp, rateLimit } from "@/lib/rateLimit";

const LANGS = new Set(["hi", "en", "hi-IN", "en-IN", "en-US"]);

export async function GET(request: NextRequest) {
  const auth = await requireSession(request);
  if ("error" in auth) return auth.error;

  const ip = clientIp(request);
  const limited = await rateLimit(`tts:${auth.session.deviceId}:${ip}`, 30, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: `बहुत अनुरोध — ${limited.retryAfterSec} सेकंड बाद` },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text")?.trim();
  const langRaw = searchParams.get("lang")?.trim() || "hi";
  const lang = LANGS.has(langRaw) ? langRaw : "hi";

  if (!text) {
    return NextResponse.json({ error: "Text parameter is required" }, { status: 400 });
  }

  const truncated = text.slice(0, 200);
  const targetUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(
    lang
  )}&client=tw-ob&q=${encodeURIComponent(truncated)}`;

  try {
    const upstreamRes = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://translate.google.com/",
      },
    });

    if (!upstreamRes.ok) {
      return NextResponse.json({ error: "Speech unavailable" }, { status: 502 });
    }

    const audioBuffer = await upstreamRes.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error: unknown) {
    console.error("TTS fetch failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Failed to generate speech audio" }, { status: 500 });
  }
}
