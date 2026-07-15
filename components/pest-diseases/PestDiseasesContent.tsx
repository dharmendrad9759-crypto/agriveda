"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import ThreatCard from "@/components/pest-diseases/ThreatCard";
import PestDiseaseFilters from "@/components/pest-diseases/PestDiseaseFilters";
import { pestDiseaseCropList } from "@/data/pest-disease";
import { getEnrichedCropThreats, filterThreats, getAllWeedsAcrossCrops } from "@/lib/pest-disease-catalog";
import type { ThreatCategory } from "@/types/pest-disease-ui";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";

function categoryFromParam(type: string | null): ThreatCategory | "all" {
  if (type === "weed") return "weed";
  if (type === "pest" || type === "insect") return "insect";
  if (type === "disease" || type === "fungal") return "fungal";
  return "all";
}

export default function PestDiseasesContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const isWeedHub = typeParam === "weed";
  const initialCrop = searchParams.get("crop") ?? pestDiseaseCropList[0]?.slug ?? "paddy";

  const [selectedSlug, setSelectedSlug] = useState(isWeedHub ? "all" : initialCrop);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ThreatCategory | "all">(categoryFromParam(typeParam));
  const { t } = useLocale();

  useEffect(() => {
    setCategory(categoryFromParam(typeParam));
  }, [typeParam]);

  useEffect(() => {
    if (searchParams.get("crop")) {
      setSelectedSlug(searchParams.get("crop")!);
    }
  }, [searchParams]);

  const allThreats = useMemo(() => {
    if (isWeedHub && selectedSlug === "all") {
      return getAllWeedsAcrossCrops();
    }
    const threats = getEnrichedCropThreats(selectedSlug);
    return isWeedHub ? threats.filter((t) => t.type === "weed") : threats;
  }, [selectedSlug, isWeedHub]);
  const filtered = useMemo(
    () => filterThreats(allThreats, search, category),
    [allThreats, search, category]
  );

  const cropInfo = selectedSlug === "all" ? null : pestDiseaseCropList.find((c) => c.slug === selectedSlug);
  const pageTitle = isWeedHub ? "Weeds" : t("pestDiseasesTitle");
  const pageSubtitle = isWeedHub
    ? "Problematic weeds — identification & management by crop"
    : t("pestsDiseases");

  return (
    <AppShell
      title={pageTitle}
      subtitle={pageSubtitle}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: isWeedHub ? "Weeds" : "Pests & Diseases" },
      ]}
    >
      {!isWeedHub && (
        <AppLink
          href="/pest-solver"
          className="av-card av-card-hover flex items-center justify-between p-4"
        >
          <div>
            <p className="text-sm font-semibold text-[var(--av-text-primary)]">Not sure what it is?</p>
            <p className={`mt-0.5 ${AV.micro}`}>Identify by symptom → Pest &amp; Disease Solver</p>
          </div>
          <span className="text-lg font-bold text-[var(--av-accent)]">→</span>
        </AppLink>
      )}

      <DarkCard className={isWeedHub ? "mt-0" : "mt-4"} delay={0}>
        <h3 className={AV.sectionTitle}>{t("selectCropPrompt")}</h3>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {isWeedHub && (
            <button
              type="button"
              onClick={() => {
                setSelectedSlug("all");
                setSearch("");
              }}
              className={cn(
                "flex shrink-0 flex-col items-center gap-1 rounded-xl border px-3 py-2 transition",
                selectedSlug === "all"
                  ? "border-[var(--av-accent)] bg-[var(--av-accent-soft)]"
                  : "border-[var(--av-border)] bg-[var(--av-surface-inset)]"
              )}
            >
              <span className="text-xl">🌿</span>
              <span className="text-[10px] font-semibold text-[var(--av-accent)]">All Crops</span>
            </button>
          )}
          {pestDiseaseCropList.map((crop) => (
            <button
              key={crop.slug}
              type="button"
              onClick={() => {
                setSelectedSlug(crop.slug);
                setSearch("");
              }}
              className={cn(
                "flex shrink-0 flex-col items-center gap-1 rounded-xl border px-3 py-2 transition",
                selectedSlug === crop.slug
                  ? "border-[var(--av-accent)] bg-[var(--av-accent-soft)]"
                  : "border-[var(--av-border)] bg-[var(--av-surface-inset)] hover:border-[var(--av-accent)]/30"
              )}
            >
              <span className="text-xl">{crop.emoji}</span>
              <span
                className={cn(
                  "text-[10px] font-semibold",
                  selectedSlug === crop.slug ? "text-[var(--av-accent)]" : "text-[var(--av-text-muted)]"
                )}
              >
                {crop.name}
              </span>
            </button>
          ))}
        </div>
      </DarkCard>

      <div className="mt-4">
        <PestDiseaseFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          resultCount={filtered.length}
          placeholder={
            isWeedHub
              ? "खरपतवार का नाम लिखें…"
              : "नाम से खोजें — कीट, रोग…"
          }
        />
      </div>

      {filtered.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((threat) => (
            <ThreatCard key={`${threat.type}-${threat.id}`} threat={threat} />
          ))}
        </div>
      ) : (
        <DarkCard className="mt-4 text-center" delay={1}>
          <p className="text-sm font-semibold text-[var(--av-text-primary)]">कोई परिणाम नहीं</p>
          <p className={`mt-1 ${AV.micro}`}>
            {allThreats.length === 0
              ? `${cropInfo?.name ?? "This crop"} के लिए data उपलब्ध नहीं — दूसरी crop try करें।`
              : "Search या filter बदलें।"}
          </p>
        </DarkCard>
      )}

      <AppLink href="/ai-doctor" className={`mt-4 inline-flex ${AV.btnPrimarySm}`}>
        AI Doctor से photo diagnosis करें →
      </AppLink>
    </AppShell>
  );
}
