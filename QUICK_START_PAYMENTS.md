# ⚡ QUICK START - CONFIGURAÇÃO DE PAGAMENTOS

## 🚀 3 PASSOS PARA ATIVAR OS PAGAMENTOS

### ✅ PASSO 1: OBTER CHAVE DO STRIPE (2 minutos)

1. **Crie conta grátis:** https://dashboard.stripe.com/register
2. **Ative "Test Mode"** (toggle no canto superior direito)
3. **Copie a Secret Key:**
   - Menu: **Developers** → **API keys**
   - Clique em **"Reveal test key"**
   - Copie a chave que começa com `sk_test_...`

---

### ✅ PASSO 2: ADICIONAR NO SUPABASE (1 minuto)

1. **Abra:** https://supabase.com/dashboard
2. **Selecione seu projeto**
3. **Menu:** Edge Functions → Settings → **Secrets**
4. **Adicione:**
   ```
   Nome: STRIPE_SECRET_KEY
   Valor: sk_test_...sua_chave_aqui...
   ```
5. **Clique em "Save"**

---

### ✅ PASSO 3: TESTAR (30 segundos)

1. **Acesse:** `/admin/payment-setup`
2. **Clique:** "Run Full Test"
3. **Se tudo OK:** ✅ Todos os testes verdes!

---

## 🎯 PRONTO! AGORA VOCÊ PODE:

✅ Aceitar pagamentos de clientes  
✅ Gerar invoices automaticamente  
✅ Processar $50 CAD iniciais  
✅ Ver histórico em `/admin/invoices`

---

## 🧪 TESTAR PAGAMENTO COMPLETO

1. **Login como cliente**
2. **Dashboard** → Selecione Tax Filing
3. **Upload documentos**
4. **Clique "Submit & Pay $50"**
5. **Use cartão de teste:**
   ```
   Número: 4242 4242 4242 4242
   CVV: 123
   Data: 12/30
   ```
6. **Confirme pagamento** ✅
7. **Verifique invoice criado!** 🎉

---

## 🔧 WEBHOOK (OPCIONAL - para auto-marcar como pago)

Se quiser que o sistema **automaticamente** marque invoices como pagos:

1. **Stripe Dashboard:** https://dashboard.stripe.com/webhooks
2. **Add endpoint:**
   ```
   URL: https://[PROJECT_ID].supabase.co/functions/v1/make-server-c2a25be0/stripe/webhook
   ```
3. **Evento:** `checkout.session.completed`
4. **Copie:** Signing secret (`whsec_...`)
5. **Adicione no Supabase Secrets:**
   ```
   STRIPE_WEBHOOK_SECRET = whsec_...
   ```

---

## 📊 ONDE VER TUDO FUNCIONANDO

### Cliente:
- **Portal:** `/dashboard`
- **Invoices:** `/client/invoices`

### Admin:
- **Todos Invoices:** `/admin/invoices`
- **Configuração:** `/admin/payment-setup`
- **Financeiro:** `/admin/financial-dashboard`

---

## 🆘 PROBLEMAS?

### ❌ Erro "Stripe not configured"
→ Verifique se `STRIPE_SECRET_KEY` está salva no Supabase

### ❌ Pagamento não marca como "Paid"
→ Configure o webhook (passo opcional acima)

### ❌ Invoice não gerado
→ Vá em `/admin/payment-setup` e rode "Run Full Test"

---

## 📞 CARTÕES DE TESTE

| Tipo | Número | Resultado |
|------|--------|-----------|
| ✅ Sucesso | `4242 4242 4242 4242` | Pago |
| ❌ Falha | `4000 0000 0000 0002` | Recusado |
| 🔐 3D Secure | `4000 0025 0000 3155` | Requer Auth |

**Qualquer CVV e data futura funciona!**

---

## 🎉 É ISSO!

Seu sistema de pagamentos está **100% funcional**!

Dúvidas? Veja o guia completo em `/PAYMENT_SETUP_GUIDE.md`
