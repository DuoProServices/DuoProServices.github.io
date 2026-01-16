# 📧 GUIA DE INTEGRAÇÃO DE EMAIL - DuoProServices

## ✅ Sistema de Email Completo Instalado!

Todos os 5 templates de email estão prontos em inglês e francês:
- ✅ Welcome Email
- ✅ Payment Confirmation Email
- ✅ Invoice Email
- ✅ Tax Return Completed Email
- ✅ Reminder Email

---

## 🚀 PASSOS PARA ATIVAR O SISTEMA

### **PASSO 1: Criar Conta no Resend** (100% GRÁTIS)

1. Acesse: https://resend.com/signup
2. Crie sua conta (pode usar o Gmail/GitHub)
3. **Plano gratuito:** 3.000 emails/mês para sempre! 🎉

---

### **PASSO 2: Obter API Key do Resend**

1. Faça login no Resend
2. Vá para: **API Keys** (https://resend.com/api-keys)
3. Clique em **"Create API Key"**
4. Nome: `DuoProServices Production`
5. Permissões: **"Sending access"**
6. Clique em **"Create"**
7. ⚠️ **COPIE A API KEY** (ela só aparece uma vez!)
   - Formato: `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### **PASSO 3: Configurar API Key no Supabase**

1. Vá para o **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral: **Settings** → **Edge Functions**
4. Na seção **"Secrets"**, clique em **"Add new secret"**
5. Configure:
   - **Name:** `RESEND_API_KEY`
   - **Value:** Cole a API key que você copiou (começa com `re_`)
6. Clique em **"Save"**

---

### **PASSO 4: Configurar Domínio de Email (OPCIONAL MAS RECOMENDADO)**

#### **Opção A: Usar domínio próprio** (Recomendado - Profissional)

Se você tem o domínio `duoproservices.com`:

1. No Resend, vá para: **Domains** (https://resend.com/domains)
2. Clique em **"Add Domain"**
3. Digite: `duoproservices.com`
4. Siga as instruções para adicionar os **registros DNS**:
   - **SPF** (TXT)
   - **DKIM** (TXT)
   - **DMARC** (TXT)
5. Aguarde verificação (pode levar até 72h, mas geralmente é rápido)
6. Após verificado, seus emails serão enviados de: `noreply@duoproservices.com`

#### **Opção B: Usar domínio de teste do Resend** (Para testar agora)

- Você pode enviar emails de teste usando: `onboarding@resend.dev`
- **ATENÇÃO:** Emails de teste só chegam para o seu próprio email cadastrado
- Ótimo para testar, mas não serve para produção!

---

### **PASSO 5: Atualizar Configurações de Email no Código**

Edite o arquivo: `/supabase/functions/server/email-service.tsx`

Procure esta seção (linha ~14):

```typescript
// Email configuration
const FROM_EMAIL = 'DuoProServices <noreply@duoproservices.com>';
const SUPPORT_EMAIL = 'support@duoproservices.com';
const PHONE = '+1 (XXX) XXX-XXXX'; // TODO: Replace with actual phone
```

**Substitua por:**

```typescript
// Email configuration
const FROM_EMAIL = 'DuoProServices <noreply@duoproservices.com>'; // Ou seu domínio verificado
const SUPPORT_EMAIL = 'duoproservices.info@gmail.com'; // Email de suporte real
const PHONE = '+1 (XXX) XXX-XXXX'; // Seu telefone real
```

---

### **PASSO 6: Configurar APP_URL**

Você também precisa configurar a URL do seu app no Supabase:

1. Vá para: **Supabase Dashboard** → **Settings** → **Edge Functions**
2. Na seção **"Secrets"**, clique em **"Add new secret"**
3. Configure:
   - **Name:** `APP_URL`
   - **Value:** `https://seu-app.com` (URL do seu app de produção)
4. Clique em **"Save"**

**Para desenvolvimento local:** use `http://localhost:5173` ou a URL do Figma Make

---

## 🧪 PASSO 7: TESTAR O SISTEMA

Agora você pode testar se está funcionando!

### **Teste 1: Email de Teste Simples**

Use a ferramenta de API (Postman, Insomnia, ou fetch do navegador):

```bash
curl -X POST https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-c2a25be0/emails/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_ANON_KEY" \
  -d '{"email":"seu-email@gmail.com"}'
```

**Substitua:**
- `SEU_PROJECT_ID` pelo ID do seu projeto Supabase
- `SEU_ANON_KEY` pela sua chave pública (anon key)
- `seu-email@gmail.com` pelo seu email

Se funcionar, você receberá um email de teste! ✅

---

### **Teste 2: Email de Boas-Vindas**

```bash
curl -X POST https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-c2a25be0/emails/welcome \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_ANON_KEY" \
  -d '{
    "email": "seu-email@gmail.com",
    "name": "João Silva",
    "language": "en"
  }'
```

Você receberá o email de boas-vindas completo! 🎉

---

### **Teste 3: Email de Confirmação de Pagamento**

```bash
curl -X POST https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-c2a25be0/emails/payment-confirmation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_ANON_KEY" \
  -d '{
    "email": "seu-email@gmail.com",
    "name": "João Silva",
    "language": "en",
    "invoiceNumber": "0001",
    "amount": 50,
    "currency": "CAD",
    "taxYear": 2026,
    "paymentDate": "2025-01-07T10:30:00Z",
    "paymentType": "initial"
  }'
```

---

## 🔌 INTEGRAR NO FLUXO DO APP

Agora você pode chamar os emails em momentos específicos:

### **1. Email de Boas-Vindas (após signup)**

No frontend, após o usuário se cadastrar:

```typescript
// Após signup bem-sucedido
const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/emails/welcome`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`
  },
  body: JSON.stringify({
    email: userEmail,
    name: userName,
    language: currentLanguage // 'en' ou 'fr'
  })
});
```

---

### **2. Email de Confirmação de Pagamento (após pagamento)**

No webhook do Stripe ou após pagamento:

```typescript
await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/emails/payment-confirmation`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`
  },
  body: JSON.stringify({
    email: userEmail,
    name: userName,
    language: userLanguage,
    invoiceNumber: invoice.number,
    amount: invoice.amount,
    currency: 'CAD',
    taxYear: 2026,
    paymentDate: new Date().toISOString(),
    paymentType: 'initial' // ou 'final'
  })
});
```

---

### **3. Email de Invoice (ao gerar invoice)**

```typescript
await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/emails/invoice`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`
  },
  body: JSON.stringify({
    email: userEmail,
    name: userName,
    language: userLanguage,
    invoiceNumber: '0001',
    amount: 50,
    currency: 'CAD',
    taxYear: 2026,
    invoiceUrl: `https://your-app.com/invoices/0001`
  })
});
```

---

### **4. Email de Declaração Completa**

```typescript
await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/emails/tax-return-completed`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`
  },
  body: JSON.stringify({
    email: userEmail,
    name: userName,
    language: userLanguage,
    taxYear: 2026,
    completionDate: new Date().toISOString(),
    hasRefund: true,
    refundAmount: 1250
  })
});
```

---

### **5. Email de Lembrete**

```typescript
await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/emails/reminder`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`
  },
  body: JSON.stringify({
    email: userEmail,
    name: userName,
    language: userLanguage,
    reminderType: 'documents', // 'documents' | 'payment' | 'deadline' | 'review' | 'missing-info'
    taxYear: 2026,
    customMessage: 'Please upload your T4 slip.'
  })
});
```

---

## 📊 ENDPOINTS DISPONÍVEIS

Todas as rotas estão em: `https://SEU_PROJECT_ID.supabase.co/functions/v1/make-server-c2a25be0/emails/`

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/test` | POST | Email de teste |
| `/welcome` | POST | Email de boas-vindas |
| `/payment-confirmation` | POST | Confirmação de pagamento |
| `/invoice` | POST | Envio de invoice |
| `/tax-return-completed` | POST | Declaração completa |
| `/reminder` | POST | Lembretes diversos |

---

## ⚠️ IMPORTANTE - CHECKLIST FINAL

Antes de ir para produção:

- [ ] **API Key do Resend configurada** no Supabase
- [ ] **Domínio verificado** no Resend (ou usando domínio de teste)
- [ ] **FROM_EMAIL atualizado** no código
- [ ] **SUPPORT_EMAIL atualizado** no código
- [ ] **PHONE atualizado** no código
- [ ] **APP_URL configurada** no Supabase
- [ ] **Testado todos os 5 tipos** de email
- [ ] **Verificado que emails chegam** na caixa de entrada (não spam)

---

## 🎨 PREVIEW DOS EMAILS

Todos os emails têm:
- ✅ Design responsivo
- ✅ Logo e branding DuoProServices
- ✅ Cores profissionais
- ✅ CTAs claros
- ✅ Formatação de moeda e data
- ✅ Suporte bilíngue (EN/FR)

---

## 🆘 PRECISA DE AJUDA?

### **Problema: Email não chega**

1. Verifique se a API Key está correta
2. Verifique os logs do Supabase Edge Function
3. Verifique a pasta de spam
4. Se estiver usando domínio próprio, verifique se está verificado

### **Problema: Erro 500**

1. Verifique se `RESEND_API_KEY` está configurada
2. Verifique os logs no Supabase Dashboard
3. Teste com o endpoint `/test` primeiro

### **Problema: Emails vão para spam**

1. Configure SPF, DKIM e DMARC no seu domínio
2. Use domínio verificado
3. Evite palavras "spam" no assunto

---

## 🎉 PRONTO!

Seu sistema de emails está **100% configurado e pronto para produção**! 

Agora é só seguir os passos acima e começar a enviar emails profissionais em inglês e francês! 🚀

---

**Última atualização:** 7 de janeiro de 2025
