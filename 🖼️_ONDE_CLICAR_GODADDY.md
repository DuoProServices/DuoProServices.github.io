# 🖼️ ONDE CLICAR NO GODADDY - GUIA VISUAL

## 🎯 PASSO A PASSO COM DESCRIÇÃO DAS TELAS:

---

## 1️⃣ ACESSAR GODADDY DNS

### **Opção A: Link direto**
```
https://dcc.godaddy.com/manage/duoproservices.ca/dns
```

### **Opção B: Navegar pelo site**

1. Acesse: `https://godaddy.com`
2. Clique em **"Sign In"** (canto superior direito)
3. Digite seu email e senha
4. Clique em **"My Products"** (menu superior)
5. Encontre **"duoproservices.ca"**
6. Clique no botão **"DNS"** (ao lado do domínio)

---

## 2️⃣ TELA DE DNS (O QUE VOCÊ VERÁ)

Quando abrir a tela de DNS, você verá:

```
┌────────────────────────────────────────┐
│ DNS Management                          │
│                                         │
│ [Add]  ← Clique aqui para adicionar    │
│                                         │
│ Records                                 │
│ ┌────────────────────────────────────┐ │
│ │ Type  Name  Value          TTL     │ │
│ │ ─────────────────────────────────  │ │
│ │ A     @     (algum IP)     1 Hour  │ │ ← DELETE isto
│ │ CNAME www   parked         1 Hour  │ │ ← DELETE isto
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

---

## 3️⃣ DELETAR REGISTROS ANTIGOS

### **Para cada registro antigo:**

1. Clique no **ícone de lápis** (editar) ao lado do registro
2. **OU** clique no registro
3. Procure opção **"Delete"** ou **ícone de lixeira** 🗑️
4. Confirme: **"Yes, delete"**

### **Delete APENAS:**
- ❌ A record com @ (se tiver IP diferente dos do GitHub)
- ❌ CNAME com @ 
- ❌ CNAME com www apontando para "parked"

### **NÃO DELETE:**
- ✅ MX records (se tiver email)
- ✅ TXT records (verificações)
- ✅ NS records (nameservers)

---

## 4️⃣ ADICIONAR NOVO REGISTRO A

### **Clique no botão "Add" (no topo da página)**

Uma janela vai abrir com campos:

```
┌─────────────────────────────┐
│ Add DNS Record              │
│                             │
│ Type: [Dropdown]            │ ← Selecione "A"
│                             │
│ Name: [___________]         │ ← Digite: @
│                             │
│ Value: [___________]        │ ← Cole: 185.199.108.153
│                             │
│ TTL: [Dropdown]             │ ← Selecione "1 Hour" ou "600"
│                             │
│ [Save]  [Cancel]            │ ← Clique em Save
└─────────────────────────────┘
```

### **Preencha:**

**Campo "Type":**
- Clique no dropdown
- Selecione **"A"**

**Campo "Name" ou "Host":**
- Digite: `@` (apenas o símbolo arroba)
- **NÃO** digite "duoproservices.ca"

**Campo "Value" ou "Points to":**
- Cole: `185.199.108.153` (primeiro IP)

**Campo "TTL":**
- Selecione "1 Hour" ou digite "600"

**Clique em "Save"**

---

## 5️⃣ REPETIR PARA OS OUTROS 3 IPs

Clique em **"Add"** novamente e repita o processo:

### **Registro A #2:**
```
Type: A
Name: @
Value: 185.199.109.153
TTL: 1 Hour
```

### **Registro A #3:**
```
Type: A
Name: @
Value: 185.199.110.153
TTL: 1 Hour
```

### **Registro A #4:**
```
Type: A
Name: @
Value: 185.199.111.153
TTL: 1 Hour
```

---

## 6️⃣ ADICIONAR REGISTRO CNAME (www)

### **Clique em "Add" novamente**

```
┌─────────────────────────────────────┐
│ Add DNS Record                      │
│                                     │
│ Type: [Dropdown]                    │ ← Selecione "CNAME"
│                                     │
│ Name: [___________]                 │ ← Digite: www
│                                     │
│ Value: [___________________]        │ ← Cole: duoproservices.github.io
│                                     │
│ TTL: [Dropdown]                     │ ← Selecione "1 Hour"
│                                     │
│ [Save]  [Cancel]                    │ ← Clique em Save
└─────────────────────────────────────┘
```

### **Preencha:**

**Type:** `CNAME`

**Name:** `www` (apenas www, sem @)

**Value:** `duoproservices.github.io` 
- ⚠️ **SEM** `https://`
- ⚠️ **SEM** `/` no final
- ⚠️ **SEM** `www.`

