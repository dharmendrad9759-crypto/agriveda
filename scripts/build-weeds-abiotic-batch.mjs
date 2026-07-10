/**
 * Extract Weed & Abiotic Stress JSON from Agriveda markdown exports.
 * Usage: node scripts/build-weeds-abiotic-batch.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "data/imports/agriveda-weeds-abiotic-batch.json");

const WEED_MD = path.join(
  process.env.USERPROFILE ?? "",
  "Downloads",
  "Agriveda — Weed & Abiotic Stress Management JSON (Prevention · Monitoring · Cultural · Chemical)-20260710112802.md"
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

function main() {
  if (!fs.existsSync(WEED_MD)) throw new Error(`Weed MD not found: ${WEED_MD}`);

  const arrays = extractJsonArrays(fs.readFileSync(WEED_MD, "utf8"));
  const crops = arrays.flat();

  const output = {
    exportVersion: "1.0",
    sourceDocuments: ["Agriveda Weed & Abiotic Stress JSON (Pages A-D)"],
    compiledAt: new Date().toISOString(),
    crops,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(output, null, 2), "utf8");

  const weedCount = crops.filter((c) => c.weeds).length;
  const stressCount = crops.reduce((s, c) => s + (c.abioticStress?.length ?? 0), 0);
  console.log(`Wrote ${crops.length} crops to ${OUT}`);
  console.log(`Weed programs: ${weedCount}, abiotic stress entries: ${stressCount}`);
}

main();
