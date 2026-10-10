const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const DISEASES_DIR = path.join(ROOT, "public", "images", "diseases");
const PESTS_DIR = path.join(ROOT, "public", "images", "pests");
const AUTH_DIR = path.join(ROOT, "public", "images", "crop-problems", "auth");

const UA = "AgrivedaFieldLibrary/3.0 (https://agriveda-theta.vercel.app; authentic field diagnostic photography)";

// Quality filter words to exclude non-field photos
const BAD_WORDS = [
  "diagram", "drawing", "illustration", "sketch", "scheme",
  "chemical", "structure", "formula", "molecule", "etoxazole", "compound",
  "map", "chart", "graph", "histogram", "tree", "phylogeny",
  "stamp", "coin", "banknote", "currency",
  "icon", "logo", "vector", "symbol", "sign",
  "catalog", "book", "cover", "title page", "plate", "advertisement",
  "microscope", "microscopic", "spore", "uredospore", "teliospore", "conidia", "conidiophore",
  "asci", "hyphae", "section", "histology", "sem", "tem",
  "rainforest at cedar", "vegetable forcing", "report of the"
];

function isGoodTitle(title) {
  const t = title.toLowerCase();
  for (const b of BAD_WORDS) {
    if (t.includes(b)) return false;
  }
  if (/\(1[89]\d\d\)/.test(t)) return false;
  return true;
}

// 1. Fetch from iNaturalist Research-Grade observations
async function getInaturalistPhotos(taxonName, max = 3) {
  try {
    const url = `https://api.inaturalist.org/v1/observations?taxon_name=${encodeURIComponent(taxonName)}&quality_grade=research&photos=true&per_page=6`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return [];
    const data = await res.json();
    const photos = [];
    for (const r of data.results || []) {
      for (const p of r.photos || []) {
        if (!p.url) continue;
        // Convert square to large
        const large = p.url.replace("/square.", "/large.").replace("/medium.", "/large.");
        photos.push({
          source: "inaturalist",
          url: large,
          title: `iNat ${r.id} (${taxonName})`
        });
        if (photos.length >= max) break;
      }
      if (photos.length >= max) break;
    }
    return photos;
  } catch (e) {
    return [];
  }
}

// 2. Fetch from Wikimedia Commons
async function getCommonsPhotos(query, max = 3) {
  try {
    const url = "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({
      action: "query",
      format: "json",
      generator: "search",
      gsrsearch: `filetype:bitmap ${query}`,
      gsrnamespace: "6",
      gsrlimit: "15",
      prop: "imageinfo",
      iiprop: "url|mime|size",
      iiurlwidth: "1280",
    });
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return [];
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    return pages
      .map(p => {
        const info = p.imageinfo?.[0];
        if (!info?.url) return null;
        const mime = info.mime || "";
        if (!mime.includes("jpeg") && !mime.includes("png") && !mime.includes("webp")) return null;
        if (!isGoodTitle(p.title || "")) return null;
        return {
          source: "commons",
          url: info.thumburl || info.url,
          title: p.title,
          size: Number(info.size) || 0
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.size - a.size)
      .slice(0, max);
  } catch (e) {
    return [];
  }
}

async function downloadAndOptimize(url, destPath) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error("File too small");
  await sharp(buf)
    .rotate()
    .resize(1200, 900, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(destPath);
}

