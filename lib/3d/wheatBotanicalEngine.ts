import * as THREE from "three";

/**
 * AGRIVEDA BOTANICAL 3D PLANT & SOIL PROFILE ENGINE
 * Scientific FAO / ICAR-IIWBR botanical accuracy for all 10 Wheat Growth Stages.
 * Features an authentic open Soil Profile Trench (मृदा परिच्छेदिका) where roots,
 * seed, and subterranean horizons are 100% visible without obstruction.
 */

export interface BotanicalHotspot {
  id: string;
  titleHi: string;
  categoryHi: string;
  descriptionHi: string;
  agronomyHi: string;
  position: THREE.Vector3;
}

export interface Stage3DConfig {
  stageId: string;
  stageNumber: number;
  nameHi: string;
  daysRange: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  showSoilProfile: boolean;
  hotspots: BotanicalHotspot[];
}

export const STAGES_3D_CONFIG: Record<string, Stage3DConfig> = {
  germination: {
    stageId: "germination",
    stageNumber: 1,
    nameHi: "अंकुरण व जमाव",
    daysRange: "0–10 दिन",
    cameraPosition: [0, 0.2, 5.2],
    cameraTarget: [0, -0.4, 0],
    showSoilProfile: true,
    hotspots: [
      {
        id: "seed",
        titleHi: "गेहूँ का बीज (Caryopsis)",
        categoryHi: "सुप्त अवस्था से सक्रिय",
        descriptionHi: "बीज मिट्टी से 35-40% नमी सोखकर फूल जाता है और भ्रूण सक्रिय होता है।",
        agronomyHi: "बीज को 4-5 सेमी गहराई पर ही बोएं। अधिक गहरा बोने से जमाव कमजोर होता है।",
        position: new THREE.Vector3(0, 0, 0.25),
      },
      {
        id: "radicle",
        titleHi: "प्राथमिक जड़ (Radicle)",
        categoryHi: "पहली जड़",
        descriptionHi: "बीज से सबसे पहले निकलने वाली मुख्य जड़ जो तेजी से नीचे की ओर नमी तलाशती है।",
        agronomyHi: "शुरुआती 10 दिनों तक पौधे का पोषण इसी जड़ और बीज के एंडोस्पर्म से होता है।",
        position: new THREE.Vector3(0, -1.6, 0.2),
      },
      {
        id: "coleoptile",
        titleHi: "प्रांकुर चोल (Coleoptile)",
        categoryHi: "पहला प्ररोह",
        descriptionHi: "कठोर सुरक्षात्मक सुई जो मिट्टी को चीरकर पहली हरी पत्ती को सूर्यप्रकाश में लाती है।",
        agronomyHi: "मिट्टी पर पपड़ी (Crust) न जमने दें, नहीं तो प्रांकुर बाहर नहीं आ पाएगा।",
        position: new THREE.Vector3(0.08, 1.1, 0.2),
      },
      {
        id: "soil_profile",
        titleHi: "मृदा परिच्छेदिका (Soil Profile)",
        categoryHi: "भूमिगत स्तर",
        descriptionHi: "ऊपरी उपजाऊ टॉपसॉइल (A Horizon) व निचली सबसॉइल में नमी का स्तर स्पष्ट दिखता है।",
        agronomyHi: "बुवाई के समय पर्याप्त ओट (नमी) 100% एकसमान जमाव सुनिश्चित करती है।",
        position: new THREE.Vector3(-1.8, -0.8, 0.1),
      },
    ],
  },
  cri: {
    stageId: "cri",
    stageNumber: 2,
    nameHi: "क्राउन जड़ विकास (CRI)",
    daysRange: "18–25 दिन",
    cameraPosition: [0, 0.6, 5.4],
    cameraTarget: [0, 0.2, 0],
    showSoilProfile: true,
    hotspots: [
      {
        id: "crown_roots",
        titleHi: "क्राउन जड़ चक्र (Crown Roots)",
        categoryHi: "स्थायी जड़ तंत्र",
        descriptionHi: "बीज के 2 सेमी ऊपर तने के आधार से निकलने वाला मजबूत जड़ों का चक्र।",
        agronomyHi: "जीवन का सबसे निर्णायक पहला पानी (21 दिन पर)! देरी से कल्ले और पैदावार घटती है।",
        position: new THREE.Vector3(0.3, 0.2, 0.25),
      },
      {
        id: "primary_leaves",
        titleHi: "3-4 प्राथमिक पत्तियां",
        categoryHi: "प्रकाश संश्लेषण",
        descriptionHi: "गहरी हरी स्वस्थ पत्तियां जो पौधे के भोजन निर्माण का मुख्य केंद्र बनती हैं।",
        agronomyHi: "इस समय पहली यूरिया टॉप ड्रेसिंग (45-50 किग्रा/एकड़) सिंचाई के बाद दें।",
        position: new THREE.Vector3(0.2, 1.8, 0.2),
      },
    ],
  },
  tillering: {
    stageId: "tillering",
    stageNumber: 3,
    nameHi: "कल्ले फूटना (Tillering)",
    daysRange: "25–40 दिन",
    cameraPosition: [0, 0.8, 5.6],
    cameraTarget: [0, 0.4, 0],
    showSoilProfile: true,
    hotspots: [
      {
        id: "tillers",
        titleHi: "कल्ले (Tillers)",
        categoryHi: "शाखाएं",
        descriptionHi: "मुख्य तने के चारों ओर 4 से 6 नए स्वस्थ कल्ले निकलकर सघन पौधा बनाते हैं।",
        agronomyHi: "जिंक और नाइट्रोजन का सही संतुलन अधिक और फलदायी कल्ले बनाता है।",
        position: new THREE.Vector3(0.45, 1.4, 0.2),
      },
      {
        id: "adventitious_roots",
        titleHi: "सघन रेशेदार जड़ जाल",
        categoryHi: "पोषक तत्व अवशोषण",
        descriptionHi: "मिट्टी के 15-20 सेमी घेरे में फैला घना जड़ जाल जो पौधों को गिरने से बचाता है।",
        agronomyHi: "हल्की नमी बनाए रखें, अधिक जलभराव से जड़ें काली पड़ सकती हैं।",
        position: new THREE.Vector3(-0.4, -1.2, 0.2),
      },
    ],
  },
  stem_elongation: {
    stageId: "stem_elongation",
    stageNumber: 4,
    nameHi: "गांठ बनना (Jointing)",
    daysRange: "40–60 दिन",
    cameraPosition: [0, 1.2, 5.8],
    cameraTarget: [0, 1.0, 0],
    showSoilProfile: true,
    hotspots: [
      {
        id: "stem_nodes",
        titleHi: "तने की गांठें (Stem Nodes)",
        categoryHi: "मजबूत तना",
        descriptionHi: "तने पर पहली और दूसरी गांठ उंगलियों से छूने पर स्पष्ट महसूस होती है।",
        agronomyHi: "दूसरा पानी (40-45 दिन) व दूसरी यूरिया डोज देने का सबसे उपयुक्त समय।",
        position: new THREE.Vector3(0.08, 1.2, 0.2),
      },
      {
        id: "internodes",
        titleHi: "पोरियां (Internodes)",
        categoryHi: "तीव्र बढ़वार",
        descriptionHi: "गांठों के बीच का तना तेजी से लंबा होकर पौधे को ऊंचाई प्रदान करता है।",
        agronomyHi: "इस समय तना छेदक (Stem Borer) और दीमक की निगरानी जरूरी है।",
        position: new THREE.Vector3(0.08, 2.2, 0.2),
      },
    ],
  },
  booting: {
    stageId: "booting",
    stageNumber: 5,
    nameHi: "गोभ अवस्था (Booting)",
    daysRange: "60–75 दिन",
    cameraPosition: [0, 2.2, 5.0],
    cameraTarget: [0, 2.2, 0],
    showSoilProfile: false,
    hotspots: [
      {
        id: "swollen_boot",
        titleHi: "फूला हुआ गोभ (Swollen Boot)",
        categoryHi: "सुरक्षित बाली",
        descriptionHi: "अंतिम पत्ती के खोल में बंद विकसित होती बाली, तना ऊपर से मोटा हो जाता है।",
        agronomyHi: "तीसरा पानी लगाएं। इस समय पानी की कमी से बाली में दानों की संख्या घट जाती है।",
        position: new THREE.Vector3(0.05, 2.7, 0.2),
      },
      {
        id: "flag_leaf",
        titleHi: "झंडा पत्ती (Flag Leaf)",
        categoryHi: "मुख्य ऊर्जा स्रोत",
        descriptionHi: "सबसे ऊपरी चौड़ी हरी पत्ती। दानों का 50% से अधिक वजन इसी की बदौलत बनता है।",
        agronomyHi: "झंडा पत्ती को पीला रतुआ (Yellow Rust) से बचाना अत्यंत आवश्यक है।",
        position: new THREE.Vector3(-0.6, 3.2, 0.2),
      },
    ],
  },
  heading: {
    stageId: "heading",
    stageNumber: 6,
    nameHi: "बाली निकलना (Heading)",
    daysRange: "75–85 दिन",
    cameraPosition: [0, 2.8, 4.6],
    cameraTarget: [0, 2.8, 0],
    showSoilProfile: false,
    hotspots: [
      {
        id: "emerged_spike",
        titleHi: "हरी बाली (Wheat Spike)",
        categoryHi: "पूर्ण बाली",
        descriptionHi: "गोभ से पूर्णतः बाहर निकल आई सीधी हरी बाली, 18-22 स्पाइकलेट्स के साथ।",
        agronomyHi: "चौथी सिंचाई (बाली निकलते समय) अत्यंत आवश्यक है।",
        position: new THREE.Vector3(0.04, 3.2, 0.2),
      },
      {
        id: "awns",
        titleHi: "मूंछें / सूंड (Awns)",
        categoryHi: "प्रकाश संश्लेषण",
        descriptionHi: "बाली के प्रत्येक दाने के खोल से निकली लंबी तीखी सुई जैसी मूंछें।",
        agronomyHi: "मूंछें धूप सोखकर दानों में स्टार्च भरने में सक्रिय भूमिका निभाती हैं।",
        position: new THREE.Vector3(0.3, 4.0, 0.2),
      },
    ],
  },
  flowering: {
    stageId: "flowering",
    stageNumber: 7,
    nameHi: "फूल व परागण (Flowering)",
    daysRange: "85–95 दिन",
    cameraPosition: [0, 2.9, 4.2],
    cameraTarget: [0, 2.9, 0],
    showSoilProfile: false,
    hotspots: [
      {
        id: "anthers",
        titleHi: "परागकोश (Yellow Anthers)",
        categoryHi: "परागण प्रक्रिया",
        descriptionHi: "बाली पर लटकते नाजुक हल्के पीले फूल। यह अवधि केवल 3-5 दिन चलती है।",
        agronomyHi: "फूल आते समय किसी भी प्रकार का कीटनाशक छिड़काव न करें, परागण प्रभावित होगा।",
        position: new THREE.Vector3(0.12, 3.0, 0.22),
      },
      {
        id: "fertilization",
        titleHi: "गर्भधारण (Fertilization)",
        categoryHi: "दाना निर्माण",
        descriptionHi: "प्रत्येक स्पाइकलेट में दाने बनने की प्रक्रिया शुरू होती है।",
        agronomyHi: "तेज हवा व भारी पानी से बचें ताकि फसल गिरे (Lodging) नहीं।",
        position: new THREE.Vector3(-0.1, 2.6, 0.2),
      },
    ],
  },
  milking: {
    stageId: "milking",
    stageNumber: 8,
    nameHi: "दूधिया अवस्था (Milking)",
    daysRange: "95–105 दिन",
    cameraPosition: [0, 2.7, 4.4],
    cameraTarget: [0, 2.6, 0],
    showSoilProfile: false,
    hotspots: [
      {
        id: "milky_grains",
        titleHi: "दूधिया दाने (Milky Grains)",
        categoryHi: "रस भराव",
        descriptionHi: "दाने को उंगली से दबाने पर सफेद दूधिया रस निकलता है। वजन तेजी से बढ़ता है।",
        agronomyHi: "पांचवीं सिंचाई (दूधिया अवस्था)! पानी की कमी से दाना पिचक जाएगा।",
        position: new THREE.Vector3(0.08, 2.8, 0.2),
      },
      {
        id: "nodding_ear",
        titleHi: "झुकती बाली (Nodding Spike)",
        categoryHi: "वजन वृद्धि",
        descriptionHi: "दानों में वजन भरने से बाली हल्की सी झुकने लगती है।",
        agronomyHi: "तापमान 32°C से ऊपर जाने पर हल्की शाम की सिंचाई तापमान नियंत्रित रखती है।",
        position: new THREE.Vector3(0.3, 3.2, 0.2),
      },
    ],
  },
  dough: {
    stageId: "dough",
    stageNumber: 9,
    nameHi: "सख्त दाना (Dough Stage)",
    daysRange: "105–115 दिन",
    cameraPosition: [0, 2.6, 4.6],
    cameraTarget: [0, 2.4, 0],
    showSoilProfile: false,
    hotspots: [
      {
        id: "dough_grains",
        titleHi: "सख्त आटा दाना (Dough Stage)",
        categoryHi: "स्टार्च परिपक्वता",
        descriptionHi: "दूधिया रस सूखकर गाढ़े आटे जैसा बन जाता है। नाखून से दबाने पर निशान बनता है।",
        agronomyHi: "अंतिम हल्की सिंचाई (यदि जरूरत हो)। इसके बाद सिंचाई पूर्णतः बंद कर दें।",
        position: new THREE.Vector3(0.12, 2.6, 0.2),
      },
      {
        id: "golden_transition",
        titleHi: "सुनहरा बदलाव",
        categoryHi: "पकाव की शुरुआत",
        descriptionHi: "पौधे का हरा रंग धीरे-धीरे सुनहरे भूरे रंग में बदलना शुरू होता है।",
        agronomyHi: "चूहों से बचाव करें, दाना सख्त होते ही चूहे नुकसान पहुंचाते हैं।",
        position: new THREE.Vector3(-0.2, 1.8, 0.2),
      },
    ],
  },
  ripening: {
    stageId: "ripening",
    stageNumber: 10,
    nameHi: "पकी सुनहरी बाली (Ripening)",
    daysRange: "115–135 दिन",
    cameraPosition: [0, 2.4, 4.6],
    cameraTarget: [0, 2.2, 0],
    showSoilProfile: false,
    hotspots: [
      {
        id: "golden_spike",
        titleHi: "पकी सुनहरी बाली",
        categoryHi: "कटाई तैयार",
        descriptionHi: "100% सुनहरी चमकदार बाली, 45° झुकी हुई, मूंछें सूखी और कड़क।",
        agronomyHi: "दांत से काटने पर 'कट' की आवाज आए तो समझें नमी 12-14% है और कटाई का सही समय है।",
        position: new THREE.Vector3(0.2, 2.4, 0.2),
      },
      {
        id: "dry_stem",
        titleHi: "सूखा सुनहरा तना (Straw)",
        categoryHi: "भूसा व चारा",
        descriptionHi: "पोषक तत्वों से भरपूर सूखा तना जो बेहतरीन तूड़ी/भूसा बनाता है।",
        agronomyHi: "हार्वेस्टर या रीपर से धूप वाले सूखे दिन में ही कटाई करें।",
        position: new THREE.Vector3(0.04, 1.1, 0.2),
      },
    ],
  },
};

