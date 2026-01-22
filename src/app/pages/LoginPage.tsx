<<<<<<< HEAD
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LogIn, Mail, Lock, UserPlus, KeyRound, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { toast } from 'sonner';

export default function LoginPage() {
  const { t, language } = useLanguage();
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [showSetupHint, setShowSetupHint] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signIn(email, password);
      
      // Check if admin
      if (email === 'admin@duoproservices.ca') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      
      toast.success(language === 'en' 
        ? '✅ Welcome back!' 
        : '✅ Bienvenue!'
      );
    } catch (err: any) {
      console.error('Login error:', err);
      
      let errorMessage = err.message || 'Failed to sign in';
      
      // User-friendly error messages
      if (errorMessage.includes('Invalid login credentials') || 
          errorMessage.includes('Invalid email or password')) {
        errorMessage = language === 'en'
          ? '❌ Invalid email or password.'
          : '❌ Email ou mot de passe invalide.';
        setShowSetupHint(true); // Show setup hint
      } else if (errorMessage.includes('Email not confirmed')) {
        errorMessage = language === 'en'
          ? '❌ Please confirm your email before logging in.'
          : '❌ Veuillez confirmer votre email avant de vous connecter.';
      } else if (errorMessage.includes('Failed to fetch')) {
        errorMessage = language === 'en'
          ? '❌ Cannot connect to server. Please check your internet connection.'
          : '❌ Impossible de se connecter au serveur. Veuillez vérifier votre connexion Internet.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await resetPassword(email);
      
      toast.success(language === 'en' 
        ? '✅ Password reset link sent to your email!'
        : '✅ Lien de réinitialisation envoyé à votre email!'
      );
      
      setShowForgotPassword(false);
      setEmail('');
    } catch (err: any) {
      console.error('Reset password error:', err);
      
      let errorMessage = err.message || 'Failed to send reset email';
      
      if (errorMessage.includes('User not found')) {
        errorMessage = language === 'en'
          ? '❌ No account found with this email address.'
          : '❌ Aucun compte trouvé avec cette adresse email.';
=======
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { SEO } from "../components/SEO";

export function LoginPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting login with:", email);
      await signIn(email, password);
      console.log("Login successful, navigating to dashboard");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error details:", err);
      let errorMessage = err.message || "Failed to sign in. Please check your credentials.";
      
      // Make the error message more user-friendly
      if (errorMessage.includes("Invalid login credentials") || errorMessage.includes("Invalid")) {
        errorMessage = language === "fr" 
          ? "❌ Email ou mot de passe incorrect. Pas encore de compte? Cliquez sur 'Créer un compte' ci-dessous."
          : "❌ Email or password incorrect. Don't have an account yet? Click 'Sign Up Now' below to create one.";
      } else if (errorMessage.includes("Email not confirmed")) {
        errorMessage = language === "fr"
          ? "📧 Veuillez confirmer votre adresse email avant de vous connecter. Vérifiez votre boîte de réception."
          : "📧 Please confirm your email address before logging in. Check your inbox for the confirmation link.";
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
      }
      
      setError(errorMessage);
    } finally {
<<<<<<< HEAD
      setIsLoading(false);
=======
      setLoading(false);
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
    }
  };

  return (
<<<<<<< HEAD
    <>
      <Helmet>
        <title>Login - DuoPro Services</title>
        <meta name="description" content="Login to your DuoPro Services client portal" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="container mx-auto px-4 pt-24 pb-20">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  {showForgotPassword ? (
                    <KeyRound className="w-8 h-8 text-blue-600" />
                  ) : (
                    <LogIn className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <h1 className="text-2xl font-bold mb-2">
                  {showForgotPassword 
                    ? (language === 'en' ? 'Reset Password' : 'Réinitialiser le mot de passe')
                    : t('nav.login')
                  }
                </h1>
                <p className="text-gray-600">
                  {showForgotPassword
                    ? (language === 'en' 
                      ? 'Enter your email to receive a reset link'
                      : 'Entrez votre email pour recevoir un lien de réinitialisation')
                    : (language === 'en' ? 'Access your client portal' : 'Accédez à votre portail client')
                  }
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {showForgotPassword ? (
                // FORGOT PASSWORD FORM
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading 
                      ? t('common.loading') 
                      : (language === 'en' ? 'Send Reset Link' : 'Envoyer le lien')
                    }
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setError('');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {language === 'en' ? '← Back to Login' : '← Retour à la connexion'}
                    </button>
                  </div>
                </form>
              ) : (
                // LOGIN FORM
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setError('');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {language === 'en' ? 'Forgot password?' : 'Mot de passe oublié?'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? t('common.loading') : t('nav.login')}
                  </button>

                  {/* Sign Up Link */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        {language === 'en' ? 'or' : 'ou'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-blue-600 transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    {language === 'en' ? 'New here? Create Account' : 'Nouveau? Créer un compte'}
                  </button>

                  {/* Setup Hint - Only show when credentials are invalid */}
                  {showSetupHint && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-amber-900 mb-1">
                            {language === 'en' ? '🔧 First time setup?' : '🔧 Première configuration?'}
                          </h4>
                          <p className="text-xs text-amber-800 mb-3">
                            {language === 'en' 
                              ? 'No account exists yet. Create your admin account to get started!' 
                              : 'Aucun compte n\'existe encore. Créez votre compte admin pour commencer!'}
                          </p>
                          <button
                            type="button"
                            onClick={() => navigate('/setup')}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors"
                          >
                            {language === 'en' ? '🚀 Go to Setup Page' : '🚀 Aller à la page de configuration'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
=======
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <SEO 
        title={`Login - DuoPro Services | Canadian Tax Specialist`}
        description="Access your tax filing portal. Secure login for DuoPro Services clients."
        canonicalPath="/login"
        lang={language}
      />
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("clientPortal.login")}</h1>
          <p className="text-gray-600">{t("clientPortal.subtitle")}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t("clientPortal.email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {t("clientPortal.password")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link 
                to="/forgot-password" 
                className="text-blue-600 hover:text-blue-700 hover:underline"
              >
                {t("clientPortal.forgotPassword")}
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : t("clientPortal.signIn")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t("clientPortal.noAccount")}{" "}
            <Link 
              to="/signup" 
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              {t("clientPortal.signUpNow")}
            </Link>
          </p>
        </div>

        {/* First time user help */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>🆕 {language === "fr" ? "Première visite?" : "First time here?"}</strong><br />
            {language === "fr" 
              ? "Créez un compte en cliquant sur 'Créer un compte' ci-dessus. Ça ne prend qu'une minute!"
              : "Create a new account by clicking 'Sign Up Now' above. It only takes a minute!"}
          </p>
        </div>

        {/* Demo credentials for testing */}
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xs text-green-800">
            <strong>🧪 {language === "fr" ? "Compte de test" : "Demo Account"}</strong><br />
            {language === "fr" ? "Email" : "Email"}: demo@canadiantaxpro.ca<br />
            {language === "fr" ? "Mot de passe" : "Password"}: Demo123!<br />
            <span className="text-green-600 italic">
              {language === "fr" 
                ? "Utilisez ces identifiants pour tester le système"
                : "Use these credentials to test the system"}
            </span>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link 
            to="/" 
            className="block text-center text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
  );
}