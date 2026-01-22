# Script para copiar TODOS os arquivos necessários para o deploy

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  COPIANDO TODOS OS ARQUIVOS DO SERVIDOR" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

$origem = "supabase\functions\server"
$destino = "supabase\functions\make-server-c2a25be0"

# Verificar se origem existe
if (-Not (Test-Path $origem)) {
    Write-Host "❌ ERRO: Pasta de origem não encontrada!" -ForegroundColor Red
    pause
    exit 1
}

# Criar pasta destino se não existir
if (-Not (Test-Path $destino)) {
    New-Item -ItemType Directory -Path $destino -Force | Out-Null
}

# Lista de arquivos para copiar
$arquivos = @(
    "index.tsx",
    "kv_store.tsx",
    "timeline.tsx",
    "messages.tsx",
    "emailTemplates.ts",
    "craAssessmentEmail.ts",
    "taxDocumentEmail.tsx",
    "stripe.tsx",
    "users.tsx",
    "roadmap.tsx",
    "fix-tax-filings.tsx",
    "initial-payment.tsx",
    "invoice-pdf.tsx",
    "stripe-webhook.tsx",
    "email-routes.tsx",
    "admin-hub.tsx",
    "contact-email.tsx",
    "admin-confirm-user.tsx",
    "crm.tsx",
    "email-service.tsx",
    "email-notifications.tsx"
)

$copiados = 0
$erros = 0

Write-Host "📋 Copiando arquivos individuais..." -ForegroundColor Cyan
Write-Host ""

foreach ($arquivo in $arquivos) {
    $src = Join-Path $origem $arquivo
    $dst = Join-Path $destino $arquivo
    
    # Renomear index.tsx para index.ts
    if ($arquivo -eq "index.tsx") {
        $dst = Join-Path $destino "index.ts"
    }
    
    if (Test-Path $src) {
        try {
            Copy-Item $src $dst -Force
            Write-Host "  ✅ $arquivo" -ForegroundColor Green
            $copiados++
        } catch {
            Write-Host "  ❌ $arquivo - ERRO: $_" -ForegroundColor Red
            $erros++
        }
    } else {
        Write-Host "  ⚠️  $arquivo - NÃO ENCONTRADO" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "📁 Copiando pasta email-templates..." -ForegroundColor Cyan

$pastaEmailTemplates = Join-Path $origem "email-templates"
if (Test-Path $pastaEmailTemplates) {
    try {
        $destEmailTemplates = Join-Path $destino "email-templates"
        
        # Criar pasta se não existir
        if (-Not (Test-Path $destEmailTemplates)) {
            New-Item -ItemType Directory -Path $destEmailTemplates -Force | Out-Null
        }
        
        # Copiar todos os arquivos da pasta
        Copy-Item "$pastaEmailTemplates\*" $destEmailTemplates -Recurse -Force
        
        $numTemplates = (Get-ChildItem $destEmailTemplates -Recurse -File).Count
        Write-Host "  ✅ Pasta email-templates copiada ($numTemplates arquivos)" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ ERRO ao copiar pasta email-templates: $_" -ForegroundColor Red
        $erros++
    }
} else {
    Write-Host "  ⚠️  Pasta email-templates não encontrada" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  RESUMO" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ✅ Arquivos copiados: $copiados" -ForegroundColor Green
Write-Host "  ❌ Erros: $erros" -ForegroundColor $(if ($erros -gt 0) { "Red" } else { "Gray" })
Write-Host ""

if ($erros -eq 0) {
    Write-Host "====================================================" -ForegroundColor Green
    Write-Host "  ✅ TODOS OS ARQUIVOS COPIADOS COM SUCESSO!" -ForegroundColor Green
    Write-Host "====================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Agora execute o deploy:" -ForegroundColor Cyan
    Write-Host "  supabase functions deploy make-server-c2a25be0" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "====================================================" -ForegroundColor Yellow
    Write-Host "  ⚠️  CONCLUÍDO COM AVISOS" -ForegroundColor Yellow
    Write-Host "====================================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Tente executar o deploy mesmo assim:" -ForegroundColor Cyan
    Write-Host "  supabase functions deploy make-server-c2a25be0" -ForegroundColor White
    Write-Host ""
}

pause
