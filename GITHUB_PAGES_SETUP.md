# 🚀 DEPLOY NO GITHUB PAGES - GUIA COMPLETO

## ✅ Configuração já feita automaticamente:

1. ✅ Workflow do GitHub Actions criado (`.github/workflows/deploy.yml`)
2. ✅ Vite configurado com base path correto
3. ✅ Arquivo `.nojekyll` criado (evita problemas com Jekyll)
4. ✅ Build otimizado para produção

---

## 📋 PASSO A PASSO PARA ATIVAR:

### **1️⃣ Fazer Push do Código para GitHub**

```bash
# Se ainda não tem repositório configurado:
git init
git add .
git commit -m "Setup GitHub Pages"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

### **2️⃣ Ativar GitHub Pages no Repositório**

1. Vá para o seu repositório no GitHub
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**
4. Em **Build and deployment**, selecione:
   - **Source**: `GitHub Actions` ⚠️ IMPORTANTE!
   
![GitHub Pages Settings](https://docs.github.com/assets/cb-47267/mw-1440/images/help/pages/publishing-source-drop-down.webp)

### **3️⃣ Adicionar Secrets (Variáveis de Ambiente)**

Se você usa Supabase ou outras APIs:

1. No seu repositório, vá em **Settings** → **Secrets and variables** → **Actions**
2. Clique em **New repository secret**
3. Adicione:
   - `VITE_SUPABASE_URL` → Sua URL do Supabase
   - `VITE_SUPABASE_ANON_KEY` → Sua chave pública do Supabase

### **4️⃣ Fazer Deploy**

#### **Opção A: Deploy Automático**
- Toda vez que você fizer `git push` na branch `main`, o site será atualizado automaticamente! 🎉

#### **Opção B: Deploy Manual**
1. Vá em **Actions** no seu repositório
2. Clique em **Deploy to GitHub Pages**
3. Clique em **Run workflow** → **Run workflow**

---

## 🌐 Acessar Seu Site

Depois do deploy, seu site estará disponível em:

```
https://SEU-USUARIO.github.io/SEU-REPOSITORIO/
```

Por exemplo:
- Se seu usuário é `jamila123` e repositório é `duopro-tax`
- Seu site será: `https://jamila123.github.io/duopro-tax/`

---

## ⚙️ CUSTOM DOMAIN (Opcional)

Se você quiser usar um domínio próprio (exemplo: `www.duoproservices.com`):

### **No seu provedor de domínio (GoDaddy, Namecheap, etc):**

Adicione esses registros DNS:

```
Tipo: A
Nome: @
Valor: 185.199.108.153

Tipo: A
Nome: @
Valor: 185.199.109.153

Tipo: A
Nome: @
Valor: 185.199.110.153

Tipo: A
Nome: @
Valor: 185.199.111.153

Tipo: CNAME
Nome: www
Valor: SEU-USUARIO.github.io
```

### **No GitHub:**

1. Settings → Pages
2. Em **Custom domain**, digite: `www.duoproservices.com`
3. Clique em **Save**
4. Marque **Enforce HTTPS** ✅

---

## 🔧 TROUBLESHOOTING

### ❌ Problema: "404 Page Not Found"
**Solução**: Verifique se em Settings → Pages está selecionado **GitHub Actions** e não "Deploy from branch"

### ❌ Problema: "Build Failed"
**Solução**: 
1. Vá em Actions e veja o log de erro
2. Provavelmente faltam secrets (VITE_SUPABASE_URL, etc)

### ❌ Problema: "Página branca"
**Solução**: 
1. Abra o Console do navegador (F12)
2. Veja se há erros de "Failed to fetch" ou "CORS"
3. Verifique se o `base: './'` está no `vite.config.ts`

### ❌ Problema: "CSS não carrega"
**Solução**: 
1. Certifique-se que `.nojekyll` existe em `/public/`
2. Faça rebuild: Actions → Re-run all jobs

---

## 📊 VERIFICAR STATUS DO DEPLOY

1. Vá em **Actions** no seu repositório
2. Veja o workflow "Deploy to GitHub Pages"
3. ✅ Verde = Deploy com sucesso
4. ❌ Vermelho = Erro (clique para ver detalhes)

---

## 🎯 PRÓXIMOS PASSOS

Agora você pode:

✅ **Desenvolver localmente**: `npm run dev`
✅ **Fazer commit**: `git add . && git commit -m "Descrição"`
✅ **Deploy automático**: `git push`
✅ **Ver site online**: Acessar a URL do GitHub Pages

---

## 💡 DICAS PRO

### **Cache busting**
O GitHub Pages faz cache agressivo. Para forçar atualização:
- Ctrl + Shift + R (Windows/Linux)
- Cmd + Shift + R (Mac)

### **Ver logs de build**
- Actions → Deploy to GitHub Pages → Build → Ver output completo

### **Rollback (voltar versão antiga)**
1. Actions → Deploy to GitHub Pages
2. Escolha um deploy antigo com ✅
3. Re-run jobs

---

## ❓ PERGUNTAS FREQUENTES

**Q: Preciso pagar?**
A: Não! GitHub Pages é 100% grátis para repositórios públicos.

**Q: Tem limite de bandwidth?**
A: Sim, 100GB/mês. Mas é muito difícil estourar.

**Q: Posso usar backend (Node.js, APIs)?**
A: Não diretamente. Use Supabase, Firebase ou Vercel Serverless Functions.

**Q: Quanto tempo demora o deploy?**
A: Geralmente 2-5 minutos.

**Q: Posso ter múltiplos sites?**
A: Sim! Um site por repositório.

---

## 🆘 SUPORTE

Se precisar de ajuda:
1. Verifique a aba **Actions** para ver erros
2. Leia os logs completos
3. Procure o erro específico no Google
4. Issues do GitHub: https://github.com/SEU-USUARIO/SEU-REPO/issues

---

**🎉 BOA SORTE COM SEU DEPLOY!**
