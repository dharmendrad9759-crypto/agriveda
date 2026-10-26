"use client";

import RiskBadge from "@/components/shell/RiskBadge";
import ThreatBrowseCard from "@/components/ui/ThreatBrowseCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { getCropManagementProfile } from "@/data/crop-management";
import { getCropFieldGuideDiseaseListForCrop } from "@/lib/crops/cropFieldGuideBridge";
import { getIpmDiseaseListForCrop } from "@/lib/crops/ipmDataBridge";
import { getDiseaseSpeciesImage } from "@/lib/pests/threatSpeciesImages";
import {
  matchCatalogThreat,
  threatCardDetailHref,
} from "@/lib/pests/matchCatalogThreat";
import { getEnrichedCropThreats, threatDetailPath } from "@/lib/pest-disease-catalog";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import type { Crop } from "@/types/crop";
import { Search, ShieldAlert, AlertTriangle } from "lucide-react";
import { useMemo, useState } from "react";

function diseaseThumb(
  pathogen?: string,
  catalogImage?: string,
  cropSlug?: string,
  threatName?: string
) {
  return (
    getDiseaseSpeciesImage(pathogen, cropSlug, threatName) ||
    catalogImage ||
    "/images/threats/threat-disease.jpg"
  );
}

function pathogenTypeLabel(raw: string | undefined, hi: boolean): string {
  if (!raw?.trim()) return "";
  const t = raw.trim();
  if (/virus|वायरस|viral|टंग्रो|tungro/i.test(t))
    return hi ? "वायरस (Virus)" : "Virus";
  if (/bacter|जीवाणु|blb|bacterial/i.test(t))
    return hi ? "जीवाणु (Bacteria)" : "Bacteria";
  if (/fung|कवक|blast|smut|blight|spot/i.test(t))
    return hi ? "फफूंद (Fungus)" : "Fungus";
  if (hi) {
    if (/कवक|फफूंद/.test(t)) return "फफूंद (Fungus)";
    if (/जीवाणु/.test(t)) return "जीवाणु (Bacteria)";
    if (/वायरस/.test(t)) return "वायरस (Virus)";
  }
  return t;
}

function diseaseThreatCategory(type?: string): "fungal" | "bacterial" | "viral" {
  const t = type ?? "";
  if (/virus|वायरस|viral|टंग्रो|tungro/i.test(t)) return "viral";
  if (/bacter|जीवाणु/i.test(t)) return "bacterial";
  return "fungal";
}

