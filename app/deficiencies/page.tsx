"use client";

import { Leaf, BookOpen } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DeficienciesPageClient from "@/components/deficiency/DeficienciesPageClient";

export default function DeficienciesPage() {
  return (
    <AppShell
      className="!bg-transparent"
      title={
        <span className="inline-flex items-center gap-2">
          <Leaf className="h-6 w-6 text-[var(--av-accent)]" />
          Nutrients
        </span>
      }
      subtitle="Identify nutrient deficiencies and get correct solutions"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Nutrients" }]}
      actions={
        <AppLink
          href="/library"
          className="hidden items-center gap-2 rounded-xl border border-[var(--av-accent)] px-4 py-2 text-xs font-bold text-[var(--av-accent)] sm:inline-flex"
        >
          <BookOpen className="h-4 w-4" />
          Nutrient Guide
        </AppLink>
      }
    >
      <DeficienciesPageClient />
    </AppShell>
  );
}
