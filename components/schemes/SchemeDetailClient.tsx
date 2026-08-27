"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, ExternalLink, Shield } from "lucide-react";
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
import { cn } from "@/lib/cn";
import { notFound } from "next/navigation";

const GUIDED = new Set<string>(SCHEME_GUIDE_IDS);

type TabId = "kya" | "fayda" | "kaun" | "kagaz" | "kaise";

function miniLines(text: string, max = 3): string[] {
  return text
    .split(/[।.!?\n;|]+/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s.length > 2)
    .slice(0, max);
}

function MiniList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2.5 space-y-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2 text-[14px] font-semibold leading-snug text-[var(--av-text-primary)]"
        >
          <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function SchemeDetailClient({ id }: { id: string }) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const scheme = farmerSchemes.find((s) => s.id === id);
  if (!scheme) notFound();

  const img = resolveSchemeImage(scheme);
  const hasGuide = GUIDED.has(scheme.id);
  const [tab, setTab] = useState<TabId>("kya");
  const leave = useOfficialLeave();
  const official = hasOfficialSource(scheme);
  const shortName = farmerSchemeName(scheme.id, scheme.nameHi, scheme.nameEn, hi);

  const requestPortal = (from: string) => {
    if (!scheme.officialSourceUrl) return;
    track("scheme_portal_open", { id: scheme.id, from });
    leave.requestLeave(scheme.officialSourceUrl, scheme.officialSourceTitle || scheme.nameEn);
  };

  const tabs: { id: TabId; hi: string; en: string }[] = [
    { id: "kya", hi: "क्या है", en: "What" },
    { id: "fayda", hi: "फायदा", en: "Benefit" },
    { id: "kaun", hi: "कौन ले", en: "Who" },
    { id: "kagaz", hi: "कागज़", en: "Docs" },
    { id: "kaise", hi: "कैसे", en: "How" },
  ];

  const points = useMemo(() => {
    if (tab === "kya") return miniLines(scheme.purposeHi || scheme.hookHi, 3);
    if (tab === "fayda") {
      const list = miniLines(scheme.benefitHi, 3);
      if (scheme.benefitAmount) list.unshift(scheme.benefitAmount);
      return list.slice(0, 3);
    }
    if (tab === "kaun") {
      return [
        ...miniLines(scheme.whoHi, 2),
        ...scheme.tipsHi.slice(0, 1),
      ].slice(0, 3);
    }
    if (tab === "kagaz") return scheme.docsHi.slice(0, 4);
    return scheme.stepsHi.slice(0, 4);
  }, [tab, scheme]);

  return (
    <AppShell
      title={shortName}
      breadcrumbs={[
        { label: hi ? "होम" : "Home", href: "/" },
        { label: hi ? "योजनाएँ" : "Schemes", href: "/schemes" },
        { label: hi ? "जानकारी" : "Info" },
      ]}
    >
      <div className="space-y-3 pb-28">
        {/* Hero — photo forward */}
        <section className="relative min-h-[120px] overflow-hidden rounded-2xl shadow-lg shadow-black/20">
          <Image src={img} alt="" fill priority sizes="640px" className="object-cover object-center" />
          <span className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/55 to-black/20" />
          <div className="relative z-10 flex min-h-[120px] flex-col justify-end p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-200/90">
              {CATEGORY_LABEL_HI[scheme.category]}
              {" · "}
              {hi ? (scheme.level === "central" ? "केंद्र" : "राज्य") : scheme.level}
            </p>
            <h2 className="mt-0.5 text-[17px] font-extrabold leading-snug text-white">{shortName}</h2>
            {scheme.benefitAmount ? (
              <p className="mt-1.5 inline-flex w-fit rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-extrabold text-emerald-950">
                {scheme.benefitAmount}
              </p>
            ) : null}
          </div>
        </section>

        {/* Tabs — big tap targets */}
        <section className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3 shadow-[var(--av-shadow-sm)]">
          <p className="mb-2 text-[12px] font-bold text-[var(--av-text-muted)]">
            {hi ? "टैप करो · समझो" : "Tap · Read"}
          </p>
          <div className="grid grid-cols-5 gap-1.5">
            {tabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "min-h-[44px] rounded-xl border-2 px-0.5 text-[11px] font-black leading-tight transition active:scale-[0.98]",
                    active
                      ? "border-[#08763f] bg-[#08763f] text-white shadow-md"
                      : "border-emerald-200/80 bg-white text-[#07512f] dark:border-emerald-800 dark:bg-[var(--av-surface-inset)] dark:text-emerald-100"
                  )}
                >
                  {hi ? t.hi : t.en}
                </button>
              );
            })}
          </div>
          <MiniList items={points} />
        </section>

        <p className="flex items-start gap-2 px-1 text-[11px] font-medium text-[var(--av-text-muted)]">
          <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
          {hi
            ? "अंतिम नियम विभाग/बैंक तय करते हैं। OTP या PIN किसी को मत दो।"
            : "Final rules are with the department/bank. Never share OTP or PIN."}
        </p>

        <SchemeTrustAndSafety hi={hi} />
      </div>

      {/* Sticky actions — simple words */}
      <div className="fixed inset-x-0 bottom-[4.5rem] z-30 mx-auto flex w-full max-w-lg gap-2 px-3 lg:bottom-4">
        {hasGuide ? (
          <AppLink
            href={`/schemes/${scheme.id}/guide`}
            onClick={() => track("scheme_guide_start", { id: scheme.id, from: "detail_sticky" })}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-1.5 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] text-[13px] font-extrabold text-[#07512f] dark:text-emerald-100"
          >
            {hi ? "पात्रता देखो" : "Check fit"}
            <ArrowRight className="h-4 w-4" />
          </AppLink>
        ) : (
          <AppLink
            href="/schemes"
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] text-[13px] font-extrabold text-[#07512f] dark:text-emerald-100"
          >
            {hi ? "और योजनाएँ" : "More schemes"}
          </AppLink>
        )}
        {official ? (
          <button
            type="button"
            onClick={() => requestPortal("detail_sticky")}
            className="flex min-h-[48px] flex-[1.2] items-center justify-center gap-1.5 rounded-2xl bg-[#08763f] px-3 text-[13px] font-extrabold text-white shadow-lg"
          >
            {hi ? "सरकारी साइट →" : "Official site →"}
            <ExternalLink className="h-4 w-4" />
          </button>
        ) : (
          <span className="flex min-h-[48px] flex-[1.2] items-center justify-center rounded-2xl bg-[var(--av-surface-inset)] px-2 text-center text-[11px] font-semibold text-[var(--av-text-muted)]">
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
