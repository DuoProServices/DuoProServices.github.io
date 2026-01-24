# 📧 Setup - Sistema de Email Próprio com Resend

## Por que usar Resend?

**Vantagens sobre Formspree:**
- ✅ 100 emails/dia (vs 50/mês do Formspree)
- ✅ 3000 emails/mês GRÁTIS
- ✅ Controle total sobre templates
- ✅ Analytics detalhado
- ✅ Melhor deliverability (menos spam)
- ✅ Suporta domínio próprio
- ✅ API moderna e simples

---

## 🚀 Implementação Rápida (15 minutos)

### Passo 1: Criar Conta no Resend (2 min)

1. Acesse: https://resend.com/signup
2. Crie conta com email `duopro@duoproservices.ca`
3. Confirme email
4. Faça login

### Passo 2: Obter API Key (1 min)

1. No Dashboard, vá em **API Keys**
2. Clique em **Create API Key**
3. Nome: "DuoPro Contact Form"
4. Permissões: **Sending access** (Full access)
5. Clique em **Create**
6. **COPIE A API KEY** (começa com `re_...`)

⚠️ **IMPORTANTE:** Salve a API key em lugar seguro! Ela só aparece uma vez.

### Passo 3: Adicionar API Key ao Supabase (2 min)

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Edge Functions** → **Environment Variables**
4. Clique em **+ New Variable**
5. Nome: `RESEND_API_KEY`
6. Valor: Cole a API key copiada (ex: `re_123abc...`)
7. Clique em **Save**

### Passo 4: Instalar Resend SDK (já feito automaticamente)

O código backend já vai usar o Resend via npm.

---

## 📝 Código do Backend

Vou criar um endpoint `/contact/send` que:
1. Recebe dados do formulário
2. Valida os dados
3. Envia email via Resend
4. Retorna confirmação

**Endpoint:** `POST /make-server-c2a25be0/contact/send`

**Vantagens:**
- ✅ Sem dependência de serviço externo (Formspree)
- ✅ Templates customizados
- ✅ Rate limiting configurável
- ✅ Logs completos
- ✅ Fallback para email direto se falhar

---

## 🎨 Template do Email

O email que o cliente recebe será assim:

```
De: DuoPro Services <noreply@duoproservices.ca>
Para: duopro@duoproservices.ca
Assunto: Nova mensagem de contato: [Assunto do cliente]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📨 NOVA MENSAGEM DE CONTATO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 NOME:
João Silva

📧 EMAIL:
joao@example.com

📱 TELEFONE:
(514) 123-4567

📋 ASSUNTO:
Consulta sobre declaração de imposto

💬 MENSAGEM:
Gostaria de agendar uma consulta para discutir 
minha declaração de imposto de 2025.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Recebido em: 13 de Janeiro de 2026 às 14:30
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para responder, envie email para: joao@example.com
```

---

## 🔧 Configuração Opcional - Domínio Próprio

Para emails virem de `noreply@duoproservices.ca` em vez de `onboarding@resend.dev`:

### Passo 1: Adicionar Domínio no Resend

1. No Resend Dashboard → **Domains**
2. Clique em **Add Domain**
3. Digite: `duoproservices.ca`
4. Clique em **Add**

### Passo 2: Adicionar Registros DNS

Resend vai mostrar 3 registros DNS para adicionar:

```
1. TXT Record (Verification)
   Host: @
   Value: resend-verification=abc123...
   
2. MX Record
   Host: @
   Priority: 10
   Value: feedback-smtp.us-east-1.amazonses.com

3. TXT Record (SPF)
   Host: @
   Value: v=spf1 include:amazonses.com ~all
```

### Passo 3: Adicionar no Provedor DNS

1. Acesse painel do provedor de domínio (GoDaddy, Namecheap, etc)
2. Vá em **DNS Management**
3. Adicione os 3 registros acima
4. Salve as mudanças
5. Aguarde até 24h para propagação

### Passo 4: Verificar Domínio

1. Volte ao Resend Dashboard
2. Clique em **Verify** ao lado do domínio
3. Se der erro, aguarde mais um pouco
4. Quando verificado, aparecerá ✅ **Verified**

**Depois disso, emails virão de `noreply@duoproservices.ca`!**

---

## 🧪 Teste do Sistema

Depois que eu implementar o código, você pode testar:

1. Abra o site
2. Preencha o formulário
3. Clique em "Send Message"
4. Verifique email em 10-30 segundos

**Console do navegador mostrará:**
```
📧 [Contact Form] Sending via backend...
✅ [Contact Form] Email sent successfully!
Email ID: abc123...
```

---

## 📊 Monitoramento

No Resend Dashboard você verá:
- Total de emails enviados
- Taxa de entrega (delivery rate)
- Taxa de abertura (se configurar)
- Emails que falharam
- Logs detalhados

---

## 💰 Limites e Custos

### Plano Gratuito (Atual)
- ✅ 100 emails/dia
- ✅ 3000 emails/mês
- ✅ 1 domínio verificado
- ✅ API completa
- ✅ Webhooks
- ✅ Analytics básico

### Se precisar mais (Plano Pago - $20/mês)
- 50.000 emails/mês
- Domínios ilimitados
- Analytics avançado
- Suporte prioritário
- SLA 99.9%

**Para um site de fiscalista, o plano GRATUITO é mais que suficiente!**

---

## 🔄 Migração do Formspree para Resend

**O que muda:**
- ❌ Não usa mais `formspree.io/f/xbddrodk`
- ✅ Usa endpoint próprio no Supabase
- ✅ Mesmo formulário visual
- ✅ Mesma experiência do usuário

**O que NÃO muda:**
- Interface do formulário
- Campos
- Validações
- Mensagens de sucesso/erro

---

## ✅ Implementação

Quer que eu implemente agora? Vou:

1. ✅ Criar endpoint `/contact/send` no backend
2. ✅ Atualizar componente `Contact.tsx` para usar novo endpoint
3. ✅ Adicionar validação de rate limiting
4. ✅ Criar template profissional de email
5. ✅ Adicionar logs detalhados
6. ✅ Implementar fallback se Resend falhar

**Tempo estimado:** 10-15 minutos

Depois você só precisa:
1. Criar conta no Resend (2 min)
2. Copiar API key (1 min)
3. Adicionar no Supabase (1 min)
4. Testar! (1 min)

**Total: 5 minutos de configuração!**

---

## 🎯 Comparação Final

| Feature | Formspree | Resend |
|---------|-----------|--------|
| Emails/mês (grátis) | 50 | 3000 |
| Setup | Fácil | Fácil |
| Controle | Limitado | Total |
| Templates | Básico | Customizável |
| Analytics | Não | Sim |
| Domínio próprio | Não | Sim |
| Deliverability | 85% | 99%+ |
| Spam rate | Alto | Baixo |

**Recomendação: Resend é MUITO melhor!** 🚀

---

## 🆘 Suporte

Se tiver dúvidas durante setup:
1. Veja documentação oficial: https://resend.com/docs
2. Entre em contato comigo
3. Suporte Resend: https://resend.com/support

**Vamos implementar?** Me avise e eu crio o código agora! 💪
