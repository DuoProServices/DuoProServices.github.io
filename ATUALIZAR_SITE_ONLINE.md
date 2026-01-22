# 🚀 ATUALIZAR SITE ONLINE - GUIA RÁPIDO

## ⚡ OPÇÃO 1: Script Automático (MAIS FÁCIL)

### **Windows:**
```bash
# Clique 2x no arquivo:
DEPLOY_AGORA.bat
```

### **Mac/Linux:**
```bash
# No terminal:
chmod +x DEPLOY_AGORA.sh
./DEPLOY_AGORA.sh
```

---

## 📝 OPÇÃO 2: Comandos Manuais

### **Passo a Passo:**

```bash
# 1. Fazer build
npm run build

# 2. Adicionar mudanças ao Git
git add .

# 3. Criar commit
git commit -m "Fix: Correções React Router e sitemap atualizado"

# 4. Enviar para GitHub
git push origin main
```

---

## ⏱️ QUANTO TEMPO DEMORA?

```
Build local:        ~30-60 segundos
Git push:           ~10-20 segundos
GitHub Pages:       ~2-3 minutos para atualizar
-------------------------------------------
TOTAL:              ~3-4 minutos
```

---

## ✅ COMO SABER SE FUNCIONOU?

### **1. Verifique o GitHub Actions:**

```
1. Vá para: https://github.com/duoproservices/duoproservices.github.io
2. Clique na aba "Actions"
3. Veja se o workflow está rodando (bolinha laranja)
4. Quando ficar verde ✓ = Deploy completo!
```

### **2. Teste o site:**

```
1. Aguarde 2-3 minutos após push
2. Abra: https://duoproservices.github.io
3. Pressione: Ctrl + Shift + R (limpar cache)
4. Verifique se as mudanças aparecem
```

---

## 🐛 POSSÍVEIS ERROS

### **Erro: "npm: command not found"**
```bash
# Instale o Node.js:
https://nodejs.org/

# Depois instale dependências:
npm install
```

### **Erro: "git: command not found"**
```bash
# Instale o Git:
https://git-scm.com/downloads
```

### **Erro: "Build failed"**
```bash
# Veja os erros específicos e me envie
# Ou tente:
rm -rf node_modules
npm install
npm run build
```

### **Erro: "Permission denied (publickey)"**
```bash
# Configure SSH no GitHub:
https://docs.github.com/en/authentication/connecting-to-github-with-ssh

# Ou use HTTPS:
git remote set-url origin https://github.com/duoproservices/duoproservices.github.io.git
```

### **Erro: "Nothing to commit"**
```bash
# Normal! Significa que não há mudanças
# O site já está atualizado
```

---

## 🔍 VERIFICAR SE ESTÁ ONLINE

### **Checklist:**

```
□ Build completou sem erros
□ Git push foi bem-sucedido
□ GitHub Actions mostrou ✓ verde
□ Aguardou 2-3 minutos
□ Limpou cache do navegador (Ctrl+Shift+R)
□ Site carrega sem erros
```

---

## 💡 DICAS

### **Sempre antes de fazer push:**
```bash
# Teste localmente primeiro:
npm run build
npm run preview
# Abra http://localhost:4173
# Teste se tudo funciona
```

### **Cache do navegador:**
```
Se não vê as mudanças:
1. Ctrl + Shift + R (hard refresh)
2. Ou abra em janela anônima
3. Ou limpe todo o cache do navegador
```

### **Ver o que mudou:**
```bash
git status          # Ver arquivos modificados
git diff           # Ver diferenças no código
git log --oneline -5  # Ver últimos commits
```

---

## 📊 MONITORAR DEPLOY

### **Em tempo real:**

```
1. GitHub: 
   https://github.com/duoproservices/duoproservices.github.io/actions

2. Vercel/Netlify (se configurado):
   Dashboard de deploy

3. Console do navegador (F12):
   Verifique se há erros
```

---

## 🎯 APÓS O DEPLOY

### **Teste estas páginas:**

```
✓ https://duoproservices.github.io/
✓ https://duoproservices.github.io/login
✓ https://duoproservices.github.io/signup
✓ https://duoproservices.github.io/dashboard
✓ https://duoproservices.github.io/admin
```

### **Verifique:**

```
□ Página carrega sem erros 404
□ Estilos (CSS) aplicados corretamente
□ Imagens carregam
□ Links funcionam
□ Formulários funcionam
□ Login/Signup funciona
```

---

## 🚨 EMERGÊNCIA - ROLLBACK

### **Se algo deu muito errado:**

```bash
# Voltar para commit anterior:
git log --oneline -5
git reset --hard <COMMIT-HASH>
git push -f origin main

# ⚠️ CUIDADO: Isso apaga mudanças recentes!
```

---

## ✅ PRONTO!

**Depois de rodar o deploy:**

1. ✅ Aguarde 2-3 minutos
2. ✅ Abra https://duoproservices.github.io
3. ✅ Pressione Ctrl+Shift+R
4. ✅ Teste o site
5. ✅ Reporte se funcionou!

---

**💬 Me avise quando terminar o deploy!**

**Perguntas?**
- Build deu erro?
- Push deu erro?
- Site não atualizou?

**Me envie a mensagem de erro e eu ajudo! 🚀**
