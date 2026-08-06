import type { ResearchDossierOverlay } from "@/types/crop-dossier";

const LEGAL =
  "खाद/दवा लेबल अनिवार्य। मूंगफली में Gypsum pegging (DAS 35–40) गैर-परक्राम्य — खाली फली (pops) रोकथाम। अतिरिक्त N नोड्यूलेशन दबाता है।";

export const moongfaliDossier: ResearchDossierOverlay = {
  slug: "moongfali",
  sourceLabel: "Research dossier Vol.2 — Groundnut",
  legalNote: LEGAL,
  growthStages: [
    { title: "अंकुरण", period: "DAS 5–10", keyPoints: ["80%+ अंकुरण", "Rhizobium + Trichoderma बीज"] },
    { title: "वानस्पतिक / फूल", period: "DAS 10–40", keyPoints: ["शाखा", "पीले फूल"] },
    { title: "पेगिंग (सबसे जरूरी)", period: "DAS 35–55", keyPoints: ["पेग मिट्टी में", "Gypsum डालें", "नमी"] },
    { title: "फली भरना / पकना", period: "DAS 55–130", keyPoints: ["तेल जमाव", "कटाई नमी घटाएँ"] },
  ],
  irrigationSchedule: [
    "बीजाई पर खेत क्षमता नमी।",
    "फूल DAS 25–40: हर 7–8 दिन।",
    "पेगिंग DAS 35–55: हर 6–7 दिन — नमी पेग प्रवेश के लिए।",
    "फली भरना DAS 55–90: हर 7–8 दिन; कमी = खाली छिलका।",
    "पकने से पहले पानी घटाएँ — छिलका सख्त।",
  ],
  fertilizerSchedule: [
    "N बहुत कम (8–10 kg) — Rhizobium मुख्य N; ज्यादा N नोड्यूलेशन दबाए।",
    "P₂O₅ 20–25 kg पूरा बेसल (SSP/DAP)।",
    "K₂O 15–20 kg — आधा बेसल, आधा पेगिंग।",
  ],
  micronutrients: [
    "Gypsum 80–100 kg/acre DAS 35–40 पेग क्षेत्र पर — कैल्शियम फली में जाता है।",
    "ZnSO₄ 5 kg बेसल; Boron 0.2% foliar DAS 30+50।",
    "Mo नोड्यूलेशन के लिए; Fe क्लोरोसिस पर chelate foliar।",
  ],
  pgrNotes: [
    "Bradyrhizobium सीड ट्रीटमेंट जरूरी।",
    "PSB बेसल; Seaweed DAS 25+45; NAA pegging पर केवल लेबल।",
  ],
  pestManagement: [
    {
      pestName: "पत्ता खाने वाले / चूसक (सामान्य)",
      scientificName: "Helicoverpa / Spodoptera / थ्रिप्स / लीफ माइनर (क्षेत्रानुसार)",
      identification: "फसल और मौसम अनुसार स्काउट।",
      symptoms: ["पत्ती/फली नुकसान"],
      etl: "स्थानीय KVK/लेबल ETL",
      biologicalControl: ["NPV जहाँ उपलब्ध", "नीम"],
      chemicalControl: [
        "Chlorantraniliprole / Emamectin — फल छेदक वर्ग (IRAC 28/6)",
        "चूसकों पर Flonicamid / Spinosad — लेबल",
      ],
      iracGroup: "28 / 6 / 5 / 9C",
      activeIngredient: "Chlorantraniliprole (उदाहरण)",
      dose: "लेबल",
    },
  ],
  diseaseManagement: [
    {
      diseaseName: "टिक्का (Early/Late leaf spot)",
      pathogen: "Cercospora arachidicola / Phaeoisariopsis personata",
      type: "कवक",
      symptoms: ["Early: पीले हेलो वाले धब्बे", "Late: गहरे धब्बे, भारी पत्ती झड़ना"],
      favourableConditions: ["RH >80%", "25–30°C", "बारिश"],
      integratedManagement: ["DAS 30 से Mancozeb/S सुरक्षा", "हवा संचार"],
      biologicalControl: [],
      chemicalControl: [
        "Tebuconazole / Propiconazole (FRAC 3)",
        "Azoxystrobin + Difenoconazole (FRAC 11+3)",
        "Mancozeb संपर्क (M3)",
      ],
      fracGroup: "3 / 11+3 / M3",
      activeIngredient: "Tebuconazole",
      dose: "लेबल",
      waitingPeriod: "लेबल PHI",
    },
  ],
  weedManagement: [
    {
      weedName: "प्रारंभिक खरपतवार",
      scientificName: "Echinochloa / Digitaria / Cyperus",
      type: "मिश्रित",
      criticalPeriod: "बीज बोने के पहले 4–5 सप्ताह",
      preEmergenceHerbicide: "Pendimethalin आदि — लेबल/फसल पंजीकरण जाँचें",
      postEmergenceHerbicide: "चयनित घासनाशक — लेबल",
      hracGroup: "K1 / A",
      dose: "लेबल",
    },
  ],
  tankMixCompatible: ["Tebuconazole + Mancozeb (टिक्का कार्यक्रम) — जार/लेबल"],
  tankMixIncompatible: ["कॉपर + Avermectin वर्ग — सामान्य रूप से बचें"],
  resistanceRotation: ["टिक्का: M3 → FRAC 3 → FRAC 11+3 → M3"],
  faqs: [
    {
      question: "खाली फली (pops) क्यों?",
      answer: "अक्सर pegging पर Gypsum/कैल्शियम और नमी की कमी। DAS 35–40 पर Gypsum डालें।",
    },
  ],
};
