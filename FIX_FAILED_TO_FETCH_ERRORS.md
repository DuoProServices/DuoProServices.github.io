# 🔧 CORRIGIR ERROS "FAILED TO FETCH"

## 🚨 **ERROS QUE VOCÊ ESTÁ VENDO:**

```
Error loading messages: TypeError: Failed to fetch
Error loading uploaded files: TypeError: Failed to fetch
Error loading unread count: TypeError: Failed to fetch
Error fetching payment status: TypeError: Failed to fetch
```

---

## ✅ **CAUSA RAIZ:**

O **backend (Edge Function) não está deployado** no Supabase!

Todos os arquivos do servidor estão em `/supabase/functions/server/` mas o Supabase não sabe deles ainda.

---

## 🚀 **SOLUÇÃO: DEPLOY MANUAL DO EDGE FUNCTION**

### **OPÇÃO 1: Deploy via Supabase CLI (Recomendado)**

#### **Passo 1: Instalar Supabase CLI**

**MacOS/Linux:**
```bash
brew install supabase/tap/supabase
```

**Windows:**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Alternativa (NPM):**
```bash
npm install -g supabase
```

---

#### **Passo 2: Login no Supabase**

```bash
supabase login
```

Isso abrirá o navegador para você fazer login.

---

#### **Passo 3: Link ao Projeto**

```bash
supabase link --project-ref pwlacumydrxvshklvttp
```

Quando pedir a senha do banco de dados, você pode encontrá-la em:
- **Supabase Dashboard** → **Settings** → **Database** → **Connection String**

---

#### **Passo 4: Deploy da Edge Function**

```bash
supabase functions deploy server
```

Aguarde alguns minutos... ⏳

---

#### **Passo 5: Configurar Secrets**

O Edge Function precisa das variáveis de ambiente. Configure-as:

```bash
# RESEND API KEY (para emails)
supabase secrets set RESEND_API_KEY=sua_api_key_aqui

# APP URL
supabase secrets set APP_URL=https://seu-app.com
```

**IMPORTANTE:** As seguintes secrets JÁ existem automaticamente no Supabase:
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `SUPABASE_DB_URL`
- ✅ `STRIPE_SECRET_KEY`

Você **NÃO** precisa configurá-las novamente!

---

### **OPÇÃO 2: Deploy via Dashboard (Alternativa)**

Se você não conseguir usar o CLI:

#### **Passo 1: Copiar todo o código do servidor**

Copie TODO o conteúdo da pasta `/supabase/functions/server/` para um local temporário.

---

#### **Passo 2: Ir ao Dashboard**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto: **pwlacumydrxvshklvttp**
3. No menu lateral: **Edge Functions**
4. Clique em **"Create a new function"**

---

#### **Passo 3: Configurar a Function**

- **Name:** `server`
- **Template:** Blank
- Cole o conteúdo do arquivo `/supabase/functions/server/index.tsx` no editor
- Clique em **"Deploy"**

---

#### **Passo 4: Upload dos outros arquivos**

Infelizmente, pelo Dashboard você só consegue fazer o deploy do arquivo principal.

Para uma solução completa, você **DEVE** usar o CLI (Opção 1).

---

## 🧪 **TESTAR SE FUNCIONOU**

Após o deploy, teste se o backend está respondendo:

### **Teste 1: Health Check**

Abra o console do navegador e rode:

```javascript
fetch('https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/health')
  .then(res => res.json())
  .then(data => console.log('✅ Backend online:', data))
  .catch(err => console.error('❌ Backend offline:', err));
```

**Resultado esperado:**
```json
{ "status": "ok" }
```

Se você ver isso, **o backend está funcionando!** ✅

---

### **Teste 2: Verificar Logs**

No Supabase Dashboard:
1. Vá em **Edge Functions**
2. Clique na function **"server"**
3. Clique em **"Logs"**
4. Veja se há erros

---

## 🎯 **CHECKLIST COMPLETO**

Antes de ir para produção, verifique:

