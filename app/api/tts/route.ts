import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text")?.trim();
  const lang = searchParams.get("lang")?.trim() || "hi";

  if (!text) {
    return NextResponse.json({ error: "Text parameter is required" }, { status: 400 });
  }

  // Google TTS supports sentences up to 200 characters per chunk safely
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
      return NextResponse.json(
        { error: `Upstream TTS error: ${upstreamRes.status}` },
        { status: upstreamRes.status }
      );
    }

    const audioBuffer = await upstreamRes.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=604800, immutable",
      },
    });
  } catch (error: any) {
    console.error("TTS fetch failed:", error);
    return NextResponse.json({ error: "Failed to generate speech audio" }, { status: 500 });
  }
}
