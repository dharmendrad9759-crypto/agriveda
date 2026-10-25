"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AppLink from "@/components/ui/AppLink";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import Badge from "@/components/design-system/Badge";
import { AV } from "@/lib/design/tokens";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useDashboardAlerts } from "@/hooks/useDashboardAlerts";
import { useFarmData } from "@/hooks/useFarmData";
import { daysAfterSowingISO } from "@/lib/farm/fieldStatus";
import { getStageAdvisory } from "@/lib/field-advisor/stageAdvisories";
import {
  AlertTriangle,
  Calendar,
  ChevronRight,
  Droplets,
  FlaskConical,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Sprout,
  Stethoscope,
} from "lucide-react";

const COMMON_CROPS = [
  { slug: "paddy", nameHi: "धान", emoji: "🌾" },
  { slug: "wheat", nameHi: "गेहूं", emoji: "🌾" },
  { slug: "mustard", nameHi: "सरसों", emoji: "🌼" },
  { slug: "tomato", nameHi: "टमाटर", emoji: "🍅" },
  { slug: "maize", nameHi: "मक्का", emoji: "🌽" },
  { slug: "cotton", nameHi: "कपास", emoji: "🌱" },
  { slug: "soybean", nameHi: "सोयाबीन", emoji: "🫘" },
  { slug: "potato", nameHi: "आलू", emoji: "🥔" },
];

