<<<<<<< HEAD
# ⚡ DEPLOY SUPER RÁPIDO - COPIE E COLE

## 🎯 SE VOCÊ JÁ SABE ONDE ESTÁ A PASTA:

### **Abra o terminal e cole TUDO de uma vez:**

```bash
npm run build && git add . && git commit -m "Fix: Correções de imports React Router" && git push origin main
```

**Pronto! Aguarde 2-3 minutos e acesse:**
```
https://duoproservices.github.io
```

---

## 🔍 SE NÃO SABE ONDE ESTÁ A PASTA:

### **1. Encontre a pasta do projeto:**

O nome da pasta é provavelmente:
```
duoproservices.github.io
```

### **2. Abra o VSCode nessa pasta**

### **3. No VSCode, abra o Terminal integrado:**
- Menu: `Terminal` → `New Terminal`
- Ou tecla: `Ctrl + '` (Windows/Linux)
- Ou tecla: `Cmd + '` (Mac)

### **4. Cole este comando:**

```bash
npm run build && git add . && git commit -m "Fix: Correções de imports" && git push
```

---

## 🖱️ OU USE O SCRIPT AUTOMÁTICO:

### **Windows:**
1. Abra a pasta do projeto no Explorer
2. Clique 2x em: `DEPLOY_AGORA.bat`
3. Aguarde terminar
4. Pronto! ✅

### **Mac/Linux:**
1. Abra o Terminal
2. Navegue até a pasta do projeto
3. Execute:
```bash
chmod +x DEPLOY_AGORA.sh
./DEPLOY_AGORA.sh
```

---

## ⏱️ QUANTO TEMPO DEMORA?

```
Build:           ~30-60 segundos
Git push:        ~10 segundos
GitHub Pages:    ~2-3 minutos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:           ~3-4 minutos
```

---

## ✅ COMO SABER SE DEU CERTO?

1. **Vá para:** https://github.com/duoproservices/duoproservices.github.io/actions
2. **Veja se apareceu:**
   - 🟠 Bolinha laranja = Processando
   - ✅ Check verde = Completo!
   - ❌ X vermelho = Erro

3. **Depois de 2-3 minutos, acesse:**
   ```
   https://duoproservices.github.io
   ```

4. **Pressione:** `Ctrl + Shift + R` (limpar cache)

5. **Veja se o site carrega sem erros!**

---

## 🆘 SE DER ERRO:

**Me envie a mensagem de erro e eu ajudo!**

Mas primeiro tente:
```bash
# Limpar e reinstalar:
rm -rf node_modules
npm install
npm run build
```

---

**🎯 Copie e cole na ordem:**

```bash
# 1. Build
npm run build

# 2. Add
git add .

# 3. Commit
git commit -m "Fix: Correções de imports"

# 4. Push
git push origin main
```

**Ou tudo de uma vez:**

```bash
npm run build && git add . && git commit -m "Fix" && git push
```

✅ **PRONTO!**
=======
# ⚡ COMANDOS RÁPIDOS - Deploy Completo

## 🚨 ATENÇÃO: Você está com erro "Failed to fetch"!

Isso significa que **o backend não está deployado**. Siga os passos abaixo:

---

## 🧪 PRIMEIRO: Teste se o Backend Está Funcionando

**Acesse a ferramenta de teste:**
```
http://localhost:5173/test-email.html
```

Isso vai te dizer:
- ✅ Se o backend está UP ou DOWN
- ✅ Se o email já está registrado
- ✅ Qual é o erro específico

📖 **Guia completo:** `TESTE_EMAIL.md`

---

## 1️⃣ INSTALAR SUPABASE CLI

```bash
npm install -g supabase
```

## 2️⃣ FAZER LOGIN NO SUPABASE

```bash
supabase login
```

## 3️⃣ LINKAR O PROJETO

```bash
supabase link --project-ref pwlacumydrxvshklvttp
```

> **Senha do banco**: Você encontra em Supabase Dashboard → Project Settings → Database

## 4️⃣ CRIAR A TABELA (VIA DASHBOARD)

1. Acesse: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/editor
2. Clique em **SQL Editor**
3. Cole e execute:

```sql
CREATE TABLE kv_store_c2a25be0 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

CREATE INDEX idx_kv_store_key_prefix ON kv_store_c2a25be0(key text_pattern_ops);
```

## 5️⃣ DEPLOY DO SERVIDOR

```bash
supabase functions deploy make-server-c2a25be0
```

## 6️⃣ TESTAR

```bash
curl https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/health
```

**Deve retornar:** `{"status":"ok"}`

---

## ✅ PRONTO!

Agora você pode:
1. Ir para `/signup` e criar uma conta
2. Fazer login em `/login`
3. Usar o dashboard do cliente

---

## 📚 DOCUMENTAÇÃO COMPLETA

- **Frontend (Netlify)**: `DEPLOY_GUIDE.md`
- **Backend (Supabase)**: `BACKEND_DEPLOY_GUIDE.md`

---

## 🐛 AINDA COM PROBLEMA?

Veja os logs:
```bash
supabase functions logs make-server-c2a25be0 --tail
```

Ou no Dashboard:
**Edge Functions** → **make-server-c2a25be0** → **Logs**
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
