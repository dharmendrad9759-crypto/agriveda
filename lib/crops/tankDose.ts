/**
 * Knapsack hint for a field spray.
 * Uses the water volume written in the dose (e.g. 200 लीटर पानी).
 * If none is written, assumes 10 tanks of 15 L per acre (150 L).
 * Seed treatment, soil drench, and kilo-scale granules are handled with clear guidance.
 */

function formatQty(n: number): string {
  if (n >= 10) return String(Math.round(n));
  const one = Math.round(n * 10) / 10;
  return Number.isInteger(one) ? String(one) : one.toFixed(1);
}

export function tankDoseLine(dose: string): string | null {
  const raw = dose.replace(/\s+/g, " ").trim();
  if (!raw) return null;
  if (/बीज|seed|किलोग्राम\s*बीज|kg\s*seed/i.test(raw)) return null;
  if (/ड्रेंच|drench|मिट्टी/i.test(raw)) return null;

  const unitRe = "(मिलीलीटर|मिली|ml|ग्राम|g)";
  const perLitre = raw.match(
    new RegExp(
      `(\\d+(?:\\.\\d+)?)(?:\\s*[–\\-]\\s*(\\d+(?:\\.\\d+)?))?\\s*${unitRe}\\s*(?:प्रति|/)\\s*(?:लीटर|\\bL\\b)`,
      "i"
    )
  );
  if (perLitre) {
    const a = Number(perLitre[1]);
    const b = perLitre[2] ? Number(perLitre[2]) : a;
    const unitHi = /ग्राम|^g$/i.test(perLitre[3]) ? "ग्राम" : "मिली";
    const low = formatQty(a * 15);
    const high = formatQty(b * 15);
    const qtyStr = low === high ? low : `${low}–${high}`;
    return `15 लीटर टंकी में लगभग ${qtyStr} ${unitHi}`;
  }

  const amount = raw.match(
    new RegExp(
      `(\\d+(?:\\.\\d+)?)(?:\\s*[–\\-]\\s*(\\d+(?:\\.\\d+)?))?\\s*${unitRe}(?![A-Za-z\\u0900-\\u097F])`,
      "i"
    )
  );
  if (!amount) return null;
  if (!/एकड़|acre|\/\s*ac\b/i.test(raw)) return null;

  const a = Number(amount[1]);
  const b = amount[2] ? Number(amount[2]) : a;
  const mid = (a + b) / 2;
  if (!Number.isFinite(mid) || mid <= 0 || mid > 2000) return null;

  const water = raw.match(/(\d+(?:\.\d+)?)\s*लीटर\s*पानी/);
  const waterL = water ? Number(water[1]) : 150;
  if (!Number.isFinite(waterL) || waterL < 15) return null;

  const unitHi = /ग्राम|^g$/i.test(amount[3]) ? "ग्राम" : "मिली";
  const low = formatQty((a * 15) / waterL);
  const high = formatQty((b * 15) / waterL);
  const qtyStr = low === high ? low : `${low}–${high}`;
  return `15 लीटर टंकी में लगभग ${qtyStr} ${unitHi}`;
}

export type ApplicationMethod =
  | "soil_broadcast"     // रेत/बालू या खाद में मिलाकर खेत में बुरकाव (Broadcasting)
  | "seed_treatment"     // बुवाई से पूर्व बीज उपचार (Seed treatment)
  | "drench_irrigation"  // सिंचाई के पानी के साथ बहाना / जड़ों में ड्रेंचिंग
  | "poison_bait"        // चोकर + गुड़ + कीटनाशक चारा विधि
  | "trap_device"        // फेरोमोन / फलमक्खी ट्रैप
  | "foliar_spray";      // 15L स्प्रे टंकी से पत्तियों पर छिड़काव (Standard spray)

export interface DosePill {
  icon: string;
  label: string;
  value: string;
  subtext: string;
}

