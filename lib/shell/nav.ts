import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Sprout,
  Calendar,
  Brain,
  CloudSun,
  Stethoscope,
  Bug,
  ShieldAlert,
  Leaf,
  FlaskConical,
  TrendingUp,
  BarChart3,
  Users,
  Tractor,
  Settings,
  Wheat,
} from "lucide-react";

export interface ShellNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  match?: (path: string) => boolean;
}

export const SHELL_NAV: ShellNavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, match: (p) => p === "/" || p === "/dashboard" },
  { label: "Crops", href: "/crops", icon: Sprout, match: (p) => p.startsWith("/crops") && !p.includes("/pests") && !p.includes("/diseases") && !p.includes("/nutrients") && !p.includes("/fertilizer") },
  { label: "Crop Calendar", href: "/crop-calendar", icon: Calendar },
  { label: "Field Advisor", href: "/field-advisor", icon: Brain },
  { label: "Weather", href: "/weather", icon: CloudSun },
  { label: "AI Doctor", href: "/ai-doctor", icon: Stethoscope },
  { label: "Pests", href: "/pest-diseases", icon: Bug, match: (p) => p.includes("/pests") || p.startsWith("/pest-diseases") || p === "/pest-solver" },
  { label: "Diseases", href: "/pest-diseases", icon: ShieldAlert, match: (p) => p.includes("/diseases") },
  { label: "Weeds", href: "/pest-diseases?type=weed", icon: Wheat, match: (p) => p.includes("type=weed") },
  { label: "Nutrient Deficiency", href: "/deficiencies", icon: Leaf },
  { label: "Fertilizer Schedule", href: "/services/fertilizer-calculator", icon: FlaskConical },
  { label: "Mandi Prices", href: "/mandi", icon: TrendingUp },
  { label: "Market Trends", href: "/market-trends", icon: BarChart3 },
  { label: "Community", href: "/community", icon: Users },
  { label: "My Farm", href: "/my-farm", icon: Tractor },
  { label: "Settings", href: "/settings", icon: Settings, match: (p) => p.startsWith("/settings") || p === "/profile" },
];

export function isNavActive(item: ShellNavItem, pathname: string): boolean {
  if (item.match) return item.match(pathname);
  return pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
}
