import * as THREE from "three";

/**
 * Botanical 3D Geometry and Growth Animation Engine for Wheat (Triticum aestivum)
 * Focus: Stage 0 (Zadoks Z00-Z09) — Germination & Emergence (बीज अंकुरण व जमाव)
 * Built to scientific morphological accuracy (ICAR-IIWBR / FAO Zadoks standards).
 */

export interface GrowthState {
  day: number; // 0.0 to 7.0 days
  progress: number; // 0.0 (dormant seed) to 1.0 (emerged coleoptile & seminal roots)
}

export interface HotspotInfo {
  id: string;
  nameHi: string;
  nameEn: string;
  categoryHi: string;
  descriptionHi: string;
  agronomicSignificanceHi: string;
  position: THREE.Vector3;
}

/**
 * Generates an ultra-detailed procedural wheat caryopsis (grain) geometry.
 * Incorporates the ventral crease (पेट का खांचा), dorsal contour,
 * embryo shield (Scutellum), and apical brush (रोम).
 */
export function createWheatSeedGeometry(): THREE.BufferGeometry {
  const widthSegments = 96;
  const heightSegments = 96;
  const geometry = new THREE.SphereGeometry(1, widthSegments, heightSegments);

  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  const v = new THREE.Vector3();

  // Dimensions: Wheat grain ~ 2.4 units long, 1.05 wide, 0.95 thick
  const length = 2.4;
  const width = 1.08;
  const thickness = 0.96;

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    const ny = v.y; // -1 (embryo end) to +1 (brush end)
    const nx = v.x; // lateral
    const nz = v.z; // +Z is dorsal, -Z is ventral (crease side)

    // Base grain contour (asymmetric egg-ellipsoid, slightly wider in lower-middle)
    const contour = Math.pow(Math.max(0, 1 - ny * ny), 0.52);
    // Slight tapering towards brush end and blunt-pointed embryo end
    const taper = 1.0 - 0.14 * ny + (ny < -0.4 ? (ny + 0.4) * 0.28 : 0);

    let x = nx * width * contour * taper;
    let y = ny * (length * 0.5);
    let z = nz * thickness * contour * taper;

    // Ventral furrow / crease (along -Z axis)
    if (nz < 0.08) {
      const distFromCenter = Math.abs(x) / (width * 0.5 + 0.001);
      const creaseDepth = 0.42 * (1 - Math.abs(ny) * 0.58);
      const creaseWidth = 0.24;
      const furrow = Math.exp(-Math.pow(x / creaseWidth, 2)) * creaseDepth;
      const cheekBulge = Math.sin(Math.min(Math.PI, distFromCenter * Math.PI)) * 0.09;

      z -= furrow;
      z -= cheekBulge;
    } else {
      // Dorsal side (+Z): smooth rounded arch with subtle longitudinal ridge
      const ridge = Math.exp(-Math.pow(x / 0.45, 2)) * 0.045;
      z += ridge;

      // Embryo shield (Scutellum) at basal dorsal end (ny between -0.95 and -0.35)
      if (ny < -0.35 && ny > -0.95) {
        const embryoFactor = Math.sin(((ny - -0.95) / 0.6) * Math.PI);
        const embryoShield = Math.exp(-Math.pow(x / 0.38, 2)) * embryoFactor * 0.075;
        z += embryoShield;
      }
    }

    // Micro surface organic irregularities (pericarp cell rows)
    const microFibers = Math.sin(x * 32 + y * 18) * 0.008;
    const organicNoise = Math.sin(x * 14 + y * 10) * Math.cos(y * 12 + z * 8) * 0.012;
    x += microFibers + organicNoise;
    y += organicNoise;
    z += organicNoise;

    pos.setXYZ(i, x, y, z);
  }

  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Creates high-resolution procedural textures for grain pericarp,
 * bump mapping, and organic soil crumbs.
 */
