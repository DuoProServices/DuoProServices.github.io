import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Mail, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

export default function EmailConfirmationRequired() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "📧 Email Confirmation Required",
      subtitle: "We've sent you a confirmation email",
      message: "Your account has been created successfully! To complete the registration, please check your email inbox and click the confirmation link.",
      steps: [
        "Check your email inbox (including spam/junk folder)",
        "Open the email from DuoPro Services",
        "Click the confirmation link",
        "You'll be redirected back to login"
      ],
      noEmail: "Didn't receive the email?",
      adminNote: "⚠️ Note for Admin",
      adminInstructions: [
        "To disable email confirmation and allow instant signup:",
        "1. Go to Supabase Dashboard (supabase.com)",
        "2. Select your project",
        "3. Go to Authentication → Providers → Email",
        "4. Uncheck 'Confirm email'",
        "5. Click Save"
      ],
      backToLogin: "Back to Login",
      contactSupport: "Contact Support"
    },
    fr: {
      title: "📧 Confirmation d'email requise",
      subtitle: "Nous vous avons envoyé un email de confirmation",
      message: "Votre compte a été créé avec succès! Pour compléter l'inscription, veuillez vérifier votre boîte email et cliquer sur le lien de confirmation.",
      steps: [
        "Vérifiez votre boîte email (y compris spam/courrier indésirable)",
        "Ouvrez l'email de DuoPro Services",
        "Cliquez sur le lien de confirmation",
        "Vous serez redirigé vers la page de connexion"
      ],
      noEmail: "Vous n'avez pas reçu l'email?",
      adminNote: "⚠️ Note pour l'administrateur",
      adminInstructions: [
        "Pour désactiver la confirmation d'email et permettre l'inscription instantanée:",
        "1. Allez sur Supabase Dashboard (supabase.com)",
        "2. Sélectionnez votre projet",
        "3. Allez dans Authentication → Providers → Email",
        "4. Décochez 'Confirm email'",
        "5. Cliquez sur Enregistrer"
      ],
      backToLogin: "Retour à la connexion",
      contactSupport: "Contacter le support"
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Main Card */}
        <Card className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>

          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-800">
              {t.message}
            </AlertDescription>
          </Alert>

          {/* Steps */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              {language === 'en' ? 'Next Steps:' : 'Prochaines étapes:'}
            </h3>
            {t.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <p className="text-gray-700 pt-0.5">{step}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link to="/login">
                {t.backToLogin}
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/">
                {t.contactSupport}
              </Link>
            </Button>
          </div>
        </Card>

        {/* Admin Instructions */}
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-yellow-900 mb-2">{t.adminNote}</h3>
              <div className="space-y-2 text-sm text-yellow-800">
                {t.adminInstructions.map((instruction, index) => (
                  <div key={index}>
                    {instruction}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Alert className="mt-4 bg-green-50 border-green-200">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="ml-2 text-green-800 text-sm">
              {language === 'en' 
                ? 'After disabling email confirmation, new users will be able to sign up and login immediately without waiting for email confirmation.'
                : 'Après avoir désactivé la confirmation d\'email, les nouveaux utilisateurs pourront s\'inscrire et se connecter immédiatement sans attendre la confirmation par email.'
              }
            </AlertDescription>
          </Alert>
        </Card>

        {/* Help Card */}
        <Card className="p-6 bg-purple-50 border-purple-200">
          <h3 className="font-bold text-purple-900 mb-3">
            {language === 'en' ? '💡 For Development/Testing' : '💡 Pour le développement/test'}
          </h3>
          <p className="text-sm text-purple-800 mb-3">
            {language === 'en'
              ? 'If you\'re testing the system and don\'t want to deal with email confirmations:'
              : 'Si vous testez le système et ne voulez pas gérer les confirmations d\'email:'
            }
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-purple-800">
            <li>
              {language === 'en'
                ? 'Go to your Supabase project dashboard'
                : 'Allez sur le tableau de bord de votre projet Supabase'
              }
            </li>
            <li>
              {language === 'en'
                ? 'Navigate to Authentication → Email Templates'
                : 'Naviguez vers Authentication → Email Templates'
              }
            </li>
            <li>
              {language === 'en'
                ? 'Or simply disable email confirmation in Providers settings'
                : 'Ou désactivez simplement la confirmation d\'email dans les paramètres Providers'
              }
            </li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
