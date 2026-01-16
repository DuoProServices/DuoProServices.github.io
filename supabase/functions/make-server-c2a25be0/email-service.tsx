/**
 * EMAIL SERVICE
 * Central service for sending emails using Resend
 */

import { Resend } from 'npm:resend@4.0.1';
import {
  generateWelcomeEmail,
  generatePaymentConfirmationEmail,
  generateInvoiceEmail,
  generateTaxReturnCompletedEmail,
  generateReminderEmail,
} from './email-templates/index.tsx';

// Initialize Resend
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

// Email configuration
const FROM_EMAIL = 'DuoProServices <contact@duoproservices.ca>';
const SUPPORT_EMAIL = 'contact@duoproservices.ca';
const PHONE = '+1 (514) 562-7838';

/**
 * Send Welcome Email
 */
export async function sendWelcomeEmail(
  to: string,
  name: string,
  language: 'en' | 'fr'
) {
  const html = generateWelcomeEmail({
    name,
    email: to,
    language,
  });

  const subject = language === 'en'
    ? 'Welcome to DuoProServices - Your Tax Return Journey Starts Here'
    : 'Bienvenue chez DuoProServices - Votre Parcours Fiscal Commence Ici';

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: html.replace('[email@duoproservices.com]', SUPPORT_EMAIL).replace('[phone]', PHONE),
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }

    console.log('Welcome email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}

/**
 * Send Payment Confirmation Email
 */
export async function sendPaymentConfirmationEmail(
  to: string,
  name: string,
  language: 'en' | 'fr',
  invoiceNumber: string,
  amount: number,
  currency: string,
  taxYear: number,
  paymentDate: string,
  paymentType: 'initial' | 'final'
) {
  const html = generatePaymentConfirmationEmail({
    name,
    email: to,
    language,
    invoiceNumber,
    amount,
    currency,
    taxYear,
    paymentDate,
    paymentType,
  });

  const subject = language === 'en'
    ? `Payment Confirmation - Invoice ${invoiceNumber}`
    : `Confirmation de Paiement - Facture ${invoiceNumber}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: html.replace('[email@duoproservices.com]', SUPPORT_EMAIL).replace('[phone]', PHONE),
    });

    if (error) {
      console.error('Error sending payment confirmation email:', error);
      throw error;
    }

    console.log('Payment confirmation email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send payment confirmation email:', error);
    return { success: false, error };
  }
}

/**
 * Send Invoice Email
 */
export async function sendInvoiceEmail(
  to: string,
  name: string,
  language: 'en' | 'fr',
  invoiceNumber: string,
  amount: number,
  currency: string,
  taxYear: number,
  invoiceUrl: string,
  dueDate?: string
) {
  const html = generateInvoiceEmail({
    name,
    email: to,
    language,
    invoiceNumber,
    amount,
    currency,
    taxYear,
    invoiceUrl,
    dueDate,
  });

  const subject = language === 'en'
    ? `Invoice ${invoiceNumber} - DuoProServices`
    : `Facture ${invoiceNumber} - DuoProServices`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: html.replace('[email@duoproservices.com]', SUPPORT_EMAIL).replace('[phone]', PHONE),
    });

    if (error) {
      console.error('Error sending invoice email:', error);
      throw error;
    }

    console.log('Invoice email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send invoice email:', error);
    return { success: false, error };
  }
}

/**
 * Send Tax Return Completed Email
 */
export async function sendTaxReturnCompletedEmail(
  to: string,
  name: string,
  language: 'en' | 'fr',
  taxYear: number,
  completionDate: string,
  hasRefund?: boolean,
  refundAmount?: number,
  hasBalance?: boolean,
  balanceAmount?: number
) {
  const html = generateTaxReturnCompletedEmail({
    name,
    email: to,
    language,
    taxYear,
    completionDate,
    hasRefund,
    refundAmount,
    hasBalance,
    balanceAmount,
  });

  const subject = language === 'en'
    ? `Your ${taxYear} Tax Return is Complete!`
    : `Votre Déclaration de Revenus ${taxYear} est Complète!`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: html.replace('[email@duoproservices.com]', SUPPORT_EMAIL).replace('[phone]', PHONE),
    });

    if (error) {
      console.error('Error sending tax return completed email:', error);
      throw error;
    }

    console.log('Tax return completed email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send tax return completed email:', error);
    return { success: false, error };
  }
}

/**
 * Send Reminder Email
 */
export async function sendReminderEmail(
  to: string,
  name: string,
  language: 'en' | 'fr',
  reminderType: 'documents' | 'payment' | 'deadline' | 'review' | 'missing-info',
  taxYear?: number,
  dueDate?: string,
  customMessage?: string
) {
  const html = generateReminderEmail({
    name,
    email: to,
    language,
    reminderType,
    taxYear,
    dueDate,
    customMessage,
  });

  // Get subject based on reminder type and language
  const subjects = {
    en: {
      documents: 'Reminder: Upload Your Tax Documents',
      payment: 'Reminder: Payment Pending',
      deadline: 'Reminder: Tax Filing Deadline Approaching',
      review: 'Reminder: Review Your Tax Return',
      'missing-info': 'Reminder: Additional Information Needed',
    },
    fr: {
      documents: 'Rappel: Téléchargez Vos Documents Fiscaux',
      payment: 'Rappel: Paiement en Attente',
      deadline: 'Rappel: Date Limite de Déclaration Approche',
      review: 'Rappel: Révisez Votre Déclaration',
      'missing-info': 'Rappel: Informations Supplémentaires Requises',
    },
  };

  const subject = subjects[language][reminderType];

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: html.replace('[email@duoproservices.com]', SUPPORT_EMAIL).replace('[phone]', PHONE),
    });

    if (error) {
      console.error('Error sending reminder email:', error);
      throw error;
    }

    console.log('Reminder email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send reminder email:', error);
    return { success: false, error };
  }
}

/**
 * Test email function - for testing the email service
 */
export async function sendTestEmail(to: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Test Email from DuoProServices',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from DuoProServices email service.</p>
        <p>If you received this, the email integration is working correctly! ✅</p>
      `,
    });

    if (error) {
      console.error('Error sending test email:', error);
      throw error;
    }

    console.log('Test email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send test email:', error);
    return { success: false, error };
  }
}