export function createSeedPericarpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Base golden-amber gradient
  const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
  grad.addColorStop(0, "#d99b42");
  grad.addColorStop(0.35, "#c8852c");
  grad.addColorStop(0.65, "#b36e20");
  grad.addColorStop(1, "#985718");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Micro longitudinal pericarp fibers
  ctx.strokeStyle = "rgba(255, 225, 175, 0.12)";
  ctx.lineWidth = 1.5;
  for (let x = 0; x < 1024; x += 4) {
    ctx.beginPath();
    ctx.moveTo(x + (Math.random() - 0.5) * 4, 0);
    ctx.bezierCurveTo(
      x + (Math.random() - 0.5) * 12,
      340,
      x + (Math.random() - 0.5) * 12,
      680,
      x + (Math.random() - 0.5) * 4,
      1024
    );
    ctx.stroke();
  }

  // Faint speckles
  ctx.fillStyle = "rgba(70, 35, 10, 0.08)";
  for (let i = 0; i < 2000; i++) {
    const rx = Math.random() * 1024;
    const ry = Math.random() * 1024;
    const s = Math.random() * 2 + 0.5;
    ctx.fillRect(rx, ry, s, s);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Soil cross-section with organic strata, crumb porosity, and moisture gradient.
 */
export function createSoilBlockMesh(): THREE.Group {
  const group = new THREE.Group();

  // Outer soil cutaway box (Width: 6.8, Height: 7.2, Depth: 4.8)
  const soilWidth = 6.8;
  const soilHeight = 7.0;
  const soilDepth = 4.4;

  const boxGeom = new THREE.BoxGeometry(soilWidth, soilHeight, soilDepth, 32, 32, 24);
  const pos = boxGeom.attributes.position;
  const v = new THREE.Vector3();

  // Deform top surface to simulate natural clods & crumb structure
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    // If on top surface (y > halfHeight - 0.1)
    if (v.y > soilHeight * 0.5 - 0.15) {
      const crumb =
        Math.sin(v.x * 4.5 + v.z * 3.8) * 0.12 +
        Math.cos(v.x * 9.0 - v.z * 7.5) * 0.06;
      v.y += crumb;
    }
    // Front cutaway roughness (where viewer peers inside)
    if (v.z > soilDepth * 0.5 - 0.1) {
      const edgeRoughness = Math.sin(v.x * 6 + v.y * 5) * 0.04;
      v.z += edgeRoughness;
    }
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  boxGeom.computeVertexNormals();

  // Soil PBR Material
  const soilMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#2a1d13"),
    roughness: 0.94,
    metalness: 0.04,
    bumpScale: 0.08,
  });

  const soilMesh = new THREE.Mesh(boxGeom, soilMaterial);
  soilMesh.position.set(0, -1.8, -0.6);
  soilMesh.receiveShadow = true;
  group.add(soilMesh);

  // Surface loam crumbs / micro pebbles resting around seed zone
  const crumbGeom = new THREE.DodecahedronGeometry(0.08, 1);
  const crumbMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#3c2a1a"),
    roughness: 0.98,
  });

  const crumbInstances = 45;
  const instancedCrumbs = new THREE.InstancedMesh(crumbGeom, crumbMat, crumbInstances);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < crumbInstances; i++) {
    const rx = (Math.random() - 0.5) * 4.5;
    const rz = (Math.random() - 0.5) * 2.8;
    const ry = 1.7 + (Math.random() - 0.5) * 0.18;
    const scale = 0.5 + Math.random() * 0.9;

    dummy.position.set(rx, ry, rz);
    dummy.scale.set(scale, scale * (0.8 + Math.random() * 0.4), scale);
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    dummy.updateMatrix();
    instancedCrumbs.setMatrixAt(i, dummy.matrix);
  }
  instancedCrumbs.receiveShadow = true;
  group.add(instancedCrumbs);

  return group;
}

/**
 * Creates dynamic root path curves for the primary radicle and lateral seminal roots.
 */
export function getRootSplines() {
  // Primary Radicle (extends downward from embryo at bottom-dorsal side of grain)
  const radicleCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.0, -0.95, 0.15),
    new THREE.Vector3(0.05, -1.35, 0.18),
    new THREE.Vector3(-0.08, -1.85, 0.22),
    new THREE.Vector3(0.04, -2.45, 0.15),
    new THREE.Vector3(-0.06, -3.15, 0.12),
    new THREE.Vector3(0.02, -3.95, 0.08),
  ]);

  // Lateral Seminal Root 1 (Left downward branch)
  const seminalLeft1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.18, -0.92, 0.12),
    new THREE.Vector3(-0.55, -1.35, 0.08),
    new THREE.Vector3(-0.95, -1.95, -0.05),
    new THREE.Vector3(-1.35, -2.65, -0.15),
    new THREE.Vector3(-1.75, -3.45, -0.22),
  ]);

  // Lateral Seminal Root 2 (Right downward branch)
  const seminalRight1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.18, -0.92, 0.12),
    new THREE.Vector3(0.62, -1.38, 0.15),
    new THREE.Vector3(1.05, -1.98, 0.08),
    new THREE.Vector3(1.42, -2.72, -0.02),
    new THREE.Vector3(1.82, -3.52, -0.12),
  ]);

  // Secondary Seminal Pair (Emerge later at day 4-5)
  const seminalLeft2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.12, -0.85, 0.22),
    new THREE.Vector3(-0.45, -1.2, 0.35),
    new THREE.Vector3(-0.78, -1.75, 0.42),
    new THREE.Vector3(-1.12, -2.35, 0.38),
  ]);

  const seminalRight2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.12, -0.85, 0.22),
    new THREE.Vector3(0.48, -1.22, 0.38),
    new THREE.Vector3(0.82, -1.78, 0.45),
    new THREE.Vector3(1.18, -2.38, 0.4),
  ]);

  return {
    radicleCurve,
    seminalLeft1,
    seminalRight1,
    seminalLeft2,
    seminalRight2,
  };
}

