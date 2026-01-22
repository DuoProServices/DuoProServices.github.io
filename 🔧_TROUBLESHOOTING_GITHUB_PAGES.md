# 🔧 TROUBLESHOOTING - GITHUB PAGES

## 🆘 PROBLEMAS COMUNS E SOLUÇÕES

---

## ❌ ERRO: "Build Failed"

### **Sintomas:**
- Actions tab mostra ❌ vermelho
- Deploy não completa
- Site não atualiza

### **Causas Possíveis:**

#### **1. Faltam Secrets (90% dos casos)**

**Solução:**
1. Vá para: `https://github.com/SEU-USUARIO/SEU-REPO/settings/secrets/actions`
2. Clique em **New repository secret**
3. Adicione:
   ```
   Nome: VITE_SUPABASE_URL
   Valor: https://seu-projeto.supabase.co
   
   Nome: VITE_SUPABASE_ANON_KEY
   Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Refaça o deploy:
   ```bash
   git commit --allow-empty -m "Trigger rebuild"
   git push
   ```

#### **2. Erro de TypeScript**

**Solução:**
```bash
# Teste localmente primeiro:
npm run build

# Se houver erros, corrija-os
# Depois faça push
```

#### **3. Dependências faltando**

**Solução:**
```bash
# Certifique-se que package-lock.json está commitado:
git add package-lock.json
git commit -m "Add package-lock"
git push
```

---

## ❌ ERRO: "404 Page Not Found"

### **Sintomas:**
- Acessa `SEU-USUARIO.github.io/SEU-REPO/`
- Vê página "404 Not Found" do GitHub

### **Causa:**
Source incorreto em Settings

### **Solução:**
1. Vá para: `https://github.com/SEU-USUARIO/SEU-REPO/settings/pages`
2. Em **Build and deployment**:
   - **Source**: Selecione `GitHub Actions` ⚠️
   - **NÃO** selecione "Deploy from a branch"
3. Aguarde 2-3 minutos
4. Acesse novamente

---

## ❌ ERRO: Página Branca

### **Sintomas:**
- Site carrega
- Mas mostra tela branca
- Nada aparece

### **Diagnóstico:**
1. Abra DevTools: `F12` (ou `Cmd+Option+I` no Mac)
2. Vá na aba **Console**
3. Veja os erros em vermelho

### **Soluções por tipo de erro:**

#### **Erro: "Failed to fetch"**
**Causa:** Faltam secrets do Supabase

**Solução:**
```
1. Adicione VITE_SUPABASE_URL nos Secrets
2. Adicione VITE_SUPABASE_ANON_KEY nos Secrets
3. Refaça deploy
```

#### **Erro: "Cannot read property of undefined"**
**Causa:** Erro no JavaScript

**Solução:**
```bash
# Teste localmente:
npm run dev

# Veja erro no console
# Corrija o código
# Faça push
```

#### **Erro: CSS não carrega**
**Causa:** Jekyll processando arquivos

**Solução:**
```bash
# Verifique se existe:
ls public/.nojekyll

# Se não existir, crie:
echo "" > public/.nojekyll
git add public/.nojekyll
git commit -m "Add .nojekyll"
git push
```

---

## ❌ ERRO: "Permission denied"

### **Sintomas:**
```bash
git push
# Permission denied (publickey)
```

### **Solução 1: Use HTTPS em vez de SSH**
```bash
git remote set-url origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push
```

### **Solução 2: Configure SSH keys**
```bash
# Gere nova chave SSH:
ssh-keygen -t ed25519 -C "seu-email@example.com"

# Adicione ao ssh-agent:
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copie a chave pública:
cat ~/.ssh/id_ed25519.pub

# Adicione no GitHub:
# Settings → SSH and GPG keys → New SSH key
```

---

## ❌ ERRO: Deploy demora muito

### **Sintomas:**
- Build fica rodando por mais de 10 minutos
- Nunca completa

### **Solução:**
1. Cancele o workflow atual:
   - Actions → Click no workflow rodando
   - Cancel workflow
   
2. Verifique se há loop infinito no código

3. Otimize build:
   ```bash
   # Limpe node_modules:
   rm -rf node_modules
   npm install
   
   # Teste build local:
   npm run build
   
   # Se funcionar, faça push
   ```

---

## ❌ ERRO: Mudanças não aparecem

### **Sintomas:**
- Fez push
- Build passou ✅
- Mas site mostra versão antiga

