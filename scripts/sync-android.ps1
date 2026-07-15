# Sync Capacitor Android project to load AgriVeda from this PC's LAN IP.
# Prerequisites: Android Studio installed; phone on same Wi‑Fi as this PC.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$ip = node scripts/get-lan-ip.mjs | Select-Object -First 1
$url = "http://${ip}:3000"

Write-Host ""
Write-Host "AgriVeda Android sync" -ForegroundColor Green
Write-Host "Server URL: $url"
Write-Host ""
Write-Host "1) Keep this running in another terminal:" -ForegroundColor Yellow
Write-Host "   npm run dev:lan"
Write-Host ""
Write-Host "2) Phone must be on the SAME Wi‑Fi as this PC."
Write-Host "3) Opening Android Studio after sync..."
Write-Host ""

$env:CAPACITOR_SERVER_URL = $url
$env:CAPACITOR_ALLOW_CLEARTEXT = "true"
npx cap sync android
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

npx cap open android
