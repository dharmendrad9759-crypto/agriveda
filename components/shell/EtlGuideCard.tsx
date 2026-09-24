"use client";

import { AlertTriangle } from "lucide-react";
import { farmerSpeak } from "@/lib/crops/farmerSpeak";

interface Props {
  etl?: string;
  pestName?: string;
  monitoring?: string;
  compact?: boolean;
}

/**
 * Farmer-simple ETL card — Hindi first, English in brackets.
 */
export default function EtlGuideCard({ etl, pestName, monitoring, compact }: Props) {
  const body = farmerSpeak(
    etl?.trim() ||
      "सप्ताह में दो बार खेत घूमो। छिड़काव (Spray) तभी करो जब कीट नुकसान सीमा (ETL) पार करें — सिर्फ़ तारीख देखकर नहीं।"
  );
  const monitor = monitoring ? farmerSpeak(monitoring) : "";

  return (
    <div className={compact ? "p-3" : "p-4"}>
      <div className="flex items-start gap-2">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-800">
          <AlertTriangle className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[13px] font-bold text-[var(--av-text-primary)]">
            {pestName
              ? `नुकसान सीमा (ETL) — ${pestName}`
              : "नुकसान सीमा (ETL)"}
          </h3>
          <p className="mt-1 text-[12px] font-medium leading-snug text-[var(--av-text-secondary)]">
            {body}
          </p>
          {monitor ? (
            <p className="mt-1.5 text-[11px] text-[var(--av-text-muted)]">
              <span className="font-semibold text-[var(--av-text-primary)]">खेत देखना: </span>
              {monitor}
            </p>
          ) : null}
          <ul className="mt-2 space-y-1 text-[11px] leading-snug text-[var(--av-text-muted)]">
            <li>• नुकसान सीमा (ETL) से पहले छिड़काव (Spray) न करें — मित्र कीट बचते हैं</li>
            <li>• खेत में गिनती करो — याद रखो / नोट करो</li>
            <li>• दोबारा दवा लगे तो अलग किस्म की दवा लो (Rotation)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
