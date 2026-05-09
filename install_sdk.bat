@echo off
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%
set ANDROID_HOME=%USERPROFILE%\Android\Sdk
set SDKMANAGER=%ANDROID_HOME%\cmdline-tools\latest\bin\sdkmanager.bat

echo Accepting Android SDK licenses...
(echo y & echo y & echo y & echo y & echo y & echo y & echo y) | %SDKMANAGER% --sdk_root=%ANDROID_HOME% --licenses

echo.
echo Installing SDK packages...
(echo y & echo y & echo y) | %SDKMANAGER% --sdk_root=%ANDROID_HOME% "platform-tools" "platforms;android-35" "build-tools;35.0.0"

echo.
setx ANDROID_HOME "%USERPROFILE%\Android\Sdk"
setx ANDROID_SDK_ROOT "%USERPROFILE%\Android\Sdk"

echo All done! SDK installed.
