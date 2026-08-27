/**
 * Field-note wording for fertilizer tab — short farmer Hindi, product names farmers know.
 */

export function simplifyFertilizerNoteHi(raw: string): string {
  if (!raw) return "";
  let t = raw.replace(/\s+/g, " ").trim();

  // Drop "Split:" / English prefixes
  t = t.replace(/^Split:\s*/i, "").replace(/^Note:\s*/i, "");

  const phrases: [RegExp, string][] = [
    [
      /बढ़वार टॉनिक\/PGR कल्लों का जादू नहीं[^.।]*[।.]?/gi,
      "बढ़वार वाली दवा से कल्ले जादू से नहीं बढ़ते। सही बीज, समय पर यूरिया–जिंक और सही पानी सबसे ज़रूरी है।",
    ],
    [
      /GA₃ केवल विशेष स्थिति[^।]*[।.]?/gi,
      "सामान्य खेती में बढ़वार हार्मोन (GA₃) की ज़रूरत नहीं। सिर्फ खास काम (जैसे बीज उत्पादन) में, डिब्बे पर लिखी मात्रा में।",
    ],
    [
      /नाइट्रोजन = किग्रा\/एकड़ · फॉस्फोरस = P2O5 · पोटाश = K2O · जिंक = जिंक सल्फेट · आयरन = आयरन सल्फेट · बोरॉन = बोरेक्स/gi,
      "मात्रा किलो/एकड़ में है। यूरिया, डीएपी, एमओपी और जिंक/आयरन/बोरेक्स बोरी पर लिखे नाम से पहचानें।",
    ],
    [/मिट्टी जाँच के अनुसार मात्रा बदल सकती है — रिपोर्ट और दवा का लेबल मानें/gi, "मिट्टी जाँच रिपोर्ट और बोरी/डिब्बे पर लिखी मात्रा मानें।"],
    [/लेबल-अनुमोदित मात्रा में/gi, "डिब्बे पर लिखी मात्रा में"],
    [/सामान्य खेती में सामान्यतः ज़रूरत नहीं/gi, "सामान्य खेती में ज़रूरत नहीं"],
    [/पानी प्रबंधन मुख्य कारक हैं/gi, "पानी सही रखना सबसे ज़रूरी है"],
  ];

  for (const [re, rep] of phrases) t = t.replace(re, rep);

  const pairs: [RegExp, string][] = [
    [/\bPGR\b/gi, "बढ़वार दवा"],
    [/बढ़वार टॉनिक/gi, "बढ़वार दवा"],
    [/\bGA₃\b/g, "बढ़वार हार्मोन (GA₃)"],
    [/\bGA3\b/gi, "बढ़वार हार्मोन (GA₃)"],
    [/\bfertigation\b/gi, "ड्रिप से खाद"],
    [/फर्टिगेशन/gi, "ड्रिप से खाद"],
    [/\btop[- ]?dress(ing|ed)?\b/gi, "ऊपर से खाद"],
    [/\bbasal\b/gi, "बुवाई वाली खाद"],
    [/बेसल/gi, "बुवाई वाली"],
    [/\bfoliar\b/gi, "पत्ती पर छिड़काव"],
    [/\bFYM\b/gi, "गोबर खाद"],
    [/गोबर की खाद/gi, "गोबर खाद"],
    [/\bcompost\b/gi, "कम्पोस्ट"],
    [/\bmicronutrient(s)?\b/gi, "सूक्ष्म खाद"],
    [/सूक्ष्म पोषक/gi, "सूक्ष्म खाद"],
    [/\bPoP\b/g, "खेत सलाह"],
    [/\bDAT\b/gi, "रोपाई के दिन"],
    [/\bDAS\b/gi, "बुवाई के दिन"],
    [/\bhectare(s)?\b/gi, "हेक्टर"],
    [/\bha\b/gi, "हेक्टर"],
    [/\bacre(s)?\b/gi, "एकड़"],
    [/\bUrea\b/g, "यूरिया"],
    [/\bDAP\b/g, "डीएपी"],
    [/\bSSP\b/g, "एसएसपी"],
    [/\bMOP\b/g, "एमओपी"],
    [/\bSOP\b/g, "एसओपी"],
    [/\bZnSO₄\b/gi, "जिंक सल्फेट"],
    [/\bZnSO4\b/gi, "जिंक सल्फेट"],
    [/\bN\s*\+\s*Zn\b/gi, "यूरिया और जिंक"],
    [/समय पर N\b/gi, "समय पर यूरिया"],
    [/\+\s*Zn\b/gi, "+ जिंक"],
    [/\bNPK\b/g, "यूरिया–डीएपी–एमओपी"],
    [/thrips\/mite/gi, "थ्रिप्स/माइट"],
    [/earthing up/gi, "मिट्टी चढ़ाना"],
    [/paired row/gi, "जोड़ी कतार"],
    [/with drip/gi, "ड्रिप के साथ"],
    [/precision farming/gi, "सटीक खेती"],
    [/soil test/gi, "मिट्टी जाँच"],
    [/product label/gi, "डिब्बे का लेबल"],
    [/always adjust/gi, "हमेशा बदलें"],
    [/verified bags/gi, "जांची हुई बोरी"],
    [/≈/g, "लगभग"],
    [/~/g, "लगभग "],
  ];

  for (const [re, rep] of pairs) t = t.replace(re, rep);

  t = t
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;।])/g, "$1")
    .replace(/[।.]{2,}/g, "।")
    .trim();

  // Soft length cap — keep readable on phone
  if (t.length > 160) {
    const cut = t.slice(0, 157);
    const last = Math.max(cut.lastIndexOf("।"), cut.lastIndexOf("."), cut.lastIndexOf(" "));
    t = (last > 80 ? cut.slice(0, last) : cut).trim() + "…";
  }

  return t;
}

export function toFarmerFertilizerNotes(notes: string[], hi: boolean): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const n of notes) {
    const line = hi ? simplifyFertilizerNoteHi(n) : n.trim();
    if (!line) continue;
    const key = line.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(line);
  }
  return out.slice(0, 8);
}
