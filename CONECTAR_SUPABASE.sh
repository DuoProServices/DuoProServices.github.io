#!/bin/bash

echo "🔗 ====================================="
echo "   CONECTAR PROJETO AO SUPABASE"
echo "===================================== 🔗"
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se Supabase CLI está instalado
echo "📦 Verificando Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    echo ""
    echo -e "${RED}❌ Supabase CLI não encontrado!${NC}"
    echo ""
    echo "📥 Instalando Supabase CLI..."
    echo ""
    
    # Detectar sistema operacional
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        echo "🍎 Detectado: macOS"
        if command -v brew &> /dev/null; then
            brew install supabase/tap/supabase
        else
            echo -e "${RED}❌ Homebrew não encontrado. Instale em: https://brew.sh${NC}"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        echo "🐧 Detectado: Linux"
        curl -fsSL https://raw.githubusercontent.com/supabase/cli/main/install.sh | sh
    else
        # Windows (Git Bash, WSL, etc)
        echo "🪟 Detectado: Windows"
        echo "Por favor, instale manualmente:"
        echo "https://supabase.com/docs/guides/cli/getting-started#installing-the-supabase-cli"
        exit 1
    fi
    
    echo ""
    echo -e "${GREEN}✅ Supabase CLI instalado!${NC}"
else
    echo -e "${GREEN}✅ Supabase CLI já instalado${NC}"
fi

echo ""
echo "🔐 ====================================="
echo "   PASSO 1: LOGIN NO SUPABASE"
echo "===================================== 🔐"
echo ""

echo "Isso vai abrir o navegador para você fazer login..."
echo ""
read -p "Pressione ENTER para continuar..."

supabase login

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Erro ao fazer login${NC}"
    echo ""
    echo "💡 Tente fazer login manualmente:"
    echo "   supabase login"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Login realizado com sucesso!${NC}"

echo ""
echo "🔗 ====================================="
echo "   PASSO 2: CONECTAR AO PROJETO"
echo "===================================== 🔗"
echo ""

# Ler o Project ID do arquivo info.tsx
PROJECT_ID=$(grep -oP "projectId\s*=\s*['\"].*?pwlacumydrxvshklvttp['\"]" utils/supabase/info.tsx | grep -oP 'pwlacumydrxvshklvttp')

if [ -z "$PROJECT_ID" ]; then
    # Tentar caminho alternativo
    PROJECT_ID=$(grep -oP "projectId\s*=\s*['\"].*?pwlacumydrxvshklvttp['\"]" ../utils/supabase/info.tsx | grep -oP 'pwlacumydrxvshklvttp')
fi

if [ -z "$PROJECT_ID" ]; then
    echo -e "${YELLOW}⚠️  Não consegui detectar o Project ID automaticamente${NC}"
    echo ""
    echo "Por favor, digite o Project ID manualmente:"
    echo "(Você pode encontrar em: Supabase Dashboard > Settings > General > Reference ID)"
    echo ""
    read -p "Project ID: " PROJECT_ID
else
    echo -e "${BLUE}📋 Project ID detectado: ${GREEN}$PROJECT_ID${NC}"
fi

echo ""
echo "Conectando ao projeto $PROJECT_ID..."
echo ""

# Criar pasta .supabase se não existir
mkdir -p .supabase

# Fazer o link
supabase link --project-ref $PROJECT_ID

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Erro ao conectar ao projeto${NC}"
    echo ""
    echo "💡 Tente conectar manualmente:"
    echo "   supabase link --project-ref $PROJECT_ID"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Projeto conectado com sucesso!${NC}"

echo ""
echo "🎉 ====================================="
echo "   CONEXÃO CONCLUÍDA!"
echo "===================================== 🎉"
echo ""
echo -e "${GREEN}✅ Tudo pronto!${NC}"
echo ""
echo "📋 Próximos passos:"
echo "   1. Execute: ./DEPLOY_AGORA.sh"
echo "   2. Ou manualmente: supabase functions deploy server"
echo ""
echo "🔍 Para verificar a conexão:"
echo "   supabase projects list"
echo ""

# Verificar conexão
echo "🔍 Verificando conexão..."
supabase projects list

echo ""
echo -e "${GREEN}🚀 Pronto para fazer deploy!${NC}"
echo ""
