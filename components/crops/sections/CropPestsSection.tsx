"use client";

import RiskBadge from "@/components/shell/RiskBadge";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropFieldGuidePestListForCrop } from "@/lib/crops/cropFieldGuideBridge";
import { getIpmPestListForCrop } from "@/lib/crops/ipmDataBridge";
import { getEnrichedCropThreats } from "@/lib/pest-disease-catalog";
import type { Crop } from "@/types/crop";
import { Bug, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function CropPestsSection({ crop }: { crop: Crop }) {
  const { t, locale } = useLocale();
  const hi = locale === "hi";
  const [search, setSearch] = useState("");

  const ipmPests = useMemo(() => getIpmPestListForCrop(crop.slug), [crop.slug]);
  const fieldGuidePests = useMemo(() => getCropFieldGuidePestListForCrop(crop.slug), [crop.slug]);
  const catalogPests = useMemo(
    () => getEnrichedCropThreats(crop.slug).filter((x) => x.type === "pest"),
    [crop.slug]
  );

  const pests = fieldGuidePests.length
    ? fieldGuidePests
    : ipmPests.length
      ? ipmPests
      : catalogPests.map((p) => ({
          id: p.id,
          name: p.name,
          scientific: p.scientificName,
          desc: p.description,
          damage: p.symptoms[0]?.slice(0, 60) ?? "—",
          spread: p.iracGroup ?? "—",
          loss: "Yield loss if untreated",
          etl: p.etl,
          attackStage: p.stage,
          monitoring: "Weekly scout",
          risk: "high" as const,
          ipm: {
            prevention: p.remediation.filter((r) => r.startsWith("Prevention")),
            monitoring: p.remediation.filter((r) => r.startsWith("Monitoring")),
            cultural: p.remediation.filter((r) => r.startsWith("Cultural")),
            biological: p.remediation.filter((r) => r.startsWith("Biological")),
            chemical: [],
          },
        }));

  const filtered = pests.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.scientific.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-extrabold text-[var(--av-text-primary)]">
          {t("cropPestsTitle")} — {crop.name}
        </h3>
        <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
          {hi
            ? `${pests.length} मुख्य कीट · टैप कर विवरण खोलें`
            : `${pests.length} major pests · tap for detail`}
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={hi ? "कीट खोजें..." : "Search pest..."}
          className="av-input py-2.5 pl-10"
        />
      </div>

      <ul className="space-y-2">
        {filtered.map((pest) => (
          <li key={pest.id}>
            <AppLink
              href={`/pest-diseases/${crop.slug}/pest/${pest.id}`}
              className="av-card av-card-hover flex items-center gap-3 px-3 py-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
                <Bug className="h-5 w-5 text-orange-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-extrabold text-[var(--av-text-primary)]">{pest.name}</p>
                  <RiskBadge level={pest.risk} />
                </div>
                <p className="mt-0.5 text-[11px] italic text-[var(--av-text-muted)] line-clamp-1">
                  {pest.scientific}
                </p>
                {pest.attackStage ? (
                  <p className="mt-1 text-[10px] font-semibold text-[var(--av-accent)]">
                    {hi ? "अवस्था" : "Stage"}: {pest.attackStage}
                    {pest.etl ? ` · ETL: ${pest.etl}` : ""}
                  </p>
                ) : null}
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-[var(--av-text-muted)]" />
            </AppLink>
          </li>
        ))}
      </ul>

      {!filtered.length && (
        <p className="py-6 text-center text-sm text-[var(--av-text-muted)]">
          {hi ? "कोई कीट नहीं मिला" : "No pests matched"}
        </p>
      )}
    </div>
  );
}
