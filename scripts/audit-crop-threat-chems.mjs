import fs from "fs";
import path from "path";
import { lookupChemBottle } from "../lib/crops/chemBottle.ts";
import { chemBottleImageSrc, hasRealBottlePhoto } from "../lib/crops/chemBottleSvg.ts";

// Search all TS/JSON files in data/ for chemical prescriptions
const dataDir = "data";
const chemicalsFound = new Set();

function scan(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      scan(full);
    } else if (f.name.endsWith(".ts") || f.name.endsWith(".json")) {
      const content = fs.readFileSync(full, "utf8");
      // Look for technical names in common fields
      const techMatches = content.match(/"(?:technical|chemical|activeIngredient|salt|chemicalName|dawa|medicine)":\s*"([^"]+)"/g) || [];
      for (const m of techMatches) {
        const val = m.replace(/^"[^"]+":\s*"/, "").replace(/"$/, "");
        if (val && val.length > 2) chemicalsFound.add(val.trim());
      }
    }
  }
}
scan("data");

console.log("Total unique chemical prescriptions in data/:", chemicalsFound.size);

const missingPhoto = [];
const resolvedPhoto = [];

for (const chem of chemicalsFound) {
  const hasPhoto = hasRealBottlePhoto(chem);
  const src = chemBottleImageSrc(chem);
  if (!hasPhoto || src.startsWith("data:image/svg")) {
    missingPhoto.push({ chem, src });
  } else {
    resolvedPhoto.push({ chem, src });
  }
}

console.log("Resolved to real photo:", resolvedPhoto.length);
console.log("Missing real photo:", missingPhoto.length);
if (missingPhoto.length > 0) {
  console.log("\n--- CHEMICALS MISSING REAL PHOTO ---");
  missingPhoto.forEach(m => console.log(`  - "${m.chem}" (slug: ${m.slug})`));
}
