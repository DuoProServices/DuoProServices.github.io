# 🌐 CONFIGURAR DOMÍNIO GODADDY COMPLETO

## 🎯 OBJETIVO:
Conectar **duoproservices.ca** (GoDaddy) ao seu site no GitHub Pages

---

## 📋 PROCESSO COMPLETO (3 ETAPAS):

```
ETAPA 1: Configurar GitHub Pages     (2 min)
    ↓
ETAPA 2: Adicionar domínio no GitHub (1 min)
    ↓
ETAPA 3: Configurar DNS no GoDaddy   (5 min)
    ↓
ETAPA 4: Aguardar propagação         (1-2 horas)
    ↓
✅ SITE NO AR em duoproservices.ca!
```

---

## 🔧 ETAPA 1: CONFIGURAR GITHUB PAGES

### **1.1 - Acesse Settings → Pages:**

```
https://github.com/duoproservices/SEU-REPO/settings/pages
```

### **1.2 - Em "Build and deployment":**

**Source:** Selecione `GitHub Actions` ✅

**NÃO selecione:** "Deploy from a branch"

### **1.3 - Salvar**

---

## 📝 ETAPA 2: ADICIONAR DOMÍNIO NO GITHUB

### **2.1 - Ainda na mesma tela (Pages), role para baixo até "Custom domain":**

### **2.2 - Digite no campo:**

```
duoproservices.ca
```

### **2.3 - Clique em "Save"**

**⏳ Aguarde:** GitHub vai verificar o domínio (pode dar erro por enquanto, é normal!)

### **2.4 - Marque (depois que DNS estiver configurado):**

```
☑️ Enforce HTTPS
```

**Nota:** Só marque DEPOIS de configurar o DNS! Se marcar antes, pode dar erro.

---

## 🌐 ETAPA 3: CONFIGURAR DNS NO GODADDY

### **3.1 - Acesse GoDaddy:**

```
https://dcc.godaddy.com/manage/duoproservices.ca/dns
```

**Ou:**
1. Vá em https://godaddy.com
2. Login
3. "My Products"
4. Ao lado de "duoproservices.ca" → "DNS"

---

### **3.2 - DELETAR registros antigos (IMPORTANTE!):**

**⚠️ ANTES de adicionar novos, DELETE estes se existirem:**

- ❌ Registro A com @ apontando para IP antigo
- ❌ Registro CNAME com @ 
- ❌ Registro A com www
- ❌ Qualquer "Parked" domain

**Deixe apenas:**
- ✅ Registros MX (se tiver email)
- ✅ Registros TXT (verificações)

---

### **3.3 - ADICIONAR novos registros DNS:**

Clique em **"Add"** ou **"Add Record"** e adicione CADA UM destes:

---

#### **📌 REGISTRO 1 - A Record:**

```
Type: A
Name: @
Value: 185.199.108.153
TTL: 600 seconds (ou 1 hour)
```

**Clique em "Save"**

---

#### **📌 REGISTRO 2 - A Record:**

```
Type: A
Name: @
Value: 185.199.109.153
TTL: 600 seconds
```

**Clique em "Save"**

---

#### **📌 REGISTRO 3 - A Record:**

```
Type: A
Name: @
Value: 185.199.110.153
TTL: 600 seconds
```

**Clique em "Save"**

---

#### **📌 REGISTRO 4 - A Record:**

```
Type: A
Name: @
Value: 185.199.111.153
TTL: 600 seconds
```

**Clique em "Save"**

---

#### **📌 REGISTRO 5 - CNAME Record (para www):**

```
Type: CNAME
Name: www
Value: duoproservices.github.io
TTL: 1 hour
```

**⚠️ IMPORTANTE:** O "Value" deve ser `duoproservices.github.io` (sem barra no final!)

**Clique em "Save"**

---

### **3.4 - RESULTADO FINAL no GoDaddy:**

Você deve ter exatamente isto:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 1 Hour |
| A | @ | 185.199.109.153 | 1 Hour |
| A | @ | 185.199.110.153 | 1 Hour |
| A | @ | 185.199.111.153 | 1 Hour |
| CNAME | www | duoproservices.github.io | 1 Hour |

**+ qualquer MX ou TXT que já existia**

---

## ⏱️ ETAPA 4: AGUARDAR PROPAGAÇÃO DNS

### **Tempo estimado:** 1-2 horas (pode ser até 48h)

