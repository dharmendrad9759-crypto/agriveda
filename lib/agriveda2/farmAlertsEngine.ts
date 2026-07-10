import { evaluateSowingWindow } from "@/lib/agriveda2/sowingWindowEngine";
import { getCropManagementProfile } from "@/data/crop-management";
import { daysAfterSowing } from "@/lib/cropGrowthStage";
import { getCropDashboard } from "@/data/crop-dashboard";

export type FarmAlertSeverity = "info" | "warning" | "critical";

export interface FarmAlert {
  id: string;
  severity: FarmAlertSeverity;
  title: string;
  body: string;
  cropSlug?: string;
  fieldName?: string;
  actionLabel?: string;
  actionHref?: string;
  daysAhead?: number;
}

export function buildPredictiveAlerts(input: {
  cropSlug: string;
  fieldName?: string;
  sowingDate?: string;
  das?: number;
  rainChance3d?: number;
  tempC?: number;
}): FarmAlert[] {
  const alerts: FarmAlert[] = [];
  const profile = getCropManagementProfile(input.cropSlug);
  const das =
    input.das ??
    (input.sowingDate ? daysAfterSowing(input.sowingDate) : null);

  if (input.cropSlug === "paddy" && das != null && das >= 35 && das <= 55) {
    if ((input.rainChance3d ?? 0) >= 40 || (input.tempC ?? 28) >= 26) {
      alerts.push({
        id: `bph-${input.cropSlug}`,
        severity: "warning",
        title: "Brown Planthopper risk — 3–5 days ahead",
        body: `Your ${profile?.name ?? "paddy"} is ~${das} DAS (tillering). Humid/warm spell favours BPH. Spray Buprofezin toward plant base before outbreak.`,
        cropSlug: input.cropSlug,
        fieldName: input.fieldName,
        actionLabel: "Spray schedule",
        actionHref: "/weather/spray-advisory",
        daysAhead: 4,
      });
    }
  }

  if (input.cropSlug === "tomato" && das != null && das >= 45) {
    alerts.push({
      id: `blight-${input.cropSlug}`,
      severity: "info",
      title: "Early blight watch — fruiting stage",
      body: "Leaf wetness + warm nights increase Alternaria risk. Scout lower leaves; keep FRAC rotation ready.",
      cropSlug: input.cropSlug,
      fieldName: input.fieldName,
      actionLabel: "Symptom solver",
      actionHref: "/pest-solver",
      daysAhead: 3,
    });
  }

  if (input.cropSlug === "maize" && das != null && das >= 20 && das <= 45) {
    alerts.push({
      id: `faw-${input.cropSlug}`,
      severity: "critical",
      title: "Fall Armyworm alert — vegetative stage",
      body: "Regional reports show FAW pressure. Evening scout in whorl; Chlorantraniliprole or Spinosad if larvae seen.",
      cropSlug: input.cropSlug,
      fieldName: input.fieldName,
      actionLabel: "AI scan",
      actionHref: "/ai-doctor",
      daysAhead: 2,
    });
  }

  const sowing = evaluateSowingWindow(input.cropSlug, {
    rainChance3d: input.rainChance3d,
    tempC: input.tempC,
  });
  if (sowing.status === "green" && !input.sowingDate) {
    alerts.push({
      id: `sow-${input.cropSlug}`,
      severity: "info",
      title: "Green sowing window open",
      body: sowing.messageEn,
      cropSlug: input.cropSlug,
      actionLabel: "Sowing guide",
      actionHref: `/sowing-window?crop=${input.cropSlug}`,
    });
  }

  return alerts;
}

export function buildFieldAlerts(
  field: { name: string; cropSlug: string; areaAcres?: string },
  sowingDate?: string,
  weather?: { rainChance3d?: number; tempC?: number }
): FarmAlert[] {
  const alerts = buildPredictiveAlerts({
    cropSlug: field.cropSlug,
    fieldName: field.name,
    sowingDate,
    rainChance3d: weather?.rainChance3d,
    tempC: weather?.tempC,
  });

  const dashboard = getCropDashboard(field.cropSlug);
  const das = sowingDate ? daysAfterSowing(sowingDate) : null;

  if (das != null && dashboard.irrigationManagement?.tips?.length) {
    const tip = dashboard.irrigationManagement.tips[0];
    if (das % 4 === 0) {
      alerts.push({
        id: `irr-${field.cropSlug}-${field.name}`,
        severity: "info",
        title: "Irrigation due soon",
        body: `Based on stage (Day ${das}): ${tip}`,
        fieldName: field.name,
        cropSlug: field.cropSlug,
        actionHref: `/crops/${field.cropSlug}?tab=irrigation`,
        actionLabel: "Water guide",
      });
    }
  }

  return alerts.map((a) => ({ ...a, fieldName: a.fieldName ?? field.name }));
}
