/**
 * Practical farmer seed rates (India) — prefer hybrid / what farmers buy today.
 * Display in simple Hindi for तैयारी + sowing guide.
 */

import { normalizeCropSlug } from "@/lib/crops/cropImages";

export type PracticalSeedRate = {
  /** Short line for cards / sowingGuide */
  labelHi: string;
  /** Optional second line */
  noteHi?: string;
};

const RATES: Record<string, PracticalSeedRate> = {
  paddy: {
    labelHi: "हाइब्रिड रोपाई: 4–6 किलो/एकड़",
    noteHi: "आजकल किसान ज्यादातर हाइब्रिड डालते हैं। देशी/ओपन वैरायटी में 8–10 किलो/एकड़ लग सकता है।",
  },
  wheat: {
    labelHi: "समय पर बुवाई: 40–45 किलो/एकड़",
    noteHi: "पछेती बुवाई (नवंबर मध्य के बाद): 50 किलो/एकड़।",
  },
  maize: {
    labelHi: "हाइब्रिड: 7–8 किलो/एकड़",
    noteHi: "सिंगल-क्रॉस हाइब्रिड — पैकेट पर लिखी दूरी मानें।",
  },
  bajra: {
    labelHi: "हाइब्रिड: 1.5–2 किलो/एकड़",
  },
  soybean: {
    labelHi: "30–35 किलो/एकड़",
    noteHi: "कतार बुवाई · बड़े दाने वाली किस्म में थोड़ा ज़्यादा।",
  },
  moongfali: {
    labelHi: "गुच्छेदार: 40–50 किलो गिरी/एकड़",
    noteHi: "फैलने वाली किस्म: 50–60 किलो गिरी/एकड़। छिलके वाली फली में मात्रा ज़्यादा लगती है।",
  },
  mustard: {
    labelHi: "1.5–2 किलो/एकड़",
    noteHi: "हाइब्रिड/छोटे बीज: 1–1.5 किलो/एकड़ भी काफी।",
  },
  cotton: {
    labelHi: "बीटी हाइब्रिड: 450–600 ग्राम/एकड़",
    noteHi: "पैकेट के साथ रिफ्यूज बीज बॉर्डर पर ज़रूर बोएँ।",
  },
  tomato: {
    labelHi: "नर्सरी बीज: 80–100 ग्राम/एकड़",
    noteHi: "हाइब्रिड पौध: लगभग 8,000–10,000 पौधे/एकड़।",
  },
  chilli: {
    labelHi: "नर्सरी बीज: 150–200 ग्राम/एकड़",
    noteHi: "हाइब्रिड पौध रोपाई आम है।",
  },
  brinjal: {
    labelHi: "नर्सरी बीज: 150–200 ग्राम/एकड़",
  },
  cauliflower: {
    labelHi: "नर्सरी बीज: 200–250 ग्राम/एकड़",
  },
  cucumber: {
    labelHi: "हाइब्रिड: 400–500 ग्राम/एकड़",
    noteHi: "एक जगह 1–2 बीज · मचान विधि।",
  },
  onion: {
    labelHi: "नर्सरी बीज: 4–5 किलो/एकड़",
    noteHi: "रोपाई के लिए पर्याप्त पौध तैयार होती है।",
  },
  potato: {
    labelHi: "बीज कंद: 8–10 क्विंटल/एकड़",
    noteHi: "छोटे पूरे कंद: 10–12 क्विंटल/एकड़।",
  },
  sugarcane: {
    labelHi: "सेट: 25–30 क्विंटल/एकड़",
    noteHi: "तीन आँख वाले सेट · ट्रेंच/मेड़ विधि।",
  },
  moong: {
    labelHi: "6–8 किलो/एकड़",
    noteHi: "जायद में अंकुरण के लिए 8–10 किलो तक।",
  },
  urad: {
    labelHi: "6–8 किलो/एकड़",
  },
  pulses: {
    labelHi: "अगेती अरहर: 4–5 किलो/एकड़",
    noteHi: "मध्य/पछेती किस्म: 5–6 किलो/एकड़।",
  },
  chana: {
    labelHi: "देशी: 30–35 किलो/एकड़",
    noteHi: "काबुली: 25–30 किलो/एकड़ (दाना बड़ा)।",
  },
  masoor: {
    labelHi: "12–15 किलो/एकड़",
  },
  bhindi: {
    labelHi: "हाइब्रिड: 2–3 किलो/एकड़",
    noteHi: "जायद थोड़ा कम, खरीफ थोड़ा ज़्यादा।",
  },
  ginger: {
    labelHi: "प्रकंद: 600–800 किलो/एकड़",
  },
  garlic: {
    labelHi: "कलियाँ: 200–250 किलो/एकड़",
  },
  mango: {
    labelHi: "ग्राफ्टेड पौधे: दूरी अनुसार 40–160/एकड़",
    noteHi: "10×10 मी ≈ 40 पौधे · सघन में ज़्यादा।",
  },
  banana: {
    labelHi: "टिश्यू कल्चर/सकर: 1,000–1,200 पौधे/एकड़",
    noteHi: "1.8×1.8 या 1.5×1.5 मीटर दूरी।",
  },
  grapes: {
    labelHi: "ग्राफ्टेड बेल: दूरी अनुसार (अक्सर ~450/एकड़ @ 3×3 मी)",
  },
  papaya: {
    labelHi: "नर्सरी बीज: 50–80 ग्राम/एकड़",
    noteHi: "या तैयार पौध: लगभग 700–1,000/एकड़।",
  },
};

export function getPracticalSeedRate(slug: string): PracticalSeedRate | null {
  return RATES[normalizeCropSlug(slug)] ?? null;
}

/** Single line for sowingGuide / cards */
export function getPracticalSeedRateLabel(slug: string): string | null {
  return getPracticalSeedRate(slug)?.labelHi ?? null;
}
