/**
 * Legal-safe scheme metadata. AgriVeda is an information platform —
 * these fields must not invent official URLs, amounts, or “active” status.
 */

export type SchemeLevel = "central" | "state";

export type SchemeStatus =
  | "active"
  | "seasonal"
  | "closed"
  | "historical"
  | "verification_required"
  | "state_specific";

export type SchemeContentSafety = "verified" | "needs_review" | "historical";

export type SchemeLegalFields = {
  authority: string;
  level: SchemeLevel;
  state?: string;
  schemeTypeHi: string;
  benefitAmount?: string;
  officialSourceUrl?: string;
  officialSourceTitle?: string;
  lastVerified: string;
  status: SchemeStatus;
  contentSafety: SchemeContentSafety;
  disclaimer?: string;
};

/** In-app copy review date — not a government verification stamp. */
export const SCHEMES_APP_REVIEW_DATE = "2026-08-17";

export const SCHEMES_HERO_DISCLAIMER_HI =
  "AgriVeda सरकारी संस्था नहीं है। यहां दी गई जानकारी केवल सूचना और मार्गदर्शन के लिए है। आवेदन और अंतिम पात्रता संबंधित सरकारी विभाग/बैंक/अधिकृत संस्था के नियमों के अनुसार तय होती है।";

export const SCHEMES_HERO_DISCLAIMER_EN =
  "AgriVeda is not a government body. Information here is for guidance only. Applications and final eligibility are decided by the relevant department, bank, or authorised agency.";

export const SCHEMES_FOOTER_DISCLAIMER_HI =
  "अस्वीकरण: AgriVeda एक स्वतंत्र कृषि सूचना एवं मार्गदर्शन प्लेटफ़ॉर्म है और किसी सरकारी विभाग, बैंक, बीमा कंपनी या अन्य सरकारी/अधिकृत संस्था का प्रतिनिधि नहीं है। योजनाओं, पात्रता, लाभ, आवेदन प्रक्रिया, समयसीमा और राशि संबंधी जानकारी समय के साथ बदल सकती है। अंतिम निर्णय और लाभ संबंधित सरकारी विभाग/बैंक/अधिकृत संस्था के वर्तमान नियमों के अनुसार होगा। आवेदन के लिए उपलब्ध कराए गए आधिकारिक स्रोतों को प्राथमिकता दें।";

export const SCHEMES_FOOTER_DISCLAIMER_EN =
  "Disclaimer: AgriVeda is an independent agricultural information and guidance platform and does not represent any government department, bank, insurer, or other official agency. Scheme rules, eligibility, benefits, process, windows, and amounts can change. Final decisions rest with the relevant official body. Prefer official sources when applying.";

export const SCHEMES_BENEFIT_FOOTNOTE_HI =
  "वर्तमान आधिकारिक नियमों और पात्रता के अधीन";

export const SCHEMES_BENEFIT_FOOTNOTE_EN =
  "Subject to current official rules and eligibility";

export const SCHEMES_MISSING_SOURCE_HI =
  "आधिकारिक स्रोत उपलब्ध होने तक इस जानकारी को सत्यापित नहीं माना जाए।";

export const SCHEMES_MISSING_SOURCE_EN =
  "Treat this as unverified until an official source is available.";

export const SCHEMES_FARMER_CAUTION_HI =
  "किसी व्यक्ति को सरकारी योजना के नाम पर OTP, ATM PIN, UPI PIN, internet banking password या card details साझा न करें। AgriVeda आपसे किसी सरकारी लाभ की मंजूरी के बदले निजी खाते में पैसा जमा करने के लिए नहीं कहता।";

export const SCHEMES_FARMER_CAUTION_EN =
  "Do not share OTP, ATM PIN, UPI PIN, internet banking password, or card details with anyone claiming a government scheme. AgriVeda never asks you to deposit money into a private account to get a government benefit approved.";

export const SCHEMES_LEAVE_CONFIRM_HI =
  "आप अब AgriVeda से बाहर जाकर संबंधित आधिकारिक वेबसाइट पर जाएंगे।";

