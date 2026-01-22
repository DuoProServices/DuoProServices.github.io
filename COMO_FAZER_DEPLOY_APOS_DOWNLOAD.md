# 🚀 COMO FAZER DEPLOY APÓS BAIXAR DO FIGMA MAKE

## 📥 PASSO 1: BAIXAR O CÓDIGO ATUALIZADO

### **No Figma Make:**

1. **Clique no botão de Menu** (☰) no canto superior direito
2. **Clique em "Download Project"** ou **"Export"**
3. **Salve o arquivo ZIP** na pasta **Downloads**
4. **Aguarde o download terminar**

---

## 📂 PASSO 2: EXTRAIR O ARQUIVO

1. **Vá na pasta Downloads**
2. **Encontre o arquivo ZIP** (algo como `duoproservices.zip` ou `project.zip`)
3. **Botão direito no arquivo** → **"Extrair tudo..."**
4. **Clique em "Extrair"**
5. **Anote o nome da pasta criada!**

---

## ✅ PASSO 3: VERIFICAR SE TEM NODE.JS E GIT

### **Abra o CMD:**
- Pressione `Windows + R`
- Digite `cmd`
- Pressione Enter

### **Teste os programas:**

```cmd
node --version
git --version
```

**Se ambos mostrarem versões** = ✅ Pode continuar!

**Se aparecer "não encontrado"** = ❌ Instale primeiro:
- **Node.js:** https://nodejs.org/
- **Git:** https://git-scm.com/

---

## 🎯 PASSO 4A: PRIMEIRO DEPLOY (SÓ UMA VEZ)

### **Se é a PRIMEIRA vez fazendo deploy:**

1. **Abra a pasta extraída no Explorer**

2. **Encontre o arquivo:** `PRIMEIRO_DEPLOY_WINDOWS.bat`

3. **Clique 2x no arquivo**

4. **Siga as instruções na tela:**
   - Digite seu nome
   - Digite seu email do GitHub
   - Aguarde instalar
   - Aguarde o build
   - **IMPORTANTE:** Vai abrir uma janela do GitHub para fazer login
   - Faça login com seu usuário e senha

5. **Aguarde terminar!**

6. **Aguarde 2-3 minutos**

7. **Acesse:** https://duoproservices.github.io

8. **Pressione:** `Ctrl + Shift + R` (limpar cache)

✅ **PRONTO!**

---

## 🎯 PASSO 4B: DEPLOYS SEGUINTES (MAIS RÁPIDO)

### **Se você já fez deploy antes:**

1. **Abra a pasta extraída no Explorer**

2. **Encontre o arquivo:** `DEPLOY_WINDOWS.bat`

3. **Clique 2x no arquivo**

4. **Aguarde terminar!** (1-2 minutos)

5. **Aguarde 2-3 minutos**

6. **Acesse:** https://duoproservices.github.io

7. **Pressione:** `Ctrl + Shift + R`

✅ **PRONTO!**

---

## 🔧 JEITO MANUAL (SE OS SCRIPTS NÃO FUNCIONAREM)

### **1. Abra o CMD na pasta do projeto:**

**Opção A - Atalho fácil:**
1. Abra a pasta do projeto no Explorer
2. Clique na barra de endereço (onde mostra o caminho)
3. Digite `cmd` e pressione Enter
4. O CMD abre direto na pasta! ✅

**Opção B - Pelo CMD:**
```cmd
cd Downloads\nome-da-pasta-extraida
```

### **2. Execute os comandos UM POR VEZ:**

```cmd
npm install
```
(Aguarde 2-3 minutos)

```cmd
npm run build
```
(Aguarde 1 minuto)

```cmd
git add .
```

```cmd
git commit -m "Deploy atualizado"
```

```cmd
git push origin main
```

### **3. Aguarde 2-3 minutos**

### **4. Acesse o site:**
```
https://duoproservices.github.io
```

### **5. Limpe o cache:**
Pressione `Ctrl + Shift + R`

✅ **PRONTO!**

---

## ⚠️ POSSÍVEIS ERROS E SOLUÇÕES

### **ERRO: "git is not recognized"**
**Solução:** Instale o Git: https://git-scm.com/

---

### **ERRO: "node is not recognized"**
**Solução:** Instale o Node.js: https://nodejs.org/

---

### **ERRO: "failed to push"**
**Solução:** 
1. Configure o Git:
   ```cmd
   git config --global user.name "Seu Nome"
   git config --global user.email "seu@email.com"
   ```
2. Tente novamente
3. Vai pedir login do GitHub

---

### **ERRO: "Permission denied"**
**Solução:** Você não tem acesso ao repositório.
- Peça para um admin (veprass@gmail.com) te adicionar como colaborador

---

### **ERRO: "Nothing to commit"**
**Isso não é erro!** Significa que não houve mudanças desde o último deploy.

---

## 📋 CHECKLIST RÁPIDO

```
□ Baixei o código do Figma Make
□ Extraí o arquivo ZIP
□ Tenho Node.js instalado
□ Tenho Git instalado
□ Rodei o script .BAT (ou comandos manuais)
□ Aguardei 2-3 minutos após o push
□ Acessei o site
□ Limpei o cache (Ctrl + Shift + R)
□ Site funcionando! ✅
```

---

## 🎯 FLUXO IDEAL PARA PRÓXIMAS ATUALIZAÇÕES

```
1. Fazer mudanças no Figma Make
   ↓
2. Baixar código atualizado (Download Project)
   ↓
3. Extrair ZIP
   ↓
4. Clicar 2x em DEPLOY_WINDOWS.bat
   ↓
5. Aguardar 2-3 minutos
   ↓
6. Acessar site e testar
   ↓
7. Limpar cache (Ctrl + Shift + R)
   ↓
8. ✅ Pronto!
```

---

## 💡 DICAS IMPORTANTES

1. **Sempre baixe a versão COMPLETA do Figma Make** (não só alguns arquivos)

2. **Não edite arquivos manualmente depois de baixar** - faça as mudanças no Figma Make e baixe de novo

3. **Mantenha só UMA pasta do projeto** - delete versões antigas para não confundir

4. **Aguarde SEMPRE 2-3 minutos** após o push antes de verificar o site

5. **SEMPRE limpe o cache** (`Ctrl + Shift + R`) ao testar

---

## 🆘 PRECISA DE AJUDA?

**Me diga:**
- Em qual passo você está?
- Qual erro apareceu?
- Você já fez deploy antes ou é a primeira vez?

**E eu te ajudo!** 🚀

---

✅ **VOCÊ ESTÁ CERTO! BAIXAR DO FIGMA MAKE É A FORMA MAIS FÁCIL!**
