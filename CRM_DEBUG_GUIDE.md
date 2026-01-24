# 🐛 CRM Debug Guide - "Failed to fetch" Error

## ❌ Erro Atual:
```
Error loading leads: TypeError: Failed to fetch
Error loading stats: TypeError: Failed to fetch
```

## 🔍 Diagnóstico:

### **Possíveis Causas:**

1. **❌ Backend não deployado**
   - O código do CRM está no repositório
   - Mas o Supabase Edge Function pode não ter sido deployada
   - Solução: Deploy via Supabase CLI

2. **❌ CORS ainda não ativado no servidor**
   - Adicionamos CORS no código
   - Mas não deployamos ainda
   - Solução: Deploy

3. **❌ URL incorreta**
   - ProjectId correto: `pwlacumydrxvshklvttp`
   - URL correta: `https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/crm/leads`

4. **❌ Edge Function offline ou com erro**
   - Pode ter crash no deploy
   - Ou algum erro de sintaxe
   - Solução: Verificar logs

---

## ✅ **Solução 1: Verificar se Backend Está Online**

### **Teste Manual (no Browser):**

1. **Abra console do browser (F12)**

2. **Cole este código:**

```javascript
// Teste 1: Health Check
fetch('https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend online:', d))
  .catch(e => console.error('❌ Backend offline:', e));

// Teste 2: CRM Leads
const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3bGFjdW15ZHJ4dnNoa2x2dHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjM3MTQsImV4cCI6MjA4MTczOTcxNH0.uj1rVapx5bBzp6YVFbcOwxCDZftpLzjwfMJ4aCy_B_A";

fetch('https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/crm/leads', {
  headers: {
    'Authorization': `Bearer ${publicAnonKey}`,
    'Content-Type': 'application/json'
  }
})
  .then(r => r.json())
  .then(d => console.log('✅ CRM Leads:', d))
  .catch(e => console.error('❌ CRM Error:', e));

// Teste 3: CRM Stats
fetch('https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/crm/stats', {
  headers: {
    'Authorization': `Bearer ${publicAnonKey}`,
    'Content-Type': 'application/json'
  }
})
  .then(r => r.json())
  .then(d => console.log('✅ CRM Stats:', d))
  .catch(e => console.error('❌ Stats Error:', e));
```

3. **Resultados Esperados:**

**✅ Se funcionar:**
```
✅ Backend online: { status: "ok", ... }
✅ CRM Leads: []
✅ CRM Stats: { total: 0, new: 0, ... }
```

**❌ Se não funcionar:**
```
❌ Backend offline: TypeError: Failed to fetch
❌ CRM Error: TypeError: Failed to fetch
❌ Stats Error: TypeError: Failed to fetch
```

---

## ✅ **Solução 2: Deploy do Backend**

### **Opção A: Deploy via Supabase Dashboard (FÁCIL)**

```
1. Login em: https://supabase.com/dashboard

2. Selecione projeto: pwlacumydrxvshklvttp

3. Vá em: Edge Functions

4. Você deve ver: "make-server-c2a25be0"

5. Se NÃO existe:
   - Clique "Create a new function"
   - Nome: make-server-c2a25be0
   - Cole todo o código de /supabase/functions/server/index.tsx
   - Deploy

6. Se JÁ existe:
   - Clique na function
   - Verifique se tem erros
   - Redeploy se necessário
```

### **Opção B: Deploy via Supabase CLI (AVANÇADO)**

**Passo 1: Instalar Supabase CLI**

```bash
# Windows (via npm):
npm install -g supabase

# Mac (via Homebrew):
brew install supabase/tap/supabase

# Linux:
curl -fsSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar -xz
sudo mv supabase /usr/local/bin/
```

**Passo 2: Login**

```bash
supabase login
```

**Passo 3: Link ao Projeto**

```bash
supabase link --project-ref pwlacumydrxvshklvttp
```

**Passo 4: Deploy Edge Functions**

```bash
supabase functions deploy make-server-c2a25be0
```

**Passo 5: Verificar**

```bash
supabase functions list
```

Deve aparecer:
```
┌──────────────────────────┬─────────┬─────────────┐
│          NAME            │ VERSION │   STATUS    │
├──────────────────────────┼─────────┼─────────────┤
│ make-server-c2a25be0     │    1    │   ACTIVE    │
└──────────────────────────┴─────────┴─────────────┘
```

---

## ✅ **Solução 3: Verificar Logs do Backend**

### **Via Dashboard:**

```
1. Supabase Dashboard
2. Edge Functions
3. make-server-c2a25be0
4. Logs

Procure por:
❌ Erros de sintaxe
❌ Import errors
❌ Runtime errors
✅ "✅ [CRM] Found X leads"
```

### **Via CLI:**

```bash
supabase functions logs make-server-c2a25be0 --tail
```

---

## ✅ **Solução 4: Usar Modo LOCAL (Temporário)**

Se o backend não estiver funcionando, podemos usar **localStorage temporariamente** até corrigir:

### **Arquivo: `/src/app/pages/AdminCRMPage.tsx`**

**Adicione no topo:**

```typescript
const USE_LOCAL_STORAGE = true; // Mudar para false quando backend funcionar
```

**Modifique `loadLeads`:**