export const SCHEMES_LEAVE_CONFIRM_EN =
  "You are leaving AgriVeda to open the related official website.";

export const STATUS_LABEL: Record<
  SchemeStatus,
  { hi: string; en: string }
> = {
  active: { hi: "वर्तमान जानकारी", en: "Current information" },
  seasonal: { hi: "मौसमी आवेदन विंडो", en: "Seasonal window" },
  closed: { hi: "आवेदन विंडो बंद", en: "Application window closed" },
  historical: { hi: "पुरानी / बंद जानकारी", en: "Historical / discontinued" },
  verification_required: { hi: "सत्यापन आवश्यक", en: "Verification required" },
  state_specific: { hi: "राज्य-विशेष", en: "State-specific" },
};

export const SAFETY_LABEL: Record<
  SchemeContentSafety,
  { hi: string; en: string }
> = {
  verified: { hi: "आधिकारिक स्रोत से जाँची जानकारी", en: "Checked against official source" },
  needs_review: { hi: "समीक्षा आवश्यक", en: "Needs review" },
  historical: { hi: "ऐतिहासिक जानकारी", en: "Historical" },
};

type Meta = Omit<SchemeLegalFields, "officialSourceUrl" | "officialSourceTitle" | "lastVerified"> & {
  lastVerified?: string;
};

/**
 * Editorial legal overlay. Status is set explicitly — never inferred as
 * “active” merely because a row exists.
 */
