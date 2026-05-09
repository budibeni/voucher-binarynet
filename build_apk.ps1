$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;" + $env:PATH
$env:ANDROID_HOME = "$env:USERPROFILE\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME

Set-Location "d:\03. DEVELOPMENT\03. AJB\BINARY-NET\voucher-binarynet"

Write-Host "=== Step 1: Expo Prebuild ===" -ForegroundColor Cyan
cmd /c "npx expo prebuild --platform android --no-install 2>&1"

Write-Host "=== Step 2: Build APK ===" -ForegroundColor Cyan
Set-Location "d:\03. DEVELOPMENT\03. AJB\BINARY-NET\voucher-binarynet\android"
cmd /c "gradlew.bat assembleDebug 2>&1"

Write-Host "=== Build Complete! ===" -ForegroundColor Green
$apk = "d:\03. DEVELOPMENT\03. AJB\BINARY-NET\voucher-binarynet\android\app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $apk) {
    Write-Host "APK found at: $apk" -ForegroundColor Green
    Write-Host "Size: $([math]::Round((Get-Item $apk).Length / 1MB, 2)) MB" -ForegroundColor Green
} else {
    Write-Host "APK not found - check build errors above" -ForegroundColor Red
}
