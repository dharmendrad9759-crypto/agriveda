"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CropStageDefinition } from "@/lib/farm/types";
import { EASE_OUT, MOTION } from "@/lib/motion/variants";
import { cn } from "@/lib/cn";
import {
  Sprout,
  Sparkles,
  Info,
  CalendarDays,
  ChevronRight,
  Eye,
  RotateCcw,
  Maximize2,
  Box,
  Layers,
} from "lucide-react";

// Dynamically import the 3D WebGL Viewer (SSR-safe for Next.js)
const WheatGermination3DViewer = dynamic(
  () => import("@/components/farm/WheatGermination3DViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#05140f] text-emerald-300">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
        <p className="text-[11px] font-medium">3D बॉटनिकल मॉडल लोड हो रहा है…</p>
      </div>
    ),
  }
);

interface WheatStageVisualizerProps {
  currentStage: CropStageDefinition;
  selectedStage: CropStageDefinition;
  das: number;
  totalDays?: number;
  onSelectStage?: (stageId: string) => void;
  className?: string;
}

const STAGE_RAIL = [
  { id: "germination", stageNum: 1, code: "चरण 1", label: "अंकुरण", img: "/images/wheat-stages/stage-1-germination.jpg", has3D: true },
  { id: "cri", stageNum: 2, code: "चरण 2", label: "CRI", img: "/images/wheat-stages/stage-2-cri.jpg", has3D: true },
  { id: "tillering", stageNum: 3, code: "चरण 3", label: "कल्ले", img: "/images/wheat-stages/stage-3-tillering.jpg", has3D: true },
  { id: "stem_elongation", stageNum: 4, code: "चरण 4", label: "गांठ", img: "/images/wheat-stages/stage-4-stem_elongation.jpg", has3D: true },
  { id: "booting", stageNum: 5, code: "चरण 5", label: "गोभ", img: "/images/wheat-stages/stage-5-booting.jpg", has3D: true },
  { id: "heading", stageNum: 6, code: "चरण 6", label: "बाली", img: "/images/wheat-stages/stage-6-heading.jpg", has3D: true },
  { id: "flowering", stageNum: 7, code: "चरण 7", label: "फूल", img: "/images/wheat-stages/stage-7-flowering.jpg", has3D: true },
  { id: "milking", stageNum: 8, code: "चरण 8", label: "दूध", img: "/images/wheat-stages/stage-8-milking.jpg", has3D: true },
  { id: "dough", stageNum: 9, code: "चरण 9", label: "सख्त", img: "/images/wheat-stages/stage-9-dough.jpg", has3D: true },
  { id: "ripening", stageNum: 10, code: "चरण 10", label: "पकाव", img: "/images/wheat-stages/stage-10-ripening.jpg", has3D: true },
] as const;

interface AnatomicalPin {
  x: number; // percent
  y: number; // percent
  label: string;
  detail: string;
}

const STAGE_PINS: Record<string, AnatomicalPin[]> = {
  germination: [
    { x: 50, y: 32, label: "प्रांकुर (Coleoptile)", detail: "प्रकाश की ओर निकलती नाजुक हरी सुई" },
    { x: 50, y: 78, label: "प्राथमिक जड़ (Radicle)", detail: "मिट्टी में नमी पकड़ती सफेद जड़" },
  ],
  cri: [
    { x: 50, y: 68, label: "क्राउन जड़ें (CRI)", detail: "21 दिन पर निकलने वाला स्थायी जड़ चक्र (पहला पानी)" },
    { x: 42, y: 28, label: "3-4 पत्तियां", detail: "सूर्यप्रकाश से भोजन तैयार करने का प्रारंभिक आधार" },
  ],
  tillering: [
    { x: 52, y: 44, label: "कल्ले (Tillers)", detail: "मुख्य तने के पास से 4 से 6 नए स्वस्थ कल्ले" },
    { x: 48, y: 80, label: "जड़ जाल", detail: "मजबूत पौधे हेतु सघन जड़ तंत्र" },
  ],
  stem_elongation: [
    { x: 48, y: 52, label: "तना गांठें (Nodes)", detail: "निचले तने पर महसूस होने वाली पहली व दूसरी गांठ" },
    { x: 52, y: 24, label: "तीव्र बढ़वार", detail: "30-50 सेमी तक पौधे की तेजी से बढ़ती ऊंचाई" },
  ],
  booting: [
    { x: 50, y: 42, label: "फूला गोभ (Swollen Boot)", detail: "पत्ती के खोल में बंद विकसित होती बाली" },
    { x: 38, y: 18, label: "झंडा पत्ती (Flag Leaf)", detail: "दानों का 50% से अधिक वजन इसी से बनता है" },
  ],
  heading: [
    { x: 50, y: 34, label: "हरी बाली (Emerged Ear)", detail: "शीर्ष से पूर्णतः बाहर निकल आई हरी बाली" },
    { x: 52, y: 14, label: "मूंछें / सूंड (Awns)", detail: "सूर्य की रोशनी ग्रहण करने वाली लंबी मूंछें" },
  ],
  flowering: [
    { x: 50, y: 36, label: "परागकोश (Anthers)", detail: "बाली पर लटकते हल्के पीले फूल (परागण अवधि)" },
    { x: 52, y: 22, label: "गर्भधारण", detail: "प्रत्येक दाने के बनने की निर्णायक प्रक्रिया" },
  ],
  milking: [
    { x: 50, y: 44, label: "दूधिया दाने (Milky Grains)", detail: "दबाने पर सफेद रस निकलना, वजन बढ़ना" },
    { x: 54, y: 26, label: "झुकती बाली", detail: "दानों में स्टार्च भराव से भारी होती बाली" },
  ],
  dough: [
    { x: 50, y: 46, label: "सख्त दाना (Dough Stage)", detail: "दूध सूखकर गाढ़ा आटा बनना, नाखून से दबना" },
    { x: 52, y: 22, label: "सुनहरा रंग", detail: "पौधे का हरापन धीरे-धीरे सुनहरे में बदलना" },
  ],
  ripening: [
    { x: 50, y: 48, label: "पकी सुनहरी बाली", detail: "12-14% नमी, सुनहरी चमक, कटाई हेतु तैयार" },
    { x: 48, y: 28, label: "कड़ा अनाज", detail: "दांत से काटने पर 'कट' की आवाज" },
  ],
};

