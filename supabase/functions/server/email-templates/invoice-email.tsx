/**
 * INVOICE EMAIL TEMPLATE
 * Sent when invoice is generated
 */

export interface InvoiceEmailData {
  name: string;
  email: string;
  language: 'en' | 'fr';
  invoiceNumber: string;
  amount: number;
  currency: string;
  taxYear: number;
  dueDate?: string;
  invoiceUrl: string;
}

export function generateInvoiceEmail(data: InvoiceEmailData): string {
  const { name, language, invoiceNumber, amount, currency, taxYear, dueDate, invoiceUrl } = data;

  const formatCurrency = (amt: number, curr: string) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: curr,
    }).format(amt);
  };

  const formatDate = (dateStr: string | undefined, lang: 'en' | 'fr') => {
    if (!dateStr) return '';
    return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-CA' : 'en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateStr));
  };

  const content = {
    en: {
      subject: `Invoice ${invoiceNumber} - DuoProServices`,
      greeting: `Hi ${name},`,
      title: 'New Invoice Available',
      paragraph1: 'We have generated a new invoice for your tax return processing services.',
      invoiceDetails: 'Invoice Details:',
      invoice: 'Invoice Number',
      amount: 'Amount Due',
      taxYear: 'Tax Year',
      dueDate: 'Due Date',
      description: `${taxYear} tax return processing (filed in ${taxYear - 1})`,
      viewInvoiceButton: 'View Invoice',
      payNowButton: 'Pay Now',
      downloadInfo: 'You can view and download your invoice anytime from your client dashboard.',
      paymentInfo: 'Please complete your payment to proceed with your tax return processing.',
      questions: 'Questions about this invoice?',
      contactUs: 'Our team is here to help. Contact us anytime.',
      footer: 'Thank you for choosing DuoProServices.',
      team: 'The DuoProServices Team',
    },
    fr: {
      subject: `Facture ${invoiceNumber} - DuoProServices`,
      greeting: `Bonjour ${name},`,
      title: 'Nouvelle Facture Disponible',
      paragraph1: 'Nous avons généré une nouvelle facture pour vos services de traitement de déclaration de revenus.',
      invoiceDetails: 'Détails de la Facture:',
      invoice: 'Numéro de Facture',
      amount: 'Montant Dû',
      taxYear: 'Année Fiscale',
      dueDate: 'Date d\'Échéance',
      description: `Traitement de la déclaration ${taxYear} (déposée en ${taxYear - 1})`,
      viewInvoiceButton: 'Voir la Facture',
      payNowButton: 'Payer Maintenant',
      downloadInfo: 'Vous pouvez consulter et télécharger votre facture à tout moment depuis votre tableau de bord client.',
      paymentInfo: 'Veuillez compléter votre paiement pour poursuivre le traitement de votre déclaration de revenus.',
      questions: 'Des questions sur cette facture?',
      contactUs: 'Notre équipe est là pour vous aider. Contactez-nous à tout moment.',
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
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 3px solid #6366f1;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1f2937;">DuoProServices</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #6b7280;">Professional Tax Services</p>
            </td>
          </tr>

          <!-- Invoice Icon -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <div style="width: 80px; height: 80px; margin: 0 auto; background-color: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">📄</span>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #1f2937; text-align: center;">${t.title}</h2>
              
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #4b5563;">${t.greeting}</p>
              
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #4b5563;">${t.paragraph1}</p>

              <!-- Invoice Details Box -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 24px; margin: 24px 0; border-radius: 8px;">
                <h3 style="margin: 0 0 20px; font-size: 18px; font-weight: 600; color: #1f2937;">${t.invoiceDetails}</h3>
                
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; width: 50%;">${t.invoice}:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">${invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">${t.amount}:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 700; font-size: 18px; text-align: right;">${formatCurrency(amount, currency)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">${t.taxYear}:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">${taxYear}</td>
                  </tr>
                  ${dueDate ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">${t.dueDate}:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">${formatDate(dueDate, language)}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td colspan="2" style="padding: 16px 0 8px; color: #6b7280; border-top: 1px solid #e5e7eb;">
                      ${t.description}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Action Buttons -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <a href="${invoiceUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">${t.viewInvoiceButton}</a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center;">
                    <a href="${Deno.env.get('APP_URL') || 'https://your-app-url.com'}/client-portal?tab=invoices" style="display: inline-block; padding: 14px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">${t.payNowButton}</a>
                  </td>
                </tr>
              </table>

              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0 0 8px; font-size: 15px; line-height: 22px; color: #92400e; font-weight: 600;">${t.paymentInfo}</p>
                <p style="margin: 0; font-size: 14px; line-height: 20px; color: #92400e;">${t.downloadInfo}</p>
              </div>

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
