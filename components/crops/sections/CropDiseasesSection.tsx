"use client";

import RiskBadge from "@/components/shell/RiskBadge";
import AppLink from "@/components/ui/AppLink";
import { DossierSourceBanner } from "@/components/crops/DossierSourceBanner";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropManagementProfile } from "@/data/crop-management";
import { getCropFieldGuideDiseaseListForCrop } from "@/lib/crops/cropFieldGuideBridge";
import { getIpmDiseaseListForCrop } from "@/lib/crops/ipmDataBridge";
import { getEnrichedCropThreats } from "@/lib/pest-disease-catalog";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import type { Crop } from "@/types/crop";
import { ChevronRight, Search, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";

export default function CropDiseasesSection({ crop }: { crop: Crop }) {
  const { t, locale } = useLocale();
  const hi = locale === "hi";
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const profile = useMemo(
    () => getCropManagementProfile(crop.slug) as CropManagementWithDossier | null,
    [crop.slug]
  );
  const dossierMode = Boolean(profile?.dossierSource && profile.diseaseManagement?.length);

  const ipmDiseases = useMemo(() => getIpmDiseaseListForCrop(crop.slug), [crop.slug]);
  const fieldGuideDiseases = useMemo(
    () => getCropFieldGuideDiseaseListForCrop(crop.slug),
    [crop.slug]
  );
  const catalogDiseases = useMemo(
    () => getEnrichedCropThreats(crop.slug).filter((x) => x.type === "disease"),
    [crop.slug]
  );

  const dossierDiseases = useMemo(() => {
    if (!dossierMode || !profile?.diseaseManagement) return [];
    return profile.diseaseManagement.map((d, i) => ({
      id: `dossier-${crop.slug}-dis-${i}`,
      name: d.diseaseName,
      scientific: d.pathogen,
      risk: /virus|वायरस|bacterial wilt/i.test(d.diseaseName + d.type)
        ? ("high" as const)
        : ("medium" as const),
      type: d.type,
      fracNote: d.fracGroup,
      chemical: d.chemicalControl,
      integrated: d.integratedManagement,
      ai: `${d.activeIngredient} · ${d.dose}`,
      conditions: d.favourableConditions.join("; "),
    }));
  }, [crop.slug, dossierMode, profile]);

  const diseases = dossierMode
    ? dossierDiseases
    : fieldGuideDiseases.length
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

  const filtered = diseases.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-3">
      <DossierSourceBanner profile={profile} hi={hi} />
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
        {filtered.map((d) => {
          if (dossierMode && "chemical" in d) {
            const open = openId === d.id;
            return (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : d.id)}
                  className="av-card av-card-hover flex w-full items-start gap-3 px-3 py-3 text-left"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/10">
                    <ShieldAlert className="h-5 w-5 text-rose-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-extrabold text-[var(--av-text-primary)]">{d.name}</p>
                      <RiskBadge level={d.risk} />
                    </div>
                    <p className="mt-0.5 text-[11px] italic text-[var(--av-text-muted)]">{d.scientific}</p>
                    {d.fracNote ? (
                      <p className="mt-1 text-[10px] font-semibold text-[var(--av-accent)]">
                        FRAC: {d.fracNote}
                      </p>
                    ) : null}
                    {open ? (
                      <div className="mt-2 space-y-1 text-[11px] text-[var(--av-text-secondary)]">
                        <p>
                          <span className="font-bold">{hi ? "अनुकूल मौसम: " : "Favours: "}</span>
                          {d.conditions}
                        </p>
                        <p>
                          <span className="font-bold">{hi ? "उदाहरण: " : "Example: "}</span>
                          {d.ai}
                        </p>
                        <ul className="list-disc pl-4">
                          {d.chemical?.map((c) => (
                            <li key={c}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 transition ${open ? "rotate-90" : ""}`} />
                </button>
              </li>
            );
          }

          return (
            <li key={d.id}>
              <AppLink
                href={`/pest-diseases/${crop.slug}/disease/${d.id}`}
                className="av-card av-card-hover flex items-center gap-3 px-3 py-3"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/10">
                  <ShieldAlert className="h-5 w-5 text-rose-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-extrabold text-[var(--av-text-primary)]">{d.name}</p>
                    <RiskBadge level={d.risk} />
                  </div>
                  <p className="mt-0.5 text-[11px] italic text-[var(--av-text-muted)] line-clamp-1">
                    {d.scientific}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--av-text-muted)]" />
              </AppLink>
            </li>
          );
        })}
      </ul>

      {!filtered.length && (
        <p className="py-6 text-center text-sm text-[var(--av-text-muted)]">
          {hi ? "कोई रोग नहीं मिला" : "No diseases matched"}
        </p>
      )}
    </div>
  );
}
