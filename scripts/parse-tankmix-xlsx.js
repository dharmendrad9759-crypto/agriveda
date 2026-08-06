const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "../.tmp-tankmix/unz/xl");
const sheetsDir = path.join(root, "worksheets");
const outDir = path.join(__dirname, "../data/tank-mix");
fs.mkdirSync(outDir, { recursive: true });

let shared = [];
const ssPath = path.join(root, "sharedStrings.xml");
if (fs.existsSync(ssPath)) {
  const xml = fs.readFileSync(ssPath, "utf8");
  const re = /<si>([\s\S]*?)<\/si>/g;
  let m;
  while ((m = re.exec(xml))) {
    const texts = [...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((x) => x[1]);
    shared.push(texts.join(""));
  }
}
console.log("sharedStrings", shared.length);

function colToIdx(col) {
  let n = 0;
  for (const ch of col) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

function parseSheet(xml) {
  const grid = [];
  const rowRe = /<row[^>]*>([\s\S]*?)<\/row>/g;
  let rm;
  while ((rm = rowRe.exec(xml))) {
    const body = rm[1];
    const row = [];
    const cellRe =
      /<c r="([A-Z]+)(\d+)"([^>]*)>([\s\S]*?)<\/c>|<c r="([A-Z]+)(\d+)"([^/]*)\/>/g;
    let cm;
    while ((cm = cellRe.exec(body))) {
      const col = cm[1] || cm[5];
      const attrs = cm[3] || cm[7] || "";
      const inner = cm[4] || "";
      let val = "";
      const vMatch = inner.match(/<v>([\s\S]*?)<\/v>/);
      const tMatch = inner.match(/<t[^>]*>([\s\S]*?)<\/t>/);
      if (tMatch) val = tMatch[1];
      else if (vMatch) {
        val = vMatch[1];
        if (/t="s"/.test(attrs) && shared[Number(val)] != null) val = shared[Number(val)];
      }
      row[colToIdx(col)] = val
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
    }
    grid.push(row);
  }
  return grid;
}

const names = {
  sheet1: "README",
  sheet2: "Ins+Ins",
  sheet3: "Fun+Fun",
  sheet4: "Herb+Herb",
  sheet5: "Ins+Fun",
  sheet6: "Formulation",
};

for (const f of fs.readdirSync(sheetsDir).sort()) {
  const key = f.replace(".xml", "");
  const xml = fs.readFileSync(path.join(sheetsDir, f), "utf8");
  const grid = parseSheet(xml);
  console.log("\n===", names[key] || key, "rows=", grid.length, "===");
  for (let i = 0; i < Math.min(8, grid.length); i++) {
    console.log(i, JSON.stringify(grid[i]).slice(0, 400));
  }
  const statuses = {};
  for (const row of grid) {
    for (const cell of row) {
      if (!cell) continue;
      const s = String(cell).trim();
      if (/^(Compatible|Caution|Incompatible|Jar test|Not recommended|Safe)/i.test(s)) {
        statuses[s] = (statuses[s] || 0) + 1;
      }
    }
  }
  console.log("status values:", statuses);
  fs.writeFileSync(path.join(outDir, `${key}.json`), JSON.stringify(grid));
}
console.log("\nWrote to", outDir);
