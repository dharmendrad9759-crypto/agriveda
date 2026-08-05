"use client";

import AppShell from "@/components/shell/AppShell";
import SprayAdvisoryDetail from "@/components/weather/SprayAdvisoryDetail";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function SprayAdvisoryShell() {
  const { t } = useLocale();

  return (
    <AppShell
      className="!bg-transparent"
      title="स्प्रे"
      subtitle="आज करो या मत?"
      breadcrumbs={[
        { label: t("navHome"), href: "/" },
        { label: t("navWeather"), href: "/weather" },
        { label: "स्प्रे" },
      ]}
    >
      <SprayAdvisoryDetail embedded />
    </AppShell>
  );
}
