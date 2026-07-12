"use client";

import Image from "next/image";
import AppLink from "@/components/ui/AppLink";
import DarkCard from "@/components/shell/DarkCard";
import SectionHeader from "@/components/shell/SectionHeader";
import { AV } from "@/lib/design/tokens";
import { useDashboardAlerts } from "@/hooks/useDashboardAlerts";
import { ChevronRight } from "lucide-react";

const PEST_THUMBS: Record<string, string> = {
  borer: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop",
  thrips: "https://images.unsplash.com/photo-1592840067980-057d97d26f4a?w=80&h=80&fit=crop",
  whitefly: "https://images.unsplash.com/photo-1592840067980-057d97d26f4a?w=80&h=80&fit=crop",
  default: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop",
};

function thumbFor(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("borer") || t.includes("stem")) return PEST_THUMBS.borer;
  if (t.includes("thrip")) return PEST_THUMBS.thrips;
  if (t.includes("whitefly") || t.includes("fly")) return PEST_THUMBS.whitefly;
  return PEST_THUMBS.default;
}

export default function DashboardPestAlerts() {
  const alerts = useDashboardAlerts(6).filter(
    (a) =>
      /pest|borer|thrip|whitefly|aphid|insect|hopper|mite/i.test(`${a.title} ${a.body}`)
  );

  const rows =
    alerts.length > 0
      ? alerts.slice(0, 3)
      : [
          { id: "p1", title: "Stem Borer", body: "High risk in paddy — scout tillering stage", severity: "critical" as const },
          { id: "p2", title: "Thrips", body: "Monitor chilli and tomato upper leaves", severity: "warning" as const },
          { id: "p3", title: "Whitefly", body: "Low pressure — conserve natural enemies", severity: "info" as const },
        ];

  return (
    <DarkCard hover className="min-w-0">
      <div className="flex items-center justify-between gap-2">
        <SectionHeader title="Pest Alert" />
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
          {rows.length} Active
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {rows.map((row) => {
          const risk =
            row.severity === "critical"
              ? "High Risk"
              : row.severity === "warning"
                ? "Medium Risk"
                : "Low Risk";
          const riskClass =
            risk === "High Risk"
              ? "text-red-600"
              : risk === "Medium Risk"
                ? "text-amber-600"
                : "text-[var(--av-accent)]";

          return (
            <li key={row.id}>
              <AppLink
                href={row.actionHref ?? "/pest-diseases"}
                className="av-card-inset flex items-center gap-3 p-2 transition hover:border-[var(--av-accent)]/30"
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                  <Image src={thumbFor(row.title)} alt="" fill className="object-cover" sizes="40px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[var(--av-text-primary)]">{row.title}</p>
                  <p className={`text-[10px] font-semibold ${riskClass}`}>{risk}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--av-text-muted)]" />
              </AppLink>
            </li>
          );
        })}
      </ul>
      <AppLink href="/pest-diseases" className={`mt-3 inline-flex ${AV.link}`}>
        View all pests →
      </AppLink>
    </DarkCard>
  );
}
