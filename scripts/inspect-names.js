const fs = require("fs");
const s = fs.readFileSync("c:/Users/admin/krishi-app/data/crop-curative-problems.ts", "utf8");
const i = s.indexOf("early-blight");
console.log(JSON.stringify(s.slice(i, i + 90)));
const j = s.indexOf("Early blight");
console.log("Early blight at", j);
// find Devanagari near early-blight
const chunk = s.slice(i, i + 60);
for (let k = 0; k < chunk.length; k++) {
  const c = chunk[k];
  if (c.charCodeAt(0) > 127) {
    console.log(k, c, c.charCodeAt(0).toString(16));
  }
}
