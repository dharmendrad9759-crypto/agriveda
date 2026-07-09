"use client";

import AppLink from "@/components/ui/AppLink";
import {
  Sprout,
  Calendar,
  Leaf,
  Bell,
  CloudSun,
  Droplets,
  Wind,
  Sun,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Heart,
  Brain,
  Stethoscope,
  Bug,
  FlaskConical,
  IndianRupee,
  LineChart,
  type LucideIcon,
} from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import PageHero from "@/components/shell/PageHero";
import SectionHeader from "@/components/shell/SectionHeader";
import { DonutChart } from "@/components/shell/charts";
import { ShellCtaBanner } from "@/components/shell/AppShell";
import { AV } from "@/lib/design/tokens";
import {
  DASHBOARD_METRICS,
  DASHBOARD_ALERTS,
  DASHBOARD_ACTIVITIES,
  DASHBOARD_FIELDS,
  DASHBOARD_MANDI,
  EXPERT_TIP,
  CROP_HEALTH_SEGMENTS,
  COMMUNITY_POST,
} from "@/data/mock/dashboard";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";

const QUICK_ACTIONS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Crop Calendar", href: "/crop-calendar", icon: Calendar },
  { label: "Field Advisor", href: "/field-advisor", icon: Brain },
  { label: "AI Doctor", href: "/ai-doctor", icon: Stethoscope },
  { label: "Pest Check", href: "/pest-diseases", icon: Bug },
  { label: "Disease Check", href: "/pest-diseases", icon: Bug },
  { label: "Weather", href: "/weather", icon: CloudSun },
  { label: "Fertilizer", href: "/services/fertilizer-calculator", icon: FlaskConical },
  { label: "Mandi Prices", href: "/mandi", icon: IndianRupee },
  { label: "Market Trends", href: "/market-trends", icon: LineChart },
];

