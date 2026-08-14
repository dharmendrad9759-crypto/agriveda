export interface DiagnosisResult {
  diseaseName: string;
  pathogen: string;
  /** Kept for API/history compat — not shown in farmer UI */
  confidence: number;
  severity: "Low" | "Medium" | "High";
  stage: string;
  riskLevel: string;
  whyItHappens: string[];
  environmentalFactors: string[];
  treatments: string[];
  activeIngredients: { name: string; dose: string; fracIrac: string }[];
  /** स्प्रे स्टिकर / spreader — better leaf coverage */
  spraySticker?: string;
  /** रोग के बाद रिकवरी टॉनिक */
  recoveryTonics?: string[];
  prevention: string[];
  cropContext?: string;
  /** What Gemini actually saw in the photo */
  visualObservations?: string;
  source?: "gemini" | "demo";
}

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Photo read nahi ho saki"));
    reader.readAsDataURL(file);
  });
}

/** Compress large phone photos before sending to Gemini API.
 * Prefers WebP (smaller RAM/size); falls back to JPEG if unsupported.
 * Formats the browser can't decode in a <canvas> (e.g. HEIC/HEIF from many
 * phones) are returned untouched so the server/Gemini can handle the original
 * instead of the whole scan failing. */
async function compressImageIfNeeded(file: File): Promise<File> {
  if (file.size <= 1.2 * 1024 * 1024) return file;

  try {
    const dataUrl = await readFileAsDataUrl(file);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("decode-unsupported"));
      el.src = dataUrl;
    });

    const maxSide = 1280;
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, w, h);

    const tryWebp = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.82)
    );
    const blob =
      tryWebp && tryWebp.size > 0
        ? tryWebp
        : await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));

    if (!blob) return file;
    const ext = tryWebp && tryWebp.size > 0 ? "webp" : "jpg";
    const mime = ext === "webp" ? "image/webp" : "image/jpeg";
    return new File([blob], file.name.replace(/\.\w+$/, `.${ext}`) || `scan.${ext}`, { type: mime });
  } catch {
    // Undecodable format (HEIC/HEIF, etc.) — send the original to the server.
    return file;
  }
}

export async function fileToBase64Payload(
  file: File
): Promise<{ base64: string; mimeType: string }> {
  const prepared = await compressImageIfNeeded(file);
  if (prepared.size > MAX_UPLOAD_BYTES) {
    throw new Error("Photo bahut badi hai — zoom karke dubara photo lein");
  }

  const dataUrl = await readFileAsDataUrl(prepared);
  const match = dataUrl.match(/^data:(.*?);base64,(.+)$/);
  if (!match) throw new Error("Invalid photo format");

  return { mimeType: match[1], base64: match[2] };
}

export async function checkAiDoctorConfigured(): Promise<boolean> {
  try {
    const res = await fetch("/api/ai-doctor/analyze");
    if (!res.ok) return false;
    const body = await res.json();
    return Boolean(body.configured);
  } catch {
    return false;
  }
}

export type AnalyzeDiagnosisInput = {
  cropSlug?: string;
  symptoms?: string;
  imageFile?: File | null;
  /** Optional 2nd leaf/crop photo (max 2 total with imageFile) */
  imageFile2?: File | null;
};

async function postDiagnosis(payload: Record<string, unknown>): Promise<DiagnosisResult> {
  const res = await fetch("/api/ai-doctor/analyze", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.error || "AI analysis fail — dubara koshish karein");
  }

  return body.result as DiagnosisResult;
}

/** Photo and/or symptom diagnosis via Google Gemini (server-side). */
export async function analyzeDiagnosis(input: AnalyzeDiagnosisInput): Promise<DiagnosisResult> {
  const cropSlug = input.cropSlug?.trim() || "tomato";
  const symptoms = input.symptoms?.trim() || "";

  if (input.imageFile) {
    const primary = await fileToBase64Payload(input.imageFile);
    const payload: Record<string, unknown> = {
      imageBase64: primary.base64,
      mimeType: primary.mimeType,
      cropSlug,
      symptoms: symptoms || undefined,
    };
    if (input.imageFile2) {
      const second = await fileToBase64Payload(input.imageFile2);
      payload.imageBase64Second = second.base64;
      payload.mimeTypeSecond = second.mimeType;
    }
    return postDiagnosis(payload);
  }

  if (!symptoms) {
    throw new Error("Photo ya symptoms dein");
  }

  return postDiagnosis({ cropSlug, symptoms });
}

/** @deprecated Prefer analyzeDiagnosis — kept for pending-scan callers. */
export async function analyzePlantImage(
  imageFile: File,
  cropSlug?: string,
  symptoms?: string
): Promise<DiagnosisResult> {
  return analyzeDiagnosis({ imageFile, cropSlug, symptoms });
}