**TTL:** `1 Hour`

**Clique em "Save"**

---

## 7️⃣ RESULTADO FINAL

Depois de adicionar todos, você verá:

```
┌────────────────────────────────────────────────┐
│ DNS Management                                  │
│                                                 │
│ Records                                         │
│ ┌────────────────────────────────────────────┐ │
│ │ Type  Name  Value                    TTL   │ │
│ │ ──────────────────────────────────────────  │ │
│ │ A     @     185.199.108.153         1 Hour │ │ ✅
│ │ A     @     185.199.109.153         1 Hour │ │ ✅
│ │ A     @     185.199.110.153         1 Hour │ │ ✅
│ │ A     @     185.199.111.153         1 Hour │ │ ✅
│ │ CNAME www   duoproservices.github.io 1 Hour│ │ ✅
│ └────────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

**✅ PERFEITO!** Você configurou corretamente!

---

## 8️⃣ SALVAR/APLICAR MUDANÇAS

### **GoDaddy geralmente salva automaticamente, mas:**

Procure por um botão:
- **"Save Changes"**
- **"Apply Changes"**
- **"Update"**

**Se tiver, clique nele!**

Se não tiver, as mudanças já foram salvas automaticamente.

---

## ⏱️ PROPAGAÇÃO

Você verá uma mensagem tipo:

```
✅ DNS records updated successfully!
Changes may take up to 48 hours to propagate.
```

**Na prática:** Geralmente 1-2 horas! ⚡

---

## 🔍 VERIFICAR SE ESTÁ CERTO

### **Ainda na tela de DNS do GoDaddy:**

Conte os registros:
- [ ] **4 registros A** com @ e IPs do GitHub ✅
- [ ] **1 registro CNAME** com www → duoproservices.github.io ✅

### **Verificar online:**

Acesse: `https://dnschecker.org/`
Digite: `duoproservices.ca`

**Aguarde aparecer:** `185.199.108.153` (e outros IPs do GitHub)

---

## 🆘 PROBLEMAS COMUNS:

### **❌ "Name @ is already in use"**

**Causa:** Já existe um registro A com @

**Solução:** Delete o registro antigo primeiro!

---

### **❌ "CNAME cannot be used with @"**

**Causa:** Tentou usar CNAME com @ (não é permitido!)

**Solução:** Use "www" no CNAME, não "@"

---

### **❌ "Invalid value"**

**Causas comuns:**
- Colocou `https://` no CNAME (remova!)
- Colocou `/` no final (remova!)
- Espaços no IP (remova!)

**Solução:** Cole EXATAMENTE como está no guia!

---

## 💡 DICAS:

### **Copiar e Colar:**
- ✅ Use Ctrl+C / Ctrl+V para copiar IPs
- ✅ Evite digitar manualmente (pode errar!)

### **Verificar antes de salvar:**
- ✅ Confira se o IP está correto
- ✅ Confira se o Name está correto (@ ou www)
- ✅ Confira se não tem espaços extras

---

## 📱 NO CELULAR?

O processo é o mesmo, mas:
- Telas podem estar em formato móvel
- Botões podem estar em locais diferentes
- **Recomendo usar computador para evitar erros!**

---

## ✅ PRÓXIMOS PASSOS:

Depois de configurar DNS:

1. ⏳ Aguarde 1-2 horas
2. 🔍 Verifique em dnschecker.org
3. 🌐 Acesse duoproservices.ca
4. 🎉 SITE NO AR!

---

**Configurou tudo? Volte para:** `⚡_PASSO_A_PASSO_GODADDY.md`

---

**Criado:** Janeiro 2026  
**Plataforma:** GoDaddy  
**Domínio:** duoproservices.ca
