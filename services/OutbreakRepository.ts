import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import type { OutbreakReport, SubmitOutbreakInput } from "@/types/outbreak";
import { OUTBREAK_SEED_REPORTS } from "@/data/outbreak-seed";

const STORE_PATH = join(process.cwd(), "data", "outbreak-reports.json");

function readStoreFile(): OutbreakReport[] {
  try {
    if (!existsSync(STORE_PATH)) return [];
    const raw = readFileSync(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as OutbreakReport[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoreFile(reports: OutbreakReport[]): void {
  try {
    const dir = join(process.cwd(), "data");
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(STORE_PATH, JSON.stringify(reports, null, 2), "utf-8");
  } catch {
    /* read-only filesystem (e.g. serverless) — in-memory still works */
  }
}

let memoryReports: OutbreakReport[] | null = null;

function allReports(): OutbreakReport[] {
  if (memoryReports === null) {
    const stored = readStoreFile();
    const seedIds = new Set(OUTBREAK_SEED_REPORTS.map((r) => r.id));
    const userReports = stored.filter((r) => !seedIds.has(r.id));
    memoryReports = [...OUTBREAK_SEED_REPORTS, ...userReports];
  }
  return memoryReports;
}

function persist(): void {
  if (!memoryReports) return;
  const seedIds = new Set(OUTBREAK_SEED_REPORTS.map((r) => r.id));
  writeStoreFile(memoryReports.filter((r) => !seedIds.has(r.id)));
}

export function listOutbreakReports(): OutbreakReport[] {
  return allReports();
}

export function addOutbreakReport(input: SubmitOutbreakInput): OutbreakReport {
  const report: OutbreakReport = {
    id: crypto.randomUUID(),
    farmerId: input.farmerId,
    cropId: input.cropId,
    threatType: input.threatType,
    pestOrDiseaseId: input.pestOrDiseaseId,
    photoUrl: input.photoUrl,
    latitude: input.latitude,
    longitude: input.longitude,
    severity: input.severity,
    reportDate: new Date().toISOString(),
    verified: false,
  };

  const reports = allReports();
  reports.push(report);
  memoryReports = reports;
  persist();
  return report;
}

export function getOutbreakReportById(id: string): OutbreakReport | undefined {
  return allReports().find((r) => r.id === id);
}
