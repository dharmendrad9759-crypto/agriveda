import type { NextConfig } from "next";

/** Hostnames allowed to load Next.js dev assets (phone / Capacitor WebView). */
function lanDevOrigins(): string[] {
  const origins = new Set<string>(["localhost", "127.0.0.1", "10.199.192.251"]);

  const serverUrl = process.env.CAPACITOR_SERVER_URL?.trim();
  if (serverUrl) {
    try {
      origins.add(new URL(serverUrl).hostname);
    } catch {
      /* ignore invalid URL */
    }
  }

  return [...origins];
}

const nextConfig: NextConfig = {
  allowedDevOrigins: lanDevOrigins(),
};

export default nextConfig;
