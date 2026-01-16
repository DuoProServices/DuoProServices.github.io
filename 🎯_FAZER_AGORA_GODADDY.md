# 🎯 O QUE FAZER AGORA - ORDEM EXATA

## ⚡ EXECUTE NESTA ORDEM:

---

## ✅ PASSO 1: LIMPAR REPOSITÓRIO (5 min)

### **1.1 - Abra a pasta do projeto**

No VS Code, terminal, ou Explorer.

### **1.2 - Execute o script:**

**Windows:**
```bash
.\limpar-repositorio.bat
```

**OU duplo clique no arquivo:** `limpar-repositorio.bat`

### **1.3 - Aguarde ver:**
```
✅ LIMPEZA CONCLUÍDA!
```

### **1.4 - Faça push:**
```bash
git push
```

**✅ PASSO 1 COMPLETO!**

---

## ✅ PASSO 2: CONFIGURAR GITHUB PAGES (2 min)

### **2.1 - Acesse Settings → Pages:**

```
https://github.com/duoproservices/SEU-REPO/settings/pages
```

Substitua `SEU-REPO` pelo nome do seu repositório!

### **2.2 - Configure Source:**

**Build and deployment:**
- Source: `GitHub Actions` ✅

**Clique em qualquer lugar para salvar automaticamente**

### **2.3 - Adicione Custom domain:**

Role para baixo até "Custom domain"

Digite:
```
duoproservices.ca
```

Clique em **"Save"**

**⚠️ Vai aparecer erro:** "DNS check unsuccessful" - **É NORMAL!** 

Isso vai resolver no próximo passo!

### **2.4 - NÃO marque "Enforce HTTPS" ainda!**

Só marque isso DEPOIS que o DNS estiver configurado!

**✅ PASSO 2 COMPLETO!**

---

## ✅ PASSO 3: ADICIONAR SECRETS (1 min)

### **3.1 - Acesse Secrets:**

```
https://github.com/duoproservices/SEU-REPO/settings/secrets/actions
```

### **3.2 - Clique em "New repository secret"**

### **3.3 - Adicione Secret #1:**

```
Name: VITE_SUPABASE_URL
Secret: [Cole sua URL do Supabase]
```

**Onde encontrar:** https://supabase.com/dashboard → Seu projeto → Settings → API

Exemplo: `https://abc123xyz.supabase.co`

Clique em **"Add secret"**

### **3.4 - Adicione Secret #2:**

Clique em **"New repository secret"** novamente

```
Name: VITE_SUPABASE_ANON_KEY
Secret: [Cole sua chave pública do Supabase]
```

**Onde encontrar:** Mesma página (Settings → API)

Começa com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

Clique em **"Add secret"**

**✅ PASSO 3 COMPLETO!**

---

## ✅ PASSO 4: CONFIGURAR DNS NO GODADDY (5 min)

### **4.1 - Acesse DNS do GoDaddy:**

```
https://dcc.godaddy.com/manage/duoproservices.ca/dns
```

**OU:**
1. https://godaddy.com
2. My Products
3. duoproservices.ca → DNS

### **4.2 - DELETE registros antigos:**

Procure por:
- Registro A com @ (se tiver)
- CNAME com @ (se tiver)
- CNAME com www apontando para "parked" (se tiver)

**Delete eles!** (ícone de lixeira ou editar → delete)

### **4.3 - ADICIONE 5 novos registros:**

Clique em **"Add"** no topo da página.

---

#### **Registro A #1:**
```
Type: A
Name: @
Value: 185.199.108.153
TTL: 1 Hour
```
**Salve**

---

#### **Registro A #2:**
```
Type: A
Name: @
Value: 185.199.109.153
TTL: 1 Hour
```
**Salve**

---

#### **Registro A #3:**
```
Type: A
Name: @
Value: 185.199.110.153
TTL: 1 Hour
```
**Salve**

---

#### **Registro A #4:**
```
Type: A
Name: @
Value: 185.199.111.153
TTL: 1 Hour
```
**Salve**

---

#### **Registro CNAME:**
```
Type: CNAME
Name: www
Value: duoproservices.github.io
TTL: 1 Hour
```
**⚠️ SEM https:// e SEM / no final!**

**Salve**

---

### **4.4 - Verifique se está correto:**

Na lista de registros, você deve ver:

```
✅ A     @    185.199.108.153        1 Hour
✅ A     @    185.199.109.153        1 Hour
✅ A     @    185.199.110.153        1 Hour
✅ A     @    185.199.111.153        1 Hour
✅ CNAME www  duoproservices.github.io  1 Hour
```

**✅ PASSO 4 COMPLETO!**

---

## ⏳ PASSO 5: AGUARDAR PROPAGAÇÃO DNS (1-2 horas)

### **5.1 - Verificar a cada 30 minutos:**

Acesse: `https://dnschecker.org/`

Digite: `duoproservices.ca`

**Aguarde ver:** `185.199.108.153` (e outros IPs do GitHub)

**Verde em várias localizações** = DNS propagado! ✅

### **5.2 - Enquanto aguarda:**

☕ Tome um café  
📺 Assista algo  
🚶 Dê uma volta  

