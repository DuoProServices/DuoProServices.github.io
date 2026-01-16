#!/bin/bash

# 🚀 SCRIPT DE DEPLOY RÁPIDO DO BACKEND
# Este script faz o deploy do Edge Function para o Supabase

echo "════════════════════════════════════════════════════════"
echo "🚀 DEPLOY DO BACKEND - DuoProServices"
echo "════════════════════════════════════════════════════════"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null
then
    echo -e "${RED}❌ Supabase CLI não está instalado!${NC}"
    echo ""
    echo -e "${YELLOW}📦 Instale com:${NC}"
    echo "brew install supabase/tap/supabase"
    echo ""
    echo "Ou visite: https://supabase.com/docs/guides/cli"
    exit 1
fi

echo -e "${GREEN}✅ Supabase CLI encontrado${NC}"
echo ""

# Verificar se está logado
echo "🔐 Verificando autenticação..."
if ! supabase projects list &> /dev/null
then
    echo -e "${YELLOW}⚠️  Você não está logado no Supabase${NC}"
    echo ""
    echo "Executando: supabase login"
    supabase login
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Falha no login${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Autenticado com sucesso${NC}"
echo ""

# Project ID (extraído do arquivo info.tsx)
PROJECT_ID="pwlacumydrxvshklvttp"

# Verificar se já está linked
echo "🔗 Verificando conexão com o projeto..."
if [ ! -f ".supabase/config.toml" ]; then
    echo -e "${YELLOW}⚠️  Projeto não está linked${NC}"
    echo ""
    echo "Executando: supabase link --project-ref $PROJECT_ID"
    supabase link --project-ref $PROJECT_ID
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Falha ao fazer link do projeto${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Projeto conectado${NC}"
echo ""

# Deploy da Edge Function
echo "════════════════════════════════════════════════════════"
echo "🚀 FAZENDO DEPLOY DA EDGE FUNCTION..."
echo "════════════════════════════════════════════════════════"
echo ""

supabase functions deploy server --no-verify-jwt

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════════════"
    echo -e "${GREEN}🎉 DEPLOY CONCLUÍDO COM SUCESSO!${NC}"
    echo "════════════════════════════════════════════════════════"
    echo ""
    echo -e "${BLUE}📝 Próximos passos:${NC}"
    echo ""
    echo "1. ✅ Recarregue seu aplicativo web"
    echo "2. ✅ Os erros 'Failed to fetch' desaparecerão"
    echo "3. ✅ Teste a página: /test-backend"
    echo ""
    echo "Endpoint do servidor:"
    echo -e "${GREEN}https://$PROJECT_ID.supabase.co/functions/v1/make-server-c2a25be0/${NC}"
    echo ""
else
    echo ""
    echo "════════════════════════════════════════════════════════"
    echo -e "${RED}❌ ERRO NO DEPLOY${NC}"
    echo "════════════════════════════════════════════════════════"
    echo ""
    echo "Possíveis soluções:"
    echo "1. Verifique sua conexão com a internet"
    echo "2. Confirme que o Project ID está correto"
    echo "3. Tente fazer login novamente: supabase login"
    echo "4. Verifique os logs acima para mais detalhes"
    echo ""
    exit 1
fi