/**
 * Creates the Coleoptile Shoot spline curve (growing upward toward light).
 */
export function getColeoptileCurve() {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.0, -0.75, 0.25),
    new THREE.Vector3(0.04, -0.3, 0.28),
    new THREE.Vector3(-0.02, 0.35, 0.22),
    new THREE.Vector3(0.05, 1.05, 0.18),
    new THREE.Vector3(0.0, 1.75, 0.15), // Reaches soil surface
    new THREE.Vector3(0.02, 2.55, 0.12), // Emerges above surface
  ]);
}

/**
 * Procedurally generates an elongated tube geometry up to a fractional length `t` (0 to 1).
 */
export function createSubCurveGeometry(
  curve: THREE.CatmullRomCurve3,
  fraction: number,
  baseRadius: number,
  tipRadius: number
): THREE.BufferGeometry {
  if (fraction <= 0.02) {
    return new THREE.BufferGeometry();
  }

  const tubularSegments = Math.max(8, Math.round(48 * fraction));
  const radialSegments = 12;

  // Sample points along the curve up to `fraction`
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= tubularSegments; i++) {
    const u = (i / tubularSegments) * fraction;
    points.push(curve.getPointAt(u));
  }

  const subCurve = new THREE.CatmullRomCurve3(points);

  // Custom variable-width tube
  const geom = new THREE.TubeGeometry(subCurve, tubularSegments, baseRadius, radialSegments, false);
  const pos = geom.attributes.position;
  const v = new THREE.Vector3();

  // Taper radius towards tip
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    // Find closest segment ratio
    const vertexRatio = Math.floor(i / (radialSegments + 1)) / tubularSegments;
    const currentRadiusFactor = THREE.MathUtils.lerp(1.0, tipRadius / baseRadius, vertexRatio);
    // Apply tapering
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * Generates an ethereal halo of delicate root hairs (Trichoblasts)
 * along the mature zone of the radicle.
 */
