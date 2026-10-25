/**
 * Push alerts — FCM on native when configured; local notifications + Web Notifications fallback.
 * Token is uploaded to /api/push/register so server can send expert/outbreak alerts.
 */
import { isCapacitorNative } from "@/lib/capacitorNav";
import { readStorage } from "@/lib/storage";

const TOKEN_KEY = "agriveda-push-token";

function isQuietHoursNow(): boolean {
  const hour = new Date().getHours();
  // Quiet hours: 10 PM (22:00) to 6 AM (06:00)
  return hour >= 22 || hour < 6;
}

async function uploadPushToken(token: string): Promise<void> {
  try {
    let lastLat: number | undefined;
    let lastLon: number | undefined;
    const loc = readStorage<{ lat?: number; lon?: number } | null>("agriveda-last-location", null);
    if (typeof loc?.lat === "number" && typeof loc?.lon === "number") {
      lastLat = loc.lat;
      lastLon = loc.lon;
    }
    await fetch("/api/push/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, lastLat, lastLon }),
    });
  } catch {
    /* offline / unauthenticated */
  }
}

export async function registerFarmerPush(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  if (isCapacitorNative()) {
    try {
      const { PushNotifications } = await import("@capacitor/push-notifications");
      let perm = await PushNotifications.checkPermissions();
      if (perm.receive === "prompt") {
        perm = await PushNotifications.requestPermissions();
      }
      if (perm.receive !== "granted") return null;

      return await new Promise<string | null>((resolve) => {
        void PushNotifications.addListener("registration", (token) => {
          const value = token.value;
          localStorage.setItem(TOKEN_KEY, value);
          void uploadPushToken(value);
          resolve(value);
        });
        void PushNotifications.addListener("registrationError", () => resolve(null));
        void PushNotifications.register().catch(() => resolve(null));
        window.setTimeout(() => {
          const existing = localStorage.getItem(TOKEN_KEY);
          if (existing) void uploadPushToken(existing);
          resolve(existing);
        }, 8000);
      });
    } catch {
      return null;
    }
  }

  // Web Browser fallback
  if ("Notification" in window && Notification.permission === "default") {
    try {
      await Notification.requestPermission();
    } catch {
      /* ignore */
    }
  }
  return null;
}

export async function scheduleLocalAlert(input: {
  id: number;
  title: string;
  body: string;
  at?: Date;
  /** User-requested (e.g. irrigation reminder) — ignore alert toggle settings */
  force?: boolean;
}): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const settings = readStorage("agriveda-app-settings", {
    weatherAlerts: true,
    pestAlerts: true,
    fertilizerReminders: true,
    quietHoursEnabled: false,
  });

  // Check Quiet Hours (10 PM to 6 AM)
  if (!input.force && settings.quietHoursEnabled && isQuietHoursNow()) {
    return false;
  }

  if (!input.force) {
    if (!settings.weatherAlerts && !settings.pestAlerts && !settings.fertilizerReminders) {
      return false;
    }
  }

  // 1. Native Capacitor Local Notifications
  if (isCapacitorNative()) {
    try {
      const { LocalNotifications } = await import("@capacitor/local-notifications");
      let perm = await LocalNotifications.checkPermissions();
      if (perm.display === "prompt") {
        perm = await LocalNotifications.requestPermissions();
      }
      if (perm.display !== "granted") return false;

      await LocalNotifications.schedule({
        notifications: [
          {
            id: input.id,
            title: input.title,
            body: input.body,
            schedule: input.at ? { at: input.at } : undefined,
            sound: undefined,
            smallIcon: "ic_stat_icon_config_sample",
          },
        ],
      });
      return true;
    } catch {
      return false;
    }
  }

  // 2. Modern Web Browser Notifications API
  if ("Notification" in window) {
    try {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
      if (Notification.permission === "granted") {
        const notif = new Notification(input.title, {
          body: input.body,
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-192x192.png",
        });
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
        return true;
      }
    } catch {
      /* ignore */
    }
  }

  return false;
}

export async function notifySprayWindow(title: string, body: string): Promise<void> {
  const settings = readStorage("agriveda-app-settings", { weatherAlerts: true });
  if (!settings.weatherAlerts) return;
  await scheduleLocalAlert({ id: 9001, title, body });
}

export async function notifyWeatherAlert(title: string, body: string): Promise<void> {
  const settings = readStorage("agriveda-app-settings", { weatherAlerts: true });
  if (!settings.weatherAlerts) return;
  await scheduleLocalAlert({ id: 9002, title, body });
}

export async function notifyOutbreakAlert(title: string, body: string): Promise<void> {
  const settings = readStorage("agriveda-app-settings", { pestAlerts: true });
  if (!settings.pestAlerts) return;
  await scheduleLocalAlert({ id: 9003, title, body });
}

export async function notifyFertilizerReminder(title: string, body: string): Promise<void> {
  const settings = readStorage("agriveda-app-settings", { fertilizerReminders: true });
  if (!settings.fertilizerReminders) return;
  await scheduleLocalAlert({ id: 9004, title, body });
}

export async function notifyMandiPriceAlert(title: string, body: string): Promise<void> {
  await scheduleLocalAlert({ id: 9005, title, body, force: true });
}
