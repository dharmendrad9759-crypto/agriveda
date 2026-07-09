"use client";

import AppLink from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";

const TABS = [
  { id: "overview", label: "Overview", suffix: "" },
  { id: "pests", label: "Pests", suffix: "/pests" },
  { id: "diseases", label: "Diseases", suffix: "/diseases" },
  { id: "nutrients", label: "Nutrient Deficiency", suffix: "/nutrients" },
  { id: "fertilizer", label: "Fertilizer Plan", suffix: "/fertilizer-schedule" },
] as const;

export default function CropSubNav({ slug, cropName }: { slug: string; cropName: string }) {
  const pathname = usePathname();
  const base = `/crops/${slug}`;

  return (
    <div className="mb-4 flex gap-1 overflow-x-auto border-b border-[var(--av-border)] pb-px scrollbar-hide">
      {TABS.map((tab) => {
        const href = tab.suffix ? `${base}${tab.suffix}` : base;
        const active = tab.suffix
          ? pathname.startsWith(`${base}${tab.suffix}`)
          : pathname === base;
        return (
          <AppLink
            key={tab.id}
            href={href}
            className={`relative shrink-0 px-3 py-2.5 text-xs font-semibold transition-colors duration-150 ${
              active
                ? "text-[var(--av-accent)]"
                : "text-[var(--av-text-muted)] hover:text-[var(--av-text-primary)]"
            }`}
          >
            {tab.label}
            {active && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[var(--av-accent)]" />
            )}
          </AppLink>
        );
      })}
      <span className="shrink-0 self-center px-2 text-[10px] text-[var(--av-text-muted)]">{cropName}</span>
    </div>
  );
}
