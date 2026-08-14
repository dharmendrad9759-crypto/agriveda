/**
 * Push alerts — FCM on native when configured; local notifications as fallback.
 */
import { isCapacitorNative } from "@/lib/capacitorNav";
import { readStorage } from "@/lib/storage";

const TOKEN_KEY = "agriveda-push-token";

export async function registerFarmerPush(): Promise<string | null> {
  if (typeof window === "undefined" || !isCapacitorNative()) return null;

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
        resolve(value);
      });
      void PushNotifications.addListener("registrationError", () => resolve(null));
      void PushNotifications.register().catch(() => resolve(null));
      window.setTimeout(() => resolve(localStorage.getItem(TOKEN_KEY)), 8000);
    });
  } catch {
    return null;
  }
}

export async function scheduleLocalAlert(input: {
  id: number;
  title: string;
  body: string;
  at?: Date;
}): Promise<void> {
  if (typeof window === "undefined" || !isCapacitorNative()) return;

  const settings = readStorage("agriveda-app-settings", { weatherAlerts: true, quietHoursEnabled: false });
  if (!settings.weatherAlerts && !settings.pestAlerts) return;

  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    let perm = await LocalNotifications.checkPermissions();
    if (perm.display === "prompt") {
      perm = await LocalNotifications.requestPermissions();
    }
    if (perm.display !== "granted") return;

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
  } catch {
    /* plugin missing or denied */
  }
}

export async function notifySprayWindow(title: string, body: string): Promise<void> {
  await scheduleLocalAlert({ id: 9001, title, body });
}

export async function notifyWeatherAlert(title: string, body: string): Promise<void> {
  await scheduleLocalAlert({ id: 9002, title, body });
}

export async function notifyOutbreakAlert(title: string, body: string): Promise<void> {
  const settings = readStorage("agriveda-app-settings", { pestAlerts: true });
  if (!settings.pestAlerts) return;
  await scheduleLocalAlert({ id: 9003, title, body });
}
