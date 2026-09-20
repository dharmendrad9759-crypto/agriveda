"use client";

import { getCropManagementProfile } from "@/data/crop-management";
import { getWeedProgramForCrop } from "@/lib/crops/weedAbioticBridge";
import { getCropPestDisease } from "@/data/pest-disease";
import AppLink from "@/components/ui/AppLink";
import CropSprayMedicineList from "@/components/crops/CropSprayMedicineList";
import FarmerSplitCard from "@/components/ui/FarmerSplitCard";
import ThreatImage from "@/components/ui/ThreatImage";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { weedDisplayName } from "@/lib/crops/weedNamesHi";
import { getCropHindiName } from "@/lib/crops/crop-display";
import { resolveCropImage } from "@/lib/crops/cropImages";
import { threatDetailPath } from "@/lib/pest-disease-catalog";
import {
  getCropWeedFieldGuide,
  weedCategoryLabelHi,
  WEED_GLOBAL_PRINCIPLES_HI,
  type HerbicideOption,
  type WeedIdEntry,
  type WeedLeafCategory,
} from "@/lib/crops/weedFieldDoctorGuide";
import {
  getWeedCardImage,
  getWeedStageImages,
  normalizeScientificName,
} from "@/lib/weeds/weedStageImages";
import type { CropManagementWithDossier } from "@/types/crop-dossier";
import type { CropSprayProduct } from "@/types/crop-management";
import type { Crop } from "@/types/crop";
import {
  farmerWeedHi,
  farmerWeedTipPointsHi,
  farmerWeedTipTitleHi,
} from "@/lib/crops/simplifyWeedHi";
import { cn } from "@/lib/cn";
import {
  AlertTriangle,
  ChevronDown,
  Clock3,
  Droplets,
  Leaf,
  Lightbulb,
  ShowerHead,
  Sparkles,
  Sprout,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState, type ReactNode } from "react";

const WEED_FALLBACK = "/images/threats/threat-weed.jpg";

function extractBinomial(raw?: string | null): string {
  const s = (raw || "").trim();
  if (!s) return "";
  const paren = s.match(/\(([A-Z][a-z]+(?:\s+(?:spp\.|[a-z.-]+))?)\)/);
  if (paren?.[1]) return paren[1];
  if (/^[A-Z][a-z]+\s+[a-z.-]+/.test(s) || /^[A-Z][a-z]+\s+spp\./i.test(s)) {
    return s.split(/[;·,]/)[0]!.trim();
  }
  return s;
}

function weedThumb(
  scientificName?: string | null,
  localHi?: string | null,
  catalogImage?: string | null
): string {
  return (
    getWeedCardImage(scientificName, localHi) ||
    catalogImage ||
    WEED_FALLBACK
  );
}

