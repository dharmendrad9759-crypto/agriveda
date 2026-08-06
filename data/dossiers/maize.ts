import type { ResearchDossierOverlay } from "@/types/crop-dossier";

const LEGAL =
  "लेबल अनिवार्य। FAW स्प्रे व्होर्ल में लगाएँ। Nicosulfuron + Organophosphate (Chlorpyrifos/Dimethoate) न मिलाएँ — फाइटो।";

export const maizeDossier: ResearchDossierOverlay = {
  slug: "maize",
  sourceLabel: "Research dossier Vol.1 — Maize",
  legalNote: LEGAL,
  growthStages: [
    { title: "अंकुरण–V6", period: "DAS 5–30", keyPoints: ["एकसमान स्टैंड", "FAW स्काउट"] },
    { title: "घुटना–झाड़", period: "DAS 30–55", keyPoints: ["N टॉप ड्रेस", "TLB"] },
    { title: "टassel/सिल्क", period: "DAS 55–70", keyPoints: ["पानी मत छोड़ो — >40% नुकसान"] },
    { title: "दाना भरना", period: "DAS 75–115", keyPoints: ["K/कार्बोहाइड्रेट", "कटाई"] },
  ],
  irrigationSchedule: [
    "V4–V6: हर 7–8 दिन।",
    "VT/R1: हर 4–5 दिन — सबसे महत्वपूर्ण।",
    "दाना भरना: हर 6–7 दिन; पकने पर घटाएँ।",
  ],
  fertilizerSchedule: [
    "N 50–60 / P₂O₅ 25–30 / K₂O 20–25 kg/acre (हाइब्रिड उदाहरण)।",
    "P पूरा बेसल; N: बेसल + घुटना + VT; K आधा–आधा।",
  ],
  micronutrients: [
    "ZnSO₄ 5 kg बेसल — white bud।",
    "Boron tasseling — पराग/सिल्क।",
    "S, Mg, Fe जरूरत पर।",
  ],
  pgrNotes: [
    "Ethephon V6–V8 लॉजिंग कम — केवल लेबल; गलत समय नुकसान।",
  ],
  pestManagement: [
    {
      pestName: "फॉल आर्मीवर्म (FAW)",
      scientificName: "Spodoptera frugiperda",
      identification: "व्होर्ल में फ्रास; खिड़की–फटे पत्ते।",
      symptoms: ["व्होर्ल नष्ट", "दाने में नुकसान"],
      etl: "V4–V8 पर 5–10% व्होर्ल नुकसान",
      biologicalControl: [],
      chemicalControl: [
        "Chlorantraniliprole 18.5% SC (IRAC 28) — व्होर्ल",
        "Emamectin / Spinetoram (IRAC 6/5)",
      ],
      iracGroup: "28 → 6 → 5",
      activeIngredient: "Chlorantraniliprole",
      dose: "उच्च पानी वॉल्यूम; व्होर्ल लक्ष्य",
    },
    {
      pestName: "तना छेदक / माहूँ / दीमक–सफेद गिडार",
      scientificName: "Chilo partellus / Rhopalosiphum / Odontotermes–Holotrichia",
      identification: "डेडहार्ट; टassel पर माहूँ; जड़ नुकसान।",
      symptoms: ["तना खोखला", "सोटी फफूंद", "पौध मुरझान"],
      etl: "क्षेत्रीय ETL",
      biologicalControl: [],
      chemicalControl: [
        "Stem borer: Chlorantraniliprole / Flubendiamide (28)",
        "Aphid: Acetamiprid / Flonicamid (4A/9C)",
        "Soil: Fipronil GR / Chlorpyrifos दrench — लेबल",
      ],
      iracGroup: "28 / 4A / 9C / 2B",
      activeIngredient: "Chlorantraniliprole",
      dose: "लेबल",
    },
  ],
  diseaseManagement: [
    {
      diseaseName: "Turcicum / Maydis leaf blight",
      pathogen: "Exserohilum turcicum / Bipolaris maydis",
      type: "कवक",
      symptoms: ["सिगार धब्बे", "आयताकार धब्बे"],
      favourableConditions: ["नमी", "बादल"],
      integratedManagement: ["रोटेशन QoI+DMI"],
      biologicalControl: [],
      chemicalControl: [
        "Azoxystrobin + Propiconazole (FRAC 11+3)",
        "Mancozeb (M3)",
        "Tebuconazole (3)",
      ],
      fracGroup: "11+3 / M3 / 3",
      activeIngredient: "Azoxystrobin + Propiconazole",
      dose: "लेबल",
      waitingPeriod: "लेबल",
    },
    {
      diseaseName: "डाउनी मिल्ड्यू / स्टॉक रॉट",
      pathogen: "Peronosclerospora / Fusarium–Pythium–Macrophomina",
      type: "ओomycete / कॉम्प्लेक्स",
      symptoms: ["सफेद डाउनी", "तना खोखला, गिरना"],
      favourableConditions: ["बीज अंकुरण गीला", "दाना भरने पर पानी तनाव"],
      integratedManagement: ["बीज/मिट्टी स्वास्थ्य", "N–K संतुलन"],
      biologicalControl: ["Trichoderma"],
      chemicalControl: [
        "Metalaxyl-M + Mancozeb (डाउनी)",
        "Carbendazim + Mancozeb (स्टॉक सहायक)",
      ],
      fracGroup: "4+M3 / 1+M3",
      activeIngredient: "Metalaxyl-M + Mancozeb",
      dose: "लेबल",
      waitingPeriod: "लेबल",
    },
  ],
  weedManagement: [
    {
      weedName: "प्रारंभिक खरपतवार",
      scientificName: "Echinochloa / Amaranthus / Cyperus",
      type: "मिश्रित",
      criticalPeriod: "0–40 DAS",
      preEmergenceHerbicide: "Atrazine / Pendimethalin — लेबल; Atrazine अवशेष ध्यान",
      postEmergenceHerbicide: "Tembotrione / Topramezone / Halosulfuron / 2,4-D amine — लेबल अवस्था",
      hracGroup: "C1 / K1 / F2 / B / O",
      dose: "Nicosulfuron + OP कीटनाशक न मिलाएँ",
    },
  ],
  tankMixCompatible: [
    "Azoxystrobin + Propiconazole + Mancozeb",
    "Chlorantraniliprole + Azoxystrobin",
    "Tembotrione + Atrazine (जहाँ लेबल)",
  ],
  tankMixIncompatible: [
    "Nicosulfuron + Chlorpyrifos/Dimethoate",
    "कॉपर + Emamectin",
  ],
  resistanceRotation: ["FAW: 28 → 6 → 5", "पर्ण रोग: M3 → 11+3 → 3"],
  faqs: [
    {
      question: "फ्लावरिंग पर पानी छूट जाए तो?",
      answer: "VT/R1 पर तनाव भारी उपज गिरावट — इस अवस्था सिंचाई प्राथमिकता।",
    },
  ],
};
