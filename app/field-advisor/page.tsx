"use client";

import AppLink from "@/components/ui/AppLink";
import AppShell, { ShellCtaBanner } from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
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
import { AlertTriangle, ChevronRight, MessageCircle } from "lucide-react";

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
      title="खेत सलाह"
      subtitle="आज किस काम में मदद चाहिए?"
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: t("shellFieldAdvisor") }]}
    >
      <div className="relative mb-4 overflow-hidden rounded-[22px] border border-emerald-500/25 shadow-[var(--av-shadow-sm)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/jobs/job-my-farm.jpg"
          alt=""
          className="h-40 w-full object-cover sm:h-44"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[18px] font-extrabold text-white">आज क्या करना है?</p>
          <p className="mt-0.5 text-[12px] font-medium text-white/85">
            नीचे कार्ड टैप करो — एक काम, एक झटके में
          </p>
        </div>
      </div>

      <h3 className="text-sm font-bold text-[var(--av-text-primary)]">मदद चुनो</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {FIELD_ADVISOR_HELP.map((item) => (
          <AppLink
            key={item.title}
            href={item.href}
            className="group relative flex min-h-[112px] overflow-hidden rounded-2xl border border-[var(--av-border)] shadow-[var(--av-shadow-sm)] active:scale-[0.98]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
            <div className="relative z-10 flex flex-1 flex-col justify-end p-3">
              <p className="text-[14px] font-extrabold leading-snug text-white">{item.title}</p>
              <p className="mt-0.5 text-[10px] font-medium text-white/80">{item.desc}</p>
            </div>
          </AppLink>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1} className="border-emerald-500/15">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[var(--av-text-primary)]">आपके खेत के लिए</h3>
            <Badge variant="info">{recommendations.length} टिप्स</Badge>
          </div>
          <ul className="mt-3 space-y-2">
            {recommendations.map((r) => (
              <li
                key={`${r.crop}-${r.tip}`}
                className="flex items-center justify-between rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-2"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-semibold text-[var(--av-text-primary)]">{r.crop}</p>
                  <p className="text-[10px] text-[var(--av-text-muted)]">{r.tip}</p>
                </div>
                <AppLink
                  href={r.href}
                  className="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-bold text-[var(--av-accent)]"
                >
                  देखो
                  <ChevronRight className="h-3.5 w-3.5" />
                </AppLink>
              </li>
            ))}
          </ul>
        </DarkCard>

        <AppLink
          href="/ask-query"
          className="relative flex min-h-[160px] overflow-hidden rounded-2xl border border-emerald-500/25 shadow-[var(--av-shadow-sm)] active:scale-[0.99]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/home/home-job-ask.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
          <div className="relative z-10 flex flex-1 flex-col justify-end p-4">
            <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
              <MessageCircle className="h-4 w-4" />
            </span>
            <p className="text-[16px] font-extrabold text-white">विशेषज्ञ से पूछो</p>
            <p className="mt-1 text-[12px] font-medium text-white/85">
              कीट, रोग या खाद — सवाल भेजो
            </p>
          </div>
        </AppLink>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1} className="border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 to-transparent">
          <h3 className="text-sm font-bold text-[var(--av-text-primary)]">खेत स्वास्थ्य</h3>
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
                  ? "बढ़िया — खेत ठीक चल रहे हैं।"
                  : "नीचे अलर्ट देखो और इस हफ्ते करो।"}
              </p>
            </>
          ) : (
            <p className="mt-4 text-center text-xs text-[var(--av-text-muted)]">
              अभी कोई खेत नहीं —{" "}
              <AppLink href="/my-farm" className="font-bold text-[var(--av-accent)]">
                मेरा खेत
              </AppLink>{" "}
              में जोड़ो।
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
                कोई अलर्ट नहीं — सब ठीक ✓
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
                      <p className="mt-1 text-[10px] font-bold text-[var(--av-accent)]">
                        {a.actionLabel} →
                      </p>
                    )}
                  </AppLink>
                </li>
              ))
            )}
          </ul>
          <AppLink href="/alerts" className={`mt-3 inline-flex ${AV.btnSecondarySm}`}>
            सभी अलर्ट देखो
          </AppLink>
        </DarkCard>
      </div>

      <h3 className="mt-6 text-sm font-bold text-[var(--av-text-primary)]">तेज़ टूल</h3>
      <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FIELD_TOOLS.map((tool) => (
          <AppLink
            key={tool.title}
            href={tool.href}
            className="relative h-28 w-36 shrink-0 overflow-hidden rounded-2xl border border-[var(--av-border)] shadow-[var(--av-shadow-sm)] active:scale-[0.98]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={tool.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="relative z-10 flex h-full flex-col justify-end p-2.5">
              <p className="text-[13px] font-extrabold text-white">{tool.title}</p>
              <p className="text-[10px] font-medium text-white/80">{tool.desc}</p>
            </div>
          </AppLink>
        ))}
      </div>

      <ShellCtaBanner
        title="निजी सलाह चाहिए?"
        description="विशेषज्ञ से बात करो — समस्या का हल पाओ।"
        buttonLabel="अभी पूछो"
        href="/ask-query"
      />
    </AppShell>
  );
}
