#!/bin/bash

echo ""
echo "========================================"
echo "   LIMPEZA DO REPOSITORIO GIT"
echo "========================================"
echo ""
echo "⚠️  Este script vai:"
echo "   1. Remover arquivos do Adobe do Git"
echo "   2. Limpar cache do Git"
echo "   3. Aplicar .gitignore corretamente"
echo ""
read -p "Pressione Enter para continuar..."

echo ""
echo "🧹 Removendo arquivos do Adobe do Git..."

# Remove AppData do histórico do Git
if git rm -r --cached AppData/ 2>/dev/null; then
    echo "✅ AppData removido do Git"
else
    echo "ℹ️  AppData já estava removido ou não existe"
fi

echo ""
echo "🧹 Aplicando .gitignore..."
git rm -r --cached . 2>/dev/null
git add .

echo ""
echo "📊 Arquivos que serão commitados:"
git status --short

echo ""
echo "💾 Fazendo commit da limpeza..."
git commit -m "chore: Remove Adobe cache files and add .gitignore"

echo ""
echo "========================================"
echo "   ✅ LIMPEZA CONCLUÍDA!"
echo "========================================"
echo ""
echo "📝 Próximos passos:"
echo "   1. Execute: git push"
echo "   2. Os arquivos do Adobe não estarão mais no repositório"
echo ""
