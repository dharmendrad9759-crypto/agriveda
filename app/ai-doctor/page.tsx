"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Leaf,
  Loader2,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import {
  analyzeDiagnosis,
  analyzePlantImage,
  checkAiDoctorConfigured,
  type DiagnosisResult,
} from "@/lib/aiDiagnosis";
import ShareOutbreakPrompt from "@/components/outbreak-radar/ShareOutbreakPrompt";
import { useAIHistory } from "@/hooks/useAIHistory";
import { useToast } from "@/components/ui/Toast";
import {
  claimPendingAiScan,
  dataUrlToFile,
  releasePendingScanLock,
} from "@/lib/pendingAiScan";
import {
  AiDoctorActions,
  AiDoctorCropSelect,
  AiDoctorDesktopSidebar,
  AiDoctorHero,
  AiDoctorPhotoUpload,
  AiDoctorRecentDiagnoses,
  AiDoctorRiskForecast,
  AiDoctorSymptoms,
} from "@/components/ai-doctor/AiDoctorRedesign";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import VoiceInput from "@/components/query/VoiceInput";
import { OTHER_CROP } from "@/data/ai-doctor-crops";
import { useNetworkStatus, withSlowGuard } from "@/hooks/useNetworkStatus";
import {
  ErrorState,
  OfflineState,
  PermissionDeniedState,
  SlowNetworkState,
  SuccessBanner,
  ValidationHint,
} from "@/components/ui/UiStates";
import { openAppLocationPermissionSettings } from "@/lib/openLocationSettings";