/**
 * Procedural Soil Profile Trench with Scientific Cross-Section.
 * Built with an OPEN FRONT PLANE so roots and subterranean organs
 * are 100% visible with zero occlusions!
 */
export function createTrueSoilProfileTrench(): THREE.Group {
  const group = new THREE.Group();

  const width = 6.4;
  const height = 4.8;
  const depth = 2.4;

  // 1. Back Stratified Soil Wall (Behind the plant, z from -0.05 to -2.4)
  const backWallGeom = new THREE.PlaneGeometry(width, height, 48, 48);
  const backPos = backWallGeom.attributes.position;
  const backColors = new Float32Array(backPos.count * 3);

  // Surface line is at y = 0.6
  // Seed is at y = 0.0 (-5cm depth)
  // Deep soil extends down to y = -4.2
  for (let i = 0; i < backPos.count; i++) {
    const y = backPos.getY(i) - 1.8; // shifted downwards
    backPos.setY(i, y);

    // Natural clod texture roughness on the back cut face
    const x = backPos.getX(i);
    const bump = Math.sin(x * 5 + y * 4) * 0.06 + Math.cos(x * 12 - y * 9) * 0.025;
    backPos.setZ(i, -0.08 + bump);

    // Vertical Stratified Horizons Coloring:
    // y > 0.4: Topsoil Horizon A (Dark rich humus crumb loam)
    // -1.5 < y <= 0.4: Subsoil Horizon B (Clay mineral loam, warm amber-brown)
    // y <= -1.5: Deep Horizon C (Moist subterranean bedrock gradient)
    const color = new THREE.Color();
    if (y > 0.3) {
      color.setRGB(0.14, 0.09, 0.05); // Rich dark humus topsoil
    } else if (y > -1.4) {
      const t = (y - -1.4) / 1.7;
      color.setRGB(
        0.24 * t + 0.18 * (1 - t),
        0.15 * t + 0.11 * (1 - t),
        0.08 * t + 0.06 * (1 - t)
      );
    } else {
      color.setRGB(0.11, 0.08, 0.05); // Deep subterranean moist bed
    }

    // Micro speckle noise
    const noise = (Math.random() - 0.5) * 0.03;
    backColors[i * 3] = Math.max(0, Math.min(1, color.r + noise));
    backColors[i * 3 + 1] = Math.max(0, Math.min(1, color.g + noise));
    backColors[i * 3 + 2] = Math.max(0, Math.min(1, color.b + noise));
  }

  backWallGeom.setAttribute("color", new THREE.BufferAttribute(backColors, 3));
  backWallGeom.computeVertexNormals();

  const backMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.95,
    metalness: 0.02,
    side: THREE.DoubleSide,
  });

  const backWall = new THREE.Mesh(backWallGeom, backMaterial);
  backWall.receiveShadow = true;
  group.add(backWall);

  // 2. Soil Surface Ground Plane (Flat horizontal clod plane at y = 0.6, z < 0)
  const surfaceGeom = new THREE.PlaneGeometry(width, depth, 36, 24);
  surfaceGeom.rotateX(-Math.PI / 2);
  const sPos = surfaceGeom.attributes.position;
  for (let i = 0; i < sPos.count; i++) {
    const x = sPos.getX(i);
    const z = sPos.getZ(i);
    const crumb = Math.sin(x * 6 + z * 5) * 0.04 + Math.cos(x * 14 - z * 10) * 0.02;
    sPos.setY(i, crumb);
  }
  surfaceGeom.computeVertexNormals();

  const surfaceMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#2a1b10"),
    roughness: 0.92,
  });
  const surfaceMesh = new THREE.Mesh(surfaceGeom, surfaceMat);
  surfaceMesh.position.set(0, 0.6, -depth * 0.5);
  surfaceMesh.receiveShadow = true;
  group.add(surfaceMesh);

  // 3. Scientific Depth Gauge on Left Flank (Depth Ticks in cm)
  const depthTicks = [
    { label: "0 cm (सतह)", y: 0.6, color: "#34d399" },
    { label: "-5 cm (बीज)", y: 0.0, color: "#fbbf24" },
    { label: "-15 cm", y: -1.2, color: "#94a3b8" },
    { label: "-30 cm", y: -2.4, color: "#94a3b8" },
    { label: "-45 cm (गहरी नमी)", y: -3.6, color: "#38bdf8" },
  ];

  const lineMat = new THREE.LineBasicMaterial({
    color: new THREE.Color("#4ade80"),
    transparent: true,
    opacity: 0.65,
  });

  depthTicks.forEach((tick) => {
    const points = [
      new THREE.Vector3(-width * 0.48, tick.y, 0.02),
      new THREE.Vector3(-width * 0.44, tick.y, 0.02),
    ];
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geom, lineMat);
    group.add(line);
  });

  // Vertical scale line
  const vertScaleGeom = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-width * 0.48, 0.6, 0.02),
    new THREE.Vector3(-width * 0.48, -3.8, 0.02),
  ]);
  const vertLine = new THREE.Line(
    vertScaleGeom,
    new THREE.LineBasicMaterial({ color: "#10b981", transparent: true, opacity: 0.4 })
  );
  group.add(vertLine);

  return group;
}

