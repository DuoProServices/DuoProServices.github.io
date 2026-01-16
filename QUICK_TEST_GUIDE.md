# 🧪 Guia Rápido de Testes - 30 Minutos

Este guia permite validar rapidamente as 3 funcionalidades principais em aproximadamente 30 minutos.

---

## ⏱️ Teste 1: Invoices (10 minutos)

### Pré-requisitos:
- Ter uma conta de cliente criada
- Ter pelo menos 1 invoice gerado (criado ao fazer pagamento)

### Passo a Passo:

```
1. ✅ Login
   - Acesse: http://localhost:5173/login
   - Entre com suas credenciais de cliente
   
2. ✅ Navegar para Invoices
   - Clique no menu ou vá direto: http://localhost:5173/client/invoices
   
3. ✅ Verificar Lista
   □ Os invoices aparecem?
   □ Os valores estão corretos? (ex: $50.00 CAD)
   □ O status está correto? (Paid ou Pending)
   □ A data está correta?
   □ O tipo está correto? (Initial Payment ou Final Payment)
   
4. ✅ Testar Preview
   - Clique no botão "👁️ Preview" em qualquer invoice
   □ Abre em nova aba?
   □ Design está profissional?
   □ Todas as informações estão corretas?
   
5. ✅ Testar Download
   - Clique no botão "📥 Download" em qualquer invoice
   □ Download inicia?
   □ PDF é gerado corretamente?
   □ Conteúdo do PDF está correto?
```

**✅ Resultado Esperado:**
- Lista carrega em menos de 2 segundos
- Status badges aparecem com cores corretas
- Preview abre instantaneamente
- PDF é baixado com nome do invoice (ex: "0001.pdf")

---

## ⏱️ Teste 2: Pagamento Stripe (15 minutos)

### Pré-requisitos:
- Stripe em modo teste configurado
- Ter acesso a uma tax filing page
- Ter alguns documentos para upload

### Passo a Passo:

```
1. ✅ Preparar Dados de Teste
   - Copie este cartão de teste: 4242 4242 4242 4242
   - Data: 12/25 (qualquer data futura)
   - CVC: 123
   - ZIP: 12345

2. ✅ Iniciar Fluxo de Pagamento
   - Faça login como cliente
   - Navegue para uma tax filing (ex: ano 2025)
   - Upload 1-2 documentos de teste
   - Clique em "Submit Documents & Pay $50 Initial Fee"
   
3. ✅ Verificar Criação de Invoice
   □ Toast "Generating invoice..." aparece?
   □ Redireciona para Stripe Checkout?
   
4. ✅ Completar Pagamento
   - Na página do Stripe, preencha:
     * Email: teste@example.com
     * Card Number: 4242 4242 4242 4242
     * MM/YY: 12/25
     * CVC: 123
     * Name: Test User
     * ZIP: 12345
   - Clique em "Pay"
   
5. ✅ Verificar Redirecionamento
   □ Volta para o site?
   □ Mensagem de sucesso aparece?
   □ URL contém "?payment=success&session_id=..."?
   
6. ✅ Verificar Invoice Atualizado
   - Vá para /client/invoices
   □ Invoice mais recente está "PAID"?
   □ Data de pagamento está preenchida?
   □ Status badge é verde?
   
7. ✅ Verificar no Stripe Dashboard (Opcional)
   - Acesse: https://dashboard.stripe.com/test/payments
   □ Pagamento aparece na lista?
   □ Status é "Succeeded"?
   □ Valor é $50.00?
```

**✅ Resultado Esperado:**
- Redirecionamento para Stripe em < 3 segundos
- Processo de pagamento fluido
- Retorno automático ao site
- Invoice atualizado para "PAID" automaticamente
- Webhook processa em < 5 segundos

**⚠️ Se Invoice NÃO atualizar automaticamente:**
- Significa que webhook não está configurado
- Ver seção "Configuração do Webhook" no VALIDATION_CHECKLIST.md
- Use verificação manual no admin panel como alternativa

---

## ⏱️ Teste 3: Formulário de Contato (5 minutos)

### Pré-requisitos:
- Nenhum! Formulário é público

### Passo a Passo:

```
1. ✅ Acessar Formulário
   - Vá para: http://localhost:5173/
   - Role até a seção "Contact" / "Get In Touch"
   
2. ✅ Testar Validação
   - Clique em "Send Message" sem preencher nada
   □ Navegador mostra erros de validação?
   □ Campos obrigatórios são destacados?
   
3. ✅ Preencher Formulário
   - Name: [Seu Nome]
   - Email: [seu-email@example.com]
   - Phone: (514) 123-4567 (opcional)
   - Subject: Teste do formulário de contato
   - Message: Esta é uma mensagem de teste para validar o sistema.
   
4. ✅ Enviar
   - Clique em "Send Message"
   □ Botão mostra "Sending..."?
   □ Toast de sucesso aparece?
   □ Formulário é limpo após envio?
   
5. ✅ Verificar Recebimento
   - Abra email: duopro@duoproservices.ca
   - Verifique inbox (espere 30-60 segundos)
   □ Email chegou?
   □ Todos os dados estão no email?
   □ Remetente é "noreply@formspree.io"?
   
6. ✅ Verificar Spam (IMPORTANTE)
   - Abra pasta de spam/lixo eletrônico
   □ Email está na pasta spam?
   
   Se SIM:
   - Marcar como "Não é spam"
   - Adicionar formspree.io à lista de remetentes seguros
```

