# 🔧 FIX: Erro ao Confirmar Email (localhost refused to connect)

## 🎯 O PROBLEMA

Quando você cria um novo usuário e clica no link de confirmação do email, aparece:
```
localhost refused to connect
ERR_CONNECTION_REFUSED
```

**CAUSA:** O Supabase está redirecionando para `localhost:3000`, mas:
- Ou seu app não está rodando localmente
- Ou está rodando em outra porta/URL

---

## ✅ SOLUÇÃO

Há 2 formas de resolver:

### **OPÇÃO 1: Desabilitar confirmação de email (RECOMENDADO para desenvolvimento)**

Esta é a forma mais rápida e simples.

#### **Passo 1: Vá para o Supabase Dashboard**

Link direto:
```
https://supabase.com/dashboard/project/lqpmyvizjfwzddxspacv/auth/providers
```

#### **Passo 2: Desabilite confirmação de email**

1. No menu lateral, clique: **Authentication** → **Providers**
2. Clique em: **Email**
3. Procure a seção: **"Email Confirmations"**
4. **DESMARQUE** a opção: **"Enable email confirmations"**
5. Clique em: **"Save"**

#### **Passo 3: Teste**

1. Volte para o seu app
2. Tente criar um novo usuário
3. ✅ **Deve funcionar sem pedir confirmação!**

---

### **OPÇÃO 2: Configurar Redirect URLs corretas (Para produção)**

Se você quer MANTER a confirmação de email, precisa configurar as URLs corretas.

#### **Passo 1: Descubra qual URL seu app está usando**

Você está usando:
- [ ] Localhost? Ex: `http://localhost:5173`
- [ ] Vercel? Ex: `https://seu-app.vercel.app`
- [ ] Netlify? Ex: `https://seu-app.netlify.app`
- [ ] Outra URL? Ex: `https://seudominio.com`

#### **Passo 2: Vá para o Supabase Dashboard**

Link direto:
```
https://supabase.com/dashboard/project/lqpmyvizjfwzddxspacv/auth/url-configuration
```

#### **Passo 3: Adicione suas URLs**

1. No menu lateral, clique: **Authentication** → **URL Configuration**
2. Procure: **"Redirect URLs"**
3. Adicione TODAS essas URLs (uma por linha):

```
http://localhost:3000/**
http://localhost:5173/**
http://localhost:5174/**
https://seu-app.vercel.app/**
https://seudominio.com/**
```

**IMPORTANTE:** Substitua `seu-app.vercel.app` e `seudominio.com` pelas suas URLs reais!

4. Clique em: **"Save"**

#### **Passo 4: Configure a URL do Site (Site URL)**

Na mesma página, procure: **"Site URL"**

Defina como a URL PRINCIPAL do seu app:
```
https://seu-app.vercel.app
```

Ou se estiver usando localhost:
```
http://localhost:5173
```

5. Clique em: **"Save"**

#### **Passo 5: Teste**

1. Volte para o seu app
2. Crie um novo usuário
3. Vá no email e clique no link de confirmação
4. ✅ **Deve redirecionar corretamente!**

---

## 🔍 VERIFICAÇÃO

### **Como saber se funcionou?**

#### Se escolheu OPÇÃO 1 (desabilitar confirmação):
1. Crie um novo usuário
2. Você deve ser **logado automaticamente**
3. **NÃO** deve receber email de confirmação

#### Se escolheu OPÇÃO 2 (configurar URLs):
1. Crie um novo usuário
2. Você deve receber um email
3. Ao clicar no link, deve ser redirecionado para `/onboarding` no seu app

---

## 🐛 TROUBLESHOOTING

### ❌ Ainda aparece "localhost refused to connect"

**Causa:** Você escolheu OPÇÃO 2 mas as URLs não foram configuradas corretamente.

**Solução:**
1. Verifique se adicionou TODAS as URLs possíveis
2. Certifique-se de incluir `/**` no final de cada URL
3. Aguarde 1-2 minutos após salvar (pode demorar para propagar)
4. Limpe o cache do navegador (Ctrl+Shift+Delete)

---

### ❌ Não recebo email de confirmação

**Causa:** Supabase não configurou o servidor de email.

**Solução:**
- Para desenvolvimento: Use OPÇÃO 1 (desabilitar confirmação)
- Para produção: Configure um servidor SMTP customizado

---

### ❌ Email chega mas link não funciona

**Causa:** O link está usando URL errada.

**Solução:**
1. Veja qual URL está no link do email
2. Adicione essa URL exata no Dashboard (OPÇÃO 2, Passo 3)
3. Certifique-se de incluir `/**` no final

---

## 🎯 RECOMENDAÇÃO

### **Para DESENVOLVIMENTO:**
→ Use **OPÇÃO 1** (desabilitar confirmação)
- Mais rápido
- Mais simples
- Não precisa configurar email

### **Para PRODUÇÃO:**
→ Use **OPÇÃO 2** (configurar URLs)
- Mais seguro
- Usuários reais precisam confirmar email
- Evita contas falsas

---

## 📋 CHECKLIST RÁPIDO

### Se escolheu OPÇÃO 1:
- [ ] Fui para: Authentication → Providers → Email
- [ ] Desmarquei: "Enable email confirmations"
- [ ] Cliquei em "Save"
- [ ] Testei criar novo usuário
- [ ] ✅ Foi logado automaticamente

### Se escolheu OPÇÃO 2:
- [ ] Fui para: Authentication → URL Configuration
- [ ] Adicionei minhas URLs em "Redirect URLs"
- [ ] Configurei "Site URL" com URL principal
- [ ] Cliquei em "Save"
- [ ] Aguardei 2 minutos
- [ ] Testei criar novo usuário
- [ ] Cliquei no link do email
- [ ] ✅ Foi redirecionado corretamente

---

## 🔗 LINKS ÚTEIS

**Configuração de Providers (OPÇÃO 1):**
```
https://supabase.com/dashboard/project/lqpmyvizjfwzddxspacv/auth/providers
```

**Configuração de URLs (OPÇÃO 2):**
```
https://supabase.com/dashboard/project/lqpmyvizjfwzddxspacv/auth/url-configuration
```

**Documentação Supabase:**
```
https://supabase.com/docs/guides/auth/redirect-urls
```

---

## 💡 EXEMPLO DE CONFIGURAÇÃO

### Se seu app está em: `https://duopro-services.vercel.app`

**Redirect URLs:**
```
http://localhost:3000/**
http://localhost:5173/**
https://duopro-services.vercel.app/**
```

**Site URL:**
```
https://duopro-services.vercel.app
```

---

**🚀 Escolha uma das opções acima e o problema será resolvido!**