export interface ParsedFarmerDose {
  method: ApplicationMethod;
  methodLabel: string;
  isSpray: boolean;
  pill1: DosePill;
  pill2: DosePill;
  pill3: DosePill;
  useSticker: boolean;
  doctorTip: string;
  voiceActionLine: string;
  tankDose: string;
  acreDose: string;
  waterVolume: string;
  perLitre: string;
  raw: string;
}

export function parseFarmerDose(doseText: string): ParsedFarmerDose {
  const raw = doseText.replace(/\s+/g, " ").trim();

  // 1. Seed treatment check
  const isSeed = /बीज\s*उपचार|बीज\s*शोधन|seed\s*treatment|प्रति\s*कि(?:लो|ग्रा)\s*बीज|\/kg\s*seed/i.test(raw);
  if (isSeed) {
    const doseMatch =
      raw.match(/([\d.]+(?:\s*[-–से]\s*[\d.]+)?\s*(?:ग्राम|मिली|ml|g|किग्रा|kg)\s*(?:प्रति|\/)\s*कि(?:लो|ग्रा)\s*बीज)/i) ||
      raw.match(/([\d.]+(?:\s*[-–से]\s*[\d.]+)?\s*(?:ग्राम|मिली|ml|g)\s*(?:प्रति\s*किग्रा)?)/i);
    const doseVal = doseMatch ? doseMatch[0] : raw.split("(")[0].trim() || "2.5 से 3 ग्राम / किग्रा बीज";

    return {
      method: "seed_treatment",
      methodLabel: "बुवाई पूर्व बीज उपचार",
      isSpray: false,
      pill1: {
        icon: "🌰",
        label: "प्रयोग की विधि",
        value: "बीज उपचार",
        subtext: "बुवाई से 2 घंटे पूर्व",
      },
      pill2: {
        icon: "⚖️",
        label: "प्रति किलो बीज",
        value: doseVal,
        subtext: "बीज के वजन अनुसार",
      },
      pill3: {
        icon: "💧",
        label: "पानी की मात्रा",
        value: "हल्का पानी का छींटा",
        subtext: "छाया में सुखाकर बुवाई",
      },
      useSticker: false,
      doctorTip: "बुवाई से 2 घंटे पहले बीज पर हल्का लेप लगाएँ और छाया में सुखाकर बुवाई करें।",
      voiceActionLine: `प्रति किलो बीज में ${doseVal} दवा मिलाकर छाया में सुखाएँ, फिर बुवाई करें।`,
      tankDose: "बीज उपचार (स्प्रे नहीं)",
      acreDose: "बीज दर अनुसार",
      waterVolume: "हल्का पानी छींटा",
      perLitre: "लागू नहीं",
      raw,
    };
  }

  // 2. Soil / Sand Broadcast check (रेत/बालू में मिलाकर बुरकाव या दानेदार GR)
  const isBroadcast =
    /बालू|रेत|बखेर|बिखेर|बुरकाव|भुरकाव|broadcast|दानेदार|granule|\b(?:GR|CG|4G|3G|10G)\b|यूरिया\s*में\s*मिला/i.test(raw) &&
    !/पत्तियों\s*पर\s*स्प्रे|लीटर\s*पानी\s*में\s*घोलकर\s*स्प्रे/i.test(raw);

  if (isBroadcast) {
    const acreMatch = raw.match(
      /([\d.]+(?:\s*[-–से]\s*[\d.]+)?\s*(?:लीटर|किग्रा|किलो|kg|L|ग्राम|मिली|ml|g)\s*(?:प्रति|\/)?\s*एकड़)/i
    );
    const acreVal = acreMatch ? acreMatch[0] : (raw.split("(")[0].trim() || "1 लीटर / एकड़");
    const sandMatch = raw.match(/(\d+(?:\s*[-–से]\s*\d+)?\s*कि(?:लो|ग्रा)\s*(?:बालू|रेत|मिट्टी))/i);
    const sandVal = sandMatch ? sandMatch[0] : "20–25 किग्रा सूखी बालू/रेत";

    return {
      method: "soil_broadcast",
      methodLabel: "खेत में बुरकाव (Broadcasting)",
      isSpray: false,
      pill1: {
        icon: "🌿",
        label: "प्रयोग की विधि",
        value: "बालू/रेत में बुरकाव",
        subtext: "सीधे खेत में बिखेरें",
      },
      pill2: {
        icon: "🌾",
        label: "1 एकड़ दवा",
        value: acreVal,
        subtext: "कुल खेत का रकबा",
      },
      pill3: {
        icon: "💧",
        label: "सिंचाई की व्यवस्था",
        value: `${sandVal} में मिलाकर डालें`,
        subtext: "बुरकाव बाद तुरंत पानी दें",
      },
      useSticker: false,
      doctorTip: "पहली सिंचाई के समय एकसार बुरकाव करें ताकि जड़ क्षेत्र में कीटों का तुरंत खात्मा हो सके।",
      voiceActionLine: `इसे पहली सिंचाई से ठीक पहले खेत में एकसार बिखेरें और तुरंत पानी लगाएँ।`,
      tankDose: "बालू में बुरकाव",
      acreDose: acreVal,
      waterVolume: `${sandVal} + तुरंत सिंचाई`,
      perLitre: "लागू नहीं",
      raw,
    };
  }

  // 3. Soil Drenching / Canal Irrigation check (सिंचाई में बहाना / ड्रेंचिंग)
  const isDrench = /सिंचाई\s*के\s*साथ|पानी\s*के\s*साथ\s*बहा|ड्रेंच|drench|जड़ों\s*में\s*डाल/i.test(raw);
  if (isDrench) {
    const acreMatch = raw.match(
      /([\d.]+(?:\s*[-–से]\s*[\d.]+)?\s*(?:लीटर|मिली|किग्रा|kg|L|ml)\s*(?:प्रति|\/)?\s*एकड़)/i
    );
    const acreVal = acreMatch ? acreMatch[0] : "800–1000 मिली / एकड़";

    return {
      method: "drench_irrigation",
      methodLabel: "सिंचाई के पानी के साथ / ड्रेंचिंग",
      isSpray: false,
      pill1: {
        icon: "🚰",
        label: "प्रयोग की विधि",
        value: "पानी के साथ बहाएँ",
        subtext: "नाली या ड्रिप में",
      },
      pill2: {
        icon: "🌾",
        label: "1 एकड़ मात्रा",
        value: acreVal,
        subtext: "खेत की नाप",
      },
      pill3: {
        icon: "💧",
        label: "सिंचाई विधि",
        value: "पानी के बहाव के साथ छोड़ें",
        subtext: "जड़ों तक पहुँचेगा",
      },
      useSticker: false,
      doctorTip: "सिंचाई के पानी के साथ नाली में छोड़ें ताकि दवा सीधे जड़ों तक पहुँच सके।",
      voiceActionLine: `इसे सिंचाई के पानी के साथ नाली में बहाएँ ताकि दवा जड़ों तक पहुँच सके।`,
      tankDose: "सिंचाई के साथ (स्प्रे नहीं)",
      acreDose: acreVal,
      waterVolume: "सिंचाई का पानी",
      perLitre: "लागू नहीं",
      raw,
    };
  }

  // 3b. Trap Device check (फेरोमोन / फलमक्खी ट्रैप / चिपचिपे कार्ड)
  const isTrap = /trap|ल्योर|ट्रैप|चिपचिपे|स्टीकी|fly trap/i.test(raw);
  if (isTrap) {
    const trapCountMatch = raw.match(/(\d+(?:\s*[-–से]\s*\d+)?\s*ट्रैप)/i);
    const trapCount = trapCountMatch ? trapCountMatch[0] : "4–6 ट्रैप प्रति एकड़";

    return {
      method: "trap_device",
      methodLabel: "ट्रैप विधि (कीट आकर्षण व खात्मा)",
      isSpray: false,
      pill1: {
        icon: "🪤",
        label: "उपकरण प्रकार",
        value: "ट्रैप / ल्योर",
        subtext: "खेत में टांगें",
      },
      pill2: {
        icon: "🌾",
        label: "प्रति एकड़ संख्या",
        value: trapCount,
        subtext: "फसल से 1 फुट ऊपर",
      },
      pill3: {
        icon: "🎯",
        label: "प्रयोग विधि",
        value: "खेत में लगाएं",
        subtext: "कीटों की निगरानी व खात्मा",
      },
      useSticker: false,
      doctorTip: "ट्रैप को फसल की ऊंचाई से 1 फुट ऊपर लगाएं और समय-समय पर ल्यूर बदलते रहें।",
      voiceActionLine: `खेत में ${trapCount} लगाएं ताकि कीट आकर्षित होकर फंस जाएं।`,
      tankDose: "लागू नहीं (स्प्रे पंप में न भरें)",
      acreDose: trapCount,
      waterVolume: "पानी की आवश्यकता नहीं",
      perLitre: "लागू नहीं",
      raw,
    };
  }

  // 3c. Poison Bait check (चोकर + गुड़ चारा विधि)
  const isBait = /(?:चारा|गुड़|शीरा|चोकर|बेसन|bait)/i.test(raw) && !/लीटर\s*पानी\s*में\s*घोलकर\s*स्प्रे/i.test(raw);
  if (isBait) {
    return {
      method: "poison_bait",
      methodLabel: "चारा विधि (Poison Bait)",
      isSpray: false,
      pill1: {
        icon: "🪤",
        label: "प्रयोग की विधि",
        value: "चारा विधि",
        subtext: "ढेला बनाकर रखें",
      },
      pill2: {
        icon: "🥣",
        label: "मिश्रण सामग्री",
        value: "चोकर + गुड़ + दवा",
        subtext: "शाम के समय रखें",
      },
      pill3: {
        icon: "🌾",
        label: "प्रयोग क्षेत्र",
        value: "खेत में जगह-जगह रखें",
        subtext: "कीट आकर्षित होकर मरेंगे",
      },
      useSticker: false,
      doctorTip: "चोकर, गुड़ और कीटनाशक मिलाकर छोटे-छोटे ढेले बनाएं और शाम को खेत में पौधों के पास रखें।",
      voiceActionLine: "चोकर और गुड़ के साथ कीटनाशक मिलाकर शाम के समय खेत में जगह-जगह रखें।",
      tankDose: "लागू नहीं (स्प्रे पंप में न भरें)",
      acreDose: "10 किग्रा चोकर + 1 किग्रा गुड़",
      waterVolume: "हल्का पानी (गीला करने हेतु)",
      perLitre: "लागू नहीं",
      raw,
    };
  }

  // 4. Foliar Spray (पत्तियों पर 15L ढोलकी टंकी से छिड़काव)
  const unitRe = "(?:मिलीलीटर|मिली|ग्राम|ml|g)";
  const perLMatch = raw.match(
    new RegExp(
      `(\\d+(?:\\.\\d+)?)(?:\\s*[-–से]\\s*(\\d+(?:\\.\\d+)?))?\\s*${unitRe}\\s*(?:प्रति|/)\\s*(?:लीटर|L)(?:\\s*पानी)?`,
      "i"
    )
  );
  const perAcreMatch = raw.match(
    new RegExp(
      `(\\d+(?:\\.\\d+)?)(?:\\s*[-–से]\\s*(\\d+(?:\\.\\d+)?))?\\s*${unitRe}\\s*(?:प्रति|/)\\s*एकड़`,
      "i"
    )
  );
  const waterMatch = raw.match(/(\d+(?:\s*[-–से]\s*\d+)?\s*लीटर\s*पानी)/i);
  const waterVolume = waterMatch ? waterMatch[0] : "150–200 लीटर पानी";

  let tankDose = "";
  let acreDose = perAcreMatch ? perAcreMatch[0] : "";
  let perLitre = perLMatch ? perLMatch[0] : "";

  // Check for explicit per-tank dosage (e.g. "कॉपर: 35–40 ग्राम + स्ट्रेप्टो: 1.5–2 ग्राम प्रति 15L टंकी")
  const directTankMatch = raw.match(
    /(?:^|[(,])\s*([^\n();]+?)\s*(?:प्रति|\/)\s*(?:15\s*L|15\s*लीटर)?\s*टंकी/i
  );
  if (directTankMatch && directTankMatch[1]) {
    tankDose = directTankMatch[1].trim();
  }

  // Check for explicit combination acre dose inside parentheses, e.g. "(350 g + 18 g / एकड़)"
  const parenAcreMatch = raw.match(/\(([^)]*एकड़[^)]*)\)/i);
  if (parenAcreMatch && parenAcreMatch[1]) {
    acreDose = parenAcreMatch[1].trim();
  }

  if (!tankDose && perLMatch) {
    const a = Number(perLMatch[1]);
    const b = perLMatch[2] ? Number(perLMatch[2]) : a;
    const unitHi = /ग्राम|^g$/i.test(perLMatch[0]) ? "ग्राम" : "मिली";
    const low = formatQty(a * 15);
    const high = formatQty(b * 15);
    tankDose = low === high ? `${low} ${unitHi}` : `${low}–${high} ${unitHi}`;

    if (!acreDose) {
      acreDose = `${Math.round(a * 150)}–${Math.round(b * 200)} ${unitHi}/एकड़`;
    }
  }

  if (!tankDose && perAcreMatch && !raw.includes("+")) {
    const a = Number(perAcreMatch[1]);
    const b = perAcreMatch[2] ? Number(perAcreMatch[2]) : a;
    const unitHi = /ग्राम|^g$/i.test(perAcreMatch[0]) ? "ग्राम" : "मिली";
    const low = formatQty((a * 15) / 200);
    const high = formatQty((b * 15) / 150);
    tankDose = low === high ? `${low} ${unitHi}` : `${low}–${high} ${unitHi}`;

    if (!perLitre) {
      const perLValLow = (a / 200).toFixed(1);
      const perLValHigh = (b / 150).toFixed(1);
      perLitre = `${perLValLow}–${perLValHigh} ${unitHi}/लीटर`;
    }
  }

  if (!tankDose) {
    const line = tankDoseLine(raw);
    if (line) {
      const m = line.match(/लगभग\s*([\d.–\s]+(?:मिली|ग्राम))/i);
      tankDose = m ? m[1].trim() : line.replace(/^15 लीटर टंकी में लगभग\s*/, "");
    } else {
      tankDose = "15–20 मिली/ग्राम";
    }
  }

  if (!acreDose) {
    acreDose = "150–200 मिली/एकड़";
  }

  if (!perLitre) {
    perLitre = "1–2 मिली/लीटर";
  }

  return {
    method: "foliar_spray",
    methodLabel: "15L स्प्रे टंकी से पत्तियों पर छिड़काव",
    isSpray: true,
    pill1: {
      icon: "🎒",
      label: "15L स्प्रे टंकी",
      value: tankDose,
      subtext: "ढोलकी टंकी में नाप",
    },
    pill2: {
      icon: "🌾",
      label: "1 एकड़ दवा",
      value: acreDose,
      subtext: "कुल रकबा",
    },
    pill3: {
      icon: "🚰",
      label: "पानी की मात्रा",
      value: waterVolume,
      subtext: "10–12 स्प्रे टंकी",
    },
    useSticker: true,
    doctorTip: "स्प्रे करते समय 5ml सिलिकॉन स्टीकर (चिपको) ज़रूर मिलाएँ ताकि दवा पत्तों पर चिपक कर पूरा असर करे। सुबह 10 बजे से पहले या शाम को छिड़काव करें।",
    voiceActionLine: `15 लीटर वाली स्प्रे टंकी में ${tankDose} दवा घोलकर पत्तियों पर छिड़काव करें। दवा के साथ 5 मिली सिलिकॉन स्टीकर यानी चिपको ज़रूर मिलाएँ ताकि दवा पत्तों पर चिपक जाए। सुबह या शाम को ही स्प्रे करें।`,
    tankDose,
    acreDose,
    waterVolume,
    perLitre,
    raw,
  };
}
