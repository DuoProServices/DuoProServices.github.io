# 🎯 COMO CONECTAR SEU PROJETO AO SUPABASE
## Guia Visual Passo a Passo

---

## 📍 **ONDE VOCÊ ESTÁ AGORA:**

```
┌─────────────────────────────────────────┐
│  💻 SEU COMPUTADOR                      │
│                                         │
│  ✅ Código do Frontend (React)          │
│  ✅ Código do Backend (Edge Function)   │
│  ❌ Backend NÃO deployado               │
│                                         │
│  Status: DESCONECTADO                   │
└─────────────────────────────────────────┘
              ↓
              ↓ PRECISA CONECTAR
              ↓
┌─────────────────────────────────────────┐
│  ☁️  SUPABASE CLOUD                     │
│                                         │
│  ✅ Projeto criado                      │
│  ✅ Banco de dados ativo                │
│  ❌ Backend não está lá ainda           │
│                                         │
│  Status: ESPERANDO O DEPLOY             │
└─────────────────────────────────────────┘
```

---

## 🎯 **OBJETIVO:**

Conectar seu código local ao Supabase Cloud para poder fazer deploy.

---

## 🚀 **MÉTODO AUTOMÁTICO (RECOMENDADO)**

### **1️⃣ Abra o terminal na pasta do projeto**

```
📂 DuoProServices/
   ├── src/
   ├── supabase/
   ├── package.json
   └── CONECTAR_SUPABASE.sh  ← VOCÊ ESTÁ AQUI
```

### **2️⃣ Execute o script:**

```bash
bash CONECTAR_SUPABASE.sh
```

### **3️⃣ Siga as instruções na tela:**

```
🔗 =====================================
   CONECTAR PROJETO AO SUPABASE
===================================== 🔗

📦 Verificando Supabase CLI...
✅ Supabase CLI já instalado

🔐 =====================================
   PASSO 1: LOGIN NO SUPABASE
===================================== 🔐

Isso vai abrir o navegador...
Pressione ENTER para continuar...
```

### **4️⃣ O navegador vai abrir:**

```
┌────────────────────────────────────┐
│  🌐 NAVEGADOR                      │
│                                    │
│  ┌──────────────────────────────┐ │
│  │  Supabase Login              │ │
│  │                              │ │
│  │  Email: ________________     │ │
│  │  Senha: ________________     │ │
│  │                              │ │
│  │  [  LOGIN  ]                 │ │
│  └──────────────────────────────┘ │
│                                    │
│  Depois do login:                  │
│  [  AUTHORIZE CLI  ]  ← CLIQUE    │
└────────────────────────────────────┘
```

### **5️⃣ Volte ao terminal:**

```
✅ Login realizado com sucesso!

🔗 =====================================
   PASSO 2: CONECTAR AO PROJETO
===================================== 🔗

📋 Project ID detectado: pwlacumydrxvshklvttp

Conectando ao projeto...
Enter your database password: _______
```

### **6️⃣ Digite a senha do banco**

**💡 Não lembra?**
1. Abra: https://supabase.com/dashboard
2. Seu projeto → **Settings** → **Database**
3. **Reset database password**

### **7️⃣ SUCESSO!**

```
✅ Projeto conectado com sucesso!

🎉 =====================================
   CONEXÃO CONCLUÍDA!
===================================== 🎉

✅ Tudo pronto!

📋 Próximos passos:
   1. Execute: ./DEPLOY_AGORA.sh
   2. Ou manualmente: supabase functions deploy server

🚀 Pronto para fazer deploy!
```

---

## 🛠️ **MÉTODO MANUAL**

### **PASSO 1: Instalar Supabase CLI**

#### **macOS:**
```bash
brew install supabase/tap/supabase
```

#### **Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/supabase/cli/main/install.sh | sh
```

#### **Windows (PowerShell como Admin):**
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**✅ Verificar:**
```bash
supabase --version
```

---

### **PASSO 2: Fazer Login**

```bash
supabase login
```

**Fluxo:**
```
Terminal → Abre navegador → Faz login → Autoriza → Volta ao terminal
```

---

### **PASSO 3: Pegar o Project ID**

#### **Opção A - No Dashboard Web:**

1. **Acesse:** https://supabase.com/dashboard

2. **Abra seu projeto:**
   ```
   Dashboard
     └── Seus Projetos
          └── DuoProServices  ← CLIQUE AQUI
   ```

3. **Vá em Settings:**
   ```
   ⚙️ Settings (canto inferior esquerdo)
     └── General
          └── Project Settings
               └── Reference ID: pwlacumydrxvshklvttp
   ```

4. **Copie o Reference ID**

#### **Opção B - No código local:**

```bash
cat utils/supabase/info.tsx | grep projectId
```

Vai mostrar:
```typescript
export const projectId = "pwlacumydrxvshklvttp";
```

O ID é: `pwlacumydrxvshklvttp`

---

### **PASSO 4: Conectar**

```bash
supabase link --project-ref pwlacumydrxvshklvttp
```

**⚠️ TROQUE** `pwlacumydrxvshklvttp` pelo SEU Project ID!

**Vai pedir:**
```
Enter your database password: 
```

Digite a senha e pressione ENTER.

---

### **PASSO 5: Verificar**

```bash
supabase projects list
```

**Deve mostrar:**
```
┌────────────┬──────────────┬──────────────────┐
│ ORG        │ NAME         │ REFERENCE ID     │
├────────────┼──────────────┼──────────────────┤
│ Sua Org    │ Seu Projeto  │ pwlacumyd...     │
└────────────┴──────────────┴──────────────────┘

