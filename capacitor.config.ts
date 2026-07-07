import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Agriveda loads the Next.js app inside a native WebView.
 *
 * Set CAPACITOR_SERVER_URL to your running app:
 *  - Local phone test: http://YOUR_PC_LAN_IP:3000  (same Wi‑Fi)
 *  - Production:       https://your-app.vercel.app
 *
 * Example (PowerShell):
 *   $env:CAPACITOR_SERVER_URL="http://192.168.1.10:3000"; npx cap sync android
 */
const serverUrl = process.env.CAPACITOR_SERVER_URL?.trim();

const config: CapacitorConfig = {
  appId: "com.agriveda.app",
  appName: "Agriveda",
  webDir: "capacitor-www",
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext: serverUrl.startsWith("http://"),
      }
    : undefined,
  android: {
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#006432",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#006432",
    },
  },
};

export default config;
