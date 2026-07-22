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
import { analyzePlantImage, checkAiDoctorConfigured, type DiagnosisResult } from "@/lib/aiDiagnosis";
import ShareOutbreakPrompt from "@/components/outbreak-radar/ShareOutbreakPrompt";
import { useAIHistory } from "@/hooks/useAIHistory";
import { useToast } from "@/components/ui/Toast";
import { isOtherCrop } from "@/data/ai-doctor-crops";
import {
  claimPendingAiScan,
  dataUrlToFile,
  releasePendingScanLock,
} from "@/lib/pendingAiScan";
import {
  AiDoctorActions,
  AiDoctorAskExpert,
  AiDoctorCropSelect,
  AiDoctorDesktopSidebar,
  AiDoctorHero,
  AiDoctorPhotoUpload,
  AiDoctorRecentDiagnoses,
  AiDoctorRiskForecast,
  AiDoctorSymptoms,
  AiDoctorTipsHelpline,
} from "@/components/ai-doctor/AiDoctorRedesign";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import VoiceInput from "@/components/query/VoiceInput";

const SCAN_STEPS = [
  "Gemini AI photo dekh raha hai...",
  "Patti / daag / rang pattern check...",
  "Kisan ke liye diagnosis likh raha hai...",
  "Upchar aur dose taiyar...",
];

