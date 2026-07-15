import { NextRequest, NextResponse } from "next/server";
import { analyzePlantPhotoWithGemini, getGeminiApiKey } from "@/lib/geminiPlantDoctor";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { readSessionFromRequest } from "@/lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export async function POST(request: NextRequest) {
  if (!getGeminiApiKey()) {
    return NextResponse.json(
      {
        error:
          "AI Doctor configure नहीं है। .env.local में GEMINI_API_KEY add करें (https://aistudio.google.com)",
      },
      { status: 503 }
    );
  }

  const ip = clientIp(request);
  const session = readSessionFromRequest(request);
  const bucket = session?.deviceId ? `ai:${session.deviceId}` : `ai-ip:${ip}`;
  const limited = rateLimit(bucket, 20, 60 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: `AI limit — ${limited.retryAfterSec} सेकंड बाद फिर कोशिश करें` },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64.trim() : "";
    const mimeType =
      typeof body.mimeType === "string" ? body.mimeType.toLowerCase() : "image/jpeg";
    const cropSlug = typeof body.cropSlug === "string" ? body.cropSlug.trim() : "tomato";

    if (!imageBase64) {
      return NextResponse.json({ error: "Photo data missing" }, { status: 400 });
    }

    if (!ALLOWED_MIME.has(mimeType)) {
      return NextResponse.json(
        { error: "Sirf JPEG/PNG/WebP photo upload karein" },
        { status: 400 }
      );
    }

    const byteLength = Math.ceil((imageBase64.length * 3) / 4);
    if (byteLength > MAX_BYTES) {
      return NextResponse.json(
        { error: "Photo bahut badi hai — 5 MB se chhoti photo use karein" },
        { status: 400 }
      );
    }

    const result = await analyzePlantPhotoWithGemini(imageBase64, mimeType, cropSlug);
    return NextResponse.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    const isUserError =
      message.includes("plant") ||
      message.includes("photo") ||
      message.includes("पत्ती") ||
      message.includes("नहीं");

    console.error("[ai-doctor]", message);
    return NextResponse.json(
      { error: isUserError ? message : "Analysis failed — later try करें" },
      { status: isUserError ? 422 : 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    configured: Boolean(getGeminiApiKey()),
    provider: "google-gemini",
  });
}
