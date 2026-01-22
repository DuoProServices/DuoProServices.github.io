# 🚀 INSTRUÇÕES DE DEPLOY - EDGE FUNCTION

## ⚠️ IMPORTANTE: O servidor NÃO está funcionando porque você precisa fazer o DEPLOY MANUAL!

### PASSO 1: Abrir o Supabase Dashboard
1. Abra este link no seu navegador: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/functions
2. Você deve ver a lista de Edge Functions
3. Clique na função chamada `make-server-c2a25be0`

### PASSO 2: Copiar o código MÍNIMO
1. Abra o arquivo `/supabase/functions/make-server-c2a25be0/index-minimal.ts` neste projeto
2. **COPIE TODO O CONTEÚDO** (Ctrl+A, Ctrl+C)

### PASSO 3: Substituir o código no Supabase
1. No Supabase Dashboard, você verá um editor de código
2. **APAGUE TODO O CÓDIGO ANTIGO**
3. **COLE O CÓDIGO MÍNIMO** que você copiou
4. Clique no botão **"Deploy"** (canto superior direito)
5. Aguarde aparecer "Deployment successful" (pode demorar 30-60 segundos)

### PASSO 4: Verificar se funcionou
1. Volte para a aplicação
2. Acesse a rota `/server-test`
3. Clique em "🚀 Run All Tests"
4. TODOS os testes devem ficar VERDES ✅

---

## 🔍 SE AINDA NÃO FUNCIONAR:

### Verificação 1: A função existe?
- Vá em: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/functions
- Você deve ver `make-server-c2a25be0` na lista
- Se NÃO existir, você precisa criar uma nova função com esse nome

### Verificação 2: A função está com status "Active"?
- No dashboard, ao lado do nome da função deve aparecer um círculo verde
- Se estiver vermelho/offline, clique em "Deploy" novamente

### Verificação 3: Há erros no log?
- No dashboard, clique em "Logs" (aba ao lado de "Details")
- Verifique se há mensagens de erro em vermelho
- Envie-me os erros se houver

---

## 📋 CHECKLIST:

- [ ] Abri o Supabase Dashboard
- [ ] Encontrei a função `make-server-c2a25be0`
- [ ] Copiei o conteúdo de `index-minimal.ts`
- [ ] Apaguei o código antigo no editor
- [ ] Colei o novo código
- [ ] Cliquei em "Deploy"
- [ ] Vi a mensagem "Deployment successful"
- [ ] Aguardei 60 segundos
- [ ] Testei em `/server-test`

---

## 🆘 ALTERNATIVA: Ver os logs em tempo real

Se você fez o deploy e ainda não funciona, veja os logs:

1. Acesse: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/functions/make-server-c2a25be0/logs
2. Clique em "Refresh" para atualizar
3. Procure por mensagens que começam com:
   - `🚀 [MINIMAL SERVER] Starting...`
   - `✅ [MINIMAL SERVER] All routes registered`
   - `✅ [MINIMAL SERVER] Server started successfully!`

Se você NÃO ver essas mensagens, o servidor não iniciou!
