# Allow phone on same Wi‑Fi to reach Next.js dev server (port 3000)
$ErrorActionPreference = "Continue"
$ruleName = "Agriveda Next.js Dev Server 3000"

try {
  $existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
  if ($existing) {
    Write-Host "Firewall rule already exists: $ruleName" -ForegroundColor Green
  } else {
    New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -ErrorAction Stop | Out-Null
    Write-Host "Created firewall rule: $ruleName (TCP 3000 inbound)" -ForegroundColor Green
  }
} catch {
  Write-Host "Firewall: could not add rule (run terminal as Administrator once):" -ForegroundColor Yellow
  Write-Host "  netsh advfirewall firewall add rule name=`"$ruleName`" dir=in action=allow protocol=TCP localport=3000"
}

Write-Host "Phone must reach http://YOUR_PC_IP:3000 on same network." -ForegroundColor Cyan
