# ✅ CHECKLIST DE DEPLOY

## 📋 Siga esta ordem:

### ☐ 1. Abrir o Terminal
- No Windows: `cmd` ou `PowerShell`
- No Mac/Linux: `Terminal`

### ☐ 2. Navegar até a pasta do projeto
```bash
cd /caminho/do/seu/projeto
```
**Dica:** Use `Tab` para autocompletar o caminho

### ☐ 3. Verificar se está no lugar certo
```bash
ls supabase/functions/server/
```
**Deve listar:** `index.tsx`, `kv_store.tsx`, etc.

### ☐ 4. Instalar Supabase CLI (se ainda não tem)
```bash
npm install -g supabase
```
**Confirme:** `supabase --version`

### ☐ 5. Fazer login no Supabase
```bash
supabase login
```
**O que acontece:** Abre o navegador para você fazer login

### ☐ 6. Linkar com o projeto
```bash
supabase link --project-ref pwlacumydrxvshklvttp
```
**Se pedir senha:** Pegue em https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/settings/database

### ☐ 7. Copiar os arquivos
**Opção A - Usar o script:**
```bash
node copy-files.js
```

**Opção B - Comandos manuais:**
```bash
cp supabase/functions/server/*.tsx supabase/functions/make-server-c2a25be0/
cp supabase/functions/server/*.ts supabase/functions/make-server-c2a25be0/
mv supabase/functions/make-server-c2a25be0/index.tsx supabase/functions/make-server-c2a25be0/index.ts
```

### ☐ 8. FAZER O DEPLOY! 🚀
```bash
supabase functions deploy make-server-c2a25be0
```
**O que ver:** 
```
Deploying function...
✓ Deployed make-server-c2a25be0
```

### ☐ 9. Testar no site
1. Abra o preview do site
2. Clique no botão **"🧪 Test Server"** (roxo, inferior direito)
3. Clique **"🚀 Run All Tests"**

### ☐ 10. Verificar resultado
**✅ SUCESSO se ver:**
- ✅ Health Check: PASSED
- ✅ Server Alive: PASSED
- ✅ List Users: PASSED

**❌ FALHOU se ver:**
- ❌ Failed to fetch

---

## 🐛 ERROS COMUNS

### ❌ "command not found: supabase"
**Solução:**
```bash
npm install -g supabase
```

### ❌ "command not found: node"
**Solução:** Instale Node.js em https://nodejs.org/

### ❌ "No such file or directory"
**Solução:** Você está na pasta errada. Use `cd` para navegar

### ❌ "Permission denied"
**Solução:** 
- Windows: Abra PowerShell como Administrador
- Mac/Linux: Use `sudo npm install -g supabase`

### ❌ "Project not linked"
**Solução:**
```bash
supabase link --project-ref pwlacumydrxvshklvttp
```

### ❌ Os testes ainda falham depois do deploy
**Soluções:**
1. Aguarde 30 segundos (deploy demora)
2. Limpe o cache: `Ctrl + Shift + R`
3. Verifique o log do deploy - teve erro?

---

## 📞 AINDA COM PROBLEMAS?

Cole aqui:
1. O comando que você executou
2. O erro completo que apareceu
3. A resposta de `ls supabase/functions/`

---

## 🎉 QUANDO FUNCIONAR

Você verá todos os testes **VERDES** ✅

E o site estará **FUNCIONANDO COMPLETAMENTE!**

- ✅ Signup funciona
- ✅ Login funciona
- ✅ Upload de documentos funciona
- ✅ Portal do cliente funciona
- ✅ TUDO funciona!

---

**Boa sorte! 🚀**
