"use client";

import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import CropCollapsible from "@/components/crops/CropCollapsible";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  getVarietiesForCrop,
  type GrainType,
  type MarketVarietyRec,
  type PaddyEcology,
} from "@/lib/crops/cropVarieties";
import { stageLabelHi, varietyTraitHi } from "@/lib/i18n/farmer-display";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import type { Crop } from "@/types/crop";
import { MapPin, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

const ECOLOGY_OPTS: { id: PaddyEcology | "all"; hi: string; en: string }[] = [
  { id: "all", hi: "सभी पारिस्थितिकी", en: "All ecologies" },
  { id: "irrigated", hi: "सिंचित", en: "Irrigated" },
  { id: "rainfed", hi: "वर्षा आधारित", en: "Rainfed" },
  { id: "usar", hi: "ऊसर / नमकीन", en: "Usar / saline" },
  { id: "flood", hi: "बाढ़ क्षेत्र", en: "Flood-prone" },
  { id: "dsr", hi: "सीधी बुवाई (DSR)", en: "DSR" },
  { id: "basmati", hi: "बासमती", en: "Basmati" },
  { id: "common", hi: "सामान्य", en: "Common" },
];

const GRAIN_OPTS: { id: GrainType | "all"; hi: string; en: string }[] = [
  { id: "all", hi: "सभी दाना", en: "All grain" },
  { id: "basmati", hi: "बासमती", en: "Basmati" },
  { id: "fine", hi: "महीन", en: "Fine" },
  { id: "medium", hi: "मध्यम", en: "Medium" },
  { id: "coarse", hi: "मोटा दाना", en: "Coarse" },
];

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[32px] shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition active:scale-[0.97] ${
        active
          ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200"
          : "border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)]"
      }`}
    >
      {label}
    </button>
  );
}

function VarietyCard({
  v,
  index,
  highlighted,
  hi,
  showMeta,
}: {
  v: MarketVarietyRec;
  index: number;
  highlighted?: boolean;
  hi: boolean;
  showMeta?: boolean;
}) {
  const ecologyLabel = showMeta && v.ecology
    ? ECOLOGY_OPTS.find((o) => o.id === v.ecology)
    : null;
  const grainLabel = showMeta && v.grainType
    ? GRAIN_OPTS.find((o) => o.id === v.grainType)
    : null;
  const duration =
    showMeta && v.durationDays
      ? `${v.durationDays.min}–${v.durationDays.max} ${hi ? "दिन" : "days"}`
      : null;

  return (
    <div
      className={`rounded-xl border px-3 py-2.5 ${
        highlighted
          ? "border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-transparent"
          : "border-[var(--av-border)] bg-[var(--av-surface-inset)]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-[var(--av-text-primary)]">
            {index}. {v.name}
          </p>
          <p className="mt-0.5 text-xs text-[var(--av-text-secondary)]">
            {hi ? varietyTraitHi(v.trait) : v.trait}
          </p>
          {(ecologyLabel || grainLabel || duration) && (
            <p className="mt-1 flex flex-wrap gap-1.5 text-[10px] text-[var(--av-text-muted)]">
              {ecologyLabel ? (
                <span className="rounded-md bg-[var(--av-accent-soft)] px-1.5 py-0.5 font-semibold text-[var(--av-accent)]">
                  {hi ? ecologyLabel.hi : ecologyLabel.en}
                </span>
              ) : null}
              {grainLabel ? (
                <span className="rounded-md border border-[var(--av-border)] px-1.5 py-0.5 font-semibold">
                  {hi ? grainLabel.hi : grainLabel.en}
                </span>
              ) : null}
              {duration ? <span className="px-0.5 py-0.5">{duration}</span> : null}
            </p>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-[var(--av-accent-soft)] px-2 py-0.5 text-[9px] font-bold text-[var(--av-accent)]">
          {hi ? stageLabelHi(v.season) : v.season}
        </span>
      </div>
      <p className="mt-1.5 flex items-start gap-1 text-[10px] text-[var(--av-text-muted)]">
        <TrendingUp className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
        {v.marketNote}
        {v.states.length > 0 && (
          <span className="text-[var(--av-text-muted)]"> · {v.states.slice(0, 3).join(", ")}</span>
        )}
      </p>
    </div>
  );
}

export default function CropVarietiesSection({ crop }: { crop: Crop }) {
  const { t, locale } = useLocale();
  const hi = locale === "hi";
  const { profile } = useFarmerProfile();
  const state = profile.state.trim() || undefined;
  const district = profile.district.trim();
  const varieties = getVarietiesForCrop(crop.slug, state);
  const isPaddy = crop.slug === "paddy" || crop.slug === "rice" || crop.slug === "dhaan";

  const [ecology, setEcology] = useState<PaddyEcology | "all">("all");
  const [grain, setGrain] = useState<GrainType | "all">("all");

  const filtered = useMemo(() => {
    if (!isPaddy) return varieties;
    return varieties.filter((v) => {
      if (ecology !== "all" && v.ecology !== ecology) return false;
      if (grain !== "all" && v.grainType !== grain) return false;
      return true;
    });
  }, [varieties, isPaddy, ecology, grain]);

  const { stateGovt, statePrivate, otherGovt, otherPrivate } = useMemo(() => {
    const inState = (v: MarketVarietyRec) =>
      !!state && v.states.some((s) => s.toLowerCase() === state.toLowerCase());
    const stateList = state ? filtered.filter(inState) : filtered;
    const otherList = state ? filtered.filter((v) => !inState(v)) : [];
    return {
      stateGovt: stateList.filter((v) => v.source === "govt"),
      statePrivate: stateList.filter((v) => v.source === "private"),
      otherGovt: otherList.filter((v) => v.source === "govt"),
      otherPrivate: otherList.filter((v) => v.source === "private"),
    };
  }, [filtered, state]);

  const renderGroup = (title: string, list: MarketVarietyRec[], highlight: boolean) => {
    if (!list.length) return null;
    return (
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--av-text-muted)]">
          {title}
        </p>
        {list.map((v, i) => (
          <VarietyCard
            key={v.name}
            v={v}
            index={i + 1}
            highlighted={highlight}
            hi={hi}
            showMeta={isPaddy}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {(state || district) && (
        <DarkCard className="border-emerald-500/20 bg-emerald-500/5">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
            <MapPin className="h-3.5 w-3.5" />
            {hi
              ? `${t("varForYourState")}: ${[district, state].filter(Boolean).join(", ")}`
              : `Market pick for ${[district, state].filter(Boolean).join(", ") || "your area"}`}
          </p>
          <p className="mt-1 text-xs text-[var(--av-text-muted)]">
            {stateGovt.length || statePrivate.length
              ? hi
                ? `सरकारी ${stateGovt.length} · प्राइवेट ${statePrivate.length}`
                : `Govt ${stateGovt.length} · Private ${statePrivate.length}`
              : hi
                ? "प्रोफ़ाइल में राज्य सेट करें — बेहतर किस्म सुझाव मिलेगा।"
                : "Set state in profile for better variety tips."}
          </p>
        </DarkCard>
      )}

      {isPaddy ? (
        <DarkCard>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--av-text-muted)]">
            {hi ? "पारिस्थितिकी" : "Ecology"}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ECOLOGY_OPTS.map((o) => (
              <Chip
                key={o.id}
                active={ecology === o.id}
                label={hi ? o.hi : o.en}
                onClick={() => setEcology(o.id)}
              />
            ))}
          </div>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-[var(--av-text-muted)]">
            {hi ? "दाना प्रकार" : "Grain type"}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {GRAIN_OPTS.map((o) => (
              <Chip
                key={o.id}
                active={grain === o.id}
                label={hi ? o.hi : o.en}
                onClick={() => setGrain(o.id)}
              />
            ))}
          </div>
          <p className="mt-2 text-[10px] text-[var(--av-text-muted)]">
            {hi
              ? `${filtered.length} किस्में दिखाई जा रही हैं`
              : `${filtered.length} varieties shown`}
          </p>
        </DarkCard>
      ) : null}

      <DarkCard>
        <SectionHeader title={hi ? "अनुशंसित किस्में" : "Recommended Varieties"} />
        <p className="mt-1 text-xs text-[var(--av-text-muted)]">
          {hi
            ? `${crop.name} — राज्य के हिसाब से सरकारी और प्राइवेट किस्में`
            : `${crop.name} — state-wise government and private (hybrid) picks`}
        </p>
        <div className="mt-3 space-y-4">
          {filtered.length === 0 ? (
            <p className="text-xs text-[var(--av-text-secondary)]">
              {hi
                ? "इस फ़िल्टर पर कोई किस्म नहीं — फ़िल्टर बदलें।"
                : "No varieties for this filter — try another chip."}
            </p>
          ) : state ? (
            <>
              {renderGroup(t("varGovt"), stateGovt, true)}
              {renderGroup(t("varPrivate"), statePrivate, true)}
            </>
          ) : (
            <>
              {renderGroup(
                t("varGovt"),
                filtered.filter((v) => v.source === "govt"),
                false
              )}
              {renderGroup(
                t("varPrivate"),
                filtered.filter((v) => v.source === "private"),
                false
              )}
            </>
          )}
        </div>
      </DarkCard>

      {state && (otherGovt.length > 0 || otherPrivate.length > 0) && (
        <CropCollapsible
          title={t("varOtherStates")}
          subtitle={hi ? "अन्य राज्यों की किस्में" : "Varieties popular elsewhere"}
          defaultOpen={false}
        >
          <div className="space-y-4">
            {renderGroup(t("varGovt"), otherGovt, false)}
            {renderGroup(t("varPrivate"), otherPrivate, false)}
          </div>
        </CropCollapsible>
      )}
    </div>
  );
}
