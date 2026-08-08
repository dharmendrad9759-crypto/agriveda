/**
 * Guided prep journeys — finish prep on Agraveda, open gov form only at the end.
 */

export type SchemeGuideStep = {
  id: string;
  titleHi: string;
  bodyHi: string;
};

export type SchemeGuideDoc = {
  id: string;
  labelHi: string;
  required: boolean;
};

export type SchemeGuideQuiz = {
  id: string;
  questionHi: string;
  /** Answer that means "likely eligible path" */
  yesMeansOk: boolean;
  failHintHi?: string;
};

export type SchemeGuide = {
  id: string;
  nameHi: string;
  taglineHi: string;
  portal: string;
  portalLabelHi: string;
  branchNoteHi?: string;
  steps: SchemeGuideStep[];
  quiz: SchemeGuideQuiz[];
  docs: SchemeGuideDoc[];
  /** Soft-gate message when quiz answers suggest they may not qualify online */
  softFailHi: string;
  showKccCalculator?: boolean;
  showMachineryCalculator?: boolean;
};

export const SCHEME_GUIDE_IDS = [
  "kcc",
  "pm-kisan",
  "pmfby",
  "smam",
  "soil-health",
] as const;

export type SchemeGuideId = (typeof SCHEME_GUIDE_IDS)[number];

export const GOV_PORTAL_SLOW_NOTE_HI =
  "नोट: सरकारी वेबसाइट कभी-कभी खुलने में समय ले सकती है।";

export const SCHEME_SOFT_FAIL_HI =
  "हो सकता है आप ऑनलाइन आवेदन के लिए पात्र न हों, कृपया सटीक जानकारी के लिए अपनी नज़दीकी बैंक शाखा या CSC सेंटर से संपर्क करें।";

const softFail = SCHEME_SOFT_FAIL_HI;