/**
 * Creates a high-fidelity procedural wheat seed caryopsis geometry.
 */
export function createDetailedSeedMesh(): THREE.Mesh {
  const widthSegments = 64;
  const heightSegments = 64;
  const geometry = new THREE.SphereGeometry(1, widthSegments, heightSegments);
  const pos = geometry.attributes.position;
  const v = new THREE.Vector3();

  const length = 1.8;
  const width = 0.85;
  const thickness = 0.76;

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const ny = v.y;
    const nx = v.x;
    const nz = v.z;

    const contour = Math.pow(Math.max(0, 1 - ny * ny), 0.52);
    const taper = 1.0 - 0.12 * ny + (ny < -0.4 ? (ny + 0.4) * 0.25 : 0);

    let x = nx * width * contour * taper;
    let y = ny * (length * 0.5);
    let z = nz * thickness * contour * taper;

    // Ventral furrow (खांचा)
    if (nz < 0.06) {
      const creaseDepth = 0.35 * (1 - Math.abs(ny) * 0.55);
      const furrow = Math.exp(-Math.pow(x / 0.22, 2)) * creaseDepth;
      z -= furrow;
    } else {
      // Dorsal embryo shield (Scutellum)
      if (ny < -0.35 && ny > -0.95) {
        const embryoFactor = Math.sin(((ny - -0.95) / 0.6) * Math.PI);
        const embryoShield = Math.exp(-Math.pow(x / 0.35, 2)) * embryoFactor * 0.065;
        z += embryoShield;
      }
    }

    pos.setXYZ(i, x, y, z);
  }

  geometry.computeVertexNormals();

  const seedMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#d9822b"),
    roughness: 0.58,
    metalness: 0.04,
  });

  const mesh = new THREE.Mesh(geometry, seedMat);
  mesh.castShadow = true;
  return mesh;
}

