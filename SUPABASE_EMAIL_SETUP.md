# 📧 Configuração de Email no Supabase

## ⚠️ **IMPORTANTE: Emails Não Funcionam Por Padrão**

O Supabase **NÃO envia emails** automaticamente. Você precisa configurar SMTP manualmente.

Sem configuração de email:
- ❌ Email de confirmação de conta não é enviado
- ❌ Email de "esqueci minha senha" não é enviado
- ✅ Cadastro funciona (auto-confirmado no código)
- ✅ Login funciona normalmente

---

## 🎯 **Opções de Configuração:**

### **Opção 1: Usar Gmail (MAIS FÁCIL)** ⭐ RECOMENDADO

Perfeito para testes e pequenos volumes (até 500 emails/dia).

#### Passo a Passo:

1. **Crie uma Senha de App do Gmail:**
   - Acesse: https://myaccount.google.com/apppasswords
   - Faça login com sua conta Gmail
   - Clique em "Criar senha de app"
   - Nome: "Supabase DuoPro Services"
   - Copie a senha gerada (16 caracteres)

2. **Configure no Supabase:**
   - Acesse: https://supabase.com/dashboard/project/akjqlobybuqenweavgjp/settings/auth
   - Role até **"SMTP Settings"**
   - Preencha:
     ```
     Enable Custom SMTP: ON
     
     Sender email: seuemail@gmail.com
     Sender name: DuoPro Services
     
     Host: smtp.gmail.com
     Port: 587
     Username: seuemail@gmail.com
     Password: [sua senha de app de 16 caracteres]
     ```
   - Clique em **"Save"**

3. **Teste:**
   - Faça logout do site
   - Vá em "Esqueci minha senha"
   - Digite seu email
   - Verifique se recebeu o email (cheque spam também)

---

### **Opção 2: Usar SendGrid (PROFISSIONAL)**

Para grandes volumes (até 100 emails/dia grátis, depois pago).

#### Passo a Passo:

1. **Criar Conta no SendGrid:**
   - Acesse: https://signup.sendgrid.com/
   - Crie uma conta gratuita
   - Verifique seu email

2. **Criar API Key:**
   - No SendGrid: Settings → API Keys
   - Clique "Create API Key"
   - Nome: "DuoPro Services"
   - Permissão: "Full Access"
   - Copie a API key (começa com `SG.`)

3. **Verificar Domínio (Opcional mas Recomendado):**
   - Settings → Sender Authentication
   - Siga o processo de verificação

4. **Configure no Supabase:**
   - Acesse: https://supabase.com/dashboard/project/akjqlobybuqenweavgjp/settings/auth
   - Role até **"SMTP Settings"**
   - Preencha:
     ```
     Enable Custom SMTP: ON
     
     Sender email: noreply@duoproservices.ca (ou seu email verificado)
     Sender name: DuoPro Services
     
     Host: smtp.sendgrid.net
     Port: 587
     Username: apikey
     Password: [sua API key do SendGrid]
     ```
   - Clique em **"Save"**

---

### **Opção 3: Usar Resend (MODERNO)** 🚀

API moderna e fácil (100 emails/dia grátis).

#### Passo a Passo:

1. **Criar Conta:**
   - Acesse: https://resend.com/signup
   - Crie uma conta

2. **Criar API Key:**
   - No dashboard: API Keys → Create API Key
   - Nome: "DuoPro Services"
   - Copie a key (começa com `re_`)

3. **Verificar Domínio:**
   - Domains → Add Domain
   - Digite: duoproservices.ca
   - Configure os registros DNS conforme instruções

4. **Configure no Supabase:**
   - Acesse: https://supabase.com/dashboard/project/akjqlobybuqenweavgjp/settings/auth
   - Role até **"SMTP Settings"**
   - Preencha:
     ```
     Enable Custom SMTP: ON
     
     Sender email: noreply@duoproservices.ca
     Sender name: DuoPro Services
     
     Host: smtp.resend.com
     Port: 587
     Username: resend
     Password: [sua API key do Resend]
     ```
   - Clique em **"Save"**

---

## 📋 **Personalizar Templates de Email**

Depois de configurar SMTP, você pode personalizar os emails:

1. **Acesse Supabase:**
   - https://supabase.com/dashboard/project/akjqlobybuqenweavgjp/auth/templates

2. **Edite os Templates:**
   - **Confirm Signup** - Email de boas-vindas
   - **Reset Password** - Email de recuperação de senha
   - **Magic Link** - Se usar login sem senha

