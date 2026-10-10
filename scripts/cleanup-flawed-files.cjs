const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const dDir = path.join(ROOT, "public", "images", "diseases");
const pDir = path.join(ROOT, "public", "images", "pests");

// Check files that need replacement
const toReplace = [
  path.join(pDir, "pest-liriomyza-trifolii-3.jpg"),
  path.join(dDir, "disease-fusarium-lycopersici-2.jpg"),
  path.join(pDir, "pest-myzus-persicae-3.jpg"),
];

for (const p of toReplace) {
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log("Removed flawed file:", path.basename(p));
  }
}
