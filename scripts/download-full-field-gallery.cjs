const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const DISEASES_DIR = path.join(ROOT, "public", "images", "diseases");
const PESTS_DIR = path.join(ROOT, "public", "images", "pests");
const AUTH_DIR = path.join(ROOT, "public", "images", "crop-problems", "auth");

const UA = "AgrivedaFieldGallery/3.0 (https://agriveda-theta.vercel.app; authentic field diagnostic photography)";

const BAD_WORDS = [
  "diagram", "drawing", "illustration", "sketch", "scheme",
  "chemical", "structure", "formula", "molecule", "etoxazole", "compound",
  "map", "chart", "graph", "histogram", "tree", "phylogeny",
  "stamp", "coin", "banknote", "currency",
  "icon", "logo", "vector", "symbol", "sign",
  "catalog", "book", "cover", "title page", "plate", "advertisement", "eb1911", "1896", "1909", "1911",
  "microscope", "microscopic", "spore", "uredospore", "teliospore", "conidia", "conidiophore",
  "asci", "hyphae", "section", "histology", "sem", "tem"
];

function isGoodTitle(title) {
  const t = title.toLowerCase();
  for (const b of BAD_WORDS) {
    if (t.includes(b)) return false;
  }
  return true;
}

async function commonsSearch(query) {
  const url = "https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: "6",
    gsrlimit: "15",
    prop: "imageinfo",
    iiprop: "url|mime|size|extmetadata",
    iiurlwidth: "1280",
  });
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) {
    if (res.status === 429) {
      console.log("[Rate limit, sleeping 3s]");
      await new Promise(r => setTimeout(r, 3000));
      return [];
    }
    throw new Error(`HTTP ${res.status}`);
  }
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  return pages
    .map(p => {
      const info = p.imageinfo?.[0];
      if (!info?.url) return null;
      const mime = info.mime || "";
      if (!mime.includes("jpeg") && !mime.includes("png") && !mime.includes("webp")) return null;
      if (!isGoodTitle(p.title || "")) return null;
      const titleLower = p.title.toLowerCase();
      let bonus = 0;
      if (titleLower.includes("leaf") || titleLower.includes("fruit") || titleLower.includes("damage") || titleLower.includes("larva")) bonus += 1000000;
      return {
        title: p.title,
        url: info.thumburl || info.url,
        size: (Number(info.size) || 0) + bonus
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.size - a.size);
}

async function downloadToJpeg(url, outPath) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`DL ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error("Image buffer too small");
  await sharp(buf)
    .rotate()
    .resize(1200, 900, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(outPath);
}

const GALLERY_DOWNLOADS = [
  // Tomato Bacterial Wilt
  { dir: DISEASES_DIR, file: "disease-ralstonia-solanacearum-2.jpg", queries: ["Ralstonia solanacearum tomato wilted", "bacterial wilt tomato plant", "Ralstonia solanacearum"] },
  { dir: DISEASES_DIR, file: "disease-ralstonia-solanacearum-3.jpg", queries: ["bacterial wilt stem vascular browning", "Ralstonia bacterial wilt leaf", "Ralstonia solanacearum wilt"] },

  // Tomato Fusarium Wilt
  { dir: DISEASES_DIR, file: "disease-fusarium-lycopersici-2.jpg", queries: ["Fusarium oxysporum lycopersici tomato leaf yellowing", "Fusarium wilt tomato leaf", "Fusarium oxysporum tomato"] },
  { dir: DISEASES_DIR, file: "disease-fusarium-lycopersici-3.jpg", queries: ["Fusarium wilt tomato plant wilt", "Fusarium oxysporum f. sp. lycopersici", "Fusarium wilt vascular browning tomato"] },

  // Tomato Leaf Miner
  { dir: PESTS_DIR, file: "pest-liriomyza-trifolii-2.jpg", queries: ["Liriomyza trifolii leaf miner mine tomato", "serpentine leaf miner tomato leaf", "Liriomyza leaf mines"] },
  { dir: PESTS_DIR, file: "pest-liriomyza-trifolii-3.jpg", queries: ["Liriomyza trifolii adult fly", "Liriomyza leaf miner adult", "Liriomyza trifolii"] },

  // Green peach aphid
  { dir: PESTS_DIR, file: "pest-myzus-persicae-2.jpg", queries: ["Myzus persicae green peach aphid colony leaf", "Myzus persicae aphid leaf underside", "Myzus persicae colony"] },
  { dir: PESTS_DIR, file: "pest-myzus-persicae-3.jpg", queries: ["Myzus persicae winged adult alata", "green peach aphid curled leaf", "Myzus persicae"] },

  // Potato common scab
  { dir: DISEASES_DIR, file: "disease-streptomyces-scabies-2.jpg", queries: ["Streptomyces scabies common scab potato tuber lesion", "common scab potato tuber", "Streptomyces scabies potato"] },
  { dir: DISEASES_DIR, file: "disease-streptomyces-scabies-3.jpg", queries: ["potato scab tuber pitted", "Streptomyces scabies lesion", "potato common scab"] },

  // Potato Virus Y
  { dir: DISEASES_DIR, file: "disease-potato-virus-y-2.jpg", queries: ["Potato virus Y leaf mosaic vein clearing", "PVY potato leaf mosaic", "Potato virus Y mosaic"] },
  { dir: DISEASES_DIR, file: "disease-potato-virus-y-3.jpg", queries: ["Potato virus Y necrotic spot leaf", "PVY symptom potato", "Potato virus Y"] },

  // Potato tuber moth
  { dir: PESTS_DIR, file: "pest-phthorimaea-operculella-2.jpg", queries: ["Phthorimaea operculella potato tuber moth larva tunnel", "potato tuber moth damage", "Phthorimaea operculella larva"] },
  { dir: PESTS_DIR, file: "pest-phthorimaea-operculella-3.jpg", queries: ["Phthorimaea operculella adult moth", "potato tuber moth adult", "Phthorimaea operculella"] },

  // Cutworm
  { dir: PESTS_DIR, file: "pest-agrotis-ipsilon-2.jpg", queries: ["Agrotis ipsilon black cutworm caterpillar curled", "black cutworm larva", "Agrotis ipsilon caterpillar"] },
  { dir: PESTS_DIR, file: "pest-agrotis-ipsilon-3.jpg", queries: ["Agrotis ipsilon cutworm seedling cut damage", "Agrotis ipsilon moth adult", "Agrotis ipsilon"] },

  // Rice Tungro
  { dir: DISEASES_DIR, file: "disease-rice-tungro-virus-2.jpg", queries: ["Rice tungro virus orange yellow leaf discoloration", "rice tungro disease yellowing", "rice tungro virus"] },
  { dir: DISEASES_DIR, file: "disease-rice-tungro-virus-3.jpg", queries: ["Nephotettix virescens green leafhopper vector", "rice tungro stunted plant", "Nephotettix virescens"] },

  // Wheat Brown Rust
  { dir: DISEASES_DIR, file: "disease-puccinia-triticina-2.jpg", queries: ["Puccinia triticina leaf rust wheat brown pustule", "Wheat leaf rust on wheat", "Puccinia triticina uredinia"] },
  { dir: DISEASES_DIR, file: "disease-puccinia-triticina-3.jpg", queries: ["Puccinia recondita wheat leaf rust", "wheat brown rust foliage", "Puccinia triticina"] },

  // Wheat Spot Blotch
  { dir: DISEASES_DIR, file: "disease-bipolaris-sorokiniana-2.jpg", queries: ["Bipolaris sorokiniana spot blotch wheat leaf lesion", "spot blotch wheat leaf", "Bipolaris sorokiniana"] },
  { dir: DISEASES_DIR, file: "disease-bipolaris-sorokiniana-3.jpg", queries: ["Cochliobolus sativus leaf spot wheat", "spot blotch foliar wheat", "Bipolaris sorokiniana lesion"] },

  // Wheat aphid
  { dir: PESTS_DIR, file: "pest-sitobion-avenae-2.jpg", queries: ["Sitobion avenae aphids wheat ear head colony", "Sitobion avenae wheat head", "Sitobion avenae colony"] },
  { dir: PESTS_DIR, file: "pest-sitobion-avenae-3.jpg", queries: ["English grain aphid wheat", "Sitobion avenae aphid close up", "Sitobion avenae"] },

  // Termites
  { dir: PESTS_DIR, file: "pest-odontotermes-obesus-2.jpg", queries: ["Odontotermes obesus termite workers soil damage", "termite worker Odontotermes", "Odontotermes termite crop"] },
  { dir: PESTS_DIR, file: "pest-odontotermes-obesus-3.jpg", queries: ["termite mound Odontotermes obesus", "subterranean termite damage root", "Odontotermes"] },

  // Wheat Powdery Mildew
  { dir: DISEASES_DIR, file: "disease-blumeria-graminis-2.jpg", queries: ["Blumeria graminis powdery mildew wheat leaf white patches", "powdery mildew wheat leaf", "Blumeria graminis wheat"] },
  { dir: DISEASES_DIR, file: "disease-blumeria-graminis-3.jpg", queries: ["Blumeria graminis f. sp. tritici", "powdery mildew cereal foliage", "Blumeria graminis"] },

  // Maize NCLB
  { dir: DISEASES_DIR, file: "disease-exserohilum-turcicum-2.jpg", queries: ["Northern corn leaf blight cigar shaped lesion", "Exserohilum turcicum maize leaf lesion", "Exserohilum turcicum"] },
  { dir: DISEASES_DIR, file: "disease-exserohilum-turcicum-3.jpg", queries: ["Setosphaeria turcica northern corn leaf blight", "northern corn leaf blight field", "Exserohilum leaf blight"] },

  // Maize SCLB
  { dir: DISEASES_DIR, file: "disease-bipolaris-maydis-2.jpg", queries: ["Bipolaris maydis southern corn leaf blight leaf lesion", "Cochliobolus heterostrophus maize", "Bipolaris maydis maize"] },
  { dir: DISEASES_DIR, file: "disease-bipolaris-maydis-3.jpg", queries: ["southern corn leaf blight lesion", "Bipolaris maydis leaf", "Bipolaris maydis"] },

  // Maize Rust
  { dir: DISEASES_DIR, file: "disease-puccinia-sorghi-2.jpg", queries: ["Puccinia sorghi common rust maize corn leaf pustules", "common rust maize leaf", "Puccinia sorghi corn"] },
  { dir: DISEASES_DIR, file: "disease-puccinia-sorghi-3.jpg", queries: ["Puccinia sorghi uredinia leaf", "maize common rust pustules", "Puccinia sorghi"] },

  // Maize Spotted Stem Borer
  { dir: PESTS_DIR, file: "pest-chilo-partellus-2.jpg", queries: ["Chilo partellus larva spotted stem borer caterpillar", "Chilo partellus caterpillar maize", "Chilo partellus larva"] },
  { dir: PESTS_DIR, file: "pest-chilo-partellus-3.jpg", queries: ["Chilo partellus dead heart pin holes maize whorl", "spotted stem borer maize damage", "Chilo partellus moth"] },

  // Shoot Fly
  { dir: PESTS_DIR, file: "pest-atherigona-soccata-2.jpg", queries: ["Atherigona soccata shoot fly dead heart seedling", "sorghum shoot fly deadheart", "Atherigona soccata larva"] },
  { dir: PESTS_DIR, file: "pest-atherigona-soccata-3.jpg", queries: ["Atherigona soccata shoot fly adult", "shoot fly adult Atherigona", "Atherigona soccata"] },

  // Onion Purple Blotch 2 and 3
  { dir: DISEASES_DIR, file: "disease-alternaria-porri-2.jpg", queries: ["Alternaria porri onion purple blotch lesion leaf", "purple blotch onion foliage", "Alternaria porri scape"] },
  { dir: DISEASES_DIR, file: "disease-alternaria-porri-3.jpg", queries: ["Alternaria porri Allium cepa purple spot", "purple blotch Allium leaf", "Alternaria porri"] },

  // Onion Stemphylium Blight
  { dir: DISEASES_DIR, file: "disease-stemphylium-vesicarium-2.jpg", queries: ["Stemphylium vesicarium onion leaf blight yellow streak", "Stemphylium leaf blight onion", "Stemphylium vesicarium"] },
  { dir: DISEASES_DIR, file: "disease-stemphylium-vesicarium-3.jpg", queries: ["Pleospora allii Stemphylium onion", "Stemphylium blight Allium", "Stemphylium vesicarium lesion"] },

  // Onion Downy Mildew
  { dir: DISEASES_DIR, file: "disease-peronospora-destructor-2.jpg", queries: ["Peronospora destructor downy mildew onion leaf pale patch", "downy mildew onion leaf", "Peronospora destructor"] },
  { dir: DISEASES_DIR, file: "disease-peronospora-destructor-3.jpg", queries: ["downy mildew Allium cepa foliage", "Peronospora destructor violet downy growth", "Peronospora destructor leaf"] },

  // Onion Fusarium Basal Rot
  { dir: DISEASES_DIR, file: "disease-fusarium-oxysporum-2.jpg", queries: ["Fusarium oxysporum onion basal rot bulb rotting roots", "Fusarium basal rot onion bulb", "Fusarium oxysporum f. sp. cepae"] },
  { dir: DISEASES_DIR, file: "disease-fusarium-oxysporum-3.jpg", queries: ["Fusarium oxysporum bulb rot", "basal rot Allium cepa", "Fusarium oxysporum onion"] },

  // Chilli Powdery Mildew
  { dir: DISEASES_DIR, file: "disease-leveillula-taurica-2.jpg", queries: ["Leveillula taurica powdery mildew chilli pepper leaf white", "powdery mildew pepper leaf", "Leveillula taurica pepper"] },
  { dir: DISEASES_DIR, file: "disease-leveillula-taurica-3.jpg", queries: ["Leveillula taurica Capsicum foliage", "powdery mildew Capsicum annuum", "Leveillula taurica"] },

  // Chilli Broad Mite
  { dir: PESTS_DIR, file: "pest-polyphagotarsonemus-latus-2.jpg", queries: ["Polyphagotarsonemus latus broad mite chilli leaf downward curl", "broad mite chilli downward curling", "Polyphagotarsonemus latus damage"] },
  { dir: PESTS_DIR, file: "pest-polyphagotarsonemus-latus-3.jpg", queries: ["broad mite Capsicum leaf inverted boat", "Polyphagotarsonemus latus mite", "broad mite leaf curling"] },

  // Brinjal Shoot & Fruit Borer
  { dir: PESTS_DIR, file: "pest-leucinodes-orbonalis-2.jpg", queries: ["Leucinodes orbonalis larva in brinjal fruit boring", "brinjal fruit borer larva exit hole", "Leucinodes orbonalis larva"] },
  { dir: PESTS_DIR, file: "pest-leucinodes-orbonalis-3.jpg", queries: ["Leucinodes orbonalis wilting shoot tip brinjal", "brinjal shoot borer drooping shoot", "Leucinodes orbonalis moth"] },

  // Brinjal Phomopsis Blight
  { dir: DISEASES_DIR, file: "disease-phomopsis-vexans-2.jpg", queries: ["Phomopsis vexans brinjal fruit rot circular spot", "Phomopsis blight eggplant fruit rot", "Phomopsis vexans"] },
  { dir: DISEASES_DIR, file: "disease-phomopsis-vexans-3.jpg", queries: ["Diaporthe vexans Phomopsis eggplant leaf spot", "Phomopsis fruit rot Solanum melongena", "Phomopsis vexans lesion"] },

  // Epilachna beetle
  { dir: PESTS_DIR, file: "pest-henosepilachna-2.jpg", queries: ["Henosepilachna vigintioctopunctata spotted beetle leaf skeletonize", "Epilachna beetle brinjal leaf", "Henosepilachna larva"] },
  { dir: PESTS_DIR, file: "pest-henosepilachna-3.jpg", queries: ["Henosepilachna beetle adult 28 spotted", "Epilachna beetle adult brinjal", "Henosepilachna"] },

  // Cabbage Black Rot
  { dir: DISEASES_DIR, file: "disease-xanthomonas-campestris-2.jpg", queries: ["Xanthomonas campestris black rot cabbage V-shaped yellow lesion", "black rot cabbage leaf V shaped", "Xanthomonas campestris cabbage"] },
  { dir: DISEASES_DIR, file: "disease-xanthomonas-campestris-3.jpg", queries: ["black rot brassica leaf black veins", "Xanthomonas campestris black veins", "Xanthomonas campestris"] },

  // Cabbage Butterfly
  { dir: PESTS_DIR, file: "pest-pieris-brassicae-2.jpg", queries: ["Pieris brassicae cabbage butterfly caterpillar cluster feeding", "Pieris brassicae larva cabbage leaf", "Pieris brassicae caterpillars"] },
  { dir: PESTS_DIR, file: "pest-pieris-brassicae-3.jpg", queries: ["Pieris brassicae adult butterfly large white", "Pieris brassicae eggs cabbage leaf", "Pieris brassicae adult"] },

  // Mustard Alternaria Blight
  { dir: DISEASES_DIR, file: "disease-alternaria-brassicae-2.jpg", queries: ["Alternaria brassicae concentric ring spots mustard leaf", "Alternaria brassicae leaf spot mustard", "Alternaria brassicae Brassica"] },
  { dir: DISEASES_DIR, file: "disease-alternaria-brassicae-3.jpg", queries: ["Alternaria blight mustard siliqua pod black spots", "Alternaria brassicae pod spot", "Alternaria brassicae"] },

  // Mustard Sawfly
  { dir: PESTS_DIR, file: "pest-athalia-proxima-2.jpg", queries: ["Athalia proxima mustard sawfly black larva feeding leaf", "mustard sawfly larva", "Athalia lugens larva mustard"] },
  { dir: PESTS_DIR, file: "pest-athalia-proxima-3.jpg", queries: ["Athalia proxima sawfly adult yellow black", "mustard sawfly adult", "Athalia proxima"] },

  // Sugarcane Red Rot
  { dir: DISEASES_DIR, file: "disease-colletotrichum-falcatum-2.jpg", queries: ["Colletotrichum falcatum red rot sugarcane split stalk red pith", "red rot sugarcane internal red pith", "Colletotrichum falcatum red rot"] },
  { dir: DISEASES_DIR, file: "disease-colletotrichum-falcatum-3.jpg", queries: ["sugarcane red rot midrib lesion white patches", "red rot sugarcane cane drying", "Colletotrichum falcatum"] },

  // Sugarcane Smut
  { dir: DISEASES_DIR, file: "disease-sporisorium-scitamineum-2.jpg", queries: ["Sporisorium scitamineum sugarcane smut whip black curved whip", "sugarcane smut whip whip flag", "Sporisorium scitamineum whip"] },
  { dir: DISEASES_DIR, file: "disease-sporisorium-scitamineum-3.jpg", queries: ["sugarcane smut black whip emerging shoot", "Sporisorium scitamineum sugarcane", "sugarcane smut"] },

  // Cotton Pink Bollworm
  { dir: PESTS_DIR, file: "pest-pectinophora-gossypiella-2.jpg", queries: ["Pectinophora gossypiella pink bollworm rosette flower cotton", "pink bollworm rosette flower", "Pectinophora gossypiella rosette"] },
  { dir: PESTS_DIR, file: "pest-pectinophora-gossypiella-3.jpg", queries: ["Pectinophora gossypiella pink larva inside cotton boll", "pink bollworm larva in boll", "Pectinophora gossypiella larva"] },

  // Cotton Bacterial Blight / Angular leaf spot
  { dir: DISEASES_DIR, file: "disease-xanthomonas-citri-malvacearum-2.jpg", queries: ["Xanthomonas citri malvacearum angular leaf spot cotton vein blight", "angular leaf spot cotton Xanthomonas", "Xanthomonas malvacearum cotton"] },
  { dir: DISEASES_DIR, file: "disease-xanthomonas-citri-malvacearum-3.jpg", queries: ["cotton blackarm Xanthomonas stem lesion", "bacterial blight cotton boll rot", "Xanthomonas citri pv malvacearum"] },

  // Cotton Jassid
  { dir: PESTS_DIR, file: "pest-amrasca-biguttula-2.jpg", queries: ["Amrasca biguttula cotton jassid hopper burn leaf curling margin", "cotton jassid hopperburn", "Amrasca biguttula leaf damage"] },
  { dir: PESTS_DIR, file: "pest-amrasca-biguttula-3.jpg", queries: ["Amrasca biguttula green leafhopper nymph adult underside", "Amrasca biguttula leafhopper", "Amrasca biguttula"] },

  // Soybean Rust
  { dir: DISEASES_DIR, file: "disease-phakopsora-pachyrhizi-2.jpg", queries: ["Phakopsora pachyrhizi Asian soybean rust leaf pustules tan brown", "soybean rust leaf pustules", "Phakopsora pachyrhizi soybean"] },
  { dir: DISEASES_DIR, file: "disease-phakopsora-pachyrhizi-3.jpg", queries: ["Asian soybean rust defoliation yellowing", "Phakopsora pachyrhizi rust field", "Phakopsora pachyrhizi"] },

  // Spodoptera litura (Tobacco caterpillar)
  { dir: PESTS_DIR, file: "pest-spodoptera-litura-2.jpg", queries: ["Spodoptera litura caterpillar larva feeding soybean leaf", "tobacco caterpillar larva soybean", "Spodoptera litura caterpillar"] },
  { dir: PESTS_DIR, file: "pest-spodoptera-litura-3.jpg", queries: ["Spodoptera litura egg mass covered with brown scales", "Spodoptera litura moth adult", "Spodoptera litura larva cluster"] },

  // Okra YVMV
  { dir: DISEASES_DIR, file: "disease-bhendi-yvmv-2.jpg", queries: ["bhendi yellow vein mosaic okra leaf yellow veins green island", "yellow vein mosaic okra leaf", "okra yellow vein mosaic virus"] },
  { dir: DISEASES_DIR, file: "disease-bhendi-yvmv-3.jpg", queries: ["okra yellow vein mosaic stunted chlorotic fruit", "bhendi yellow vein virus fruit", "okra YVMV"] },

  // Okra Spotted Bollworm
  { dir: PESTS_DIR, file: "pest-earias-vittella-2.jpg", queries: ["Earias vittella spotted bollworm larva boring okra bhendi fruit", "spotted bollworm okra fruit borer", "Earias vittella larva"] },
  { dir: PESTS_DIR, file: "pest-earias-vittella-3.jpg", queries: ["Earias vittella drooping withered shoot okra tip", "Earias vittella moth adult green band", "Earias vittella"] },

  // Cucumber Downy Mildew
  { dir: DISEASES_DIR, file: "disease-pseudoperonospora-cubensis-2.jpg", queries: ["Pseudoperonospora cubensis downy mildew cucumber angular yellow spot", "downy mildew cucumber leaf angular", "Pseudoperonospora cubensis"] },
  { dir: DISEASES_DIR, file: "disease-pseudoperonospora-cubensis-3.jpg", queries: ["cucumber downy mildew purplish gray spore underside", "downy mildew melon leaf", "Pseudoperonospora cubensis leaf"] },

  // Melon Fruit Fly
  { dir: PESTS_DIR, file: "pest-bactrocera-cucurbitae-2.jpg", queries: ["Bactrocera cucurbitae melon fruit fly larva maggot rotting fruit", "melon fruit fly puncture oozing fluid", "Bactrocera cucurbitae damage"] },
  { dir: PESTS_DIR, file: "pest-bactrocera-cucurbitae-3.jpg", queries: ["Bactrocera cucurbitae melon fly adult resting on cucumber", "Bactrocera cucurbitae adult", "melon fruit fly adult"] },

  // Red Pumpkin Beetle
  { dir: PESTS_DIR, file: "pest-aulacophora-foveicollis-2.jpg", queries: ["Aulacophora foveicollis red pumpkin beetle feeding circular cuts", "red pumpkin beetle cucurbit leaf damage", "Aulacophora foveicollis"] },
  { dir: PESTS_DIR, file: "pest-aulacophora-foveicollis-3.jpg", queries: ["Aulacophora foveicollis orange red beetle on leaf", "red pumpkin beetle adult", "Aulacophora foveicollis beetle"] },

  // Mungbean Yellow Mosaic Virus
  { dir: DISEASES_DIR, file: "disease-mungbean-yellow-mosaic-virus-2.jpg", queries: ["mungbean yellow mosaic virus bright yellow spots green leaf", "MYMV yellow mosaic mungbean", "yellow mosaic virus Vigna"] },
  { dir: DISEASES_DIR, file: "disease-mungbean-yellow-mosaic-virus-3.jpg", queries: ["yellow mosaic mungbean chlorosis pod", "MYMV leaf mosaic", "mungbean yellow mosaic"] },

  // Groundnut Tikka / Leaf Spot
  { dir: DISEASES_DIR, file: "disease-cercospora-arachidicola-2.jpg", queries: ["Cercospora arachidicola tikka disease groundnut peanut leaf spot", "early leaf spot groundnut peanut", "Cercospora arachidicola peanut"] },
  { dir: DISEASES_DIR, file: "disease-cercospora-arachidicola-3.jpg", queries: ["Nothopassalora personata late leaf spot groundnut dark spot", "tikka leaf spot peanut", "groundnut leaf spot Cercospora"] },

  // Groundnut Rust
  { dir: DISEASES_DIR, file: "disease-puccinia-arachidis-2.jpg", queries: ["Puccinia arachidis groundnut rust orange brown pustules leaf underside", "groundnut rust peanut leaf pustule", "Puccinia arachidis"] },
  { dir: DISEASES_DIR, file: "disease-puccinia-arachidis-3.jpg", queries: ["peanut rust Puccinia arachidis lower leaf surface", "groundnut rust defoliation", "Puccinia arachidis rust"] },

  // Groundnut Collar Rot
  { dir: DISEASES_DIR, file: "disease-sclerotium-rolfsii-2.jpg", queries: ["Sclerotium rolfsii collar rot white mycelium mustard like sclerotia", "stem rot peanut Sclerotium rolfsii", "Sclerotium rolfsii collar rot"] },
  { dir: DISEASES_DIR, file: "disease-sclerotium-rolfsii-3.jpg", queries: ["Athelia rolfsii crown rot soil line", "Sclerotium rolfsii sclerotia on collar", "Sclerotium rolfsii"] },

  // Gram Ascochyta Blight
  { dir: DISEASES_DIR, file: "disease-ascochyta-rabiei-2.jpg", queries: ["Ascochyta rabiei chickpea blight circular lesions concentric pycnidia", "Ascochyta blight chickpea pod stem", "Ascochyta rabiei chickpea"] },
  { dir: DISEASES_DIR, file: "disease-ascochyta-rabiei-3.jpg", queries: ["chickpea blight dark necrotic ring pod", "Ascochyta rabiei stem break lesion", "Ascochyta rabiei"] },

  // Gram Fusarium Wilt
  { dir: DISEASES_DIR, file: "disease-fusarium-ciceri-2.jpg", queries: ["Fusarium oxysporum f. sp. ciceris chickpea wilt drooping foliage", "Fusarium wilt chickpea plant drooping", "Fusarium oxysporum ciceris"] },
  { dir: DISEASES_DIR, file: "disease-fusarium-ciceri-3.jpg", queries: ["chickpea wilt root split internal brown black xylem", "Fusarium wilt chickpea vascular browning", "Fusarium ciceris wilt"] },

  // Banana Panama Wilt
  { dir: DISEASES_DIR, file: "disease-fusarium-cubense-2.jpg", queries: ["Fusarium oxysporum f. sp. cubense Panama disease banana leaf yellow skirt", "Panama disease banana wilt", "Fusarium oxysporum cubense"] },
  { dir: DISEASES_DIR, file: "disease-fusarium-cubense-3.jpg", queries: ["Panama disease banana pseudostem vascular discolouration split", "banana Panama wilt pseudostem cross section", "Fusarium cubense"] },

  // Mango Anthracnose
  { dir: DISEASES_DIR, file: "disease-colletotrichum-gloeosporioides-2.jpg", queries: ["Colletotrichum gloeosporioides mango anthracnose black tear stains fruit", "mango anthracnose fruit rot black spots", "Colletotrichum gloeosporioides mango"] },
  { dir: DISEASES_DIR, file: "disease-colletotrichum-gloeosporioides-3.jpg", queries: ["mango blossom blight anthracnose flower panicle", "Colletotrichum mango leaf blight", "Colletotrichum gloeosporioides"] },

  // Mango Powdery Mildew
  { dir: DISEASES_DIR, file: "disease-oidium-mangiferae-2.jpg", queries: ["Oidium mangiferae powdery mildew mango blossom panicle white powder", "mango powdery mildew flower drop", "Oidium mangiferae mango"] },
  { dir: DISEASES_DIR, file: "disease-oidium-mangiferae-3.jpg", queries: ["powdery mildew mango fruitlet dropping", "Oidium mangiferae inflorescence", "Oidium mangiferae"] },

  // Grape Downy Mildew
  { dir: DISEASES_DIR, file: "disease-plasmopara-viticola-2.jpg", queries: ["Plasmopara viticola downy mildew grapevine oil spot yellow leaf", "downy mildew grape leaf oil spots", "Plasmopara viticola grape"] },
  { dir: DISEASES_DIR, file: "disease-plasmopara-viticola-3.jpg", queries: ["Plasmopara viticola white downy growth grape cluster berry rot", "downy mildew grape cluster", "Plasmopara viticola"] },

  // Grape Powdery Mildew
  { dir: DISEASES_DIR, file: "disease-uncinula-necator-2.jpg", queries: ["Erysiphe necator powdery mildew grape berry cracking gray ash", "powdery mildew grape berry splitting", "Erysiphe necator grape"] },
  { dir: DISEASES_DIR, file: "disease-uncinula-necator-3.jpg", queries: ["powdery mildew grapevine leaf webby white powder", "Uncinula necator leaf grape", "Erysiphe necator"] },

  // Ginger Rhizome Rot / Pythium
  { dir: DISEASES_DIR, file: "disease-pythium-aphanidermatum-2.jpg", queries: ["Pythium aphanidermatum ginger soft rot rhizome rotting pseudostem collapse", "soft rot ginger rhizome rot", "Pythium aphanidermatum ginger"] },
  { dir: DISEASES_DIR, file: "disease-pythium-aphanidermatum-3.jpg", queries: ["Pythium ginger rhizome rotting foul smell", "Pythium soft rot collar water soaked", "Pythium aphanidermatum"] }
];

async function run() {
  console.log(`Starting download of ${GALLERY_DOWNLOADS.length} authentic field photos...`);
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of GALLERY_DOWNLOADS) {
    const outPath = path.join(item.dir, item.file);
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 12000) {
      skipped++;
      continue;
    }

    process.stdout.write(`Fetching ${item.file} ... `);
    let ok = false;
    for (const q of item.queries) {
      try {
        const results = await commonsSearch(q);
        if (results.length > 0) {
          const best = results[0];
          await downloadToJpeg(best.url, outPath);
          console.log(`OK! (${best.title.slice(0, 45)})`);
          ok = true;
          downloaded++;
          break;
        }
      } catch (e) {
        // try next query
      }
      // polite delay
      await new Promise(r => setTimeout(r, 700));
    }

    if (!ok) {
      console.log("NO MATCH");
      failed++;
    }
    // polite delay between items
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\nGallery Download Completed: Downloaded: ${downloaded}, Skipped (already exist): ${skipped}, Failed: ${failed}`);
}

run().catch(console.error);
