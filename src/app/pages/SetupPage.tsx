import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Check, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react';
import { ADMIN_EMAILS } from '@/app/config/admins';
import { supabase } from '@/app/utils/supabaseClient';
import { toast } from 'sonner';

interface AdminAccount {
  email: string;
  password: string;
  name: string;
  created: boolean;
  loading: boolean;
  error: string | null;
}

export default function SetupPage() {
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState(false);
  const [accounts, setAccounts] = useState<AdminAccount[]>(
    ADMIN_EMAILS.map(email => ({
      email,
      password: '',
      name: email.split('@')[0],
      created: false,
      loading: false,
      error: null
    }))
  );

  const updateAccount = (index: number, updates: Partial<AdminAccount>) => {
    setAccounts(prev => prev.map((acc, i) => 
      i === index ? { ...acc, ...updates } : acc
    ));
  };

  const createAccount = async (index: number) => {
    const account = accounts[index];
    
    if (!account.password || account.password.length < 6) {
      updateAccount(index, { 
        error: 'Password must be at least 6 characters' 
      });
      return;
    }

    updateAccount(index, { loading: true, error: null });

    try {
      // 🔥 Use server endpoint to create user with email_confirm: true
      const serverUrl = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-c2a25be0/auth/signup`;
      
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          email: account.email,
          password: account.password,
          name: account.name
        })
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to create account');
      }

      updateAccount(index, { 
        created: true, 
        loading: false,
        error: null 
      });

      toast.success(`✅ Admin account created: ${account.email}`);
    } catch (error: any) {
      console.error('Error creating account:', error);
      
      let errorMessage = error.message;
      
      // Handle specific errors
      if (errorMessage.includes('already registered')) {
        errorMessage = 'This email is already registered';
        updateAccount(index, { created: true }); // Mark as created if already exists
      }
      
      updateAccount(index, { 
        loading: false,
        error: errorMessage 
      });
      
      toast.error(`❌ ${errorMessage}`);
    }
  };

  const createAllAccounts = async () => {
    for (let i = 0; i < accounts.length; i++) {
      if (!accounts[i].created && accounts[i].password) {
        await createAccount(i);
        // Small delay between creations
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  const allAccountsCreated = accounts.every(acc => acc.created);
  const someAccountsReady = accounts.some(acc => acc.password && !acc.created);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 Initial Admin Setup
          </h1>
          <p className="text-lg text-gray-600">
            Create admin accounts to get started with DuoPro Services
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">
                📋 Setup Instructions
              </h2>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Enter a secure password for each admin account (minimum 6 characters)</li>
                <li>Click "Create Account" for each admin, or "Create All Accounts" to create them all at once</li>
                <li>Once all accounts are created, proceed to login</li>
              </ol>
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Important:</strong> These passwords are only used for initial setup. 
                  Users can change their passwords later from their account settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Accounts */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              👥 Admin Accounts
            </h2>
            <button
              onClick={() => setShowPasswords(!showPasswords)}
              className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {showPasswords ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Hide Passwords
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Show Passwords
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            {accounts.map((account, index) => (
              <div
                key={account.email}
                className={`p-4 rounded-lg border-2 transition-all ${
                  account.created
                    ? 'bg-green-50 border-green-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {account.loading ? (
                      <Loader className="w-6 h-6 text-blue-600 animate-spin" />
                    ) : account.created ? (
                      <Check className="w-6 h-6 text-green-600" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                    )}
                  </div>

                  {/* Form */}
                  <div className="flex-1 space-y-3">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={account.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 font-mono text-sm"
                      />
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={account.name}
                        onChange={(e) => updateAccount(index, { name: e.target.value })}
                        disabled={account.created || account.loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        value={account.password}
                        onChange={(e) => updateAccount(index, { password: e.target.value, error: null })}
                        disabled={account.created || account.loading}
                        placeholder="Enter secure password (min. 6 characters)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>

                    {/* Error Message */}
                    {account.error && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{account.error}</p>
                      </div>
                    )}

                    {/* Success Message */}
                    {account.created && (
                      <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-800">Account created successfully!</p>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {!account.created && (
                      <button
                        onClick={() => createAccount(index)}
                        disabled={account.loading || !account.password}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {account.loading ? 'Creating...' : 'Create'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!allAccountsCreated && someAccountsReady && (
            <button
              onClick={createAllAccounts}
              disabled={accounts.some(acc => acc.loading)}
              className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              🚀 Create All Accounts
            </button>
          )}

          {allAccountsCreated && (
            <button
              onClick={() => navigate('/login')}
              className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
            >
              ✅ Go to Login
            </button>
          )}

          <button
            onClick={() => navigate('/login')}
            className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Skip / I Already Have an Account
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Already have an account? <button onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-700 font-medium underline">Go to Login</button>
          </p>
          <p className="mt-2">
            Need help? <button onClick={() => navigate('/auth-debug')} className="text-gray-500 hover:text-gray-700 underline">Open Debug Panel</button>
          </p>
        </div>
      </div>
    </div>
  );
}
