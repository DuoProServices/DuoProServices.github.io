/**
 * TAX RETURN COMPLETED EMAIL TEMPLATE
 * Sent when tax return processing is complete
 */

export interface TaxReturnCompletedEmailData {
  name: string;
  email: string;
  language: 'en' | 'fr';
  taxYear: number;
  completionDate: string;
  hasRefund?: boolean;
  refundAmount?: number;
  hasBalance?: boolean;
  balanceAmount?: number;
}

export function generateTaxReturnCompletedEmail(data: TaxReturnCompletedEmailData): string {
  const { name, language, taxYear, completionDate, hasRefund, refundAmount, hasBalance, balanceAmount } = data;

  const formatCurrency = (amt: number | undefined) => {
    if (amt === undefined) return '';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
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
      subject: `Your ${taxYear} Tax Return is Complete!`,
      greeting: `Hi ${name},`,
      title: 'Tax Return Complete!',
      paragraph1: `Great news! Your ${taxYear} tax return has been successfully processed and is now complete.`,
      paragraph2: 'All your tax documents are ready for download in your client dashboard.',
      completionDetails: 'Completion Details:',
      taxYear: 'Tax Year',
      completedOn: 'Completed On',
      status: 'Status',
      statusValue: 'Complete',
      refundTitle: '🎉 You have a refund!',
      refundMessage: 'You will be receiving a refund of',
      balanceTitle: '⚠️ Balance Due',
      balanceMessage: 'You have a balance owing of',
      balanceReminder: 'Please ensure payment is made by the CRA deadline to avoid interest charges.',
      whatNext: 'What\'s Next?',
      step1: '<strong>Download Your Documents</strong> - Access all your tax return documents',
      step2: '<strong>Review Your Return</strong> - Check all details carefully',
      step3: '<strong>File with CRA</strong> - We\'ll handle the submission to CRA',
      step4: hasBalance ? '<strong>Pay Any Balance</strong> - Ensure payment by deadline' : '<strong>Track Your Refund</strong> - Monitor your refund status with CRA',
      dashboardButton: 'View Documents',
      thankYou: 'Thank you for choosing DuoProServices for your tax needs. We look forward to serving you again next year!',
      questions: 'Questions about your tax return?',
      contactUs: 'Our team is available to answer any questions you may have.',
      footer: 'It was our pleasure to serve you.',
      team: 'The DuoProServices Team',
    },
    fr: {
      subject: `Votre Déclaration de Revenus ${taxYear} est Complète!`,
      greeting: `Bonjour ${name},`,
      title: 'Déclaration Complète!',
      paragraph1: `Bonne nouvelle! Votre déclaration de revenus ${taxYear} a été traitée avec succès et est maintenant terminée.`,
      paragraph2: 'Tous vos documents fiscaux sont prêts à être téléchargés dans votre tableau de bord client.',
      completionDetails: 'Détails de Complétion:',
      taxYear: 'Année Fiscale',
      completedOn: 'Terminée le',
      status: 'Statut',
      statusValue: 'Complète',
      refundTitle: '🎉 Vous avez un remboursement!',
      refundMessage: 'Vous recevrez un remboursement de',
      balanceTitle: '⚠️ Solde Dû',
      balanceMessage: 'Vous avez un solde dû de',
      balanceReminder: 'Assurez-vous que le paiement est effectué avant la date limite de l\'ARC pour éviter les frais d\'intérêt.',
      whatNext: 'Prochaines Étapes?',
      step1: '<strong>Téléchargez Vos Documents</strong> - Accédez à tous vos documents fiscaux',
      step2: '<strong>Révisez Votre Déclaration</strong> - Vérifiez tous les détails attentivement',
      step3: '<strong>Déposer auprès de l\'ARC</strong> - Nous nous occupons de la soumission à l\'ARC',
      step4: hasBalance ? '<strong>Payez Tout Solde</strong> - Assurez le paiement avant la date limite' : '<strong>Suivez Votre Remboursement</strong> - Surveillez l\'état de votre remboursement avec l\'ARC',
      dashboardButton: 'Voir les Documents',
      thankYou: 'Merci d\'avoir choisi DuoProServices pour vos besoins fiscaux. Nous avons hâte de vous servir à nouveau l\'année prochaine!',
      questions: 'Des questions sur votre déclaration?',
      contactUs: 'Notre équipe est disponible pour répondre à toutes vos questions.',
      footer: 'Ce fut un plaisir de vous servir.',
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
                <span style="font-size: 40px;">🎉</span>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #1f2937; text-align: center;">${t.title}</h2>
              
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #4b5563;">${t.greeting}</p>
              
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #4b5563;">${t.paragraph1}</p>
              
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #4b5563;">${t.paragraph2}</p>

              <!-- Completion Details Box -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 24px; margin: 24px 0; border-radius: 8px;">
                <h3 style="margin: 0 0 20px; font-size: 18px; font-weight: 600; color: #1f2937;">${t.completionDetails}</h3>
                
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; width: 50%;">${t.taxYear}:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">${taxYear}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">${t.completedOn}:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">${formatDate(completionDate, language)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">${t.status}:</td>
                    <td style="padding: 8px 0; color: #10b981; font-weight: 700; text-align: right;">✓ ${t.statusValue}</td>
                  </tr>
                </table>
              </div>

              ${hasRefund ? `
              <!-- Refund Notice -->
              <div style="background-color: #d1fae5; border-left: 4px solid #10b981; padding: 20px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0 0 8px; font-size: 16px; font-weight: 700; color: #065f46;">${t.refundTitle}</p>
                <p style="margin: 0; font-size: 15px; line-height: 22px; color: #065f46;">${t.refundMessage} <strong style="font-size: 18px;">${formatCurrency(refundAmount)}</strong></p>
              </div>
              ` : ''}

              ${hasBalance ? `
              <!-- Balance Due Notice -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0 0 8px; font-size: 16px; font-weight: 700; color: #92400e;">${t.balanceTitle}</p>
                <p style="margin: 0 0 12px; font-size: 15px; line-height: 22px; color: #92400e;">${t.balanceMessage} <strong style="font-size: 18px;">${formatCurrency(balanceAmount)}</strong></p>
                <p style="margin: 0; font-size: 14px; line-height: 20px; color: #92400e;">${t.balanceReminder}</p>
              </div>
              ` : ''}

              <!-- Next Steps -->
              <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin: 24px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #1e40af;">${t.whatNext}</h3>
                <ol style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 15px; line-height: 28px;">
                  <li>${t.step1}</li>
                  <li>${t.step2}</li>
                  <li>${t.step3}</li>
                  <li>${t.step4}</li>
                </ol>
              </div>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${Deno.env.get('APP_URL') || 'https://your-app-url.com'}/client-portal" style="display: inline-block; padding: 14px 32px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">${t.dashboardButton}</a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0; font-size: 15px; line-height: 24px; color: #4b5563; text-align: center;">${t.thankYou}</p>

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