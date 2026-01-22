# 🔧 FIX: Error fetching dashboard data

## 🎯 O PROBLEMA

Você está vendo este erro:
```
Error fetching dashboard data: TypeError: Failed to fetch
```

**CAUSA:** O código que você deployou pode estar desatualizado ou incompleto.

---

## ✅ SOLUÇÃO RÁPIDA (3 passos)

### **PASSO 1: Teste se o endpoint está funcionando**

Abra este arquivo no navegador:
```
test-dashboard-endpoint.html
```

Clique em **"Run All Tests"** e veja qual teste falha.

---

### **PASSO 2: Re-deploy do código COMPLETO**

Você precisa fazer o deploy novamente, mas desta vez copiar **TODO** o arquivo.

#### **2.1 - Vá para o Supabase Dashboard**

Link direto:
```
https://supabase.com/dashboard/project/lqpmyvizjfwzddxspacv/functions/make-server-c2a25be0
```

#### **2.2 - Copie o código COMPLETO**

No seu editor de código local, abra:
```
/supabase/functions/server/index.tsx
```

**Pressione:**
- Windows: `Ctrl + A` (selecionar tudo) → `Ctrl + C` (copiar)
- Mac: `Cmd + A` (selecionar tudo) → `Cmd + C` (copiar)

#### **2.3 - Cole no Supabase Dashboard**

1. Na página do Edge Function (link acima)
2. **Selecione TODO o código** que está no editor (Ctrl+A ou Cmd+A)
3. **DELETE** tudo
4. **COLE** o código que você copiou (Ctrl+V ou Cmd+V)
5. **Clique** no botão verde: **"Deploy function"**

#### **2.4 - Aguarde o deploy**

Você verá:
```
✅ Successfully updated edge function
```

Aguarde **10-15 segundos** para o deploy se completar.

---

### **PASSO 3: Limpe o cache e teste**

#### **3.1 - Limpe o cache do navegador**

- Windows: `Ctrl + Shift + Delete`
- Mac: `Cmd + Shift + Delete`

Marque:
- ✅ Cached images and files
- ✅ Cookies and other site data

Clique em **"Clear data"**

#### **3.2 - Recarregue o app**

- Pressione `F5` ou `Ctrl + R` (Windows)
- Pressione `Cmd + R` (Mac)

#### **3.3 - Teste novamente**

- Faça login
- Vá para a página Admin
- ✅ O erro deve ter desaparecido!

---

## 🧪 VERIFICAÇÃO

### **Teste 1: Health Check**

Abra no navegador:
```
https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health
```

✅ **Deve retornar:**
```json
{"status":"ok","timestamp":"2026-01-15T..."}
```

---

### **Teste 2: Get Profiles Endpoint**

Abra no navegador:
```
https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/kv/getByPrefix?prefix=profile:
```

✅ **Deve retornar:**
```json
{"values":[...]}
```

❌ **Se retornar 404 ou erro:**
→ O código não foi deployado corretamente. Repita o PASSO 2.

---

## 🐛 TROUBLESHOOTING

### ❌ Erro: "Failed to fetch" continua aparecendo

**Possíveis causas:**

#### 1. Código incompleto no deploy

**Solução:**
- Certifique-se de copiar **TODO** o arquivo `index.tsx`
- O arquivo tem mais de 3800 linhas - verifique se copiou tudo
- Role até o final do arquivo e certifique-se que tem `Deno.serve(app.fetch);`

---

#### 2. Cache do navegador

**Solução:**
- Feche TODAS as abas do seu app
- Limpe o cache (Ctrl+Shift+Delete)
- Abra o app em uma **aba anônima/privada**

---

#### 3. Deploy não foi completado

**Solução:**
- Aguarde 30 segundos após clicar em "Deploy function"
- Recarregue a página do Supabase Dashboard
- Verifique se a data de "Last deployed" foi atualizada

---

### ❌ Erro: "Unauthorized" ou 401

**Causa:** Problema com autenticação

**Solução:**
1. Faça logout do app
2. Limpe cookies (Ctrl+Shift+Delete)
3. Faça login novamente

---

### ❌ Erro: CORS policy blocked

**Causa:** CORS não configurado no servidor

**Solução:**
- O arquivo `index.tsx` já tem CORS configurado
- Certifique-se de deployar o código completo
- Verifique se as linhas 111-122 do arquivo estão presentes

---

## 📊 CHECKLIST DE VERIFICAÇÃO

Antes de pedir ajuda, confirme:

- [ ] Copiei **TODO** o arquivo `index.tsx` (mais de 3800 linhas)
- [ ] Cliquei em "Deploy function" e aguardei a confirmação
- [ ] Aguardei 15-30 segundos após o deploy
- [ ] Limpei o cache do navegador
- [ ] Recarreguei a página do app (F5)
- [ ] Testei o endpoint `/health` e funcionou
- [ ] Testei o endpoint `/kv/getByPrefix` e funcionou
- [ ] O erro ainda aparece mesmo depois de tudo isso

---

## 🔍 LOGS DE DEBUG

Se o erro continuar, abra o Console do navegador:

1. Pressione `F12`
2. Vá para a aba **"Console"**
3. Recarregue a página
4. Procure por erros em vermelho
5. **Me envie** o print completo dos erros

---

## 📞 PRECISA DE AJUDA?

Se ainda não funcionar, me envie:

1. ✅ Print do erro no console (F12)
2. ✅ Print da página do Supabase mostrando "Last deployed" 
3. ✅ Resultado do teste em `test-dashboard-endpoint.html`
4. ✅ Resultado ao abrir: `/health` endpoint no navegador

---

## ⚡ COMANDO RÁPIDO (Alternativa via Terminal)

Se preferir, pode usar o terminal:

```bash
npm install -g supabase
supabase login
supabase link --project-ref lqpmyvizjfwzddxspacv
supabase functions deploy server --project-ref lqpmyvizjfwzddxspacv --no-verify-jwt
```

---

**🚀 Siga os 3 passos acima e o erro será corrigido!**