**✅ Resultado Esperado:**
- Envio completa em < 3 segundos
- Toast verde de sucesso
- Email chega em < 1 minuto
- Email NÃO está no spam (idealmente)

**⚠️ Se Email estiver no Spam:**
- Isso é normal na primeira vez
- Configure SPF record (ver VALIDATION_CHECKLIST.md)
- Marque como "não spam" no Gmail/Outlook
- Envios futuros não devem cair no spam

---

## 📊 Resultados do Teste

Preencha após completar os testes:

```
┌─────────────────────────────────────────────────────────┐
│ TESTE 1: INVOICES                                       │
├─────────────────────────────────────────────────────────┤
│ □ Lista carrega corretamente                            │
│ □ Status aparece correto (Paid/Pending)                 │
│ □ Valores estão corretos ($50 CAD)                      │
│ □ Preview funciona                                      │
│ □ Download PDF funciona                                 │
│                                                          │
│ Status: [ ] ✅ PASSOU  [ ] ❌ FALHOU  [ ] ⚠️ PARCIAL     │
│ Notas: ____________________________________________     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TESTE 2: PAGAMENTO STRIPE                               │
├─────────────────────────────────────────────────────────┤
│ □ Redireciona para Stripe Checkout                      │
│ □ Pagamento processa com sucesso                        │
│ □ Retorna ao site automaticamente                       │
│ □ Invoice atualiza para "PAID"                          │
│ □ Webhook funciona (ou precisa config?)                 │
│                                                          │
│ Status: [ ] ✅ PASSOU  [ ] ❌ FALHOU  [ ] ⚠️ PARCIAL     │
│ Notas: ____________________________________________     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TESTE 3: FORMULÁRIO DE CONTATO                          │
├─────────────────────────────────────────────────────────┤
│ □ Formulário envia com sucesso                          │
│ □ Validação funciona                                    │
│ □ Toast de sucesso aparece                              │
│ □ Email é recebido                                      │
│ □ Email NÃO está no spam                                │
│                                                          │
│ Status: [ ] ✅ PASSOU  [ ] ❌ FALHOU  [ ] ⚠️ PARCIAL     │
│ Notas: ____________________________________________     │
└─────────────────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting Rápido

### Problema: Invoices não carregam
```bash
# Verificar console do navegador
1. Abra DevTools (F12)
2. Vá para aba "Console"
3. Procure por erros em vermelho
4. Verifique aba "Network" → procure por requests falhando (vermelho)

# Verificar backend
5. Verifique logs do Supabase Edge Functions
6. URL: https://supabase.com/dashboard/project/{SEU_PROJECT}/functions

# Solução rápida
7. Tente fazer logout e login novamente
8. Limpe cache do navegador (Ctrl+Shift+Delete)
```

### Problema: Pagamento não atualiza invoice
```bash
# Causa provável: Webhook não configurado
1. Acesse Stripe Dashboard
2. Vá para: Developers → Webhooks
3. Adicione novo endpoint com a URL do webhook
4. Copie o webhook secret
5. Adicione como variável de ambiente no Supabase

# Solução temporária
6. Use verificação manual no admin panel:
   - /admin/control-panel → Financial Module
   - Encontre o invoice e clique "Verify"
```

### Problema: Email não chega
```bash
# Verificar Formspree
1. Acesse: https://formspree.io/forms
2. Faça login
3. Verifique submissions recentes
4. Verifique se email está configurado corretamente

# Verificar inbox
5. Aguarde até 2 minutos
6. Verifique pasta spam/lixo eletrônico
7. Verifique se duopro@duoproservices.ca está correto
8. Verifique filtros de email

# Solução
9. Reenvie o formulário
10. Se continuar falhando, verifique quota do Formspree (50/mês)
```

---

## ✅ Checklist Final

Após completar todos os testes:

- [ ] Todos os 3 testes passaram
- [ ] Problemas encontrados estão documentados
- [ ] Webhook do Stripe está configurado (ou agendado)
- [ ] Email de contato está sendo recebido
- [ ] Todos os arquivos de evidência foram salvos

**Data do Teste:** _______________

**Testado por:** _______________

**Resultado Geral:** [ ] ✅ APROVADO  [ ] ⚠️ APROVADO COM RESSALVAS  [ ] ❌ REPROVADO

---

## 📸 Evidências Recomendadas

Para documentação futura, tire screenshots de:

1. **Invoices:**
   - Lista de invoices
   - Preview de invoice
   - PDF baixado

2. **Pagamento:**
   - Página Stripe Checkout
   - Mensagem de sucesso
   - Invoice atualizado para "PAID"
   - Dashboard Stripe mostrando pagamento

3. **Contato:**
   - Formulário preenchido
   - Toast de sucesso
   - Email recebido no inbox

Salve em: `/evidence/[data-do-teste]/`

---

## 🎯 Próximos Passos

Após validação bem-sucedida:

1. ✅ Marcar funcionalidades como "Testadas" no projeto
2. 📝 Atualizar documentação com resultados
3. 🔧 Corrigir bugs encontrados (se houver)
4. 🚀 Prosseguir para próxima fase de desenvolvimento

**Boa sorte nos testes! 🚀**
