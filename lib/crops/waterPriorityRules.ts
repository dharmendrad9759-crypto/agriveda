/**
 * Water Scarcity Priority Rules — "अगर पानी सिर्फ 1 या 2 ही बार मिले तो कब दें?"
 * Farmer-first, practical field agronomy rules matching Technical Kisan rigor.
 */

export interface WaterPriorityPlan {
  singleHi: string;
  singleEn: string;
  twoHi: string;
  twoEn: string;
  fullHi: string;
  fullEn: string;
}

const WATER_PRIORITY_BY_SLUG: Record<string, WaterPriorityPlan> = {
  wheat: {
    singleHi: "बुवाई के 20–25 दिन बाद (CRI / जड़ विकास अवस्था)। अगर यह पहला पानी छूट गया तो पौधे में कल्ले नहीं फूटेंगे और पैदावार सीधे 30–35% गिर जाएगी।",
    singleEn: "At 20–25 days (CRI stage). Missing this cuts tillering and drops yield by 30–35%.",
    twoHi: "पहला: जड़ विकास अवस्था (20–25 दिन) + दूसरा: बाली व दूधिया दाना अवस्था (80–85 दिन)।",
    twoEn: "1st: CRI (20–25d) + 2nd: Heading & Milking stage (80–85d).",
    fullHi: "कुल 4–5 हल्की सिंचाइयां: जड़ विकास (20–25 दिन), कल्ले फूटना (40–45 दिन), गांठ बनना (60–65 दिन), फूल/बाली (75–80 दिन) और दूधिया दाना भराव (85–100 दिन)।",
    fullEn: "4–5 light irrigations: CRI (20–25d), tillering (40–45d), jointing (60–65d), flowering (75–80d), and milking/grain fill (85–100d).",
  },
  mustard: {
    singleHi: "बुवाई के 25–30 दिन बाद (शाखाएँ निकलते समय)। पूरे सीज़न की यही सबसे महत्वपूर्ण सिंचाई है जो फलियों और शाखाओं की संख्या तय करती है।",
    singleEn: "At 25–30 days (Branching stage). This determines branch and siliqua count.",
    twoHi: "पहला: शाखा निकलते समय (25–30 दिन) + दूसरा: फलियों में दाना भरते समय (65–75 दिन)।",
    twoEn: "1st: Branching (25–30d) + 2nd: Siliqua filling (65–75d).",
    fullHi: "कुल 2–3 सिंचाइयां। ध्यान दें: जब खेत में पीला फूल पूरा खिला हो, तब ऊपर से फव्वारा सिंचाई न करें, वरना सफेद रतुआ फैलता है।",
    fullEn: "2–3 irrigations. Avoid overhead sprinkler at peak bloom to prevent white rust.",
  },
  potato: {
    singleHi: "रोपाई के 30–35 दिन बाद (कंद बनना शुरू होने पर)। इस समय नमी का तनाव कंदों की संख्या कम कर देता है, जो बाद में किसी पानी से पूरी नहीं होती।",
    singleEn: "At 30–35 days (Tuber initiation). Moisture stress now permanently limits tuber count.",
    twoHi: "पहला: कंद बनना शुरू (30–35 दिन) + दूसरा: कंद का फैलाव/फूलना (55–65 दिन)।",
    twoEn: "1st: Tuber initiation (30–35d) + 2nd: Tuber bulking (55–65d).",
    fullHi: "हर 7–10 दिन पर हल्की सिंचाई (पानी केवल मेड़ की 2/3 ऊंचाई तक)। खुदाई से 10–12 दिन पहले सिंचाई पूरी तरह बंद करें।",
    fullEn: "Every 7–10 days light irrigation (2/3 ridge height). Stop 10–12 days before digging.",
  },
  maize: {
    singleHi: "बुवाई के 50–60 दिन बाद जब भुट्टे में मूंछ (सिल्क) निकल रही हो। इस समय का सूखा परागण रोक देता है और भुट्टा बिना दानों के खाली रह जाता है।",
    singleEn: "At 50–60 days (Silking stage). Drought now prevents pollination and leaves cobs empty.",
    twoHi: "पहला: घुटने बराबर ऊंचाई (30–35 दिन) + दूसरा: मूंछ व नर मंजरी निकलते समय (50–60 दिन)।",
    twoEn: "1st: Knee-high (30–35d) + 2nd: Silking/Tasseling (50–60d).",
    fullHi: "कुल 4–5 हल्की सिंचाइयां। मक्के के खेत में कभी पानी भरकर न छोड़ें; 24 घंटे का जलभराव भी जड़ों को गला देता है।",
    fullEn: "4–5 light irrigations. Never let standing water remain for over 24 hours.",
  },
  cotton: {
    singleHi: "बुवाई के 65–75 दिन बाद (फूल आने और टिंडे बनने की शुरुआत पर)। इस समय पानी मिलने से टिंडे झड़ने से बचते हैं।",
    singleEn: "At 65–75 days (Flowering and early boll formation) to prevent boll drop.",
    twoHi: "पहला: कली (स्क्वेयर) बनते समय (45–50 दिन) + दूसरा: टिंडे बढ़ते समय (80–90 दिन)।",
    twoEn: "1st: Square formation (45–50d) + 2nd: Boll development (80–90d).",
    fullHi: "कुल 3–4 सिंचाइयां। ज्यादा पानी देने से पौधा अनियंत्रित लंबा होता है और टिंडे कम लगते हैं; हमेशा हल्की सिंचाई करें।",
    fullEn: "3–4 light irrigations. Overwatering causes vegetative excess and lowers boll load.",
  },
  chana: {
    singleHi: "बुवाई के 40–45 दिन बाद (शाखाएँ निकलते समय, फूल आने से ठीक पहले)।",
    singleEn: "At 40–45 days (Pre-flowering branching stage).",
    twoHi: "पहला: फूल आने से ठीक पहले (40–45 दिन) + दूसरा: फली में दाना भरते समय (75–80 दिन)।",
    twoEn: "1st: Pre-flowering (40–45d) + 2nd: Pod filling (75–80d).",
    fullHi: "चने में सामान्यतः 1–2 हल्की सिंचाइयां ही पर्याप्त होती हैं। कड़ा नियम: फूल खिलते समय भारी बाढ़ (फ्लड) सिंचाई कभी न दें वरना फूल झड़ जाते हैं; गंभीर सूखे में ही अत्यंत हल्की या स्प्रिंकलर सिंचाई करें।",
    fullEn: "Usually 1–2 light irrigations suffice. STRICT: Avoid heavy flood irrigation during peak bloom to prevent flower drop; provide light sprinkler only under extreme drought.",
  },
  paddy: {
    singleHi: "बाली व फूल निकलते समय (Heading & Flowering, 75–85 दिन)। इस समय पानी का तनाव होने पर परागण रुक जाता है और दाने में चावल नहीं भरता (पोचा/बांझ बाली बनती है)।",
    singleEn: "At heading & flowering stage (75–85 days after transplanting) to prevent floret sterility and chaffy grains.",
    twoHi: "पहला: कल्ले फूटते समय (रोपाई के 20–25 दिन) + दूसरा: बाली व फूल निकलते समय (Heading & Flowering, 75–85 दिन; गभोट 55–65 दिन के बाद)।",
    twoEn: "1st: Active tillering (20–25d) + 2nd: Heading & Flowering (75–85d; after panicle initiation at 55–65d).",
    fullHi: "शुरुआती 15 दिन बाद AWD (गीला-सूखा) तरीका अपनाएं; ध्यान दें: गभोट (55–65 दिन) और बाली-फूल निकलने (75–85 दिन) के समय खेत को बिल्कुल सूखने न दें और 2–5 सेमी पानी बनाए रखें।",
    fullEn: "Follow AWD after first 15 days; maintain 2–5 cm standing water continuously during panicle initiation (55–65d) and heading/flowering (75–85d) to prevent sterility.",
  },
  tomato: {
    singleHi: "रोपाई के 25–30 दिन बाद जब पौधों पर पहला फूल आ रहा हो।",
    singleEn: "At 25–30 days (First flowering stage).",
    twoHi: "पहला: फूल आने पर (30 दिन) + दूसरा: फलों का आकार बढ़ते समय (55–60 दिन)।",
    twoEn: "1st: Flowering (30d) + 2nd: Fruit sizing (55–60d).",
    fullHi: "हर 5–7 दिन पर हल्की सिंचाई (ड्रिप या नाली)। खेत को बहुत सूखा रखकर अचानक भारी पानी न दें, वरना फल फट जाते हैं।",
    fullEn: "Every 5–7 days light moisture. Never flood after dry spell to avoid fruit cracking.",
  },
  onion: {
    singleHi: "रोपाई के 40–50 दिन बाद जब जमीन के नीचे गाँठ (बल्ब) बनना शुरू हो रही हो।",
    singleEn: "At 40–50 days (Bulb initiation stage).",
    twoHi: "पहला: गाँठ बनना शुरू होने पर (Bulb initiation, 40–50 दिन) + दूसरा: गाँठ का आकार बढ़ते समय (Bulb sizing, 65–75 दिन)।",
    twoEn: "1st: Bulb initiation (40–50d) + 2nd: Bulb sizing/enlargement (65–75d).",
    fullHi: "हर 8–10 दिन पर हल्की सिंचाई। खुदाई से 10–15 दिन पहले पानी पूरी तरह बंद कर दें ताकि प्याज भंडारण में सड़े नहीं।",
    fullEn: "Every 8–10 days light irrigation. Stop 10–15 days before harvest for storage life.",
  },
  sugarcane: {
    singleHi: "गर्मी के महीनों में (मई-जून) जब पौधे में कल्ले फूट रहे हों और तेज धूप हो।",
    singleEn: "Peak summer (May–June) tillering stage.",
    twoHi: "पहला: कल्ले फूटने पर (मई) + दूसरा: गन्ने की बढ़वार (जुलाई-अगस्त, बारिश में गैप आने पर)।",
    twoEn: "1st: Tillering (May) + 2nd: Grand growth (July–August rain gaps).",
    fullHi: "गर्मी में हर 10–12 दिन और सर्दियों में 20–25 दिन पर सिंचाई करें। कटाई से 15 दिन पहले पानी बंद करें।",
    fullEn: "Every 10–12 days in summer, 20–25 days in winter. Stop 15 days before cut.",
  },
  soybean: {
    singleHi: "फली में दाना भरते समय (रोपाई के 55–65 दिन बाद)। इस समय सूखा पड़ने पर दाना सिकुड़ जाता है।",
    singleEn: "At pod filling (55–65d). Drought now causes shrivelled seeds.",
    twoHi: "पहला: फूल आने की शुरुआत (35–40 दिन) + दूसरा: दाना भराव (60–65 दिन)।",
    twoEn: "1st: Flowering (35–40d) + 2nd: Pod fill (60–65d).",
    fullHi: "बरसाती फसल है, लेकिन बारिश में 12–15 दिन का सूखा पड़े तभी जीवनरक्षक सिंचाई करें। जलभराव कभी न होने दें।",
    fullEn: "Rainfed crop; give protective irrigation only if rain gap exceeds 12–15 days.",
  },
};

export function getWaterPriorityPlan(cropSlug: string): WaterPriorityPlan | null {
  const clean = cropSlug.toLowerCase().trim();
  if (WATER_PRIORITY_BY_SLUG[clean]) return WATER_PRIORITY_BY_SLUG[clean];
  if (clean === "rice" || clean === "dhaan") return WATER_PRIORITY_BY_SLUG.paddy;
  if (clean === "gehu") return WATER_PRIORITY_BY_SLUG.wheat;
  if (clean === "sarson") return WATER_PRIORITY_BY_SLUG.mustard;
  if (clean === "aalu") return WATER_PRIORITY_BY_SLUG.potato;
  if (clean === "makka") return WATER_PRIORITY_BY_SLUG.maize;
  if (clean === "tamatar") return WATER_PRIORITY_BY_SLUG.tomato;
  if (clean === "pyaj") return WATER_PRIORITY_BY_SLUG.onion;
  return null;
}
