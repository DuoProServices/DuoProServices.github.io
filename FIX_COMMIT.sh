#!/bin/bash

echo "🔧 Corrigindo erros de build..."

# Commit das correções
git add .
git commit -m "fix: Remove AdminCheckPage reference and add safety checks"
git push origin main

echo "✅ Push concluído! Aguarde 1-2 minutos para o deploy."
