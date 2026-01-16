# ============================================================
#   SCRIPT DE CÓPIA FORÇADA E DEPLOY
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  FORÇANDO CÓPIA DO ARQUIVO COMPLETO" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Definir caminhos
$sourceFile = "supabase\functions\server\index.tsx"
$destFile = "supabase\functions\make-server-c2a25be0\index.ts"

# Verificar se o arquivo fonte existe
if (-Not (Test-Path $sourceFile)) {
    Write-Host "❌ ERRO: Arquivo fonte não encontrado!" -ForegroundColor Red
    Write-Host "   Esperado em: $sourceFile" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✅ Arquivo fonte encontrado!" -ForegroundColor Green
Write-Host "   Tamanho: $((Get-Item $sourceFile).Length) bytes" -ForegroundColor Gray
Write-Host ""

# Deletar arquivo destino se existir
if (Test-Path $destFile) {
    Write-Host "🗑️  Deletando arquivo antigo..." -ForegroundColor Yellow
    Remove-Item $destFile -Force
    Write-Host "✅ Arquivo antigo deletado!" -ForegroundColor Green
    Write-Host ""
}

# Copiar arquivo
Write-Host "📋 Copiando arquivo completo..." -ForegroundColor Cyan
try {
    Copy-Item $sourceFile $destFile -Force
    Write-Host "✅ Arquivo copiado com sucesso!" -ForegroundColor Green
    Write-Host "   Tamanho: $((Get-Item $destFile).Length) bytes" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ ERRO ao copiar arquivo:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
    pause
    exit 1
}

# Verificar se a cópia foi bem sucedida
$sourceSize = (Get-Item $sourceFile).Length
$destSize = (Get-Item $destFile).Length

if ($sourceSize -eq $destSize) {
    Write-Host "✅ VERIFICAÇÃO OK: Tamanhos são iguais!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "⚠️  AVISO: Tamanhos diferentes!" -ForegroundColor Yellow
    Write-Host "   Fonte: $sourceSize bytes" -ForegroundColor Gray
    Write-Host "   Destino: $destSize bytes" -ForegroundColor Gray
    Write-Host ""
}

# Fazer deploy
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  FAZENDO DEPLOY NO SUPABASE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🚀 Executando: supabase functions deploy make-server-c2a25be0" -ForegroundColor Cyan
Write-Host ""

$deployOutput = supabase functions deploy make-server-c2a25be0 2>&1

# Mostrar output do deploy
$deployOutput | ForEach-Object {
    if ($_ -match "error|failed") {
        Write-Host $_ -ForegroundColor Red
    } elseif ($_ -match "success|deployed") {
        Write-Host $_ -ForegroundColor Green
    } else {
        Write-Host $_
    }
}

Write-Host ""

# Verificar se deploy foi bem sucedido
if ($LASTEXITCODE -eq 0) {
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "  ✅ DEPLOY COMPLETO COM SUCESSO!" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Abra o arquivo: TESTE-BACKEND-FINAL.html" -ForegroundColor White
    Write-Host "2. Ou acesse: http://localhost:5173/test-server-connection" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "============================================================" -ForegroundColor Red
    Write-Host "  ❌ ERRO NO DEPLOY!" -ForegroundColor Red
    Write-Host "============================================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Tente executar manualmente:" -ForegroundColor Yellow
    Write-Host "  supabase functions deploy make-server-c2a25be0 --debug" -ForegroundColor White
    Write-Host ""
}

pause
