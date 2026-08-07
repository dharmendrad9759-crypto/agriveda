/**
 * Per-symptom deficiency photos (top 3 cards on nutrient detail).
 *
 * Path priority:
 * 1. /images/deficiencies/symptoms/{crop}-{nutrient}-s{slot}.jpg
 * 2. /images/deficiencies/symptoms/{nutrient}-s{slot}.jpg
 * 3. crop×nutrient photo
 * 4. shared nutrient photo
 */

import {
  cropLabelToImageSlug,
  getCropDeficiencyImage,
  getSharedDeficiencyImage,
} from "@/lib/nutrients/deficiencyImages";

export const SYMPTOM_SLOT_COUNT = 3;

/** Classify Hindi/English symptom line → short English visual hint for prompts / filenames */
export function classifySymptomVisual(text: string): string {
  const t = text.toLowerCase();
  const hi = text;

  if (/खैरा|भूरे धब्बे|brown fleck|खैरा/.test(hi) || /khaira/.test(t)) return "brown-flecks";
  if (/छोटी पत्ती|कम अंतराल|rosett|bushy|बौनी/.test(hi) || /small leaf|internode/.test(t))
    return "small-leaves";
  if (/किनारे|जलते|बॉर्डर|scorch|edge/.test(hi) || /margin|burn/.test(t)) return "edge-burn";
  if (/बैंगनी|बैंगनी|purple|लाल/.test(hi) || /purple/.test(t)) return "purple-leaf";
  if (/फूल झड़|फल झड़|flower drop|fruit drop|सेटिंग/.test(hi) || /drop|set/.test(t))
    return "flower-drop";
  if (/नसों के बीच|interveinal|नसें हरी|धारियाँ|मॉटल/.test(hi) || /interveinal|mottle/.test(t))
    return "interveinal";
  if (/नई पत्ती|ऊपर की|young|pale tip|सफ़ेद-पीली|चमकीली पीली/.test(hi) || /young leaf|pale/.test(t))
    return "young-pale";
  if (/पुरानी|नीची|old leaf|V-आकार|पीली/.test(hi) || /yellow|chlorosis/.test(t))
    return "old-yellow";
  if (/टिलर|शाखा|stunted|कमज़ोर|बौना/.test(hi) || /stunt|tiller/.test(t)) return "stunted";
  if (/टिप|कलम|dieback|सूख|मुड़ी|विकृत/.test(hi) || /tip|dieback|twist/.test(t))
    return "tip-dieback";
  if (/BER|निचला हिस्सा काला|hollow|खाली फली|फट/.test(hi) || /blossom|hollow|crack/.test(t))
    return "fruit-disorder";
  if (/व्हिपटेल|whip|पतली पत्ती/.test(hi) || /whip/.test(t)) return "whiptail";
  return "general";
}

export function symptomImagePath(
  cropSlug: string | undefined,
  nutrientSlug: string,
  slot: number
): string {
  const s = Math.max(0, Math.min(SYMPTOM_SLOT_COUNT - 1, slot));
  if (cropSlug) {
    return `/images/deficiencies/symptoms/${cropSlug}-${nutrientSlug}-s${s}.jpg`;
  }
  return `/images/deficiencies/symptoms/${nutrientSlug}-s${s}.jpg`;
}

export function getSymptomImageCandidates(opts: {
  cropSlug?: string;
  cropLabel?: string;
  nutrient: string;
  slot: number;
  symptomText?: string;
}): string[] {
  const crop =
    opts.cropSlug ||
    (opts.cropLabel ? cropLabelToImageSlug(opts.cropLabel) : undefined);
  const nutrient = opts.nutrient;
  const slot = opts.slot;
  const visual = opts.symptomText ? classifySymptomVisual(opts.symptomText) : "general";

  const paths: string[] = [];
  if (crop) {
    paths.push(symptomImagePath(crop, nutrient, slot));
    paths.push(`/images/deficiencies/symptoms/${crop}-${visual}.jpg`);
  }
  paths.push(symptomImagePath(undefined, nutrient, slot));
  paths.push(`/images/deficiencies/symptoms/${visual}.jpg`);
  if (crop) paths.push(getCropDeficiencyImage(crop, nutrient));
  paths.push(getSharedDeficiencyImage(nutrient));
  paths.push("/images/home/home-job-yellow-leaf.jpg");
  return [...new Set(paths)];
}
