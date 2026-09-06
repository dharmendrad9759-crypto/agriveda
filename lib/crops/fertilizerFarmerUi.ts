/**
 * Farmer-facing helpers for the crop fertilizer tab (Hindi-first, bag-friendly).
 */

const FERT_IMG = "/images/fertilizer";

/** Product / tip photos for schedule, foliar, organic, bag tabs. */
export function fertilizerProductImage(name: string): string {
  const t = name.toLowerCase();
  if (/dap|डीएपी/.test(t)) return `${FERT_IMG}/fert-bag-dap.webp`;
  if (/urea|यूरिया/.test(t)) return `${FERT_IMG}/fert-bag-urea.webp`;
  if (/mop|एमओपी|पोटाश|potash/.test(t)) return `${FERT_IMG}/fert-bag-mop.webp`;
  if (/zinc|जिंक|znso|zn\b/.test(t)) return `${FERT_IMG}/fert-bag-zinc.webp`;
  if (/gypsum|जिप्सम/.test(t)) return `${FERT_IMG}/fert-bag-gypsum.webp`;
  if (/ssp|एसएसपी|tsp|टीएसपी/.test(t)) return `${FERT_IMG}/fert-bag-dap.webp`;
  if (/borax|बोरेक्स|boron|बोरॉन/.test(t)) return `${FERT_IMG}/fert-foliar-cob.webp`;
  if (/19\s*:\s*19|20\s*:\s*20|घुलनशील|npk/.test(t)) return `${FERT_IMG}/fert-foliar-green.webp`;
  return `${FERT_IMG}/fert-bag-urea.webp`;
}

export function foliarCardImage(title: string, medicine: string): string {
  const t = `${title} ${medicine}`.toLowerCase();
  if (/zinc|जिंक|पीला|yellow|सफ़ेद\s*कलिका/.test(t)) {
    return `${FERT_IMG}/fert-foliar-yellow-leaf.webp`;
  }
  if (/boron|बोरॉन|बोरेक्स|दाने|cob|परागण|grain/.test(t)) {
    return `${FERT_IMG}/fert-foliar-cob.webp`;
  }
  if (/19\s*:\s*19|हरियाली|green|ग्रोथ|growth|npk/.test(t)) {
    return `${FERT_IMG}/fert-foliar-green.webp`;
  }
  if (/iron|आयरन|पीली/.test(t)) return `${FERT_IMG}/fert-foliar-yellow-leaf.webp`;
  return `${FERT_IMG}/fert-foliar-green.webp`;
}

export function organicTipImage(line: string): string {
  const t = line.toLowerCase();
  if (/जीवामृत|jeevamrut|jeevamrit/.test(t)) return `${FERT_IMG}/fert-organic-jeevamrut.webp`;
  if (/नीम|neem/.test(t)) return `${FERT_IMG}/fert-organic-neem.webp`;
  if (/गोबर|वर्मी|compost|fym|खाद|खली|राइजो|rhizobium|psb/.test(t)) {
    return `${FERT_IMG}/fert-organic-compost.webp`;
  }
  return `${FERT_IMG}/fert-organic-compost.webp`;
}

/** Split "डीएपी 55 किग्रा + एमओपी 33 किग्रा" into product lines. */
export function parseFertilizerApplyLine(apply: string): { name: string; dose: string }[] {
  const cleaned = apply.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];

  const parts = cleaned
    .split(/\s*[+·•|]\s*|\s+और\s+/i)
    .map((p) => p.trim())
    .filter(Boolean);

  const out: { name: string; dose: string }[] = [];
  for (const part of parts) {
    const m = part.match(
      /^(.+?)\s+([\d.]+)\s*(किग्रा|kg|g|ग्राम|ml|मि.?ली|L|लीटर)?(.*)$/i
    );
    if (m) {
      const name = m[1].replace(/[:：]\s*$/, "").trim();
      const unit = m[3] ? normalizeUnit(m[3]) : "किग्रा";
      const note = (m[4] || "").trim();
      const dose = `${m[2]} ${unit}${note ? ` ${note}` : ""}`.trim();
      out.push({ name, dose: withBagHint(dose) });
      continue;
    }
    out.push({ name: part, dose: "" });
  }
  return out.length ? out : [{ name: cleaned, dose: "" }];
}

function normalizeUnit(u: string): string {
  const s = u.toLowerCase();
  if (/kg|किग्रा/.test(s)) return "किग्रा";
  if (/g|ग्राम/.test(s)) return "ग्राम";
  if (/ml|मि/.test(s)) return "मि.ली";
  if (/l|लीटर/.test(s)) return "लीटर";
  return u;
}

/** Add “लगभग X बोरी” when kg is close to a 50 kg bag fraction. */
export function withBagHint(dose: string): string {
  const m = dose.match(/^([\d.]+)\s*किग्रा\b(.*)$/i);
  if (!m) return dose;
  const kg = parseFloat(m[1]);
  if (!Number.isFinite(kg) || kg <= 0) return dose;
  const rest = (m[2] || "").trim();
  if (/बोरी/.test(rest)) return dose;

  const hint = bagFractionHint(kg);
  if (!hint) return dose;
  return `${m[1]} किग्रा (${hint})${rest ? ` ${rest}` : ""}`;
}

