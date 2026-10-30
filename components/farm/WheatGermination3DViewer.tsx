"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  createWheatSeedGeometry,
  createSoilBlockMesh,
  getRootSplines,
  getColeoptileCurve,
  createSubCurveGeometry,
  createRootHairsMesh,
  GERMINATION_HOTSPOTS,
  type HotspotInfo,
} from "@/lib/3d/wheatGerminationEngine";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Layers,
  Compass,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface WheatGermination3DViewerProps {
  onClose?: () => void;
  className?: string;
  initialDay?: number;
  variant?: "inline" | "fullscreen";
}

type CameraPreset = "overview" | "seed" | "roots" | "shoot";

export default function WheatGermination3DViewer({
  onClose,
  className = "",
  initialDay = 3.5,
  variant = "inline",
}: WheatGermination3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Growth Playback State (Day 0.0 to 7.0)
  const [day, setDay] = useState<number>(initialDay);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1.0);
  const [isXraySoil, setIsXraySoil] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotInfo | null>(null);
  const [activePreset, setActivePreset] = useState<CameraPreset>("overview");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(variant === "fullscreen");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isControlsExpanded, setIsControlsExpanded] = useState<boolean>(false);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Dynamic Mesh References for Growth Updates
  const seedMeshRef = useRef<THREE.Mesh | null>(null);
  const soilGroupRef = useRef<THREE.Group | null>(null);
  const radicleMeshRef = useRef<THREE.Mesh | null>(null);
  const seminalLeft1Ref = useRef<THREE.Mesh | null>(null);
  const seminalRight1Ref = useRef<THREE.Mesh | null>(null);
  const seminalLeft2Ref = useRef<THREE.Mesh | null>(null);
  const seminalRight2Ref = useRef<THREE.Mesh | null>(null);
  const coleoptileMeshRef = useRef<THREE.Mesh | null>(null);
  const rootHairsGroupRef = useRef<THREE.Group | null>(null);

  // Materials References
  const rootMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const coleoptileMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Hotspot Screen Projections State
  const [hotspotScreenPositions, setHotspotScreenPositions] = useState<
    { id: string; x: number; y: number; visible: boolean }[]
  >([]);

  // Splines
  const rootSplines = useMemo(() => getRootSplines(), []);
  const coleoptileSpline = useMemo(() => getColeoptileCurve(), []);

  // Update Growth Meshes based on current Day
  const updateGrowthState = useCallback(
    (currentDay: number) => {
      const t = Math.max(0, Math.min(1.0, currentDay / 7.0));

      // 1. Seed Swelling (Imbibition)
      if (seedMeshRef.current) {
        const swellFactor = 1.0 + 0.18 * Math.min(1.0, t * 2.8);
        seedMeshRef.current.scale.set(swellFactor, swellFactor, swellFactor);
      }

      // 2. Primary Radicle (Emerges at Day 1.0, reaches max at Day 7.0)
      const radicleFraction = t < 0.14 ? 0 : Math.min(1.0, (t - 0.14) / 0.86);
      if (radicleMeshRef.current) {
        const oldGeom = radicleMeshRef.current.geometry;
        radicleMeshRef.current.geometry = createSubCurveGeometry(
          rootSplines.radicleCurve,
          radicleFraction,
          0.09,
          0.035
        );
        oldGeom.dispose();
      }

      // 3. Lateral Seminal Roots (First pair emerges at Day 2.5)
      const seminal1Fraction = t < 0.32 ? 0 : Math.min(1.0, (t - 0.32) / 0.68);
      if (seminalLeft1Ref.current && seminalRight1Ref.current) {
        const oldL = seminalLeft1Ref.current.geometry;
        const oldR = seminalRight1Ref.current.geometry;

        seminalLeft1Ref.current.geometry = createSubCurveGeometry(
          rootSplines.seminalLeft1,
          seminal1Fraction,
          0.075,
          0.028
        );
        seminalRight1Ref.current.geometry = createSubCurveGeometry(
          rootSplines.seminalRight1,
          seminal1Fraction,
          0.075,
          0.028
        );

        oldL.dispose();
        oldR.dispose();
      }

      // 4. Secondary Seminal Roots (Second pair emerges at Day 4.2)
      const seminal2Fraction = t < 0.55 ? 0 : Math.min(1.0, (t - 0.55) / 0.45);
      if (seminalLeft2Ref.current && seminalRight2Ref.current) {
        const oldL = seminalLeft2Ref.current.geometry;
        const oldR = seminalRight2Ref.current.geometry;

        seminalLeft2Ref.current.geometry = createSubCurveGeometry(
          rootSplines.seminalLeft2,
          seminal2Fraction,
          0.065,
          0.025
        );
        seminalRight2Ref.current.geometry = createSubCurveGeometry(
          rootSplines.seminalRight2,
          seminal2Fraction,
          0.065,
          0.025
        );

        oldL.dispose();
        oldR.dispose();
      }

      // 5. Coleoptile Shoot (Emerges upward at Day 1.8)
      const coleoptileFraction = t < 0.22 ? 0 : Math.min(1.0, (t - 0.22) / 0.78);
      if (coleoptileMeshRef.current) {
        const oldC = coleoptileMeshRef.current.geometry;
        coleoptileMeshRef.current.geometry = createSubCurveGeometry(
          coleoptileSpline,
          coleoptileFraction,
          0.14,
          0.05
        );
        oldC.dispose();

        if (coleoptileMaterialRef.current) {
          const greenRatio = Math.max(0, (t - 0.5) / 0.5);
          const baseColor = new THREE.Color("#e8f5d0").lerp(
            new THREE.Color("#38d976"),
            greenRatio
          );
          coleoptileMaterialRef.current.color = baseColor;
          coleoptileMaterialRef.current.roughness = 0.35 + (1 - greenRatio) * 0.25;
        }
      }

      // 6. Root Hairs (Trichoblasts)
      if (rootHairsGroupRef.current) {
        while (rootHairsGroupRef.current.children.length > 0) {
          const child = rootHairsGroupRef.current.children[0] as THREE.LineSegments;
          child.geometry.dispose();
          rootHairsGroupRef.current.remove(child);
        }

        if (radicleFraction > 0.25) {
          const hairs = createRootHairsMesh(rootSplines.radicleCurve, radicleFraction);
          rootHairsGroupRef.current.add(hairs);
        }
      }
    },
    [rootSplines, coleoptileSpline]
  );

  // Initialize Three.js Scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#04130e"); // Deep rich agronomy dark
    sceneRef.current = scene;

    // 2. Camera (Framed with plant slightly elevated so controls don't block it)
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(2.8, 0.8, 5.8);
    cameraRef.current = camera;

    // 3. Renderer with PBR Tone Mapping & Shadow Support
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    // 4. OrbitControls with Touch Damping & Angle Limits
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.4;
    controls.maxDistance = 12.0;
    controls.maxPolarAngle = Math.PI - 0.2;
    controls.minPolarAngle = 0.2;
    // Target plant center, slightly lifted so bottom controls don't overlap
    controls.target.set(0, -0.3, 0);
    controlsRef.current = controls;

    // 5. Cinematic Lighting Rig
    const hemiLight = new THREE.HemisphereLight("#a7f3d0", "#18110b", 0.95);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight("#fff7eb", 2.4);
    keyLight.position.set(4.5, 6.5, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight("#a7f3d0", 0.9);
    fillLight.position.set(-5, 2.5, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight("#86efac", 3.4);
    rimLight.position.set(0, -3.5, -5.5);
    scene.add(rimLight);

    // 6. Wheat Seed Mesh
    const seedGeom = createWheatSeedGeometry();
    const seedMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#d9822b"),
      roughness: 0.62,
      metalness: 0.04,
      bumpScale: 0.06,
    });
    const seedMesh = new THREE.Mesh(seedGeom, seedMat);
    seedMesh.castShadow = true;
    seedMesh.receiveShadow = true;
    scene.add(seedMesh);
    seedMeshRef.current = seedMesh;

    // 7. Soil Cutaway Block
    const soilGroup = createSoilBlockMesh();
    scene.add(soilGroup);
    soilGroupRef.current = soilGroup;

    // 8. Materials
    const rootMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#f6fef8"),
      roughness: 0.4,
      metalness: 0.02,
    });
    rootMaterialRef.current = rootMat;

    const coleoptileMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#4ade80"),
      roughness: 0.32,
      metalness: 0.04,
    });
    coleoptileMaterialRef.current = coleoptileMat;

    // 9. Root Meshes
    const radicleMesh = new THREE.Mesh(new THREE.BufferGeometry(), rootMat);
    radicleMesh.castShadow = true;
    scene.add(radicleMesh);
    radicleMeshRef.current = radicleMesh;

    const seminalL1 = new THREE.Mesh(new THREE.BufferGeometry(), rootMat);
    const seminalR1 = new THREE.Mesh(new THREE.BufferGeometry(), rootMat);
    const seminalL2 = new THREE.Mesh(new THREE.BufferGeometry(), rootMat);
    const seminalR2 = new THREE.Mesh(new THREE.BufferGeometry(), rootMat);
    scene.add(seminalL1, seminalR1, seminalL2, seminalR2);
    seminalLeft1Ref.current = seminalL1;
    seminalRight1Ref.current = seminalR1;
    seminalLeft2Ref.current = seminalL2;
    seminalRight2Ref.current = seminalR2;

    // 10. Coleoptile Mesh
    const coleoptileMesh = new THREE.Mesh(new THREE.BufferGeometry(), coleoptileMat);
    coleoptileMesh.castShadow = true;
    scene.add(coleoptileMesh);
    coleoptileMeshRef.current = coleoptileMesh;

    // 11. Root Hairs
    const hairsGroup = new THREE.Group();
    scene.add(hairsGroup);
    rootHairsGroupRef.current = hairsGroup;

    // Initial State
    updateGrowthState(day);

    // 12. Render Loop
    let animationFrameId: number;
    const tempVec = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      controls.update();
      renderer.render(scene, camera);

      // Project 3D Hotspot positions
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;

        const projections = GERMINATION_HOTSPOTS.map((spot) => {
          tempVec.copy(spot.position);
          tempVec.project(camera);

          const visible = tempVec.z < 1.0;
          const sx = ((tempVec.x + 1) * w) / 2;
          const sy = ((-tempVec.y + 1) * h) / 2;

          return {
            id: spot.id,
            x: sx,
            y: sy,
            visible,
          };
        });

        setHotspotScreenPositions(projections);
      }
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const nw = containerRef.current.clientWidth;
      const nh = containerRef.current.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      seedGeom.dispose();
      seedMat.dispose();
    };
  }, []);

  useEffect(() => {
    updateGrowthState(day);
  }, [day, updateGrowthState]);

  // Smooth Time-lapse Loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setDay((prevDay) => {
        const nextDay = prevDay + 0.04 * playSpeed;
        if (nextDay >= 7.0) {
          setIsPlaying(false);
          return 7.0;
        }
        return nextDay;
      });
    }, 32);

    return () => clearInterval(interval);
  }, [isPlaying, playSpeed]);

  // X-Ray Soil Toggle
  useEffect(() => {
    if (!soilGroupRef.current) return;
    soilGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (isXraySoil) {
          mat.transparent = true;
          mat.opacity = 0.15;
        } else {
          mat.transparent = false;
          mat.opacity = 1.0;
        }
      }
    });
  }, [isXraySoil]);

  // Camera Presets
  const applyCameraPreset = useCallback((preset: CameraPreset) => {
    if (!cameraRef.current || !controlsRef.current) return;
    setActivePreset(preset);

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    switch (preset) {
      case "seed":
        camera.position.set(0.5, 0.4, 2.7);
        controls.target.set(0, -0.1, 0.2);
        setIsXraySoil(false);
        break;
      case "roots":
        camera.position.set(0.2, -1.8, 4.2);
        controls.target.set(0, -1.6, 0);
        setIsXraySoil(true);
        break;
      case "shoot":
        camera.position.set(0.1, 2.0, 3.6);
        controls.target.set(0, 1.2, 0.1);
        setIsXraySoil(false);
        break;
      case "overview":
      default:
        camera.position.set(2.8, 0.8, 5.8);
        controls.target.set(0, -0.3, 0);
        break;
    }
    controls.update();
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const toggleSpeech = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!window.speechSynthesis) return;

    let textToSpeak = `गेहूँ का अंकुरण, दिन ${day.toFixed(1)}। `;
    if (selectedHotspot) {
      textToSpeak += `${selectedHotspot.nameHi}। ${selectedHotspot.descriptionHi}। ${selectedHotspot.agronomicSignificanceHi}`;
    } else if (day < 1.5) {
      textToSpeak += "बीज मिट्टी की नमी सोखकर फूल रहा है और अंदर एंजाइम सक्रिय हो रहे हैं।";
    } else if (day < 3.5) {
      textToSpeak += "प्राथमिक जड़ मिट्टी में नीचे जा रही है, और प्रांकुर ऊपर प्रकाश की ओर बढ़ रहा है।";
    } else {
      textToSpeak += "पार्श्व जड़ें फैल चुकी हैं और प्रांकुर चोल मिट्टी से बाहर निकलकर प्रकाश संश्लेषण शुरू कर रहा है।";
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "hi-IN";
    utterance.rate = 0.92;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [day, isSpeaking, selectedHotspot]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden bg-[#04120d] text-white select-none touch-none",
        isFullscreen ? "fixed inset-0 z-[9999]" : "rounded-3xl border border-emerald-500/25 shadow-2xl",
        className
      )}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Floating 360 Hint Badge */}
      <div className="pointer-events-none absolute left-3 top-3.5 z-10 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-[10px] font-semibold text-emerald-300 backdrop-blur-md shadow-md">
        <Compass className="h-3 w-3 animate-spin duration-3000 text-emerald-400" />
        <span>360° घुमाएं व पिंच ज़ूम करें</span>
      </div>

      {/* Top Floating Glass HUD */}
      <div className="pointer-events-none absolute right-3 top-3.5 z-10 flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggleSpeech}
          className={cn(
            "pointer-events-auto flex h-8 w-8 items-center justify-center rounded-xl border backdrop-blur-md transition active:scale-95",
            isSpeaking
              ? "border-emerald-400 bg-emerald-500/25 text-emerald-300 animate-pulse"
              : "border-white/10 bg-black/45 text-white/80 hover:bg-black/60"
          )}
          title="हिन्दी वैज्ञानिक विवरण सुनें"
        >
          {isSpeaking ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-black/45 text-white/80 backdrop-blur-md hover:bg-black/60 transition active:scale-95"
          title={isFullscreen ? "फुलस्क्रीन बंद करें" : "फुलस्क्रीन"}
        >
          {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-black/45 text-white/80 backdrop-blur-md hover:bg-black/60 transition active:scale-95"
            title="बंद करें"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Floating 3D Botanical Hotspot Markers */}
      {hotspotScreenPositions.map((spot) => {
        if (!spot.visible) return null;
        const info = GERMINATION_HOTSPOTS.find((h) => h.id === spot.id);
        if (!info) return null;
        const isSelected = selectedHotspot?.id === spot.id;

        return (
          <div
            key={spot.id}
            style={{
              transform: `translate3d(${spot.x}px, ${spot.y}px, 0)`,
            }}
            className="pointer-events-auto absolute -left-3 -top-3 z-10 transition-transform duration-75"
          >
            <button
              type="button"
              onClick={() => setSelectedHotspot(isSelected ? null : info)}
              className="group relative flex items-center justify-center"
              aria-label={info.nameHi}
            >
              <span className="absolute h-6 w-6 animate-ping rounded-full bg-emerald-400/35 duration-1000" />
              <span
                className={cn(
                  "relative flex h-5 w-5 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition group-hover:scale-125",
                  isSelected
                    ? "border-amber-300 bg-amber-400 text-black font-black"
                    : "border-white/80 bg-emerald-600/90 text-white font-bold"
                )}
              >
                <Sparkles className="h-2.5 w-2.5" />
              </span>
            </button>
          </div>
        );
      })}

      {/* Selected Hotspot Bottom Sheet Modal */}
      <AnimatePresence>
        {selectedHotspot && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="pointer-events-auto absolute bottom-24 left-3 right-3 z-30 mx-auto max-w-md rounded-2xl border border-emerald-400/30 bg-[#071d16]/95 p-3.5 shadow-2xl backdrop-blur-lg sm:bottom-28"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                  {selectedHotspot.categoryHi}
                </span>
                <h3 className="mt-1 text-sm font-bold text-white">
                  {selectedHotspot.nameHi}
                </h3>
                <p className="text-[9.5px] text-emerald-200/60">{selectedHotspot.nameEn}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHotspot(null)}
                className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-1.5 text-[11px] leading-relaxed text-emerald-100/90">
              {selectedHotspot.descriptionHi}
            </p>

            <div className="mt-2 rounded-xl border border-amber-300/20 bg-amber-400/10 p-2">
              <p className="text-[9.5px] font-bold text-amber-200">
                🌾 किसान के लिए महत्वपूर्ण (Agronomic Fact):
              </p>
              <p className="mt-0.5 text-[10px] leading-normal text-amber-100/80">
                {selectedHotspot.agronomicSignificanceHi}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Streamlined Bottom Floating Control Bar */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-2.5 sm:p-4">
        <div className="pointer-events-auto mx-auto max-w-lg rounded-2xl border border-white/10 bg-black/70 p-2.5 backdrop-blur-md shadow-2xl sm:p-3">
          {/* Row 1: Camera Presets & X-Ray Toggle */}
          <div className="flex items-center justify-between gap-1.5 border-b border-white/10 pb-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => applyCameraPreset("overview")}
                className={cn(
                  "rounded-lg px-2 py-0.5 text-[10px] font-semibold transition active:scale-95",
                  activePreset === "overview"
                    ? "bg-emerald-500 text-black shadow"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                )}
              >
                360°
              </button>
              <button
                type="button"
                onClick={() => applyCameraPreset("seed")}
                className={cn(
                  "rounded-lg px-2 py-0.5 text-[10px] font-semibold transition active:scale-95",
                  activePreset === "seed"
                    ? "bg-emerald-500 text-black shadow"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                )}
              >
                बीज
              </button>
              <button
                type="button"
                onClick={() => applyCameraPreset("roots")}
                className={cn(
                  "rounded-lg px-2 py-0.5 text-[10px] font-semibold transition active:scale-95",
                  activePreset === "roots"
                    ? "bg-emerald-500 text-black shadow"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                )}
              >
                जड़ें
              </button>
              <button
                type="button"
                onClick={() => applyCameraPreset("shoot")}
                className={cn(
                  "rounded-lg px-2 py-0.5 text-[10px] font-semibold transition active:scale-95",
                  activePreset === "shoot"
                    ? "bg-emerald-500 text-black shadow"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                )}
              >
                अंकुर
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsXraySoil(!isXraySoil)}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-semibold transition active:scale-95",
                isXraySoil
                  ? "border-emerald-400 bg-emerald-500/25 text-emerald-300"
                  : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
              )}
            >
              <Layers className="h-3 w-3" />
              <span>एक्स-रे</span>
            </button>
          </div>

          {/* Row 2: Playback & Timeline Scrubber */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-black shadow transition hover:bg-emerald-400 active:scale-95"
                  title={isPlaying ? "रोकें" : "समय-प्रवाह चलाएं (Time-lapse)"}
                >
                  {isPlaying ? <Pause className="h-3 w-3 fill-black" /> : <Play className="h-3 w-3 fill-black ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDay(0);
                    setIsPlaying(true);
                  }}
                  className="rounded p-0.5 text-white/60 hover:text-white"
                  title="शुरू से पुनः चलाएं"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>

                <span className="font-bold text-white text-[11px] tabular-nums">
                  दिन {day.toFixed(1)}{" "}
                  <span className="text-[9.5px] font-normal text-emerald-300">
                    {day < 1.5
                      ? "(जल अवशोषण)"
                      : day < 2.5
                        ? "(प्राथमिक जड़)"
                        : day < 4.5
                          ? "(पार्श्व जड़ें)"
                          : "(प्ररोह उभार)"}
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPlaySpeed((prev) => (prev === 1.0 ? 2.0 : prev === 2.0 ? 0.5 : 1.0))
                }
                className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-white/80 hover:bg-white/20"
              >
                {playSpeed}x
              </button>
            </div>

            {/* Range Input Slider */}
            <input
              type="range"
              min={0}
              max={7}
              step={0.05}
              value={day}
              onChange={(e) => {
                setIsPlaying(false);
                setDay(parseFloat(e.target.value));
              }}
              className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-emerald-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
