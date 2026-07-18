"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Camera,
  ChevronDown,
  ChevronUp,
  History,
  ImagePlus,
  Leaf,
  Microscope,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Loader2,
} from "lucide-react";
import { analyzePlantImage, checkAiDoctorConfigured, type DiagnosisResult } from "@/lib/aiDiagnosis";
import ShareOutbreakPrompt from "@/components/outbreak-radar/ShareOutbreakPrompt";
import { useAIHistory } from "@/hooks/useAIHistory";
import { useToast } from "@/components/ui/Toast";
import { AI_DOCTOR_CROPS } from "@/data/ai-doctor-crops";
import {
  claimPendingAiScan,
  dataUrlToFile,
  releasePendingScanLock,
} from "@/lib/pendingAiScan";
import { AiDoctorDesktopHero, AiDoctorDesktopSidebar, AiDoctorQuickIdentify, AiDoctorRecentDiagnoses } from "@/components/ai-doctor/AiDoctorRedesign";
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
  const [showHistory, setShowHistory] = useState(false);
  const [symptomNotes, setSymptomNotes] = useState("");

  const cropOptions = AI_DOCTOR_CROPS;

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
        setShowHistory(false);

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
    setShowHistory(false);
    setShowWhy(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  return (
    <AppShell
      title={
        <span className="inline-flex items-center gap-2">
          AI Doctor
          <span className="rounded-full bg-[var(--av-accent-soft)] px-2 py-0.5 text-[10px] font-bold text-[var(--av-accent)]">
            AI Powered
          </span>
        </span>
      }
      subtitle="Identify problems, get solutions & expert recommendations"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "AI Doctor" }]}
      actions={
        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--av-border)] px-4 py-2 text-xs font-bold text-[var(--av-text-secondary)]"
        >
          <History className="h-4 w-4" />
          Diagnosis History
        </button>
      }
    >
      <AiDoctorDesktopHero
        onUploadClick={() => {
          document.getElementById("ai-doctor-scan")?.scrollIntoView({ behavior: "smooth" });
          cameraInputRef.current?.click();
        }}
        onQuickTopic={() => {
          document.getElementById("ai-doctor-scan")?.scrollIntoView({ behavior: "smooth" });
          showToast("नीचे photo upload करें — AI diagnosis शुरू करें");
        }}
      />

      <AiDoctorQuickIdentify selectedCrop={selectedCrop} onSelectCrop={setSelectedCrop} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div id="ai-doctor-scan" className="space-y-4 lg:col-span-2">
        <DarkCard>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#10b981]/30 bg-[var(--av-accent)]/10 px-3 py-1 text-[11px] font-semibold text-[var(--av-accent)]">
            <Sparkles className="h-3.5 w-3.5" />
            {aiConfigured ? "24×7 AI Active" : "AI Setup Required"}
          </div>
          {aiConfigured === false && (
            <p className="mt-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-800 dark:text-amber-200">
              {typeof window !== "undefined" &&
              (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
                ? "⚠️ GEMINI_API_KEY .env.local में add karein — Google AI Studio से key (AIzaSy या AQ. format)."
                : "⚠️ Vercel → Settings → Environment Variables → GEMINI_API_KEY → Production ✅ enable करें, Save करें, फिर Deployments → Redeploy करें।"}
            </p>
          )}
        </DarkCard>

        <DarkCard delay={1}>
          <p className="text-xs font-bold text-[var(--av-text-secondary)]">Symptoms / notes (optional)</p>
          <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">
            Photo ke saath likhein ya mic se bolein — aapke notes scan ke baad reference ke liye rahenge.
          </p>
          <textarea
            value={symptomNotes}
            onChange={(e) => setSymptomNotes(e.target.value.slice(0, 300))}
            placeholder="जैसे: पत्तियों पर पीले धब्बे, किनारे सूख रहे हैं..."
            rows={3}
            className="av-input mt-2 w-full resize-none text-sm"
          />
          <div className="mt-2">
            <VoiceInput
              compact
              onTranscript={(text) =>
                setSymptomNotes((n) => `${n}${n ? " " : ""}${text}`.slice(0, 300))
              }
            />
          </div>
        </DarkCard>

        <DarkCard delay={2}>
          <p className="mb-2 text-xs font-bold text-[var(--av-text-secondary)]">Selected crop for diagnosis:</p>
          <p className="text-sm font-semibold text-[var(--av-accent)]">
            {cropOptions.find((c) => c.slug === selectedCrop)?.name ?? selectedCrop}
          </p>
        </DarkCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <DarkCard delay={3}>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="sr-only"
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="sr-only"
            />
            <div className="rounded-xl border border-dashed border-[#10b981]/30 bg-[var(--av-surface-inset)] p-4 text-center">
              {previewUrl && !previewFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Selected crop photo"
                  className="mx-auto h-52 w-full rounded-xl object-cover"
                  onError={() => setPreviewFailed(true)}
                />
              ) : previewUrl && previewFailed ? (
                <div className="py-8">
                  <ImagePlus className="mx-auto h-12 w-12 text-[var(--av-accent)]" />
                  <p className="mt-2 font-bold text-[var(--av-text-primary)]">Photo selected ✓</p>
                  <p className="mt-1 break-all px-2 text-[11px] font-semibold text-[var(--av-text-secondary)]">
                    {fileName || "photo"}
                  </p>
                  <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
                    Preview यहाँ नहीं दिख सकती (HEIC/format), फिर भी &quot;Run diagnosis&quot; चलेगा।
                  </p>
                </div>
              ) : (
                <div className="py-8">
                  <Microscope className="mx-auto h-12 w-12 text-[var(--av-accent)]" />
                  <p className="mt-2 font-bold text-[var(--av-text-primary)]">Upload crop / leaf photo</p>
                  <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">JPG, PNG up to 10MB</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-4 py-2 text-sm font-bold text-[var(--av-accent)]"
              >
                <Camera className="h-4 w-4" />
                {previewUrl ? "नई photo" : "कैमरा"}
              </button>
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-4 py-2 text-sm font-bold text-[var(--av-accent)]"
              >
                <ImagePlus className="h-4 w-4" />
                {previewUrl ? "Change" : "Gallery"}
              </button>
              <button
                type="button"
                onClick={handleScan}
                disabled={!selectedFile || isScanning || aiConfigured === false}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--av-accent)] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
                {isScanning ? "Analyzing..." : "Run diagnosis"}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={handleReset} className="rounded-xl px-4 py-2 text-sm text-[var(--av-text-muted)]">
                Reset
              </button>
            </div>
          </DarkCard>

          <DarkCard delay={4}>
            {isScanning && (
              <div className="py-10 text-center">
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-500" />
                <p className="mt-4 font-semibold text-emerald-600">{SCAN_STEPS[scanStep]}</p>
              </div>
            )}

            {!isScanning && !result && (
              <div className="py-10 text-center">
                <Stethoscope className="mx-auto h-10 w-10 theme-text-muted" />
                <p className="mt-3 text-sm theme-text-muted">रिपोर्ट यहाँ दिखेगी</p>
                {symptomNotes.trim() && (
                  <p className="mx-auto mt-3 max-w-sm rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2 text-left text-[10px] text-[var(--av-text-muted)]">
                    <span className="font-semibold text-[var(--av-text-primary)]">Your notes:</span> {symptomNotes}
                  </p>
                )}
              </div>
            )}

            {result && !isScanning && (
              <div className="space-y-4 animate-fade-in">
                {result.source === "gemini" && (
                  <p className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                    ✓ Google Gemini — is photo par based analysis
                  </p>
                )}

                {result.visualObservations && (
                  <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-3">
                    <p className="text-[10px] font-bold uppercase text-sky-700 dark:text-sky-300">
                      Photo mein kya dikha
                    </p>
                    <p className="mt-1 text-sm theme-text-primary leading-relaxed">
                      {result.visualObservations}
                    </p>
                  </div>
                )}

                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
                  <p className="text-xs font-bold text-red-500">{result.riskLevel}</p>
                  <h3 className="text-2xl font-black theme-text-primary">{result.diseaseName}</h3>
                  <p className="text-sm theme-text-muted">
                    Pathogen: <span className="font-semibold text-amber-600">{result.pathogen}</span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-black/5 p-2 dark:bg-white/5">
                    <p className="text-[10px] theme-text-muted">Confidence</p>
                    <p className="font-black theme-text-primary">{result.confidence}%</p>
                  </div>
                  <div className="rounded-xl bg-black/5 p-2 dark:bg-white/5">
                    <p className="text-[10px] theme-text-muted">Severity</p>
                    <p className="font-black text-red-500">{result.severity}</p>
                  </div>
                  <div className="rounded-xl bg-black/5 p-2 dark:bg-white/5">
                    <p className="text-[10px] theme-text-muted">Stage</p>
                    <p className="font-black theme-text-primary">{result.stage}</p>
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
                  <ul className="space-y-2 text-sm theme-text-muted">
                    {result.whyItHappens.map((w, i) => (
                      <li key={i} className="rounded-lg bg-black/5 p-2 dark:bg-white/5">
                        • {w}
                      </li>
                    ))}
                    <li className="text-xs font-semibold text-sky-600">
                      मौसम: {result.environmentalFactors.join(" • ")}
                    </li>
                  </ul>
                )}

                <div className="rounded-xl border border-white/10 p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                    <Leaf className="h-4 w-4" />
                    Recommended treatment
                  </p>
                  <ul className="mt-2 space-y-1 text-sm theme-text-muted">
                    {result.treatments.map((t, i) => (
                      <li key={i}>• {t}</li>
                    ))}
                  </ul>
                  <div className="mt-3 space-y-2">
                    {result.activeIngredients.map((ai, i) => (
                      <div key={i} className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs">
                        <span className="font-bold text-emerald-700 dark:text-emerald-300">{ai.name}</span>
                        <span className="theme-text-muted"> — {ai.dose} ({ai.fracIrac})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/ask-query"
                  className="block rounded-xl bg-orange-500 py-3 text-center text-sm font-bold text-white"
                >
                  विशेषज्ञ से पुष्टि करें →
                </Link>

                <ShareOutbreakPrompt
                  result={result}
                  cropSlug={selectedCrop}
                  photoUrl={previewUrl}
                />
              </div>
            )}
          </DarkCard>
        </div>

        <AiDoctorRecentDiagnoses history={history} onOpenEntry={openHistoryEntry} />
        </div>

        <div className="hidden lg:block">
          <AiDoctorDesktopSidebar />
        </div>
      </div>

      <div className="mt-4 lg:hidden">
        <AiDoctorDesktopSidebar />
      </div>
    </AppShell>
  );
}
