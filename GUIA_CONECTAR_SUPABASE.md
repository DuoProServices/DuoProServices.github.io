# 🔗 GUIA COMPLETO: CONECTAR PROJETO LOCAL AO SUPABASE

## 📋 **O QUE VOCÊ VAI FAZER:**
Conectar seu projeto local ao seu projeto no Supabase Cloud para poder fazer deploy das Edge Functions.

---

## 🚀 **MÉTODO RÁPIDO (Automático)**

### **1. Execute o script automático:**

```bash
bash CONECTAR_SUPABASE.sh
```

**O script vai:**
- ✅ Verificar se Supabase CLI está instalado
- ✅ Instalar se necessário
- ✅ Fazer login no Supabase
- ✅ Conectar ao seu projeto automaticamente
- ✅ Verificar a conexão

### **2. Siga as instruções na tela:**
- Quando pedir, faça login no navegador
- Confirme o Project ID
- Pronto! ✅

---

## 🛠️ **MÉTODO MANUAL (Passo a Passo)**

Se preferir fazer manualmente, siga estes passos:

### **PASSO 1: Instalar Supabase CLI**

#### **No macOS:**
```bash
brew install supabase/tap/supabase
```

#### **No Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/supabase/cli/main/install.sh | sh
```

#### **No Windows:**
1. Baixe o instalador: https://supabase.com/docs/guides/cli/getting-started
2. Ou use Scoop:
   ```powershell
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   ```

#### **Verificar instalação:**
```bash
supabase --version
```

Deve mostrar algo como: `1.200.3` ou superior

---

### **PASSO 2: Login no Supabase**

```bash
supabase login
```

**O que vai acontecer:**
1. Vai abrir uma página no navegador
2. Faça login com sua conta Supabase
3. Autorize o CLI
4. Volte ao terminal - deve mostrar "✅ Logged in"

**Se der erro:**
```bash
# Tente o login alternativo com token
supabase login --token YOUR_ACCESS_TOKEN
```

Para obter o token:
1. Acesse: https://supabase.com/dashboard/account/tokens
2. Clique em "Generate New Token"
3. Copie o token
4. Use no comando acima

---

### **PASSO 3: Conectar ao Projeto**

Primeiro, você precisa do **Project Reference ID**:

#### **Como encontrar o Project ID:**

1. **Opção A - Via Dashboard:**
   - Acesse: https://supabase.com/dashboard
   - Abra seu projeto
   - Vá em: **Settings** → **General**
   - Procure por "Reference ID"
   - Copie o ID (ex: `pwlacumydrxvshklvttp`)

2. **Opção B - No seu código:**
   - Está no arquivo `/utils/supabase/info.tsx`
   - Procure por: `projectId = "pwlacumydrxvshklvttp"`

#### **Fazer o link:**

```bash
supabase link --project-ref pwlacumydrxvshklvttp
```

**Substitua** `pwlacumydrxvshklvttp` pelo seu Project ID real!

**O que vai pedir:**
```
Enter your database password:
```

Digite a senha do banco de dados que você definiu quando criou o projeto Supabase.

**Se não lembrar a senha:**
1. Vá no Dashboard: https://supabase.com/dashboard
2. Settings → Database
3. "Reset database password"

---

### **PASSO 4: Verificar Conexão**

```bash
supabase projects list
```

Deve mostrar:
```
┌──────────────────────────┬────────────────────┬─────────────────┐
│ ORGANIZATION             │ NAME               │ REFERENCE ID    │
├──────────────────────────┼────────────────────┼─────────────────┤
│ Your Org                 │ DuoProServices     │ pwlacumyd...    │
└──────────────────────────┴────────────────────┴─────────────────┘
```

✅ **Sucesso!** Seu projeto está conectado!

---

## 🎯 **ESTRUTURA DE PASTAS CRIADA:**

Depois de conectar, você vai ter:

```
seu-projeto/
├── .supabase/
│   └── config.toml          ← Configuração do link
├── supabase/
│   ├── functions/
│   │   └── server/
│   │       └── index.tsx    ← Sua Edge Function
│   └── config.toml          ← Configurações gerais
└── ...
```

---

## 🔍 **COMANDOS ÚTEIS:**

### **Ver projetos conectados:**
```bash
supabase projects list
```

### **Ver status do link:**
```bash
supabase status
```

### **Desconectar projeto:**
```bash
supabase unlink
```

### **Reconectar:**
```bash
supabase link --project-ref SEU_PROJECT_ID
```

---

## ⚠️ **PROBLEMAS COMUNS:**

### **Erro: "Supabase CLI not found"**
**Solução:** Instale o CLI (Passo 1)

### **Erro: "Not logged in"**
**Solução:**
```bash
supabase login
```

### **Erro: "Invalid project reference"**
**Solução:**
- Verifique se o Project ID está correto
- Copie do Dashboard ou do arquivo `info.tsx`

### **Erro: "Database password incorrect"**
**Solução:**
1. Reset a senha no Dashboard
2. Settings → Database → Reset password
3. Tente conectar novamente

### **Erro: "Project already linked"**
**Solução:**
```bash
supabase unlink
supabase link --project-ref SEU_PROJECT_ID
```

---

## 📊 **CHECKLIST DE CONEXÃO:**

Antes de fazer deploy, verifique:

- [ ] Supabase CLI instalado (`supabase --version`)
- [ ] Login feito (`supabase login`)
- [ ] Projeto conectado (`supabase projects list`)
- [ ] Edge Function existe (`ls supabase/functions/server/index.tsx`)
- [ ] Project ID correto no código

---

## 🎉 **PRÓXIMO PASSO:**

Agora que está conectado, você pode fazer deploy:

### **Opção 1: Script automático**
```bash
bash DEPLOY_AGORA.sh
```

### **Opção 2: Comando manual**
```bash
supabase functions deploy server
```

---

## 💡 **DICAS:**

### **Para ver logs da Edge Function:**
```bash
supabase functions logs server
```

### **Para testar localmente antes de deployar:**
```bash
supabase functions serve server
```

### **Para ver variáveis de ambiente:**
```bash
supabase secrets list
```

### **Para adicionar segredos (API keys, etc):**
```bash
supabase secrets set MY_SECRET=value
```

---

## 🔐 **SEGURANÇA:**

### **Arquivos que NÃO devem ir pro Git:**
```
.supabase/          ← Configurações locais
.env.local          ← Variáveis de ambiente
.env                ← Segredos
```

### **Já está no `.gitignore`:**
```gitignore
.supabase/
.env.local
.env
```

✅ Você está seguro!

---

## 📞 **AJUDA:**

### **Documentação oficial:**
- CLI: https://supabase.com/docs/guides/cli
- Edge Functions: https://supabase.com/docs/guides/functions

### **Comunidade:**
- Discord: https://discord.supabase.com
- GitHub: https://github.com/supabase/supabase

### **Suporte direto:**
- Dashboard: https://supabase.com/dashboard/support

---

## 🎯 **RESUMO RÁPIDO:**

```bash
# 1. Instalar CLI
brew install supabase/tap/supabase  # macOS

# 2. Login
supabase login

# 3. Conectar
supabase link --project-ref pwlacumydrxvshklvttp

# 4. Verificar
supabase projects list

# 5. Deploy!
bash DEPLOY_AGORA.sh
```

---

**✅ Pronto para fazer deploy!** 🚀

Quando conectar com sucesso, volte aqui e me avise para eu te ajudar com o próximo passo!
