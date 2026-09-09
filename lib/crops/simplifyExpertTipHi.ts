/**
 * Expert / field tip wording — सादी हिंदी for farmers (all crops).
 */

import { simplifyFarmerHi } from "@/lib/nutrients/farmerNutrientView";

const PHRASE_MAP: [RegExp, string][] = [
  // Factory / dashboard tips
  [
    /Treat seed with fungicide\s*\+?\s*bio-?agent before sowing/gi,
    "बुवाई से पहले बीज को फफूंदनाशक और जैविक दवा से उपचारित करें",
  ],
  [
    /Treat seed with fungicide and Trichoderma/gi,
    "बीज को फफूंदनाशक और ट्राइकोडर्मा से उपचारित करें",
  ],
  [
    /Sow at recommended depth\s*[—\-–]\s*not too deep/gi,
    "बीज सही गहराई पर बोएँ — बहुत गहरा न बोएँ",
  ],
  [/Ensure good soil moisture at germination/gi, "अंकुरण के समय मिट्टी में सही नमी रखें"],
  [
    /Never apply full nitrogen in one dose\s*[—\-–]\s*causes lodging and disease/gi,
    "पूरी नाइट्रोजन एक साथ न डालें — पौधा गिर सकता है और बीमारी बढ़ती है",
  ],
  [/Soil test every season for precise dosing/gi, "हर मौसम मिट्टी जाँच कराकर ही खाद की मात्रा तय करें"],
  [
    /Fertigation via drip improves nutrient use efficiency by 30%/gi,
    "ड्रिप से खाद–पानी देने से खाद का फायदा ज़्यादा मिलता है",
  ],
  [
    /Irrigate early morning or evening to reduce evaporation/gi,
    "सुबह या शाम पानी दें — धूप में पानी उड़ जाता है",
  ],
  [/Drain excess water after heavy rains/gi, "भारी बारिश के बाद खेत से अतिरिक्त पानी निकाल दें"],
  [
    /Foliar spray gives faster correction than soil application/gi,
    "पत्तों पर छिड़काव से कमी जल्दी ठीक होती है",
  ],
  [/Check pH\s*[—\-–]\s*nutrients lock up in extreme pH/gi, "मिट्टी का pH जाँचें — गलत pH पर खाद काम नहीं करती"],
  [/Harvest in dry weather/gi, "सूखे मौसम में कटाई करें"],
  [/Grade produce for better mandi price/gi, "माल छाँटकर बेचें — मंडी में बेहतर भाव मिलता है"],
  [/Store properly to sell when prices rise/gi, "ठीक से रखें — भाव बढ़ने पर बेचें"],
  [
    /Direct farmer-group marketing improves margins/gi,
    "किसान समूह से सीधी बिक्री से मुनाफा बेहतर हो सकता है",
  ],
  [/Use certified seed from trusted source/gi, "भरोसेमंद जगह से प्रमाणित बीज लें"],
  [
    /Follow package of practices for your variety/gi,
    "अपनी किस्म के अनुसार दूरी और तरीका अपनाएँ",
  ],
  [/As per regional agro-climatic zone/gi, "अपने इलाके के मौसम के अनुसार"],
  [/Light frequent irrigation/gi, "हल्का पानी बार-बार दें"],
  [
    /No moisture stress at flowering\/grain fill/gi,
    "फूल और दाना भरते समय पानी की कमी न होने दें",
  ],
  [/Drip or furrow\s*[—\-–]\s*avoid waterlogging/gi, "ड्रिप या नाली से पानी दें — जलभराव से बचें"],
  [/Pale yellow older leaves, stunted growth/gi, "पुरानी पत्तियाँ पीली, पौधा छोटा रहे"],
  [
    /Dark green\/purple leaves, poor root development/gi,
    "पत्तियाँ गहरी हरी/बैंगनी, जड़ कमज़ोर",
  ],
  [/Brown leaf margins, weak stems/gi, "पत्ती के किनारे भूरे, तना कमज़ोर"],
  [/Interveinal chlorosis, stunted new leaves/gi, "पत्तियों में नसों के बीच पीलापन, नई पत्ती छोटी"],
  [
    /Harvest when crop-specific maturity signs appear/gi,
    "फसल पकने के लक्षण दिखें तब कटाई करें",
  ],
  [/Dry grains\/tubers to safe storage moisture/gi, "अनाज/कंद को रखने लायक सूखाएँ"],
  [/Check e-NAM and local APMC rates daily/gi, "रोज़ e-NAM और स्थानीय मंडी भाव देखें"],
  [/Verify government MSP for eligible crops/gi, "जिन फसलों पर MSP हो, सरकारी भाव जाँचें"],
  [
    /Prices peak in off-season for most crops/gi,
    "अधिकतर फसलों में ऑफ-सीजन में भाव ऊँचे रहते हैं",
  ],
  [/Split-dose nutrition for maximum yield/gi, "खाद बाँटकर डालें — पैदावार बेहतर"],
  [
    /50% N \+ full P \+ 50% K at sowing\/transplant/gi,
    "बुवाई/रोपाई पर आधी नाइट्रोजन + पूरी फॉस्फोरस + आधा पोटाश",
  ],
  [/25% N at knee-high \/ tillering/gi, "घुटना ऊँचाई/कल्ले पर एक चौथाई नाइट्रोजन"],
  [
    /25% N at flowering \/ panicle initiation/gi,
    "फूल/बाली बनते समय एक चौथाई नाइट्रोजन",
  ],
  [
    /ZnSO₄ foliar if deficiency symptoms appear/gi,
    "जस्ता कमी दिखे तो जिंक सल्फेट पत्तों पर छिड़कें",
  ],
  [/Critical moisture stages/gi, "पानी की ज़रूरी अवस्थाएँ"],
  [/Watch for these symptoms/gi, "ये लक्षण देखें"],
  [/Timely harvest prevents losses/gi, "समय पर कटाई से नुकसान कम"],
  [/Selling strategy/gi, "बेचने की योजना"],
  [/\bSowing Guide\b/gi, "बुवाई गाइड"],
  [/\bFertilizer Schedule\b/gi, "खाद का समय"],
  [/\bIrrigation Management\b/gi, "सिंचाई"],
  [/\bNutrient Deficiency\b/gi, "पोषक कमी"],
  [/\bHarvesting & Yield\b/gi, "कटाई और पैदावार"],
  [/\bMarket Information\b/gi, "मंडी जानकारी"],

  // Common tomato / vegetable tips
  [/Use staking for indeterminate varieties/gi, "लंबी बेल वाली किस्म में सहारा (स्टेकिंग) दें"],
  [/Transplant in evening hours/gi, "पौध शाम को लगाएँ — धूप कम हो तो जड़ जल्दी पकड़े"],
  [/Calcium spray prevents blossom end rot/gi, "कैल्शियम छिड़काव से फल का निचला सिरा सड़ने से बचता है"],
  [/Avoid overhead irrigation during flowering/gi, "फूल आने पर ऊपर से पानी न डालें — पत्ती गीली न हो"],
  [
    /Maintain consistent soil moisture for calcium uptake/gi,
    "कैल्शियम के लिए मिट्टी की नमी एक जैसी रखें — कभी सूखी, कभी भीगी न हो",
  ],
  [
    /Harvest at breaker stage for long-distance transport/gi,
    "दूर मंडी भेजने के लिए फल हल्का रंग बदलते ही तोड़ें",
  ],
  [/Direct marketing to retailers improves margins/gi, "सीधे दुकानदार को बेचने से भाव बेहतर मिल सकता है"],
  [/Yellowing leaves on lower branches during flowering\.?/gi, "फूल आने पर नीचे की पत्तियाँ पीली हो रही हैं।"],
  [
    /This could indicate nitrogen deficiency or early blight\.?\s*Check for spots on leaves\.\.\.?/gi,
    "नाइट्रोजन की कमी या अगेती झुलसा हो सकती है। पत्तों पर धब्बे देखें; ज़्यादा हों तो दवा/खाद सलाह लें।",
  ],
  [/nursery and transplanting protocol/gi, "नर्सरी और रोपाई की सही विधि"],
  [/drip irrigation recommended/gi, "ड्रिप सिंचाई बेहतर"],
  [/multi-pick harvest system/gi, "कई बार तुड़ाई वाली फसल"],
];

