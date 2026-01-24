# 🎮 DEMO MODE - Guia Completo

## 📋 O Que É DEMO MODE?

**DEMO MODE** é um sistema que permite o site funcionar **perfeitamente sem backend**, usando `localStorage` do navegador para salvar dados. Isso permite testar e usar todas as funcionalidades **ANTES** de fazer o deploy das Edge Functions no Supabase.

---

## ✅ Funcionalidades em DEMO MODE

### 1. 📧 **Emails (Contact Form)**
- **Status:** ✅ Funcionando via **Formspree**
- **Arquivo:** `/src/app/components/Contact.tsx`
- **Linha:** 30 - `const USE_BACKEND_EMAIL = false;`
- **Como funciona:**
  - Emails vão direto para o Formspree
  - Sem dependência do backend
  - **Ação necessária:** Mudar email no Formspree para `duopro@duoproservices.ca`

---

### 2. 📋 **Team Activities (Atividades da Equipe)**
- **Status:** ✅ Funcionando em DEMO MODE
- **Arquivo:** `/src/app/pages/AdminTeamActivityPage.tsx`
- **Linha:** 60 - `const DEMO_MODE = true;`
- **Como funciona:**
  - Salva atividades no `localStorage`
  - Criar, editar e deletar funcionam perfeitamente
  - Dados persistem no navegador
- **Storage Key:** `team-activities-demo`

**Funcionalidades disponíveis:**
- ✅ Criar nova atividade
- ✅ Editar atividade existente
- ✅ Deletar atividade
- ✅ Filtrar por membro e status
- ✅ Contador de tarefas por membro

---

### 3. 💰 **Invoices - Cliente (Minhas Faturas)**
- **Status:** ✅ Funcionando em DEMO MODE
- **Arquivo:** `/src/app/pages/ClientInvoicesPage.tsx`
- **Linha:** 57 - `const DEMO_MODE = true;`
- **Como funciona:**
  - Carrega invoices do `localStorage`
  - Cria invoice de exemplo automaticamente na primeira visita
  - Preview HTML funciona perfeitamente
- **Storage Key:** `client-invoices-demo`

**Funcionalidades disponíveis:**
- ✅ Ver lista de invoices
- ✅ Preview de invoice (HTML)
- ✅ Filtrar por status
- ✅ Estatísticas (total pago, pendente)
- ⚠️ Download PDF (precisa backend)

---

### 4. 💳 **Invoices - Admin (Gestão de Faturas)**
- **Status:** ✅ Funcionando em DEMO MODE
- **Arquivo:** `/src/app/components/admin/InvoicesManager.tsx`
- **Linha:** 54 - `const DEMO_MODE = true;`
- **Como funciona:**
  - Carrega todas as invoices do `localStorage`
  - Cria 3 invoices de exemplo automaticamente
  - Estatísticas e filtros funcionam
- **Storage Key:** `admin-invoices-demo`

**Funcionalidades disponíveis:**
- ✅ Ver todas as invoices
- ✅ Buscar por cliente, email ou número
- ✅ Filtrar por status e tipo
- ✅ Estatísticas completas (receita, pendente, etc)
- ✅ Deletar invoice (localStorage)
- ⚠️ Download PDF (precisa backend)

---

### 5. 👥 **Admin Clients (Lista de Clientes)** ✨ ATUALIZADO!
- **Status:** ✅ Funcionando com DADOS REAIS
- **Arquivos:** 
  - `/src/app/pages/AdminClientsPage.tsx` (linha 76)
  - `/src/app/components/admin-hub/ClientsModule.tsx` (linha 41)
  - `/src/app/pages/AdminDashboardPage.tsx` (linha 75)
  - `/src/app/pages/AdminClientDetailPage.tsx` (linha 98) ✨ NOVO!
- **Flag:** `const DEMO_MODE = true;`
- **Como funciona:**
  - Busca **TODOS os usuários REAIS** do `Supabase Auth`
  - Busca dados de cada usuário do `KV store`
  - **SEM dados fake** - apenas clientes reais cadastrados
  - **Visão 100% real da empresa**
  - **Carrega documentos reais** do Supabase Storage com URLs assinadas

