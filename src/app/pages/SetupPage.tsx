import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2, User, Mail, Lock, Shield } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'sonner';

export default function SetupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'creating' | 'success'>('form');
  
  const [formData, setFormData] = useState({
    name: 'Veronica Prass',
    email: 'veronica@duoproservices.ca',
    password: 'Admin123!',
  });

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStep('creating');

    try {
      console.log('🚀 [Setup] Creating admin account...');

      // 1. Signup with Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      });

      if (signUpError) {
        console.error('❌ [Setup] Signup error:', signUpError);
        
        // Check if user already exists
        if (signUpError.message.includes('already registered')) {
          toast.error('⚠️ This email is already registered. Try logging in instead.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        
        throw signUpError;
      }

      console.log('✅ [Setup] Account created:', signUpData);

      // 2. Check if session was created (auto-confirm check)
      if (signUpData.session) {
        console.log('✅ [Setup] User auto-confirmed with active session');
        setStep('success');
        toast.success('✅ Admin account created successfully!');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        console.log('⚠️ [Setup] Email confirmation may be required');
        toast.warning('⚠️ Account created. Check your email for confirmation link (if email is configured).');
        setStep('success');
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }

    } catch (error: any) {
      console.error('❌ [Setup] Error:', error);
      toast.error(`Failed to create account: ${error.message}`);
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Initial Setup - DuoPro Services</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Initial Setup</h1>
            <p className="text-gray-600">Create your admin account to get started</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            {step === 'form' && (
              <form onSubmit={handleCreateAdmin} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    required
                    minLength={8}
                  />
                  <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Important:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>This will create your admin account</li>
                        <li>You can change these details later</li>
                        <li>Make sure to remember your password</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Create Admin Account
                    </>
                  )}
                </button>

                {/* Already have account */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </form>
            )}

            {step === 'creating' && (
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating your account...</h3>
                <p className="text-sm text-gray-600">This will only take a moment</p>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Account created successfully!</h3>
                <p className="text-sm text-gray-600 mb-4">Redirecting to login page...</p>
                <div className="inline-block">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                </div>
              </div>
            )}
          </div>

          {/* Help Text */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Need help? Contact support at{' '}
            <a href="mailto:support@duoproservices.ca" className="text-blue-600 hover:underline">
              support@duoproservices.ca
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
