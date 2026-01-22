# Script de cópia do arquivo index.tsx para index.ts

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  COPIANDO ARQUIVO DE SERVIDOR" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Caminhos
$origem = "supabase\functions\server\index.tsx"
$destino = "supabase\functions\make-server-c2a25be0\index.ts"

# Verificar se origem existe
if (-Not (Test-Path $origem)) {
    Write-Host "❌ ERRO: Arquivo de origem não encontrado!" -ForegroundColor Red
    Write-Host "   Procurado em: $origem" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Listando conteúdo de supabase\functions\server:" -ForegroundColor Cyan
    Get-ChildItem "supabase\functions\server" | Format-Table Name, Length
    pause
    exit 1
}

Write-Host "✅ Arquivo de origem encontrado!" -ForegroundColor Green
$tamanhoOrigem = (Get-Item $origem).Length
Write-Host "   Tamanho: $tamanhoOrigem bytes" -ForegroundColor Gray
Write-Host ""

# Verificar se pasta destino existe
$pastaDestino = Split-Path $destino
if (-Not (Test-Path $pastaDestino)) {
    Write-Host "⚠️  Pasta de destino não existe! Criando..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $pastaDestino -Force | Out-Null
    Write-Host "✅ Pasta criada!" -ForegroundColor Green
    Write-Host ""
}

# Deletar destino se existir
if (Test-Path $destino) {
    Write-Host "🗑️  Deletando arquivo antigo..." -ForegroundColor Yellow
    Remove-Item $destino -Force
    Write-Host "✅ Arquivo antigo deletado!" -ForegroundColor Green
    Write-Host ""
}

# Copiar arquivo
Write-Host "📋 Copiando arquivo..." -ForegroundColor Cyan
Copy-Item $origem $destino -Force

# Verificar se copiou
if (Test-Path $destino) {
    $tamanhoDestino = (Get-Item $destino).Length
    Write-Host "✅ Arquivo copiado com sucesso!" -ForegroundColor Green
    Write-Host "   Tamanho: $tamanhoDestino bytes" -ForegroundColor Gray
    Write-Host ""
    
    if ($tamanhoOrigem -eq $tamanhoDestino) {
        Write-Host "✅ VERIFICAÇÃO: Tamanhos conferem!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  AVISO: Tamanhos diferentes!" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ ERRO: Arquivo não foi copiado!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  ✅ CÓPIA CONCLUÍDA!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Agora execute:" -ForegroundColor Cyan
Write-Host "  supabase functions deploy make-server-c2a25be0" -ForegroundColor White
Write-Host ""
pause
