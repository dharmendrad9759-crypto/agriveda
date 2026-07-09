import { Target } from "lucide-react";
import DarkCard from "@/components/shell/DarkCard";
import { AV } from "@/lib/design/tokens";

interface EtlGuideCardProps {
  etl?: string;
  pestName?: string;
  monitoring?: string;
  compact?: boolean;
}

export default function EtlGuideCard({ etl, pestName, monitoring, compact }: EtlGuideCardProps) {
  const threshold =
    etl ??
    "Scout twice weekly. Spray only when pest count crosses Economic Threshold Level (ETL) — not on calendar alone.";

  return (
    <DarkCard className={compact ? "p-3" : ""} delay={0}>
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15">
          <Target className="h-4 w-4 text-amber-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={AV.sectionTitle}>
            {pestName ? `ETL — ${pestName}` : "Economic Threshold Level (ETL)"}
          </h3>
          <p className={`mt-1 ${compact ? AV.micro : AV.body}`}>{threshold}</p>
          {monitoring && (
            <p className={`mt-2 ${AV.micro}`}>
              <span className="font-semibold text-[var(--av-text-primary)]">Monitor:</span> {monitoring}
            </p>
          )}
          <ul className={`mt-2 space-y-1 ${AV.micro}`}>
            <li>• ETL se pehle spray avoid karein — natural enemies bachte hain</li>
            <li>• Count per hill / meter row / trap — field record rakhein</li>
            <li>• IRAC group rotate karein jab repeat spray zaroori ho</li>
          </ul>
        </div>
      </div>
    </DarkCard>
  );
}