3. **Variáveis Disponíveis:**
   ```
   {{ .ConfirmationURL }} - Link de confirmação
   {{ .Token }} - Token de verificação
   {{ .TokenHash }} - Hash do token
   {{ .SiteURL }} - URL do seu site
   ```

4. **Exemplo de Template Profissional:**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
    <h1 style="color: #1a73e8; margin-bottom: 20px;">DuoPro Services</h1>
    
    <h2 style="color: #333;">Reset Your Password</h2>
    
    <p style="color: #666; line-height: 1.6;">
      Hi there! 👋
    </p>
    
    <p style="color: #666; line-height: 1.6;">
      We received a request to reset your password. Click the button below to create a new password:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="background-color: #1a73e8; color: white; padding: 15px 30px; 
                text-decoration: none; border-radius: 5px; display: inline-block;">
        Reset Password
      </a>
    </div>
    
    <p style="color: #666; line-height: 1.6; font-size: 14px;">
      If you didn't request this, you can safely ignore this email.
    </p>
    
    <p style="color: #666; line-height: 1.6; font-size: 14px;">
      This link expires in 1 hour.
    </p>
    
    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
    
    <p style="color: #999; font-size: 12px; text-align: center;">
      DuoPro Services - Canadian Tax Specialist<br>
      📧 contact@duoproservices.ca<br>
      🌐 <a href="https://duoproservices.ca" style="color: #1a73e8;">duoproservices.ca</a>
    </p>
  </div>
</body>
</html>
```

---

## ✅ **Checklist de Configuração:**

- [ ] Escolhi um provedor de email (Gmail, SendGrid ou Resend)
- [ ] Criei conta e obtive credenciais
- [ ] Configurei SMTP no Supabase
- [ ] Testei "Esqueci minha senha" 
- [ ] Recebi email de teste
- [ ] Personalizei templates de email
- [ ] Configurei domínio próprio (opcional)

---

## 🧪 **Como Testar:**

### Teste 1: Reset de Senha
1. Vá em: https://duoproservices.ca/forgot-password
2. Digite seu email
3. Clique em "Send Reset Link"
4. Verifique seu email (e pasta de spam)
5. Clique no link recebido
6. Defina nova senha

### Teste 2: Novo Cadastro
1. Vá em: https://duoproservices.ca/signup
2. Crie uma conta nova
3. Se configurou confirmação de email, verifique inbox
4. Confirme o email e faça login

---

## 🆘 **Problemas Comuns:**

### **Não Recebo Emails**

**1. Verifique spam/lixo eletrônico**
- Emails do Supabase podem ir para spam

**2. Confirme configuração SMTP:**
- Supabase → Settings → Auth → SMTP Settings
- Certifique-se que "Enable Custom SMTP" está ON

**3. Teste credenciais:**
- Use uma ferramenta online: https://www.smtper.net/
- Teste com as mesmas credenciais

**4. Verifique limites:**
- Gmail: 500 emails/dia
- SendGrid Free: 100 emails/dia
- Resend Free: 100 emails/dia

### **Erro "Invalid Credentials"**

**Gmail:**
- Use senha de app (16 caracteres), não sua senha normal
- Ative autenticação de dois fatores antes de criar senha de app

**SendGrid:**
- Username deve ser exatamente: `apikey`
- Password é sua API key completa

**Resend:**
- Username deve ser exatamente: `resend`
- Password é sua API key

### **Email vai para Spam**

**Solução:**
1. Configure SPF/DKIM do seu domínio
2. Use domínio próprio verificado
3. Aqueça o IP (envie poucos emails no início)

---

## 💡 **Recomendação Final:**

### Para Começar:
✅ **Use Gmail** - Rápido, fácil, grátis até 500/dia

### Para Produção:
✅ **Use SendGrid ou Resend** - Mais confiável, menos chance de spam

### Com Domínio Próprio:
✅ **Resend** - Melhor UX, moderna, fácil de configurar

---

## 📞 **Links Úteis:**

- **Supabase Email Config**: https://supabase.com/dashboard/project/akjqlobybuqenweavgjp/settings/auth
- **Supabase Email Templates**: https://supabase.com/dashboard/project/akjqlobybuqenweavgjp/auth/templates
- **Gmail App Passwords**: https://myaccount.google.com/apppasswords
- **SendGrid**: https://sendgrid.com
- **Resend**: https://resend.com
- **SMTP Tester**: https://www.smtper.net/

---

**Boa sorte! Com SMTP configurado, todos os emails funcionarão perfeitamente! 📧✨**
