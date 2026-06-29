"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Camera,
  CheckCircle2,
  Droplets,
  Leaf,
  Microscope,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TimerReset,
} from "lucide-react";

export default function AIDoctorPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("No file selected");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setScanComplete(false);
  };

  const handleStartScan = () => {
    if (!previewUrl) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 2600);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.35),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.25),_transparent_35%),linear-gradient(135deg,_#020617_0%,_#111827_45%,_#020617_100%)] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="overflow-hidden rounded-[32px] border border-emerald-400/20 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-emerald-950/70 p-6 shadow-[0_20px_90px_rgba(16,185,129,0.18)] backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-purple-200 shadow-[0_0_24px_rgba(168,85,247,0.2)]">
                <Sparkles className="h-3.5 w-3.5" />
                AGRIVEDA AI ENGINE
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  AI Plant Doctor
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Upload a leaf image and receive a premium diagnostic report with disease risk, confidence score, and field-ready treatment guidance.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 p-4 text-sm text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.12)]">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-4 w-4" />
                Clinical-style diagnosis preview
              </div>
              <p className="mt-1 text-xs text-emerald-300/80">
                Built for farmers, agronomists, and agri-students.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5 shadow-[0_10px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Image intake
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">Upload crop symptom image</h2>
              </div>
              <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-400">
                <Camera className="h-5 w-5" />
              </div>
            </div>

            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-emerald-400/25 bg-gradient-to-br from-black/30 to-emerald-950/20 p-6 text-center transition hover:border-purple-400/50 hover:bg-white/10">
              {previewUrl ? (
                <div className="w-full space-y-4">
                  <img
                    src={previewUrl}
                    alt="Selected plant sample"
                    className="mx-auto h-56 w-full rounded-2xl object-cover"
                  />
                  <div className="text-sm text-slate-300">
                    <p className="font-semibold text-white">{fileName}</p>
                    <p className="mt-1 text-xs text-slate-400">Preview ready for AI analysis</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                    <Microscope className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">Click to upload a leaf image</p>
                    <p className="mt-1 text-sm text-slate-400">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </label>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={handleStartScan}
                disabled={isScanning || !previewUrl}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(168,85,247,0.25)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isScanning ? "Scanning..." : "Run AI diagnosis"}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setPreviewUrl(null);
                  setFileName("No file selected");
                  setScanComplete(false);
                }}
                className="rounded-full border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/15"
              >
                Reset
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-sm shadow-inner">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Leaf className="h-4 w-4" />
                  Crop aware
                </div>
                <p className="mt-1 text-xs text-slate-400">Leaf, stem, and fruit symptoms</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm">
                <div className="flex items-center gap-2 text-sky-300">
                  <Droplets className="h-4 w-4" />
                  Weather context
                </div>
                <p className="mt-1 text-xs text-slate-400">Moisture and climate insights</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm">
                <div className="flex items-center gap-2 text-amber-300">
                  <TimerReset className="h-4 w-4" />
                  Fast triage
                </div>
                <p className="mt-1 text-xs text-slate-400">Results in seconds</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-5 shadow-[0_10px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Diagnosis report
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">AI-generated field summary</h2>
              </div>
              <div className="rounded-full border border-purple-500/20 bg-purple-500/10 p-2 text-purple-400">
                <Bot className="h-5 w-5" />
              </div>
            </div>

            {!previewUrl && !isScanning && !scanComplete && (
              <div className="mt-8 rounded-[24px] border border-dashed border-white/10 bg-gradient-to-br from-black/25 to-slate-900/40 p-8 text-center shadow-inner">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-slate-300">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-200">Upload an image to activate the AI doctor</p>
                <p className="mt-2 text-sm text-slate-400">Your diagnosis report will appear here instantly.</p>
              </div>
            )}

            {isScanning && (
              <div className="mt-8 rounded-[24px] border border-purple-400/25 bg-gradient-to-br from-purple-500/15 to-emerald-500/10 p-8 text-center shadow-[0_0_30px_rgba(168,85,247,0.12)]">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-purple-300/30 border-t-purple-400" />
                <p className="mt-4 text-base font-semibold text-purple-200">Analyzing leaf texture, color changes, and disease signatures...</p>
                <p className="mt-2 text-sm text-purple-300/80">Cross-checking with agronomic pattern libraries.</p>
              </div>
            )}

            {scanComplete && (
              <div className="mt-6 space-y-5">
                <div className="rounded-[22px] border border-red-400/25 bg-gradient-to-r from-red-500/15 to-orange-500/10 p-4 shadow-[0_0_20px_rgba(248,113,113,0.12)]">
                  <div className="flex items-center gap-2 text-sm font-semibold text-red-300">
                    <CheckCircle2 className="h-4 w-4" />
                    High-risk pattern detected
                  </div>
                  <h3 className="mt-2 text-2xl font-bold text-white">Early Blight</h3>
                  <p className="mt-1 text-sm text-slate-300">
                    Likely pathogen: <span className="font-semibold text-amber-300">Alternaria solani</span>
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3 shadow-inner">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Confidence</p>
                    <p className="mt-1 text-lg font-bold text-white">92%</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3 shadow-inner">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Severity</p>
                    <p className="mt-1 text-lg font-bold text-red-300">High</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3 shadow-inner">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Stage</p>
                    <p className="mt-1 text-lg font-bold text-white">Early</p>
                  </div>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-gradient-to-br from-black/30 to-slate-900/40 p-4 shadow-inner">
                  <p className="text-sm font-semibold text-emerald-300">Recommended treatment</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    <li>• Apply copper-based fungicide at the recommended field dose.</li>
                    <li>• Improve airflow and avoid excess leaf wetness.</li>
                    <li>• Remove severely infected leaves and monitor every 3 days.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="text-center text-sm text-slate-500 sm:text-left">
          <Link href="/" className="transition hover:text-emerald-400">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
