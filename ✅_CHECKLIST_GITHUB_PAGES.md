# ✅ CHECKLIST - DEPLOY GITHUB PAGES

## 📋 ANTES DE COMEÇAR:

- [ ] Você tem uma conta no GitHub?
- [ ] Você tem Git instalado? (teste com `git --version`)
- [ ] Você tem Node.js instalado? (teste com `node --version`)

---

## 🔧 CONFIGURAÇÃO INICIAL (1x apenas):

### **1. Criar repositório no GitHub:**
- [ ] Vá para: https://github.com/new
- [ ] Nome do repositório: `duopro-services` (ou outro nome)
- [ ] Deixe **PUBLIC** ✅
- [ ] NÃO marque "Add README"
- [ ] Clique em **Create repository**

### **2. Conectar seu código ao GitHub:**

```bash
# Execute estes comandos na pasta do projeto:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```

- [ ] Código enviado para GitHub?
- [ ] Vê os arquivos em `https://github.com/SEU-USUARIO/SEU-REPO`?

### **3. Ativar GitHub Pages:**
- [ ] Vá para: `https://github.com/SEU-USUARIO/SEU-REPO/settings/pages`
- [ ] Em **Build and deployment**:
  - [ ] **Source**: Selecione `GitHub Actions` ⚠️ IMPORTANTE!
- [ ] Vê a mensagem de confirmação?

### **4. Adicionar Secrets (Variáveis do Supabase):**
- [ ] Vá para: `https://github.com/SEU-USUARIO/SEU-REPO/settings/secrets/actions`
- [ ] Clique em **New repository secret**
- [ ] Adicione:
  - [ ] `VITE_SUPABASE_URL` = Sua URL do Supabase
  - [ ] `VITE_SUPABASE_ANON_KEY` = Sua chave pública

---

## 🚀 PRIMEIRO DEPLOY:

### **Opção A: Automático (Recomendado)**
```bash
# Windows:
deploy-github.bat

# Mac/Linux:
chmod +x deploy-github.sh
./deploy-github.sh
```

### **Opção B: Manual**
```bash
git add .
git commit -m "Primeiro deploy"
git push
```

- [ ] Deploy iniciado?
- [ ] Vá para Actions: `https://github.com/SEU-USUARIO/SEU-REPO/actions`
- [ ] Workflow "Deploy to GitHub Pages" aparece?
- [ ] Status está ✅ verde? (aguarde 2-5 minutos)

---

## 🌐 ACESSAR SEU SITE:

- [ ] Vá para: `https://SEU-USUARIO.github.io/SEU-REPO/`
- [ ] Site carrega? 🎉

**Exemplo:**
- Usuário GitHub: `jamila-tax`
- Nome do repo: `duopro-services`  
- URL final: `https://jamila-tax.github.io/duopro-services/`

---

## ✅ VERIFICAÇÕES FINAIS:

- [ ] Página inicial carrega?
- [ ] Links funcionam?
- [ ] Imagens aparecem?
- [ ] Formulários funcionam?
- [ ] Login funciona?
- [ ] Console sem erros? (F12 → Console)

---

## 🔄 PRÓXIMOS DEPLOYS:

**É SUPER FÁCIL!** A cada mudança:

```bash
git add .
git commit -m "Descrição da mudança"
git push
```

**OU use o script:**
```bash
deploy-github.bat   # Windows
./deploy-github.sh  # Mac/Linux
```

---

## 🆘 TROUBLESHOOTING:

### ❌ Erro: "Build Failed"
**Causa:** Faltam secrets  
**Solução:** Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` nos Secrets

### ❌ Erro: "404 Page Not Found"
**Causa:** Source incorreto  
**Solução:** Settings → Pages → Source = `GitHub Actions`

### ❌ Página branca
**Causa:** Erro no JavaScript  
**Solução:** Abra Console (F12), veja erro, corrija código, faça push novamente

### ❌ CSS não carrega
**Causa:** Jekyll processando arquivos  
**Solução:** Verifique se `/public/.nojekyll` existe ✅ (já criado!)

### ❌ "Permission denied"
**Causa:** SSH keys não configuradas  
**Solução:** Use HTTPS em vez de SSH:
```bash
git remote set-url origin https://github.com/SEU-USUARIO/SEU-REPO.git
```

---

## 📊 MONITORAMENTO:

### **Ver logs de build:**
1. GitHub → Actions
2. Clique no workflow mais recente
3. Clique em "build" para ver detalhes

### **Ver métricas:**
- Settings → Pages → Ver estatísticas de visitantes (após configurar Google Analytics)

---

## 🎯 DICAS PRO:

### **Limpar cache ao testar:**
- `Ctrl + Shift + R` (Windows/Linux)
- `Cmd + Shift + R` (Mac)

### **Testar localmente antes de deploy:**
```bash
npm run dev
```
Acesse: `http://localhost:5173`

### **Preview do build localmente:**
```bash
npm run build
npm run preview
```

### **Deploy manual (via GitHub UI):**
1. Actions → Deploy to GitHub Pages
2. Run workflow → Run workflow
3. Aguarde conclusão

---

## 📞 SUPORTE:

- **Documentação oficial:** https://docs.github.com/pages
- **Guia completo:** Leia `GITHUB_PAGES_SETUP.md`
- **Deploy rápido:** Leia `DEPLOY_RAPIDO_GITHUB.md`

---

## ✨ PRONTO!

**Seu site está no ar e funcionando 100% no GitHub Pages!** 🎉

**Sem custo, sem Netlify, deploy automático!** 🚀

---

**Última atualização:** Janeiro 2026
