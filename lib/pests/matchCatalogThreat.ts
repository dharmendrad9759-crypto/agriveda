import type { EnrichedThreat } from "@/types/pest-disease-ui";
import { threatDetailPath } from "@/lib/pest-disease-catalog";

/** Keep Latin + Devanagari letters/digits for matching Hindi disease names. */
export function normThreatText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0900-\u097f]+/gi, "");
}

function tokens(s: string): string[] {
  const raw = s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9\u0900-\u097f]+/i)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3);
  return [...new Set(raw)];
}

/** Shared farmer aliases that often differ across dossier / IPM / protection lists */
const ALIAS_GROUPS: string[][] = [
  ["tikka", "टिक्का", "leafspot", "leafspots", "cercospora", "passalora", "earlyandlate"],
  ["blast", "ब्लास्ट", "magnaporthe", "pyricularia"],
  ["blight", "झुलसा", "phytophthora", "alternaria"],
  ["rust", "रतुआ", "puccinia", "phakopsora"],
  ["mildew", "फफूंद", "powdery", "downy"],
  ["wilt", "उकठा", "fusarium", "ralstonia"],
  ["mosaic", "मोजेक", "virus", "वायरस", "yvmv", "mymv"],
  ["borer", "छेदक", "helicoverpa", "earlas", "scirpophaga"],
  ["aphid", "एफिड", "माहू", "sitobion", "aphis", "myzus"],
  ["thrips", "थrips", "trips", "थ्रिप्स"],
  ["hopper", "फुदका", "nilaparvata", "amrasca", "nephotettix"],
];

function expandAliases(toks: string[]): Set<string> {
  const out = new Set(toks);
  for (const t of toks) {
    for (const group of ALIAS_GROUPS) {
      if (group.some((g) => g === t || t.includes(g) || g.includes(t))) {
        for (const g of group) out.add(g);
      }
    }
  }
  return out;
}

function pathogenKey(p?: string | null): string {
  if (!p) return "";
  return normThreatText(p.split(/[/,(]/)[0] ?? p);
}

export type CatalogThreatLike = Pick<
  EnrichedThreat,
  "id" | "name" | "scientificName" | "image"
> & {
  pathogen?: string | null;
  nameHi?: string | null;
};

/**
 * Match dossier / management row → enriched catalog threat.
 * Prefer pathogen, then distinctive name tokens (works for टिक्का ↔ Tikka / Cercospora).
 */
export function matchCatalogThreat(
  catalog: CatalogThreatLike[],
  query: { name: string; scientific?: string | null }
): CatalogThreatLike | undefined {
  if (!catalog.length) return undefined;

  const qPath = pathogenKey(query.scientific);
  if (qPath.length >= 4) {
    const byPath = catalog.find((c) => {
      const p = pathogenKey(c.pathogen || c.scientificName);
      return p && (p === qPath || p.includes(qPath) || qPath.includes(p));
    });
    if (byPath) return byPath;
  }

  const qNorm = normThreatText(query.name);
  const qToks = expandAliases(tokens(query.name));
  if (qNorm.length < 2 && qToks.size === 0) return undefined;

  let best: CatalogThreatLike | undefined;
  let bestScore = 0;

  for (const c of catalog) {
    const cNorm = normThreatText(c.name + (c.nameHi ?? ""));
    const cToks = expandAliases(tokens(`${c.name} ${c.nameHi ?? ""} ${c.pathogen ?? ""} ${c.scientificName}`));
    if (!cNorm && cToks.size === 0) continue;

    let score = 0;
    if (qNorm && cNorm) {
      if (qNorm === cNorm) score += 100;
      else if (qNorm.includes(cNorm) || cNorm.includes(qNorm)) score += 40;
    }
    let shared = 0;
    for (const t of qToks) {
      if (cToks.has(t)) shared += 1;
    }
    score += shared * 25;
    // Prefer longer shared distinctive tokens
    if (shared > 0 && (qToks.has("tikka") || qToks.has("टिक्का")) && (cToks.has("tikka") || cToks.has("टिक्का"))) {
      score += 50;
    }

    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }

  // Need at least one meaningful shared token / contains hit
  return bestScore >= 25 ? best : undefined;
}

export function catalogThreatDetailHref(
  cropSlug: string,
  type: "pest" | "disease" | "weed",
  match: CatalogThreatLike | undefined
): string | undefined {
  if (!match?.id) return undefined;
  return threatDetailPath(cropSlug, type, match.id);
}
