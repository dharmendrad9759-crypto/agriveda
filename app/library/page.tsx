"use client";

import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { Bug, Leaf, Search, Sprout } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";

const LIBRARY_LINKS = [
  { href: "/crops", label: "फसल गाइड", desc: "बुवाई से कटाई तक — हर फसल का पूरा विवरण", icon: Sprout },
  { href: "/pest-diseases", label: "कीट और रोग", desc: "पहचान, लक्षण और उपचार", icon: Bug },
  { href: "/deficiencies", label: "पोषक तत्व", desc: "कमी की पहचान और खाद सलाह", icon: Leaf },
  { href: "/search", label: "खोजें", desc: "फसल, कीट, रोग — सब कुछ एक जगह", icon: Search },
];

export default function LibraryPage() {
  const { t } = useLocale();

  return (
    <AppShell
      className="!bg-transparent"
      title={t("shellLibrary")}
      subtitle="कृषि ज्ञान — फसल, कीट, रोग और पोषण"
      breadcrumbs={[{ label: t("navHome"), href: "/" }, { label: t("shellLibrary") }]}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {LIBRARY_LINKS.map(({ href, label, desc, icon: Icon }) => (
          <AppLink key={href} href={href}>
            <DarkCard hover className="h-full">
              <Icon className="h-6 w-6 text-[var(--av-accent)]" />
              <p className="mt-2 text-sm font-bold text-[var(--av-text-primary)]">{label}</p>
              <p className="mt-1 text-xs text-[var(--av-text-muted)]">{desc}</p>
            </DarkCard>
          </AppLink>
        ))}
      </div>
    </AppShell>
  );
}
