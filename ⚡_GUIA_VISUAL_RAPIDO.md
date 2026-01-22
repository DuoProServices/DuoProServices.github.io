# ⚡ GUIA VISUAL RÁPIDO

## 🎯 SITUAÇÃO ATUAL:

```
┌─────────────────────────────────────┐
│  ⚠️  ARQUIVOS DO ADOBE NO GIT       │
│  Precisa limpar antes de deploy     │
└─────────────────────────────────────┘
```

---

## 🚀 SOLUÇÃO EM 3 ETAPAS:

### **ETAPA 1: LIMPAR (2 min)**

```
┌──────────────────────┐
│ limpar-repositorio   │  ← Execute este script
│       .bat           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  ✅ Repo limpo       │
└──────────────────────┘
```

**Execute:**
```bash
limpar-repositorio.bat
```

---

### **ETAPA 2: CONFIGURAR GITHUB (3 min)**

```
┌─────────────────────┐
│  1. Settings        │  https://github.com/USER/REPO/settings/pages
│     → Pages         │  Source: GitHub Actions ✅
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  2. Settings        │  https://github.com/USER/REPO/settings/secrets
│     → Secrets       │  Add: VITE_SUPABASE_URL
│                     │  Add: VITE_SUPABASE_ANON_KEY
└─────────────────────┘
```

---

### **ETAPA 3: DEPLOY (2 min)**

```
┌─────────────────────┐
│  git push           │  ← Push para GitHub
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  GitHub Actions     │  ← Build automático
│  running...         │  Aguarde 2-5 min
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  ✅ SITE NO AR! 🎉 │
│  USER.github.io/    │
│  REPO/              │
└─────────────────────┘
```

---

## 📊 VISUALIZAÇÃO DO FLUXO:

```
VOCÊ ESTÁ AQUI
      ↓
┌─────────────────┐
│ Código pronto   │ ← ✅ Feito
│ para deploy     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Limpar Adobe    │ ← 🔄 EXECUTAR AGORA!
│ do repositório  │    limpar-repositorio.bat
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ git push        │ ← Depois da limpeza
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Configurar      │ ← Settings → Pages
│ GitHub Pages    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Adicionar       │ ← Settings → Secrets
│ Secrets         │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ 🎉 SITE NO AR!  │
└─────────────────┘
```

---

## ⏱️ TEMPO ESTIMADO:

| Etapa | Tempo |
|-------|-------|
| Limpar repo | 2 min |
| Config GitHub | 3 min |
| Deploy | 2 min |
| **TOTAL** | **7 min** |

---

## 🎯 PRÓXIMOS 3 COMANDOS:

```bash
# 1️⃣
limpar-repositorio.bat

# 2️⃣
git push

# 3️⃣
# Configure no navegador:
# https://github.com/SEU-USUARIO/SEU-REPO/settings/pages
```

---

## 📱 ACESSO RÁPIDO:

### **Após deploy, acesse:**

```
🌐 Site: https://SEU-USUARIO.github.io/SEU-REPO/

📊 Actions: https://github.com/SEU-USUARIO/SEU-REPO/actions

⚙️ Settings: https://github.com/SEU-USUARIO/SEU-REPO/settings
```

---

## ✅ CHECKLIST VISUAL:

```
[ ] Executei limpar-repositorio.bat
[ ] Fiz git push
[ ] Configurei Pages (Source: GitHub Actions)
[ ] Adicionei Secrets (VITE_SUPABASE_URL)
[ ] Adicionei Secrets (VITE_SUPABASE_ANON_KEY)
[ ] Verifiquei Actions (✅ verde)
[ ] Acessei meu site
[ ] 🎉 FUNCIONA!
```

---

## 🆘 SE TRAVAR:

```
Erro? → Leia: 🔧_TROUBLESHOOTING_GITHUB_PAGES.md
Dúvida? → Leia: 🚀_COMECE_AQUI_GITHUB_PAGES.md
Comandos? → Leia: 📋_COMANDOS_PRONTOS.md
```

---

## ⚡ COMECE AGORA:

```
>>> limpar-repositorio.bat
```

**Cole no terminal e pressione Enter!** 🚀

---

**Criado:** Janeiro 2026  
**Tempo até site no ar:** 7 minutos ⏱️
