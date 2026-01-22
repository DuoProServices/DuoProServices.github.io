# 🔧 RESOLVER PROBLEMAS - GODADDY + GITHUB PAGES

## 🎯 SOLUÇÕES PARA ERROS COMUNS:

---

## ❌ ERRO: "DNS check unsuccessful" no GitHub

### **Causa:**
DNS ainda não propagou ou está configurado errado.

### **Solução:**

#### **1. Verificar se DNS foi configurado corretamente:**

Acesse: `https://dnschecker.org/`
Digite: `duoproservices.ca`

**O que deve aparecer:**
```
✅ 185.199.108.153
✅ 185.199.109.153
✅ 185.199.110.153
✅ 185.199.111.153
```

**Se aparecer outro IP:** DNS ainda não propagou OU está errado!

#### **2. Revisar registros no GoDaddy:**

Acesse: `https://dcc.godaddy.com/manage/duoproservices.ca/dns`

**Confirme que tem EXATAMENTE:**
- 4 registros A com @ e os 4 IPs do GitHub
- 1 registro CNAME com www → duoproservices.github.io

#### **3. Aguardar propagação:**

DNS pode levar até 48 horas (geralmente 1-2 horas).

**Verificar a cada 30 minutos em:** `https://dnschecker.org/`

---

## ❌ ERRO: "Improperly configured" no GitHub

### **Causas comuns:**

1. ❌ CNAME está errado
2. ❌ Falta algum registro A
3. ❌ Tem registros duplicados

### **Solução:**

#### **Verificar CNAME:**

No GoDaddy, o CNAME deve ser EXATAMENTE:
```
Type: CNAME
Name: www
Value: duoproservices.github.io
```

**NÃO pode ter:**
- ❌ `https://duoproservices.github.io`
- ❌ `duoproservices.github.io/`
- ❌ `www.duoproservices.github.io`

#### **Verificar registros A:**

Deve ter TODOS os 4:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**Se faltar algum:** Adicione!

#### **Deletar duplicados:**

Se tem 2 registros A com @ apontando para IPs diferentes:
- Delete os antigos
- Mantenha apenas os 4 do GitHub

---

## ❌ ERRO: "Name @ is already in use" no GoDaddy

### **Causa:**
Já existe um registro A com @ (registro antigo).

### **Solução:**

1. **Encontre o registro antigo** na lista
2. **Clique no ícone de lápis** (editar)
3. **Delete** o registro
4. **Adicione os novos** registros A

**OU edite os existentes:**
- Clique no registro A antigo
- Mude o "Value" para um dos IPs do GitHub
- Salve
- Repita para os outros 3 IPs

---

## ❌ ERRO: Site mostra "404 - There isn't a GitHub Pages site here"

### **Causas:**

1. ❌ Build não rodou no GitHub Actions
2. ❌ Domínio não foi adicionado corretamente no GitHub
3. ❌ Branch errada configurada

### **Solução:**

#### **1. Verificar GitHub Actions:**

Acesse: `https://github.com/duoproservices/SEU-REPO/actions`

**Procure:**
- ✅ Workflow verde (sucesso)
- ❌ Workflow vermelho (erro)

**Se tiver erro:**
- Clique no workflow
- Veja os logs
- Corrija o erro
- Faça novo push

#### **2. Verificar Custom Domain:**

Acesse: `https://github.com/duoproservices/SEU-REPO/settings/pages`

**Confirme:**
- Custom domain: `duoproservices.ca` ✅
- DNS check successful ✅

**Se não estiver:**
- Digite novamente: `duoproservices.ca`
- Clique em "Save"

#### **3. Force rebuild:**

No terminal:
```bash
git commit --allow-empty -m "Force rebuild"
git push
```

Aguarde 2-5 minutos e verifique novamente.

---

## ❌ ERRO: HTTPS não funciona (certificado inválido)

### **Causa:**
Certificado SSL ainda não foi gerado.

### **Solução:**

#### **1. Desmarcar e remarcar HTTPS:**

No GitHub Pages:
1. **Desmarque:** `☐ Enforce HTTPS`
2. **Salve**
3. **Aguarde 10 minutos**
4. **Marque:** `☑️ Enforce HTTPS`
5. **Salve**
6. **Aguarde mais 10 minutos**

#### **2. Limpar cache do navegador:**

```
Ctrl + Shift + Delete (Windows)
Cmd + Shift + Delete (Mac)
```

Selecione:
- ✅ Cached images and files
- ✅ Cookies

#### **3. Testar em modo anônimo:**

```
Ctrl + Shift + N (Chrome)
Ctrl + Shift + P (Firefox)
```

Acesse: `https://duoproservices.ca`

---

## ❌ ERRO: www.duoproservices.ca não funciona

### **Causa:**
CNAME não configurado ou errado.

### **Solução:**

#### **1. Verificar CNAME no GoDaddy:**

Deve ter:
```
Type: CNAME
Name: www
Value: duoproservices.github.io
```

#### **2. Verificar DNS:**

Acesse: `https://dnschecker.org/`
Digite: `www.duoproservices.ca`
Type: CNAME

**Deve mostrar:** `duoproservices.github.io`

#### **3. Se ainda não funcionar:**

Aguarde propagação DNS (1-2 horas).

---

