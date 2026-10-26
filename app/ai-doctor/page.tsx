"use client";

import {
    AiDoctorActions,
    AiDoctorCropSelect,
    AiDoctorDesktopSidebar,
    AiDoctorHero,
    AiDoctorPhotoUpload,
    AiDoctorRecentDiagnoses,
    AiDoctorSymptoms,
} from "@/components/ai-doctor/AiDoctorRedesign";
import DiagnosisListenButton from "@/components/ai-doctor/DiagnosisListenButton";
import ShareOutbreakPrompt from "@/components/outbreak-radar/ShareOutbreakPrompt";
import VoiceInput from "@/components/query/VoiceInput";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { useToast } from "@/components/ui/Toast";
import { OTHER_CROP, aiDoctorCropLabel } from "@/data/ai-doctor-crops";
import { useAIHistory } from "@/hooks/useAIHistory";
import {
    analyzeDiagnosis,
    analyzePlantImage,
    checkAiDoctorConfigured,
    type DiagnosisResult,
} from "@/lib/aiDiagnosis";
import {
  buildDiagnosisSpeechText,
  guessDiagnosisKind,
  likelyThreatLabel,
  severityHi,
} from "@/lib/aiDoctorFarmerUi";
import { sanitizeDiagnosisForFarmer } from "@/lib/aiDoctorSanitize";
import {
  compressPhotoForReferral,
  saveAiDoctorExpertReferral,
  urlToDataUrl,
} from "@/lib/aiDoctorExpertReferral";
import { analyzePhotoBrightness } from "@/lib/photoQuality";
import { fileToHistoryThumb, srcToHistoryThumb } from "@/lib/aiHistoryThumb";
import { formatFarmerDose } from "@/lib/units/farmerDose";
import { track } from "@/lib/analytics";
import { scheduleAiDoctorFollowUp } from "@/lib/aiDoctorFollowUp";
import {
    claimPendingAiScan,
    dataUrlToFile,
    releasePendingScanLock,
} from "@/lib/pendingAiScan";
import {
    Camera,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Leaf,
    Loader2,
    Pill,
    Printer,
    Share2,
    ShieldCheck,
    Sprout,
    Stethoscope,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import ChemBottleThumb from "@/components/crops/ChemBottleThumb";
import { CROP_PROBLEM_CROPS } from "@/data/crop-curative-problems";
import { cn } from "@/lib/cn";

/** Look up verified reference field image from app's problem catalog */
function findReferenceThreat(
  diseaseName: string,
  cropSlug?: string
): { nameHi: string; image: string } | null {
  if (!diseaseName) return null;
  const dNorm = diseaseName.toLowerCase().replace(/[^a-z0-9\u0900-\u097F]/g, "");

  const allProblems = CROP_PROBLEM_CROPS.flatMap((c) =>
    c.problems.map((p) => ({
      ...p,
      isSameCrop: cropSlug ? c.slug === cropSlug : false,
    }))
  ).sort((a, b) => (b.isSameCrop ? 1 : 0) - (a.isSameCrop ? 1 : 0));

  for (const p of allProblems) {
    const pHi = p.nameHi.toLowerCase().replace(/[^a-z0-9\u0900-\u097F]/g, "");
    const pEn = p.nameEn.toLowerCase().replace(/[^a-z0-9\u0900-\u097F]/g, "");
    const pId = p.id.toLowerCase().replace(/-/g, "");

    if (
      (pHi.length >= 3 && dNorm.includes(pHi)) ||
      (dNorm.length >= 3 && pHi.includes(dNorm)) ||
      (pEn.length >= 3 && dNorm.includes(pEn)) ||
      (dNorm.length >= 3 && pEn.includes(dNorm)) ||
      (pId.length >= 3 && dNorm.includes(pId))
    ) {
      return { nameHi: p.nameHi, image: p.image };
    }
  }
  return null;
}

/** Keep photo notes farmer-simple — drop English (jargon) parentheses. */
function simpleObservation(text: string): string {
  return text
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Shorten stage by stripping long English parenthetical jargon (Vegetative / Seedling Stage) */
function shortenCropStage(stage?: string): string {
  if (!stage || stage === "—") return "";
  const cleaned = stage.replace(/\s*\([^)]*[A-Za-z][^)]*\)/g, "").trim();
  return cleaned || stage.trim();
}

