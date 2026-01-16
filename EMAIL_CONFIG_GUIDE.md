# 📧 Configuração de Email - DuoPro Services

## ✅ Status Atual

**FORMSPREE ATIVO E FUNCIONANDO** ✅  
Emails estão indo para a conta configurada no Formspree.

---

## 🎯 O Problema Que Você Enfrentou

Você quer que os emails vão para **duopro@duoproservices.ca**, mas atualmente vão para o Gmail configurado no Formspree.

---

## 🔧 Solução Rápida (2 minutos)

### Mudar Email no Formspree

1. **Acesse:** https://formspree.io/login
2. **Faça login** na conta do Formspree
3. Vá em **Forms** → Clique no form `xbddrodk`
4. **Settings** (configurações)
5. Procure por **Email** ou **Notification Email**
6. **Mude para:** `duopro@duoproservices.ca`
7. **Save Changes**

**Pronto!** Agora todos os emails irão para duopro@duoproservices.ca 🎉

---

## 🚀 Solução Profissional (Resend + Backend)

Se você quiser ter **controle total** dos emails sem depender do Formspree:

### Por Que Usar Resend?

- ✅ **Você controla 100%** (sem terceiros)
- ✅ **3,000 emails/mês grátis**
- ✅ **Design HTML profissional** (já implementado)
- ✅ **Reply-to automático**
- ✅ **Anti-spam (rate limiting)**
- ✅ **Logs detalhados**

### Pré-requisitos

⚠️ **IMPORTANTE:** Para usar o sistema Resend, você precisa:

1. ✅ **Deploy das Edge Functions** no Supabase
2. ✅ **Criar conta no Resend** (grátis)
3. ✅ **Adicionar API key** no Supabase

---

## 📋 Como Ativar o Sistema Resend

### Passo 1: Fazer Deploy das Edge Functions

**Opção A: Via Supabase CLI (recomendado)**

```bash
# Instalar Supabase CLI (se não tiver)
npm install -g supabase

# Fazer login
supabase login

# Fazer deploy das functions
supabase functions deploy make-server-c2a25be0
```

**Opção B: Via Dashboard do Supabase**

1. Acesse: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/functions
2. Clique em **Deploy new function**
3. Faça upload da pasta `/supabase/functions/server/`

---

### Passo 2: Criar Conta no Resend

1. Acesse: https://resend.com/signup
2. Crie conta gratuita
3. Confirme email

---

### Passo 3: Obter API Key do Resend

1. Faça login no Resend
2. Vá em **API Keys** (menu lateral esquerdo)
3. Clique em **Create API Key**
4. Nome: `DuoPro Production`
5. Permissões: **Sending access**
6. Clique em **Add**
7. **COPIE A KEY** (começa com `re_...`)
   - ⚠️ Você só verá ela uma vez!
   - Salve em local seguro

---

### Passo 4: Adicionar API Key no Supabase

1. Acesse: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/settings/functions
2. Vá em **Edge Functions** → **Secrets**
3. Clique em **Add a new secret**
4. **Nome:** `RESEND_API_KEY`
5. **Valor:** Cole a key do Resend (ex: `re_abc123xyz...`)
6. Clique em **Save**

---

### Passo 5: Ativar no Código

Abra `/src/app/components/Contact.tsx` e mude:

```typescript
// Linha 26:
const USE_BACKEND_EMAIL = false; // ⚠️ Usando Formspree

// Mude para:
const USE_BACKEND_EMAIL = true; // ✅ Usando Resend via backend
```

---

### Passo 6: Testar

1. Vá no site
2. Preencha o formulário de contato
3. Clique em "Send Message"
4. Verifique **duopro@duoproservices.ca** 📧

**Se o email chegar = SUCESSO!** 🎉

---

## 📊 Comparação: Formspree vs Resend

| Recurso | Formspree | Resend (Backend) |
|---------|-----------|------------------|
| **Setup** | 2 minutos | 15-20 minutos |
| **Deploy necessário** | ❌ Não | ✅ Sim |
| **Controle total** | ❌ Limitado | ✅ Total |
| **Design do email** | Básico | HTML profissional |
| **Emails/mês grátis** | 50 | 3,000 |
| **Rate limiting** | ❌ Não | ✅ Sim |
| **Logs detalhados** | Limitado | Completo |
| **Reply-to automático** | ✅ Sim | ✅ Sim |
| **Custo inicial** | $0 | $0 |

---

## 🎯 Recomendação

### Para Começar AGORA:
✅ **Use Formspree** e mude o email para duopro@duoproservices.ca

### Quando fizer deploy no Netlify/Vercel:
✅ **Migre para Resend** para ter controle total e design profissional

---

## 🔍 Como Ver Onde os Emails Estão Indo

### No Código (Contact.tsx linha 26):
```typescript
const USE_BACKEND_EMAIL = false; // Formspree ✅ ATIVO AGORA
// ou
const USE_BACKEND_EMAIL = true;  // Resend (precisa deploy)
```

### No Console do Navegador (F12):
```
📧 [Contact Form] Using Formspree...        ← Formspree ativo
// ou
📧 [Contact Form] Using backend email...    ← Resend ativo
```

---

## 🚨 Troubleshooting

### Erro: "Failed to fetch"
❌ **Causa:** Edge Functions não deployadas ou URL incorreta  
✅ **Solução:** Volte para Formspree até fazer deploy

### Email não chegou
1. ✅ Verifique spam/junk
2. ✅ Confirme email no Formspree/Resend
3. ✅ Veja logs no dashboard

### Formspree parou de funcionar
1. ✅ Verifique se não atingiu limite (50 emails/mês)
2. ✅ Confirme account ativa
3. ✅ Veja status: https://status.formspree.io

---

## 📧 Template do Email (Resend)

Quando você ativar o Resend, este é o email que será enviado:

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

**Features:**
- ✅ HTML profissional com cores e ícones
- ✅ Reply-to configurado (responda direto)
- ✅ Timestamp com timezone de Toronto
- ✅ Versão texto alternativa
- ✅ Mobile-responsive

---

## 💡 Dicas

1. **Para teste rápido:** Use Formspree
2. **Para produção:** Migre para Resend
3. **Sem deploy:** Formspree é a única opção
4. **Com deploy:** Resend é superior

---

## ✅ Checklist de Decisão

**Escolha FORMSPREE se:**
- □ Precisa funcionar AGORA
- □ Não tem deploy configurado
- □ Menos de 50 emails/mês
- □ Setup simples é prioridade

**Escolha RESEND se:**
- □ Tem deploy configurado
- □ Quer controle total
- □ Precisa de muitos emails (3000/mês)
- □ Quer design profissional
- □ Quer logs detalhados

---

## 📞 Resumo Final

### ✅ AGORA (Formspree):
1. Login no Formspree: https://formspree.io/login
2. Mude email para: duopro@duoproservices.ca
3. Save
4. **PRONTO!** ✅

### ✅ DEPOIS (Resend):
1. Deploy Edge Functions
2. Criar conta Resend
3. Adicionar API key no Supabase
4. Mudar `USE_BACKEND_EMAIL = true`
5. Testar

---

## 🎉 Está Tudo Pronto!

O código está 100% preparado para ambas as soluções.  
Você só precisa escolher qual usar! 🚀

**Recomendação:** Mude email no Formspree agora, migre para Resend depois do deploy.
