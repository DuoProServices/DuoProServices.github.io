/**
 * REMINDER EMAIL TEMPLATE
 * Sent for various reminders (documents, payment, deadlines, etc.)
 */

export interface ReminderEmailData {
  name: string;
  email: string;
  language: 'en' | 'fr';
  reminderType: 'documents' | 'payment' | 'deadline' | 'review' | 'missing-info';
  taxYear?: number;
  dueDate?: string;
  customMessage?: string;
}

export function generateReminderEmail(data: ReminderEmailData): string {
  const { name, language, reminderType, taxYear, dueDate, customMessage } = data;

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
      documents: {
        subject: 'Reminder: Upload Your Tax Documents',
        title: 'Don\'t Forget Your Documents!',
        icon: '📎',
        message: 'We\'re ready to process your tax return, but we still need your documents.',
        action: 'Please upload your tax documents to continue with your tax return processing.',
        button: 'Upload Documents',
      },
      payment: {
        subject: 'Reminder: Payment Pending',
        title: 'Payment Reminder',
        icon: '💳',
        message: 'Your invoice is awaiting payment to proceed with your tax return.',
        action: 'Please complete your payment to continue processing your tax return.',
        button: 'Pay Now',
      },
      deadline: {
        subject: 'Reminder: Tax Filing Deadline Approaching',
        title: 'Deadline Approaching!',
        icon: '⏰',
        message: `The tax filing deadline is coming up soon${dueDate ? ` on ${formatDate(dueDate, 'en')}` : ''}.`,
        action: 'Make sure to submit all required documents and information before the deadline.',
        button: 'Check Status',
      },
      review: {
        subject: 'Reminder: Review Your Tax Return',
        title: 'Please Review Your Return',
        icon: '👀',
        message: 'Your tax return is ready for your review.',
        action: 'Please take a moment to review your tax return and approve it for filing.',
        button: 'Review Return',
      },
      'missing-info': {
        subject: 'Reminder: Additional Information Needed',
        title: 'Action Required',
        icon: '❗',
        message: 'We need some additional information to complete your tax return.',
        action: 'Please provide the missing information as soon as possible.',
        button: 'Provide Information',
      },
    },
    fr: {
      documents: {
        subject: 'Rappel: Téléchargez Vos Documents Fiscaux',
        title: 'N\'oubliez Pas Vos Documents!',
        icon: '📎',
        message: 'Nous sommes prêts à traiter votre déclaration, mais nous avons encore besoin de vos documents.',
        action: 'Veuillez télécharger vos documents fiscaux pour continuer le traitement de votre déclaration.',
        button: 'Télécharger les Documents',
      },
      payment: {
        subject: 'Rappel: Paiement en Attente',
        title: 'Rappel de Paiement',
        icon: '💳',
        message: 'Votre facture est en attente de paiement pour poursuivre votre déclaration.',
        action: 'Veuillez compléter votre paiement pour continuer le traitement de votre déclaration.',
        button: 'Payer Maintenant',
      },
      deadline: {
        subject: 'Rappel: Date Limite de Déclaration Approche',
        title: 'Date Limite Approche!',
        icon: '⏰',
        message: `La date limite de déclaration approche${dueDate ? ` le ${formatDate(dueDate, 'fr')}` : ''}.`,
        action: 'Assurez-vous de soumettre tous les documents et informations requis avant la date limite.',
        button: 'Vérifier le Statut',
      },
      review: {
        subject: 'Rappel: Révisez Votre Déclaration',
        title: 'Veuillez Réviser Votre Déclaration',
        icon: '👀',
        message: 'Votre déclaration de revenus est prête pour votre révision.',
        action: 'Veuillez prendre un moment pour réviser votre déclaration et l\'approuver pour dépôt.',
        button: 'Réviser la Déclaration',
      },
      'missing-info': {
        subject: 'Rappel: Informations Supplémentaires Requises',
        title: 'Action Requise',
        icon: '❗',
        message: 'Nous avons besoin d\'informations supplémentaires pour compléter votre déclaration.',
        action: 'Veuillez fournir les informations manquantes dès que possible.',
        button: 'Fournir les Informations',
      },
    },
  };

  const t = content[language][reminderType];
  const common = {
    en: {
      greeting: `Hi ${name},`,
      customMessageLabel: 'Additional Information:',
      taxYearLabel: 'Tax Year',
      dueDateLabel: 'Due Date',
      notSure: 'Not sure what to do?',
      contactUs: 'Our team is here to help. Contact us anytime with questions.',
      footer: 'This is a friendly reminder from DuoProServices.',
      team: 'The DuoProServices Team',
      unsubscribe: 'You are receiving this email because you have an active tax return with DuoProServices.',
    },
    fr: {
      greeting: `Bonjour ${name},`,
      customMessageLabel: 'Information Supplémentaire:',
      taxYearLabel: 'Année Fiscale',
      dueDateLabel: 'Date d\'Échéance',
      notSure: 'Vous ne savez pas quoi faire?',
      contactUs: 'Notre équipe est là pour vous aider. Contactez-nous à tout moment si vous avez des questions.',
      footer: 'Ceci est un rappel amical de DuoProServices.',
      team: 'L\'équipe DuoProServices',
      unsubscribe: 'Vous recevez cet email car vous avez une déclaration active avec DuoProServices.',
    },
  };

  const c = common[language];

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
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 3px solid #f59e0b;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1f2937;">DuoProServices</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #6b7280;">Professional Tax Services</p>
            </td>
          </tr>

          <!-- Reminder Icon -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <div style="width: 80px; height: 80px; margin: 0 auto; background-color: #fef3c7; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">${t.icon}</span>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #1f2937; text-align: center;">${t.title}</h2>
              
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 24px; color: #4b5563;">${c.greeting}</p>
              
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #4b5563;">${t.message}</p>

              <!-- Action Box -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0; font-size: 15px; line-height: 22px; color: #92400e; font-weight: 600;">${t.action}</p>
              </div>

              ${taxYear || dueDate ? `
              <!-- Details Box -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; margin: 24px 0; border-radius: 8px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-size: 15px;">
                  ${taxYear ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; width: 50%;">${c.taxYearLabel}:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">${taxYear}</td>
                  </tr>
                  ` : ''}
                  ${dueDate ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">${c.dueDateLabel}:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">${formatDate(dueDate, language)}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              ` : ''}

              ${customMessage ? `
              <!-- Custom Message -->
              <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #1e40af;">${c.customMessageLabel}</p>
                <p style="margin: 0; font-size: 15px; line-height: 22px; color: #1e40af;">${customMessage}</p>
              </div>
              ` : ''}

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${Deno.env.get('APP_URL') || 'https://your-app-url.com'}/client-portal" style="display: inline-block; padding: 14px 32px; background-color: #f59e0b; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">${t.button}</a>
                  </td>
                </tr>
              </table>

              <!-- Help Section -->
              <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 8px; font-size: 15px; color: #6b7280; font-weight: 600;">${c.notSure}</p>
                <p style="margin: 0; font-size: 15px; color: #6b7280;">${c.contactUs}</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280; text-align: center;">${c.footer}</p>
              <p style="margin: 0; font-size: 14px; color: #1f2937; font-weight: 600; text-align: center;">${c.team}</p>
              
              <div style="margin-top: 24px; text-align: center; font-size: 13px; color: #9ca3af;">
                <p style="margin: 0;">DuoProServices</p>
                <p style="margin: 4px 0 0;">📧 [email@duoproservices.com] | 📞 [phone]</p>
                <p style="margin: 12px 0 0; font-size: 12px;">${c.unsubscribe}</p>
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