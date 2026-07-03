import type { OutbreakReport, OutbreakSeverity, OutbreakThreatType } from "@/types/outbreak";
import { getSupabase, createSupabaseServerClient } from "@/lib/supabase";
import type { Database } from "@/types/database";

type OutbreakRow = Database["public"]["Tables"]["outbreak_reports"]["Row"];

export function encodePestOrDisease(
  threatType: OutbreakThreatType,
  pestOrDiseaseId: string
): string {
  return `${threatType}:${pestOrDiseaseId}`;
}

export function decodePestOrDisease(value: string): {
  threatType: OutbreakThreatType;
  pestOrDiseaseId: string;
} {
  const [type, id] = value.split(":");
  if ((type === "pest" || type === "disease") && id) {
    return { threatType: type, pestOrDiseaseId: id };
  }
  return { threatType: "pest", pestOrDiseaseId: value };
}

export function outbreakRowToReport(row: OutbreakRow): OutbreakReport {
  const { threatType, pestOrDiseaseId } = decodePestOrDisease(row.pest_or_disease);
  return {
    id: row.id,
    farmerId: row.farmer_id ?? "",
    cropId: row.crop_id,
    threatType,
    pestOrDiseaseId,
    photoUrl: row.photo_url ?? undefined,
    latitude: row.latitude,
    longitude: row.longitude,
    severity: row.severity as OutbreakSeverity,
    reportDate: row.report_date,
    verified: row.verified ?? false,
  };
}

export async function fetchOutbreakReportsSince(
  days = 14,
  client = getSupabase() ?? createSupabaseServerClient()
): Promise<OutbreakReport[]> {
  if (!client) return [];

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const { data, error } = await client
    .from("outbreak_reports")
    .select("*")
    .gte("report_date", cutoff.toISOString())
    .order("report_date", { ascending: false });

  if (error) {
    console.error("[fetchOutbreakReportsSince]", error.message);
    return [];
  }

  return (data ?? []).map((row) => outbreakRowToReport(row as OutbreakRow));
}

export interface InsertOutbreakParams {
  farmerId: string | null;
  cropId: string;
  threatType: OutbreakThreatType;
  pestOrDiseaseId: string;
  photoUrl?: string;
  latitude: number;
  longitude: number;
  severity: OutbreakSeverity;
}

export async function insertOutbreakReportToSupabase(
  params: InsertOutbreakParams,
  client = getSupabase() ?? createSupabaseServerClient()
): Promise<OutbreakReport | null> {
  if (!client) return null;

  const payload: Database["public"]["Tables"]["outbreak_reports"]["Insert"] = {
    farmer_id: params.farmerId,
    crop_id: params.cropId,
    pest_or_disease: encodePestOrDisease(params.threatType, params.pestOrDiseaseId),
    photo_url: params.photoUrl ?? null,
    latitude: params.latitude,
    longitude: params.longitude,
    severity: params.severity,
    verified: false,
  };

  const { data, error } = await client
    .from("outbreak_reports")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    console.error("[insertOutbreakReportToSupabase]", error.message);
    return null;
  }

  return outbreakRowToReport(data as OutbreakRow);
}
