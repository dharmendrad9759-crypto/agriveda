/** Scale an existing per-acre advisory line to the field. Does not invent doses. */

function nice(n: number): string {
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function formatAmount(value: number, unitRaw: string): string {
  const unit = unitRaw.toLowerCase();
  if (unit === "ग्राम" || unit === "g") {
    if (value >= 1000) return `${nice(value / 1000)} किग्रा`;
    return `${Math.round(value)} ग्राम`;
  }
  if (unit === "ml" || unit === "मि.ली" || unit === "मिली" || unit === "मि.ली.") {
    if (value >= 1000) return `${nice(value / 1000)} लीटर`;
    return `${Math.round(value)} मि.ली`;
  }
  if (unit === "लीटर") return `${nice(value)} लीटर`;
  return `${nice(value)} किग्रा`;
}

function formatRange(a: string, b: string | undefined, unit: string, acres: number): string {
  const v1 = parseFloat(a) * acres;
  const v2 = b ? parseFloat(b) * acres : undefined;
  if (v2 == null) return formatAmount(v1, unit);
  return `${formatAmount(v1, unit).replace(/\s+\S+$/, "")}-${formatAmount(v2, unit)}`;
}

function scaleDoses(sentence: string, acres: number): string {
  if (!/\/\s*एकड़|प्रति\s*एकड़/.test(sentence)) return sentence;
  return sentence.replace(
    /(\d+(?:\.\d+)?)(?:\s*[-–—]\s*(\d+(?:\.\d+)?))?\s*(kg|किग्रा|ग्राम|g|ml|मि\.?ली|मिली)(\s*(?:\/\s*एकड़|प्रति\s*एकड़))?/gi,
    (match, a: string, b: string | undefined, unit: string, suffix: string | undefined, offset: number, full: string) => {
      const after = full.slice(offset + match.length);
      if (!suffix && /^\s*\/\s*(?:लीटर|पौधा|पेड़|टंकी)/i.test(after)) return match;
      return formatRange(a, b, unit, acres);
    }
  );
}

function scaleWater(sentence: string, acres: number): string {
  if (sentence.includes("टंकी")) return sentence;
  return sentence.replace(
    /(\d+(?:\.\d+)?)(?:\s*[-–—]\s*(\d+(?:\.\d+)?))?\s*लीटर\s*पानी/g,
    (match, a: string, b: string | undefined, offset: number, full: string) => {
      const before = full.slice(Math.max(0, offset - 10), offset);
      if (/\/\s*$/.test(before)) return match;
      const v1 = Math.round(parseFloat(a) * acres);
      const v2 = b ? Math.round(parseFloat(b) * acres) : undefined;
      const tanks = (liters: number) => Math.max(1, Math.round(liters / 15));
      if (v2 != null) {
        return `${v1} से ${v2} लीटर पानी (लगभग ${tanks(v1)}–${tanks(v2)} टंकी · 15 लीटर)`;
      }
      return `${v1} लीटर पानी (लगभग ${tanks(v1)} टंकी · 15 लीटर)`;
    }
  );
}

export function scaleAdvisoryLine(line: string, acres: number | null): string {
  const known = acres != null && Number.isFinite(acres) && acres > 0;
  const factor = known ? acres : 1;
  const dosed = known ? scaleDoses(line, factor) : line;
  return scaleWater(dosed, factor);
}
