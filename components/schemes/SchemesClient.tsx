"use client";

import { useMemo, useState } from "react";
import {
  CreditCard,
  ExternalLink,
  Landmark,
  Tractor,
  Shield,
} from "lucide-react";
import AppShell from "@/components/shell/AppShell";
import AppLink from "@/components/ui/AppLink";
import {
  CATEGORY_LABEL_HI,
  SCHEMES_LEGAL_NOTE_HI,
  farmerSchemes,
  kccQuickStepsHi,
  type FarmerScheme,
} from "@/data/schemes/farmerSchemes";
import { useLocale } from "@/components/i18n/LocaleProvider";

const FILTERS: Array<FarmerScheme["category"] | "all"> = [
  "all",
  "credit",
  "mechanization",
  "income",
  "insurance",
  "irrigation",
  "state",
  "soil",
  "energy",
  "market",
];

export default function SchemesClient() {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const list = useMemo(
    () => (filter === "all" ? farmerSchemes : farmerSchemes.filter((s) => s.category === filter)),
    [filter]
  );

  const kcc = farmerSchemes.find((s) => s.id === "kcc");

  return (
    <AppShell
      title={hi ? "योजना · KCC · यंत्र" : "Schemes · KCC · Machinery"}
      subtitle={hi ? "सरकारी योजनाओं का सरल रास्ता" : "Simple paths to farmer schemes"}
      breadcrumbs={[
        { label: hi ? "होम" : "Home", href: "/" },
        { label: hi ? "योजनाएँ" : "Schemes" },
      ]}
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] leading-relaxed text-amber-950 dark:text-amber-50">
          {SCHEMES_LEGAL_NOTE_HI}
        </div>

        {/* KCC highlight */}
        {kcc ? (
          <section className="overflow-hidden rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] shadow-[var(--av-shadow-sm)]">
            <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 px-4 py-4 text-white">
              <p className="flex items-center gap-2 text-[11px] font-bold tracking-wide text-emerald-200">
                <CreditCard className="h-4 w-4" />
                KCC
              </p>
              <h2 className="mt-1 font-display text-xl font-bold">{kcc.nameHi}</h2>
              <p className="mt-1 text-[13px] text-white/85">{kcc.benefitHi}</p>
            </div>
            <ol className="space-y-2 px-4 py-3 text-[13px] text-[var(--av-text-secondary)]">
              {kccQuickStepsHi.map((step) => (
                <li key={step} className="flex gap-2">
                  <span className="font-bold text-[var(--av-accent)]">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {/* Mechanization callout */}
        <section className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-[var(--av-text-primary)]">
            <Tractor className="h-4 w-4 text-[var(--av-accent)]" />
            {hi ? "ट्रैक्टर / रोटावेटर सब्सिडी" : "Tractor / rotavator subsidy"}
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--av-text-secondary)]">
            {hi
              ? "इम्प्लीमेंट्स (रोटावेटर, सीड ड्रिल, थ्रेशर) अक्सर ट्रैक्टर से पहले सब्सिडी में आसान। UP यंत्र पोर्टल पर टोकन बुक करें। छोटे किसान CHC/यंत्र बैंक से किराया लें।"
              : "Implements are often easier than tractor lottery. Book on UP yantra portal; small farmers can hire via CHC."}
          </p>
        </section>

        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                filter === f
                  ? "bg-[var(--av-accent)] text-white"
                  : "bg-[var(--av-surface-inset)] text-[var(--av-text-muted)]"
              }`}
            >
              {f === "all" ? (hi ? "सभी" : "All") : CATEGORY_LABEL_HI[f]}
            </button>
          ))}
        </div>

        <ul className="space-y-3">
          {list.map((s) => (
            <li
              key={s.id}
              className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--av-accent)]">
                    {CATEGORY_LABEL_HI[s.category]}
                  </p>
                  <h3 className="mt-0.5 text-[15px] font-bold text-[var(--av-text-primary)]">
                    {hi ? s.nameHi : s.nameEn}
                  </h3>
                </div>
                <span className="shrink-0 rounded-md bg-[var(--av-surface-inset)] px-2 py-0.5 text-[10px] font-bold text-[var(--av-text-muted)]">
                  {s.evidence}
                </span>
              </div>
              <p className="mt-2 text-[12px] text-[var(--av-text-secondary)]">{s.purposeHi}</p>
              <p className="mt-1.5 text-[12px] font-medium text-[var(--av-text-primary)]">{s.benefitHi}</p>
              <p className="mt-2 flex items-start gap-1.5 text-[11px] text-[var(--av-text-muted)]">
                <Landmark className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {s.applyHi}
              </p>
              <p className="mt-1 flex items-start gap-1.5 text-[11px] text-amber-800 dark:text-amber-200">
                <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {s.verifyNoteHi}
              </p>
              {s.portal ? (
                <a
                  href={s.portal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-[12px] font-bold text-[var(--av-accent)]"
                >
                  {hi ? "आधिकारिक साइट" : "Official site"}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </li>
          ))}
        </ul>

        <p className="text-center text-[11px] text-[var(--av-text-muted)]">
          <AppLink href="/crops" className="font-bold text-[var(--av-accent)]">
            {hi ? "फसल गाइड →" : "Crop guides →"}
          </AppLink>
        </p>
      </div>
    </AppShell>
  );
}
