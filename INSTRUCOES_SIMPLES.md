# 🎯 INSTRUÇÕES SUPER SIMPLES

## O QUE FAZER AGORA (Passo a Passo)

### 📍 **PASSO 1: Abrir o Terminal**

Abra o terminal no seu computador.

---

### 📍 **PASSO 2: Navegar até a pasta do projeto**

```bash
cd /caminho/para/seu/projeto
```

*(Substitua `/caminho/para/seu/projeto` pelo caminho real do projeto)*

---

### 📍 **PASSO 3: Copiar os Arquivos**

Execute estes comandos **um por um**:

```bash
# Copiar TODOS os arquivos da pasta server para make-server-c2a25be0
cp supabase/functions/server/*.tsx supabase/functions/make-server-c2a25be0/
cp supabase/functions/server/*.ts supabase/functions/make-server-c2a25be0/

# Se existir pasta de templates, copie também
cp -r supabase/functions/server/email-templates supabase/functions/make-server-c2a25be0/ 2>/dev/null

# Renomear index.tsx para index.ts
mv supabase/functions/make-server-c2a25be0/index.tsx supabase/functions/make-server-c2a25be0/index.ts 2>/dev/null
```

---

### 📍 **PASSO 4: Instalar Supabase CLI** (se ainda não tem)

```bash
npm install -g supabase
```

---

### 📍 **PASSO 5: Fazer Login no Supabase**

```bash
supabase login
```

Isso vai abrir o navegador. Faça login na sua conta Supabase.

---

### 📍 **PASSO 6: Linkar com o Projeto**

```bash
supabase link --project-ref pwlacumydrxvshklvttp
```

Se pedir senha do database, você pode encontrar em:
https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/settings/database

---

### 📍 **PASSO 7: FAZER O DEPLOY! 🚀**

```bash
supabase functions deploy make-server-c2a25be0
```

Aguarde... Você verá mensagens de upload e deploy.

Quando terminar, verá algo como:
```
✓ Deployed make-server-c2a25be0
```

---

### 📍 **PASSO 8: TESTAR!**

1. Volte ao site (preview do Figma Make)
2. Clique no botão roxo **"🧪 Test Server"** (canto inferior direito)
3. Clique em **"🚀 Run All Tests"**
4. **DEVE APARECER TUDO VERDE! ✅**

---

## 🎉 PRONTO!

Se todos os testes passarem (verde), o site está funcionando!

Agora você pode:
- Criar usuários
- Fazer login
- Usar todas as funcionalidades

---

## ❓ Dúvidas Comuns

### "Não sei o caminho do meu projeto"
- No terminal, digite: `pwd` para ver onde você está
- Navegue com `cd` até encontrar a pasta que tem `supabase/functions/`

### "Erro: command not found"
- Certifique-se de ter Node.js instalado: `node --version`
- Se não tiver, instale: https://nodejs.org/

### "Os testes ainda falham"
- Aguarde 30 segundos e tente novamente
- Limpe o cache do browser (Ctrl+Shift+R)
- Verifique se o deploy terminou sem erros

---

## 📞 Precisa de Ajuda?

Cole aqui o erro que aparecer no terminal e vou te ajudar!