## ❌ ERRO: DNS demora muito para propagar (mais de 24h)

### **Causa:**
TTL muito alto.

### **Solução:**

#### **1. Reduzir TTL no GoDaddy:**

- Edite cada registro
- Mude TTL para `600` (10 minutos) ou `1 Hour`
- Salve

#### **2. Flush DNS local:**

**Windows:**
```cmd
ipconfig /flushdns
```

**Mac:**
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

**Linux:**
```bash
sudo systemd-resolve --flush-caches
```

#### **3. Verificar em diferentes servidores:**

Use: `https://dnschecker.org/`

Se aparecer verde em pelo menos 50% dos servidores → DNS está propagando!

---

## ❌ ERRO: "Repository not found" ou "Permission denied"

### **Causa:**
Repositório é privado.

### **Solução:**

#### **Tornar repositório público:**

1. Vá em: `https://github.com/duoproservices/SEU-REPO/settings`
2. Role até o final: **"Danger Zone"**
3. Clique em: **"Change visibility"**
4. Selecione: **"Make public"**
5. Confirme

**OU use GitHub Pro:**
- GitHub Pro permite Pages em repos privados
- Custa $4/mês

---

## ❌ ERRO: Build falha no GitHub Actions

### **Causas comuns:**

1. ❌ Falta variáveis de ambiente (Secrets)
2. ❌ Erro no código
3. ❌ Falta dependências

### **Solução:**

#### **1. Verificar Secrets:**

Acesse: `https://github.com/duoproservices/SEU-REPO/settings/secrets/actions`

**Deve ter:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Se não tiver:** Adicione!

#### **2. Ver logs de erro:**

Acesse: `https://github.com/duoproservices/SEU-REPO/actions`

Clique no workflow com ❌ → Clique em "build" → Veja o erro

#### **3. Testar build localmente:**

No terminal:
```bash
npm run build
```

Se der erro local, corrija antes de fazer push!

---

## ❌ ERRO: Site carrega mas está quebrado (sem CSS/JS)

### **Causa:**
Base path errado no Vite.

### **Solução:**

#### **1. Verificar vite.config.ts:**

Deve ter:
```typescript
export default defineConfig({
  base: '/NOME-DO-SEU-REPO/',  // ← Importante!
  // ...
})
```

**Se usar domínio personalizado (duoproservices.ca):**
```typescript
export default defineConfig({
  base: '/',  // ← Apenas / quando usa domínio próprio!
  // ...
})
```

#### **2. Rebuildar:**

```bash
git add vite.config.ts
git commit -m "Fix base path"
git push
```

---

## ❌ ERRO: "Mixed content" (HTTP/HTTPS)

### **Causa:**
Site carrega recursos via HTTP (inseguro).

### **Solução:**

#### **Trocar todas URLs de HTTP para HTTPS:**

Procure no código:
```javascript
// ❌ Errado:
src="http://example.com/image.jpg"

// ✅ Correto:
src="https://example.com/image.jpg"
```

**OU use URLs relativas:**
```javascript
src="/assets/image.jpg"
```

---

## 🔍 COMANDOS DE DIAGNÓSTICO:

### **Verificar DNS via comando:**

**Windows:**
```cmd
nslookup duoproservices.ca
```

**Mac/Linux:**
```bash
dig duoproservices.ca
```

**Deve retornar:** IPs do GitHub (185.199.xxx.xxx)

---

### **Verificar CNAME:**

```bash
nslookup -type=CNAME www.duoproservices.ca
```

**Deve retornar:** `duoproservices.github.io`

---

### **Testar conexão:**

```bash
curl -I https://duoproservices.ca
```

**Deve retornar:** `HTTP/2 200` (sucesso)

---

## 📞 LINKS ÚTEIS:

**Verificar DNS:**
- https://dnschecker.org/
- https://www.whatsmydns.net/

**Verificar SSL:**
- https://www.ssllabs.com/ssltest/

**Status do GitHub:**
- https://www.githubstatus.com/

**Status do GoDaddy:**
- https://status.godaddy.com/

---

## 🆘 AINDA COM PROBLEMA?

### **Checklist completo:**

- [ ] DNS configurado no GoDaddy (4 A + 1 CNAME) ✅
- [ ] DNS propagado (dnschecker.org) ✅
- [ ] Custom domain adicionado no GitHub ✅
- [ ] Source: GitHub Actions no Pages ✅
- [ ] Secrets adicionados (VITE_SUPABASE_*) ✅
- [ ] Build passou no Actions ✅
- [ ] Base path correto no vite.config.ts ✅
- [ ] HTTPS habilitado ✅

### **Se tudo está OK mas ainda não funciona:**

1. **Aguarde mais tempo** (DNS pode levar 48h)
2. **Limpe cache do navegador**
3. **Teste em modo anônimo**
4. **Teste em outro dispositivo/rede**

---

## 💡 DICA PRO:

**Sempre que mudar DNS:**
1. Aguarde pelo menos 1 hora
2. Verifique em dnschecker.org
3. Limpe cache do navegador
4. Teste

**Não fique mudando DNS a cada 5 minutos!** Isso pode atrasar a propagação! ⚠️

---

**Criado:** Janeiro 2026  
**Plataforma:** GoDaddy + GitHub Pages  
**Domínio:** duoproservices.ca
