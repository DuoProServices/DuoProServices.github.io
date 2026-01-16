@echo off
echo ============================================================
echo   COPIANDO ARQUIVO CORRETO
echo ============================================================
echo.

echo [1/2] Copiando index.tsx para index.ts...
copy /Y "supabase\functions\server\index.tsx" "supabase\functions\make-server-c2a25be0\index.ts"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================================
    echo   ARQUIVO COPIADO COM SUCESSO!
    echo ============================================================
    echo.
    echo Agora execute:
    echo   supabase functions deploy make-server-c2a25be0
    echo.
) else (
    echo.
    echo ERRO: Falha ao copiar arquivo!
    echo.
)

pause
