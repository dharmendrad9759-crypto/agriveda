import type { ResearchDossierOverlay } from "@/types/crop-dossier";

const LEGAL =
  "लेबल अनिवार्य। BPH पर बार–बार अकेला IRAC 4A न लगाएँ। 2,4-D PI/हेडिंग पर न डालें। वायरस (टंग्रो) की दवा नहीं — वेक्टर नियंत्रण।";

export const paddyDossier: ResearchDossierOverlay = {
  slug: "paddy",
  sourceLabel: "Research dossier Vol.1 — Paddy",
  legalNote: LEGAL,
  growthStages: [
    { title: "नर्सरी / रोपाई", period: "0–7 DAT", keyPoints: ["पडलिंग", "स्थापना पानी"] },
    { title: "कल्ले फुटाव", period: "DAT 15–40", keyPoints: ["N विभाजन", "Zn/खैरा", "पानी गहराई"] },
    { title: "PI / फूल", period: "DAT 45–75", keyPoints: ["पानी critical", "Blast/BLB/Sheath"] },
    { title: "दाना भरना / कटाई", period: "DAT 75–130", keyPoints: ["AWD संभव", "कटाई से पहले सुखाना"] },
  ],
  irrigationSchedule: [
    "रोपाई 0–7 DAT: ~5 cm पानी।",
    "कल्ले: रुक–रुक बाढ़ / AWD।",
    "PI + फूल: लगातार बाढ़ — न सूखे।",
    "दाना भरना: रुक–रुक; कटाई 7–10 दिन पहले सुखाएँ।",
  ],
  fertilizerSchedule: [
    "N 40–50 / P₂O₅ 20–25 / K₂O 20–25 kg/acre (उदाहरण)।",
    "P पूरा बेसल; N: बेसल + DAT 15–20 + PI; K आधा बेसल आधा PI।",
  ],
  micronutrients: [
    "ZnSO₄ 5 kg बेसल / 0.5% foliar — खैरा।",
    "S, B हेडिंग, Fe जरूरत पर।",
  ],
  pgrNotes: [
    "बढ़वार टॉनिक कल्लों का जादू नहीं — किस्म + N समय + Zn + पानी मुख्य। GA₃ केवल विशेष स्थिति/लेबल।",
  ],
  pestManagement: [
    {
      pestName: "तना छेदक (YSB)",
      scientificName: "Scirpophaga incertulas",
      identification: "डेडहार्ट / सफेद बाली।",
      symptoms: ["डेडहार्ट", "व्हाइट ईयर"],
      etl: "5% डेडहार्ट (veg) / 2% व्हाइट ईयर",
      biologicalControl: ["ट्राइकोग्रामा जहाँ उपलब्ध"],
      chemicalControl: [
        "Chlorantraniliprole 18.5% SC (IRAC 28)",
        "Cartap 4% GR / Fipronil GR (IRAC 14/2B)",
      ],
      iracGroup: "28 → 14 → 28",
      activeIngredient: "Chlorantraniliprole",
      dose: "लेबल",
    },
    {
      pestName: "भूरा फुदका (BPH)",
      scientificName: "Nilaparvata lugens",
      identification: "पौध आधार पर फुदके; हॉपरबर्न गोलाकार सूखा।",
      symptoms: ["हॉपरबर्न", "वायरस ट्रांसमिशन"],
      etl: "10/पहाड़ी शुरुआती; PI पर 5/पहाड़ी",
      biologicalControl: ["अनावश्यक पाइरेथ्रॉइड कम करें — पुनरुत्थान"],
      chemicalControl: [
        "Pymetrozine (IRAC 9B)",
        "Buprofezin (IRAC 16)",
        "Triflumezopyrim (IRAC 4C) जहाँ लेबल",
      ],
      iracGroup: "9B / 16 / 4C — 4A अकेला बार–बार नहीं",
      activeIngredient: "Pymetrozine",
      dose: "लेबल",
    },
    {
      pestName: "पत्ती मोड़क / गॉल मिड्ज / GLH",
      scientificName: "Cnaphalocrocis / Orseolia / Nephotettix",
      identification: "मुड़ी पत्ती; सिल्वर शूट; हरा लीफहॉपर।",
      symptoms: ["सफेद धारियाँ", "गॉल शूट", "टंग्रो वेक्टर"],
      etl: "सापेक्ष ETL / टंग्रो क्षेत्र में GLH कम सहन",
      biologicalControl: [],
      chemicalControl: [
        "Leaf folder: Chlorantraniliprole / Emamectin (28/6)",
        "GLH: Thiamethoxam / Buprofezin — लेबल",
      ],
      iracGroup: "28 / 6 / 4A / 16",
      activeIngredient: "Chlorantraniliprole",
      dose: "लेबल",
    },
  ],
  diseaseManagement: [
    {
      diseaseName: "ब्लास्ट",
      pathogen: "Magnaporthe oryzae",
      type: "कवक",
      symptoms: ["डायमंड धब्बे", "नेक ब्लास्ट — बाली टूटना"],
      favourableConditions: ["ठंडी रात", "अधिक N", "घना रोपण"],
      integratedManagement: ["बीज Tricyclazole", "नेक नोड पर स्प्रे विंडो"],
      biologicalControl: [],
      chemicalControl: [
        "Tricyclazole (FRAC 26)",
        "Azoxystrobin + Tebuconazole (11+3)",
        "Isoprothiolane (32)",
      ],
      fracGroup: "26 / 11+3 / 32",
      activeIngredient: "Tricyclazole",
      dose: "लेबल",
      waitingPeriod: "लेबल",
    },
    {
      diseaseName: "बैक्टीरियल लीफ ब्लाइट / शीथ ब्लाइट / फॉल्स स्मट",
      pathogen: "Xanthomonas / Rhizoctonia / Ustilaginoidea",
      type: "जीवाणु / कवक",
      symptoms: ["पीली पत्ती धार", "शीथ घाव", "नारंगी स्मट बॉल"],
      favourableConditions: ["नमी", "अधिक N"],
      integratedManagement: ["कॉपर BLB", "Validamycin/Hexaconazole शीथ", "फॉल्स स्मट boot पर स्प्रे"],
      biologicalControl: [],
      chemicalControl: [
        "Copper hydroxide / Kasugamycin (BLB)",
        "Hexaconazole / Propiconazole / Validamycin (शीथ)",
        "Propiconazole / Tebuconazole (false smut)",
      ],
      fracGroup: "M1 / 3 / 24",
      activeIngredient: "Hexaconazole (शीथ उदाहरण)",
      dose: "लेबल",
      waitingPeriod: "लेबल",
    },
    {
      diseaseName: "चावल टंग्रो",
      pathogen: "RTBV + RTSV",
      type: "वायरस",
      symptoms: ["पीला–नारंगी", "बौना", "कम कल्ले"],
      favourableConditions: ["GLH दबाव"],
      integratedManagement: ["इलाज नहीं — GLH नियंत्रण", "प्रतिरोधी किस्म"],
      biologicalControl: [],
      chemicalControl: ["वेक्टर: Thiamethoxam / Buprofezin — लेबल"],
      fracGroup: "—",
      activeIngredient: "वेक्टर नियंत्रण",
      dose: "लेबल",
      waitingPeriod: "लेबल",
    },
  ],
  weedManagement: [
    {
      weedName: "बरनयार्ड / सायपरस / चौड़ी पत्ती",
      scientificName: "Echinochloa / Cyperus / Monochoria",
      type: "मिश्रित",
      criticalPeriod: "0–40 DAT",
      preEmergenceHerbicide: "Pretilachlor / Butachlor / Oxadiargyl — लेबल",
      postEmergenceHerbicide: "Bispyribac-Na / Fenoxaprop / Ethoxysulfuron / 2,4-D (केवल सही अवस्था)",
      hracGroup: "K3 / B / A / O",
      dose: "2,4-D कभी PI/हेडिंग पर नहीं",
    },
  ],
  tankMixCompatible: [
    "Chlorantraniliprole + Thiamethoxam (प्रेमिक्स उपलब्ध)",
    "Propiconazole + Validamycin",
  ],
  tankMixIncompatible: [
    "कॉपर + Emamectin",
    "सल्फर + तेल EC",
    "Buprofezin + Chlorpyrifos antagonism (BPH)",
    "दो IRAC 4A एक साथ",
  ],
  resistanceRotation: [
    "YSB: 28 → 14 → 28",
    "BPH: 9B → 16 → 4C",
    "Blast: 26 → 11+3 → 32",
  ],
  faqs: [
    {
      question: "कल्ले कैसे बढ़ें?",
      answer:
        "किस्म + सही N समय (tillering) + Zn + पानी गहराई। बढ़वार टॉनिक जादू नहीं।",
    },
  ],
};