const META: Record<string, Meta> = {
  "pm-kisan": {
    authority: "Ministry of Agriculture & Farmers Welfare, Government of India",
    level: "central",
    schemeTypeHi: "प्रत्यक्ष आय सहायता",
    benefitAmount: "₹6,000 तक / वर्ष",
    status: "active",
    contentSafety: "verified",
  },
  "mp-cm-kisan": {
    authority: "Department of Farmers Welfare and Agriculture Development, Madhya Pradesh",
    level: "state",
    state: "Madhya Pradesh",
    schemeTypeHi: "राज्य आय सहायता",
    benefitAmount: "अतिरिक्त सहायता — राज्य अधिसूचना अनुसार",
    status: "state_specific",
    contentSafety: "needs_review",
  },
  "rythu-bandhu": {
    authority: "Agriculture Department / State Government (Telangana model and similar)",
    level: "state",
    state: "Telangana",
    schemeTypeHi: "प्रति एकड़ निवेश सहायता",
    status: "state_specific",
    contentSafety: "needs_review",
  },
  rgkny: {
    authority: "State Agriculture Department (Chhattisgarh model and similar)",
    level: "state",
    state: "Chhattisgarh",
    schemeTypeHi: "फसल इनपुट सहायता",
    status: "state_specific",
    contentSafety: "needs_review",
  },
  "pm-kmy": {
    authority: "Ministry of Agriculture & Farmers Welfare / CSC network",
    level: "central",
    schemeTypeHi: "पेंशन योजना",
    benefitAmount: "पात्र योगदान पर पेंशन प्रावधान",
    status: "active",
    contentSafety: "verified",
  },
  "pm-kusum": {
    authority: "Ministry of New and Renewable Energy, Government of India",
    level: "central",
    schemeTypeHi: "सोलर सिंचाई सहायता",
    benefitAmount: "अधिकतम सहायता: घटक व राज्य अनुसार %",
    status: "verification_required",
    contentSafety: "verified",
  },
  smam: {
    authority: "Ministry of Agriculture & Farmers Welfare (SMAM)",
    level: "central",
    schemeTypeHi: "कृषि यंत्रीकरण सहायता",
    benefitAmount: "अधिकतम सहायता: यंत्र, वर्ग और राज्य नियमों पर निर्भर",
    status: "verification_required",
    contentSafety: "verified",
  },
  "chc-hire": {
    authority: "State Agriculture Department / SMAM Custom Hiring Centres",
    level: "central",
    schemeTypeHi: "यंत्र किराया मार्ग",
    status: "verification_required",
    contentSafety: "needs_review",
  },
  "crop-residue": {
    authority: "State Agriculture Department / Crop Residue Management programmes",
    level: "state",
    schemeTypeHi: "पराली मशीन सहायता",
    benefitAmount: "अधिसूचित मशीनों पर सहायता — % राज्य अनुसार",
    status: "seasonal",
    contentSafety: "needs_review",
  },
  pmksy: {
    authority: "Ministry of Jal Shakti / Department of Agriculture (PMKSY)",
    level: "central",
    schemeTypeHi: "सूक्ष्म सिंचाई सहायता",
    benefitAmount: "अधिकतम सहायता: वर्ग, फसल और राज्य स्लैब पर निर्भर",
    status: "verification_required",
    contentSafety: "verified",
  },
  "agri-pipeline": {
    authority: "State Agriculture / Irrigation Department",
    level: "state",
    schemeTypeHi: "सिंचाई पाइपलाइन सहायता",
    status: "verification_required",
    contentSafety: "needs_review",
  },
  "rj-fencing": {
    authority: "Agriculture Department, Government of Rajasthan",
    level: "state",
    state: "Rajasthan",
    schemeTypeHi: "तारबंदी सहायता",
    benefitAmount: "अधिकतम सहायता: राज्य कैप अनुसार",
    status: "state_specific",
    contentSafety: "needs_review",
  },
  "solar-fencing": {
    authority: "State Horticulture / Agriculture Department",
    level: "state",
    schemeTypeHi: "फसल सुरक्षा बाड़",
    status: "state_specific",
    contentSafety: "needs_review",
  },
  "free-boring": {
    authority: "State Agriculture / Irrigation / District administration",
    level: "state",
    schemeTypeHi: "बोरिंग सहायता",
    status: "verification_required",
    contentSafety: "needs_review",
  },
  "farm-pond": {
    authority: "State Agriculture / Soil Conservation / MGNREGS",
    level: "state",
    schemeTypeHi: "जल संचयन संरचना",
    status: "verification_required",
    contentSafety: "needs_review",
  },
  kcc: {
    authority: "Commercial / cooperative / regional rural banks under GoI / RBI KCC framework",
    level: "central",
    schemeTypeHi: "कृषि ऋण सुविधा",
    benefitAmount: "फसली सीमा व ब्याज छूट — बैंक नियमों के अधीन",
    status: "active",
    contentSafety: "verified",
  },
  pcc: {
    authority: "Banks under KCC (Animal Husbandry / Fisheries) framework",
    level: "central",
    schemeTypeHi: "पशुपालन / मत्स्य ऋण",
    status: "verification_required",
    contentSafety: "needs_review",
  },
  "e-nwr": {
    authority: "WDRA-registered warehouses and financing banks",
    level: "central",
    schemeTypeHi: "गोदाम रसीद ऋण",
    status: "verification_required",
    contentSafety: "needs_review",
  },
  aif: {
    authority: "Department of Agriculture & Farmers Welfare (AIF)",
    level: "central",
    schemeTypeHi: "कृषि अवसंरचना ऋण",
    benefitAmount: "पात्र प्रोजेक्ट पर ब्याज सबवेंशन — पोर्टल नियम",
    status: "verification_required",
    contentSafety: "verified",
  },
  pmfby: {
    authority: "Ministry of Agriculture & Farmers Welfare (PMFBY)",
    level: "central",
    schemeTypeHi: "फसल बीमा",
    benefitAmount: "प्रीमियम व दावा — अधिसूचित फसल/मौसम अनुसार",
    status: "seasonal",
    contentSafety: "verified",
  },
  "cm-accident": {
    authority: "State Agriculture / Revenue / CM relief framework",
    level: "state",
    schemeTypeHi: "दुर्घटना राहत",
    benefitAmount: "राज्य अधिसूचना अनुसार सहायता",
    status: "state_specific",
    contentSafety: "needs_review",
  },
  "cm-krishak-sathi": {
    authority: "State Agriculture Department (name varies by state)",
    level: "state",
    schemeTypeHi: "राज्य किसान राहत",
    status: "verification_required",
    contentSafety: "needs_review",
  },
  pmmsy: {
    authority: "Department of Fisheries / NFDB (PMMSY)",
    level: "central",
    schemeTypeHi: "मत्स्य सहायता",
    benefitAmount: "गतिविधि व लाभार्थी प्रकार अनुसार %",
    status: "verification_required",
    contentSafety: "needs_review",
  },
  nbhm: {
    authority: "National Beekeeping & Honey Mission / State Horticulture",
    level: "central",
    schemeTypeHi: "मधुमक्खी पालन सहायता",
    status: "verification_required",
    contentSafety: "needs_review",
  },
  "bamboo-mission": {
    authority: "National Bamboo Mission / State nodal agency",
    level: "central",
    schemeTypeHi: "बांस खेती / वैल्यू चेन",
    status: "verification_required",
    contentSafety: "needs_review",
  },
  "midh-polyhouse": {
    authority: "Mission for Integrated Development of Horticulture / State Horticulture",
    level: "central",
    schemeTypeHi: "संरक्षित खेती संरचना",
    benefitAmount: "अधिकतम सहायता: क्षेत्र व वर्ग पर निर्भर",
    status: "verification_required",
    contentSafety: "needs_review",
  },
  ahidf: {
    authority: "Department of Animal Husbandry & Dairying (AHIDF)",
    level: "central",
    schemeTypeHi: "डेयरी / पशु प्रोसेसिंग निवेश",
    status: "verification_required",
    contentSafety: "needs_review",
  },
  "pm-fme": {
    authority: "Ministry of Food Processing Industries (PM-FME)",
    level: "central",
    schemeTypeHi: "सूक्ष्म खाद्य उद्यम सहायता",
    benefitAmount: "पात्र यूनिट पर कैपिटल सहायता — पोर्टल गाइडलाइन",
    status: "verification_required",
    contentSafety: "verified",
  },
  "rkvy-raftaar": {
    authority: "RKVY-RAFTAAR incubators / State agriculture universities",
    level: "central",
    schemeTypeHi: "एग्री स्टार्टअप सहायता",
    status: "verification_required",
    contentSafety: "needs_review",
  },
};

