/**
 * Extract nutrient deficiency JSON from Agriveda markdown exports (dedupe by slug).
 * Usage: node scripts/build-nutrient-deficiency-batch.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "data/imports/agriveda-nutrient-deficiency-batch.json");
const DOWNLOADS = path.join(process.env.USERPROFILE ?? "", "Downloads");

const BATCH_PREFIX = "Agriveda — All Plant Nutrient Deficiency Pages [JSON]";
const NITROGEN_PREFIX = "Agriveda — Nutrient Deficiency Page_ Nitrogen (N) [JSON]";

function listSourceFiles() {
  if (!fs.existsSync(DOWNLOADS)) return [];
  return fs
    .readdirSync(DOWNLOADS)
    .filter(
      (f) =>
        f.endsWith(".md") &&
        (f.startsWith(BATCH_PREFIX) || f.startsWith(NITROGEN_PREFIX))
    )
    .map((f) => path.join(DOWNLOADS, f))
    .sort();
}

function extractNutrientPages(markdown) {
  const pages = [];
  const re = /```json\s*([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(markdown))) {
    const raw = m[1].trim();
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.nutrientPage) {
        pages.push(parsed.nutrientPage);
      } else if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item?.nutrientPage) pages.push(item.nutrientPage);
        }
      }
    } catch (e) {
      console.warn("Skip invalid JSON block:", e.message?.slice(0, 80));
    }
  }
  return pages;
}

/** Nitrogen page nests name/symbol/category inside overview — flatten for one schema */
function normalizeNutrientPage(page) {
  const ov = page.overview;
  if (ov && typeof ov === "object" && ov.name) {
    return {
      ...page,
      name: ov.name,
      symbol: ov.symbol,
      category: ov.category,
      mobility: ov.mobility ?? page.mobility,
      formsTakenUp: ov.formsTakenUp ?? page.formsTakenUp,
      overview: { whyImportant: ov.whyImportant ?? "" },
    };
  }
  return page;
}

function dedupeBySlug(pages) {
  const bySlug = new Map();
  for (const page of pages) {
    const normalized = normalizeNutrientPage(page);
    const slug = normalized.slug;
    if (!slug) continue;
    const existing = bySlug.get(slug);
    if (
      !existing ||
      JSON.stringify(normalized).length > JSON.stringify(existing).length
    ) {
      bySlug.set(slug, normalized);
    }
  }
  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function main() {
  const files = listSourceFiles();
  if (!files.length) {
    throw new Error(
      `No nutrient MD files found in ${DOWNLOADS} (batch or nitrogen)`
    );
  }

  const allPages = [];
  const sourceDocuments = [];

  for (const file of files) {
    const pages = extractNutrientPages(fs.readFileSync(file, "utf8"));
    if (pages.length) {
      sourceDocuments.push(path.basename(file));
      allPages.push(...pages);
    }
  }

  const nutrients = dedupeBySlug(allPages);

  const output = {
    exportVersion: "1.0",
    sourceDocuments,
    compiledAt: new Date().toISOString(),
    nutrients,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(output, null, 2), "utf8");

  console.log(`Read ${files.length} MD files (${sourceDocuments.length} with data)`);
  console.log(`Deduped to ${nutrients.length} nutrients → ${OUT}`);
  console.log(`Slugs: ${nutrients.map((n) => n.slug).join(", ")}`);
}

main();
