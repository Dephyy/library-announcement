@echo off
setlocal

echo Stopping Library System local services...

taskkill /FI "WINDOWTITLE eq Library Backend*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Library Frontend*" /T /F >nul 2>&1

echo Stop commands sent for:
echo - Library Backend window
echo - Library Frontend window

echo If anything is still running, close the remaining terminals manually.

endlocal
