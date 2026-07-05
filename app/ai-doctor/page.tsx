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
import GlassCard from "@/components/ui/GlassCard";
import { analyzePlantImage, checkAiDoctorConfigured, type DiagnosisResult } from "@/lib/aiDiagnosis";
import ShareOutbreakPrompt from "@/components/outbreak-radar/ShareOutbreakPrompt";
import { useAIHistory } from "@/hooks/useAIHistory";
import { useToast } from "@/components/ui/Toast";
import SafeThumbnail from "@/components/ui/SafeThumbnail";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { AI_DOCTOR_CROPS } from "@/data/ai-doctor-crops";
import {
  consumePendingAiScan,
  dataUrlToFile,
} from "@/lib/pendingAiScan";

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
  const { t } = useLocale();

  const [selectedCrop, setSelectedCrop] = useState("tomato");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [showWhy, setShowWhy] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const cropOptions = AI_DOCTOR_CROPS;

  useEffect(() => {
    checkAiDoctorConfigured().then(setAiConfigured);
  }, []);

  useEffect(() => {
    const pending = consumePendingAiScan();
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
          if (prev) URL.revokeObjectURL(prev);
          return pending.dataUrl;
        });
        setResult(null);

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
          }
        }
      } catch {
        if (!cancelled) showToast("Could not load scanned photo", "error");
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount for pending scan handoff
  }, []);

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
    setSelectedFile(null);
    setFileName("");
    setResult(null);
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  return (
    <main className="agriveda-page min-h-screen px-4 py-8 pb-28 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="agriveda-glass-strong rounded-[28px] p-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-500">
            <Sparkles className="h-3.5 w-3.5" />
            {aiConfigured ? "GOOGLE GEMINI AI" : "GEMINI SETUP REQUIRED"}
          </div>
          <h1 className="mt-3 text-3xl font-black theme-text-primary">AI Plant Doctor</h1>
          <p className="mt-2 text-sm theme-text-muted">
            Photo upload करें — <strong>Google Gemini</strong> asli photo dekhega aur batayega{" "}
            <strong>क्या</strong> है, <strong>क्यों</strong> hua, aur <strong>क्या करें</strong>.
          </p>
          {aiConfigured === false && (
            <p className="mt-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-800 dark:text-amber-200">
              ⚠️ GEMINI_API_KEY .env.local में add karein — bina key ke analysis nahi chalega.
              <br />
              Free key: aistudio.google.com → Get API key
            </p>
          )}
        </section>

        <section>
          <p className="mb-2 text-xs font-bold theme-text-muted">फसल चुनें:</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {cropOptions.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setSelectedCrop(c.slug)}
                className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition ${
                  selectedCrop === c.slug
                    ? "bg-emerald-600 text-white shadow-[0_0_12px_rgba(0,255,136,0.25)]"
                    : "border border-gray-200 theme-text-muted dark:border-white/10"
                }`}
              >
                <span>{c.emoji}</span>
                {c.name}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <GlassCard className="p-5">
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
            <div className="rounded-2xl border border-dashed border-emerald-500/30 p-4 text-center">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Sample" className="mx-auto h-52 w-full rounded-xl object-cover" />
              ) : (
                <div className="py-8">
                  <Microscope className="mx-auto h-12 w-12 text-emerald-500" />
                  <p className="mt-2 font-bold theme-text-primary">पत्ती की साफ़ photo लें</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 px-4 py-2 text-sm font-bold text-emerald-600"
              >
                <Camera className="h-4 w-4" />
                {previewUrl ? "नई photo" : "कैमरा"}
              </button>
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 px-4 py-2 text-sm font-bold text-emerald-600"
              >
                <ImagePlus className="h-4 w-4" />
                {previewUrl ? "बदलें" : "गैलरी / फ़ाइल"}
              </button>
              <button
                type="button"
                onClick={handleScan}
                disabled={!selectedFile || isScanning || aiConfigured === false}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}
                {isScanning ? "Analyzing..." : "Run diagnosis"}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={handleReset} className="rounded-xl px-4 py-2 text-sm theme-text-muted">
                Reset
              </button>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
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
          </GlassCard>
        </section>

        {history.length > 0 && (
          <section>
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 text-sm font-bold text-emerald-600"
              >
                <History className="h-4 w-4" />
                {t("recentScans")} ({history.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Scan history हटाएँ?")) {
                    clearHistory();
                    setShowHistory(false);
                    showToast("History साफ़ ✓");
                  }
                }}
                className="text-xs font-bold text-red-500"
              >
                {t("clearHistory")}
              </button>
            </div>
            {showHistory && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {history.slice(0, 6).map((h) => (
                  <GlassCard key={h.id} className="flex gap-3 p-3">
                    <SafeThumbnail
                      src={h.thumbnailUrl}
                      alt={h.fileName}
                      className="h-14 w-14 rounded-lg"
                    />
                    <div>
                      <p className="text-xs font-bold theme-text-primary">{h.result.diseaseName}</p>
                      <p className="text-[10px] theme-text-muted">
                        {new Date(h.timestamp).toLocaleDateString("en-IN")} • {h.result.confidence}%
                      </p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
