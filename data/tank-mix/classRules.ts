/**
 * Family×family tank-mix fallback when exact Excel/research pair is missing.
 * Status: safe | caution | incompatible
 */

export type ClassStatus = "safe" | "caution" | "incompatible";

export type ChemClass =
  | "op"
  | "pyrethroid"
  | "neonic"
  | "diamide"
  | "avermectin"
  | "spinosyn"
  | "bt"
  | "other_insecticide"
  | "triazole"
  | "strobilurin"
  | "dithiocarbamate"
  | "copper"
  | "sulphur"
  | "systemic_fungicide"
  | "inorganic_fungicide"
  | "bio_fungus"
  | "bio_bacteria"
  | "nonselective_herbicide"
  | "auxin_herbicide"
  | "als_herbicide"
  | "accase_herbicide"
  | "other_herbicide"
  | "fert_n"
  | "fert_p"
  | "fert_k"
  | "fert_npk"
  | "fert_ca"
  | "micro_sulphate"
  | "micro_chelate"
  | "boron"
  | "biostimulant"
  | "pgr"
  | "unknown";

export type ClassRuleResult = {
  status: ClassStatus;
  reason: string;
  phytotoxicity: string;
  mixOrder: string;
  jarTest: string;
  evidence: "High" | "Medium" | "Low";
  category: string;
};

/** molecule id (normalized lowercase) → chem class */
const CLASS_MAP: Record<string, ChemClass> = {
  // OP
  chlorpyrifos: "op",
  profenofos: "op",
  acephate: "op",
  dimethoate: "op",
  // Pyrethroid
  cypermethrin: "pyrethroid",
  deltamethrin: "pyrethroid",
  "lambda-cyhalothrin": "pyrethroid",
  bifenthrin: "pyrethroid",
  // Neonic
  imidacloprid: "neonic",
  thiamethoxam: "neonic",
  acetamiprid: "neonic",
  // Diamide
  chlorantraniliprole: "diamide",
  flubendiamide: "diamide",
  // Avermectin / spinosyn / bt
  "emamectin benzoate": "avermectin",
  abamectin: "avermectin",
  spinosad: "spinosyn",
  "bacillus thuringiensis": "bt",
  // Other insecticides
  fipronil: "other_insecticide",
  diafenthiuron: "other_insecticide",
  "cartap hydrochloride": "other_insecticide",
  indoxacarb: "other_insecticide",
  novaluron: "other_insecticide",
  // Triazoles / DMI
  tebuconazole: "triazole",
  propiconazole: "triazole",
  hexaconazole: "triazole",
  difenoconazole: "triazole",
  // Strobilurins
  azoxystrobin: "strobilurin",
  pyraclostrobin: "strobilurin",
  "kresoxim-methyl": "strobilurin",
  trifloxystrobin: "strobilurin",
  // Dithiocarbamates
  mancozeb: "dithiocarbamate",
  propineb: "dithiocarbamate",
  // Copper / sulphur
  "copper oxychloride": "copper",
  "copper hydroxide": "copper",
  sulfur: "sulphur",
  "elemental sulphur": "sulphur",
  // Systemic / other fungicides
  carbendazim: "systemic_fungicide",
  metalaxyl: "systemic_fungicide",
  cymoxanil: "systemic_fungicide",
  validamycin: "systemic_fungicide",
  "fosetyl-aluminium": "systemic_fungicide",
  "propamocarb hydrochloride": "systemic_fungicide",
  chlorothalonil: "inorganic_fungicide",
  // Biologicals
  trichoderma: "bio_fungus",
  "pseudomonas fluorescens": "bio_bacteria",
  // Herbicides
  glyphosate: "nonselective_herbicide",
  paraquat: "nonselective_herbicide",
  glufosinate: "nonselective_herbicide",
  "24-d": "auxin_herbicide",
  "2,4-d": "auxin_herbicide",
  atrazine: "other_herbicide",
  metribuzin: "other_herbicide",
  pendimethalin: "other_herbicide",
  pretilachlor: "other_herbicide",
  butachlor: "other_herbicide",
  oxyfluorfen: "other_herbicide",
  clodinafop: "accase_herbicide",
  "fenoxaprop-p-ethyl": "accase_herbicide",
  "quizalofop-ethyl": "accase_herbicide",
  propaquizafop: "accase_herbicide",
  sulfosulfuron: "als_herbicide",
  "metsulfuron-methyl": "als_herbicide",
  "pyrazosulfuron-ethyl": "als_herbicide",
  "chlorimuron-ethyl": "als_herbicide",
  "bispyribac-sodium": "als_herbicide",
  imazethapyr: "als_herbicide",
  // Fertilizers
  urea: "fert_n",
  dap: "fert_p",
  map: "fert_p",
  ssp: "fert_p",
  mop: "fert_k",
  sop: "fert_k",
  kn03: "fert_k",
  can: "fert_ca",
  wnp: "fert_npk",
  w13: "fert_npk",
  w00: "fert_p",
  mkp: "fert_p",
  // Micros / PGR
  znso4: "micro_sulphate",
  feso4: "micro_sulphate",
  mgso4: "micro_sulphate",
  "zn edta": "micro_chelate",
  "fe edta": "micro_chelate",
  boron: "boron",
  humic: "biostimulant",
  fulvic: "biostimulant",
  "amino acids": "biostimulant",
  seaweed: "biostimulant",
  ga3: "pgr",
  brassinolide: "pgr",
};

