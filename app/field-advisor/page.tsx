"use client";

import AppLink from "@/components/ui/AppLink";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import PageHero from "@/components/shell/PageHero";
import Badge from "@/components/design-system/Badge";
import { AV } from "@/lib/design/tokens";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  FIELD_ADVISOR_HELP,
  FIELD_TOOLS,
} from "@/data/mock/field-advisor";
import { useDashboardAlerts } from "@/hooks/useDashboardAlerts";
import { useFarmData } from "@/hooks/useFarmData";
import { buildFieldRecommendations } from "@/lib/field-advisor/buildFieldRecommendations";
import { Brain, AlertTriangle, MessageCircle } from "lucide-react";

const SEVERITY_STYLES = {
  critical: "border-red-500/30 bg-red-500/10 text-red-400",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  info: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
};

export default function FieldAdvisorPage() {
  const { t } = useLocale();
  const alerts = useDashboardAlerts(6);
  const recommendations = buildFieldRecommendations(alerts);
  const { stats, data: farmData } = useFarmData();
  const hasFields = farmData.fields.length > 0;
  const healthLabel =
    !hasFields
      ? "—"
      : stats.healthScore >= 80
        ? "अच्छा"
        : stats.healthScore >= 65
          ? "औसत"
          : "ध्यान दें";

  return (
    <AppShell
      className="!bg-transparent"
      title="खेत सलाहकार (Field Advisor)"
      subtitle="स्मार्ट खेती के फैसलों के लिए आपका निजी कृषि सलाहकार"
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: t("shellFieldAdvisor") }]}
    >
      <PageHero
        title="आपका निजी कृषि सलाहकार"
        subtitle="आपके खेत, मिट्टी और मौसम के आधार पर फसल-विशेष सलाह।"
        badge="एआई (AI) से"
        icon={Brain}
        action={{ label: "एआई सलाहकार से पूछें", href: "/kisan-saathi" }}
      />

      <h3 className="text-sm font-bold text-[var(--av-text-primary)]">आज आपको किस बात में मदद चाहिए?</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {FIELD_ADVISOR_HELP.map((item, i) => (
          <AppLink key={item.title} href={item.href}>
            <DarkCard hover delay={i} className="h-full border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 to-transparent text-center">
              <span className="text-2xl">{item.icon}</span>
              <p className="mt-2 text-xs font-bold text-[var(--av-text-primary)]">{item.title}</p>
              <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">{item.desc}</p>
            </DarkCard>
          </AppLink>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1} className="border-emerald-500/15">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">आपके खेतों के लिए सलाह</h3>
            <Badge variant="info">{recommendations.length} टिप्स</Badge>
          </div>
          <ul className="mt-3 space-y-2">
            {recommendations.map((r) => (
              <li key={`${r.crop}-${r.tip}`} className="flex items-center justify-between rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2">
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-semibold text-[var(--av-text-primary)]">{r.crop}</p>
                  <p className="text-[10px] text-[var(--av-text-muted)]">{r.tip}</p>
                </div>
                <AppLink href={r.href} className="shrink-0 text-[10px] font-bold text-[var(--av-accent)]">देखें →</AppLink>
              </li>
            ))}
          </ul>
        </DarkCard>

        <DarkCard hover delay={2}>
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">विशेषज्ञ से पूछें</h3>
          <p className="mt-2 text-xs leading-relaxed text-[var(--av-text-muted)]">
            फसल, कीट-रोग या खाद की समस्या हो तो हमारे कृषि विशेषज्ञों से सीधे सवाल पूछें।
          </p>
          <AppLink
            href="/ask-query"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--av-accent)] px-4 py-2.5 text-sm font-bold text-white"
          >
            <MessageCircle className="h-4 w-4" />
            विशेषज्ञ से पूछें
          </AppLink>
        </DarkCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1} className="border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 to-transparent">
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">खेत स्वास्थ्य सारांश</h3>
          {hasFields ? (
            <>
              <p className="mt-4 text-center text-4xl font-black tabular-nums text-emerald-400">
                {stats.healthScore}%
              </p>
              <p className="mt-1 text-center text-sm font-semibold text-[var(--av-text-primary)]">
                {healthLabel}
              </p>
              <p className="mt-3 text-center text-xs text-emerald-400">
                {stats.healthScore >= 75
                  ? "बढ़िया! आपके खेत अच्छी स्थिति में हैं।"
                  : "नीचे अलर्ट देखें और इस हफ्ते कार्रवाई करें।"}
              </p>
            </>
          ) : (
            <p className="mt-4 text-center text-xs text-[var(--av-text-muted)]">
              अभी कोई खेत नहीं जोड़ा —{" "}
              <AppLink href="/my-farm" className="font-bold text-[var(--av-accent)]">
                मेरा खेत
              </AppLink>{" "}
              में फसल जोड़ें।
            </p>
          )}
        </DarkCard>

        <DarkCard hover delay={2}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">महत्वपूर्ण अलर्ट</h3>
            <Badge variant={alerts.length ? "warning" : "success"}>{alerts.length} सक्रिय</Badge>
          </div>
          <ul className="mt-3 space-y-2">
            {alerts.length === 0 ? (
              <li className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-4 text-center text-xs text-emerald-400">
                कोई सक्रिय अलर्ट नहीं — सब ठीक ✓
              </li>
            ) : (
              alerts.map((a) => (
                <li key={a.id} className={`rounded-lg border px-3 py-2 ${SEVERITY_STYLES[a.severity]}`}>
                  <AppLink href={a.actionHref ?? "/alerts"} className="block">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-[var(--av-text-primary)]">
                      {a.severity !== "info" && <AlertTriangle className="h-3 w-3 shrink-0" />}
                      {a.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[var(--av-text-muted)]">{a.body}</p>
                    {a.actionLabel && (
                      <p className="mt-1 text-[10px] font-bold text-[var(--av-accent)]">{a.actionLabel} →</p>
                    )}
                  </AppLink>
                </li>
              ))
            )}
          </ul>
          <AppLink href="/alerts" className={`mt-3 inline-flex ${AV.btnSecondarySm}`}>
            सभी अलर्ट देखें
          </AppLink>
        </DarkCard>
      </div>

      <h3 className="mt-6 text-sm font-bold text-[var(--av-text-primary)]">टूल और कैलकुलेटर</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {FIELD_TOOLS.map((tool, i) => (
          <AppLink key={tool.title} href={tool.href}>
            <DarkCard hover delay={i} className="h-full">
              <p className="text-xs font-bold text-[var(--av-text-primary)]">{tool.title}</p>
              <p className="mt-1 text-[10px] text-[var(--av-text-muted)]">{tool.desc}</p>
              <span className="mt-2 inline-block text-[10px] font-semibold text-[var(--av-accent)]">टूल इस्तेमाल करें →</span>
            </DarkCard>
          </AppLink>
        ))}
      </div>

      <ShellCtaBanner
        title="निजी सलाह चाहिए?"
        description="हमारे कृषि विशेषज्ञों से बात करें — अपनी समस्या का समाधान पाएँ।"
        buttonLabel="अभी विशेषज्ञ से संपर्क करें"
        href="/ask-query"
      />
    </AppShell>
  );
}
