/**
 * Download authentic field photos from Wikimedia Commons for:
 * 1. Missing crop disease/pest species photos
 * 2. Secondary & tertiary field photos (-2.jpg, -3.jpg) for comprehensive multi-photo symptoms
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const DISEASES_DIR = path.join(ROOT, "public", "images", "diseases");
const PESTS_DIR = path.join(ROOT, "public", "images", "pests");
const UA = "AgrivedaFieldLibrary/2.0 (https://agriveda-theta.vercel.app; authentic farmer field education)";

const TARGETS = [
  // Missing disease targets
  { dir: DISEASES_DIR, file: "disease-colletotrichum-coccodes.jpg", queries: ["Colletotrichum coccodes tomato", "Colletotrichum coccodes black dot", "Colletotrichum coccodes"] },
  { dir: DISEASES_DIR, file: "disease-pectobacterium.jpg", queries: ["Pectobacterium carotovorum potato", "potato blackleg Pectobacterium", "Pectobacterium soft rot"] },
  { dir: DISEASES_DIR, file: "disease-phytophthora-capsici.jpg", queries: ["Phytophthora capsici pepper", "Phytophthora capsici fruit rot", "Phytophthora capsici"] },
  { dir: DISEASES_DIR, file: "disease-fusarium-udum.jpg", queries: ["Fusarium udum pigeonpea", "Fusarium udum wilt", "Fusarium wilt pigeonpea"] },
  { dir: DISEASES_DIR, file: "disease-pigeonpea-sterility-mosaic-virus.jpg", queries: ["pigeonpea sterility mosaic virus", "sterility mosaic pigeonpea leaf", "pigeonpea sterility"] },
  { dir: DISEASES_DIR, file: "disease-phytophthora-drechsleri.jpg", queries: ["Phytophthora drechsleri pigeonpea", "Phytophthora drechsleri blight", "Phytophthora drechsleri"] },
  { dir: DISEASES_DIR, file: "disease-colletotrichum-orbiculare.jpg", queries: ["Colletotrichum orbiculare cucumber", "Colletotrichum orbiculare anthracnose", "cucumber anthracnose leaf"] },
  { dir: DISEASES_DIR, file: "disease-pseudomonas-syringae-pv-lachrymans.jpg", queries: ["Pseudomonas syringae pv lachrymans", "angular leaf spot cucumber Pseudomonas", "Pseudomonas syringae cucumber"] },
  { dir: DISEASES_DIR, file: "disease-cucumber-mosaic-virus.jpg", queries: ["Cucumber mosaic virus leaf symptoms", "Cucumber mosaic virus CMV", "CMV cucumber mosaic"] },
  { dir: DISEASES_DIR, file: "disease-peronosclerospora-sorghi.jpg", queries: ["Peronosclerospora sorghi downy mildew", "sorghum downy mildew Peronosclerospora", "Peronosclerospora downy mildew"] },
  { dir: DISEASES_DIR, file: "disease-puccinia-substriata.jpg", queries: ["Puccinia substriata rust", "pearl millet rust Puccinia", "Puccinia pearl millet"] },
  { dir: DISEASES_DIR, file: "disease-moesziomyces-penicillariae.jpg", queries: ["Tolyposporium penicillariae pearl millet smut", "Moesziomyces penicillariae", "pearl millet smut"] },
  { dir: DISEASES_DIR, file: "disease-fusarium-moniliforme.jpg", queries: ["Fusarium moniliforme pokkah boeng", "pokkah boeng sugarcane Fusarium", "Fusarium verticillioides sugarcane"] },
  { dir: DISEASES_DIR, file: "disease-puccinia-kuehnii.jpg", queries: ["Puccinia kuehnii sugarcane orange rust", "Puccinia kuehnii orange rust", "sugarcane orange rust"] },
  { dir: DISEASES_DIR, file: "disease-xanthomonas-axonopodis-pv-glycines.jpg", queries: ["Xanthomonas axonopodis pv glycines", "bacterial pustule soybean Xanthomonas", "Xanthomonas soybean pustule"] },
  { dir: DISEASES_DIR, file: "disease-erwinia.jpg", queries: ["Erwinia carotovora onion soft rot", "Pectobacterium carotovorum soft rot", "onion soft rot bacteria"] },

  // Missing pest targets
  { dir: PESTS_DIR, file: "pest-sogatella-furcifera.jpg", queries: ["Sogatella furcifera white-backed planthopper", "Sogatella furcifera", "white backed planthopper rice"] },
  { dir: PESTS_DIR, file: "pest-orseolia-oryzae.jpg", queries: ["Orseolia oryzae rice gall midge", "Orseolia oryzae", "rice gall midge silver shoot"] },
  { dir: PESTS_DIR, file: "pest-dicladispa-armigera.jpg", queries: ["Dicladispa armigera rice hispa", "Dicladispa armigera", "rice hispa beetle"] },
  { dir: PESTS_DIR, file: "pest-rhopalosiphum-maidis.jpg", queries: ["Rhopalosiphum maidis corn leaf aphid", "Rhopalosiphum maidis", "corn leaf aphid"] },
  { dir: PESTS_DIR, file: "pest-mythimna-separata.jpg", queries: ["Mythimna separata armyworm", "Mythimna separata caterpillar", "oriental armyworm"] },
  { dir: PESTS_DIR, file: "pest-holotrichia-spp.jpg", queries: ["Holotrichia serrata white grub", "Holotrichia white grub larva", "white grub beetle Holotrichia"] },
  { dir: PESTS_DIR, file: "pest-myllocerus-spp.jpg", queries: ["Myllocerus weevil", "Myllocerus subfasciatus", "grey weevil Myllocerus"] },
  { dir: PESTS_DIR, file: "pest-spodoptera-exigua.jpg", queries: ["Spodoptera exigua beet armyworm larva", "Spodoptera exigua caterpillar", "beet armyworm larva"] },
  { dir: PESTS_DIR, file: "pest-aceria.jpg", queries: ["Aceria tulipae dry bulb mite", "Aceria mite leaf", "Aceria mite"] },
  { dir: PESTS_DIR, file: "pest-phenacoccus-solenopsis.jpg", queries: ["Phenacoccus solenopsis cotton mealybug", "Phenacoccus solenopsis", "cotton mealybug"] },
  { dir: PESTS_DIR, file: "pest-chilo-infuscatellus.jpg", queries: ["Chilo infuscatellus sugarcane shoot borer", "Chilo infuscatellus", "sugarcane shoot borer"] },
  { dir: PESTS_DIR, file: "pest-chilo-sacchariphagus-indicus.jpg", queries: ["Chilo sacchariphagus sugarcane internode borer", "Chilo sacchariphagus", "sugarcane internode borer"] },
  { dir: PESTS_DIR, file: "pest-ceratovacuna-lanigera.jpg", queries: ["Ceratovacuna lanigera sugarcane woolly aphid", "Ceratovacuna lanigera", "sugarcane woolly aphid"] },
  { dir: PESTS_DIR, file: "pest-melanagromyza-sojae.jpg", queries: ["Melanagromyza sojae soybean stem fly", "Melanagromyza sojae", "soybean stem fly"] },
  { dir: PESTS_DIR, file: "pest-aphis-glycines.jpg", queries: ["Aphis glycines soybean aphid", "Aphis glycines", "soybean aphid"] },
  { dir: PESTS_DIR, file: "pest-melanagromyza-obtusa.jpg", queries: ["Melanagromyza obtusa pod fly pigeonpea", "Melanagromyza obtusa", "pigeonpea pod fly"] },
  { dir: PESTS_DIR, file: "pest-exelastis-atomosa.jpg", queries: ["Exelastis atomosa plume moth pigeonpea", "Exelastis atomosa", "plume moth pigeonpea"] },
  { dir: PESTS_DIR, file: "pest-clavigralla.jpg", queries: ["Clavigralla tomentosicollis pod bug", "Clavigralla pod bug", "Clavigralla"] },
  { dir: PESTS_DIR, file: "pest-thrips-palmi.jpg", queries: ["Thrips palmi melon thrips", "Thrips palmi", "melon thrips"] },

  // Secondary & Tertiary Authentic Field Photos (-2 and -3)
  { dir: DISEASES_DIR, file: "disease-alternaria-solani-2.jpg", queries: ["Alternaria solani tomato leaf concentric ring", "Early blight tomato leaf lesion", "Alternaria solani target spot"] },
  { dir: DISEASES_DIR, file: "disease-alternaria-solani-3.jpg", queries: ["Early blight tomato fruit collar rot", "Alternaria solani tomato fruit", "Alternaria solani symptoms"] },
  { dir: DISEASES_DIR, file: "disease-phytophthora-infestans-2.jpg", queries: ["Phytophthora infestans late blight tomato leaf", "Late blight potato foliage lesion", "Phytophthora infestans leaf rot"] },
  { dir: DISEASES_DIR, file: "disease-phytophthora-infestans-3.jpg", queries: ["Late blight potato tuber rot brown", "Phytophthora infestans potato tuber late blight", "late blight tuber rot"] },
  { dir: DISEASES_DIR, file: "disease-begomovirus-leaf-curl-2.jpg", queries: ["Tomato yellow leaf curl virus severe stunting", "Tomato leaf curl virus upward curling leaf", "TYLCV tomato field"] },
  { dir: DISEASES_DIR, file: "disease-begomovirus-leaf-curl-3.jpg", queries: ["Tomato leaf curl yellow margin leaf", "begomovirus tomato chlorosis", "Tomato yellow leaf curl"] },
  { dir: DISEASES_DIR, file: "disease-magnaporthe-oryzae-2.jpg", queries: ["Magnaporthe oryzae neck blast rice panicle", "rice neck blast rotten neck", "Magnaporthe oryzae panicle"] },
  { dir: DISEASES_DIR, file: "disease-magnaporthe-oryzae-3.jpg", queries: ["Rice blast leaf spindle lesion eye spot", "Pyricularia oryzae leaf lesion", "rice blast field"] },
  { dir: DISEASES_DIR, file: "disease-rhizoctonia-solani-2.jpg", queries: ["Rhizoctonia solani rice sheath blight banded lesions", "sheath blight rice leaf sheath lesion", "Rhizoctonia solani rice lesion"] },
  { dir: DISEASES_DIR, file: "disease-rhizoctonia-solani-3.jpg", queries: ["Rhizoctonia solani sclerotia rice sheath", "sheath blight rice sclerotium", "Rhizoctonia solani mycelium"] },
  { dir: DISEASES_DIR, file: "disease-puccinia-striiformis-2.jpg", queries: ["Puccinia striiformis yellow rust stripe wheat leaf", "stripe rust wheat Puccinia", "yellow rust stripe wheat"] },
  { dir: DISEASES_DIR, file: "disease-puccinia-striiformis-3.jpg", queries: ["Wheat yellow rust field chlorotic stripe", "Puccinia striiformis urediniospore stripe", "Puccinia striiformis wheat"] },
  { dir: DISEASES_DIR, file: "disease-colletotrichum-capsici-2.jpg", queries: ["Colletotrichum capsici chilli fruit anthracnose ripe rot", "chilli anthracnose fruit sunken spot", "Colletotrichum chilli anthracnose"] },
  { dir: DISEASES_DIR, file: "disease-colletotrichum-capsici-3.jpg", queries: ["Chilli dieback Colletotrichum branch twig", "Colletotrichum capsici dieback chilli", "pepper anthracnose rot"] },
  { dir: PESTS_DIR, file: "pest-spodoptera-frugiperda-2.jpg", queries: ["Spodoptera frugiperda fall armyworm maize whorl damage", "fall armyworm whorl frass damage maize", "fall armyworm maize leaf windowing"] },
  { dir: PESTS_DIR, file: "pest-spodoptera-frugiperda-3.jpg", queries: ["Spodoptera frugiperda caterpillar inverted Y head", "fall armyworm larva head marks", "Spodoptera frugiperda larva"] },
  { dir: PESTS_DIR, file: "pest-helicoverpa-armigera-2.jpg", queries: ["Helicoverpa armigera larva boring tomato fruit hole", "tomato fruit borer Helicoverpa larva eating", "Helicoverpa armigera tomato fruit"] },
  { dir: PESTS_DIR, file: "pest-helicoverpa-armigera-3.jpg", queries: ["Helicoverpa armigera cotton bollworm caterpillar green", "Helicoverpa armigera larva close up", "Helicoverpa armigera caterpillar"] },
  { dir: PESTS_DIR, file: "pest-scirpophaga-incertulas-2.jpg", queries: ["Yellow stem borer dead heart rice stem damage", "Scirpophaga incertulas dead heart rice", "rice stem borer larva in tiller"] },
  { dir: PESTS_DIR, file: "pest-scirpophaga-incertulas-3.jpg", queries: ["Rice white earhead yellow stem borer panicle", "rice stem borer whitehead damage", "Scirpophaga incertulas adult moth"] },
  { dir: PESTS_DIR, file: "pest-nilaparvata-lugens-2.jpg", queries: ["Nilaparvata lugens brown planthopper hopperburn rice field circular patch", "rice hopper burn brown planthopper", "hopper burn rice Nilaparvata"] },
  { dir: PESTS_DIR, file: "pest-nilaparvata-lugens-3.jpg", queries: ["Brown planthopper nymphs base of rice stem", "Nilaparvata lugens stem crowd nymphs", "Nilaparvata lugens macropterous"] },
  { dir: PESTS_DIR, file: "pest-bemisia-tabaci-2.jpg", queries: ["Bemisia tabaci whitefly nymphs underside leaf", "whitefly nymphs leaf underside Bemisia", "Bemisia tabaci adults leaf"] },
  { dir: PESTS_DIR, file: "pest-bemisia-tabaci-3.jpg", queries: ["Whitefly sooty mold honeydew leaf", "Bemisia tabaci honeydew leaf yellowing", "whitefly sweetpotato leaf Bemisia"] },
];

async function commonsSearch(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?" +
    new URLSearchParams({
      action: "query",
      format: "json",
      generator: "search",
      gsrsearch: query,
      gsrnamespace: "6",
      gsrlimit: "12",
      prop: "imageinfo",
      iiprop: "url|mime|size|extmetadata",
      iiurlwidth: "1280",
    });
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`search ${res.status}`);
  return res.json();
}

function pickBest(pages, excludeTitle = "") {
  if (!pages) return null;
  const scored = [];
  for (const p of Object.values(pages)) {
    const info = p.imageinfo?.[0];
    if (!info?.url) continue;
    const mime = info.mime || "";
    if (!mime.includes("jpeg") && !mime.includes("png") && !mime.includes("webp")) continue;
    const title = (p.title || "").toLowerCase();
    if (title.includes("logo") || title.includes("icon") || title.includes(".svg")) continue;
    if (title.includes("diagram") || title.includes("drawing") || title.includes("illustration")) continue;
    if (title.includes("map") || title.includes("chart")) continue;
    if (excludeTitle && title.includes(excludeTitle.toLowerCase())) continue;
    const license = JSON.stringify(info.extmetadata || {}).toLowerCase();
    let score = Number(info.size) || 0;
    if (mime.includes("jpeg")) score += 400000;
    if (license.includes("public domain") || license.includes("cc0") || license.includes("cc-by")) score += 300000;
    scored.push({ title: p.title, url: info.thumburl || info.url, full: info.url, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored[0] || null;
}

async function downloadToJpeg(url, outPath) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`dl ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf)
    .rotate()
    .resize(1200, 900, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(outPath);
}

async function main() {
  console.log(`Starting authentic download for ${TARGETS.length} targets...`);
  let success = 0;
  let failed = 0;

  for (const t of TARGETS) {
    const outPath = path.join(t.dir, t.file);
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 15000) {
      console.log(`[EXISTS] ${t.file} (${fs.statSync(outPath).size} bytes)`);
      success++;
      continue;
    }

    let downloaded = false;
    for (const q of t.queries) {
      process.stdout.write(`Fetching ${t.file} via [${q}] ... `);
      try {
        const json = await commonsSearch(q);
        const best = pickBest(json.query?.pages);
        if (!best) {
          console.log("no match");
          await new Promise((r) => setTimeout(r, 300));
          continue;
        }
        await downloadToJpeg(best.url, outPath);
        console.log(`OK! (${best.title})`);
        downloaded = true;
        success++;
        break;
      } catch (err) {
        console.log(`error: ${err.message}`);
      }
      await new Promise((r) => setTimeout(r, 400));
    }

    if (!downloaded) {
      console.log(`FAILED ALL QUERIES for ${t.file}`);
      failed++;
    }
    await new Promise((r) => setTimeout(r, 350));
  }

  console.log(`\nCompleted: ${success} succeeded, ${failed} failed.`);
}

main().catch(console.error);
