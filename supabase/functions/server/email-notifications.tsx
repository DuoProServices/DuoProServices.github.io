/**
 * EMAIL NOTIFICATIONS SYSTEM
 * 
 * Sends email notifications for:
 * - New messages (admin ↔ client)
 * - Invoice created
 * - Payment confirmed
 */

import { createClient } from "jsr:@supabase/supabase-js@2";

// Email service configuration
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY'); // User needs to add this
const FROM_EMAIL = 'noreply@duoproservices.ca'; // Change to your domain

interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email using Resend API
 * Falls back to console log if API key not configured
 */
async function sendEmail(notification: EmailNotification): Promise<boolean> {
  console.log('📧 [EMAIL] Sending notification to:', notification.to);
  console.log('📧 [EMAIL] Subject:', notification.subject);

  // If no API key, just log (dev mode)
  if (!RESEND_API_KEY) {
    console.warn('⚠️ [EMAIL] RESEND_API_KEY not configured - skipping email send');
    console.log('📧 [EMAIL] Would send:', {
      to: notification.to,
      subject: notification.subject,
      preview: notification.html.substring(0, 200) + '...'
    });
    return true; // Return true so app doesn't break
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: notification.to,
        subject: notification.subject,
        html: notification.html,
        text: notification.text || notification.html.replace(/<[^>]*>/g, ''),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ [EMAIL] Failed to send:', error);
      return false;
    }

    const data = await response.json();
    console.log('✅ [EMAIL] Sent successfully:', data.id);
    return true;
  } catch (error) {
    console.error('❌ [EMAIL] Error sending email:', error);
    return false;
  }
}

/**
 * Generate HTML email template
 */
