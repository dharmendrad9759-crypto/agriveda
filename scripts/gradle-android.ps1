# Run Gradle in the Android project from PowerShell (sets JAVA_HOME + SDK path).
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$GradleArgs = @("assembleDebug")
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

function Find-JavaHome {
    $candidates = @(
        $env:JAVA_HOME,
        "C:\Program Files\Android\Android Studio\jbr",
        "$env:LOCALAPPDATA\Programs\Android Studio\jbr",
        "C:\Program Files\Java\jdk-21",
        "C:\Program Files\Eclipse Adoptium\jdk-21*"
    ) | Where-Object { $_ }

    foreach ($path in $candidates) {
        $resolved = $path
        if ($path -like "*\*") {
            $match = Get-Item $path -ErrorAction SilentlyContinue | Select-Object -First 1
            if ($match) { $resolved = $match.FullName }
        }
        if (Test-Path "$resolved\bin\java.exe") {
            return $resolved
        }
    }

    throw "Java not found. Install Android Studio or set JAVA_HOME to a JDK (17+)."
}

function Ensure-LocalProperties {
    param([string]$SdkPath)

    $localProps = Join-Path "android" "local.properties"
    if (Test-Path $localProps) { return }

    $sdkDir = ($SdkPath -replace '\\', '/')
    "sdk.dir=$sdkDir" | Set-Content -Path $localProps -Encoding ASCII
    Write-Host "Created android/local.properties (sdk.dir=$sdkDir)" -ForegroundColor Yellow
}

$javaHome = Find-JavaHome
$env:JAVA_HOME = $javaHome

$sdkCandidates = @(
    $env:ANDROID_HOME,
    $env:ANDROID_SDK_ROOT,
    "$env:LOCALAPPDATA\Android\Sdk"
) | Where-Object { $_ -and (Test-Path $_) }

if (-not $sdkCandidates) {
    throw "Android SDK not found. Install Android Studio or set ANDROID_HOME."
}

$env:ANDROID_HOME = $sdkCandidates[0]
Ensure-LocalProperties -SdkPath $env:ANDROID_HOME

Write-Host "JAVA_HOME: $javaHome" -ForegroundColor Cyan
Write-Host "ANDROID_HOME: $env:ANDROID_HOME" -ForegroundColor Cyan
Write-Host "Running: gradlew $($GradleArgs -join ' ')" -ForegroundColor Green
Write-Host ""

Push-Location android
try {
    & .\gradlew.bat @GradleArgs
    exit $LASTEXITCODE
}
finally {
    Pop-Location
}
