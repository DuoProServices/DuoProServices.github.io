#!/bin/bash

echo "🚀 DEPLOY PARA GITHUB PAGES"
echo "==========================="
echo ""

# Verifica se está no git
if [ ! -d .git ]; then
    echo "❌ Erro: Este não é um repositório Git."
    echo "💡 Execute primeiro: git init"
    exit 1
fi

echo "📦 Preparando deploy..."
echo ""

# Add todas as mudanças
git add .

# Pede mensagem de commit
echo "📝 Digite a mensagem do commit (ou pressione Enter para usar padrão):"
read commit_message

if [ -z "$commit_message" ]; then
    commit_message="Deploy $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Faz commit
git commit -m "$commit_message"

# Pega o branch atual
current_branch=$(git branch --show-current)

# Push
echo ""
echo "🚀 Fazendo push para GitHub..."
git push origin $current_branch

echo ""
echo "✅ DEPLOY INICIADO!"
echo ""
echo "📊 Acompanhe o progresso:"
echo "   → Vá para: https://github.com/SEU-USUARIO/SEU-REPO/actions"
echo ""
echo "🌐 Após 2-5 minutos, seu site estará online em:"
echo "   → https://SEU-USUARIO.github.io/SEU-REPO/"
echo ""
echo "💡 Dica: Pressione Ctrl+Shift+R no navegador para limpar cache!"
echo ""
