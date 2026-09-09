/**
 * Farmer-facing growth stage titles / periods / tips — drop V/R codes & DAS jargon.
 */

function replaceAll(text: string, pairs: [RegExp | string, string][]): string {
  let out = text;
  for (const [from, to] of pairs) {
    out = out.replace(from, to);
  }
  return out;
}

function tidy(text: string): string {
  return text
    .replace(/\s{2,}/g, " ")
    .replace(/\s*[/|]\s*$/g, "")
    .replace(/^\s*[/|]\s*/g, "")
    .replace(/\s*[/|]\s*/g, " — ")
    .replace(/\(\s*\)/g, "")
    .replace(/\s+([,.;।])/g, "$1")
    .replace(/[·\-–—]\s*$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const TITLE_HI: [RegExp | string, string][] = [
  [/टैसलिंग\s*[\/&]?\s*सिल्किंग/gi, "मूंछ और भुट्टा"],
  [/Tasseling\s*[\/&]?\s*Silking/gi, "मूंछ और भुट्टा"],
  [/टैसलिंग/gi, "मूंछ निकलना"],
  [/सिल्किंग/gi, "भुट्टा की मूंछ"],
  [/Tasseling/gi, "मूंछ निकलना"],
  [/Silking/gi, "भुट्टा की मूंछ"],
  [/घुटना[–\-]झाड़ावस्था/gi, "घुटना ऊँचा — तेज़ बढ़वार"],
  [/झाड़ावस्था/gi, "तेज़ बढ़वार"],
  [/Grand growth/gi, "तेज़ बढ़वार"],
  [/Vegetative/gi, "पत्ते–तना बढ़ना"],
  [/Germination/gi, "अंकुरण"],
  [/Emergence/gi, "उगना"],
  [/Flowering/gi, "फूल आना"],
  [/Grain fill(ing)?/gi, "दाना भरना"],
  [/Maturity/gi, "पकना"],
  [/Harvest/gi, "कटाई"],
  [/Tillering/gi, "कल्ले फूटना"],
  [/Panicle initiation|PI/gi, "गभोट"],
  [/Boot(ing)?/gi, "मूंछ आने से पहले"],
  [/Heading/gi, "बालियाँ निकलना"],
  [/Milk stage/gi, "दूधिया दाना"],
  [/Dough/gi, "गाढ़ा दाना"],
  [/\bV\d+\s*[–\-]\s*V\d+\b/gi, ""],
  [/\bR\d+\s*[–\-]\s*R\d+\b/gi, ""],
  [/\bVT\s*[–\-]\s*R\d+\b/gi, ""],
  [/\bVE\b/gi, ""],
  [/\bVT\b/gi, ""],
  [/\bV\d+\b/gi, ""],
  [/\bR\d+\b/gi, ""],
  [/\(\s*\)/g, ""],
];

const PERIOD_HI: [RegExp | string, string][] = [
  [/\bDAS\s*(\d+)\s*[–\-]\s*(\d+)\b/gi, "बुवाई के $1–$2 दिन"],
  [/\b(\d+)\s*[–\-]\s*(\d+)\s*DAS\b/gi, "बुवाई के $1–$2 दिन"],
  [/\bDAS\s*(\d+)\b/gi, "बुवाई के $1 दिन"],
  [/\b(\d+)\s*DAS\b/gi, "बुवाई के $1 दिन"],
  [/\bDAT\s*(\d+)\s*[–\-]\s*(\d+)\b/gi, "रोपाई के $1–$2 दिन"],
  [/\b(\d+)\s*[–\-]\s*(\d+)\s*DAT\b/gi, "रोपाई के $1–$2 दिन"],
  [/\bDAT\s*(\d+)\b/gi, "रोपाई के $1 दिन"],
  [/\b(\d+)\s*DAT\b/gi, "रोपाई के $1 दिन"],
  [/\bDAS\b/gi, "बुवाई के दिन"],
  [/\bDAT\b/gi, "रोपाई के दिन"],
  [/weeks?\s*after\s*sowing/gi, "बुवाई के हफ्ते बाद"],
  [/days?\s*after\s*sowing/gi, "बुवाई के दिन बाद"],
];

const POINT_HI: [RegExp | string, string][] = [
  ...TITLE_HI,
  [/critical/gi, "सबसे ज़रूरी"],
  [/post-emergence/gi, "उगने के बाद"],
  [/top-?dress/gi, "ऊपर से खाद"],
  [/बेसल/gi, "बुवाई के साथ"],
  [/स्कॉउटिंग|scouting/gi, "खेत घूमकर देखना"],
  [/फॉल आर्मीवर्म|FAW/gi, "फौजी सुंडी"],
  [/व्होर्ल/gi, "पत्तों के गोफ में"],
  [/स्टैंड/gi, "पौधों की कतार"],
  [/गैप फिलिंग/gi, "खाली जगह भरना"],
  [/लॉजिंग/gi, "पौधा गिरना"],
  [/BLSB|बैंडेड लीफ ब्लाइट/gi, "पत्ती–डंठल का धब्बा"],
  [/टर्सिकम\/मेडिस लीफ ब्लाइट|टर्सिकम\/मेडिस ब्लाइट/gi, "पत्ती का झुलसा"],
  [/स्क्लेरोशिया/gi, "फफूंद के दाने"],
  [/माहूँ \(एफिड\)|एफिड/gi, "माहूँ"],
  [/रस्ट/gi, "जंग रोग"],
  [/N\b/g, "नाइट्रोजन"],
  [/K\b/g, "पोटाश"],
  [/P\b/g, "फॉस्फोरस"],
  [/Zn\b/g, "जस्ता"],
  [/बोरॉन फोलियर/gi, "बोरॉन का पत्तों पर छिड़काव"],
  [/कार्बोहाइड्रेट संचय/gi, "दाने में ताकत भरना"],
];

export function simplifyGrowthTitleHi(title: string): string {
  return tidy(replaceAll(title, TITLE_HI));
}

export function simplifyGrowthPeriodHi(period: string): string {
  return tidy(replaceAll(period, PERIOD_HI));
}

export function simplifyGrowthPointHi(point: string): string {
  return tidy(replaceAll(point, POINT_HI));
}

export function simplifyGrowthTitleEn(title: string): string {
  return tidy(
    title
      .replace(/\bV\d+\s*[–\-]\s*V\d+\b/gi, "")
      .replace(/\bR\d+\s*[–\-]\s*R\d+\b/gi, "")
      .replace(/\bVT\s*[–\-]\s*R\d+\b/gi, "")
      .replace(/\bV\d+\b|\bR\d+\b|\bVT\b|\bVE\b/gi, "")
      .replace(/\(\s*\)/g, "")
  );
}

export function simplifyGrowthPeriodEn(period: string): string {
  return tidy(
    period
      .replace(/\bDAS\s*(\d+)\s*[–\-]\s*(\d+)\b/gi, "Day $1–$2 after sowing")
      .replace(/\b(\d+)\s*[–\-]\s*(\d+)\s*DAS\b/gi, "Day $1–$2 after sowing")
      .replace(/\bDAS\s*(\d+)\b/gi, "Day $1 after sowing")
      .replace(/\b(\d+)\s*DAS\b/gi, "Day $1 after sowing")
      .replace(/\bDAT\s*(\d+)\s*[–\-]\s*(\d+)\b/gi, "Day $1–$2 after transplant")
      .replace(/\b(\d+)\s*[–\-]\s*(\d+)\s*DAT\b/gi, "Day $1–$2 after transplant")
      .replace(/\bDAS\b/gi, "days after sowing")
      .replace(/\bDAT\b/gi, "days after transplant")
  );
}
