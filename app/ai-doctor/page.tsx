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
  compressPhotoForReferral,
  saveAiDoctorExpertReferral,
  urlToDataUrl,
} from "@/lib/aiDoctorExpertReferral";
import { fileToHistoryThumb, srcToHistoryThumb } from "@/lib/aiHistoryThumb";
import { formatFarmerDose } from "@/lib/units/farmerDose";
import { track } from "@/lib/analytics";
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
    setResult(entry.result);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) {
      showToast("सिर्फ़ image file चुनें", "error");
      return;
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
      addEntry({
        fileName: selectedFile ? fileName || "scan.jpg" : "symptoms.txt",
        thumbnailUrl: thumb,
        result: diagnosis,
      });
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

        <div
          role="note"
          className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-3 text-[12px] leading-snug text-amber-950 dark:text-amber-100"
        >
          <p className="font-bold">दवा लगाते समय</p>
          <p className="mt-1 text-[11px] font-medium opacity-90">
            दवा का लेबल पढ़ें और कृषि अधिकारी / कृषि विज्ञान केंद्र की सलाह मानें।
          </p>
        </div>

        <div className="grid gap-3.5 sm:gap-5 lg:grid-cols-3">
          <div id="ai-doctor-scan" className="min-w-0 space-y-3.5 sm:space-y-5 lg:col-span-2">
            {/* Step progress: Photo → Crop → Symptoms */}
            <div className="flex items-center gap-1.5 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2.5 text-[11px] font-bold">
              {[
                { n: 1, label: "फोटो", done: hasPhoto || symptomsOnlyMode },
                { n: 2, label: "फसल", done: hasCrop },
                { n: 3, label: "लक्षण", done: showSymptomStep && (hasSymptoms || hasPhoto) },
              ].map((s, i) => (
                <div key={s.n} className="flex min-w-0 flex-1 items-center gap-1.5">
                  {i > 0 && (
                    <span
                      className={`h-0.5 w-3 shrink-0 rounded-full sm:w-5 ${
                        s.done || (i === 1 && showCropStep) || (i === 2 && showSymptomStep)
                          ? "bg-emerald-400"
                          : "bg-[var(--av-border)]"
                      }`}
                    />
                  )}
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] ${
                      s.done
                        ? "bg-emerald-600 text-white"
                        : (i === 0 && !showCropStep) ||
                            (i === 1 && showCropStep && !hasCrop) ||
                            (i === 2 && showSymptomStep)
                          ? "bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500/40 dark:bg-emerald-950 dark:text-emerald-200"
                          : "bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]"
                    }`}
                  >
                    {s.n}
                  </span>
                  <span
                    className={`truncate ${
                      s.done || (i === 0 && !showCropStep) || (i === 1 && showCropStep && !hasCrop) || (i === 2 && showSymptomStep)
                        ? "text-[var(--av-text-primary)]"
                        : "text-[var(--av-text-muted)]"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* 1 — Photo first */}
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

            {!showCropStep && (
              <button
                type="button"
                onClick={() => setSymptomsOnlyMode(true)}
                className="w-full rounded-xl border border-dashed border-emerald-400/40 bg-emerald-500/5 px-3 py-2.5 text-center text-xs font-semibold text-emerald-800 dark:text-emerald-300"
              >
                फोटो नहीं है? लक्षणों के आधार पर आगे बढ़ें →
              </button>
            )}

            {/* 2 — Crop after photo */}
            {showCropStep && (
              <div className="animate-fade-in">
                <AiDoctorCropSelect selectedCrop={selectedCrop} onSelectCrop={handleSelectCrop} />
              </div>
            )}

            {/* 3 — Symptoms after crop */}
            {showSymptomStep && (
              <div className="animate-fade-in space-y-3.5 sm:space-y-5">
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
                />
              </div>
            )}

            {showCropStep && !hasCrop && (
              <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-center text-xs font-semibold text-amber-800 dark:text-amber-200">
                अगला कदम: ऊपर से फसल चुनें
              </p>
            )}

            <DarkCard className="!p-3.5 sm:!p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                  <Stethoscope className="h-4 w-4" />
                </span>
                <h2 className="text-[15px] font-bold text-[var(--av-text-primary)]">जांचें</h2>
              </div>

              {isScanning && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 py-10 text-center dark:bg-emerald-950/20 sm:py-12">
                  <Loader2 className="mx-auto h-9 w-9 animate-spin text-emerald-500 sm:h-10 sm:w-10" />
                  <p className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    जांच परिणाम तैयार हो रहा है…
                  </p>
                </div>
              )}

              {!isScanning && !result && (
                <div className="rounded-2xl border border-dashed border-[var(--av-border)] bg-[var(--av-surface-inset)] py-10 text-center sm:py-12">
                  <Stethoscope className="mx-auto h-9 w-9 text-[var(--av-text-muted)] sm:h-10 sm:w-10" />
                  <p className="mt-3 text-sm font-semibold text-[var(--av-text-muted)]">
                    परिणाम यहाँ दिखेगा
                  </p>
                </div>
              )}

              {result && !isScanning && (
                <div className="space-y-3.5 animate-fade-in sm:space-y-4">
                  {result.visualObservations && (
                    <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3.5 py-3">
                      <p className="text-[11px] font-bold text-[var(--av-text-secondary)]">
                        {previewUrl ? "फोटो में क्या दिखा" : "लक्षण सार"}
                      </p>
                      <p className="mt-1.5 text-[13px] leading-snug text-[var(--av-text-primary)]">
                        {simpleObservation(result.visualObservations)}
                      </p>
                    </div>
                  )}

                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3.5 sm:p-4">
                    <p className="text-xs font-bold text-red-500">{result.riskLevel}</p>
                    <h3 className="text-xl font-black text-[var(--av-text-primary)] sm:text-2xl">
                      {result.diseaseName}
                    </h3>
                    <p className="text-sm text-[var(--av-text-muted)]">
                      Pathogen: <span className="font-semibold text-amber-600">{result.pathogen}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-xl bg-[var(--av-surface-inset)] p-2 sm:p-2.5">
                      <p className="text-[10px] text-[var(--av-text-muted)]">Severity</p>
                      <p className="font-black text-red-500">{result.severity}</p>
                    </div>
                    <div className="rounded-xl bg-[var(--av-surface-inset)] p-2 sm:p-2.5">
                      <p className="text-[10px] text-[var(--av-text-muted)]">Stage</p>
                      <p className="font-black text-[var(--av-text-primary)]">{result.stage}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowWhy(!showWhy)}
                    className="flex w-full min-h-[48px] items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-left"
                  >
                    <span className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck className="h-4 w-4" />
                      यह क्यों हुआ?
                    </span>
                    {showWhy ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {showWhy && (
                    <ul className="space-y-2 text-sm text-[var(--av-text-muted)]">
                      {result.whyItHappens.map((w, i) => (
                        <li key={i} className="rounded-lg bg-[var(--av-surface-inset)] p-2">
                          • {w}
                        </li>
                      ))}
                      <li className="text-xs font-semibold text-sky-600">
                        मौसम: {result.environmentalFactors.join(" • ")}
                      </li>
                    </ul>
                  )}

                  <div className="rounded-xl border border-[var(--av-border)] p-3.5 sm:p-4">
                    <p className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                      <Leaf className="h-4 w-4" />
                      इलाज / Treatment
                    </p>
                    {result.treatments.length > 0 ? (
                      <ul className="mt-2 space-y-1 text-sm text-[var(--av-text-muted)]">
                        {result.treatments.map((t, i) => (
                          <li key={i}>• {formatFarmerDose(t)}</li>
                        ))}
                      </ul>
                    ) : null}

                    <div className="mt-3">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                        दवा (Medicines)
                      </p>
                      <div className="mt-2 space-y-2">
                        {result.activeIngredients.length > 0 ? (
                          result.activeIngredients.map((ai, i) => (
                            <div key={i} className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs">
                              <span className="font-bold text-emerald-700 dark:text-emerald-300">
                                {ai.name}
                              </span>
                              <span className="text-[var(--av-text-muted)]">
                                {" "}
                                — {formatFarmerDose(ai.dose)}
                              </span>
                              {ai.fracIrac && ai.fracIrac !== "—" ? (
                                <span className="mt-0.5 block text-[10px] text-[var(--av-text-muted)]">
                                  {ai.fracIrac}
                                </span>
                              ) : null}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-[var(--av-text-muted)]">
                            दवा का सुझाव नहीं मिला — विशेषज्ञ से पूछें।
                          </p>
                        )}
                      </div>
                    </div>

                    {result.spraySticker ? (
                      <div className="mt-3 rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-2">
                        <p className="text-[11px] font-bold text-sky-800 dark:text-sky-200">
                          स्प्रे स्टिकर
                        </p>
                        <p className="mt-1 text-xs text-[var(--av-text-secondary)]">
                          {formatFarmerDose(result.spraySticker)}
                        </p>
                      </div>
                    ) : null}

                    {result.recoveryTonics && result.recoveryTonics.length > 0 ? (
                      <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2">
                        <p className="text-[11px] font-bold text-amber-900 dark:text-amber-200">
                          रोग रिकवरी टॉनिक
                        </p>
                        <ul className="mt-1 space-y-1 text-xs text-[var(--av-text-secondary)]">
                          {result.recoveryTonics.map((tonic, i) => (
                            <li key={i}>• {formatFarmerDose(tonic)}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    <p className="mt-3 text-[10px] leading-snug text-[var(--av-text-muted)]">
                      दवा लगाते समय लेबल और स्थानीय कृषि अधिकारी की सलाह मानें।
                    </p>
                  </div>

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
                    className="block w-full min-h-[48px] rounded-xl bg-emerald-700 py-3.5 text-center text-sm font-bold text-white shadow-md shadow-emerald-700/20 disabled:opacity-60"
                  >
                    {referringExpert ? "खोल रहे हैं…" : "विशेषज्ञ से और सलाह लें →"}
                  </button>

                  <ShareOutbreakPrompt result={result} cropSlug={selectedCrop} photoUrl={previewUrl} />
                </div>
              )}
            </DarkCard>

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
