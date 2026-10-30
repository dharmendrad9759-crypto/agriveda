"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  STAGES_3D_CONFIG,
  buildStageBotanicalGroup,
  createTrueSoilProfileTrench,
  createDetailedSeedMesh,
  type BotanicalHotspot,
} from "@/lib/3d/wheatBotanicalEngine";
import {
  getRootSplines,
  getColeoptileCurve,
  createSubCurveGeometry,
  createRootHairsMesh,
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
  Compass,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface WheatGermination3DViewerProps {
  stageId?: string;
  onClose?: () => void;
  className?: string;
  initialDay?: number;
  variant?: "inline" | "fullscreen";
}

type CameraPreset = "overview" | "macro" | "roots" | "stem";

export default function WheatGermination3DViewer({
  stageId = "germination",
  onClose,
  className = "",
  initialDay = 3.5,
  variant = "inline",
}: WheatGermination3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Active Stage Config
  const stageConfig = useMemo(() => {
    return STAGES_3D_CONFIG[stageId] || STAGES_3D_CONFIG.germination;
  }, [stageId]);

  const isGermination = stageId === "germination";

  // Growth Playback State (Day 0.0 to 7.0 for germination)
  const [day, setDay] = useState<number>(initialDay);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1.0);
  const [selectedHotspot, setSelectedHotspot] = useState<BotanicalHotspot | null>(null);
  const [activePreset, setActivePreset] = useState<CameraPreset>("overview");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(variant === "fullscreen");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isControlsExpanded, setIsControlsExpanded] = useState<boolean>(false);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const stageGroupRef = useRef<THREE.Group | null>(null);

  // Dynamic Germination Mesh References
  const seedMeshRef = useRef<THREE.Mesh | null>(null);
  const radicleMeshRef = useRef<THREE.Mesh | null>(null);
  const seminalLeft1Ref = useRef<THREE.Mesh | null>(null);
  const seminalRight1Ref = useRef<THREE.Mesh | null>(null);
  const seminalLeft2Ref = useRef<THREE.Mesh | null>(null);
  const seminalRight2Ref = useRef<THREE.Mesh | null>(null);
  const coleoptileMeshRef = useRef<THREE.Mesh | null>(null);
  const rootHairsGroupRef = useRef<THREE.Group | null>(null);
  const coleoptileMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Hotspot Screen Projections State
  const [hotspotScreenPositions, setHotspotScreenPositions] = useState<
    { id: string; x: number; y: number; visible: boolean }[]
  >([]);

  // Splines for germination
  const rootSplines = useMemo(() => getRootSplines(), []);
  const coleoptileSpline = useMemo(() => getColeoptileCurve(), []);

  // Update Germination Growth Meshes based on current Day
  const updateGrowthState = useCallback(
    (currentDay: number) => {
      if (!isGermination) return;
      const t = Math.max(0, Math.min(1.0, currentDay / 7.0));

      // 1. Seed Swelling
      if (seedMeshRef.current) {
        const swellFactor = 1.0 + 0.16 * Math.min(1.0, t * 2.8);
        seedMeshRef.current.scale.set(swellFactor, swellFactor, swellFactor);
      }

      // 2. Primary Radicle
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

      // 3. Seminal Roots Pair 1
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

      // 4. Seminal Roots Pair 2
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

      // 5. Emerging Coleoptile Shoot
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
        }
      }

      // 6. Root Hairs
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
    [isGermination, rootSplines, coleoptileSpline]
  );

  // Initialize Three.js Scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#03120d"); // Deep botanical dark
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    const [cx, cy, cz] = stageConfig.cameraPosition;
    camera.position.set(cx, cy, cz);
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
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.0;
    controls.maxDistance = 12.0;
    controls.maxPolarAngle = Math.PI - 0.15;
    controls.minPolarAngle = 0.15;
    const [tx, ty, tz] = stageConfig.cameraTarget;
    controls.target.set(tx, ty, tz);
    controlsRef.current = controls;

    // 5. Cinematic Lighting Rig
    const hemiLight = new THREE.HemisphereLight("#86efac", "#1c140e", 1.0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight("#fffbeb", 2.6);
    keyLight.position.set(4.5, 7.5, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight("#6ee7b7", 1.0);
    fillLight.position.set(-5, 2.5, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight("#a7f3d0", 2.5);
    rimLight.position.set(0, -3.0, -5.0);
    scene.add(rimLight);

    // 6. Build Botanical Plant & Soil Scene
    if (isGermination) {
      // Stratified open soil profile trench
      const soilGroup = createTrueSoilProfileTrench();
      scene.add(soilGroup);

      // Seed
      const seedMesh = createDetailedSeedMesh();
      seedMesh.position.set(0, 0, 0.05);
      scene.add(seedMesh);
      seedMeshRef.current = seedMesh;

      // Roots & Shoot Dynamic Meshes
      const rootMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#f8fafc"),
        roughness: 0.35,
      });

      const coleoptileMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#4ade80"),
        roughness: 0.32,
      });
      coleoptileMaterialRef.current = coleoptileMat;

      const radicleMesh = new THREE.Mesh(new THREE.BufferGeometry(), rootMat);
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

      const coleoptileMesh = new THREE.Mesh(new THREE.BufferGeometry(), coleoptileMat);
      scene.add(coleoptileMesh);
      coleoptileMeshRef.current = coleoptileMesh;

      const hairsGroup = new THREE.Group();
      scene.add(hairsGroup);
      rootHairsGroupRef.current = hairsGroup;

      updateGrowthState(day);
    } else {
      // Build Full Botanical Stage
      const stageModel = buildStageBotanicalGroup(stageId);
      scene.add(stageModel);
      stageGroupRef.current = stageModel;
    }

    // 7. Render Loop & Hotspot Tracking
    let animationFrameId: number;
    const tempVec = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);

      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;

        const projections = stageConfig.hotspots.map((spot) => {
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
    };
  }, [stageId, stageConfig, isGermination]);

  // Update growth state when day changes
  useEffect(() => {
    if (isGermination) {
      updateGrowthState(day);
    }
  }, [day, isGermination, updateGrowthState]);

  // Smooth Time-lapse Loop for Germination
  useEffect(() => {
    if (!isPlaying || !isGermination) return;

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
  }, [isPlaying, isGermination, playSpeed]);

  // Camera Presets
  const applyCameraPreset = useCallback(
    (preset: CameraPreset) => {
      if (!cameraRef.current || !controlsRef.current) return;
      setActivePreset(preset);

      const camera = cameraRef.current;
      const controls = controlsRef.current;
      const [tx, ty, tz] = stageConfig.cameraTarget;

      switch (preset) {
        case "macro":
          camera.position.set(tx + 0.4, ty + 0.3, 2.6);
          controls.target.set(tx, ty + 0.2, 0.1);
          break;
        case "roots":
          camera.position.set(0.1, -1.6, 4.0);
          controls.target.set(0, -1.2, 0);
          break;
        case "stem":
          camera.position.set(0.2, ty + 0.8, 3.4);
          controls.target.set(0, ty + 0.6, 0);
          break;
        case "overview":
        default:
          const [cx, cy, cz] = stageConfig.cameraPosition;
          camera.position.set(cx, cy, cz);
          controls.target.set(tx, ty, tz);
          break;
      }
      controls.update();
    },
    [stageConfig]
  );

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

    let textToSpeak = `गेहूँ अवस्था: ${stageConfig.nameHi}, अवधि ${stageConfig.daysRange}। `;
    if (selectedHotspot) {
      textToSpeak += `${selectedHotspot.titleHi}। ${selectedHotspot.descriptionHi}। ${selectedHotspot.agronomyHi}`;
    } else {
      textToSpeak += stageConfig.hotspots.map((h) => `${h.titleHi}: ${h.descriptionHi}`).join("। ");
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "hi-IN";
    utterance.rate = 0.92;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [isSpeaking, selectedHotspot, stageConfig]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col select-none overflow-hidden bg-[#03120d] text-white",
        isFullscreen ? "h-screen w-screen" : "h-full w-full",
        className
      )}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
      />

      {/* TOP FLOATING HEADER HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 p-2.5 sm:p-3.5">
        <div className="flex items-start justify-between gap-2">
          {/* Stage Name Badge */}
          <div className="pointer-events-auto rounded-xl border border-emerald-500/25 bg-[#03120d]/85 px-3 py-1.5 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Sparkles className="h-2.5 w-2.5" />
              </span>
              <span className="text-[10px] font-bold text-emerald-300">
                चरण {stageConfig.stageNumber} · 3D बॉटनिकल मॉडल
              </span>
            </div>
            <h3 className="mt-0.5 text-xs font-black text-white sm:text-sm">
              {stageConfig.nameHi}
              <span className="ml-1.5 text-[10px] font-normal text-emerald-200/70">
                ({stageConfig.daysRange})
              </span>
            </h3>
          </div>

          {/* Quick Action Buttons */}
          <div className="pointer-events-auto flex items-center gap-1">
            <button
              type="button"
              onClick={toggleSpeech}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl border transition active:scale-95",
                isSpeaking
                  ? "border-amber-400 bg-amber-400/20 text-amber-300"
                  : "border-white/15 bg-[#03120d]/80 text-white/80 hover:bg-white/10"
              )}
              title={isSpeaking ? "आवाज बंद करें" : "हिंदी में सुनें"}
            >
              {isSpeaking ? <Volume2 className="h-4 w-4 animate-pulse" /> : <VolumeX className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-[#03120d]/80 text-white/80 hover:bg-white/10 active:scale-95"
              title={isFullscreen ? "फुलस्क्रीन से बाहर निकलें" : "फुलस्क्रीन देखें"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 active:scale-95"
                title="बंद करें"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3D INTERACTIVE HOTSPOT PINS */}
      {hotspotScreenPositions.map((pos) => {
        if (!pos.visible) return null;
        const hotspot = stageConfig.hotspots.find((h) => h.id === pos.id);
        if (!hotspot) return null;
        const isSelected = selectedHotspot?.id === hotspot.id;

        return (
          <div
            key={pos.id}
            style={{
              position: "absolute",
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: "translate(-50%, -50%)",
              zIndex: isSelected ? 40 : 25,
            }}
            className="pointer-events-auto"
          >
            <button
              type="button"
              onClick={() => setSelectedHotspot(isSelected ? null : hotspot)}
              className={cn(
                "group relative flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9.5px] font-bold shadow-2xl transition active:scale-95",
                isSelected
                  ? "border-amber-400 bg-amber-400 text-black shadow-amber-400/50 scale-105"
                  : "border-emerald-400/70 bg-[#03120d]/90 text-emerald-200 backdrop-blur-md hover:border-emerald-300 hover:text-white"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isSelected ? "bg-black" : "bg-emerald-400 animate-ping"
                )}
              />
              <span className="truncate max-w-[110px]">{hotspot.titleHi}</span>
            </button>
          </div>
        );
      })}

      {/* HOTSPOT DETAIL MODAL / DRAWER */}
      <AnimatePresence>
        {selectedHotspot && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="pointer-events-auto absolute bottom-20 left-3 right-3 z-40 mx-auto max-w-sm rounded-2xl border border-emerald-500/40 bg-[#041a13]/95 p-3 text-white shadow-2xl backdrop-blur-xl sm:left-4 sm:right-auto sm:w-80"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300">
                  {selectedHotspot.categoryHi}
                </span>
                <h4 className="mt-1 text-xs font-bold text-white">
                  {selectedHotspot.titleHi}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHotspot(null)}
                className="rounded p-0.5 text-white/50 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="mt-1.5 text-[11px] leading-relaxed text-emerald-100/80">
              {selectedHotspot.descriptionHi}
            </p>

            <div className="mt-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-2">
              <p className="text-[10px] font-semibold text-amber-200">
                🌾 कृषि वैज्ञानिक सलाह:
              </p>
              <p className="mt-0.5 text-[10px] leading-normal text-amber-100/90">
                {selectedHotspot.agronomyHi}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STREAMLINED MOBILE BOTTOM CONTROL BAR */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 p-2.5 sm:p-3.5">
        <div className="pointer-events-auto mx-auto max-w-md rounded-2xl border border-white/15 bg-[#03120d]/85 p-2 shadow-2xl backdrop-blur-md">
          {/* Row 1: Camera Presets & Expand button */}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => applyCameraPreset("overview")}
                className={cn(
                  "rounded-lg px-2 py-0.5 text-[10px] font-bold transition active:scale-95",
                  activePreset === "overview"
                    ? "bg-emerald-500 text-black shadow"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                )}
              >
                विहंगम (360°)
              </button>
              <button
                type="button"
                onClick={() => applyCameraPreset("macro")}
                className={cn(
                  "rounded-lg px-2 py-0.5 text-[10px] font-bold transition active:scale-95",
                  activePreset === "macro"
                    ? "bg-emerald-500 text-black shadow"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                )}
              >
                नजदीकी (Macro)
              </button>
              {stageConfig.showSoilProfile && (
                <button
                  type="button"
                  onClick={() => applyCameraPreset("roots")}
                  className={cn(
                    "rounded-lg px-2 py-0.5 text-[10px] font-bold transition active:scale-95",
                    activePreset === "roots"
                      ? "bg-emerald-500 text-black shadow"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  )}
                >
                  मृदा व जड़ें
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 text-[9.5px] text-emerald-300/80 font-medium shrink-0">
              <Compass className="h-3 w-3 animate-spin" />
              <span>घुमाएं व पिंच ज़ूम</span>
            </div>
          </div>

          {/* Row 2: Germination Time-Lapse Scrubber (Only for Stage 1) */}
          {isGermination && (
            <div className="mt-2 border-t border-white/10 pt-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-black shadow transition hover:bg-emerald-400 active:scale-95"
                    title={isPlaying ? "रोकें" : "समय-प्रवाह चलाएं (Time-lapse)"}
                  >
                    {isPlaying ? (
                      <Pause className="h-3 w-3 fill-black" />
                    ) : (
                      <Play className="h-3 w-3 fill-black ml-0.5" />
                    )}
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

              <input
                type="range"
                min="0"
                max="7.0"
                step="0.1"
                value={day}
                onChange={(e) => {
                  setIsPlaying(false);
                  setDay(parseFloat(e.target.value));
                }}
                className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-emerald-400"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
