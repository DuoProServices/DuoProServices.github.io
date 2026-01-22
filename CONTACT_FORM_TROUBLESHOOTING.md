# 🔧 Troubleshooting - Formulário de Contato

## ❌ Problema: Email não está chegando

Você reportou que enviou uma mensagem pelo formulário mas o email não chegou. Vamos investigar e resolver!

---

## 📋 Checklist de Diagnóstico

### 1️⃣ **Verifique o Console do Navegador**

Abra o DevTools (F12) e vá para a aba "Console". Depois de enviar o formulário, você deve ver:

```
📧 [Contact Form] Submitting form data: { name: "...", email: "...", ... }
📧 [Contact Form] Response status: 200
📧 [Contact Form] Response ok: true
✅ [Contact Form] Success! Response: { ... }
```

**Se aparecer erro:**
```
❌ [Contact Form] Failed: 422 { error: "..." }
```

Isso indica que o Formspree rejeitou a submissão. Veja motivos abaixo.

---

### 2️⃣ **Verifique a Configuração do Formspree**

1. Acesse: https://formspree.io/
2. Faça login na sua conta
3. Vá para "Forms"
4. Procure pelo form ID: `xbddrodk`

**Verifique:**
- ✅ O form existe e está ativo?
- ✅ O email de destino está correto: `duopro@duoproservices.ca`?
- ✅ Você atingiu o limite de 50 envios/mês do plano gratuito?
- ✅ O form não está em "sandbox mode"?

---

### 3️⃣ **Verifique Submissões no Dashboard**

No Formspree Dashboard:
1. Clique no form `xbddrodk`
2. Vá para aba "Submissions"
3. Verifique se as mensagens aparecem lá

**Cenários:**

#### ✅ **Submissions aparecem no dashboard**
→ O formulário está funcionando!
→ Problema é com entrega de email

**Soluções:**
- Verifique pasta de **SPAM** no email duopro@duoproservices.ca
- Verifique pasta **Lixo Eletrônico**
- Verifique **Todas as Mensagens**
- Adicione `notifications@formspree.io` aos contatos

#### ❌ **Submissions NÃO aparecem no dashboard**
→ O form não está recebendo dados

**Soluções:**
- Verifique console do navegador
- Teste com outro navegador
- Limpe cache e tente novamente

---

### 4️⃣ **Verifique Email de Destino**

No Formspree Dashboard:
1. Clique em Settings (engrenagem)
2. Verifique "Email Address"
3. **DEVE SER:** `duopro@duoproservices.ca`

**Se estiver errado:**
1. Clique em "Edit"
2. Atualize para `duopro@duoproservices.ca`
3. Salve
4. Tente enviar novamente

---

### 5️⃣ **Verifique Limite de Envios**

**Plano Gratuito Formspree:**
- ✅ 50 submissões/mês
- ❌ Após 50, formulário para de funcionar

**Como verificar:**
1. No Dashboard, veja quantas "Submissions" você tem este mês
2. Se passar de 50, precisa fazer upgrade

**Soluções:**
- Aguarde próximo mês (reset automático)
- Faça upgrade para plano pago ($10/mês)
- Configure email próprio (veja seção abaixo)

---

### 6️⃣ **Teste Manual do Formspree**

Abra o terminal/console do navegador e execute:

```javascript
fetch("https://formspree.io/f/xbddrodk", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Teste Manual",
    email: "teste@example.com",
    subject: "Teste",
    message: "Esta é uma mensagem de teste"
  })
})
.then(r => r.json())
.then(data => console.log('✅ Resposta:', data))
.catch(err => console.error('❌ Erro:', err));
```

**Resultado esperado:**
```javascript
✅ Resposta: { ok: true, next: "..." }
```

**Se der erro:**
```javascript
❌ Erro: { error: "invalid form", ... }
```

Isso significa que o form ID está errado ou o form foi deletado.

---

## 🔍 Problemas Comuns e Soluções

### Problema 1: "Form not found"

**Causa:** Form ID `xbddrodk` não existe ou foi deletado

**Solução:**
1. Crie um novo form no Formspree
2. Configure email de destino: `duopro@duoproservices.ca`
3. Copie o novo form ID
4. Atualize `/src/app/components/Contact.tsx` linha 32

