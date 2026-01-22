# 🔍 COMO DESCOBRIR O NOME DA PASTA E RODAR O DEPLOY

## 📁 MÉTODO 1: Verificar no GitHub

**O projeto está em:**
```
https://github.com/duoproservices/duoproservices.github.io
```

**Então a pasta provavelmente é:**
```
duoproservices.github.io
```

---

## 🖥️ MÉTODO 2: Abrir pelo VSCode

### **Se você está com o projeto aberto no VSCode:**

1. Olhe no topo da janela do VSCode
2. Verá algo como: `Visual Studio Code - Nome-da-Pasta`
3. Ou olhe na barra lateral esquerda (Explorer)
4. O nome da pasta principal é o nome do projeto

---

## 💻 MÉTODO 3: Usar o Terminal

### **Windows:**

```cmd
# Abra o PowerShell ou CMD e digite:
cd Desktop
dir

# Ou procure em Documentos:
cd Documents
dir

# Procure por pastas com nome "duopro" ou "github"
```

### **Mac/Linux:**

```bash
# Abra o Terminal e digite:
cd ~/Desktop
ls -la

# Ou em Documentos:
cd ~/Documents
ls -la

# Procure por pastas com "duopro" ou "github"
```

---

## 🎯 DEPOIS DE ENCONTRAR A PASTA

### **Navegue até ela:**

**Windows (CMD ou PowerShell):**
```cmd
cd caminho\para\duoproservices.github.io
```

**Mac/Linux:**
```bash
cd ~/Desktop/duoproservices.github.io
# ou
cd ~/Documents/duoproservices.github.io
```

---

## 🚀 RODAR O DEPLOY

### **OPÇÃO 1: Script Automático** ⚡

**Windows:**
```cmd
# Duplo clique no arquivo:
DEPLOY_AGORA.bat
```

**Mac/Linux:**
```bash
# No terminal, dentro da pasta:
chmod +x DEPLOY_AGORA.sh
./DEPLOY_AGORA.sh
```

---

### **OPÇÃO 2: Comandos Manuais** 📝

```bash
# 1. Fazer build
npm run build

# 2. Adicionar ao Git
git add .

# 3. Criar commit
git commit -m "Fix: Correções de imports"

# 4. Enviar para GitHub
git push origin main
```

---

## 🔍 VERIFICAR SE VOCÊ ESTÁ NA PASTA CERTA

**Execute este comando:**

### **Windows:**
```cmd
dir package.json
```

### **Mac/Linux:**
```bash
ls package.json
```

**Se aparecer "package.json" = ✅ Você está na pasta certa!**

**Se aparecer "arquivo não encontrado" = ❌ Você precisa navegar até a pasta do projeto**

---

## 📍 CAMINHOS COMUNS ONDE O PROJETO PODE ESTAR:

```
Windows:
C:\Users\SeuNome\Desktop\duoproservices.github.io
C:\Users\SeuNome\Documents\duoproservices.github.io
C:\Users\SeuNome\Projects\duoproservices.github.io

Mac/Linux:
~/Desktop/duoproservices.github.io
~/Documents/duoproservices.github.io
~/Projects/duoproservices.github.io
~/dev/duoproservices.github.io
```

---

## ⚠️ SE VOCÊ NÃO TEM O PROJETO AINDA

### **Clone do GitHub:**

```bash
# 1. Navegue até onde quer salvar:
cd Desktop

# 2. Clone o repositório:
git clone https://github.com/duoproservices/duoproservices.github.io.git

# 3. Entre na pasta:
cd duoproservices.github.io

# 4. Instale dependências:
npm install

# 5. Agora pode fazer deploy!
```

---

## ✅ CHECKLIST RÁPIDO

```
□ Encontrei a pasta do projeto
□ Abri o terminal/CMD
□ Naveguei até a pasta (cd ...)
□ Confirmei que package.json existe
□ Rodei o script de deploy
□ Aguardei 2-3 minutos
□ Testei o site: https://duoproservices.github.io
```

---

## 💡 DICA EXTRA

**No VSCode:**
1. Clique com botão direito na pasta do projeto (no Explorer)
2. Escolha "Open in Terminal" ou "Abrir no Terminal"
3. O terminal já abre na pasta certa!
4. Execute: `npm run build && git add . && git commit -m "Fix" && git push`

---

## 🆘 AINDA COM DÚVIDA?

**Me envie a saída deste comando:**

### **Windows:**
```cmd
cd
```

### **Mac/Linux:**
```bash
pwd
```

**E eu te ajudo a navegar até a pasta certa!**

---

**🎯 Resumo Simples:**

1. Abra o terminal
2. Navegue até a pasta: `cd duoproservices.github.io`
3. Execute: `npm run build`
4. Execute: `git add . && git commit -m "Fix" && git push`
5. Aguarde 2-3 minutos
6. Acesse: https://duoproservices.github.io

✅ Pronto!