const WORD_MAP: [RegExp, string][] = [
  [/\bfungicide\b/gi, "फफूंदनाशक"],
  [/\bbio-?agent\b/gi, "जैविक दवा"],
  [/\bstaking\b/gi, "सहारा"],
  [/\btransplant(ing|ed)?\b/gi, "रोपाई"],
  [/\bseedling(s)?\b/gi, "पौध"],
  [/\bflowering\b/gi, "फूल आने पर"],
  [/\bharvest(ing)?\b/gi, "तुड़ाई/कटाई"],
  [/\birigation\b/gi, "सिंचाई"],
  [/\bcalcium\b/gi, "कैल्शियम"],
  [/\bboron\b/gi, "बोरॉन"],
  [/\bnitrogen\b/gi, "नाइट्रोजन"],
  [/\bphosphorus\b/gi, "फॉस्फोरस"],
  [/\bpotassium\b/gi, "पोटाश"],
  [/\bzinc\b/gi, "जस्ता"],
  [/\bblight\b/gi, "झुलसा"],
  [/\bdeficiency\b/gi, "कमी"],
  [/\bfoliar\b/gi, "पत्ती पर छिड़काव"],
  [/\boverhead\b/gi, "ऊपर से"],
  [/\bmoisture\b/gi, "नमी"],
  [/\bvariet(y|ies)\b/gi, "किस्म"],
  [/\bindeterminate\b/gi, "लंबी बेल वाली"],
  [/\bevening\b/gi, "शाम"],
  [/\brecommended\b/gi, "सही"],
  [/\bprevents?\b/gi, "रोकता है"],
  [/\bavoid\b/gi, "बचें"],
  [/\bmaintain\b/gi, "बनाए रखें"],
  [/\bensure\b/gi, "सुनिश्चित करें"],
  [/\bcheck for\b/gi, "देखें"],
  [/\bspots?\b/gi, "धब्बे"],
  [/\bleaves\b/gi, "पत्तियाँ"],
  [/\bfruit(s)?\b/gi, "फल"],
  [/\bsoil\b/gi, "मिट्टी"],
  [/\bwater\b/gi, "पानी"],
  [/\bdays?\b/gi, "दिन"],
  [/\bdepth\b/gi, "गहराई"],
  [/\bgermination\b/gi, "अंकुरण"],
  [/\blodging\b/gi, "पौधा गिरना"],
  [/\bdisease\b/gi, "बीमारी"],
  [/\bseed\b/gi, "बीज"],
  [/\bsowing\b/gi, "बुवाई"],
  [/\btreat\b/gi, "उपचारित करें"],
  [/\bbefore\b/gi, "से पहले"],
  [/\bwith\b/gi, "के साथ"],
  [/\bnever apply full\b/gi, "पूरी मात्रा एक साथ न डालें"],
  [/\bin one dose\b/gi, "एक खुराक में"],
  [/\bcauses\b/gi, "से होता है"],
  [/\band\b/gi, "और"],
  [/\bnot too deep\b/gi, "बहुत गहरा न हो"],
  [/\bgood\b/gi, "अच्छी"],
  [/\bat\b/gi, "पर"],
  [/\bthe\b/gi, ""],
  [/\ba\b/gi, ""],
  [/\bto\b/gi, ""],
  [/\bof\b/gi, "का"],
  [/\bfor\b/gi, "के लिए"],
  [/\bin\b/gi, "में"],
];

function tidyHi(t: string): string {
  return t
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;।])/g, "$1")
    .replace(/[·\-–—]\s*$/g, "")
    .replace(/^\s*[-–—]\s*/g, "")
    .trim();
}

export function simplifyExpertTipHi(raw: string): string {
  if (!raw?.trim()) return "";
  let t = raw.replace(/\s+/g, " ").trim();

  for (const [re, hi] of PHRASE_MAP) {
    t = t.replace(re, hi);
  }

  const latinRatio = (t.match(/[A-Za-z]/g)?.length ?? 0) / Math.max(t.length, 1);
  if (latinRatio > 0.2) {
    t = simplifyFarmerHi(t, 160);
    for (const [re, hi] of WORD_MAP) {
      t = t.replace(re, hi);
    }
  }

  return tidyHi(t);
}

export function toFarmerExpertTips(tips: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tip of tips) {
    const line = simplifyExpertTipHi(tip);
    if (!line || line.length < 4) continue;
    // Drop leftover English-heavy lines
    const latin = (line.match(/[A-Za-z]/g)?.length ?? 0) / Math.max(line.length, 1);
    if (latin > 0.35) continue;
    const key = line.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(line);
  }
  return out.slice(0, 8);
}