export default function AIDoctorPage() {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const { addEntry, history, clearHistory } = useAIHistory();
  const { showToast } = useToast();

  const [selectedCrop, setSelectedCrop] = useState("tomato");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showWhy, setShowWhy] = useState(true);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [symptomNotes, setSymptomNotes] = useState("");
  const [activeChips, setActiveChips] = useState<string[]>([]);

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
          setScanStep(0);
          const stepInterval = setInterval(() => {
            setScanStep((s) => Math.min(s + 1, SCAN_STEPS.length - 1));
          }, 900);
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
            clearInterval(stepInterval);
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
    setPreviewUrl(entry.thumbnailUrl);
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
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setPreviewFailed(false);
    setResult(null);
  };

  const handleScan = async () => {
    if (!selectedFile) return;
    setIsScanning(true);
    setScanStep(0);
    const stepInterval = setInterval(() => {
      setScanStep((s) => Math.min(s + 1, SCAN_STEPS.length - 1));
    }, 900);

    try {
      const diagnosis = await analyzePlantImage(selectedFile, selectedCrop);
      setResult(diagnosis);
      if (previewUrl) {
        addEntry({
          fileName: fileName || "scan.jpg",
          thumbnailUrl: previewUrl,
          result: diagnosis,
        });
      }
      showToast("Gemini AI विश्लेषण पूर्ण ✓");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "विश्लेषण विफल", "error");
    } finally {
      clearInterval(stepInterval);
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewFailed(false);
    setSelectedFile(null);
    setFileName("");
    setResult(null);
    setSymptomNotes("");
    setActiveChips([]);
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const handleToggleChip = (id: string, label: string) => {
    setActiveChips((prev) => {
      if (prev.includes(id)) {
        setSymptomNotes((notes) =>
          notes
            .replace(new RegExp(`\\s*${label}\\b`, "gi"), "")
            .replace(/,\s*,/g, ",")
            .replace(/^[\s,]+|[\s,]+$/g, "")
            .slice(0, 300)
        );
        return prev.filter((c) => c !== id);
      }
      setSymptomNotes((notes) => {
        const next = notes.trim() ? `${notes.trim()}, ${label}` : label;
        return next.slice(0, 300);
      });
      return [...prev, id];
    });
  };

  return (
    <AppShell className="ai-doctor-page" breadcrumbs={[{ label: "Home", href: "/" }, { label: "AI Doctor" }]}>
      <div className="space-y-5">
        <AiDoctorHero
          aiConfigured={aiConfigured}
          onHistoryClick={scrollToHistory}
          historyCount={history.length}
        />

        <div className="grid gap-5 lg:grid-cols-3">
          <div id="ai-doctor-scan" className="space-y-5 lg:col-span-2">
            <AiDoctorCropSelect selectedCrop={selectedCrop} onSelectCrop={setSelectedCrop} />

            {isOtherCrop(selectedCrop) && (
              <p className="-mt-2 rounded-xl border border-emerald-500/20 bg-emerald-50/80 px-3 py-2 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
                Other crop selected — AI photo se fasal pehchaan kar diagnosis dega.
              </p>
            )}

            <AiDoctorSymptoms
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

            <AiDoctorPhotoUpload
              previewUrl={previewUrl}
              previewFailed={previewFailed}
              fileName={fileName}
              onCamera={() => cameraInputRef.current?.click()}
              onGallery={() => galleryInputRef.current?.click()}
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

            <AiDoctorActions
              canScan={Boolean(selectedFile) && !isScanning && aiConfigured !== false}
              isScanning={isScanning}
              hasFile={Boolean(previewUrl || selectedFile || result)}
              onScan={handleScan}
              onReset={handleReset}
            />

            <DarkCard className="!p-4 sm:!p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                  <Stethoscope className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-[15px] font-bold text-[var(--av-text-primary)]">Diagnosis result</h2>
                  <p className="text-xs text-[var(--av-text-muted)]">AI report yahan dikhegi</p>
                </div>
              </div>

              {isScanning && (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 py-12 text-center dark:bg-emerald-950/20">
                  <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-500" />
                  <p className="mt-4 font-semibold text-emerald-700 dark:text-emerald-300">
                    {SCAN_STEPS[scanStep]}
                  </p>
                </div>
              )}

              {!isScanning && !result && (
                <div className="rounded-2xl border border-dashed border-[var(--av-border)] bg-[var(--av-surface-inset)] py-12 text-center">
                  <Stethoscope className="mx-auto h-10 w-10 text-[var(--av-text-muted)]" />
                  <p className="mt-3 text-sm font-semibold text-[var(--av-text-muted)]">
                    Report yahan dikhegi
                  </p>
                  {symptomNotes.trim() && (
                    <p className="mx-auto mt-3 max-w-sm rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-2 text-left text-[11px] text-[var(--av-text-muted)]">
                      <span className="font-semibold text-[var(--av-text-primary)]">Your notes:</span>{" "}
                      {symptomNotes}
                    </p>
                  )}
                </div>
              )}

              {result && !isScanning && (
                <div className="space-y-4 animate-fade-in">
                  {result.source === "gemini" && (
                    <p className="rounded-xl bg-sky-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                      ✓ Google Gemini — is photo par based analysis
                    </p>
                  )}

                  {result.visualObservations && (
                    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3">
                      <p className="text-[10px] font-bold uppercase text-sky-700 dark:text-sky-300">
                        Photo mein kya dikha
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--av-text-primary)]">
                        {result.visualObservations}
                      </p>
                    </div>
                  )}

                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                    <p className="text-xs font-bold text-red-500">{result.riskLevel}</p>
                    <h3 className="text-2xl font-black text-[var(--av-text-primary)]">{result.diseaseName}</h3>
                    <p className="text-sm text-[var(--av-text-muted)]">
                      Pathogen: <span className="font-semibold text-amber-600">{result.pathogen}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-[var(--av-surface-inset)] p-2.5">
                      <p className="text-[10px] text-[var(--av-text-muted)]">Confidence</p>
                      <p className="font-black text-[var(--av-text-primary)]">{result.confidence}%</p>
                    </div>
                    <div className="rounded-xl bg-[var(--av-surface-inset)] p-2.5">
                      <p className="text-[10px] text-[var(--av-text-muted)]">Severity</p>
                      <p className="font-black text-red-500">{result.severity}</p>
                    </div>
                    <div className="rounded-xl bg-[var(--av-surface-inset)] p-2.5">
                      <p className="text-[10px] text-[var(--av-text-muted)]">Stage</p>
                      <p className="font-black text-[var(--av-text-primary)]">{result.stage}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowWhy(!showWhy)}
                    className="flex w-full items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-left"
                  >
                    <span className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck className="h-4 w-4" />
                      यह क्यों हुआ? (Root cause)
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

                  <div className="rounded-xl border border-[var(--av-border)] p-4">
                    <p className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                      <Leaf className="h-4 w-4" />
                      Recommended treatment
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
                    className="block rounded-xl bg-emerald-700 py-3.5 text-center text-sm font-bold text-white shadow-md shadow-emerald-700/20"
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

            <div className="space-y-5 lg:hidden">
              <AiDoctorRiskForecast />
              <AiDoctorAskExpert />
              <AiDoctorTipsHelpline />
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
