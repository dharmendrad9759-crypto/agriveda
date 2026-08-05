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
  MessageSquareWarning,
} from "lucide-react";
import type { FarmerUiKey } from "@/lib/i18n/farmer-ui";

export interface ShellNavItem {
  /** Fallback English label (SSR / non-locale contexts) */
  label: string;
  labelKey: FarmerUiKey;
  href: string;
  icon: LucideIcon;
  match?: (path: string) => boolean;
}

/** Daily farm jobs — short list for drawer/sidebar */
export const SHELL_NAV_PRIMARY: ShellNavItem[] = [
  {
    label: "Home",
    labelKey: "navHome",
    href: "/",
    icon: LayoutDashboard,
    match: (p) => p === "/" || p === "/dashboard",
  },
  { label: "My Farm", labelKey: "myFarm", href: "/my-farm", icon: Tractor },
  {
    label: "Crops",
    labelKey: "navCrops",
    href: "/crops",
    icon: Sprout,
    match: (p) =>
      p.startsWith("/crops") &&
      !p.includes("/pests") &&
      !p.includes("/diseases") &&
      !p.includes("/nutrients") &&
      !p.includes("/fertilizer"),
  },
  { label: "Plan", labelKey: "shellCropCalendar", href: "/crop-calendar", icon: Calendar },
  { label: "Advice", labelKey: "shellFieldAdvisor", href: "/field-advisor", icon: Brain },
  {
    label: "Weather",
    labelKey: "navWeather",
    href: "/weather",
    icon: CloudSun,
    match: (p) => p.startsWith("/weather"),
  },
  { label: "Photo", labelKey: "toolAi", href: "/ai-doctor", icon: Stethoscope },
  {
    label: "Pests",
    labelKey: "pestsDiseases",
    href: "/pest-diseases",
    icon: Bug,
    match: (p) =>
      (p.includes("/pests") ||
        p.includes("/diseases") ||
        p.startsWith("/pest-diseases") ||
        p === "/pest-solver") &&
      !p.includes("type=weed"),
  },
  {
    label: "Weeds",
    labelKey: "weeds",
    href: "/pest-diseases?type=weed",
    icon: Wheat,
    match: (p) => p.includes("type=weed"),
  },
  { label: "Nutrients", labelKey: "shellNutrients", href: "/deficiencies", icon: Leaf },
  {
    label: "Fertilizer",
    labelKey: "fertilizer",
    href: "/services/fertilizer-calculator",
    icon: FlaskConical,
  },
  {
    label: "Mandi",
    labelKey: "market",
    href: "/mandi",
    icon: TrendingUp,
    match: (p) => p.startsWith("/mandi") || p.startsWith("/market-trends"),
  },
  { label: "Alerts", labelKey: "toolAlerts", href: "/alerts", icon: Bell },
  {
    label: "Settings",
    labelKey: "settingsTitle",
    href: "/settings",
    icon: Settings,
    match: (p) => p.startsWith("/settings") || p === "/profile",
  },
];

/** Extra / rare links — keep out of the farmer’s daily eye-path */
export const SHELL_NAV_MORE: ShellNavItem[] = [
  { label: "Library", labelKey: "shellLibrary", href: "/library", icon: BookOpen },
  { label: "Community", labelKey: "navCommunity", href: "/community", icon: Users },
  { label: "Report Bug", labelKey: "shellReportBug", href: "/report-bug", icon: MessageSquareWarning },
];

/** Flat list for any consumer that still expects one array */
export const SHELL_NAV: ShellNavItem[] = [...SHELL_NAV_PRIMARY, ...SHELL_NAV_MORE];

export function isNavActive(item: ShellNavItem, pathname: string): boolean {
  if (item.match) return item.match(pathname);
  return pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
}
