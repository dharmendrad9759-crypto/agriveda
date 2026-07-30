/**
 * Bridge AI Doctor diagnosis → Ask Expert page via sessionStorage.
 * Cleared after ask-query submit (or when a newer referral is saved).
 */

import type { DiagnosisResult } from "@/lib/aiDiagnosis";

export const AI_DOCTOR_EXPERT_REFERRAL_KEY = "agriveda-ai-doctor-expert-referral";

export interface AiDoctorExpertReferral {
  cropSlug: string;
  cropName: string;
  /** data: URL preferred so it survives navigation */
  photoDataUrl?: string | null;
  result: DiagnosisResult;
  createdAt: string;
}

export function buildExpertQueryText(referral: AiDoctorExpertReferral): string {
  const r = referral.result;
  const treat = r.treatments.slice(0, 3).map((t) => `• ${t}`).join("\n");
  const obs = r.visualObservations
    ? r.visualObservations.replace(/\s*\([^)]*\)/g, "").replace(/\s{2,}/g, " ").trim()
    : "";

  const lines = [
    `AI फसल डॉक्टर निदान — कृपया पुष्टि करें`,
    `फसल: ${referral.cropName}`,
    `रोग: ${r.diseaseName}`,
    r.pathogen ? `रोगकारक: ${r.pathogen}` : "",
    `विश्वास: ${r.confidence}% · जोखिम: ${r.riskLevel} · गंभीरता: ${r.severity}`,
    r.stage ? `अवस्था: ${r.stage}` : "",
    obs ? `फोटो/लक्षण: ${obs}` : "",
    treat ? `सुझाया उपचार:\n${treat}` : "",
    ``,
    `मेरा सवाल: क्या यह निदान सही है? खेत के हिसाब से और क्या करें?`,
  ].filter(Boolean);

  return lines.join("\n");
}

export function saveAiDoctorExpertReferral(payload: AiDoctorExpertReferral): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(AI_DOCTOR_EXPERT_REFERRAL_KEY, JSON.stringify(payload));
  } catch {
    // Quota — retry without photo
    try {
      sessionStorage.setItem(
        AI_DOCTOR_EXPERT_REFERRAL_KEY,
        JSON.stringify({ ...payload, photoDataUrl: null })
      );
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
    return JSON.parse(raw) as AiDoctorExpertReferral;
  } catch {
    return null;
  }
}

export function clearAiDoctorExpertReferral(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(AI_DOCTOR_EXPERT_REFERRAL_KEY);
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
