"use client";

import RiskBadge from "@/components/shell/RiskBadge";
import ThreatBrowseCard from "@/components/ui/ThreatBrowseCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { daysAfterSowing } from "@/lib/cropGrowthStage";
import { getCropManagementProfile } from "@/data/crop-management";
import { getCropFieldGuidePestListForCrop } from "@/lib/crops/cropFieldGuideBridge";
import { getIpmPestListForCrop } from "@/lib/crops/ipmDataBridge";
import { formatPestSprayWhen } from "@/lib/crops/simplifyPestEtlHi";
import { getPestSpeciesImage } from "@/lib/pests/threatSpeciesImages";
import {
  matchCatalogThreat,
  threatCardDetailHref,
} from "@/lib/pests/matchCatalogThreat";
import { getEnrichedCropThreats, threatDetailPath } from "@/lib/pest-disease-catalog";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import type { Crop } from "@/types/crop";
import { Search, ShieldAlert, Bug } from "lucide-react";
import { useMemo, useState } from "react";

function pestFieldRisk(
  name: string,
  days: number | null,
  index: number
): "high" | "medium" | "low" {
  const n = name.toLowerCase();
  if (days == null) return index === 0 ? "high" : index < 3 ? "medium" : "low";
  if (/shoot fly|अंकुर|atherigona|cutworm|termite|दीमक/.test(n)) {
    return days < 25 ? "high" : "low";
  }
  if (/armyworm|fall army|फॉल|आर्मी|stem borer|तना छेदक|chilo|scirpophaga/.test(n)) {
    return days >= 20 && days <= 75 ? "high" : "medium";
  }
  if (/aphid|माहू|rhopalosiphum/.test(n)) return days > 45 ? "medium" : "low";
  return index === 0 ? "high" : index < 3 ? "medium" : "low";
}

function pestThumb(
  scientific?: string,
  catalogImage?: string,
  cropSlug?: string,
  threatName?: string
) {
  return (
    getPestSpeciesImage(scientific, cropSlug, threatName) ||
    catalogImage ||
    "/images/threats/threat-insect.jpg"
  );
}

