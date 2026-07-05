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

/** Compress large phone photos before sending to Gemini API */
async function compressImageIfNeeded(file: File): Promise<File> {
  if (file.size <= 1.2 * 1024 * 1024) return file;

  const dataUrl = await readFileAsDataUrl(file);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Photo load failed"));
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

/** Real plant diagnosis via Google Gemini Vision (server-side). */
export async function analyzePlantImage(
  imageFile: File,
  cropSlug?: string
): Promise<DiagnosisResult> {
  const { base64, mimeType } = await fileToBase64Payload(imageFile);

  const res = await fetch("/api/ai-doctor/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageBase64: base64,
      mimeType,
      cropSlug: cropSlug?.trim() || "tomato",
    }),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.error || "AI analysis fail — dubara koshish karein");
  }

  return body.result as DiagnosisResult;
}