// Full target manifest for all crops
const TARGET_THREATS = [
  // Tomato
  { dir: DISEASES_DIR, base: "disease-ralstonia-solanacearum", taxon: "Ralstonia solanacearum", commons: "Ralstonia solanacearum tomato" },
  { dir: DISEASES_DIR, base: "disease-fusarium-lycopersici", taxon: "Fusarium oxysporum", commons: "Fusarium wilt tomato Solanum lycopersicum" },
  { dir: PESTS_DIR, base: "pest-liriomyza-trifolii", taxon: "Liriomyza trifolii", commons: "Liriomyza trifolii leaf miner" },
  { dir: PESTS_DIR, base: "pest-myzus-persicae", taxon: "Myzus persicae", commons: "Myzus persicae aphid" },

  // Rice
  { dir: DISEASES_DIR, base: "disease-rice-tungro-virus", taxon: "Nephotettix virescens", commons: "Rice tungro virus" },
  { dir: DISEASES_DIR, base: "disease-bipolaris-oryzae", taxon: "Bipolaris oryzae", commons: "Cochliobolus miyabeanus rice brown spot" },
  { dir: PESTS_DIR, base: "pest-cnaphalocrocis-medinalis", taxon: "Cnaphalocrocis medinalis", commons: "Cnaphalocrocis medinalis rice" },

  // Wheat
  { dir: DISEASES_DIR, base: "disease-puccinia-triticina", taxon: "Puccinia triticina", commons: "Puccinia triticina wheat" },
  { dir: DISEASES_DIR, base: "disease-bipolaris-sorokiniana", taxon: "Bipolaris sorokiniana", commons: "Bipolaris sorokiniana wheat spot blotch" },
  { dir: DISEASES_DIR, base: "disease-tilletia-indica", taxon: "Tilletia", commons: "Tilletia wheat" },
  { dir: DISEASES_DIR, base: "disease-blumeria-graminis", taxon: "Blumeria graminis", commons: "Blumeria graminis wheat" },
  { dir: DISEASES_DIR, base: "disease-ustilago-tritici", taxon: "Ustilago tritici", commons: "Ustilago tritici loose smut wheat" },
  { dir: PESTS_DIR, base: "pest-sitobion-avenae", taxon: "Sitobion avenae", commons: "Sitobion avenae wheat" },
  { dir: PESTS_DIR, base: "pest-odontotermes-obesus", taxon: "Odontotermes", commons: "Odontotermes termite" },

  // Maize
  { dir: DISEASES_DIR, base: "disease-exserohilum-turcicum", taxon: "Exserohilum turcicum", commons: "Northern corn leaf blight Exserohilum" },
  { dir: DISEASES_DIR, base: "disease-bipolaris-maydis", taxon: "Bipolaris maydis", commons: "Bipolaris maydis southern corn leaf blight" },
  { dir: DISEASES_DIR, base: "disease-puccinia-sorghi", taxon: "Puccinia sorghi", commons: "Puccinia sorghi common rust maize" },
  { dir: PESTS_DIR, base: "pest-chilo-partellus", taxon: "Chilo partellus", commons: "Chilo partellus spotted stem borer" },
  { dir: PESTS_DIR, base: "pest-atherigona-soccata", taxon: "Atherigona soccata", commons: "Atherigona soccata shoot fly" },

  // Potato
  { dir: DISEASES_DIR, base: "disease-streptomyces-scabies", taxon: "Streptomyces scabiei", commons: "Streptomyces scabies potato" },
  { dir: DISEASES_DIR, base: "disease-potato-virus-y", taxon: "Potato virus Y", commons: "Potato virus Y leaf mosaic" },
  { dir: PESTS_DIR, base: "pest-phthorimaea-operculella", taxon: "Phthorimaea operculella", commons: "Phthorimaea operculella potato tuber moth" },
  { dir: PESTS_DIR, base: "pest-agrotis-ipsilon", taxon: "Agrotis ipsilon", commons: "Agrotis ipsilon black cutworm" },

  // Onion & Garlic
  { dir: DISEASES_DIR, base: "disease-alternaria-porri", taxon: "Alternaria porri", commons: "Alternaria porri onion" },
  { dir: DISEASES_DIR, base: "disease-stemphylium-vesicarium", taxon: "Stemphylium vesicarium", commons: "Stemphylium vesicarium onion" },
  { dir: DISEASES_DIR, base: "disease-peronospora-destructor", taxon: "Peronospora destructor", commons: "Peronospora destructor downy mildew onion" },
  { dir: DISEASES_DIR, base: "disease-fusarium-oxysporum", taxon: "Fusarium oxysporum", commons: "Fusarium oxysporum onion basal rot" },
  { dir: PESTS_DIR, base: "pest-thrips-tabaci", taxon: "Thrips tabaci", commons: "Thrips tabaci onion thrips" },
  { dir: PESTS_DIR, base: "pest-delia-antiqua", taxon: "Delia antiqua", commons: "Delia antiqua onion fly" },

  // Chilli
  { dir: DISEASES_DIR, base: "disease-leveillula-taurica", taxon: "Leveillula taurica", commons: "Leveillula taurica pepper powdery mildew" },
  { dir: PESTS_DIR, base: "pest-scirtothrips-dorsalis", taxon: "Scirtothrips dorsalis", commons: "Scirtothrips dorsalis chilli thrips" },
  { dir: PESTS_DIR, base: "pest-polyphagotarsonemus-latus", taxon: "Polyphagotarsonemus latus", commons: "Polyphagotarsonemus latus broad mite" },

  // Brinjal
  { dir: PESTS_DIR, base: "pest-leucinodes-orbonalis", taxon: "Leucinodes orbonalis", commons: "Leucinodes orbonalis brinjal fruit borer" },
  { dir: DISEASES_DIR, base: "disease-phomopsis-vexans", taxon: "Diaporthe vexans", commons: "Phomopsis vexans brinjal" },
  { dir: PESTS_DIR, base: "pest-henosepilachna", taxon: "Henosepilachna vigintioctopunctata", commons: "Henosepilachna vigintioctopunctata" },

  // Brassica (Cabbage/Cauliflower)
  { dir: DISEASES_DIR, base: "disease-xanthomonas-campestris", taxon: "Xanthomonas campestris", commons: "Xanthomonas campestris black rot cabbage" },
  { dir: PESTS_DIR, base: "pest-pieris-brassicae", taxon: "Pieris brassicae", commons: "Pieris brassicae cabbage caterpillar" },
  { dir: DISEASES_DIR, base: "disease-hyaloperonospora-brassicae", taxon: "Hyaloperonospora brassicae", commons: "Hyaloperonospora brassica downy mildew" },

  // Mustard
  { dir: PESTS_DIR, base: "pest-lipaphis-erysimi", taxon: "Lipaphis erysimi", commons: "Lipaphis erysimi mustard aphid" },
  { dir: DISEASES_DIR, base: "disease-alternaria-brassicae", taxon: "Alternaria brassicae", commons: "Alternaria brassicae mustard leaf spot" },
  { dir: PESTS_DIR, base: "pest-athalia-proxima", taxon: "Athalia proxima", commons: "Athalia sawfly larva" },

  // Sugarcane
  { dir: DISEASES_DIR, base: "disease-colletotrichum-falcatum", taxon: "Colletotrichum falcatum", commons: "Colletotrichum falcatum red rot sugarcane" },
  { dir: DISEASES_DIR, base: "disease-sporisorium-scitamineum", taxon: "Sporisorium scitamineum", commons: "Sporisorium scitamineum sugarcane smut" },
  { dir: PESTS_DIR, base: "pest-pyrilla-perpusilla", taxon: "Pyrilla", commons: "Pyrilla.jpg" },

  // Cotton
  { dir: PESTS_DIR, base: "pest-pectinophora-gossypiella", taxon: "Pectinophora gossypiella", commons: "Pectinophora gossypiella pink bollworm" },
  { dir: DISEASES_DIR, base: "disease-xanthomonas-citri-malvacearum", taxon: "Xanthomonas citri", commons: "bacterial blight cotton Xanthomonas" },
  { dir: PESTS_DIR, base: "pest-amrasca-biguttula", taxon: "Amrasca biguttula", commons: "Amrasca biguttula cotton jassid" },
  { dir: DISEASES_DIR, base: "disease-alternaria-macrospora", taxon: "Alternaria", commons: "Alternaria leaf spot cotton" },

  // Soybean
  { dir: DISEASES_DIR, base: "disease-phakopsora-pachyrhizi", taxon: "Phakopsora pachyrhizi", commons: "Phakopsora pachyrhizi soybean rust" },
  { dir: PESTS_DIR, base: "pest-spodoptera-litura", taxon: "Spodoptera litura", commons: "Spodoptera litura caterpillar" },
  { dir: DISEASES_DIR, base: "disease-cercospora-sojina", taxon: "Cercospora sojina", commons: "Cercospora sojina frogeye leaf spot soybean" },
  { dir: PESTS_DIR, base: "pest-oberea-brevis", taxon: "Oberea", commons: "Oberea beetle" },

  // Okra
  { dir: DISEASES_DIR, base: "disease-bhendi-yvmv", taxon: "Begomovirus", commons: "yellow vein mosaic okra leaf" },
  { dir: PESTS_DIR, base: "pest-earias-vittella", taxon: "Earias vittella", commons: "Earias vittella spotted bollworm" },

  // Cucurbit
  { dir: DISEASES_DIR, base: "disease-pseudoperonospora-cubensis", taxon: "Pseudoperonospora cubensis", commons: "Pseudoperonospora cubensis downy mildew cucumber" },
  { dir: PESTS_DIR, base: "pest-bactrocera-cucurbitae", taxon: "Bactrocera cucurbitae", commons: "Bactrocera cucurbitae melon fruit fly" },
  { dir: PESTS_DIR, base: "pest-aulacophora-foveicollis", taxon: "Aulacophora foveicollis", commons: "Aulacophora foveicollis red pumpkin beetle" },

  // Pulses
  { dir: DISEASES_DIR, base: "disease-mungbean-yellow-mosaic-virus", taxon: "Begomovirus", commons: "mungbean yellow mosaic virus" },
  { dir: DISEASES_DIR, base: "disease-cercospora-canescens", taxon: "Cercospora canescens", commons: "Cercospora leaf spot Vigna" },
  { dir: DISEASES_DIR, base: "disease-cercospora-arachidicola", taxon: "Cercospora arachidicola", commons: "Cercospora arachidicola groundnut leaf spot" },
  { dir: DISEASES_DIR, base: "disease-puccinia-arachidis", taxon: "Puccinia arachidis", commons: "Puccinia arachidis groundnut rust" },
  { dir: DISEASES_DIR, base: "disease-sclerotium-rolfsii", taxon: "Athelia rolfsii", commons: "Sclerotium rolfsii collar rot" },
  { dir: DISEASES_DIR, base: "disease-ascochyta-rabiei", taxon: "Ascochyta rabiei", commons: "Ascochyta rabiei chickpea blight" },
  { dir: DISEASES_DIR, base: "disease-fusarium-ciceri", taxon: "Fusarium oxysporum", commons: "Fusarium wilt chickpea" },

  // Fruit & Plantation
  { dir: DISEASES_DIR, base: "disease-fusarium-cubense", taxon: "Fusarium oxysporum", commons: "Panama disease banana Fusarium" },
  { dir: PESTS_DIR, base: "pest-cosmopolites-sordidus", taxon: "Cosmopolites sordidus", commons: "Cosmopolites sordidus banana weevil" },
  { dir: DISEASES_DIR, base: "disease-colletotrichum-gloeosporioides", taxon: "Colletotrichum gloeosporioides", commons: "Colletotrichum gloeosporioides mango fruit rot" },
  { dir: DISEASES_DIR, base: "disease-oidium-mangiferae", taxon: "Oidium mangiferae", commons: "mango powdery mildew blossom" },
  { dir: DISEASES_DIR, base: "disease-plasmopara-viticola", taxon: "Plasmopara viticola", commons: "Plasmopara viticola downy mildew grapevine" },
  { dir: DISEASES_DIR, base: "disease-uncinula-necator", taxon: "Erysiphe necator", commons: "Erysiphe necator powdery mildew grape" },
  { dir: DISEASES_DIR, base: "disease-pythium-aphanidermatum", taxon: "Pythium aphanidermatum", commons: "Pythium soft rot rhizome" },
];

