@echo off
echo ========================================
echo   DUOPRO - CONFIGURACAO INICIAL
echo ========================================
echo.

echo Este script vai:
echo 1. Configurar o Git
echo 2. Conectar com o repositorio GitHub
echo 3. Fazer o primeiro deploy
echo.
pause
echo.

echo ========================================
echo   CONFIGURACAO DO GIT
echo ========================================
echo.

set /p GIT_NAME="Digite seu nome: "
set /p GIT_EMAIL="Digite seu email do GitHub: "

git config --global user.name "%GIT_NAME%"
git config --global user.email "%GIT_EMAIL%"

echo.
echo Git configurado com sucesso!
echo Nome: %GIT_NAME%
echo Email: %GIT_EMAIL%
echo.
pause
echo.

echo ========================================
echo   CONECTANDO COM GITHUB
echo ========================================
echo.

echo Inicializando repositorio...
git init
if errorlevel 1 (
    echo Repository ja existe, continuando...
)

echo.
echo Adicionando remote do GitHub...
git remote add origin https://github.com/duoproservices/duoproservices.github.io.git
if errorlevel 1 (
    echo Remote ja existe, atualizando...
    git remote set-url origin https://github.com/duoproservices/duoproservices.github.io.git
)

echo.
echo ========================================
echo   INSTALANDO DEPENDENCIAS
echo ========================================
echo.

call npm install
if errorlevel 1 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   FAZENDO BUILD
echo ========================================
echo.

call npm run build
if errorlevel 1 (
    echo ERRO: Falha no build!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   PREPARANDO DEPLOY
echo ========================================
echo.

git add .
git commit -m "Deploy inicial: Correcoes React Router"

echo.
echo ========================================
echo   ENVIANDO PARA GITHUB
echo ========================================
echo.
echo IMPORTANTE: Uma janela do GitHub vai abrir.
echo Faca login com seu usuario e senha do GitHub.
echo.
pause

git push -u origin main
if errorlevel 1 (
    echo.
    echo ERRO: Falha ao enviar para GitHub!
    echo.
    echo Possiveis problemas:
    echo - Voce nao tem acesso ao repositorio
    echo - Precisa fazer login no GitHub
    echo - Token de acesso expirado
    echo.
    echo Entre em contato com o administrador do repositorio.
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
echo Para proximos deploys, use o arquivo:
echo DEPLOY_WINDOWS.bat
echo.
pause
