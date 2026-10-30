"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  CalendarDays,
} from "lucide-react";
import { CropStageDefinition } from "@/lib/farm/types";
import { cn } from "@/lib/cn";

export interface WheatStageVideoPlayerProps {
  currentStage: CropStageDefinition;
  selectedStage: CropStageDefinition;
  das: number;
  totalDays?: number;
  onSelectStage?: (stageId: string) => void;
  className?: string;
  variant?: "inline" | "standalone";
}

const STAGE_VIDEO_MAP: Record<string, { video: string; photo: string; order: number; label: string; phase: string }> = {
  germination: {
    video: "/videos/wheat-stages/stage-1-germination.mp4",
    photo: "/images/wheat-stages/stage-1-germination.jpg",
    order: 1,
    label: "अंकुरण",
    phase: "बुवाई व जमाव",
  },
  cri: {
    video: "/videos/wheat-stages/stage-2-cri.mp4",
    photo: "/images/wheat-stages/stage-2-cri.jpg",
    order: 2,
    label: "CRI",
    phase: "क्राउन जड़",
  },
  tillering: {
    video: "/videos/wheat-stages/stage-3-tillering.mp4",
    photo: "/images/wheat-stages/stage-3-tillering.jpg",
    order: 3,
    label: "कल्ले",
    phase: "बढ़वार",
  },
  stem_elongation: {
    video: "/videos/wheat-stages/stage-4-stem_elongation.mp4",
    photo: "/images/wheat-stages/stage-4-stem_elongation.jpg",
    order: 4,
    label: "गांठ",
    phase: "तना फैलाव",
  },
  booting: {
    video: "/videos/wheat-stages/stage-5-booting.mp4",
    photo: "/images/wheat-stages/stage-5-booting.jpg",
    order: 5,
    label: "गोभ",
    phase: "झंडा पत्ती",
  },
  heading: {
    video: "/videos/wheat-stages/stage-6-heading.mp4",
    photo: "/images/wheat-stages/stage-6-heading.jpg",
    order: 6,
    label: "बाली",
    phase: "बाली निकलना",
  },
  flowering: {
    video: "/videos/wheat-stages/stage-7-flowering.mp4",
    photo: "/images/wheat-stages/stage-7-flowering.jpg",
    order: 7,
    label: "फूल",
    phase: "परागण",
  },
  milking: {
    video: "/videos/wheat-stages/stage-8-milking.mp4",
    photo: "/images/wheat-stages/stage-8-milking.jpg",
    order: 8,
    label: "दूध",
    phase: "दूधिया दाना",
  },
  dough: {
    video: "/videos/wheat-stages/stage-9-dough.mp4",
    photo: "/images/wheat-stages/stage-9-dough.jpg",
    order: 9,
    label: "सख्त",
    phase: "सख्त दाना",
  },
  ripening: {
    video: "/videos/wheat-stages/stage-10-ripening.mp4",
    photo: "/images/wheat-stages/stage-10-ripening.jpg",
    order: 10,
    label: "पकाव",
    phase: "सुनहरी कटाई",
  },
};

const STAGE_ORDER_LIST = [
  "germination",
  "cri",
  "tillering",
  "stem_elongation",
  "booting",
  "heading",
  "flowering",
  "milking",
  "dough",
  "ripening",
];

