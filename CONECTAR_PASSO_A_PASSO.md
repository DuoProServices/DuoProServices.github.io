# 🎯 CONECTAR AO SUPABASE - SIMPLES E DIRETO

## 📺 **3 COMANDOS E PRONTO!**

---

## 🚀 **PASSO 1: Instalar Supabase CLI**

### **Copie e cole no terminal:**

#### **Se você usa macOS:**
```bash
brew install supabase/tap/supabase
```

#### **Se você usa Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/supabase/cli/main/install.sh | sh
```

#### **Se você usa Windows (PowerShell):**
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### **✅ Verificar se funcionou:**
```bash
supabase --version
```

Deve mostrar algo como: `1.200.3`

---

## 🔐 **PASSO 2: Fazer Login**

### **Copie e cole:**
```bash
supabase login
```

**O que vai acontecer:**
1. ✅ Abre o navegador automaticamente
2. ✅ Faça login com sua conta Supabase
3. ✅ Clique em "Authorize"
4. ✅ Volte ao terminal

**Deve aparecer:**
```
✔ Logged in.
```

---

## 🔗 **PASSO 3: Conectar ao Projeto**

### **⚠️ IMPORTANTE: Pegue seu Project ID primeiro!**

#### **Como encontrar:**

**Opção A - No Dashboard:**
1. Acesse: https://supabase.com/dashboard
2. Abra seu projeto
3. Clique em **⚙️ Settings** (canto inferior esquerdo)
4. Clique em **General**
5. Procure: "Reference ID"
6. Copie o código (ex: `pwlacumydrxvshklvttp`)

**Opção B - No código:**
- Abra: `/utils/supabase/info.tsx`
- Procure a linha: `export const projectId = "pwlacumydrxvshklvttp";`
- O ID é: `pwlacumydrxvshklvttp`

### **Agora conecte:**

```bash
supabase link --project-ref pwlacumydrxvshklvttp
```

**⚠️ SUBSTITUA** `pwlacumydrxvshklvttp` pelo **SEU** Project ID!

### **Vai pedir a senha do banco:**
```
Enter your database password:
```

**Digite a senha** que você criou quando fez o projeto Supabase.

**🔑 Não lembra a senha?**
1. Vá em: https://supabase.com/dashboard
2. Seu projeto → **Settings** → **Database**
3. Clique em **"Reset database password"**
4. Defina nova senha
5. Use essa senha aqui

---

## ✅ **VERIFICAR SE CONECTOU:**

```bash
supabase projects list
```

**Deve mostrar uma tabela:**
```
┌──────────┬──────────────┬────────────────┐
│ ORG      │ NAME         │ REFERENCE ID   │
├──────────┼──────────────┼────────────────┤
│ Seu Org  │ Seu Projeto  │ pwlacumyd...   │
└──────────┴──────────────┴────────────────┘
```

**✅ VIU A TABELA? SUCESSO!**

---

## 🎉 **PRONTO! CONECTADO!**

Agora você pode fazer deploy:

```bash
bash DEPLOY_AGORA.sh
```

Ou manualmente:

```bash
supabase functions deploy server
```

---

## ⚠️ **PROBLEMAS?**

### **Erro: "command not found: supabase"**
➜ Volte ao Passo 1 e instale o CLI

### **Erro: "Not logged in"**
➜ Execute: `supabase login`

### **Erro: "Invalid project reference"**
➜ Verifique se o Project ID está correto (dashboard ou info.tsx)

### **Erro: "Password incorrect"**
➜ Reset a senha no Dashboard: Settings → Database → Reset password

### **O navegador não abre no login?**
➜ Use: `supabase login --no-browser`
➜ Copie o link que aparecer e abra manualmente

---

## 📋 **RESUMO ULTRA-RÁPIDO:**

```bash
# 1️⃣ Instalar
brew install supabase/tap/supabase

# 2️⃣ Login
supabase login

# 3️⃣ Conectar (TROQUE O ID PELO SEU!)
supabase link --project-ref SEU_PROJECT_ID_AQUI

# 4️⃣ Verificar
supabase projects list

# 5️⃣ Deploy
bash DEPLOY_AGORA.sh
```

---

## 🎯 **CHECKLIST:**

Antes de fazer deploy, confirme:

- [ ] ✅ CLI instalado (`supabase --version` funciona)
- [ ] ✅ Login feito (mostrou "Logged in")
- [ ] ✅ Projeto conectado (`supabase projects list` mostra seu projeto)
- [ ] ✅ Senha do banco correta
- [ ] ✅ Project ID correto

**Tudo OK? FAÇA O DEPLOY!** 🚀

---

**Ainda com dúvida? Leia o guia completo:** `GUIA_CONECTAR_SUPABASE.md`

**Ou use o script automático:** `bash CONECTAR_SUPABASE.sh`
