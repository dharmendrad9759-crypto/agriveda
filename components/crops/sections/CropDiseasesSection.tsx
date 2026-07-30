"use client";

import RiskBadge from "@/components/shell/RiskBadge";
import AppLink from "@/components/ui/AppLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropFieldGuideDiseaseListForCrop } from "@/lib/crops/cropFieldGuideBridge";
import { getIpmDiseaseListForCrop } from "@/lib/crops/ipmDataBridge";
import { getEnrichedCropThreats } from "@/lib/pest-disease-catalog";
import type { Crop } from "@/types/crop";
import { ChevronRight, Search, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";

export default function CropDiseasesSection({ crop }: { crop: Crop }) {
  const { t, locale } = useLocale();
  const hi = locale === "hi";
  const [search, setSearch] = useState("");

  const ipmDiseases = useMemo(() => getIpmDiseaseListForCrop(crop.slug), [crop.slug]);
  const fieldGuideDiseases = useMemo(
    () => getCropFieldGuideDiseaseListForCrop(crop.slug),
    [crop.slug]
  );
  const catalogDiseases = useMemo(
    () => getEnrichedCropThreats(crop.slug).filter((x) => x.type === "disease"),
    [crop.slug]
  );

  const diseases = fieldGuideDiseases.length
    ? fieldGuideDiseases
    : ipmDiseases.length
      ? ipmDiseases
      : catalogDiseases.map((d) => ({
          id: d.id,
          name: d.name,
          scientific: d.pathogen ?? d.scientificName,
          risk: d.category === "viral" ? ("high" as const) : ("medium" as const),
          type: d.category,
          desc: d.description,
          conditions: d.symptoms[0],
          ipm: {
            prevention: d.remediation.filter((r) => r.startsWith("Prevention")),
            monitoring: [],
            cultural: d.remediation.filter((r) => r.startsWith("Cultural")),
            biological: [],
            chemical: [],
          },
          fracNote: d.fracGroup,
        }));

  const filtered = diseases.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-extrabold text-[var(--av-text-primary)]">
          {t("cropDiseasesTitle")} — {crop.name}
        </h3>
        <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
          {hi
            ? `${diseases.length} रोग · टैप कर विवरण खोलें`
            : `${diseases.length} diseases · tap for detail`}
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--av-text-muted)]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={hi ? "रोग खोजें..." : "Search disease..."}
          className="av-input py-2.5 pl-10"
        />
      </div>

      <ul className="space-y-2">
        {filtered.map((d) => (
          <li key={d.id}>
            <AppLink
              href={`/pest-diseases/${crop.slug}/disease/${d.id}`}
              className="av-card av-card-hover flex items-center gap-3 px-3 py-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                <ShieldAlert className="h-5 w-5 text-red-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-extrabold text-[var(--av-text-primary)]">{d.name}</p>
                  <RiskBadge level={d.risk} />
                </div>
                <p className="mt-0.5 text-[11px] italic text-[var(--av-text-muted)] line-clamp-1">
                  {d.scientific}
                </p>
                {"fracNote" in d && d.fracNote ? (
                  <p className="mt-1 text-[10px] font-semibold text-violet-500">FRAC: {d.fracNote}</p>
                ) : null}
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-[var(--av-text-muted)]" />
            </AppLink>
          </li>
        ))}
      </ul>

      {!filtered.length && (
        <p className="py-6 text-center text-sm text-[var(--av-text-muted)]">
          {hi ? "कोई रोग नहीं मिला" : "No diseases matched"}
        </p>
      )}
    </div>
  );
}
