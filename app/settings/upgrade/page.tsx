"use client";

import { useState } from "react";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import PageHero from "@/components/shell/PageHero";
import { PREMIUM_FEATURES, PREMIUM_PLANS, PLAN_COMPARISON, PREMIUM_FAQ } from "@/data/mock/premium";
import { Check, X, Crown, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { AV } from "@/lib/design/tokens";

export default function UpgradePage() {
  const { showToast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <AppShell
      className="!bg-transparent"
      title="Upgrade to AgriVeda Premium 👑"
      subtitle="Unlock advanced features, expert insights and smart tools to take your farming to the next level"
      breadcrumbs={[{ label: "Settings", href: "/settings" }, { label: "Upgrade" }]}
    >
      <PageHero
        title="AgriVeda Premium"
        subtitle="Advanced AI Doctor, unlimited alerts, expert consultation & priority support."
        badge="Premium"
        icon={Crown}
        action={{ label: "Choose Plan", href: "#plans" }}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {PREMIUM_FEATURES.map((f, i) => (
          <DarkCard key={f.title} hover delay={i} className="text-center">
            <span className="text-2xl">{f.icon}</span>
            <p className="mt-2 text-xs font-bold text-[var(--av-text-primary)]">{f.title}</p>
            <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">{f.desc}</p>
          </DarkCard>
        ))}
      </div>

      <h2 id="plans" className="mt-8 text-center text-sm font-bold text-[var(--av-text-primary)]">Choose the best plan for you</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {PREMIUM_PLANS.map((plan, i) => (
          <DarkCard
            key={plan.id}
            hover
            delay={i}
            className={`relative flex flex-col ${plan.popular ? "border-[#10b981] ring-1 ring-[#10b981]/40" : ""}`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--av-accent)] px-3 py-0.5 text-[10px] font-bold text-white">
                MOST POPULAR
              </span>
            )}
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">{plan.name}</h3>
            <p className="mt-2 text-2xl font-black text-[var(--av-accent)]">
              {plan.price}<span className="text-sm font-normal text-[var(--av-text-muted)]">{plan.period}</span>
            </p>
            <p className="text-[10px] text-[var(--av-text-muted)]">{plan.billing}</p>
            {plan.save && <p className="mt-1 text-xs font-semibold text-emerald-400">{plan.save}</p>}
            <ul className="mt-4 flex-1 space-y-2">
              {plan.features.map((feat) => (
                <li key={feat} className="flex gap-2 text-xs text-[var(--av-text-secondary)]">
                  <Check className="h-4 w-4 shrink-0 text-[var(--av-accent)]" /> {feat}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                setSelectedPlan(plan.id);
                showToast(`${plan.name} interest saved — payment coming soon. We'll notify you.`);
              }}
              className={`mt-4 ${selectedPlan === plan.id ? AV.btnPrimarySm : AV.btnSecondarySm} w-full ${
                plan.popular && selectedPlan !== plan.id ? "border-[var(--av-accent)]" : ""
              }`}
            >
              {selectedPlan === plan.id ? "Interest saved" : `Notify me — ${plan.name}`}
            </button>
          </DarkCard>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { title: "7-Day Money Back", desc: "Not satisfied? Get full refund." },
          { title: "100% Secure Payment", desc: "Your payment is safe with us." },
          { title: "Cancel Anytime", desc: "Upgrade or downgrade anytime." },
        ].map((t) => (
          <DarkCard key={t.title} className="text-center">
            <p className="text-xs font-bold text-[var(--av-text-primary)]">{t.title}</p>
            <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">{t.desc}</p>
          </DarkCard>
        ))}
      </div>

      <DarkCard className="mt-6 overflow-x-auto" delay={1}>
        <h3 className="mb-3 text-sm font-bold text-[var(--av-text-primary)]">Compare Plans</h3>
        <table className="w-full min-w-[480px] text-xs">
          <thead>
            <tr className="text-[var(--av-text-muted)]">
              <th className="pb-2 text-left font-semibold">Feature</th>
              <th className="pb-2 text-center font-semibold">Free</th>
              <th className="pb-2 text-center font-semibold text-[var(--av-accent)]">Premium</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f2937]">
            {PLAN_COMPARISON.map((row) => (
              <tr key={row.feature}>
                <td className="py-2 text-[var(--av-text-secondary)]">{row.feature}</td>
                <td className="py-2 text-center">
                  {typeof row.free === "boolean" ? (
                    row.free ? <Check className="mx-auto h-4 w-4 text-emerald-400" /> : <X className="mx-auto h-4 w-4 text-red-400" />
                  ) : (
                    <span className="text-[var(--av-text-muted)]">{row.free}</span>
                  )}
                </td>
                <td className="py-2 text-center">
                  {typeof row.premium === "boolean" ? (
                    row.premium ? <Check className="mx-auto h-4 w-4 text-emerald-400" /> : <X className="mx-auto h-4 w-4 text-red-400" />
                  ) : (
                    <span className="font-semibold text-[var(--av-accent)]">{row.premium}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DarkCard>

      <div className="mt-6">
        <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Frequently Asked Questions</h3>
        <div className="mt-3 space-y-2">
          {PREMIUM_FAQ.map((faq, i) => (
            <DarkCard key={faq.q} delay={i}>
              <button
                type="button"
                className="flex w-full items-center justify-between text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="text-sm font-semibold text-[var(--av-text-primary)]">{faq.q}</span>
                {openFaq === i ? <ChevronUp className="h-4 w-4 text-[var(--av-text-muted)]" /> : <ChevronDown className="h-4 w-4 text-[var(--av-text-muted)]" />}
              </button>
              {openFaq === i && <p className="mt-2 text-sm text-[var(--av-text-secondary)]">{faq.a}</p>}
            </DarkCard>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-[#10b981]/30 bg-gradient-to-r from-[#059669]/40 to-[#10b981]/20 p-6 text-center lg:flex lg:items-center lg:justify-between lg:text-left">
        <div className="flex items-center justify-center gap-3 lg:justify-start">
          <Crown className="h-8 w-8 text-amber-400" />
          <p className="text-sm text-[var(--av-text-primary)]">
            Ready to take your farming to the next level? Join thousands of smart farmers who trust AgriVeda Premium.
          </p>
        </div>
        <button
          type="button"
          onClick={() => showToast("Interest noted — payment opens soon. You'll get a notify option in Settings.")}
          className={`mt-4 lg:mt-0 ${AV.btnPrimarySm} bg-white text-[#059669] hover:bg-white/90`}
        >
          Notify me when Premium opens →
        </button>
      </div>
    </AppShell>
  );
}