/**
 * Creates 3D leaf blade geometry with central midrib and arching curve.
 */
function createWheatLeafMesh(
  start: THREE.Vector3,
  mid: THREE.Vector3,
  tip: THREE.Vector3,
  width: number,
  colorHex: string = "#22c55e"
): THREE.Mesh {
  const curve = new THREE.QuadraticBezierCurve3(start, mid, tip);
  const segments = 24;
  const points = curve.getPoints(segments);

  const geom = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];

  points.forEach((p, idx) => {
    const t = idx / segments;
    const w = width * Math.sin(t * Math.PI * 0.85 + 0.15) * (1 - t * 0.7);
    // Normal perpendicular in XY
    const dx = idx < segments ? points[idx + 1].x - p.x : p.x - points[idx - 1].x;
    const dy = idx < segments ? points[idx + 1].y - p.y : p.y - points[idx - 1].y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    // Left vertex
    vertices.push(p.x + nx * w, p.y + ny * w, p.z);
    // Midrib vertex (slightly pushed along Z for 3D crease)
    vertices.push(p.x, p.y, p.z + 0.04 * (1 - t));
    // Right vertex
    vertices.push(p.x - nx * w, p.y - ny * w, p.z);
  });

  for (let i = 0; i < segments; i++) {
    const base = i * 3;
    const next = (i + 1) * 3;

    // Left quad (2 tris)
    indices.push(base, next, base + 1);
    indices.push(next, next + 1, base + 1);

    // Right quad (2 tris)
    indices.push(base + 1, next + 1, base + 2);
    indices.push(next + 1, next + 2, base + 2);
  }

  geom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    roughness: 0.38,
    metalness: 0.02,
    side: THREE.DoubleSide,
  });

  return new THREE.Mesh(geom, mat);
}

