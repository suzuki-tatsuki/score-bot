@echo off
echo Setting up Node.js and Rustup...

REM Install Node.js (using the official installer)
echo Installing Node.js...
powershell -Command "Start-Process https://nodejs.org/dist/v18.17.1/node-v18.17.1-x64.msi -Wait -NoNewWindow"
echo Node.js installation complete.

REM Verify Node.js installation
node -v
npm -v

REM Install Rustup (Rust installer)
echo Installing Rustup...
powershell -Command "Invoke-WebRequest -Uri https://static.rust-lang.org/rustup/init.exe -OutFile rustup-init.exe"
rustup-init.exe -y

REM Add Rust to the system path for the current session
set PATH=%PATH%;%USERPROFILE%\.cargo\bin

REM Verify Rust installation
rustc --version
cargo --version

echo Setup complete!
pause
