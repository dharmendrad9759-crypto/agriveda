# USB debugging: adb reverse + sync Capacitor to localhost:3000
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

& "$PSScriptRoot\setup-adb-reverse.ps1"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

& "$PSScriptRoot\fix-android-url.ps1"
