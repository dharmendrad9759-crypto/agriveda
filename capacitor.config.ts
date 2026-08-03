import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Agriveda loads the Next.js app inside a native WebView.
 *
 * Play Store / production: MUST be HTTPS
 *   $env:CAPACITOR_SERVER_URL="https://agriveda-theta.vercel.app"; npx cap sync android
 *
 * Local LAN debugging only (dev):
 *   $env:CAPACITOR_ALLOW_CLEARTEXT="true"
 *   $env:CAPACITOR_SERVER_URL="http://YOUR_PC_LAN_IP:3000"; npx cap sync android
 */
const serverUrl = process.env.CAPACITOR_SERVER_URL?.trim();
const allowCleartext =
  process.env.CAPACITOR_ALLOW_CLEARTEXT === "true" &&
  Boolean(serverUrl?.startsWith("http://"));

if (serverUrl?.startsWith("http://") && !allowCleartext) {
  throw new Error(
    "[capacitor] Production builds require HTTPS. Set CAPACITOR_SERVER_URL=https://... " +
      "or explicitly CAPACITOR_ALLOW_CLEARTEXT=true for local LAN testing only."
  );
}

if (serverUrl && !serverUrl.startsWith("https://") && !allowCleartext) {
  throw new Error("[capacitor] CAPACITOR_SERVER_URL must be https:// (or cleartext opt-in)");
}

const config: CapacitorConfig = {
  appId: "com.agriveda.app",
  appName: "Agriveda",
  webDir: "capacitor-www",
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext: allowCleartext,
      }
    : undefined,
  android: {
    // Never mix http assets into an https WebView
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      // Held until LaunchFlow cream splash takes over (autoHide false)
      launchShowDuration: 3000,
      launchAutoHide: false,
      launchFadeOutDuration: 350,
      backgroundColor: "#F8F9FA",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#F8F9FA",
    },
  },
};

export default config;
