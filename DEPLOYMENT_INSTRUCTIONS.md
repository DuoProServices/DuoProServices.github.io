# 🚀 Backend Deployment Instructions

## ⚠️ IMPORTANTE: O backend PRECISA ser deployado para funcionar!

A página de gestão de usuários (`/admin/users-list`) depende dos endpoints do backend que foram criados no arquivo `/supabase/functions/server/users.tsx`.

---

## 📋 Como Fazer o Deploy

### **Passo 1:** Acesse o Supabase Dashboard
```
https://supabase.com/dashboard
```

### **Passo 2:** Selecione o Projeto
```
Projeto ID: pwlacumydrxvshklvttp
```

### **Passo 3:** Navegue até Edge Functions
```
Menu lateral → Edge Functions
```

### **Passo 4:** Encontre a função
```
Nome: make-server-c2a25be0
```

### **Passo 5:** Clique em "Redeploy"
```
Botão no canto superior direito: "Redeploy"
```

### **Passo 6:** Aguarde o Deploy
```
⏱️ Tempo estimado: 10-30 segundos
✅ Status: Aguarde até ver "Successfully deployed"
```

---

## ✅ Como Verificar se Funcionou

### **Teste 1:** Health Check
Abra no navegador:
```
https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T..."
}
```

### **Teste 2:** Na Página de Usuários
1. Acesse: `/admin/users-list`
2. Se aparecer: ✅ **"Loaded X users"** → FUNCIONOU!
3. Se aparecer: ❌ **"Backend not responding"** → Precisa deployar

---

## 🔧 Endpoints Disponíveis Após Deploy

### **GET** `/make-server-c2a25be0/users`
Lista todos os usuários (admin only)

### **POST** `/make-server-c2a25be0/admin/create-user`
Cria novo usuário (admin only)

### **DELETE** `/make-server-c2a25be0/users/:userId`
Deleta usuário (admin only)

---

## 🐛 Troubleshooting

### **Erro: Failed to fetch**
**Causa:** Backend não foi deployado ainda  
**Solução:** Seguir os passos de deploy acima

### **Erro: 401 Unauthorized**
**Causa:** Token inválido ou sessão expirada  
**Solução:** Fazer logout e login novamente

### **Erro: 403 Forbidden**
**Causa:** Usuário não é admin  
**Solução:** Verificar se o email está em `/src/app/config/admins.ts`

### **Erro: 404 Not Found**
**Causa:** Rota não existe no backend  
**Solução:** Verificar se as rotas estão em `/supabase/functions/server/users.tsx`

---

## 📝 Notas Importantes

1. **Sempre deployar** após modificar arquivos em `/supabase/functions/server/`
2. **Aguardar** o deploy completar antes de testar
3. **Logs** podem ser visualizados em: Supabase Dashboard → Edge Functions → Logs
4. **Admins** são definidos em `/src/app/config/admins.ts`

---

## 🎯 Status Atual

- ✅ Endpoints criados em `/supabase/functions/server/users.tsx`
- ✅ Rotas montadas em `/supabase/functions/server/index.tsx`
- ✅ Frontend conectado corretamente
- ⚠️ **PENDENTE:** Deploy do backend

---

**Última atualização:** 15 de janeiro de 2026
