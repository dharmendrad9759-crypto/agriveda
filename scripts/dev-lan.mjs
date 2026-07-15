import { spawn, execSync } from "node:child_process";
import http from "node:http";
import { lanIp } from "./get-lan-ip.mjs";

const ip = lanIp();
const lanUrl = `http://${ip}:3000`;
const localUrl = "http://127.0.0.1:3000";

process.env.CAPACITOR_SERVER_URL = lanUrl;
process.env.CAPACITOR_ALLOW_CLEARTEXT = "true";

function probe(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode != null && res.statusCode < 500);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function killPort3000() {
  if (process.platform !== "win32") return;
  try {
    execSync(
      'powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"',
      { stdio: "ignore" }
    );
  } catch {
    /* ignore */
  }
}

const localOk = await probe(localUrl);
const lanOk = await probe(lanUrl);

console.log("");
console.log("AgriVeda dev (LAN)");
console.log(`  PC browser:  http://localhost:3000`);
console.log(`  Phone URL:   ${lanUrl}`);
console.log(`  USB phone:   npm run android:usb  (adb reverse, no Wi-Fi needed)`);
console.log(`  After IP change: npm run android:fix`);
console.log("");

if (localOk && !lanOk) {
  console.log("WARNING: Server on port 3000 is NOT reachable on LAN IP.");
  console.log("         Phone will show blank/green screen until this is fixed.");
  console.log("         Stopping old server and starting fresh on 0.0.0.0 ...");
  console.log("");
  killPort3000();
  await new Promise((r) => setTimeout(r, 800));
} else if (localOk && lanOk) {
  console.log("Dev server already running and LAN OK.");
  console.log("  Restart fresh: npm run dev:stop  then  npm run dev:lan");
  console.log("");
  process.exit(0);
}

const child = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["next", "dev", "--hostname", "0.0.0.0", "--port", "3000"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      CAPACITOR_SERVER_URL: lanUrl,
      CAPACITOR_ALLOW_CLEARTEXT: "true",
    },
    shell: process.platform === "win32",
  }
);

child.on("exit", (code) => process.exit(code ?? 0));
