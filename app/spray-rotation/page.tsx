"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Wifi, WifiOff, Droplets } from "lucide-react";
import PageBackground from "@/components/ui/PageBackground";
import BottomNav from "@/components/layout/BottomNav";
import GlassCard from "@/components/ui/GlassCard";
import SprayTimeline from "@/components/spray-rotation/SprayTimeline";
import RiskBanner from "@/components/spray-rotation/RiskBanner";
import SuggestedSprayCard from "@/components/spray-rotation/SuggestedSprayCard";
import { useSprayLogs } from "@/hooks/useSprayLogs";
import { useSprayFields } from "@/hooks/useSprayFields";
import { useSprayLocale } from "@/hooks/useSprayLocale";
import { t, LOCALE_OPTIONS } from "@/lib/i18n/spray-rotation";
import {
  attachProducts,
  checkResistanceRisk,
  suggestNextMoAGroup,
} from "@/lib/sprayRotation";
import { trySyncPendingSprays } from "@/lib/spraySync";
import { cropCatalog } from "@/data/crop-catalog";
import { getCropPestDisease } from "@/data/pest-disease";
import { cn } from "@/lib/cn";

const TRACKER_CROPS = cropCatalog.filter((c) =>
  ["paddy", "cotton", "maize", "moongfali"].includes(c.slug)
);

export default function SprayRotationPage() {
  const { locale, setLocale } = useSprayLocale();
  const { fields } = useSprayFields();
  const { logs, hydrated, isOnline, pendingCount, getLogsForField } = useSprayLogs();

  const [selectedFieldId, setSelectedFieldId] = useState(fields[0]?.id ?? "");
  const [pestId, setPestId] = useState("");
  const [diseaseId, setDiseaseId] = useState("");

  useEffect(() => {
    if (fields.length > 0 && !selectedFieldId) {
      setSelectedFieldId(fields[0].id);
    }
  }, [fields, selectedFieldId]);

  useEffect(() => {
    if (isOnline) trySyncPendingSprays();
  }, [isOnline]);

  const activeField = fields.find((f) => f.id === selectedFieldId) ?? fields[0];
  const cropId = activeField?.cropSlug ?? "paddy";
  const cropThreats = getCropPestDisease(cropId);

  const fieldLogs = useMemo(() => {
    if (!activeField) return [];
    return getLogsForField(activeField.id, cropId);
  }, [activeField, cropId, getLogsForField]);

  const withProducts = useMemo(() => attachProducts(fieldLogs), [fieldLogs]);
  const risk = useMemo(() => checkResistanceRisk(fieldLogs), [fieldLogs]);
  const suggestions = useMemo(
    () => suggestNextMoAGroup(cropId, pestId || undefined, diseaseId || undefined, fieldLogs),
    [cropId, pestId, diseaseId, fieldLogs]
  );

  if (!hydrated) return null;

  return (
    <div className="agriveda-page relative min-h-screen pb-28">
      <PageBackground />

      <header className="sticky top-0 z-40 border-b border-emerald-500/10 bg-[var(--background)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 text-emerald-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-base font-extrabold theme-text-primary">{t(locale, "title")}</h1>
              <p className="text-[10px] theme-text-muted">{t(locale, "subtitle")}</p>
            </div>
          </div>
          {isOnline ? (
            <Wifi className="h-4 w-4 text-emerald-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-amber-500" />
          )}
        </div>
      </header>

      <div className="relative mx-auto max-w-lg space-y-5 px-4 py-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {LOCALE_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => setLocale(opt.code)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-bold",
                locale === opt.code ? "bg-emerald-600 text-white" : "border theme-text-muted"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {pendingCount > 0 && (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-center text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
            {pendingCount} {t(locale, "syncPending")}
          </p>
        )}

        <Link
          href="/spray-rotation/log"
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#006432] py-4 text-sm font-black text-white shadow-lg"
        >
          <Plus className="h-5 w-5" />
          {t(locale, "logSpray")}
        </Link>

        <section>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-extrabold theme-text-primary">
            <Droplets className="h-4 w-4 text-emerald-500" />
            {t(locale, "rotationStatus")}
          </h2>

          <div className="mb-3 flex gap-2 overflow-x-auto scrollbar-hide">
            {fields.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFieldId(f.id)}
                className={cn(
                  "flex-shrink-0 rounded-xl border px-4 py-2 text-xs font-bold",
                  selectedFieldId === f.id
                    ? "border-emerald-500 bg-emerald-500/15 text-emerald-700"
                    : "border-gray-200 theme-text-muted"
                )}
              >
                {f.name}
              </button>
            ))}
          </div>

          <RiskBanner
            result={risk}
            labels={{
              low: t(locale, "riskLow"),
              medium: t(locale, "riskMedium"),
              high: t(locale, "riskHigh"),
              consecutive: t(locale, "consecutiveWarning"),
            }}
          />

          <GlassCard className="mt-4 p-4">
            <p className="text-xs font-extrabold theme-text-primary">{t(locale, "timeline")}</p>
            {withProducts.length === 0 ? (
              <p className="mt-4 text-center text-sm theme-text-muted">{t(locale, "noSprays")}</p>
            ) : (
              <div className="mt-3">
                <SprayTimeline sprays={withProducts} />
              </div>
            )}
          </GlassCard>
        </section>

        <section>
          <p className="mb-2 text-xs font-bold theme-text-muted">{t(locale, "targetPest")} (for suggestions)</p>
          <select
            value={pestId ? `p-${pestId}` : diseaseId ? `d-${diseaseId}` : ""}
            onChange={(e) => {
              const v = e.target.value;
              if (v.startsWith("p-")) {
                setPestId(v.slice(2));
                setDiseaseId("");
              } else if (v.startsWith("d-")) {
                setDiseaseId(v.slice(2));
                setPestId("");
              } else {
                setPestId("");
                setDiseaseId("");
              }
            }}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-black/30"
          >
            <option value="">— {t(locale, "targetPest")} —</option>
            {cropThreats.pests.map((p) => (
              <option key={p.id} value={`p-${p.id}`}>
                🐛 {p.name}
              </option>
            ))}
            {cropThreats.diseases.map((d) => (
              <option key={d.id} value={`d-${d.id}`}>
                🦠 {d.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[10px] theme-text-muted">
            Crop: {TRACKER_CROPS.find((c) => c.slug === cropId)?.name ?? cropId}
          </p>
        </section>

        <SuggestedSprayCard
          suggestions={suggestions}
          title={t(locale, "suggestedNext")}
          emptyMessage={t(locale, "recommendDifferent")}
        />
      </div>

      <BottomNav />
    </div>
  );
}
