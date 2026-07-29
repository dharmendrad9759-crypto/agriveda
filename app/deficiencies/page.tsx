"use client";

import { FlaskConical, BookOpen } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DeficienciesPageClient from "@/components/deficiency/DeficienciesPageClient";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function DeficienciesPage() {
  const { t } = useLocale();

  return (
    <AppShell
      className="!bg-transparent"
      title={
        <span className="inline-flex items-center gap-2">
          <FlaskConical className="h-6 w-6 text-amber-500" />
          {t("nutrientsTitle")}
        </span>
      }
      subtitle={t("nutrientsSubtitle")}
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: t("nutrientsTitle") }]}
      actions={
        <AppLink
          href="/library"
          className="hidden items-center gap-2 rounded-xl border border-amber-500/40 px-4 py-2 text-xs font-bold text-amber-700 dark:text-amber-300 sm:inline-flex"
        >
          <BookOpen className="h-4 w-4" />
          {t("nutrientsGuide")}
        </AppLink>
      }
    >
      <DeficienciesPageClient />
    </AppShell>
  );
}
