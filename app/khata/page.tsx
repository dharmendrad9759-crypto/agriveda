"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/shell/AppShell";
import { useFarmData } from "@/hooks/useFarmData";
import { useActiveField } from "@/hooks/useActiveField";
import { readStorage, writeStorage } from "@/lib/storage";

type KhataRow = { id: string; item: string; rupees: number; at: string };

const KEY = "agriveda-khata-v1";

export default function KhataPage() {
  const farm = useFarmData();
  const { activeField } = useActiveField(farm.data.fields, farm.hydrated);
  const fieldId = activeField?.id || "none";
  const [rows, setRows] = useState<KhataRow[]>([]);
  const [item, setItem] = useState("");
  useEffect(() => {
    const named = new URLSearchParams(window.location.search).get("item");
    if (named) setItem(named);
  }, []);
  const [rupees, setRupees] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = readStorage<Record<string, KhataRow[]>>(KEY, {});
    setRows(saved[fieldId] ?? []);
    setReady(true);
  }, [fieldId]);

  useEffect(() => {
    if (!ready) return;
    const saved = readStorage<Record<string, KhataRow[]>>(KEY, {});
    writeStorage(KEY, { ...saved, [fieldId]: rows });
  }, [rows, fieldId, ready]);

  const total = useMemo(() => rows.reduce((sum, row) => sum + row.rupees, 0), [rows]);

  const add = () => {
    const name = item.trim();
    const money = Math.round(Number(rupees));
    if (!name || !Number.isFinite(money) || money <= 0) return;
    setRows((prev) => [{ id: `k-${Date.now()}`, item: name, rupees: money, at: new Date().toISOString() }, ...prev]);
    setItem("");
    setRupees("");
  };

  return (
    <AppShell title="खर्च खाता" backHref="/profile">
      <div className="space-y-3">
        <p className="text-[15px] font-bold text-[#143028]">
          {activeField ? activeField.name || activeField.crop : "खेत चुनें"}
        </p>
        <p className="text-[28px] font-black text-emerald-900">₹{total.toLocaleString("en-IN")}</p>
        <input
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder="चीज़, जैसे यूरिया"
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base"
        />
        <input
          value={rupees}
          onChange={(e) => setRupees(e.target.value)}
          inputMode="numeric"
          placeholder="रुपये"
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base"
        />
        <button type="button" onClick={add} className="w-full rounded-xl bg-emerald-700 py-3 text-[15px] font-black text-white">
          खर्च जोड़ें
        </button>
        <ul className="space-y-2">
          {rows.map((row) => (
            <li key={row.id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-[14px] font-bold">
              <span>{row.item}</span>
              <span>₹{row.rupees}</span>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
