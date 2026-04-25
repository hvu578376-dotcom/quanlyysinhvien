@echo off
cd /d "%~dp0"

echo Starting Frontend...
start "Frontend Vite" cmd /k "cd /d "%~dp0ClientApp" && npm run dev"

timeout /t 3 >nul

echo Starting Backend...
start "Backend ASP.NET" cmd /k "cd /d "%~dp0" && dotnet run --launch-profile https"

timeout /t 5 >nul

start "" "http://localhost:5173"

exit