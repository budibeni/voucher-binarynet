$sdkDir = "$env:USERPROFILE\Android\Sdk"
$licensesDir = "$sdkDir\licenses"

# Create licenses directory
New-Item -ItemType Directory -Force -Path $licensesDir | Out-Null

# Write all required license hashes
Set-Content -Path "$licensesDir\android-sdk-license" -Value "24333f8a63b6825ea9c5514f83c2829b004d1fee`n8933bad161af4408943204b790daa7c40d26a3f`nd56f5187479451eabf01fb78af6dfcb131a6481e"
Set-Content -Path "$licensesDir\android-sdk-arm-dbt-license" -Value "859f317696f67ef3d7f30a50a5560e7834b43903"
Set-Content -Path "$licensesDir\android-sdk-preview-license" -Value "84831b9409646a918e30573bab4c9c91346d8abd"
Set-Content -Path "$licensesDir\google-gdk-license" -Value "33b6a2b64607f11b759f320ef9dff4ae5c47d97a"
Set-Content -Path "$licensesDir\intel-android-extra-license" -Value "d975f751698a77b662f1254ddbeed3901e976f5a"

Write-Host "Licenses written to $licensesDir"

# Install SDK packages
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;" + $env:PATH

$sdkmanager = "$sdkDir\cmdline-tools\latest\bin\sdkmanager.bat"

Write-Host "Installing Android SDK packages..."
& cmd /c "`"$sdkmanager`" --sdk_root=`"$sdkDir`" `"platform-tools`" `"platforms;android-35`" `"build-tools;35.0.0`""

Write-Host "All Done!"