export default function WheatStageVisualizer({
  currentStage,
  selectedStage,
  das,
  totalDays = 135,
  onSelectStage,
  className = "",
}: WheatStageVisualizerProps) {
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D View Mode State
  const [viewMode, setViewMode] = useState<"image" | "3d">("image");
  const [showFullscreen3D, setShowFullscreen3D] = useState(false);

  // 3D Tilt perspective state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [activePinIndex, setActivePinIndex] = useState<number | null>(null);

  const stageIndex = useMemo(() => {
    const index = STAGE_RAIL.findIndex((stage) => stage.id === selectedStage.stageId);
    return index < 0 ? 0 : index;
  }, [selectedStage.stageId]);

  const currentStageIndex = useMemo(() => {
    const index = STAGE_RAIL.findIndex((stage) => stage.id === currentStage.stageId);
    return index < 0 ? 0 : index;
  }, [currentStage.stageId]);

  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((das / Math.max(1, totalDays)) * 100))
  );

  const isCurrent = selectedStage.stageId === currentStage.stageId;
  const pins = STAGE_PINS[selectedStage.stageId] || [];
  const currentStageRailItem = STAGE_RAIL[stageIndex] || STAGE_RAIL[0];
  const has3D = true;

  // Interactive 3D mouse tilt handler (only active in 2D image mode)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced || viewMode === "3d" || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = -((y - centerY) / centerY) * 7;
      const rotY = ((x - centerX) / centerX) * 7;
      setRotateX(rotX);
      setRotateY(rotY);
    },
    [reduced, viewMode]
  );

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
  }, []);

  const activeImage = selectedStage.photoUrl?.startsWith("/images/wheat-stages/")
    ? selectedStage.photoUrl
    : currentStageRailItem.img;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-[#0b2720] via-[#071a15] to-[#04110d] text-white shadow-[0_20px_50px_-20px_rgba(5,60,40,0.85)]",
        className
      )}
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Header bar */}
      <header className="relative flex items-start justify-between gap-3 px-4.5 pb-2.5 pt-4 sm:px-5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300/80">
            <Sprout className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
            फसल विकास अवस्था (3D Botanical Visualizer)
          </div>
          <h2 className="mt-1 flex items-center gap-2 text-[16px] font-bold leading-tight text-white">
            <span>{selectedStage.stageNameHi}</span>
            <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
              चरण {stageIndex + 1}
            </span>
          </h2>
          <p className="mt-0.5 text-[11px] text-emerald-200/70">
            अनुमानित समय: {selectedStage.typicalDaysRange[0]}–{selectedStage.typicalDaysRange[1]} दिन
            {isCurrent && " · (आपकी फसल अभी यहाँ है)"}
          </p>
        </div>

        {/* Circular Progress & DAS */}
        <div className="flex shrink-0 items-center gap-2">
          {!isCurrent && onSelectStage && (
            <button
              type="button"
              onClick={() => onSelectStage(currentStage.stageId)}
              className="inline-flex items-center gap-1 rounded-full border border-amber-300/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-semibold text-amber-200 transition hover:bg-amber-400/20 active:scale-95"
              title="वर्तमान अवस्था पर वापस जाएं"
            >
              <RotateCcw className="h-3 w-3" />
              <span>वर्तमान</span>
            </button>
          )}

          <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-1.5 text-right backdrop-blur-md">
            <p className="text-[14px] font-bold leading-none text-white">
              {das}{" "}
              <span className="text-[10px] font-medium text-emerald-300">DAS</span>
            </p>
            <p className="mt-0.5 text-[9px] font-semibold text-emerald-200/60">
              {progressPercent}% सीजन
            </p>
          </div>
        </div>
      </header>

      {/* Mode Switcher Pill (Only for stages with Live 3D model) */}
      {has3D && (
        <div className="mx-3.5 mb-2.5 flex items-center justify-between gap-2 sm:mx-5">
          <div className="inline-flex rounded-xl border border-white/10 bg-black/40 p-0.5 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setViewMode("image")}
              className={cn(
                "rounded-lg px-2.5 py-1 text-[10px] font-bold transition",
                viewMode === "image"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-white/60 hover:text-white"
              )}
            >
              📷 2D स्टूडियो फोटो
            </button>
            <button
              type="button"
              onClick={() => setViewMode("3d")}
              className={cn(
                "flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-bold transition",
                viewMode === "3d"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow font-black"
                  : "text-emerald-300 hover:text-white"
              )}
            >
              <Box className="h-3 w-3" />
              <span>🎬 3D इंटरैक्टिव लैब</span>
              <span className="rounded bg-amber-400/30 px-1 text-[8.5px] font-black text-amber-200">
                Live
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowFullscreen3D(true)}
            className="flex items-center gap-1 rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-200 transition hover:bg-emerald-500/25 active:scale-95"
            title="3D फुलस्क्रीन में खोलें"
          >
            <Maximize2 className="h-3 w-3" />
            <span>3D फुलस्क्रीन</span>
          </button>
        </div>
      )}

      {/* 3D Botanical Stage Visualizer Card / 3D Canvas */}
      <div className="relative mx-3.5 sm:mx-5">
        {has3D && viewMode === "3d" ? (
          <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-emerald-500/30 shadow-2xl sm:h-[480px]">
            <WheatGermination3DViewer
              key={selectedStage.stageId}
              stageId={selectedStage.stageId}
              className="h-full w-full"
              variant="inline"
            />
          </div>
        ) : (
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              perspective: 1000,
            }}
            className="relative h-[280px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#061611] shadow-2xl transition-transform duration-200 ease-out sm:h-[310px]"
          >
            {/* Framer motion tilt container */}
            <motion.div
              animate={{
                rotateX: rotateX,
                rotateY: rotateY,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className="relative h-full w-full"
            >
              {/* Stage Photograph / 3D Render with Cross-Fade */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedStage.stageId}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: MOTION.normal, ease: EASE_OUT }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeImage}
                    alt={selectedStage.stageNameHi}
                    fill
                    sizes="(max-width: 640px) 100vw, 600px"
                    priority
                    className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                  />

                  {/* Subtle dark vignette overlay for typography contrast */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04110d]/90 via-[#04110d]/25 to-black/40" />
                </motion.div>
              </AnimatePresence>

              {/* Stage Badge & Status Indicator */}
              <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5">
                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold shadow-md backdrop-blur-md",
                    isCurrent
                      ? "border-amber-400/50 bg-amber-400/20 text-amber-100"
                      : "border-white/15 bg-black/45 text-emerald-100/90"
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      isCurrent ? "animate-ping bg-amber-300" : "bg-emerald-400"
                    )}
                  />
                  <span>
                    {isCurrent
                      ? "आपकी फसल अभी यहाँ है"
                      : `${currentStageRailItem.label} (${currentStageRailItem.code})`}
                  </span>
                </div>
              </div>

              {/* Quick 3D Launcher Pill on Germination card */}
              {has3D && (
                <div className="absolute right-3 top-3 z-10">
                  <button
                    type="button"
                    onClick={() => setViewMode("3d")}
                    className="flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/25 px-2.5 py-1 text-[10.5px] font-bold text-white shadow-lg backdrop-blur-md transition hover:bg-emerald-500/40 active:scale-95"
                  >
                    <Box className="h-3 w-3 text-emerald-300" />
                    <span>3D मॉडल चलाएं</span>
                  </button>
                </div>
              )}

              {/* Botanical Anatomy Callout Pins */}
              {pins.map((pin, pIdx) => {
                const isActive = activePinIndex === pIdx;
                return (
                  <div
                    key={pin.label}
                    style={{
                      left: `${pin.x}%`,
                      top: `${pin.y}%`,
                    }}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                  >
                    <button
                      type="button"
                      onClick={() => setActivePinIndex(isActive ? null : pIdx)}
                      className="group relative flex items-center justify-center p-1"
                      aria-label={pin.label}
                    >
                      <span className="absolute h-5 w-5 animate-ping rounded-full bg-emerald-400/30 duration-1000" />
                      <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white/80 bg-emerald-500 shadow-md transition group-hover:scale-125">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      </span>
                    </button>

                    {/* Pin Detail Tooltip / Card */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-1/2 top-full z-30 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-xl border border-emerald-400/30 bg-[#071c16]/95 px-3 py-1.5 text-left shadow-2xl backdrop-blur-md"
                        >
                          <p className="text-[11px] font-bold text-white">{pin.label}</p>
                          <p className="text-[9.5px] text-emerald-200/80">{pin.detail}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-200/80">
                  <Info className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-[10px] font-medium">
                    {pins.length > 0
                      ? "अंगों की जानकारी के लिए बिंदुओं पर टैप करें"
                      : "ICAR-IIWBR मानक फसल अवस्था"}
                  </span>
                </div>
                <span className="rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[9.5px] font-semibold text-emerald-200/90 backdrop-blur-md">
                  Zadoks {currentStageRailItem.code}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* 360° Timeline Scrubber Rail */}
      <div className="relative px-3.5 pb-3.5 pt-3 sm:px-5">
        <div className="mb-2 flex items-center justify-between text-[10.5px] font-semibold text-emerald-200/80">
          <span>सीजन टाइमलाइन (10 Zadoks Stages)</span>
          <span className="text-[9.5px] text-emerald-200/50">टैप करके अगली अवस्था देखें</span>
        </div>

        {/* Visual Stage Rail */}
        <div className="grid grid-cols-10 gap-1 sm:gap-1.5">
          {STAGE_RAIL.map((stage, index) => {
            const selected = stage.id === selectedStage.stageId;
            const isCurrentStep = stage.id === currentStage.stageId;
            const passed = index <= currentStageIndex;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => {
                  onSelectStage?.(stage.id);
                }}
                aria-label={`${stage.label} (${stage.code})`}
                aria-pressed={selected}
                className={cn(
                  "group relative flex flex-col items-center rounded-xl py-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300",
                  selected
                    ? "bg-amber-400/20 ring-1 ring-amber-300/60 shadow-md"
                    : isCurrentStep
                      ? "bg-emerald-500/20 ring-1 ring-emerald-400/40"
                      : "hover:bg-white/5"
                )}
              >
                {/* Step Line Bar */}
                <span
                  className={cn(
                    "h-1.5 w-full rounded-full transition-colors",
                    selected
                      ? "bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.7)]"
                      : isCurrentStep
                        ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                        : passed
                          ? "bg-emerald-500/40"
                          : "bg-white/10 group-hover:bg-white/20"
                  )}
                />

                {/* Stage Code */}
                <span
                  className={cn(
                    "mt-1 text-[8.5px] font-bold tabular-nums transition-colors",
                    selected
                      ? "text-amber-200"
                      : isCurrentStep
                        ? "text-emerald-300"
                        : "text-white/40 group-hover:text-white/70"
                  )}
                >
                  {stage.code}
                </span>

                {/* Stage Micro Label */}
                <span
                  className={cn(
                    "truncate text-[8px] font-medium leading-none transition-colors",
                    selected
                      ? "text-amber-100"
                      : isCurrentStep
                        ? "text-emerald-200"
                        : "text-white/35 group-hover:text-white/60"
                  )}
                >
                  {stage.label}
                </span>

                {/* Active pulse on current stage */}
                {isCurrentStep && !selected && (
                  <span className="absolute -top-1 right-1 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Phase milestone markers */}
        <div className="mt-1.5 flex items-center justify-between text-[9px] font-semibold text-emerald-200/40">
          <span>🌱 बुवाई (चरण 1)</span>
          <span>🌿 बढ़वार (चरण 3)</span>
          <span>🌾 बाली (चरण 6)</span>
          <span>☀️ कटाई (चरण 10)</span>
        </div>
      </div>

      {/* Fullscreen 3D Botanical Lab Modal */}
      <AnimatePresence>
        {showFullscreen3D && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="fixed inset-0 z-[9999] bg-black"
          >
            <WheatGermination3DViewer
              key={selectedStage.stageId}
              stageId={selectedStage.stageId}
              className="h-full w-full"
              variant="fullscreen"
              onClose={() => setShowFullscreen3D(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
