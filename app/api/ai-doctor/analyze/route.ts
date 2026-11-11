import { NextRequest, NextResponse } from "next/server";
import {
  analyzePlantPhotoWithGemini,
  analyzeSymptomsWithGemini,
  getGeminiApiKey,
} from "@/lib/geminiPlantDoctor";
import { clientIp, rateLimit, requireDurableRateLimit } from "@/lib/rateLimit";
import { requireSession } from "@/lib/session";
import { sniffImageMime } from "@/lib/imageSniff";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_SYMPTOMS = 800;
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

  const auth = await requireSession(request);
  if ("error" in auth) return auth.error;

  const durable = requireDurableRateLimit();
  if (durable) return durable;

  const ip = clientIp(request);
  const bucket = `ai:${auth.session.deviceId}:${ip}`;
  const limited = await rateLimit(bucket, 20, 60 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: `AI limit — ${limited.retryAfterSec} सेकंड बाद फिर कोशिश करें` },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64.trim() : "";
    const imageBase64Second =
      typeof body.imageBase64Second === "string" ? body.imageBase64Second.trim() : "";
    const cropSlug = typeof body.cropSlug === "string" ? body.cropSlug.trim() : "tomato";
    const symptoms =
      typeof body.symptoms === "string" ? body.symptoms.trim().slice(0, MAX_SYMPTOMS) : "";

    if (!imageBase64 && !symptoms) {
      return NextResponse.json(
        { error: "Photo ya symptoms mein se kam se kam ek jaruri hai" },
        { status: 400 }
      );
    }

    if (!imageBase64) {
      const result = await analyzeSymptomsWithGemini(symptoms, cropSlug);
      return NextResponse.json({ result });
    }

    const sniffed = sniffImageMime(imageBase64);
    if (!sniffed || !ALLOWED_MIME.has(sniffed)) {
      return NextResponse.json(
        { error: "Sirf JPEG/PNG/WebP photo upload karein" },
        { status: 400 }
      );
    }
    const mime = sniffed;

    const byteLength = Math.ceil((imageBase64.length * 3) / 4);
    if (byteLength > MAX_BYTES) {
      return NextResponse.json(
        { error: "Photo bahut badi hai — 5 MB se chhoti photo use karein" },
        { status: 400 }
      );
    }

    let second: { base64: string; mimeType: string } | undefined;
    if (imageBase64Second) {
      const sniffedSecond = sniffImageMime(imageBase64Second);
      if (!sniffedSecond || !ALLOWED_MIME.has(sniffedSecond)) {
        return NextResponse.json(
          { error: "Dusri photo sirf JPEG/PNG/WebP ho" },
          { status: 400 }
        );
      }
      const secondBytes = Math.ceil((imageBase64Second.length * 3) / 4);
      if (secondBytes > MAX_BYTES) {
        return NextResponse.json(
          { error: "Dusri photo bahut badi hai" },
          { status: 400 }
        );
      }
      second = { base64: imageBase64Second, mimeType: sniffedSecond };
    }

    const result = await analyzePlantPhotoWithGemini(
      imageBase64,
      mime,
      cropSlug,
      symptoms || undefined,
      second
    );
    return NextResponse.json({ result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    const isUserError =
      message.includes("plant") ||
      message.includes("photo") ||
      message.includes("पत्ती") ||
      message.includes("नहीं") ||
      message.includes("Symptoms");

    console.error("[ai-doctor]", message);
    return NextResponse.json(
      { error: isUserError ? message : "Analysis failed — later try करें" },
      { status: isUserError ? 422 : 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireSession(request);
  if ("error" in auth) return auth.error;
  return NextResponse.json({
    configured: Boolean(getGeminiApiKey()),
    provider: "google-gemini",
  });
}
