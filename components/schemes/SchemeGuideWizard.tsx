"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Shield,
} from "lucide-react";
import AppShell from "@/components/shell/AppShell";
import AppLink from "@/components/ui/AppLink";
import KccLimitCalculator from "@/components/schemes/KccLimitCalculator";
import MachinerySubsidyCalculator from "@/components/schemes/MachinerySubsidyCalculator";
import {
  GOV_PORTAL_SLOW_NOTE_HI,
  buildSchemePrepWhatsAppText,
  type SchemeGuide,
} from "@/data/schemes/schemeGuides";
import { SCHEMES_LEGAL_NOTE_HI } from "@/data/schemes/farmerSchemes";
import {
  formatInrHi,
  type KccLimitBreakdown,
} from "@/lib/schemes/kccLimitEstimate";
import { getCheckedDocs, setDocChecked } from "@/lib/schemes/schemeProgress";
import { openWhatsAppWithText } from "@/lib/whatsappShare";
import { track } from "@/lib/analytics";
import { AV } from "@/lib/design/tokens";
import { cn } from "@/lib/cn";

export default function SchemeGuideWizard({ guide }: { guide: SchemeGuide }) {
  const steps = guide.steps;
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [checked, setChecked] = useState<string[]>([]);
  const [estimate, setEstimate] = useState<KccLimitBreakdown | null>(null);

  useEffect(() => {
    setChecked(getCheckedDocs(guide.id));
  }, [guide.id]);

  useEffect(() => {
    track("scheme_guide_step", {
      id: guide.id,
      step: steps[stepIndex]?.id ?? String(stepIndex),
    });
  }, [guide.id, stepIndex, steps]);

  const step = steps[stepIndex]!;
  const isLast = stepIndex === steps.length - 1;
  const isCalc = step.id === "calc" && guide.showKccCalculator;
  const isMachCalc = step.id === "calc" && guide.showMachineryCalculator;
  const isEligible = step.id === "eligible";
  const isDocs = step.id === "docs";
  const isGo = step.id === "go" || isLast;

  const quizSoftFail = useMemo(() => {
    if (!guide.quiz.length) return false;
    return guide.quiz.some((q) => {
      const a = answers[q.id];
      if (a === null || a === undefined) return false;
      return a !== q.yesMeansOk;
    });
  }, [answers, guide.quiz]);

  const onToggleDoc = useCallback(
    (docId: string) => {
      const nextOn = !checked.includes(docId);
      const next = setDocChecked(guide.id, docId, nextOn);
      setChecked(next);
    },
    [checked, guide.id]
  );

  const shareWhatsApp = () => {
    const labels = guide.docs
      .filter((d) => checked.includes(d.id))
      .map((d) => d.labelHi);
    const estimateLine = estimate
      ? `KCC अनुमान≈ ${formatInrHi(estimate.estimateInr)} (${estimate.crop.nameHi}) — बैंक पक्का करे`
      : undefined;
    const text = buildSchemePrepWhatsAppText({
      guide,
      checkedLabels: labels,
      estimateLine,
    });
    openWhatsAppWithText(text);
    track("whatsapp_prep_shared", { id: guide.id });
  };

  const openPortal = () => {
    track("scheme_portal_open", { id: guide.id });
    window.open(guide.portal, "_blank", "noopener,noreferrer");
  };

  return (
    <AppShell
      title={guide.nameHi}
      subtitle={guide.taglineHi}
      breadcrumbs={[
        { label: "होम", href: "/" },
        { label: "योजनाएँ", href: "/schemes" },
        { label: "गाइड" },
      ]}
    >
      <div className="mx-auto max-w-lg space-y-4 pb-8">
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-[12px] leading-relaxed text-amber-950 dark:text-amber-50">
          {SCHEMES_LEGAL_NOTE_HI}
        </div>

        {/* Stepper */}
        <div className="flex gap-1">
          {steps.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStepIndex(i)}
              className={cn(
                "h-1.5 flex-1 rounded-full transition",
                i <= stepIndex ? "bg-emerald-600" : "bg-[var(--av-border)]"
              )}
              aria-label={s.titleHi}
            />
          ))}
        </div>
        <p className="text-[11px] font-semibold text-[var(--av-text-muted)]">
          कदम {stepIndex + 1}/{steps.length} · {step.titleHi}
        </p>

        <section className="rounded-2xl border border-[var(--av-border)] bg-[var(--av-surface)] p-4 shadow-[var(--av-shadow-sm)]">
          <h2 className="font-display text-lg font-bold text-[var(--av-text-primary)]">
            {step.titleHi}
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--av-text-secondary)]">
            {step.bodyHi}
          </p>

          {step.id === "what" ? (
            <p className="mt-3 text-[12px] text-[var(--av-text-muted)]">{guide.taglineHi}</p>
          ) : null}

          {isEligible ? (
            <div className="mt-4 space-y-3">
              {guide.quiz.map((q) => {
                const val = answers[q.id];
                return (
                  <div
                    key={q.id}
                    className="rounded-xl border border-[var(--av-border)] bg-[var(--av-surface-inset)] p-3"
                  >
                    <p className="text-[13px] font-semibold text-[var(--av-text-primary)]">
                      {q.questionHi}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: true }))}
                        className={cn(
                          "flex-1 rounded-lg py-2 text-[12px] font-bold",
                          val === true
                            ? "bg-emerald-700 text-white"
                            : "border border-[var(--av-border)] bg-[var(--av-surface)]"
                        )}
                      >
                        हाँ
                      </button>
                      <button
                        type="button"
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: false }))}
                        className={cn(
                          "flex-1 rounded-lg py-2 text-[12px] font-bold",
                          val === false
                            ? "bg-amber-700 text-white"
                            : "border border-[var(--av-border)] bg-[var(--av-surface)]"
                        )}
                      >
                        नहीं
                      </button>
                    </div>
                    {val === false && q.failHintHi ? (
                      <p className="mt-2 text-[11px] text-[var(--av-text-muted)]">{q.failHintHi}</p>
                    ) : null}
                  </div>
                );
              })}
              {quizSoftFail ? (
                <div className="flex gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-[12px] leading-snug text-amber-950 dark:text-amber-50">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{guide.softFailHi}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          {isDocs ? (
            <ul className="mt-4 space-y-2">
              {guide.docs.map((d) => {
                const on = checked.includes(d.id);
                return (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() => onToggleDoc(d.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition",
                        on
                          ? "border-emerald-500/40 bg-emerald-500/10"
                          : "border-[var(--av-border)] bg-[var(--av-surface-inset)]"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-md border",
                          on
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-[var(--av-border)]"
                        )}
                      >
                        {on ? <Check className="h-3.5 w-3.5" /> : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-bold text-[var(--av-text-primary)]">
                          {d.labelHi}
                        </span>
                        {!d.required ? (
                          <span className="text-[10px] text-[var(--av-text-muted)]">वैकल्पिक</span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {isCalc ? (
            <div className="mt-4">
              <KccLimitCalculator onEstimate={setEstimate} />
            </div>
          ) : null}

          {isMachCalc ? (
            <div className="mt-4">
              <MachinerySubsidyCalculator />
            </div>
          ) : null}

          {isGo ? (
            <div className="mt-4 space-y-3">
              {guide.branchNoteHi ? (
                <p className="text-[12px] text-[var(--av-text-secondary)]">{guide.branchNoteHi}</p>
              ) : null}
              <button type="button" onClick={openPortal} className={`w-full ${AV.btnPrimary}`}>
                <ExternalLink className="h-4 w-4" />
                {guide.portalLabelHi}
              </button>
              <p className="text-center text-[11px] text-[var(--av-text-muted)]">
                {GOV_PORTAL_SLOW_NOTE_HI}
              </p>
              <button
                type="button"
                onClick={shareWhatsApp}
                className={`w-full ${AV.btnSecondary}`}
              >
                <MessageCircle className="h-4 w-4" />
                तैयारी WhatsApp पर भेजें
              </button>
            </div>
          ) : null}
        </section>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-[var(--av-border)] py-3 text-[13px] font-bold",
              stepIndex === 0 && "opacity-40"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            पीछे
          </button>
          {!isLast ? (
            <button
              type="button"
              onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
              className={`inline-flex flex-1 items-center justify-center gap-1 ${AV.btnPrimary}`}
            >
              आगे
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <AppLink
              href="/schemes"
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-[var(--av-border)] py-3 text-[13px] font-bold"
            >
              सभी योजनाएँ
            </AppLink>
          )}
        </div>
      </div>
    </AppShell>
  );
}