export function getChemClass(id: string): ChemClass {
  const n = id.toLowerCase().trim();
  return CLASS_MAP[n] || "unknown";
}

type RuleCell = Omit<ClassRuleResult, "category">;

function cell(
  status: ClassStatus,
  reason: string,
  phytotoxicity: string,
  mixOrder: string,
  jarTest: string,
  evidence: RuleCell["evidence"] = "Medium"
): RuleCell {
  return { status, reason, phytotoxicity, mixOrder, jarTest, evidence };
}

/** Directed lookup uses sorted class pair key. */
const FAMILY_RULES: Record<string, RuleCell> = {
  // Living bio vs fungicides / copper / antibiotics proxies
  "bio_fungus||copper": cell(
    "incompatible",
    "कॉपर जीवित ट्राइकोडर्मा/फंगल बायो को मार देता है।",
    "कॉपर जलन अलग; बायो प्रभाव खत्म।",
    "कभी न मिलाएँ — अलग दिन।",
    "N/A",
    "High"
  ),
  "bio_fungus||systemic_fungicide": cell(
    "incompatible",
    "सिस्टेमिक फफूंदनाशक (जैसे कार्बेन्डाज़िम) ट्राइकोडर्मा को नष्ट करते हैं।",
    "मुख्य नुकसान: बायो असर शून्य।",
    "5–7 दिन अंतराल; कभी टैंक-मिक्स नहीं।",
    "N/A",
    "High"
  ),
  "bio_fungus||dithiocarbamate": cell(
    "incompatible",
    "मैन्कोज़ेब/प्रोपिनेब जैसे संपर्क फफूंदनाशक जीवित फंगल बायो को दबाते हैं।",
    "बायो प्रभाव खो जाता है।",
    "अलग स्प्रे।",
    "N/A",
    "High"
  ),
  "bio_fungus||triazole": cell(
    "incompatible",
    "ट्राइएज़ोल DMI फंगल बायो-एजेंट के विरुद्ध फफूंदनाशक हैं।",
    "बायो असर नष्ट।",
    "अलग समय।",
    "N/A",
    "High"
  ),
  "bio_fungus||strobilurin": cell(
    "incompatible",
    "स्ट्रोबिलुरिन भी फंगल बायो को मार सकते हैं — टैंक-मिक्स न करें।",
    "बायो नुकसान मुख्य।",
    "अलग स्प्रे।",
    "N/A",
    "High"
  ),
  "bio_fungus||sulphur": cell(
    "incompatible",
    "सल्फर बायो-फंगस के लिए हानिकारक।",
    "बायो प्रभाव खो।",
    "अलग।",
    "N/A",
    "High"
  ),
  "bio_bacteria||copper": cell(
    "incompatible",
    "कॉपर बैक्टीरियनाशक है — स्यूडोमोनास मर जाता है।",
    "कॉपर जलन + बायो नुकसान।",
    "न मिलाएँ।",
    "N/A",
    "High"
  ),
  "bio_bacteria||systemic_fungicide": cell(
    "caution",
    "कुछ सिस्टेमिक दवाएँ बैक्टीरियल बायो को कमज़ोर कर सकती हैं — लेबल/अलग दिन सुरक्षित।",
    "कम–मध्यम।",
    "संभव हो तो अलग; नहीं तो जार टेस्ट + तुरंत स्प्रे।",
    "ज़रूरी",
    "Medium"
  ),

  // Copper + sulphur hard no
  "copper||sulphur": cell(
    "incompatible",
    "कॉपर + सल्फर गर्मी/धूप में पत्ती जलन की क्लासिक जोड़ी।",
    "उच्च — स्कॉर्च/बर्न।",
    "कभी न मिलाएँ।",
    "N/A",
    "High"
  ),

  // Calcium + P / sulphate
  "fert_ca||fert_p": cell(
    "incompatible",
    "Ca²⁺ + फॉस्फेट → अघुलनशील कैल्शियम फॉस्फेट अवक्षेप; नॉज़ल जाम।",
    "मुख्य जोखिम अवरोध/असमान डोज़।",
    "अलग टैंक/दिन।",
    "सफ़ेद स्लज तुरंत दिखेगा",
    "High"
  ),
  "fert_ca||fert_npk": cell(
    "incompatible",
    "कैल्शियम नाइट्रेट + NPK (P युक्त) अवक्षेप बनाता है।",
    "नॉज़ल क्लॉग।",
    "न मिलाएँ।",
    "हाँ — अवक्षेप",
    "High"
  ),
  "fert_ca||micro_sulphate": cell(
    "incompatible",
    "Ca + SO₄ → जिप्सम (CaSO₄) अवक्षेप।",
    "क्लॉगिंग।",
    "अलग स्प्रे।",
    "हाँ",
    "High"
  ),
  "fert_ca||fert_k": cell(
    "caution",
    "KNO₃ अक्सर OK; SOP (सल्फेट) के साथ जिप्सम जोखिम — स्रोत जाँचें।",
    "मध्यम नमक तनाव।",
    "SOP से दूर रहें; KNO₃ हो तो जार टेस्ट।",
    "ज़रूरी",
    "High"
  ),

  // OP / pyrethroid alkaline & copper
  "op||copper": cell(
    "caution",
    "क्षारीय कॉपर स्प्रे से ऑर्गनोफॉस्फेट क्षारीय हाइड्रोलिसिस — असर घट सकता है।",
    "कॉपर जलन + कम कीटनाशक अवशेष।",
    "पानी → कीटनाशक → कॉपर आखिर; pH ~5.5–7; तुरंत छिड़कें।",
    "ज़रूरी",
    "High"
  ),
  "op||fert_npk": cell(
    "caution",
    "उच्च EC / pH बदलाव OP स्थिरता घटा सकते हैं; गर्म मौसम में जलन।",
    "मध्यम।",
    "NPK घोलें → OP → जल्दी स्प्रे; बफर अगर ज़रूरत।",
    "हाँ",
    "Medium"
  ),
  "op||fert_n": cell(
    "caution",
    "यूरिया + OP अक्सर भौतिक मिलन ठीक, पर यूरिया जलन + pH।",
    "पत्ती टिप बर्न।",
    "कम यूरिया; OP बाद; गर्मी में न करें।",
    "हाँ",
    "Medium"
  ),
  "op||boron": cell(
    "caution",
    "बोरॉन/क्षारीयता OP हाइड्रोलिसिस बढ़ा सकती है।",
    "बोरॉन ओवरडोज़ खुद जलाता है।",
    "pH बैलेंस; 1–2 घंटे में स्प्रे।",
    "हाँ",
    "Medium"
  ),
  "op||sulphur": cell(
    "caution",
    "सल्फर + EC/OP कैरियर गर्म मौसम में जलन बढ़ाते हैं।",
    "उच्च गर्मी में।",
    "गर्म दोपहर से बचें; बेहतर अलग।",
    "ज़रूरी",
    "Medium"
  ),
  "pyrethroid||copper": cell(
    "caution",
    "पाइरेथ्रॉइड EC + कॉपर — इमल्शन/फ्लोक और पत्ती जलन जोखिम।",
    "मध्यम–उच्च गर्मी में।",
    "अलग बेहतर; मिलाएँ तो कॉपर आखिर, जार टेस्ट।",
    "ज़रूरी",
    "High"
  ),
  "pyrethroid||sulphur": cell(
    "caution",
    "सल्फर + ऑयली EC पाइरेथ्रॉइड = स्कॉर्च जोखिम।",
    "उच्च >28–30°C।",
    "न मिलाएँ गर्मी में।",
    "ज़रूरी",
    "High"
  ),
  "pyrethroid||fert_npk": cell(
    "caution",
    "नमक + EC सॉल्वेंट phytotoxicity बढ़ाते हैं।",
    "मध्यम–उच्च।",
    "NPK पहले घोलें → EC आखिर → तुरंत।",
    "ज़रूरी",
    "Medium"
  ),
  "pyrethroid||fert_n": cell(
    "caution",
    "यूरिया + पाइरेथ्रॉइड EC पत्ती जलन बढ़ा सकता है।",
    "टिप बर्न।",
    "कम यूरिया; गर्मी न।",
    "हाँ",
    "Medium"
  ),
  "avermectin||sulphur": cell(
    "caution",
    "एबामेक्टिन/ईमामेक्टिन EC + सल्फर गर्म मौसम में बर्न।",
    "उच्च गर्मी में।",
    "अलग या ठंडे समय।",
    "ज़रूरी",
    "Medium"
  ),
  "avermectin||copper": cell(
    "caution",
    "कॉपर क्षारीयता + एवरमेक्टिन कैरियर — भौतिक/फाइटो जोखिम।",
    "मध्यम।",
    "जार टेस्ट; तुरंत स्प्रे।",
    "ज़रूरी",
    "Medium"
  ),

  // Accase + auxin antagonism
  "accase_herbicide||auxin_herbicide": cell(
    "incompatible",
    "ग्रामिनीसाइड (ACCase) + 2,4-D जैसी ऑक्सिन दवा — घास नियंत्रण antagonize होता है।",
    "फसल पर 2,4-D लक्षण; घास मार असफल।",
    "लेबल अंतराल से अलग स्प्रे — न मिलाएँ।",
    "N/A (प्रभाव समस्या)",
    "High"
  ),
  "pgr||auxin_herbicide": cell(
    "incompatible",
    "GA3/वृद्धि हार्मोन बनाम ऑक्सिन खरपतवारनाशक — विपरीत फिजियोलॉजी।",
    "उच्च — टेढ़ा विकास।",
    "न मिलाएँ।",
    "N/A",
    "High"
  ),
  "biostimulant||nonselective_herbicide": cell(
    "caution",
    "अमीनो/ह्यूमिक ग्लाइफोसेट असर घटा सकते हैं (पानी क्वालिटी antagonism)।",
    "गैर-चयनात्मक जलन फसल पर।",
    "खरपतवार मार कार्यक्रम में बायोस्टिम्युलेंट अलग रखें।",
    "हाँ",
    "Medium"
  ),

  // Bt
  "bt||op": cell(
    "caution",
    "OP EC/सॉल्वेंट और क्षारीय पानी Bt स्पोर/क्रिस्टल प्रदर्शन घटा सकते हैं।",
    "आमतौर पर फसल सुरक्षित; असर जोखिम।",
    "Bt शाम को अकेले बेहतर; मिलाएँ तो Bt आखिर, pH<8।",
    "भौतिक जार टेस्ट",
    "Medium"
  ),
  "bt||pyrethroid": cell(
    "caution",
    "अक्सर मिलाया जाता है पर EC कैरियर Bt को नुकसान दे सकते हैं।",
    "कम।",
    "Bt आखिर; जल्दी स्प्रे।",
    "हाँ",
    "Medium"
  ),

  // Common I+F families — broadly OK with caution notes
  "neonic||triazole": cell(
    "safe",
    "नियोनीकोटिनॉइड + ट्राइएज़ोल आमतौर पर संगत (अलग टारगेट)।",
    "कम — लेबल डोज़।",
    "पानी → SC/SL क्रम WALES → एजीटेशन।",
    "पहली बार जार टेस्ट",
    "Medium"
  ),
  "neonic||strobilurin": cell(
    "safe",
    "नियोनीक + स्ट्रोबिलुरिन सामान्यतः भौतिक संगत।",
    "कम।",
    "SC/SL WALES।",
    "अनुशंसित",
    "Medium"
  ),
  "neonic||dithiocarbamate": cell(
    "caution",
    "WP मैन्कोज़ेब को पूरा फैलाना ज़रूरी; SL नियोनीक आमतौर पर OK।",
    "अवशेष धब्बे संभव।",
    "पानी → WP स्लरी → SL।",
    "हाँ",
    "Medium"
  ),
  "neonic||systemic_fungicide": cell(
    "safe",
    "अक्सर भारतीय फसल कार्यक्रमों में मिलाया जाता है।",
    "कम।",
    "WALES; तुरंत स्प्रे।",
    "अनुशंसित",
    "Medium"
  ),
  "neonic||copper": cell(
    "caution",
    "कॉपर क्षारीयता कुछ कीटनाशकों की स्थिरता घटा सकती है।",
    "कॉपर जलन गर्मी में।",
    "कॉपर आखिर; pH ध्यान।",
    "ज़रूरी",
    "Medium"
  ),
  "diamide||triazole": cell(
    "safe",
    "डायमाइड + ट्राइएज़ोल आमतौर पर संगत।",
    "कम।",
    "SC क्रम से।",
    "पहली ब्रांड जोड़ी",
    "Medium"
  ),
  "diamide||strobilurin": cell(
    "safe",
    "डायमाइड + QoI सामान्यतः OK।",
    "कम।",
    "WALES।",
    "अनुशंसित",
    "Medium"
  ),
  "diamide||dithiocarbamate": cell(
    "caution",
    "SC + WP — अच्छे एजीटेशन से चलता है।",
    "कम–मध्यम।",
    "WP पहले स्लरी → SC।",
    "हाँ",
    "Medium"
  ),
  "diamide||systemic_fungicide": cell(
    "safe",
    "आमतौर पर संगत दोहरी सुरक्षा कार्यक्रम।",
    "कम।",
    "WALES।",
    "अनुशंसित",
    "Medium"
  ),
  "diamide||copper": cell(
    "caution",
    "कॉपर भौतिक फ्लोक / फाइटो जोखिम।",
    "मध्यम गर्मी में।",
    "जार टेस्ट; कॉपर आखिर।",
    "ज़रूरी",
    "Medium"
  ),
  "op||triazole": cell(
    "caution",
    "दो EC मिलावट इमल्शन अस्थिर कर सकती है; गर्मी में जलन।",
    "मध्यम।",
    "आधा टैंक → एक EC → दूसरा धीरे; तुरंत।",
    "ज़रूरी",
    "Medium"
  ),
  "op||strobilurin": cell(
    "caution",
    "OP + स्ट्रोबी अक्सर चलता है; फॉर्मूलेशन (EC/SC) जाँचें।",
    "मध्यम।",
    "WALES; जार टेस्ट।",
    "हाँ",
    "Medium"
  ),
  "op||dithiocarbamate": cell(
    "caution",
    "क्लासिक संपर्क फफूंद + OP — भौतिक मिलान फॉर्म पर निर्भर।",
    "मध्यम।",
    "WP स्लरी पहले → OP EC।",
    "ज़रूरी",
    "Medium"
  ),
  "op||systemic_fungicide": cell(
    "caution",
    "अक्सर मिलाया जाता है; pH/इमल्शन स्थिर रखें।",
    "मध्यम।",
    "WALES; 2 घंटे में स्प्रे।",
    "हाँ",
    "Medium"
  ),
  "pyrethroid||triazole": cell(
    "caution",
    "दोनों अक्सर EC — चरण अलग/क्रीमिंग जोखिम।",
    "EC सॉल्वेंट जलन।",
    "जार टेस्ट अनिवार्य; तुरंत स्प्रे।",
    "ज़रूरी",
    "Medium"
  ),
  "pyrethroid||strobilurin": cell(
    "caution",
    "फॉर्मूलेशन मेल से चल सकता है; गर्मी सावधानी।",
    "मध्यम।",
    "WALES + जार टेस्ट।",
    "हाँ",
    "Medium"
  ),
  "pyrethroid||dithiocarbamate": cell(
    "caution",
    "WP + EC — अवक्षेप/नॉज़ल जोखिम अगर खराब मिलावट।",
    "मध्यम।",
    "पानी → WP → EC आखिर + एजीटेशन।",
    "ज़रूरी",
    "Medium"
  ),
  "pyrethroid||systemic_fungicide": cell(
    "caution",
    "सामान्यतः संभव; इमल्शन स्थिरता जाँचें।",
    "मध्यम गर्मी में।",
    "जार टेस्ट।",
    "हाँ",
    "Medium"
  ),
  "avermectin||triazole": cell(
    "caution",
    "दोनों एवरमेक्टिन/ट्राइएज़ोल EC हो सकते हैं — फाइटो/इमल्शन।",
    "मध्यम।",
    "जार टेस्ट; गर्मी न।",
    "हाँ",
    "Medium"
  ),
  "avermectin||strobilurin": cell(
    "caution",
    "अक्सर मिलाया जाता है; ब्रांड फॉर्म जाँचें।",
    "मधुमक्खी जोखिम अलग रखें।",
    "WALES।",
    "अनुशंसित",
    "Medium"
  ),
  "avermectin||dithiocarbamate": cell(
    "caution",
    "WP + EC/SC — अच्छा फैलाव ज़रूरी।",
    "मध्यम।",
    "WP पहले।",
    "हाँ",
    "Medium"
  ),
  "avermectin||systemic_fungicide": cell(
    "caution",
    "आमतौर पर चलता है; लेबल डोज़।",
    "कम–मध्यम।",
    "WALES।",
    "हाँ",
    "Medium"
  ),
  "spinosyn||triazole": cell(
    "safe",
    "स्पिनोसैड + ट्राइएज़ोल अक्सर संगत।",
    "कम।",
    "WALES।",
    "अनुशंसित",
    "Medium"
  ),
  "spinosyn||dithiocarbamate": cell(
    "caution",
    "WP फैलाव + स्पिनोसिन SC।",
    "कम।",
    "WP पहले।",
    "हाँ",
    "Medium"
  ),
  "other_insecticide||triazole": cell(
    "caution",
    "परिवार-विशिष्ट लेबल उपलब्ध न हो तो जार टेस्ट आधार।",
    "मध्यम।",
    "WALES + जार टेस्ट।",
    "ज़रूरी",
    "Low"
  ),
  "other_insecticide||strobilurin": cell(
    "caution",
    "आमतौर पर संभव; फॉर्मूलेशन निर्भर।",
    "कम–मध्यम।",
    "जार टेस्ट।",
    "हाँ",
    "Low"
  ),
  "other_insecticide||dithiocarbamate": cell(
    "caution",
    "WP संपर्क फफूंद + कीटनाशक — एजीटेशन ज़रूरी।",
    "मध्यम।",
    "WP स्लरी पहले।",
    "हाँ",
    "Medium"
  ),
  "other_insecticide||systemic_fungicide": cell(
    "caution",
    "अक्सर फील्ड में मिलाया जाता है; ब्रांड जाँच।",
    "कम–मध्यम।",
    "WALES।",
    "अनुशंसित",
    "Medium"
  ),
  "other_insecticide||copper": cell(
    "caution",
    "कॉपर pH/क्षारीयता कीटनाशक स्थिरता घटा सकती है।",
    "कॉपर जलन।",
    "कॉपर आखिर; जल्दी स्प्रे।",
    "ज़रूरी",
    "Medium"
  ),

  // Fungicide families together (when not in Excel — rare for F+F which is full, but research mols)
  "triazole||strobilurin": cell(
    "safe",
    "DMI + QoI दोहरी क्रिया — कई प्रीमिक्स क्लास।",
    "कम–मध्यम।",
    "लेबल क्रम।",
    "पहली ब्रांड",
    "High"
  ),
  "triazole||dithiocarbamate": cell(
    "caution",
    "संपर्क + सिस्टेमिक आम; WP फैलाव ध्यान।",
    "कम।",
    "WP पहले।",
    "हाँ",
    "Medium"
  ),
  "strobilurin||dithiocarbamate": cell(
    "caution",
    "अक्सर OK; सस्पेंशन स्थिर रखें।",
    "कम।",
    "WP → SC।",
    "हाँ",
    "Medium"
  ),
  "triazole||copper": cell(
    "caution",
    "कॉपर + ट्राइएज़ोल — pH और जलन।",
    "मध्यम–उच्च गर्मी।",
    "जार टेस्ट; गर्मी न।",
    "ज़रूरी",
    "Medium"
  ),
  "strobilurin||copper": cell(
    "caution",
    "कॉपर क्षारीयता स्ट्रोबी फॉर्म को परेशान कर सकती है।",
    "कॉपर बर्न।",
    "जार टेस्ट।",
    "ज़रूरी",
    "Medium"
  ),
  "dithiocarbamate||copper": cell(
    "caution",
    "कुछ कार्यक्रमों में मिलाया जाता है; अवशेष/जलन।",
    "मध्यम।",
    "अच्छा फैलाव; गर्मी सावधानी।",
    "हाँ",
    "Medium"
  ),
  "systemic_fungicide||copper": cell(
    "caution",
    "कॉपर क्षारीयता कुछ सिस्टेमिक फॉर्म घटा सकती है।",
    "कॉपर जलन।",
    "कॉपर आखिर।",
    "ज़रूरी",
    "Medium"
  ),
  "sulphur||triazole": cell(
    "caution",
    "सल्फर + EC ट्राइएज़ोल गर्म मौसम में जलन।",
    "उच्च गर्मी।",
    "ठंडा समय या अलग।",
    "ज़रूरी",
    "Medium"
  ),
  "sulphur||dithiocarbamate": cell(
    "caution",
    "दोनों संपर्क — नमक/अवशेष भार; गर्मी जलन।",
    "मध्यम।",
    "जार टेस्ट।",
    "हाँ",
    "Medium"
  ),

  // Fertilizer + chem general
  "fert_npk||neonic": cell(
    "safe",
    "घुलनशील NPK + नियोनीक SL सामान्यतः चलता है अगर EC मध्यम।",
    "गर्मी में नमक जलन।",
    "NPK घोलें → SL → उसी दिन।",
    "अनुशंसित",
    "Medium"
  ),
  "fert_npk||diamide": cell(
    "safe",
    "NPK + डायमाइड SC अक्सर संगत।",
    "कम।",
    "NPK → SC।",
    "अनुशंसित",
    "Medium"
  ),
  "fert_npk||dithiocarbamate": cell(
    "caution",
    "उच्च नमक WP सस्पेंशन फ्लोक कर सकता है।",
    "धब्बे।",
    "WP स्लरी → नमक → लगातार हिलाएँ।",
    "ज़रूरी",
    "Medium"
  ),
  "fert_npk||triazole": cell(
    "caution",
    "नमक + EC ट्राइएज़ोल phytotoxicity।",
    "मध्यम गर्मी में।",
    "NPK → EC धीरे।",
    "हाँ",
    "Medium"
  ),
  "fert_n||neonic": cell(
    "caution",
    "कम दर यूरिया + नियोनीक संभव; जलन नियंत्रण।",
    "यूरिया बर्न।",
    "कम यूरिया; गर्मी न।",
    "हाँ",
    "Medium"
  ),
  "fert_p||micro_sulphate": cell(
    "caution",
    "फॉस्फेट Zn/Fe को अवक्षेपित कर उपलब्धता घटा सकता है।",
    "कम–मध्यम।",
    "कीलेट बेहतर; नहीं तो जार टेस्ट जल्दी स्प्रे।",
    "हाँ",
    "Medium"
  ),
  "micro_chelate||fert_npk": cell(
    "safe",
    "EDTA/EDDHA कीलेट + WSF अक्सर संगत।",
    "कम लेबल दर पर।",
    "पानी → NPK → कीलेट।",
    "पहली बार",
    "Medium"
  ),
  "biostimulant||neonic": cell(
    "caution",
    "ह्यूमिक कुछ आयन बाँध सकते हैं; भौतिक अक्सर OK।",
    "कम।",
    "ह्यूमिक → कीटनाशक; हिलाते रहें।",
    "अनुशंसित",
    "Medium"
  ),
  "biostimulant||dithiocarbamate": cell(
    "safe",
    "समुद्री शैवाल/फुल्विक + संपर्क फफूंद अक्सर बागवानी में।",
    "गाढ़ा अर्क हो तो मध्यम।",
    "WP → लिक्विड बायोस्टिम आखिर।",
    "अनुशंसित",
    "Medium"
  ),
  "pgr||fert_n": cell(
    "caution",
    "GA3 + यूरिया — वृद्धि प्रतिक्रिया अनिश्चित; अलग समय बेहतर।",
    "मध्यम।",
    "अलग स्प्रे प्राथमिकता।",
    "हाँ",
    "Low"
  ),
  "boron||fert_npk": cell(
    "caution",
    "बोरॉन ओवरलैप phytotoxicity; कुल नमक देखें।",
    "बोरॉन टिप बर्न।",
    "कम दर; जार टेस्ट।",
    "हाँ",
    "Medium"
  ),
  "micro_sulphate||op": cell(
    "caution",
    "सल्फेट माइक्रो + OP — pH और अवक्षेप जाँचें।",
    "मध्यम।",
    "माइक्रो घोलें → OP; जल्दी।",
    "हाँ",
    "Medium"
  ),

  // Herbicide + fert — without labelled tank-mix, do not recommend
  "nonselective_herbicide||fert_n": cell(
    "incompatible",
    "न मिलाएँ — गैर-चयनात्मक खरपतवारनाशक + यूरिया का सामान्य टैंक-मिक्स सुझाव नहीं; लेबल अनुमति हो तभी।",
    "हरी ऊतक पर बहुत उच्च जलन।",
    "अलग स्प्रे।",
    "N/A",
    "High"
  ),
  "biostimulant||copper": cell(
    "incompatible",
    "न मिलाएँ — ह्यूमिक कॉपर बाँधकर असर घटाते हैं; लेबल पर साफ़ अनुमति न हो तो अलग रखें।",
    "कॉपर जलन बाकी।",
    "अलग स्प्रे।",
    "N/A",
    "Medium"
  ),
  "pgr||fert_n": cell(
    "incompatible",
    "न मिलाएँ — GA3/PGR + यूरिया का पुष्ट सुरक्षित टैंक-मिक्स स्रोत सामान्य नहीं।",
    "अनिश्चित वृद्धि प्रतिक्रिया।",
    "अलग समय।",
    "N/A",
    "High"
  ),
  "nonselective_herbicide||auxin_herbicide": cell(
    "caution",
    "मिला सकते हो — शर्त: केवल जहाँ बर्न्डाउन प्रोग्राम/लेबल अनुमति हो; पानी क्वालिटी और amine/ester फॉर्म ज़रूरी।",
    "ड्रिफ्ट जोखिम अति — संवेदनशील फसल पास न हो।",
    "पानी कंडीशन → ग्लाइफोसेट → 2,4-D; तुरंत स्प्रे।",
    "लेबल क्रम मानें।",
    "High"
  ),
};
function pairClassKey(a: ChemClass, b: ChemClass): string {
  return a < b ? `${a}||${b}` : `${b}||${a}`;
}

