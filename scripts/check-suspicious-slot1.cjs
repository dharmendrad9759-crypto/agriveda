const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const authSourcesPath = path.join(ROOT, "public", "images", "crop-problems", "auth", "_sources.json");
let sources = [];
if (fs.existsSync(authSourcesPath)) {
  sources = JSON.parse(fs.readFileSync(authSourcesPath, "utf8"));
}

const suspicious = [];
for (const s of sources) {
  const t = (s.title || "").toLowerCase();
  if (
    t.includes("1896") || t.includes("1909") || t.includes("1911") || t.includes("catalog") ||
    t.includes("drawing") || t.includes("diagram") || t.includes("etoxazole") ||
    t.includes("chemical") || t.includes("plate") || t.includes("spore")
  ) {
    suspicious.push(s);
  }
}

console.log(`Found ${suspicious.length} suspicious Slot 1 images:`);
for (const s of suspicious) {
  console.log(` - ${s.base}: ${s.title}`);
}
