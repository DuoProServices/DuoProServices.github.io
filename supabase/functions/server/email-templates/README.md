# Email Templates - DuoProServices

Sistema completo de templates de email bilíngue (inglês/francês) para o site de fiscalista canadense.

## 📧 Templates Disponíveis

### 1. **Welcome Email** (`welcome-email.tsx`)
Enviado após o usuário criar conta.

**Uso:**
```typescript
import { generateWelcomeEmail } from './email-templates/index.tsx';

const html = generateWelcomeEmail({
  name: 'John Doe',
  email: 'john@example.com',
  language: 'en', // ou 'fr'
});
```

---

### 2. **Payment Confirmation Email** (`payment-confirmation-email.tsx`)
Enviado após pagamento bem-sucedido.

**Uso:**
```typescript
import { generatePaymentConfirmationEmail } from './email-templates/index.tsx';

const html = generatePaymentConfirmationEmail({
  name: 'John Doe',
  email: 'john@example.com',
  language: 'en',
  invoiceNumber: '0001',
  amount: 50,
  currency: 'CAD',
  taxYear: 2026,
  paymentDate: '2025-01-07T10:30:00Z',
  paymentType: 'initial', // ou 'final'
});
```

---

### 3. **Invoice Email** (`invoice-email.tsx`)
Enviado quando uma invoice é gerada.

**Uso:**
```typescript
import { generateInvoiceEmail } from './email-templates/index.tsx';

const html = generateInvoiceEmail({
  name: 'John Doe',
  email: 'john@example.com',
  language: 'en',
  invoiceNumber: '0001',
  amount: 50,
  currency: 'CAD',
  taxYear: 2026,
  dueDate: '2025-02-15', // opcional
  invoiceUrl: 'https://your-app.com/invoice/0001',
});
```

---

### 4. **Tax Return Completed Email** (`tax-return-completed-email.tsx`)
Enviado quando a declaração está completa.

**Uso:**
```typescript
import { generateTaxReturnCompletedEmail } from './email-templates/index.tsx';

const html = generateTaxReturnCompletedEmail({
  name: 'John Doe',
  email: 'john@example.com',
  language: 'en',
  taxYear: 2026,
  completionDate: '2025-03-15T14:00:00Z',
  hasRefund: true, // opcional
  refundAmount: 1250, // opcional
  hasBalance: false, // opcional
  balanceAmount: 0, // opcional
});
```

---

### 5. **Reminder Email** (`reminder-email.tsx`)
Sistema flexível de lembretes para diversos propósitos.

**Tipos de lembrete:**
- `documents` - Upload de documentos
- `payment` - Pagamento pendente
- `deadline` - Prazo de declaração se aproximando
- `review` - Revisão da declaração
- `missing-info` - Informação adicional necessária

**Uso:**
```typescript
import { generateReminderEmail } from './email-templates/index.tsx';

const html = generateReminderEmail({
  name: 'John Doe',
  email: 'john@example.com',
  language: 'en',
  reminderType: 'documents',
  taxYear: 2026, // opcional
  dueDate: '2025-04-30', // opcional
  customMessage: 'Please upload your T4 slip.', // opcional
});
```

---

## 🌍 Idiomas Suportados

Todos os templates suportam:
- **`en`** - Inglês (Canadá)
- **`fr`** - Francês (Canadá)

---

## 🎨 Design

- ✅ Design responsivo
- ✅ Compatível com todos os clientes de email
- ✅ Cores consistentes com o branding DuoProServices
- ✅ Ícones emoji para melhor visual
- ✅ CTAs (Call-to-Action) claros e destacados
- ✅ Formatação de moeda e data localizada

---

## 🔧 Integração com Envio de Email

Para enviar emails, você precisará integrar com um serviço como:
- **Resend** (recomendado para Deno)
- **SendGrid**
- **Mailgun**
- **Amazon SES**

**Exemplo com Resend:**

```typescript
import { Resend } from 'npm:resend';
import { generateWelcomeEmail } from './email-templates/index.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

async function sendWelcomeEmail(userEmail: string, userName: string, language: 'en' | 'fr') {
  const html = generateWelcomeEmail({
    name: userName,
    email: userEmail,
    language,
  });

  await resend.emails.send({
    from: 'DuoProServices <noreply@duoproservices.com>',
    to: userEmail,
    subject: language === 'en' 
      ? 'Welcome to DuoProServices' 
      : 'Bienvenue chez DuoProServices',
    html,
  });
}
```

---

## 📝 Notas

- **Placeholders:** Os templates contêm `[email@duoproservices.com]` e `[phone]` que devem ser substituídos pelos valores reais
- **APP_URL:** Os links usam `Deno.env.get('APP_URL')` - configure essa variável de ambiente
- **Formatação automática:** Datas e moedas são formatadas automaticamente de acordo com o idioma

---

## 🚀 Próximos Passos

1. Configurar serviço de envio de email (Resend, SendGrid, etc.)
2. Substituir placeholders de email e telefone
3. Configurar variável de ambiente `APP_URL`
4. Criar rotas no backend para disparar cada tipo de email
5. Testar envios em ambos os idiomas

---

## 📧 Estrutura de Arquivos

```
/supabase/functions/server/email-templates/
├── index.tsx                          # Export central
├── welcome-email.tsx                  # Template de boas-vindas
├── payment-confirmation-email.tsx     # Template de confirmação de pagamento
├── invoice-email.tsx                  # Template de invoice
├── tax-return-completed-email.tsx     # Template de declaração completa
├── reminder-email.tsx                 # Template de lembretes
└── README.md                          # Esta documentação
```
