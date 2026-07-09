import type { LucideIcon } from "lucide-react";
import {
  Bug,
  Droplets,
  FlaskConical,
  Leaf,
  Shield,
  Sprout,
  Wheat,
} from "lucide-react";

export const CROP_TABS = [
  { id: "overview", label: "Overview", icon: Leaf },
  { id: "growth", label: "Growth Stages", icon: Sprout },
  { id: "fertilizer", label: "Fertilizer Plan", icon: FlaskConical },
  { id: "pests", label: "Pests", icon: Bug },
  { id: "diseases", label: "Diseases", icon: Shield },
  { id: "nutrients", label: "Nutrients", icon: Wheat },
  { id: "irrigation", label: "Irrigation", icon: Droplets },
] as const;

export type CropTabId = (typeof CROP_TABS)[number]["id"];

export function isCropTabId(value: string | null | undefined): value is CropTabId {
  return CROP_TABS.some((t) => t.id === value);
}

export function cropTabHref(slug: string, tab: CropTabId) {
  return tab === "overview" ? `/crops/${slug}` : `/crops/${slug}?tab=${tab}`;
}

export type CropTabItem = (typeof CROP_TABS)[number] & { icon: LucideIcon };
