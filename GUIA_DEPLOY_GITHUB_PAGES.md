# 🚀 GUIA COMPLETO: DEPLOY NO GITHUB PAGES

## ✅ O QUE JÁ FOI CONFIGURADO:

1. ✅ Workflow do GitHub Actions (`.github/workflows/deploy.yml`)
2. ✅ Arquivo `.nojekyll` na pasta `public`
3. ✅ Configuração do Vite para build (`vite.config.ts`)
4. ✅ Script de build no `package.json`

---

## 📋 PASSO A PASSO PARA FAZER O DEPLOY:

### **PASSO 1: PREPARE O REPOSITÓRIO NO GITHUB**

1. **Acesse o GitHub e crie um repositório novo** (se ainda não tiver):
   - Vá em: https://github.com/new
   - Nome: `duopro-services` (ou qualquer nome)
   - **NÃO** marque "Add a README file"
   - Clique em **"Create repository"**

---

### **PASSO 2: CONECTE SEU PROJETO LOCAL AO GITHUB**

Abra o **Terminal** ou **Git Bash** na pasta do seu projeto e execute:

```bash
# Inicialize o Git (se ainda não estiver inicializado)
git init

# Adicione todos os arquivos
git add .

# Faça o primeiro commit
git commit -m "Initial commit - DuoPro Services"

# Conecte ao repositório do GitHub (SUBSTITUA com seu usuário)
git remote add origin https://github.com/SEU-USUARIO/duopro-services.git

# Envie os arquivos para o GitHub
git branch -M main
git push -u origin main
```

> **⚠️ IMPORTANTE:** Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub!

---

### **PASSO 3: ATIVE O GITHUB PAGES**

1. **No GitHub, vá no seu repositório**

2. **Clique em "Settings" (Configurações)**

3. **No menu lateral esquerdo, clique em "Pages"**

4. **Em "Source", selecione:**
   - Source: **GitHub Actions**

5. **Pronto!** O GitHub vai detectar automaticamente o workflow que criamos.

---

### **PASSO 4: AGUARDE O DEPLOY**

1. **Vá na aba "Actions" do seu repositório**

2. **Você verá o workflow "Deploy to GitHub Pages" rodando**

3. **Aguarde alguns minutos** (geralmente 2-3 minutos)

4. **Quando aparecer um ✅ verde, significa que o deploy foi concluído!**

---

### **PASSO 5: ACESSE SEU SITE**

Seu site estará disponível em:

```
https://SEU-USUARIO.github.io/duopro-services/
```

Ou, se você nomeou o repositório diferente:

```
https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/
```

---

## 🔄 COMO FAZER DEPLOY DE NOVAS ALTERAÇÕES:

Sempre que você fizer alterações no código, basta:

```bash
# Adicionar as alterações
git add .

# Fazer commit
git commit -m "Descrição das alterações"

# Enviar para o GitHub
git push
```

O GitHub Actions vai **automaticamente fazer o deploy**! 🎉

---

## 🌐 USAR DOMÍNIO CUSTOMIZADO (OPCIONAL)

Se você quiser usar um domínio próprio (ex: `www.duoproservices.ca`):

### **1. No GitHub Pages:**

1. Vá em **Settings → Pages**
2. Em **"Custom domain"**, digite: `www.duoproservices.ca`
3. Clique em **"Save"**

### **2. No seu provedor de domínio (GoDaddy, Namecheap, etc):**

Adicione estes registros DNS:

| Tipo  | Nome | Valor                      | TTL  |
|-------|------|----------------------------|------|
| A     | @    | 185.199.108.153            | 600  |
| A     | @    | 185.199.109.153            | 600  |
| A     | @    | 185.199.110.153            | 600  |
| A     | @    | 185.199.111.153            | 600  |
| CNAME | www  | SEU-USUARIO.github.io      | 600  |

> Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub

### **3. Aguarde a propagação do DNS**

Pode levar de 5 minutos até 48 horas (geralmente 15-30 minutos).

---

## ⚠️ SE O VITE.CONFIG.TS ESTIVER COM `base: '/'`

Se o seu site for acessado em `https://SEU-USUARIO.github.io/duopro-services/`, você precisa:

**OPÇÃO 1 (Recomendada): Use um Custom Domain**

Com domínio customizado, mantenha `base: '/'` no `vite.config.ts`

**OPÇÃO 2: Ajuste o base path**

Se NÃO usar custom domain, mude no `vite.config.ts`:

```ts
base: '/duopro-services/', // Nome do seu repositório
```

E faça push novamente:

```bash
git add .
git commit -m "Fix base path"
git push
```

---

## 🔧 TROUBLESHOOTING

### **Problema: Página em branco**

**Solução 1:** Verifique se o `base` no `vite.config.ts` está correto.

**Solução 2:** Limpe o cache do navegador (Ctrl + Shift + R)

### **Problema: Erro 404 ao navegar**

Isso é esperado! GitHub Pages não suporta SPA routing por padrão.

**Solução:** Você já tem o arquivo `public/404.html` configurado! 🎉

### **Problema: Build falhou**

Vá na aba "Actions" do GitHub e clique no workflow com ❌ para ver os logs de erro.

---

## 🎉 PRONTO!

Seu site DuoPro Services está no ar no GitHub Pages! 🚀

Acesse: **https://SEU-USUARIO.github.io/duopro-services/**

---

## 📞 PRECISA DE AJUDA?

Se tiver algum erro, me mostre:
1. A mensagem de erro completa
2. Prints da tela
3. Os logs do GitHub Actions

E eu te ajudo a resolver! 💪
