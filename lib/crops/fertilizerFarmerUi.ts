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
  dosePerL: string;
  dosePerAcre: string;
  waterVolume: string;
  timing: string;
  isSoilBasal?: boolean;
  caution?: string;
  dose?: string; // backwards compatibility
};

/** Map raw foliar/micro lines into structured scientific ICAR cards */
export function toFoliarCards(
  rows: { name: string; detail: string }[],
  hi: boolean
): FoliarCard[] {
  const cards: FoliarCard[] = [];
  const seen = new Set<string>();

  for (const r of rows) {
    const raw = r.detail.trim();
    if (!raw) continue;
    // Skip warnings or non-product lines
    if (/^⚠️|चेतावनी|warning|सावधानी/i.test(raw)) continue;

    const key = raw.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const card = parseScientificFoliarCard(raw, r.name, hi);
    if (card) {
      cards.push(card);
    }
  }

  // If no cards were built, provide default ICAR foliar spray kit
  if (!cards.length) {
    cards.push({
      title: hi ? "पत्ती पीलापन / जिंक की कमी" : "Zinc Deficiency (Yellowing)",
      medicine: hi ? "चिलेटेड जिंक (Zn EDTA 12%)" : "Chelated Zinc (Zn EDTA 12%)",
      dosePerL: hi ? "1 ग्राम / लीटर पानी" : "1 g / L water",
      dosePerAcre: hi ? "150–200 ग्राम प्रति एकड़" : "150–200 g / acre",
      waterVolume: hi ? "150–200 लीटर पानी प्रति एकड़" : "150–200 L water / acre",
      timing: hi ? "पीलापन दिखते ही या कल्ले फूटते समय" : "At tillering or visible yellowing",
      caution: hi ? "सबसे सुरक्षित फोलियर स्प्रे — पत्तियां नहीं जलतीं" : "Safest foliar form — no burn risk",
      dose: hi ? "1 ग्राम/लीटर (150–200 g/एकड़)" : "1 g/L (150-200 g/acre)",
    });
    cards.push({
      title: hi ? "दाना भराव व परागण सुधार" : "Grain Fill & Pollination",
      medicine: hi ? "बोरॉन 20% (Solubor)" : "Boron 20% (Solubor)",
      dosePerL: hi ? "1 से 1.25 ग्राम / लीटर पानी" : "1–1.25 g / L water",
      dosePerAcre: hi ? "200–250 ग्राम प्रति एकड़" : "200–250 g / acre",
      waterVolume: hi ? "150–200 लीटर पानी प्रति एकड़" : "150–200 L water / acre",
      timing: hi ? "गभोट अवस्था (बाली/फूल निकलने से पूर्व)" : "Booting / pre-flowering",
      caution: hi ? "दाने का खोखलापन रोकता है और वजन बढ़ाता है" : "Prevents empty grains and adds weight",
      dose: hi ? "1.25 ग्राम/लीटर (200–250 g/एकड़)" : "1.25 g/L (200-250 g/acre)",
    });
  }

  return cards.slice(0, 8);
}

