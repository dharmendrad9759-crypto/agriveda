import { FARM_FIELDS } from "@/data/mock/farm";
import { DASHBOARD_ACTIVITIES } from "@/data/mock/dashboard";
import { EMPTY_FARM_DATA } from "@/lib/farm/farmInit";
import type { FarmData } from "@/lib/farm/types";

const MOCK_FIELD_IDS = new Set(FARM_FIELDS.map((f) => f.id));
const MOCK_FIELD_NAMES = new Set(FARM_FIELDS.map((f) => f.name));
const MOCK_ACTIVITY_IDS = new Set(DASHBOARD_ACTIVITIES.map((a) => a.id));

function isLegacyMockFields(fields: FarmData["fields"]): boolean {
  if (fields.length === 0) return false;
  if (fields.length <= 4 && fields.every((f) => MOCK_FIELD_IDS.has(f.id))) return true;
  return fields.some((f) => MOCK_FIELD_NAMES.has(f.name));
}

/** Strip seeded demo farm/activity data; return clean farm state. */
export function sanitizeLegacyFarmData(stored: Partial<FarmData>): FarmData {
  const fields = stored.fields ?? [];

  if (isLegacyMockFields(fields)) {
    return EMPTY_FARM_DATA;
  }

  const cleanFields = fields.map((f, idx) => ({
    ...f,
    id: f.id || `f-${Date.now()}-${idx}`,
    name: f.name || `खेत ${idx + 1}`,
    area: typeof f.area === "string" ? f.area : "1.0 Acre",
    ownership: f.ownership || "Owned",
    crop: f.crop || "गेहूँ (Wheat)",
    cropSlug: f.cropSlug || "wheat",
    status: f.status || "Active",
    sowingDate: f.sowingDate || "",
    sowingDateIso: f.sowingDateIso,
    emoji: f.emoji || "🌾",
    stage: f.stage || "सक्रिय",
    variety: f.variety || "",
    health: typeof f.health === "number" ? f.health : undefined,
  }));

  return {
    fields: cleanFields,
    seasons: stored.seasons ?? [],
    observations: stored.observations ?? [],
    satelliteObservations: stored.satelliteObservations ?? [],
    tasks: stored.tasks ?? [],
    alerts: stored.alerts ?? [],
    activities: (stored.activities ?? []).filter((a) => !MOCK_ACTIVITY_IDS.has(a.id)),
    notes: stored.notes ?? [],
  };
}
