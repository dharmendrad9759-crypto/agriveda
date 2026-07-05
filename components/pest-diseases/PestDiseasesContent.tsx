"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PageBackground from "@/components/ui/PageBackground";
import SectionHeading from "@/components/ui/SectionHeading";
import ThreatCard from "@/components/pest-diseases/ThreatCard";
import PestDiseaseFilters from "@/components/pest-diseases/PestDiseaseFilters";
import { pestDiseaseCropList } from "@/data/pest-disease";
import { getEnrichedCropThreats, filterThreats } from "@/lib/pest-disease-catalog";
import type { ThreatCategory } from "@/types/pest-disease-ui";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/cn";

export default function PestDiseasesContent() {
  const searchParams = useSearchParams();
  const initialCrop = searchParams.get("crop") ?? pestDiseaseCropList[0]?.slug ?? "paddy";

  const [selectedSlug, setSelectedSlug] = useState(initialCrop);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ThreatCategory | "all">("all");
  const { t } = useLocale();

  const allThreats = useMemo(() => getEnrichedCropThreats(selectedSlug), [selectedSlug]);
  const filtered = useMemo(
    () => filterThreats(allThreats, search, category),
    [allThreats, search, category]
  );

  const cropInfo = pestDiseaseCropList.find((c) => c.slug === selectedSlug);

  return (
    <div className="agriveda-page relative min-h-screen pb-28">
      <PageBackground />

      <header className="sticky top-0 z-40 border-b border-emerald-500/10 bg-[var(--background)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-4">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-base font-extrabold theme-text-primary">{t("pestDiseasesTitle")}</h1>
            <p className="text-[11px] theme-text-muted">{t("pestsDiseases")}</p>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-lg space-y-5 px-4 py-5">
        <section>
          <SectionHeading title={t("selectCropPrompt")} />
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {pestDiseaseCropList.map((crop) => (
              <button
                key={crop.slug}
                type="button"
                onClick={() => {
                  setSelectedSlug(crop.slug);
                  setSearch("");
                  setCategory("all");
                }}
                className={cn(
                  "flex flex-shrink-0 flex-col items-center gap-1.5 rounded-2xl border px-4 py-3 transition-all",
                  selectedSlug === crop.slug
                    ? "border-emerald-500 bg-emerald-500/15 shadow-md"
                    : "border-gray-200 bg-white dark:border-white/10 dark:bg-black/20"
                )}
              >
                <span className="text-2xl">{crop.emoji}</span>
                <span
                  className={cn(
                    "text-[11px] font-bold",
                    selectedSlug === crop.slug ? "text-emerald-600" : "theme-text-muted"
                  )}
                >
                  {crop.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        <PestDiseaseFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          resultCount={filtered.length}
        />

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((threat) => (
              <ThreatCard key={`${threat.type}-${threat.id}`} threat={threat} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center dark:border-white/10 dark:bg-black/20">
            <p className="text-sm font-bold theme-text-primary">कोई परिणाम नहीं</p>
            <p className="mt-1 text-xs theme-text-muted">
              {allThreats.length === 0
                ? `${cropInfo?.name ?? "This crop"} के लिए data उपलब्ध नहीं — दूसरी crop try करें।`
                : "Search या filter बदलें।"}
            </p>
          </div>
        )}

        <Link
          href="/ai-doctor"
          className="block rounded-2xl bg-[#006432] py-3.5 text-center text-sm font-bold text-white"
        >
          AI Doctor से photo diagnosis करें →
        </Link>
      </div>
    </div>
  );
}
