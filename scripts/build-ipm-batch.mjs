/**
 * Extract IPM JSON from Agriveda markdown exports and merge into one batch file.
 * Usage: node scripts/build-ipm-batch.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "data/imports/agriveda-ipm-batch.json");

const PEST_MD = path.join(
  process.env.USERPROFILE ?? "",
  "Downloads",
  "Agriveda — Pest Management JSON (Prevention · Monitoring · Cultural · Biological · Chemical)-20260710081226.md"
);
const DISEASE_MD = path.join(
  process.env.USERPROFILE ?? "",
  "Downloads",
  "Agriveda — Disease Management JSON (Prevention · Monitoring · Cultural · Biological · Chemical)-20260710092424.md"
);

function extractJsonArrays(markdown) {
  const arrays = [];
  const re = /```json\s*([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(markdown))) {
    const raw = m[1].trim();
    if (!raw.startsWith("[")) continue;
    try {
      arrays.push(JSON.parse(raw));
    } catch (e) {
      console.warn("Skip invalid JSON block:", e.message?.slice(0, 80));
    }
  }
  return arrays;
}

function mergeCrops(pestCrops, diseaseCrops) {
  const byKey = new Map();

  for (const crop of pestCrops) {
    const key = normalizeCropKey(crop.crop);
    byKey.set(key, {
      crop: crop.crop,
      scientificName: crop.scientificName ?? "",
      pests: crop.pests ?? [],
      diseases: [],
    });
  }

  for (const crop of diseaseCrops) {
    const key = normalizeCropKey(crop.crop);
    const existing = byKey.get(key);
    if (existing) {
      existing.diseases = crop.diseases ?? [];
      existing.scientificName = existing.scientificName || crop.scientificName || "";
    } else {
      byKey.set(key, {
        crop: crop.crop,
        scientificName: crop.scientificName ?? "",
        pests: [],
        diseases: crop.diseases ?? [],
      });
    }
  }

  return [...byKey.values()].sort((a, b) => a.crop.localeCompare(b.crop));
}

function normalizeCropKey(name) {
  return name
    .toLowerCase()
    .replace(/\s*\/\s*.*/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function main() {
  if (!fs.existsSync(PEST_MD)) throw new Error(`Pest MD not found: ${PEST_MD}`);
  if (!fs.existsSync(DISEASE_MD)) throw new Error(`Disease MD not found: ${DISEASE_MD}`);

  const pestMd = fs.readFileSync(PEST_MD, "utf8");
  const diseaseMd = fs.readFileSync(DISEASE_MD, "utf8");

  const pestArrays = extractJsonArrays(pestMd);
  const diseaseArrays = extractJsonArrays(diseaseMd);

  const pestCrops = pestArrays.flat();
  const diseaseCrops = diseaseArrays.flat();

  const crops = mergeCrops(pestCrops, diseaseCrops);

  const output = {
    exportVersion: "1.0",
    sourceDocuments: [
      "Agriveda Pest Management JSON (Pages A-D)",
      "Agriveda Disease Management JSON (Pages A-D)",
    ],
    compiledAt: new Date().toISOString(),
    crops,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(output, null, 2), "utf8");

  console.log(`Wrote ${crops.length} crops to ${OUT}`);
  console.log(
    "Totals:",
    crops.reduce((s, c) => s + (c.pests?.length ?? 0), 0),
    "pests,",
    crops.reduce((s, c) => s + (c.diseases?.length ?? 0), 0),
    "diseases"
  );
}

main();
