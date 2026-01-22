# 🚀 DEPLOY NO GITHUB PAGES - COMECE AQUI!

## 👋 BEM-VINDO!

Este projeto está **100% configurado** para fazer deploy no **GitHub Pages** gratuitamente!

**Sem Netlify, sem limites, sem custos!** ✨

---

## 📚 ESCOLHA SEU CAMINHO:

### **🏃‍♂️ QUERO DEPLOY RÁPIDO (5 minutos):**
→ Leia: `DEPLOY_RAPIDO_GITHUB.md`

**Resumo ultra rápido:**
1. Configure repo no GitHub
2. Ative GitHub Pages (Settings → Pages → Source: GitHub Actions)
3. Adicione Secrets (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
4. Faça `git push`
5. **PRONTO!** 🎉

---

### **📋 QUERO CHECKLIST COMPLETO:**
→ Leia: `✅_CHECKLIST_GITHUB_PAGES.md`

**Passo a passo visual com checkboxes:**
- [ ] Criar repositório
- [ ] Conectar Git
- [ ] Ativar Pages
- [ ] Adicionar Secrets
- [ ] Deploy!

---

### **📖 QUERO ENTENDER TUDO:**
→ Leia: `GITHUB_PAGES_SETUP.md`

**Guia completo incluindo:**
- Configuração detalhada
- Custom domain
- Troubleshooting
- Dicas pro
- FAQ

---

### **🗑️ QUERO REMOVER NETLIFY:**
→ Leia: `REMOVER_NETLIFY.md`

**Migração completa:**
- Como desconectar Netlify
- Arquivos que podem ser deletados
- Vantagens do GitHub Pages
- Checklist de migração

---

## ⚡ DEPLOY AGORA (3 comandos):

### **Se já tem Git configurado:**

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push
```

### **Se é a primeira vez:**

```bash
# 1. Configure o repositório (substitua SEU-USUARIO e SEU-REPO):
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main

# 2. Vá para GitHub e ative Pages:
# https://github.com/SEU-USUARIO/SEU-REPO/settings/pages
# Source: GitHub Actions ✅

# 3. Adicione Secrets:
# https://github.com/SEU-USUARIO/SEU-REPO/settings/secrets/actions
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY

# 4. Pronto! Acesse:
# https://SEU-USUARIO.github.io/SEU-REPO/
```

---

## 🎯 O QUE JÁ ESTÁ CONFIGURADO:

✅ **GitHub Actions workflow** (`.github/workflows/deploy.yml`)  
✅ **Vite config otimizado** (`vite.config.ts`)  
✅ **Scripts de deploy** (`deploy-github.bat` e `deploy-github.sh`)  
✅ **Arquivo .nojekyll** (evita problemas com Jekyll)  
✅ **Build otimizado** (chunks, sourcemap desabilitado)  

**VOCÊ SÓ PRECISA:**
1. Fazer push para GitHub
2. Ativar Pages
3. Adicionar Secrets

---

## 🌐 COMO VAI FUNCIONAR:

```
┌─────────────────┐
│  Você edita     │
│  o código       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  git push       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │ ← Build automático
│ executa build   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Pages    │ ← Site no ar!
│ publica site    │ ← SEU-USUARIO.github.io/REPO
└─────────────────┘
```

**Deploy automático a cada `git push`!** 🚀

---

## 📊 COMPARAÇÃO:

| Feature | GitHub Pages | Netlify Free |
|---------|-------------|--------------|
| **Bandwidth** | 100GB/mês | 100GB/mês |
| **Build minutes** | ♾️ Ilimitado | ⏱️ 300/mês |
| **Custo** | 🆓 Grátis | 🆓 Grátis* |
| **Bloqueio** | ❌ Nunca | ⚠️ Pode bloquear |
| **Setup** | ✅ Simples | ⚠️ Médio |

**Conclusão:** GitHub Pages é perfeito para seu projeto! ✨

---

## 🆘 PRECISA DE AJUDA?

### **Erros comuns:**

**❌ "Build Failed"**
→ Faltam secrets. Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

**❌ "404 Not Found"**
→ Settings → Pages → Source deve ser `GitHub Actions`

**❌ Página branca**
→ Abra Console (F12), veja erro, adicione secrets

### **Onde pedir ajuda:**
- 📖 Leia os guias completos
- 🔍 Veja logs em Actions
- 💬 GitHub Issues do projeto

---

## ✨ PRÓXIMOS PASSOS:

Depois do deploy:

1. ✅ Teste todas as páginas
2. ✅ Verifique login/signup
3. ✅ Teste upload de documentos
4. ✅ Configure custom domain (opcional)
5. ✅ Adicione Google Analytics (opcional)

---

## 🎉 COMEÇAR AGORA:

**👉 Escolha um dos guias acima e comece!**

**Ou execute agora:**

```bash
# Windows:
deploy-github.bat

# Mac/Linux:
chmod +x deploy-github.sh
./deploy-github.sh
```

---

**BOA SORTE COM SEU DEPLOY! 🚀**

*Criado em Janeiro 2026*