export default function CropPestsSection({ crop }: { crop: Crop }) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const { profile: farmer } = useFarmerProfile();
  const sownDays = farmer.sowingDates?.[crop.slug]
    ? daysAfterSowing(farmer.sowingDates[crop.slug])
    : null;
  const [search, setSearch] = useState("");

  const profile = useMemo(
    () => getCropManagementProfile(crop.slug) as CropManagementWithDossier | null,
    [crop.slug]
  );
  const useRichPests = Boolean(
    profile?.pestManagement?.length &&
      profile.pestManagement.some(
        (p) =>
          p.scientificName &&
          p.scientificName !== "Local pest" &&
          p.pestName !== "Major pest"
      )
  );

  const ipmPests = useMemo(() => getIpmPestListForCrop(crop.slug), [crop.slug]);
  const fieldGuidePests = useMemo(() => getCropFieldGuidePestListForCrop(crop.slug), [crop.slug]);
  const catalogPests = useMemo(
    () => getEnrichedCropThreats(crop.slug).filter((x) => x.type === "pest"),
    [crop.slug]
  );

  const richPests = useMemo(() => {
    if (!useRichPests || !profile?.pestManagement) return [];
    return profile.pestManagement.map((p, i) => {
      const match = matchCatalogThreat(catalogPests, {
        name: p.pestName,
        scientific: p.scientificName,
      });
      const detailHref = threatCardDetailHref(crop.slug, "pest", match, {
        name: p.pestName,
        scientific: p.scientificName,
        index: i,
      });
      return {
        id: match?.id ?? `mp-${i}`,
        detailHref,
        name: p.pestName,
        scientific: p.scientificName,
        etl: p.etl,
        risk: pestFieldRisk(p.pestName, sownDays, i),
        image: pestThumb(p.scientificName, match?.image, crop.slug, p.pestName),
      };
    });
  }, [crop.slug, useRichPests, profile, catalogPests, sownDays]);

  const basePests = useRichPests
    ? richPests
    : fieldGuidePests.length
      ? fieldGuidePests.map((p, i) => ({
          ...p,
          risk: pestFieldRisk(p.name, sownDays, i),
          image: pestThumb(p.scientific, undefined, crop.slug, p.name),
          detailHref: threatDetailPath(crop.slug, "pest", p.id),
        }))
      : ipmPests.length
        ? ipmPests.map((p, i) => ({
            ...p,
            risk: pestFieldRisk(p.name, sownDays, i),
            image: pestThumb(p.scientific, undefined, crop.slug, p.name),
            detailHref: threatDetailPath(crop.slug, "pest", p.id),
          }))
        : catalogPests.map((p, i) => ({
            id: p.id,
            name: p.name,
            scientific: p.scientificName,
            etl: p.etl,
            risk: pestFieldRisk(p.name, sownDays, i),
            image: pestThumb(p.scientificName, p.image, crop.slug, p.name),
            detailHref: threatDetailPath(crop.slug, "pest", p.id),
          }));

  const pests = useMemo(() => {
    const seen = new Set<string>();
    return basePests.filter((p) => {
      const img = "image" in p && p.image ? String(p.image) : "";
      const sciKey = ("scientific" in p ? String(p.scientific ?? "") : "")
        .toLowerCase()
        .split(/[/,(]/)[0]
        .trim();
      const nameKey = p.name.toLowerCase().replace(/\s*\([^)]*\)/g, "").trim();
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
  }, [basePests]);

  const filtered = pests.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      ("scientific" in p && String(p.scientific).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-3.5">
      <div className="flex items-end justify-between gap-3 px-0.5">
        <p className="text-[12px] font-semibold leading-snug text-[var(--av-text-muted)]">
          {hi
            ? `${pests.length} मुख्य कीट`
            : `${pests.length} main pests`}
        </p>
        <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-rose-600/80">
          {hi ? "कीट गाइड" : "Pest guide"}
        </p>
      </div>

      {/* Crop-Specific High-Impact Pest Strategy Card (Technical Kisan Advisory) */}
      {(crop.slug === "maize" || crop.slug === "makka") && (
        <div className="rounded-2xl border-2 border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-transparent p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-700 dark:text-rose-300">
              <Bug className="h-4 w-4" />
            </span>
            <div>
              <h4 className="text-[13px] font-black text-[var(--av-text-primary)]">
                {hi ? "फॉल आर्मीवर्म (FAW) गोफ स्प्रे नियम" : "Fall Armyworm (FAW) Whorl Application"}
              </h4>
              <p className="text-[11px] font-semibold text-[var(--av-text-muted)]">
                {hi
                  ? "सुंडी मक्के के पोंगे/गोफ (Whorl) के अंदर छिपी रहती है—ऊपर फव्वारा मारने से नहीं मरती:"
                  : "Target spray directly into the whorl where the caterpillar feeds:"}
              </p>
            </div>
          </div>
          <div className="mt-2.5 rounded-xl border border-rose-500/25 bg-white/70 p-3 text-xs font-semibold leading-relaxed text-[var(--av-text-secondary)] dark:bg-black/20">
            {hi
              ? "नोजल का मुंह सीधे पौधे के गोफ (Whorl) की तरफ करके इमामेक्टिन बेंजोएट 5% SG (80–100 ग्राम/एकड़) या क्लोरेंट्रानिलिप्रोल 18.5% SC (कोराजन 60 मिली/एकड़) का स्प्रे करें। दवा सीधे गोफ के अंदर जाने पर ही सुंडी तुरंत नष्ट होती है।"
              : "Direct spray nozzle directly down into the leaf whorl using Emamectin Benzoate 5% SG (80-100 g/acre) or Chlorantraniliprole 18.5% SC (60 ml/acre)."}
          </div>
        </div>
      )}

      {(crop.slug === "cotton" || crop.slug === "kapas") && (
        <div className="rounded-2xl border-2 border-rose-500/30 bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-transparent p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-700 dark:text-rose-300">
              <Bug className="h-4 w-4" />
            </span>
            <div>
              <h4 className="text-[13px] font-black text-[var(--av-text-primary)]">
                {hi ? "गुलाबी सुंडी (PBW) व रसचूसक कीट प्रबंधन" : "Pink Bollworm & Sucking Pest Management"}
              </h4>
              <p className="text-[11px] font-semibold text-[var(--av-text-muted)]">
                {hi
                  ? "फूल व टिंडे बनते समय फसल की सुरक्षा के 2 सबसे अहम नियम:"
                  : "Two golden rules during square and boll formation:"}
              </p>
            </div>
          </div>
          <div className="mt-2.5 space-y-2 text-xs font-semibold text-[var(--av-text-secondary)]">
            <div className="rounded-xl border border-rose-500/25 bg-white/70 p-2.5 dark:bg-black/20">
              <span className="font-extrabold text-[var(--av-text-primary)]">
                {hi ? "रसचूसक कीट (सफेद मक्खी / थ्रिप्स): " : "Sucking Pests: "}
              </span>
              {hi
                ? "डायफेनथियुरॉन 50% WP (250 ग्राम/एकड़) का स्प्रे करें। पत्तों के नीचे चिपकी सफेद मक्खी और थ्रिप्स दोनों खत्म होते हैं।"
                : "Spray Diafenthiuron 50% WP (250 g/acre) to control whiteflies and thrips."}
            </div>
            <div className="rounded-xl border border-amber-500/25 bg-white/70 p-2.5 dark:bg-black/20">
              <span className="font-extrabold text-[var(--av-text-primary)]">
                {hi ? "टिंडे झड़ने से रोकना: " : "Prevent Boll Drop: "}
              </span>
              {hi
                ? "फूल व गूलर (कली) बनते समय अल्फा नेफ्थाइल एसिटिक एसिड 4.5 SL (Planofix) 1 मिली प्रति 4.5 लीटर पानी (लगभग 3.5 मिली प्रति 15L पंप, ~30–40 ppm) में मिलाकर स्प्रे करें — टिंडे व फूल गिरना काफी हद तक रुक जाता है।"
                : "Spray Alpha Naphthyl Acetic Acid 4.5 SL (Planofix) 1 ml per 4.5 L water (approx 3.5 ml per 15 L pump, ~30–40 ppm) at flowering/square stage to arrest square and boll drop."}
            </div>
          </div>
        </div>
      )}

      {(crop.slug === "mustard" || crop.slug === "sarson") && (
        <div className="rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300">
              <Bug className="h-4 w-4" />
            </span>
            <div>
              <h4 className="text-[13px] font-black text-[var(--av-text-primary)]">
                {hi ? "माहू (चेपा / Aphid) आर्थिक क्षति स्तर (ETL) व मधुमक्खी सुरक्षा सावधानी" : "Mustard Aphid ETL & Pollinator Safety Protocol"}
              </h4>
              <p className="text-[11px] font-semibold text-[var(--av-text-muted)]">
                {hi
                  ? "जनवरी-फरवरी में बादल छाने पर माहू बढ़ता है — आर्थिक स्तर पार होने पर ही स्प्रे करें:"
                  : "Aphids peak during cloudy winter. Spray only when economic threshold (ETL) is reached:"}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-[var(--av-text-secondary)]">
            {hi
              ? "जब 20% पौधों पर मुख्य तने के ऊपरी 10 सेमी भाग में 50–60 माहू दिखने लगें (ETL स्तर), तभी स्प्रे करें। इमिडाक्लोप्रिड 17.8% SL (50–60 मिली/एकड़) या थायमेथोक्साम 25% WG (80 ग्राम/एकड़) 150 लीटर पानी में मिलाकर डालें। जरूरी परागण सुरक्षा: सरसों में फलियां बनने के लिए मधुमक्खियाँ अनिवार्य हैं (ये कीटनाशक मधुमक्खियों के लिए विषैले हैं), इसलिए स्प्रे हमेशा शाम 4 बजे के बाद ही करें जब मधुमक्खियों का भ्रमण बंद हो चुका हो।"
              : "Spray only when ETL is reached (20% infested plants with 50–60 aphids per 10 cm of central shoot). Apply Imidacloprid 17.8% SL (50–60 ml/acre) or Thiamethoxam 25% WG (80 g/acre) in 150 L water. Pollinator safety warning: Bees are vital for mustard pod set (these insecticides are toxic to pollinators); spray strictly late in the afternoon/evening (after 4 PM) when bee foraging stops."}
          </p>
        </div>
      )}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9A91]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={hi ? "कीट का नाम लिखो…" : "Search pest…"}
          className="w-full rounded-2xl border border-[#DCE8E0] bg-white py-3 pl-12 pr-4 text-[14px] font-medium text-[#12281C] shadow-[0_8px_22px_-14px_rgba(11,61,40,0.35)] outline-none placeholder:text-[#8A9A91] focus:border-emerald-700/35 focus:ring-2 focus:ring-emerald-700/15"
        />
      </div>

      <ul className="space-y-3">
        {filtered.map((pest, i) => {
          const href =
            "detailHref" in pest && pest.detailHref
              ? String(pest.detailHref)
              : threatDetailPath(crop.slug, "pest", pest.id);
          const img =
            "image" in pest && pest.image
              ? String(pest.image)
              : pestThumb(
                  "scientific" in pest ? String(pest.scientific) : undefined,
                  undefined,
                  crop.slug,
                  pest.name
                );
          const sci = "scientific" in pest ? String(pest.scientific) : "";
          const etl = "etl" in pest && pest.etl ? String(pest.etl) : "";
          const sprayWhen = etl ? formatPestSprayWhen(etl, hi) : "";
          return (
            <li key={pest.id}>
              <ThreatBrowseCard
                index={i + 1}
                title={pest.name}
                image={img}
                href={href}
                accent="pest"
                threatCategory="insect"
                riskChip={<RiskBadge level={pest.risk} hi={hi} />}
                tipLine={sprayWhen || undefined}
                openHint={hi ? "लक्षण व सही दवा देखें" : "Symptoms & Medicine"}
              />
            </li>
          );
        })}
      </ul>

      {!filtered.length && (
        <p className="rounded-2xl border border-dashed border-[#D8E8DE] bg-white/70 px-4 py-6 text-center text-sm text-[#7A8B82]">
          {hi ? "कोई कीट नहीं मिला" : "No pests found"}
        </p>
      )}
    </div>
  );
}