```typescript
const loadLeads = async () => {
  try {
    if (USE_LOCAL_STORAGE) {
      // Modo local
      const localLeads = localStorage.getItem('crm-leads');
      const leads = localLeads ? JSON.parse(localLeads) : [];
      setLeads(leads);
      return;
    }
    
    // Modo backend (código atual)
    const response = await fetch(...);
    // ... resto do código
  } catch (error) {
    // ... error handling
  }
};
```

**Modifique `loadStats`:**

```typescript
const loadStats = async () => {
  try {
    if (USE_LOCAL_STORAGE) {
      // Calcular stats a partir dos leads locais
      const localLeads = localStorage.getItem('crm-leads');
      const leads = localLeads ? JSON.parse(localLeads) : [];
      
      const calculatedStats = {
        total: leads.length,
        new: leads.filter(l => l.status === 'new').length,
        contacted: leads.filter(l => l.status === 'contacted').length,
        quoteSent: leads.filter(l => l.status === 'quote-sent').length,
        negotiating: leads.filter(l => l.status === 'negotiating').length,
        won: leads.filter(l => l.status === 'won').length,
        lost: leads.filter(l => l.status === 'lost').length,
        conversionRate: leads.length > 0 
          ? Math.round((leads.filter(l => l.status === 'won').length / leads.length) * 100)
          : 0,
        totalValue: leads
          .filter(l => l.status === 'won')
          .reduce((sum, l) => sum + (l.estimatedValue || 0), 0),
        estimatedPipeline: leads
          .filter(l => !['won', 'lost'].includes(l.status))
          .reduce((sum, l) => sum + (l.estimatedValue || 0), 0),
        byContactMethod: {
          email: leads.filter(l => l.contactMethod === 'email').length,
          whatsapp: leads.filter(l => l.contactMethod === 'whatsapp').length,
          phone: leads.filter(l => l.contactMethod === 'phone').length,
          form: leads.filter(l => l.contactMethod === 'form').length,
          referral: leads.filter(l => l.contactMethod === 'referral').length,
          linkedin: leads.filter(l => l.contactMethod === 'linkedin').length,
          instagram: leads.filter(l => l.contactMethod === 'instagram').length,
          other: leads.filter(l => l.contactMethod === 'other').length,
        },
      };
      
      setStats(calculatedStats);
      return;
    }
    
    // Modo backend (código atual)
    const response = await fetch(...);
    // ... resto do código
  } catch (error) {
    // ... error handling
  }
};
```

---

## 🎯 **Qual Solução Usar?**

### **Situação 1: Backend Não Existe**
→ **Solução 2 (Deploy via Dashboard ou CLI)**

### **Situação 2: Backend Existe mas Está com Erro**
→ **Solução 3 (Verificar Logs) + Solução 2 (Redeploy)**

### **Situação 3: Quer Funcionar AGORA**
→ **Solução 4 (Modo Local Temporário)**

### **Situação 4: Não Sabe o Status**
→ **Solução 1 (Teste Manual) → depois escolher 2, 3 ou 4**

---

## 📊 **Checklist de Diagnóstico:**

- [ ] 1. Testei URL no browser console
  - [ ] Backend respondeu? → Problema é CORS ou Auth
  - [ ] Backend não respondeu? → Backend offline

- [ ] 2. Verifiquei Supabase Dashboard
  - [ ] Edge Function existe? → Verificar logs
  - [ ] Edge Function NÃO existe? → Deploy agora

- [ ] 3. Verifiquei logs do backend
  - [ ] Erros de sintaxe? → Corrigir código
  - [ ] Erros de import? → Verificar dependências
  - [ ] Sem erros? → Problema é no frontend

- [ ] 4. Comparei URLs
  - [ ] Frontend usa: `pwlacumydrxvshklvttp`
  - [ ] Backend usa: `pwlacumydrxvshklvttp`
  - [ ] Ambos iguais? ✅ OK
  - [ ] Diferentes? ❌ Corrigir

---

## 🚨 **Ação Imediata Recomendada:**

### **PASSO 1: Teste Rápido (30 segundos)**

1. Abra: https://duoproservices.ca/admin/crm
2. Abra Console (F12)
3. Cole e execute:

```javascript
fetch('https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend:', d))
  .catch(e => console.error('❌ Backend offline - precisa deploy!'));
```

4. Leia resultado

### **PASSO 2: Se Backend Offline**

→ **Ir para Supabase Dashboard e fazer deploy**

### **PASSO 3: Se Backend Online mas com Erro**

→ **Verificar logs e corrigir**

### **PASSO 4: Se Quiser Solução Rápida**

→ **Ativar modo localStorage (Solução 4)**

---

## 💡 **Recomendação Final:**

**O problema mais provável é que o backend NÃO FOI DEPLOYADO ainda.**

Fizemos mudanças no código local, mas Edge Functions precisam ser deployadas separadamente do GitHub Pages.

**Solução:**
1. Deploy Edge Function via Supabase Dashboard
2. OU use Supabase CLI para deploy
3. OU ative modo localStorage temporariamente

---

**Qual caminho você quer seguir?**
- A) Deploy backend agora (recomendado)
- B) Modo localStorage temporário (funciona já)
- C) Debugar mais antes de decidir
