@echo off
echo.
echo ========================================
echo    DEPLOY PARA GITHUB PAGES
echo ========================================
echo.

:: Verifica se está no git
if not exist .git (
    echo ❌ Erro: Este não é um repositório Git.
    echo 💡 Execute primeiro: git init
    pause
    exit /b 1
)

echo 📦 Preparando deploy...
echo.

:: Add todas as mudanças
git add .

:: Pede mensagem de commit
set /p commit_message="📝 Digite a mensagem do commit (ou pressione Enter para usar padrão): "

if "%commit_message%"=="" (
    for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
    for /f "tokens=1-2 delims=/: " %%a in ('time /t') do (set mytime=%%a:%%b)
    set commit_message=Deploy %mydate% %mytime%
)

:: Faz commit
git commit -m "%commit_message%"

:: Push
echo.
echo 🚀 Fazendo push para GitHub...
git push

echo.
echo ========================================
echo    ✅ DEPLOY INICIADO!
echo ========================================
echo.
echo 📊 Acompanhe o progresso:
echo    → Vá para: https://github.com/SEU-USUARIO/SEU-REPO/actions
echo.
echo 🌐 Após 2-5 minutos, seu site estará online em:
echo    → https://SEU-USUARIO.github.io/SEU-REPO/
echo.
echo 💡 Dica: Pressione Ctrl+Shift+R no navegador para limpar cache!
echo.
pause
