"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  FileText,
  Landmark,
  ListOrdered,
  Search,
  Shield,
  Users,
} from "lucide-react";
import AppShell from "@/components/shell/AppShell";
import AppLink from "@/components/ui/AppLink";
import OfficialLeaveConfirm, { useOfficialLeave } from "@/components/schemes/OfficialLeaveConfirm";
import SchemeEligibilityChecker from "@/components/schemes/SchemeEligibilityChecker";
import SchemeTrustAndSafety from "@/components/schemes/SchemeTrustAndSafety";
import {
  CATEGORY_LABEL_HI,
  farmerSchemes,
} from "@/data/schemes/farmerSchemes";
import {
  SCHEMES_BENEFIT_FOOTNOTE_EN,
  SCHEMES_BENEFIT_FOOTNOTE_HI,
  SCHEMES_MISSING_SOURCE_EN,
  SCHEMES_MISSING_SOURCE_HI,
  STATUS_LABEL,
  hasOfficialSource,
} from "@/data/schemes/schemeLegal";
import { SCHEME_GUIDE_IDS } from "@/data/schemes/schemeGuides";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { track } from "@/lib/analytics";
import { resolveSchemeImage } from "@/lib/schemes/schemeImages";
import { cn } from "@/lib/cn";
import { notFound } from "next/navigation";

const GUIDED = new Set<string>(SCHEME_GUIDE_IDS);

type PanelId = "about" | "benefit" | "who" | "docs" | "steps";

const NEXT_STEPS = [
  { hi: "पात्रता की आधिकारिक शर्तें देखें", en: "Read official eligibility conditions", Icon: Search },
  { hi: "जरूरी दस्तावेज तैयार करें", en: "Prepare required documents", Icon: ClipboardList },
  { hi: "आधिकारिक पोर्टल / बैंक / विभाग से आवेदन करें", en: "Apply via official portal / bank / department", Icon: Landmark },
  { hi: "आवेदन का status संबंधित official channel से जांचें", en: "Check status on the official channel", Icon: FileText },
] as const;

