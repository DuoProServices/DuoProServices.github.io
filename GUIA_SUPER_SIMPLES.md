# 🌟 GUIA SUPER SIMPLES - SEM VSCODE

## 📦 VOCÊ FEZ DOWNLOAD DO PROJETO

Ótimo! Agora vamos achar onde ele está.

---

## 🔍 PASSO 1: ENCONTRAR A PASTA

### **WINDOWS:**

1. **Abra o "Explorador de Arquivos"** (ícone de pasta amarela na barra de tarefas)

2. **Clique em "Downloads"** no menu lateral esquerdo

3. **Procure por:**
   - Uma pasta chamada: `duoproservices.github.io`
   - Ou um arquivo ZIP chamado: `duoproservices.github.io.zip` ou `main.zip`

4. **Se encontrou um arquivo ZIP:**
   - Clique com botão direito no arquivo
   - Escolha "Extrair tudo..."
   - Clique em "Extrair"
   - Agora você tem a pasta!

5. **Anote onde está a pasta!** Exemplo:
   ```
   C:\Users\SeuNome\Downloads\duoproservices.github.io
   ```

---

### **MAC:**

1. **Abra o "Finder"** (ícone azul com carinha sorridente)

2. **Clique em "Downloads"** no menu lateral esquerdo

3. **Procure por:**
   - Uma pasta chamada: `duoproservices.github.io`
   - Ou um arquivo ZIP

4. **Se encontrou um arquivo ZIP:**
   - Clique 2x no arquivo
   - O Mac vai descompactar automaticamente
   - Agora você tem a pasta!

5. **Anote onde está a pasta!** Exemplo:
   ```
   /Users/SeuNome/Downloads/duoproservices.github.io
   ```

---

## 💻 PASSO 2: ABRIR O TERMINAL

### **WINDOWS:**

1. **Pressione** as teclas `Windows + R` juntas
2. **Digite:** `cmd` e pressione Enter
3. Uma janela preta vai abrir - isso é o **Prompt de Comando**

---

### **MAC:**

1. **Pressione** as teclas `Command + Espaço` juntas
2. **Digite:** `Terminal` e pressione Enter
3. Uma janela vai abrir - isso é o **Terminal**

---

## 📂 PASSO 3: IR ATÉ A PASTA DO PROJETO

### **WINDOWS:**

Na janela preta (Prompt de Comando), digite:

```cmd
cd Downloads\duoproservices.github.io
```

Pressione Enter.

**OU se a pasta está em outro lugar, use o caminho completo:**

```cmd
cd C:\Users\SeuNome\Downloads\duoproservices.github.io
```

---

### **MAC:**

Na janela do Terminal, digite:

```bash
cd ~/Downloads/duoproservices.github.io
```

Pressione Enter.

---

## ✅ PASSO 4: CONFIRMAR QUE ESTÁ NO LUGAR CERTO

**Digite isto e pressione Enter:**

### **Windows:**
```cmd
dir package.json
```

### **Mac:**
```bash
ls package.json
```

**Se aparecer "package.json"** = ✅ Você está no lugar certo!

**Se aparecer "não encontrado"** = ❌ A pasta está em outro lugar. Volte ao Passo 1.

---

## 🚀 PASSO 5: RODAR O DEPLOY

**Cole estes comandos UM POR VEZ:**

### **1. Fazer o Build:**
```bash
npm run build
```
Pressione Enter e aguarde (pode demorar 1 minuto).

### **2. Adicionar arquivos:**
```bash
git add .
```
Pressione Enter.

### **3. Criar commit:**
```bash
git commit -m "Fix: Correcoes de imports"
```
Pressione Enter.

### **4. Enviar para GitHub:**
```bash
git push origin main
```
Pressione Enter.

**AGUARDE 2-3 MINUTOS!**

---

## 🌐 PASSO 6: VER O SITE

1. **Abra o navegador** (Chrome, Firefox, Safari...)

2. **Digite:**
   ```
   https://duoproservices.github.io
   ```

3. **Pressione:** `Ctrl + Shift + R` (Windows) ou `Command + Shift + R` (Mac)
   - Isso limpa o cache e mostra a versão mais nova

4. **Veja se o site carrega sem erros!** ✅

---

## ⚠️ SE DER ERRO NO GIT PUSH

**Pode pedir usuário e senha do GitHub.**

### **IMPORTANTE:**
- **Usuário:** seu email do GitHub ou nome de usuário
- **Senha:** NÃO é a senha normal!
  - Você precisa de um **Personal Access Token**
  - Vá em: https://github.com/settings/tokens
  - Clique em "Generate new token (classic)"
  - Selecione "repo" e "workflow"
  - Copie o token (parece: `ghp_aBc123...`)
  - Use esse token como senha

---

## 🎯 JEITO MAIS FÁCIL - TUDO DE UMA VEZ

**Depois que estiver na pasta certa, cole TUDO ISSO de uma vez:**

```bash
npm run build && git add . && git commit -m "Fix" && git push origin main
```

Pressione Enter e aguarde!

---

## ❓ O QUE É VSCODE?

**VSCode = Visual Studio Code**

É um programa para **editar código** de forma mais fácil.

**MAS VOCÊ NÃO PRECISA DELE AGORA!**

Tudo que você precisa é:
- ✅ O Terminal/Prompt de Comando (você já tem!)
- ✅ O Git (se não tiver, baixe em: https://git-scm.com/)
- ✅ O Node.js (se não tiver, baixe em: https://nodejs.org/)

---

## 🆘 AINDA PERDIDO?

**Me diga:**

1. **Você usa Windows ou Mac?**

2. **Quando você baixou o projeto, salvou como ZIP ou já era uma pasta?**

3. **Você consegue ver a pasta no Downloads?**

4. **Você tem Git e Node.js instalados?**
   - Para testar Git: abra o terminal e digite `git --version`
   - Para testar Node: digite `node --version`

**E eu te ajudo com instruções ainda mais detalhadas!** 🚀

---

## 📱 ATALHO VISUAL - WINDOWS

1. **Abra a pasta do projeto no Explorador**
2. **Clique na barra de endereço** (onde mostra o caminho)
3. **Digite:** `cmd` e pressione Enter
4. **O Prompt abre direto na pasta certa!** ✅
5. **Agora é só colar:**
   ```
   npm run build && git add . && git commit -m "Fix" && git push
   ```

---

## 📱 ATALHO VISUAL - MAC

1. **Abra o Finder**
2. **Vá até a pasta do projeto**
3. **Clique com botão direito na pasta**
4. **Segure Option (⌥) e escolha:** "Copiar ... como Nome do Caminho"
5. **Abra o Terminal**
6. **Digite:** `cd ` (com espaço no final)
7. **Cole o caminho** (Command + V)
8. **Pressione Enter**
9. **Agora é só colar:**
   ```
   npm run build && git add . && git commit -m "Fix" && git push
   ```

---

✅ **VOCÊ CONSEGUE! É MAIS SIMPLES DO QUE PARECE!**