export default function CropDiseasesSection({ crop }: { crop: Crop }) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const [search, setSearch] = useState("");

  const profile = useMemo(
    () => getCropManagementProfile(crop.slug) as CropManagementWithDossier | null,
    [crop.slug]
  );
  const useRichDiseases = Boolean(
    profile?.diseaseManagement?.length &&
      profile.diseaseManagement.some(
        (d) =>
          d.pathogen &&
          d.pathogen !== "Follow diagnosis" &&
          d.diseaseName !== "Major disease"
      )
  );

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
      const match = matchCatalogThreat(catalogDiseases, {
        name: d.diseaseName,
        scientific: d.pathogen,
      });
      const detailHref = threatCardDetailHref(crop.slug, "disease", match, {
        name: d.diseaseName,
        scientific: d.pathogen,
        index: i,
      });
      return {
        id: match?.id ?? `md-${i}`,
        detailHref,
        name: d.diseaseName,
        scientific: d.pathogen,
        risk: /virus|वायरस|bacterial wilt|टंग्रो|tungro/i.test(d.diseaseName + d.type)
          ? ("high" as const)
          : ("medium" as const),
        type: d.type,
        image: diseaseThumb(
          d.pathogen ?? match?.pathogen ?? undefined,
          match?.image,
          crop.slug,
          d.diseaseName
        ),
      };
    });
  }, [crop.slug, useRichDiseases, profile, catalogDiseases]);

  const baseDiseases = useRichDiseases
    ? richDiseases
    : fieldGuideDiseases.length
      ? fieldGuideDiseases.map((d) => ({
          ...d,
          image: diseaseThumb(d.scientific, undefined, crop.slug, d.name),
          detailHref: threatDetailPath(crop.slug, "disease", d.id),
        }))
      : ipmDiseases.length
        ? ipmDiseases.map((d) => ({
            ...d,
            image: diseaseThumb(d.scientific, undefined, crop.slug, d.name),
            detailHref: threatDetailPath(crop.slug, "disease", d.id),
          }))
        : catalogDiseases.map((d) => ({
            id: d.id,
            name: d.name,
            scientific: d.pathogen ?? d.scientificName,
            risk: d.category === "viral" ? ("high" as const) : ("medium" as const),
            type: d.category,
            image: diseaseThumb(d.pathogen, d.image, crop.slug, d.name),
            detailHref: threatDetailPath(crop.slug, "disease", d.id),
          }));

  const diseases = useMemo(() => {
    const seen = new Set<string>();
    return baseDiseases.filter((d) => {
      const img = "image" in d && d.image ? String(d.image) : "";
      const sciKey = ("scientific" in d ? String(d.scientific ?? "") : "")
        .toLowerCase()
        .split(/[/,(]/)[0]
        .trim();
      const nameKey = d.name.toLowerCase().replace(/\s*\([^)]*\)/g, "").trim();
      if (img.startsWith("/images/crop-identification/") && seen.has(`img:${img}`)) {
        return false;
      }
      if (sciKey.length >= 5 && seen.has(`sci:${sciKey}`)) {
        return false;
      }
      if (nameKey && seen.has(`name:${nameKey}`)) {
        return false;
      }
      if (img.startsWith("/images/crop-identification/")) seen.add(`img:${img}`);
      if (sciKey.length >= 5) seen.add(`sci:${sciKey}`);
      if (nameKey) seen.add(`name:${nameKey}`);
      return true;
    });
  }, [baseDiseases]);

  const filtered = diseases.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      ("scientific" in d && String(d.scientific ?? "").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-3.5">
      <div className="flex items-end justify-between gap-3 px-0.5">
        <p className="text-[12px] font-semibold leading-snug text-[var(--av-text-muted)]">
          {hi
            ? `${diseases.length} रोग`
            : `${diseases.length} diseases`}
        </p>
        <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700/80">
          {hi ? "रोग गाइड" : "Disease guide"}
        </p>
      </div>

      {/* Crop-Specific High-Impact Strategy Card (Technical Kisan Advisory) */}
      {(crop.slug === "potato" || crop.slug === "tomato") && (
        <div className="rounded-2xl border-2 border-red-500/30 bg-gradient-to-br from-red-500/10 via-amber-500/5 to-transparent p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/20 text-red-700 dark:text-red-300">
              <ShieldAlert className="h-4 w-4" />
            </span>
            <div>
              <h4 className="text-[13px] font-black text-[var(--av-text-primary)]">
                {hi ? "झुलसा (Blight) का 2-चरणीय रक्षा चक्र" : "Blight 2-Stage Defense Protocol"}
              </h4>
              <p className="text-[11px] font-semibold text-[var(--av-text-muted)]">
                {hi
                  ? "48 घंटे में पूरी फसल जलने से बचाने के लिए सही समय पर सही दवा चुनें:"
                  : "Prevent total crop burnout by spraying the right fungicide at the right time:"}
              </p>
            </div>
          </div>

          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            <div className="rounded-xl border border-amber-500/30 bg-white/70 p-3 dark:bg-black/20">
              <span className="inline-block rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-black uppercase text-amber-800 dark:text-amber-200">
                {hi ? "1. सुरक्षात्मक (Preventive)" : "1. Preventive"}
              </span>
              <p className="mt-1 text-xs font-bold text-[var(--av-text-primary)]">
                {hi ? "रोग आने से पहले (कोहरा/बादल छाने पर)" : "Before disease appears"}
              </p>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-[var(--av-text-secondary)]">
                {hi
                  ? "मैंकोज़ेब 75% WP (600 ग्राम/एकड़) या प्रोपिनेब (एंट्राकोल 600 ग्राम)। यह पत्तियों पर सुरक्षा कवच बनाता है।"
                  : "Mancozeb 75% WP (600 g/acre) or Propineb 70% WP (600 g). Forms a protective coat."}
              </p>
            </div>

            <div className="rounded-xl border border-red-500/30 bg-white/70 p-3 dark:bg-black/20">
              <span className="inline-block rounded-md bg-red-500/15 px-2 py-0.5 text-[10px] font-black uppercase text-red-800 dark:text-red-200">
                {hi ? "2. उपचारात्मक (Curative)" : "2. Curative"}
              </span>
              <p className="mt-1 text-xs font-bold text-[var(--av-text-primary)]">
                {hi ? "काले-भूरे धब्बे दिखते ही (तुरंत)" : "Immediately upon seeing black spots"}
              </p>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-[var(--av-text-secondary)]">
                {hi
                  ? "साइमोक्सानिल + मैंकोज़ेब (कर्जेट 600 ग्राम) या फेनामिडोन + मैंकोज़ेब (सेक्टिन 600 ग्राम) 24 घंटे में स्प्रे करें।"
                  : "Cymoxanil + Mancozeb (600 g) or Fenamidone + Mancozeb (600 g) within 24 hours."}
              </p>
            </div>
          </div>
        </div>
      )}

      {(crop.slug === "mustard" || crop.slug === "sarson") && (
        <div className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent p-3.5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300">
              <ShieldAlert className="h-4 w-4" />
            </span>
            <div>
              <h4 className="text-[13px] font-black text-[var(--av-text-primary)]">
                {hi ? "सफेद रतुआ (White Rust) व डाउनी मिल्ड्यू अलर्ट" : "White Rust & Downy Mildew Alert"}
              </h4>
              <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-[var(--av-text-secondary)]">
                {hi
                  ? "फूल खिलते समय फव्वारा सिंचाई न करें (नमी से सफेद फफोले फैलते हैं)। रोकथाम के लिए मैंकोज़ेब 75% WP (600 ग्राम/एकड़ 200 लीटर पानी) या लक्षण दिखते ही मेटलैक्टिल 8% + मैंकोज़ेब 64% WP (500 ग्राम/एकड़) का स्प्रे करें।"
                  : "Avoid overhead sprinkler at flowering. Spray Mancozeb 75% WP (600g/acre in 200L water) or Metalaxyl 8% + Mancozeb 64% WP (500g/acre) at first sign of white pustules."}
              </p>
            </div>
          </div>
        </div>
      )}

      {(crop.slug === "sugarcane" || crop.slug === "ganna") && (
        <div className="rounded-2xl border-2 border-red-500/30 bg-gradient-to-br from-red-500/10 via-amber-500/5 to-transparent p-3.5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/20 text-red-700 dark:text-red-300">
              <ShieldAlert className="h-4 w-4" />
            </span>
            <div>
              <h4 className="text-[13px] font-black text-[var(--av-text-primary)]">
                {hi ? "लाल सड़न (Red Rot) व पोक्का बोइंग सुरक्षा" : "Red Rot & Pokkah Boeng Strategy"}
              </h4>
              <p className="mt-0.5 text-[11px] font-medium leading-relaxed text-[var(--av-text-secondary)]">
                {hi
                  ? "तने को चीरने पर यदि गूदा लाल और एल्कोहल जैसी गंध आए, तो वह लाल सड़न है—तुरंत उस थान को उखाड़कर जलाएं। पोक्का बोइंग (ऊपर की पत्तियाँ ऐंठन व सड़न) पर कॉपर ऑक्सीक्लोराइड 500 ग्राम/एकड़ (200 लीटर पानी में) या कार्बेन्डाजिम 250 ग्राम/एकड़ का स्प्रे करें।"
                  : "Discard and burn plants with red internal stalk tissues. Spray Copper Oxychloride 500g/acre (in 200L water) or Carbendazim 250g/acre for Pokkah Boeng leaf twisting."}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9A91]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={hi ? "रोग का नाम लिखो…" : "Search disease…"}
          className="w-full rounded-2xl border border-[#DCE8E0] bg-white py-3 pl-12 pr-4 text-[14px] font-medium text-[#12281C] shadow-[0_8px_22px_-14px_rgba(11,61,40,0.35)] outline-none placeholder:text-[#8A9A91] focus:border-emerald-700/35 focus:ring-2 focus:ring-emerald-700/15"
        />
      </div>

      <ul className="space-y-3">
        {filtered.map((d, i) => {
          const href =
            "detailHref" in d && d.detailHref
              ? String(d.detailHref)
              : threatDetailPath(crop.slug, "disease", d.id);
          const img =
            "image" in d && d.image
              ? String(d.image)
              : diseaseThumb(
                  "scientific" in d ? String(d.scientific) : undefined,
                  undefined,
                  crop.slug,
                  d.name
                );
          const sci = "scientific" in d ? String(d.scientific ?? "") : "";
          const typeRaw = "type" in d && d.type ? String(d.type) : "";
          const typeLabel = pathogenTypeLabel(typeRaw || sci || d.name, hi);
          return (
            <li key={d.id}>
              <ThreatBrowseCard
                index={i + 1}
                title={d.name}
                image={img}
                href={href}
                accent="disease"
                threatCategory={diseaseThreatCategory(typeRaw || d.name)}
                riskChip={<RiskBadge level={d.risk} hi={hi} />}
                typeChip={
                  typeLabel ? (
                    <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-950">
                      {typeLabel}
                    </span>
                  ) : null
                }
                openHint={hi ? "लक्षण व सही दवा देखें" : "Symptoms & Medicine"}
              />
            </li>
          );
        })}
      </ul>

      {!filtered.length && (
        <p className="rounded-2xl border border-dashed border-[#D8E8DE] bg-white/70 px-4 py-6 text-center text-sm text-[#7A8B82]">
          {hi ? "कोई रोग नहीं मिला" : "No diseases found"}
        </p>
      )}
    </div>
  );
}
