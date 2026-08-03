"use client";

import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import AppLink from "@/components/ui/AppLink";
import { AV } from "@/lib/design/tokens";
import { Clock } from "lucide-react";

export default function UpgradePage() {
  return (
    <AppShell
      className="!bg-transparent"
      title="प्रीमियम"
      subtitle="जल्द आ रहा है"
      breadcrumbs={[{ label: "सेटिंग", href: "/settings" }, { label: "प्रीमियम" }]}
    >
      <DarkCard className="mx-auto max-w-md text-center">
        <Clock className="mx-auto h-10 w-10 text-[var(--av-accent)]" aria-hidden />
        <h2 className="mt-4 text-lg font-bold text-[var(--av-text-primary)]">
          प्रीमियम जल्द आ रहा है
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--av-text-secondary)]">
          अभी बिलिंग और भुगतान सक्रिय नहीं है। जब प्रीमियम लॉन्च होगा, तब आपको सूचना मिलेगी।
        </p>
        <AppLink href="/settings" className={`mt-6 inline-flex ${AV.btnPrimarySm}`}>
          सेटिंग पर वापस जाएँ
        </AppLink>
      </DarkCard>
    </AppShell>
  );
}
