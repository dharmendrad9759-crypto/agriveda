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

export interface ShellNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  match?: (path: string) => boolean;
}

/** Single consolidated nav — no duplicate pests/diseases/mandi clutter */
export const SHELL_NAV: ShellNavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, match: (p) => p === "/" || p === "/dashboard" },
  { label: "My Farm", href: "/my-farm", icon: Tractor },
  { label: "Crops", href: "/crops", icon: Sprout, match: (p) => p.startsWith("/crops") && !p.includes("/pests") && !p.includes("/diseases") && !p.includes("/nutrients") && !p.includes("/fertilizer") },
  { label: "Crop Calendar", href: "/crop-calendar", icon: Calendar },
  { label: "Field Advisor", href: "/field-advisor", icon: Brain },
  { label: "Weather", href: "/weather", icon: CloudSun, match: (p) => p.startsWith("/weather") },
  { label: "AI Doctor", href: "/ai-doctor", icon: Stethoscope },
  {
    label: "Pests & Diseases",
    href: "/pest-diseases",
    icon: Bug,
    match: (p) => p.includes("/pests") || p.includes("/diseases") || p.startsWith("/pest-diseases") || p === "/pest-solver",
  },
  { label: "Weeds", href: "/pest-diseases?type=weed", icon: Wheat, match: (p) => p.includes("type=weed") },
  { label: "Nutrients", href: "/deficiencies", icon: Leaf },
  { label: "Fertilizer", href: "/services/fertilizer-calculator", icon: FlaskConical },
  { label: "Mandi", href: "/mandi", icon: TrendingUp, match: (p) => p.startsWith("/mandi") || p.startsWith("/market-trends") },
  { label: "Alerts", href: "/alerts", icon: Bell },
  { label: "Library", href: "/library", icon: BookOpen },
  { label: "Community", href: "/community", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings, match: (p) => p.startsWith("/settings") || p === "/profile" },
];

export function isNavActive(item: ShellNavItem, pathname: string): boolean {
  if (item.match) return item.match(pathname);
  return pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
}
