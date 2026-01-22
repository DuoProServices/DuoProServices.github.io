/**
 * EMAIL INTEGRATION EXAMPLES
 * 
 * Este arquivo contém exemplos de como integrar os emails no seu app.
 * Copie e adapte conforme necessário.
 */

import { projectId, publicAnonKey } from '/utils/supabase/info';

// Base URL for email endpoints
const EMAIL_API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/emails`;

/**
 * Helper function to send email
 */
async function sendEmail(endpoint: string, data: any) {
  try {
    const response = await fetch(`${EMAIL_API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Email send error:', result);
      throw new Error(result.error || 'Failed to send email');
    }

    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

// ==================== EXAMPLE 1: WELCOME EMAIL ====================
/**
 * Send welcome email after user signs up
 * Call this after successful signup
 */
export async function sendWelcomeEmail(
  email: string,
  name: string,
  language: 'en' | 'fr'
) {
  return sendEmail('welcome', {
    email,
    name,
    language
  });
}

// Usage example:
// await sendWelcomeEmail('user@example.com', 'John Doe', 'en');

// ==================== EXAMPLE 2: PAYMENT CONFIRMATION EMAIL ====================
/**
 * Send payment confirmation after successful payment
 * Call this in the Stripe webhook or after payment success
 */
export async function sendPaymentConfirmationEmail(
  email: string,
  name: string,
  language: 'en' | 'fr',
  invoiceNumber: string,
  amount: number,
  taxYear: number,
  paymentType: 'initial' | 'final' = 'initial'
) {
  return sendEmail('payment-confirmation', {
    email,
    name,
    language,
    invoiceNumber,
    amount,
    currency: 'CAD',
    taxYear,
    paymentDate: new Date().toISOString(),
    paymentType
  });
}

// Usage example:
// await sendPaymentConfirmationEmail(
//   'user@example.com',
//   'John Doe',
//   'en',
//   '0001',
//   50,
//   2026,
//   'initial'
// );

// ==================== EXAMPLE 3: INVOICE EMAIL ====================
/**
 * Send invoice email when invoice is generated
 */
export async function sendInvoiceEmail(
  email: string,
  name: string,
  language: 'en' | 'fr',
  invoiceNumber: string,
  amount: number,
  taxYear: number,
  invoiceUrl: string,
  dueDate?: string
) {
  return sendEmail('invoice', {
    email,
    name,
    language,
    invoiceNumber,
    amount,
    currency: 'CAD',
    taxYear,
    invoiceUrl,
    dueDate
  });
}

// Usage example:
// const invoiceUrl = `https://your-app.com/invoices/0001`;
// await sendInvoiceEmail(
//   'user@example.com',
//   'John Doe',
//   'en',
//   '0001',
//   50,
//   2026,
//   invoiceUrl
// );

// ==================== EXAMPLE 4: TAX RETURN COMPLETED EMAIL ====================
/**
 * Send tax return completed email when processing is done
 */
export async function sendTaxReturnCompletedEmail(
  email: string,
  name: string,
  language: 'en' | 'fr',
  taxYear: number,
  options?: {
    hasRefund?: boolean;
    refundAmount?: number;
    hasBalance?: boolean;
    balanceAmount?: number;
  }
) {
  return sendEmail('tax-return-completed', {
    email,
    name,
    language,
    taxYear,
    completionDate: new Date().toISOString(),
    hasRefund: options?.hasRefund,
    refundAmount: options?.refundAmount,
    hasBalance: options?.hasBalance,
    balanceAmount: options?.balanceAmount
  });
}

// Usage example (with refund):
// await sendTaxReturnCompletedEmail(
//   'user@example.com',
//   'John Doe',
//   'en',
//   2026,
//   {
//     hasRefund: true,
//     refundAmount: 1250
//   }
// );

// Usage example (with balance due):
// await sendTaxReturnCompletedEmail(
//   'user@example.com',
//   'John Doe',
//   'en',
//   2026,
//   {
//     hasBalance: true,
//     balanceAmount: 500
//   }
// );

// ==================== EXAMPLE 5: REMINDER EMAILS ====================
/**
 * Send reminder emails for various purposes
 */
export async function sendReminderEmail(
  email: string,
  name: string,
  language: 'en' | 'fr',
  reminderType: 'documents' | 'payment' | 'deadline' | 'review' | 'missing-info',
  options?: {
    taxYear?: number;
    dueDate?: string;
    customMessage?: string;
  }
) {
  return sendEmail('reminder', {
    email,
    name,
    language,
    reminderType,
    taxYear: options?.taxYear,
    dueDate: options?.dueDate,
    customMessage: options?.customMessage
  });
}

