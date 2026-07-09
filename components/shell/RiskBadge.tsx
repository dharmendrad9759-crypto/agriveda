const BADGE_CLASS = {
  high: "av-badge av-badge-high",
  medium: "av-badge av-badge-medium",
  low: "av-badge av-badge-low",
} as const;

export type RiskLevel = keyof typeof BADGE_CLASS;

export default function RiskBadge({ level, label }: { level: RiskLevel; label?: string }) {
  const text = label ?? (level === "high" ? "High Risk" : level === "medium" ? "Medium Risk" : "Low Risk");
  return <span className={BADGE_CLASS[level]}>{text}</span>;
}
