import os from "os";

/** Skip virtual / VPN adapters — pick real Wi‑Fi or Ethernet for phone testing */
const SKIP_NAME =
  /virtual|vmware|vethernet|hyper-v|wsl|loopback|bluetooth|npcap|tailscale|zerotier|hamachi/i;

/** Prefer these when multiple adapters are up */
const PREFER_NAME = /wi-?fi|wlan|wireless|ethernet|eth\b|lan/i;

function collectIpv4() {
  const nets = os.networkInterfaces();
  const candidates = [];

  for (const [name, addrs] of Object.entries(nets)) {
    if (SKIP_NAME.test(name)) continue;
    for (const net of addrs ?? []) {
      if (net.family !== "IPv4" || net.internal) continue;
      candidates.push({ name, address: net.address });
    }
  }
  return candidates;
}

export function lanIp() {
  const candidates = collectIpv4();
  if (!candidates.length) return "127.0.0.1";

  const preferred = candidates.find((c) => PREFER_NAME.test(c.name));
  if (preferred) return preferred.address;

  // Hotspot / USB tethering subnet (PC connected to phone hotspot)
  const hotspot = candidates.find((c) => c.address.startsWith("172.20.10."));
  if (hotspot) return hotspot.address;

  // Private LAN ranges
  const privateLan = candidates.find((c) =>
    /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(c.address)
  );
  return privateLan?.address ?? candidates[0].address;
}

const ip = lanIp();
console.log(ip);
console.log(`\nPhone URL: http://${ip}:3000`);
console.log(`Capacitor:  $env:CAPACITOR_SERVER_URL="http://${ip}:3000"; npx cap sync android`);
