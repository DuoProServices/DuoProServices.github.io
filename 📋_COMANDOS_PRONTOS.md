# 📋 COMANDOS PRONTOS - COPIAR E COLAR

## ⚡ PASSO 1: LIMPAR REPOSITÓRIO

### **Execute no terminal:**

```bash
limpar-repositorio.bat
```

**Aguarde ver:** `✅ LIMPEZA CONCLUÍDA!`

---

## 🚀 PASSO 2: PUSH PARA GITHUB

### **Se é a primeira vez:**

```bash
git init
git add .
git commit -m "Initial commit - Ready for GitHub Pages"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```

### **Se já tem repositório configurado:**

```bash
git push
```

---

## ⚙️ PASSO 3: CONFIGURAR GITHUB PAGES

### **No navegador, acesse:**

```
https://github.com/SEU-USUARIO/SEU-REPO/settings/pages
```

### **Configure:**
1. **Source**: Selecione `GitHub Actions`
2. Salve

---

## 🔑 PASSO 4: ADICIONAR SECRETS

### **No navegador, acesse:**

```
https://github.com/SEU-USUARIO/SEU-REPO/settings/secrets/actions
```

### **Adicione (clique "New repository secret"):**

**Secret 1:**
```
Name: VITE_SUPABASE_URL
Value: [Cole sua URL do Supabase aqui]
```

**Secret 2:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: [Cole sua chave pública do Supabase aqui]
```

---

## ✅ PASSO 5: VERIFICAR DEPLOY

### **No navegador, acesse:**

```
https://github.com/SEU-USUARIO/SEU-REPO/actions
```

### **Aguarde:**
- ⏳ Amarelo = Processando (2-5 min)
- ✅ Verde = Deploy OK!
- ❌ Vermelho = Erro (veja logs)

---

## 🌐 PASSO 6: ACESSAR SEU SITE

### **No navegador, acesse:**

```
https://SEU-USUARIO.github.io/SEU-REPO/
```

---

## 🔄 PRÓXIMOS DEPLOYS (SEMPRE):

```bash
git add .
git commit -m "Descrição da mudança"
git push
```

**Deploy automático!** 🎉

---

## 🆘 SE HOUVER ERRO:

### **Ver logs de erro:**

```
https://github.com/SEU-USUARIO/SEU-REPO/actions
```
Clique no workflow com ❌ → Clique em "build" → Veja o erro

### **Limpar cache do navegador:**

```
Ctrl + Shift + R   (Windows/Linux)
Cmd + Shift + R    (Mac)
```

### **Re-executar limpeza:**

```bash
limpar-repositorio.bat
git push
```

### **Force rebuild:**

```bash
git commit --allow-empty -m "Force rebuild"
git push
```

---

## 📊 VERIFICAÇÕES:

### **1. Ver status do Git:**

```bash
git status
```

**Esperado:** `nothing to commit, working tree clean`

### **2. Ver arquivos ignorados:**

```bash
git status --ignored
```

**Deve incluir:** `AppData/`, `node_modules/`, `dist/`

### **3. Testar build localmente:**

```bash
npm run build
```

**Esperado:** Build completo sem erros

### **4. Testar site localmente:**

```bash
npm run dev
```

**Acesse:** `http://localhost:5173`

---

## 🎯 COMANDOS DE DIAGNÓSTICO:

### **Ver histórico de commits:**

```bash
git log --oneline -10
```

### **Ver branches:**

```bash
git branch -a
```

### **Ver remote configurado:**

```bash
git remote -v
```

### **Ver diferenças não commitadas:**

```bash
git diff
```

### **Ver arquivos staged:**

```bash
git diff --cached
```

---

## 🛠️ COMANDOS DE CORREÇÃO:

### **Desfazer último commit (mantém mudanças):**

```bash
git reset --soft HEAD~1
```

### **Desfazer mudanças não commitadas:**

```bash
git restore .
```

### **Limpar arquivos não rastreados:**

```bash
git clean -fd
```

### **Re-aplicar .gitignore:**

```bash
git rm -r --cached .
git add .
git commit -m "Re-apply .gitignore"
git push
```

---

## 📦 COMANDOS NPM:

### **Instalar dependências:**

```bash
npm install
```

### **Atualizar dependências:**

```bash
npm update
```

### **Ver dependências desatualizadas:**

```bash
npm outdated
```

### **Limpar cache do npm:**

```bash
npm cache clean --force
```

---

## 🔐 ONDE ENCONTRAR SECRETS DO SUPABASE:

### **1. Acesse seu projeto no Supabase:**

```
https://supabase.com/dashboard/project/SEU-PROJETO
```

### **2. Vá em Settings → API:**

```
Project URL: https://seu-projeto.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **3. Copie os valores:**

- `VITE_SUPABASE_URL` = Project URL
- `VITE_SUPABASE_ANON_KEY` = anon public key

---

## 📝 TEMPLATE DE COMMIT MESSAGES:

```bash
# Nova feature:
git commit -m "feat: Adiciona sistema de pagamento"

# Correção de bug:
git commit -m "fix: Corrige erro no upload de documentos"

# Melhoria:
git commit -m "refactor: Otimiza performance do dashboard"

# Documentação:
git commit -m "docs: Atualiza README com instruções de deploy"

# Estilo/formatação:
git commit -m "style: Ajusta espaçamento do header"

# Limpeza:
git commit -m "chore: Remove arquivos não utilizados"
```

---

## 🎉 COMANDOS DE CELEBRAÇÃO:

### **Quando o deploy funcionar:**

```bash
echo "🎉 SITE NO AR!"
echo "Acesse: https://SEU-USUARIO.github.io/SEU-REPO/"
```

---

## 📋 CHECKLIST FINAL:

```bash
# ✅ Executar cada comando na ordem:

# 1. Limpar
limpar-repositorio.bat

# 2. Push
git push

# 3. Configurar Pages (manual no navegador)

# 4. Adicionar Secrets (manual no navegador)

# 5. Verificar Actions (manual no navegador)

# 6. Acessar site (manual no navegador)

# 7. Celebrar! 🎉
```

---

## 💡 ATALHOS ÚTEIS:

```bash
# Status rápido:
git status

# Add + Commit + Push:
git add . && git commit -m "Update" && git push

# Ver último commit:
git show

# Abrir GitHub no navegador:
start https://github.com/SEU-USUARIO/SEU-REPO

# Abrir Actions:
start https://github.com/SEU-USUARIO/SEU-REPO/actions

# Abrir site:
start https://SEU-USUARIO.github.io/SEU-REPO/
```

---

**📌 SALVE ESTE ARQUIVO COMO FAVORITO!**

Você vai usar esses comandos sempre! 🚀
