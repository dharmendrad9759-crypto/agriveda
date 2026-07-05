import { spawn } from "node:child_process";
import os from "node:os";

function lanIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      if (net.family === "IPv4" && !net.internal) return net.address;
    }
  }
  return "127.0.0.1";
}

const ip = lanIp();
const url = `http://${ip}:3000`;

process.env.CAPACITOR_SERVER_URL = url;

console.log("");
console.log("AgriVeda dev (LAN)");
console.log(`  PC browser:  http://localhost:3000`);
console.log(`  Phone URL:   ${url}`);
console.log(`  After code changes, re-run: npm run android:prepare`);
console.log("");

const child = spawn(
  process.platform === "win32" ? "npx.cmd" : "npx",
  ["next", "dev", "--hostname", "0.0.0.0", "--port", "3000"],
  {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  }
);

child.on("exit", (code) => process.exit(code ?? 0));
