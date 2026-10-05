"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileCheck2,
  Landmark,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import AppShell from "@/components/shell/AppShell";
import AppLink from "@/components/ui/AppLink";
import OfficialLeaveConfirm, { useOfficialLeave } from "@/components/schemes/OfficialLeaveConfirm";
import SchemeTrustAndSafety from "@/components/schemes/SchemeTrustAndSafety";
import { CATEGORY_LABEL_HI, farmerSchemes } from "@/data/schemes/farmerSchemes";
import {
  SCHEMES_MISSING_SOURCE_EN,
  SCHEMES_MISSING_SOURCE_HI,
  hasOfficialSource,
} from "@/data/schemes/schemeLegal";
import { SCHEME_GUIDE_IDS } from "@/data/schemes/schemeGuides";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { track } from "@/lib/analytics";
import { resolveSchemeImage } from "@/lib/schemes/schemeImages";
import { farmerSchemeName } from "@/lib/schemes/farmerSchemeCopy";
import { notFound, useRouter } from "next/navigation";

const GUIDED = new Set<string>(SCHEME_GUIDE_IDS);

export default function SchemeDetailClient({ id }: { id: string }) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const router = useRouter();
  const scheme = farmerSchemes.find((s) => s.id === id);
  if (!scheme) notFound();

  const img = resolveSchemeImage(scheme);
  const hasGuide = GUIDED.has(scheme.id);
  const leave = useOfficialLeave();
  const official = hasOfficialSource(scheme);
  const shortName = farmerSchemeName(scheme.id, scheme.nameHi, scheme.nameEn, hi);

  const requestPortal = (from: string) => {
    if (!scheme.officialSourceUrl) return;
    track("scheme_portal_open", { id: scheme.id, from });
    leave.requestLeave(scheme.officialSourceUrl, scheme.officialSourceTitle || scheme.nameEn);
  };

  // Status mapping
  const isClosed = scheme.status === "closed";
  const isSeasonal = scheme.status === "seasonal";

  const schemeStatusText = isClosed
    ? hi ? "सत्र समाप्त" : "Closed"
    : isSeasonal
    ? hi ? "मौसमी (सक्रिय)" : "Seasonal Active"
    : scheme.status === "state_specific"
    ? hi ? "राज्य योजना (सक्रिय)" : "State Active"
    : hi ? "योजना चालू है (सक्रिय)" : "Scheme Active";

  const appStatusText = isClosed
    ? hi ? "आवेदन अभी बंद हैं" : "Applications Closed"
    : isSeasonal
    ? hi ? "विंडो अनुसार आवेदन चालू" : "Seasonal Window Open"
    : hi ? "आवेदन प्रक्रिया चालू" : "Applications Open";

  let portalHost = "";
  try {
    if (scheme.officialSourceUrl) {
      portalHost = new URL(scheme.officialSourceUrl).hostname.replace(/^www\./, "");
    }
  } catch {
    portalHost = "";
  }

  return (
    <AppShell
      title={shortName}
      breadcrumbs={[
        { label: hi ? "होम" : "Home", href: "/" },
        { label: hi ? "योजनाएँ" : "Schemes", href: "/schemes" },
        { label: hi ? "विवरण" : "Detail" },
      ]}
    >
      <div className="space-y-4 pb-28">
        {/* Navigation back bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-1.5 text-[12px] font-bold text-[var(--av-text-secondary)] shadow-sm active:scale-95"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{hi ? "पीछे जाएँ" : "Back"}</span>
          </button>
          <span className="text-[11px] font-semibold text-[var(--av-text-muted)]">
            {hi ? (scheme.level === "central" ? "केंद्र सरकार" : "राज्य सरकार") : scheme.level}
          </span>
        </div>

        {/* Hero Card */}
        <section className="relative min-h-[140px] overflow-hidden rounded-3xl border border-emerald-900/20 shadow-lg shadow-emerald-950/20">
          <Image
            src={img}
            alt=""
            fill
            priority
            sizes="640px"
            className="object-cover object-center"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/70 to-black/30" />
          <div className="relative z-10 flex min-h-[140px] flex-col justify-end p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-200 backdrop-blur-sm">
                {CATEGORY_LABEL_HI[scheme.category]}
              </span>
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                {hi ? (scheme.level === "central" ? "केंद्रीय योजना" : "राज्य स्तरीय") : scheme.level}
              </span>
            </div>

            <h1 className="mt-1.5 text-[20px] font-extrabold leading-tight text-white">
              {shortName}
            </h1>

            {scheme.benefitAmount ? (
              <div className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 px-3 py-1 text-[13px] font-black text-emerald-950 shadow-md">
                <Sparkles className="h-3.5 w-3.5 text-emerald-900" />
                <span>{scheme.benefitAmount}</span>
              </div>
            ) : null}
          </div>
        </section>

        {/* Pinpoint 2-Column Status Bar: 1. योजना स्थिति, 2. आवेदन स्थिति */}
        <section className="grid grid-cols-2 gap-2.5">
          <div className="flex flex-col justify-between rounded-2xl border border-emerald-700/20 bg-emerald-500/10 p-3.5 shadow-sm dark:bg-emerald-950/30">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                {hi ? "योजना स्थिति" : "Scheme Status"}
              </span>
            </div>
            <p className="mt-1.5 text-[14px] font-extrabold text-emerald-950 dark:text-emerald-100">
              {schemeStatusText}
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-blue-700/20 bg-blue-500/10 p-3.5 shadow-sm dark:bg-blue-950/30">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                {hi ? "आवेदन स्थिति" : "Application Status"}
              </span>
            </div>
            <p className="mt-1.5 text-[14px] font-extrabold text-blue-950 dark:text-blue-100">
              {appStatusText}
            </p>
          </div>
        </section>

        {/* 1. योजना का मुख्य लाभ (Benefit & Purpose) */}
        <section className="space-y-2 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600/15 text-emerald-700 dark:text-emerald-300">
              <Landmark className="h-4 w-4" />
            </div>
            <h2 className="text-[15px] font-extrabold text-[var(--av-text-primary)]">
              {hi ? "योजना का लाभ व उद्देश्य" : "Key Benefit & Purpose"}
            </h2>
          </div>

          <p className="text-[13px] font-semibold leading-relaxed text-[var(--av-text-primary)]">
            {scheme.purposeHi}
          </p>

          <p className="rounded-xl bg-[var(--av-surface-inset)]/70 p-3 text-[12px] leading-relaxed text-[var(--av-text-secondary)]">
            {scheme.benefitHi}
          </p>
        </section>

        {/* 2. पात्रता — कौन पात्र है? (Eligibility Checklist) */}
        <section className="space-y-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600/15 text-emerald-700 dark:text-emerald-300">
                <UserCheck className="h-4 w-4" />
              </div>
              <h2 className="text-[15px] font-extrabold text-[var(--av-text-primary)]">
                {hi ? "पात्रता — कौन ले सकता है?" : "Eligibility"}
              </h2>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
              {hi ? "शर्तें" : "Criteria"}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-800/10 bg-emerald-50/50 p-2.5 text-[13px] font-semibold text-[var(--av-text-primary)] dark:bg-emerald-950/20">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{scheme.whoHi}</span>
            </div>

            {scheme.tipsHi.map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 px-2 text-[12px] font-medium leading-relaxed text-[var(--av-text-secondary)]"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                <span>{tip}</span>
              </div>
            ))}
          </div>

          {hasGuide && (
            <AppLink
              href={`/schemes/${scheme.id}/guide`}
              className="mt-1 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-[12px] font-bold text-emerald-900 transition hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-100"
            >
              <span>{hi ? "📋 अपनी पात्रता ऑनलाइन चेक करें" : "Check your eligibility online"}</span>
              <ChevronRight className="h-4 w-4" />
            </AppLink>
          )}
        </section>

        {/* 3. ज़रूरी दस्तावेज़ (Required Documents) */}
        <section className="space-y-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600/15 text-emerald-700 dark:text-emerald-300">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <h2 className="text-[15px] font-extrabold text-[var(--av-text-primary)]">
                {hi ? "ज़रूरी दस्तावेज़ (कागज़)" : "Required Documents"}
              </h2>
            </div>
            <span className="text-[11px] font-bold text-[var(--av-text-muted)]">
              {scheme.docsHi.length} {hi ? "दस्तावेज़" : "docs"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {scheme.docsHi.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)]/60 px-3 py-2.5 text-[12px] font-bold text-[var(--av-text-primary)]"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span>{doc}</span>
              </div>
            ))}
          </div>

          <p className="px-1 text-[11px] font-medium text-[var(--av-text-muted)]">
            {hi
              ? "💡 सलाह: आवेदन करने से पहले इन दस्तावेज़ों की साफ़ कॉपी अपने पास रखें।"
              : "💡 Tip: Keep clear copies ready before starting application."}
          </p>
        </section>

        {/* 4. आवेदन कैसे करें (How to Apply - Step by Step) */}
        <section className="space-y-3 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600/15 text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h2 className="text-[15px] font-extrabold text-[var(--av-text-primary)]">
              {hi ? "आवेदन प्रक्रिया (आवेदन कैसे करें)" : "Application Steps"}
            </h2>
          </div>

          {scheme.applyHi ? (
            <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-[12px] font-bold text-[#07512f] dark:text-emerald-200">
              <span className="font-extrabold">{hi ? "कहाँ करें: " : "Where: "}</span>
              {scheme.applyHi}
            </div>
          ) : null}

          <div className="space-y-2.5 pt-1">
            {scheme.stepsHi.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-950 text-[12px] font-black text-white shadow-sm dark:bg-emerald-600">
                  {idx + 1}
                </span>
                <p className="pt-0.5 text-[13px] font-semibold leading-snug text-[var(--av-text-primary)]">
                  {step}
                </p>
              </div>
            ))}
          </div>

          {official && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => requestPortal("detail_body")}
                className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-950 px-4 text-[13px] font-extrabold text-white shadow-md transition hover:bg-emerald-900 active:scale-[0.99] dark:bg-emerald-700 dark:hover:bg-emerald-600"
              >
                <span>{hi ? `आधिकारिक सरकारी पोर्टल खोलें ${portalHost ? `(${portalHost})` : ""}` : "Open Official Portal"}</span>
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>

        {/* Collapsible Subtle Legal Disclaimer per user request */}
        <SchemeTrustAndSafety hi={hi} />
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed inset-x-0 bottom-[4.5rem] z-30 mx-auto flex w-full max-w-lg gap-2 px-3 lg:bottom-4">
        {hasGuide ? (
          <AppLink
            href={`/schemes/${scheme.id}/guide`}
            onClick={() => track("scheme_guide_start", { id: scheme.id, from: "detail_sticky" })}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-1.5 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] text-[13px] font-extrabold text-[#07512f] shadow-sm dark:text-emerald-100"
          >
            {hi ? "पात्रता गाइड" : "Eligibility Guide"}
            <ArrowRight className="h-4 w-4" />
          </AppLink>
        ) : (
          <AppLink
            href="/schemes"
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] text-[13px] font-extrabold text-[#07512f] shadow-sm dark:text-emerald-100"
          >
            {hi ? "अन्य योजनाएँ" : "All Schemes"}
          </AppLink>
        )}

        {official ? (
          <button
            type="button"
            onClick={() => requestPortal("detail_sticky")}
            className="flex min-h-[48px] flex-[1.3] items-center justify-center gap-2 rounded-2xl bg-[#08763f] px-3 text-[13px] font-extrabold text-white shadow-lg active:scale-[0.99]"
          >
            <span>{hi ? "सरकारी पोर्टल ↗" : "Official Portal ↗"}</span>
          </button>
        ) : (
          <span className="flex min-h-[48px] flex-[1.3] items-center justify-center rounded-2xl bg-[var(--av-surface-inset)] px-2 text-center text-[11px] font-semibold text-[var(--av-text-muted)]">
            {hi ? SCHEMES_MISSING_SOURCE_HI : SCHEMES_MISSING_SOURCE_EN}
          </span>
        )}
      </div>

      <OfficialLeaveConfirm
        open={Boolean(leave.pending)}
        hi={hi}
        url={leave.pending?.url ?? ""}
        title={leave.pending?.title}
        onClose={leave.closeLeave}
        onContinue={leave.continueLeave}
      />
    </AppShell>
  );
}