/**
 * Creates procedural wheat ear (Spike) with spikelets and awns.
 */
function createWheatSpikeMesh(
  baseY: number,
  height: number,
  colorHex: string = "#4ade80",
  awnColorHex: string = "#86efac",
  hasAnthers: boolean = false
): THREE.Group {
  const spikeGroup = new THREE.Group();

  // Central Rachis
  const rachisGeom = new THREE.CylinderGeometry(0.04, 0.07, height, 12);
  const rachisMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    roughness: 0.5,
  });
  const rachis = new THREE.Mesh(rachisGeom, rachisMat);
  rachis.position.set(0, baseY + height * 0.5, 0);
  spikeGroup.add(rachis);

  // Alternate Spikelets (16 to 22 spikelets)
  const spikeletCount = 18;
  const spikeletGeom = new THREE.ConeGeometry(0.18, 0.44, 8);
  spikeletGeom.scale(1.0, 1.0, 0.55); // flattened
  const spikeletMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    roughness: 0.42,
  });

  const awnPoints: THREE.Vector3[] = [];

  for (let i = 0; i < spikeletCount; i++) {
    const t = i / spikeletCount;
    const y = baseY + 0.15 + t * (height - 0.25);
    const side = i % 2 === 0 ? 1 : -1;
    const angle = (side * Math.PI) / 6.5;

    const spikelet = new THREE.Mesh(spikeletGeom, spikeletMat);
    spikelet.position.set(side * 0.14, y, (Math.random() - 0.5) * 0.04);
    spikelet.rotation.z = angle;
    spikeGroup.add(spikelet);

    // Awns (मूंछें / सूंड) shooting from each spikelet tip
    const awnLen = 0.9 + (1 - t * 0.4) * 0.6;
    const startPoint = new THREE.Vector3(side * 0.18, y + 0.2, 0);
    const endPoint = new THREE.Vector3(
      side * (0.35 + (1 - t) * 0.25),
      y + 0.2 + awnLen,
      (Math.random() - 0.5) * 0.15
    );
    awnPoints.push(startPoint, endPoint);

    // Hanging anthers during flowering stage
    if (hasAnthers && i >= 4 && i <= 14) {
      const antherGeom = new THREE.CapsuleGeometry(0.025, 0.08, 4, 8);
      const antherMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#fef08a"),
        roughness: 0.3,
      });
      const anther = new THREE.Mesh(antherGeom, antherMat);
      anther.position.set(side * 0.28, y - 0.05, 0.08);
      spikeGroup.add(anther);
    }
  }

  // Awns Lines
  const awnGeom = new THREE.BufferGeometry().setFromPoints(awnPoints);
  const awnMat = new THREE.LineBasicMaterial({
    color: new THREE.Color(awnColorHex),
    transparent: true,
    opacity: 0.75,
  });
  const awnLines = new THREE.LineSegments(awnGeom, awnMat);
  spikeGroup.add(awnLines);

  return spikeGroup;
}