export default function AIDoctorPage() {
  const router = useRouter();
  const { t } = useLocale();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const secondInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const { addEntry, history, clearHistory } = useAIHistory();
  const { showToast } = useToast();
  const [referringExpert, setReferringExpert] = useState(false);

  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  // Auto-scroll to result when diagnosis arrives
  useEffect(() => {
    if (result) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  }, [result]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewUrl2, setPreviewUrl2] = useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showWhy, setShowWhy] = useState(true);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [symptomNotes, setSymptomNotes] = useState("");
  const [affectedPart, setAffectedPart] = useState("");
  const [severityChoice, setSeverityChoice] = useState("");
  const [activeChips, setActiveChips] = useState<string[]>([]);
  /** Allow crop → symptoms without a photo (optional escape hatch) */
  const [symptomsOnlyMode, setSymptomsOnlyMode] = useState(false);
  /** 3-Step Wizard: 1 (Photo) -> 2 (Crop) -> 3 (Symptoms & Diagnosis) */
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  const hasPhoto = Boolean(selectedFile || previewUrl);
  const hasCrop = Boolean(selectedCrop);
  const showCropStep = hasPhoto || symptomsOnlyMode;
  const showSymptomStep = showCropStep && hasCrop;
  const hasSymptoms = symptomNotes.trim().length > 0;
  const canScan =
    ((hasPhoto && hasCrop) || (symptomsOnlyMode && hasCrop && hasSymptoms)) &&
    !isScanning &&
    aiConfigured !== false;
  const hasInput = Boolean(previewUrl || selectedFile || result || hasSymptoms || hasCrop);

  useEffect(() => {
    checkAiDoctorConfigured().then(setAiConfigured);
  }, []);

  useEffect(() => {
    const pending = claimPendingAiScan();
    if (!pending) return;

    let cancelled = false;

    (async () => {
      try {
        const file = await dataUrlToFile(pending.dataUrl, pending.fileName);
        if (cancelled) return;
        setSelectedCrop(pending.cropSlug);
        setSelectedFile(file);
        setFileName(pending.fileName);
        setPreviewUrl((prev) => {
          if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
          return pending.dataUrl;
        });
        setPreviewFailed(false);
        setResult(null);
        setHistoryExpanded(false);

        if (pending.autoScan) {
          setIsScanning(true);
          try {
            const diagnosis = await analyzePlantImage(file, pending.cropSlug);
            if (!cancelled) {
              setResult(diagnosis);
              addEntry({
                fileName: pending.fileName,
                thumbnailUrl: pending.dataUrl,
                result: diagnosis,
              });
              showToast("विश्लेषण पूरा ✓");
              track("ai_scan", { crop: pending.cropSlug, mode: "photo" });
            }
          } catch (err) {
            if (!cancelled) {
              showToast(err instanceof Error ? err.message : "Analysis failed", "error");
            }
          } finally {
            if (!cancelled) setIsScanning(false);
            releasePendingScanLock();
          }
        } else {
          setActiveStep(3);
          releasePendingScanLock();
        }
      } catch {
        if (!cancelled) showToast("Could not load scanned photo", "error");
        releasePendingScanLock();
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount for pending scan handoff
  }, []);

  const openHistoryEntry = (entry: (typeof history)[0]) => {
    setResult(sanitizeDiagnosisForFarmer(entry.result));
    setPreviewUrl(entry.thumbnailUrl || null);
    setPreviewFailed(false);
    setFileName(entry.fileName);
    setSelectedFile(null);
    setShowWhy(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToHistory = () => {
    setHistoryExpanded(true);
    requestAnimationFrame(() => {
      document.getElementById("ai-doctor-history")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) {
      showToast("सिर्फ़ image file चुनें", "error");
      return;
    }
    const quality = await analyzePhotoBrightness(file);
    if (!quality.ok) {
      showToast(quality.messageHi, "error");
    } else {
      showToast("फोटो साफ लग रही है ✓", "success");
    }
    setFileName(file.name);
    setSelectedFile(file);
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setPreviewFailed(false);
    setResult(null);
    setSymptomsOnlyMode(false);
    showToast("फोटो चुनी गई ✓", "success");
    setActiveStep(2);
  };

  const handleSecondFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) {
      showToast("सिर्फ़ image file चुनें", "error");
      return;
    }
    if (!selectedFile && !previewUrl) {
      showToast("पहले मुख्य फोटो चुनें", "error");
      return;
    }
    setSelectedFile2(file);
    if (previewUrl2?.startsWith("blob:")) URL.revokeObjectURL(previewUrl2);
    setPreviewUrl2(URL.createObjectURL(file));
    setResult(null);
    showToast("दूसरी फोटो जुड़ गई ✓", "success");
  };

  const clearSecondPhoto = () => {
    if (previewUrl2?.startsWith("blob:")) URL.revokeObjectURL(previewUrl2);
    setPreviewUrl2(null);
    setSelectedFile2(null);
    if (secondInputRef.current) secondInputRef.current.value = "";
  };

  const clearPhoto = () => {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewFailed(false);
    setSelectedFile(null);
    setFileName("");
    clearSecondPhoto();
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
    if (!symptomsOnlyMode) {
      setSelectedCrop("");
      setSymptomNotes("");
      setActiveChips([]);
      setActiveStep(1);
    }
  };

  const handleScan = async () => {
    if (!selectedCrop) {
      showToast("पहले फसल चुनें", "error");
      return;
    }
    if (!selectedFile && !hasSymptoms) {
      showToast("फोटो चुनें या लक्षण लिखें", "error");
      return;
    }
    setIsScanning(true);

    try {
      const combinedSymptoms = [
        affectedPart ? `प्रभावित हिस्सा: ${affectedPart}` : "",
        severityChoice ? `गंभीरता: ${severityChoice}` : "",
        symptomNotes.trim(),
      ].filter(Boolean).join(" · ");

      const diagnosis = await analyzeDiagnosis({
        imageFile: selectedFile,
        imageFile2: selectedFile2,
        cropSlug: selectedCrop || OTHER_CROP.slug,
        symptoms: combinedSymptoms,
      });
      setResult(diagnosis);
      const thumb =
        (selectedFile ? await fileToHistoryThumb(selectedFile) : "") ||
        (await srcToHistoryThumb(previewUrl));
      const entry = addEntry({
        fileName: selectedFile ? fileName || "scan.jpg" : "symptoms.txt",
        thumbnailUrl: thumb,
        result: diagnosis,
      });
      const isHealthy =
        diagnosis.problemType === "healthy" ||
        /स्वस्थ|कोई स्पष्ट समस्या नहीं/i.test(diagnosis.diseaseName);
      if (!isHealthy) {
        scheduleAiDoctorFollowUp({
          historyId: entry.id,
          cropSlug: selectedCrop || OTHER_CROP.slug,
          diseaseName: diagnosis.diseaseName,
        });
      }
      showToast("विश्लेषण पूर्ण ✓");
      track("ai_scan", {
        crop: selectedCrop || OTHER_CROP.slug,
        mode: selectedFile ? (selectedFile2 ? "photo2" : "photo") : "symptoms",
      });
    } catch (err) {
      showToast(err instanceof Error ? err.message : "विश्लेषण विफल", "error");
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    clearPhoto();
    setResult(null);
    setSymptomNotes("");
    setAffectedPart("");
    setSeverityChoice("");
    setActiveChips([]);
    setSelectedCrop("");
    setSymptomsOnlyMode(false);
    setActiveStep(1);
  };

  const handleToggleChip = (id: string, label: string) => {
    const isActive = activeChips.includes(id);
    if (isActive) {
      setActiveChips((prev) => prev.filter((c) => c !== id));
      setSymptomNotes((notes) =>
        notes
          .replace(new RegExp(`(^|,\\s*)${label}(?=,|$)`, "gi"), "$1")
          .replace(/,\s*,/g, ",")
          .replace(/^[\s,]+|[\s,]+$/g, "")
          .slice(0, 300)
      );
      return;
    }
    setActiveChips((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setSymptomNotes((notes) => {
      if (new RegExp(`(^|,\\s*)${label}(?=,|$)`, "i").test(notes)) return notes;
      const next = notes.trim() ? `${notes.trim()}, ${label}` : label;
      return next.slice(0, 300);
    });
  };

  const handleSelectCrop = (slug: string) => {
    setSelectedCrop(slug);
    setSymptomNotes("");
    setActiveChips([]);
    setActiveStep(3);
  };

  return (
    <AppShell
      className="ai-doctor-page"
      breadcrumbs={[
        { label: t("navHome"), href: "/" },
        { label: t("toolAi") },
      ]}
    >
      <div className="mx-auto w-full max-w-lg space-y-3.5 sm:max-w-none sm:space-y-5">
        <AiDoctorHero
          aiConfigured={aiConfigured}
          onHistoryClick={scrollToHistory}
          historyCount={history.length}
        />

        <div className="lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">
          <div className="lg:col-span-8 lg:space-y-4">
            {/* If no result and not scanning: Show 3-Step Wizard */}
            {!result && !isScanning && (
              <>
                {/* 3-Step Stepper Navigation Bar */}
                <nav aria-label="जाँच चरण" className="flex items-center justify-between gap-1 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm dark:border-slate-800 dark:bg-[var(--av-surface)]">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-extrabold transition ${
                      activeStep === 1
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span
                      className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[10px] font-black ${
                        activeStep === 1
                          ? "bg-white text-emerald-700"
                          : hasPhoto
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
                            : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {hasPhoto ? "✓" : "1"}
                    </span>
                    <span>फोटो</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => (hasPhoto || symptomsOnlyMode) && setActiveStep(2)}
                    disabled={!hasPhoto && !symptomsOnlyMode}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-extrabold transition disabled:opacity-40 disabled:cursor-not-allowed ${
                      activeStep === 2
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span
                      className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[10px] font-black ${
                        activeStep === 2
                          ? "bg-white text-emerald-700"
                          : hasCrop
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
                            : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                      }`}
                    >
                      {hasCrop ? "✓" : "2"}
                    </span>
                    <span>फसल</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => (hasPhoto || symptomsOnlyMode) && hasCrop && setActiveStep(3)}
                    disabled={(!hasPhoto && !symptomsOnlyMode) || !hasCrop}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-extrabold transition disabled:opacity-40 disabled:cursor-not-allowed ${
                      activeStep === 3
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span
                      className={`flex h-4.5 w-4.5 items-center justify-center rounded-full text-[10px] font-black ${
                        activeStep === 3
                          ? "bg-white text-emerald-700"
                          : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                      }`}
                    >
                      3
                    </span>
                    <span>लक्षण व जाँच</span>
                  </button>
                </nav>

                {/* STEP 1: Photo Upload Only */}
                {activeStep === 1 && (
                  <div className="animate-fade-in space-y-3">
                    <AiDoctorPhotoUpload
                      previewUrl={previewUrl}
                      previewUrl2={previewUrl2}
                      previewFailed={previewFailed}
                      fileName={fileName}
                      onCamera={() => cameraInputRef.current?.click()}
                      onGallery={() => galleryInputRef.current?.click()}
                      onClear={clearPhoto}
                      onAddSecond={() => secondInputRef.current?.click()}
                      onClearSecond={clearSecondPhoto}
                      onNextStep={() => setActiveStep(2)}
                      cameraInput={
                        <input
                          ref={cameraInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleFileSelect}
                          className="sr-only"
                        />
                      }
                      galleryInput={
                        <input
                          ref={galleryInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="sr-only"
                        />
                      }
                      secondInput={
                        <input
                          ref={secondInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleSecondFileSelect}
                          className="sr-only"
                        />
                      }
                    />

                    {!hasPhoto && (
                      <button
                        type="button"
                        onClick={() => {
                          setSymptomsOnlyMode(true);
                          setActiveStep(2);
                        }}
                        className="w-full rounded-xl border border-dashed border-emerald-400/40 bg-emerald-500/5 px-3 py-2 text-center text-xs font-semibold text-emerald-800 transition hover:bg-emerald-500/10 dark:text-emerald-300"
                      >
                        फोटो नहीं है? लक्षणों के आधार पर आगे बढ़ें →
                      </button>
                    )}
                  </div>
                )}

                {/* STEP 2: Crop Select Only */}
                {activeStep === 2 && (
                  <div className="animate-fade-in space-y-3">
                    {/* Compact Step-1 Summary */}
                    <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-50/70 px-3 py-2 text-xs dark:bg-emerald-950/30">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-black text-white">✓</span>
                        <span className="truncate font-semibold text-emerald-900 dark:text-emerald-200">
                          {previewUrl ? "फोटो चुनी गई" : "बिना फोटो (लक्षण आधारित)"}
                        </span>
                        {fileName && <span className="hidden truncate text-[11px] text-emerald-700/70 sm:inline">({fileName})</span>}
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveStep(1)}
                        className="shrink-0 text-xs font-bold text-emerald-700 underline hover:text-emerald-800 dark:text-emerald-300"
                      >
                        फोटो बदलें
                      </button>
                    </div>

                    <AiDoctorCropSelect
                      selectedCrop={selectedCrop}
                      onSelectCrop={handleSelectCrop}
                      onNextStep={() => setActiveStep(3)}
                      onPrevStep={() => setActiveStep(1)}
                    />
                  </div>
                )}

                {/* STEP 3: Symptoms & Diagnosis Only */}
                {activeStep === 3 && (
                  <div className="animate-fade-in space-y-3">
                    {/* Compact Step-1 & 2 Summary */}
                    <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-50/70 px-3 py-2 text-xs dark:bg-emerald-950/30">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-black text-white">✓</span>
                        <span className="truncate font-semibold text-emerald-900 dark:text-emerald-200">
                          {previewUrl ? "फोटो" : "लक्षण"} · {aiDoctorCropLabel(selectedCrop || OTHER_CROP.slug)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveStep(1)}
                          className="text-[11px] font-bold text-emerald-700 underline hover:text-emerald-800 dark:text-emerald-300"
                        >
                          फोटो
                        </button>
                        <span className="text-emerald-400">·</span>
                        <button
                          type="button"
                          onClick={() => setActiveStep(2)}
                          className="text-[11px] font-bold text-emerald-700 underline hover:text-emerald-800 dark:text-emerald-300"
                        >
                          फसल बदलें
                        </button>
                      </div>
                    </div>

                    <AiDoctorSymptoms
                      cropSlug={selectedCrop}
                      value={symptomNotes}
                      onChange={setSymptomNotes}
                      activeChips={activeChips}
                      onToggleChip={handleToggleChip}
                      affectedPart={affectedPart}
                      onSelectPart={setAffectedPart}
                      severityChoice={severityChoice}
                      onSelectSeverity={setSeverityChoice}
                      voiceSlot={
                        <VoiceInput
                          compact
                          onTranscript={(text) =>
                            setSymptomNotes((n) => `${n}${n ? " " : ""}${text}`.slice(0, 300))
                          }
                        />
                      }
                    />

                    <AiDoctorActions
                      canScan={canScan}
                      isScanning={isScanning}
                      hasInput={hasInput}
                      onScan={handleScan}
                      onReset={handleReset}
                      onPrevStep={() => setActiveStep(2)}
                    />
                  </div>
                )}
              </>
            )}

            {/* Scanning In Progress */}
            {isScanning && (
              <div className="rounded-2xl border border-emerald-500/20 bg-white p-6 text-center shadow-sm dark:bg-slate-900 animate-fade-in">
                <Loader2 className="mx-auto h-9 w-9 animate-spin text-emerald-600" />
                <p className="mt-3 text-sm font-bold text-emerald-800 dark:text-emerald-200">
                  एआई डॉक्टर विश्लेषण कर रहा है…
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  रोग पहचान, दवा व सही मात्रा तैयार हो रही है
                </p>
              </div>
            )}

            {result && !isScanning && (() => {
              const kind = guessDiagnosisKind(result, selectedCrop);
              const speechText = buildDiagnosisSpeechText(result);
              const referenceThreat = findReferenceThreat(result.diseaseName, selectedCrop);
              const hasUserPhoto = Boolean(previewUrl);
              const hasSecondPhoto = Boolean(previewUrl2);
              const hasRefPhoto = Boolean(referenceThreat?.image);
              const isHealthy =
                result.diseaseName.includes("स्वस्थ") ||
                result.diseaseName.includes("कोई स्पष्ट समस्या नहीं") ||
                result.diseaseName.toLowerCase().includes("healthy") ||
                result.diseaseName.toLowerCase().includes("no disease") ||
                result.diseaseName.toLowerCase().includes("no problem");

              return (
                <div ref={resultRef} className="rounded-3xl border border-slate-200/70 bg-[#F8F9FA] p-2.5 sm:p-4 dark:border-slate-800/80 dark:bg-slate-950/60 animate-fade-in">
                  <div className="mb-2.5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-sm hover:bg-emerald-50 dark:border-emerald-700/50 dark:bg-slate-900 dark:text-emerald-200 transition"
                    >
                      ← नई फोटो / दूसरी जाँच करें
                    </button>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {aiDoctorCropLabel(selectedCrop || OTHER_CROP.slug)}
                    </span>
                  </div>

                  {/* Card 1: Primary Diagnosis (Compact & Streamlined) */}
                  <div className="mb-2.5 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600">
                          <Stethoscope className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <h2 className="text-[13px] font-extrabold text-slate-900 dark:text-white">
                            {isHealthy ? "जाँच परिणाम: पौधा स्वस्थ है ✓" : "पहचाना गया रोग"}
                          </h2>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <DiagnosisListenButton text={speechText} />
                        <button
                          type="button"
                          onClick={() => {
                            if (!result) return;
                            const meds = result.activeIngredients
                              .map((a) => `• ${a.name} (${formatFarmerDose(a.dose)})`)
                              .join("\n");
                            const msg =
                              `*AgriVeda AI फसल डॉक्टर रिपोर्ट*\n\n` +
                              `*फसल:* ${aiDoctorCropLabel(selectedCrop || OTHER_CROP.slug)}\n` +
                              `*पहचाना गया रोग:* ${result.diseaseName}\n` +
                              (result.pathogen && result.pathogen !== "—" ? `*रोग कारक:* ${result.pathogen}\n` : "") +
                              `*गंभीरता:* ${severityHi(result.severity)}\n\n` +
                              `*अनुशंसित दवा व खुराक:*\n${meds || "विशेषज्ञ सलाह लें"}\n\n` +
                              `*स्प्रे पानी:* 150–200 लीटर/एकड़ साफ़ पानी\n\n` +
                              `_AgriVeda किसान सहायता ऐप_`;
                            const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
                            if (typeof window !== "undefined") window.open(url, "_blank");
                          }}
                          className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-700/50 dark:bg-emerald-950/60 dark:text-emerald-200 transition shrink-0 whitespace-nowrap"
                          title="WhatsApp पर शेयर करें"
                        >
                          <Share2 className="h-3 w-3 shrink-0" />
                          <span className="whitespace-nowrap">शेयर</span>
                        </button>
                      </div>
                    </div>

                    {/* Disease Name & Compact Single-Line Badges (Takes minimal height, removes big severity box) */}
                    <div className="mt-2 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[17px] font-black text-slate-900 dark:text-white sm:text-lg leading-tight">
                          {result.diseaseName}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          {/* Minimal space severity badge ("मध्यम" takes very little space) */}
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                              result.severity?.toLowerCase().includes("high") || result.severity?.includes("गंभीर")
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                                : result.severity?.toLowerCase().includes("low") || result.severity?.includes("कम")
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                result.severity?.toLowerCase().includes("high") || result.severity?.includes("गंभीर")
                                  ? "bg-rose-600 animate-pulse"
                                  : result.severity?.toLowerCase().includes("low") || result.severity?.includes("कम")
                                    ? "bg-emerald-500"
                                    : "bg-amber-500"
                              )}
                            />
                            {severityHi(result.severity)}
                          </span>

                          {/* Compact Crop Stage Card */}
                          {shortenCropStage(result.stage) ? (
                            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-600/20 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-900 dark:border-emerald-700/40 dark:bg-emerald-950/40 dark:text-emerald-200">
                              <Sprout className="h-2.5 w-2.5 text-emerald-600 shrink-0" />
                              <span>{shortenCropStage(result.stage)}</span>
                            </span>
                          ) : null}

                          {result.pathogen && result.pathogen !== "—" ? (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              कारक: <span className="font-semibold text-amber-800 dark:text-amber-300">{result.pathogen}</span>
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Display ONLY the user's uploaded leaf photo (No reference photo box) */}
                      {previewUrl && (
                        <div className="relative h-20 w-20 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-2xl border-2 border-emerald-600/25 bg-black shadow-md">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewUrl}
                            alt="जाँची गई पत्ती"
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] font-black text-white text-center py-0.5">
                            आपकी पत्ती
                          </span>
                        </div>
                      )}
                    </div>

                    {result.visualObservations && (
                      <div className="mt-2 rounded-xl bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800">
                        <span className="font-bold text-slate-900 dark:text-white">लक्षण: </span>
                        <span>{simpleObservation(result.visualObservations)}</span>
                      </div>
                    )}
                  </div>

                  {isHealthy ? (
                    <div className="mb-3 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50/90 via-white to-green-50/70 p-4 text-center shadow-xs dark:border-emerald-500/30 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/20">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <h3 className="mt-2.5 text-[16px] font-black text-emerald-950 dark:text-emerald-100">
                        फसल पूरी तरह स्वस्थ और सुरक्षित है ✓
                      </h3>
                      <p className="mt-1 text-[13px] font-medium leading-relaxed text-emerald-900/90 dark:text-emerald-200">
                        जाँच में कोई कीट या रोग नहीं मिला है। किसी भी रासायनिक या कीटनाशक दवा के छिड़काव की आवश्यकता नहीं है।
                      </p>
                      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={handleReset}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 active:scale-95"
                        >
                          <Camera className="h-4 w-4" />
                          <span>← दूसरी पत्ती / नई जाँच करें</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Card 2: "दवा व अनुशंसित मात्रा" (Medicines & Dosage) */}
                      <div className="mb-3 rounded-2xl border border-emerald-500/30 bg-white p-3.5 shadow-sm dark:border-emerald-500/30 dark:bg-slate-900 sm:p-4">
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-emerald-500/15">
                          <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                              <Pill className="h-4 w-4" />
                            </span>
                            <div>
                              <h3 className="text-sm font-extrabold text-emerald-950 dark:text-emerald-200">
                                दवा व अनुशंसित मात्रा
                              </h3>
                              <p className="text-[10px] text-emerald-800/80 dark:text-emerald-300/80 font-medium">
                                रासायनिक व जैविक उपचार खुराक
                              </p>
                            </div>
                          </div>
                          <span className="rounded-full bg-emerald-600/15 px-2 py-0.5 text-[9.5px] font-black text-emerald-800 dark:text-emerald-300">
                            प्राथमिकता
                          </span>
                        </div>

                        <div className="mt-2.5 space-y-2.5">
                          {result.activeIngredients.length > 0 ? (
                            result.activeIngredients.map((ai, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/40 p-3 dark:border-emerald-700/40 dark:from-emerald-950/40 dark:via-slate-900 dark:to-emerald-950/20 shadow-2xs"
                              >
                                <ChemBottleThumb technical={ai.name} size="sm" className="shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                                    <p className="text-[13px] font-extrabold text-emerald-950 dark:text-emerald-100 break-words min-w-[130px]">
                                      {ai.name}
                                    </p>
                                    <span className="inline-block rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-black text-white whitespace-nowrap shrink-0 shadow-2xs">
                                      {formatFarmerDose(ai.dose)}
                                    </span>
                                  </div>
                                  {ai.brands && ai.brands.length > 0 ? (
                                    <p className="mt-1.5 text-[11.5px] font-medium leading-snug text-slate-600 dark:text-slate-300">
                                      <span className="font-bold text-amber-800 dark:text-amber-400">दुकान पर नाम: </span>
                                      {ai.brands.join(" · ")}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-[var(--av-text-muted)]">
                              {kind === "virus"
                                ? "वायरस की सीधी दवा नहीं — वेक्टर (सफेद मक्खी / थ्रिप्स) नियंत्रण करें व विशेषज्ञ से पूछें।"
                                : "दवा का सुझाव नहीं मिला — विशेषज्ञ से पूछें।"}
                            </p>
                          )}
                        </div>

                        {/* Water and per-acre guidance banner */}
                        <div className="mt-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 p-2 text-[10.5px] font-bold text-amber-900 dark:text-amber-200">
                          💧 1 एकड़ खेत के लिए पानी: अमूमन 150 से 200 लीटर साफ़ पानी में घोल बनाएँ (15 लीटर वाले नैपसैक पंप में 8–10 टंकी प्रति एकड़)। तेज धूप में छिड़काव न करें।
                        </div>

                        {result.spraySticker ? (
                          <div className="mt-2 rounded-xl border border-sky-500/20 bg-sky-50/60 p-2 dark:bg-sky-950/20">
                            <p className="text-[10.5px] font-bold text-sky-800 dark:text-sky-300">स्प्रे स्टिकर (चिपकाने वाला घोल)</p>
                            <p className="mt-0.5 text-xs text-sky-900 dark:text-sky-200">
                              सिलिकॉन आधारित चिपको {formatFarmerDose(result.spraySticker)}
                            </p>
                          </div>
                        ) : (
                          <div className="mt-2 rounded-xl border border-sky-500/20 bg-sky-50/60 p-2 dark:bg-sky-950/20">
                            <p className="text-[10.5px] font-bold text-sky-800 dark:text-sky-300">स्प्रे स्टिकर (चिपकाने वाला घोल)</p>
                            <p className="mt-0.5 text-xs text-sky-900 dark:text-sky-200">
                              सिलिकॉन आधारित चिपको 0.5 मिली प्रति लीटर पानी में मिलाएँ।
                            </p>
                          </div>
                        )}

                        {result.recoveryTonics && result.recoveryTonics.length > 0 ? (
                          <div className="mt-2 rounded-xl border border-amber-500/25 bg-amber-50/60 p-2.5 dark:bg-amber-950/20">
                            <p className="text-[11px] font-bold text-amber-900 dark:text-amber-200">रिकवरी टॉनिक</p>
                            <ul className="mt-1 space-y-0.5 text-xs text-amber-900 dark:text-amber-300">
                              {result.recoveryTonics.map((tonic, i) => (
                                <li key={i}>• {formatFarmerDose(tonic)}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        <p className="mt-2 text-[10.5px] text-[var(--av-text-muted)]">
                          ⚠️ दवा लगाते समय सुरक्षा किट पहनें व कंपनी का लेबल ध्यानपूर्वक पढ़ें।
                        </p>
                      </div>

                      {/* Card 3: "समाधान" (Field Management & Cultural Actions) */}
                      <div className="mb-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4">
                        <div className="flex items-center gap-2 pb-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                            <Leaf className="h-4 w-4" />
                          </span>
                          <div>
                            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">खेत प्रबंधन व उपाय (समाधान)</h3>
                            <p className="text-[10px] text-[var(--av-text-muted)]">खेत में करने योग्य प्राथमिक उपाय</p>
                          </div>
                        </div>
                        {result.treatments.length > 0 ? (
                          <ul className="mt-1 space-y-1.5">
                            {result.treatments.map((t, i) => (
                              <li key={i} className="rounded-xl border border-emerald-500/15 bg-emerald-50/40 p-2 text-xs font-medium leading-relaxed text-slate-800 dark:bg-emerald-950/20 dark:text-slate-200">
                                • {formatFarmerDose(t)}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-1 text-xs text-[var(--av-text-muted)]">
                            खेत के कदम नहीं मिले — ऊपर दवा सेक्शन देखें।
                          </p>
                        )}
                      </div>

                      {/* Card 4: "यह क्यों हुआ?" (Causes & Why It Happens — Collapsible) */}
                      <div className="mb-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4">
                        <button
                          type="button"
                          onClick={() => setShowWhy(!showWhy)}
                          className="flex w-full items-center justify-between text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                              <ShieldCheck className="h-4 w-4" />
                            </span>
                            <div>
                              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">यह क्यों हुआ? (कारण)</h3>
                              <p className="text-[10px] text-[var(--av-text-muted)]">रोग फैलने के कारण व अनुकूल मौसम</p>
                            </div>
                          </div>
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {showWhy ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </span>
                        </button>
                        {showWhy && (
                          <ul className="mt-2.5 space-y-1.5 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                            {[
                              ...result.whyItHappens,
                              ...result.environmentalFactors,
                            ]
                              .map((w) => w.trim())
                              .filter(Boolean)
                              .map((w, i) => (
                                <li key={i} className="rounded-xl bg-slate-50 p-2 text-xs font-medium leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                                  • {w}
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>
                    </>
                  )}

                  {/* Card 5: Next Steps & Expert Referral */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:border-slate-800 dark:bg-slate-900 sm:p-5">
                    <button
                      type="button"
                      disabled={referringExpert}
                      onClick={async () => {
                        if (!result || referringExpert) return;
                        setReferringExpert(true);
                        try {
                          const slug = selectedCrop || OTHER_CROP.slug;
                          const cropName = aiDoctorCropLabel(slug);

                          let photoRaw: string | null = null;
                          if (previewUrl?.startsWith("data:")) {
                            photoRaw = previewUrl;
                          } else if (previewUrl) {
                            photoRaw = await urlToDataUrl(previewUrl);
                          } else if (selectedFile) {
                            photoRaw = await new Promise((resolve) => {
                              const reader = new FileReader();
                              reader.onload = () => resolve(String(reader.result));
                              reader.onerror = () => resolve(null);
                              reader.readAsDataURL(selectedFile);
                            });
                          }
                          const photoDataUrl = photoRaw
                            ? await compressPhotoForReferral(photoRaw)
                            : null;

                          saveAiDoctorExpertReferral({
                            cropSlug: slug,
                            cropName,
                            photoDataUrl,
                            result,
                            createdAt: new Date().toISOString(),
                          });
                          router.push("/ask-query?from=ai-doctor");
                        } finally {
                          setReferringExpert(false);
                        }
                      }}
                      className="flex w-full min-h-[50px] items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 py-3 text-center text-sm font-extrabold text-white shadow-md shadow-emerald-700/25 transition disabled:opacity-60"
                    >
                      {referringExpert ? "खोल रहे हैं…" : "विशेषज्ञ से और सलाह लें →"}
                    </button>

                    <div className="mt-3.5">
                      <ShareOutbreakPrompt result={result} cropSlug={selectedCrop} photoUrl={previewUrl} />
                    </div>
                  </div>
                </div>
              );
            })()}

            <AiDoctorRecentDiagnoses
              history={history}
              onOpenEntry={openHistoryEntry}
              expanded={historyExpanded}
              onClear={history.length ? clearHistory : undefined}
            />
          </div>

          <div className="hidden lg:block">
            <AiDoctorDesktopSidebar />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
