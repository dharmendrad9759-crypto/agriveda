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
const entryRegex = /{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*formulation:\s*"([^"]+)",\s*category:\s*"([^"]+)"/g;
let m;
const catalogEntries = [];
while ((m = entryRegex.exec(catalogText)) !== null) {
  catalogEntries.push({
    slug: m[1],
    name: m[2],
    formulation: m[3],
    category: m[4],
  });
}

console.log("Total catalog entries:", catalogEntries.length);
const catalogMissing = catalogEntries.filter(e => !existingFiles.has(e.slug.toLowerCase()));
console.log("Catalog entries missing image file:", catalogMissing.length);
catalogMissing.forEach(c => console.log(`  - [${c.category}] ${c.name} ${c.formulation} -> slug: ${c.slug}`));

// Now scan all crop threat and problem files in data/
const problemDir = "data/crop-problems";
const allProblems = [];
if (fs.existsSync(problemDir)) {
  const pFiles = fs.readdirSync(problemDir).filter(f => f.endsWith(".json") || f.endsWith(".ts"));
  console.log("Problem files count:", pFiles.length);
}

// Check REAL_BOTTLE_PHOTOS in chemBottleSvg.ts
const svgText = fs.readFileSync("lib/crops/chemBottleSvg.ts", "utf8");
const realPhotoMatches = Array.from(svgText.matchAll(/"([^"]+)":\s*"\/images\/chem\/real\/([^"]+)"/g));
console.log("Mapped entries in chemBottleSvg.ts:", realPhotoMatches.length);
const svgMissing = [];
for (const match of realPhotoMatches) {
  const key = match[1];
  const file = match[2];
  if (!fs.existsSync(path.join("public/images/chem/real", file))) {
    svgMissing.push({ key, file });
  }
}
console.log("chemBottleSvg references missing files:", svgMissing.length);
svgMissing.forEach(s => console.log(`  - ${s.key} -> ${s.file}`));
