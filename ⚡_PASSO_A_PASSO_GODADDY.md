# ⚡ PASSO A PASSO GODADDY - VERSÃO RÁPIDA

## 🎯 3 PASSOS PARA SEU SITE NO AR:

---

## 1️⃣ GITHUB PAGES (2 min)

### **Acesse:**
```
https://github.com/duoproservices/SEU-REPO/settings/pages
```

### **Configure:**
- **Source:** `GitHub Actions` ✅
- **Custom domain:** `duoproservices.ca`
- **Save**

**⏭️ PRÓXIMO PASSO →**

---

## 2️⃣ GODADDY DNS (5 min)

### **Acesse:**
```
https://dcc.godaddy.com/manage/duoproservices.ca/dns
```

### **Delete registros antigos:**
- ❌ Qualquer A record com @
- ❌ Qualquer CNAME com @

### **Adicione 5 NOVOS registros:**

#### **Registros A (adicione os 4):**
```
Type: A,  Name: @,  Value: 185.199.108.153
Type: A,  Name: @,  Value: 185.199.109.153
Type: A,  Name: @,  Value: 185.199.110.153
Type: A,  Name: @,  Value: 185.199.111.153
```

#### **Registro CNAME:**
```
Type: CNAME,  Name: www,  Value: duoproservices.github.io
```

**⏭️ PRÓXIMO PASSO →**

---

## 3️⃣ AGUARDAR (1-2 horas)

### **Verificar DNS:**
```
https://dnschecker.org/
Digite: duoproservices.ca
```

**Aguarde ver:** `185.199.108.153` (e outros IPs do GitHub)

### **Quando DNS propagar:**

Volte no GitHub Pages e marque:
```
☑️ Enforce HTTPS
```

**⏭️ SITE NO AR! →**

---

## ✅ TESTAR:

Acesse (todos devem funcionar):
- ✅ http://duoproservices.ca
- ✅ https://duoproservices.ca
- ✅ http://www.duoproservices.ca
- ✅ https://www.duoproservices.ca

---

## 🎉 PRONTO!

Seu site estará em:
```
🌐 duoproservices.ca
```

Com:
- ✅ HTTPS automático
- ✅ Deploy automático (git push)
- ✅ Grátis para sempre

---

## 🆘 ERRO?

Leia: `🌐_CONFIGURAR_DOMINIO_GODADDY.md` (guia completo)

---

**Tempo total até site no ar:** 1-2 horas (devido propagação DNS)