export default function AIDoctorPage() {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const { addEntry, history, clearHistory } = useAIHistory();
  const { showToast } = useToast();
  const { online, slow, setSlow } = useNetworkStatus(10000);

  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showWhy, setShowWhy] = useState(true);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [symptomNotes, setSymptomNotes] = useState("");
  const [activeChips, setActiveChips] = useState<string[]>([]);
  /** Allow crop → symptoms without a photo (optional escape hatch) */
  const [symptomsOnlyMode, setSymptomsOnlyMode] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [validationHint, setValidationHint] = useState<string | null>(null);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const hasPhoto = Boolean(selectedFile || previewUrl);
  const hasCrop = Boolean(selectedCrop);
  const showCropStep = hasPhoto || symptomsOnlyMode;
  const showSymptomStep = showCropStep && hasCrop;
  const hasSymptoms = symptomNotes.trim().length > 0;
  const canScan =
    ((hasPhoto && hasCrop) || (symptomsOnlyMode && hasCrop && hasSymptoms)) &&
    !isScanning &&
    aiConfigured !== false &&
    online;
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
              showToast("Gemini AI analysis complete ✓");
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
    if (!file) {
      // User cancelled OR permission blocked — show camera help if no photo yet
      if (!selectedFile && !previewUrl) {
        setCameraPermissionDenied(true);
        setValidationHint("फोटो नहीं मिली — Camera अनुमति चेक करें या Gallery से चुनें।");
      }
      return;
    }
    if (!file.type.startsWith("image/")) {
      setValidationHint("सिर्फ़ image file चुनें (JPG / PNG)");
      showToast("सिर्फ़ image file चुनें", "error");
      return;
    }
    setCameraPermissionDenied(false);
    setValidationHint(null);
    setScanError(null);
    setFileName(file.name);
    setSelectedFile(file);
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setPreviewFailed(false);
    setResult(null);
    setSuccessMsg(null);
    setSymptomsOnlyMode(false);
    showToast("फोटो चुनी — अब फसल चुनें", "success");
  };

  const clearPhoto = () => {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewFailed(false);
    setSelectedFile(null);
    setFileName("");
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
    if (!symptomsOnlyMode) {
      setSelectedCrop("");
      setSymptomNotes("");
      setActiveChips([]);
    }
  };

  const handleScan = async () => {
    setValidationHint(null);
    setScanError(null);
    setSuccessMsg(null);

    if (!online) {
      setScanError("इंटरनेट नहीं है — AI diagnosis के लिए नेट ज़रूरी है।");
      return;
    }
    if (!selectedCrop) {
      setValidationHint("पहले फसल चुनें");
      showToast("पहले फसल चुनें", "error");
      return;
    }
    if (!selectedFile && !hasSymptoms) {
      setValidationHint("फोटो चुनें या लक्षण लिखें");
      showToast("फोटो चुनें या लक्षण लिखें", "error");
      return;
    }
    setIsScanning(true);

    try {
      const diagnosis = await withSlowGuard(
        () =>
          analyzeDiagnosis({
            imageFile: selectedFile,
            cropSlug: selectedCrop || OTHER_CROP.slug,
            symptoms: symptomNotes,
          }),
        setSlow,
        10000
      );
      setResult(diagnosis);
      addEntry({
        fileName: selectedFile ? fileName || "scan.jpg" : "symptoms.txt",
        thumbnailUrl: previewUrl || "",
        result: diagnosis,
      });
      setSuccessMsg(`${diagnosis.diseaseName} — confidence ${diagnosis.confidence}%`);
      showToast("Gemini AI विश्लेषण पूर्ण ✓");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "विश्लेषण विफल";
      setScanError(msg);
      showToast(msg, "error");
    } finally {
      setIsScanning(false);
      setSlow(false);
    }
  };

  const handleReset = () => {
    clearPhoto();
    setResult(null);
    setSymptomNotes("");
    setActiveChips([]);
    setSelectedCrop("");
    setSymptomsOnlyMode(false);
    setScanError(null);
    setValidationHint(null);
    setCameraPermissionDenied(false);
    setSuccessMsg(null);
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
    <AppShell className="ai-doctor-page" breadcrumbs={[{ label: "Home", href: "/" }, { label: "AI Doctor" }]}>
      <div className="mx-auto w-full max-w-lg space-y-3.5 sm:max-w-none sm:space-y-5">
        <AiDoctorHero
          aiConfigured={aiConfigured}
          onHistoryClick={scrollToHistory}
          historyCount={history.length}
        />

        {!online && (
          <OfflineState
            title="इंटरनेट नहीं है"
            description="AI Doctor diagnosis के लिए नेट ज़रूरी है। डेटा ON करके फिर कोशिश करें।"
            onRetry={handleScan}
          />
        )}

        {cameraPermissionDenied && (
          <PermissionDeniedState
            kind="camera"
            onOpenSettings={() => void openAppLocationPermissionSettings()}
            onRetry={() => {
              setCameraPermissionDenied(false);
              cameraInputRef.current?.click();
            }}
          />
        )}

        {validationHint && <ValidationHint message={validationHint} />}

        {isScanning && slow && (
          <SlowNetworkState
            title="AI diagnosis में देर हो रही है"
            description="फोटो विश्लेषण में 15–30 सेकंड लग सकते हैं — कृपया रुकें।"
          />
        )}

        {scanError && !isScanning && (
          <ErrorState
            title="Diagnosis असफल"
            description={scanError}
            onRetry={handleScan}
            actionLabel="फिर से diagnosis"
          />
        )}

        {successMsg && result && !isScanning && <SuccessBanner message={successMsg} />}

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
              previewFailed={previewFailed}
              fileName={fileName}
              onCamera={() => cameraInputRef.current?.click()}
              onGallery={() => galleryInputRef.current?.click()}
              onClear={clearPhoto}
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
            />

            {!showCropStep && (
              <button
                type="button"
                onClick={() => setSymptomsOnlyMode(true)}
                className="w-full rounded-xl border border-dashed border-emerald-400/40 bg-emerald-500/5 px-3 py-2.5 text-center text-xs font-semibold text-emerald-800 dark:text-emerald-300"
              >
                फोटो नहीं है? सिर्फ़ लक्षण से आगे बढ़ें →
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
                <h2 className="text-[15px] font-bold text-[var(--av-text-primary)]">Diagnosis</h2>
              </div>

              {isScanning && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 py-10 text-center dark:bg-emerald-950/20 sm:py-12">
                  <Loader2 className="mx-auto h-9 w-9 animate-spin text-emerald-500 sm:h-10 sm:w-10" />
                  <p className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Diagnosis taiyar ho raha hai…
                  </p>
                </div>
              )}

              {!isScanning && !result && (
                <div className="rounded-2xl border border-dashed border-[var(--av-border)] bg-[var(--av-surface-inset)] py-10 text-center sm:py-12">
                  <Stethoscope className="mx-auto h-9 w-9 text-[var(--av-text-muted)] sm:h-10 sm:w-10" />
                  <p className="mt-3 text-sm font-semibold text-[var(--av-text-muted)]">
                    Result yahan dikhega
                  </p>
                </div>
              )}

              {result && !isScanning && (
                <div className="space-y-3.5 animate-fade-in sm:space-y-4">
                  {result.source === "gemini" && (
                    <p className="rounded-xl bg-sky-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                      ✓ Google Gemini
                      {previewUrl ? " — photo analysis" : " — symptoms analysis"}
                    </p>
                  )}

                  {result.visualObservations && (
                    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3">
                      <p className="text-[10px] font-bold uppercase text-sky-700 dark:text-sky-300">
                        {previewUrl ? "Photo mein kya dikha" : "Symptoms summary"}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--av-text-primary)]">
                        {result.visualObservations}
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

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-[var(--av-surface-inset)] p-2 sm:p-2.5">
                      <p className="text-[10px] text-[var(--av-text-muted)]">Confidence</p>
                      <p className="font-black text-[var(--av-text-primary)]">{result.confidence}%</p>
                    </div>
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
                      Treatment
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--av-text-muted)]">
                      {result.treatments.map((t, i) => (
                        <li key={i}>• {t}</li>
                      ))}
                    </ul>
                    <div className="mt-3 space-y-2">
                      {result.activeIngredients.map((ai, i) => (
                        <div key={i} className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs">
                          <span className="font-bold text-emerald-700 dark:text-emerald-300">{ai.name}</span>
                          <span className="text-[var(--av-text-muted)]">
                            {" "}
                            — {ai.dose} ({ai.fracIrac})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/ask-query"
                    className="block min-h-[48px] rounded-xl bg-emerald-700 py-3.5 text-center text-sm font-bold text-white shadow-md shadow-emerald-700/20"
                  >
                    विशेषज्ञ से पुष्टि करें →
                  </Link>

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

            <div className="space-y-3.5 sm:space-y-5 lg:hidden">
              <AiDoctorRiskForecast />
            </div>
          </div>

          <div className="hidden lg:block">
            <AiDoctorDesktopSidebar />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
