"use client";

import AppLink from "@/components/ui/AppLink";
import AppShell from "@/components/shell/AppShell";
import DarkCard from "@/components/shell/DarkCard";
import { AV } from "@/lib/design/tokens";
import { BookOpen, Bug, Leaf, Search, Sprout } from "lucide-react";

const LIBRARY_LINKS = [
  { href: "/crops", label: "फसल गाइड", desc: "बुवाई से कटाई तक — हर फसल का पूरा विवरण", icon: Sprout },
  { href: "/pest-diseases", label: "कीट और रोग", desc: "पहचान, लक्षण और उपचार", icon: Bug },
  { href: "/deficiencies", label: "पोषक तत्व", desc: "कमी की पहचान और खाद सलाह", icon: Leaf },
  { href: "/search", label: "खोजें", desc: "फसल, कीट, रोग — सब कुछ एक जगह", icon: Search },
];

export default function LibraryPage() {
  return (
    <AppShell
      className="!bg-transparent"
      title="Agri Library"
      subtitle="कृषि ज्ञान — फसल, कीट, रोग और पोषण"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Library" }]}
    >
      <DarkCard>
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-[var(--av-accent)]" />
          <p className={`${AV.body}`}>
            ICAR और कृषि विभाग के package of practices पर आधारित जानकारी — अपनी ज़रूरत का सेक्शन चुनें।
          </p>
        </div>
      </DarkCard>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
