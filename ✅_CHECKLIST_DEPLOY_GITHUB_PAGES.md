# ✅ CHECKLIST COMPLETO - DEPLOY GITHUB PAGES

## 📋 ANTES DE COMEÇAR

- [ ] Git instalado (verifique com: `git --version`)
- [ ] Conta no GitHub criada
- [ ] Código do projeto funcionando localmente

---

## 📋 CONFIGURAÇÃO DO PROJETO (JÁ FEITO! ✅)

- [x] Workflow do GitHub Actions criado (`.github/workflows/deploy.yml`)
- [x] Arquivo `.nojekyll` na pasta `public`
- [x] `.gitignore` configurado
- [x] Scripts de deploy criados (`deploy-github-pages.bat` e `.sh`)
- [x] `vite.config.ts` configurado

---

## 📋 PASSO 1: CRIAR REPOSITÓRIO NO GITHUB

- [ ] Acessar https://github.com/new
- [ ] Nomear repositório (ex: `duopro-services`)
- [ ] Marcar como "Public"
- [ ] **NÃO marcar** "Add a README file"
- [ ] Clicar em "Create repository"
- [ ] **COPIAR a URL do repositório** (ex: `https://github.com/seu-usuario/duopro-services.git`)

---

## 📋 PASSO 2: CONECTAR PROJETO AO GITHUB

### Opção A: Usar o script automatizado

**Windows:**
- [ ] Clicar duas vezes em `deploy-github-pages.bat`
- [ ] Seguir as instruções na tela

**Mac/Linux:**
- [ ] Abrir terminal na pasta do projeto
- [ ] Executar: `chmod +x deploy-github-pages.sh`
- [ ] Executar: `./deploy-github-pages.sh`

### Opção B: Fazer manualmente

- [ ] Abrir terminal/Git Bash na pasta do projeto
- [ ] Executar: `git init`
- [ ] Executar: `git add .`
- [ ] Executar: `git commit -m "Initial commit"`
- [ ] Executar: `git remote add origin https://github.com/SEU-USUARIO/duopro-services.git`
  - ⚠️ **SUBSTITUIR `SEU-USUARIO` pelo seu nome de usuário do GitHub**
- [ ] Executar: `git branch -M main`
- [ ] Executar: `git push -u origin main`

---

## 📋 PASSO 3: ATIVAR GITHUB PAGES

- [ ] Ir ao repositório no GitHub
- [ ] Clicar em `Settings`
- [ ] No menu lateral, clicar em `Pages`
- [ ] Em "Source", selecionar: `GitHub Actions`
- [ ] **NÃO precisa clicar em Save** (já salva automaticamente)

---

## 📋 PASSO 4: VERIFICAR O DEPLOY

- [ ] Ir na aba `Actions` do repositório
- [ ] Ver o workflow "Deploy to GitHub Pages" executando
- [ ] Aguardar até aparecer ✅ verde (2-3 minutos)
- [ ] Se aparecer ❌ vermelho:
  - [ ] Clicar no workflow com erro
  - [ ] Ver os logs de erro
  - [ ] Me mostrar o erro para eu ajudar

---

## 📋 PASSO 5: ACESSAR O SITE

- [ ] Copiar a URL: `https://SEU-USUARIO.github.io/duopro-services/`
  - ⚠️ **SUBSTITUIR `SEU-USUARIO` pelo seu nome de usuário do GitHub**
- [ ] Abrir no navegador
- [ ] Verificar se o site carrega corretamente
- [ ] Testar navegação entre páginas
- [ ] Testar login (com as credenciais admin)

---

## 📋 CONFIGURAR DOMÍNIO CUSTOMIZADO (OPCIONAL)

### Se quiser usar `www.duoproservices.ca`:

- [ ] No GitHub: `Settings → Pages`
- [ ] Em "Custom domain", digitar: `www.duoproservices.ca`
- [ ] Clicar em `Save`
- [ ] **No provedor de domínio** (GoDaddy, Namecheap, etc):
  - [ ] Adicionar registro A: `@` → `185.199.108.153`
  - [ ] Adicionar registro A: `@` → `185.199.109.153`
  - [ ] Adicionar registro A: `@` → `185.199.110.153`
  - [ ] Adicionar registro A: `@` → `185.199.111.153`
  - [ ] Adicionar registro CNAME: `www` → `SEU-USUARIO.github.io`
- [ ] Aguardar 15-30 minutos (propagação DNS)
- [ ] Testar: `https://www.duoproservices.ca`

---

## 📋 AJUSTAR BASE PATH (SE NECESSÁRIO)

### ⚠️ APENAS se NÃO usar domínio customizado:

Se o site carregar mas os links não funcionarem:

- [ ] Abrir `vite.config.ts`
- [ ] Mudar `base: '/'` para `base: '/duopro-services/'`
- [ ] Salvar o arquivo
- [ ] Executar:
  ```bash
  git add .
  git commit -m "Fix base path"
  git push
  ```
- [ ] Aguardar novo deploy (2-3 minutos)
- [ ] Testar novamente

---

## 📋 PRÓXIMOS DEPLOYS

Sempre que fizer alterações no código:

- [ ] Executar: `git add .`
- [ ] Executar: `git commit -m "Descrição das alterações"`
- [ ] Executar: `git push`
- [ ] Aguardar deploy automático (2-3 minutos)
- [ ] Testar as alterações no site

---

## 🎯 RESOLUÇÃO DE PROBLEMAS COMUNS

### Problema: Página em branco

- [ ] Limpar cache do navegador (Ctrl + Shift + R)
- [ ] Verificar se o `base` no `vite.config.ts` está correto
- [ ] Ver logs de erro no Console (F12)

### Problema: Erro 404 ao navegar

- [ ] Verificar se o arquivo `public/404.html` existe (já existe! ✅)
- [ ] Limpar cache do navegador
- [ ] Verificar o `base` no `vite.config.ts`

### Problema: Build falhou no GitHub Actions

- [ ] Ir em `Actions` no GitHub
- [ ] Clicar no workflow com erro (❌ vermelho)
- [ ] Ler os logs de erro
- [ ] Copiar a mensagem de erro
- [ ] Me mostrar o erro para eu ajudar

### Problema: `git push` pede usuário e senha

- [ ] Ir em: https://github.com/settings/tokens
- [ ] Clicar em "Generate new token (classic)"
- [ ] Marcar: `repo` (full control)
- [ ] Clicar em "Generate token"
- [ ] **COPIAR o token** (só aparece uma vez!)
- [ ] Usar o token como senha no `git push`

---

## 🎉 CONCLUSÃO

Quando todos os itens estiverem marcados, seu site estará no ar! 🚀

**URL final:**
- Sem domínio: `https://SEU-USUARIO.github.io/duopro-services/`
- Com domínio: `https://www.duoproservices.ca`

---

## 📞 PRECISA DE AJUDA?

Se tiver algum problema, me mostre:
1. Print da tela do erro
2. Mensagem de erro completa
3. Logs do GitHub Actions (se aplicável)
4. Qual passo você está tentando executar

E eu te ajudo a resolver! 💪
