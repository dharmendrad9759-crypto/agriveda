/**
 * Farmer-facing helpers for the crop fertilizer tab (Hindi-first, bag-friendly).
 */

const FERT_IMG = "/images/fertilizer";

/** Product / tip photos for schedule, foliar, organic, bag tabs. */
export function fertilizerProductImage(name: string): string {
  const t = name.toLowerCase();
  if (/dap|डीएपी|12\s*:\s*61/.test(t)) return `${FERT_IMG}/fert-bag-dap.webp`;
  if (/urea|यूरिया|कैल्शियम\s*नाइट्रेट|calcium\s*nitrate|अमोनियम/.test(t))
    return `${FERT_IMG}/fert-bag-urea.webp`;
  if (/mop|एमओपी|पोटाश|potash|sop|00\s*:\s*00\s*:\s*50|13\s*:\s*00\s*:\s*45/.test(t))
    return `${FERT_IMG}/fert-bag-mop.webp`;
  if (/zinc|जिंक|znso|zn\b|फेरस|iron|मैग्नीशियम|mgso4/.test(t))
    return `${FERT_IMG}/fert-bag-zinc.webp`;
  if (/gypsum|जिप्सम|सल्फर|sulphur|बेंटोनाइट/.test(t))
    return `${FERT_IMG}/fert-bag-gypsum.webp`;
  if (/ssp|एसएसपी|tsp|टीएसपी|10\s*:\s*26\s*:\s*26/.test(t))
    return `${FERT_IMG}/fert-bag-dap.webp`;
  if (/borax|बोरेक्स|boron|बोरॉन|00\s*:\s*52\s*:\s*34/.test(t))
    return `${FERT_IMG}/fert-foliar-cob.webp`;
  if (/19\s*:\s*19|20\s*:\s*20|घुलनशील|npk|स्प्रे|लिक्विड|अमीनो/.test(t))
    return `${FERT_IMG}/fert-foliar-green.webp`;
  if (/गोबर|वर्मी|नीम|माइकोराइजा|ह्यूमिक|जाइम|सागरिका|राइजोबियम|ट्राइकोडर्मा/.test(t))
    return `${FERT_IMG}/fert-organic-compost.webp`;
  return `${FERT_IMG}/fert-bag-urea.webp`;
}