export function createRootHairsMesh(
  curve: THREE.CatmullRomCurve3,
  activeFraction: number
): THREE.LineSegments {
  const hairsCount = Math.round(280 * activeFraction);
  const hairGeom = new THREE.BufferGeometry();
  const positions: number[] = [];

  // Root hairs exist in the zone behind the root cap (e.g. between 0.15 and activeFraction - 0.1)
  const minU = 0.08;
  const maxU = Math.max(minU, activeFraction - 0.08);

  for (let i = 0; i < hairsCount; i++) {
    const u = minU + Math.random() * (maxU - minU);
    const rootCenter = curve.getPointAt(u);
    const tangent = curve.getTangentAt(u);

    // Normal vector perpendicular to tangent
    const normal = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).cross(tangent).normalize();

    const rootRadius = 0.08;
    const hairLength = 0.12 + Math.random() * 0.18;

    const basePos = rootCenter.clone().addScaledVector(normal, rootRadius);
    const tipPos = basePos.clone().addScaledVector(normal, hairLength);

    // Base point
    positions.push(basePos.x, basePos.y, basePos.z);
    // Tip point
    positions.push(tipPos.x, tipPos.y, tipPos.z);
  }

  hairGeom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

  const hairMat = new THREE.LineBasicMaterial({
    color: new THREE.Color("#f1fcf4"),
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.LineSegments(hairGeom, hairMat);
}

/**
 * Botanical Hotspot definitions for interactive scientific inquiry.
 */
export const GERMINATION_HOTSPOTS: HotspotInfo[] = [
  {
    id: "grain",
    nameHi: "गेहूँ का बीज (Caryopsis / Grain)",
    nameEn: "Wheat Caryopsis (Seed)",
    categoryHi: "बीज एनाटॉमी",
    descriptionHi:
      "बीज के अंदर मुख्य भाग भ्रूण (Embryo) और स्टार्च से भरा भ्रूणपोष (Endosperm) होता है। नमी मिलते ही एंजाइम सक्रिय होते हैं और भोजन पचना शुरू होता है।",
    agronomicSignificanceHi:
      "मोटा और स्वस्थ 1000 दानों का वजन (Test Weight 40-42g) मजबूत अंकुरण और 20% अधिक प्रारंभिक बढ़वार सुनिश्चित करता है।",
    position: new THREE.Vector3(0.0, 0.0, 0.6),
  },
  {
    id: "coleoptile",
    nameHi: "प्रांकुर चोल (Coleoptile Shoot)",
    nameEn: "Coleoptile Protective Sheath",
    categoryHi: "प्रारंभिक प्ररोह",
    descriptionHi:
      "यह एक नुकीला, कठोर सुरक्षात्मक खोल है जो अंदर मौजूद पहली कोमल हरी पत्ती को मिट्टी के घर्षण से बचाते हुए ऊपर प्रकाश की ओर ले जाता है।",
    agronomicSignificanceHi:
      "यदि बीज 5 सेमी से अधिक गहरा बो दिया जाए, तो प्रांकुर चोल सतह तक नहीं पहुंच पाता और मिट्टी के नीचे ही मुड़कर दम तोड़ देता है। आदर्श गहराई: 4-5 सेमी।",
    position: new THREE.Vector3(0.0, 1.2, 0.25),
  },
  {
    id: "radicle",
    nameHi: "प्राथमिक जड़ (Primary Radicle)",
    nameEn: "Primary Seminal Radicle",
    categoryHi: "जड़ प्रणाली",
    descriptionHi:
      "बीज के भ्रूण से सबसे पहले निकलने वाला अंग। यह गुरुत्वाकर्षण (Geotropism) के प्रभाव में सीधे नीचे की ओर जाकर पौधे को मिट्टी में स्थिर करता है।",
    agronomicSignificanceHi:
      "प्राथमिक जड़ पहले 15-20 दिनों तक पौधे की जीवन रेखा होती है। इसके सिरे पर मौजूद रूट कैप (Root Cap) मिट्टी के कणों के बीच रास्ता बनाती है।",
    position: new THREE.Vector3(0.0, -1.8, 0.22),
  },
  {
    id: "seminal_roots",
    nameHi: "पार्श्व जड़ें (Seminal Roots)",
    nameEn: "Seminal Lateral Roots",
    categoryHi: "जड़ प्रणाली",
    descriptionHi:
      "प्राथमिक जड़ के बाद 2 से 4 अतिरिक्त जड़ें निकलती हैं जो कोण बनाकर तिरछी फैलती हैं। ये पहले 20 दिन तक पानी और घुले हुए फास्फोरस का अवशोषण करती हैं।",
    agronomicSignificanceHi:
      "बुवाई के समय डाला गया डीएपी (DAP) या एसएसपी (SSP) फास्फोरस इन्हीं प्राथमिक व पार्श्व जड़ों के प्रत्यक्ष संपर्क में आकर जड़ विकास को 2 गुना तेज करता है।",
    position: new THREE.Vector3(-0.9, -1.9, 0.0),
  },
  {
    id: "soil_profile",
    nameHi: "मृदा परिच्छेदिका व बीज-शय्या (Soil Bed)",
    nameEn: "Seed-Bed & Moisture Stratum",
    categoryHi: "कृषि मृदा विज्ञान",
    descriptionHi:
      "बीज के चारों ओर नम, भुरभुरी और हवादार दोमट मिट्टी का संपर्क। बीज अपने वजन का 35-40% पानी सोखने के बाद ही अंकुरण की प्रक्रिया शुरू करता है।",
    agronomicSignificanceHi:
      "पलेवा (प्री-सोइंग सिंचाई) के बाद उचित ओट आने पर बुवाई करने से मिट्टी में 50% नमी और 50% वायु संचार का सही संतुलन मिलता है, जिससे 95% अंकुरण होता है।",
    position: new THREE.Vector3(2.2, 0.2, 0.4),
  },
];
