@echo off
echo.
echo ============================================================
echo   COPIANDO ARQUIVO CORRETO E FAZENDO DEPLOY
echo ============================================================
echo.

echo [1/3] Copiando index.tsx completo...
copy /Y "supabase\functions\server\index.tsx" "supabase\functions\make-server-c2a25be0\index.ts"

if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Falha ao copiar arquivo!
    pause
    exit /b 1
)

echo.
echo [2/3] Arquivo copiado com sucesso!
echo.
echo [3/3] Fazendo deploy no Supabase...
echo.

supabase functions deploy make-server-c2a25be0

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================================
    echo   DEPLOY COMPLETO COM SUCESSO!
    echo ============================================================
    echo.
    echo Proximos passos:
    echo 1. Pressione Ctrl+Shift+R no navegador
    echo 2. Acesse /test-server-connection
    echo 3. Clique em "Run All Tests"
    echo.
) else (
    echo.
    echo ============================================================
    echo   ERRO NO DEPLOY!
    echo ============================================================
    echo.
)

pause