// Usage examples:

// 1. Remind to upload documents
// await sendReminderEmail(
//   'user@example.com',
//   'John Doe',
//   'en',
//   'documents',
//   { taxYear: 2026 }
// );

// 2. Remind to make payment
// await sendReminderEmail(
//   'user@example.com',
//   'John Doe',
//   'en',
//   'payment',
//   { taxYear: 2026 }
// );

// 3. Remind about deadline
// await sendReminderEmail(
//   'user@example.com',
//   'John Doe',
//   'en',
//   'deadline',
//   {
//     taxYear: 2026,
//     dueDate: '2026-04-30'
//   }
// );

// 4. Remind to review return
// await sendReminderEmail(
//   'user@example.com',
//   'John Doe',
//   'en',
//   'review',
//   { taxYear: 2026 }
// );

// 5. Remind about missing info
// await sendReminderEmail(
//   'user@example.com',
//   'John Doe',
//   'en',
//   'missing-info',
//   {
//     taxYear: 2026,
//     customMessage: 'Please upload your T4 slip from your employer.'
//   }
// );

// ==================== EXAMPLE 6: TEST EMAIL ====================
/**
 * Send test email to verify integration
 */
export async function sendTestEmail(email: string) {
  return sendEmail('test', { email });
}

// Usage example:
// await sendTestEmail('your-email@example.com');

// ==================== INTEGRATION IN SIGNUP FLOW ====================
/**
 * Example: Complete signup flow with welcome email
 */
export async function handleSignup(email: string, password: string, name: string, language: 'en' | 'fr') {
  try {
    // 1. Create user account
    const signupResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({ email, password, name })
    });

    const signupData = await signupResponse.json();

    if (!signupResponse.ok) {
      throw new Error(signupData.error || 'Signup failed');
    }

    // 2. Send welcome email
    await sendWelcomeEmail(email, name, language);

    console.log('Signup successful and welcome email sent!');
    return signupData;
  } catch (error) {
    console.error('Signup flow error:', error);
    throw error;
  }
}

// ==================== INTEGRATION IN PAYMENT FLOW ====================
/**
 * Example: Payment success handler with email
 */
export async function handlePaymentSuccess(
  userId: string,
  email: string,
  name: string,
  language: 'en' | 'fr',
  invoiceNumber: string,
  amount: number,
  taxYear: number
) {
  try {
    // 1. Send payment confirmation email
    await sendPaymentConfirmationEmail(
      email,
      name,
      language,
      invoiceNumber,
      amount,
      taxYear,
      'initial'
    );

    // 2. Send invoice email with PDF link
    const invoiceUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/invoices/${invoiceNumber}/pdf`;
    await sendInvoiceEmail(
      email,
      name,
      language,
      invoiceNumber,
      amount,
      taxYear,
      invoiceUrl
    );

    console.log('Payment confirmation and invoice emails sent!');
  } catch (error) {
    console.error('Payment email flow error:', error);
    // Don't throw - email failure shouldn't break payment flow
  }
}

// ==================== INTEGRATION IN ADMIN DASHBOARD ====================
/**
 * Example: Admin sends reminder to client
 */
export async function adminSendReminder(
  clientEmail: string,
  clientName: string,
  clientLanguage: 'en' | 'fr',
  reminderType: 'documents' | 'payment' | 'deadline' | 'review' | 'missing-info',
  taxYear: number,
  customMessage?: string
) {
  try {
    await sendReminderEmail(
      clientEmail,
      clientName,
      clientLanguage,
      reminderType,
      {
        taxYear,
        customMessage
      }
    );

    console.log(`Reminder email sent to ${clientEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to send reminder:', error);
    throw error;
  }
}

// ==================== INTEGRATION WITH REACT COMPONENT ====================
/**
 * Example: React hook for sending emails
 */
/*
import { useState } from 'react';

export function useEmailSender() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (endpoint: string, data: any) => {
    setSending(true);
    setError(null);

    try {
      const response = await fetch(`${EMAIL_API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email');
      }

      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setSending(false);
    }
  };

  return { sendEmail, sending, error };
}

// Usage in component:
const MyComponent = () => {
  const { sendEmail, sending, error } = useEmailSender();

  const handleSendWelcome = async () => {
    try {
      await sendEmail('welcome', {
        email: 'user@example.com',
        name: 'John Doe',
        language: 'en'
      });
      alert('Welcome email sent!');
    } catch (error) {
      alert('Failed to send email');
    }
  };

  return (
    <button onClick={handleSendWelcome} disabled={sending}>
      {sending ? 'Sending...' : 'Send Welcome Email'}
    </button>
  );
};
*/
