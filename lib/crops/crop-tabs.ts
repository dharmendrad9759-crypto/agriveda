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
  Store,
  Tractor,
  Trees,
  Wheat,
} from "lucide-react";

export const CROP_TABS = [
  { id: "overview", label: "Overview", shortLabel: "Overview", icon: Leaf, emoji: "📋" },
  { id: "growth", label: "Growth Stages", shortLabel: "Growth", icon: Sprout, emoji: "🌱" },
  { id: "field-prep", label: "Field Prep", shortLabel: "Field", icon: Tractor, emoji: "🚜" },
  { id: "fertilizer", label: "Fertilizer Plan", shortLabel: "Fertilizer", icon: FlaskConical, emoji: "💊" },
  { id: "pests", label: "Pests", shortLabel: "Pests", icon: Bug, emoji: "🐛" },
  { id: "diseases", label: "Diseases", shortLabel: "Disease", icon: Shield, emoji: "🦠" },
  { id: "nutrients", label: "Nutrients", shortLabel: "Nutrient", icon: Wheat, emoji: "🧪" },
  { id: "irrigation", label: "Irrigation", shortLabel: "Water", icon: Droplets, emoji: "💧" },
  { id: "weeds", label: "Weed Mgmt", shortLabel: "Weed", icon: Trees, emoji: "🌿" },
  { id: "calendar", label: "Calendar", shortLabel: "Calendar", icon: CalendarDays, emoji: "📅" },
  { id: "varieties", label: "Varieties", shortLabel: "Varieties", icon: Leaf, emoji: "🌾" },
  { id: "harvest", label: "Harvest", shortLabel: "Harvest", icon: Apple, emoji: "🌾" },
  { id: "market", label: "Market", shortLabel: "Market", icon: Store, emoji: "💰" },
  { id: "faq", label: "FAQ", shortLabel: "FAQ", icon: HelpCircle, emoji: "❓" },
  { id: "expert", label: "Expert Tips", shortLabel: "Tips", icon: Lightbulb, emoji: "💡" },
] as const;

export type CropTabId = (typeof CROP_TABS)[number]["id"];

export const CROP_TAB_IDS: CropTabId[] = CROP_TABS.map((t) => t.id);

export function isCropTabId(value: string | null | undefined): value is CropTabId {
  return CROP_TABS.some((t) => t.id === value);
}

/** Opens a dedicated care page (not in-page slide) */
export function cropTabHref(slug: string, tab: CropTabId) {
  if (tab === "overview") return `/crops/${slug}`;
  return `/crops/${slug}/care/${tab}`;
}

export type CropTabItem = (typeof CROP_TABS)[number] & { icon: LucideIcon };
