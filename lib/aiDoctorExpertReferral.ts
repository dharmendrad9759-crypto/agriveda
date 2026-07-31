/**
 * Bridge AI Doctor diagnosis → Ask Expert page via sessionStorage.
 * Photo is compressed so it fits storage quota.
 */

import type { DiagnosisResult } from "@/lib/aiDiagnosis";

export const AI_DOCTOR_EXPERT_REFERRAL_KEY = "agriveda-ai-doctor-expert-referral";
export const AI_DOCTOR_EXPERT_PHOTO_KEY = "agriveda-ai-doctor-expert-photo";

export interface AiDoctorExpertReferral {
  cropSlug: string;
  cropName: string;
  /** data: URL preferred so it survives navigation */
  photoDataUrl?: string | null;
  result: DiagnosisResult;
  createdAt: string;
}

/** Short farmer question — diagnosis details live in the banner, not a wall of text. */
export function buildExpertQueryText(referral: AiDoctorExpertReferral): string {
  const r = referral.result;
  return [
    `${referral.cropName} पर AI डॉक्टर ने "${r.diseaseName}" बताया (${r.confidence}% विश्वास)।`,
    `क्या यह सही है? खेत में आगे क्या करें — खुराक और समय बताएँ।`,
  ].join("\n");
}

/** Shrink scan photo so sessionStorage rarely hits quota. */
export async function compressPhotoForReferral(
  dataUrl: string,
  maxEdge = 720,
  quality = 0.62
): Promise<string> {
  if (!dataUrl.startsWith("data:image")) return dataUrl;
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("img"));
      el.src = dataUrl;
    });
    const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    return dataUrl;
  }
}

export function saveAiDoctorExpertReferral(payload: AiDoctorExpertReferral): void {
  if (typeof window === "undefined") return;

  const meta = { ...payload, photoDataUrl: null as string | null };
  const photo = payload.photoDataUrl ?? null;

  try {
    sessionStorage.setItem(AI_DOCTOR_EXPERT_REFERRAL_KEY, JSON.stringify(meta));
  } catch {
    try {
      sessionStorage.setItem(
        AI_DOCTOR_EXPERT_REFERRAL_KEY,
        JSON.stringify({
          cropSlug: payload.cropSlug,
          cropName: payload.cropName,
          photoDataUrl: null,
          result: {
            ...payload.result,
            visualObservations: undefined,
            whyItHappens: payload.result.whyItHappens?.slice(0, 2) ?? [],
            treatments: payload.result.treatments?.slice(0, 3) ?? [],
            activeIngredients: payload.result.activeIngredients?.slice(0, 3) ?? [],
            prevention: [],
            environmentalFactors: [],
          },
          createdAt: payload.createdAt,
        })
      );
    } catch {
      /* ignore */
    }
  }

  if (photo) {
    try {
      sessionStorage.setItem(AI_DOCTOR_EXPERT_PHOTO_KEY, photo);
    } catch {
      try {
        localStorage.setItem(AI_DOCTOR_EXPERT_PHOTO_KEY, photo);
      } catch {
        /* ignore */
      }
    }
  } else {
    try {
      sessionStorage.removeItem(AI_DOCTOR_EXPERT_PHOTO_KEY);
      localStorage.removeItem(AI_DOCTOR_EXPERT_PHOTO_KEY);
    } catch {
      /* ignore */
    }
  }
}

export function readAiDoctorExpertReferral(): AiDoctorExpertReferral | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(AI_DOCTOR_EXPERT_REFERRAL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AiDoctorExpertReferral;
    const photo =
      sessionStorage.getItem(AI_DOCTOR_EXPERT_PHOTO_KEY) ||
      localStorage.getItem(AI_DOCTOR_EXPERT_PHOTO_KEY) ||
      parsed.photoDataUrl ||
      null;
    return { ...parsed, photoDataUrl: photo };
  } catch {
    return null;
  }
}

export function clearAiDoctorExpertReferral(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(AI_DOCTOR_EXPERT_REFERRAL_KEY);
    sessionStorage.removeItem(AI_DOCTOR_EXPERT_PHOTO_KEY);
    localStorage.removeItem(AI_DOCTOR_EXPERT_PHOTO_KEY);
  } catch {
    /* ignore */
  }
}

export async function urlToDataUrl(url: string): Promise<string | null> {
  if (!url) return null;
  if (url.startsWith("data:")) return url;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("read failed"));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}
