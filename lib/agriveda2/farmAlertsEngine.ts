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
        title: "भूरा फुदका (BPH) का खतरा — अगले 3–5 दिन",
        body: `आपकी धान फसल ~${das} दिन (कल्ले फूटना) की है। उमस और गर्मी से BPH का प्रकोप बढ़ सकता है। पौधे के आधार पर बुप्रोफेजिन का छिड़काव करें।`,
        cropSlug: input.cropSlug,
        fieldName: input.fieldName,
        actionLabel: "स्प्रे सलाह",
        actionHref: "/weather/spray-advisory",
        daysAhead: 4,
      });
    }
  }

  if (input.cropSlug === "tomato" && das != null && das >= 45) {
    alerts.push({
      id: `blight-${input.cropSlug}`,
      severity: "info",
      title: "अगेती झुलसा चेतावनी — फल बनने की अवस्था",
      body: "पत्तियों पर नमी व गर्म रात से अल्टरनेरिया झुलसा का खतरा है। निचली पत्तियों की जांच करें व कवकनाशी तैयार रखें।",
      cropSlug: input.cropSlug,
      fieldName: input.fieldName,
      actionLabel: "कीट-रोग जांच",
      actionHref: "/pest-solver",
      daysAhead: 3,
    });
  }

  if (input.cropSlug === "maize" && das != null && das >= 20 && das <= 45) {
    alerts.push({
      id: `faw-${input.cropSlug}`,
      severity: "critical",
      title: "फॉल आर्मीवर्म चेतावनी — वानस्पतिक अवस्था",
      body: "क्षेत्रीय रिपोर्ट में FAW का दबाव देखा गया है। शाम को गोभ में जांच करें; सुंडी दिखने पर क्लोरएंट्रानिलिप्रोल का छिड़काव करें।",
      cropSlug: input.cropSlug,
      fieldName: input.fieldName,
      actionLabel: "AI डॉक्टर स्कैन",
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
      title: "बुवाई का सही समय शुरू",
      body: sowing.messageHi || sowing.messageEn,
      cropSlug: input.cropSlug,
      actionLabel: "बुवाई गाइड",
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

  if (das != null) {
    const tip = dashboard.irrigationManagement?.tips?.[0] || "उचित नमी बनाए रखें";
    const isWheatFirstIrr = field.cropSlug === "wheat" && das >= 18 && das <= 28;
    alerts.push({
      id: `irr-${field.cropSlug}-${field.name}`,
      severity: "info",
      title: "सिंचाई का समय आ गया है",
      body: isWheatFirstIrr
        ? "पहली सिंचाई (CRI अवस्था 20–25 दिन) तुरंत दें — क्राउन रूट बनते समय पानी की कमी से कल्ले कम बनते हैं।"
        : `फसल की अवस्था अनुसार (दिन ${das}): ${tip}`,
      fieldName: field.name,
      cropSlug: field.cropSlug,
      actionHref: `/crops/${field.cropSlug}/care/irrigation`,
      actionLabel: "सिंचाई गाइड →",
    });
  }

  return alerts.map((a) => ({ ...a, fieldName: a.fieldName ?? field.name }));
}
