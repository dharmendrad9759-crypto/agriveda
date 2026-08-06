import type { ResearchDossierOverlay } from "@/types/crop-dossier";

const LEGAL =
  "रासायनिक सिफ़ारिश श्रेणी + उदाहरण AI के रूप में है। डोज़/PHI/फसल-अनुमोदन हमेशा उत्पाद लेबल और स्थानीय कृषि अधिकारी/KVK से तय करें। लेबल अनिवार्य। Ergot-ग्रस्त बालियाँ चारे में न दें (विषैला)। अवैध मिक्स न करें।";

export const bajraDossier: ResearchDossierOverlay = {
  slug: "bajra",
  sourceLabel: "Research dossier — Bajra / Pearl millet (dry belt)",
  legalNote: LEGAL,
  growthStages: [
    {
      title: "अंकुरण / स्थापना",
      period: "0–15 DAS",
      keyPoints: ["मानसून पर बुवाई जून-जुलाई", "downy-mildew-सहन hybrid", "shoot fly early निगरानी"],
    },
    {
      title: "कल्ले फुटाव",
      period: "DAS 15–35",
      keyPoints: ["हल्का N टॉप-ड्रेस", "खरपतवार गुड़ाई", "पौध संख्या"],
    },
    {
      title: "बाली निकलना (ear-head)",
      period: "DAS 35–55",
      keyPoints: ["तनाव हो तो जीवनरक्षक सिंचाई", "downy mildew (green ear)", "Ergot निगरानी"],
    },
    {
      title: "दाना भरना / पकाव",
      period: "DAS 55–80",
      keyPoints: ["grain-filling नमी", "पक्षी क्षति", "समय पर कटाई"],
    },
  ],
  irrigationSchedule: [
    "मुख्यतः वर्षा-आधारित शुष्क-क्षेत्र फसल — बाजरा स्वयं सूखा-सहनशील।",
    "critical: tillering व ear-head/grain-filling।",
    "लंबे शुष्क break पर 1–2 जीवनरक्षक सिंचाई (सिंचित क्षेत्र)।",
    "जलभराव से बचें — हल्की जल-निकास मिट्टी बेहतर।",
  ],
  fertilizerSchedule: [
    "कम-इनपुट फसल: N 20–24, P₂O₅ 12–16 kg/acre (उदाहरण)।",
    "बेसल: DAP + N का हिस्सा।",
    "N शेष कल्ले-फुटाव (DAS 20–25) पर टॉप-ड्रेस।",
    "Zn/Fe जहाँ उच्च-pH मिट्टी पर कमी।",
    "वर्षा-आधारित में डोज़ नमी अनुसार संयमित।",
  ],
  micronutrients: [
    "ZnSO₄ 5 kg/acre बेसल — काली/उच्च-pH मिट्टी में आम कमी।",
    "FeSO₄ 0.5% foliar अगर आयरन-क्लोरोसिस (पीलापन)।",
    "बायोफोर्टिफाइड Fe/Zn किस्में (Dhanashakti आदि) पोषण को।",
  ],
  pestManagement: [
    {
      pestName: "तना मक्खी (shoot fly)",
      scientificName: "Atherigona approximata",
      identification: "अंकुरण-प्रारंभिक अवस्था में केंद्रीय अंकुर मरना (dead-heart)।",
      symptoms: ["dead-heart", "पौध संख्या घटना", "देर बुवाई पर अधिक"],
      etl: "अंकुरण अवस्था; समय पर बुवाई मुख्य बचाव",
      biologicalControl: ["समय पर बुवाई", "उच्च seed rate + thinning"],
      chemicalControl: [
        "Thiamethoxam 30% FS बीज उपचार (IRAC 4A)",
        "Imidacloprid 600 FS बीज उपचार (IRAC 4A)",
      ],
      iracGroup: "4A (बीज उपचार)",
      activeIngredient: "Thiamethoxam बीज उपचार",
      dose: "लेबल",
    },
    {
      pestName: "तना छेदक",
      scientificName: "Chilo partellus",
      identification: "तने में छेद + dead-heart; बाद में बाली क्षति।",
      symptoms: ["dead-heart", "तना छेद", "बाली कमजोर"],
      etl: "10% dead-heart या स्थानीय ETL",
      biologicalControl: ["Trichogramma", "खेत सफ़ाई"],
      chemicalControl: [
        "Chlorantraniliprole 0.4% GR whorl (IRAC 28)",
        "Cartap hydrochloride 4% GR (IRAC 14)",
      ],
      iracGroup: "28 / 14",
      activeIngredient: "Chlorantraniliprole",
      dose: "लेबल; whorl application",
    },
    {
      pestName: "सफ़ेद गिडार (white grub)",
      scientificName: "Holotrichia spp.",
      identification: "जड़ खाना; पौध पीली/मुरझाना पैच में।",
      symptoms: ["जड़ क्षति", "पौध सूखना", "पैच में हानि"],
      etl: "मानसून-आरंभ भृंग उड़ान/पैच निगरानी",
      biologicalControl: ["light trap भृंग", "Metarhizium जहाँ उपलब्ध"],
      chemicalControl: [
        "बीज उपचार Imidacloprid/Chlorpyriphos (IRAC 4A/1B, लेबल)",
        "भूमि उपचार लेबल अनुसार",
      ],
      iracGroup: "4A / 1B (बीज/भूमि)",
      activeIngredient: "बीज उपचार Imidacloprid",
      dose: "लेबल",
    },
  ],
  diseaseManagement: [
    {
      diseaseName: "मृदुरोमिल आसिता (Downy mildew / green ear)",
      pathogen: "Sclerospora graminicola",
      type: "ओomycete",
      symptoms: ["पत्ती नीचे सफ़ेद रोम", "बाली हरी-पत्ती जैसी (green ear)", "बंध्या बाली"],
      favourableConditions: ["नम मौसम", "घना पौध", "संक्रमित बीज/मिट्टी"],
      integratedManagement: [
        "प्रतिरोधी hybrid (HHB-67 Improved) — मुख्य बचाव",
        "बीज उपचार",
        "रोगग्रस्त पौधा हटाएँ",
      ],
      biologicalControl: [],
      chemicalControl: [
        "बीज उपचार Metalaxyl-M 31.8% ES (FRAC 4)",
        "Mancozeb foliar (FRAC M3)",
      ],
      fracGroup: "4 (बीज) / M3",
      activeIngredient: "Metalaxyl-M बीज उपचार",
      dose: "लेबल",
      waitingPeriod: "—",
    },
    {
      diseaseName: "अर्गट (Ergot)",
      pathogen: "Claviceps fusiformis",
      type: "कवक",
      symptoms: ["बाली से गुलाबी-honeydew रिसाव", "काले sclerotia दाने की जगह", "चारे में विषैला"],
      favourableConditions: ["फूल-अवस्था पर नमी/बारिश", "उच्च आर्द्रता"],
      integratedManagement: [
        "स्वच्छ/उपचारित बीज",
        "रोगग्रस्त बालियाँ अलग करें — चारे में न दें",
        "समय-मिलान बुवाई (फूल सूखे में)",
      ],
      biologicalControl: [],
      chemicalControl: [
        "फूल-अवस्था पर Mancozeb/Copper प्रोफाइलैक्टिक (FRAC M3/M1)",
      ],
      fracGroup: "M3 / M1",
      activeIngredient: "Mancozeb (प्रोफाइलैक्टिक)",
      dose: "लेबल; रोकथाम मुख्य",
      waitingPeriod: "लेबल",
    },
    {
      diseaseName: "ब्लास्ट (Pearl millet blast)",
      pathogen: "Magnaporthe grisea",
      type: "कवक",
      symptoms: ["पत्ती पर धूसर-भूरे धब्बे", "पत्ती झुलसन", "उभरता रोग"],
      favourableConditions: ["नम-गर्म", "उच्च आर्द्रता", "घना पौध"],
      integratedManagement: ["प्रतिरोधी hybrid", "संतुलित N", "फसल चक्र"],
      biologicalControl: [],
      chemicalControl: [
        "Tricyclazole 75% WP (FRAC 26)",
        "Azoxystrobin + Difenoconazole (FRAC 11+3)",
      ],
      fracGroup: "26 / 11+3",
      activeIngredient: "Tricyclazole",
      dose: "लेबल",
      waitingPeriod: "लेबल PHI",
    },
    {
      diseaseName: "स्मट (Smut)",
      pathogen: "Moesziomyces penicillariae",
      type: "कवक",
      symptoms: ["दाने की जगह हरे-काले smut sori", "बाली में बिखरे दाने"],
      favourableConditions: ["फूल पर नमी", "संक्रमित बीज"],
      integratedManagement: ["स्वस्थ बीज", "बीज उपचार", "प्रतिरोधी hybrid"],
      biologicalControl: [],
      chemicalControl: ["बीज उपचार Carboxin + Thiram (FRAC 7+M3)"],
      fracGroup: "7+M3 (बीज)",
      activeIngredient: "Carboxin + Thiram बीज उपचार",
      dose: "लेबल",
      waitingPeriod: "—",
    },
  ],
  weedManagement: [
    {
      weedName: "घास + चौड़ी पत्ती मिश्रित",
      scientificName: "Echinochloa / Digitaria / Amaranthus / Commelina",
      type: "मिश्रित",
      criticalPeriod: "DAS 15–35",
      preEmergenceHerbicide: "Atrazine 50% WP ~200 g/acre (millet-लेबल, PRE) — HRAC C1 (सावधानी)",
      postEmergenceHerbicide: "हाथ निराई/इंटरकल्चर 20–30 दिन (POST विकल्प सीमित)",
      hracGroup: "C1 / यांत्रिक",
      dose: "लेबल; रेतीली मिट्टी में Atrazine सावधानी + intercrop ध्यान",
    },
  ],
  weedProgram: {
    keyWeeds: ["Echinochloa", "Digitaria", "Amaranthus", "Commelina"],
    criticalPeriod: "DAS 15–35",
    prevention: ["उचित पौध संख्या", "साफ़ बीज"],
    monitoring: ["अंकुरण-कल्ले अवस्था"],
    cultural: ["इंटरकल्चर/डोरा 20–30 DAS", "थिनिंग"],
    chemical: [
      {
        technical: "Atrazine 50% WP",
        dose: "~200 g/acre",
        timing: "PRE (0–3 DAS नम मिट्टी)",
        targets: "घास + छोटे बीज BLF",
        note: "millet-लेबल; दलहन-इंटरक्रॉप/अगली फसल carryover ध्यान",
      },
    ],
  },
  tankMixCompatible: [
    "Mancozeb + Tricyclazole — blast + पत्ती रोग",
    "बीज उपचार Metalaxyl + Imidacloprid — downy + shoot fly (लेबल)",
  ],
  tankMixIncompatible: [
    "Atrazine + अन्य herbicide अंधाधुंध — फाइटो/carryover",
    "सल्फर + तेल EC — फाइटो बर्न",
    "दो नियोनीक (4A) एक साथ — प्रतिरोध",
  ],
  resistanceRotation: [
    "तना छेदक: IRAC 28 → 14 → 28",
    "पत्ती/blast: FRAC 26 → 11+3 → 26",
  ],
  faqs: [
    {
      question: "बाली हरी-पत्ती जैसी (green ear/downy)?",
      answer:
        "मृदुरोमिल आसिता है — प्रतिरोधी hybrid (HHB-67 Improved) + बीज उपचार लगाएँ, रोगग्रस्त पौधे हटाएँ।",
    },
    {
      question: "जल्दी पकने वाली किस्म कौन?",
      answer: "HHB-67 Improved (जल्दी + downy-सहन) शुष्क बेल्ट को उपयुक्त।",
    },
    {
      question: "बाली से गुलाबी रिसाव/काले दाने (Ergot)?",
      answer: "अर्गट है — रोगग्रस्त बालियाँ अलग करें, चारे में न दें (विषैला), स्वच्छ बीज लें।",
    },
    {
      question: "पानी कब ज़रूरी?",
      answer: "बाजरा सूखा-सहन है; केवल कल्ले व दाना-भराव पर तनाव में जीवनरक्षक सिंचाई।",
    },
  ],
  physiologicalDisorders: [
    "आयरन-क्लोरोसिस — उच्च-pH मिट्टी पर पीलापन (FeSO₄ foliar)",
    "पक्षी क्षति — दाना-पकाव पर scaring",
  ],
};
