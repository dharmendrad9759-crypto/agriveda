"use client";

import AppLink from "@/components/ui/AppLink";
import {
  Sprout,
  Calendar,
  Leaf,
  Bell,
  CloudSun,
  Brain,
  Stethoscope,
  Bug,
  FlaskConical,
  IndianRupee,
  LineChart,
  MessageCircle,
  Heart,
  type LucideIcon,
} from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import StatCard from "@/components/shell/StatCard";
import PageHero from "@/components/shell/PageHero";
import SectionHeader from "@/components/shell/SectionHeader";
import { DonutChart } from "@/components/shell/charts";
import { ShellCtaBanner } from "@/components/shell/AppShell";
import DashboardWeatherCard from "@/components/dashboard/DashboardWeatherCard";
import DashboardMandiWidget from "@/components/dashboard/DashboardMandiWidget";
import { AV } from "@/lib/design/tokens";
import {
  EXPERT_TIP,
  CROP_HEALTH_SEGMENTS,
  COMMUNITY_POST,
} from "@/data/mock/dashboard";
import { useDashboardAlerts } from "@/hooks/useDashboardAlerts";
import { useFarmerProfile } from "@/hooks/useFarmerProfile";
import { useFarmData } from "@/hooks/useFarmData";
import { useMyCrops } from "@/hooks/useMyCrops";

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
  const { data: farm, stats: farmStats } = useFarmData();
  const { crops: myCrops } = useMyCrops();
  const dashboardAlerts = useDashboardAlerts(4);
  const name = profile.name.trim() || "Kisan";

  const activeCropCount = myCrops.length > 0 ? myCrops.length : farmStats.cropsGrowing;
  const healthLabel = farmStats.healthScore >= 80 ? "Good" : farmStats.healthScore >= 65 ? "Average" : "Watch";

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
        <StatCard icon={Sprout} label="Active Crops" value={`${activeCropCount} in field`} action={{ label: "View Details", href: "/my-farm" }} delay={0} />
        <StatCard icon={Calendar} label="Upcoming Tasks" value={`${farm.activities.length} next 7 days`} action={{ label: "View Calendar", href: "/crop-calendar" }} delay={1} />
        <StatCard icon={Leaf} label="Field Health" value={`${farmStats.healthScore}% ${healthLabel}`} action={{ label: "View Report", href: "/my-farm" }} delay={2} />
        <StatCard icon={Bell} label="Alerts" value={`${dashboardAlerts.length} active`} action={{ label: "View All", href: "/alerts" }} delay={3} />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <DashboardWeatherCard />

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
            {farm.fields.slice(0, 4).map((f) => (
              <li key={f.id} className="av-card-inset flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[var(--av-text-primary)]">{f.name}</p>
                  <p className={AV.micro}>
                    {f.crop} · {f.stage}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold ${f.health >= 75 ? "text-[var(--av-accent)]" : "text-amber-600"}`}
                  >
                    {f.health >= 75 ? "Good" : "Average"}
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
            {dashboardAlerts.length === 0 ? (
              <li className="av-card-inset text-center">
                <p className={AV.micro}>No active alerts — all good ✓</p>
              </li>
            ) : (
              dashboardAlerts.map((a) => (
                <li key={a.id} className="av-card-inset">
                  <AppLink href={a.actionHref ?? "/alerts"} className="block">
                    <p className="text-xs font-semibold text-[var(--av-text-primary)]">{a.title}</p>
                    <p className={`mt-0.5 line-clamp-2 ${AV.micro}`}>{a.body}</p>
                    {a.actionLabel && (
                      <p className="mt-1 text-[10px] font-bold text-[var(--av-accent)]">{a.actionLabel} →</p>
                    )}
                  </AppLink>
                </li>
              ))
            )}
          </ul>
        </DarkCard>

        <DarkCard hover delay={3}>
          <SectionHeader title="Tasks Due" action={{ label: "Calendar", href: "/crop-calendar" }} />
          <ul className="mt-3 space-y-2">
            {farm.activities.slice(0, 4).map((a) => (
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
        <DashboardMandiWidget />

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
            <DonutChart
              segments={CROP_HEALTH_SEGMENTS}
              centerValue={`${farmStats.healthScore}%`}
              centerLabel={healthLabel}
            />
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
