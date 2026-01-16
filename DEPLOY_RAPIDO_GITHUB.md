# 🚀 DEPLOY RÁPIDO - GITHUB PAGES

## ⚡ 3 PASSOS SIMPLES:

### **1️⃣ Configure o repositório GitHub** (só uma vez)

```bash
# Se ainda não tem repositório:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

### **2️⃣ Ative GitHub Pages** (só uma vez)

1. Vá para: `https://github.com/SEU-USUARIO/SEU-REPOSITORIO/settings/pages`
2. Em **Source**, selecione: `GitHub Actions` ⚠️
3. Salve

### **3️⃣ Deploy!**

#### **Windows:**
```bash
deploy-github.bat
```

#### **Mac/Linux:**
```bash
chmod +x deploy-github.sh
./deploy-github.sh
```

#### **Ou manualmente:**
```bash
git add .
git commit -m "Atualização do site"
git push
```

---

## 🌐 Acessar seu site:

```
https://SEU-USUARIO.github.io/SEU-REPOSITORIO/
```

**Exemplo:**
- Usuário: `jamila-tax`
- Repo: `duopro-services`
- URL: `https://jamila-tax.github.io/duopro-services/`

---

## 🔑 Adicionar Secrets do Supabase (Importante!)

1. Vá para: `https://github.com/SEU-USUARIO/SEU-REPO/settings/secrets/actions`
2. Clique em **New repository secret**
3. Adicione:

```
Nome: VITE_SUPABASE_URL
Valor: [Sua URL do Supabase]

Nome: VITE_SUPABASE_ANON_KEY
Valor: [Sua chave pública do Supabase]
```

---

## ✅ Verificar Status

Vá para: `https://github.com/SEU-USUARIO/SEU-REPO/actions`

- ✅ **Verde** = Deploy OK!
- ❌ **Vermelho** = Erro (clique para ver detalhes)

---

## 💡 DICAS:

### **Deploy automático:**
Todo `git push` = deploy automático! 🎉

### **Limpar cache do navegador:**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### **Testar localmente antes:**
```bash
npm run dev
```

---

## 🆘 PROBLEMAS COMUNS:

### ❌ "404 Not Found"
**Solução:** Verifique se em Settings → Pages está `GitHub Actions` (não "Deploy from branch")

### ❌ "Build Failed"
**Solução:** Verifique se adicionou os Secrets (VITE_SUPABASE_URL, etc)

### ❌ Página branca
**Solução:** Abra Console (F12), veja erros. Provavelmente secrets faltando.

---

## 📞 MAIS AJUDA?

Leia o guia completo: `GITHUB_PAGES_SETUP.md`

---

**🎉 É ISSO! SEU SITE ESTÁ NO AR!**