```typescript
const response = await fetch("https://formspree.io/f/SEU_NOVO_ID", {
```

---

### Problema 2: Status 422 - "Unprocessable Entity"

**Causa:** Dados do formulário inválidos

**Possíveis motivos:**
- Email inválido
- Campos obrigatórios vazios
- Form configurado com validação específica

**Solução:**
1. Verifique console do navegador para detalhes do erro
2. No Formspree, vá em Settings → Form Fields
3. Remova validações desnecessárias
4. Tente novamente

---

### Problema 3: Email vai para SPAM

**Causa:** Configuração DNS do domínio

**Solução Temporária:**
1. Abra pasta SPAM
2. Marque email como "Não é spam"
3. Adicione `notifications@formspree.io` aos contatos
4. Crie uma regra de filtro para não ir ao spam

**Solução Permanente:**
1. Acesse configurações DNS do domínio `duoproservices.ca`
2. Adicione registro SPF:
   ```
   Tipo: TXT
   Nome: @
   Valor: v=spf1 include:formspree.io ~all
   ```
3. Aguarde propagação DNS (até 24h)
4. Teste novamente

---

### Problema 4: Limite de 50 envios atingido

**Causa:** Plano gratuito tem limite

**Soluções:**

#### Opção A: Upgrade Formspree ($10/mês)
- 1000 submissões/mês
- reCAPTCHA avançado
- Webhooks
- Integração com Zapier

#### Opção B: Configurar Email Próprio (GRÁTIS)

Vou criar um sistema de email próprio usando Supabase Edge Functions + Resend.

---

## 🚀 Solução Definitiva: Email Próprio com Resend

Se o Formspree continuar falhando, podemos implementar nosso próprio sistema:

### Passo 1: Criar conta no Resend

1. Acesse: https://resend.com/
2. Crie conta gratuita
3. Copie API Key

**Plano Gratuito Resend:**
- ✅ 100 emails/dia
- ✅ 3000 emails/mês
- ✅ Sem limite de destinatários
- ✅ Analytics completo

### Passo 2: Configurar Domínio

1. No Resend Dashboard → Domains
2. Adicione `duoproservices.ca`
3. Adicione registros DNS fornecidos
4. Aguarde verificação

### Passo 3: Atualizar Código

Vou criar um endpoint no backend para enviar emails via Resend, eliminando dependência do Formspree.

Quer que eu implemente essa solução? É mais robusta e gratuita!

---

## 📞 Teste Rápido AGORA

Para testar imediatamente:

1. Abra o site: http://localhost:5173/
2. Role até o formulário de contato
3. **Abra DevTools (F12)**
4. Vá para aba **Console**
5. Preencha o formulário:
   - Nome: Teste
   - Email: seu-email@example.com
   - Assunto: Teste de formulário
   - Mensagem: Esta é uma mensagem de teste
6. Clique em "Send Message"
7. **Observe o console**

**Me envie o que apareceu no console!**

Exemplo:
```
📧 [Contact Form] Submitting form data: ...
📧 [Contact Form] Response status: 200
✅ [Contact Form] Success! Response: { ok: true }
```

OU

```
❌ [Contact Form] Failed: 422 { error: "..." }
```

---

## 🔑 Informações do Form Atual

- **Formspree ID:** `xbddrodk`
- **Endpoint:** `https://formspree.io/f/xbddrodk`
- **Email Destino:** `duopro@duoproservices.ca`
- **Método:** POST
- **Content-Type:** application/json

---

## ✅ Próximos Passos

1. **AGORA:** Teste o formulário com DevTools aberto
2. **AGORA:** Verifique pasta SPAM do email
3. **AGORA:** Acesse Dashboard do Formspree
4. **Me envie:** Screenshots do console + Formspree dashboard

Depois que você me enviar essas informações, posso diagnosticar o problema exato e implementar a solução! 🚀

---

## 🆘 Suporte Emergencial

**Se precisar de contato URGENTE enquanto investigamos:**

- 📧 Email direto: duopro@duoproservices.ca
- 📱 WhatsApp: +1 579 421 1620
- ☎️ Telefone: +514 562 7838
- 📅 Agendar: https://calendly.com/duoproservices-info
