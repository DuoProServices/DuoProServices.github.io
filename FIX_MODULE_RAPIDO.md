# ⚡ SOLUÇÃO RÁPIDA: Module not found

## 🚨 ERRO:
```
Module not found "admin-hub.tsx"
```

---

## ✅ SOLUÇÃO (3 minutos):

### **1. Instale o Supabase CLI:**

```bash
npm install -g supabase
```

### **2. Faça login:**

```bash
supabase login
```

### **3. Link o projeto:**

```bash
supabase link --project-ref lqpmyvizjfwzddxspacv
```

(Vai pedir password do banco. Pegue aqui: https://supabase.com/dashboard/project/lqpmyvizjfwzddxspacv/settings/database)

### **4. Deploy:**

```bash
cd /caminho/do/seu/projeto
supabase functions deploy server --no-verify-jwt
```

### **5. Teste:**

Aguarde 15 segundos, depois abra:
```
https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health
```

Deve aparecer: `{"status":"ok"}`

### **6. Recarregue o app:**

Pressione **F5** no seu app.

✅ **FUNCIONANDO!**

---

## 💡 POR QUE O ERRO?

O `index.tsx` importa 18 outros arquivos. O Dashboard só deixa copiar 1 arquivo por vez.

**SOLUÇÃO:** Use o CLI que faz upload de TODOS os arquivos de uma vez!

---

## 📚 GUIA COMPLETO

Se tiver problemas: `FIX_MODULE_NOT_FOUND.md`

---

**🚀 4 comandos e está resolvido!**