- [ ] **Supabase CLI instalado**
- [ ] **Login no Supabase CLI** (`supabase login`)
- [ ] **Projeto linkado** (`supabase link`)
- [ ] **Edge Function deployada** (`supabase functions deploy server`)
- [ ] **RESEND_API_KEY configurada** (para emails)
- [ ] **APP_URL configurada**
- [ ] **Health check respondendo** (teste acima)
- [ ] **Logs sem erros** no Dashboard

---

## ⚠️ **IMPORTANTE - ESTRUTURA DO PROJETO**

O Supabase espera esta estrutura:

```
/supabase/
  └── functions/
      └── server/
          ├── index.tsx          ← Arquivo principal (OBRIGATÓRIO)
          ├── kv_store.tsx
          ├── messages.tsx
          ├── stripe.tsx
          ├── users.tsx
          ├── roadmap.tsx
          ├── timeline.tsx
          ├── email-service.tsx
          ├── email-routes.tsx
          └── email-templates/
              └── ...
```

Todos esses arquivos já existem no seu projeto! ✅

---

## 🔍 **VERIFICAR ESTRUTURA DE ARQUIVOS**

Para garantir que tudo está correto, rode:

```bash
# No diretório raiz do projeto
ls -la supabase/functions/server/
```

Você deve ver:
- ✅ `index.tsx`
- ✅ `kv_store.tsx`
- ✅ `messages.tsx`
- ✅ `stripe.tsx`
- ✅ `users.tsx`
- ✅ `roadmap.tsx`
- ✅ `timeline.tsx`
- ✅ `email-service.tsx`
- ✅ `email-routes.tsx`
- ✅ `email-templates/` (pasta)

---

## 🆘 **SOLUÇÃO RÁPIDA: MOCK TEMPORÁRIO (NÃO RECOMENDADO)**

Se você precisar testar o frontend **AGORA** sem o backend, pode criar um mock temporário:

### **1. Criar arquivo de mock**

Crie: `/src/utils/mock-backend.ts`

```typescript
// MOCK TEMPORÁRIO - DELETAR APÓS DEPLOY DO BACKEND!
export const mockBackend = {
  async messages(clientId: string) {
    return { messages: [] };
  },
  
  async unreadCount(clientId: string) {
    return { unreadCount: 0 };
  },
  
  async uploadedFiles(year: string) {
    return { files: [] };
  },
  
  async paymentStatus(year: number) {
    return {
      payment: {
        initialPaid: false,
        initialAmount: 50,
        finalPaid: false,
        finalAmount: 0,
        totalPrice: 50
      }
    };
  }
};
```

### **2. Usar no código**

Substitua as chamadas fetch por:

```typescript
// ANTES:
const response = await fetch(...);
const data = await response.json();

// TEMPORÁRIO:
import { mockBackend } from '../utils/mock-backend';
const data = await mockBackend.messages(clientId);
```

**ATENÇÃO:** Isso é apenas para desenvolvimento! **NUNCA** use em produção!

---

## 📞 **PRECISA DE AJUDA?**

### **Erro: "Failed to deploy function"**
- Verifique se você está logado: `supabase status`
- Verifique se o projeto está linkado: `supabase projects list`
- Tente novamente: `supabase functions deploy server --no-verify-jwt`

### **Erro: "Database password required"**
- Pegue a senha em: **Supabase Dashboard** → **Settings** → **Database**
- Ou use: `supabase link --project-ref pwlacumydrxvshklvttp --password SUA_SENHA`

### **Erro: "Timeout"**
- Verifique sua conexão de internet
- Tente novamente após alguns minutos
- O Supabase pode estar tendo problemas temporários

---

## ✅ **RESUMO**

1. **Instale Supabase CLI:** `brew install supabase/tap/supabase`
2. **Login:** `supabase login`
3. **Link ao projeto:** `supabase link --project-ref pwlacumydrxvshklvttp`
4. **Deploy:** `supabase functions deploy server`
5. **Configure secrets:** `supabase secrets set RESEND_API_KEY=...`
6. **Teste:** Rode o health check no console

Após isso, todos os erros "Failed to fetch" desaparecerão! 🎉

---

**Última atualização:** 7 de janeiro de 2025
