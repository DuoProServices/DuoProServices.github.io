# 🚀 DEPLOY RÁPIDO - ATUALIZAÇÃO

## Execute estes comandos no PowerShell:

```powershell
# 1. Copiar arquivo atualizado
Copy-Item "supabase\functions\server\index.tsx" "supabase\functions\make-server-c2a25be0\index.ts" -Force

# 2. Fazer deploy
supabase functions deploy make-server-c2a25be0
```

## Depois teste:

Abra no navegador:
```
https://lqpmyvizjfwzddxspacv.supabase.co/functions/v1/make-server-c2a25be0/ping
```

Deve retornar:
```
PONG - Server is alive!
```

---

**Execute agora!**
