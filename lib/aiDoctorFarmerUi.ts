import type { DiagnosisResult } from "@/lib/aiDiagnosis";
import { mapDiagnosisToThreat } from "@/lib/aiDiagnosisMap";
import {
  inferProblemType,
  shouldShowRecoveryTonics,
  type DiagnosisProblemType,
} from "@/lib/aiDoctorSanitize";

export type DiagnosisKind = "pest" | "disease" | "virus" | "nutrient" | "other";

const PEST_HINT =
  /कीट|किड़ा|इल्ली|फुदका|पतंग|झींगुर|insect|worm|borer|hopper|aphid|thrips|caterpillar|armyworm|whitefly|mite|leaf\s*miner|stem\s*borer/i;

export function guessDiagnosisKind(
  result: DiagnosisResult,
  cropSlug?: string
): DiagnosisKind {
  const type = inferProblemType(result);
  if (type === "pest") return "pest";
  if (type === "viral") return "virus";
  if (type === "fungal" || type === "bacterial") return "disease";
  if (type === "nutrient") return "nutrient";
  if (type === "healthy" || type === "abiotic" || type === "unknown") {
    if (cropSlug) {
      const ref = mapDiagnosisToThreat(result, cropSlug);
      if (ref?.threatType === "pest") return "pest";
      if (ref?.threatType === "disease") return "disease";
    }
    const blob = `${result.diseaseName} ${result.pathogen} ${result.visualObservations ?? ""}`;
    if (PEST_HINT.test(blob)) return "pest";
    return type === "healthy" ? "other" : "disease";
  }
  return "other";
}

export function likelyThreatLabel(kind: DiagnosisKind): string {
  if (kind === "pest") return "संभावित कीट";
  if (kind === "virus") return "संभावित वायरस";
  if (kind === "nutrient") return "संभावित पोषक कमी";
  if (kind === "disease") return "संभावित रोग";
  return "संभावित समस्या";
}

export function severityHi(severity: DiagnosisResult["severity"]): string {
  if (severity === "High") return "ज़्यादा";
  if (severity === "Medium") return "मध्यम";
  return "कम";
}

export function buildDiagnosisSpeechText(result: DiagnosisResult): string {
  const parts: string[] = [];
  const problemType: DiagnosisProblemType = inferProblemType(result);

  if (result.visualObservations?.trim()) {
    parts.push(`समस्या क्या दिखी? ${result.visualObservations.trim()}`);
  }

  const whyLines = [
    ...result.whyItHappens.map((w) => w.trim()).filter(Boolean),
    ...(result.environmentalFactors.length
      ? [`मौसम: ${result.environmentalFactors.join(" ")}`]
      : []),
  ];
  if (whyLines.length) {
    parts.push(`यह क्यों हुआ? ${whyLines.join("। ")}`);
  }

  const cultural = result.treatments.map((t) => t.trim()).filter(Boolean);
  if (cultural.length) {
    parts.push(`समाधान: ${cultural.join("। ")}`);
  }

  const meds = result.activeIngredients
    .map((ai) => {
      const brandBit =
        ai.brands && ai.brands.length > 0 ? ` (बाज़ार: ${ai.brands.join(", ")})` : "";
      return [ai.name, ai.dose].filter(Boolean).join(" — ").trim() + brandBit;
    })
    .filter(Boolean);
  if (meds.length) {
    parts.push(`दवा: ${meds.join("। ")}`);
  }
  if (result.spraySticker?.trim()) {
    parts.push(`स्प्रे स्टिकर: ${result.spraySticker.trim()}`);
  }
  if (shouldShowRecoveryTonics(problemType)) {
    const tonics = (result.recoveryTonics ?? []).map((t) => t.trim()).filter(Boolean);
    if (tonics.length) {
      parts.push(`रिकवरी टॉनिक: ${tonics.join("। ")}`);
    }
  }

  return parts.join("। ");
}
