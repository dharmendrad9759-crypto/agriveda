import type { MandiRow } from "@/lib/mandi/types";
import { CROP_CATEGORY, CROP_HI } from "@/lib/mandi/constants";
import type { MandiRow as MockRow } from "@/data/mock/mandi";

interface DataGovRecord {
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;
  variety?: string;
  min_price?: string | number;
  max_price?: string | number;
  modal_price?: string | number;
  arrival_date?: string;
}

function parsePrice(v: string | number | undefined): number {
  if (v == null || v === "") return 0;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? Math.round(n) : 0;
}

function titleCase(s: string): string {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function normalizeCropName(raw: string): string {
  const c = titleCase(raw);
  if (/paddy|rice/i.test(raw)) return "Paddy";
  if (/soyabean|soybean/i.test(raw)) return "Soybean";
  if (/wheat|gehun/i.test(raw)) return "Wheat";
  if (/maize|corn/i.test(raw)) return "Maize";
  if (/gram|chana/i.test(raw)) return "Gram";
  if (/mustard|sarso/i.test(raw)) return "Mustard";
  if (/cotton|kapas/i.test(raw)) return "Cotton";
  if (/tomato/i.test(raw)) return "Tomato";
  return c;
}

function sparklineFromModal(modal: number): number[] {
  const base = modal * 0.97;
  return Array.from({ length: 7 }, (_, i) => Math.round(base + ((modal - base) * i) / 6));
}

export function mapDataGovRecords(records: DataGovRecord[]): MandiRow[] {
  const rows: MandiRow[] = [];
  records.forEach((r, i) => {
    const crop = normalizeCropName(r.commodity ?? "Unknown");
    const modal = parsePrice(r.modal_price);
    const min = parsePrice(r.min_price) || modal;
    const max = parsePrice(r.max_price) || modal;
    if (!modal && !min && !max) return;

    const modalVal = modal || Math.round((min + max) / 2);
    rows.push({
      id: `live-${i}-${r.market}-${crop}`,
      crop,
      cropHi: CROP_HI[crop] ?? crop,
      variety: r.variety?.trim() || "—",
      mandi: r.market?.trim() || "—",
      state: r.state?.trim() || "—",
      min: min || modalVal,
      max: max || modalVal,
      modal: modalVal,
      change: 0,
      changeAmt: 0,
      trend: sparklineFromModal(modalVal),
      category: CROP_CATEGORY[crop] ?? "Others",
      arrivalDate: r.arrival_date,
    });
  });
  return rows;
}

export function enrichMockWithChange(rows: MockRow[]): MandiRow[] {
  return rows.map((r) => ({ ...r }));
}
