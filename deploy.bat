@echo off
REM 🚀 Script de Deploy Rápido para GitHub Pages (Windows)
REM Este script facilita o processo de deploy

echo.
echo ========================================
echo 🚀 DuoPro Services - Deploy Script
echo ========================================
echo.

REM Verifica se há mudanças
git status --short >nul 2>&1
if %errorlevel% neq 0 (
  echo ❌ ERRO: Git não inicializado nesta pasta.
  echo    Execute: git init
  pause
  exit /b 1
)

REM Pede mensagem de commit
echo 📝 Digite a mensagem do commit:
set /p commit_message="> "

REM Se não digitou mensagem, usa padrão
if "%commit_message%"=="" (
  set commit_message=chore: atualização geral
  echo 📝 Usando mensagem padrão: %commit_message%
)

echo.
echo ⏳ Iniciando deploy...
echo.

REM 1. Build local para verificar erros
echo 1️⃣ Testando build local...
call npm run build

if %errorlevel% neq 0 (
  echo.
  echo ❌ ERRO: Build falhou!
  echo    Corrija os erros acima antes de fazer deploy.
  pause
  exit /b 1
)

echo ✅ Build local OK!
echo.

REM 2. Git add
echo 2️⃣ Adicionando arquivos ao Git...
git add .
echo ✅ Arquivos adicionados!
echo.

REM 3. Git commit
echo 3️⃣ Fazendo commit...
git commit -m "%commit_message%"
echo ✅ Commit feito!
echo.

REM 4. Git push
echo 4️⃣ Enviando para GitHub...
git push origin main

if %errorlevel% neq 0 (
  echo.
  echo ❌ ERRO: Push falhou!
  echo    Verifique sua conexão com o GitHub.
  pause
  exit /b 1
)

echo ✅ Push concluído!
echo.
echo ================================================
echo 🎉 Deploy iniciado com sucesso!
echo ================================================
echo.
echo O GitHub Actions está processando o deploy.
echo Aguarde 2-5 minutos e seu site estará atualizado.
echo.
echo 🔍 Acompanhe o progresso:
echo    https://github.com/SEU-USUARIO/SEU-REPOSITORIO/actions
echo.
echo 🌐 Seu site estará disponível em:
echo    https://SEU-USUARIO.github.io/SEU-REPOSITORIO/
echo.
pause
