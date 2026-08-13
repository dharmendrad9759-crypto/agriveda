import { CHEM_BOTTLE_CATALOG, type ChemBottleCategory, type ChemBottleEntry } from "@/data/chem-bottle-catalog";

const FORM_RE =
  /(\d+(?:\.\d+)?\s*(?:%|g\/L|g\/l)\s*[A-Za-z]{1,4}(?:\s*\+\s*\d+(?:\.\d+)?\s*(?:%|g\/L|g\/l)\s*[A-Za-z]{1,4})*)/i;

function normalizeKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^a-z0-9+]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const byAlias = new Map<string, ChemBottleEntry>();
for (const entry of CHEM_BOTTLE_CATALOG) {
  const keys = [
    entry.slug.replace(/-/g, " "),
    `${entry.name} ${entry.formulation}`,
    entry.name,
    ...(entry.aliases ?? []),
  ];
  for (const key of keys) {
    const n = normalizeKey(key);
    if (n && !byAlias.has(n)) byAlias.set(n, entry);
  }
}

/** Prefer the longest alias match so "chlorantraniliprole 18.5 sc" beats generic name. */
export function lookupChemBottle(raw: string): ChemBottleEntry | undefined {
  const n = normalizeKey(raw);
  if (!n) return undefined;
  if (byAlias.has(n)) return byAlias.get(n);

  let best: ChemBottleEntry | undefined;
  let bestLen = 0;
  for (const [key, entry] of byAlias) {
    if (key.length < 4) continue;
    if (n.includes(key) && key.length > bestLen) {
      best = entry;
      bestLen = key.length;
    }
  }
  return best;
}

function hyphenSplit(word: string, max: number): string[] {
  if (word.length <= max) return [word];
  const lines: string[] = [];
  let rest = word;
  while (rest.length > max) {
    lines.push(`${rest.slice(0, max - 1)}-`);
    rest = rest.slice(max - 1);
  }
  if (rest) lines.push(rest);
  return lines;
}

export function wrapBottleWords(text: string, maxChars = 13, maxLines = 3): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines: string[] = [];
  let cur = "";

  const push = (line: string) => {
    if (line && lines.length < maxLines) lines.push(line);
  };

  for (const word of words) {
    if (lines.length >= maxLines) break;
    const pieces = hyphenSplit(word, maxChars);
    for (const piece of pieces) {
      if (lines.length >= maxLines) break;
      const next = cur ? `${cur} ${piece}` : piece;
      if (next.length <= maxChars) {
        cur = next;
      } else {
        push(cur);
        cur = piece;
      }
    }
  }
  push(cur);
  return lines.filter(Boolean);
}

export function bottleLabelLines(technical: string): string[] {
  const cleaned = technical
    .replace(/\([^)]*(?:IRAC|FRAC|HRAC|Group)[^)]*\)/gi, " ")
    .replace(/\b(?:IRAC|FRAC|HRAC)\s*\S*/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  const hit = lookupChemBottle(cleaned);
  if (hit) {
    const nameLines = wrapBottleWords(hit.name, 13, 2);
    const form = hit.formulation.trim();
    if (form && !nameLines.some((l) => l.toLowerCase().includes(form.toLowerCase()))) {
      return [...nameLines, form].slice(0, 3);
    }
    return nameLines.slice(0, 3);
  }

  const formMatch = cleaned.match(FORM_RE);
  const formulation = formMatch?.[1]?.trim() ?? "";
  const name = (formMatch ? cleaned.replace(formMatch[0], " ") : cleaned)
    .replace(/\s*[+]\s*$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  const nameLines = wrapBottleWords(name || cleaned, 13, 2);
  if (formulation && !nameLines.join(" ").toLowerCase().includes(formulation.toLowerCase())) {
    return [...nameLines, formulation].slice(0, 3);
  }
  return nameLines.slice(0, 3);
}

export function bottleCategory(technical: string): ChemBottleCategory {
  return lookupChemBottle(technical)?.category ?? "insecticide";
}

/** Pull a printable technical from a farmer dose line. */
export function technicalFromSprayLine(line: string): string {
  return line
    .split(/[·•@→]|\/लीटर|\/L\s*water/i)[0]
    ?.replace(/^Chemical:\s*/i, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim() || line.slice(0, 48);
}
