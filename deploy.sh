#!/bin/bash

# 🚀 Script de Deploy Rápido para GitHub Pages
# Este script facilita o processo de deploy

echo "🚀 DuoPro Services - Deploy Script"
echo "===================================="
echo ""

# Verifica se há mudanças
if [[ -z $(git status -s) ]]; then
  echo "⚠️  Nenhuma mudança detectada para fazer commit."
  echo ""
  read -p "Deseja fazer deploy mesmo assim? (y/n) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deploy cancelado."
    exit 1
  fi
fi

# Pede mensagem de commit
echo "📝 Digite a mensagem do commit:"
read -r commit_message

# Se não digitou mensagem, usa padrão
if [[ -z "$commit_message" ]]; then
  commit_message="chore: atualização geral"
  echo "📝 Usando mensagem padrão: $commit_message"
fi

echo ""
echo "⏳ Iniciando deploy..."
echo ""

# 1. Build local para verificar erros
echo "1️⃣ Testando build local..."
npm run build

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ ERRO: Build falhou!"
  echo "   Corrija os erros acima antes de fazer deploy."
  exit 1
fi

echo "✅ Build local OK!"
echo ""

# 2. Git add
echo "2️⃣ Adicionando arquivos ao Git..."
git add .
echo "✅ Arquivos adicionados!"
echo ""

# 3. Git commit
echo "3️⃣ Fazendo commit..."
git commit -m "$commit_message"
echo "✅ Commit feito!"
echo ""

# 4. Git push
echo "4️⃣ Enviando para GitHub..."
git push origin main

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ ERRO: Push falhou!"
  echo "   Verifique sua conexão com o GitHub."
  exit 1
fi

echo "✅ Push concluído!"
echo ""
echo "================================================"
echo "🎉 Deploy iniciado com sucesso!"
echo "================================================"
echo ""
echo "O GitHub Actions está processando o deploy."
echo "Aguarde 2-5 minutos e seu site estará atualizado."
echo ""
echo "🔍 Acompanhe o progresso:"
echo "   https://github.com/SEU-USUARIO/SEU-REPOSITORIO/actions"
echo ""
echo "🌐 Seu site estará disponível em:"
echo "   https://SEU-USUARIO.github.io/SEU-REPOSITORIO/"
echo ""
