# ⚡ COMANDOS RÁPIDOS - DuoPro Services

## 🔥 COMANDOS MAIS USADOS

### **1. Testar Localmente**
```bash
npm run dev
```
Depois abra: http://localhost:5173

---

### **2. Fazer Build**
```bash
npm run build
```
Arquivos gerados em: `/dist`

---

### **3. Testar Build Localmente**
```bash
npm run build
npm run preview
```
Depois abra: http://localhost:4173

---

### **4. Fazer Deploy**
```bash
npm run deploy
git add .
git commit -m "Update"
git push
```
Site atualiza em ~2 minutos

---

### **5. Ver Logs de Erros**
```bash
# No navegador:
# Pressione F12
# Vá para Console
# Veja erros em vermelho
```

---

## 🛠️ COMANDOS DE MANUTENÇÃO

### **Instalar Dependências**
```bash
npm install
```

### **Limpar Cache**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### **Ver Tamanho do Build**
```bash
npm run build
du -sh dist
```

### **Verificar Erros TypeScript**
```bash
npx tsc --noEmit
```

---

## 🔍 COMANDOS DE DEBUG

### **Ver Variáveis Supabase**
```bash
# Abra no navegador:
https://supabase.com/dashboard/project/[PROJECT-ID]/settings/api
```

### **Testar Backend**
```bash
# Abra no navegador:
https://duoproservices.github.io/auth-debug
```

### **Ver Logs Edge Function**
```bash
# Supabase Dashboard:
# Edge Functions > make-server-c2a25be0 > Logs
```

---

## 📦 COMANDOS SUPABASE

### **Deploy Edge Function**
```bash
# Primeiro instale Supabase CLI:
npm install -g supabase

# Depois faça login:
supabase login

# Link o projeto:
supabase link --project-ref [PROJECT-ID]

# Deploy:
supabase functions deploy make-server-c2a25be0
```

### **Ver Buckets Storage**
```bash
# Dashboard:
https://supabase.com/dashboard/project/[PROJECT-ID]/storage/buckets
```

---

## 🗄️ COMANDOS DATABASE (Supabase)

### **Ver Dados do KV Store**
```sql
-- No Supabase SQL Editor:
SELECT * FROM kv_store_c2a25be0 LIMIT 10;
```

### **Ver Usuários**
```sql
-- No Supabase SQL Editor:
SELECT 
  id, 
  email, 
  created_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;
```

### **Ver Tax Filings**
```sql
-- Buscar no KV Store:
SELECT * FROM kv_store_c2a25be0 
WHERE key LIKE 'taxfiling:%';
```

---

## 🔐 COMANDOS ADMIN

### **Adicionar Novo Admin**
Edite: `/src/app/config/admins.ts`
```typescript
const ADMIN_EMAILS = [
  'veprass@gmail.com',
  'germana.canada@gmail.com',
  'jamila.coura15@gmail.com',
  'NOVO-EMAIL@example.com', // ← Adicione aqui
];
```

### **Resetar Senha de Usuário**
```bash
# Supabase Dashboard:
# Authentication > Users > [usuário] > Reset Password
```

### **Deletar Todos os Dados**
```bash
# Abra no navegador:
https://duoproservices.github.io/auth-debug

# Clique em "RESET COMPLETO"
# ⚠️ CUIDADO: Isso deleta TUDO!
```

---

## 🎨 COMANDOS FRONTEND

### **Adicionar Nova Rota**
Edite: `/src/app/App.tsx`
```tsx
<Route path="/nova-rota" element={<NovoComponente />} />
```

### **Adicionar Nova Tradução**
Edite: `/src/app/contexts/LanguageContext.tsx`
```typescript
const translations = {
  en: {
    novaChave: 'New Text',
  },
  fr: {
    novaChave: 'Nouveau Texte',
  },
};
```

### **Adicionar Novo Ícone**
```tsx
import { IconName } from 'lucide-react';

<IconName className="w-4 h-4" />
```

---

## 💳 COMANDOS STRIPE

### **Testar Pagamento**
```
Cartão: 4242 4242 4242 4242
Expiry: qualquer data futura
CVC: qualquer 3 dígitos
```

### **Ver Pagamentos no Dashboard**
```bash
https://dashboard.stripe.com/test/payments
```

### **Configurar Webhook**
```bash
# Stripe Dashboard > Developers > Webhooks
# Endpoint URL:
https://[PROJECT-ID].supabase.co/functions/v1/make-server-c2a25be0/stripe/webhook

# Events:
- payment_intent.succeeded
- payment_intent.payment_failed
```

---

## 📊 COMANDOS ANALYTICS

### **Ver Google Analytics**
```bash
https://analytics.google.com
```

### **Teste Lighthouse (Performance)**
```bash
# No navegador Chrome:
# F12 > Lighthouse > Analyze page load
```

### **Ver Core Web Vitals**
```bash
https://pagespeed.web.dev/
# Cole: https://duoproservices.github.io
```

---

## 🚨 COMANDOS EMERGÊNCIA

### **Site Quebrou - Rollback Rápido**
```bash
git log --oneline -10  # Ver últimos commits
git reset --hard HEAD~1  # Voltar 1 commit
git push -f  # Force push (CUIDADO!)
```

### **Build Falhou**
```bash
# 1. Limpe tudo:
rm -rf node_modules dist
npm install
npm run build

# 2. Se ainda falhar, veja erros:
npx tsc --noEmit
```

### **Backend Offline**
```bash
# Verifique Edge Function:
# Supabase Dashboard > Edge Functions
# Status: deployed?

# Re-deploy:
supabase functions deploy make-server-c2a25be0
```

---

## 📝 COMANDOS GIT

### **Commit Rápido**
```bash
git add .
git commit -m "Descrição da mudança"
git push
```

### **Ver Mudanças**
```bash
git status
git diff
```

### **Criar Nova Branch**
```bash
git checkout -b feature/nova-funcionalidade
```

### **Voltar para Main**
```bash
git checkout main
```

---

## 🔗 LINKS ÚTEIS

```
Site Publicado:
https://duoproservices.github.io

Supabase Dashboard:
https://supabase.com/dashboard

Stripe Dashboard:
https://dashboard.stripe.com

GitHub Repo:
https://github.com/duoproservices/duoproservices.github.io

Formspree (Contact Form):
https://formspree.io/forms/xbddrodk

Calendly (Scheduling):
[configure seu link]
```

---

## 💡 DICAS RÁPIDAS

### **Velocidade de Deploy**
```
Mudança de CSS/texto: ~1-2 minutos
Mudança de código: ~2-3 minutos
Edge Function: ~5 minutos
```

### **Cache do Navegador**
```
Se não vê mudanças:
1. Ctrl + Shift + R (hard refresh)
2. Ou: Ctrl + F5
3. Ou: limpe cache do navegador
```

### **Modo DEV vs PROD**
```typescript
// Para código só em DEV:
if (import.meta.env.DEV) {
  console.log('Debug info');
}

// Para verificar ambiente:
console.log('Mode:', import.meta.env.MODE);
```

---

## 📞 CONTATOS ADMIN

```
Veronica Prass:    veprass@gmail.com
Germana Azevedo:   germana.canada@gmail.com
Jamila Azevedo:    jamila.coura15@gmail.com
```

---

**💾 Salve este arquivo para referência rápida!**
**Copie e cole os comandos direto no terminal.**

**Última atualização:** 21/01/2026
