import type { DiagnosisResult } from "@/lib/aiDiagnosis";
import type { OutbreakSeverity, OutbreakThreatType } from "@/types/outbreak";
import { getCropPestDisease } from "@/data/pest-disease";

export interface DiagnosisThreatRef {
  cropId: string;
  threatType: OutbreakThreatType;
  pestOrDiseaseId: string;
  threatName: string;
}

const NAME_MAP: Record<string, DiagnosisThreatRef> = {
  "Early Blight": { cropId: "tomato", threatType: "disease", pestOrDiseaseId: "d1", threatName: "Early Blight" },
  "Late Blight": { cropId: "potato", threatType: "disease", pestOrDiseaseId: "d1", threatName: "Late Blight" },
  "Powdery Mildew": { cropId: "grapes", threatType: "disease", pestOrDiseaseId: "d2", threatName: "Powdery Mildew" },
  "Fall Armyworm Damage": { cropId: "maize", threatType: "pest", pestOrDiseaseId: "p1", threatName: "Fall Armyworm" },
};

function fuzzyMatchCrop(cropSlug: string, result: DiagnosisResult): DiagnosisThreatRef | null {
  const crop = getCropPestDisease(cropSlug);
  const name = result.diseaseName.toLowerCase();
  const pathogen = result.pathogen.toLowerCase();

  if (name.includes("armyworm") || pathogen.includes("spodoptera")) {
    const pest = crop.pests.find((p) => p.name.toLowerCase().includes("armyworm"));
    if (pest) {
      return { cropId: cropSlug, threatType: "pest", pestOrDiseaseId: pest.id, threatName: pest.name };
    }
  }

  if (name.includes("blight") || pathogen.includes("phytophthora") || pathogen.includes("alternaria")) {
    const disease = crop.diseases.find(
      (d) =>
        d.name.toLowerCase().includes("blight") ||
        d.pathogen.toLowerCase().includes(pathogen.split(" ")[0])
    );
    if (disease) {
      return {
        cropId: cropSlug,
        threatType: "disease",
        pestOrDiseaseId: disease.id,
        threatName: disease.name,
      };
    }
  }

  if (name.includes("mildew")) {
    const disease = crop.diseases.find((d) => d.name.toLowerCase().includes("mildew"));
    if (disease) {
      return {
        cropId: cropSlug,
        threatType: "disease",
        pestOrDiseaseId: disease.id,
        threatName: disease.name,
      };
    }
  }

  const pest = crop.pests.find(
    (p) =>
      name.includes(p.name.toLowerCase().split(" ")[0]) ||
      pathogen.includes(p.scientificName.toLowerCase().split(" ")[0])
  );
  if (pest) {
    return { cropId: cropSlug, threatType: "pest", pestOrDiseaseId: pest.id, threatName: pest.name };
  }

  const disease = crop.diseases.find((d) => pathogen.includes(d.pathogen.toLowerCase().split(" ")[0]));
  if (disease) {
    return {
      cropId: cropSlug,
      threatType: "disease",
      pestOrDiseaseId: disease.id,
      threatName: disease.name,
    };
  }

  return null;
}

export function mapDiagnosisToThreat(
  result: DiagnosisResult,
  cropSlug: string
): DiagnosisThreatRef | null {
  const staticRef = NAME_MAP[result.diseaseName];
  if (staticRef) {
    return { ...staticRef, cropId: cropSlug === staticRef.cropId ? cropSlug : cropSlug };
  }
  return fuzzyMatchCrop(cropSlug, result);
}

export function diagnosisSeverityToOutbreak(severity: DiagnosisResult["severity"]): OutbreakSeverity {
  if (severity === "High") return "high";
  if (severity === "Medium") return "medium";
  return "low";
}
