# 🚀 COMO FAZER O DEPLOY - GUIA RÁPIDO

<<<<<<< HEAD
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
=======
## ✨ MÉTODO SUPER FÁCIL (Recomendado)

Escolha de acordo com seu sistema operacional:

### 🪟 **WINDOWS (PowerShell)**

1. **Abra o PowerShell** (clique com botão direito e escolha "Executar como Administrador")

2. **Cole este comando:**
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   ```

3. **Navegue até a pasta do projeto:**
   ```powershell
   cd C:\caminho\para\seu\projeto
   ```

4. **Execute o script:**
   ```powershell
   .\DEPLOY_SCRIPT.ps1
   ```

---

### 🍎 **MAC / LINUX (Terminal)**

1. **Abra o Terminal**

2. **Navegue até a pasta do projeto:**
   ```bash
   cd /caminho/para/seu/projeto
   ```

3. **Dê permissão de execução:**
   ```bash
   chmod +x DEPLOY_SCRIPT.sh
   ```

4. **Execute o script:**
   ```bash
   ./DEPLOY_SCRIPT.sh
   ```

---

## 🎯 O QUE O SCRIPT FAZ AUTOMATICAMENTE:

1. ✅ Instala o Supabase CLI (se necessário)
2. ✅ Faz login no Supabase (abre o navegador)
3. ✅ Conecta com seu projeto
4. ✅ Faz o deploy da Edge Function

## ⏱️ TEMPO ESTIMADO: 2-3 minutos

---

## 🆘 SE DER ERRO

### Erro: "supabase: command not found"

**Solução:** Instale manualmente o Supabase CLI:

```bash
# Windows (via npm)
npm install -g supabase

# Mac (via Homebrew)
brew install supabase/tap/supabase

# Linux (via npm)
npm install -g supabase
```

### Erro: "Failed to link project"

**Solução:** Execute manualmente:

```bash
supabase login
supabase link --project-ref lqpmyvizjfwzddxspacv
supabase functions deploy server --project-ref lqpmyvizjfwzddxspacv --no-verify-jwt
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
```

---

<<<<<<< HEAD
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
=======
## ✅ DEPOIS DO DEPLOY

1. **Teste a Edge Function:**
   ```bash
   curl https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health
   ```

   **Resposta esperada:**
   ```json
   {"status":"ok","message":"Server is running"}
   ```

2. **Recarregue o aplicativo** (F5)

3. **Faça login** e teste!

---

## 🎉 PRONTO!

Agora seu backend está rodando no Supabase e todas as funcionalidades devem funcionar:

- ✅ Login/Signup
- ✅ Upload de documentos
- ✅ Timeline
- ✅ Mensagens
- ✅ Dashboard admin
- ✅ Bookkeeping
- ✅ Relatórios financeiros

---

## 📞 PRECISA DE AJUDA?

Se ainda tiver problemas, me envie o **erro completo** que aparece no terminal!
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
