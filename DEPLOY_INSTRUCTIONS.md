# 🚀 Instruções de Deploy do Edge Function

## ❌ PROBLEMA IDENTIFICADO
Os testes confirmaram que o Edge Function não está deployed no Supabase. Todos os endpoints retornaram "Failed to fetch".

## ✅ SOLUÇÃO: Deploy via Supabase CLI

### 📋 PRÉ-REQUISITOS
- Node.js instalado
- Acesso ao projeto Supabase: `pwlacumydrxvshklvttp`

---

## 🔧 PASSO A PASSO

### **1. Instalar Supabase CLI**

Abra o terminal e execute:

```bash
npm install -g supabase
```

### **2. Fazer Login no Supabase**

```bash
supabase login
```

Isso abrirá o navegador para você autorizar o CLI com sua conta Supabase.

### **3. Linkar com seu Projeto**

```bash
supabase link --project-ref pwlacumydrxvshklvttp
```

Se pedir senha, use a senha do database (disponível no Dashboard do Supabase em Settings > Database).

### **4. Preparar os Arquivos**

O Supabase CLI espera que o arquivo principal esteja em:
```
/supabase/functions/make-server-c2a25be0/index.ts
```

Atualmente, o código principal está em:
```
/supabase/functions/server/index.tsx
```

**IMPORTANTE:** Você precisa copiar TODO o conteúdo de `/supabase/functions/server/` para `/supabase/functions/make-server-c2a25be0/`

Execute no terminal:

```bash
# Navegue até a pasta do projeto
cd /caminho/para/seu/projeto

# Copie todos os arquivos da pasta server para make-server-c2a25be0
cp -r supabase/functions/server/* supabase/functions/make-server-c2a25be0/

# Renomeie o arquivo principal de .tsx para .ts (se necessário)
mv supabase/functions/make-server-c2a25be0/index.tsx supabase/functions/make-server-c2a25be0/index.ts
```

### **5. Deploy da Function**

Agora faça o deploy:

```bash
supabase functions deploy make-server-c2a25be0
```

### **6. Verificar Variáveis de Ambiente**

Após o deploy, verifique se as variáveis de ambiente estão configuradas:

1. Acesse: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/settings/functions
2. Clique na função `make-server-c2a25be0`
3. Verifique se estas variáveis existem:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_DB_URL`
   - `STRIPE_SECRET_KEY` (se usando Stripe)

**Se alguma variável estiver faltando**, adicione manualmente pela interface.

### **7. Testar Novamente**

Depois do deploy:

1. Volte ao site e clique no botão **"🧪 Test Server"**
2. Clique em **"🚀 Run All Tests"**
3. Agora os testes devem PASSAR! ✅

---

## 🆘 ALTERNATIVA: Deploy Manual via Dashboard

Se o CLI não funcionar, você pode fazer upload manual:

1. Acesse: https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/functions
2. Clique em "Create a new function"
3. Nome: `make-server-c2a25be0`
4. Copie TODO o conteúdo de `/supabase/functions/server/index.tsx`
5. Cole no editor
6. **PROBLEMA:** O dashboard não aceita múltiplos arquivos

**⚠️ POR ISSO O CLI É NECESSÁRIO** - o projeto tem múltiplos arquivos que precisam ser deployed juntos.

---

## 📂 ARQUIVOS QUE SERÃO DEPLOYED

Estes arquivos serão enviados para o Supabase:

```
/supabase/functions/make-server-c2a25be0/
├── index.ts (ou index.tsx)          # Arquivo principal
├── kv_store.tsx                     # Sistema de KV store
├── timeline.tsx                     # Gestão de timeline
├── messages.tsx                     # Sistema de mensagens
├── emailTemplates.ts                # Templates de email
├── craAssessmentEmail.ts            # Email CRA
├── taxDocumentEmail.tsx             # Email de documentos
├── stripe.tsx                       # Integração Stripe
├── users.tsx                        # Gestão de usuários
├── roadmap.tsx                      # Roadmap dashboard
├── fix-tax-filings.tsx              # Fix de tax filings
├── initial-payment.tsx              # Pagamento inicial
├── invoice-pdf.tsx                  # Geração de PDF
├── stripe-webhook.tsx               # Webhook do Stripe
├── email-routes.tsx                 # Rotas de email
├── admin-hub.tsx                    # Admin hub
├── contact-email.tsx                # Email de contato
├── admin-confirm-user.tsx           # Confirmação de usuário
├── crm.tsx                          # CRM
└── email-templates/                 # Pasta de templates
```

---

## ✅ VERIFICAÇÃO DE SUCESSO

Após o deploy, você deve ver:

1. ✅ A função `make-server-c2a25be0` listada no Dashboard
2. ✅ Status: "Active"
3. ✅ Todos os testes na página de teste passando (verde)
4. ✅ Você consegue fazer signup/login no site

---

## 🐛 TROUBLESHOOTING

### Erro: "Function not found"
- Certifique-se de que o nome está correto: `make-server-c2a25be0`

### Erro: "Import failed"
- Verifique se todos os arquivos auxiliares foram copiados

### Erro: "Environment variable missing"
- Configure as variáveis de ambiente no Dashboard

### Erro: "Permission denied"
- Verifique se você tem acesso de admin ao projeto Supabase

---

## 📞 PRÓXIMOS PASSOS

Depois que o deploy funcionar:

1. ✅ Testar signup de novo usuário
2. ✅ Testar login
3. ✅ Testar upload de documentos
4. ✅ Configurar Storage RLS Policies (se necessário)

---

**💡 DICA:** Mantenha o terminal aberto durante o deploy para ver logs de erro, se houver.
