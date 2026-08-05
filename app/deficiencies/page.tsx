"use client";

import AppShell from "@/components/shell/AppShell";
import DeficienciesPageClient from "@/components/deficiency/DeficienciesPageClient";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function DeficienciesPage() {
  const { t, locale } = useLocale();
  const isHi = locale === "hi";

  return (
    <AppShell
      className="!bg-transparent"
      title={isHi ? "पत्ती समस्या" : "Leaf problem"}
      subtitle={isHi ? "देखो → लगाओ → पूछो" : "See → fix → ask"}
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: isHi ? "पोषक तत्व" : "Nutrients" }]}
    >
      <DeficienciesPageClient />
    </AppShell>
  );
}
