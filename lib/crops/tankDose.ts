/**
 * Knapsack hint for a field spray.
 * Uses the water volume written in the dose (e.g. 200 लीटर पानी).
 * If none is written, assumes 10 tanks of 15 L per acre (150 L).
 * Seed treatment, soil drench, and kilo-scale granules are left alone.
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
    return `15 लीटर टंकी में लगभग ${formatQty(((a + b) / 2) * 15)} ${unitHi}`;
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
  return `15 लीटर टंकी में लगभग ${formatQty((mid * 15) / waterL)} ${unitHi}`;
}
