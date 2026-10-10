const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const pdPath = path.join(ROOT, "data", "pest-disease.ts");
const ccpPath = path.join(ROOT, "data", "crop-curative-problems.ts");

const pdContent = fs.readFileSync(pdPath, "utf8");
const ccpContent = fs.readFileSync(ccpPath, "utf8");

// Parse crop-curative-problems
const cpProblems = [];
const cpMatches = ccpContent.matchAll(/id:\s*"([^"]+)",\s*crop:\s*"([^"]+)",\s*nameHi:\s*"([^"]+)",\s*nameEn:\s*"([^"]+)",\s*type:\s*"([^"]+)",[\s\S]*?image:\s*"([^"]+)"/g);
for (const m of cpMatches) {
  cpProblems.push({
    id: m[1],
    crop: m[2],
    nameHi: m[3],
    nameEn: m[4],
    type: m[5],
    image: m[6]
  });
}

console.log("Total problems in crop-curative-problems:", cpProblems.length);

// Also collect all pests & diseases from pest-disease.ts
const pdDiseases = [];
const pdPests = [];

const disMatches = pdContent.matchAll(/\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*pathogen:\s*"([^"]+)",[\s\S]*?image:\s*"([^"]+)"/g);
for (const m of disMatches) {
  pdDiseases.push({ id: m[1], name: m[2], pathogen: m[3], image: m[4] });
}

const pestMatches = pdContent.matchAll(/\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*scientificName:\s*"([^"]+)",[\s\S]*?image:\s*"([^"]+)"/g);
for (const m of pestMatches) {
  pdPests.push({ id: m[1], name: m[2], scientificName: m[3], image: m[4] });
}

console.log("Total diseases in pest-disease.ts:", pdDiseases.length);
console.log("Total pests in pest-disease.ts:", pdPests.length);

// Also collect files in public/images/diseases and public/images/pests
const dFiles = fs.readdirSync(path.join(ROOT, "public", "images", "diseases"));
const pFiles = fs.readdirSync(path.join(ROOT, "public", "images", "pests"));

console.log("Disease files:", dFiles.length, "Pest files:", pFiles.length);
