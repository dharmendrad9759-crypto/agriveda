"use client";

import Link from "next/link";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  ArrowLeft,
  Camera,
  ChevronRight,
  ExternalLink,
  Shield,
  Stethoscope,
} from "lucide-react";
import {
  SYMPTOM_CATEGORIES,
  SEVERITY_STYLES,
  getIssueById,
  getIssuesForCrop,
  getSymptomCategory,
  getCategoryCoverImage,
  issueDetailHref,
  type SolverIssue,
  type SymptomCategory,
} from "@/data/symptom-solver";
import { useMyCrops } from "@/hooks/useMyCrops";
import { fileToDataUrl, savePendingAiScan } from "@/lib/pendingAiScan";
import { useToast } from "@/components/ui/Toast";

type View = "categories" | "list" | "detail";

export default function PestDiseaseSolver() {
  const navigate = useAppNavigate();
  const router = useRouter();
  const { showToast } = useToast();
  const { crops } = useMyCrops();
  const cropSlug = crops[0]?.slug ?? "paddy";

  const [view, setView] = useState<View>("categories");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const selectedCategory = selectedCategoryId
    ? getSymptomCategory(selectedCategoryId)
    : undefined;

  const issueList = useMemo(() => {
    if (!selectedCategoryId) return [];
    return getIssuesForCrop(selectedCategoryId, cropSlug);
  }, [selectedCategoryId, cropSlug]);

  const selectedIssue = useMemo(() => {
    if (!selectedCategoryId || !selectedIssueId) return undefined;
    return getIssueById(selectedCategoryId, selectedIssueId);
  }, [selectedCategoryId, selectedIssueId]);

  const openCategory = (category: SymptomCategory) => {
    setSelectedCategoryId(category.id);
    setSelectedIssueId(null);
    setView("list");
  };

  const openIssue = (issue: SolverIssue) => {
    setSelectedIssueId(issue.id);
    setView("detail");
  };

  const goBack = () => {
    if (view === "detail") {
      setView("list");
      setSelectedIssueId(null);
    } else if (view === "list") {
      setView("categories");
      setSelectedCategoryId(null);
    } else {
      router.back();
    }
  };

  const handleCameraCapture = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      savePendingAiScan({
        dataUrl,
        fileName: file.name || "leaf-scan.jpg",
        cropSlug,
        autoScan: true,
      });
      navigate("/ai-doctor");
    } catch {
      showToast("Could not process photo", "error");
    } finally {
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32 text-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3.5">
          <button
            type="button"
            onClick={goBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2 border-gray-200 bg-white text-gray-800"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-extrabold tracking-tight text-gray-950">
              Pest &amp; Disease Solver
            </h1>
            <p className="truncate text-xs font-semibold text-gray-600">
              {crops[0]?.emoji} {crops[0]?.name ?? "Paddy"} · Symptom guide
            </p>
          </div>
          <Stethoscope className="h-6 w-6 shrink-0 text-emerald-600" aria-hidden />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-5">
        {/* Categories grid */}
        {view === "categories" && (
          <section>
            <h2 className="text-xl font-extrabold text-gray-950">What are you observing?</h2>
            <p className="mt-1 text-sm font-medium text-gray-700">
              Tap a symptom to see likely causes and what to do next.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2">
              {SYMPTOM_CATEGORIES.map((category) => {
                const Icon = category.icon;
                const matchCount = getIssuesForCrop(category.id, cropSlug).length;
                const cover = getCategoryCoverImage(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => openCategory(category)}
                    className={`relative flex min-h-[148px] flex-col items-start overflow-hidden rounded-2xl border-2 bg-gradient-to-br p-4 text-left shadow-md transition active:scale-[0.98] ${category.accent}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover}
                      alt=""
                      aria-hidden
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
                    />
                    <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 shadow-sm backdrop-blur-sm">
                      <Icon className="h-6 w-6 text-gray-800" strokeWidth={2.25} />
                    </span>
                    <span className="relative mt-3 text-sm font-extrabold leading-tight text-gray-950">
                      {category.labelHi ?? category.label}
                    </span>
                    <span className="relative mt-1 line-clamp-2 text-[11px] font-medium leading-snug text-gray-800">
                      {category.description}
                    </span>
                    <span className="relative mt-2 text-[10px] font-bold uppercase tracking-wide text-gray-700">
                      {matchCount} possible {matchCount === 1 ? "cause" : "causes"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Issue list */}
        {view === "list" && selectedCategory && (
          <section>
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Matching symptoms
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-gray-950">
                {selectedCategory.label}
              </h2>
              <p className="mt-1 text-sm font-medium text-gray-700">
                {selectedCategory.description}
              </p>
            </div>

            {issueList.length === 0 ? (
              <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-6 text-center">
                <p className="font-bold text-gray-900">No matches for your crop yet</p>
                <p className="mt-2 text-sm text-gray-600">
                  Try another symptom or use AI scan below for instant diagnosis.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {issueList.map((issue) => (
                  <IssueListCard key={issue.id} issue={issue} onSelect={() => openIssue(issue)} />
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Detail view */}
        {view === "detail" && selectedIssue && selectedCategory && (
          <IssueDetailView
            issue={selectedIssue}
            categoryLabel={selectedCategory.label}
          />
        )}
      </main>

      {/* Fixed AI camera button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          className="sr-only"
          aria-hidden
        />
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="mx-auto flex w-full max-w-lg items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-5 py-4 text-base font-extrabold text-white shadow-lg transition hover:bg-emerald-700 active:scale-[0.99]"
        >
          <Camera className="h-6 w-6" strokeWidth={2.5} />
          Scan Leaf with AI
        </button>
      </div>
    </div>
  );
}

function IssueListCard({ issue, onSelect }: { issue: SolverIssue; onSelect: () => void }) {
  const severity = SEVERITY_STYLES[issue.severity];

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white p-3 text-left shadow-md transition hover:border-emerald-300 active:scale-[0.99]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={issue.image}
          alt=""
          className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-gray-200"
        />
        <div className="min-w-0 flex-1">
          <p className="font-extrabold text-gray-950">{issue.name}</p>
          <span
            className={`mt-1.5 inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ring-1 ${severity.className}`}
          >
            Severity: {severity.label}
          </span>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
      </button>
    </li>
  );
}

function IssueDetailView({
  issue,
  categoryLabel,
}: {
  issue: SolverIssue;
  categoryLabel: string;
}) {
  const severity = SEVERITY_STYLES[issue.severity];
  const fullGuideHref = issueDetailHref(issue);

  return (
    <article className="space-y-5">
      <div className="overflow-hidden rounded-2xl border-2 border-gray-200 shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={issue.image} alt={issue.name} className="h-48 w-full object-cover" />
        <div className="p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-600">{categoryLabel}</p>
          <h2 className="mt-1 text-2xl font-extrabold text-gray-950">{issue.name}</h2>
          <span
            className={`mt-2 inline-block rounded-md px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide ring-1 ${severity.className}`}
          >
            {severity.label} severity
          </span>
        </div>
      </div>

      <section className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-4 shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-gray-800">
          <Shield className="h-4 w-4 text-emerald-600" />
          Diagnosis
        </h3>
        <p className="mt-2 text-sm font-medium leading-relaxed text-gray-800">{issue.diagnosis}</p>
      </section>

      <section className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 shadow-sm">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-emerald-900">
          Immediate Action
        </h3>
        <ol className="mt-3 space-y-2.5">
          {issue.immediateActions.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm font-medium leading-relaxed text-gray-900">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-extrabold text-white">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border-2 border-sky-200 bg-sky-50 p-4 shadow-sm">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-sky-900">Prevention</h3>
        <ul className="mt-3 space-y-2">
          {issue.prevention.map((tip, i) => (
            <li key={i} className="flex gap-2 text-sm font-medium leading-relaxed text-gray-800">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
              {tip}
            </li>
          ))}
        </ul>
      </section>

      {fullGuideHref && (
        <Link
          href={fullGuideHref}
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-gray-300 bg-white py-3.5 text-sm font-extrabold text-gray-900 shadow-sm"
        >
          Full scientific guide
          <ExternalLink className="h-4 w-4" />
        </Link>
      )}
    </article>
  );
}
