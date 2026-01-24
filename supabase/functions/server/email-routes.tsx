/**
 * EMAIL ROUTES
 * API routes for sending emails
 */

import { Hono } from 'npm:hono@4.6.14';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import {
  sendWelcomeEmail,
  sendPaymentConfirmationEmail,
  sendInvoiceEmail,
  sendTaxReturnCompletedEmail,
  sendReminderEmail,
  sendTestEmail,
} from './email-service.tsx';

const emailRoutes = new Hono();

// Helper function to get authenticated user
async function getAuthenticatedUser(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * POST /make-server-c2a25be0/emails/welcome
 * Send welcome email to new user
 * 
 * Body: {
 *   email: string,
 *   name: string,
 *   language: 'en' | 'fr'
 * }
 */
emailRoutes.post('/welcome', async (c) => {
  try {
    const { email, name, language } = await c.req.json();

    if (!email || !name || !language) {
      return c.json({ error: 'Missing required fields: email, name, language' }, 400);
    }

    const result = await sendWelcomeEmail(email, name, language);

    if (!result.success) {
      return c.json({ error: 'Failed to send email', details: result.error }, 500);
    }

    return c.json({ success: true, message: 'Welcome email sent successfully' });
  } catch (error) {
    console.error('Error in welcome email route:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

/**
 * POST /make-server-c2a25be0/emails/payment-confirmation
 * Send payment confirmation email
 * 
 * Body: {
 *   email: string,
 *   name: string,
 *   language: 'en' | 'fr',
 *   invoiceNumber: string,
 *   amount: number,
 *   currency: string,
 *   taxYear: number,
 *   paymentDate: string,
 *   paymentType: 'initial' | 'final'
 * }
 */
emailRoutes.post('/payment-confirmation', async (c) => {
  try {
    const body = await c.req.json();
    const { email, name, language, invoiceNumber, amount, currency, taxYear, paymentDate, paymentType } = body;

    if (!email || !name || !language || !invoiceNumber || !amount || !currency || !taxYear || !paymentDate || !paymentType) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const result = await sendPaymentConfirmationEmail(
      email,
      name,
      language,
      invoiceNumber,
      amount,
      currency,
      taxYear,
      paymentDate,
      paymentType
    );

    if (!result.success) {
      return c.json({ error: 'Failed to send email', details: result.error }, 500);
    }

    return c.json({ success: true, message: 'Payment confirmation email sent successfully' });
  } catch (error) {
    console.error('Error in payment confirmation email route:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

/**
 * POST /make-server-c2a25be0/emails/invoice
 * Send invoice email
 * 
 * Body: {
 *   email: string,
 *   name: string,
 *   language: 'en' | 'fr',
 *   invoiceNumber: string,
 *   amount: number,
 *   currency: string,
 *   taxYear: number,
 *   invoiceUrl: string,
 *   dueDate?: string
 * }
 */
emailRoutes.post('/invoice', async (c) => {
  try {
    const body = await c.req.json();
    const { email, name, language, invoiceNumber, amount, currency, taxYear, invoiceUrl, dueDate } = body;

    if (!email || !name || !language || !invoiceNumber || !amount || !currency || !taxYear || !invoiceUrl) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const result = await sendInvoiceEmail(
      email,
      name,
      language,
      invoiceNumber,
      amount,
      currency,
      taxYear,
      invoiceUrl,
      dueDate
    );

    if (!result.success) {
      return c.json({ error: 'Failed to send email', details: result.error }, 500);
    }

    return c.json({ success: true, message: 'Invoice email sent successfully' });
  } catch (error) {
    console.error('Error in invoice email route:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

/**
 * POST /make-server-c2a25be0/emails/tax-return-completed
 * Send tax return completed email
 * 
 * Body: {
 *   email: string,
 *   name: string,
 *   language: 'en' | 'fr',
 *   taxYear: number,
 *   completionDate: string,
 *   hasRefund?: boolean,
 *   refundAmount?: number,
 *   hasBalance?: boolean,
 *   balanceAmount?: number
 * }
 */
emailRoutes.post('/tax-return-completed', async (c) => {
  try {
    const body = await c.req.json();
    const { email, name, language, taxYear, completionDate, hasRefund, refundAmount, hasBalance, balanceAmount } = body;

    if (!email || !name || !language || !taxYear || !completionDate) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const result = await sendTaxReturnCompletedEmail(
      email,
      name,
      language,
      taxYear,
      completionDate,
      hasRefund,
      refundAmount,
      hasBalance,
      balanceAmount
    );

    if (!result.success) {
      return c.json({ error: 'Failed to send email', details: result.error }, 500);
    }

    return c.json({ success: true, message: 'Tax return completed email sent successfully' });
  } catch (error) {
    console.error('Error in tax return completed email route:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

/**
 * POST /make-server-c2a25be0/emails/reminder
 * Send reminder email
 * 
 * Body: {
 *   email: string,
 *   name: string,
 *   language: 'en' | 'fr',
 *   reminderType: 'documents' | 'payment' | 'deadline' | 'review' | 'missing-info',
 *   taxYear?: number,
 *   dueDate?: string,
 *   customMessage?: string
 * }
 */
emailRoutes.post('/reminder', async (c) => {
  try {
    const body = await c.req.json();
    const { email, name, language, reminderType, taxYear, dueDate, customMessage } = body;

    if (!email || !name || !language || !reminderType) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const result = await sendReminderEmail(
      email,
      name,
      language,
      reminderType,
      taxYear,
      dueDate,
      customMessage
    );

    if (!result.success) {
      return c.json({ error: 'Failed to send email', details: result.error }, 500);
    }

    return c.json({ success: true, message: 'Reminder email sent successfully' });
  } catch (error) {
    console.error('Error in reminder email route:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

/**
 * POST /make-server-c2a25be0/emails/test
 * Send test email (for testing purposes)
 * 
 * Body: {
 *   email: string
 * }
 */
emailRoutes.post('/test', async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: 'Missing required field: email' }, 400);
    }

    const result = await sendTestEmail(email);

    if (!result.success) {
      return c.json({ error: 'Failed to send test email', details: result.error }, 500);
    }

    return c.json({ success: true, message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Error in test email route:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

export default emailRoutes;
