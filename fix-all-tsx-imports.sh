#!/bin/bash

# Script para corrigir todos os imports .tsx para .ts no servidor Supabase
# Este script substitui automaticamente todas as referências de imports

echo "🔧 Corrigindo imports .tsx para .ts..."
echo ""

# Lista de substituições necessárias
declare -A replacements=(
    ["./kv_store.tsx"]="./kv_store.ts"
    ["./stripe.tsx"]="./stripe.ts"
    ["./users.tsx"]="./users.ts"
    ["./roadmap.tsx"]="./roadmap.ts"
    ["./fix-tax-filings.tsx"]="./fix-tax-filings.ts"
    ["./initial-payment.tsx"]="./initial-payment.ts"
    ["./invoice-pdf.tsx"]="./invoice-pdf.ts"
    ["./stripe-webhook.tsx"]="./stripe-webhook.ts"
    ["./email-routes.tsx"]="./email-routes.ts"
    ["./admin-hub.tsx"]="./admin-hub.ts"
    ["./contact-email.tsx"]="./contact-email.ts"
    ["./admin-confirm-user.tsx"]="./admin-confirm-user.ts"
    ["./crm.tsx"]="./crm.ts"
    ["./email-templates/index.tsx"]="./email-templates/index.ts"
)

# Função para substituir em um arquivo
fix_file() {
    local file=$1
    local changed=false
    
    for old in "${!replacements[@]}"; do
        new="${replacements[$old]}"
        
        # Verifica se o arquivo contém o import antigo
        if grep -q "$old" "$file" 2>/dev/null; then
            # Faz a substituição
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                sed -i '' "s|$old|$new|g" "$file"
            else
                # Linux
                sed -i "s|$old|$new|g" "$file"
            fi
            echo "  ✅ Corrigido: $old → $new"
            changed=true
        fi
    done
    
    if [ "$changed" = true ]; then
        return 0
    else
        return 1
    fi
}

# Processa todos os arquivos .tsx e .ts no servidor
count=0
for file in /supabase/functions/server/*.tsx /supabase/functions/server/*.ts; do
    if [ -f "$file" ]; then
        echo "📄 Verificando: $(basename "$file")"
        if fix_file "$file"; then
            ((count++))
        fi
    fi
done

# Também processa arquivos no diretório make-server-c2a25be0
for file in /supabase/functions/make-server-c2a25be0/*.tsx; do
    if [ -f "$file" ]; then
        echo "📄 Verificando: $(basename "$file")"
        if fix_file "$file"; then
            ((count++))
        fi
    fi
done

echo ""
if [ $count -gt 0 ]; then
    echo "✅ $count arquivo(s) corrigido(s)!"
else
    echo "✅ Nenhuma correção necessária - todos os imports já estão corretos!"
fi

echo ""
echo "🔍 Verificando se ainda há imports .tsx..."
remaining=$(grep -r "\.tsx['\"]" /supabase/functions/server/ 2>/dev/null | grep -v "README.md" | wc -l)

if [ $remaining -eq 0 ]; then
    echo "✅ Perfeito! Todos os imports foram corrigidos!"
else
    echo "⚠️  Ainda há $remaining import(s) com .tsx. Verifique manualmente."
fi
