import type { FarmerScheme } from "@/data/schemes/farmerSchemes";

export type LandholderAnswer = "yes" | "no" | "unsure" | "";
export type FarmerActivity =
  | ""
  | "crop"
  | "horticulture"
  | "livestock"
  | "fishery"
  | "processing";
export type AgeBand = "" | "under18" | "18to40" | "over40";
export type LandSizeBand = "" | "none" | "marginal" | "small" | "medium_plus";

export type EligibilityAnswers = {
  state: string;
  landholder: LandholderAnswer;
  landSize: LandSizeBand;
  activity: FarmerActivity;
  ageBand: AgeBand;
};

export type EligibilityResultKind = "likely" | "need_more" | "mismatch";

export type EligibilityResult = {
  kind: EligibilityResultKind;
  titleHi: string;
  titleEn: string;
  bodyHi: string;
  bodyEn: string;
};

export const EMPTY_ELIGIBILITY: EligibilityAnswers = {
  state: "",
  landholder: "",
  landSize: "",
  activity: "",
  ageBand: "",
};

function normState(value: string): string {
  return value.trim().toLowerCase();
}

function stateMatches(scheme: FarmerScheme, farmerState: string): boolean | null {
  if (scheme.level !== "state" || !scheme.state) return true;
  if (!farmerState.trim()) return null;
  const a = normState(scheme.state);
  const b = normState(farmerState);
  return b === a || b.includes(a) || a.includes(b);
}

function activityFits(scheme: FarmerScheme, activity: FarmerActivity): boolean | null {
  if (!activity) return null;
  if (scheme.category === "livestock" && scheme.id === "pmmsy") return activity === "fishery";
  if (scheme.category === "livestock") return activity === "livestock" || activity === "fishery";
  if (scheme.category === "horticulture") return activity === "horticulture" || activity === "crop";
  if (scheme.category === "processing") return activity === "processing";
  if (scheme.category === "credit" && scheme.id === "pcc") {
    return activity === "livestock" || activity === "fishery";
  }
  return true;
}

export function evaluateSchemeEligibility(
  scheme: FarmerScheme,
  answers: EligibilityAnswers
): EligibilityResultKind {
  const missingCore = !answers.state.trim() || !answers.landholder;
  if (missingCore) return "need_more";

  const stateOk = stateMatches(scheme, answers.state);
  if (stateOk === false) return "mismatch";
  if (stateOk === null) return "need_more";

  if (
    (scheme.id === "pm-kisan" || scheme.id === "pm-kmy" || scheme.category === "income") &&
    answers.landholder === "no"
  ) {
    return "mismatch";
  }

  if (scheme.id === "kcc" && answers.landholder === "no") {
    return "need_more";
  }

  if (scheme.id === "pm-kmy") {
    if (!answers.ageBand) return "need_more";
    if (answers.ageBand !== "18to40") return "mismatch";
  }

  const act = activityFits(scheme, answers.activity);
  if (act === false) return "mismatch";

  if (scheme.id === "pm-kisan" && answers.landholder === "unsure") return "need_more";

  return "likely";
}

export function resultCopy(kind: EligibilityResultKind): EligibilityResult {
  if (kind === "likely") {
    return {
      kind,
      titleHi: "प्रारंभिक रूप से पात्र हो सकते हैं",
      titleEn: "You may be preliminarily eligible",
      bodyHi:
        "आपके द्वारा दी गई जानकारी योजना की उपलब्ध पात्रता शर्तों से मेल खाती दिखाई देती है। अंतिम पात्रता संबंधित विभाग/अधिकृत संस्था द्वारा निर्धारित की जाएगी।",
      bodyEn:
        "Your answers appear to match the published eligibility conditions. Final eligibility is decided by the relevant department or authorised agency.",
    };
  }
  if (kind === "need_more") {
    return {
      kind,
      titleHi: "कुछ जानकारी और चाहिए",
      titleEn: "More information is needed",
      bodyHi:
        "यह केवल प्रारंभिक guidance है। राज्य, भूमि और किसान प्रकार पूरी तरह भरें — अंतिम निर्णय संबंधित आधिकारिक संस्था का होगा।",
      bodyEn:
        "This is only preliminary guidance. Add state, landholding, and farmer type. The official agency makes the final decision.",
    };
  }
  return {
    kind,
    titleHi: "वर्तमान जानकारी के आधार पर पात्रता मेल नहीं खाती",
    titleEn: "Current answers do not appear to match",
    bodyHi:
      "यह केवल प्रारंभिक guidance है। अंतिम निर्णय संबंधित आधिकारिक संस्था का होगा। आधिकारिक शर्तें देखकर पुष्टि करें।",
    bodyEn:
      "This is only preliminary guidance. The official agency makes the final decision. Confirm against official conditions.",
  };
}

export function rankSchemesForAnswers(
  schemes: FarmerScheme[],
  answers: EligibilityAnswers
): FarmerScheme[] {
  const scored = schemes.map((scheme) => {
    const kind = evaluateSchemeEligibility(scheme, answers);
    const score = kind === "likely" ? 2 : kind === "need_more" ? 1 : 0;
    const verifiedBoost = scheme.contentSafety === "verified" ? 0.2 : 0;
    return { scheme, score: score + verifiedBoost };
  });
  return scored
    .filter((row) => row.score >= 1)
    .sort((a, b) => b.score - a.score)
    .map((row) => row.scheme);
}
