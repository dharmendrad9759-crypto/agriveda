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
    ChevronDown,
    ChevronUp,
    Leaf,
    Loader2,
    Pill,
    ShieldCheck,
    Stethoscope,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";

/** Keep photo notes farmer-simple — drop English (jargon) parentheses. */
function simpleObservation(text: string): string {
  return text
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export default function AIDoctorPage() {
  const router = useRouter();
  const { t } = useLocale();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const secondInputRef = useRef<HTMLInputElement>(null);
  const { addEntry, history, clearHistory } = useAIHistory();
  const { showToast } = useToast();
  const [referringExpert, setReferringExpert] = useState(false);

  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewUrl2, setPreviewUrl2] = useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showWhy, setShowWhy] = useState(true);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [symptomNotes, setSymptomNotes] = useState("");
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
    showToast("फोटो 1 चुनी — चाहें तो दूसरी भी जोड़ें", "success");
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
      const diagnosis = await analyzeDiagnosis({
        imageFile: selectedFile,
        imageFile2: selectedFile2,
        cropSlug: selectedCrop || OTHER_CROP.slug,
        symptoms: symptomNotes,
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
                    <span>1. फोटो</span>
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
                    <span>2. फसल</span>
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
                    <span>3. लक्षण व जाँच</span>
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
                          {previewUrl ? "📷 फोटो" : "📝 लक्षण"} · 🌾 {aiDoctorCropLabel(selectedCrop || OTHER_CROP.slug)}
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
              return (
                <div className="rounded-3xl border border-slate-200/70 bg-[#F8F9FA] p-3 sm:p-4 dark:border-slate-800/80 dark:bg-slate-950/60 animate-fade-in">
                  <div className="mb-3 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-sm hover:bg-emerald-50 dark:border-emerald-700/50 dark:bg-slate-900 dark:text-emerald-200 transition"
                    >
                      ← नई फोटो / दूसरी जाँच करें
                    </button>
                    <span className="text-[11px] font-semibold text-slate-500">
                      🌾 {aiDoctorCropLabel(selectedCrop || OTHER_CROP.slug)}
                    </span>
                  </div>
                  {/* Card 1: Primary Diagnosis & Observations */}
                  <div className="mb-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:border-slate-800 dark:bg-slate-900 sm:p-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                          <Stethoscope className="h-4 w-4" />
                        </span>
                        <div>
                          <h2 className="text-[15px] font-extrabold text-slate-900 dark:text-white">रोग पहचान रिपोर्ट</h2>
                          <p className="text-[11px] text-[var(--av-text-muted)]">एआई डॉक्टर विश्लेषण</p>
                        </div>
                      </div>
                      <DiagnosisListenButton text={speechText} />
                    </div>

                    {result.visualObservations && (
                      <div className="mt-3.5 rounded-xl border border-slate-200/70 bg-slate-50/80 px-3.5 py-3 dark:border-slate-800 dark:bg-slate-800/50">
                        <p className="text-[11px] font-bold text-[var(--av-text-secondary)]">
                          {previewUrl ? "फोटो में क्या दिखा:" : "समस्या क्या दिखी:"}
                        </p>
                        <p className="mt-1 text-[13px] leading-relaxed text-slate-800 dark:text-slate-200">
                          {simpleObservation(result.visualObservations)}
                        </p>
                      </div>
                    )}

                    <div className="mt-3.5 rounded-2xl border border-rose-500/20 bg-rose-50/60 p-4 dark:bg-rose-950/20 sm:p-4.5">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-extrabold text-rose-800 dark:bg-rose-900/50 dark:text-rose-300">
                        {likelyThreatLabel(kind)}
                      </div>
                      <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
                        {result.diseaseName}
                      </h3>
                      {result.pathogen && result.pathogen !== "—" ? (
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                          कारण: <span className="font-semibold text-amber-700 dark:text-amber-300">{result.pathogen}</span>
                        </p>
                      ) : null}
                      {result.riskLevel && result.riskLevel !== "—" ? (
                        <p className="mt-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                          खतरा स्तर: {result.riskLevel}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-3.5 grid grid-cols-2 gap-2.5 text-center">
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/50">
                        <p className="text-[11px] font-medium text-[var(--av-text-muted)]">गंभीरता (Severity)</p>
                        <p className="mt-0.5 font-black text-rose-600 dark:text-rose-400">{severityHi(result.severity)}</p>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/50">
                        <p className="text-[11px] font-medium text-[var(--av-text-muted)]">फसल अवस्था (Stage)</p>
                        <p className="mt-0.5 font-black text-slate-900 dark:text-white">{result.stage}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: "यह क्यों हुआ?" (Causes & Why It Happens) */}
                  <div className="mb-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:border-slate-800 dark:bg-slate-900 sm:p-5">
                    <button
                      type="button"
                      onClick={() => setShowWhy(!showWhy)}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                          <ShieldCheck className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">यह क्यों हुआ?</h3>
                          <p className="text-[11px] text-[var(--av-text-muted)]">रोग फैलने के कारण व अनुकूल मौसम</p>
                        </div>
                      </div>
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {showWhy ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </span>
                    </button>
                    {showWhy && (
                      <ul className="mt-3.5 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                        {[
                          ...result.whyItHappens,
                          ...result.environmentalFactors,
                        ]
                          .map((w) => w.trim())
                          .filter(Boolean)
                          .map((w, i) => (
                            <li key={i} className="rounded-xl bg-slate-50 p-2.5 text-xs font-medium leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                              • {w}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>

                  {/* Card 3: "समाधान" (Field Management & Cultural Actions) */}
                  <div className="mb-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:border-slate-800 dark:bg-slate-900 sm:p-5">
                    <div className="flex items-center gap-2.5 pb-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                        <Leaf className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">समाधान</h3>
                        <p className="text-[11px] text-[var(--av-text-muted)]">खेत में करने योग्य प्राथमिक उपाय</p>
                      </div>
                    </div>
                    {result.treatments.length > 0 ? (
                      <ul className="mt-2 space-y-2">
                        {result.treatments.map((t, i) => (
                          <li key={i} className="rounded-xl border border-emerald-500/15 bg-emerald-50/40 p-2.5 text-xs font-medium leading-relaxed text-slate-800 dark:bg-emerald-950/20 dark:text-slate-200">
                            • {formatFarmerDose(t)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-[var(--av-text-muted)]">
                        खेत के कदम नहीं मिले — नीचे दवा सेक्शन देखें।
                      </p>
                    )}
                  </div>

                  {/* Card 4: "दवा व अनुशंसित मात्रा" (Medicines & Dosage) */}
                  <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:border-emerald-500/30 dark:bg-slate-900 sm:p-5">
                    <div className="flex items-center gap-2.5 pb-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white">
                        <Pill className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <h3 className="text-sm font-extrabold text-emerald-900 dark:text-emerald-300">दवा व अनुशंसित मात्रा</h3>
                        <p className="text-[11px] text-[var(--av-text-muted)]">रासायनिक व जैविक उपचार खुराक</p>
                      </div>
                    </div>

                    <div className="mt-2.5 space-y-2.5">
                      {result.activeIngredients.length > 0 ? (
                        result.activeIngredients.map((ai, i) => (
                          <div key={i} className="rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-3 dark:bg-emerald-950/30">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                                {ai.name}
                              </p>
                              <span className="shrink-0 rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-extrabold text-white">
                                {formatFarmerDose(ai.dose)}
                              </span>
                            </div>
                            {ai.brands && ai.brands.length > 0 ? (
                              <p className="mt-1.5 text-[11px] font-medium leading-snug text-slate-600 dark:text-slate-300">
                                <span className="font-semibold text-amber-800 dark:text-amber-400">बाज़ार में: </span>
                                {ai.brands.join(" · ")}
                              </p>
                            ) : null}
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

                    {result.spraySticker ? (
                      <div className="mt-3 rounded-xl border border-sky-500/20 bg-sky-50/60 p-2.5 dark:bg-sky-950/20">
                        <p className="text-[11px] font-bold text-sky-800 dark:text-sky-300">स्प्रे स्टिकर (चिपकाने वाला घोल)</p>
                        <p className="mt-0.5 text-xs text-sky-900 dark:text-sky-200">
                          {formatFarmerDose(result.spraySticker)}
                        </p>
                      </div>
                    ) : null}

                    {result.recoveryTonics && result.recoveryTonics.length > 0 ? (
                      <div className="mt-3 rounded-xl border border-amber-500/25 bg-amber-50/60 p-3 dark:bg-amber-950/20">
                        <p className="text-xs font-bold text-amber-900 dark:text-amber-200">रिकवरी टॉनिक</p>
                        <p className="mt-0.5 text-[10.5px] text-[var(--av-text-muted)]">
                          {kind === "virus"
                            ? "वायरस के बाद पौधा मज़बूत करने के लिए (वायरस की दवा नहीं)"
                            : "रोग के बाद पौधा मज़बूत करने के लिए"}
                        </p>
                        <ul className="mt-1.5 space-y-1 text-xs text-amber-900 dark:text-amber-300">
                          {result.recoveryTonics.map((tonic, i) => (
                            <li key={i}>• {formatFarmerDose(tonic)}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    <p className="mt-3 text-[10.5px] leading-snug text-[var(--av-text-muted)]">
                      ⚠️ दवा लगाते समय सुरक्षा किट पहनें व कंपनी का लेबल ध्यानपूर्वक पढ़ें।
                    </p>
                  </div>

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
