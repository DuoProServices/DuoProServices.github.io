/**
 * WELCOME EMAIL TEMPLATE
 * Sent after user creates account
 */

export interface WelcomeEmailData {
  name: string;
  email: string;
  language: 'en' | 'fr';
}

export function generateWelcomeEmail(data: WelcomeEmailData): string {
  const { name, language } = data;

  const content = {
    en: {
      subject: 'Welcome to DuoProServices - Your Tax Return Journey Starts Here',
      greeting: `Hi ${name},`,
      title: 'Welcome to DuoProServices!',
      paragraph1: 'Thank you for choosing DuoProServices for your tax return needs. We\'re here to make your tax filing experience simple, stress-free, and efficient.',
      paragraph2: 'Our platform is designed to guide you through every step of the process. You can upload your documents, track your return progress, and communicate with our team all in one place.',
      nextStepsTitle: 'Next Steps:',
      step1: '<strong>Complete Your Profile</strong> - Add your personal information',
      step2: '<strong>Upload Documents</strong> - Submit your tax documents securely',
      step3: '<strong>Submit for Processing</strong> - We\'ll take it from there',
      needHelp: 'Need help getting started?',
      contactUs: 'Feel free to contact us anytime. We\'re here to help!',
      loginButton: 'Access Your Dashboard',
      footer: 'Thank you for trusting DuoProServices with your tax needs.',
      team: 'The DuoProServices Team',
    },
    fr: {
      subject: 'Bienvenue chez DuoProServices - Votre Parcours Fiscal Commence Ici',
      greeting: `Bonjour ${name},`,
      title: 'Bienvenue chez DuoProServices!',
      paragraph1: 'Merci d\'avoir choisi DuoProServices pour vos besoins fiscaux. Nous sommes là pour rendre votre expérience de déclaration simple, sans stress et efficace.',
      paragraph2: 'Notre plateforme est conçue pour vous guider à travers chaque étape du processus. Vous pouvez télécharger vos documents, suivre l\'avancement de votre déclaration et communiquer avec notre équipe, le tout en un seul endroit.',
      nextStepsTitle: 'Prochaines Étapes:',
      step1: '<strong>Complétez Votre Profil</strong> - Ajoutez vos informations personnelles',
      step2: '<strong>Téléchargez les Documents</strong> - Soumettez vos documents fiscaux en toute sécurité',
      step3: '<strong>Soumettez pour Traitement</strong> - Nous nous occupons du reste',
      needHelp: 'Besoin d\'aide pour commencer?',
      contactUs: 'N\'hésitez pas à nous contacter à tout moment. Nous sommes là pour vous aider!',
      loginButton: 'Accéder à Votre Tableau de Bord',
      footer: 'Merci de faire confiance à DuoProServices pour vos besoins fiscaux.',
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
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 3px solid #3b82f6;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #1f2937;">DuoProServices</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #6b7280;">Professional Tax Services</p>
            </td>
          </tr>

          <!-- Welcome Icon -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <div style="width: 80px; height: 80px; margin: 0 auto; background-color: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">👋</span>
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

              <!-- Next Steps Box -->
              <div style="background-color: #f9fafb; border-left: 4px solid #3b82f6; padding: 20px; margin: 24px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #1f2937;">${t.nextStepsTitle}</h3>
                <ol style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 28px;">
                  <li>${t.step1}</li>
                  <li>${t.step2}</li>
                  <li>${t.step3}</li>
                </ol>
              </div>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                <tr>
                  <td style="text-align: center;">
                    <a href="${Deno.env.get('APP_URL') || 'https://your-app-url.com'}/login" style="display: inline-block; padding: 14px 32px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">${t.loginButton}</a>
                  </td>
                </tr>
              </table>

              <!-- Help Section -->
              <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 8px; font-size: 15px; color: #6b7280; font-weight: 600;">${t.needHelp}</p>
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
