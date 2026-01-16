# 📋 INSTRUÇÕES DE CÓPIA MANUAL

## 🎯 PASSO A PASSO SIMPLES:

### **1. Abra o Explorador de Arquivos do Windows**

Navegue até:
```
C:\Users\Veronica Prass\Downloads\DuoPro Services 202613
```

---

### **2. Localize o arquivo FONTE (para copiar)**

Caminho completo:
```
supabase\functions\server\index.tsx
```

**Este é o arquivo CORRETO e COMPLETO!**

---

### **3. Copie o arquivo**

- Clique com botão direito em `index.tsx`
- Selecione **"Copiar"**

---

### **4. Navegue até a pasta DESTINO**

Caminho completo:
```
supabase\functions\make-server-c2a25be0\
```

---

### **5. Cole e RENOMEIE o arquivo**

- Dentro da pasta `make-server-c2a25be0`, clique com botão direito
- Selecione **"Colar"**
- O arquivo `index.tsx` será colado
- **RENOMEIE** o arquivo de `index.tsx` para `index.ts` (remova o "x" do final)
- **IMPORTANTE:** Se já existir um arquivo `index.ts`, **SUBSTITUA** (escolha "Sim" quando perguntar)

---

### **6. Faça o deploy no PowerShell**

Abra o PowerShell novamente na pasta do projeto e execute:

```powershell
supabase functions deploy make-server-c2a25be0
```

---

## ✅ **RESULTADO ESPERADO:**

Você verá algo assim:
```
Uploading asset (make-server-c2a25be0): supabase/functions/import_map.json
Uploading asset (make-server-c2a25be0): supabase/functions/make-server-c2a25be0/index.ts
...
Deployed Functions on project lqpmyvizjfwzddxspacv: make-server-c2a25be0
```

---

## 🧪 **TESTE DEPOIS DO DEPLOY:**

Abra o arquivo no navegador:
```
TESTE-BACKEND-FINAL.html
```

Ou acesse:
```
http://localhost:5173/test-server-connection
```

---

## 📸 **RESUMO VISUAL:**

```
📁 supabase
  📁 functions
    📁 server
      📄 index.tsx  ← COPIAR ESTE
    📁 make-server-c2a25be0
      📄 index.ts   ← COLAR AQUI (renomeado)
```

---

## 🆘 **SE TIVER DÚVIDA:**

Me envie uma screenshot da pasta `make-server-c2a25be0` para eu confirmar!
