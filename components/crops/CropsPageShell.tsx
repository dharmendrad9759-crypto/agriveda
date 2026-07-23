"use client";

import { Calendar, Leaf } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function CropsPageShell({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();

  return (
    <AppShell
      className="!bg-transparent"
      title={
        <span className="inline-flex items-center gap-2">
          <Leaf className="h-6 w-6 text-[var(--av-accent)]" />
          {t("cropsTitle")}
        </span>
      }
      subtitle={t("cropsSubtitle")}
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: t("cropsTitle") }]}
      actions={
        <AppLink
          href="/crop-calendar"
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--av-accent)] bg-[var(--av-surface)] px-4 py-2 text-xs font-bold text-[var(--av-accent)] shadow-sm transition hover:bg-[var(--av-accent-soft)]"
        >
          <Calendar className="h-4 w-4" />
          {t("cropsViewCalendar")}
        </AppLink>
      }
    >
      {children}
    </AppShell>
  );
}
