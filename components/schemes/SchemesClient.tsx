"use client";

import { useMemo, useState } from "react";
import {
  CreditCard,
  ExternalLink,
  FileText,
  Landmark,
  Lightbulb,
  Shield,
  Tractor,
  Users,
} from "lucide-react";
import AppShell from "@/components/shell/AppShell";
import AppLink from "@/components/ui/AppLink";
import {
  CATEGORY_LABEL_HI,
  SCHEMES_LEGAL_NOTE_HI,
  farmerSchemes,
  kccQuickStepsHi,
  schemeQuickJumps,
  type FarmerScheme,
} from "@/data/schemes/farmerSchemes";
import { SCHEME_GUIDE_IDS } from "@/data/schemes/schemeGuides";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { track } from "@/lib/analytics";

const GUIDED = new Set<string>(SCHEME_GUIDE_IDS);

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

function SchemeCard({
  scheme: s,
  hi,
  expanded,
  onToggle,
}: {
  scheme: FarmerScheme;
  hi: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <li
      id={`scheme-${s.id}`}
      className="scroll-mt-24 rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--av-accent)]">
            {CATEGORY_LABEL_HI[s.category]}
          </p>
          <h3 className="mt-0.5 text-[15px] font-bold text-[var(--av-text-primary)]">
            {hi ? s.nameHi : s.nameEn}
          </h3>
          {s.tagsHi?.length ? (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {s.tagsHi.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-[var(--av-surface-inset)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--av-text-muted)]"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <span className="shrink-0 rounded-md bg-[var(--av-surface-inset)] px-2 py-0.5 text-[10px] font-bold text-[var(--av-text-muted)]">
          {s.evidence}
        </span>
      </div>

      <p className="mt-2 text-[12px] text-[var(--av-text-secondary)]">{s.purposeHi}</p>
      <p className="mt-1.5 text-[12px] font-medium text-[var(--av-text-primary)]">{s.benefitHi}</p>

      {GUIDED.has(s.id) ? (
        <AppLink
          href={`/schemes/${s.id}/guide`}
          onClick={() => track("scheme_guide_start", { id: s.id, from: "card_peek" })}
          className="mt-2 inline-flex text-[12px] font-bold text-[var(--av-accent)]"
        >
          {hi ? "गाइड शुरू →" : "Start guide →"}
        </AppLink>
      ) : null}

      <button
        type="button"
        onClick={onToggle}
        className="mt-2 block text-[12px] font-bold text-[var(--av-accent)]"
        aria-expanded={expanded}
      >
        {expanded
          ? hi
            ? "कम दिखाएँ ▲"
            : "Show less ▲"
          : hi
            ? "कैसे आवेदन / कागज़ / टिप्स ▼"
            : "How to apply / docs / tips ▼"}
      </button>

      {expanded ? (
        <div className="mt-3 space-y-3 border-t border-[var(--av-border)] pt-3">
          <p className="flex items-start gap-1.5 text-[12px] text-[var(--av-text-secondary)]">
            <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--av-accent)]" />
            <span>
              <span className="font-bold text-[var(--av-text-primary)]">
                {hi ? "किसके लिए: " : "Who: "}
              </span>
              {s.whoHi}
            </span>
          </p>

          <p className="flex items-start gap-1.5 text-[12px] text-[var(--av-text-secondary)]">
            <Landmark className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--av-accent)]" />
            <span>
              <span className="font-bold text-[var(--av-text-primary)]">
                {hi ? "कहाँ / कैसे: " : "Where: "}
              </span>
              {s.applyHi}
            </span>
          </p>

          <div className="flex items-start gap-1.5 text-[12px] text-[var(--av-text-secondary)]">
            <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--av-accent)]" />
            <div>
              <p className="font-bold text-[var(--av-text-primary)]">
                {hi ? "आमतौर पर कागज़" : "Usual documents"}
              </p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4">
                {s.docsHi.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-1.5 text-[12px] text-[var(--av-text-secondary)]">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--av-accent)]" />
            <div>
              <p className="font-bold text-[var(--av-text-primary)]">
                {hi ? "किसान टिप्स" : "Tips"}
              </p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4">
                {s.tipsHi.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="flex items-start gap-1.5 text-[11px] text-amber-800 dark:text-amber-200">
            <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {s.verifyNoteHi}
          </p>

          <div className="flex flex-wrap gap-2">
            {GUIDED.has(s.id) ? (
              <AppLink
                href={`/schemes/${s.id}/guide`}
                onClick={() => track("scheme_guide_start", { id: s.id })}
                className="inline-flex items-center gap-1 rounded-lg bg-[var(--av-accent)] px-3 py-1.5 text-[12px] font-bold text-white"
              >
                {hi ? "गाइड शुरू" : "Start guide"}
              </AppLink>
            ) : null}
            {s.portal ? (
              <a
                href={s.portal}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("scheme_portal_open", { id: s.id, from: "list" })}
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-bold ${
                  GUIDED.has(s.id)
                    ? "border border-[var(--av-border)] text-[var(--av-accent)]"
                    : "bg-[var(--av-accent)] text-white"
                }`}
              >
                {s.portalLabelHi || (hi ? "आधिकारिक साइट" : "Official site")}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
            {s.secondaryLinks?.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--av-border)] px-3 py-1.5 text-[12px] font-bold text-[var(--av-accent)]"
              >
                {link.labelHi}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-2 flex items-start gap-1.5 text-[11px] text-amber-800 dark:text-amber-200">
          <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {s.verifyNoteHi}
        </p>
      )}
    </li>
  );
}

export default function SchemesClient() {
  const { locale } = useLocale();
  const hi = locale === "hi";
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [openId, setOpenId] = useState<string | null>("kcc");

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

        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {schemeQuickJumps.map((j) => (
            <a
              key={j.id}
              href={`#${j.hrefHash}`}
              onClick={() => {
                setFilter("all");
                setOpenId(j.id);
              }}
              className="shrink-0 rounded-full border border-[var(--av-border)] bg-[var(--av-surface)] px-3 py-1.5 text-[11px] font-bold text-[var(--av-text-primary)]"
            >
              {j.labelHi}
            </a>
          ))}
        </div>

        <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3">
          <p className="text-[12px] font-bold text-[var(--av-text-primary)]">
            {hi ? "एग्रीवेदा पर कदम-दर-कदम गाइड" : "Step-by-step on Agraveda"}
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--av-text-muted)]">
            {hi
              ? "तैयारी यहाँ · सरकारी फॉर्म सिर्फ आखिर में"
              : "Prep here · gov form only at the end"}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SCHEME_GUIDE_IDS.map((id) => {
              const s = farmerSchemes.find((x) => x.id === id);
              if (!s) return null;
              return (
                <AppLink
                  key={id}
                  href={`/schemes/${id}/guide`}
                  onClick={() => track("scheme_guide_start", { id, from: "strip" })}
                  className="rounded-lg border border-emerald-600/30 bg-[var(--av-surface)] px-2.5 py-1.5 text-[11px] font-bold text-emerald-900 dark:text-emerald-100"
                >
                  {s.nameHi.length > 22 ? s.nameHi.slice(0, 20) + "…" : s.nameHi}
                </AppLink>
              );
            })}
          </div>
        </section>

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
            <div className="border-t border-[var(--av-border)] px-4 py-3">
              <p className="text-[11px] font-bold text-[var(--av-text-muted)]">
                {hi ? "लेकर जाएँ" : "Carry"}
              </p>
              <p className="mt-1 text-[12px] text-[var(--av-text-secondary)]">
                {kcc.docsHi.join(" · ")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <AppLink
                  href="/schemes/kcc/guide"
                  onClick={() => track("scheme_guide_start", { id: "kcc", from: "hero" })}
                  className="inline-flex items-center rounded-lg bg-[var(--av-accent)] px-3 py-2 text-[12px] font-bold text-white"
                >
                  {hi ? "गाइड शुरू — कदम दर कदम" : "Start guide — step by step"}
                </AppLink>
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg border border-[var(--av-border)] px-3 py-2 text-[12px] font-bold text-[var(--av-accent)]"
                  onClick={() => {
                    setFilter("all");
                    setOpenId("kcc");
                    document.getElementById("scheme-kcc")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {hi ? "पूरी KCC डिटेल ↓" : "Full KCC detail ↓"}
                </button>
              </div>
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-[var(--av-text-primary)]">
            <Tractor className="h-4 w-4 text-[var(--av-accent)]" />
            {hi ? "ट्रैक्टर / रोटावेटर / किराया" : "Tractor / rotavator / hire"}
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--av-text-secondary)]">
            {hi
              ? "इम्प्लीमेंट्स (रोटावेटर, सीड ड्रिल, थ्रेशर) अक्सर ट्रैक्टर लॉटरी से पहले आसान। छोटे किसान CHC/यंत्र बैंक से किराया लें। पराली सीजन में हैप्पी/सुपर सीडर पूछें।"
              : "Implements are often easier than tractor lottery. Small farmers can hire via CHC; ask for Happy/Super Seeder in residue season."}
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
            <SchemeCard
              key={s.id}
              scheme={s}
              hi={hi}
              expanded={openId === s.id}
              onToggle={() => setOpenId((prev) => (prev === s.id ? null : s.id))}
            />
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