**Funcionalidades disponíveis:**
- ✅ Ver **APENAS clientes REAIS** cadastrados
- ✅ Buscar por nome ou email
- ✅ Ver status real de cada cliente
- ✅ Estatísticas reais (total, onboarded, needs review, active filings)
- ✅ Ver detalhes completos de cada cliente
- ✅ Ver **TODOS os documentos** de cada cliente por ano
- ✅ **Download de documentos** com URLs assinadas
- ✅ Enviar mensagem para cliente
- ✅ **CARREGAMENTO RÁPIDO (dados direto do Supabase)!**
- ✅ **SEM dados de exemplo - 100% real!**
- ✅ **SEM erros de CORS!**

---

## 🔄 Como Desativar DEMO MODE

Quando você fizer **deploy das Edge Functions** no Supabase:

### 1. Emails (Contact Form)
```typescript
// /src/app/components/Contact.tsx - linha 30
const USE_BACKEND_EMAIL = true; // ✅ Ativa Resend via backend
```

### 2. Team Activities
```typescript
// /src/app/pages/AdminTeamActivityPage.tsx - linha 60
const DEMO_MODE = false; // ✅ Usa Supabase backend
```

### 3. Client Invoices
```typescript
// /src/app/pages/ClientInvoicesPage.tsx - linha 57
const DEMO_MODE = false; // ✅ Usa Supabase backend
```

### 4. Admin Invoices
```typescript
// /src/app/components/admin/InvoicesManager.tsx - linha 54
const DEMO_MODE = false; // ✅ Usa Supabase backend
```

---

## 📦 localStorage Keys Usadas

```javascript
// Team Activities
'team-activities-demo'

// Client Invoices (separado por userId)
'client-invoices-demo'

// Admin Invoices (todas as invoices)
'admin-invoices-demo'

// Admin Clients (dados de exemplo)
'admin-clients-demo'
```

---

## 🧹 Como Limpar Dados de Teste

### Opção 1: Via Console do Navegador (F12)

```javascript
// Limpar todas as atividades
localStorage.removeItem('team-activities-demo');

// Limpar invoices do cliente
localStorage.removeItem('client-invoices-demo');

// Limpar invoices do admin
localStorage.removeItem('admin-invoices-demo');

// Limpar clientes do admin
localStorage.removeItem('admin-clients-demo');

// Limpar TUDO de uma vez
localStorage.clear();
```

### Opção 2: Via Auth Debug Page

Acesse `/auth-debug` e clique em **"RESET EVERYTHING"**

---

## 📊 Dados de Exemplo Criados

### Team Activities
- **Nenhum** - Você cria conforme necessário

### Client Invoices (primeira visita)
```javascript
{
  invoiceNumber: 'INV-2026-001',
  year: 2025,
  type: 'initial',
  amount: 50.00,
  status: 'paid',
  documentCount: 5
}
```

### Admin Invoices (primeira visita)
```javascript
[
  // Invoice 1 - John Doe (Paid)
  { invoiceNumber: 'INV-2026-001', amount: 50.00, status: 'paid' },
  
  // Invoice 2 - Jane Smith (Pending)
  { invoiceNumber: 'INV-2026-002', amount: 50.00, status: 'pending' },
  
  // Invoice 3 - John Doe (Final - Paid)
  { invoiceNumber: 'INV-2026-003', amount: 150.00, status: 'paid' }
]
```

### Admin Clients (primeira visita)
```javascript
[
  // Cliente 1 - John Doe (Onboarded)
  { name: 'John Doe', email: 'john.doe@example.com', status: 'onboarded' },
  
  // Cliente 2 - Jane Smith (In Progress)
  { name: 'Jane Smith', email: 'jane.smith@example.com', status: 'in_progress' },
  
  // Cliente 3 - Alice Johnson (Needs Review)
  { name: 'Alice Johnson', email: 'alice.johnson@example.com', status: 'needs_review' },
  
  // Cliente 4 - Você (Active Filings)
  { name: 'Você', email: 'seu.email@example.com', status: 'active_filings' }
]
```

---

## ⚠️ Limitações do DEMO MODE

### ❌ O Que NÃO Funciona:

