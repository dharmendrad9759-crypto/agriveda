/**
 * Farmer schemes / KCC / mechanization — from Phase-1 research.
 * No subsidy % invented; always verify on official portals.
 */

export type SchemeEvidence = "High" | "Medium" | "Low";

export type FarmerScheme = {
  id: string;
  nameHi: string;
  nameEn: string;
  category: "income" | "insurance" | "irrigation" | "mechanization" | "credit" | "soil" | "market" | "energy" | "state";
  purposeHi: string;
  benefitHi: string;
  applyHi: string;
  portal?: string;
  evidence: SchemeEvidence;
  verifyNoteHi: string;
};

export const SCHEMES_LEGAL_NOTE_HI =
  "दर/पात्रता/अंतिम तिथि बदलती रहती है। ऐप केवल योजना का नाम और रास्ता बताता है — जिला कृषि कार्यालय / आधिकारिक पोर्टल पर पक्की जानकारी लें। कोई सब्सिडी प्रतिशत यहाँ फिक्स नहीं।";

export const farmerSchemes: FarmerScheme[] = [
  {
    id: "pm-kisan",
    nameHi: "पीएम-किसान (PM-KISAN)",
    nameEn: "PM-KISAN",
    category: "income",
    purposeHi: "छोटे/सीमांत किसानों को आय सहायता",
    benefitHi: "साल में तीन किस्तों में आय सहायता (DBT)। वर्तमान किस्त राशि पोर्टल पर verify करें।",
    applyHi: "pmkisan.gov.in · CSC · लेखपाल/कृषि विभाग · e-KYC जरूरी",
    portal: "https://pmkisan.gov.in",
    evidence: "High",
    verifyNoteHi: "किस्त राशि और पात्रता पोर्टल पर देखें।",
  },
  {
    id: "pmfby",
    nameHi: "फसल बीमा (PMFBY)",
    nameEn: "PMFBY",
    category: "insurance",
    purposeHi: "प्राकृतिक आपदा से फसल नुकसान का बीमा",
    benefitHi: "अधिसूचित फसल पर बीमा। किसान प्रीमियम फसल/मौसम अनुसार (पोर्टल/बैंक)।",
    applyHi: "बैंक / CSC / बीमा कंपनी / pmfby.gov.in — कट-ऑफ तिथि सख्त",
    portal: "https://pmfby.gov.in",
    evidence: "High",
    verifyNoteHi: "जिले की अधिसूचित फसल और कट-ऑफ देखें।",
  },
  {
    id: "pmksy",
    nameHi: "पीएमकेएसवाई — सूक्ष्म सिंचाई",
    nameEn: "PMKSY (Per Drop More Crop)",
    category: "irrigation",
    purposeHi: "ड्रिप/स्प्रिंकलर सूक्ष्म सिंचाई",
    benefitHi: "सूक्ष्म सिंचाई उपकरण पर सब्सिडी (वर्ग/राज्य अनुसार दर अलग — verify)",
    applyHi: "उद्यान/कृषि विभाग · राज्य PMKSY/उद्यान पोर्टल",
    evidence: "High",
    verifyNoteHi: "SC/ST/छोटे किसान स्लैब पोर्टल पर देखें — % यहाँ नहीं।",
  },
  {
    id: "smam",
    nameHi: "कृषि यंत्रीकरण (SMAM / राज्य यंत्र)",
    nameEn: "SMAM / Farm mechanization",
    category: "mechanization",
    purposeHi: "ट्रैक्टर/इम्प्लीमेंट्स/कस्टम हायरिंग",
    benefitHi:
      "रोटावेटर, कल्टीवेटर, सीड ड्रिल, थ्रेशर, हैप्पी/सुपर सीडर आदि पर सब्सिडी अक्सर यंत्र पोर्टल से। ट्रैक्टर व्यक्तिगत सब्सिडी सीमित/लॉटरी हो सकती है।",
    applyHi: "UP: कृषि विभाग यंत्र/टोकन पोर्टल → DBT → बिल। CHC/यंत्र बैंक से किराया भी विकल्प।",
    evidence: "High",
    verifyNoteHi: "दर/स्लैब समय-समय पर बदलते हैं — पोर्टल/जिला कार्यालय।",
  },
  {
    id: "kcc",
    nameHi: "किसान क्रेडिट कार्ड (KCC)",
    nameEn: "Kisan Credit Card",
    category: "credit",
    purposeHi: "बीज-खाद-दवा-मजदूरी के लिए सस्ता कार्यशील ऋण",
    benefitHi:
      "घूमता (revolving) ऋण। समय पर चुकाने पर ब्याज छूट। पशुपालन/मत्स्य KCC भी संभव। वर्तमान ब्याज दर बैंक अधिसूचना से verify।",
    applyHi: "किसी भी बैंक/सहकारी/CSC। लेकर जाएँ: आधार, खतौनी, फोटो, बैंक खाता।",
    evidence: "High",
    verifyNoteHi: "ब्याज/सीमा बैंक से पूछें — ऐप दर नहीं बताता।",
  },
  {
    id: "soil-health",
    nameHi: "मृदा स्वास्थ्य कार्ड",
    nameEn: "Soil Health Card",
    category: "soil",
    purposeHi: "मिट्टी जाँच आधारित पोषण सलाह",
    benefitHi: "मिट्टी जाँच रिपोर्ट + खाद सिफारिश",
    applyHi: "कृषि विभाग / मृदा परीक्षण प्रयोगशाला",
    evidence: "High",
    verifyNoteHi: "नमूना कैसे लें — KVK/ प्रयोगशाला से पूछें।",
  },
  {
    id: "enam",
    nameHi: "eNAM ऑनलाइन मंडी",
    nameEn: "eNAM",
    category: "market",
    purposeHi: "पारदर्शी नीलामी / बेहतर भाव संभावना",
    benefitHi: "अधिसूचित मंडी में ऑनलाइन व्यापार विकल्प",
    applyHi: "enam.gov.in / अधिसूचित मंडी",
    portal: "https://enam.gov.in",
    evidence: "High",
    verifyNoteHi: "स्थानीय मंडी eNAM से जुड़ी है या नहीं पूछें।",
  },
  {
    id: "aif",
    nameHi: "कृषि इंफ्रा फंड (AIF)",
    nameEn: "Agriculture Infrastructure Fund",
    category: "credit",
    purposeHi: "गोदाम/कोल्ड-स्टोर/प्रोसेसिंग पर सस्ता ऋण",
    benefitHi: "ब्याज-छूट वाला ऋण (पात्रता/सीमा पोर्टल)",
    applyHi: "बैंक / AIF पोर्टल",
    evidence: "High",
    verifyNoteHi: "दर व पात्रता बैंक/पोर्टल पर।",
  },
  {
    id: "pm-kusum",
    nameHi: "पीएम-कुसुम (सोलर)",
    nameEn: "PM-KUSUM",
    category: "energy",
    purposeHi: "सोलर पंप / सोलर ऊर्जा",
    benefitHi: "सोलर पंप पर सब्सिडी (दर verify)",
    applyHi: "UPNEDA / कृषि विभाग",
    evidence: "High",
    verifyNoteHi: "राज्य घटक और दर पोर्टल पर।",
  },
  {
    id: "up-yantra",
    nameHi: "यूपी यंत्र / पराली यंत्र",
    nameEn: "UP farm machinery & CRM",
    category: "state",
    purposeHi: "यंत्र सब्सिडी + पराली प्रबंधन यंत्र (पश्चिमी UP)",
    benefitHi:
      "सुपर/हैप्पी सीडर, मल्चर, बेलर आदि अक्सर CRM के तहत। पराली जलाना प्रतिबंधित।",
    applyHi: "UP कृषि यंत्र पोर्टल · जिला कृषि कार्यालय",
    evidence: "Medium",
    verifyNoteHi: "मौजूदा टोकन विंडो जिला कार्यालय से पूछें।",
  },
  {
    id: "up-eganna",
    nameHi: "यूपी गन्ना (E-Ganna)",
    nameEn: "UP cane portal",
    category: "state",
    purposeHi: "गन्ना पर्ची, भुगतान, सर्वे",
    benefitHi: "E-Ganna / cane portal से जानकारी",
    applyHi: "enquiry.caneup.in · गन्ना विभाग",
    portal: "https://enquiry.caneup.in",
    evidence: "High",
    verifyNoteHi: "केवल गन्ना किसान।",
  },
  {
    id: "fencing",
    nameHi: "तारबंदी / खेत बाड़",
    nameEn: "Farm fencing",
    category: "state",
    purposeHi: "नीलगाय/आवारा पशु से फसल सुरक्षा",
    benefitHi:
      "तारबंदी सब्सिडी मुख्यतः राजस्थान में प्रसिद्ध। UP में समर्पित राज्यव्यापी योजना अनिश्चित — जिला कृषि/उद्यान से पूछें। % दावा न करें।",
    applyHi: "जिला कृषि / उद्यान कार्यालय · सोलर फेंसिंग विकल्प पूछें",
    evidence: "Low",
    verifyNoteHi: "बिना आधिकारिक नोटिफिकेशन सब्सिडी का वादा न मानें।",
  },
];

export const CATEGORY_LABEL_HI: Record<FarmerScheme["category"], string> = {
  income: "आय सहायता",
  insurance: "बीमा",
  irrigation: "सिंचाई",
  mechanization: "यंत्र / ट्रैक्टर",
  credit: "ऋण / KCC",
  soil: "मिट्टी",
  market: "मंडी",
  energy: "सोलर / ऊर्जा",
  state: "राज्य विशेष",
};

export const kccQuickStepsHi = [
  "खतौनी + आधार + फोटो + बैंक खाता तैयार रखें।",
  "नजदीकी बैंक शाखा या CSC जाएँ।",
  "समय पर चुकाने पर ब्याज सबसे कम पड़ता है — दर बैंक से पूछें।",
  "PM-KISAN लाभार्थी को अक्सर प्रक्रिया सरल मिलती है।",
];
