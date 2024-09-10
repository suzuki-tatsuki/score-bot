@echo off
echo Starting cargo run and npm start in parallel...

REM Start cargo run in a new command prompt window and close it when done
start cmd /c "cargo run"

REM Start npm start in a new command prompt window and close it when done
start cmd /c "npm start"

echo Both commands have been started in separate windows!
pause
