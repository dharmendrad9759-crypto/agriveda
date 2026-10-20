import fs from "fs";
import path from "path";

const realDir = "public/images/chem/real";
const existingFiles = new Set(
  fs.existsSync(realDir)
    ? fs.readdirSync(realDir).map((f) => f.toLowerCase().replace(/\.(jpg|png|webp)$/, ""))
    : []
);

// Read chem-bottle-catalog.ts
const catalogText = fs.readFileSync("data/chem-bottle-catalog.ts", "utf8");

// Parse objects in CHEM_BOTTLE_CATALOG
const entries = [];
const entryRegex = /{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*formulation:\s*"([^"]+)",\s*category:\s*"([^"]+)"/g;
let m;
while ((m = entryRegex.exec(catalogText)) !== null) {
  entries.push({
    slug: m[1],
    name: m[2],
    formulation: m[3],
    category: m[4],
  });
}

// Filter for insect and disease (insecticide and fungicide)
const insectAndDisease = entries.filter(
  (e) => e.category === "insecticide" || e.category === "fungicide"
);

const missing = [];
const present = [];

for (const item of insectAndDisease) {
  if (existingFiles.has(item.slug.toLowerCase())) {
    present.push(item);
  } else {
    missing.push(item);
  }
}

console.log(`Total Insecticide/Fungicide in catalog: ${insectAndDisease.length}`);
console.log(`Already has photoreal image: ${present.length}`);
console.log(`Missing unique image: ${missing.length}`);
console.log("\n--- MISSING TECHNICALS ---");
missing.forEach((item, idx) => {
  console.log(`${idx + 1}. [${item.category}] ${item.name} ${item.formulation} (slug: ${item.slug})`);
});