type SchemeDraft = {
  id: string;
  category: string;
  evidence: "High" | "Medium" | "Low";
  portal?: string;
  portalLabelHi?: string;
};

export function attachSchemeLegal<T extends SchemeDraft>(drafts: T[]): (T & SchemeLegalFields)[] {
  return drafts.map((draft) => {
    const meta = META[draft.id];
    const officialSourceUrl = draft.portal?.trim() || undefined;
    const officialSourceTitle = draft.portalLabelHi;
    const fallbackLevel: SchemeLevel = draft.category === "state" ? "state" : "central";
    const contentSafety: SchemeContentSafety =
      meta?.contentSafety ??
      (draft.evidence === "High" && officialSourceUrl ? "verified" : "needs_review");

    return {
      ...draft,
      authority: meta?.authority ?? "संबंधित सरकारी विभाग / बैंक (आधिकारिक स्रोत से पुष्टि करें)",
      level: meta?.level ?? fallbackLevel,
      state: meta?.state,
      schemeTypeHi: meta?.schemeTypeHi ?? "कृषि योजना",
      benefitAmount: meta?.benefitAmount,
      officialSourceUrl,
      officialSourceTitle,
      lastVerified: meta?.lastVerified ?? SCHEMES_APP_REVIEW_DATE,
      status: meta?.status ?? "verification_required",
      contentSafety,
      disclaimer: meta?.disclaimer,
    };
  });
}

export function hasOfficialSource(scheme: Pick<SchemeLegalFields, "officialSourceUrl">): boolean {
  return Boolean(scheme.officialSourceUrl?.trim());
}

export function isProminentlyCurrent(scheme: Pick<SchemeLegalFields, "contentSafety" | "status">): boolean {
  return (
    scheme.contentSafety === "verified" &&
    scheme.status !== "historical" &&
    scheme.status !== "closed"
  );
}