Linked project: pwlacumydrxvshklvttp
```

**✅ VIU ISSO? PERFEITO!**

---

## 📊 **DIAGRAMA DO PROCESSO:**

```
┌─────────────────────────────────────────────────┐
│  PASSO 1: INSTALAR CLI                          │
│  ┌──────────────────────────────────────────┐   │
│  │ brew install supabase/tap/supabase       │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  PASSO 2: LOGIN                                 │
│  ┌──────────────────────────────────────────┐   │
│  │ supabase login                           │   │
│  │ → Abre navegador                         │   │
│  │ → Faz login                              │   │
│  │ → Autoriza CLI                           │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  PASSO 3: PEGAR PROJECT ID                      │
│  ┌──────────────────────────────────────────┐   │
│  │ Dashboard → Settings → General           │   │
│  │ Reference ID: pwlacumydrxvshklvttp       │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  PASSO 4: CONECTAR                              │
│  ┌──────────────────────────────────────────┐   │
│  │ supabase link --project-ref SEU_ID       │   │
│  │ Enter database password: ***             │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  PASSO 5: VERIFICAR                             │
│  ┌──────────────────────────────────────────┐   │
│  │ supabase projects list                   │   │
│  │ ✅ Mostra tabela com seu projeto         │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                    ↓
               ✅ CONECTADO!
```

---

## ⚠️ **TROUBLESHOOTING:**

### **❌ "command not found: supabase"**

**Causa:** CLI não instalado  
**Solução:**
```bash
brew install supabase/tap/supabase
```

---

### **❌ "Not logged in"**

**Causa:** Não fez login  
**Solução:**
```bash
supabase login
```

---

### **❌ "Invalid project reference"**

**Causa:** Project ID errado  
**Solução:**
1. Verifique no Dashboard: Settings → General → Reference ID
2. Ou no código: `cat utils/supabase/info.tsx | grep projectId`
3. Use o ID correto

---

### **❌ "Database password incorrect"**

**Causa:** Senha errada  
**Solução:**
1. Acesse: https://supabase.com/dashboard
2. Seu projeto → Settings → Database
3. Clique em "Reset database password"
4. Defina nova senha (ANOTE!)
5. Tente conectar novamente

---

### **❌ "Project already linked"**

**Causa:** Tentou linkar 2 vezes  
**Solução:**
```bash
# Desconecta
supabase unlink

# Conecta novamente
supabase link --project-ref SEU_PROJECT_ID
```

---

### **❌ Navegador não abre no login**

**Causa:** CLI não consegue abrir navegador  
**Solução:**
```bash
# Usa modo manual
supabase login --no-browser

# Vai mostrar um link
# Copie e abra manualmente no navegador
```

---

## ✅ **CHECKLIST FINAL:**

Antes de fazer deploy, confirme:

```
[ ] CLI instalado?
    → Execute: supabase --version
    → Deve mostrar versão (ex: 1.200.3)

[ ] Login feito?
    → Execute: supabase projects list
    → Não deve dar erro de "not logged in"

[ ] Projeto conectado?
    → Execute: supabase projects list
    → Deve mostrar seu projeto na lista

[ ] Arquivos do backend existem?
    → Execute: ls supabase/functions/server/
    → Deve mostrar: index.tsx

[ ] Project ID correto?
    → No código: cat utils/supabase/info.tsx
    → No link: .supabase/config.toml
    → Devem ser iguais
```

**✅ TUDO OK? FAÇA O DEPLOY!**

```bash
bash DEPLOY_AGORA.sh
```

---

## 🎉 **APÓS CONECTAR:**

```
ANTES:
┌─────────────┐         ┌─────────────┐
│ SEU PC      │    ❌    │  SUPABASE   │
│ (código)    │ ─────── │   (cloud)   │
└─────────────┘         └─────────────┘
  Desconectado

DEPOIS:
┌─────────────┐         ┌─────────────┐
│ SEU PC      │    ✅    │  SUPABASE   │
│ (código)    │ ═══════ │   (cloud)   │
└─────────────┘         └─────────────┘
  Conectado e pronto para deploy!
```

---

## 📚 **RECURSOS ÚTEIS:**

### **Documentação:**
- CLI: https://supabase.com/docs/guides/cli
- Edge Functions: https://supabase.com/docs/guides/functions

### **Comandos úteis:**
```bash
# Ver projetos
supabase projects list

# Ver status
supabase status

# Ver logs
supabase functions logs server

# Fazer deploy
supabase functions deploy server
```

---

**🚀 PRONTO PARA CONECTAR?**

**MÉTODO RÁPIDO:**
```bash
bash CONECTAR_SUPABASE.sh
```

**MÉTODO MANUAL:**
```bash
supabase login
supabase link --project-ref SEU_PROJECT_ID
supabase projects list
```

**Depois:**
```bash
bash DEPLOY_AGORA.sh
```

---

**✅ Quando conectar com sucesso, me avise para te ajudar com o deploy!** 🎉
