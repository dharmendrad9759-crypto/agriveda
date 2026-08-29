import type { DiagnosisResult } from "@/lib/aiDiagnosis";
import { mapDiagnosisToThreat } from "@/lib/aiDiagnosisMap";

export type DiagnosisKind = "pest" | "disease";

const PEST_HINT =
  /कीट|किड़ा|इल्ली|फुदका|पतंग|झींगुर|insect|worm|borer|hopper|aphid|thrips|caterpillar|armyworm|whitefly|mite|leaf\s*miner|stem\s*borer/i;

export function guessDiagnosisKind(
  result: DiagnosisResult,
  cropSlug?: string
): DiagnosisKind {
  if (cropSlug) {
    const ref = mapDiagnosisToThreat(result, cropSlug);
    if (ref?.threatType === "pest") return "pest";
    if (ref?.threatType === "disease") return "disease";
  }
  const blob = `${result.diseaseName} ${result.pathogen} ${result.visualObservations ?? ""}`;
  return PEST_HINT.test(blob) ? "pest" : "disease";
}

export function likelyThreatLabel(kind: DiagnosisKind): string {
  return kind === "pest" ? "संभावित कीट" : "संभावित रोग";
}

export function severityHi(severity: DiagnosisResult["severity"]): string {
  if (severity === "High") return "ज़्यादा";
  if (severity === "Medium") return "मध्यम";
  return "कम";
}

export function buildDiagnosisSpeechText(result: DiagnosisResult): string {
  const parts: string[] = [];

  // 1 — समस्या क्या दिखी? (screen section only)
  if (result.visualObservations?.trim()) {
    parts.push(`समस्या क्या दिखी? ${result.visualObservations.trim()}`);
  }

  // 2 — यह क्यों हुआ? (bullet points + weather line on screen)
  const whyLines = [
    ...result.whyItHappens.map((w) => w.trim()).filter(Boolean),
    ...(result.environmentalFactors.length
      ? [`मौसम: ${result.environmentalFactors.join(" ")}`]
      : []),
  ];
  if (whyLines.length) {
    parts.push(`यह क्यों हुआ? ${whyLines.join("। ")}`);
  }

  // 3 — समाधान (treatments + medicines block on screen — no label/disclaimer)
  const solutionLines: string[] = [];
  for (const t of result.treatments) {
    const line = t.trim();
    if (line) solutionLines.push(line);
  }
  for (const ai of result.activeIngredients) {
    const line = [ai.name, ai.dose].filter(Boolean).join(" — ").trim();
    if (line) solutionLines.push(line);
  }
  if (result.spraySticker?.trim()) {
    solutionLines.push(`स्प्रे स्टिकर: ${result.spraySticker.trim()}`);
  }
  for (const tonic of result.recoveryTonics ?? []) {
    const line = tonic.trim();
    if (line) solutionLines.push(line);
  }
  if (solutionLines.length) {
    parts.push(`समाधान: ${solutionLines.join("। ")}`);
  }

  return parts.join("। ");
}