### **Verificar propagação:**

Acesse: https://dnschecker.org/

Digite: `duoproservices.ca`

**Aguarde até ver os IPs do GitHub (185.199.108.153, etc) em várias localizações!**

---

## ✅ VERIFICAR SE FUNCIONOU:

### **Teste 1: DNS propagado?**

```
https://dnschecker.org/
Digite: duoproservices.ca
```

**Esperado:** IPs do GitHub (185.199.108.153, etc)

---

### **Teste 2: GitHub verificou?**

Volte em:
```
https://github.com/duoproservices/SEU-REPO/settings/pages
```

**Esperado:** 
```
✅ DNS check successful
```

---

### **Teste 3: Site carrega?**

Acesse:
```
http://duoproservices.ca
https://duoproservices.ca
http://www.duoproservices.ca
https://www.duoproservices.ca
```

**Todos devem funcionar!** 🎉

---

## 🔒 ATIVAR HTTPS:

Depois que o DNS estiver propagado (1-2 horas):

1. Volte em **Settings → Pages**
2. Marque: `☑️ Enforce HTTPS`
3. Aguarde 5-10 minutos
4. Acesse: `https://duoproservices.ca` ✅

---

## 🆘 PROBLEMAS COMUNS:

### **❌ "DNS check unsuccessful"**

**Solução:** DNS ainda não propagou. Aguarde mais tempo.

**Verificar:**
```
https://dnschecker.org/
```

---

### **❌ "Improperly configured"**

**Causas:**
- Esqueceu algum registro A
- CNAME errado (deve ser `duoproservices.github.io`)
- DNS ainda não propagou

**Solução:** Revise os 5 registros DNS!

---

### **❌ "Certificate error" ao acessar HTTPS**

**Solução:**
1. Desmarque "Enforce HTTPS"
2. Aguarde 10 minutos
3. Marque novamente
4. Aguarde 10 minutos

---

### **❌ Página 404 ao acessar**

**Causas:**
- Build ainda não rodou
- Domínio não adicionado corretamente

**Solução:**
1. Verifique Actions: https://github.com/duoproservices/SEU-REPO/actions
2. Re-rode o deploy: `git commit --allow-empty -m "Rebuild" && git push`

---

## 📊 CHECKLIST COMPLETO:

### **No GitHub:**
- [ ] Settings → Pages → Source: GitHub Actions ✅
- [ ] Custom domain: duoproservices.ca ✅
- [ ] DNS check successful ✅
- [ ] Enforce HTTPS marcado ✅

### **No GoDaddy:**
- [ ] 4 registros A com IPs do GitHub ✅
- [ ] 1 registro CNAME (www → duoproservices.github.io) ✅
- [ ] Registros antigos deletados ✅
- [ ] DNS propagado (dnschecker.org) ✅

### **Testes:**
- [ ] http://duoproservices.ca funciona ✅
- [ ] https://duoproservices.ca funciona ✅
- [ ] http://www.duoproservices.ca funciona ✅
- [ ] https://www.duoproservices.ca funciona ✅

---

## 🎯 RESUMO DOS IPs DO GITHUB:

**Sempre use ESTES 4 IPs nos registros A:**

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**E no CNAME:**
```
duoproservices.github.io
```

---

## 📞 LINKS ÚTEIS:

**GoDaddy DNS Manager:**
https://dcc.godaddy.com/manage/duoproservices.ca/dns

**GitHub Pages Settings:**
https://github.com/duoproservices/SEU-REPO/settings/pages

**Verificar DNS:**
https://dnschecker.org/

**Documentação GitHub:**
https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

---

## ⏱️ TIMELINE:

```
00:00 - Configurar GitHub Pages
00:02 - Adicionar domínio no GitHub
00:03 - Configurar DNS no GoDaddy
00:08 - Aguardar propagação... ☕
01:00 - Verificar dnschecker.org
02:00 - DNS propagado! ✅
02:05 - Ativar HTTPS
02:15 - SITE NO AR! 🎉
```

---

## 🎉 PRONTO!

Depois de seguir todos os passos:

✅ **duoproservices.ca** → Seu site  
✅ **www.duoproservices.ca** → Seu site  
✅ **HTTPS automático**  
✅ **Deploy automático** a cada git push  

---

**Criado:** Janeiro 2026  
**Domínio:** duoproservices.ca (GoDaddy)  
**Hospedagem:** GitHub Pages (Grátis!)
