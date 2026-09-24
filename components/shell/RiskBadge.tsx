import { riskLabelHi } from "@/lib/i18n/farmer-display";

const BADGE_CLASS = {
  high: "av-badge av-badge-high",
  medium: "av-badge av-badge-medium",
  low: "av-badge av-badge-low",
} as const;

export type RiskLevel = keyof typeof BADGE_CLASS;

export default function RiskBadge({
  level,
  label,
  hi = true,
}: {
  level: RiskLevel;
  label?: string;
  /** Prefer farmer Hindi + (English) — default true for field UI */
  hi?: boolean;
}) {
  const text =
    label ??
    (hi
      ? riskLabelHi(level)
      : level === "high"
        ? "High risk"
        : level === "medium"
          ? "Medium risk"
          : "Low risk");
  return <span className={BADGE_CLASS[level]}>{text}</span>;
}
