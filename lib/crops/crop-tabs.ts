import type { LucideIcon } from "lucide-react";
import {
  Apple,
  Bug,
  CalendarDays,
  Droplets,
  FlaskConical,
  HelpCircle,
  Leaf,
  Lightbulb,
  Shield,
  Sprout,
  Wheat,
  Trees,
} from "lucide-react";

export const CROP_TABS = [
  { id: "overview", label: "Overview", shortLabel: "Overview", icon: Leaf, emoji: "📋" },
  { id: "growth", label: "Growth Stages", shortLabel: "Growth", icon: Sprout, emoji: "🌱" },
  { id: "fertilizer", label: "Fertilizer Plan", shortLabel: "Fertilizer", icon: FlaskConical, emoji: "💊" },
  { id: "pests", label: "Pests", shortLabel: "Pests", icon: Bug, emoji: "🐛" },
  { id: "diseases", label: "Diseases", shortLabel: "Disease", icon: Shield, emoji: "🦠" },
  { id: "nutrients", label: "Nutrients", shortLabel: "Nutrient", icon: Wheat, emoji: "🧪" },
  { id: "irrigation", label: "Irrigation", shortLabel: "Water", icon: Droplets, emoji: "💧" },
  { id: "weeds", label: "Weed Mgmt", shortLabel: "Weed", icon: Trees, emoji: "🌿" },
  { id: "calendar", label: "Calendar", shortLabel: "Calendar", icon: CalendarDays, emoji: "📅" },
  { id: "varieties", label: "Varieties", shortLabel: "Varieties", icon: Leaf, emoji: "🌾" },
  { id: "harvest", label: "Harvest", shortLabel: "Harvest", icon: Apple, emoji: "🌾" },
  { id: "faq", label: "FAQ", shortLabel: "FAQ", icon: HelpCircle, emoji: "❓" },
  { id: "expert", label: "Expert Tips", shortLabel: "Tips", icon: Lightbulb, emoji: "💡" },
] as const;

export type CropTabId = (typeof CROP_TABS)[number]["id"];

export const CROP_TAB_IDS: CropTabId[] = CROP_TABS.map((t) => t.id);

export function isCropTabId(value: string | null | undefined): value is CropTabId {
  return CROP_TABS.some((t) => t.id === value);
}

export function cropTabHref(slug: string, tab: CropTabId) {
  return tab === "overview" ? `/crops/${slug}` : `/crops/${slug}?tab=${tab}`;
}

export type CropTabItem = (typeof CROP_TABS)[number] & { icon: LucideIcon };
