# Sync Android app URL (USB adb reverse preferred, else Wi-Fi LAN IP)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$ip = (node scripts/get-lan-ip.mjs | Select-Object -First 1).Trim()
$lanUrl = "http://${ip}:3000"
$url = $lanUrl
$mode = "Wi-Fi LAN"

$adb = Get-Command adb -ErrorAction SilentlyContinue
if ($adb) {
  $devices = & adb devices 2>&1 | Where-Object { $_ -match "\tdevice$" }
  if ($devices) {
    & adb reverse tcp:3000 tcp:3000 2>$null
    if ($LASTEXITCODE -eq 0) {
      $url = "http://localhost:3000"
      $mode = "USB (adb reverse)"
    }
  }
}

Write-Host ""
Write-Host "=== AgriVeda Phone Fix ===" -ForegroundColor Green
Write-Host "Mode: $mode" -ForegroundColor Cyan
Write-Host "App URL: $url" -ForegroundColor Cyan
if ($mode -eq "Wi-Fi LAN") {
  Write-Host "LAN fallback: $lanUrl" -ForegroundColor DarkGray
}
Write-Host ""

# Check server from PC
$checkUrl = if ($url -match "localhost") { "http://127.0.0.1:3000" } else { $url }
try {
  $r = Invoke-WebRequest -Uri $checkUrl -UseBasicParsing -TimeoutSec 4
  Write-Host "Dev server: OK ($($r.StatusCode))" -ForegroundColor Green
} catch {
  Write-Host "Dev server: NOT RUNNING" -ForegroundColor Red
  Write-Host "Run: npm run dev:lan" -ForegroundColor Yellow
  Write-Host ""
}

if ($mode -eq "Wi-Fi LAN") {
  try {
    $r2 = Invoke-WebRequest -Uri $lanUrl -UseBasicParsing -TimeoutSec 4
    Write-Host "LAN reachability: OK ($($r2.StatusCode))" -ForegroundColor Green
  } catch {
    Write-Host "LAN reachability: FAILED - phone may not load app on Wi-Fi" -ForegroundColor Red
    Write-Host "Try USB: connect phone + npm run android:usb" -ForegroundColor Yellow
  }
}

$env:CAPACITOR_SERVER_URL = $url
$env:CAPACITOR_ALLOW_CLEARTEXT = "true"
npx cap sync android
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
if ($mode -eq "USB (adb reverse)") {
  Write-Host "  1. npm run dev:lan  (server chal raha ho)"
  Write-Host "  2. Android Studio -> Rebuild Project -> Run"
} else {
  Write-Host "  1. npm run dev:stop  then  npm run dev:lan"
  Write-Host "  2. Phone Chrome: $lanUrl  (yahan app dikhna chahiye)"
  Write-Host "  3. Android Studio -> Rebuild Project -> Run"
  Write-Host "  USB se test: phone connect + npm run android:usb"
}
Write-Host ""
