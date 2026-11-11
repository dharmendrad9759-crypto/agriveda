import { readStorage, writeStorage } from "@/lib/storage";
import { CROP_HI } from "@/lib/mandi/constants";
import type { MandiRow } from "@/lib/mandi/types";
import { notifyMandiPriceAlert, scheduleLocalAlert } from "@/lib/push/farmerPush";
import { isCapacitorNative } from "@/lib/capacitorNav";

const SNAP_KEY = "agriveda-mandi-notify-snap";
const DAILY_ID = 9101;

type Snap = {
  day: string;
  place: string;
  prices: Record<string, number>;
  digestSent: boolean;
  moveSent: boolean;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function inr(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function cropLine(row: MandiRow) {
  const name = row.cropHi || CROP_HI[row.crop] || row.crop;
  const variety = (row.variety || "").trim();
  return variety ? `${name} ${variety} ${inr(row.modal)}` : `${name} ${inr(row.modal)}`;
}

function pickDigestRows(rows: MandiRow[], district: string, myCrops: string[]): MandiRow[] {
  const home = district
    ? rows.filter((r) => (r.district || "").toLowerCase() === district.toLowerCase())
    : rows;
  const source = home.length ? home : rows;
  const wanted = myCrops.map((c) => c.toLowerCase());
  const picked: MandiRow[] = [];
  const seen = new Set<string>();

  const take = (row: MandiRow) => {
    const key = `${row.crop}|${row.variety}`;
    if (seen.has(key)) return;
    seen.add(key);
    picked.push(row);
  };

  for (const name of wanted) {
    const hits = source.filter(
      (r) => r.crop.toLowerCase().includes(name) || r.cropHi.toLowerCase().includes(name)
    );
    const unique = new Set<string>();
    for (const hit of [...hits].sort((a, b) => b.modal - a.modal)) {
      const v = hit.variety || hit.crop;
      if (unique.has(v)) continue;
      unique.add(v);
      take(hit);
      if (picked.length >= 3) break;
    }
    if (picked.length >= 3) break;
  }
  if (picked.length < 3) {
    for (const row of [...source].sort((a, b) => b.modal - a.modal)) {
      take(row);
      if (picked.length >= 3) break;
    }
  }
  return picked.slice(0, 3);
}

function nextMorning(hour: number, minute: number) {
  const at = new Date();
  at.setHours(hour, minute, 0, 0);
  if (at.getTime() <= Date.now()) at.setDate(at.getDate() + 1);
  return at;
}

export async function runMandiRateNotifications(input: {
  state: string;
  district: string;
  rows: MandiRow[];
  myCrops: string[];
  enabled: boolean;
}): Promise<void> {
  if (!input.enabled || !input.rows.length) return;

  const place = input.district || input.state || "आपकी मंडी";
  const digestRows = pickDigestRows(input.rows, input.district, input.myCrops);
  if (!digestRows.length) return;

  const prices: Record<string, number> = {};
  for (const row of digestRows) {
    prices[`${row.crop}|${row.variety}`] = row.modal;
  }

  const prev = readStorage<Snap | null>(SNAP_KEY, null);
  const day = todayKey();
  const snap: Snap = {
    day,
    place,
    prices,
    digestSent: prev?.day === day ? prev.digestSent : false,
    moveSent: prev?.day === day ? prev.moveSent : false,
  };

  const body = digestRows.map(cropLine).join(" · ");
  const title = `${place} मंडी के भाव आ गए`;

  if (!snap.digestSent) {
    await notifyMandiPriceAlert(title, body);
    snap.digestSent = true;
  } else if (prev && !snap.moveSent) {
    for (const row of digestRows) {
      const key = `${row.crop}|${row.variety}`;
      const old = prev.prices[key];
      if (typeof old !== "number") continue;
      const delta = row.modal - old;
      if (Math.abs(delta) < 40) continue;
      const name = row.cropHi || row.crop;
      const variety = (row.variety || "").trim();
      const who = variety ? `${name} ${variety}` : name;
      await notifyMandiPriceAlert(
        delta > 0 ? `${who} का भाव चढ़ा` : `${who} का भाव गिरा`,
        `${place} मंडी में आज ${inr(row.modal)} — कल से ${delta > 0 ? "₹" : "-₹"}${Math.abs(delta).toLocaleString("en-IN")} ${delta > 0 ? "ज़्यादा" : "कम"}`
      );
      snap.moveSent = true;
      break;
    }
  }

  writeStorage(SNAP_KEY, snap);

  if (isCapacitorNative()) {
    await scheduleLocalAlert({
      id: DAILY_ID,
      title,
      body,
      at: nextMorning(8, 15),
      force: true,
      href: "/mandi",
    });
  }
}
