@echo off
setlocal

set "ROOT=%~dp0"
set "BACKEND_DIR=%ROOT%backend"
set "FRONTEND_DIR=%ROOT%frontend"
set "FRONTEND_PORT="

echo Starting Library System local services...

if not exist "%BACKEND_DIR%\.venv\Scripts\python.exe" (
  echo [ERROR] Backend virtual environment not found at "%BACKEND_DIR%\.venv".
  echo Create it first with: python -m venv backend\.venv
  goto :end
)

if not exist "%FRONTEND_DIR%\node_modules" (
  echo Installing frontend dependencies...
  call npm install --prefix "%FRONTEND_DIR%"
  if errorlevel 1 (
    echo [ERROR] Frontend dependency installation failed.
    goto :end
  )
)

echo Closing stale Node dev servers on ports 3000-3010...
powershell -NoProfile -Command "$ports=3000..3010; $regex=':(\d+)\s+.*LISTENING\s+(\d+)$'; netstat -ano | Select-String 'LISTENING' | ForEach-Object { $line=$_.ToString().Trim(); if($line -match $regex){ $port=[int]$matches[1]; $procId=[int]$matches[2]; if($ports -contains $port){ try { $p=Get-Process -Id $procId -ErrorAction Stop; if($p.ProcessName -eq 'node'){ Stop-Process -Id $procId -Force; Write-Output ('Closed node PID ' + $procId + ' on port ' + $port) } } catch {} } } }"

echo Closing stale backend server on port 8000...
powershell -NoProfile -Command "$regex=':8000\s+.*LISTENING\s+(\d+)$'; netstat -ano | Select-String 'LISTENING' | ForEach-Object { $line=$_.ToString().Trim(); if($line -match $regex){ $procId=[int]$matches[1]; try { $p=Get-Process -Id $procId -ErrorAction Stop; if($p.ProcessName -eq 'python'){ Stop-Process -Id $procId -Force; Write-Output ('Closed python PID ' + $procId + ' on port 8000') } } catch {} } }"

for /f %%P in ('powershell -NoProfile -Command "$ports=3000..3010; $used=@{}; $regex=':(\d+)\s+.*LISTENING\s+\d+$'; netstat -ano | Select-String 'LISTENING' | ForEach-Object { $line=$_.ToString().Trim(); if($line -match $regex){ $used[[int]$matches[1]]=$true } }; foreach($p in $ports){ if(-not $used.ContainsKey($p)){ Write-Output $p; break } }"') do (
  set "FRONTEND_PORT=%%P"
)

if not defined FRONTEND_PORT (
  echo [ERROR] Could not find a free frontend port between 3000 and 3010.
  goto :end
)

start "Library Backend" /D "%BACKEND_DIR%" cmd /k ".venv\Scripts\python manage.py runserver 8000"
start "Library Frontend" /D "%FRONTEND_DIR%" cmd /k "npm run dev -- --port %FRONTEND_PORT%"

ping 127.0.0.1 -n 5 >nul
start "" "http://localhost:%FRONTEND_PORT%"
start "" "http://localhost:8000/api/health/"

echo Backend and frontend launch commands have been started.
echo Backend: http://localhost:8000/api/health/
echo Frontend: http://localhost:%FRONTEND_PORT%

:end
endlocal
