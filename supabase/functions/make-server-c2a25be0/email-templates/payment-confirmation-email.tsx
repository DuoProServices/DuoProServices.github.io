/**
 * PAYMENT CONFIRMATION EMAIL TEMPLATE
 * Sent after successful payment
 */

export interface PaymentConfirmationEmailData {
  name: string;
  email: string;
  language: 'en' | 'fr';
  invoiceNumber: string;
  amount: number;
  currency: string;
  taxYear: number;
  paymentDate: string;
  paymentType: 'initial' | 'final';
}

export function generatePaymentConfirmationEmail(data: PaymentConfirmationEmailData): string {
  const { name, language, invoiceNumber, amount, currency, taxYear, paymentDate, paymentType } = data;

  const formatCurrency = (amt: number, curr: string) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: curr,
    }).format(amt);
  };

  const formatDate = (dateStr: string, lang: 'en' | 'fr') => {
    return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-CA' : 'en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateStr));
  };

  const content = {
    en: {
      subject: `Payment Confirmation - Invoice ${invoiceNumber}`,
      greeting: `Hi ${name},`,
      title: 'Payment Received!',
      thankYou: 'Thank you for your payment. We have successfully received your payment for your tax return processing.',
      paymentDetails: 'Payment Details:',
      invoice: 'Invoice Number',
      amount: 'Amount Paid',
      date: 'Payment Date',
      taxYear: 'Tax Year',
      description: paymentType === 'initial' 
        ? `${taxYear} tax return processing (filed in ${taxYear - 1})`
        : `Final payment for ${taxYear} tax return`,
      nextSteps: paymentType === 'initial'
        ? 'Our team will now begin processing your tax return. You can track the progress in your client dashboard.'
        : 'Your tax return is complete! You can download your final documents from your client dashboard.',
      dashboardButton: 'View Dashboard',
      receiptInfo: 'A receipt has been sent to your email for your records.',
      questions: 'Questions about your payment?',
      contactUs: 'Don\'t hesitate to reach out to our support team.',
      footer: 'Thank you for choosing DuoProServices.',
      team: 'The DuoProServices Team',
    },
    fr: {
      subject: `Confirmation de Paiement - Facture ${invoiceNumber}`,
      greeting: `Bonjour ${name},`,
      title: 'Paiement Reçu!',
      thankYou: 'Merci pour votre paiement. Nous avons bien reçu votre paiement pour le traitement de votre déclaration de revenus.',
      paymentDetails: 'Détails du Paiement:',
      invoice: 'Numéro de Facture',
      amount: 'Montant Payé',
      date: 'Date de Paiement',
      taxYear: 'Année Fiscale',
      description: paymentType === 'initial'
        ? `Traitement de la déclaration ${taxYear} (déposée en ${taxYear - 1})`
        : `Paiement final pour la déclaration ${taxYear}`,
      nextSteps: paymentType === 'initial'
        ? 'Notre équipe va maintenant commencer le traitement de votre déclaration. Vous pouvez suivre la progression dans votre tableau de bord client.'
        : 'Votre déclaration de revenus est terminée! Vous pouvez télécharger vos documents finaux depuis votre tableau de bord client.',
      dashboardButton: 'Voir le Tableau de Bord',
      receiptInfo: 'Un reçu a été envoyé à votre courriel pour vos dossiers.',
      questions: 'Des questions sur votre paiement?',
      contactUs: 'N\'hésitez pas à contacter notre équipe de support.',
      footer: 'Merci d\'avoir choisi DuoProServices.',
      team: 'L\'équipe DuoProServices',
    },
  };

  const t = content[language];

  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 3px solid #10b981;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1f2937;">DuoProServices</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #6b7280;">Professional Tax Services</p>
            </td>
          </tr>

          <!-- Success Icon -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <div style="width: 80px; height: 80px; margin: 0 auto; background-color: #d1fae5; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">✅</span>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #1f2937; text-align: center;">${t.title}</h2>
              
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #4b5563;">${t.greeting}</p>
              
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #4b5563;">${t.thankYou}</p>

              <!-- Payment Details Box -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 24px; margin: 24px 0; border-radius: 8px;">
                <h3 style="margin: 0 0 20px; font-size: 18px; font-weight: 600; color: #1f2937;">${t.paymentDetails}</h3>
                
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; width: 50%;">${t.invoice}:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">${invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">${t.amount}:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">${formatCurrency(amount, currency)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">${t.date}:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">${formatDate(paymentDate, language)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">${t.taxYear}:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">${taxYear}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding: 16px 0 8px; color: #6b7280; border-top: 1px solid #e5e7eb;">
                      ${t.description}
                    </td>
                  </tr>
                </table>
              </div>

              <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 15px; line-height: 22px; color: #1e40af;">${t.nextSteps}</p>
              </div>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${Deno.env.get('APP_URL') || 'https://your-app-url.com'}/client-portal" style="display: inline-block; padding: 14px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">${t.dashboardButton}</a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; font-size: 14px; color: #6b7280; text-align: center;">${t.receiptInfo}</p>

              <!-- Help Section -->
              <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 8px; font-size: 15px; color: #6b7280; font-weight: 600;">${t.questions}</p>
                <p style="margin: 0; font-size: 15px; color: #6b7280;">${t.contactUs}</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280; text-align: center;">${t.footer}</p>
              <p style="margin: 0; font-size: 14px; color: #1f2937; font-weight: 600; text-align: center;">${t.team}</p>
              
              <div style="margin-top: 24px; text-align: center; font-size: 13px; color: #9ca3af;">
                <p style="margin: 0;">DuoProServices</p>
                <p style="margin: 4px 0 0;">📧 [email@duoproservices.com] | 📞 [phone]</p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}