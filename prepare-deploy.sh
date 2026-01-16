#!/bin/bash

# 🚀 Script para preparar o deploy do Edge Function
# Este script copia todos os arquivos necessários para a pasta correta

echo "📦 Preparando arquivos para deploy..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se estamos no diretório correto
if [ ! -d "supabase/functions/server" ]; then
    echo -e "${RED}❌ Erro: Pasta supabase/functions/server não encontrada!${NC}"
    echo "Execute este script a partir da raiz do projeto."
    exit 1
fi

echo -e "${BLUE}📂 Copiando arquivos de server/ para make-server-c2a25be0/${NC}"

# Copiar todos os arquivos .tsx e .ts
cp supabase/functions/server/*.tsx supabase/functions/make-server-c2a25be0/ 2>/dev/null
cp supabase/functions/server/*.ts supabase/functions/make-server-c2a25be0/ 2>/dev/null

# Copiar pasta de templates se existir
if [ -d "supabase/functions/server/email-templates" ]; then
    cp -r supabase/functions/server/email-templates supabase/functions/make-server-c2a25be0/
    echo -e "${GREEN}✅ Templates de email copiados${NC}"
fi

# Renomear index.tsx para index.ts (Supabase prefere .ts)
if [ -f "supabase/functions/make-server-c2a25be0/index.tsx" ]; then
    mv supabase/functions/make-server-c2a25be0/index.tsx supabase/functions/make-server-c2a25be0/index.ts
    echo -e "${GREEN}✅ index.tsx renomeado para index.ts${NC}"
fi

echo -e "${GREEN}✅ Todos os arquivos copiados com sucesso!${NC}"
echo ""
echo -e "${BLUE}📋 Arquivos na pasta make-server-c2a25be0:${NC}"
ls -1 supabase/functions/make-server-c2a25be0/

echo ""
echo -e "${GREEN}🚀 Pronto para deploy!${NC}"
echo ""
echo "Execute agora:"
echo -e "${BLUE}supabase functions deploy make-server-c2a25be0${NC}"