export default function DesktopDashboard({ embedded = false }: { embedded?: boolean }) {
  const { profile } = useFarmerProfile();
  const name = profile.name.trim() || "Kisan";

  return (
    <div className={AV.sectionGap}>
      {!embedded && (
        <PageHero
          title={`Namaste, ${name}`}
          subtitle="Aaj ka farm overview — weather, alerts, mandi aur tasks ek jagah."
          badge="Farm Dashboard"
          icon={Sprout}
          action={{ label: "Field Advisor", href: "/field-advisor" }}
        />
      )}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard icon={Sprout} label="Active Crops" value={DASHBOARD_METRICS[0].value} action={DASHBOARD_METRICS[0].action} delay={0} />
        <StatCard icon={Calendar} label="Upcoming Tasks" value={DASHBOARD_METRICS[1].value} action={DASHBOARD_METRICS[1].action} delay={1} />
        <StatCard icon={Leaf} label="Field Health" value={DASHBOARD_METRICS[2].value} action={DASHBOARD_METRICS[2].action} delay={2} />
        <StatCard icon={Bell} label="Alerts" value={DASHBOARD_METRICS[3].value} action={DASHBOARD_METRICS[3].action} delay={3} />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <DarkCard hover className="xl:col-span-8" delay={1}>
          <SectionHeader title="Weather Today" action={{ label: "Full Forecast", href: "/weather" }} />
          <div className="mt-4 flex flex-wrap items-center gap-6">
            <div>
              <p className="text-4xl font-bold text-[var(--av-text-primary)]">32°C</p>
              <p className={`text-sm ${AV.body}`}>Partly Cloudy · Feels like 36°C</p>
              <p className={`mt-0.5 ${AV.micro}`}>Sehore, MP</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
              <span className={`flex items-center gap-1 ${AV.body}`}>
                <Droplets className="h-3.5 w-3.5 text-[var(--av-accent)]" /> 62%
              </span>
              <span className={`flex items-center gap-1 ${AV.body}`}>
                <Wind className="h-3.5 w-3.5 text-[var(--av-accent)]" /> 14 km/h
              </span>
              <span className={`flex items-center gap-1 ${AV.body}`}>
                <CloudSun className="h-3.5 w-3.5 text-[var(--av-accent)]" /> 20% rain
              </span>
              <span className={`flex items-center gap-1 ${AV.body}`}>
                <Sun className="h-3.5 w-3.5 text-amber-500" /> UV 7
              </span>
            </div>
          </div>
        </DarkCard>

        <DarkCard hover className="xl:col-span-4" delay={2}>
          <SectionHeader title="Quick Actions" />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {QUICK_ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <AppLink
                  key={a.href + a.label}
                  href={a.href}
                  className="av-card-inset flex flex-col items-center gap-1.5 p-2 text-center transition hover:border-[var(--av-accent)]/40"
                >
                  <Icon className="h-4 w-4 text-[var(--av-accent)]" />
                  <span className="text-[9px] font-semibold leading-tight text-[var(--av-text-secondary)]">{a.label}</span>
                </AppLink>
              );
            })}
          </div>
          <AppLink href="/crop-calendar" className={`mt-3 inline-flex ${AV.btnPrimarySm}`}>
            + Add Activity
          </AppLink>
        </DarkCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <DarkCard hover delay={1}>
          <SectionHeader title="My Fields" action={{ label: "View All", href: "/my-farm" }} />
          <ul className="mt-3 space-y-2">
            {DASHBOARD_FIELDS.map((f) => (
              <li key={f.name} className="av-card-inset flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[var(--av-text-primary)]">{f.name}</p>
                  <p className={AV.micro}>
                    {f.crop} · {f.stage}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold ${f.status === "Good" ? "text-[var(--av-accent)]" : "text-amber-600"}`}
                  >
                    {f.status}
                  </span>
                  <p className="text-xs font-bold text-[var(--av-accent)]">{f.health}%</p>
                </div>
              </li>
            ))}
          </ul>
        </DarkCard>

        <DarkCard hover delay={2}>
          <SectionHeader title="Important Alerts" action={{ label: "View All", href: "/alerts" }} />
          <ul className="mt-3 space-y-2">
            {DASHBOARD_ALERTS.map((a) => (
              <li key={a.id} className="av-card-inset">
                <p className="text-xs font-semibold text-[var(--av-text-primary)]">{a.title}</p>
                <p className={`mt-0.5 ${AV.micro}`}>{a.desc}</p>
                <p className={`mt-1 ${AV.micro}`}>{a.time}</p>
              </li>
            ))}
          </ul>
        </DarkCard>

        <DarkCard hover delay={3}>
          <SectionHeader title="Tasks Due" action={{ label: "Calendar", href: "/crop-calendar" }} />
          <ul className="mt-3 space-y-2">
            {DASHBOARD_ACTIVITIES.map((a) => (
              <li key={a.id} className="av-card-inset">
                <p className="text-xs font-semibold text-[var(--av-text-primary)]">{a.task}</p>
                <p className={AV.micro}>{a.field}</p>
                <p className="mt-1 text-[10px] font-medium text-[var(--av-accent)]">{a.date}</p>
              </li>
            ))}
          </ul>
        </DarkCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-12">
        <DarkCard hover delay={1} className="xl:col-span-8">
          <SectionHeader title="Mandi Prices (Today)" action={{ label: "View All", href: "/mandi" }} />
          <div className="mt-3 overflow-x-auto">
            <table className="av-table">
              <thead>
                <tr>
                  <th>Commodity</th>
                  <th>Market</th>
                  <th>Modal</th>
                  <th className="text-right">Change</th>
                </tr>
              </thead>
              <tbody>
                {DASHBOARD_MANDI.map((m) => (
                  <tr key={m.crop}>
                    <td className="font-semibold text-[var(--av-text-primary)]">{m.crop}</td>
                    <td>{m.market}</td>
                    <td className="font-mono">₹{m.modal}</td>
                    <td className={`text-right font-semibold ${m.change >= 0 ? "text-[var(--av-accent)]" : "text-red-500"}`}>
                      {m.change >= 0 ? <TrendingUp className="inline h-3 w-3" /> : <TrendingDown className="inline h-3 w-3" />}
                      {m.change > 0 ? "+" : ""}
                      {m.change}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DarkCard>

        <DarkCard hover delay={2} className="xl:col-span-4">
          <SectionHeader title="Expert Tip" />
          <div className="mt-3">
            <p className="text-xs font-semibold text-[var(--av-accent)]">{EXPERT_TIP.name}</p>
            <p className={AV.micro}>{EXPERT_TIP.role}</p>
            <p className={`mt-2 leading-relaxed ${AV.body}`}>{EXPERT_TIP.tip}</p>
          </div>
        </DarkCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <DarkCard hover delay={1}>
          <SectionHeader title="Crop Health" action={{ label: "Report", href: "/my-farm" }} />
          <div className="mt-4 flex justify-center">
            <DonutChart segments={CROP_HEALTH_SEGMENTS} centerValue="82%" centerLabel="Good" />
          </div>
          <p className="mt-3 rounded-lg bg-[var(--av-accent-soft)] px-3 py-2 text-center text-xs text-[var(--av-accent)]">
            Fields healthy — keep monitoring pest alerts this week.
          </p>
        </DarkCard>

        <DarkCard hover delay={2}>
          <SectionHeader title="Community" action={{ label: "View All", href: "/community" }} />
          <div className="mt-3">
            <p className="text-xs font-semibold text-[var(--av-text-primary)]">{COMMUNITY_POST.author}</p>
            <p className={`mt-1 ${AV.body}`}>{COMMUNITY_POST.text}</p>
            <div className={`mt-2 flex gap-3 ${AV.micro}`}>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" /> {COMMUNITY_POST.comments}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" /> {COMMUNITY_POST.likes}
              </span>
            </div>
          </div>
        </DarkCard>
      </div>

      <ShellCtaBanner
        title="Smarter decisions, better yield"
        description="Premium tools — satellite insights, expert calls, and advanced crop analytics."
        buttonLabel="Upgrade to Premium"
        href="/settings/upgrade"
      />
    </div>
  );
}
