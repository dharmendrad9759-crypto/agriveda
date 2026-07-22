export interface DiagnosisResult {
  diseaseName: string;
  pathogen: string;
  confidence: number;
  severity: "Low" | "Medium" | "High";
  stage: string;
  riskLevel: string;
  whyItHappens: string[];
  environmentalFactors: string[];
  treatments: string[];
  activeIngredients: { name: string; dose: string; fracIrac: string }[];
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

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82)
    );
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, ".jpg") || "scan.jpg", {
      type: "image/jpeg",
    });
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
};

async function postDiagnosis(payload: Record<string, unknown>): Promise<DiagnosisResult> {
  const res = await fetch("/api/ai-doctor/analyze", {
    method: "POST",
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
    const { base64, mimeType } = await fileToBase64Payload(input.imageFile);
    return postDiagnosis({
      imageBase64: base64,
      mimeType,
      cropSlug,
      symptoms: symptoms || undefined,
    });
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