async function main() {
  console.log(`Auditing and downloading authentic field photos for ${TARGET_THREATS.length} threats...`);
  let downloadedCount = 0;
  let alreadyComplete = 0;

  for (const t of TARGET_THREATS) {
    const f2 = path.join(t.dir, `${t.base}-2.jpg`);
    const f3 = path.join(t.dir, `${t.base}-3.jpg`);

    const need2 = !fs.existsSync(f2) || fs.statSync(f2).size < 12000;
    const need3 = !fs.existsSync(f3) || fs.statSync(f3).size < 12000;

    if (!need2 && !need3) {
      alreadyComplete++;
      continue;
    }

    process.stdout.write(`Processing ${t.base} (need2=${need2}, need3=${need3}) ... `);

    // Try iNaturalist research-grade first
    let candidates = await getInaturalistPhotos(t.taxon, 4);

    // Fall back to Commons
    if (candidates.length < 2 && t.commons) {
      const commonsResults = await getCommonsPhotos(t.commons, 4);
      candidates = [...candidates, ...commonsResults];
    }

    if (candidates.length === 0) {
      console.log("NO CANDIDATES");
      continue;
    }

    let idx = 0;
    if (need2 && candidates[idx]) {
      try {
        await downloadAndOptimize(candidates[idx].url, f2);
        idx++;
        downloadedCount++;
      } catch (e) {
        // try next
      }
    }

    if (need3 && candidates[idx]) {
      try {
        await downloadAndOptimize(candidates[idx].url, f3);
        idx++;
        downloadedCount++;
      } catch (e) {
        // failed
      }
    }

    console.log(`OK! (got ${idx} photos)`);
    // respectful pause
    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`\nFinished: downloaded ${downloadedCount} new photos, ${alreadyComplete} were already complete.`);
}

main().catch(console.error);
