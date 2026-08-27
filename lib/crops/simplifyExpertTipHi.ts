/**
 * Expert / field tip wording — सादी हिंदी for farmers.
 */

import { simplifyFarmerHi } from "@/lib/nutrients/farmerNutrientView";

const PHRASE_MAP: [RegExp, string][] = [
  [/Use staking for indeterminate varieties/gi, "लंबी बेल वाली किस्म में सहारा (स्टेकिंग) दें"],
  [/Transplant in evening hours/gi, "पौध शाम को लगाएँ — धूप कम हो तो जड़ जल्दी पकड़े"],
  [/Calcium spray prevents blossom end rot/gi, "कैल्शियम छिड़काव से फल का निचला सिरा सड़ने से बचता है"],
  [/Avoid overhead irrigation during flowering/gi, "फूल आने पर ऊपर से पानी न डालें — पत्ती गीली न हो"],
  [/Maintain consistent soil moisture for calcium uptake/gi, "कैल्शियम के लिए मिट्टी की नमी एक जैसी रखें — कभी सूखी, कभी भीगी न हो"],
  [/Harvest at breaker stage for long-distance transport/gi, "दूर मंडी भेजने के लिए फल हल्का रंग बदलते ही तोड़ें"],
  [/Direct marketing to retailers improves margins/gi, "सीधे दुकानदार को बेचने से भाव बेहतर मिल सकता है"],
  [/Yellowing leaves on lower branches during flowering\.?/gi, "फूल आने पर नीचे की पत्तियाँ पीली हो रही हैं।"],
  [/This could indicate nitrogen deficiency or early blight\.?\s*Check for spots on leaves\.\.\.?/gi, "नाइट्रोजन की कमी या अगेती झुलसा हो सकती है। पत्तों पर धब्बे देखें; ज़्यादा हों तो दवा/खाद सलाह लें।"],
  [/nursery and transplanting protocol/gi, "नर्सरी और रोपाई की सही विधि"],
  [/drip irrigation recommended/gi, "ड्रिप सिंचाई बेहतर"],
  [/multi-pick harvest system/gi, "कई बार तुड़ाई वाली फसल"],
];

export function simplifyExpertTipHi(raw: string): string {
  if (!raw?.trim()) return "";
  let t = raw.replace(/\s+/g, " ").trim();

  for (const [re, hi] of PHRASE_MAP) {
    t = t.replace(re, hi);
  }

  // If still mostly Latin letters, run farmer simplifier + light EN→HI swaps
  const latinRatio = (t.match(/[A-Za-z]/g)?.length ?? 0) / Math.max(t.length, 1);
  if (latinRatio > 0.35) {
    t = simplifyFarmerHi(t, 140);
    t = t
      .replace(/\bstaking\b/gi, "सहारा")
      .replace(/\btransplant(ing|ed)?\b/gi, "रोपाई")
      .replace(/\bseedling(s)?\b/gi, "पौध")
      .replace(/\bflowering\b/gi, "फूल आने पर")
      .replace(/\bharvest(ing)?\b/gi, "तुड़ाई/कटाई")
      .replace(/\birigation\b/gi, "सिंचाई")
      .replace(/\bcalcium\b/gi, "कैल्शियम")
      .replace(/\bboron\b/gi, "बोरॉन")
      .replace(/\bnitrogen\b/gi, "नाइट्रोजन")
      .replace(/\bblight\b/gi, "झुलसा")
      .replace(/\bdeficiency\b/gi, "कमी")
      .replace(/\bfoliar\b/gi, "पत्ती पर छिड़काव")
      .replace(/\boverhead\b/gi, "ऊपर से")
      .replace(/\bmoisture\b/gi, "नमी")
      .replace(/\bvariety\/varieties\b/gi, "किस्म")
      .replace(/\bindeterminate\b/gi, "लंबी बेल वाली")
      .replace(/\bevening\b/gi, "शाम")
      .replace(/\brecommended\b/gi, "बेहतर")
      .replace(/\bprevents?\b/gi, "रोकता है")
      .replace(/\bavoid\b/gi, "बचें")
      .replace(/\bmaintain\b/gi, "बनाए रखें")
      .replace(/\bcheck for\b/gi, "देखें")
      .replace(/\bspots?\b/gi, "धब्बे")
      .replace(/\bleaves\b/gi, "पत्तियाँ")
      .replace(/\bfruit(s)?\b/gi, "फल")
      .replace(/\bsoil\b/gi, "मिट्टी")
      .replace(/\bwater\b/gi, "पानी")
      .replace(/\bdays?\b/gi, "दिन")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  return t;
}

export function toFarmerExpertTips(tips: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tip of tips) {
    const line = simplifyExpertTipHi(tip);
    if (!line || line.length < 4) continue;
    const key = line.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(line);
  }
  return out.slice(0, 8);
}
