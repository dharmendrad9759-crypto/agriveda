/**
 * Farmer Hindi for pest ETL / spray-when lines on crop pest cards.
 */

function replaceAll(text: string, pairs: [RegExp | string, string][]): string {
  let out = text;
  for (const [from, to] of pairs) {
    out = out.replace(from, to);
  }
  return out;
}

const ETL_HI: [RegExp | string, string][] = [
  [/\bETL\b/gi, "नुकसान सीमा (ETL)"],
  [/Economic Threshold Level/gi, "नुकसान सीमा (ETL)"],
  [/dead\s*hearts?/gi, "मध्य तना सूखा (Dead heart)"],
  [/डेडहार्ट/gi, "मध्य तना सूखा"],
  [/डेड\s*हार्ट/gi, "मध्य तना सूखा"],
  [/white\s*ears?/gi, "सफेद बाली (White ear)"],
  [/व्हाइट\s*ईयर/gi, "सफेद बाली"],
  [/वानस्पतिक\s*अवस्था/gi, "बढ़वार समय"],
  [/वनस्पति(?:क)?/gi, "बढ़वार"],
  [/गभोट\s*के\s*बाद/gi, "बाली बनने के बाद"],
  [/गभोट/gi, "बाली बनना"],
  [/पैनिकल|panicle/gi, "बाली"],
  [/vegetative/gi, "बढ़वार"],
  [/reproductive/gi, "फूल–बाली"],
  [/heading/gi, "बाली निकलना"],
  [/tillering/gi, "कल्ले निकलते समय"],
  [/flowering/gi, "फूल आने पर"],
  [/\bDAT\b/gi, "रोपाई के दिन"],
  [/\bDAS\b/gi, "बुवाई के दिन"],
  [/per\s*leaf/gi, "प्रति पत्ती"],
  [/per\s*plant/gi, "प्रति पौधा"],
  [/larvae?/gi, "इल्ली"],
  [/adults?/gi, "वयस्क कीट"],
  [/nymphs?/gi, "बच्चे कीट"],
  [/aphids?/gi, "माहू"],
  [/Follow local ETL/gi, "खेत देखकर स्थानीय सलाह लें"],
  [/on\s*ETL/gi, "नुकसान सीमा (ETL) पर"],
  [/at\s*ETL/gi, "नुकसान सीमा (ETL) पर"],
  [/—\s*ETL\s*पर/gi, "— नुकसान सीमा (ETL) पर"],
  [/ETL\s*पर/gi, "नुकसान सीमा (ETL) पर"],
  [/preventive/gi, "पहले से बचाव (Preventive)"],
  [/prevention/gi, "पहले से बचाव (Prevention)"],
  [/\bPI\b/g, "बाली बनना"],
  [/सिल्वर\s*शूट|silver\s*shoot/gi, "चाँदी जैसा सूखा कल्ला"],
  [/\bhills?\b/gi, "झाड़"],
  [/प्रति\s*हिल/gi, "प्रति झाड़"],
  [/\/हिल/gi, "/झाड़"],
  [/वेक्टर/gi, "फैलाने वाला कीट"],
  [/\bvector\b/gi, "फैलाने वाला कीट"],
  [/क्षतिग्रस्त/gi, "खराब"],
  [/टंग्रो[-\s]*प्रभावित/gi, "टंग्रो वाले"],
];

export function simplifyPestEtlHi(raw: string): string {
  if (!raw?.trim()) return "";
  let t = replaceAll(raw.replace(/\s+/g, " ").trim(), ETL_HI);
  t = t
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;।])/g, "$1")
    .replace(/[·\-–—]\s*$/g, "")
    .trim();
  return t;
}

export function formatPestSprayWhen(etl: string, hi: boolean): string {
  if (!etl.trim()) return "";
  const body = hi ? simplifyPestEtlHi(etl) : etl.trim();
  if (!body) return "";
  return hi ? `कब दवा दें: ${body}` : `Spray when: ${body}`;
}
