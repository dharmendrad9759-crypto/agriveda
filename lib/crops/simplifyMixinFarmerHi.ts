/**
 * Mixin fertilizer UI — सरल खेत शब्द + Technical (हिंदी) उत्पाद नाम।
 */

import { applyBilingualAgriNames } from "@/lib/crops/bilingualAgriName";

export function simplifyMixinFarmerHi(raw: string): string {
  if (!raw) return "";
  let t = raw.replace(/\s+/g, " ").trim();

  // Field jargon → simple Hindi (not product names)
  const phrases: [RegExp, string][] = [
    [/जड़\s*zone\s*\/\s*root\s*dip/gi, "जड़ डुबोना"],
    [/जड़\s*zone/gi, "जड़ के पास"],
    [/root\s*dip/gi, "जड़ डुबोना"],
    [/root\s*treatment/gi, "जड़ उपचार"],
    [/रोपाई\s*\/\s*furrow[-\s]*beds?/gi, "कूंड़ / मेड़"],
    [/furrow[-\s]*beds?/gi, "कूंड़ / मेड़"],
    [/furrow\s*\/\s*beds?/gi, "कूंड़ / मेड़"],
    [/in\s*furrow/gi, "कूंड़ में"],
    [/raised\s*beds?/gi, "ऊँची मेड़"],
    [/earthing\s*up/gi, "मिट्टी चढ़ाना"],
    [/seed\s*treatment/gi, "बीज उपचार"],
    [/top\s*dress(ing)?/gi, "ऊपर से खाद"],
    [/grand\s*growth/gi, "तेज़ बढ़वार"],
    [/fruit\s*set/gi, "फल लगना"],
    [/full\s*bloom/gi, "पूरा फूल"],
    [/pre[-\s]?flower/gi, "फूल से पहले"],
    [/post[-\s]?harvest/gi, "कटाई के बाद"],
    [/drip\s*line/gi, "ड्रिप लाइन"],
    [/root[-\s]?zone/gi, "जड़ के पास"],
    [/canopy/gi, "छतरी"],
    [/bunch\s*sleeve/gi, "घार की थैली"],
    [/days?\s*after\s*pruning/gi, "काट-छाँट के दिन"],
    [/days?\s*after\s*planting/gi, "रोपाई के दिन"],
    [/Field Doctor Tip/gi, "खेत की सलाह"],
    [/farmyard\s*manure/gi, "गोबर खाद"],
    [/well[-\s]?decomposed/gi, "सड़ी हुई"],
    [/immediate\s*use/gi, "तुरंत डालो"],
    [/broadcast/gi, "छिड़ककर डालो"],
    [/incorporate\s*into\s*soil/gi, "मिट्टी में मिलाओ"],
    [/tank\s*mix/gi, "एक साथ घोल"],
    [/enzyme\s*granular/gi, "एंजाइम दाने"],
    [/Liquid\s*Humic(\s*Acid)?/gi, "Liquid Humic"],
    [/Humic\s*Granules?/gi, "Humic Granules"],
    [/Granular\s*Humic/gi, "Humic Granules"],
    [/Seaweed\s*·\s*granular/gi, "Seaweed · granular"],
    [/Seaweed\s*Granules?/gi, "Seaweed Granules"],
    [/Amino\s*Acid\s*\/?\s*Biostimulant\s*Tonic/gi, "Amino Acid"],
    [/Amino\s*(Acid\s*)?Tonic/gi, "Amino Acid"],
    [/जैविक व जड़ सहायता/gi, "जैविक और जड़ की मदद"],
  ];

  for (const [re, rep] of phrases) t = t.replace(re, rep);

  const pairs: [RegExp, string][] = [
    [/\bfurrow\b/gi, "कूंड़"],
    [/\bbeds?\b/gi, "मेड़"],
    [/\bzone\b/gi, "जगह"],
    [/\bgranular\b/gi, "दानेदार"],
    [/\bpowder\b/gi, "पाउडर"],
    [/\bdrench(ing)?\b/gi, "जड़ के पास घोल"],
    [/\bfoliar\b/gi, "पत्ती पर छिड़काव"],
    [/बेसल/gi, "रोपाई के समय"],
    [/\bbasal\b/gi, "रोपाई के समय"],
    [/\bPGR\b/gi, "बढ़वार दवा"],
    [/\bDAT\b/g, "दिन"],
    [/\bDAS\b/g, "दिन"],
    [/\/\s*लीटर/g, " प्रति लीटर"],
    [/\/\s*एकड़/g, " प्रति एकड़"],
    [/\bacres?\b/gi, "एकड़"],
    [/\bml\b/gi, "मि.ली."],
    [/\bkg\b/gi, "किग्रा"],
    [/\bg\b(?=\s|\/|$)/gi, "ग्राम"],
    [/\bL\b(?=\s|\/|$)/g, "लीटर"],
    [/·/g, " · "],
    [/\s{2,}/g, " "],
  ];

  for (const [re, rep] of pairs) t = t.replace(re, rep);

  t = t
    .replace(/\bOR\b/g, "या")
    .replace(/\bONLY IF\b/gi, "सिर्फ अगर")
    .replace(/\bMANDATORY\b/gi, "ज़रूरी")
    .replace(/\bSOURCE[_\s-]?CLAIM\b/gi, "")
    .replace(/रोपाई के समय\s*रोपाई/gi, "रोपाई")
    .replace(/रोपाई\s*\/\s*रोपाई/gi, "रोपाई")
    .replace(/\(\s*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  // Product names: Technical (हिंदी)
  t = applyBilingualAgriNames(t);

  return t;
}

export function simplifyMixinLinesHi(lines: string[]): string[] {
  return lines.map(simplifyMixinFarmerHi).filter(Boolean);
}
