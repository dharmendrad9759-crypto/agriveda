# Create Android release keystore (Play Store signing)
# Run: npm run android:keystore

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..\android

$keytoolCandidates = @(
  "$env:JAVA_HOME\bin\keytool.exe",
  "C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe",
  "$env:LOCALAPPDATA\Programs\Android Studio\jbr\bin\keytool.exe"
) | Where-Object { $_ }

$keytool = $null
foreach ($c in $keytoolCandidates) {
  if (Test-Path $c) { $keytool = $c; break }
}

if (-not $keytool) {
  Write-Host "keytool not found. Install Android Studio or set JAVA_HOME." -ForegroundColor Red
  exit 1
}

$keystore = "agriveda-release.keystore"
if (Test-Path $keystore) {
  Write-Host "Keystore already exists: android\$keystore" -ForegroundColor Yellow
  Write-Host "Delete it first if you want a new one."
  exit 0
}

Write-Host ""
Write-Host "Creating Play Store keystore..." -ForegroundColor Green
Write-Host "You will be asked for a PASSWORD — remember it!" -ForegroundColor Yellow
Write-Host "Name/organization questions — Enter दबाते जाएँ (default OK)" -ForegroundColor Cyan
Write-Host ""

& $keytool -genkey -v `
  -keystore $keystore `
  -alias agriveda `
  -keyalg RSA `
  -keysize 2048 `
  -validity 10000

if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Done! Keystore: android\$keystore" -ForegroundColor Green
Write-Host "Next: copy android\keystore.properties.example -> android\keystore.properties" -ForegroundColor Cyan
Write-Host "      and fill storePassword / keyPassword." -ForegroundColor Cyan
