"use client";

import { useState, useMemo, useEffect } from "react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { Plus, Wifi, WifiOff, Droplets } from "lucide-react";
import SprayTimeline from "@/components/spray-rotation/SprayTimeline";
import RiskBanner from "@/components/spray-rotation/RiskBanner";
import { useSprayLogs } from "@/hooks/useSprayLogs";
import { useSprayFields } from "@/hooks/useSprayFields";
import {
  attachProducts,
  checkResistanceRisk,
} from "@/lib/sprayRotation";
import { trySyncPendingSprays } from "@/lib/spraySync";
import { cropCatalog } from "@/data/crop-catalog";
import { cn } from "@/lib/cn";
import { useLocale } from "@/components/i18n/LocaleProvider";

const DEFAULT_FIELD = { id: "default-field", name: "मुख्य खेत", cropSlug: "paddy" };

export default function SprayRotationPage() {
  const { t: uiT } = useLocale();
  const { fields } = useSprayFields();
  const { hydrated, isOnline, pendingCount, getLogsForField } = useSprayLogs();

  const [selectedFieldId, setSelectedFieldId] = useState(fields[0]?.id ?? DEFAULT_FIELD.id);
  const [selectedCropSlug, setSelectedCropSlug] = useState<string>("");

  useEffect(() => {
    if (fields.length > 0 && !selectedFieldId) {
      setSelectedFieldId(fields[0].id);
    }
  }, [fields, selectedFieldId]);

  useEffect(() => {
    if (isOnline) trySyncPendingSprays();
  }, [isOnline]);

  const activeField = fields.find((f) => f.id === selectedFieldId) ?? fields[0] ?? DEFAULT_FIELD;
  const rawCropSlug = selectedCropSlug || activeField?.cropSlug || "paddy";
  const cropId = rawCropSlug === "groundnut" ? "moongfali" : rawCropSlug;
  const currentCrop = cropCatalog.find((c) => c.slug === cropId) ?? cropCatalog[0];

  const fieldLogs = useMemo(() => {
    if (!activeField) return [];
    return getLogsForField(activeField.id, cropId) ?? [];
  }, [activeField, cropId, getLogsForField]);

  const withProducts = useMemo(() => attachProducts(fieldLogs), [fieldLogs]);
  const risk = useMemo(() => checkResistanceRisk(fieldLogs), [fieldLogs]);

  if (!hydrated) return null;

  return (
    <AppShell
      title="स्प्रे चक्र व डायरी"
      breadcrumbs={[{ label: uiT("navHome"), href: "/" }, { label: "स्प्रे डायरी" }]}
    >
      <div className="flex items-center justify-end pb-1">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-[var(--av-text-muted)]">
          {isOnline ? (
            <>
              <Wifi className="h-3.5 w-3.5 text-emerald-600" />
              <span>ऑनलाइन</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5 text-amber-500" />
              <span>ऑफलाइन</span>
            </>
          )}
        </div>
      </div>

      {pendingCount > 0 && (
        <p className="mt-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center text-xs font-bold text-amber-600">
          {pendingCount} छिड़काव सिंक होना बाकी है (इंटरनेट आने पर अपने आप सिंक होगा)
        </p>
      )}

      {/* Field & Crop Selection Bar */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--av-text-secondary)]">खेत चुनें:</span>
          {fields && fields.length > 1 && (
            <span className="text-[11px] text-[var(--av-text-muted)]">{fields.length} खेत उपलब्ध</span>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-0.5">
          {(fields && fields.length > 0 ? fields : [activeField]).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setSelectedFieldId(f.id);
                setSelectedCropSlug(f.cropSlug || "");
              }}
              className={cn(
                "shrink-0 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition",
                activeField?.id === f.id
                  ? "border-emerald-600 bg-emerald-500/15 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/25"
                  : "border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-muted)]"
              )}
            >
              🌾 {f.name}
            </button>
          ))}
        </div>

        {/* Change Crop Pill Selector */}
        <div className="mt-2 flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
          <span className="shrink-0 text-[11px] font-bold text-[var(--av-text-muted)]">फसल:</span>
          {cropCatalog.slice(0, 8).map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setSelectedCropSlug(c.slug)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold transition",
                cropId === c.slug
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-xs"
                  : "border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)]"
              )}
            >
              {c.nameHi || c.name}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* मेरा छिड़काव रिकॉर्ड (स्प्रे डायरी) */}
      {/* ========================================================================= */}
      <DarkCard className="mt-4" delay={1}>
        <div className="flex items-center justify-between border-b border-[var(--av-border)] pb-3">
          <h2 className="flex items-center gap-2 text-[15px] font-black text-[var(--av-text-primary)]">
            <Droplets className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            मेरा छिड़काव रिकॉर्ड (स्प्रे डायरी)
          </h2>
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800 dark:text-emerald-200">
            {withProducts.length} छिड़काव
          </span>
        </div>

        {/* Status of Resistance Risk */}
        <div className="mt-3">
          <RiskBanner
            result={risk}
            labels={{
              low: "सुरक्षित रोटेशन",
              medium: "मध्यम जोखिम — दवा बदलें",
              high: "उच्च जोखिम — तुरंत दवा बदलें!",
              consecutive: "लगातार एक ही ग्रुप का स्प्रे न दोहराएं",
            }}
          />
        </div>

        {/* Spray Timeline History */}
        {withProducts.length > 0 && (
          <div className="mt-4">
            <p className="text-[12px] font-black text-[var(--av-text-primary)]">
              इस सीजन की छिड़काव सूची ({currentCrop.nameHi || currentCrop.name}):
            </p>
            <div className="mt-3">
              <SprayTimeline sprays={withProducts} />
            </div>
          </div>
        )}

        {/* Add Spray Log Button */}
        <AppLink
          href={`/spray-rotation/log?crop=${encodeURIComponent(cropId)}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-black text-white shadow-md shadow-emerald-700/20 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          नया छिड़काव दर्ज करें (स्प्रे डायरी)
        </AppLink>
      </DarkCard>
    </AppShell>
  );
}
