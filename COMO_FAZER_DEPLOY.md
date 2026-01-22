# 🚀 COMO FAZER O DEPLOY - GUIA RÁPIDO

## ❌ Problema Atual
**Todos os testes falharam** porque o Edge Function não está deployed no Supabase.

---

## ✅ SOLUÇÃO RÁPIDA (3 comandos!)

### **1️⃣ Preparar arquivos**

```bash
chmod +x prepare-deploy.sh
./prepare-deploy.sh
```

### **2️⃣ Fazer login (se ainda não fez)**

```bash
npm install -g supabase
supabase login
supabase link --project-ref pwlacumydrxvshklvttp
```

### **3️⃣ Deploy!**

```bash
supabase functions deploy make-server-c2a25be0
```

---

## 🎯 DEPOIS DO DEPLOY

1. **Volte ao site** (clique no botão de preview)
2. **Clique no botão roxo "🧪 Test Server"** no canto inferior direito
3. **Clique em "🚀 Run All Tests"**
4. **Agora deve PASSAR! ✅** (tudo verde)

---

## 🐛 Se Algo Der Errado

### Erro: "command not found: supabase"
```bash
npm install -g supabase
```

### Erro: "Project not linked"
```bash
supabase link --project-ref pwlacumydrxvshklvttp
```

### Erro: "Permission denied"
- Verifique se você está logado: `supabase login`
- Verifique se tem acesso ao projeto no Dashboard do Supabase

### Os testes ainda falham após deploy?
1. Aguarde 30 segundos (deploy pode demorar)
2. Limpe o cache do browser (Ctrl+Shift+R)
3. Tente novamente

---

## 🎉 SUCESSO!

Quando os testes passarem (todos verde), você poderá:
- ✅ Criar novos usuários
- ✅ Fazer login
- ✅ Usar o portal do cliente
- ✅ Upload de documentos
- ✅ Tudo funcionando!

---

## 📞 Precisa de Ajuda?

Copie e cole o erro que aparecer no terminal e me mostre.
