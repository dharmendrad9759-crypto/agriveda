"use client";

import RiskBadge from "@/components/shell/RiskBadge";
import AppLink from "@/components/ui/AppLink";
import CropSprayMedicineList from "@/components/crops/CropSprayMedicineList";
import ThreatImage from "@/components/ui/ThreatImage";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropManagementProfile } from "@/data/crop-management";
import { getCropFieldGuideDiseaseListForCrop } from "@/lib/crops/cropFieldGuideBridge";
import { getIpmDiseaseListForCrop } from "@/lib/crops/ipmDataBridge";
import { buildSprayProductCards } from "@/lib/crops/sprayProductCards";
import { getDiseaseSpeciesImage } from "@/lib/pests/threatSpeciesImages";
import { getEnrichedCropThreats } from "@/lib/pest-disease-catalog";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import type { CropSprayProduct } from "@/types/crop-management";
import type { Crop } from "@/types/crop";
import { ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

function diseaseThumb(pathogen?: string, catalogImage?: string) {
  return (
    getDiseaseSpeciesImage(pathogen) ||
    catalogImage ||
    "/images/threats/threat-disease.jpg"
  );
}

export default function CropDiseasesSection({ crop }: { crop: Crop }) {
  const { t, locale } = useLocale();
  const hi = locale === "hi";
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const profile = useMemo(
    () => getCropManagementProfile(crop.slug) as CropManagementWithDossier | null,
    [crop.slug]
  );
  const useRichDiseases = Boolean(profile?.diseaseManagement?.length);

  const ipmDiseases = useMemo(() => getIpmDiseaseListForCrop(crop.slug), [crop.slug]);
  const fieldGuideDiseases = useMemo(
    () => getCropFieldGuideDiseaseListForCrop(crop.slug),
    [crop.slug]
  );
  const catalogDiseases = useMemo(
    () => getEnrichedCropThreats(crop.slug).filter((x) => x.type === "disease"),
    [crop.slug]
  );

  const richDiseases = useMemo(() => {
    if (!useRichDiseases || !profile?.diseaseManagement) return [];
    return profile.diseaseManagement.map((d, i) => {
      const match = catalogDiseases.find(
        (c) =>
          (c.pathogen && c.pathogen.toLowerCase() === d.pathogen?.toLowerCase()) ||
          c.name.toLowerCase().includes(d.diseaseName.toLowerCase().slice(0, 10))
      );
      return {
        id: `${crop.slug}-dis-${i}`,
        name: d.diseaseName,
        scientific: d.pathogen,
        risk: /virus|वायरस|bacterial wilt|टंग्रो/i.test(d.diseaseName + d.type)
          ? ("high" as const)
          : ("medium" as const),
        type: d.type,
        integrated: d.integratedManagement,
        conditions: d.favourableConditions.join("; "),
        symptoms: d.symptoms,
        image: diseaseThumb(d.pathogen, match?.image),
        products: buildSprayProductCards(d.sprayProducts, d.chemicalControl, hi) as CropSprayProduct[],
      };
    });
  }, [crop.slug, useRichDiseases, profile, hi, catalogDiseases]);

  const diseases = useRichDiseases
    ? richDiseases
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
          }));

  const filtered = diseases.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-extrabold text-[var(--av-text-primary)]">
          {t("cropDiseasesTitle")} — {crop.name}
        </h3>
        <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
          {hi
            ? `${diseases.length} रोग · टैप कर दवा कार्ड खोलें`
            : `${diseases.length} diseases · tap for medicine cards`}
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
          if (useRichDiseases && "products" in d) {
            const open = openId === d.id;
            return (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : d.id)}
                  className="av-card av-card-hover flex w-full items-start gap-3 px-3 py-3 text-left"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]">
                    <ThreatImage
                      src={"image" in d ? d.image : undefined}
                      alt={d.name}
                      category="fungal"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-extrabold text-[var(--av-text-primary)]">{d.name}</p>
                      <RiskBadge level={d.risk} />
                    </div>
                    <p className="mt-0.5 text-[11px] italic text-[var(--av-text-muted)]">{d.scientific}</p>
                    {d.type ? (
                      <p className="mt-1 text-[10px] font-semibold text-[var(--av-accent)]">{d.type}</p>
                    ) : null}
                    {open ? (
                      <div className="mt-2 space-y-2 text-[11px] text-[var(--av-text-secondary)]">
                        {"image" in d && d.image ? (
                          <div className="overflow-hidden rounded-xl border border-[var(--av-border)]">
                            <ThreatImage
                              src={d.image}
                              alt={d.name}
                              category="fungal"
                              className="h-36 w-full object-cover sm:h-40"
                            />
                          </div>
                        ) : null}
                        <p>
                          <span className="font-bold">{hi ? "लक्षण: " : "Symptoms: "}</span>
                          {d.symptoms?.join("; ")}
                        </p>
                        <p>
                          <span className="font-bold">{hi ? "अनुकूल मौसम: " : "Favours: "}</span>
                          {d.conditions}
                        </p>
                        <CropSprayMedicineList products={d.products} hi={hi} />
                      </div>
                    ) : (
                      <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
                        {hi
                          ? `${d.products.length} दवा विकल्प · खोलें`
                          : `${d.products.length} spray options · open`}
                      </p>
                    )}
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
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]">
                  <ThreatImage
                    src={
                      "image" in d
                        ? String(d.image)
                        : diseaseThumb(
                            "scientific" in d ? String(d.scientific) : undefined
                          )
                    }
                    alt={d.name}
                    category="fungal"
                    className="h-full w-full object-cover"
                  />
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
