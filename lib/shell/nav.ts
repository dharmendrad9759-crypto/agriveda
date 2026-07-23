import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Sprout,
  Calendar,
  Brain,
  CloudSun,
  Stethoscope,
  Bug,
  Leaf,
  FlaskConical,
  TrendingUp,
  Users,
  Tractor,
  Settings,
  Wheat,
  BookOpen,
  Bell,
} from "lucide-react";
import type { FarmerUiKey } from "@/lib/i18n/farmer-ui";

export interface ShellNavItem {
  labelKey: FarmerUiKey;
  href: string;
  icon: LucideIcon;
  match?: (path: string) => boolean;
}

/** Single consolidated nav — no duplicate pests/diseases/mandi clutter */
export const SHELL_NAV: ShellNavItem[] = [
  {
    labelKey: "shellDashboard",
    href: "/",
    icon: LayoutDashboard,
    match: (p) => p === "/" || p === "/dashboard",
  },
  { labelKey: "shellMyFarm", href: "/my-farm", icon: Tractor },
  {
    labelKey: "shellCrops",
    href: "/crops",
    icon: Sprout,
    match: (p) =>
      p.startsWith("/crops") &&
      !p.includes("/pests") &&
      !p.includes("/diseases") &&
      !p.includes("/nutrients") &&
      !p.includes("/fertilizer"),
  },
  { labelKey: "shellCropCalendar", href: "/crop-calendar", icon: Calendar },
  { labelKey: "shellFieldAdvisor", href: "/field-advisor", icon: Brain },
  {
    labelKey: "shellWeather",
    href: "/weather",
    icon: CloudSun,
    match: (p) => p.startsWith("/weather"),
  },
  { labelKey: "shellAiDoctor", href: "/ai-doctor", icon: Stethoscope },
  {
    labelKey: "shellPests",
    href: "/pest-diseases",
    icon: Bug,
    match: (p) =>
      p.includes("/pests") ||
      p.includes("/diseases") ||
      p.startsWith("/pest-diseases") ||
      p === "/pest-solver",
  },
  {
    labelKey: "shellWeeds",
    href: "/pest-diseases?type=weed",
    icon: Wheat,
    match: (p) => p.includes("type=weed"),
  },
  { labelKey: "shellNutrients", href: "/deficiencies", icon: Leaf },
  {
    labelKey: "shellFertilizer",
    href: "/services/fertilizer-calculator",
    icon: FlaskConical,
  },
  {
    labelKey: "shellMandi",
    href: "/mandi",
    icon: TrendingUp,
    match: (p) => p.startsWith("/mandi") || p.startsWith("/market-trends"),
  },
  { labelKey: "shellAlerts", href: "/alerts", icon: Bell },
  { labelKey: "shellLibrary", href: "/library", icon: BookOpen },
  { labelKey: "shellCommunity", href: "/community", icon: Users },
  {
    labelKey: "shellSettings",
    href: "/settings",
    icon: Settings,
    match: (p) => p.startsWith("/settings") || p === "/profile",
  },
];

export function isNavActive(item: ShellNavItem, pathname: string): boolean {
  if (item.match) return item.match(pathname);
  return pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
}
