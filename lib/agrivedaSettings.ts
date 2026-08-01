import { registerPlugin } from "@capacitor/core";

export interface AgrivedaSettingsPlugin {
  openAppDetails(): Promise<void>;
  openLocationSource(): Promise<void>;
}

export const AgrivedaSettings = registerPlugin<AgrivedaSettingsPlugin>("AgrivedaSettings");
