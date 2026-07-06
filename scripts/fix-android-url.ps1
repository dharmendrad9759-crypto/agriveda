# Sync Android app to current PC Wi‑Fi IP (fixes "Web page not available")
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$ip = (node scripts/get-lan-ip.mjs | Select-Object -First 1).Trim()
$url = "http://${ip}:3000"

Write-Host ""
Write-Host "=== AgriVeda Phone Fix ===" -ForegroundColor Green
Write-Host "New phone URL: $url" -ForegroundColor Cyan
Write-Host ""

# Quick server check
try {
  $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 3
  Write-Host "Dev server: OK ($($r.StatusCode))" -ForegroundColor Green
} catch {
  Write-Host "Dev server: NOT RUNNING on $url" -ForegroundColor Red
  Write-Host "Start in another terminal: npm run dev:lan" -ForegroundColor Yellow
  Write-Host ""
}

$env:CAPACITOR_SERVER_URL = $url
npx cap sync android
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Phone + PC same Wi-Fi (wireless USB debug is NOT enough for loading the site)"
Write-Host "  2. Phone Chrome mein kholo: $url"
Write-Host "  3. Android Studio -> Run (green play) dubara"
Write-Host ""
