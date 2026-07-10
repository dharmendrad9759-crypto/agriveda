import type { FarmAlert } from "@/lib/agriveda2/farmAlertsEngine";
import type { AppSettings } from "@/hooks/useAppSettings";

function alertCategory(alert: FarmAlert): "weather" | "pest" | "fertilizer" | "general" {
  const id = alert.id.toLowerCase();
  if (id.startsWith("irr") || alert.actionHref?.includes("irrigation") || alert.actionHref?.includes("weather")) {
    return "weather";
  }
  if (
    id.includes("bph") ||
    id.includes("faw") ||
    id.includes("blight") ||
    id.includes("pest") ||
    alert.actionHref?.includes("pest") ||
    alert.actionHref?.includes("ai-doctor")
  ) {
    return "pest";
  }
  if (id.includes("sow") || id.includes("fert") || alert.actionHref?.includes("fertilizer")) {
    return "fertilizer";
  }
  return "general";
}

export function filterAlertsBySettings(alerts: FarmAlert[], settings: AppSettings): FarmAlert[] {
  return alerts.filter((a) => {
    const cat = alertCategory(a);
    if (cat === "weather" && !settings.weatherAlerts) return false;
    if (cat === "pest" && !settings.pestAlerts) return false;
    if (cat === "fertilizer" && !settings.fertilizerReminders) return false;
    return true;
  });
}

export interface FieldRecommendation {
  crop: string;
  tip: string;
  href: string;
  severity?: FarmAlert["severity"];
}

export function buildFieldRecommendations(alerts: FarmAlert[]): FieldRecommendation[] {
  if (alerts.length) {
    return alerts.slice(0, 5).map((a) => ({
      crop: a.fieldName ?? a.cropSlug ?? "Your field",
      tip: a.title,
      href: a.actionHref ?? "/alerts",
      severity: a.severity,
    }));
  }
  return [
    { crop: "धान (Paddy)", tip: "टिलरिंग में नमी बनाए रखें — यूरिया split dose", href: "/crops/paddy?tab=fertilizer" },
    { crop: "सोयाबीन (Soybean)", tip: "फूल अवस्था में कीट नियंत्रण की जाँच करें", href: "/crops/soybean?tab=pests" },
    { crop: "मक्का (Maize)", tip: "वानस्पतिक अवस्था में सिंचाई जारी रखें", href: "/crops/maize?tab=irrigation" },
  ];
}