function bagFractionHint(kg: number): string | null {
  const bags = kg / 50;
  if (Math.abs(bags - 1) < 0.08) return "1 बोरी";
  if (Math.abs(bags - 2) < 0.1) return "लगभग 2 बोरी";
  if (Math.abs(bags - 0.5) < 0.06) return "लगभग आधी बोरी";
  if (Math.abs(bags - 0.67) < 0.08) return "लगभग 2/3 बोरी";
  if (Math.abs(bags - 0.75) < 0.08) return "लगभग 3/4 बोरी";
  if (bags > 1.1 && bags < 1.9) {
    const whole = Math.floor(bags);
    const rem = Math.round(kg - whole * 50);
    if (rem >= 3 && rem <= 15) return `${whole} बोरी + ${rem} किग्रा`;
  }
  return null;
}

export type FoliarCard = {
  title: string;
  medicine: string;
  dose: string;
};

/** Map raw foliar/micro lines into problem → medicine → dose cards. */
export function toFoliarCards(
  rows: { name: string; detail: string }[],
  hi: boolean
): FoliarCard[] {
  const cards: FoliarCard[] = [];
  const seen = new Set<string>();

  for (const r of rows) {
    const detail = r.detail.trim();
    if (!detail) continue;
    const key = detail.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const title = foliarPurpose(detail, r.name, hi);
    const { medicine, dose } = splitMedicineDose(detail, hi);
    cards.push({ title, medicine, dose });
  }

  return cards.slice(0, 6);
}

function foliarPurpose(detail: string, name: string, hi: boolean): string {
  const t = `${name} ${detail}`;
  if (/zinc|जिंक|znso|Zn\b/i.test(t)) {
    return hi ? "पत्ती पीलापन / सफ़ेद कलिका रोकने के लिए" : "To prevent yellowing (zinc)";
  }
  if (/boron|बोरॉन|बोरेक्स|Borax/i.test(t)) {
    return hi ? "दाने भरने व फूल–परागण के लिए" : "For grain fill & pollination";
  }
  if (/19\s*:\s*19\s*:\s*19|20\s*:\s*20\s*:\s*20|घुलनशील/i.test(t)) {
    return hi ? "सामान्य हरियाली और ग्रोथ के लिए" : "For general greenery & growth";
  }
  if (/iron|आयरन|feso/i.test(t)) {
    return hi ? "नई पत्ती पीली हो तो" : "If new leaves turn yellow";
  }
  if (/calcium|कैल्शियम/i.test(t)) {
    return hi ? "फल सड़न / झड़ना रोकने के लिए" : "To reduce fruit rot / drop";
  }
  return hi ? "पत्ती पर छिड़काव" : "Leaf spray";
}

function splitMedicineDose(detail: string, hi: boolean): { medicine: string; dose: string } {
  const doseMatch = detail.match(
    /(\d+(?:\.\d+)?\s*(?:[-–]\s*\d+(?:\.\d+)?)?\s*(?:g|ग्राम|किग्रा|kg|ml|मि\.?ली|%)[^\s,]*)/i
  );
  const dose = doseMatch
    ? doseMatch[0]
    : hi
      ? "डिब्बे पर लिखी मात्रा में मिलाएँ"
      : "Follow product label dose";

  let medicine = detail;
  if (doseMatch) {
    medicine = detail.replace(doseMatch[0], "").replace(/[·\-–—,]\s*$/, "").trim();
  }
  medicine = medicine
    .replace(/\bZnSO4\b/gi, "जिंक सल्फेट")
    .replace(/\bZnSO₄\b/gi, "जिंक सल्फेट")
    .replace(/\bmicronutrient(s)?\b/gi, hi ? "सूक्ष्म खाद" : "Micronutrient")
    .trim();

  if (!medicine) medicine = hi ? "सूक्ष्म खाद" : "Spray product";
  return { medicine, dose };
}

export type TipBucket = "do" | "dont" | "extra";

export function bucketFertilizerTip(line: string): TipBucket {
  const t = line.toLowerCase();
  if (
    /न\s*डालें|न\s*दें|कभी\s*न|avoid|never|don't|do not|एक\s*साथ|ज्यादा\s*(यूरिया|खाद)|excess|गलत/i.test(
      t
    )
  ) {
    return "dont";
  }
  if (
    /करें|दें|रखें|मिलाएँ|मिलाएं|follow|use|split|बाँट|मिट्टी\s*जाँच|निराई|नमी|पानी/i.test(t)
  ) {
    return "do";
  }
  return "extra";
}

/** Simple organic defaults when crop data is thin. */
export function defaultOrganicTipsHi(cropSlug: string): string[] {
  const base = [
    "गोबर की पकी खाद / वर्मीकंपोस्ट: बुवाई से 15–20 दिन पहले 2–3 ट्रॉली प्रति एकड़ मिलाएँ — मिट्टी में नमी बेहतर रहती है।",
    "जीवामृत: सिंचाई के साथ लगभग 200 लीटर प्रति एकड़ — मिट्टी के मित्र जीवाणु बढ़ते हैं।",
    "नीम खली: बुवाई पर 20–25 किग्रा प्रति एकड़ — कीट दबाव कम करने में मदद।",
  ];
  if (/soybean|moong|moongfali|pulses|groundnut|chana|masoor|urad|arhar/i.test(cropSlug)) {
    return [
      "राइजोबियम (या राइजोबियम + पीएसबी) बीज उपचार — दलहन/तिलहन में ज़रूरी।",
      ...base.slice(0, 2),
      "दलहन पर ज़्यादा यूरिया न डालें — जड़ गांठें कमज़ोर हो सकती हैं।",
    ];
  }
  return base;
}
