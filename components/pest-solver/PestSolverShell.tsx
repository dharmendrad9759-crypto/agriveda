"use client";

import AppShell from "@/components/shell/AppShell";
import PestDiseaseSolver from "@/components/pest-solver/PestDiseaseSolver";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function PestSolverShell() {
  const { t } = useLocale();

  return (
    <AppShell
      className="!bg-transparent"
      title="कीट और रोग समाधान"
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: t("toolPestSolver") }]}
    >
      <PestDiseaseSolver embedded />
    </AppShell>
  );
}
