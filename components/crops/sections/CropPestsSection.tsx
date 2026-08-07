"use client";

import RiskBadge from "@/components/shell/RiskBadge";
import AppLink from "@/components/ui/AppLink";
import CropSprayMedicineList from "@/components/crops/CropSprayMedicineList";
import ThreatImage from "@/components/ui/ThreatImage";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropManagementProfile } from "@/data/crop-management";
import { getCropFieldGuidePestListForCrop } from "@/lib/crops/cropFieldGuideBridge";
import { getIpmPestListForCrop } from "@/lib/crops/ipmDataBridge";
import { buildSprayProductCards } from "@/lib/crops/sprayProductCards";
import { getPestSpeciesImage } from "@/lib/pests/threatSpeciesImages";
import { getEnrichedCropThreats } from "@/lib/pest-disease-catalog";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import type { CropSprayProduct } from "@/types/crop-management";
import type { Crop } from "@/types/crop";
import { ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

function pestThumb(scientific?: string, catalogImage?: string) {
  return (
    getPestSpeciesImage(scientific) ||
    catalogImage ||
    "/images/threats/threat-insect.jpg"
  );
}

export default function CropPestsSection({ crop }: { crop: Crop }) {
  const { t, locale } = useLocale();
  const hi = locale === "hi";
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const profile = useMemo(
    () => getCropManagementProfile(crop.slug) as CropManagementWithDossier | null,
    [crop.slug]
  );
  const useRichPests = Boolean(profile?.pestManagement?.length);

  const ipmPests = useMemo(() => getIpmPestListForCrop(crop.slug), [crop.slug]);
  const fieldGuidePests = useMemo(() => getCropFieldGuidePestListForCrop(crop.slug), [crop.slug]);
  const catalogPests = useMemo(
    () => getEnrichedCropThreats(crop.slug).filter((x) => x.type === "pest"),
    [crop.slug]
  );

  const richPests = useMemo(() => {
    if (!useRichPests || !profile?.pestManagement) return [];
    return profile.pestManagement.map((p, i) => {
      const match = catalogPests.find(
        (c) =>
          c.scientificName?.toLowerCase() === p.scientificName?.toLowerCase() ||
          c.name.toLowerCase().includes(p.pestName.toLowerCase().slice(0, 10))
      );
      return {
        id: `${crop.slug}-pest-${i}`,
        name: p.pestName,
        scientific: p.scientificName,
        etl: p.etl,
        risk: "high" as const,
        biological: p.biologicalControl,
        symptoms: p.symptoms,
        identification: p.identification,
        image: pestThumb(p.scientificName, match?.image),
        products: buildSprayProductCards(p.sprayProducts, p.chemicalControl, hi) as CropSprayProduct[],
      };
    });
  }, [crop.slug, useRichPests, profile, hi, catalogPests]);

  const pests = useRichPests
    ? richPests
    : fieldGuidePests.length
      ? fieldGuidePests
      : ipmPests.length
        ? ipmPests
        : catalogPests.map((p) => ({
            id: p.id,
            name: p.name,
            scientific: p.scientificName,
            desc: p.description,
            damage: p.symptoms[0]?.slice(0, 60) ?? "—",
            spread: p.stage ?? "—",
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
      ("scientific" in p && String(p.scientific).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-extrabold text-[var(--av-text-primary)]">
          {t("cropPestsTitle")} — {crop.name}
        </h3>
        <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
          {hi
            ? `${pests.length} मुख्य कीट · टैप कर दवा कार्ड खोलें`
            : `${pests.length} major pests · tap for medicine cards`}
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
        {filtered.map((pest) => {
          if (useRichPests && "products" in pest) {
            const open = openId === pest.id;
            return (
              <li key={pest.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : pest.id)}
                  className="av-card av-card-hover flex w-full items-start gap-3 px-3 py-3 text-left"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]">
                    <ThreatImage
                      src={"image" in pest ? pest.image : undefined}
                      alt={pest.name}
                      category="insect"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-extrabold text-[var(--av-text-primary)]">{pest.name}</p>
                      <RiskBadge level={pest.risk} />
                    </div>
                    <p className="mt-0.5 text-[11px] italic text-[var(--av-text-muted)]">{pest.scientific}</p>
                    <p className="mt-1 text-[10px] font-semibold text-[var(--av-accent)]">
                      ETL: {pest.etl}
                    </p>
                    {open ? (
                      <div className="mt-2 space-y-2 text-[11px] text-[var(--av-text-secondary)]">
                        {"image" in pest && pest.image ? (
                          <div className="overflow-hidden rounded-xl border border-[var(--av-border)]">
                            <ThreatImage
                              src={pest.image}
                              alt={pest.name}
                              category="insect"
                              className="h-36 w-full object-cover sm:h-40"
                            />
                          </div>
                        ) : null}
                        <p>
                          <span className="font-bold">{hi ? "पहचान: " : "ID: "}</span>
                          {pest.identification}
                        </p>
                        <p>
                          <span className="font-bold">{hi ? "लक्षण: " : "Symptoms: "}</span>
                          {pest.symptoms?.join("; ")}
                        </p>
                        <CropSprayMedicineList products={pest.products} hi={hi} />
                      </div>
                    ) : (
                      <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">
                        {hi
                          ? `${pest.products.length} दवा विकल्प · खोलें`
                          : `${pest.products.length} spray options · open`}
                      </p>
                    )}
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 transition ${open ? "rotate-90" : ""}`} />
                </button>
              </li>
            );
          }

          return (
            <li key={pest.id}>
              <AppLink
                href={`/pest-diseases/${crop.slug}/pest/${pest.id}`}
                className="av-card av-card-hover flex items-center gap-3 px-3 py-3"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]">
                  <ThreatImage
                    src={
                      "image" in pest
                        ? String(pest.image)
                        : pestThumb(
                            "scientific" in pest ? String(pest.scientific) : undefined
                          )
                    }
                    alt={pest.name}
                    category="insect"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-extrabold text-[var(--av-text-primary)]">{pest.name}</p>
                    <RiskBadge level={pest.risk} />
                  </div>
                  <p className="mt-0.5 text-[11px] italic text-[var(--av-text-muted)] line-clamp-1">
                    {pest.scientific}
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
          {hi ? "कोई कीट नहीं मिला" : "No pests matched"}
        </p>
      )}
    </div>
  );
}