**NÃO fique mudando DNS! Aguarde!** ⏳

**✅ PASSO 5 COMPLETO quando DNS propagar!**

---

## ✅ PASSO 6: ATIVAR HTTPS (5 min)

### **Depois que DNS propagar:**

### **6.1 - Volte no GitHub Pages:**

```
https://github.com/duoproservices/SEU-REPO/settings/pages
```

### **6.2 - Verifique:**

Deve aparecer:
```
✅ DNS check successful
```

**Se ainda mostrar erro:** Aguarde mais um pouco (DNS ainda propagando)

### **6.3 - Marque HTTPS:**

```
☑️ Enforce HTTPS
```

**Clique em "Save"** (se tiver botão)

### **6.4 - Aguarde 10 minutos**

GitHub vai gerar certificado SSL automaticamente.

**✅ PASSO 6 COMPLETO!**

---

## 🎉 PASSO 7: TESTAR SEU SITE!

### **7.1 - Acesse (todos devem funcionar):**

```
✅ http://duoproservices.ca
✅ https://duoproservices.ca
✅ http://www.duoproservices.ca
✅ https://www.duoproservices.ca
```

### **7.2 - Deve mostrar seu site!**

Se mostrar 404 ou erro:
- Aguarde mais 5 minutos
- Limpe cache: `Ctrl + Shift + R`
- Teste em modo anônimo: `Ctrl + Shift + N`

### **7.3 - HTTPS funciona?**

Deve aparecer **cadeado verde** 🔒 na barra de endereço!

**✅ SITE NO AR! 🎉**

---

## 📊 RESUMO DOS PASSOS:

```
[✅] 1. Limpar repositório       (5 min)
[✅] 2. Configurar GitHub Pages  (2 min)
[✅] 3. Adicionar Secrets        (1 min)
[✅] 4. Configurar DNS GoDaddy   (5 min)
[⏳] 5. Aguardar DNS            (1-2h)
[✅] 6. Ativar HTTPS            (5 min)
[🎉] 7. SITE NO AR!
```

**Tempo total:** ~2-3 horas (maioria é espera do DNS)

---

## 🆘 ERRO EM ALGUM PASSO?

**Leia os guias detalhados:**

- 📖 `🌐_CONFIGURAR_DOMINIO_GODADDY.md` - Guia completo
- 📖 `🖼️_ONDE_CLICAR_GODADDY.md` - Onde clicar no GoDaddy
- 📖 `📋_COPIAR_E_COLAR_GODADDY.md` - IPs para copiar
- 📖 `🔧_RESOLVER_PROBLEMAS_GODADDY.md` - Troubleshooting

---

## 💡 DICAS:

### **Enquanto aguarda DNS:**
- ✅ Pode trabalhar no código normalmente
- ✅ Pode fazer commits e push
- ✅ Pode testar localmente com `npm run dev`

### **Não se preocupe se:**
- ⚠️ GitHub mostrar "DNS check unsuccessful" no início (normal!)
- ⚠️ dnschecker.org mostrar "não encontrado" no início (normal!)
- ⚠️ Demorar 1-2 horas (propagação DNS é assim mesmo!)

### **Preocupe-se apenas se:**
- ❌ Depois de 24 horas ainda não funcionar
- ❌ dnschecker.org mostrar IPs errados (não os do GitHub)
- ❌ Build falhar no GitHub Actions

---

## 📞 LINKS IMPORTANTES:

**GitHub Pages Settings:**
```
https://github.com/duoproservices/SEU-REPO/settings/pages
```

**GitHub Secrets:**
```
https://github.com/duoproservices/SEU-REPO/settings/secrets/actions
```

**GoDaddy DNS:**
```
https://dcc.godaddy.com/manage/duoproservices.ca/dns
```

**Verificar DNS:**
```
https://dnschecker.org/
```

**Supabase Dashboard:**
```
https://supabase.com/dashboard
```

---

## ✅ CHECKLIST FINAL:

Antes de considerar "pronto", verifique:

- [ ] Script de limpeza executado ✅
- [ ] Git push feito ✅
- [ ] GitHub Pages configurado (Source: GitHub Actions) ✅
- [ ] Custom domain adicionado (duoproservices.ca) ✅
- [ ] Secrets adicionados (VITE_SUPABASE_*) ✅
- [ ] 4 registros A no GoDaddy ✅
- [ ] 1 registro CNAME no GoDaddy ✅
- [ ] DNS propagado (dnschecker.org verde) ✅
- [ ] GitHub mostra "DNS check successful" ✅
- [ ] HTTPS habilitado ✅
- [ ] Site carrega em duoproservices.ca ✅
- [ ] Site carrega em www.duoproservices.ca ✅
- [ ] HTTPS funciona (cadeado verde) ✅

---

## 🚀 COMECE AGORA!

**Primeiro passo:**

```bash
.\limpar-repositorio.bat
```

**Depois siga os passos acima na ordem!**

Boa sorte! 🍀

---

**Criado:** Janeiro 2026  
**Domínio:** duoproservices.ca (GoDaddy)  
**Hospedagem:** GitHub Pages (Grátis!)  
**Deploy:** Automático via GitHub Actions
