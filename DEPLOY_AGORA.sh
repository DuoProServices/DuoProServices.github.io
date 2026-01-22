#!/bin/bash

echo "========================================"
echo "  DEPLOY DUOPRO SERVICES"
echo "  Atualizando site online..."
echo "========================================"
echo ""

echo "[1/4] Fazendo build..."
npm run build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ ERRO NO BUILD!"
    echo "Verifique os erros acima."
    exit 1
fi

echo ""
echo "[2/4] Adicionando arquivos ao Git..."
git add .

echo ""
echo "[3/4] Criando commit..."
git commit -m "Fix: Correcoes React Router e sitemap atualizado - $(date)"

echo ""
echo "[4/4] Enviando para GitHub..."
git push origin main

echo ""
echo "========================================"
echo "✅ DEPLOY COMPLETO!"
echo ""
echo "Aguarde 2-3 minutos e acesse:"
echo "https://duoproservices.github.io"
echo ""
echo "Pressione Ctrl+Shift+R no navegador"
echo "para limpar o cache e ver as mudancas"
echo "========================================"
