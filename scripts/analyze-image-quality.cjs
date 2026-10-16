const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");

async function analyzeDirectory(subDir) {
  const dir = path.join(ROOT, "public", "images", subDir);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => !fs.statSync(path.join(dir, f)).isDirectory() && !f.endsWith(".svg"));
  const results = [];

  for (const f of files) {
    const full = path.join(dir, f);
    const buf = fs.readFileSync(full);
    const hash = crypto.createHash("sha256").update(buf).digest("hex");
    let meta = {};
    try {
      meta = await sharp(buf).metadata();
    } catch (e) {
      meta = { format: "corrupt", width: 0, height: 0 };
    }

    results.push({
      file: f,
      relPath: `/images/${subDir}/${f}`,
      size: buf.length,
      width: meta.width || 0,
      height: meta.height || 0,
      format: meta.format || "unknown",
      hash
    });
  }
  return results;
}

async function main() {
  const categories = ["diseases", "pests", "weeds", "crops", "deficiencies"];
  const allImages = {};
  for (const c of categories) {
    allImages[c] = await analyzeDirectory(c);
  }

  // Cross-category hash collision
  const hashMap = new Map();
  for (const c of categories) {
    for (const img of allImages[c]) {
      if (!hashMap.has(img.hash)) hashMap.set(img.hash, []);
      hashMap.get(img.hash).push(img.relPath);
    }
  }

  const duplicates = [];
  for (const [hash, list] of hashMap.entries()) {
    if (list.length > 1) {
      duplicates.push({ hash: hash.slice(0, 10), count: list.length, files: list });
    }
  }

  const lowRes = [];
  for (const c of categories) {
    for (const img of allImages[c]) {
      if (img.width < 350 || img.height < 250) {
        lowRes.push(img);
      }
    }
  }

  console.log("Analysis Summary:");
  for (const c of categories) {
    console.log(` - ${c}: ${allImages[c].length} images`);
  }
  console.log(`Duplicate clusters: ${duplicates.length}`);
  console.log(`Low resolution (<350x250): ${lowRes.length}`);

  const report = {
    totalImages: Object.values(allImages).reduce((acc, l) => acc + l.length, 0),
    counts: Object.fromEntries(categories.map(c => [c, allImages[c].length])),
    duplicates,
    lowRes: lowRes.map(x => ({ file: x.relPath, width: x.width, height: x.height, size: x.size }))
  };

  fs.writeFileSync(path.join(ROOT, "scripts", "image-quality-audit.json"), JSON.stringify(report, null, 2), "utf8");
  console.log("Wrote scripts/image-quality-audit.json");
}

main().catch(console.error);
