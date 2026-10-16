const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");

function hashFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function getFileSize(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  return fs.statSync(filePath).size;
}

// 1. Audit Crops
console.log("=== Auditing Crops ===");
const cropImagesContent = fs.readFileSync(path.join(ROOT, "lib", "crops", "cropImages.ts"), "utf8");
const cropMatches = [...cropImagesContent.matchAll(/([a-z0-9-]+):\s*"(\/images\/crops\/[^"]+)"/g)];
const crops = [];
for (const m of cropMatches) {
  const slug = m[1];
  const imgUrl = m[2];
  const localPath = path.join(ROOT, "public", imgUrl);
  const exists = fs.existsSync(localPath);
  const size = getFileSize(localPath);
  const hash = hashFile(localPath);
  crops.push({
    category: "crop",
    slug,
    name: slug,
    imageUrl: imgUrl,
    localPath,
    exists,
    size,
    hash
  });
}
console.log(`Audited ${crops.length} crops. Missing: ${crops.filter(c => !c.exists).length}`);

// 2. Audit Diseases & Pests from crop-curative-problems.ts
console.log("\n=== Auditing Crop Curative Problems ===");
const ccpContent = fs.readFileSync(path.join(ROOT, "data", "crop-curative-problems.ts"), "utf8");
const ccpMatches = [...ccpContent.matchAll(/prob\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*`\$\{([DP])\}\/([^`]+)`/g)];
const curatives = [];
for (const m of ccpMatches) {
  const id = m[1];
  const nameHi = m[2];
  const nameEn = m[3];
  const type = m[4];
  const dirKey = m[5] === "D" ? "diseases" : "pests";
  const filename = m[6];
  const imgUrl = `/images/${dirKey}/${filename}`;
  const localPath = path.join(ROOT, "public", "images", dirKey, filename);
  const exists = fs.existsSync(localPath);
  const size = getFileSize(localPath);
  const hash = hashFile(localPath);

  // Check 3-slot gallery
  const baseNoExt = filename.replace(/\.jpg$/, "");
  const p2 = path.join(ROOT, "public", "images", dirKey, `${baseNoExt}-2.jpg`);
  const p3 = path.join(ROOT, "public", "images", dirKey, `${baseNoExt}-3.jpg`);
  const hasSlot2 = fs.existsSync(p2) && getFileSize(p2) > 10000;
  const hasSlot3 = fs.existsSync(p3) && getFileSize(p3) > 10000;

  curatives.push({
    category: type.includes("कीट") || type.includes("pest") ? "pest" : "disease",
    id,
    nameHi,
    nameEn,
    type,
    imageUrl: imgUrl,
    localPath,
    exists,
    size,
    hash,
    hasSlot2,
    hasSlot3,
    baseNoExt
  });
}
console.log(`Audited ${curatives.length} curative problems. Missing: ${curatives.filter(c => !c.exists).length}`);

// 3. Audit Pest & Disease Catalog (data/pest-disease.ts)
console.log("\n=== Auditing pest-disease.ts Catalog ===");
const pdContent = fs.readFileSync(path.join(ROOT, "data", "pest-disease.ts"), "utf8");
const pdDisMatches = [...pdContent.matchAll(/id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*pathogen:\s*"([^"]+)",[\s\S]*?image:\s*"([^"]+)"/g)];
const pdDiseases = [];
for (const m of pdDisMatches) {
  const id = m[1];
  const name = m[2];
  const pathogen = m[3];
  const imgUrl = m[4];
  const localPath = path.join(ROOT, "public", imgUrl);
  pdDiseases.push({
    category: "disease",
    id,
    name,
    pathogen,
    imageUrl: imgUrl,
    localPath,
    exists: fs.existsSync(localPath),
    size: getFileSize(localPath),
    hash: hashFile(localPath)
  });
}

const pdPestMatches = [...pdContent.matchAll(/id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*scientificName:\s*"([^"]+)",[\s\S]*?image:\s*"([^"]+)"/g)];
const pdPests = [];
for (const m of pdPestMatches) {
  const id = m[1];
  const name = m[2];
  const scientificName = m[3];
  const imgUrl = m[4];
  const localPath = path.join(ROOT, "public", imgUrl);
  pdPests.push({
    category: "pest",
    id,
    name,
    scientificName,
    imageUrl: imgUrl,
    localPath,
    exists: fs.existsSync(localPath),
    size: getFileSize(localPath),
    hash: hashFile(localPath)
  });
}
console.log(`Audited ${pdDiseases.length} diseases & ${pdPests.length} pests in pest-disease.ts.`);

// 4. Audit Weeds (lib/weeds/weedStageImages.ts)
console.log("\n=== Auditing Weeds ===");
const weedStagesContent = fs.readFileSync(path.join(ROOT, "lib", "weeds", "weedStageImages.ts"), "utf8");
const weedMatches = [...weedStagesContent.matchAll(/"([a-z0-9-]+)":\s*\{\s*early:\s*"([^"]+)",\s*late:\s*"([^"]+)"/g)];
const weeds = [];
for (const m of weedMatches) {
  const slug = m[1];
  const earlyUrl = m[2];
  const lateUrl = m[3];
  const earlyPath = path.join(ROOT, "public", earlyUrl);
  const latePath = path.join(ROOT, "public", lateUrl);
  weeds.push({
    category: "weed",
    slug,
    earlyUrl,
    lateUrl,
    earlyExists: fs.existsSync(earlyPath),
    earlySize: getFileSize(earlyPath),
    lateExists: fs.existsSync(latePath),
    lateSize: getFileSize(latePath),
    earlyHash: hashFile(earlyPath),
    lateHash: hashFile(latePath)
  });
}
console.log(`Audited ${weeds.length} weeds. Early missing: ${weeds.filter(w => !w.earlyExists).length}, Late missing: ${weeds.filter(w => !w.lateExists).length}`);

// 5. Audit Nutrients (agriveda-nutrient-deficiency-batch.json)
console.log("\n=== Auditing Nutrients ===");
const nutrientBatch = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "imports", "agriveda-nutrient-deficiency-batch.json"), "utf8"));
const nutrients = [];
for (const n of nutrientBatch.nutrients || []) {
  const slug = n.slug;
  const sharedImg = path.join(ROOT, "public", "images", "deficiencies", `${slug}.jpg`);
  nutrients.push({
    category: "nutrient",
    slug,
    name: n.name,
    symbol: n.symbol,
    sharedImgExists: fs.existsSync(sharedImg),
    sharedImgSize: getFileSize(sharedImg),
    cropWiseCount: (n.cropWiseSymptoms || []).length
  });
}
console.log(`Audited ${nutrients.length} nutrients.`);

// 6. Check for duplicate image files (identical hashes used for different subjects)
console.log("\n=== Auditing Hash Duplicates ===");
const hashToFiles = new Map();
function indexDirectoryHashes(subDir) {
  const dir = path.join(ROOT, "public", "images", subDir);
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) continue;
    const h = hashFile(full);
    if (!h) continue;
    if (!hashToFiles.has(h)) hashToFiles.set(h, []);
    hashToFiles.get(h).push(`/images/${subDir}/${f}`);
  }
}
["crops", "diseases", "pests", "weeds", "deficiencies"].forEach(indexDirectoryHashes);

const duplicates = [];
for (const [hash, fileList] of hashToFiles.entries()) {
  if (fileList.length > 1) {
    duplicates.push({ hash: hash.slice(0, 10), files: fileList });
  }
}
console.log(`Found ${duplicates.length} duplicate file clusters across public/images.`);
duplicates.forEach(d => console.log(` - Duplicate: ${d.files.join(" == ")}`));

// 7. Check for suspicious titles or keywords from _sources.json
console.log("\n=== Auditing Suspicious Sources ===");
const sourcesPath = path.join(ROOT, "public", "images", "crop-problems", "auth", "_sources.json");
let suspiciousSources = [];
if (fs.existsSync(sourcesPath)) {
  const sources = JSON.parse(fs.readFileSync(sourcesPath, "utf8"));
  for (const s of sources) {
    const t = (s.title || "").toLowerCase();
    if (
      t.includes("1896") || t.includes("1909") || t.includes("1911") || t.includes("catalog") ||
      t.includes("drawing") || t.includes("diagram") || t.includes("etoxazole") ||
      t.includes("chemical") || t.includes("plate") || t.includes("spore")
    ) {
      suspiciousSources.push(s);
    }
  }
}
console.log(`Found ${suspiciousSources.length} suspicious historical/microscopic sources in _sources.json:`);
suspiciousSources.forEach(s => console.log(` - ${s.base}: ${s.title}`));

// Save audit summary
const auditOutput = {
  timestamp: new Date().toISOString(),
  crops: { total: crops.length, missing: crops.filter(c => !c.exists).length },
  curativeProblems: {
    total: curatives.length,
    missing: curatives.filter(c => !c.exists).length,
    missingSlot2: curatives.filter(c => !c.hasSlot2).map(c => c.id),
    missingSlot3: curatives.filter(c => !c.hasSlot3).map(c => c.id)
  },
  weeds: {
    total: weeds.length,
    missingEarly: weeds.filter(w => !w.earlyExists).length,
    missingLate: weeds.filter(w => !w.lateExists).length
  },
  nutrients: {
    total: nutrients.length,
    missingShared: nutrients.filter(n => !n.sharedImgExists).length
  },
  duplicates,
  suspiciousSources
};

fs.writeFileSync(path.join(ROOT, "scripts", "audit-result.json"), JSON.stringify(auditOutput, null, 2), "utf8");
console.log("\nAudit finished. Results written to scripts/audit-result.json");