export default function SchemeDetailClient({ id }: { id: string }) {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const { profile } = useFarmerProfile();
  const scheme = farmerSchemes.find((s) => s.id === id);
  if (!scheme) notFound();

  const img = resolveSchemeImage(scheme);
  const hasGuide = GUIDED.has(scheme.id);
  const [open, setOpen] = useState<PanelId>("about");
  const leave = useOfficialLeave();
  const official = hasOfficialSource(scheme);
  const status = STATUS_LABEL[scheme.status];

  const requestPortal = (from: string) => {
    if (!scheme.officialSourceUrl) return;
    track("scheme_portal_open", { id: scheme.id, from });
    leave.requestLeave(scheme.officialSourceUrl, scheme.officialSourceTitle || scheme.nameEn);
  };

  const panels: { id: PanelId; titleHi: string; titleEn: string }[] = [
    { id: "about", titleHi: "योजना के बारे में", titleEn: "About scheme" },
    { id: "benefit", titleHi: "संभावित लाभ", titleEn: "Possible benefit" },
    { id: "who", titleHi: "कौन पात्र हो सकता है?", titleEn: "Who may be eligible?" },
    { id: "docs", titleHi: "जरूरी दस्तावेज़", titleEn: "Documents" },
    { id: "steps", titleHi: "आवेदन प्रक्रिया (जानकारी)", titleEn: "Application path (guidance)" },
  ];

  return (
    <AppShell
      title={hi ? scheme.nameHi : scheme.nameEn}
      subtitle={hi ? "AgriVeda योजना जानकारी" : "AgriVeda scheme information"}
      breadcrumbs={[
        { label: hi ? "होम" : "Home", href: "/" },
        { label: hi ? "योजनाएँ" : "Schemes", href: "/schemes" },
        { label: hi ? "विवरण" : "Detail" },
      ]}
    >
      <div className="space-y-4 pb-28">
        <section className="overflow-hidden rounded-2xl border border-emerald-800/20 bg-emerald-950 shadow-lg shadow-emerald-900/20">
          <div className="relative flex min-h-[120px]">
            <div className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-1 bg-emerald-950 px-3.5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-200/90">
                {CATEGORY_LABEL_HI[scheme.category]}
                {" · "}
                {hi ? (scheme.level === "central" ? "केंद्रीय" : "राज्य") : scheme.level}
              </p>
              <h2 className="text-[15px] font-extrabold leading-snug text-white">
                {hi ? scheme.nameHi : scheme.nameEn}
              </h2>
              <p className="text-[11px] font-medium leading-snug text-emerald-100/90">{scheme.schemeTypeHi}</p>
            </div>
            <div className="relative w-[46%] min-w-[130px] max-w-[220px] shrink-0 self-stretch">
              <Image src={img} alt="" fill priority sizes="220px" className="object-cover object-center" />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-emerald-950 via-emerald-950/50 to-transparent"
              />
            </div>
          </div>
        </section>

        <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5 text-[12px] leading-relaxed text-[var(--av-text-secondary)]">
          <p>
            <span className="font-bold text-[var(--av-text-primary)]">
              {hi ? "जारी करने वाली संस्था: " : "Issuing authority: "}
            </span>
            {scheme.authority}
          </p>
          <p className="mt-1.5">
            <span className="font-bold text-[var(--av-text-primary)]">
              {hi ? "आधिकारिक स्रोत: " : "Official source: "}
            </span>
            {official ? (
              <button
                type="button"
                onClick={() => requestPortal("detail_source")}
                className="font-semibold text-[var(--av-accent)] underline-offset-2 hover:underline"
              >
                {scheme.officialSourceTitle || scheme.officialSourceUrl}
              </button>
            ) : hi ? (
              SCHEMES_MISSING_SOURCE_HI
            ) : (
              SCHEMES_MISSING_SOURCE_EN
            )}
          </p>
          <p className="mt-1.5">
            <span className="font-bold text-[var(--av-text-primary)]">
              {hi ? "अंतिम सत्यापन: " : "Last verified: "}
            </span>
            {scheme.lastVerified}
            {hi ? " (AgriVeda समीक्षा)" : " (AgriVeda review)"}
          </p>
          <p className="mt-1.5">
            <span className="font-bold text-[var(--av-text-primary)]">
              {hi ? "स्थिति: " : "Status: "}
            </span>
            {hi ? status.hi : status.en}
          </p>
          {official ? (
            <p className="mt-2 inline-flex rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-[#07512f] dark:text-emerald-200">
              {hi ? "आधिकारिक स्रोत उपलब्ध" : "Official source available"}
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5">
          <p className="text-[11px] font-bold text-[var(--av-text-muted)]">
            {hi ? "संभावित लाभ" : "Possible benefit"}
          </p>
          {scheme.benefitAmount ? (
            <>
              <p className="mt-1 text-[16px] font-extrabold text-[var(--av-text-primary)]">{scheme.benefitAmount}</p>
              <p className="text-[11px] text-[var(--av-text-muted)]">
                {hi ? SCHEMES_BENEFIT_FOOTNOTE_HI : SCHEMES_BENEFIT_FOOTNOTE_EN}
              </p>
            </>
          ) : (
            <p className="mt-1 text-[13px] text-[var(--av-text-secondary)]">
              {hi
                ? "योजना के नियमों के अनुसार वित्तीय सहायता"
                : "Financial assistance as per scheme rules"}
            </p>
          )}
          <p className="mt-2 text-[12px] leading-relaxed text-[var(--av-text-secondary)]">{scheme.benefitHi}</p>
        </div>

        <div className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5">
          <p className="text-[11px] font-bold text-[var(--av-text-muted)]">
            {hi ? "AgriVeda क्या करता है?" : "What AgriVeda does"}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-[var(--av-text-secondary)]">
            {hi
              ? "प्रारंभिक जानकारी और eligibility guidance"
              : "Preliminary information and eligibility guidance"}
          </p>
        </div>

        <div className="space-y-2">
          {panels.map((panel) => {
            const isOpen = open === panel.id;
            return (
              <div
                key={panel.id}
                className="overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? "about" : panel.id)}
                  className="flex min-h-[48px] w-full items-center justify-between gap-2 px-4 py-3 text-left"
                >
                  <span className="text-[14px] font-extrabold text-[#07512f] dark:text-emerald-100">
                    {hi ? panel.titleHi : panel.titleEn}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-[var(--av-text-muted)] transition",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                {isOpen ? (
                  <div className="border-t border-[var(--av-border)] px-4 py-3">
                    {panel.id === "about" ? (
                      <p className="text-[13px] leading-relaxed text-[var(--av-text-secondary)]">
                        {scheme.purposeHi}
                      </p>
                    ) : null}
                    {panel.id === "benefit" ? (
                      <p className="text-[13px] leading-relaxed text-[var(--av-text-secondary)]">
                        {scheme.benefitHi}
                      </p>
                    ) : null}
                    {panel.id === "who" ? (
                      <div className="space-y-2">
                        <p className="flex items-start gap-2 text-[13px] text-[var(--av-text-secondary)]">
                          <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#08763f]" />
                          {hi
                            ? "योजना की आधिकारिक पात्रता के अनुसार"
                            : "As per official scheme eligibility"}
                        </p>
                        <p className="text-[13px] leading-relaxed text-[var(--av-text-secondary)]">{scheme.whoHi}</p>
                        <ul className="space-y-1.5">
                          {scheme.tipsHi.slice(0, 3).map((t) => (
                            <li key={t} className="flex items-start gap-2 text-[12px] text-[var(--av-text-secondary)]">
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#08763f]" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {panel.id === "docs" ? (
                      <div className="grid grid-cols-2 gap-2">
                        {scheme.docsHi.map((d) => (
                          <div
                            key={d}
                            className="flex items-start gap-2 rounded-xl bg-[var(--av-surface-inset)] p-2.5"
                          >
                            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#08763f]" />
                            <span className="text-[11px] font-semibold leading-snug text-[var(--av-text-secondary)]">
                              {d}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {panel.id === "steps" ? (
                      <ol className="space-y-2.5">
                        {scheme.stepsHi.map((step, i) => (
                          <li key={step} className="flex gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[12px] font-black text-[#07512f]">
                              {i + 1}
                            </span>
                            <span className="pt-0.5 text-[12px] leading-relaxed text-[var(--av-text-secondary)]">
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <section className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-3.5">
          <p className="text-[15px] font-extrabold text-[#07512f] dark:text-emerald-100">
            {hi ? "आगे क्या करें?" : "What to do next?"}
          </p>
          <ol className="mt-3 space-y-2.5">
            {NEXT_STEPS.map((step, i) => {
              const Icon = step.Icon;
              return (
                <li key={step.hi} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[12px] font-black text-[#07512f]">
                    {i + 1}
                  </span>
                  <span className="flex min-w-0 items-start gap-2 pt-0.5 text-[12px] leading-relaxed text-[var(--av-text-secondary)]">
                    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#08763f]" />
                    {hi ? step.hi : step.en}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        <SchemeEligibilityChecker
          hi={hi}
          schemes={[scheme]}
          initialState={profile.state}
          focusScheme={scheme}
        />

        <p className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2.5 text-[11px] leading-relaxed text-amber-950 dark:text-amber-50">
          <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {scheme.verifyNoteHi}
        </p>

        <SchemeTrustAndSafety hi={hi} />

        <AppLink href="/schemes" className="inline-flex text-[13px] font-bold text-[var(--av-accent)]">
          {hi ? "← सभी योजनाएँ" : "← All schemes"}
        </AppLink>
      </div>

      <div className="fixed inset-x-0 bottom-[4.5rem] z-30 mx-auto flex w-full max-w-lg gap-2 px-3 lg:bottom-4">
        {hasGuide ? (
          <AppLink
            href={`/schemes/${scheme.id}/guide`}
            onClick={() => track("scheme_guide_start", { id: scheme.id, from: "detail_sticky" })}
            className="flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 text-[13px] font-extrabold text-[#07512f] dark:text-emerald-100"
          >
            {hi ? "पात्रता समझें" : "Understand eligibility"}
            <ArrowRight className="h-4 w-4" />
          </AppLink>
        ) : (
          <AppLink
            href="/ask-query"
            className="flex min-h-[50px] flex-1 items-center justify-center gap-2 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] px-3 text-[13px] font-extrabold text-[#07512f] dark:text-emerald-100"
          >
            {hi ? "मार्गदर्शन" : "Guidance"}
            <ListOrdered className="h-4 w-4" />
          </AppLink>
        )}
        {official ? (
          <button
            type="button"
            onClick={() => requestPortal("detail_sticky")}
            className="flex min-h-[50px] flex-[1.3] items-center justify-center gap-2 rounded-2xl bg-[#08763f] px-3 text-[13px] font-extrabold text-white shadow-lg shadow-emerald-900/30"
          >
            {hi ? "आधिकारिक पोर्टल पर जाएं →" : "Go to official portal →"}
            <ExternalLink className="h-4 w-4" />
          </button>
        ) : (
          <span className="flex min-h-[50px] flex-[1.3] items-center justify-center rounded-2xl bg-[var(--av-surface-inset)] px-3 text-center text-[11px] font-semibold text-[var(--av-text-muted)]">
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
