# 📋 COMANDOS PRONTOS PARA COPIAR E COLAR

## 🚀 DEPLOY INICIAL (PRIMEIRA VEZ)

### 1️⃣ Inicializar Git e fazer primeiro commit

```bash
git init
git add .
git commit -m "Initial commit - DuoPro Services"
```

### 2️⃣ Conectar ao GitHub e fazer push

⚠️ **ANTES DE EXECUTAR:** Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub!

```bash
git remote add origin https://github.com/SEU-USUARIO/duopro-services.git
git branch -M main
git push -u origin main
```

---

## 🔄 PRÓXIMOS DEPLOYS (ALTERAÇÕES)

Sempre que fizer mudanças no código:

```bash
git add .
git commit -m "Atualização do site"
git push
```

---

## 🌐 VERIFICAR STATUS DO GIT

```bash
git status
```

---

## 📌 VER HISTÓRICO DE COMMITS

```bash
git log --oneline
```

---

## 🔗 VER REMOTE ATUAL

```bash
git remote -v
```

---

## ❌ REMOVER REMOTE (SE CONFIGUROU ERRADO)

```bash
git remote remove origin
```

Depois configure novamente:

```bash
git remote add origin https://github.com/SEU-USUARIO/duopro-services.git
```

---

## 🆕 CLONAR O PROJETO EM OUTRO COMPUTADOR

```bash
git clone https://github.com/SEU-USUARIO/duopro-services.git
cd duopro-services
npm install
```

---

## 🔧 RESOLVER CONFLITOS DE MERGE

Se aparecer erro ao dar `git push`:

```bash
git pull --rebase
git push
```

---

## 🗑️ DESFAZER ÚLTIMO COMMIT (MANTENDO ALTERAÇÕES)

```bash
git reset --soft HEAD~1
```

---

## 🗑️ DESFAZER ÚLTIMO COMMIT (APAGANDO ALTERAÇÕES)

⚠️ **CUIDADO:** Isso apaga as alterações permanentemente!

```bash
git reset --hard HEAD~1
```

---

## 📦 BUILD LOCAL (TESTAR ANTES DE DEPLOY)

```bash
npm run build
npm run preview
```

---

## 🧹 LIMPAR CACHE DO GIT

```bash
git rm -r --cached .
git add .
git commit -m "Fix gitignore"
git push
```

---

## 🔐 CONFIGURAR GIT GLOBALMENTE

Se for a primeira vez usando Git:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@example.com"
```

---

## 🎯 COMANDOS ÚTEIS DO NPM

### Instalar dependências

```bash
npm install
```

### Rodar em desenvolvimento

```bash
npm run dev
```

### Build de produção

```bash
npm run build
```

### Preview do build

```bash
npm run preview
```

---

## 🚨 RESOLVER ERRO: "UPDATES WERE REJECTED"

Se aparecer erro ao dar `git push`:

```bash
git pull origin main --rebase
git push origin main
```

---

## 🔄 FORÇAR PUSH (CUIDADO!)

⚠️ **APENAS use se tiver certeza!** Isso sobrescreve o histórico remoto.

```bash
git push origin main --force
```

---

## 📌 CRIAR UMA NOVA BRANCH

```bash
git checkout -b nome-da-branch
```

### Mudar de branch

```bash
git checkout main
```

### Ver todas as branches

```bash
git branch -a
```

---

## 🏷️ CRIAR TAG (VERSÃO)

```bash
git tag -a v1.0.0 -m "Versão 1.0.0 - Lançamento inicial"
git push origin v1.0.0
```

---

## 🧪 TESTAR COMANDOS SEM EXECUTAR

Adicione `--dry-run` no final:

```bash
git add . --dry-run
```

---

## 💾 SALVAR ALTERAÇÕES TEMPORARIAMENTE

```bash
git stash
```

### Recuperar alterações salvas

```bash
git stash pop
```

---

## 🎯 RESUMO: COMANDOS MAIS USADOS

### Deploy inicial:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU-USUARIO/duopro-services.git
git branch -M main
git push -u origin main
```

### Próximos deploys:
```bash
git add .
git commit -m "Descrição"
git push
```

### Resolver conflitos:
```bash
git pull --rebase
git push
```

---

## 🆘 AJUDA RÁPIDA

| Comando | O que faz |
|---------|-----------|
| `git status` | Ver o que mudou |
| `git log` | Ver histórico |
| `git add .` | Adicionar tudo |
| `git commit -m "msg"` | Salvar mudanças |
| `git push` | Enviar para GitHub |
| `git pull` | Baixar do GitHub |
| `git clone URL` | Clonar projeto |

---

## 📞 PRECISA DE MAIS AJUDA?

Se algum comando der erro, me mostre:
1. O comando que executou
2. A mensagem de erro completa
3. O contexto (o que estava tentando fazer)

E eu te ajudo! 💪
