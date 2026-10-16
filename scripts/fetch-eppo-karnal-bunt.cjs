const fs = require("fs");
const path = require("path");
const https = require("https");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images", "diseases");

const targets = [
  {
    url: "https://gd.eppo.int/media/data/taxon/N/NEOVIN/pics/1024x0/1111.jpg",
    dest: path.join(OUT_DIR, "disease-tilletia-indica.jpg"),
    desc: "Two ears of wheat smutted by Tilletia indica (Karnal bunt) - R. Duran"
  },
  {
    url: "https://gd.eppo.int/media/data/taxon/N/NEOVIN/pics/1024x0/1114.jpg",
    dest: path.join(OUT_DIR, "disease-tilletia-indica-2.jpg"),
    desc: "Wheat grain infected with Tilletia indica partial to complete bunting - GL Peterson, USDA"
  },
  {
    url: "https://gd.eppo.int/media/data/taxon/N/NEOVIN/pics/1024x0/1113.jpg",
    dest: path.join(OUT_DIR, "disease-tilletia-indica-3.jpg"),
    desc: "Bunted ear of wheat in field - R. Duran"
  }
];

function download(item) {
  return new Promise((resolve, reject) => {
    https.get(item.url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AgriVeda/1.0" } }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${item.url}`));
      }
      const fileStream = fs.createWriteStream(item.dest);
      res.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        const size = fs.statSync(item.dest).size;
        console.log(`Downloaded ${item.dest} (${size} bytes) - ${item.desc}`);
        resolve();
      });
      fileStream.on("error", reject);
    }).on("error", reject);
  });
}

async function run() {
  for (const item of targets) {
    try {
      await download(item);
    } catch (err) {
      console.error(`Error downloading ${item.url}:`, err.message);
    }
  }
}

run();
