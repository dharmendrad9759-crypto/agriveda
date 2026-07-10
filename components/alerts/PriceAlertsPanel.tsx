"use client";

import { useState } from "react";
import DarkCard from "@/components/shell/DarkCard";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { useToast } from "@/components/ui/Toast";
import type { MandiRow } from "@/lib/mandi/types";
import { AV } from "@/lib/design/tokens";

interface Props {
  rows?: MandiRow[];
  compact?: boolean;
  className?: string;
}

export default function PriceAlertsPanel({ rows = [], compact = false, className = "" }: Props) {
  const { showToast } = useToast();
  const { settings, addAlert, toggleAlert, removeAlert } = usePriceAlerts();
  const [newCrop, setNewCrop] = useState("");
  const [newTarget, setNewTarget] = useState("");

  const handleAddAlert = () => {
    const target = parseInt(newTarget, 10);
    if (!newCrop.trim() || !Number.isFinite(target) || target <= 0) {
      showToast("Crop name aur valid target price bharein", "error");
      return;
    }
    addAlert({ crop: newCrop.trim(), target });
    setNewCrop("");
    setNewTarget("");
    showToast("Price alert created ✓");
  };

  return (
    <DarkCard className={className} hover={!compact}>
      <h3 className="text-sm font-bold text-[var(--av-text-primary)]">Price Alert Setup</h3>
      {!settings.masterEnabled && (
        <p className={`mt-1 ${AV.micro}`}>Master toggle OFF — enable in Settings to get notifications.</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          value={newCrop}
          onChange={(e) => setNewCrop(e.target.value)}
          placeholder="Crop (Paddy)"
          className="av-input min-w-[120px] flex-1 text-xs"
        />
        <input
          value={newTarget}
          onChange={(e) => setNewTarget(e.target.value)}
          placeholder="₹ Target"
          inputMode="numeric"
          className="av-input w-24 text-xs"
        />
        <button type="button" onClick={handleAddAlert} className={AV.btnPrimarySm}>
          Add
        </button>
      </div>
      <ul className="mt-3 space-y-2">
        {settings.alerts.length === 0 ? (
          <li className={`rounded-lg border border-[var(--av-border)] bg-[var(--av-surface-inset)] px-3 py-3 text-center ${AV.micro}`}>
            No price alerts yet
          </li>
        ) : (
          settings.alerts.map((a) => {
            const match = rows.find((r) => r.crop.toLowerCase() === a.crop.toLowerCase());
            const hit =
              match &&
              settings.masterEnabled &&
              a.enabled &&
              (a.direction === "above" ? match.modal >= a.target : match.modal <= a.target);
            return (
              <li key={a.id} className="flex items-center justify-between gap-2 text-xs">
                <button type="button" onClick={() => toggleAlert(a.id)} className="flex-1 text-left">
                  <span className="text-[var(--av-text-secondary)]">
                    {a.crop} {a.direction === "above" ? "≥" : "≤"} ₹{a.target.toLocaleString("en-IN")}
                    {match && (
                      <span className="text-[var(--av-text-muted)]"> · now ₹{match.modal.toLocaleString("en-IN")}</span>
                    )}
                  </span>
                  {hit && (
                    <span className="ml-1 text-[10px] font-bold text-emerald-400">Target hit!</span>
                  )}
                </button>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    a.enabled ? "bg-emerald-500/20 text-emerald-400" : "bg-[#1f2937] text-[var(--av-text-muted)]"
                  }`}
                >
                  {a.enabled ? "ON" : "OFF"}
                </span>
                <button type="button" onClick={() => removeAlert(a.id)} className="text-[10px] text-red-400">
                  ×
                </button>
              </li>
            );
          })
        )}
      </ul>
    </DarkCard>
  );
}