export default function WheatStageVideoPlayer({
  currentStage,
  selectedStage,
  das,
  totalDays = 135,
  onSelectStage,
  className = "",
  variant = "inline",
}: WheatStageVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [viewMode, setViewMode] = useState<"video" | "photo">("video");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"identify" | "tasks" | "cautions">("identify");
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

  const stageMeta = STAGE_VIDEO_MAP[selectedStage.stageId] || STAGE_VIDEO_MAP.germination;
  const currentStageMeta = STAGE_VIDEO_MAP[currentStage.stageId] || STAGE_VIDEO_MAP.germination;
  const isCurrent = selectedStage.stageId === currentStage.stageId;

  const currentStageIndex = STAGE_ORDER_LIST.indexOf(currentStage.stageId);
  const selectedStageIndex = STAGE_ORDER_LIST.indexOf(selectedStage.stageId);

  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((das / Math.max(1, totalDays)) * 100))
  );

  // Sync video play/pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Cycle playback speed
  const cycleSpeed = useCallback(() => {
    const speeds = [0.5, 1.0, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  }, [playbackSpeed]);

  // Restart video
  const restartVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, []);

  // Hindi TTS Narration
  const toggleSpeech = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const identifyText = selectedStage.identificationCriteriaHi?.slice(0, 2).join(". ") || "";
    const taskText = selectedStage.importantActivitiesHi?.slice(0, 1).join(". ") || "";
    const narration = `चरण ${stageMeta.order}: ${selectedStage.stageNameHi}. ${selectedStage.descriptionHi}. खेत में पहचानें: ${identifyText}. आज का मुख्य काम: ${taskText}`;

    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.lang = "hi-IN";
    utterance.rate = 0.95;

    // Pick Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    const hiVoice = voices.find((v) => v.lang.startsWith("hi"));
    if (hiVoice) {
      utterance.voice = hiVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [isSpeaking, selectedStage, stageMeta.order]);

  // Clean up speech on unmount or stage change
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedStage.stageId]);

  // Reset video play status when stage changes
  useEffect(() => {
    setVideoLoaded(false);
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [selectedStage.stageId, playbackSpeed]);

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-b from-[#072019] via-[#051712] to-[#030e0b] text-white shadow-[0_20px_50px_-20px_rgba(5,60,40,0.85)]",
        isFullscreen ? "fixed inset-0 z-[9999] rounded-none overflow-y-auto" : "",
        className
      )}
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

      {/* Header bar */}
      <header className="relative flex items-start justify-between gap-3 px-4 pb-2.5 pt-4 sm:px-5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300/80">
            <Sprout className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
            <span>फसल विकास यात्रा · जीवंत वीडियो</span>
          </div>

          <h2 className="mt-1 flex flex-wrap items-center gap-2 text-[16px] font-bold leading-tight text-white sm:text-[18px]">
            <span>{selectedStage.stageNameHi}</span>
            <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10.5px] font-bold text-emerald-300 ring-1 ring-emerald-400/30">
              चरण {stageMeta.order}
            </span>
          </h2>

          <p className="mt-0.5 text-[11px] text-emerald-200/75">
            अवधि: {selectedStage.typicalDaysRange[0]}–{selectedStage.typicalDaysRange[1]} दिन
            {isCurrent && " · (आपकी फसल अभी इसी चरण में है)"}
          </p>
        </div>

        {/* Circular Progress & Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Hindi Narration Audio Button */}
          <button
            type="button"
            onClick={toggleSpeech}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10.5px] font-bold transition active:scale-95",
              isSpeaking
                ? "border-emerald-400 bg-emerald-500/30 text-emerald-200 animate-pulse"
                : "border-white/15 bg-black/40 text-emerald-300 hover:bg-white/10"
            )}
            title="बोलकर सुनें (Hindi Audio)"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="h-3.5 w-3.5 text-amber-300" />
                <span>रोकें</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">बोलकर सुनें</span>
              </>
            )}
          </button>

          {/* DAS Pill */}
          <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-1.5 text-right backdrop-blur-md">
            <p className="text-[13px] font-black leading-none text-white sm:text-[14px]">
              {das}{" "}
              <span className="text-[10px] font-medium text-emerald-300">DAS</span>
            </p>
            <p className="mt-0.5 text-[9px] font-semibold text-emerald-200/60">
              {progressPercent}% सीजन
            </p>
          </div>
        </div>
      </header>

      {/* Mode Switcher Bar */}
      <div className="mx-4 mb-2.5 flex items-center justify-between gap-2 sm:mx-5">
        <div className="inline-flex rounded-xl border border-white/10 bg-black/40 p-0.5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setViewMode("video")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10.5px] font-bold transition",
              viewMode === "video"
                ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-md font-black"
                : "text-white/60 hover:text-white"
            )}
          >
            <Play className="h-3 w-3 fill-current" />
            <span>🎬 जीवंत वीडियो</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("photo")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10.5px] font-bold transition",
              viewMode === "photo"
                ? "bg-emerald-600 text-white shadow-md font-black"
                : "text-white/60 hover:text-white"
            )}
          >
            <span>📷 HD फोटो</span>
          </button>
        </div>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="flex items-center gap-1 rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-200 transition hover:bg-emerald-500/25 active:scale-95"
          title={isFullscreen ? "फुलस्क्रीन से बाहर आएं" : "फुलस्क्रीन में देखें"}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="h-3 w-3" />
              <span>छोटा करें</span>
            </>
          ) : (
            <>
              <Maximize2 className="h-3 w-3" />
              <span>फुलस्क्रीन</span>
            </>
          )}
        </button>
      </div>

      {/* Media Canvas / Player Viewport */}
      <div className="relative mx-3.5 sm:mx-5">
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-2xl border border-emerald-500/30 bg-black shadow-2xl transition-all",
            isFullscreen ? "h-[60vh] sm:h-[70vh]" : "h-[260px] sm:h-[320px]"
          )}
        >
          {viewMode === "video" ? (
            <div className="relative h-full w-full cursor-pointer select-none" onClick={togglePlay}>
              <video
                ref={videoRef}
                key={stageMeta.video}
                src={stageMeta.video}
                poster={stageMeta.photo}
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={() => setVideoLoaded(true)}
                className="h-full w-full object-cover object-center"
              />

              {/* Cinematic Vignette */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

              {/* Floating Play/Pause Indicator (when paused) */}
              <AnimatePresence>
                {!isPlaying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/90 text-black shadow-2xl ring-4 ring-emerald-400/40">
                      <Play className="h-7 w-7 fill-black ml-1" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stage Badge on Top Left */}
              <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5">
                <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>चरण {stageMeta.order} · {stageMeta.label}</span>
                </span>
                {isCurrent && (
                  <span className="rounded-full bg-amber-400/30 border border-amber-300/40 px-2 py-0.5 text-[9.5px] font-bold text-amber-200 backdrop-blur-md">
                    वर्तमान फसल
                  </span>
                )}
              </div>

              {/* Playback Controls Bar on Bottom */}
              <div
                className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Left Controls: Play/Pause, Speed, Restart */}
                <div className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-black/70 px-2 py-1 backdrop-blur-md">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500 text-black transition hover:bg-emerald-400 active:scale-95"
                    title={isPlaying ? "रोकें (Pause)" : "चलाएं (Play)"}
                  >
                    {isPlaying ? (
                      <Pause className="h-3 w-3 fill-black" />
                    ) : (
                      <Play className="h-3 w-3 fill-black ml-0.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={restartVideo}
                    className="flex h-6 w-6 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
                    title="शुरू से पुनः चलाएं"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </button>

                  <button
                    type="button"
                    onClick={cycleSpeed}
                    className="rounded-lg bg-white/10 px-2 py-0.5 text-[10px] font-bold text-emerald-200 transition hover:bg-white/20"
                    title="चलाने की गति बदलें"
                  >
                    {playbackSpeed}x
                  </button>
                </div>

                {/* Right: Live Quality Indicator */}
                <div className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-black/70 px-2.5 py-1 text-[10px] font-semibold text-emerald-300 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>100% रियलिस्टिक वीडियो</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative h-full w-full">
              <Image
                src={stageMeta.photo}
                alt={selectedStage.stageNameHi}
                fill
                sizes="(max-width: 640px) 100vw, 800px"
                priority
                className="object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

              {/* Photo Caption */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                <span className="rounded-lg border border-white/15 bg-black/60 px-2 py-1 font-semibold backdrop-blur-md">
                  HD बॉटनिकल स्टूडियो फोटो
                </span>
                <span className="rounded-lg border border-white/15 bg-black/60 px-2 py-1 font-bold text-amber-200 backdrop-blur-md">
                  चरण {stageMeta.order}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 10-Stage Visual Timeline Rail */}
      <div className="relative px-3.5 pb-2 pt-3 sm:px-5">
        <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-emerald-200/90">
          <span className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-emerald-400" />
            <span>गेहूं विकास यात्रा (10 प्रमुख चरण)</span>
          </span>
          <span className="text-[10px] text-emerald-300/70">टैप करके किसी भी चरण का वीडियो देखें</span>
        </div>

        {/* 10-Stage Touch Grid */}
        <div className="grid grid-cols-10 gap-1 sm:gap-1.5">
          {STAGE_ORDER_LIST.map((sId, index) => {
            const meta = STAGE_VIDEO_MAP[sId];
            const isSelected = sId === selectedStage.stageId;
            const isCurr = sId === currentStage.stageId;
            const isPassed = index <= currentStageIndex;

            return (
              <button
                key={sId}
                type="button"
                onClick={() => onSelectStage?.(sId)}
                className={cn(
                  "group relative flex flex-col items-center rounded-xl py-1.5 transition-all active:scale-95",
                  isSelected
                    ? "bg-amber-400/25 ring-1.5 ring-amber-300 shadow-lg"
                    : isCurr
                      ? "bg-emerald-500/20 ring-1 ring-emerald-400/60"
                      : "hover:bg-white/10"
                )}
                title={`चरण ${meta.order}: ${meta.label} (${meta.phase})`}
              >
                {/* Progress bar line */}
                <span
                  className={cn(
                    "h-1.5 w-full rounded-full transition-all",
                    isSelected
                      ? "bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.8)]"
                      : isCurr
                        ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
                        : isPassed
                          ? "bg-emerald-600/70"
                          : "bg-white/15 group-hover:bg-white/30"
                  )}
                />

                {/* Step number */}
                <span
                  className={cn(
                    "mt-1 text-[9px] font-bold tabular-nums transition-colors",
                    isSelected
                      ? "text-amber-200 font-black"
                      : isCurr
                        ? "text-emerald-300"
                        : "text-white/45 group-hover:text-white/80"
                  )}
                >
                  {meta.order}
                </span>

                {/* Short Name */}
                <span
                  className={cn(
                    "truncate text-[8px] font-medium leading-none transition-colors",
                    isSelected
                      ? "text-amber-100 font-bold"
                      : isCurr
                        ? "text-emerald-200"
                        : "text-white/35 group-hover:text-white/70"
                  )}
                >
                  {meta.label}
                </span>

                {/* Pulse for Current Stage */}
                {isCurr && !isSelected && (
                  <span className="absolute -top-1 right-0.5 h-2 w-2 animate-ping rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Milestone Footnote */}
        <div className="mt-2 flex items-center justify-between text-[9.5px] font-semibold text-emerald-200/50">
          <span>🌱 बुवाई (चरण 1)</span>
          <span>🌿 कल्ले (चरण 3)</span>
          <span>🌾 बाली (चरण 6)</span>
          <span>☀️ कटाई (चरण 10)</span>
        </div>
      </div>

      {/* Practical Agronomic Insights Section */}
      <div className="mx-3.5 mb-4 sm:mx-5 rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur-md">
        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 border-b border-white/10 pb-2.5">
          <button
            type="button"
            onClick={() => setActiveTab("identify")}
            className={cn(
              "flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition",
              activeTab === "identify"
                ? "bg-emerald-500/30 text-emerald-200 ring-1 ring-emerald-400/40"
                : "text-white/60 hover:text-white"
            )}
          >
            <Info className="h-3 w-3 text-emerald-400" />
            <span>खेत में कैसे पहचानें</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tasks")}
            className={cn(
              "flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition",
              activeTab === "tasks"
                ? "bg-emerald-500/30 text-emerald-200 ring-1 ring-emerald-400/40"
                : "text-white/60 hover:text-white"
            )}
          >
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span>आज का मुख्य काम</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cautions")}
            className={cn(
              "flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold transition",
              activeTab === "cautions"
                ? "bg-amber-500/30 text-amber-200 ring-1 ring-amber-400/40"
                : "text-white/60 hover:text-white"
            )}
          >
            <AlertTriangle className="h-3 w-3 text-amber-400" />
            <span>गलतियों से बचें</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-2.5 text-[11.5px] leading-relaxed text-emerald-100/90">
          {activeTab === "identify" && (
            <div className="space-y-1.5">
              <p className="font-semibold text-emerald-300">
                {selectedStage.descriptionHi}
              </p>
              {selectedStage.identificationCriteriaHi && selectedStage.identificationCriteriaHi.length > 0 && (
                <ul className="space-y-1 text-white/80">
                  {selectedStage.identificationCriteriaHi.map((crit, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="space-y-2">
              {selectedStage.importantActivitiesHi && selectedStage.importantActivitiesHi.length > 0 && (
                <ul className="space-y-1.5 text-white/90">
                  {selectedStage.importantActivitiesHi.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              )}
              {selectedStage.irrigationConsiderationsHi && (
                <div className="flex items-start gap-2 rounded-xl bg-blue-500/10 p-2 text-blue-200 border border-blue-400/20">
                  <Droplets className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
                  <span className="text-[11px]">{selectedStage.irrigationConsiderationsHi}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === "cautions" && (
            <div className="space-y-1.5">
              {selectedStage.commonMistakesHi && selectedStage.commonMistakesHi.length > 0 ? (
                <ul className="space-y-1.5 text-amber-100/90">
                  {selectedStage.commonMistakesHi.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-2 rounded-xl bg-amber-500/10 p-2 border border-amber-400/20">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                      <span className="text-[11px]">{mistake}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/60">इस चरण में कोई विशेष गलती दर्ज नहीं है। नियमित निगरानी जारी रखें।</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
