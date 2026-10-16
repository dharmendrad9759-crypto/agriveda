const fs = require("fs");
const path = require("path");
const https = require("https");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images", "diseases");

const items = [
  {
    url: "https://ag.purdue.edu/department/arge/swpap/_media/early-blight-of-tomato-1-original.jpg",
    dest: "disease-tomato-early-blight-1.jpg",
    desc: "Early blight of tomato concentric ring leaf spot - Purdue University Extension"
  },
  {
    url: "https://ag.purdue.edu/department/arge/swpap/_media/early-blight-of-tomato-2-original.jpg",
    dest: "disease-tomato-early-blight-2.jpg",
    desc: "Early blight of tomato lower foliage blight - Purdue University Extension"
  },
  {
    url: "https://ag.purdue.edu/department/arge/swpap/_media/early-blight-of-tomato-3-original.jpg",
    dest: "disease-tomato-early-blight-3.jpg",
    desc: "Early blight of tomato stem & fruit lesion - Purdue University Extension"
  },
  {
    url: "https://ag.purdue.edu/department/arge/swpap/_media/late-blight-of-tomato-1-original.jpg",
    dest: "disease-tomato-late-blight-1.jpg",
    desc: "Late blight of tomato water-soaked leaf lesion - Purdue University Extension"
  },
  {
    url: "https://ag.purdue.edu/department/arge/swpap/_media/late-blight-of-tomato-2-original.jpg",
    dest: "disease-tomato-late-blight-2.jpg",
    desc: "Late blight of tomato dark fruit rot - Purdue University Extension"
  },
  {
    url: "https://ag.purdue.edu/department/arge/swpap/_media/late-blight-of-tomato-3-original.jpg",
    dest: "disease-tomato-late-blight-3.jpg",
    desc: "Late blight of tomato whole canopy collapse - Purdue University Extension"
  },
  {
    url: "https://ag.purdue.edu/department/arge/swpap/_media/fusarium-wilt-of-tomato-1-original.jpg",
    dest: "disease-tomato-fusarium-wilt-1.jpg",
    desc: "Fusarium wilt of tomato one-sided yellowing & wilting - Purdue University Extension"
  },
  {
    url: "https://ag.purdue.edu/department/arge/swpap/_media/bacterial-canker-of-tomato-2-original.jpg",
    dest: "disease-tomato-bacterial-canker-1.jpg",
    desc: "Bacterial canker of tomato bird-eye fruit spot & wilting - Purdue University Extension"
  },
  {
    url: "https://ag.purdue.edu/department/arge/swpap/_media/bacterial-spot-of-tomato-1-original.jpg",
    dest: "disease-tomato-bacterial-spot-1.jpg",
    desc: "Bacterial spot of tomato necrotic leaf lesions - Purdue University Extension"
  },
  {
    url: "https://ag.purdue.edu/department/arge/swpap/_media/bacterial-speck-of-tomato-1-original.jpg",
    dest: "disease-tomato-bacterial-speck-1.jpg",
    desc: "Bacterial speck of tomato small black flecks - Purdue University Extension"
  },
  {
    url: "https://ag.purdue.edu/department/arge/swpap/_media/anthracnose-of-tomato-1-original.jpg",
    dest: "disease-tomato-anthracnose-1.jpg",
    desc: "Anthracnose of tomato sunken circular fruit lesions - Purdue University Extension"
  },
  {
    url: "https://ag.purdue.edu/department/arge/swpap/_media/anthracnose-of-tomato-2-original.jpg",
    dest: "disease-tomato-anthracnose-2.jpg",
    desc: "Anthracnose of tomato ripe fruit rot - Purdue University Extension"
  },
  {
    url: "https://ag.purdue.edu/department/arge/swpap/_media/septoria-leaf-spot-of-tomato-1-original.jpg",
    dest: "disease-tomato-septoria-1.jpg",
    desc: "Septoria leaf spot of tomato circular lesions with dark borders - Purdue University Extension"
  },
  {
    url: "https://ag.purdue.edu/department/arge/swpap/_media/blossom-end-rot-of-tomato-1-original.jpg",
    dest: "disease-tomato-blossom-end-rot-1.jpg",
    desc: "Blossom end rot of tomato bottom necrotic black leathery area - Purdue University Extension"
  },
  {
    url: "https://ag.purdue.edu/department/arge/swpap/_media/blossom-end-rot-of-tomato-2-original.jpg",
    dest: "disease-tomato-blossom-end-rot-2.jpg",
    desc: "Blossom end rot of tomato green fruit symptom - Purdue University Extension"
  },
  {
    url: "https://ag.purdue.edu/department/arge/swpap/_media/leaf-mold-of-tomato-1-original.jpg",
    dest: "disease-tomato-leaf-mold-1.jpg",
    desc: "Leaf mold of tomato pale green/yellow leaf patches - Purdue University Extension"
  }
];

function download(item) {
  return new Promise((resolve) => {
    const fullDest = path.join(OUT_DIR, item.dest);
    const req = https.get(item.url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://ag.purdue.edu/department/arge/swpap/tomato-diseases.html"
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        console.warn(`[SKIP ${res.statusCode}] ${item.url}`);
        return resolve(false);
      }
      const stream = fs.createWriteStream(fullDest);
      res.pipe(stream);
      stream.on("finish", () => {
        stream.close();
        const size = fs.statSync(fullDest).size;
        console.log(`[OK ${size} B] ${item.dest} <- ${item.desc}`);
        resolve(true);
      });
      stream.on("error", (e) => {
        console.error(`Stream error for ${item.dest}:`, e.message);
        resolve(false);
      });
    });
    req.on("error", (e) => {
      console.error(`Req error for ${item.dest}:`, e.message);
      resolve(false);
    });
    req.setTimeout(15000, () => {
      req.destroy();
      console.warn(`Timeout for ${item.dest}`);
      resolve(false);
    });
  });
}

async function main() {
  console.log("=== Downloading Purdue University Tomato Disease Photos ===");
  for (const it of items) {
    await download(it);
    await new Promise(r => setTimeout(r, 400));
  }
  console.log("=== Complete ===");
}

main();
