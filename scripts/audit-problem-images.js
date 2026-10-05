const fs = require("fs");
const path = require("path");
const file = "c:/Users/admin/krishi-app/data/crop-curative-problems.ts";
const s = fs.readFileSync(file, "utf8");
const re = /prob\("([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"[^"]+",\s*`\$\{([DP])\}\/([^`]+)`/g;
const byImg = new Map();
let m;
while ((m = re.exec(s))) {
  const key = `${m[4]}/${m[5]}`;
  if (!byImg.has(key)) byImg.set(key, []);
  byImg.get(key).push({ id: m[1], hi: m[2], en: m[3] });
}
const multi = [...byImg.entries()].filter(([, v]) => v.length > 1);
console.log("shared images:", multi.length);
for (const [img, uses] of multi) {
  console.log("\n" + img);
  for (const u of uses) console.log(" -", u.id, u.hi, "/", u.en);
}

// missing files
const pub = "c:/Users/admin/krishi-app/public/images";
const missing = [];
for (const [img] of byImg) {
  const full = path.join(pub, img.startsWith("D/") ? img.replace("D/", "diseases/") : img.replace("P/", "pests/"));
  // actually template is ${D}/file so key is D/file
  const rel = img.replace(/^D\//, "diseases/").replace(/^P\//, "pests/");
  const full2 = path.join(pub, rel);
  if (!fs.existsSync(full2)) missing.push(rel);
}
console.log("\nmissing files", missing.length, missing.slice(0, 30));
