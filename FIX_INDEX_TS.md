# 🚨 FIX: index.ts not found

## ❌ ERRO:
```
open supabase\functions\server\index.ts: The system cannot find the file specified
```

---

## ✅ SOLUÇÃO:

O Supabase CLI procura por `index.ts`, mas o arquivo é `index.tsx`.

### **OPÇÃO 1: Renomear via Windows Explorer (MAIS FÁCIL)**

1. Navegue até a pasta:
   ```
   C:\Users\Veronica Prass\Downloads\DuoPro Services 202613\supabase\functions\server\
   ```

2. Renomeie o arquivo:
   ```
   index.tsx  →  index.ts
   ```

3. Rode novamente:
   ```powershell
   supabase functions deploy server --no-verify-jwt
   ```

---

### **OPÇÃO 2: Renomear via PowerShell**

```powershell
cd "C:\Users\Veronica Prass\Downloads\DuoPro Services 202613"
Rename-Item "supabase\functions\server\index.tsx" "index.ts"
supabase functions deploy server --no-verify-jwt
```

---

## ⚠️ IMPORTANTE:

As importações `.tsx` dentro do `index.ts` **FUNCIONAM** no Deno/Supabase.

Você NÃO precisa renomear os outros 17 arquivos.

Só precisa renomear o `index.tsx` → `index.ts`

---

## 🚀 TESTE:

Depois de renomear, rode:

```powershell
supabase functions deploy server --no-verify-jwt
```

Deve aparecer:
```
✅ Deployed Function server version xxx
```

Aguarde 15 segundos, depois teste:
```
https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/health
```

✅ **FUNCIONANDO!**
