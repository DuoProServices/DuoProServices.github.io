# ⚡ COMANDOS RÁPIDOS - COPIAR E COLAR

## 🚀 DEPLOY IMEDIATO:

```powershell
git add .
git commit -m "fix: Resolve cache issues and remove email confirmation requirement"
git push origin main
```

---

## 🔍 APÓS O DEPLOY - TESTAR:

### 1️⃣ Abrir Diagnóstico:
```
https://duoproservices.github.io/diagnostic
```

### 2️⃣ Abrir Setup:
```
https://duoproservices.github.io/setup
```

### 3️⃣ Abrir Debug Panel:
```
https://duoproservices.github.io/auth-debug
```

---

## 🔧 SE PRECISAR LIMPAR TUDO:

### No DevTools Console (F12):
```javascript
// Limpar localStorage
localStorage.clear();

// Limpar todos os caches
caches.keys().then(names => names.forEach(name => caches.delete(name)));

// Recarregar
location.reload();
```

---

## 📊 VERIFICAR STATUS NO CONSOLE:

```javascript
// Verificar variáveis de ambiente
console.log('Project ID:', import.meta.env.VITE_SUPABASE_PROJECT_ID);
console.log('Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');

// Verificar versão
console.log('App Version:', localStorage.getItem('app_version'));

// Verificar URL
console.log('Current URL:', window.location.href);
```

---

## 🎯 CRIAR CONTAS ADMIN - CREDENCIAIS:

### Opção 1: Senha Padrão
```
Email: veprass@gmail.com
Senha: admin123

Email: germana.canada@gmail.com
Senha: admin123

Email: jamila.coura15@gmail.com
Senha: admin123
```

### Opção 2: Senha Personalizada
Escolha sua própria senha no QuickAdminSetup (mín. 6 caracteres)

---

## 🗑️ DELETAR TODAS AS CONTAS (SE NECESSÁRIO):

1. Vá para: https://duoproservices.github.io/auth-debug
2. Role até "DANGER ZONE"
3. Clique no botão vermelho "Deleta TUDO"
4. Aguarde confirmação
5. Volte para /setup e recrie

---

## 🔄 ATALHOS DE TECLADO:

| Ação | Windows/Linux | Mac |
|------|---------------|-----|
| Hard Reload (sem cache) | `Ctrl + Shift + R` | `Cmd + Shift + R` |
| Abrir DevTools | `F12` ou `Ctrl + Shift + I` | `Cmd + Option + I` |
| Limpar Dados do Site | `Ctrl + Shift + Delete` | `Cmd + Shift + Delete` |
| Modo Anônimo | `Ctrl + Shift + N` | `Cmd + Shift + N` |

---

## ✅ CHECKLIST RÁPIDO:

```
[ ] git push origin main
[ ] Aguardar 1-2 minutos
[ ] Ctrl + Shift + R em /setup
[ ] Ver "Quick Admin Setup"
[ ] Ver banner amarelo no topo
[ ] Criar 3 contas admin
[ ] Login funcionando
[ ] PRONTO! ✨
```

---

## 🆘 SUPORTE RÁPIDO:

Se nada funcionar:
1. Abrir /diagnostic
2. Screenshot da página
3. F12 → Console → Screenshot
4. Compartilhar para análise

---

**COPIE E COLE OS COMANDOS CONFORME NECESSÁRIO!** 🚀
