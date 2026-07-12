import type { NextConfig } from "next";
import os from "os";

/** Hostnames allowed to load Next.js dev assets (phone / Capacitor WebView). */
function lanDevOrigins(): string[] {
  const origins = new Set<string>(["localhost", "127.0.0.1"]);

  for (const nets of Object.values(os.networkInterfaces())) {
    for (const net of nets ?? []) {
      if (net.family === "IPv4" && !net.internal) origins.add(net.address);
    }
  }

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
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
