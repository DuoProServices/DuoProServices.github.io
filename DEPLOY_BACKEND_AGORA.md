# 🚀 DEPLOY DO BACKEND - GUIA RÁPIDO

## ⚡ URGENTE: Deploy Necessário!

O endpoint `/users/list` foi criado mas **NÃO está deployado**. Você precisa fazer o deploy agora para ver os usuários reais!

---

## 🎯 Opção 1: Deploy Via Supabase Dashboard (MAIS FÁCIL)

### **Passo a Passo:**

1. **Abrir Dashboard**
   ```
   URL: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp
   ```

2. **Ir para Edge Functions**
   ```
   Menu lateral → Edge Functions
   ou
   URL direta: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/functions
   ```

3. **Encontrar a Function**
   ```
   Procurar: make-server-c2a25be0
   ```

4. **Fazer Deploy**
   ```
   Clicar no botão: "Deploy" ou "Redeploy"
   ```

5. **Aguardar**
   ```
   ⏳ Deploy leva ~1-2 minutos
   ✅ Quando finalizar, aparece "Deployed"
   ```

6. **Verificar Logs**
   ```
   Clicar em "Logs" para ver se há erros
   ✅ Se aparecer: "Server started successfully"
   ✅ Então está funcionando!
   ```

---

## 🎯 Opção 2: Deploy Via CLI

### **Se você tem Supabase CLI instalado:**

```bash
# 1. Login (se ainda não fez)
supabase login

# 2. Deploy da function
supabase functions deploy make-server-c2a25be0

# 3. Aguardar...
# ✅ Deve aparecer: "Deployed function make-server-c2a25be0"
```

### **Se NÃO tem Supabase CLI:**

```bash
# Instalar NPM (se não tiver)
# Windows: https://nodejs.org/
# Mac: brew install node

# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Deploy
supabase functions deploy make-server-c2a25be0
```

---

## 🎯 Opção 3: Deploy Via VS Code Extension

### **Se você usa VS Code:**

1. **Instalar Extension**
   ```
   Extensão: "Supabase" (oficial)
   ```

2. **Login**
   ```
   Cmd/Ctrl + Shift + P
   Digite: "Supabase: Login"
   ```

3. **Deploy**
   ```
   Botão direito na pasta: /supabase/functions/server
   Selecionar: "Deploy Function"
   ```

---

## ✅ Como Verificar Se Funcionou:

### **Teste 1: Endpoint Health Check**

```javascript
// Cole no console do browser (F12):
fetch('https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend online:', d))
  .catch(e => console.error('❌ Backend offline:', e));
```

**Esperado:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T..."
}
```

### **Teste 2: Endpoint Users List (Requer Login)**

```javascript
// Substitua SEU_TOKEN_AQUI pelo token do localStorage
const token = localStorage.getItem('supabase.auth.token');

fetch('https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/users/list', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
  .then(r => r.json())
  .then(d => console.log('✅ Usuários encontrados:', d.length, d))
  .catch(e => console.error('❌ Erro:', e));
```

**Esperado:**
```javascript
// Array com todos os usuários do Supabase Auth
[
  {
    userId: "abc-123",
    email: "user@example.com",
    name: "John Doe",
    role: "client",
    onboardingComplete: true,
    // ... mais dados
  }
]
```

### **Teste 3: Admin Portal**

```
1. Abrir: https://duoproservices.ca/admin
2. Login com: veprass@gmail.com (ou admin)
3. Clicar: User Management
4. ✅ Deve mostrar LISTA REAL de usuários
5. ❌ Se mostrar lista mockada: backend ainda offline
```

---

## 🐛 Troubleshooting:

### **Erro: "Function not found"**

```
Solução:
1. Verificar se o arquivo existe em /supabase/functions/server/
2. Verificar se o index.tsx importa users.tsx
3. Tentar deploy novamente
```

### **Erro: "Deployment failed"**

```
Solução:
1. Verificar logs no Dashboard
2. Procurar por erros de sintaxe
3. Verificar se todas as dependências estão corretas
4. Tentar fazer deploy de outra function primeiro (teste)
```

### **Erro: "401 Unauthorized"**

```
Solução:
1. Verificar se você está logado
2. Verificar se tem permissões de admin
3. Verificar se o email está na lista de admins:
   - veprass@gmail.com
   - germana.canada@gmail.com
   - jamila.coura15@gmail.com
```

### **Backend deployed mas ainda mostra "Failed to fetch"**

```
Solução:
1. Limpar cache do browser (Ctrl+Shift+Delete)
2. Hard reload (Ctrl+Shift+R)
3. Verificar se a URL está correta no código
4. Verificar logs da function no Dashboard
5. Tentar em janela anônima/incognito
```

---

## 📊 Checklist Pós-Deploy:

- [ ] Backend está online (health check retorna status: ok)
- [ ] Endpoint /users/list retorna array de usuários
- [ ] Admin portal mostra usuários reais (não mockados)
- [ ] Consegue ver usuários com e sem onboarding completo
- [ ] Flag "onboardingComplete" aparece corretamente
- [ ] Todos os emails dos admins funcionam

---

## 🎉 Sucesso!

Se todos os testes passaram:
- ✅ Backend está deployado
- ✅ Endpoint funcionando
- ✅ Usuários aparecem no portal
- ✅ Sistema 100% operacional

**Agora você pode ver TODOS os usuários que criaram conta!**

---

## 📞 Ajuda Adicional:

- **Documentação Supabase:** https://supabase.com/docs/guides/functions
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Status Page:** https://status.supabase.com/

---

## 🔄 Deploy Automático (Futuro):

Para evitar deploy manual toda vez, configure CI/CD:

```yaml
# .github/workflows/deploy-supabase.yml
name: Deploy Supabase Functions

on:
  push:
    branches: [main]
    paths:
      - 'supabase/functions/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: supabase/setup-cli@v1
      - run: supabase functions deploy make-server-c2a25be0
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

**Benefícios:**
- ✅ Deploy automático quando fizer push
- ✅ Não precisa lembrar de fazer deploy manual
- ✅ Menos erros humanos
- ✅ Histórico de deploys no GitHub

---

**🚀 BOA SORTE COM O DEPLOY!**
