# 📦 PROGRAMAS QUE VOCÊ PRECISA TER INSTALADOS

Antes de fazer o deploy, você precisa ter 3 programas instalados no seu computador.

---

## 1️⃣ NODE.JS (Obrigatório)

### **O que é?**
O Node.js permite rodar JavaScript no seu computador e instalar pacotes npm.

### **Como instalar:**

#### **WINDOWS E MAC:**
1. Vá em: https://nodejs.org/
2. Clique no botão verde grande: **"Recommended For Most Users"**
3. Baixe o instalador
4. Execute o instalador (duplo clique)
5. Clique em "Next" várias vezes até instalar
6. ✅ Pronto!

### **Como testar se está instalado:**
```bash
node --version
```
Deve mostrar algo como: `v20.10.0`

---

## 2️⃣ GIT (Obrigatório)

### **O que é?**
O Git controla as versões do seu código e envia para o GitHub.

### **Como instalar:**

#### **WINDOWS:**
1. Vá em: https://git-scm.com/download/win
2. Baixe o instalador
3. Execute o instalador
4. Clique em "Next" várias vezes (pode deixar tudo padrão)
5. ✅ Pronto!

#### **MAC:**
1. Abra o Terminal
2. Digite:
   ```bash
   git --version
   ```
3. Se não tiver instalado, vai aparecer uma janela perguntando se quer instalar
4. Clique em "Instalar"
5. ✅ Pronto!

**OU baixe de:** https://git-scm.com/download/mac

### **Como testar se está instalado:**
```bash
git --version
```
Deve mostrar algo como: `git version 2.40.0`

---

## 3️⃣ VSCODE (Opcional - Recomendado)

### **O que é?**
Um editor de código que torna tudo mais fácil e visual.

### **Como instalar:**

#### **WINDOWS E MAC:**
1. Vá em: https://code.visualstudio.com/
2. Clique em "Download"
3. Execute o instalador
4. Clique em "Next" várias vezes
5. ✅ Pronto!

### **Por que usar?**
- ✅ Mostra os arquivos de forma organizada
- ✅ Tem terminal integrado (não precisa abrir separado)
- ✅ Marca erros no código
- ✅ Muito mais fácil de usar!

---

## ✅ CHECKLIST DE INSTALAÇÃO

Teste se tudo está instalado abrindo o terminal e digitando:

```bash
# Testar Node.js
node --version

# Testar npm (vem junto com Node.js)
npm --version

# Testar Git
git --version
```

**Se todos mostrarem uma versão, está tudo OK!** ✅

---

## 🔧 CONFIGURAR O GIT (IMPORTANTE!)

**Depois de instalar o Git, você precisa configurar seu nome e email:**

### **Abra o terminal e digite:**

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

**Use o mesmo email da sua conta do GitHub!**

---

## 🔑 AUTENTICAR NO GITHUB

### **Quando fizer o primeiro git push, vai pedir credenciais:**

#### **WINDOWS:**
1. Vai abrir uma janela do GitHub
2. Faça login com seu usuário e senha
3. Permita o acesso
4. ✅ Pronto! Vai salvar automaticamente

#### **MAC:**
1. Vai pedir usuário e senha no terminal
2. **Usuário:** seu nome de usuário ou email do GitHub
3. **Senha:** você precisa criar um **Personal Access Token**:
   - Vá em: https://github.com/settings/tokens
   - Clique em "Generate new token (classic)"
   - Dê um nome: `DuoPro Deploy`
   - Selecione: `repo` e `workflow`
   - Clique em "Generate token"
   - **COPIE O TOKEN!** (só aparece uma vez)
   - Use esse token como senha

---

## 📦 INSTALAR DEPENDÊNCIAS DO PROJETO

**Depois de ter Node.js e Git instalados:**

1. Abra o terminal na pasta do projeto
2. Digite:
   ```bash
   npm install
   ```
3. Aguarde (pode demorar alguns minutos)
4. ✅ Pronto! Agora pode fazer deploy

---

## 🎯 ORDEM RECOMENDADA

```
1. Instalar Node.js
   ↓
2. Instalar Git
   ↓
3. Configurar Git (user.name e user.email)
   ↓
4. (Opcional) Instalar VSCode
   ↓
5. Abrir terminal na pasta do projeto
   ↓
6. Rodar: npm install
   ↓
7. Rodar: npm run build && git add . && git commit -m "Fix" && git push
   ↓
8. Aguardar 2-3 minutos
   ↓
9. Ver o site: https://duoproservices.github.io
```

---

## ❓ VERSÕES RECOMENDADAS

- **Node.js:** v20.x ou v18.x (LTS - Long Term Support)
- **Git:** Qualquer versão recente (2.30+)
- **VSCode:** Última versão

---

## 🆘 LINKS RÁPIDOS

- **Node.js:** https://nodejs.org/
- **Git:** https://git-scm.com/
- **VSCode:** https://code.visualstudio.com/
- **GitHub Token:** https://github.com/settings/tokens

---

## 💡 DICA

**Depois de instalar tudo, REINICIE o terminal!**

Feche e abra novamente para garantir que tudo funcione.

---

✅ **Com esses 3 programas instalados, você está pronto para fazer o deploy!**