function isHerbClass(c: ChemClass): boolean {
  return (
    c === "nonselective_herbicide" ||
    c === "auxin_herbicide" ||
    c === "als_herbicide" ||
    c === "accase_herbicide" ||
    c === "other_herbicide"
  );
}

function isFertish(c: ChemClass): boolean {
  return (
    c.startsWith("fert_") ||
    c.startsWith("micro_") ||
    c === "boron" ||
    c === "biostimulant" ||
    c === "pgr"
  );
}

function isFungicideClass(c: ChemClass): boolean {
  return (
    c === "triazole" ||
    c === "strobilurin" ||
    c === "dithiocarbamate" ||
    c === "copper" ||
    c === "sulphur" ||
    c === "systemic_fungicide" ||
    c === "inorganic_fungicide"
  );
}

/** No sourced pair — legal-safe default: do not tank-mix. */
const NO_SOURCE: ClassRuleResult = {
  status: "incompatible",
  reason:
    "न मिलाएँ — इस जोड़ी का पुष्ट टैंक-मिक्स / उत्पाद-लेबल स्रोत उपलब्ध नहीं। बिना लेबल अनुमति टैंक-मिक्स न करें।",
  phytotoxicity: "बिना स्रोत मिलावट नुकसान / प्रभाव खोने का जोखिम।",
  mixOrder: "अलग स्प्रे / अलग दिन।",
  jarTest: "N/A — न मिलाएँ।",
  evidence: "High",
  category: "no-source",
};