function FieldAdvisorContent() {
  const { t, locale } = useLocale();
  const isHi = locale === "hi";
  const searchParams = useSearchParams();
  const qCrop = searchParams.get("crop");
  const qSowing = searchParams.get("sowing");
  const qName = searchParams.get("name");

  const alerts = useDashboardAlerts(4);
  const { data: farmData } = useFarmData();
  const fields = farmData.fields;

  // Selected field index or fallback crop
  const [selectedFieldId, setSelectedFieldId] = useState<string>(() => {
    if (fields.length > 0) return fields[0].id;
    return "custom";
  });

  // Automatically select the farmer's first active field once fields are loaded
  useEffect(() => {
    if (fields.length > 0 && (selectedFieldId === "custom" || !fields.some((f) => f.id === selectedFieldId))) {
      setSelectedFieldId(fields[0].id);
    }
  }, [fields, selectedFieldId]);

  const [customCropSlug, setCustomCropSlug] = useState<string>(qCrop || "wheat");
  const [customDays, setCustomDays] = useState<number>(20);

  // Active field information
  const activeField = fields.find((f) => f.id === selectedFieldId);

  const activeCropSlug = activeField ? activeField.cropSlug : customCropSlug;
  const activeCropName = activeField ? activeField.crop : (COMMON_CROPS.find((c) => c.slug === activeCropSlug)?.nameHi || activeCropSlug);
  const activeFieldName = activeField ? activeField.name : (qName || "मेरा खेत");

  const das = useMemo(() => {
    if (activeField?.sowingDate) {
      return daysAfterSowingISO(activeField.sowingDate);
    }
    if (qSowing) {
      return daysAfterSowingISO(qSowing);
    }
    return customDays;
  }, [activeField, qSowing, customDays]);

  const advisory = useMemo(() => {
    return getStageAdvisory(activeCropSlug || "paddy", das);
  }, [activeCropSlug, das]);

  return (
    <div className="space-y-4 pb-6">
      {/* Field / Crop Tabs */}
      {fields.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {fields.map((f) => {
            const isSel = f.id === selectedFieldId;
            const fDas = f.sowingDate ? daysAfterSowingISO(f.sowingDate) : null;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFieldId(f.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  isSel
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "border border-[var(--av-border)] bg-[var(--av-surface)] text-[var(--av-text-secondary)] hover:bg-[var(--av-surface-inset)]"
                }`}
              >
                <Sprout className="h-3.5 w-3.5" />
                <span>{f.name} ({f.crop})</span>
                {fDas != null && (
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${isSel ? "bg-emerald-700 text-white" : "bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"}`}>
                    {fDas} दिन
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5">
          <p className="text-xs font-bold text-[var(--av-text-primary)]">फसल चुनें — अवस्था के अनुसार सलाह देखें:</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {COMMON_CROPS.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => {
                  setCustomCropSlug(c.slug);
                  setSelectedFieldId("custom");
                }}
                className={`rounded-xl px-2.5 py-1.5 text-xs font-semibold transition ${
                  customCropSlug === c.slug
                    ? "bg-emerald-600 text-white"
                    : "border border-[var(--av-border)] bg-[var(--av-surface-inset)] text-[var(--av-text-secondary)]"
                }`}
              >
                {c.emoji} {c.nameHi}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero stage banner */}
      <div className="relative overflow-hidden rounded-[22px] border border-emerald-500/30 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 p-4 text-white shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
              <Calendar className="h-3.5 w-3.5" />
              <span>{activeFieldName} · {activeCropName}</span>
              {das != null && <span className="rounded-full bg-emerald-500/25 px-2 py-0.5 text-[10px] text-white">बुवाई के {das} दिन</span>}
            </div>
            <h2 className="mt-1 text-lg font-black tracking-tight text-white sm:text-xl">
              अवस्था: {advisory.stageNameHi}
            </h2>
          </div>
          <span className="rounded-xl bg-white/10 px-2.5 py-1 text-[11px] font-bold text-emerald-200 backdrop-blur-sm">
            {advisory.minDas}-{advisory.maxDas} दिन
          </span>
        </div>

        {/* Today's key task */}
        <div className="mt-3.5 rounded-xl border border-emerald-400/30 bg-white/10 p-3.5 backdrop-blur-md">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            आज क्या काम करना है?
          </p>
          <p className="mt-1.5 text-sm font-semibold leading-relaxed text-white">
            {advisory.todayTaskHi}
          </p>
        </div>
      </div>

      {/* This week's checklist */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-sm font-extrabold text-[var(--av-text-primary)]">
            📅 इस हफ्ते के मुख्य काम
          </h3>
        </div>

        <div className="grid gap-2.5">
          {advisory.checklist.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 shadow-sm transition active:scale-[0.99]"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-lg">
                  {item.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="inline-block rounded-md bg-[var(--av-surface-inset)] px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                    {item.category}
                  </span>
                  <p className="mt-1 text-sm font-semibold leading-snug text-[var(--av-text-primary)]">
                    {item.action}
                  </p>
                  {item.tip && (
                    <p className="mt-1 text-[11px] text-amber-800 dark:text-amber-300">
                      💡 {item.tip}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Farm Tools (Non-duplicate, purposeful) */}
      <div className="space-y-2.5 pt-2">
        <h3 className="text-sm font-extrabold text-[var(--av-text-primary)]">
          ⚡ इस हफ्ते के ज़रूरी टूल्स
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <AppLink
            href="/mix-advisor"
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3 text-center active:scale-[0.98]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-300">
              <FlaskConical className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold text-[var(--av-text-primary)]">दवा घोल जांच</span>
            <span className="text-[10px] text-[var(--av-text-muted)]">घोल सुरक्षा चेक</span>
          </AppLink>

          <AppLink
            href="/spray-rotation"
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3 text-center active:scale-[0.98]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-300">
              <RefreshCw className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold text-[var(--av-text-primary)]">स्प्रे चक्र</span>
            <span className="text-[10px] text-[var(--av-text-muted)]">दवा बदलें व डायरी</span>
          </AppLink>

          <AppLink
            href="/ai-doctor"
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3 text-center active:scale-[0.98]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300">
              <Stethoscope className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold text-[var(--av-text-primary)]">बीमारी जांचें</span>
            <span className="text-[10px] text-[var(--av-text-muted)]">फोटो से पहचान</span>
          </AppLink>

          <AppLink
            href="/weather"
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3 text-center active:scale-[0.98]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-700 dark:text-sky-300">
              <Droplets className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold text-[var(--av-text-primary)]">मौसम व स्प्रे</span>
            <span className="text-[10px] text-[var(--av-text-muted)]">छिड़काव अनुकूलता</span>
          </AppLink>
        </div>
      </div>

      {/* Critical Alerts */}
      {alerts.length > 0 && (
        <DarkCard className="mt-2 border-amber-500/20">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">खेत के सक्रिय अलर्ट</h3>
            <Badge variant="warning">{alerts.length} अलर्ट</Badge>
          </div>
          <ul className="mt-3 space-y-2">
            {alerts.slice(0, 3).map((a) => (
              <li key={a.id} className="rounded-xl border border-amber-500/25 bg-amber-500/8 p-2.5">
                <AppLink href={a.actionHref ?? "/alerts"} className="block">
                  <p className="flex items-center gap-1.5 text-xs font-bold text-[var(--av-text-primary)]">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    {a.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">{a.body}</p>
                </AppLink>
              </li>
            ))}
          </ul>
        </DarkCard>
      )}

      {/* Expert CTA banner */}
      <ShellCtaBanner
        title="कोई विशेष समस्या या रोग दिख रहा है?"
        description="कृषि विशेषज्ञ से पूछें — 15 मिनट में समाधान पाएं।"
        buttonLabel="विशेषज्ञ से पूछें"
        href="/ask-query"
      />
    </div>
  );
}

export default function FieldAdvisorPage() {
  const { t } = useLocale();

  return (
    <AppShell
      className="!bg-transparent"
      title="खेत सलाह (आज और इस हफ्ते का काम)"
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: "खेत सलाह" }]}
    >
      <Suspense fallback={<div className="p-8 text-center text-sm text-[var(--av-text-muted)]">लोड हो रहा है…</div>}>
        <FieldAdvisorContent />
      </Suspense>
    </AppShell>
  );
}
