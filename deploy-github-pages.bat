@echo off
chcp 65001 >nul
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║   🚀 DEPLOY DUOPRO SERVICES - GITHUB PAGES 🚀            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Verificar se Git está instalado
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git não está instalado!
    echo Por favor, instale o Git primeiro: https://git-scm.com/
    pause
    exit /b 1
)

echo 📋 PASSO 1: Verificando Git...

REM Verificar se já é um repositório Git
if not exist ".git" (
    echo ⚠️  Não é um repositório Git. Inicializando...
    git init
    echo ✅ Repositório Git inicializado!
) else (
    echo ✅ Repositório Git já existe!
)

echo.
echo 📋 PASSO 2: Adicionar arquivos ao Git...

REM Adicionar todos os arquivos
git add .

echo ✅ Arquivos adicionados!

echo.
echo 📋 PASSO 3: Criar commit...

REM Criar commit com data e hora
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a:%%b)

git commit -m "Deploy: DuoPro Services - %mydate% %mytime%"

echo ✅ Commit criado!

echo.
echo ⚠️  ATENÇÃO:
echo.
echo Se este é o PRIMEIRO deploy, você precisa:
echo.
echo 1. Criar um repositório no GitHub: https://github.com/new
echo 2. Copiar a URL do repositório (ex: https://github.com/seu-usuario/duopro-services.git)
echo 3. Executar:
echo.
echo    git remote add origin https://github.com/SEU-USUARIO/duopro-services.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo Se você JÁ configurou o remote, apenas execute:
echo.
echo    git push
echo.
echo ✅ Arquivos preparados para deploy!
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   📖 PRÓXIMOS PASSOS:                                      ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║   1. Configure o remote (se primeiro deploy)               ║
echo ║   2. Execute: git push                                     ║
echo ║   3. No GitHub: Settings → Pages → Source: GitHub Actions  ║
echo ║   4. Aguarde o deploy (2-3 minutos)                        ║
echo ║   5. Acesse: https://SEU-USUARIO.github.io/REPO/           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
pause
