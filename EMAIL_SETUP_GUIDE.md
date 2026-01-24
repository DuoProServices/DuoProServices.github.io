# 📧 Como Configurar Email para duopro@duoproservices.ca

## ✅ Status Atual
- Sistema backend com Resend **ATIVADO** ✅
- Destinatário configurado: **duopro@duoproservices.ca** ✅
- Erros corrigidos ✅

## 🔧 Como Fazer Funcionar

### Passo 1: Criar Conta no Resend (GRATUITA)

1. Acesse: https://resend.com/signup
2. Crie uma conta grátis
3. **Plano gratuito:** 3,000 emails/mês + 100 emails/dia

### Passo 2: Obter API Key

1. Faça login no Resend
2. Vá em **API Keys** (menu lateral)
3. Clique em **Create API Key**
4. Nome: `DuoPro Production`
5. Permissões: **Sending access**
6. Clique em **Add**
7. **COPIE A KEY** (começa com `re_...`)

### Passo 3: Adicionar no Supabase

1. Acesse seu projeto no Supabase: https://supabase.com/dashboard
2. Vá em **Project Settings** → **Edge Functions** → **Secrets**
3. Clique em **Add a new secret**
4. Nome: `RESEND_API_KEY`
5. Valor: Cole a key do Resend (ex: `re_abc123xyz...`)
6. Clique em **Save**

### Passo 4: Testar

1. Vá no site em https://[seu-site].com
2. Role até a seção "Contact"
3. Preencha o formulário
4. Clique em **Send Message**
5. Verifique **duopro@duoproservices.ca** 📧

---

## 🎯 O Que Acontece Agora

Quando alguém preencher o formulário de contato:

1. ✅ Email vai para: **duopro@duoproservices.ca**
2. ✅ Reply-to configurado automaticamente para o email da pessoa
3. ✅ Email HTML profissional com design bonito
4. ✅ Versão texto alternativa
5. ✅ Rate limiting: 5 emails/hora por IP (anti-spam)
6. ✅ Validação de campos obrigatórios

---

## 📋 Template do Email

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📨 Nova Mensagem de Contato
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 NOME:
John Doe

📧 EMAIL:
john@example.com

📱 TELEFONE:
(514) 123-4567

📋 ASSUNTO:
Question about tax filing

💬 MENSAGEM:
I need help with my 2024 tax return...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Recebido em: January 13, 2026, 10:30 AM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para responder, basta clicar em Reply!
```

---

## 🔍 Logs de Debug

Os logs detalhados aparecem no Console do Supabase:

```
📧 [Contact Form] Submitting form data: {...}
📧 [Contact Form] Using backend email service...
📤 [Contact Email] Sending email via Resend...
✅ [Contact Email] Email sent successfully!
📧 [Contact Email] Email ID: abc123...
```

Para ver logs:
1. Supabase Dashboard → **Edge Functions** → **Logs**
2. Procure por `Contact Email` ou `Contact Form`

---

## 🚨 Troubleshooting

### Erro: "Email service not configured"
❌ **Causa:** RESEND_API_KEY não foi adicionada no Supabase
✅ **Solução:** Siga o Passo 3 acima

### Erro: "Failed to send email"
❌ **Causa:** API Key inválida ou expirada
✅ **Solução:** Gere nova key no Resend e atualize no Supabase

### Email não chega
❌ **Causa:** Email pode estar no spam
✅ **Solução:** Verifique pasta de spam/junk
✅ **Alternativa:** Verifique logs no Resend Dashboard

### Rate limit error
❌ **Causa:** Mais de 5 envios em 1 hora do mesmo IP
✅ **Solução:** Aguarde 1 hora ou teste com outro IP/rede

---

## 💰 Custos do Resend

### Plano Gratuito (Atual)
- ✅ **3,000 emails/mês**
- ✅ **100 emails/dia**
- ✅ Perfeito para começar!
- ✅ **$0/mês**

### Plano Pro (Se precisar)
- **50,000 emails/mês**
- **10,000 emails/dia**
- Email tracking
- Webhooks
- **$20/mês**

---

## 🔄 Como Voltar para Formspree (Emergência)

Se precisar desativar temporariamente:

1. Abra: `/src/app/components/Contact.tsx`
2. Procure linha 25: `const USE_BACKEND_EMAIL = true;`
3. Mude para: `const USE_BACKEND_EMAIL = false;`
4. Emails voltarão a usar Formspree

---

## ✅ Checklist de Configuração

Antes de considerar pronto:

```
□ Conta criada no Resend
□ API Key gerada
□ API Key adicionada no Supabase (nome: RESEND_API_KEY)
□ Testei formulário de contato
□ Email chegou em duopro@duoproservices.ca
□ Reply funciona corretamente
□ Logs sem erros
```

---

## 📞 Suporte

Se tiver problemas:

1. **Logs do navegador:** F12 → Console (procure por `[Contact Form]`)
2. **Logs do servidor:** Supabase → Edge Functions → Logs
3. **Dashboard Resend:** Veja emails enviados em https://resend.com/emails

---

## 🎉 Resumo

**✅ TUDO PRONTO NO CÓDIGO!**

Só falta você:
1. Criar conta no Resend (2 minutos)
2. Copiar API key (30 segundos)
3. Adicionar no Supabase (1 minuto)

**Total: ~4 minutos para estar funcionando!** 🚀

---

## 🔐 Segurança

- ✅ API key nunca vai para o frontend
- ✅ Rate limiting contra spam
- ✅ Validação de email format
- ✅ CORS configurado corretamente
- ✅ Headers seguros
