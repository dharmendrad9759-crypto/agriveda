/** Short, farmer-friendly lines — no institute jargon, easy to scan. */

const JARGON =
  /\b(ICAR|SAU|NFSM|NHRDF|KVK|CIB\s*&?\s*RC|State Agricultural University|Package of Practices|PoP|FRAC|IRAC|HRAC|ETL)\b/gi;

const FILLER =
  /\s*(for the local ecosystem|as per (the )?label|recommended by[^.,;]*|according to[^.,;]*)/gi;

export function shortenFarmerLine(raw: string, maxLen = 72): string {
  let t = raw
    .replace(JARGON, "")
    .replace(FILLER, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;])/g, "$1")
    .replace(/^[\s•\-–—]+/, "")
    .trim();

  // Prefer first sentence / clause
  const cut = t.split(/(?<=[.।;])\s+| — | – /)[0]?.trim() || t;
  t = cut.length > 12 ? cut : t;

  if (t.length <= maxLen) return t || raw.slice(0, maxLen);
  const sliced = t.slice(0, maxLen - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > 40 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}

export function shortenFarmerLines(lines: string[], max = 2, maxLen = 72): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const line of lines) {
    if (!line?.trim()) continue;
    const short = shortenFarmerLine(line, maxLen);
    const key = short.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(short);
    if (out.length >= max) break;
  }
  return out;
}

/** Build 1–2 action tips for a crop stage from long guide text. */
export function stageTipsFromPoints(points: string[], fallback: string): string[] {
  const tips = shortenFarmerLines(points, 2, 68);
  if (tips.length) return tips;
  return [shortenFarmerLine(fallback, 68)];
}
