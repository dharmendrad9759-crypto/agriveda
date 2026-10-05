const fs = require("fs");
const s = fs.readFileSync("c:/Users/admin/krishi-app/data/crop-curative-problems.ts", "utf8");
const re = /prob\("([^"]+)",\s*"([^"]+)",\s*"([^"]+)"/g;
let m;
const all = [];
while ((m = re.exec(s))) all.push(`${m[1]} | ${m[2]} | ${m[3]}`);
console.log(all.join("\n"));