### **Solução 1: Limpe cache do navegador**
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### **Solução 2: Verifique timestamp**
1. Actions → Veja horário do último deploy
2. Espere 2-3 minutos após ✅ verde
3. Limpe cache e recarregue

### **Solução 3: Force rebuild**
```bash
git commit --allow-empty -m "Force rebuild"
git push
```

---

## ❌ ERRO: "gh-pages branch not found"

### **Sintomas:**
```
Error: No such branch: gh-pages
```

### **Solução:**
**IGNORE ISSO!** ✅

GitHub Pages com Actions **NÃO** usa branch `gh-pages`.

Certifique-se que:
- Settings → Pages → Source = `GitHub Actions` ✅
- **NÃO** = "Deploy from a branch"

---

## ❌ ERRO: Links quebrados (404 em rotas)

### **Sintomas:**
- Página inicial funciona
- Mas `/admin`, `/login` etc dão 404

### **Solução:**
GitHub Pages precisa de client-side routing.

**Verifique:**
1. Existe `dist/index.html` após build? ✅
2. O Vite config tem `base: './'`? ✅ (já configurado)
3. React Router está configurado? ✅ (já está)

**Se ainda não funciona:**
```bash
# Teste localmente:
npm run build
npm run preview

# Navegue para /admin, /login, etc
# Se funcionar local mas não no GitHub Pages,
# pode ser problema de base path
```

---

## 🔍 COMO DEBUGAR:

### **1. Veja logs completos do build:**
```
1. GitHub → Actions
2. Click no workflow com ❌
3. Click em "build"
4. Expanda cada step
5. Leia a mensagem de erro
```

### **2. Teste localmente primeiro:**
```bash
# Desenvolvimento:
npm run dev

# Build de produção:
npm run build

# Preview do build:
npm run preview
```

### **3. Compare com versão que funcionava:**
```bash
# Veja histórico:
git log --oneline

# Volte para commit anterior:
git checkout COMMIT-HASH

# Teste se funciona
# Se funcionar, veja o que mudou:
git diff COMMIT-HASH HEAD
```

---

## 📊 CHECKLIST DE VERIFICAÇÃO:

Antes de pedir ajuda, verifique:

- [ ] Settings → Pages → Source = `GitHub Actions`?
- [ ] Secrets adicionados (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)?
- [ ] Último workflow em Actions está ✅ verde?
- [ ] Arquivo `.github/workflows/deploy.yml` existe?
- [ ] `npm run build` funciona localmente?
- [ ] Console do navegador (F12) mostra algum erro?
- [ ] Limpou cache do navegador (Ctrl+Shift+R)?

---

## 🆘 AINDA COM PROBLEMAS?

### **Opção 1: Refazer do zero**
```bash
# Delete workflow antigo:
rm -rf .github/workflows/deploy.yml

# Recrie (arquivo já existe no projeto)
# Ou copie de um projeto que funciona

# Force push:
git add .
git commit -m "Reset workflow"
git push --force
```

### **Opção 2: Use template oficial**
1. GitHub → Actions → New workflow
2. Procure "Static HTML"
3. Configure → Commit

### **Opção 3: Deploy manual**
```bash
# Build localmente:
npm run build

# Suba dist/ manualmente:
# (Use GitHub UI para upload de arquivos)
```

---

## 📞 RECURSOS ÚTEIS:

- **Docs oficiais:** https://docs.github.com/pages
- **Actions docs:** https://docs.github.com/actions
- **Vite docs:** https://vitejs.dev/guide/static-deploy
- **GitHub Status:** https://www.githubstatus.com/

---

## 💡 DICAS DE PREVENÇÃO:

### **✅ Sempre teste localmente:**
```bash
npm run build
npm run preview
```

### **✅ Use commits pequenos:**
```bash
# Boa prática:
git add src/componente.tsx
git commit -m "Fix: corrige bug no componente"
git push

# Ruim:
git add .
git commit -m "Mudanças"
git push
```

### **✅ Monitore Actions:**
- Ative notificações de email para builds failed
- Settings → Notifications → Actions

### **✅ Mantenha dependências atualizadas:**
```bash
npm outdated
npm update
```

---

## ✅ VERIFICAÇÃO FINAL:

Se tudo estiver OK:

- ✅ Actions mostra ✅ verde
- ✅ Site carrega em `SEU-USUARIO.github.io/SEU-REPO/`
- ✅ Console sem erros (F12)
- ✅ Login funciona
- ✅ Upload de documentos funciona
- ✅ Todas as rotas funcionam

**PARABÉNS! 🎉 Seu deploy está perfeito!**

---

**Última atualização:** Janeiro 2026
