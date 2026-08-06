import type { ResearchDossierOverlay } from "@/types/crop-dossier";

const LEGAL =
  "आलू लेट ब्लाइट कार्यक्रम अनिवार्य मौसम में। Metalaxyl हमेशा M3/M5 संपर्क संग; लगातार अकेला FRAC 4 न लगाएँ। लेबल PHI।";

export const potatoDossier: ResearchDossierOverlay = {
  slug: "potato",
  sourceLabel: "Research dossier Vol.1 — Potato",
  legalNote: LEGAL,
  growthStages: [
    { title: "अंकुरण", period: "DAP 10–20", keyPoints: ["एकसमान स्prout", "मिट्टी चढ़ाना"] },
    { title: "वानस्पतिक", period: "DAP 20–45", keyPoints: ["कैनोपी", "लेट ब्लाइट निगरानी"] },
    { title: "कंद शुरुआत / बल्किंग", period: "DAP 40–75", keyPoints: ["पानी+K critical", "खोखला हृदय रोकें"] },
    { title: "पकना / वाइन किल", period: "DAP 75–100", keyPoints: ["त्वचा सेट", "भंडारण"] },
  ],
  irrigationSchedule: [
    "कुल ~250–350 mm।",
    "कंद शुरुआत DAP 40–50: हर 5–6 दिन — कमी = दरार/hollow heart।",
    "बल्किंग DAP 50–75: हर 5–7 दिन।",
    "कटाई से ~15 दिन पहले पानी घटाएँ।",
  ],
  fertilizerSchedule: [
    "N 60–70 / P₂O₅ 30–35 / K₂O 35–40 kg/acre (उदाहरण)।",
    "SOP अक्सर MOP से बेहतर गुणवत्ता। K आधा बेसल आधा कंद शुरुआत।",
  ],
  micronutrients: [
    "Zn बेसल; B DAP 30+50; Ca foliar DAP 40–60 — आंतरिक दाग।",
    "S Gypsum; Mg foliar।",
  ],
  pgrNotes: [
    "GA₃ कम ppm कंद सोख — डॉर्मेंसी तोड़ना (लेबल)। Ethephon आलू में अनुशंसित नहीं।",
  ],
  pestManagement: [
    {
      pestName: "एफिड (वायरस वेक्टर)",
      scientificName: "Myzus persicae",
      identification: "पत्तियों पर कॉलोनी।",
      symptoms: ["PVY/PLRV", "मोज़ेक/रोल"],
      etl: "50 एफिड/पत्ती; वायरस क्षेत्र में शीघ्र",
      biologicalControl: ["मिनरल ऑयल — प्रोबिंग कम"],
      chemicalControl: [
        "Imidacloprid बीज/स्प्रे (IRAC 4A)",
        "Flonicamid (IRAC 9C)",
      ],
      iracGroup: "4A / 9C / 23",
      activeIngredient: "Flonicamid",
      dose: "लेबल",
    },
    {
      pestName: "कंद मोथ / सफेद गिडार–कटवर्म / हैड्डा",
      scientificName: "Phthorimaea / Holotrichia–Agrotis / Henosepilachna",
      identification: "पत्ती सुरंग + भंडारण; जड़/कंद छेद; पिंजरा पत्ती।",
      symptoms: ["भंडारण नुकसान 100% तक", "कंद छेद"],
      etl: "किसी भी भंडारण संक्रमण पर कार्रवाई",
      biologicalControl: ["PTM NPV भंडारण"],
      chemicalControl: [
        "Spinosad / Chlorantraniliprole (IRAC 5/28)",
        "मिट्टी: Fipronil GR / Chlorpyrifos दrench — लेबल",
      ],
      iracGroup: "5 / 28 / 2B / 1B",
      activeIngredient: "Spinosad",
      dose: "लेबल",
    },
  ],
  diseaseManagement: [
    {
      diseaseName: "लेट ब्लाइट",
      pathogen: "Phytophthora infestans",
      type: "ओomycete",
      symptoms: ["पानी–भीगे धब्बे", "नीचे सफेद स्पोर", "कंद सड़न"],
      favourableConditions: ["10–20°C", "RH >90%", "लंबी गीली पत्ती"],
      integratedManagement: ["प्रोफाइलैक्टिक M3/M5", "5–7 दिन अंतराल नमी में", "FRAC रोटेशन"],
      biologicalControl: [],
      chemicalControl: [
        "Mancozeb / Chlorothalonil (M3/M5)",
        "Cymoxanil + Mancozeb (27+M3)",
        "Metalaxyl-M + Mancozeb (4+M3) — अकेला 4 कभी नहीं",
        "Dimethomorph (40)",
      ],
      fracGroup: "M3/M5 → 27 → 4+M3 → 40",
      activeIngredient: "Cymoxanil + Mancozeb",
      dose: "लेबल",
      waitingPeriod: "लेबल PHI",
    },
    {
      diseaseName: "अर्ली ब्लाइट / ब्लैकलेग / कॉमन स्कैब / वायरस",
      pathogen: "Alternaria / Pectobacterium / Streptomyces / PVY–PLRV",
      type: "कवक / जीवाणु / एक्टिनो / वायरस",
      symptoms: ["टारगेट रिंग", "काला तना", "खुरदुरा स्कैब", "मोज़ेक"],
      favourableConditions: ["तनाव", "गीली मिट्टी", "pH >6.5 स्कैब"],
      integratedManagement: [
        "स्वस्थ बीज कंद",
        "स्कैब: शुरू में नमी + सही pH",
        "वायरस: एफिड + बीज स्वास्थ्य",
      ],
      biologicalControl: [],
      chemicalControl: [
        "Difenoconazole / Azoxystrobin (अर्ली)",
        "Copper / बीज उपचार (बैक्टीरियल सहायक)",
      ],
      fracGroup: "3 / 11 / M1",
      activeIngredient: "Difenoconazole",
      dose: "लेबल",
      waitingPeriod: "लेबल",
    },
  ],
  weedManagement: [
    {
      weedName: "Bathua / घास / साइपरस",
      scientificName: "Chenopodium album / Phalaris / Cyperus",
      type: "मिश्रित",
      criticalPeriod: "0–40 DAP",
      preEmergenceHerbicide: "Pendimethalin / Metribuzin — लेबल; Metribuzin डोज़ संवेदनशील",
      postEmergenceHerbicide: "Quizalofop घास; Solanum nigrum हाथ निराई",
      hracGroup: "K1 / C1 / A",
      dose: "लेबल सख्त",
    },
  ],
  tankMixCompatible: [
    "Mancozeb + Cymoxanil",
    "Imidacloprid + Mancozeb (pH ध्यान)",
  ],
  tankMixIncompatible: [
    "FRAC 4 बिना संपर्क बेस लगातार",
    "कॉपर + Avermectin",
    "सल्फर + तेल >30°C",
  ],
  resistanceRotation: ["लेट ब्लाइट: M3/M5 → 27 → 4+M3 → 40 → M3"],
  faqs: [
    {
      question: "पूरा खेत एक हफ्ते में काला क्यों?",
      answer: "अक्सर लेट ब्लाइट तेज़ प्रसार। नमी में 5–7 दिन स्प्रे चक्र + FRAC घुमाएँ।",
    },
  ],
};
