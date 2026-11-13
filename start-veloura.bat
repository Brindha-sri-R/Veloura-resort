@echo off
title Veloura Luxury Resort & Residences
echo ===================================================
echo   Starting Veloura Full-Stack Luxury Resort App
echo ===================================================
echo.
echo Starting Backend API Server (Port 5000)...
start "Veloura Backend (Port 5000)" cmd /k "cd /d %~dp0server && npm start"
echo Starting Frontend Vite Server (Port 3000)...
start "Veloura Frontend (Port 3000)" cmd /k "cd /d %~dp0 && npm run dev"
echo.
echo ===================================================
echo   Veloura is running!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo ===================================================
echo Opening http://localhost:3000 in your browser...
timeout /t 3 /nobreak >nul
start http://localhost:3000