function generateEmailHTML(params: {
  title: string;
  preheader?: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
  footerText?: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${params.title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: white;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .content p {
      margin: 0 0 16px;
      color: #374151;
      font-size: 16px;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: #2563eb;
      color: white !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .button:hover {
      background: #1e40af;
    }
    .footer {
      padding: 30px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      text-align: center;
    }
    .footer p {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }
    .preheader {
      display: none !important;
      max-height: 0;
      overflow: hidden;
    }
  </style>
</head>
<body>
  ${params.preheader ? `<div class="preheader">${params.preheader}</div>` : ''}
  
  <div class="container">
    <div class="header">
      <h1>${params.title}</h1>
    </div>
    
    <div class="content">
      ${params.content}
      
      ${params.buttonText && params.buttonUrl ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${params.buttonUrl}" class="button">${params.buttonText}</a>
        </div>
      ` : ''}
    </div>
    
    <div class="footer">
      <p>${params.footerText || 'DuoPro Services - Canadian Tax Solutions'}</p>
      <p style="margin-top: 10px;">
        <a href="mailto:duopro@duoproservices.ca" style="color: #2563eb; text-decoration: none;">duopro@duoproservices.ca</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * NOTIFICATION 1: New Message Received
 */
export async function sendNewMessageNotification(params: {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  senderRole: 'admin' | 'client';
  subject: string;
  messagePreview: string;
  messageUrl: string;
  language?: 'en' | 'fr';
}): Promise<boolean> {
  const lang = params.language || 'en';
  
  const translations = {
    en: {
      emailSubject: `New message: ${params.subject}`,
      title: '💬 New Message',
      preheader: `You have a new message from ${params.senderName}`,
      greeting: `Hi ${params.recipientName},`,
      body: `You have received a new message from ${params.senderName} (${params.senderRole === 'admin' ? 'Admin' : 'Client'}):`,
      messageLabel: 'Message:',
      button: 'View Message',
      footer: 'This is an automated notification from DuoPro Services.'
    },
    fr: {
      emailSubject: `Nouveau message: ${params.subject}`,
      title: '💬 Nouveau Message',
      preheader: `Vous avez un nouveau message de ${params.senderName}`,
      greeting: `Bonjour ${params.recipientName},`,
      body: `Vous avez reçu un nouveau message de ${params.senderName} (${params.senderRole === 'admin' ? 'Administrateur' : 'Client'}):`,
      messageLabel: 'Message:',
      button: 'Voir le Message',
      footer: 'Ceci est une notification automatique de DuoPro Services.'
    }
  };

  const t = translations[lang];

  const content = `
    <p>${t.greeting}</p>
    <p>${t.body}</p>
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
      <p style="margin: 0 0 8px; font-weight: 600; color: #1f2937;">
        <strong>${params.subject}</strong>
      </p>
      <p style="margin: 0; color: #4b5563; font-size: 15px;">
        ${params.messagePreview}
      </p>
    </div>
  `;

  const html = generateEmailHTML({
    title: t.title,
    preheader: t.preheader,
    content,
    buttonText: t.button,
    buttonUrl: params.messageUrl,
    footerText: t.footer
  });

  return sendEmail({
    to: params.recipientEmail,
    subject: t.emailSubject,
    html
  });
}

/**
 * NOTIFICATION 2: Invoice Created
 */
export async function sendInvoiceCreatedNotification(params: {
  clientEmail: string;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  taxYear: number;
  invoiceUrl: string;
  paymentUrl: string;
  language?: 'en' | 'fr';
}): Promise<boolean> {
  const lang = params.language || 'en';
  
  const formattedAmount = new Intl.NumberFormat(lang === 'fr' ? 'fr-CA' : 'en-CA', {
    style: 'currency',
    currency: params.currency
  }).format(params.amount);

  const translations = {
    en: {
      emailSubject: `Invoice ${params.invoiceNumber} - $${params.amount} CAD`,
      title: '📄 New Invoice',
      preheader: `Your invoice for tax year ${params.taxYear} is ready`,
      greeting: `Hi ${params.clientName},`,
      body: `Your invoice for tax year ${params.taxYear} has been generated and is ready for payment.`,
      invoiceDetails: 'Invoice Details:',
      invoiceNumber: `Invoice Number: <strong>#${params.invoiceNumber}</strong>`,
      amount: `Amount: <strong>${formattedAmount}</strong>`,
      taxYear: `Tax Year: <strong>${params.taxYear}</strong>`,
      status: `Status: <strong style="color: #f59e0b;">Pending Payment</strong>`,
      note: 'Please review your invoice and proceed with payment at your earliest convenience.',
      button: 'Pay Now',
      viewInvoice: 'Or <a href="${params.invoiceUrl}" style="color: #2563eb;">view invoice details</a>',
      footer: 'Thank you for choosing DuoPro Services for your tax needs.'
    },
    fr: {
      emailSubject: `Facture ${params.invoiceNumber} - ${params.amount} $ CAD`,
      title: '📄 Nouvelle Facture',
      preheader: `Votre facture pour l'année fiscale ${params.taxYear} est prête`,
      greeting: `Bonjour ${params.clientName},`,
      body: `Votre facture pour l'année fiscale ${params.taxYear} a été générée et est prête pour le paiement.`,
      invoiceDetails: 'Détails de la Facture:',
      invoiceNumber: `Numéro de Facture: <strong>#${params.invoiceNumber}</strong>`,
      amount: `Montant: <strong>${formattedAmount}</strong>`,
      taxYear: `Année Fiscale: <strong>${params.taxYear}</strong>`,
      status: `Statut: <strong style="color: #f59e0b;">En Attente de Paiement</strong>`,
      note: 'Veuillez consulter votre facture et procéder au paiement dès que possible.',
      button: 'Payer Maintenant',
      viewInvoice: 'Ou <a href="${params.invoiceUrl}" style="color: #2563eb;">voir les détails de la facture</a>',
      footer: 'Merci d\'avoir choisi DuoPro Services pour vos besoins fiscaux.'
    }
  };

  const t = translations[lang];

  const content = `
    <p>${t.greeting}</p>
    <p>${t.body}</p>
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 12px; font-weight: 600; color: #1f2937;">${t.invoiceDetails}</p>
      <p style="margin: 8px 0;">${t.invoiceNumber}</p>
      <p style="margin: 8px 0;">${t.amount}</p>
      <p style="margin: 8px 0;">${t.taxYear}</p>
      <p style="margin: 8px 0;">${t.status}</p>
    </div>
    <p>${t.note}</p>
    <p style="text-align: center; margin-top: 20px;">${t.viewInvoice.replace('${params.invoiceUrl}', params.invoiceUrl)}</p>
  `;

  const html = generateEmailHTML({
    title: t.title,
    preheader: t.preheader,
    content,
    buttonText: t.button,
    buttonUrl: params.paymentUrl,
    footerText: t.footer
  });

  return sendEmail({
    to: params.clientEmail,
    subject: t.emailSubject,
    html
  });
}

/**
 * NOTIFICATION 3: Payment Confirmed
 */
export async function sendPaymentConfirmedNotification(params: {
  clientEmail: string;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  paidAt: string;
  taxYear: number;
  receiptUrl?: string;
  language?: 'en' | 'fr';
}): Promise<boolean> {
  const lang = params.language || 'en';
  
  const formattedAmount = new Intl.NumberFormat(lang === 'fr' ? 'fr-CA' : 'en-CA', {
    style: 'currency',
    currency: params.currency
  }).format(params.amount);

  const formattedDate = new Date(params.paidAt).toLocaleDateString(
    lang === 'fr' ? 'fr-CA' : 'en-CA',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const translations = {
    en: {
      emailSubject: `Payment Confirmed - Invoice ${params.invoiceNumber}`,
      title: '✅ Payment Confirmed',
      preheader: `Your payment of ${formattedAmount} has been received`,
      greeting: `Hi ${params.clientName},`,
      body: `Thank you! Your payment has been successfully processed.`,
      paymentDetails: 'Payment Details:',
      invoiceNumber: `Invoice Number: <strong>#${params.invoiceNumber}</strong>`,
      amount: `Amount Paid: <strong>${formattedAmount}</strong>`,
      paidAt: `Payment Date: <strong>${formattedDate}</strong>`,
      taxYear: `Tax Year: <strong>${params.taxYear}</strong>`,
      status: `Status: <strong style="color: #10b981;">✓ Paid</strong>`,
      nextSteps: 'What happens next?',
      step1: 'Our team will begin processing your tax return',
      step2: 'You\'ll receive updates on your progress',
      step3: 'We\'ll notify you when your return is ready for review',
      questions: 'If you have any questions, please don\'t hesitate to contact us.',
      button: params.receiptUrl ? 'Download Receipt' : undefined,
      footer: 'Thank you for your business!'
    },
    fr: {
      emailSubject: `Paiement Confirmé - Facture ${params.invoiceNumber}`,
      title: '✅ Paiement Confirmé',
      preheader: `Votre paiement de ${formattedAmount} a été reçu`,
      greeting: `Bonjour ${params.clientName},`,
      body: `Merci! Votre paiement a été traité avec succès.`,
      paymentDetails: 'Détails du Paiement:',
      invoiceNumber: `Numéro de Facture: <strong>#${params.invoiceNumber}</strong>`,
      amount: `Montant Payé: <strong>${formattedAmount}</strong>`,
      paidAt: `Date de Paiement: <strong>${formattedDate}</strong>`,
      taxYear: `Année Fiscale: <strong>${params.taxYear}</strong>`,
      status: `Statut: <strong style="color: #10b981;">✓ Payé</strong>`,
      nextSteps: 'Prochaines Étapes?',
      step1: 'Notre équipe commencera à traiter votre déclaration',
      step2: 'Vous recevrez des mises à jour sur votre progression',
      step3: 'Nous vous aviserons lorsque votre déclaration sera prête pour révision',
      questions: 'Si vous avez des questions, n\'hésitez pas à nous contacter.',
      button: params.receiptUrl ? 'Télécharger le Reçu' : undefined,
      footer: 'Merci pour votre confiance!'
    }
  };

  const t = translations[lang];

  const content = `
    <p>${t.greeting}</p>
    <p>${t.body}</p>
    <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
      <p style="margin: 0 0 12px; font-weight: 600; color: #1f2937;">${t.paymentDetails}</p>
      <p style="margin: 8px 0;">${t.invoiceNumber}</p>
      <p style="margin: 8px 0;">${t.amount}</p>
      <p style="margin: 8px 0;">${t.paidAt}</p>
      <p style="margin: 8px 0;">${t.taxYear}</p>
      <p style="margin: 8px 0;">${t.status}</p>
    </div>
    <p style="font-weight: 600; margin-top: 30px;">${t.nextSteps}</p>
    <ul style="color: #4b5563; margin: 10px 0;">
      <li style="margin: 8px 0;">✓ ${t.step1}</li>
      <li style="margin: 8px 0;">✓ ${t.step2}</li>
      <li style="margin: 8px 0;">✓ ${t.step3}</li>
    </ul>
    <p style="margin-top: 20px;">${t.questions}</p>
  `;

  const html = generateEmailHTML({
    title: t.title,
    preheader: t.preheader,
    content,
    buttonText: t.button,
    buttonUrl: params.receiptUrl,
    footerText: t.footer
  });

  return sendEmail({
    to: params.clientEmail,
    subject: t.emailSubject,
    html
  });
}

/**
 * Helper: Get user's preferred language
 */
export async function getUserLanguage(userId: string): Promise<'en' | 'fr'> {
  // Default to English if not specified
  // You can extend this to read from user preferences in KV store
  return 'en';
}
