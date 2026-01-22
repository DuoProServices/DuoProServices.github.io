#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   🚀 DEPLOY DUOPRO SERVICES - GITHUB PAGES 🚀            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se Git está instalado
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git não está instalado!${NC}"
    echo "Por favor, instale o Git primeiro: https://git-scm.com/"
    exit 1
fi

echo -e "${BLUE}📋 PASSO 1: Verificando Git...${NC}"

# Verificar se já é um repositório Git
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Não é um repositório Git. Inicializando...${NC}"
    git init
    echo -e "${GREEN}✅ Repositório Git inicializado!${NC}"
else
    echo -e "${GREEN}✅ Repositório Git já existe!${NC}"
fi

echo ""
echo -e "${BLUE}📋 PASSO 2: Adicionar arquivos ao Git...${NC}"

# Adicionar todos os arquivos
git add .

echo -e "${GREEN}✅ Arquivos adicionados!${NC}"

echo ""
echo -e "${BLUE}📋 PASSO 3: Criar commit...${NC}"

# Criar commit
git commit -m "Deploy: DuoPro Services - $(date '+%Y-%m-%d %H:%M:%S')"

echo -e "${GREEN}✅ Commit criado!${NC}"

echo ""
echo -e "${YELLOW}⚠️  ATENÇÃO:${NC}"
echo ""
echo "Se este é o PRIMEIRO deploy, você precisa:"
echo ""
echo "1. Criar um repositório no GitHub: https://github.com/new"
echo "2. Copiar a URL do repositório (ex: https://github.com/seu-usuario/duopro-services.git)"
echo "3. Executar:"
echo ""
echo -e "${BLUE}   git remote add origin https://github.com/SEU-USUARIO/duopro-services.git${NC}"
echo -e "${BLUE}   git branch -M main${NC}"
echo -e "${BLUE}   git push -u origin main${NC}"
echo ""
echo "Se você JÁ configurou o remote, apenas execute:"
echo ""
echo -e "${BLUE}   git push${NC}"
echo ""
echo -e "${GREEN}✅ Arquivos preparados para deploy!${NC}"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   📖 PRÓXIMOS PASSOS:                                      ║"
echo "╠════════════════════════════════════════════════════════════╣"
echo "║   1. Configure o remote (se primeiro deploy)               ║"
echo "║   2. Execute: git push                                     ║"
echo "║   3. No GitHub: Settings → Pages → Source: GitHub Actions  ║"
echo "║   4. Aguarde o deploy (2-3 minutos)                        ║"
echo "║   5. Acesse: https://SEU-USUARIO.github.io/REPO/           ║"
echo "╚════════════════════════════════════════════════════════════╝"