/**
 * Builds the complete 3D Botanical Scene for ANY given wheat stage.
 */
export function buildStageBotanicalGroup(stageId: string, progress: number = 1.0): THREE.Group {
  const rootGroup = new THREE.Group();

  switch (stageId) {
    case "germination": {
      // 1. Soil Profile Trench
      rootGroup.add(createTrueSoilProfileTrench());

      // 2. Wheat Seed Caryopsis at y = 0.0 (-5cm depth)
      const seed = createDetailedSeedMesh();
      seed.position.set(0, 0, 0.05);
      rootGroup.add(seed);

      // 3. Primary Radicle (White descending taproot)
      const radicleCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.85, 0.05),
        new THREE.Vector3(0.06, -1.4, 0.06),
        new THREE.Vector3(-0.04, -2.1, 0.05),
        new THREE.Vector3(0.02, -2.9 * progress, 0.05),
      ]);
      const radicleGeom = new THREE.TubeGeometry(radicleCurve, 32, 0.06, 8, false);
      const rootMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#f8fafc"),
        roughness: 0.35,
      });
      rootGroup.add(new THREE.Mesh(radicleGeom, rootMat));

      // 4. Seminal Lateral Roots
      const leftSeminal = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.15, -0.65, 0.05),
        new THREE.Vector3(-0.55 * progress, -1.2 * progress, 0.05),
        new THREE.Vector3(-0.95 * progress, -1.9 * progress, 0.05),
      ]);
      const rightSeminal = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.15, -0.65, 0.05),
        new THREE.Vector3(0.55 * progress, -1.2 * progress, 0.05),
        new THREE.Vector3(0.95 * progress, -1.9 * progress, 0.05),
      ]);
      rootGroup.add(new THREE.Mesh(new THREE.TubeGeometry(leftSeminal, 24, 0.045, 8, false), rootMat));
      rootGroup.add(new THREE.Mesh(new THREE.TubeGeometry(rightSeminal, 24, 0.045, 8, false), rootMat));

      // 5. Emerging Coleoptile Shoot (Piercing through soil surface at y = 0.6)
      const shootHeight = 0.6 + 0.8 * progress;
      const shootCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.75, 0.05),
        new THREE.Vector3(0.03, 0.6, 0.05),
        new THREE.Vector3(0.06, shootHeight, 0.05),
      ]);
      const shootGeom = new THREE.TubeGeometry(shootCurve, 24, 0.07, 8, false);
      const shootMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#4ade80"),
        roughness: 0.32,
      });
      rootGroup.add(new THREE.Mesh(shootGeom, shootMat));
      break;
    }

    case "cri": {
      // Stage 2: Crown Root Initiation (21 days)
      rootGroup.add(createTrueSoilProfileTrench());

      // Seed at base
      const seed = createDetailedSeedMesh();
      seed.position.set(0, -0.6, 0.05);
      rootGroup.add(seed);

      // Sub-crown internode linking seed to crown node at y = 0.15
      const internodeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.5, 0.05),
        new THREE.Vector3(0, 0.15, 0.05),
      ]);
      const rootMat = new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.35 });
      rootGroup.add(new THREE.Mesh(new THREE.TubeGeometry(internodeCurve, 16, 0.065, 8, false), rootMat));

      // Crown Root Ring (6 robust adventitious crown roots radiating)
      const crownAngles = [-0.6, -0.35, -0.15, 0.15, 0.35, 0.6];
      crownAngles.forEach((angle) => {
        const rootCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0.15, 0.05),
          new THREE.Vector3(angle * 1.1, -0.9, 0.05 + Math.sin(angle) * 0.1),
          new THREE.Vector3(angle * 1.8, -2.4, 0.05),
        ]);
        const geom = new THREE.TubeGeometry(rootCurve, 24, 0.055, 8, false);
        rootGroup.add(new THREE.Mesh(geom, rootMat));
      });

      // 4 Emerald Green Upright Leaves in sunlight (y: 0.6 to 2.8)
      rootGroup.add(
        createWheatLeafMesh(
          new THREE.Vector3(0, 0.6, 0.05),
          new THREE.Vector3(-0.4, 1.6, 0.05),
          new THREE.Vector3(-0.8, 2.4, 0.05),
          0.16,
          "#15803d"
        )
      );
      rootGroup.add(
        createWheatLeafMesh(
          new THREE.Vector3(0, 0.6, 0.05),
          new THREE.Vector3(0.05, 1.8, 0.05),
          new THREE.Vector3(0.1, 2.8, 0.05),
          0.17,
          "#16a34a"
        )
      );
      rootGroup.add(
        createWheatLeafMesh(
          new THREE.Vector3(0, 0.6, 0.05),
          new THREE.Vector3(0.45, 1.5, 0.05),
          new THREE.Vector3(0.85, 2.3, 0.05),
          0.16,
          "#15803d"
        )
      );
      break;
    }

    case "tillering": {
      // Stage 3: Tillering (4–6 tillers)
      rootGroup.add(createTrueSoilProfileTrench());

      // Dense root network
      const rootMat = new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.4 });
      for (let i = -5; i <= 5; i++) {
        const angle = (i / 5) * 0.9;
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0.2, 0.05),
          new THREE.Vector3(angle * 1.3, -1.2, 0.05),
          new THREE.Vector3(angle * 2.2, -2.8, 0.05),
        ]);
        rootGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.045, 6, false), rootMat));
      }

      // 5 Tillers (Main stalk + 4 vigorous tillers)
      const tillerAngles = [-0.35, -0.18, 0, 0.18, 0.35];
      tillerAngles.forEach((ang) => {
        rootGroup.add(
          createWheatLeafMesh(
            new THREE.Vector3(ang * 0.2, 0.6, 0.05),
            new THREE.Vector3(ang * 1.4, 2.0, 0.05),
            new THREE.Vector3(ang * 2.1, 3.2, 0.05),
            0.18,
            "#15803d"
          )
        );
        rootGroup.add(
          createWheatLeafMesh(
            new THREE.Vector3(ang * 0.1, 0.6, 0.05),
            new THREE.Vector3(ang * 0.8, 2.4, 0.05),
            new THREE.Vector3(ang * 1.2, 3.6, 0.05),
            0.16,
            "#16a34a"
          )
        );
      });
      break;
    }

    case "stem_elongation": {
      // Stage 4: Stem Elongation / Jointing (Nodes clearly visible)
      rootGroup.add(createTrueSoilProfileTrench());

      // Stiff culm (stem)
      const stemGeom = new THREE.CylinderGeometry(0.1, 0.14, 4.4, 16);
      const stemMat = new THREE.MeshStandardMaterial({ color: "#16a34a", roughness: 0.4 });
      const stem = new THREE.Mesh(stemGeom, stemMat);
      stem.position.set(0, 2.8, 0.05);
      rootGroup.add(stem);

      // Swollen Nodes (गांठें - Node 1 at y = 1.6, Node 2 at y = 2.9)
      const nodeGeom = new THREE.TorusGeometry(0.13, 0.045, 12, 24);
      const nodeMat = new THREE.MeshStandardMaterial({ color: "#86efac", roughness: 0.3 });
      const node1 = new THREE.Mesh(nodeGeom, nodeMat);
      node1.position.set(0, 1.6, 0.05);
      node1.rotateX(Math.PI / 2);
      const node2 = new THREE.Mesh(nodeGeom, nodeMat);
      node2.position.set(0, 2.9, 0.05);
      node2.rotateX(Math.PI / 2);
      rootGroup.add(node1, node2);

      // Leaves emerging at nodes
      rootGroup.add(
        createWheatLeafMesh(
          new THREE.Vector3(0, 1.6, 0.05),
          new THREE.Vector3(-0.6, 2.4, 0.05),
          new THREE.Vector3(-1.3, 3.2, 0.05),
          0.2,
          "#15803d"
        )
      );
      rootGroup.add(
        createWheatLeafMesh(
          new THREE.Vector3(0, 2.9, 0.05),
          new THREE.Vector3(0.6, 3.6, 0.05),
          new THREE.Vector3(1.2, 4.4, 0.05),
          0.2,
          "#16a34a"
        )
      );
      break;
    }

    case "booting": {
      // Stage 5: Booting (Swollen flag leaf sheath)
      // Stalk
      const stalkGeom = new THREE.CylinderGeometry(0.1, 0.13, 3.2, 16);
      const stalk = new THREE.Mesh(stalkGeom, new THREE.MeshStandardMaterial({ color: "#16a34a" }));
      stalk.position.set(0, 1.6, 0);
      rootGroup.add(stalk);

      // Swollen Flag Leaf Sheath (फूला गोभ)
      const bootGeom = new THREE.CapsuleGeometry(0.24, 1.1, 8, 16);
      const bootMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#4ade80"),
        roughness: 0.35,
      });
      const boot = new THREE.Mesh(bootGeom, bootMat);
      boot.position.set(0, 2.7, 0);
      rootGroup.add(boot);

      // Wide Flag Leaf spreading horizontally
      rootGroup.add(
        createWheatLeafMesh(
          new THREE.Vector3(0, 2.2, 0),
          new THREE.Vector3(-0.7, 2.9, 0),
          new THREE.Vector3(-1.6, 3.3, 0),
          0.26,
          "#15803d"
        )
      );
      break;
    }

    case "heading": {
      // Stage 6: Heading (Green emerged ear)
      const stalk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.12, 3.2, 16),
        new THREE.MeshStandardMaterial({ color: "#16a34a" })
      );
      stalk.position.set(0, 1.6, 0);
      rootGroup.add(stalk);

      // Green Wheat Ear
      rootGroup.add(createWheatSpikeMesh(2.4, 1.5, "#22c55e", "#86efac", false));
      break;
    }

    case "flowering": {
      // Stage 7: Flowering (Spike with yellow anthers)
      const stalk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.12, 3.2, 16),
        new THREE.MeshStandardMaterial({ color: "#16a34a" })
      );
      stalk.position.set(0, 1.6, 0);
      rootGroup.add(stalk);

      // Spike with yellow anthers
      rootGroup.add(createWheatSpikeMesh(2.4, 1.5, "#4ade80", "#a7f3d0", true));
      break;
    }

    case "milking": {
      // Stage 8: Milk Stage (Heavy plump ear bowing ~15°)
      const stalk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.12, 3.2, 16),
        new THREE.MeshStandardMaterial({ color: "#65a30d" })
      );
      stalk.position.set(0, 1.6, 0);
      rootGroup.add(stalk);

      const spike = createWheatSpikeMesh(2.3, 1.6, "#84cc16", "#bef264", false);
      spike.rotation.z = -0.22; // slight nodding
      rootGroup.add(spike);
      break;
    }

    case "dough": {
      // Stage 9: Dough Stage (Golden-amber transition, bowing ~30°)
      const stalk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.12, 3.2, 16),
        new THREE.MeshStandardMaterial({ color: "#ca8a04" })
      );
      stalk.position.set(0, 1.6, 0);
      rootGroup.add(stalk);

      const spike = createWheatSpikeMesh(2.2, 1.6, "#eab308", "#fde047", false);
      spike.rotation.z = -0.42; // bowing
      rootGroup.add(spike);
      break;
    }

    case "ripening": {
      // Stage 10: Ripening (100% Golden bronze wheat ear, bowing ~45°)
      const stalk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.11, 3.2, 16),
        new THREE.MeshStandardMaterial({ color: "#d97706" })
      );
      stalk.position.set(0, 1.6, 0);
      rootGroup.add(stalk);

      const spike = createWheatSpikeMesh(2.1, 1.7, "#f59e0b", "#fde68a", false);
      spike.rotation.z = -0.65; // gracefully curved golden head
      rootGroup.add(spike);
      break;
    }

    default:
      rootGroup.add(createTrueSoilProfileTrench());
      rootGroup.add(createDetailedSeedMesh());
  }

  return rootGroup;
}
