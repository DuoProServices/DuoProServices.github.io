# ⚡ SOLUÇÃO RÁPIDA - COPIAR & COLAR

## 🎯 O que você precisa fazer AGORA

O erro "Failed to fetch" acontece porque **você precisa fazer o deploy do Edge Function**.

Eu **NÃO CONSIGO** fazer o deploy por você - você precisa executar comandos no SEU computador.

---

## 📍 OPÇÃO 1: Usar o Script Node.js (MAIS FÁCIL)

Abra o terminal na pasta do projeto e execute:

```bash
node copy-files.js
```

Isso vai copiar todos os arquivos automaticamente!

Depois execute:

```bash
npm install -g supabase
supabase login
supabase link --project-ref pwlacumydrxvshklvttp
supabase functions deploy make-server-c2a25be0
```

---

## 📍 OPÇÃO 2: Copiar Manualmente

Se o script não funcionar, execute estes comandos:

```bash
# Navegue até a pasta do projeto
cd /caminho/do/seu/projeto

# Copie TODOS os arquivos .tsx e .ts
cp supabase/functions/server/*.tsx supabase/functions/make-server-c2a25be0/
cp supabase/functions/server/*.ts supabase/functions/make-server-c2a25be0/

# Se houver pasta de templates
cp -r supabase/functions/server/email-templates supabase/functions/make-server-c2a25be0/ 2>/dev/null

# Renomeie o arquivo principal
mv supabase/functions/make-server-c2a25be0/index.tsx supabase/functions/make-server-c2a25be0/index.ts

# Agora faça o deploy
supabase functions deploy make-server-c2a25be0
```

---

## 📍 OPÇÃO 3: Deploy via Supabase Dashboard (SEM CLI)

Se você não conseguir usar o CLI, pode tentar via Dashboard:

### ⚠️ LIMITAÇÃO: O dashboard só aceita UM arquivo

1. Acesse: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/functions
2. Clique em "New Function"
3. Nome: `make-server-c2a25be0`
4. **PROBLEMA:** Você precisaria combinar TODOS os arquivos em um só

**Isso é MUITO TRABALHOSO**, por isso o CLI é recomendado.

---

## 🚨 IMPORTANTE

**EU NÃO POSSO fazer o deploy por você!**

Os comandos precisam ser executados no **SEU computador**, não no Figma Make.

O Figma Make é apenas para **desenvolver** o código. O **deploy** precisa ser feito por você usando:
- **Supabase CLI** (terminal no seu computador), OU
- **Supabase Dashboard** (browser)

---

## ✅ Depois do Deploy

Quando você terminar o deploy:

1. Volte ao site (preview)
2. Clique no botão "🧪 Test Server"
3. Execute os testes
4. **Deve ficar VERDE!**

---

## 💬 Me diga depois:

1. **"Estou tentando executar os comandos"** - e me mostre qual erro apareceu
2. **"Funcionou!"** - se conseguir fazer o deploy

---

## 📚 Arquivos que criei para ajudar

Todos esses arquivos têm o mesmo objetivo - ensinar você a fazer o deploy:

1. `copy-files.js` - Script Node.js para copiar arquivos
2. `prepare-deploy.sh` - Script Bash para copiar arquivos  
3. `INSTRUCOES_SIMPLES.md` - Guia passo a passo detalhado
4. `COMO_FAZER_DEPLOY.md` - Guia rápido
5. `DEPLOY_INSTRUCTIONS.md` - Guia técnico completo
6. `README_DEPLOY.md` - Índice de todos os guias

---

## 🎯 RESUMO ULTRA-CURTO

```bash
# 1. Instalar CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Linkar projeto
supabase link --project-ref pwlacumydrxvshklvttp

# 4. Copiar arquivos (use o script ou comandos manuais acima)
node copy-files.js

# 5. Deploy!
supabase functions deploy make-server-c2a25be0
```

**Pronto!** 🚀
