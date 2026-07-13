import { NextRequest, NextResponse } from "next/server";
import { analyzePlantPhotoWithGemini, getGeminiApiKey } from "@/lib/geminiPlantDoctor";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic", "image/heif"]);

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

  try {
    const body = await request.json();
    const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64.trim() : "";
    const mimeType = typeof body.mimeType === "string" ? body.mimeType.toLowerCase() : "image/jpeg";
    const cropSlug = typeof body.cropSlug === "string" ? body.cropSlug.trim() : "tomato";

    if (!imageBase64) {
      return NextResponse.json({ error: "Photo data missing" }, { status: 400 });
    }

    if (!ALLOWED_MIME.has(mimeType)) {
      return NextResponse.json({ error: "Sirf JPEG/PNG/WebP photo upload karein" }, { status: 400 });
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

    return NextResponse.json(
      { error: message },
      { status: isUserError ? 422 : 500 }
    );
  }
}

export async function GET() {
  const key = getGeminiApiKey();
  const prefix = key ? key.slice(0, 4) : null;
  return NextResponse.json({
    configured: Boolean(key),
    provider: "google-gemini",
    /** Safe hint for Vercel debugging — never exposes full key */
    keyPrefix: prefix,
  });
}
