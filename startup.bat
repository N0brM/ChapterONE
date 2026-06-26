@echo off
title ChapterONE - Demo
color 0A

echo   ChapterONE - A arrancar...

REM Abre a API .NET
echo [1/2] A iniciar a API...
start "ChapterONE API" cmd /k "cd /d %~dp0chapterONE-backend\ChapterONE.API && dotnet run"
timeout /t 8 /nobreak >nul

REM Abre o tunnel da API (serve tambem o Angular)
echo [2/2] A abrir tunnel...
start "Tunnel ChapterONE" cmd /k "cloudflared tunnel --url http://localhost:5043"

echo Success!

pause