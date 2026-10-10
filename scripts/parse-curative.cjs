const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const content = fs.readFileSync(path.join(ROOT, "data", "crop-curative-problems.ts"), "utf8");

const regex = /prob\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*`\$\{([DP])\}\/([^`]+)`/g;
let m;
const problems = [];
while ((m = regex.exec(content)) !== null) {
  problems.push({
    id: m[1],
    nameHi: m[2],
    nameEn: m[3],
    tag: m[4],
    dir: m[5] === "D" ? "diseases" : "pests",
    file: m[6]
  });
}

console.log("Total curative problems found:", problems.length);

// Check if these files exist on disk
let missing = 0;
let hasPhoto2 = 0;
let hasPhoto3 = 0;

for (const p of problems) {
  const filePath = path.join(ROOT, "public", "images", p.dir, p.file);
  const exists = fs.existsSync(filePath);
  if (!exists) {
    missing++;
    console.log("MISSING:", p.file);
  }
  const base = p.file.replace(/\.jpg$/, "");
  const p2 = path.join(ROOT, "public", "images", p.dir, `${base}-2.jpg`);
  const p3 = path.join(ROOT, "public", "images", p.dir, `${base}-3.jpg`);
  if (fs.existsSync(p2)) hasPhoto2++;
  if (fs.existsSync(p3)) hasPhoto3++;
}

console.log(`Missing primary: ${missing}`);
console.log(`Has photo 2: ${hasPhoto2} / ${problems.length}`);
console.log(`Has photo 3: ${hasPhoto3} / ${problems.length}`);

// Group by unique base
const uniqueBases = new Map();
for (const p of problems) {
  const base = p.file.replace(/\.jpg$/, "");
  if (!uniqueBases.has(base)) {
    uniqueBases.set(base, p);
  }
}
console.log(`Unique threat bases across curative problems: ${uniqueBases.size}`);

// Print bases that don't have -2 and -3
const needPhotos = [];
for (const [base, p] of uniqueBases) {
  const p2 = path.join(ROOT, "public", "images", p.dir, `${base}-2.jpg`);
  const p3 = path.join(ROOT, "public", "images", p.dir, `${base}-3.jpg`);
  if (!fs.existsSync(p2) || !fs.existsSync(p3)) {
    needPhotos.push({
      base,
      dir: p.dir,
      nameHi: p.nameHi,
      nameEn: p.nameEn,
      tag: p.tag,
      has2: fs.existsSync(p2),
      has3: fs.existsSync(p3)
    });
  }
}

console.log(`Threats needing photos 2 or 3: ${needPhotos.length}`);
fs.writeFileSync(path.join(__dirname, "need-photos.json"), JSON.stringify(needPhotos, null, 2));
