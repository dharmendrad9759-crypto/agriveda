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
  Eye,
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
  type SymptomSeverity,
} from "@/data/symptom-solver";
import { useMyCrops } from "@/hooks/useMyCrops";
import { fileToDataUrl, savePendingAiScan } from "@/lib/pendingAiScan";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

const SEVERITY_LABELS_HI: Record<SymptomSeverity, string> = {
  low: "कम",
  medium: "मध्यम",
  high: "ज्यादा",
};

type View = "categories" | "list" | "detail";

/** First short farmer-facing line from diagnosis text */
function farmerSymptomHint(text: string, max = 72): string {
  const line = text.split(/[।.]/)[0]?.trim() ?? text;
  if (line.length <= max) return line;
  return `${line.slice(0, max - 1)}…`;
}

export default function PestDiseaseSolver({ embedded = false }: { embedded?: boolean }) {
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
      showToast("कृपया एक इमेज फ़ाइल चुनें", "error");
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
      showToast("फोटो प्रोसेस नहीं हो सकी", "error");
    } finally {
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    }
  };

  return (
    <div
      className={cn(
        embedded
          ? "space-y-5 pb-24"
          : "min-h-screen bg-[var(--av-surface-muted)] pb-32 text-[var(--av-text-primary)]"
      )}
    >
      {!embedded && (
        <header className="sticky top-0 z-40 border-b border-[var(--av-border)] bg-[var(--av-surface)] shadow-sm">
          <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3.5">
            <button
              type="button"
              onClick={goBack}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-primary)]"
              aria-label="वापस जाएँ"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-extrabold tracking-tight">
                कीट और रोग समाधान
              </h1>
              <p className="truncate text-xs font-semibold text-[var(--av-text-muted)]">
                {crops[0]?.emoji} {crops[0]?.name ?? "धान"} · लक्षण गाइड
              </p>
            </div>
            <Stethoscope className="h-6 w-6 shrink-0 text-[var(--av-accent)]" aria-hidden />
          </div>
        </header>
      )}

      <main className={embedded ? "space-y-5" : "mx-auto max-w-lg px-4 py-5"}>
        {view === "categories" && (
          <section>
            <h2 className="text-lg font-extrabold text-[var(--av-text-primary)] sm:text-xl">
              आप क्या देख रहे हैं?
            </h2>
            <p className="mt-1 text-sm font-medium text-[var(--av-text-secondary)]">
              जो लक्षण खेत में दिखे, उसकी तस्वीर टैप करें — संभावित कारण और उपचार मिलेगा।
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SYMPTOM_CATEGORIES.map((category) => {
                const Icon = category.icon;
                const matchCount = getIssuesForCrop(category.id, cropSlug).length;
                const cover = getCategoryCoverImage(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => openCategory(category)}
                    className="group overflow-hidden rounded-2xl border border-[#D8E8DE] bg-[var(--av-surface)] text-left shadow-[0_8px_22px_-14px_rgba(11,92,59,0.35)] transition active:scale-[0.99]"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAF7EF]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cover}
                        alt={category.labelHi ?? category.label}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent px-3 pb-2.5 pt-10">
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-200">
                          <Eye className="h-3.5 w-3.5" aria-hidden />
                          खेत में ऐसा दिखता है
                        </span>
                      </span>
                      <span className="absolute left-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 shadow-sm">
                        <Icon className="h-5 w-5 text-[var(--av-accent)]" strokeWidth={2.25} />
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-[15px] font-extrabold leading-snug text-[var(--av-text-primary)]">
                        {category.labelHi ?? category.label}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[12px] font-medium leading-snug text-[var(--av-text-secondary)]">
                        {category.descriptionHi ?? category.description}
                      </p>
                      <p className="mt-2 text-[11px] font-bold text-[var(--av-accent)]">
                        {matchCount > 0
                          ? `${matchCount} संभावित कारण · टैप करें`
                          : "देखें · टैप करें"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {view === "list" && selectedCategory && (
          <section>
            <div className="mb-4 overflow-hidden rounded-2xl border border-[#D8E8DE] bg-[var(--av-surface)] shadow-sm">
              <div className="relative aspect-[16/9] max-h-44 w-full overflow-hidden bg-[#EAF7EF] sm:max-h-52">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getCategoryCoverImage(selectedCategory.id)}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-2.5 pt-8">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-200">
                    आपके खेत में यह लक्षण
                  </p>
                  <p className="text-base font-extrabold text-white">
                    {selectedCategory.labelHi ?? selectedCategory.label}
                  </p>
                </span>
              </div>
              <p className="px-3 py-2.5 text-[13px] font-medium leading-relaxed text-[var(--av-text-secondary)]">
                {selectedCategory.descriptionHi ?? selectedCategory.description}
              </p>
            </div>

            {issueList.length === 0 ? (
              <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-6 text-center">
                <p className="font-bold text-[var(--av-text-primary)]">
                  आपकी फसल के लिए अभी कोई मेल नहीं
                </p>
                <p className="mt-2 text-sm text-[var(--av-text-muted)]">
                  दूसरा लक्षण आज़माएँ या नीचे एआई स्कैन से तुरंत पहचान करें।
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

        {view === "detail" && selectedIssue && selectedCategory && (
          <IssueDetailView
            issue={selectedIssue}
            categoryLabel={selectedCategory.labelHi ?? selectedCategory.label}
          />
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--av-border)] bg-[var(--av-surface)]/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))]">
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
          className="mx-auto flex w-full max-w-lg items-center justify-center gap-3 rounded-2xl bg-[var(--av-accent)] px-5 py-4 text-base font-extrabold text-white shadow-lg transition hover:opacity-95 active:scale-[0.99]"
        >
          <Camera className="h-6 w-6" strokeWidth={2.5} />
          एआई से पत्ती स्कैन करें
        </button>
      </div>
    </div>
  );
}

function IssueListCard({ issue, onSelect }: { issue: SolverIssue; onSelect: () => void }) {
  const severity = SEVERITY_STYLES[issue.severity];
  const hint = farmerSymptomHint(issue.diagnosis);

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className="group relative flex min-h-[108px] w-full overflow-hidden rounded-2xl border border-[#D8E8DE] bg-[var(--av-surface)] text-left shadow-[0_8px_22px_-14px_rgba(11,92,59,0.35)] transition active:scale-[0.99]"
      >
        <span className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-1 px-3 py-3">
          <p className="text-[14px] font-extrabold leading-snug text-[var(--av-text-primary)]">
            {issue.name}
          </p>
          <p className="line-clamp-2 text-[11px] font-medium leading-snug text-[var(--av-text-secondary)]">
            {hint}
          </p>
          <span className="mt-0.5 flex flex-wrap items-center gap-2">
            <span
              className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ring-1 ${severity.className}`}
            >
              {SEVERITY_LABELS_HI[issue.severity]}
            </span>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#0B5C3B]">
              उपचार देखें
              <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </span>
        </span>

        <span className="relative w-[42%] min-w-[128px] max-w-[180px] shrink-0 self-stretch overflow-hidden bg-[#EAF7EF]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={issue.image}
            alt={issue.name}
            className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[var(--av-surface)] via-[var(--av-surface)]/70 to-transparent"
          />
          <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/55 px-1.5 py-0.5 text-[9px] font-bold text-white">
            लक्षण
          </span>
        </span>
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
      <div className="overflow-hidden rounded-2xl border border-[#D8E8DE] bg-[var(--av-surface)] shadow-md">
        <div className="relative aspect-[4/3] w-full max-h-80 overflow-hidden bg-[#EAF7EF]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={issue.image}
            alt={issue.name}
            className="h-full w-full object-cover object-center"
          />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-3 pt-12">
            <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-200">
              खेत में ऐसा दिखता है
            </p>
            <p className="mt-0.5 text-lg font-extrabold text-white">{issue.name}</p>
          </span>
        </div>
        <div className="border-t border-[var(--av-border)] p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--av-accent)]">
            {categoryLabel}
          </p>
          <span
            className={`mt-2 inline-block rounded-md px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide ring-1 ${severity.className}`}
          >
            {SEVERITY_LABELS_HI[issue.severity]} गंभीरता
          </span>
        </div>
      </div>

      <section className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-4">
        <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-[var(--av-text-primary)]">
          <Shield className="h-4 w-4 text-[var(--av-accent)]" />
          यही समस्या है?
        </h3>
        <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--av-text-secondary)]">
          {issue.diagnosis}
        </p>
      </section>

      <section className="rounded-2xl border border-emerald-500/25 bg-emerald-500/8 p-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-emerald-900 dark:text-emerald-100">
          अभी क्या करें
        </h3>
        <ol className="mt-3 space-y-2.5">
          {issue.immediateActions.map((step, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm font-medium leading-relaxed text-[var(--av-text-primary)]"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--av-accent)] text-xs font-extrabold text-white">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-sky-500/25 bg-sky-500/8 p-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-sky-900 dark:text-sky-100">
          आगे से बचाव
        </h3>
        <ul className="mt-3 space-y-2">
          {issue.prevention.map((tip, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm font-medium leading-relaxed text-[var(--av-text-secondary)]"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" />
              {tip}
            </li>
          ))}
        </ul>
      </section>

      {fullGuideHref && (
        <Link
          href={fullGuideHref}
          className="flex items-center justify-center gap-2 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] py-3.5 text-sm font-extrabold text-[var(--av-text-primary)] shadow-sm"
        >
          पूरी कीट/रोग गाइड
          <ExternalLink className="h-4 w-4" />
        </Link>
      )}
    </article>
  );
}