export function foliarCardImage(title: string, medicine: string): string {
  const t = `${title} ${medicine}`.toLowerCase();
  if (/zinc|जिंक|पीला|yellow|सफ़ेद\s*कलिका/.test(t)) {
    return `${FERT_IMG}/fert-foliar-yellow-leaf.webp`;
  }
  if (/boron|बोरॉन|बोरेक्स|दाने|cob|परागण|grain|00:52:34/.test(t)) {
    return `${FERT_IMG}/fert-foliar-cob.webp`;
  }
  if (/19\s*:\s*19|हरियाली|green|ग्रोथ|growth|npk/.test(t)) {
    return `${FERT_IMG}/fert-foliar-green.webp`;
  }
  if (/iron|आयरन|पीली|फेरस/.test(t)) return `${FERT_IMG}/fert-foliar-yellow-leaf.webp`;
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

/** Split "DAP: 55 किग्रा + MOP (पोटाश): 25 किग्रा + माइकोराइजा: 4 किग्रा" into product lines. */
export function parseFertilizerApplyLine(apply: string): { name: string; dose: string }[] {
  const cleaned = apply.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];

  const parts = cleaned
    .split(/\s*[+·•|]\s*/)
    .map((p) => p.trim())
    .filter(Boolean);

  const out: { name: string; dose: string }[] = [];
  for (const part of parts) {
    // Prefer explicit "Name: Dose" format first
    const colonIdx = part.lastIndexOf(": ");
    if (colonIdx > 0) {
      const left = part.slice(0, colonIdx).trim();
      const right = part.slice(colonIdx + 2).trim();
      if (/\d/.test(right)) {
        out.push({ name: left, dose: withBagHint(right) });
        continue;
      }
    }

    const m = part.match(
      /^(.+?)\s+([\d.]+(?:-[\d.]+)?)\s*(किग्रा|kg|g|ग्राम|ml|मि\.?ली|L|लीटर|टन)?(.*)$/i
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
  if (/बोरी|\/पेड़|\/पौधा/.test(rest)) return dose;

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
      medicine: hi ? "NPK 00:52:34 + बोरॉन 20%" : "NPK 00:52:34 + Boron 20%",
      dosePerL: hi ? "5 ग्राम NPK + 1 ग्राम बोरॉन / लीटर पानी" : "5 g NPK + 1 g Boron / L water",
      dosePerAcre: hi ? "1 किग्रा NPK 00:52:34 + 150 ग्राम बोरॉन प्रति एकड़" : "1 kg 00:52:34 + 150 g Boron / acre",
      waterVolume: hi ? "150 लीटर पानी प्रति एकड़" : "150 L water / acre",
      timing: hi ? "गभोट अवस्था / फूल-दाने बनते समय" : "Booting / flowering & grain setting",
      caution: hi ? "पोलिनेशन बढ़ाता है और खाली दाने/फल गिरना रोकता है" : "Prevents flower drop and empty grains",
      dose: hi ? "1 kg 00:52:34 + 150 g बोरॉन/एकड़" : "1 kg 00:52:34 + 150 g Boron/acre",
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
        waterVolume: hi ? "150 लीटर पानी प्रति एकड़" : "150 L water / acre",
        timing: hi ? "पीलापन दिखते ही या गभोट अवस्था पर" : "At booting or visible yellowing",
        caution: hi ? "DAP/NPK स्प्रे के साथ सुरक्षित — चूना मिलाने की आवश्यकता नहीं" : "Safest foliar form — no lime needed",
        dose: hi ? "1 ग्राम/L (150 g/एकड़)" : "1 g/L (150 g/acre)",
      };
    }
    if (/0\.5%|घोल|फोलियर|spray|छिड़काव/i.test(t) && !/बेसल|टॉप/i.test(t)) {
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
    // Basal/Top-dressing soil zinc
    return {
      title: hi ? "मिट्टी में जिंक (DAP से अलग या पहली यूरिया में)" : "Soil Zinc Application",
      medicine: hi ? "जिंक सल्फेट 33% (5–6 kg) या 21% (8–10 kg)" : "Zinc Sulphate 33% or 21%",
      dosePerL: hi ? "— (मिट्टी / यूरिया कोटिंग)" : "— (Soil / Urea coating)",
      dosePerAcre: hi ? "33% जिंक: 5–6 किग्रा/एकड़ या 21% जिंक: 8–10 किग्रा/एकड़" : "33% Zn 5–6 kg/acre or 21% Zn 8–10 kg/acre",
      waterVolume: hi ? "लागू नहीं (मिट्टी में डालें)" : "N/A (Soil application)",
      timing: hi ? "पहली यूरिया के साथ या बुवाई में DAP से अलग" : "With 1st Urea or separate from DAP",
      isSoilBasal: true,
      caution: hi ? "⚠️ गोल्डन नियम: DAP/SSP के साथ सामान्य जिंक सल्फेट कभी मिलाकर न डालें (पत्थर बन जाता है)" : "Never mix normal ZnSO4 with DAP/SSP",
      dose: hi ? "5–6 किग्रा/एकड़ (33% Zn)" : "5–6 kg/acre (33% Zn)",
    };
  }

  // 2. Sulphur
  if (/sulphur|सल्फर|sulfur|gypsum|जिप्सम|बेंटोनाइट|गंधक/i.test(t)) {
    if (/gypsum|बेंटोनाइट|बेसल|मिट्टी|यूरिया/i.test(t)) {
      return {
        title: hi ? "मिट्टी में सल्फर (WDG / बेंटोनाइट / जिप्सम)" : "Soil Sulphur Application",
        medicine: hi ? "सल्फर 80-90% WDG (3–5 kg) या बेंटोनाइट सल्फर (10 kg)" : "Sulphur WDG or Bentonite Sulphur",
        dosePerL: hi ? "— (मिट्टी / यूरिया के साथ)" : "— (Soil / with Urea)",
        dosePerAcre: hi ? "सल्फर WDG 3–5 किग्रा या बेंटोनाइट सल्फर 10 किग्रा/एकड़" : "3–5 kg WDG or 10 kg Bentonite / acre",
        waterVolume: hi ? "लागू नहीं (मिट्टी में डालें)" : "N/A (Soil broadcast)",
        timing: hi ? "बुवाई के समय या पहली यूरिया के साथ" : "At sowing or with 1st Urea",
        isSoilBasal: true,
        caution: hi ? "तेल, तीखापन, चमक व पीलापन दूर करने में बेहद असरदार" : "Increases oil, pungency & greening",
        dose: hi ? "3–5 किग्रा/एकड़ (WDG)" : "3–5 kg/acre (WDG)",
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
      title: hi ? "परागण, फूल ठहराव व दाना/फल भराव" : "Pollination & Fruit/Grain Setting",
      medicine: hi ? "बोरॉन 20% (Solubor) + NPK 00:52:34" : "Boron 20% + NPK 00:52:34",
      dosePerL: hi ? "1 ग्राम बोरॉन + 5 ग्राम 00:52:34 / लीटर पानी" : "1 g Boron + 5 g 00:52:34 / L water",
      dosePerAcre: hi ? "100–150 ग्राम बोरॉन 20% + 1 किग्रा 00:52:34 प्रति एकड़" : "100–150 g Boron + 1 kg 00:52:34 / acre",
      waterVolume: hi ? "150 लीटर पानी प्रति एकड़" : "150 L water / acre",
      timing: hi ? "फूल/बाली निकलते समय और फल बनते समय" : "Flowering / heading stage",
      caution: hi ? "फल फटना रोकता है, पोलिनेशन बढ़ाता है और खाली दाने रोकता है" : "Prevents fruit cracking and empty grains",
      dose: hi ? "100–150 g बोरॉन/एकड़ (150L पानी)" : "100–150 g/acre",
    };
  }

  // 4. Manganese / Iron
  if (/mn|मैंगनीज|iron|आयरन|feso|लोहा|फेरस/i.test(t)) {
    return {
      title: hi ? "लौह तत्व व मैंगनीज (पीलापन निवारण)" : "Iron & Manganese Correction",
      medicine: hi ? "फेरस सल्फेट (FeSO₄) या मैंगनीज सल्फेट" : "Ferrous Sulphate or Manganese Sulphate",
      dosePerL: hi ? "2.5 से 5 ग्राम / लीटर पानी" : "2.5–5 g / L water",
      dosePerAcre: hi ? "स्प्रे: 500 g–1 kg/एकड़ | बेसल: 5 किग्रा/एकड़" : "Spray: 500g–1kg | Basal: 5 kg/acre",
      waterVolume: hi ? "150–200 लीटर पानी प्रति एकड़" : "150–200 L water / acre",
      timing: hi ? "नई पत्तियों में पीलापन दिखने पर" : "When upper leaves show yellowing",
      caution: hi ? "चूने वाली या काली मिट्टी में लोहे की कमी दूर करता है" : "Corrects iron chlorosis in calcareous soils",
      dose: hi ? "500 g–1 kg/एकड़ स्प्रे" : "500 g–1 kg/acre",
    };
  }

  // 5. NPK 00:00:50 or 13:00:45 / Potash / Grain & Fruit filling
  if (/0:0:50|00:00:50|13:00:45|दाना भर|पोटाश|दूधिया|चमक/i.test(t)) {
    return {
      title: hi ? "दाना/फल का वजन, मिठास और चमक बढ़ाने हेतु" : "For Grain/Fruit Weight & Shine",
      medicine: hi ? "NPK 00:00:50 (पोटेशियम सल्फेट) या NPK 13:00:45" : "NPK 00:00:50 or NPK 13:00:45",
      dosePerL: hi ? "5 से 6.5 ग्राम / लीटर पानी" : "5–6.5 g / L water",
      dosePerAcre: hi ? "1 किग्रा प्रति एकड़" : "1 kg / acre",
      waterVolume: hi ? "150–200 लीटर पानी प्रति एकड़" : "150–200 L water / acre",
      timing: hi ? "दूधिया अवस्था / दाना या फल/कंद फूलते समय" : "Milky / fruit & tuber bulking stage",
      caution: hi ? "दाने का टेस्ट वेट (Test Weight), आकार और बाजार भाव बढ़ाता है" : "Boosts test weight, size and shine",
      dose: hi ? "1 किग्रा/एकड़ (150L पानी)" : "1 kg/acre (150L water)",
    };
  }

  // 6. NPK 00:52:34 / Booting & Flowering
  if (/0:52:34|00:52:34|12:61:00|बाली|गभोट/i.test(t)) {
    return {
      title: hi ? "बाली/फूल विकास व जड़ मजबूती हेतु" : "Flowering & Root Development",
      medicine: hi ? "घुलनशील NPK 00:52:34 (MKP) या 12:61:00 (MAP)" : "Soluble NPK 00:52:34 or 12:61:00",
      dosePerL: hi ? "5 से 6.5 ग्राम / लीटर पानी" : "5–6.5 g / L water",
      dosePerAcre: hi ? "1 किग्रा प्रति एकड़ (स्प्रे) | 2–3 किग्रा (ड्रेंचिंग)" : "1 kg/acre (Spray) | 2–3 kg (Drench)",
      waterVolume: hi ? "150–200 लीटर पानी प्रति एकड़" : "150–200 L water / acre",
      timing: hi ? "गभोट अवस्था व फूल आने से पहले" : "Booting / pre-flowering stage",
      caution: hi ? "अनावश्यक वानस्पतिक बढ़वार रोककर फूल और दाने में ताकत लगाता है" : "Redirects energy to flowering & fruiting",
      dose: hi ? "1 किग्रा/एकड़ स्प्रे" : "1 kg/acre spray",
    };
  }

  // 7. General NPK 19:19:19 / Growth
  if (/19:19:19|20:20:20|हरियाली|ग्रोथ|growth|वानस्पतिक/i.test(t)) {
    return {
      title: hi ? "NPK 19:19:19 (शुरुआती बढ़वार व झंडा पत्ती)" : "NPK 19:19:19 (Vegetative Growth)",
      medicine: hi ? "घुलनशील NPK 19:19:19" : "Soluble NPK 19:19:19",
      dosePerL: hi ? "5 से 6.5 ग्राम / लीटर पानी" : "5–6.5 g / L water",
      dosePerAcre: hi ? "1 किग्रा प्रति एकड़" : "1 kg / acre",
      waterVolume: hi ? "150 लीटर पानी प्रति एकड़" : "150 L water / acre",
      timing: hi ? "वानस्पतिक अवस्था या गभोट अवस्था से पूर्व" : "Vegetative / pre-booting stage",
      caution: hi ? "चिलेटेड जिंक EDTA (150 g) के साथ मिलाकर स्प्रे करने से झंडा पत्ती चौड़ी और हरी रहती है" : "Can mix with Chelated Zinc EDTA (150 g)",
      dose: hi ? "1 किग्रा/एकड़ (150L पानी)" : "1 kg/acre (150L water)",
    };
  }

  const doseMatch = detail.match(
    /(\d+(?:\.\d+)?\s*(?:[-–]\s*\d+(?:\.\d+)?)?\s*(?:g|ग्राम|किग्रा|kg|ml|मि\.?ली|%)[^\s,]*)/i
  );
  return {
    title: hi ? "पत्ती पर पोषक छिड़काव" : "Foliar Nutrient Spray",
    medicine: detail.replace(doseMatch ? doseMatch[0] : "", "").trim() || (hi ? "सूक्ष्म पोषक मिश्रण" : "Micronutrient mixture"),
    dosePerL: doseMatch ? `${doseMatch[0]}` : (hi ? "2 से 5 ग्राम / लीटर पानी" : "2–5 g / L water"),
    dosePerAcre: hi ? "150 ग्राम से 1 किग्रा प्रति एकड़" : "150 g–1 kg / acre",
    waterVolume: hi ? "150–200 लीटर पानी प्रति एकड़" : "150–200 L water / acre",
    timing: hi ? "सुबह 9 बजे से पहले या शाम 4 बजे के बाद" : "Early morning or late afternoon",
    caution: hi ? "साफ़ पानी का प्रयोग करें" : "Use clean water",
    dose: doseMatch ? doseMatch[0] : (hi ? "150L पानी में स्प्रे" : "150L water spray"),
  };
}

export type TipBucket = "do" | "dont" | "extra";

export function bucketFertilizerTip(line: string): TipBucket {
  const t = line.toLowerCase();
  if (
    /न\s*डालें|न\s*दें|कभी\s*न|न\s*मिलाएं|avoid|never|don't|do not|एक\s*साथ|ज्यादा\s*(यूरिया|खाद)|excess|गलत/i.test(
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
    "माइकोराइजा (Mycorrhiza - 4 किग्रा/एकड़) + ह्यूमिक एसिड (500 ग्राम/एकड़): बुवाई या पहली सिंचाई पर देने से जड़ों का गहरा विकास होता है और मिट्टी में पड़ा लॉक फास्फोरस पौधे को मिलता है।",
    "गोबर की पकी खाद / वर्मीकंपोस्ट: बुवाई से 15–20 दिन पहले 2–3 ट्रॉली प्रति एकड़ (ट्राइकोडर्मा 1–2 किग्रा मिलाकर) डालें — जड़ गलन व उकठा रोग से बचाव होता है।",
    "नीम खली (Neem Cake): कंद व सब्जी फसलों में बुवाई पर 40–50 किग्रा प्रति एकड़ — जमीन के कीड़ों और निमेटोड का प्रकोप कम होता है।",
  ];
  if (/soybean|moong|moongfali|pulses|groundnut|chana|masoor|urad|arhar/i.test(cropSlug)) {
    return [
      "राइजोबियम + पीएसबी (Rhizobium + PSB) कल्चर से बीज उपचार — दलहन/तिलहन में जड़ों की नाइट्रोजन गांठें (Nodules) सक्रिय करने के लिए ज़रूरी।",
      ...base.slice(0, 2),
      "दलहन फसलों में फूल आते समय यूरिया बिल्कुल न डालें — अन्यथा पौधा सिर्फ बढ़ेगा (Rank growth) और फलियां नहीं लगेंगी।",
    ];
  }
  return base;
}
