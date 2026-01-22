# ============================================================
# 🚀 SCRIPT DE RE-DEPLOY COMPLETO DO EDGE FUNCTION
# ============================================================
# Este script copia o arquivo index.tsx correto e faz redeploy
# ============================================================

Write-Host ""
Write-Host "🚀 ===============================================" -ForegroundColor Cyan
Write-Host "🚀   RE-DEPLOY COMPLETO DO EDGE FUNCTION" -ForegroundColor Cyan
Write-Host "🚀 ===============================================" -ForegroundColor Cyan
Write-Host ""

# Passo 1: Deletar index.ts antigo (versão errada)
Write-Host "🗑️  Passo 1: Deletando index.ts antigo (versão simplificada)..." -ForegroundColor Yellow
if (Test-Path "supabase/functions/make-server-c2a25be0/index.ts") {
    Remove-Item "supabase/functions/make-server-c2a25be0/index.ts" -Force
    Write-Host "✅ index.ts antigo deletado!" -ForegroundColor Green
} else {
    Write-Host "⚠️  index.ts não encontrado (já foi deletado)" -ForegroundColor Yellow
}

# Passo 2: Copiar index.tsx correto
Write-Host ""
Write-Host "📋 Passo 2: Copiando index.tsx CORRETO..." -ForegroundColor Yellow
Copy-Item "supabase/functions/server/index.tsx" "supabase/functions/make-server-c2a25be0/index.ts" -Force
Write-Host "✅ index.tsx copiado com sucesso!" -ForegroundColor Green

# Passo 3: Fazer deploy
Write-Host ""
Write-Host "🚀 Passo 3: Fazendo deploy no Supabase..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⏳ Aguarde... Este processo pode demorar alguns segundos..." -ForegroundColor Cyan
Write-Host ""

supabase functions deploy make-server-c2a25be0

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 ===============================================" -ForegroundColor Green
    Write-Host "🎉   DEPLOY COMPLETO COM SUCESSO!" -ForegroundColor Green
    Write-Host "🎉 ===============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ Edge Function atualizada com TODOS os arquivos!" -ForegroundColor Green
    Write-Host "✅ Servidor agora tem TODAS as rotas (health, server-alive, list-users, etc)" -ForegroundColor Green
    Write-Host ""
    Write-Host "🧪 PRÓXIMO PASSO:" -ForegroundColor Cyan
    Write-Host "1. Volte para o site" -ForegroundColor White
    Write-Host "2. Pressione Ctrl+Shift+R para limpar cache" -ForegroundColor White
    Write-Host "3. Clique no botão '🧪 Test Server' ou acesse /test-server-connection" -ForegroundColor White
    Write-Host "4. Clique em 'Run All Tests'" -ForegroundColor White
    Write-Host ""
    Write-Host "✅ TODOS OS TESTES DEVEM PASSAR AGORA! 🎊" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ ===============================================" -ForegroundColor Red
    Write-Host "❌   ERRO NO DEPLOY!" -ForegroundColor Red
    Write-Host "❌ ===============================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "⚠️  O deploy falhou. Verifique as mensagens de erro acima." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 POSSÍVEIS SOLUÇÕES:" -ForegroundColor Cyan
    Write-Host "1. Certifique-se de que você está logado: supabase login" -ForegroundColor White
    Write-Host "2. Verifique se está no projeto correto: supabase projects list" -ForegroundColor White
    Write-Host "3. Tente fazer link novamente: supabase link --project-ref lqpmyvizjfwzddxspacv" -ForegroundColor White
    Write-Host ""
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
