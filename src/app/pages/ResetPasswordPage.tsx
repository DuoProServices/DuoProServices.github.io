<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { KeyRound, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const { t, language } = useLanguage();
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (newPassword.length < 6) {
      setError(language === 'en'
        ? '❌ Password must be at least 6 characters long.'
        : '❌ Le mot de passe doit contenir au moins 6 caractères.'
      );
      setIsLoading(false);
=======
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Lock, Eye, EyeOff } from "lucide-react";

export function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
      return;
    }

    if (newPassword !== confirmPassword) {
<<<<<<< HEAD
      setError(language === 'en'
        ? '❌ Passwords do not match. Please try again.'
        : '❌ Les mots de passe ne correspondent pas. Veuillez réessayer.'
      );
      setIsLoading(false);
      return;
    }

    try {
      await updatePassword(newPassword);
      
      setSuccess(true);
      toast.success(language === 'en'
        ? '✅ Password updated successfully!'
        : '✅ Mot de passe mis à jour avec succès!'
      );

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Update password error:', err);
      
      let errorMessage = err.message || 'Failed to update password';
      
      if (errorMessage.includes('Auth session missing')) {
        errorMessage = language === 'en'
          ? '❌ Reset link expired. Please request a new one.'
          : '❌ Lien de réinitialisation expiré. Veuillez en demander un nouveau.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Helmet>
          <title>Password Reset - DuoPro Services</title>
        </Helmet>

        <div className="min-h-screen bg-gray-50">
          <Header />
          
          <div className="container mx-auto px-4 pt-24 pb-20">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">
                    {language === 'en' ? 'Password Updated!' : 'Mot de passe mis à jour!'}
                  </h1>
                  <p className="text-gray-600 mb-6">
                    {language === 'en'
                      ? 'Your password has been successfully updated. Redirecting to login...'
                      : 'Votre mot de passe a été mis à jour avec succès. Redirection vers la connexion...'
                    }
                  </p>
                  <div className="flex justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reset Password - DuoPro Services</title>
        <meta name="description" content="Reset your DuoPro Services account password" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="container mx-auto px-4 pt-24 pb-20">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <KeyRound className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold mb-2">
                  {language === 'en' ? 'Set New Password' : 'Définir un nouveau mot de passe'}
                </h1>
                <p className="text-gray-600">
                  {language === 'en'
                    ? 'Enter your new password below'
                    : 'Entrez votre nouveau mot de passe ci-dessous'
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'New Password' : 'Nouveau mot de passe'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {language === 'en' ? 'Minimum 6 characters' : 'Minimum 6 caractères'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Confirm Password' : 'Confirmer le mot de passe'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="••••••••"
                      required
                      minLength={6}
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
                    : (language === 'en' ? 'Update Password' : 'Mettre à jour le mot de passe')
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
=======
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await updatePassword(newPassword);
      // Redirect to dashboard after successful password reset
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Update password error:", err);
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl mb-2">{t("resetPassword.title")}</h1>
          <p className="text-gray-600">{t("resetPassword.subtitle")}</p>
        </div>

        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="newPassword">{t("resetPassword.newPassword")}</Label>
            <div className="relative mt-1">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {t("resetPassword.passwordHint")}
            </p>
          </div>

          <div>
            <Label htmlFor="confirmPassword">{t("resetPassword.confirmPassword")}</Label>
            <div className="relative mt-1">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("clientPortal.uploading") : t("resetPassword.updateButton")}
          </Button>
        </form>
      </Card>
    </div>
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
  );
}
