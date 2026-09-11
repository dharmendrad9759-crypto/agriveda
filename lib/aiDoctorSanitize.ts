import type { DiagnosisResult } from "@/lib/aiDiagnosis";
import { enrichMedicineDisplay } from "@/lib/aiDoctorMedicineBrands";

export type DiagnosisProblemType =
  | "pest"
  | "fungal"
  | "bacterial"
  | "viral"
  | "nutrient"
  | "abiotic"
  | "healthy"
  | "unknown";

const MEDICINE_LINE =
  /(?:ml\/|g\/|लीटर|\/\s*l\b|ppm|%|स्प्रे|छिड़क|दवा|कीटनाशक|फफूंदनाशक|fungicide|insecticide|herbicide|mancozeb|propiconazole|azoxystrobin|imidacloprid|chlorantraniliprole|emamectin|copper|bordeaux|carbendazim|metalaxyl|thiamethoxam|\bwp\b|\bec\b|\bsc\b|\bwg\b)/i;

const RECOVERY_OK: DiagnosisProblemType[] = ["fungal", "bacterial", "viral"];

/** Infer problem type when model omits it. */
export function inferProblemType(result: Pick<
  DiagnosisResult,
  "diseaseName" | "pathogen" | "visualObservations" | "problemType"
>): DiagnosisProblemType {
  if (result.problemType && result.problemType !== "unknown") return result.problemType;

  const blob = `${result.diseaseName} ${result.pathogen} ${result.visualObservations ?? ""}`;
  if (/स्वस्थ|healthy|कोई स्पष्ट समस्या नहीं/i.test(blob)) return "healthy";
  if (/virus|वायरस|viral|mosaic|मोजेक|leaf\s*curl|टंग्रो|tungro|begomo|yvmv/i.test(blob)) {
    return "viral";
  }
  if (/bacter|बैक्टीर|bacterial wilt|कोमल सड़न/i.test(blob)) return "bacterial";
  if (
    /कीट|किड़ा|इल्ली|फुदका|पतंग|insect|worm|borer|hopper|aphid|thrips|caterpillar|armyworm|whitefly|mite|leaf\s*miner|stem\s*borer|सफेद मक्खी|माइट/i.test(
      blob
    )
  ) {
    return "pest";
  }
  if (/पोषक|nutrient|deficiency|नाइट्रोजन|जिंक|लोह|कैल्शियम|कमी/i.test(blob)) return "nutrient";
  if (/सूखा|जलभराव|धूप|ठंड|abiotic|stress|जलन|खराबा/i.test(blob)) return "abiotic";
  if (/फफूंद|fungal|blight|mildew|rust|smut|rot|झुलसा|डाउनी|पाउडरी|anthracnose/i.test(blob)) {
    return "fungal";
  }
  return "unknown";
}

export function shouldShowRecoveryTonics(type: DiagnosisProblemType): boolean {
  return RECOVERY_OK.includes(type);
}

function splitMedicineLine(line: string): { name: string; dose: string } {
  const cleaned = line.replace(/^[\s•\-–—]+/, "").trim();
  const parts = cleaned.split(/\s*[—–\-·:]\s+|\s+—\s+/);
  if (parts.length >= 2) {
    return { name: parts[0].trim(), dose: parts.slice(1).join(" — ").trim() };
  }
  const doseMatch = cleaned.match(
    /(.+?)\s+(\d+(?:\.\d+)?(?:\s*[\u2013\-]\s*\d+(?:\.\d+)?)?\s*(?:ml|g|%|लीटर|\/\s*L).*)/i
  );
  if (doseMatch) {
    return { name: doseMatch[1].trim(), dose: doseMatch[2].trim() };
  }
  return { name: cleaned, dose: "लेबल अनुसार" };
}

/**
 * Keep समाधान cultural-only; move medicine-like lines into दवा;
 * recovery tonics only for fungal/bacterial/viral.
 */
export function sanitizeDiagnosisForFarmer(result: DiagnosisResult): DiagnosisResult {
  const problemType = inferProblemType(result);
  const cultural: string[] = [];
  const movedMeds = [...result.activeIngredients];

  for (const t of result.treatments) {
    const line = t.trim();
    if (!line) continue;
    if (MEDICINE_LINE.test(line)) {
      const { name, dose } = splitMedicineLine(line);
      if (!movedMeds.some((m) => m.name.toLowerCase() === name.toLowerCase())) {
        movedMeds.push(enrichMedicineDisplay({ name, dose, fracIrac: "—", brands: [] }));
      }
    } else {
      cultural.push(line);
    }
  }

  let recoveryTonics = result.recoveryTonics ?? [];
  if (!shouldShowRecoveryTonics(problemType)) {
    recoveryTonics = [];
  }

  // Healthy / nutrient / abiotic: don't push random pesticides
  if (problemType === "healthy" || problemType === "nutrient" || problemType === "abiotic") {
    if (problemType === "healthy") {
      return {
        ...result,
        problemType,
        treatments: cultural.length ? cultural : result.treatments.slice(0, 3),
        activeIngredients: [],
        spraySticker: undefined,
        recoveryTonics: [],
      };
    }
  }

  // Virus: keep medicines (usually vector control) but never pretend chemical cures virus
  if (problemType === "viral") {
    const note =
      "वायरस की सीधी दवा नहीं होती — बीमार पौधा हटाएँ; कीट वेक्टर नियंत्रित करें।";
    if (!cultural.some((c) => /वायरस|वेक्टर|उखाड़/i.test(c))) {
      cultural.unshift(note);
    }
  }

  return {
    ...result,
    problemType,
    treatments: cultural,
    activeIngredients: movedMeds
      .filter((m) => m.name && m.name !== "—")
      .map((m) => enrichMedicineDisplay(m)),
    recoveryTonics,
  };
}
