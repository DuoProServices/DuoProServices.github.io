# 💳 GUIA DE CONFIGURAÇÃO DE PAGAMENTOS - STRIPE

## 📋 ÍNDICE
1. [Criar Conta Stripe](#1-criar-conta-stripe)
2. [Obter API Keys](#2-obter-api-keys)
3. [Configurar Variáveis de Ambiente](#3-configurar-variáveis-de-ambiente)
4. [Configurar Webhook](#4-configurar-webhook)
5. [Testar Pagamentos](#5-testar-pagamentos)
6. [Modo Produção](#6-modo-produção)

---

## 1️⃣ CRIAR CONTA STRIPE

### Passo 1: Registrar-se
1. Acesse: https://dashboard.stripe.com/register
2. Preencha os dados:
   - Email
   - Nome completo
   - País: **Canada**
   - Password
3. Clique em "Create account"

### Passo 2: Verificar Email
1. Abra seu email
2. Clique no link de verificação do Stripe

---

## 2️⃣ OBTER API KEYS

### Modo TESTE (Desenvolvimento)

1. Faça login no Stripe Dashboard: https://dashboard.stripe.com
2. **IMPORTANTE:** No canto superior direito, certifique-se que está em **"Test mode"** (ícone de toggle)
3. No menu lateral, clique em **"Developers"** → **"API keys"**
4. Você verá duas keys:
   - **Publishable key** (começa com `pk_test_...`)
   - **Secret key** (começa com `sk_test_...`) - Clique em "Reveal test key"

### ⚠️ NUNCA compartilhe a Secret Key!

---

## 3️⃣ CONFIGURAR VARIÁVEIS DE AMBIENTE

### Opção A: Via Supabase Dashboard (RECOMENDADO)

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Menu lateral → **"Edge Functions"** → **"Settings"**
4. Vá para a aba **"Secrets"**
5. Adicione:
   ```
   STRIPE_SECRET_KEY = sk_test_...sua_key_aqui...
   ```
6. Clique em "Save"

### Opção B: Via Código (temporário - APENAS para teste local)

**Arquivo:** `/supabase/functions/server/stripe.tsx`

⚠️ **ATENÇÃO:** Nunca commite a secret key no código!

```typescript
// APENAS PARA TESTE LOCAL - REMOVER DEPOIS
const STRIPE_SECRET_KEY = 'sk_test_...';
```

---

## 4️⃣ CONFIGURAR WEBHOOK

### Por que o Webhook?
O webhook permite que o Stripe **automaticamente** notifique nosso sistema quando um pagamento for concluído, marcando o invoice como PAID.

### Opção A: Webhook em PRODUÇÃO

1. Acesse: https://dashboard.stripe.com/webhooks
2. Clique em **"Add endpoint"**
3. **Endpoint URL:**
   ```
   https://[SEU_PROJECT_ID].supabase.co/functions/v1/make-server-c2a25be0/stripe/webhook
   ```
   
   **Como encontrar o PROJECT_ID:**
   - Vá em Supabase Dashboard
   - URL será: `https://supabase.com/dashboard/project/[PROJECT_ID]`
   - Copie o PROJECT_ID

4. **Events to send:** Clique em "Select events" e escolha:
   - ✅ `checkout.session.completed`

5. Clique em **"Add endpoint"**

6. **IMPORTANTE:** Copie o **"Signing secret"** (começa com `whsec_...`)

7. Adicione no Supabase Edge Functions Secrets:
   ```
   STRIPE_WEBHOOK_SECRET = whsec_...
   ```

### Opção B: Webhook LOCAL (Teste - Stripe CLI)

Para testar localmente:

1. Instale Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows
   scoop install stripe
   
   # Linux
   # Veja: https://stripe.com/docs/stripe-cli
   ```

2. Login:
   ```bash
   stripe login
   ```

3. Forward webhooks para localhost:
   ```bash
   stripe listen --forward-to http://localhost:54321/functions/v1/make-server-c2a25be0/stripe/webhook
   ```

4. Copie o webhook secret que aparece (começa com `whsec_...`)

---

## 5️⃣ TESTAR PAGAMENTOS

### Cartões de Teste do Stripe

Use estes cartões em **Test Mode**:

| Cenário | Número do Cartão | CVV | Data |
|---------|------------------|-----|------|
| ✅ Sucesso | `4242 4242 4242 4242` | Qualquer 3 dígitos | Qualquer data futura |
| ❌ Falha | `4000 0000 0000 0002` | Qualquer | Qualquer futura |
| 🔐 Requer autenticação | `4000 0025 0000 3155` | Qualquer | Qualquer futura |

### Passo a Passo para Testar:

1. **Login no sistema** como cliente
2. Vá para **Dashboard** → Selecione um Tax Filing
3. **Upload de documentos** (T4, Relevé 1, etc.)
4. Clique em **"Submit Documents & Pay $50"**
5. Será redirecionado para Stripe Checkout
6. Use o cartão de teste: **4242 4242 4242 4242**
7. Preencha:
   - Email: qualquer@email.com
   - CVV: 123
   - Data: 12/30
   - Nome: Test User
8. Clique em **"Pay"**
9. Você será redirecionado de volta com sucesso
10. **Verifique:**
    - Invoice foi criado
    - Status mudou para "Paid"
    - Documentos foram submetidos

### Verificar Logs:

**No Supabase:**
1. Dashboard → Edge Functions → Logs
2. Procure por:
   - `✅ Invoice created`
   - `💳 Payment successful`
   - `✅ Invoice marked as PAID`

**No Stripe:**
1. Dashboard → Developers → Webhooks
2. Clique no endpoint
3. Veja "Recent deliveries"
4. Status deve ser: ✅ **200 OK**

---

## 6️⃣ MODO PRODUÇÃO

### Ativar Conta Stripe

Antes de aceitar pagamentos reais:

1. **Complete o onboarding:**
   - Dashboard → Settings → Account details
   - Preencha informações da empresa
   - Adicione informações bancárias
   - Verifique identidade

2. **Obtenha as keys de PRODUÇÃO:**
   - Dashboard → Developers → API keys
   - **Desative "Test mode"** (toggle no topo)
   - Copie as novas keys:
     - `pk_live_...` (Publishable)
     - `sk_live_...` (Secret)

3. **Atualize as variáveis:**
   ```
   STRIPE_SECRET_KEY = sk_live_...sua_key_de_produção...
   ```

4. **Configure webhook de PRODUÇÃO:**
   - Repita o passo 4 com as keys live
   - Use o mesmo endpoint URL
   - Copie o novo `whsec_...` de produção

### ⚠️ CHECKLIST PRÉ-LANÇAMENTO:

- [ ] Conta Stripe ativada e verificada
- [ ] Informações bancárias adicionadas
- [ ] Keys de produção configuradas
- [ ] Webhook de produção configurado e testado
- [ ] Testado pagamento real com cartão verdadeiro
- [ ] Logs funcionando corretamente
- [ ] Invoice gerado corretamente
- [ ] Email de confirmação enviado (se configurado)

---

## 🆘 TROUBLESHOOTING

### Problema: "Stripe is not configured"

**Solução:**
1. Verifique se `STRIPE_SECRET_KEY` está configurada
2. Confira se não tem espaços antes/depois da key
3. Reinicie o Edge Function

### Problema: Invoice não marca como "Paid"

**Solução:**
1. Verifique se webhook está configurado
2. Confira logs do webhook no Stripe Dashboard
3. Certifique-se que `invoiceNumber` está nos metadados

### Problema: Erro 401 "Unauthorized"

**Solução:**
1. Verifique se está logado
2. Confira se o token de sessão não expirou
3. Tente fazer logout e login novamente

### Problema: Pagamento aceito mas sistema não atualiza

**Solução:**
1. Verifique logs do webhook
2. Manualmente marque como pago em `/admin/invoices`
3. Ou use a rota `/payment/verify` com o sessionId

---

## 📞 SUPORTE

**Documentação Stripe:**
- https://stripe.com/docs

**Suporte Stripe:**
- https://support.stripe.com

**Dashboard Stripe:**
- https://dashboard.stripe.com

---

## 🎉 PRONTO!

Seu sistema de pagamentos está configurado e funcionando!

**Próximos passos:**
1. Testar com cartões de teste
2. Configurar emails de confirmação
3. Adicionar invoices finais
4. Ativar modo produção