function parseScientificFoliarCard(
  detail: string,
  categoryName: string,
  hi: boolean
): FoliarCard | null {
  const t = `${categoryName} ${detail}`.toLowerCase();

  // 1. Zinc
  if (/zinc|जिंक|znso|zn\b/i.test(t)) {
    if (/चिलेटेड|chelated|edta/i.test(t)) {
      return {
        title: hi ? "पत्ती पीलापन / जिंक की कमी" : "Zinc Deficiency (Yellowing)",
        medicine: hi ? "चिलेटेड जिंक (Zn EDTA 12%)" : "Chelated Zinc (Zn EDTA 12%)",
        dosePerL: hi ? "1 ग्राम / लीटर पानी" : "1 g / L water",
        dosePerAcre: hi ? "150–200 ग्राम प्रति एकड़" : "150–200 g / acre",
        waterVolume: hi ? "150–200 लीटर पानी प्रति एकड़" : "150–200 L water / acre",
        timing: hi ? "पीलापन दिखते ही या कल्ले फूटने पर" : "At tillering or visible yellowing",
        caution: hi ? "सबसे सुरक्षित फोलियर स्प्रे — चूना मिलाने की आवश्यकता नहीं" : "Safest foliar form — no lime needed",
        dose: hi ? "1 ग्राम/L (150–200 g/एकड़)" : "1 g/L (150-200 g/acre)",
      };
    }
    if (/0\.5%|घोल|फोलियर|spray|छिड़काव/i.test(t) && !/10\s*kg.*बेसल/i.test(t)) {
      return {
        title: hi ? "सफेद कलिका व पीलापन (जिंक सल्फेट स्प्रे)" : "Zinc Sulphate Foliar Spray",
        medicine: hi ? "जिंक सल्फेट 21% + बुझा चूना" : "Zinc Sulphate 21% + Slaked Lime",
        dosePerL: hi ? "5 ग्राम जिंक + 2.5 ग्राम चूना / लीटर पानी" : "5 g Zn + 2.5 g lime / L water",
        dosePerAcre: hi ? "1 किग्रा जिंक सल्फेट + 500 ग्राम चूना प्रति एकड़" : "1 kg ZnSO4 + 500 g lime / acre",
        waterVolume: hi ? "200 लीटर पानी प्रति एकड़" : "200 L water / acre",
        timing: hi ? "CRI या कल्ले फूटते समय (पीलापन दिखने पर)" : "CRI or tillering stage",
        caution: hi ? "⚠️ चूना मिलाना अनिवार्य है ताकि पत्तियां न झुलसें" : "Must mix lime to prevent scorching",
        dose: hi ? "5 g/L जिंक + 2.5 g/L चूना (1 kg Zn/एकड़)" : "5 g/L Zn + lime (1 kg/acre)",
      };
    }
    // Basal soil zinc
    return {
      title: hi ? "मिट्टी में जिंक बेसल (DAP से अलग)" : "Soil Zinc Basal Application",
      medicine: hi ? "जिंक सल्फेट 21% या 33%" : "Zinc Sulphate 21% or 33%",
      dosePerL: hi ? "— (मिट्टी में बुरकाव)" : "— (Soil broadcast)",
      dosePerAcre: hi ? "21% जिंक 10 kg/एकड़ या 33% जिंक 6 kg/एकड़" : "21% Zn 10 kg/acre or 33% Zn 6 kg/acre",
      waterVolume: hi ? "लागू नहीं (मिट्टी में छिड़काव)" : "N/A (Soil broadcast)",
      timing: hi ? "खेत की अंतिम जुताई या पहली सिंचाई पर" : "Field prep or CRI irrigation",
      isSoilBasal: true,
      caution: hi ? "⚠️ ICAR नियम: DAP/SSP के साथ कभी मिलाकर न डालें" : "Never mix with DAP/SSP",
      dose: hi ? "10 किग्रा/एकड़ (21% Zn)" : "10 kg/acre (21% Zn)",
    };
  }

  // 2. Sulphur
  if (/sulphur|सल्फर|sulfur|gypsum|जिप्सम|बेंटोनाइट|गंधक/i.test(t)) {
    if (/gypsum|बेंटोनाइट|बेसल|धान-गेहूँ/i.test(t)) {
      return {
        title: hi ? "मिट्टी में गंधक (सल्फर) सुधार" : "Soil Sulphur Basal",
        medicine: hi ? "बेंटोनाइट सल्फर 90% दानेदार या जिप्सम" : "Bentonite Sulphur 90% or Gypsum",
        dosePerL: hi ? "— (मिट्टी में बुरकाव)" : "— (Soil broadcast)",
        dosePerAcre: hi ? "10 किग्रा बेंटोनाइट सल्फर या 100 किग्रा जिप्सम प्रति एकड़" : "10 kg bentonite or 100 kg gypsum / acre",
        waterVolume: hi ? "लागू नहीं (मिट्टी में डालें)" : "N/A (Soil broadcast)",
        timing: hi ? "बुवाई के समय या पहली सिंचाई पर" : "At sowing or 1st irrigation",
        isSoilBasal: true,
        caution: hi ? "तेल, चमक व प्रोटीन की मात्रा बढ़ाता है" : "Increases oil, shine & protein",
        dose: hi ? "10 kg/एकड़ (बेंटोनाइट)" : "10 kg/acre (bentonite)",
      };
    }
    return {
      title: hi ? "सल्फर (गंधक) फोलियर स्प्रे" : "Sulphur Foliar Spray",
      medicine: hi ? "घुलनशील सल्फर 80% WDG" : "Soluble Sulphur 80% WDG",
      dosePerL: hi ? "2 से 2.5 ग्राम / लीटर पानी" : "2–2.5 g / L water",
      dosePerAcre: hi ? "400–500 ग्राम प्रति एकड़" : "400–500 g / acre",
      waterVolume: hi ? "150–200 लीटर पानी प्रति एकड़" : "150–200 L water / acre",
      timing: hi ? "वानस्पतिक बढ़वार या पत्तियों पर पीलापन दिखने पर" : "Vegetative stage or visible chlorosis",
      caution: hi ? "फफूंद से सुरक्षा और पत्तों में हरियाली लाता है" : "Protects against fungi and boosts greening",
      dose: hi ? "2.5 g/L (500 g/एकड़)" : "2.5 g/L (500 g/acre)",
    };
  }

  // 3. Boron
  if (/boron|बोरॉन|बोरेक्स|borax/i.test(t)) {
    return {
      title: hi ? "दाना भराव व परागण सुधार" : "Grain Fill & Pollination",
      medicine: hi ? "बोरॉन 20% (Solubor / बोरेक्स)" : "Boron 20% (Solubor / Borax)",
      dosePerL: hi ? "1 से 1.25 ग्राम / लीटर पानी" : "1–1.25 g / L water",
      dosePerAcre: hi ? "200–250 ग्राम प्रति एकड़" : "200–250 g / acre",
      waterVolume: hi ? "150–200 लीटर पानी प्रति एकड़" : "150–200 L water / acre",
      timing: hi ? "गभोट अवस्था व बाली/फूल निकलने से पूर्व" : "Booting / pre-flowering stage",
      caution: hi ? "दाने का सिकुड़ना रोकता है और बाली में पूरा भराव करता है" : "Ensures complete grain filling",
      dose: hi ? "1.25 g/L (200–250 g/एकड़)" : "1.25 g/L (200-250 g/acre)",
    };
  }

  // 4. Manganese / Iron
  if (/mn|मैंगनीज|iron|आयरन|feso|लोहा/i.test(t)) {
    return {
      title: hi ? "मैंगनीज व लौह तत्व (पीलापन निवारण)" : "Manganese & Iron Correction",
      medicine: hi ? "मैंगनीज सल्फेट (MnSO₄ 0.5%) या फेरस सल्फेट 0.5%" : "Manganese Sulphate 0.5% or Ferrous Sulphate 0.5%",
      dosePerL: hi ? "5 ग्राम / लीटर पानी (0.5% घोल)" : "5 g / L water (0.5% solution)",
      dosePerAcre: hi ? "1 किग्रा प्रति एकड़" : "1 kg / acre",
      waterVolume: hi ? "200 लीटर पानी प्रति एकड़" : "200 L water / acre",
      timing: hi ? "CRI पहली सिंचाई व कल्ले फूटते समय" : "CRI and tillering stage",
      caution: hi ? "उच्च pH या रेतीली मिट्टी में पीली धारियां दिखने पर तुरंत स्प्रे करें" : "Spray immediately on sandy/high-pH soils",
      dose: hi ? "5 g/L (1 kg/एकड़)" : "5 g/L (1 kg/acre)",
    };
  }

  // 5. NPK 0:0:50 / Potash / Grain filling
  if (/0:0:50|दाना भर|पोटाश|दूधिया/i.test(t)) {
    return {
      title: hi ? "दाना भराव व वजन बढ़ाने हेतु" : "For Grain Fill & Weight",
      medicine: hi ? "घुलनशील पोटाश NPK 0:0:50 (पोटेशियम सल्फेट)" : "Soluble Potash NPK 0:0:50",
      dosePerL: hi ? "5 ग्राम / लीटर पानी" : "5 g / L water",
      dosePerAcre: hi ? "1 किग्रा प्रति एकड़" : "1 kg / acre",
      waterVolume: hi ? "150–200 लीटर पानी प्रति एकड़" : "150–200 L water / acre",
      timing: hi ? "दूधिया अवस्था व दाना भरने के समय" : "Milky / grain fill stage",
      caution: hi ? "दाने का आकार, वजन और चमक बढ़ाता है" : "Boosts grain size, weight and shine",
      dose: hi ? "5 g/L (1 kg/एकड़)" : "5 g/L (1 kg/acre)",
    };
  }

  // 6. NPK 0:52:34 / Booting
  if (/0:52:34|बाली|गभोट/i.test(t)) {
    return {
      title: hi ? "बाली विकास व मजबूत दाना हेतु" : "Earhead Development",
      medicine: hi ? "घुलनशील NPK 0:52:34 (MKP)" : "Soluble NPK 0:52:34 (MKP)",
      dosePerL: hi ? "5 ग्राम / लीटर पानी" : "5 g / L water",
      dosePerAcre: hi ? "1 किग्रा प्रति एकड़" : "1 kg / acre",
      waterVolume: hi ? "150–200 लीटर पानी प्रति एकड़" : "150–200 L water / acre",
      timing: hi ? "गभोट अवस्था (बाली निकलने से 7–10 दिन पहले)" : "Booting stage",
      caution: hi ? "तने को मजबूत बनाता है और बाली लंबी निकालता है" : "Strengthens stem and elongates earhead",
      dose: hi ? "5 g/L (1 kg/एकड़)" : "5 g/L (1 kg/acre)",
    };
  }

  // 7. General NPK 19:19:19 / Growth
  if (/19:19:19|20:20:20|हरियाली|ग्रोथ|growth|वानस्पतिक/i.test(t)) {
    return {
      title: hi ? "NPK 19-19-19 (वानस्पतिक बढ़वार)" : "NPK 19-19-19 (Vegetative Growth)",
      medicine: hi ? "घुलनशील NPK 19:19:19" : "Soluble NPK 19:19:19",
      dosePerL: hi ? "5 ग्राम / लीटर पानी" : "5 g / L water",
      dosePerAcre: hi ? "1 किग्रा प्रति एकड़" : "1 kg / acre",
      waterVolume: hi ? "150–200 लीटर पानी प्रति एकड़" : "150–200 L water / acre",
      timing: hi ? "बुवाई के 30–35 दिन बाद (शाखाएं व कल्ले फूटते समय)" : "30–35 days after sowing (tillering/branching)",
      caution: hi ? "टैंक मिश्रण: सूक्ष्म पोषक तत्व (जिंक EDTA/बोरॉन) या कीटनाशक मिला सकते हैं; खरपतवारनाशक या कॉपर कभी न मिलाएं" : "Can mix with micronutrients (Zinc/Boron) or insecticides; do not mix with herbicides or copper",
      dose: hi ? "5 g/L (1 kg/एकड़)" : "5 g/L (1 kg/acre)",
    };
  }

  // Fallback with realistic doses instead of "डिब्बे पर लिखी मात्रा"
  const doseMatch = detail.match(
    /(\d+(?:\.\d+)?\s*(?:[-–]\s*\d+(?:\.\d+)?)?\s*(?:g|ग्राम|किग्रा|kg|ml|मि\.?ली|%)[^\s,]*)/i
  );
  return {
    title: hi ? "पत्ती पर सूक्ष्म पोषक छिड़काव" : "Foliar Micronutrient Spray",
    medicine: detail.replace(doseMatch ? doseMatch[0] : "", "").trim() || (hi ? "सूक्ष्म पोषक मिश्रण" : "Micronutrient mixture"),
    dosePerL: doseMatch ? `${doseMatch[0]} / लीटर पानी` : (hi ? "1 से 2 ग्राम / लीटर पानी" : "1–2 g / L water"),
    dosePerAcre: hi ? "200 से 400 ग्राम प्रति एकड़" : "200–400 g / acre",
    waterVolume: hi ? "150–200 लीटर पानी प्रति एकड़" : "150–200 L water / acre",
    timing: hi ? "सुबह 9 बजे से पहले या शाम 4 बजे के बाद" : "Early morning or late afternoon",
    caution: hi ? "साफ़ पानी का प्रयोग करें" : "Use clean water",
    dose: doseMatch ? doseMatch[0] : (hi ? "2 g/L (300 g/एकड़)" : "2 g/L (300 g/acre)"),
  };
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