function WeedStageStrip({
  scientificName,
  localHi,
  hi,
  large,
}: {
  scientificName?: string | null;
  localHi?: string | null;
  hi: boolean;
  large?: boolean;
}) {
  const stages = getWeedStageImages(scientificName, localHi);
  const early = stages?.early ?? weedThumb(scientificName, localHi);
  const late = stages?.late ?? early;

  return (
    <div className={cn("mt-2", large && "mt-3")}>
      <p className="mb-1.5 text-[10px] font-bold tracking-wide text-emerald-800/70">
        {hi ? "दो अवस्था — पहचान फोटो" : "2 stages — ID photos"}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {(
          [
            { key: "early", src: early, labelHi: "छोटा पौधा", labelEn: "Young" },
            { key: "late", src: late, labelHi: "बड़ा पौधा", labelEn: "Grown" },
          ] as const
        ).map((s) => (
          <div
            key={s.key}
            className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-emerald-50/40 shadow-[0_8px_20px_-14px_rgba(6,78,59,0.45)]"
          >
            <div className={cn("w-full", large ? "aspect-[5/4]" : "aspect-[4/3]")}>
              <ThreatImage
                src={s.src}
                alt={hi ? s.labelHi : s.labelEn}
                category="weed"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="bg-white/90 px-2 py-1.5 text-center text-[10px] font-bold text-emerald-900">
              {hi ? s.labelHi : s.labelEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const CAT_ORDER: WeedLeafCategory[] = [
  "grass",
  "broadleaf",
  "sedge",
  "parasitic",
  "shrub",
];

const CAT_CHIP: Record<WeedLeafCategory, string> = {
  grass: "from-lime-600 to-emerald-700",
  broadleaf: "from-teal-600 to-cyan-800",
  sedge: "from-amber-600 to-orange-700",
  parasitic: "from-rose-600 to-red-800",
  shrub: "from-stone-600 to-stone-800",
};

function DosePill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-emerald-900/8 bg-white/80 px-2.5 py-2">
      <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-800/55">
        {label}
      </p>
      <p className="mt-0.5 text-[12px] font-extrabold leading-snug text-emerald-950">
        {value}
      </p>
    </div>
  );
}

function HerbicideCard({ opt, hi, index }: { opt: HerbicideOption; hi: boolean; index: number }) {
  const typeHi =
    opt.applicationType === "pre"
      ? hi
        ? "उगने से पहले"
        : "Pre-em"
      : opt.applicationType === "early_post"
        ? hi
          ? "जल्दी बाद"
          : "Early post"
        : opt.applicationType === "directed"
          ? hi
            ? "कतारों के बीच स्प्रे"
            : "Directed"
          : opt.applicationType === "combo"
            ? hi
              ? "दोनों एक साथ"
              : "Combo"
            : hi
              ? "उगने के बाद"
              : "Post-em";

  return (
    <article className="overflow-hidden rounded-2xl border border-emerald-900/10 bg-gradient-to-br from-white via-emerald-50/40 to-lime-50/30 shadow-[0_10px_28px_-18px_rgba(6,78,59,0.55)]">
      <div className="flex items-center justify-between gap-2 border-b border-emerald-900/5 px-3 py-2">
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-emerald-900 text-[10px] font-black text-lime-100">
          {index + 1}
        </span>
        <span className="rounded-full bg-emerald-900/90 px-2.5 py-0.5 text-[10px] font-bold text-lime-100">
          {typeHi}
        </span>
      </div>
      <div className="space-y-2.5 p-3">
        <div>
          <p className="text-[14px] font-black leading-snug text-emerald-950">
            {opt.technical}
          </p>
          {opt.brands?.length ? (
            <p className="mt-0.5 text-[11px] font-semibold text-emerald-800/70">
              {hi ? "बाज़ार में नाम: " : "Brand: "}
              {opt.brands.join(" · ")}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <DosePill
            label={hi ? "खुराक / एकड़" : "Dose / acre"}
            value={hi ? farmerWeedHi(opt.doseHi) : opt.doseHi}
          />
          <DosePill
            label={hi ? "कब डालें" : "Timing"}
            value={hi ? farmerWeedHi(opt.timingHi) : opt.timingHi}
          />
          {opt.waterHi ? (
            <DosePill
              label={hi ? "पानी" : "Water"}
              value={hi ? farmerWeedHi(opt.waterHi) : opt.waterHi}
            />
          ) : null}
          {opt.nozzleHi ? (
            <DosePill
              label={hi ? "नोजल" : "Nozzle"}
              value={opt.nozzleHi}
            />
          ) : null}
        </div>

        {opt.targetsHi?.length ? (
          <p className="text-[11px] leading-relaxed text-emerald-900/80">
            <span className="font-bold">
              {hi ? "खरपतवार: " : "Weeds: "}
            </span>
            {opt.targetsHi.map((t) => (hi ? farmerWeedHi(t) : t)).join(" · ")}
          </p>
        ) : null}
        {opt.weedStageHi ? (
          <p className="text-[11px] leading-relaxed text-emerald-900/80">
            <span className="font-bold">
              {hi ? "खरपतवार की अवस्था: " : "Weed stage: "}
            </span>
            {hi ? farmerWeedHi(opt.weedStageHi) : opt.weedStageHi}
          </p>
        ) : null}
        {opt.fieldConditionHi ? (
          <p className="rounded-xl bg-emerald-900/[0.04] px-2.5 py-2 text-[11px] font-medium leading-relaxed text-emerald-900/85">
            {hi ? farmerWeedHi(opt.fieldConditionHi) : opt.fieldConditionHi}
          </p>
        ) : null}
        {opt.adjuvantHi ? (
          <p className="text-[11px] text-emerald-900/75">
            <span className="font-bold">
              {hi ? "साथ मिलाएँ: " : "Adjuvant: "}
            </span>
            {hi ? farmerWeedHi(opt.adjuvantHi) : opt.adjuvantHi}
          </p>
        ) : null}
        {opt.noteHi ? (
          <p className="text-[11px] leading-relaxed text-emerald-900/70">
            {hi ? farmerWeedHi(opt.noteHi) : opt.noteHi}
          </p>
        ) : null}
        {opt.warningHi ? (
          <p className="flex gap-1.5 rounded-xl border border-amber-500/25 bg-amber-50 px-2.5 py-2 text-[11px] font-semibold leading-relaxed text-amber-950">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{hi ? farmerWeedHi(opt.warningHi) : opt.warningHi}</span>
          </p>
        ) : null}
      </div>
    </article>
  );
}

function SectionShell({
  id,
  icon,
  title,
  subtitle,
  accent,
  children,
  defaultOpen = true,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  accent: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section id={id} className="scroll-mt-24">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition",
          accent,
          open ? "rounded-b-none border-b-0" : "shadow-[0_8px_22px_-16px_rgba(0,0,0,0.35)]"
        )}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/15 text-white">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-black text-white">{title}</span>
          {subtitle ? (
            <span className="mt-0.5 block text-[11px] font-medium text-white/75">
              {subtitle}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-white/80 transition",
            open && "rotate-180"
          )}
        />
      </button>
      {open ? (
        <div className="rounded-b-2xl border border-t-0 border-emerald-900/10 bg-white/95 p-3 shadow-[0_12px_30px_-20px_rgba(6,78,59,0.5)]">
          {children}
        </div>
      ) : null}
    </section>
  );
}

function FieldDoctorWeedCards({
  crop,
  cropLabel,
  hi,
}: {
  crop: Crop;
  cropLabel: string;
  hi: boolean;
}) {
  const guide = getCropWeedFieldGuide(crop.slug)!;
  const catalog = getCropPestDisease(crop.slug);
  const cropImg = resolveCropImage({
    slug: crop.slug,
    name: crop.name,
    image: crop.image,
  });
  const [openWeed, setOpenWeed] = useState<string | null>(null);
  const [filter, setFilter] = useState<WeedLeafCategory | "all">("all");

  const enrichedWeeds = useMemo(() => {
    return guide.weeds.map((w, i) => {
      const sci = w.scientific;
      const match = catalog.weeds.find((c) => {
        if (!sci) return false;
        const a = normalizeScientificName(c.scientificName);
        const b = normalizeScientificName(sci);
        if (a === b) return true;
        const ga = a.split(" ")[0];
        const gb = b.split(" ")[0];
        return Boolean(ga && ga === gb);
      });
      const thumb = weedThumb(sci, w.localHi, match?.image);
      const stages = getWeedStageImages(sci, w.localHi);
      return {
        ...w,
        id: `${w.category}-${i}`,
        thumb,
        stages,
        href: match ? threatDetailPath(crop.slug, "weed", match.id) : null,
        catalogName: match?.name,
      };
    });
  }, [guide.weeds, catalog.weeds, crop.slug]);

  const byCategory = useMemo(() => {
    const map = new Map<WeedLeafCategory, typeof enrichedWeeds>();
    for (const w of enrichedWeeds) {
      const list = map.get(w.category) ?? [];
      list.push(w);
      map.set(w.category, list);
    }
    return CAT_ORDER.filter((c) => map.has(c)).map((c) => ({
      category: c,
      items: map.get(c)!,
    }));
  }, [enrichedWeeds]);

  const visible = useMemo(() => {
    if (filter === "all") return byCategory;
    return byCategory.filter((g) => g.category === filter);
  }, [byCategory, filter]);

  const principles = [
    ...WEED_GLOBAL_PRINCIPLES_HI,
    ...(guide.principlesHi ?? []),
  ].map((line) => (hi ? farmerWeedHi(line) : line));

  const nav = [
    { id: "weed-id", label: hi ? "पहचान" : "ID" },
    { id: "weed-critical", label: hi ? "कड़ा समय" : "Critical" },
    { id: "weed-pre", label: hi ? "पहले" : "Pre" },
    { id: "weed-post", label: hi ? "बाद" : "Post" },
    { id: "weed-tips", label: hi ? "बातें" : "Tips" },
  ];

  return (
    <div className="space-y-3">
      {/* Hero */}
      <section className="overflow-hidden rounded-2xl border border-emerald-950/20 bg-gradient-to-br from-emerald-950 via-emerald-800 to-lime-700 text-white shadow-[0_16px_40px_-24px_rgba(6,78,59,0.85)]">
        <div className="relative flex gap-3 p-3.5 sm:p-4">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-lime-300/20 blur-2xl"
          />
          <div className="relative z-10 min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wide text-lime-100/80">
              {hi ? "खरपतवार नियंत्रण" : "Weed control"}
            </p>
            <p className="mt-1 text-[18px] font-black leading-tight tracking-tight">
              {hi ? `${cropLabel} — खरपतवार कैसे हटाएँ` : `${cropLabel} — weed control`}
            </p>
            <p className="mt-1.5 text-[12px] font-medium leading-snug text-emerald-50/90">
              {hi
                ? "फोटो देखो → सही समय → सही दवा → सही खुराक"
                : "See photo → right time → right medicine → right dose"}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {[
                {
                  label: hi ? "खरपतवार" : "Weeds",
                  value: String(guide.weeds.length),
                },
                {
                  label: hi ? "कड़ा समय" : "Critical",
                  value: hi
                    ? farmerWeedHi(guide.criticalPeriodHi)
                    : guide.criticalPeriodHi,
                },
                {
                  label: hi ? "दवा विकल्प" : "Options",
                  value: String(
                    guide.preEmergence.length + guide.postEmergence.length
                  ),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-black/25 px-2 py-2 backdrop-blur-[2px]"
                >
                  <p className="text-[9px] font-bold text-white/65">{item.label}</p>
                  <p className="mt-0.5 line-clamp-3 text-[10px] font-extrabold leading-snug">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/25 bg-white/10 shadow-lg sm:h-28 sm:w-28">
            <Image
              src={cropImg}
              alt={cropLabel}
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>
        </div>
      </section>

      {/* Jump nav */}
      <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
        {nav.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className="shrink-0 rounded-full border border-emerald-900/10 bg-white px-3 py-1.5 text-[11px] font-bold text-emerald-900 shadow-sm"
          >
            {n.label}
          </a>
        ))}
      </div>

      {/* CARD 1 — Weed ID */}
      <SectionShell
        id="weed-id"
        icon={<Leaf className="h-4 w-4" />}
        title={hi ? "1. मुख्य खरपतवार पहचानो" : "1. Major weed ID"}
        subtitle={
          hi
            ? "टैप करो — फोटो और दो अवस्था दिखेगी"
            : "Tap — photos + 2 growth stages"
        }
        accent="bg-gradient-to-r from-emerald-800 to-lime-700 border-emerald-900/20"
      >
        <div className="mb-3 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-bold",
              filter === "all"
                ? "bg-emerald-900 text-lime-100"
                : "bg-emerald-100 text-emerald-900"
            )}
          >
            {hi ? "सभी" : "All"} · {enrichedWeeds.length}
          </button>
          {byCategory.map(({ category, items }) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-bold text-white",
                filter === category
                  ? `bg-gradient-to-r ${CAT_CHIP[category]} ring-2 ring-emerald-950/20`
                  : `bg-gradient-to-r ${CAT_CHIP[category]} opacity-70`
              )}
            >
              {weedCategoryLabelHi(category)} · {items.length}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {visible.map(({ category, items }) => (
            <div key={category}>
              <p className="mb-2 text-[11px] font-black uppercase tracking-wide text-emerald-800/70">
                {weedCategoryLabelHi(category)}
              </p>
              <ul className="space-y-2.5">
                {items.map((w) => {
                  const open = openWeed === w.id;
                  return (
                    <li key={w.id} className="overflow-hidden rounded-2xl">
                      <FarmerSplitCard
                        title={w.localHi}
                        subtitle={
                          hi
                            ? weedCategoryLabelHi(category)
                            : w.scientific || weedCategoryLabelHi(category)
                        }
                        subtitleItalic={!hi && Boolean(w.scientific)}
                        image={w.thumb}
                        threatCategory="weed"
                        openHint={
                          hi
                            ? open
                              ? "बंद करो"
                              : "फोटो देखो"
                            : open
                              ? "Close"
                              : "See photos"
                        }
                        onClick={() => setOpenWeed(open ? null : w.id)}
                        className={open ? "!rounded-b-none" : undefined}
                      />
                      {open ? (
                        <div className="space-y-2 rounded-b-2xl border border-t-0 border-[#D8E8DE] bg-gradient-to-b from-white to-emerald-50/50 px-3 pb-3 pt-2">
                          <WeedStageStrip
                            scientificName={w.scientific}
                            localHi={w.localHi}
                            hi={hi}
                            large
                          />
                          {w.href ? (
                            <AppLink
                              href={w.href}
                              className="inline-flex text-[11px] font-bold text-emerald-700"
                            >
                              {hi ? "पूरा खरपतवार कार्ड →" : "Full weed card →"}
                            </AppLink>
                          ) : null}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* CARD 2 — Critical */}
      <SectionShell
        id="weed-critical"
        icon={<Clock3 className="h-4 w-4" />}
        title={hi ? "2. कड़ा समय" : "2. Critical period"}
        subtitle={
          hi
            ? "इतने दिनों तक खेत साफ रखना ज़रूरी"
            : "Keep field weed-free here"
        }
        accent="bg-gradient-to-r from-amber-700 to-orange-600 border-amber-900/15"
      >
        <p className="text-[16px] font-black leading-snug text-emerald-950">
          {hi ? farmerWeedHi(guide.criticalPeriodHi) : guide.criticalPeriodHi}
        </p>
        {guide.criticalNoteHi ? (
          <p className="mt-2 text-[12px] font-semibold leading-relaxed text-emerald-900/80">
            {hi ? farmerWeedHi(guide.criticalNoteHi) : guide.criticalNoteHi}
          </p>
        ) : null}
        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-medium leading-relaxed text-amber-950">
          {hi
            ? "इस समय फसल और खरपतवार एक-दूसरे से लड़ते हैं — देर की तो पैदावार कम।"
            : "Peak crop–weed competition — late control costs yield."}
        </p>
      </SectionShell>

      {/* CARD 3 — Pre */}
      <SectionShell
        id="weed-pre"
        icon={<Sprout className="h-4 w-4" />}
        title={hi ? "3. उगने से पहले की दवा" : "3. Pre-emergence"}
        subtitle={
          hi
            ? "बुवाई/रोपाई के 0–3 दिन · खरपतवार निकलने से पहले"
            : "0–3 days after sowing/transplant"
        }
        accent="bg-gradient-to-r from-lime-700 to-emerald-600 border-lime-900/15"
      >
        {guide.preEmergence.length > 0 ? (
          <div className="space-y-2.5">
            {guide.preEmergence.map((opt, i) => (
              <HerbicideCard
                key={`pre-${opt.technical}-${opt.doseHi}`}
                opt={opt}
                hi={hi}
                index={i}
              />
            ))}
          </div>
        ) : (
          <p className="text-[12px] text-emerald-900/60">
            {hi
              ? "इस फसल के लिए अलग pre-emergence विकल्प स्रोत में नहीं।"
              : "No separate pre-emergence option in source."}
          </p>
        )}
      </SectionShell>

      {/* CARD 4 — Post */}
      <SectionShell
        id="weed-post"
        icon={<ShowerHead className="h-4 w-4" />}
        title={hi ? "4. उगने के बाद की दवा" : "4. Post-emergence"}
        subtitle={
          hi
            ? "सबसे अच्छा: खरपतवार 2–4 पत्ती · सही नोजल और पानी"
            : "Ideal: weeds at 2–4 leaf · right nozzle & water"
        }
        accent="bg-gradient-to-r from-teal-700 to-cyan-700 border-teal-900/15"
      >
        {guide.postEmergence.length > 0 ? (
          <div className="space-y-2.5">
            {guide.postEmergence.map((opt, i) => (
              <HerbicideCard
                key={`post-${opt.technical}-${opt.doseHi}-${opt.timingHi}`}
                opt={opt}
                hi={hi}
                index={i}
              />
            ))}
          </div>
        ) : (
          <p className="text-[12px] text-emerald-900/60">
            {hi
              ? "इस फसल के लिए अलग post-emergence विकल्प स्रोत में नहीं।"
              : "No separate post-emergence option in source."}
          </p>
        )}
      </SectionShell>

      {/* CARD 5 — Tips */}
      <SectionShell
        id="weed-tips"
        icon={<Lightbulb className="h-4 w-4" />}
        title={hi ? "5. खेत की ज़रूरी बातें" : "5. Field tips"}
        subtitle={
          hi
            ? "आम गलतियाँ और बचाव — ध्यान से पढ़ो"
            : "Common mistakes & safety"
        }
        accent="bg-gradient-to-r from-violet-800 to-indigo-700 border-violet-900/15"
      >
        <div className="space-y-2.5">
          {guide.fieldDoctorTips.map((tip, i) => {
            const title = hi
              ? farmerWeedTipTitleHi(tip.titleHi)
              : tip.titleHi;
            const points = hi
              ? farmerWeedTipPointsHi(tip.pointsHi)
              : tip.pointsHi;
            return (
              <div
                key={`${tip.titleHi}-${i}`}
                className="rounded-2xl border border-violet-500/15 bg-gradient-to-br from-violet-50/80 to-white p-3"
              >
                <p className="flex items-center gap-2 text-[12px] font-black text-violet-950">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-violet-900 text-[10px] text-white">
                    {i + 1}
                  </span>
                  {title}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {points.map((p) => (
                    <li
                      key={p}
                      className="text-[11px] font-medium leading-relaxed text-violet-950/80"
                    >
                      • {p}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </SectionShell>

      {/* Spray rules */}
      <section className="overflow-hidden rounded-2xl border border-teal-800/20 bg-gradient-to-br from-teal-950 via-emerald-900 to-teal-800 p-3.5 text-white">
        <div className="flex items-start gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <Droplets className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-black">
              {hi ? "स्प्रे करते समय याद रखो" : "Three spray rules"}
            </p>
            <ul className="mt-2 space-y-1.5">
              {principles.map((line) => (
                <li
                  key={line}
                  className="text-[11px] font-medium leading-relaxed text-teal-50/90"
                >
                  • {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="flex items-start gap-2 rounded-2xl border border-amber-500/20 bg-amber-50/80 px-3 py-2.5">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" />
        <p className="text-[10px] font-medium leading-relaxed text-amber-950/80">
          {hi
            ? "खुराक बोतल के लेबल से मिला लो। पास की फसल, अंतरफसल और किस्म का ध्यान रखो।"
            : "Follow label rates. Check adjacent crops, intercrops, and variety sensitivity."}
        </p>
      </div>

      <AppLink
        href="/ai-doctor"
        className="inline-flex rounded-full bg-emerald-900 px-4 py-2 text-xs font-bold text-lime-100 shadow-md"
      >
        {hi ? "फोटो से खरपतवार पहचानो → एआई डॉक्टर" : "Photo weed ID → AI Doctor"}
      </AppLink>
    </div>
  );
}

function LegacyWeedSection({ crop }: { crop: Crop }) {
  const { locale, t } = useLocale();
  const hi = locale === "hi";
  const cropLabel = (hi && getCropHindiName(crop.slug)) || crop.name;
  const profile = useMemo(
    () => getCropManagementProfile(crop.slug) as CropManagementWithDossier | null,
    [crop.slug]
  );
  const program = profile?.weedProgram ?? getWeedProgramForCrop(crop.slug);
  const profileWeeds = profile?.weedManagement ?? [];
  const catalog = getCropPestDisease(crop.slug);
  const [openId, setOpenId] = useState<string | null>(null);

  const weedNames =
    catalog.weeds.length > 0
      ? catalog.weeds.map((w) => ({
          id: w.id,
          name: w.name,
          scientificName: w.scientificName,
          image: w.image,
        }))
      : (program?.keyWeeds ?? []).map((name, i) => ({
          id: `kw-${i}`,
          name,
          scientificName: extractBinomial(name),
          image: undefined as string | undefined,
        }));

  const chemicals = program?.chemical ?? [];
  const useProfileWeeds = profileWeeds.length > 0;
  const herbicideCards = useMemo((): CropSprayProduct[] => {
    return chemicals.map((c) => ({
      technical: c.technical,
      doseAcre: c.dose,
      bestStage: c.timing,
      bestUseCondition: c.targets,
      points: c.note ? [c.note] : undefined,
      sourceConfidence: /लेबल|label/i.test(c.dose + (c.note ?? ""))
        ? "label-check"
        : "high",
    }));
  }, [chemicals]);

  const enrichedProfileWeeds = useMemo(() => {
    return profileWeeds.map((w, i) => {
      const sci =
        extractBinomial(w.scientificName) || extractBinomial(w.weedName);
      const norm = normalizeScientificName(sci);
      const match = catalog.weeds.find(
        (c) =>
          normalizeScientificName(c.scientificName) === norm && norm.length > 0
      );
      return {
        id: `${crop.slug}-weed-${i}`,
        weedName: w.weedName,
        scientificName: match?.scientificName || sci || w.scientificName,
        criticalPeriod: w.criticalPeriod,
        preEmergenceHerbicide: w.preEmergenceHerbicide,
        postEmergenceHerbicide: w.postEmergenceHerbicide,
        dose: w.dose,
        image: weedThumb(
          match?.scientificName || sci,
          w.weedName,
          match?.image
        ),
        href: match ? threatDetailPath(crop.slug, "weed", match.id) : null,
      };
    });
  }, [profileWeeds, catalog.weeds, crop.slug]);

  if (!weedNames.length && !chemicals.length && !useProfileWeeds) {
    const guide = crop.cropProtection.weedManagement;
    if (guide.length > 0) {
      return (
        <div className="space-y-3">
          <h3 className="text-base font-extrabold text-[var(--av-text-primary)]">
            {t("cropWeedsTitle")} — {cropLabel}
          </h3>
          <ul className="space-y-2">
            {guide.map((w) => (
              <li
                key={w}
                className="crop-premium-inset text-xs text-[var(--av-text-primary)]"
              >
                {w}
              </li>
            ))}
          </ul>
          <AppLink
            href="/ai-doctor"
            className="inline-flex text-xs font-bold text-[var(--av-accent)]"
          >
            {hi
              ? "फोटो से खरपतवार पहचान → एआई डॉक्टर"
              : "Photo weed ID → AI Doctor"}
          </AppLink>
        </div>
      );
    }
    return (
      <div className="crop-premium-empty">
        <p className="text-sm text-[var(--av-text-secondary)]">
          {hi
            ? `${cropLabel} की विस्तृत खरपतवार सूची सीमित है। पहले 30–45 दिन खेत साफ रखें।`
            : `Detailed weed list not ready for ${cropLabel} yet. Keep field clean first 30–45 days.`}
        </p>
        <AppLink
          href="/ai-doctor"
          className="mt-3 inline-flex text-xs font-bold text-[var(--av-accent)]"
        >
          {t("cropOpenAiDoctor")} →
        </AppLink>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-extrabold text-[var(--av-text-primary)]">
          {t("cropWeedsTitle")} — {cropLabel}
        </h3>
        <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
          {hi
            ? `${Math.max(weedNames.length, profileWeeds.length)} मुख्य खरपतवार · टैप कर तस्वीर व विवरण`
            : `${Math.max(weedNames.length, profileWeeds.length)} key weeds · tap for photos & detail`}
        </p>
      </div>

      {useProfileWeeds ? (
        <ul className="space-y-2.5">
          {enrichedProfileWeeds.map((w) => {
            const open = openId === w.id;
            return (
              <li key={w.id} className="overflow-hidden rounded-2xl">
                <FarmerSplitCard
                  title={w.weedName}
                  subtitle={`${w.scientificName} · ${w.criticalPeriod}`}
                  image={w.image}
                  threatCategory="weed"
                  openHint={
                    hi ? (open ? "बंद करें" : "देखो") : open ? "Close" : "See"
                  }
                  onClick={() => setOpenId(open ? null : w.id)}
                  className={open ? "!rounded-b-none" : undefined}
                />
                {open ? (
                  <div className="space-y-1 rounded-b-2xl border border-t-0 border-[#D8E8DE] bg-white px-3 pb-3 pt-2 text-xs text-[var(--av-text-secondary)]">
                    <WeedStageStrip
                      scientificName={w.scientificName}
                      localHi={w.weedName}
                      hi={hi}
                    />
                    <p>
                      <span className="font-bold text-[var(--av-text-primary)]">
                        {hi ? "उगने से पहले: " : "Before sprout: "}
                      </span>
                      {w.preEmergenceHerbicide}
                    </p>
                    <p>
                      <span className="font-bold text-[var(--av-text-primary)]">
                        {hi ? "उगने के बाद: " : "After sprout: "}
                      </span>
                      {w.postEmergenceHerbicide}
                    </p>
                    <p>{w.dose}</p>
                    {w.href ? (
                      <AppLink
                        href={w.href}
                        className="mt-1 inline-flex text-[11px] font-bold text-[var(--av-accent)]"
                      >
                        {hi ? "पूरा कार्ड →" : "Full card →"}
                      </AppLink>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="space-y-2.5">
          {weedNames.map((w) => {
            const hasCatalog = catalog.weeds.some((x) => x.id === w.id);
            const href = hasCatalog
              ? threatDetailPath(crop.slug, "weed", w.id)
              : `/pest-diseases?type=weed&crop=${crop.slug}`;
            const label = weedDisplayName(w.name, w.scientificName, locale);
            const open = openId === w.id;
            const thumb = weedThumb(w.scientificName, label.primary, w.image);
            return (
              <li key={w.id} className="overflow-hidden rounded-2xl">
                <FarmerSplitCard
                  title={label.primary}
                  subtitle={label.secondary || undefined}
                  image={thumb}
                  threatCategory="weed"
                  openHint={
                    hi ? (open ? "बंद करें" : "देखो") : open ? "Close" : "See"
                  }
                  onClick={() => setOpenId(open ? null : w.id)}
                  className={open ? "!rounded-b-none" : undefined}
                />
                {open ? (
                  <div className="rounded-b-2xl border border-t-0 border-[#D8E8DE] bg-white px-3 pb-3 pt-2">
                    <WeedStageStrip
                      scientificName={w.scientificName}
                      localHi={label.primary}
                      hi={hi}
                    />
                    <AppLink
                      href={href}
                      className="mt-2 inline-flex text-[11px] font-bold text-[var(--av-accent)]"
                    >
                      {hi ? "पूरा खरपतवार कार्ड →" : "Full weed card →"}
                    </AppLink>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      {herbicideCards.length > 0 && (
        <div>
          {program?.criticalPeriod ? (
            <p className="mb-2 text-[10px] text-[var(--av-text-muted)]">
              {hi ? "कड़ा समय" : "Critical"}: {program.criticalPeriod}
            </p>
          ) : null}
          <CropSprayMedicineList products={herbicideCards} hi={hi} />
        </div>
      )}
    </div>
  );
}

export default function CropWeedSection({ crop }: { crop: Crop }) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const cropLabel = (hi && getCropHindiName(crop.slug)) || crop.name;
  const fieldGuide = getCropWeedFieldGuide(crop.slug);

  if (fieldGuide) {
    return (
      <FieldDoctorWeedCards crop={crop} cropLabel={cropLabel} hi={hi} />
    );
  }

  return <LegacyWeedSection crop={crop} />;
}