export const schemeGuides: Record<SchemeGuideId, SchemeGuide> = {
  kcc: {
    id: "kcc",
    nameHi: "किसान क्रेडिट कार्ड (KCC)",
    taglineHi: "बीज-खाद-मजदूरी के लिए घूमता सस्ता कर्ज — पहले तैयारी, फिर बैंक/पोर्टल",
    portal: "https://www.jansamarth.in",
    portalLabelHi: "JanSamarth पर KCC आवेदन खोलें",
    branchNoteHi: "या नजदीकी बैंक / CSC में फॉर्म भरवाएँ — PM-KISAN लाभार्थी अक्सर आसान रास्ता पाते हैं।",
    showKccCalculator: true,
    softFailHi: softFail,
    steps: [
      {
        id: "benefit",
        titleHi: "समय पर चुकाएँ — प्रभावी ब्याज ~4%",
        bodyHi:
          "MISS / RBI: अल्पकालिक KCC पर अक्सर ~7%; समय पर चुकाने पर ~3% प्रोत्साहन से प्रभावी दर ~4% तक (सीमा ~₹3 लाख/वर्ष)। पक्की शर्त शाखा से।",
      },
      {
        id: "what",
        titleHi: "KCC क्या है?",
        bodyHi:
          "फसल खर्च का revolving कर्ज। RBI सूत्र: SoF×क्षेत्र + 10% कटाई/घरेलू + 20% मरम्मत/सेवाएँ (+ बीमा)। अगले कदम में अनुमान लगाएँ।",
      },
      {
        id: "eligible",
        titleHi: "मेरे लिए?",
        bodyHi: "कुछ आसान सवाल — गलत जवाब पर हम रोक नहीं लगाते, सिर्फ शाखा/CSC सलाह दिखाते हैं।",
      },
      {
        id: "docs",
        titleHi: "कागज़ तैयार?",
        bodyHi: "जो तैयार हैं टिक करें। अधूरा हो तो भी शाखा जा सकते हैं — टिक आपके याद रखने के लिए।",
      },
      {
        id: "calc",
        titleHi: "लिमिट कैलकुलेटर",
        bodyHi:
          "एकड़ + फसल। RBI शैली: SoF + 10% + 20%。 SoF जिले की DLTC तय करेगी — यहाँ सिर्फ तैयारी।",
      },
      {
        id: "go",
        titleHi: "अब सरकारी फॉर्म",
        bodyHi: "तैयारी पूरी हो तो JanSamarth / बैंक पर आवेदन खोलें।",
      },
    ],
    quiz: [
      {
        id: "land",
        questionHi: "क्या आपके पास खतौनी / भूमि दस्तावेज या किराये की लिखित पुष्टि है?",
        yesMeansOk: true,
      },
      {
        id: "aadhaar",
        questionHi: "आधार और बैंक खाता (आधार-लिंक बेहतर) मौजूद है?",
        yesMeansOk: true,
      },
      {
        id: "pmkisan",
        questionHi: "क्या आप PM-KISAN लाभार्थी हैं? (हाँ = अक्सर आसान रास्ता)",
        yesMeansOk: true,
        failHintHi: "नहीं होना बाधा नहीं — सामान्य KCC फॉर्म भी चलता है।",
      },
    ],
    docs: [
      { id: "aadhaar", labelHi: "आधार कार्ड", required: true },
      { id: "land", labelHi: "खतौनी / भूमि दस्तावेज", required: true },
      { id: "photo", labelHi: "पासपोर्ट साइज फोटो", required: true },
      { id: "passbook", labelHi: "बैंक पासबुक / खाता विवरण", required: true },
      { id: "mobile", labelHi: "मोबाइल नंबर (OTP के लिए)", required: true },
      { id: "crop", labelHi: "बोई फसल / क्षेत्र का संक्षिप्त नोट", required: false },
    ],
  },
  "pm-kisan": {
    id: "pm-kisan",
    nameHi: "पीएम-किसान",
    taglineHi: "आय सहायता DBT — पंजीकरण/e-KYC और सुधार यहीं तैयार करें",
    portal: "https://pmkisan.gov.in",
    portalLabelHi: "PM-KISAN पोर्टल खोलें",
    softFailHi: softFail,
    steps: [
      {
        id: "what",
        titleHi: "योजना क्या है?",
        bodyHi:
          "पात्र भूमिधारक किसानों को वर्ष में किस्तों में बैंक खाते में सहायता। वर्तमान किस्त राशि हमेशा पोर्टल पर देखें।",
      },
      {
        id: "eligible",
        titleHi: "मेरे लिए?",
        bodyHi: "परिवार/भूमि की परिभाषा पोर्टल पर पक्की है — यहाँ सिर्फ तैयारी।",
      },
      {
        id: "docs",
        titleHi: "कागज़ तैयार?",
        bodyHi: "e-KYC और नाम/खाता मिलान सबसे आम अड़चन है।",
      },
      {
        id: "go",
        titleHi: "अब सरकारी पोर्टल",
        bodyHi: "नया पंजीकरण, सुधार या स्थिति जाँच — pmkisan.gov.in पर।",
      },
    ],
    quiz: [
      {
        id: "landowner",
        questionHi: "क्या आप भूमिधारक किसान हैं (खतौनी आपके/पारिवारिक नाम पर)?",
        yesMeansOk: true,
      },
      {
        id: "aadhaar_bank",
        questionHi: "आधार और बैंक खाता एक ही नाम पर / लिंक हैं?",
        yesMeansOk: true,
      },
    ],
    docs: [
      { id: "aadhaar", labelHi: "आधार", required: true },
      { id: "passbook", labelHi: "बैंक पासबुक", required: true },
      { id: "land", labelHi: "खतौनी / भूमि रिकॉर्ड", required: true },
      { id: "mobile", labelHi: "मोबाइल (e-KYC)", required: true },
    ],
  },
  pmfby: {
    id: "pmfby",
    nameHi: "फसल बीमा (PMFBY)",
    taglineHi: "अधिसूचित फसल का बीमा — कट-ऑफ से पहले तैयार रहें",
    portal: "https://pmfby.gov.in",
    portalLabelHi: "PMFBY पोर्टल खोलें",
    branchNoteHi: "ऋणी किसान: बैंक अक्सर KCC से जोड़ देता है — पासबुक/पर्ची जाँचें।",
    softFailHi: softFail,
    steps: [
      {
        id: "what",
        titleHi: "बीमा क्या कवर करता है?",
        bodyHi:
          "अधिसूचित फसल-मौसम पर प्राकृतिक जोखिम। प्रीमियम फसल/क्षेत्र अनुसार अलग — पोर्टल या बैंक से पूछें।",
      },
      {
        id: "eligible",
        titleHi: "मेरे जिले में?",
        bodyHi: "पहले पुष्टि: फसल अधिसूचित है या नहीं। नहीं तो ऑनलाइन आगे मत बढ़ें।",
      },
      {
        id: "docs",
        titleHi: "कागज़ / जानकारी",
        bodyHi: "जोत, फसल, बैंक विवरण तैयार रखें। कट-ऑफ सख्त होती है।",
      },
      {
        id: "go",
        titleHi: "अब पोर्टल / बैंक",
        bodyHi: "pmfby.gov.in, CSC या अपनी बैंक शाखा।",
      },
    ],
    quiz: [
      {
        id: "notified",
        questionHi: "क्या आपकी फसल इस मौसम में जिले में अधिसूचित है? (पता हो तो हाँ)",
        yesMeansOk: true,
      },
      {
        id: "sowing",
        questionHi: "क्या बुवाई/नामांकन की कट-ऑफ अभी बाकी है?",
        yesMeansOk: true,
      },
    ],
    docs: [
      { id: "aadhaar", labelHi: "आधार", required: true },
      { id: "passbook", labelHi: "बैंक खाता", required: true },
      { id: "land", labelHi: "खतौनी / जोत विवरण", required: true },
      { id: "crop", labelHi: "फसल व क्षेत्र जानकारी", required: true },
    ],
  },
  smam: {
    id: "smam",
    nameHi: "कृषि यंत्रीकरण (SMAM)",
    taglineHi: "रोटावेटर/ड्रिल आदि — पहले अनुमोदित सूची, फिर राज्य/राष्ट्रीय पोर्टल",
    portal: "https://agrimachinery.nic.in",
    portalLabelHi: "राष्ट्रीय यंत्र पोर्टल खोलें",
    branchNoteHi: "अपने राज्य का कृषि यंत्र पोर्टल / जिला कार्यालय से टोकन विंडो पूछें।",
    softFailHi: softFail,
    showMachineryCalculator: true,
    steps: [
      {
        id: "what",
        titleHi: "सब्सिडी कैसे मिलती है?",
        bodyHi:
          "पात्र यंत्र पर केंद्रीय-राज्य सहयोग। ट्रैक्टर अक्सर लॉटरी। सटीक % अधिसूचना से — आगे अनुमान बैंड देख सकते हैं।",
      },
      {
        id: "eligible",
        titleHi: "मेरे लिए?",
        bodyHi: "छोटे किसान: पहले इम्प्लीमेंट या CHC किराया सोचें।",
      },
      {
        id: "calc",
        titleHi: "अनुदान % व सीलिंग अनुमान",
        bodyHi:
          "SMAM शैली ~40–50% + अधिकतम सीमा (ceiling) — दोनों में जो कम हो। नियम राज्य अनुसार अलग; पोर्टल सूची पक्का करें। ट्रैक्टर पर लॉटरी हो सकती है।",
      },
      {
        id: "docs",
        titleHi: "कागज़",
        bodyHi: "कोटेशन अक्सर अनुमोदित डीलर से ही मान्य।",
      },
      {
        id: "go",
        titleHi: "अब पोर्टल",
        bodyHi: "राष्ट्रीय पोर्टल या अपने राज्य का यंत्र पोर्टल।",
      },
    ],
    quiz: [
      {
        id: "implement",
        questionHi: "क्या आप ट्रैक्टर के बजाय रोटावेटर/ड्रिल जैसे यंत्र पर सोच रहे हैं?",
        yesMeansOk: true,
        failHintHi: "ट्रैक्टर सब्सिडी सीमित हो सकती है — जिला कार्यालय से पूछें।",
      },
      {
        id: "land",
        questionHi: "खतौनी और बैंक खाता तैयार है?",
        yesMeansOk: true,
      },
    ],
    docs: [
      { id: "aadhaar", labelHi: "आधार", required: true },
      { id: "land", labelHi: "खतौनी", required: true },
      { id: "passbook", labelHi: "बैंक खाता", required: true },
      { id: "photo", labelHi: "पासपोर्ट फोटो", required: true },
      { id: "quote", labelHi: "अनुमोदित डीलर कोटेशन (जब माँगा)", required: false },
    ],
  },
  "soil-health": {
    id: "soil-health",
    nameHi: "मृदा स्वास्थ्य कार्ड",
    taglineHi: "मिट्टी जाँच — सही नमूना = सही खाद सलाह",
    portal: "https://www.soilhealth.dac.gov.in",
    portalLabelHi: "Soil Health पोर्टल खोलें",
    branchNoteHi: "नमूना KVK / कृषि विभाग प्रयोगशाला में जमा करें।",
    softFailHi: softFail,
    steps: [
      {
        id: "what",
        titleHi: "कार्ड क्यों?",
        bodyHi: "मिट्टी रिपोर्ट से NPK/सूक्ष्म की अनुमानित कमी समझ आती है — अनावश्यक यूरिया बचाएँ।",
      },
      {
        id: "eligible",
        titleHi: "कौन ले सकता है?",
        bodyHi: "लगभग सभी किसान। खेत कमजोर/पीला हो तो प्राथमिकता दें।",
      },
      {
        id: "docs",
        titleHi: "क्या लेकर जाएँ",
        bodyHi: "नमूना विधि सीखें — गलत गहराई = गलत रिपोर्ट।",
      },
      {
        id: "go",
        titleHi: "पोर्टल / प्रयोगशाला",
        bodyHi: "ट्रैक पोर्टल पर; जमा KVK या विभाग लैब में।",
      },
    ],
    quiz: [
      {
        id: "sample",
        questionHi: "क्या आप 8–10 जगह से मिलाकर नमूना ले सकते हैं?",
        yesMeansOk: true,
      },
    ],
    docs: [
      { id: "id", labelHi: "आधार / पहचान", required: true },
      { id: "field", labelHi: "सर्वे नंबर / खेत स्थान", required: true },
    ],
  },
};

export function getSchemeGuide(id: string): SchemeGuide | undefined {
  if ((SCHEME_GUIDE_IDS as readonly string[]).includes(id)) {
    return schemeGuides[id as SchemeGuideId];
  }
  return undefined;
}

export function buildSchemePrepWhatsAppText(opts: {
  guide: SchemeGuide;
  checkedLabels: string[];
  estimateLine?: string;
}): string {
  const g = opts.guide;
  const lines = [
    `Agriveda — ${g.nameHi} तैयारी`,
    "",
    g.taglineHi,
    "",
    "कागज़:",
    ...(opts.checkedLabels.length
      ? opts.checkedLabels.map((l) => `✓ ${l}`)
      : ["(अभी कोई टिक नहीं)"]),
  ];
  if (opts.estimateLine) {
    lines.push("", opts.estimateLine);
  }
  lines.push(
    "",
    `पोर्टल: ${g.portal}`,
    GOV_PORTAL_SLOW_NOTE_HI,
    "",
    "— Agriveda ऐप"
  );
  return lines.join("\n");
}
