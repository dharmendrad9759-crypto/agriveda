# One-shot: firewall + sync Android URL + verify dev server
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host ""
Write-Host "=== Agriveda Android Run Setup ===" -ForegroundColor Green
Write-Host ""

& "$PSScriptRoot\allow-dev-firewall.ps1"
Write-Host ""

& "$PSScriptRoot\fix-android-url.ps1"
