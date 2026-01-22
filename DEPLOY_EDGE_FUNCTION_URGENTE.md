# 🚨 DEPLOY URGENTE - Edge Function não está rodando

## ⚠️ PROBLEMA IDENTIFICADO

O erro "Failed to fetch" indica que a Edge Function `make-server-c2a25be0` **NÃO ESTÁ IMPLANTADA** no Supabase.

## ✅ SOLUÇÃO IMEDIATA

### Opção 1: Deploy via Dashboard Supabase (RECOMENDADO - 2 minutos)

1. **Acesse o Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/functions
   ```

2. **Crie a Edge Function:**
   - Clique em **"Create a new function"**
   - Nome da função: `make-server-c2a25be0`
   - Clique em **"Create function"**

3. **Cole o código:**
   - Copie TODO o conteúdo do arquivo `/supabase/functions/make-server-c2a25be0/index.ts`
   - Cole no editor do Supabase Dashboard
   - Clique em **"Deploy"**

4. **Aguarde o deploy:**
   - Espere aparecer "Function deployed successfully"
   - Pode levar 10-30 segundos

5. **Teste se funcionou:**
   - Abra em uma nova aba:
     ```
     https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/health
     ```
   - Deve retornar: `{"status":"ok"}`

### Opção 2: Deploy via CLI (se você tem Supabase CLI instalado)

```bash
# 1. Fazer login no Supabase
supabase login

# 2. Link com o projeto
supabase link --project-ref pwlacumydrxvshklvttp

# 3. Deploy da função
supabase functions deploy make-server-c2a25be0
```

## 📋 ARQUIVOS QUE PRECISAM SER DEPLOYADOS

A função precisa de 3 arquivos:

1. **index.ts** (principal) - `/supabase/functions/make-server-c2a25be0/index.ts`
2. **kv_store.tsx** (dependência) - `/supabase/functions/make-server-c2a25be0/kv_store.tsx`
3. **admin-hub.tsx** (dependência) - `/supabase/functions/make-server-c2a25be0/admin-hub.tsx`
4. **timeline.tsx** (dependência) - `/supabase/functions/make-server-c2a25be0/timeline.tsx`

## 🔧 ALTERNATIVA: Deploy Manual via Dashboard

Se o método automático não funcionar:

1. Vá para: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/functions
2. Crie a função `make-server-c2a25be0`
3. Cole o código do `index.ts` no editor
4. Como o editor não suporta múltiplos arquivos, você pode:
   - **Opção A:** Instalar o Supabase CLI e fazer deploy via linha de comando
   - **Opção B:** Unir todos os arquivos em um único arquivo (menos recomendado)

## ⚡ VERIFICAÇÃO RÁPIDA

Após o deploy, teste estes endpoints no navegador:

```
1. Health Check:
https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/health

2. Admin Hub Ping:
https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/admin-hub/ping

3. Admin Hub Health:
https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/admin-hub/health
```

Todos devem retornar JSON sem erro.

## 🎯 PRÓXIMOS PASSOS

Depois que o deploy funcionar:

1. ✅ Recarregue a página `/admin/team-activity`
2. ✅ Os testes automáticos devem passar
3. ✅ As atividades devem carregar

## 💡 DICA IMPORTANTE

Se você continuar tendo problemas de "Failed to fetch", verifique:

1. **O projeto Supabase está ativo?**
   - Projetos free podem ser pausados se inativos por muito tempo
   - Vá para: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp

2. **As variáveis de ambiente estão configuradas?**
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - SUPABASE_ANON_KEY
   - SUPABASE_DB_URL

## 📞 STATUS ATUAL

- ❌ Edge Function NÃO está deployed
- ❌ Servidor não responde aos endpoints
- ✅ Código local está correto
- ✅ Frontend está configurado corretamente

**AÇÃO NECESSÁRIA:** Fazer deploy da Edge Function via Supabase Dashboard ou CLI.
