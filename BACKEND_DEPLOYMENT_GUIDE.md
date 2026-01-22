# 🚀 Backend Deployment Guide

## ⚠️ PROBLEMA ATUAL

Você está vendo estes erros:
```
❌ Error loading users: TypeError: Failed to fetch
❌ Error creating user: TypeError: Failed to fetch
Error fetching dashboard data: TypeError: Failed to fetch
```

**Causa:** O backend (Edge Function) ainda não foi deployado no Supabase!

**AGORA VOCÊ SERÁ AUTOMATICAMENTE BLOQUEADO** até fazer o deploy!

---

## ✅ SOLUÇÃO AUTOMÁTICA (Recomendado)

### **Quando você acessar qualquer página admin:**

1. ✅ Você verá uma **TELA VERMELHA DE BLOQUEIO**
2. ✅ **INSTRUÇÕES PASSO-A-PASSO** aparecerão automaticamente
3. ✅ **BOTÃO AZUL** para abrir o Supabase Dashboard
4. ✅ **BOTÃO VERDE** para testar após deploy

### **Siga as 4 etapas na tela:**
```
1️⃣ Clique no botão "Open Supabase Dashboard"
2️⃣ Encontre o botão azul "Deploy" ou "Redeploy" 
3️⃣ Clique em Deploy e aguarde 10-30 segundos
4️⃣ Volte e clique "Check Again"
```

**A página vai recarregar automaticamente quando o backend estiver online!**

---

## 📊 Como Saber Se Funcionou?

### **Teste 1: Health Check**
Abra no navegador:
```
https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T..."
}
```

---

### **Teste 2: Backend Diagnostic Tool**

1. Acesse: `/backend-diagnostic`
2. Clique: "Run All Tests"
3. **Todos os 4 testes devem passar:**

```
✅ Test 1: Supabase Client - PASSED
✅ Test 2: User Session - PASSED  
✅ Test 3: Health Check - PASSED
✅ Test 4: Users Endpoint - PASSED
   Found X users
```

---

### **Teste 3: Página de Usuários**

1. Acesse: `/admin/users-list`
2. Deve carregar sem erros
3. Deve mostrar lista de usuários

---

## 🔍 TROUBLESHOOTING

### **Erro: "Failed to fetch"**
**Causa:** Backend não foi deployado ainda  
**Solução:** Fazer deploy conforme instruções acima

---

### **Erro: "Forbidden - Admin only" (403)**
**Causa:** Seu email não está na lista de admins  
**Solução:** Verificar se seu email está em `/src/app/config/admins.ts`

**Emails autorizados:**
- veprass@gmail.com
- germana.canada@gmail.com
- jamila.coura15@gmail.com

---

### **Erro: "Unauthorized" (401)**
**Causa:** Sessão expirada ou não está logado  
**Solução:** Fazer login novamente em `/login`

---

### **Teste passa mas Users List ainda dá erro**
**Causa:** Cache do navegador  
**Solução:**
1. Pressione `Ctrl + Shift + R` (Windows) ou `Cmd + Shift + R` (Mac)
2. Ou limpe o cache do navegador
3. Ou abra em aba anônima

---

## 🛠️ ARQUIVOS IMPORTANTES

### **Backend:**
- `/supabase/functions/server/index.tsx` - Main server
- `/supabase/functions/server/users.tsx` - Users endpoints

### **Frontend:**
- `/src/app/pages/AdminUsersListPage.tsx` - Users management page
- `/src/app/pages/BackendDiagnosticPage.tsx` - Diagnostic tool

### **Config:**
- `/src/app/config/admins.ts` - Admin email list
- `/utils/supabase/info.tsx` - Supabase credentials

---

## 📋 ENDPOINTS DISPONÍVEIS

Após o deploy, estes endpoints estarão disponíveis:

### **1. Health Check** (Público)
```
GET https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/health
```

### **2. List Users** (Admin only)
```
GET https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/users
Headers: Authorization: Bearer <access_token>
```

### **3. Get User** (Admin only)
```
GET https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/users/:userId
Headers: Authorization: Bearer <access_token>
```

### **4. Create User** (Admin only)
```
POST https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/admin/create-user
Headers: Authorization: Bearer <access_token>
Body: { email, password, name }
```

### **5. Delete User** (Admin only)
```
DELETE https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/users/:userId
Headers: Authorization: Bearer <access_token>
```

---

## 🎯 PRÓXIMOS PASSOS APÓS DEPLOY

1. ✅ **Fazer deploy** conforme instruções acima
2. ✅ **Testar** com Backend Diagnostic Tool
3. ✅ **Acessar** `/admin/users-list`
4. ✅ **Criar** novos usuários
5. ✅ **Gerenciar** permissões

---

## 💡 DICAS

- **Sempre use** `/backend-diagnostic` quando tiver problemas
- **Deploy automático** não está ativo (precisa ser manual)
- **Logs** podem ser vistos no Supabase Dashboard → Edge Functions → Logs
- **Invocations** mostram quantas chamadas foram feitas

---

## 📞 SUPORTE

Se ainda tiver problemas:

1. **Veja os logs** no Supabase Dashboard
2. **Execute** todos os testes de diagnóstico
3. **Verifique** se está logado como admin
4. **Limpe** o cache do navegador

---

**Criado em:** 2026-01-15  
**Versão:** 1.0  
**Status:** Backend pronto para deploy ✅