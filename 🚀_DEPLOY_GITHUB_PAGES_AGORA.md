# 🚀 DEPLOY RÁPIDO - GITHUB PAGES

## ⚡ VERSÃO ULTRA RÁPIDA (5 MINUTOS)

---

## 🎯 PASSO 1: CRIAR REPOSITÓRIO NO GITHUB

1. **Abra:** https://github.com/new
2. **Nome do repositório:** `duopro-services`
3. **Visibilidade:** Public
4. **NÃO marque:** "Add a README file"
5. **Clique em:** `Create repository`

✅ **Copie a URL que aparece** (ex: `https://github.com/seu-usuario/duopro-services.git`)

---

## 🎯 PASSO 2: CONECTAR E ENVIAR O CÓDIGO

### **No Windows:**

1. **Clique duas vezes em:** `deploy-github-pages.bat`
2. **Copie e cole os comandos que aparecem**

### **No Mac/Linux:**

1. **Abra o Terminal na pasta do projeto**
2. **Execute:**

```bash
chmod +x deploy-github-pages.sh
./deploy-github-pages.sh
```

### **Depois, execute:**

```bash
# Substitua SEU-USUARIO pelo seu usuário do GitHub
git remote add origin https://github.com/SEU-USUARIO/duopro-services.git
git branch -M main
git push -u origin main
```

---

## 🎯 PASSO 3: ATIVAR GITHUB PAGES

1. **No GitHub, vá no repositório que você criou**
2. **Clique em:** `Settings` (Configurações)
3. **No menu lateral esquerdo, clique em:** `Pages`
4. **Em "Source", selecione:** `GitHub Actions`
5. **Pronto!** ✅

---

## 🎯 PASSO 4: AGUARDAR O DEPLOY

1. **Clique na aba:** `Actions`
2. **Você verá:** "Deploy to GitHub Pages" rodando
3. **Aguarde 2-3 minutos** ⏳
4. **Quando aparecer ✅ verde:** Deploy concluído!

---

## 🎯 PASSO 5: ACESSAR SEU SITE

Seu site estará em:

```
https://SEU-USUARIO.github.io/duopro-services/
```

---

## 🔄 PRÓXIMOS DEPLOYS (MUITO MAIS FÁCIL!)

Sempre que fizer alterações:

```bash
git add .
git commit -m "Minhas alterações"
git push
```

**O GitHub Pages atualiza automaticamente!** 🎉

---

## 🌐 USAR SEU DOMÍNIO PRÓPRIO (OPCIONAL)

Se quiser usar `www.duoproservices.ca`:

### **No GitHub:**

1. `Settings → Pages`
2. Em "Custom domain", digite: `www.duoproservices.ca`
3. Clique em `Save`

### **No seu provedor de domínio:**

Adicione estes DNS:

| Tipo  | Nome | Valor                   |
|-------|------|-------------------------|
| A     | @    | 185.199.108.153         |
| A     | @    | 185.199.109.153         |
| A     | @    | 185.199.110.153         |
| A     | @    | 185.199.111.153         |
| CNAME | www  | SEU-USUARIO.github.io   |

**Aguarde 15-30 minutos** para propagar.

---

## ⚠️ IMPORTANTE: BASE PATH

Se você NÃO for usar domínio customizado, precisa ajustar o `vite.config.ts`:

```ts
// Mude esta linha:
base: '/', 

// Para:
base: '/duopro-services/', // Nome do seu repositório
```

E faça push novamente:

```bash
git add .
git commit -m "Fix base path"
git push
```

---

## 🆘 PROBLEMAS?

### **Página em branco:**

1. Limpe o cache (Ctrl + Shift + R)
2. Verifique se o `base` no `vite.config.ts` está correto

### **Build falhou:**

Vá em `Actions` no GitHub e veja os logs de erro.

---

## 🎉 PRONTO!

Seu site está no ar! 🚀

Acesse: **https://SEU-USUARIO.github.io/duopro-services/**

---

## 📞 AJUDA

Se tiver erro, me mostre:
- Print da tela
- Mensagem de erro completa
- Logs do GitHub Actions

E eu te ajudo! 💪
