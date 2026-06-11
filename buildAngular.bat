@echo off
title ChapterONE - Build para Demo
color 0A

echo.
echo   ChapterONE 
echo.

REM Caminhos
set FRONTEND_DIR=%~dp0chapterone-fronend
set BACKEND_WWWROOT=%~dp0chapterONE-backend\ChapterONE.API\wwwroot

REM Compila o Angular
echo [1/3] A compilar o Angular...
cd /d "%FRONTEND_DIR%"
call ng build
if %errorlevel% neq 0 (
    echo [ERRO] O build do Angular falhou!
    pause
    exit /b 1
)

REM Cria a pasta wwwroot se não existir 
echo [2/3] A preparar a pasta wwwroot...
if not exist "%BACKEND_WWWROOT%" mkdir "%BACKEND_WWWROOT%"

REM Copia os ficheiros compilados para wwwroot 
echo [3/3] A copiar ficheiros para wwwroot...
REM Angular 17+ compila para dist/nome-projeto/browser/
xcopy /E /Y /I "%FRONTEND_DIR%\dist\chapterONE-fronend\browser\*" "%BACKEND_WWWROOT%\"

if %errorlevel% neq 0 (
    echo.
    echo [AVISO] Copia falhou. Verifica o nome da pasta em dist/
    echo Pasta dist: 
    dir "%FRONTEND_DIR%\dist" /b
    pause
    exit /b 1
)
echo Sucesso!
pause