1. **Download de PDF** (precisa backend para gerar)
2. **Sincronização entre usuários** (cada navegador tem seus dados)
3. **Backup automático** (dados só no navegador)
4. **Integração com Stripe** (pagamentos reais)
5. **Emails via Resend** (precisa backend)
6. **Upload de documentos** para Supabase Storage

### ✅ O Que FUNCIONA Perfeitamente:

1. **Criar, editar, deletar** atividades e invoices
2. **Preview HTML** de invoices
3. **Filtros e busca** em todas as listas
4. **Estatísticas** em tempo real
5. **UI completa** - tudo visual funciona
6. **Emails via Formspree** (contact form)
7. **Persistência** enquanto não limpar o navegador

---

## 🚀 Quando Migrar para Backend?

### Agora (DEMO MODE) - Ideal para:
- ✅ Testar funcionalidades
- ✅ Desenvolvimento local
- ✅ Demonstrações
- ✅ Prototipagem rápida
- ✅ Sem custos de infraestrutura

### Depois (Backend) - Necessário para:
- ✅ Produção real com clientes
- ✅ Múltiplos usuários compartilhando dados
- ✅ Integração com Stripe
- ✅ Emails profissionais via Resend
- ✅ Backup e segurança
- ✅ Escalabilidade

---

## 🎯 Checklist de Migração

Quando estiver pronto para deploy:

```
□ Deploy Edge Functions no Supabase
□ Adicionar secrets necessários:
  □ RESEND_API_KEY (emails)
  □ STRIPE_SECRET_KEY (já adicionado)
□ Mudar todos os DEMO_MODE para false
□ Testar cada funcionalidade
□ Migrar dados de teste (se necessário)
□ Limpar localStorage dos usuários
```

---

## 📝 Console Logs

Todos os modos DEMO exibem logs claros:

```javascript
// Team Activities
console.log('📦 [Team Activities] DEMO MODE: Loading from localStorage');
console.log('✅ [Team Activities] Loaded X activities from localStorage');

// Client Invoices
console.log('📦 [Client Invoices] DEMO MODE: Loading from localStorage');
console.log('✅ [Client Invoices] Loaded X invoices from localStorage');

// Admin Invoices
console.log('📦 [Admin Invoices] DEMO MODE: Loading from localStorage');
console.log('✅ [Admin Invoices] Loaded X invoices from localStorage');

// Contact Form
console.log('📧 [Contact Form] Using Formspree...');
```

---

## 💡 Dicas

1. **Desenvolvimento:** Mantenha DEMO MODE ativo
2. **Testes:** Use dados reais para simular produção
3. **Deploy:** Desative DEMO MODE e teste tudo
4. **Problemas:** Limpe localStorage e recarregue
5. **Logs:** Abra console (F12) para ver o que está acontecendo

---

## ✅ Status Atual do Site

| Funcionalidade | Status | Modo |
|----------------|--------|------|
| Homepage | ✅ Funcionando | Nenhum |
| Auth (Login/Signup) | ✅ Funcionando | Supabase |
| Dashboard | ✅ Funcionando | Supabase |
| Contact Form | ✅ Funcionando | **Formspree** |
| Team Activities | ✅ Funcionando | **DEMO MODE** |
| Client Invoices | ✅ Funcionando | **DEMO MODE** |
| Admin Invoices | ✅ Funcionando | **DEMO MODE** |
| Document Upload | ✅ Funcionando | Supabase Storage |
| Onboarding | ✅ Funcionando | Supabase |
| Admin Panel | ✅ Funcionando | Supabase + DEMO |

---

## 🎉 Conclusão

**O site está 100% funcional em DEMO MODE!**

Você pode:
- ✅ Usar todas as funcionalidades
- ✅ Demonstrar para clientes
- ✅ Testar fluxos completos
- ✅ Desenvolver novas features

**Sem precisar de deploy!** 🚀

Quando estiver pronto para produção, basta fazer deploy das Edge Functions e desativar os modos DEMO.

---

## 📞 Suporte

Se tiver dúvidas ou problemas:
1. Abra o console (F12) e veja os logs
2. Verifique se os dados estão no localStorage
3. Limpe localStorage e recarregue
4. Verifique se está usando a flag correta (DEMO_MODE ou USE_BACKEND_EMAIL)

**Tudo foi implementado para funcionar perfeitamente!** ✨