/** Default when classes known but no family cell — legal: do not mix. */
function defaultForClasses(a: ChemClass, b: ChemClass): ClassRuleResult {
  if (
    (a === "bio_fungus" || a === "bio_bacteria") &&
    isFungicideClass(b)
  ) {
    return {
      status: "incompatible",
      reason: "जीवित जैव नियंत्रण को फफूंदनाशक/कॉपर/सल्फर के साथ न मिलाएँ — एजेंट मर जाता है।",
      phytotoxicity: "मुख्य नुकसान बायो असर का।",
      mixOrder: "अलग दिन (अक्सर 5–7 दिन)।",
      jarTest: "N/A",
      evidence: "High",
      category: "class-fallback",
    };
  }
  if (
    (b === "bio_fungus" || b === "bio_bacteria") &&
    isFungicideClass(a)
  ) {
    return defaultForClasses(b, a);
  }

  if ((isHerbClass(a) && isFertish(b)) || (isHerbClass(b) && isFertish(a))) {
    return {
      ...NO_SOURCE,
      reason:
        "न मिलाएँ — खरपतवारनाशक + खाद/माइक्रो का पुष्ट टैंक-मिक्स स्रोत नहीं। लेबल पर साफ़ अनुमति हो तभी अलग कार्यक्रम में मिलाएँ; सामान्य सलाह: अलग स्प्रे।",
      category: "no-source:herb+fert",
    };
  }

  if (isFertish(a) || isFertish(b)) {
    return {
      ...NO_SOURCE,
      reason:
        "न मिलाएँ — खाद/माइक्रो/PGR + फसल-सुरक्षा रसायन की यह जोड़ी पुष्ट स्रोत में नहीं। लेबल अनुमति के बिना न मिलाएँ।",
      category: "no-source:fert+chem",
    };
  }

  return { ...NO_SOURCE, category: "no-source:class" };
}

export function checkClassCompatibility(
  idA: string,
  idB: string
): ClassRuleResult | null {
  const ca = getChemClass(idA);
  const cb = getChemClass(idB);
  if (ca === "unknown" && cb === "unknown") return null;

  const key = pairClassKey(ca, cb);
  const hit = FAMILY_RULES[key];
  if (hit) {
    // Low-evidence class cells are not treated as mix recommendations
    if (hit.evidence === "Low") {
      return { ...NO_SOURCE, category: `class-low:${ca}+${cb}` };
    }
    return { ...hit, category: `class:${ca}+${cb}` };
  }

  if (ca !== "unknown" || cb !== "unknown") {
    return defaultForClasses(ca, cb);
  }
  return null;
}
