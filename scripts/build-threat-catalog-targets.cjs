const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ccpPath = path.join(ROOT, "data", "crop-curative-problems.ts");
const pdPath = path.join(ROOT, "data", "pest-disease.ts");
const tsiPath = path.join(ROOT, "lib", "pests", "threatSpeciesImages.ts");

const ccpContent = fs.readFileSync(ccpPath, "utf8");
const pdContent = fs.readFileSync(pdPath, "utf8");

// Parse curative problems
const curativeRegex = /prob\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*`\$\{([DP])\}\/([^`]+)`/g;
const targets = new Map();

let m;
while ((m = curativeRegex.exec(ccpContent)) !== null) {
  const [_, id, nameHi, nameEn, tag, dirCode, file] = m;
  const dir = dirCode === "D" ? "diseases" : "pests";
  const base = file.replace(/\.jpg$/, "");
  if (!targets.has(base)) {
    targets.set(base, {
      base,
      dir,
      nameHi,
      nameEn,
      tag,
      scientific: "",
      crops: []
    });
  }
}

// Extract scientific names from threatSpeciesImages.ts aliases
const tsiContent = fs.readFileSync(tsiPath, "utf8");

// Also check pest-disease.ts for pathogens & scientific names
// format: pathogen: "Magnaporthe oryzae" or scientificName: "Scirpophaga incertulas"
const pathogenRegex = /name:\s*"([^"]+)",\s*(?:pathogen|scientificName):\s*"([^"]+)",[\s\S]*?image:\s*"([^"]+)"/g;
while ((m = pathogenRegex.exec(pdContent)) !== null) {
  const [_, name, sci, img] = m;
  const match = img.match(/\/images\/(diseases|pests)\/([^.]+)\.jpg/);
  if (match) {
    const [__, dir, base] = match;
    if (targets.has(base)) {
      const cur = targets.get(base);
      if (!cur.scientific) cur.scientific = sci;
    } else {
      targets.set(base, {
        base,
        dir,
        nameHi: name,
        nameEn: name,
        tag: dir === "diseases" ? "रोग" : "कीट",
        scientific: sci,
        crops: []
      });
    }
  }
}

console.log("Total unique threats in targets map:", targets.size);

// For those without scientific, deduce from base name
for (const [base, t] of targets) {
  if (!t.scientific) {
    // e.g. disease-magnaporthe-oryzae -> Magnaporthe oryzae
    const clean = base.replace(/^(disease|pest)-/, "").replace(/-/g, " ");
    t.scientific = clean;
  }
}

// Convert to array and save
const targetsList = Array.from(targets.values());
fs.writeFileSync(path.join(__dirname, "all-threat-targets.json"), JSON.stringify(targetsList, null, 2));
console.log(`Saved ${targetsList.length} threats to all-threat-targets.json`);
