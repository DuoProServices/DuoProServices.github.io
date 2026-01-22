@echo off
echo ========================================
echo   DUOPRO SERVICES - DEPLOY WINDOWS
echo ========================================
echo.

echo [1/5] Instalando dependencias...
call npm install
if errorlevel 1 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)
echo.

echo [2/5] Fazendo build...
call npm run build
if errorlevel 1 (
    echo ERRO: Falha no build!
    pause
    exit /b 1
)
echo.

echo [3/5] Adicionando arquivos ao Git...
git add .
if errorlevel 1 (
    echo ERRO: Falha ao adicionar arquivos!
    pause
    exit /b 1
)
echo.

echo [4/5] Criando commit...
git commit -m "Deploy: Correcoes de imports React Router"
if errorlevel 1 (
    echo AVISO: Nenhuma mudanca para commitar (talvez ja foi feito)
)
echo.

echo [5/5] Enviando para GitHub...
git push origin main
if errorlevel 1 (
    echo ERRO: Falha ao enviar para GitHub!
    echo.
    echo Voce pode precisar:
    echo - Configurar Git: git config --global user.name "Seu Nome"
    echo - Configurar Email: git config --global user.email "seu@email.com"
    echo - Fazer login no GitHub
    pause
    exit /b 1
)
echo.

echo ========================================
echo   DEPLOY CONCLUIDO COM SUCESSO!
echo ========================================
echo.
echo Aguarde 2-3 minutos e acesse:
echo https://duoproservices.github.io
echo.
echo Pressione Ctrl+Shift+R no navegador para limpar o cache!
echo.
pause
