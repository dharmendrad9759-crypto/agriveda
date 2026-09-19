/** Farmer-facing Hindi — strip lab jargon, keep meaning. */

const LABEL_JUNK =
  /\s*[—\-–]?\s*(लेबल\s*अनुसार|लेबल\s*के\s*अनुसार|बोतल\s*के\s*लेबल\s*के\s*अनुसार|as per (the )?label|follow( the)? label|label dose)\s*/gi;

const PHRASES: [RegExp, string][] = [
  [/\bDAT\s*(\d+)\s*[–\-]\s*(\d+)/gi, "रोपाई के $1–$2 दिन"],
  [/\bDAT\s*(\d+)/gi, "रोपाई के $1 दिन"],
  [/\bDAS\s*(\d+)\s*[–\-]\s*(\d+)/gi, "बुवाई के $1–$2 दिन"],
  [/\bDAS\s*(\d+)/gi, "बुवाई के $1 दिन"],
  [/(\d+)\s*[–\-]\s*(\d+)\s*DAT\b/gi, "रोपाई के $1–$2 दिन"],
  [/(\d+)\s*[–\-]\s*(\d+)\s*DAS\b/gi, "बुवाई के $1–$2 दिन"],
  [/\bDAT\b/g, "रोपाई के दिन"],
  [/\bDAS\b/g, "बुवाई के दिन"],
  [/वानस्पतिक/g, "पत्ती-तना बढ़वार"],
  [/\bvegetative\b/gi, "पत्ती-तना बढ़वार"],
  [/ड्रिप सिंचाई सबसे उपयुक्त/gi, "बूँद-बूँद पानी सबसे अच्छा"],
  [/ड्रिप सिंचाई/gi, "बूँद-बूँद पानी"],
  [/\bdrip irrigation\b/gi, "बूँद-बूँद पानी"],
  [/\bdrip\b/gi, "बूँद-बूँद पानी"],
  [/\bcritical stages?\b/gi, "ज़रूरी समय"],
  [/घास खरपतवार\s*\(Grasses\)/gi, "घास वाला खरपतवार"],
  [/\bGrasses\b/gi, "घास"],
  [/चौड़ी पत्ती खरपतवार/gi, "चौड़ी पत्ती वाला खरपतवार"],
  [/Quizalofop(?:-p-ethyl)?(?:\s*5%\s*EC)?/gi, "घास मार दवा"],
  [/Pendimethalin(?:\s*\d+%?\s*EC)?/gi, "बुवाई वाली खरपतवार दवा"],
  [/\bdirected\/hooded\s*spray\b/gi, "पंक्ति के बीच छिड़काव"],
  [/directed\/hooded स्प्रे/gi, "पंक्ति के बीच छिड़काव"],
  [/हाथ निराई/gi, "हाथ से निकाले"],
  [/\bPHI\b/g, "दवा के बाद इंतज़ार"],
  [/\bEC\b/g, ""],
  [/\bWP\b/g, ""],
  [/\bSC\b/g, ""],
  [/\bWG\b/g, ""],
  [/\bFS\b/g, ""],
  [/मिलीलीटर/g, "मिली"],
  [/\bml\b/gi, "मिली"],
  [/प्रति एकड़/g, "एकड़ में"],
  [/\bFlonicamid\b/gi, "रस चूसक दवा"],
  [/\bImidacloprid\b/gi, "रस चूसक दवा"],
  [/\bChlorantraniliprole\b/gi, "सुंडी मार दवा"],
  [/\bEmamectin\b/gi, "इल्ली मार दवा"],
  [/\bMancozeb\b/gi, "फफूंद दवा"],
  [/\bMetalaxyl\b/gi, "फफूंद दवा"],
  [/\bCarbendazim\b/gi, "फफूंद दवा"],
  [/\bAzoxystrobin\b/gi, "फफूंद दवा"],
  [/\bThiamethoxam\b/gi, "रस चूसक दवा"],
  [/\bLambda-?cyhalothrin\b/gi, "कीट दवा"],
  [/\bSpinosad\b/gi, "इल्ली मार दवा"],
  [/IRAC\s*\w+/gi, ""],
  [/FRAC\s*\w+/gi, ""],
  [/HRAC\s*\w+/gi, ""],
];

export function farmerSpeak(raw: string, maxLen?: number): string {
  if (!raw?.trim()) return "";
  let t = raw.replace(/\s+/g, " ").trim();
  t = t.replace(LABEL_JUNK, " ");
  for (const [re, to] of PHRASES) t = t.replace(re, to);
  t = t
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;।])/g, "$1")
    .replace(/[·\-–—]\s*$/g, "")
    .replace(/^\s*[-–—]\s*/g, "")
    .replace(/\s+[—\-–]\s*$/g, "")
    .trim();

  if (maxLen && t.length > maxLen) {
    const sliced = t.slice(0, maxLen - 1);
    const lastSpace = sliced.lastIndexOf(" ");
    return `${(lastSpace > 36 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
  }
  return t;
}

export function farmerSpeakLines(lines: string[], max = 6, maxLen?: number): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const line of lines) {
    const spoken = farmerSpeak(line, maxLen);
    if (!spoken || spoken.length < 3) continue;
    const key = spoken.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(spoken);
    if (out.length >= max) break;
  }
  return out;
}

export function applyHarvestVerb(text: string, verb: string): string {
  if (verb === "कटाई") return text;
  return text
    .replace(/कटाई/g, verb)
    .replace(/काटें/g, verb === "तुड़ाई" ? "तोड़ें" : "खोदें")
    .replace(/काटने/g, verb === "तुड़ाई" ? "तोड़ने" : "खोदने");
}
