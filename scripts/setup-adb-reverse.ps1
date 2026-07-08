# Forward phone localhost:3000 -> PC localhost:3000 (USB debugging, no Wi-Fi needed)
$ErrorActionPreference = "Continue"

$adb = Get-Command adb -ErrorAction SilentlyContinue
if (-not $adb) {
  Write-Host "adb not found. Install Android SDK platform-tools or add adb to PATH." -ForegroundColor Red
  Write-Host "Wi-Fi mode: npm run android:fix" -ForegroundColor Yellow
  exit 1
}

$lines = & adb devices 2>&1 | Where-Object { $_ -match "\tdevice$" }
if (-not $lines) {
  Write-Host "No Android device connected via USB." -ForegroundColor Red
  Write-Host "  1. Phone USB se connect karein" -ForegroundColor Yellow
  Write-Host "  2. Developer options -> USB debugging ON" -ForegroundColor Yellow
  Write-Host "  3. Phone par 'Allow USB debugging' accept karein" -ForegroundColor Yellow
  exit 1
}

& adb reverse tcp:3000 tcp:3000
if ($LASTEXITCODE -ne 0) {
  Write-Host "adb reverse failed." -ForegroundColor Red
  exit 1
}

Write-Host "USB tunnel OK: phone localhost:3000 -> PC localhost:3000" -ForegroundColor Green
exit 0
