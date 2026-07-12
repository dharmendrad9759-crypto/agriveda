# Play Store release — sync Capacitor to production URL and build signed AAB.
# Usage:
#   .\scripts\playstore-release.ps1 -ProductionUrl "https://your-app.vercel.app"
#
# Prerequisites:
#   1. App deployed on Vercel (or HTTPS host)
#   2. GEMINI_API_KEY set on Vercel (for AI Doctor)
#   3. android/keystore.properties created from keystore.properties.example
#   4. Release keystore file exists at path in storeFile

param(
    [Parameter(Mandatory = $true)]
    [string]$ProductionUrl
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$url = $ProductionUrl.Trim().TrimEnd("/")
if (-not $url.StartsWith("https://")) {
    throw "ProductionUrl must start with https:// (Play Store requires HTTPS)"
}

$keystoreProps = Join-Path "android" "keystore.properties"
if (-not (Test-Path $keystoreProps)) {
    Write-Host ""
    Write-Host "MISSING: android/keystore.properties" -ForegroundColor Red
    Write-Host "1. Copy android/keystore.properties.example -> android/keystore.properties"
    Write-Host "2. Create keystore:"
    Write-Host '   keytool -genkey -v -keystore android/agriveda-release.keystore -alias agriveda -keyalg RSA -keysize 2048 -validity 10000'
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Agriveda Play Store Release" -ForegroundColor Green
Write-Host "Production URL: $url"
Write-Host ""

Write-Host "[1/3] Syncing Capacitor Android..." -ForegroundColor Cyan
$env:CAPACITOR_SERVER_URL = $url
npx cap sync android
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "[2/3] Building release AAB..." -ForegroundColor Cyan
powershell -ExecutionPolicy Bypass -File scripts/gradle-android.ps1 bundleRelease
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$aab = "android\app\build\outputs\bundle\release\app-release.aab"
Write-Host ""
Write-Host "[3/3] Done!" -ForegroundColor Green
Write-Host "Upload this file to Play Console:" -ForegroundColor Yellow
Write-Host "  $aab"
Write-Host ""
Write-Host "Play Console checklist:" -ForegroundColor Cyan
Write-Host "  - Privacy policy URL: $url/privacy"
Write-Host "  - Package name: com.agriveda.app"
Write-Host "  - Screenshots + feature graphic"
Write-Host "  - Content rating questionnaire"
Write-Host ""
